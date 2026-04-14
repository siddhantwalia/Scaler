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
            "name": "Apple iPhone 15 (Blue, 128 GB)",
            "description": "128 GB ROM | 15.49 cm (6.1 inch) Super Retina XDR Display | 48MP + 12MP | 12MP Front Camera | A16 Bionic Chip, 6 Core Processor",
            "price": 65999.0,
            "original_price": 79900.0,
            "discount_percentage": 17,
            "category": "Electronics",
            "stock": 50,
            "rating": 4.6,
            "reviews_count": 12450,
            "highlights": ["128 GB ROM", "Super Retina XDR Display", "A16 Bionic Chip"],
            "images": ["https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/k/l/l/-original-imagtc56ftzfywak.jpeg"]
        },
        {
            "name": "SAMSUNG Galaxy S23 FE (Mint, 128 GB)",
            "description": "8 GB RAM | 128 GB ROM | 16.26 cm (6.4 inch) Full HD+ Display | 50MP + 12MP | 10MP Front Camera | 4500 mAh Lithium-ion Battery",
            "price": 39999.0,
            "original_price": 59999.0,
            "discount_percentage": 33,
            "category": "Electronics",
            "stock": 30,
            "rating": 4.3,
            "reviews_count": 8900,
            "highlights": ["8 GB RAM", "50MP Triple Camera", "Exynos 2200"],
            "images": ["https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/a/o/f/-original-imagytv2rvstz76v.jpeg"]
        },
        {
            "name": "Nike Air Max Solo Sneakers",
            "description": "A pair of white and black sneakers, has regular styling, lace-up detail. Synthetic upper. Cushioned footbed. Textured and patterned outsole.",
            "price": 8295.0,
            "original_price": 9295.0,
            "discount_percentage": 10,
            "category": "Fashion",
            "stock": 100,
            "rating": 4.5,
            "reviews_count": 450,
            "highlights": ["Synthetic Upper", "Cushioned Footbed", "Rubber Outsole"],
            "images": ["https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/r/j/e/-original-imagzhzhzrgmzhzh.jpeg"]
        },
        {
            "name": "Sony WH-1000XM5 Bluetooth Headset",
            "description": "With Mic | Industry Leading Noise Cancellation | 30Hrs Battery Life | Quick Charge | Multi Point Connection",
            "price": 29990.0,
            "original_price": 34990.0,
            "discount_percentage": 14,
            "category": "Electronics",
            "stock": 25,
            "rating": 4.7,
            "reviews_count": 2100,
            "highlights": ["30 Hours Battery", "Noise Cancellation", "Dual Processor"],
            "images": ["https://rukminim2.flixcart.com/image/832/832/xif0q/headphone/d/z/n/-original-imaghv99mzhzhzhz.jpeg"]
        },
        {
            "name": "LG 7 kg 5 Star Inverter Fully Automatic Front Load",
            "description": "6 Motion Direct Drive | Steam | Heater | Inverter Direct Drive | Touch Control | 5 Star Rating",
            "price": 28990.0,
            "original_price": 35990.0,
            "discount_percentage": 19,
            "category": "Appliances",
            "stock": 15,
            "rating": 4.4,
            "reviews_count": 1200,
            "highlights": ["7 kg Capacity", "Fully Automatic", "Front Load"],
            "images": ["https://rukminim2.flixcart.com/image/832/832/xif0q/washing-machine-new/m/j/e/-original-imagzhzhzrgmzhzh.jpeg"]
        }
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
