# ThreadCo — T-Shirt E-Commerce

Full-stack e-commerce app built with **Next.js 14**, **Django 4.2**, and **MariaDB**.

---

## Project Structure

```
tshirt-ecommerce/
├── backend/          # Django REST API
│   ├── tshirt_store/ # Core settings & URLs
│   ├── users/        # Auth, JWT, addresses
│   ├── products/     # Products, categories, variants, reviews
│   ├── cart/         # Shopping cart
│   └── orders/       # Checkout & order management
├── frontend/         # Next.js 14 App Router
│   └── src/
│       ├── app/      # Pages (home, shop, cart, checkout, orders, auth, profile)
│       ├── components/
│       ├── lib/      # Axios API client
│       ├── store/    # Zustand state (auth + cart)
│       └── types/    # TypeScript types
└── docker-compose.yml
```

---

## Quick Start (Docker — Recommended)

```bash
# 1. Clone / unzip the project
cd tshirt-ecommerce

# 2. Add your Stripe keys (optional for dev)
export STRIPE_SECRET_KEY=sk_test_xxx
export STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# 3. Start everything
docker-compose up --build

# 4. Run migrations (first time only)
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:8000        |
| API Docs | http://localhost:8000/api/docs/ |
| Admin    | http://localhost:8000/admin  |

---

## Manual Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # Fill in your DB credentials
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local     # Set NEXT_PUBLIC_API_URL and Stripe key
npm run dev
```

---

## Environment Variables

### backend/.env
| Key | Description |
|-----|-------------|
| `SECRET_KEY` | Django secret key |
| `DB_NAME` | MariaDB database name |
| `DB_USER` | MariaDB user |
| `DB_PASSWORD` | MariaDB password |
| `DB_HOST` | Database host (default: localhost) |
| `STRIPE_SECRET_KEY` | From stripe.com dashboard |

### frontend/.env.local
| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_API_URL` | Backend URL (default: http://localhost:8000/api) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From stripe.com dashboard |

---

## Features

- **Product catalogue** with categories, color/size variants, image gallery
- **Filtering & search** by category, size, color, price range
- **Shopping cart** (session-based for guests, user-linked after login)
- **JWT authentication** with auto token refresh
- **Checkout** with shipping address form + Stripe payment intent
- **Order tracking** with status progress bar
- **User profile** with saved addresses
- **Django Admin** to manage products, orders, users
- **API docs** via Swagger UI at `/api/docs/`

---

## Adding Products (via Admin)

1. Go to http://localhost:8000/admin
2. Create **Categories** first (e.g. Men's, Women's, Unisex)
3. Create **Products** — add images and variants (size + color + stock)
4. Mark products as `is_featured` to show on the homepage

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand, React Hook Form |
| Backend | Django 4.2, Django REST Framework, SimpleJWT |
| Database | MariaDB 11 |
| Payments | Stripe |
| Auth | JWT (access + refresh tokens) |
| Deployment | Docker + docker-compose |
