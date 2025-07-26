# 🎨 Customization Guide - Droguerie Jamal

## 🏪 Current Business Setup

### ✅ Current Branding
- **Business Name**: Droguerie Jamal
- **App Title**: Professional Inventory Management System
- **Color Scheme**: Blue gradient with orange accents
- **Logo**: Wrench + Package icons
- **Languages**: French (primary) + Arabic

### ✅ Current Categories (6 categories)
1. **Droguerie** - Produits chimiques, adhésifs, mastics
2. **Sanitaire** - Équipements de plomberie, robinets, tuyaux
3. **Peinture** - Peintures, pinceaux, accessoires
4. **Quincaillerie** - Fixations, vis, serrures, composants
5. **Outillage** - Outils à main, outils électriques
6. **Électricité** - Composants électriques, câblage, luminaires

### ✅ Sample Products (12 items)
- **Total Inventory Value**: 2,318 DH (purchase) → 3,389 DH (selling)
- **Authentic Moroccan products** with realistic pricing
- **Professional descriptions** in French

## 🔧 Customization Options

### 1. 🏢 Business Information
```javascript
// File: src/components/Navbar.tsx (line 28)
// Current: "Droguerie Jamal"
// Change to your business name:
"Quincaillerie [Your Name]"
"Droguerie [City Name]"
"Magasin [Specialty]"
```

### 2. 🎨 Color Scheme
```css
// File: src/components/Navbar.tsx (line 10)
// Current: blue gradient
from-blue-800 to-blue-900

// Options:
from-green-800 to-green-900    // Green theme
from-red-800 to-red-900        // Red theme
from-purple-800 to-purple-900  // Purple theme
from-gray-800 to-gray-900      // Dark theme
```

### 3. 📦 Product Categories
```javascript
// File: src/services/api-offline.ts (lines 11-18)
// Customize categories for your business:

// Example: Construction Store
{ name: 'Matériaux', description: 'Ciment, briques, parpaings' }
{ name: 'Isolation', description: 'Isolants thermiques et phoniques' }
{ name: 'Toiture', description: 'Tuiles, ardoises, charpente' }

// Example: Electrical Store
{ name: 'Éclairage', description: 'Ampoules, spots, lustres' }
{ name: 'Domotique', description: 'Automatisation maison' }
{ name: 'Sécurité', description: 'Alarmes, caméras, accès' }
```

### 4. 🛍️ Sample Products
```javascript
// File: src/services/api-offline.ts (lines 20-33)
// Replace with your actual inventory:

{
  name: '[Your Product Name]',
  description: '[Product Description in French]',
  category_id: [1-6],
  purchase_price: [Cost in DH],
  selling_price: [Sale Price in DH],
  remaining_stock: [Quantity],
  min_stock_level: [Minimum Alert Level]
}
```

## 🚀 Quick Customization Steps

### Step 1: Change Business Name
```bash
# Edit the main title
nano src/components/Navbar.tsx
# Line 28: Change "Droguerie Jamal" to your business name
```

### Step 2: Update Categories
```bash
# Edit product categories
nano src/services/api-offline.ts
# Lines 11-18: Modify the SAMPLE_CATEGORIES array
```

### Step 3: Add Your Products
```bash
# Replace sample products
nano src/services/api-offline.ts
# Lines 20-33: Update the SAMPLE_PRODUCTS array
```

### Step 4: Customize Colors (Optional)
```bash
# Update color scheme
nano src/components/Navbar.tsx
# Line 10: Change gradient colors
```

### Step 5: App Metadata
```bash
# Update app information
nano package.json
# Lines 2-6: Update name, description, keywords
```

## 🎯 Business-Specific Examples

### 🔨 Construction Materials Store
```javascript
// Categories
{ name: 'Ciment & Béton', description: 'Ciments, mortiers, bétons prêts' }
{ name: 'Matériaux Gros Œuvre', description: 'Briques, parpaings, poutrelles' }
{ name: 'Isolation', description: 'Isolants thermiques et phoniques' }
{ name: 'Toiture', description: 'Tuiles, ardoises, gouttières' }
{ name: 'Sols & Carrelage', description: 'Carreaux, parquets, revêtements' }
{ name: 'Menuiserie', description: 'Portes, fenêtres, boiseries' }

// Sample Products
{ name: 'Sac ciment 50kg', selling_price: 85.00, category_id: 1 }
{ name: 'Parpaing 20x20x50', selling_price: 12.50, category_id: 2 }
```

### ⚡ Electrical Supplies Store
```javascript
// Categories
{ name: 'Éclairage', description: 'Ampoules LED, spots, luminaires' }
{ name: 'Installation', description: 'Câbles, gaines, tableaux électriques' }
{ name: 'Domotique', description: 'Automatisation et contrôle maison' }
{ name: 'Sécurité', description: 'Alarmes, détecteurs, caméras' }
{ name: 'Chauffage', description: 'Radiateurs électriques, thermostats' }
{ name: 'Accessoires', description: 'Prises, interrupteurs, fiches' }
```

### 🎨 Paint & Decoration Store
```javascript
// Categories
{ name: 'Peintures Murs', description: 'Peintures intérieures et extérieures' }
{ name: 'Peintures Spéciales', description: 'Antirouille, sols, bois' }
{ name: 'Outils Peinture', description: 'Pinceaux, rouleaux, bâches' }
{ name: 'Papier Peint', description: 'Papiers peints et accessoires' }
{ name: 'Décoration', description: 'Stickers, frises, moulures' }
{ name: 'Préparation', description: 'Apprêts, enduits, ponçage' }
```

## 💰 Pricing Guidelines (Morocco)

### 🇲🇦 Typical Moroccan Hardware Pricing
```javascript
// Low-value items (5-50 DH)
vis, écrous, petite quincaillerie

// Medium-value items (50-200 DH)
outils à main, robinets, accessoires

// High-value items (200-1000+ DH)
outils électriques, équipements, matériaux

// Professional markup: 40-60% on purchase price
purchase_price: 100.00
selling_price: 150.00 // 50% markup
```

## 🔄 Apply Customizations

### After Making Changes:
```bash
# 1. Rebuild the web application
bun run build

# 2. Sync with Android
bunx cap sync android

# 3. Generate new APK
cd android && ./gradlew assembleDebug
```

### Test Your Changes:
1. **Web Version**: http://localhost:5173
2. **API Test**: Check categories and products load correctly
3. **Mobile Test**: Install APK and verify customizations

## 🎉 Professional Tips

### ✅ Business Branding
- Use **your actual business name** for credibility
- Choose **colors matching your store** theme
- Keep **category names in French** for Moroccan market
- Use **realistic Moroccan pricing** in Dirhams

### ✅ Product Management
- Start with **10-20 real products** from your inventory
- Set **accurate purchase/selling prices**
- Use **descriptive product names**
- Configure **appropriate stock levels**

### ✅ Categories
- **3-8 categories** work best for navigation
- Make categories **specific to your business**
- Use **clear French descriptions**
- Order by **importance/frequency**

Your customized Droguerie app will be ready for professional use! 🚀
