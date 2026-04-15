from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from app.schemas.product import ProductOut

class WishlistItemBase(BaseModel):
    product_id: int

class WishlistItemCreate(WishlistItemBase):
    pass

class WishlistItemOut(WishlistItemBase):
    id: int
    user_id: int
    product: ProductOut

    model_config = ConfigDict(from_attributes=True)
