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
    specs: Record<string, string>;
    inStock: boolean;
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
    specs: p.highlights ? { "Highlights": p.highlights.join(", ") } : {},
    inStock: p.stock > 0
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
};
