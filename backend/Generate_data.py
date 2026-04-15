from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models.product import Product, ProductImage
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.wishlist import WishlistItem

def seed_db():
    db: Session = SessionLocal()
    db.query(OrderItem).delete()
    db.query(Order).delete()
    db.query(CartItem).delete()
    db.query(WishlistItem).delete()
    db.query(ProductImage).delete()
    db.query(Product).delete()
    
    products = [
    {
        "name": "Samsung Galaxy S24 Ultra 5G (Titanium Black, 256 GB)",
        "description": "6.8 inch AMOLED, Snapdragon 8 Gen 3, 200MP Camera",
        "price": 129999,
        "original_price": 144999,
        "discount_percentage": 10,
        "category": "Mobiles",
        "stock": 20,
        "rating": 4.5,
        "reviews_count": 12453,
        "highlights": ["200MP Camera", "Snapdragon 8 Gen 3"],
        "images": [
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
            "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400"
        ]
    },
    {
        "name": "Apple MacBook Air M3 (16GB RAM)",
        "description": "Lightweight laptop with Apple M3 chip",
        "price": 114990,
        "original_price": 119900,
        "discount_percentage": 4,
        "category": "Electronics",
        "stock": 15,
        "rating": 4.7,
        "reviews_count": 3421,
        "highlights": ["M3 Chip", "18h Battery"],
        "images": [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
        ]
    },
    {
        "name": "Sony WH-1000XM5 Headphones",
        "description": "Industry leading noise cancellation",
        "price": 24990,
        "original_price": 34990,
        "discount_percentage": 29,
        "category": "Electronics",
        "stock": 30,
        "rating": 4.6,
        "reviews_count": 8932,
        "highlights": ["Noise Cancelling", "30h Battery"],
        "images": [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400"
        ]
    },
    {
        "name": "Nike Air Max Running Shoes",
        "description": "Comfortable running shoes",
        "price": 8995,
        "original_price": 14995,
        "discount_percentage": 40,
        "category": "Fashion",
        "stock": 100,
        "rating": 4.3,
        "reviews_count": 5621,
        "highlights": ["Lightweight", "Breathable"],
        "images": [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"
        ]
    },
    {
        "name": "Wooden Study Table",
        "description": "Modern study table with storage",
        "price": 5999,
        "original_price": 12999,
        "discount_percentage": 54,
        "category": "Home & Furniture",
        "stock": 40,
        "rating": 4.1,
        "reviews_count": 2341,
        "highlights": ["Wood Finish", "Compact"],
        "images": [
            "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400",
            "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400"
        ]
    },
    {
        "name": "Samsung Double Door Refrigerator",
        "description": "253L Frost Free Refrigerator",
        "price": 24990,
        "original_price": 30990,
        "discount_percentage": 19,
        "category": "Appliances",
        "stock": 10,
        "rating": 4.4,
        "reviews_count": 7654,
        "highlights": ["Frost Free", "Digital Inverter"],
        "images": [
            "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400"
        ]
    },
    {
        "name": "iPhone 15 Pro Max",
        "description": "A17 Pro chip, titanium design",
        "price": 159900,
        "original_price": 159900,
        "discount_percentage": 0,
        "category": "Mobiles",
        "stock": 25,
        "rating": 4.6,
        "reviews_count": 9821,
        "highlights": ["A17 Pro", "Titanium Build"],
        "images": [
            "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
            "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400"
        ]
    },
    {
        "name": "boAt Airdopes 141 Earbuds",
        "description": "Wireless earbuds with 42h playtime",
        "price": 1099,
        "original_price": 4490,
        "discount_percentage": 76,
        "category": "Electronics",
        "stock": 200,
        "rating": 4.1,
        "reviews_count": 234567,
        "highlights": ["Bluetooth 5.1", "IPX4", "ASAP Charge"],
        "images": [
            "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
            "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400"
        ]
    },
    {
        "name": "Lakme Face Cream",
        "description": "Hydrating daily face cream",
        "price": 299,
        "original_price": 499,
        "discount_percentage": 40,
        "category": "Beauty",
        "stock": 0,
        "rating": 4.2,
        "reviews_count": 3200,
        "highlights": ["Moisturizing", "Daily Use", "SPF 20"],
        "images": [
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
            "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400"
        ]
    },
    {
        "name": "Organic Basmati Rice (5kg)",
        "description": "Premium long grain rice",
        "price": 899,
        "original_price": 1299,
        "discount_percentage": 30,
        "category": "Grocery",
        "stock": 200,
        "rating": 4.3,
        "reviews_count": 5400,
        "highlights": ["Organic", "Premium Quality", "Long Grain"],
        "images": [
            "https://images.unsplash.com/photo-1586201327693-d646ab051fba?w=400"
        ]
    },
    {
        "name": "Atomic Habits by James Clear",
        "description": "Self improvement bestseller",
        "price": 499,
        "original_price": 699,
        "discount_percentage": 28,
        "category": "Books",
        "stock": 80,
        "rating": 4.8,
        "reviews_count": 12000,
        "highlights": ["Bestseller", "Self Help", "Practical Advice"],
        "images": [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"
        ]
    },
    {
        "name": "Decorative LED Lamp",
        "description": "Modern home decor lamp",
        "price": 1499,
        "original_price": 2499,
        "discount_percentage": 40,
        "category": "Home",
        "stock": 60,
        "rating": 4.4,
        "reviews_count": 2100,
        "highlights": ["LED", "Decorative", "Energy Efficient"],
        "images": [
            "https://images.unsplash.com/photo-1507473885765-e6ed657f9971?w=400"
        ]
    },

]
    
    for p_data in products:
        images = p_data.pop("images")

        product = Product(**p_data)
        db.add(product)
        db.flush()
        
        for img_url in images:
            img = ProductImage(product_id=product.id, image_url=img_url)
            db.add(img)
            
    db.commit()
    db.close()
    print("Database seeded successfully with dummy Flipkart products!")

if __name__ == "__main__":
    seed_db()
