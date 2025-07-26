-- =================================================================
-- DROGUERIE JAMAL - MYSQL PRODUCTION SCHEMA
-- =================================================================
-- Professional inventory management system for Moroccan hardware stores
-- Compatible with MySQL 5.7+ and MySQL 8.0+
-- Character set: UTF8MB4 for full Arabic and French support

-- Create database (run this separately or ensure you have CREATE privileges)
-- CREATE DATABASE droguerie_jamal_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE droguerie_jamal_inventory;

-- =================================================================
-- DROP EXISTING TABLES (CAUTION: THIS WILL DELETE ALL DATA)
-- =================================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
SET FOREIGN_KEY_CHECKS = 1;

-- =================================================================
-- CATEGORIES TABLE
-- =================================================================
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Indexes for performance
  INDEX idx_categories_name (name),
  INDEX idx_categories_created (created_at)
) ENGINE=InnoDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci
COMMENT='Product categories for hardware store inventory';

-- =================================================================
-- PRODUCTS TABLE
-- =================================================================
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT,
  purchase_price DECIMAL(10,2) NOT NULL COMMENT 'Price in Moroccan Dirhams (MAD)',
  selling_price DECIMAL(10,2) NOT NULL COMMENT 'Selling price in Moroccan Dirhams (MAD)',
  remaining_stock INT DEFAULT 0 COMMENT 'Current stock quantity',
  min_stock_level INT DEFAULT 10 COMMENT 'Minimum stock alert level',
  image_url VARCHAR(500) COMMENT 'Product image URL or path',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Foreign key constraint
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,

  -- Indexes for performance
  INDEX idx_products_name (name),
  INDEX idx_products_category (category_id),
  INDEX idx_products_stock (remaining_stock),
  INDEX idx_products_price (selling_price),
  INDEX idx_products_created (created_at),
  INDEX idx_products_updated (updated_at),
  INDEX idx_products_low_stock (remaining_stock, min_stock_level),

  -- Full-text search index for product search
  FULLTEXT INDEX ft_products_search (name, description)
) ENGINE=InnoDB
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci
COMMENT='Products inventory for hardware store';

-- =================================================================
-- INSERT DEFAULT CATEGORIES
-- =================================================================
INSERT INTO categories (name, description) VALUES
('Droguerie', 'Produits chimiques, adhésifs, mastics et composés spécialisés pour la construction et la réparation'),
('Sanitaire', 'Équipements de plomberie, tuyaux, robinets, chauffe-eau, accessoires de salle de bain et cuisine'),
('Peinture', 'Peintures, apprêts, pinceaux, rouleaux, accessoires et outils de peinture pour intérieur et extérieur'),
('Quincaillerie', 'Fixations, vis, boulons, écrous, charnières, serrures et composants métalliques'),
('Outillage', 'Outils à main, outils électriques, équipements de mesure et de sécurité professionnels'),
('Électricité', 'Composants électriques, câblage, interrupteurs, prises, luminaires et matériel électrique');

-- =================================================================
-- INSERT SAMPLE PRODUCTS (MOROCCAN HARDWARE STORE)
-- =================================================================
INSERT INTO products (name, description, category_id, purchase_price, selling_price, remaining_stock, min_stock_level) VALUES

-- Droguerie Products
('Colle PVC forte 250ml', 'Adhésif haute résistance pour tuyaux PVC et raccords plastiques', 1, 25.00, 35.00, 50, 10),
('Mastic d\'étanchéité universel', 'Mastic silicone étanche pour joints et fissures intérieures et extérieures', 1, 18.00, 28.00, 75, 15),

-- Sanitaire Products
('Robinet mélangeur chromé', 'Robinet mélangeur moderne pour cuisine et salle de bain, finition chromée', 2, 150.00, 220.00, 25, 5),
('Tube PVC Ø100mm (barre 4m)', 'Tuyau PVC rigide 100mm pour évacuation eaux usées', 2, 45.00, 65.00, 100, 20),

-- Peinture Products
('Peinture murale blanche 10L', 'Peinture acrylique blanche mate pour murs intérieurs, lessivable', 3, 180.00, 250.00, 40, 10),
('Rouleau de peinture professionnel', 'Rouleau anti-gouttes pour finitions lisses, manche inclus', 3, 15.00, 25.00, 80, 20),

-- Quincaillerie Products
('Vis à bois 4x40mm (boîte 100 pcs)', 'Vis pour menuiserie, tête fraisée, traitement anti-corrosion', 4, 12.50, 18.00, 200, 50),
('Serrure de sécurité 3 points', 'Serrure haute sécurité certifiée A2P avec 3 clés et cylindre européen', 4, 85.00, 125.00, 15, 5),

-- Outillage Products
('Perceuse visseuse 18V sans fil', 'Perceuse visseuse professionnelle avec batterie lithium et chargeur rapide', 5, 280.00, 420.00, 12, 3),
('Marteau de charpentier 500g', 'Marteau professionnel avec manche bois ergonomique et tête forgée', 5, 35.00, 55.00, 25, 8),

-- Électricité Products
('Câble électrique 2.5mm² (rouleau 100m)', 'Câble rigide H07V-U pour installations électriques domestiques', 6, 85.00, 120.00, 20, 5),
('Interrupteur simple blanc', 'Interrupteur mural simple allumage, design moderne, norme NF', 6, 12.00, 18.00, 100, 25);

-- =================================================================
-- USEFUL VIEWS FOR REPORTING
-- =================================================================

-- Low stock alert view
CREATE VIEW low_stock_products AS
SELECT
    p.id,
    p.name,
    c.name AS category_name,
    p.remaining_stock,
    p.min_stock_level,
    p.selling_price
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.remaining_stock <= p.min_stock_level
ORDER BY p.remaining_stock ASC;

-- Inventory value view
CREATE VIEW inventory_value AS
SELECT
    c.name AS category_name,
    COUNT(p.id) AS product_count,
    SUM(p.remaining_stock * p.purchase_price) AS total_purchase_value,
    SUM(p.remaining_stock * p.selling_price) AS total_selling_value,
    SUM(p.remaining_stock * (p.selling_price - p.purchase_price)) AS potential_profit
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY total_selling_value DESC;

-- Recent products view
CREATE VIEW recent_products AS
SELECT
    p.id,
    p.name,
    c.name AS category_name,
    p.selling_price,
    p.remaining_stock,
    p.created_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.created_at DESC
LIMIT 10;

-- =================================================================
-- PERFORMANCE OPTIMIZATION
-- =================================================================

-- Analyze tables for better performance
ANALYZE TABLE categories;
ANALYZE TABLE products;

-- =================================================================
-- VERIFICATION QUERIES
-- =================================================================

-- Check categories count
SELECT COUNT(*) AS categories_count FROM categories;

-- Check products count
SELECT COUNT(*) AS products_count FROM products;

-- Check total inventory value
SELECT
    ROUND(SUM(remaining_stock * purchase_price), 2) AS total_purchase_value_mad,
    ROUND(SUM(remaining_stock * selling_price), 2) AS total_selling_value_mad,
    ROUND(SUM(remaining_stock * (selling_price - purchase_price)), 2) AS potential_profit_mad
FROM products;

-- Check products per category
SELECT
    c.name AS category,
    COUNT(p.id) AS product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY product_count DESC;

-- =================================================================
-- SUCCESS MESSAGE
-- =================================================================
SELECT 'Database setup completed successfully! Your Droguerie Jamal inventory system is ready.' AS message;
