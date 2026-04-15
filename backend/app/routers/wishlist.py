from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.wishlist import WishlistItem
from app.models.product import Product
from app.schemas.wishlist import WishlistItemCreate, WishlistItemOut

router = APIRouter(
    prefix="/wishlist",
    tags=["wishlist"]
)

DEFAULT_USER_ID = 1

@router.get("/", response_model=List[WishlistItemOut])
def get_wishlist(db: Session = Depends(get_db)):
    items = db.query(WishlistItem).filter(WishlistItem.user_id == DEFAULT_USER_ID).all()
    return items

@router.post("/", response_model=WishlistItemOut, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(wishlist_in: WishlistItemCreate, db: Session = Depends(get_db)):
    # Check if product exists
    product = db.query(Product).filter(Product.id == wishlist_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if already in wishlist
    existing_item = db.query(WishlistItem).filter(
        WishlistItem.user_id == DEFAULT_USER_ID,
        WishlistItem.product_id == wishlist_in.product_id
    ).first()
    
    if existing_item:
        return existing_item # Or raise an error if preferred, but usually just return existing
    
    new_item = WishlistItem(
        user_id=DEFAULT_USER_ID,
        product_id=wishlist_in.product_id
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{product_id}")
def remove_from_wishlist(product_id: int, db: Session = Depends(get_db)):
    item = db.query(WishlistItem).filter(
        WishlistItem.product_id == product_id,
        WishlistItem.user_id == DEFAULT_USER_ID
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")

    db.delete(item)
    db.commit()
    return {"message": "Item removed from wishlist"}