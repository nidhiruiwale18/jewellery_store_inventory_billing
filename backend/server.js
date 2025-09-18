const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3001; // Use a different port than the React app

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// API Routes

// GET /api/inventory: Fetch all items
app.get('/api/inventory', (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const itemsWithImageUrls = rows.map(item => ({
      ...item,
      image_url: item.image_url ? http://localhost:${PORT}/uploads/${path.basename(item.image_url)} : null
    }));
    res.json(itemsWithImageUrls);
  });
});

// POST /api/inventory: Add a new item
app.post('/api/inventory', upload.single('image'), (req, res) => {
  const { name, type, weight, price, quantity } = req.body;
  const image_url = req.file ? req.file.path : null;
  db.run(
    INSERT INTO items (name, type, weight, price, quantity, image_url) VALUES (?, ?, ?, ?, ?, ?),
    [name, type, weight, price, quantity, image_url],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Item added successfully', id: this.lastID });
    }
  );
});

// POST /api/bill: Generate a bill
app.post('/api/bill', (req, res) => {
  const { customer, itemId, qty } = req.body;
  const quantitySold = parseInt(qty, 10);
  const item_id = parseInt(itemId, 10);

  db.get('SELECT * FROM items WHERE id = ?', [item_id], (err, item) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    if (item.quantity < quantitySold) {
      return res.status(400).json({ error: 'Not enough stock' });
    }

    const total_price = item.price * item.weight * quantitySold;

    db.run(
      INSERT INTO bills (customer_name, item_id, quantity, total_price) VALUES (?, ?, ?, ?),
      [customer, item_id, quantitySold, total_price],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        db.run(
          UPDATE items SET quantity = quantity - ? WHERE id = ?,
          [quantitySold, item_id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Bill generated and inventory updated', bill_id: this.lastID, total_price });
          }
        );
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(Server is running on http://localhost:${PORT});
});const express = require('express');
const cors = require('cors');
const multer = require('multer');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3001; // Use a different port than the React app

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// API Routes

// GET /api/inventory: Fetch all items
app.get('/api/inventory', (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const itemsWithImageUrls = rows.map(item => ({
      ...item,
      image_url: item.image_url ? http://localhost:${PORT}/uploads/${path.basename(item.image_url)} : null
    }));
    res.json(itemsWithImageUrls);
  });
});

// POST /api/inventory: Add a new item
app.post('/api/inventory', upload.single('image'), (req, res) => {
  const { name, type, weight, price, quantity } = req.body;
  const image_url = req.file ? req.file.path : null;
  db.run(
    INSERT INTO items (name, type, weight, price, quantity, image_url) VALUES (?, ?, ?, ?, ?, ?),
    [name, type, weight, price, quantity, image_url],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Item added successfully', id: this.lastID });
    }
  );
});

// POST /api/bill: Generate a bill
app.post('/api/bill', (req, res) => {
  const { customer, itemId, qty } = req.body;
  const quantitySold = parseInt(qty, 10);
  const item_id = parseInt(itemId, 10);

  db.get('SELECT * FROM items WHERE id = ?', [item_id], (err, item) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    if (item.quantity < quantitySold) {
      return res.status(400).json({ error: 'Not enough stock' });
    }

    const total_price = item.price * item.weight * quantitySold;

    db.run(
      INSERT INTO bills (customer_name, item_id, quantity, total_price) VALUES (?, ?, ?, ?),
      [customer, item_id, quantitySold, total_price],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        db.run(
          UPDATE items SET quantity = quantity - ? WHERE id = ?,
          [quantitySold, item_id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Bill generated and inventory updated', bill_id: this.lastID, total_price });
          }
        );
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(Server is running on http://localhost:${PORT});
});
