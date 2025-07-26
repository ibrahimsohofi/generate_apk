import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 h-4 w-4" />
      <Input
        type="text"
        placeholder={t('products.search', 'Rechercher un produit...')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
      />
    </div>
  );
}
