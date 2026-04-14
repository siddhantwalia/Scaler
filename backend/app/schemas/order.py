from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime
from app.schemas.product import ProductOut

class OrderItemOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: ProductOut

    model_config = ConfigDict(from_attributes=True)

class OrderCreate(BaseModel):
    shipping_address: str

class OrderOut(BaseModel):
    id: int
    user_id: int
    total_amount: float
    shipping_address: str
    status: str
    created_at: datetime
    items: List[OrderItemOut]

    model_config = ConfigDict(from_attributes=True)
