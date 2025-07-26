import type { Product, Category } from '@/types';
import { offlineApi } from './api-offline';

const API_BASE_URL = '/api';

// Detect if running in mobile app (Capacitor)
const isCapacitor = () => {
  return !!(window as unknown as { Capacitor: unknown }).Capacitor;
};

// Detect if offline or in static environment
const isOffline = () => {
  // Always use offline mode in static deployment (no backend available)
  if (window.location.protocol === 'https:' && window.location.hostname.includes('netlify')) {
    return true;
  }
  return !navigator.onLine || isCapacitor();
};

export const api = {
  // Categories
  getCategories: async (): Promise<{ success: boolean; categories: Category[] }> => {
    if (isOffline()) {
      return offlineApi.getCategories();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.log('Falling back to offline mode for categories:', error);
      return offlineApi.getCategories();
    }
  },

  // Products
  getProducts: async (search = '', category = 'all'): Promise<{ success: boolean; products: Product[] }> => {
    if (isOffline()) {
      return offlineApi.getProducts(search, category);
    }

    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'all') params.append('category', category);

      const response = await fetch(`${API_BASE_URL}/products?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.log('Falling back to offline mode for products:', error);
      return offlineApi.getProducts(search, category);
    }
  },

  createProduct: async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category_name'>): Promise<{ success: boolean; id?: number; error?: string }> => {
    if (isOffline()) {
      return offlineApi.createProduct(productData);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      return response.json();
    } catch (error) {
      console.log('Falling back to offline mode for create product');
      return offlineApi.createProduct(productData);
    }
  },

  updateProduct: async (productData: Omit<Product, 'created_at' | 'updated_at' | 'category_name'>): Promise<{ success: boolean; error?: string }> => {
    if (isOffline()) {
      return offlineApi.updateProduct(productData);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      return response.json();
    } catch (error) {
      console.log('Falling back to offline mode for update product');
      return offlineApi.updateProduct(productData);
    }
  },

  deleteProduct: async (id: number): Promise<{ success: boolean; error?: string }> => {
    if (isOffline()) {
      return offlineApi.deleteProduct(id);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products?id=${id}`, {
        method: 'DELETE',
      });
      return response.json();
    } catch (error) {
      console.log('Falling back to offline mode for delete product');
      return offlineApi.deleteProduct(id);
    }
  },

  uploadImage: async (file: File): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
    if (isOffline()) {
      return offlineApi.uploadImage(file);
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      return response.json();
    } catch (error) {
      console.log('Falling back to offline mode for image upload');
      return offlineApi.uploadImage(file);
    }
  },

  deleteImage: async (imageUrl: string): Promise<{ success: boolean; error?: string }> => {
    if (isOffline()) {
      return offlineApi.deleteImage(imageUrl);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });
      return response.json();
    } catch (error) {
      console.log('Falling back to offline mode for delete image');
      return offlineApi.deleteImage(imageUrl);
    }
  },

  // Expose offline utilities for mobile app
  offline: {
    exportData: offlineApi.exportData,
    importData: offlineApi.importData,
    resetData: offlineApi.resetData,
    isOfflineMode: isOffline
  }
};
