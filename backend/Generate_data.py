from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models.product import Product, ProductImage
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.wishlist import WishlistItem

def seed_db():
    db: Session = SessionLocal()
    
    # Force schema update
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    crops = "?w=400&h=400&fit=crop"
    
    products_data = [
        {
            "name": "Samsung Galaxy S24 Ultra 5G (Titanium Black, 256 GB)",
            "price": 129999,
            "original_price": 144999,
            "discount_percentage": 10,
            "rating": 4.5,
            "reviews_count": 12453,
            "category": "Mobiles",
            "images": ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c" + crops, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" + crops],
            "description": "Experience the ultimate Galaxy with the new Samsung Galaxy S24 Ultra featuring a stunning 6.8-inch display, 200MP camera, and S Pen.",
            "highlights": ["12 GB RAM | 256 GB ROM", "Snapdragon 8 Gen 3 Processor", "200MP + 12MP + 50MP + 10MP Camera", "6.8 inch Quad HD+ Display", "5000 mAh Battery"],
            "specs": { "Display": "6.8 inch AMOLED 120Hz", "Processor": "Snapdragon 8 Gen 3", "RAM": "12 GB LPDDR5X", "Storage": "256 GB UFS 4.0", "Battery": "5000 mAh", "OS": "Android 14" },
            "stock": 50,
        },
        {
            "name": "Apple MacBook Air M3 Chip Laptop (16 GB, 256 GB SSD)",
            "price": 114990,
            "original_price": 119900,
            "discount_percentage": 4,
            "rating": 4.7,
            "reviews_count": 3421,
            "category": "Electronics",
            "images": ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8" + crops, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853" + crops],
            "description": "The remarkably thin MacBook Air with M3 chip delivers exceptional performance and up to 18 hours of battery life.",
            "highlights": ["Apple M3 Chip", "16 GB Unified Memory", "256 GB SSD Storage", "13.6 inch Liquid Retina Display", "Up to 18 Hours Battery Life"],
            "specs": { "Display": "13.6 inch Liquid Retina", "Processor": "Apple M3 (8-core CPU, 10-core GPU)", "RAM": "16 GB", "Storage": "256 GB SSD", "Weight": "1.24 kg" },
            "stock": 50,
        },
        {
            "name": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
            "price": 24990,
            "original_price": 34990,
            "discount_percentage": 29,
            "rating": 4.6,
            "reviews_count": 8932,
            "category": "Electronics",
            "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e" + crops, "https://images.unsplash.com/photo-1484704849700-f032a568e944" + crops],
            "description": "Industry-leading noise cancellation with Auto NC Optimizer. Exceptional sound quality with 30mm drivers.",
            "highlights": ["Industry Leading Active Noise Cancellation", "30 Hours Battery Life", "Speak-to-Chat Technology", "Crystal Clear Hands-Free Calling", "Multi-point Connection"],
            "specs": { "Type": "Over-ear", "Noise Cancellation": "Yes (Auto NC Optimizer)", "Battery Life": "30 hours (ANC ON)", "Bluetooth": "v5.2", "Weight": "250g" },
            "stock": 50,
        },
        {
            "name": "Nike Air Max 270 React Running Shoes For Men",
            "price": 8995,
            "original_price": 14995,
            "discount_percentage": 40,
            "rating": 4.3,
            "reviews_count": 5621,
            "category": "Fashion",
            "images": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff" + crops, "https://images.unsplash.com/photo-1549298916-b41d501d3772" + crops],
            "description": "The Nike Air Max 270 React combines two of Nike's best technologies for an unbelievably soft and comfortable ride.",
            "highlights": ["React Foam Midsole", "Large Air Max Unit", "Breathable Mesh Upper", "Lightweight Design", "Durable Rubber Outsole"],
            "specs": { "Type": "Running Shoes", "Material": "Mesh/Synthetic", "Sole": "Rubber", "Closure": "Lace-Ups" },
            "stock": 50,
        },
        {
            "name": "Wooden Study Table with Drawer - Walnut Finish",
            "price": 5999,
            "original_price": 12999,
            "discount_percentage": 54,
            "rating": 4.1,
            "reviews_count": 2341,
            "category": "Home & Furniture",
            "images": ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd" + crops, "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7" + crops],
            "description": "Elegant wooden study table with spacious drawer, perfect for home office or study room.",
            "highlights": ["Premium Engineered Wood", "Spacious Drawer Storage", "Durable Walnut Finish", "Sturdy & Ergonomic Design", "Easy Self-Assembly"],
            "specs": { "Material": "Engineered Wood", "Dimensions": "120x60x75 cm", "Color": "Walnut", "Weight Capacity": "50 kg" },
            "stock": 50,
        },
        {
            "name": "Samsung 253L Frost Free Double Door Refrigerator",
            "price": 24990,
            "original_price": 30990,
            "discount_percentage": 19,
            "rating": 4.4,
            "reviews_count": 7654,
            "category": "Appliances",
            "images": ["https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5" + crops],
            "description": "Digital inverter technology for energy efficiency. Convertible 5-in-1 modes for flexible storage.",
            "highlights": ["253L Capacity | 3 Star Energy Rating", "Digital Inverter Compressor", "Convertible 5-in-1 Modes", "Frost Free Technology", "Moist Fresh Zone"],
            "specs": { "Capacity": "253 Litres", "Type": "Frost Free", "Energy Rating": "3 Star", "Compressor": "Digital Inverter" },
            "stock": 0,
        },
        {
            "name": "The Psychology of Money - Morgan Housel (Paperback)",
            "price": 299,
            "original_price": 399,
            "discount_percentage": 25,
            "rating": 4.6,
            "reviews_count": 45231,
            "category": "Books",
            "images": ["https://images.unsplash.com/photo-1544947950-fa07a98d237f" + crops],
            "description": "Timeless lessons on wealth, greed, and happiness doing well with money isn't about what you know.",
            "highlights": ["Author: Morgan Housel", "New York Times Bestseller", "Financial Wisdom & Insights", "Easy to Read Paperback", "Self-Help Financial Advice"],
            "specs": { "Author": "Morgan Housel", "Pages": "256", "Language": "English", "Publisher": "Jaico Publishing" },
            "stock": 50,
        },
        {
            "name": "LEGO McLaren Formula 1 Race Car (484 Pieces)",
            "price": 1999,
            "original_price": 2999,
            "discount_percentage": 33,
            "rating": 4.8,
            "reviews_count": 3210,
            "category": "Toys",
            "images": ["https://images.unsplash.com/photo-1701001512129-ea9870f77562" + crops,"https://images.unsplash.com/photo-1710963628726-2b1f2f8c5d82"+crops,"https://images.unsplash.com/photo-1743344222291-6310f33c0cab"+crops],
            "description": "Spark creativity with this LEGO Classic set featuring 484 colorful bricks in 35 different colors.",
            "highlights": ["484 Pieces in 35 Colors", "Encourages Open-Ended Creativity", "Includes Special Eyes & Wheels", "Reusable Storage Box", "Ages 4 and Above"],
            "specs": { "Piece Count": "484", "Age Group": "4+", "Material": "ABS Plastic", "Box Size": "37x26x18 cm" },
            "stock": 50,
        },
        {
            "name": "iPhone 15 Pro Max (Natural Titanium, 256 GB)",
            "price": 159900,
            "original_price": 159900,
            "discount_percentage": 0,
            "rating": 4.6,
            "reviews_count": 9821,
            "category": "Mobiles",
            "images": ["https://images.unsplash.com/photo-1695048133142-1a20484d2569" + crops, "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5" + crops],
            "description": "iPhone 15 Pro Max with A17 Pro chip, titanium design, and the most powerful iPhone camera system ever.",
            "highlights": ["A17 Pro Chip Processor", "Strong & Light Titanium Design", "6.7 inch Super Retina XDR Display", "Pro Camera System (48MP + 12MP + 12MP)", "All-day Battery Life"],
            "specs": { "Display": "6.7 inch Super Retina XDR", "Processor": "A17 Pro", "RAM": "8 GB", "Storage": "256 GB", "Battery": "4441 mAh", "Camera": "48MP + 12MP + 12MP" },
            "stock": 50,
        },
        {
            "name": "boAt Airdopes 141 TWS Earbuds with 42H Playtime",
            "price": 1099,
            "original_price": 4490,
            "discount_percentage": 76,
            "rating": 4.1,
            "reviews_count": 234567,
            "category": "Electronics",
            "images": ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df" + crops],
            "description": "Immersive sound experience with 8mm drivers. IPX4 water resistance. Low latency mode for gaming.",
            "highlights": ["Total 42H Playtime", "8mm Dynamic Drivers", "ASAP Fast Charge", "IPX4 Sweat Resistance", "One Touch Voice Assistant"],
            "specs": { "Type": "TWS Earbuds", "Battery Life": "42 hours total", "Connectivity": "Bluetooth 5.1", "Water Resistance": "IPX4" },
            "stock": 50,
        },
        {
            "name": "Levi's Men's 511 Slim Fit Jeans - Dark Blue",
            "price": 1799,
            "original_price": 3599,
            "discount_percentage": 50,
            "rating": 4.2,
            "reviews_count": 12345,
            "category": "Fashion",
            "images": ["https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a" + crops],
            "description": "Classic 511 slim fit jeans in dark blue wash. Made with stretch denim for extra comfort.",
            "highlights": ["Slim Fit Design", "Premium Stretch Denim", "Classic 5-Pocket Styling", "Durable Dark Blue Wash", "Quality Zip Fly"],
            "specs": { "Fit": "Slim", "Material": "Cotton Blend", "Rise": "Mid Rise", "Closure": "Zip" },
            "stock": 50,
        },
        {
            "name": "Prestige Iris 750W Mixer Grinder (3 Jars)",
            "price": 2499,
            "original_price": 4195,
            "discount_percentage": 40,
            "rating": 4.3,
            "reviews_count": 8765,
            "category": "Appliances",
            "images": ["https://images.unsplash.com/photo-1585515320310-259814833e62" + crops],
            "description": "Powerful 750W motor with 3 stainless steel jars for all your grinding and mixing needs.",
            "highlights": ["Powerful 750W Motor", "3 Variable Speed Control", "Stainless Steel Jars", "Sturdy Ergonomic Handles", "Safety Overload Protection"],
            "specs": { "Power": "750W", "Jars": "3", "Material": "Stainless Steel", "Speed": "3 Speed + Pulse" },
            "stock": 50,
        },
    ]
    
    for p in products_data:
        images = p.pop("images")
        product = Product(**p)
        db.add(product)
        db.flush()
        
        for img_url in images:
            img = ProductImage(product_id=product.id, image_url=img_url)
            db.add(img)
            
    db.commit()
    db.close()
    print("Database synced with unique Highlights and Specs!")

if __name__ == "__main__":
    seed_db()
