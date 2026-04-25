from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant, Review


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'product_count']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProductVariantSerializer(serializers.ModelSerializer):
    final_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'color_hex', 'sku', 'stock', 'price_adjustment', 'final_price', 'in_stock']


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'rating', 'title', 'body', 'user_name', 'user_email', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    colors = serializers.SerializerMethodField()
    sizes = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'price', 'compare_price', 'discount_percentage',
            'primary_image', 'category_name', 'is_featured', 'avg_rating',
            'review_count', 'colors', 'sizes'
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if img:
            request = self.context.get('request')
            return request.build_absolute_uri(img.image.url) if request else img.image.url
        return None

    def get_colors(self, obj):
        return list(obj.variants.values('color', 'color_hex').distinct())

    def get_sizes(self, obj):
        return list(obj.variants.values_list('size', flat=True).distinct())


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'compare_price',
            'discount_percentage', 'category', 'images', 'variants', 'reviews',
            'is_featured', 'tags', 'avg_rating', 'review_count', 'created_at'
        ]
