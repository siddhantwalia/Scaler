from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from app.schemas.product import ProductOut

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItemOut(CartItemBase):
    id: int
    product: 'ProductOut'
    
    model_config = ConfigDict(from_attributes=True)

class CartOut(BaseModel):
    items: List[CartItemOut]
    total_items: int
    total_price: float
    
    model_config = ConfigDict(from_attributes=True)