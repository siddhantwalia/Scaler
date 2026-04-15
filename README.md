# Flipkart Clone - SDE Intern Fullstack Assignment

A fully functional, high-fidelity e-commerce web application that closely replicates Flipkart's design and user experience. Built using modern web technologies, this project satisfies all core and bonus requirements of the SDE Intern Fullstack Assignment.

##  Live Links

- **Frontend**: [https://scaler-dusky.vercel.app/](https://scaler-dusky.vercel.app/)
- **Backend API**: [https://scaler-1fjg.onrender.com/](https://scaler-1fjg.onrender.com/)


##  Tech Stack

- **Frontend**: React.js, Tailwind CSS, TypeScript, React Router, React Query
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: PostgreSQL (Deployed via Render) / SQLite (Local Development)
- **Deployment**: Render (Backend & PostgreSQL Database), Vercel (Frontend)

---

##  Features Implemented

### Core Features (Must Have) - **COMPLETED**
- **Product Listing Page**: High-density grid layout matching Flipkart's design, filtering by category, search functionality, and highly accurate product cards.
- **Product Detail Page**: Image gallery/thumbnails, rich descriptions, **Icon-based Highlights Specifications**, detailed **Technical Specifications Table**, price & discount sections, and action buttons.
- **Shopping Cart**: View items, update quantity (+/-), remove items, and view a detailed price breakdown matching Flipkart's UX.
- **Order Placement**: Checkout flow, shipping address form, order summary, and real-time **Order Status Lifecycle** simulation.
- **Database Design**: Fully relational SQLAlchemy schema covering Products, Images, Users, Cart, Wishlist, and Orders, including **Dynamic JSON fields** for technical specs.

### Bonus Features (Good to Have) - **COMPLETED**
- **Responsive Design**: Tailored experiences for Mobile, Tablet, and Desktop using Tailwind breakpoints.
- **Wishlist Functionality**: Users can heart items from the product grid or detail page, and "Save for later" directly from the cart.
- **Order History**: A dedicated `/orders` page to view past purchases.

*(Note: User Authentication is modeled via a default session user id as per the requirement: "Assume a default user is logged in".)*

---

##  Database Design

The schema is heavily normalized to mirror real e-commerce data structures:
1. **Products**: `id`, `name`, `description`, `price`, `original_price`, `discount_percentage`, `category`, `stock`, `rating`, `reviews_count`, `highlights` (JSON List), and `specs` (JSON Object).
2. **ProductImage**: One-to-Many relationship with `Products`, allowing multiple image angles per product. Standardized to 400x400 square crops for layout uniformity.
3. **CartItem**: Maps `user_id` to `product_id` with `quantity`. 
4. **WishlistItem**: Maps `user_id` to favorite `product_id`.
5. **Order**: Tracks `user_id`, `total_amount`, `shipping_address`, `status`, and timestamps. Includes a **Background Task** lifecycle (Processing -> Order Placed).
6. **OrderItem**: One-to-Many with `Order`, caching the `price` and `quantity` at the time of purchase to prevent historical pricing bugs.

---

##  Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-link>
cd Scaler
```

### 2. Backend Setup
The backend is built with FastAPI and runs on port 8000.

**Method A: Using Docker (Recommended)**
```bash
cd backend
docker build -t scaler-backend .
docker run -p 8000:8000 --env-file .env scaler-backend
```

**Method B: Local Virtual Environment**
```bash
cd backend
python -m venv .venv
# Activate venv: `source .venv/bin/activate` (Mac/Linux) or `.venv\Scripts\activate` (Windows)
pip install -r requirements.txt
python Generate_data.py # Seeds the database with high-quality sample data
uvicorn main:app --reload
```

### 3. Frontend Setup
The frontend runs on port 5173 using Vite.

```bash
cd frontend
npm install
npm run dev
```

---

##  Assumptions Made
- **Authentication**: As per the assignment "No Login Required", a `DEFAULT_USER_ID = 1` constant is used across the API to seamlessly persist cart, wishlist, and active orders without forcing a login flow.
- **Content density**: The UI emphasizes showing all relevant specs seamlessly over hiding data, to mimic the exact high-information density of Indian e-commerce sites like Flipkart.