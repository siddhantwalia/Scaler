from app.db.database import engine, Base
from app.models import product, cart, order, wishlist
from app.routers import products, cart
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Backend API") 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(products.router, prefix="/api")  # Product Page Router
app.include_router(cart.router, prefix="/api")      # Cart Page Router

@app.get("/")
def read_root():
    return {"message": "Backend API is running"}

@app.get("/health")
def health():
    return {"Status":"OK"}
