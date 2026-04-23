from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.db import transaction
import stripe

from .models import Order, OrderItem
from .serializers import OrderSerializer, CheckoutSerializer
from cart.models import Cart

stripe.api_key = settings.STRIPE_SECRET_KEY

TAX_RATE = 0.08
SHIPPING_COST = 5.99
FREE_SHIPPING_THRESHOLD = 75.00


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        cart_items = cart.items.select_related('variant__product').all()
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate stock
        for item in cart_items:
            if item.variant.stock < item.quantity:
                return Response(
                    {'error': f'Insufficient stock for {item.variant.product.name} ({item.variant.size}/{item.variant.color})'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        subtotal = float(cart.total)
        shipping = 0 if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_COST
        tax = round(subtotal * TAX_RATE, 2)
        total = round(subtotal + shipping + tax, 2)

        # Create Stripe Payment Intent
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(total * 100),
                currency='usd',
                metadata={'user_id': request.user.id}
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Create order
        data = serializer.validated_data
        order = Order.objects.create(
            user=request.user,
            stripe_payment_intent=intent.id,
            subtotal=subtotal,
            shipping_cost=shipping,
            tax=tax,
            total=total,
            **data
        )

        # Create order items & deduct stock
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                variant=item.variant,
                product_name=item.variant.product.name,
                variant_sku=item.variant.sku,
                size=item.variant.size,
                color=item.variant.color,
                quantity=item.quantity,
                unit_price=item.variant.final_price,
                subtotal=item.subtotal
            )
            item.variant.stock -= item.quantity
            item.variant.save()

        # Clear cart
        cart.items.all().delete()

        return Response({
            'order': OrderSerializer(order).data,
            'client_secret': intent.client_secret
        }, status=status.HTTP_201_CREATED)


class ConfirmPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payment_intent_id = request.data.get('payment_intent_id')
        try:
            order = Order.objects.get(stripe_payment_intent=payment_intent_id, user=request.user)
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            if intent.status == 'succeeded':
                order.payment_status = 'paid'
                order.status = 'confirmed'
                order.save()
                return Response({'status': 'success', 'order': OrderSerializer(order).data})
            return Response({'status': intent.status})
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
