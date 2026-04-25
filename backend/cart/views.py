from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import ProductVariant


def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        session_key = request.session.session_key or request.session.create()
        cart, _ = Cart.objects.get_or_create(session_key=session_key)
    return cart


class CartView(APIView):
    def get_permissions(self):
        return []

    def get(self, request):
        cart = get_or_create_cart(request)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        """Add item to cart"""
        cart = get_or_create_cart(request)
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))

        variant = get_object_or_404(ProductVariant, id=variant_id)

        if variant.stock < quantity:
            return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)

        item, created = CartItem.objects.get_or_create(cart=cart, variant=variant)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CartItemView(APIView):
    def get_permissions(self):
        return []

    def patch(self, request, item_id):
        """Update cart item quantity"""
        cart = get_or_create_cart(request)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        quantity = int(request.data.get('quantity', 1))

        if quantity <= 0:
            item.delete()
        else:
            if item.variant.stock < quantity:
                return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)
            item.quantity = quantity
            item.save()

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, item_id):
        """Remove item from cart"""
        cart = get_or_create_cart(request)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()

        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)


class ClearCartView(APIView):
    def get_permissions(self):
        return []

    def delete(self, request):
        cart = get_or_create_cart(request)
        cart.items.all().delete()
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
