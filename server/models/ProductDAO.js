require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const ProductDAO = {
  async selectAll() {
    try {
      const products = await Models.Product
        .find({})
        .sort({ cdate: -1 })
        .exec();
      return products;
    } catch (error) {
      console.error('Error selecting all products:', error);
      throw error;
    }
  },

  async selectByID(_id) {
    try {
      // Validate ObjectId before querying
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return null;
      }
      const product = await Models.Product.findById(_id).exec();
      return product;
    } catch (error) {
      console.error('Error selecting product by ID:', error);
      return null;
    }
  },

  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 }; // descending
    const products = await Models.Product.find(query).sort(mysort).limit(top).exec();
    return products;
  },

  async selectTopHot(top) {
    const items = await Models.Order.aggregate([
      { $match: { status: 'APPROVED ' } },
      { $unwind: '$items ' },
      { $group: { _id: '$items.product._id', sum: { $sum: '$items.quantity' } } },
      { $sort: { sum: -1 } }, // descending
      { $limit: top }
    ]).exec();
    var products = [];
    for (const item of items) {
      const product = await ProductDAO.selectByID(item._id);
      products.push(product);
    }
    // If no hot products from orders, return top new products
    if (products.length === 0) {
      products = await ProductDAO.selectTopNew(top);
    }
    return products;
  },

  async selectByCatID(_cid) {
    try {
      // Validate ObjectId before querying
      if (!mongoose.Types.ObjectId.isValid(_cid)) {
        return [];
      }
      const query = { 'category._id': new mongoose.Types.ObjectId(_cid) };
      const products = await Models.Product.find(query).exec();
      return products;
    } catch (error) {
      console.error('Error selecting products by category ID:', error);
      return [];
    }
  },

  async selectByKeyword(keyword) {
    const query = { name: { $regex: new RegExp(keyword, "i") } };
    const products = await Models.Product.find(query).exec();
    return products;
  },

  async insert(product) {
    try {
      product._id = new mongoose.Types.ObjectId();
      const result = await Models.Product.create(product);
      return { success: true, message: 'Product created successfully', data: result };
    } catch (error) {
      console.error('Error inserting product:', error);
      return { success: false, message: error.message };
    }
  },

  async update(product) {
    try {
      const idString = String(product._id).trim();
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(idString)) {
        return { success: false, message: 'Invalid product ID format' };
      }
      
      const newvalues = { 
        name: product.name, 
        price: product.price, 
        image: product.image,
        cdate: product.cdate,
        category: product.category 
      };
      
      const result = await Models.Product.findByIdAndUpdate(
        idString, 
        newvalues, 
        { new: true }
      );
      
      if (!result) {
        return { success: false, message: 'Product not found' };
      }
      
      return { success: true, message: 'Product updated successfully', data: result };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, message: error.message };
    }
  },

  async delete(_id) {
    try {
      const idString = String(_id).trim();
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(idString)) {
        return { success: false, message: 'Invalid product ID format' };
      }
      
      const result = await Models.Product.deleteOne({ 
        _id: new mongoose.Types.ObjectId(idString) 
      });
      
      if (result.deletedCount === 0) {
        return { success: false, message: 'Product not found' };
      }
      
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, message: error.message };
    }
  }
};

module.exports = ProductDAO;