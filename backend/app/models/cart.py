from sqlalchemy import Column, Integer, ForeignKey
from app.db.database import Base
from sqlalchemy.orm import relationship

# Items present in the cart for now we have a default user id = 1
class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, default=1)
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer, default=1)
    
    product = relationship("Product")
