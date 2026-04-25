from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_name', 'variant_sku', 'size', 'color', 'quantity', 'unit_price', 'subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'payment_status', 'total', 'created_at']
    list_filter = ['status', 'payment_status']
    search_fields = ['order_number', 'user__email', 'shipping_name']
    readonly_fields = ['order_number', 'stripe_payment_intent', 'created_at']
    inlines = [OrderItemInline]
