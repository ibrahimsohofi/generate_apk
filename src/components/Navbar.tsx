import { Wrench, ShoppingCart, Package, Store, Menu, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="relative border-b bg-gradient-to-r from-blue-800 to-blue-900 dark:from-gray-900 dark:to-gray-800 shadow-xl backdrop-blur-sm">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400" />

      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 group">
            <div className="relative flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10">
              <div className="relative">
                <Wrench className="h-8 w-8 text-orange-400 transition-transform duration-300 group-hover:rotate-12" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-400 rounded-full animate-pulse opacity-75" />
              </div>
              <Package className="h-6 w-6 text-white/90 transition-colors duration-300 group-hover:text-white" />
            </div>

            <div className="text-white">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 hover:text-orange-100">
                Droguerie Jamal
              </h1>

            </div>
          </div>

          {/* Center Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-orange-400/30">
              <ShoppingCart className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-white">{t('nav.inventory', 'Inventaire')}</span>
              <div className="ml-2 px-2 py-0.5 bg-orange-400 text-blue-900 text-xs font-semibold rounded-full">
                Active
              </div>
            </div>


          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200">
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop status indicator */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-green-500/20 border border-green-400/30 rounded-lg">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-300 font-medium">En ligne</span>
            </div>

            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-white/10 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-white">
              <ShoppingCart className="h-4 w-4 text-orange-400" />
              <span>{t('nav.inventory', 'Inventaire')}</span>
            </div>
            <div className="text-xs text-blue-200">
              {t('business.tagline', 'Solutions Pro')}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
