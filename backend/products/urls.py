from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProductListView.as_view(), name='product-list'),
    path('featured/', views.FeaturedProductsView.as_view(), name='featured-products'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('<slug:slug>/reviews/', views.ReviewCreateView.as_view(), name='product-review'),
]
