from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderListView.as_view(), name='order-list'),
    path('checkout/', views.CheckoutView.as_view(), name='checkout'),
    path('confirm-payment/', views.ConfirmPaymentView.as_view(), name='confirm-payment'),
    path('<int:pk>/', views.OrderDetailView.as_view(), name='order-detail'),
]
