import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ProductTable } from './components/ProductTable';
import { ProductForm } from './components/ProductForm';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductTableSkeleton } from './components/ProductTableSkeleton';
import { StatsCardsSkeleton } from './components/StatsCardsSkeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Toaster, toast } from 'sonner';
import type { Product, Category } from './types';
import { api } from './services/api';

function App() {
  const { i18n, t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Initialize RTL support based on current language
  useEffect(() => {
    const currentLang = i18n.language;
    document.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    if (currentLang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [i18n.language]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.getProducts(searchTerm, selectedCategory);
      if (response.success) {
        setProducts(response.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(t('messages.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, t]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(t('messages.errorLoading'));
    }
  }, [t]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleProductSave = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category_name'>) => {
    try {
      let response: { success: boolean; error?: string };

      if (editingProduct) {
        response = await api.updateProduct({ ...productData, id: editingProduct.id });
      } else {
        response = await api.createProduct(productData);
      }

      if (response.success) {
        toast.success(editingProduct ? t('messages.productUpdated') : t('messages.productAdded'));
        fetchProducts();
        setIsFormOpen(false);
        setEditingProduct(null);
      } else {
        throw new Error(response.error || t('messages.errorSaving'));
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(t('messages.errorSaving'));
    }
  };

  const handleProductDelete = async (productId: number) => {
    try {
      const response = await api.deleteProduct(productId);

      if (response.success) {
        toast.success(t('messages.productDeleted'));
        fetchProducts();
      } else {
        throw new Error(response.error || t('messages.errorDeleting'));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(t('messages.errorDeleting'));
    }
  };

  const handleEditProduct = (product: Product) => {
    try {
      console.log('Editing product:', product);

      // Ensure product has all required fields
      if (!product || !product.id) {
        console.error('Invalid product data:', product);
        toast.error(t('messages.errorLoading'));
        return;
      }

      setEditingProduct(product);
      setIsFormOpen(true);
    } catch (error) {
      console.error('Error in handleEditProduct:', error);
      toast.error(t('messages.errorLoading'));
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => {
    const price = Number(product.selling_price) || 0;
    const stock = Number(product.remaining_stock) || 0;
    return sum + (price * stock);
  }, 0);
  const lowStockProducts = products.filter(product => (Number(product.remaining_stock) || 0) <= (Number(product.min_stock_level) || 0)).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400">{t('dashboard.title')}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{t('dashboard.subtitle')}</p>
            </div>
            <Button
              disabled
              className="text-white shadow-lg bg-blue-800 dark:bg-blue-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('products.add')}
            </Button>
          </div>

          {/* Stats Cards Skeleton */}
          <StatsCardsSkeleton />

          {/* Filters Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </div>
            <div className="md:w-64">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </div>
          </div>

          {/* Products Table Skeleton */}
          <ProductTableSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-400">{t('dashboard.title')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t('dashboard.subtitle')}</p>
          </div>
          <Button
            onClick={handleAddProduct}
            className="text-white shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
            style={{
              backgroundColor: "#1e40af"
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('products.add')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 shadow-lg border-blue-800 dark:border-blue-400 dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-400">{t('stats.totalProducts')}</CardTitle>
              <Package className="h-4 w-4 text-blue-800 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-400">{totalProducts}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('stats.totalProductsDesc')}</p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg border-blue-800 dark:border-blue-400 dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-400">{t('stats.stockValue')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-800 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-400">{Number.isNaN(totalValue) ? '0' : totalValue.toLocaleString()} {t('currency')}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('stats.stockValueDesc')}</p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg border-orange-600 dark:border-orange-400 dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">{t('stats.lowStock')}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{lowStockProducts}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('stats.lowStockDesc')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
          <div className="md:w-64">
            <CategoryFilter
              categories={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Products Table */}
        <Card className="border-2 shadow-lg border-blue-800 dark:border-blue-400 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-400">{t('products.list')}</CardTitle>
            <CardDescription className="dark:text-gray-400">
              {t('products.listDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductTable
              products={products}
              categories={categories}
              onEdit={handleEditProduct}
              onDelete={handleProductDelete}
            />
          </CardContent>
        </Card>

        {/* Product Form Dialog */}
        <ProductForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleProductSave}
          categories={categories}
          editingProduct={editingProduct}
        />
      </main>

      <Toaster />
    </div>
  );
}

export default App;
