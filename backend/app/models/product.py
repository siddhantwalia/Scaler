from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from app.db.database import Base
from sqlalchemy.orm import relationship

# Products available in the store
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    original_price = Column(Float)
    discount_percentage = Column(Integer, default=0)
    category = Column(String, index=True)
    stock = Column(Integer, default=0)
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    highlights = Column(JSON, nullable=True)
    
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")

# Images of the product
class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    image_url = Column(String)
    
    product = relationship("Product", back_populates="images")
