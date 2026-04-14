from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate, CartOut, CartItemOut

# Router for cart operations
router = APIRouter(
    prefix="/cart",
    tags=["cart"]
)

# Default user id for now
DEFAULT_USER_ID = 1

# Get all items in the cart
@router.get("/", response_model=CartOut)
def get_cart(db: Session = Depends(get_db)):
    items = db.query(CartItem).filter(CartItem.user_id == DEFAULT_USER_ID).all()
    
    total_items = sum(item.quantity for item in items)
    total_price = sum(item.quantity * item.product.price for item in items if item.product)
    
    return {
        "items": items,
        "total_items": total_items,
        "total_price": total_price
    }


# Add item to cart
@router.post("/add", response_model=CartItemOut)
def add_to_cart(cart_item: CartItemCreate, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == cart_item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == DEFAULT_USER_ID,
        CartItem.product_id == cart_item.product_id
    ).first()
    
    if existing_item:
        existing_item.quantity += cart_item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    
    new_item = CartItem(
        user_id=DEFAULT_USER_ID,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


# Update item in cart
@router.put("/{item_id}", response_model=CartItemOut)
def update_cart_item(item_id: int, quantity: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == DEFAULT_USER_ID).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    if quantity <= 0:
        db.delete(item)
        db.commit()
        return item 
    
    item.quantity = quantity
    db.commit()
    db.refresh(item)
    return item


# Remove item from cart
@router.delete("/{item_id}")
def remove_from_cart(item_id: int, db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == DEFAULT_USER_ID).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Item removed from cart"}

# Clear cart
@router.delete("/")
def clear_cart(db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.user_id == DEFAULT_USER_ID).delete()
    db.commit()
    return {"message": "Cart cleared"}
