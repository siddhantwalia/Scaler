from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.order import Order, OrderItem
from app.models.cart import CartItem
from app.schemas.order import OrderCreate, OrderOut

router = APIRouter(
    prefix="/orders",
    tags=["orders"]
)

DEFAULT_USER_ID = 1

@router.post("/", response_model=OrderOut)
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    # Get cart items for the user
    cart_items = db.query(CartItem).filter(CartItem.user_id == DEFAULT_USER_ID).all()
    
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Calculate total amount
    total_amount = sum(item.quantity * item.product.price for item in cart_items if item.product)
    
    # Create the Order
    new_order = Order(
        user_id=DEFAULT_USER_ID,
        total_amount=total_amount,
        shipping_address=order_in.shipping_address,
        status="Processing"
    )
    db.add(new_order)
    db.flush()
    
    # Create OrderItems from CartItems
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=cart_item.product.price  # Capture price at time of order
        )
        db.add(order_item)
    
    db.query(CartItem).filter(CartItem.user_id == DEFAULT_USER_ID).delete()
    
    db.commit()
    db.refresh(new_order)
    
    return new_order

@router.get("/", response_model=List[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == DEFAULT_USER_ID).all()
    return orders

@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == DEFAULT_USER_ID).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
