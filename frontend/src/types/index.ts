export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  product_count: number;
}

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  color_hex: string;
  sku: string;
  stock: number;
  price_adjustment: number;
  final_price: number;
  in_stock: boolean;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

export interface Review {
  id: number;
  rating: number;
  title: string;
  body: string;
  user_name: string;
  user_email: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_price?: number;
  discount_percentage: number;
  primary_image?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  reviews?: Review[];
  category?: Category;
  category_name?: string;
  is_featured: boolean;
  tags: string;
  avg_rating?: number;
  review_count?: number;
  colors?: { color: string; color_hex: string }[];
  sizes?: string[];
}

export interface CartItem {
  id: number;
  variant: ProductVariant;
  quantity: number;
  subtotal: number;
  product_name: string;
  product_slug: string;
  product_image?: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  item_count: number;
}

export interface OrderItem {
  id: number;
  product_name: string;
  variant_sku: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  shipping_name: string;
  shipping_address1: string;
  shipping_address2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  notes?: string;
  tracking_number?: string;
  items: OrderItem[];
  created_at: string;
}

export interface Address {
  id: number;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
