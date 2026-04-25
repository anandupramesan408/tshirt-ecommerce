from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'variant_sku', 'size', 'color', 'quantity', 'unit_price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'payment_status',
            'shipping_name', 'shipping_address1', 'shipping_address2',
            'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country',
            'subtotal', 'shipping_cost', 'tax', 'total',
            'notes', 'tracking_number', 'items', 'created_at'
        ]
        read_only_fields = ['id', 'order_number', 'created_at']


class CheckoutSerializer(serializers.Serializer):
    shipping_name = serializers.CharField(max_length=200)
    shipping_address1 = serializers.CharField(max_length=255)
    shipping_address2 = serializers.CharField(max_length=255, required=False, allow_blank=True)
    shipping_city = serializers.CharField(max_length=100)
    shipping_state = serializers.CharField(max_length=100)
    shipping_postal_code = serializers.CharField(max_length=20)
    shipping_country = serializers.CharField(max_length=100)
    notes = serializers.CharField(required=False, allow_blank=True)
