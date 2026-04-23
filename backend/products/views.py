from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Avg, Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Review
from .serializers import (
    CategorySerializer, ProductListSerializer,
    ProductDetailSerializer, ReviewSerializer
)
from .filters import ProductFilter


class CategoryListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.annotate(product_count=Count('products'))


class ProductListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductListSerializer
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'tags']
    ordering_fields = ['price', 'created_at', 'avg_rating']
    ordering = ['-created_at']

    def get_queryset(self):
        return Product.objects.filter(is_active=True).annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        ).prefetch_related('images', 'variants')


class ProductDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Product.objects.filter(is_active=True).annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        ).prefetch_related('images', 'variants', 'reviews__user', 'category')


class FeaturedProductsView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_featured=True).annotate(
            avg_rating=Avg('reviews__rating'),
            review_count=Count('reviews')
        ).prefetch_related('images', 'variants')[:8]


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        product_slug = self.kwargs['slug']
        product = Product.objects.get(slug=product_slug)
        serializer.save(user=self.request.user, product=product)
