from pydantic import BaseModel, ConfigDict
from typing import List, Optional

# Base schema for product images
class ProductImageBase(BaseModel):
    id: int
    image_url: str
    
    model_config = ConfigDict(from_attributes=True)

# Base schema for products
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    discount_percentage: Optional[int] = 0
    category: Optional[str] = None
    stock: Optional[int] = 0
    rating: Optional[float] = 0.0
    reviews_count: Optional[int] = 0
    highlights: Optional[List[str]] = None
    specs: Optional[dict] = None

# Schema for products
class ProductOut(ProductBase):
    id: int
    images: List[ProductImageBase] = []

    model_config = ConfigDict(from_attributes=True)
