import { useState } from 'react';
import { Edit, Trash2, AlertTriangle, ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Product, Category } from '@/types';

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export function ProductTable({ products, categories, onEdit, onDelete }: ProductTableProps) {
  const { t } = useTranslation();
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || t('categories.none');
  };

  const getStockStatus = (stock: number, minLevel: number) => {
    if (stock === 0) {
      return { label: t('status.outOfStock'), variant: 'destructive' as const };
    }
    if (stock <= minLevel) {
      return { label: t('status.lowStock'), variant: 'secondary' as const };
    }
    return { label: t('status.inStock'), variant: 'default' as const };
  };

  const handleDelete = () => {
    if (deleteProductId) {
      onDelete(deleteProductId);
      setDeleteProductId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('products.noProducts')}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>{t('products.name')}</TableHead>
            <TableHead>{t('products.category')}</TableHead>
            <TableHead>{t('products.purchasePrice')}</TableHead>
            <TableHead>{t('products.sellingPrice')}</TableHead>
            <TableHead>{t('products.stock')}</TableHead>
            <TableHead>{t('products.status')}</TableHead>
            <TableHead className="text-right">{t('products.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.remaining_stock || 0, product.min_stock_level || 0);

            return (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <ImageIcon className={`h-6 w-6 text-gray-400 ${product.image_url ? 'hidden' : ''}`} />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getCategoryName(product.category_id)}</TableCell>
                <TableCell>{(product.purchase_price || 0).toFixed(2)} {t('currency')}</TableCell>
                <TableCell className="font-medium">
                  {(product.selling_price || 0).toFixed(2)} {t('currency')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span>{product.remaining_stock || 0}</span>
                    {(product.remaining_stock || 0) <= (product.min_stock_level || 0) && (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={stockStatus.variant}>
                    {stockStatus.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteProductId(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('dialog.deleteTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('dialog.deleteMessage', { name: product.name })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setDeleteProductId(null)}>
                            {t('dialog.cancel')}
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>
                            {t('dialog.delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
