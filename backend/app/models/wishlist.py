from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

# Items present in the wishlist for now we have a default user id = 1
class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)
    product_id = Column(Integer, ForeignKey("products.id"))

    product = relationship("Product")
