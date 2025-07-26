const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database setup - support both MySQL and SQLite
const USE_MYSQL = process.env.USE_MYSQL === 'true';
let db;
let dbQuery;

if (USE_MYSQL) {
  // MySQL setup
  const mysql = require('mysql2/promise');

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'inventory_manager',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  let pool;

  // Initialize MySQL connection pool
  try {
    pool = mysql.createPool(dbConfig);
  } catch (error) {
    console.error('Failed to create MySQL connection pool:', error);
    process.exit(1);
  }

  // MySQL database operations
  dbQuery = {
    async execute(query, params = []) {
      try {
        const [rows] = await pool.execute(query, params);
        return rows;
      } catch (error) {
        console.error('Database query error:', error);
        throw error;
      }
    }
  };
} else {
  // SQLite setup
  const sqlite3 = require('sqlite3').verbose();

  db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err);
      process.exit(1);
    }
    console.log('Connected to SQLite database');
  });

  // SQLite database operations
  dbQuery = {
    async execute(query, params = []) {
      return new Promise((resolve, reject) => {
        if (query.trim().toUpperCase().startsWith('SELECT')) {
          db.all(query, params, (err, rows) => {
            if (err) {
              console.error('Database query error:', err);
              reject(err);
            } else {
              resolve(rows);
            }
          });
        } else {
          db.run(query, params, function(err) {
            if (err) {
              console.error('Database query error:', err);
              reject(err);
            } else {
              resolve({ insertId: this.lastID, changes: this.changes });
            }
          });
        }
      });
    }
  };
}

// Initialize database
async function initializeDatabase() {
  try {
    console.log(`Using ${USE_MYSQL ? 'MySQL' : 'SQLite'} database`);

    if (USE_MYSQL) {
      const connection = await pool.getConnection();
      console.log('Connected to MySQL database');

      // Create tables with MySQL syntax
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await connection.execute(`
        CREATE TABLE IF NOT EXISTS products (
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
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        )
      `);

      connection.release();
    } else {
      // Create tables with SQLite syntax
      await dbQuery.execute(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await dbQuery.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          category_id INTEGER,
          purchase_price REAL NOT NULL,
          selling_price REAL NOT NULL,
          remaining_stock INTEGER DEFAULT 0,
          min_stock_level INTEGER DEFAULT 10,
          image_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        )
      `);
    }

    console.log('Database tables created successfully');
    await insertSampleData();
  } catch (error) {
    console.error('Database initialization error:', error);
    if (USE_MYSQL) {
      console.error('Please ensure MySQL is running and accessible with the provided credentials');
    }
    process.exit(1);
  }
}

async function insertSampleData() {
  try {
    // Check if categories exist
    const categoryRows = await dbQuery.execute('SELECT COUNT(*) as count FROM categories');
    const categoryCount = categoryRows[0].count || categoryRows[0]['COUNT(*)'];

    if (categoryCount === 0) {
      console.log('Inserting sample data for Droguerie Jamal...');

      // Insert Droguerie Jamal hardware store categories
      const categories = [
        ['Droguerie', 'Produits chimiques, adhésifs, mastics et composés spécialisés'],
        ['Sanitaire', 'Équipements de plomberie, tuyaux, robinets, chauffe-eau, accessoires de salle de bain'],
        ['Peinture', 'Peintures, apprêts, pinceaux, rouleaux, accessoires et outils de peinture'],
        ['Quincaillerie', 'Fixations, vis, boulons, écrous, charnières, serrures et composants métalliques'],
        ['Outillage', 'Outils à main, outils électriques, équipements de mesure et de sécurité'],
        ['Électricité', 'Composants électriques, câblage, interrupteurs, prises, luminaires']
      ];

      for (const category of categories) {
        await dbQuery.execute('INSERT INTO categories (name, description) VALUES (?, ?)', category);
      }

      // Insert sample Droguerie Jamal products
      const products = [
        // Droguerie products
        ['Colle PVC forte', 'Adhésif haute résistance pour tuyaux PVC', 1, 25.00, 35.00, 50, 10],
        ['Mastic d\'étanchéité universel', 'Mastic étanche pour joints et fissures', 1, 18.00, 28.00, 75, 15],

        // Sanitaire products
        ['Robinet mélangeur chromé', 'Robinet mélangeur pour cuisine et salle de bain', 2, 150.00, 220.00, 25, 5],
        ['Tube PVC Ø100mm', 'Tuyau PVC 100mm pour évacuation', 2, 45.00, 65.00, 100, 20],

        // Peinture products
        ['Peinture murale blanche 10L', 'Peinture acrylique blanche pour murs intérieurs', 3, 180.00, 250.00, 40, 10],
        ['Rouleau de peinture professionnel', 'Rouleau pour finitions lisses', 3, 15.00, 25.00, 80, 20],

        // Quincaillerie products
        ['Vis à bois 4x40mm (boîte 100)', 'Vis pour menuiserie, tête fraisée', 4, 12.50, 18.00, 200, 50],
        ['Serrure de sécurité 3 points', 'Serrure haute sécurité avec 3 clés', 4, 85.00, 125.00, 15, 5],

        // Outillage products
        ['Perceuse visseuse 18V', 'Perceuse sans fil avec batterie et chargeur', 5, 280.00, 420.00, 12, 3],
        ['Marteau de charpentier 500g', 'Marteau avec manche bois', 5, 35.00, 55.00, 25, 8],

        // Électricité products
        ['Câble électrique 2.5mm² (rouleau 100m)', 'Câble pour installations électriques', 6, 85.00, 120.00, 20, 5],
        ['Interrupteur simple blanc', 'Interrupteur mural blanc', 6, 12.00, 18.00, 100, 25],

        // Additional test products for inventory management
        ['Clé à molette 250mm', 'Clé réglable en acier chromé pour plomberie', 5, 45.00, 75.00, 15, 3],
        ['Tournevis cruciforme PH2', 'Tournevis professionnel manche isolé', 5, 8.50, 15.00, 60, 12],
        ['Flexible douche 1.5m', 'Flexible en inox pour douchette', 2, 22.00, 35.00, 30, 8],
        ['Ampoule LED 12W E27', 'Ampoule économique blanc chaud', 6, 18.00, 28.00, 80, 20],
        ['Papier abrasif P120 (feuille)', 'Papier de verre grain moyen', 3, 2.50, 4.50, 150, 30],
        ['Chevilles fischer Ø8mm (boîte 50)', 'Chevilles universelles avec vis', 4, 15.00, 25.00, 90, 25]
      ];

      for (const product of products) {
        await dbQuery.execute(`
          INSERT INTO products (name, description, category_id, purchase_price, selling_price, remaining_stock, min_stock_level)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, product);
      }

      console.log('Sample data inserted successfully');
    } else {
      console.log('Database already contains data, skipping sample data insertion');
    }
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Ensure uploads directory exists
async function ensureUploadsDir() {
  try {
    await fs.access('uploads');
  } catch {
    await fs.mkdir('uploads', { recursive: true });
  }
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000 // 5MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// API Routes

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const rows = await dbQuery.execute('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, categories: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all products with optional filtering
app.get('/api/products', async (req, res) => {
  try {
    const { search = '', category = 'all' } = req.query;

    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category !== 'all') {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    query += ' ORDER BY p.created_at DESC';

    const rows = await dbQuery.execute(query, params);
    res.json({ success: true, products: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, category_id, purchase_price, selling_price, remaining_stock, min_stock_level, image_url } = req.body;

    const result = await dbQuery.execute(`
      INSERT INTO products (name, description, category_id, purchase_price, selling_price, remaining_stock, min_stock_level, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, description, category_id, purchase_price, selling_price, remaining_stock, min_stock_level || 10, image_url || null]);

    const insertId = result.insertId;
    res.json({ success: true, id: insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update product
app.put('/api/products', async (req, res) => {
  try {
    const { id, name, description, category_id, purchase_price, selling_price, remaining_stock, min_stock_level, image_url } = req.body;

    const updateQuery = `UPDATE products SET name = ?, description = ?, category_id = ?, purchase_price = ?, selling_price = ?, remaining_stock = ?, min_stock_level = ?, image_url = ? WHERE id = ?`;

    await dbQuery.execute(updateQuery, [name, description, category_id, purchase_price, selling_price, remaining_stock, min_stock_level, image_url, id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product
app.delete('/api/products', async (req, res) => {
  try {
    const { id } = req.query;

    // Get the product to check if it has an image
    const products = await dbQuery.execute('SELECT image_url FROM products WHERE id = ?', [id]);

    if (products.length > 0 && products[0].image_url) {
      try {
        const imagePath = path.join(__dirname, products[0].image_url);
        await fs.unlink(imagePath);
      } catch (unlinkError) {
        console.error('Error deleting image file:', unlinkError);
      }
    }

    await dbQuery.execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// File upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});

// Delete uploaded image
app.delete('/api/upload', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (imageUrl) {
      const imagePath = path.join(__dirname, imageUrl);
      await fs.unlink(imagePath);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({
      success: true,
      message: 'MySQL database connected successfully',
      database: 'MySQL',
      config: {
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'inventory_manager',
        port: process.env.DB_PORT || 3306
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database connection failed',
      details: error.message
    });
  }
});

// Start server
async function startServer() {
  await ensureUploadsDir();
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database mode: MySQL`);
    console.log(`MySQL Database: ${process.env.DB_NAME || 'inventory_manager'} on ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
  });
}

startServer();
