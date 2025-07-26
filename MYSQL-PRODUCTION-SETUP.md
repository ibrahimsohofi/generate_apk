# 🗄️ MySQL Production Setup - Droguerie Jamal

## 🎯 Why MySQL for Production?

### ✅ Benefits Over SQLite
- **Multi-user support**: Multiple devices can access simultaneously
- **Better performance**: Optimized for concurrent connections
- **Data integrity**: ACID compliance and transactions
- **Scalability**: Handle thousands of products and transactions
- **Backup & Recovery**: Professional database management
- **Security**: User authentication and permissions

## 🔧 MySQL Installation

### Ubuntu/Debian Linux
```bash
# Update package list
sudo apt update

# Install MySQL Server
sudo apt install mysql-server mysql-client

# Secure MySQL installation
sudo mysql_secure_installation
```

### CentOS/RHEL/Rocky Linux
```bash
# Install MySQL Repository
sudo dnf install mysql-server mysql

# Start and enable MySQL
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Get temporary root password
sudo grep 'temporary password' /var/log/mysqld.log
```

### macOS (Homebrew)
```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Set root password
mysql_secure_installation
```

### Windows
```bash
# Download MySQL Installer from:
# https://dev.mysql.com/downloads/installer/

# Or use Chocolatey:
choco install mysql
```

## 🏗️ Database Setup

### Step 1: Create Database and User
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database for Droguerie Jamal
CREATE DATABASE droguerie_jamal_inventory
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create dedicated user
CREATE USER 'droguerie_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';

-- Grant permissions
GRANT ALL PRIVILEGES ON droguerie_jamal_inventory.* TO 'droguerie_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### Step 2: Create Tables Schema
```sql
-- Use the database
USE droguerie_jamal_inventory;

-- Categories table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT,
  purchase_price DECIMAL(10,2) NOT NULL,
  selling_price DECIMAL(10,2) NOT NULL,
  remaining_stock INT DEFAULT 0,
  min_stock_level INT DEFAULT 10,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_name (name),
  INDEX idx_category (category_id),
  INDEX idx_stock (remaining_stock),
  INDEX idx_created (created_at)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Droguerie', 'Produits chimiques, adhésifs, mastics et composés spécialisés'),
('Sanitaire', 'Équipements de plomberie, tuyaux, robinets, chauffe-eau, accessoires de salle de bain'),
('Peinture', 'Peintures, apprêts, pinceaux, rouleaux, accessoires et outils de peinture'),
('Quincaillerie', 'Fixations, vis, boulons, écrous, charnières, serrures et composants métalliques'),
('Outillage', 'Outils à main, outils électriques, équipements de mesure et de sécurité'),
('Électricité', 'Composants électriques, câblage, interrupteurs, prises, luminaires');
```

### Step 3: Insert Sample Products
```sql
-- Insert sample products with Moroccan pricing
INSERT INTO products (name, description, category_id, purchase_price, selling_price, remaining_stock, min_stock_level) VALUES
('Colle PVC forte', 'Adhésif haute résistance pour tuyaux PVC', 1, 25.00, 35.00, 50, 10),
('Mastic d\'étanchéité universel', 'Mastic étanche pour joints et fissures', 1, 18.00, 28.00, 75, 15),
('Robinet mélangeur chromé', 'Robinet mélangeur pour cuisine et salle de bain', 2, 150.00, 220.00, 25, 5),
('Tube PVC Ø100mm', 'Tuyau PVC 100mm pour évacuation', 2, 45.00, 65.00, 100, 20),
('Peinture murale blanche 10L', 'Peinture acrylique blanche pour murs intérieurs', 3, 180.00, 250.00, 40, 10),
('Rouleau de peinture professionnel', 'Rouleau pour finitions lisses', 3, 15.00, 25.00, 80, 20),
('Vis à bois 4x40mm (boîte 100)', 'Vis pour menuiserie, tête fraisée', 4, 12.50, 18.00, 200, 50),
('Serrure de sécurité 3 points', 'Serrure haute sécurité avec 3 clés', 4, 85.00, 125.00, 15, 5),
('Perceuse visseuse 18V', 'Perceuse sans fil avec batterie et chargeur', 5, 280.00, 420.00, 12, 3),
('Marteau de charpentier 500g', 'Marteau avec manche bois', 5, 35.00, 55.00, 25, 8),
('Câble électrique 2.5mm² (rouleau 100m)', 'Câble pour installations électriques', 6, 85.00, 120.00, 20, 5),
('Interrupteur simple blanc', 'Interrupteur mural blanc', 6, 12.00, 18.00, 100, 25);
```

## ⚙️ Backend Configuration

### Step 1: Update Environment Variables
```bash
# Edit backend/.env file
nano backend/.env
```

```env
# =================================================================
# DATABASE CONFIGURATION - MYSQL PRODUCTION
# =================================================================
USE_MYSQL=true
DB_HOST=localhost
DB_USER=droguerie_user
DB_PASSWORD=SecurePassword123!
DB_NAME=droguerie_jamal_inventory
DB_PORT=3306

# =================================================================
# PRODUCTION SETTINGS
# =================================================================
NODE_ENV=production
DEMO_MODE=false

# =================================================================
# SECURITY (GENERATE NEW VALUES)
# =================================================================
JWT_SECRET=your_super_secure_jwt_secret_here_64_characters_minimum
CORS_ORIGIN=https://yourdomain.com
```

### Step 2: Test MySQL Connection
```bash
# Test database connection
cd backend
node -e "
const mysql = require('mysql2/promise');
async function test() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'droguerie_user',
      password: 'SecurePassword123!',
      database: 'droguerie_jamal_inventory'
    });
    console.log('✅ MySQL connection successful!');
    await connection.end();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
  }
}
test();
"
```

### Step 3: Start Production Server
```bash
# Start server with MySQL
cd backend
bun run start

# Or with PM2 for production
npm install -g pm2
pm2 start server.js --name "droguerie-api"
pm2 startup
pm2 save
```

## 🚀 Production Deployment

### Option 1: VPS/Server Deployment
```bash
# 1. Install MySQL on server
# 2. Create database and user
# 3. Upload application files
# 4. Install dependencies
npm install --production

# 5. Configure environment
cp .env.example .env
# Edit with production values

# 6. Start with PM2
pm2 start server.js
```

### Option 2: Docker Deployment
```dockerfile
# docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: droguerie_jamal_inventory
      MYSQL_USER: droguerie_user
      MYSQL_PASSWORD: SecurePassword123!
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    environment:
      USE_MYSQL: true
      DB_HOST: mysql
      DB_USER: droguerie_user
      DB_PASSWORD: SecurePassword123!
      DB_NAME: droguerie_jamal_inventory
    depends_on:
      - mysql
    ports:
      - "5000:5000"

volumes:
  mysql_data:
```

### Option 3: Cloud Database (Recommended)
```bash
# Popular cloud MySQL services:
# - AWS RDS MySQL
# - Google Cloud SQL
# - DigitalOcean Managed Database
# - PlanetScale (MySQL-compatible)

# Benefits:
# - Automatic backups
# - High availability
# - Security patches
# - Scaling
```

## 📊 Performance Optimization

### MySQL Configuration
```sql
-- Optimize for hardware inventory
SET GLOBAL innodb_buffer_pool_size = 1G;
SET GLOBAL max_connections = 100;
SET GLOBAL query_cache_size = 64M;

-- Create additional indexes for common queries
CREATE INDEX idx_products_price ON products(selling_price);
CREATE INDEX idx_products_stock_low ON products(remaining_stock, min_stock_level);
CREATE INDEX idx_products_updated ON products(updated_at);
```

### Backup Strategy
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
mysqldump -u droguerie_user -p'SecurePassword123!' \
  droguerie_jamal_inventory > backup_$DATE.sql

# Keep only last 7 days
find . -name "backup_*.sql" -mtime +7 -delete
```

## 🔒 Security Checklist

### ✅ Database Security
- [ ] Use strong passwords (12+ characters)
- [ ] Create dedicated database user (not root)
- [ ] Limit user permissions to specific database
- [ ] Enable SSL connections in production
- [ ] Regular security updates
- [ ] Firewall rules (only allow app server)

### ✅ Application Security
- [ ] Generate new JWT secret
- [ ] Set production CORS origin
- [ ] Enable HTTPS in production
- [ ] Regular dependency updates
- [ ] Input validation and sanitization
- [ ] Rate limiting for API endpoints

## 📈 Monitoring & Maintenance

### Performance Monitoring
```sql
-- Check database size
SELECT
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'droguerie_jamal_inventory';

-- Check slow queries
SHOW PROCESSLIST;
SELECT * FROM information_schema.processlist WHERE time > 30;
```

### Regular Maintenance
```bash
# Weekly tasks
# 1. Check database size and growth
# 2. Review slow query log
# 3. Update system packages
# 4. Test backup restoration
# 5. Monitor server resources

# Monthly tasks
# 1. Full database backup
# 2. Security updates
# 3. Performance analysis
# 4. Log rotation
```

## 🎉 Production Ready!

After completing this setup:
- ✅ **Multi-user capable**: Multiple devices can connect
- ✅ **Professional performance**: Fast queries and responses
- ✅ **Data security**: Proper authentication and backups
- ✅ **Scalable**: Handle growing inventory and users
- ✅ **Business ready**: Suitable for daily operations

Your Droguerie Jamal inventory system is now enterprise-ready! 🚀
