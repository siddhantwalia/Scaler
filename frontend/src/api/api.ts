const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    ratingCount: number;
    category: string;
    images: string[];
    description: string;
    highlights: string[];
    specs: Record<string, string>;
    inStock: boolean;
    stock: number;
}

export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
}

export interface CartData {
    items: CartItem[];
    total_items: number;
    total_price: number;
}

// Helper to map backend product to frontend product
const mapProduct = (p: any): Product => ({
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.original_price || p.price,
    discount: p.discount_percentage || 0,
    rating: p.rating || 0,
    ratingCount: p.reviews_count || 0,
    category: p.category || 'Uncategorized',
    images: p.images?.map((img: any) => img.image_url) || [],
    description: p.description || '',
    highlights: p.highlights || [],
    specs: p.specs || {},
    inStock: p.stock > 0,
    stock: p.stock || 0
});





export const api = {
    async getProducts(category?: string, search?: string): Promise<Product[]> {
        const url = new URL(`${API_BASE_URL}/products/`);
        if (category && category !== 'All') url.searchParams.append('category', category);
        if (search) url.searchParams.append('search', search);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        return data.map(mapProduct);
    },

    async getProductById(id: number): Promise<Product> {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        return mapProduct(data);
    },

    async getCart(): Promise<CartData> {
        const res = await fetch(`${API_BASE_URL}/cart/`);
        if (!res.ok) throw new Error('Failed to fetch cart');
        const data = await res.json();
        return {
            ...data,
            items: data.items.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                product: mapProduct(item.product)
            }))
        };
    },

    async addToCart(productId: number, quantity: number = 1): Promise<CartItem> {
        const res = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, quantity })
        });
        if (!res.ok) throw new Error('Failed to add to cart');
        const item = await res.json();
        return {
            id: item.id,
            quantity: item.quantity,
            product: mapProduct(item.product)
        };
    },

    async updateCartItem(id: number, quantity: number): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/cart/${id}?quantity=${quantity}`, {
            method: 'PUT'
        });
        if (!res.ok) throw new Error('Failed to update cart item');
    },

    async removeFromCart(id: number): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/cart/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to remove from cart');
    },

    async clearCart(): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/cart/`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Failed to clear cart');
    },

    async createOrder(shippingAddress: string): Promise<any> {
        const res = await fetch(`${API_BASE_URL}/orders/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ shipping_address: shippingAddress })
        });
        if (!res.ok) throw new Error('Failed to place order');
        return await res.json();
    },

    async getOrders(): Promise<any[]> {
        const res = await fetch(`${API_BASE_URL}/orders/`);
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();

        return data.map((order: any) => ({
            ...order,
            items: order.items.map((item: any) => ({
                ...item,
                product: mapProduct(item.product),
            })),
        }));
    },
    async getWishlist() {
        const res = await fetch(`${API_BASE_URL}/wishlist/`);
        if (!res.ok) throw new Error("Failed to fetch wishlist");
        const data = await res.json();
        return data.map((item: any) => mapProduct(item.product));
    },

    async addToWishlist(productId: number) {
        await fetch(`${API_BASE_URL}/wishlist/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ product_id: productId }),
        });
    },

    async removeFromWishlist(productId: number) {
        await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
            method: "DELETE",
        });
    }
};
