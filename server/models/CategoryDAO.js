require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');

const CategoryDAO = {
  async selectAll() {
    try {
      const categories = await Models.Category.find({}).exec();
      return categories;
    } catch (error) {
      console.error('Error selecting all categories:', error);
      throw error;
    }
  },

  async selectByID(_id) {
    try {
      // Validate ObjectId before querying
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return null;
      }
      const category = await Models.Category.findById(_id).exec();
      return category;
    } catch (error) {
      console.error('Error selecting category by ID:', error);
      return null;
    }
  },

  async insert(category) {
    try {
      category._id = new mongoose.Types.ObjectId();
      const result = await Models.Category.create(category);
      return { success: true, message: 'Category created successfully', data: result };
    } catch (error) {
      console.error('Error inserting category:', error);
      return { success: false, message: error.message };
    }
  },

  async update(category) {
    try {
      const idString = String(category._id).trim();
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(idString)) {
        return { success: false, message: 'Invalid category ID format' };
      }
      
      const newvalues = { name: category.name };
      const result = await Models.Category.findByIdAndUpdate(
        idString, 
        newvalues, 
        { new: true }
      );
      
      if (!result) {
        return { success: false, message: 'Category not found' };
      }
      
      return { success: true, message: 'Category updated successfully', data: result };
    } catch (error) {
      console.error('Error updating category:', error);
      return { success: false, message: error.message };
    }
  },

  async delete(_id) {
    try {
      const idString = String(_id).trim();
      
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(idString)) {
        return { success: false, message: 'Invalid category ID format' };
      }
      
      const result = await Models.Category.deleteOne({ 
        _id: new mongoose.Types.ObjectId(idString) 
      });
      
      if (result.deletedCount === 0) {
        return { success: false, message: 'Category not found' };
      }
      
      return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, message: error.message };
    }
  }
};

module.exports = CategoryDAO;