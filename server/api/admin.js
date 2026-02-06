const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');

// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');


// ================= LOGIN =================
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (admin) {
      const token = JwtUtil.genToken();
      res.json({
        success: true,
        message: 'Authentication successful',
        token: token
      });
    } else {
      res.json({
        success: false,
        message: 'Incorrect username or password'
      });
    }
  } else {
    res.json({
      success: false,
      message: 'Please input username and password'
    });
  }
});


// ================= CHECK TOKEN =================
router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({
    success: true,
    message: 'Token is valid',
    token: token
  });
});


// ================= CATEGORY =================
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const category = { name: name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});

router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id.trim();
    const name = req.body.name;
    const category = { _id: _id, name: name };
    const result = await CategoryDAO.update(category);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    console.log('Deleting category with ID:', _id);
    const result = await CategoryDAO.delete(_id);
    console.log('Delete result:', result);
    res.json(result);
  } catch (error) {
    console.error('Delete category error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ================= PRODUCT =================
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  // get data
  var products = await ProductDAO.selectAll();
  // pagination
  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page); // /products?page=xxx
  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);
  // return
  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});

router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = { name: name, price: price, image: image, cdate: now, category: category };
  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;  // Changed from req.body.id
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const now = new Date().getTime(); // milliseconds
    const category = await CategoryDAO.selectByID(cid);
    const product = { _id: _id, name: name, price: price, image: image, cdate: now, category: category };
    const result = await ProductDAO.update(product);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const result = await ProductDAO.delete(_id);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ⬇️ EXPORT MUST BE AT THE END OF FILE
module.exports = router;