from app.db.database import engine, Base
from app.models import product, cart, order, wishlist
from app.routers import products, cart, orders, wishlist
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os

app = FastAPI(title="Backend API") 

# Read Frontend URL from Environment Variables (fallback to localhost for dev)
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:8080")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(products.router, prefix="/api")  # Product Page Router
app.include_router(cart.router, prefix="/api")      # Cart Page Router
app.include_router(orders.router, prefix="/api")    # Order Page Router
app.include_router(wishlist.router, prefix="/api")  # Wishlist Router

@app.get("/")
def read_root():
    return {"message": "Backend API is running"}

@app.get("/health")
def health():
    return {"Status":"OK"}
