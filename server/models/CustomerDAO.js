require('../utils/MongooseUtil');
const Models = require('./Models');

const CustomerDAO = {
  async selectByUsernameOrEmail(username, email) {
    // normalize input
    const u = username ? username.toString().trim().toLowerCase() : '';
    const e = email ? email.toString().trim().toLowerCase() : '';

    const query = {
      $or: []
    };
    if (u) query.$or.push({ username: u });
    if (e) query.$or.push({ email: e });

    if (query.$or.length === 0) return null;

    // perform case-insensitive search using regex for extra safety
    // but stored usernames/emails should already be lowercase
    const customer = await Models.Customer.findOne(query).exec();
    if (customer) {
      console.log('selectByUsernameOrEmail matched:', customer.username, customer.email);
    }
    return customer;
  },

  async insert(customer) {
    const mongoose = require('mongoose');
    // normalize fields
    if (customer.username) customer.username = customer.username.toString().trim().toLowerCase();
    if (customer.email) customer.email = customer.email.toString().trim().toLowerCase();
    customer._id = new mongoose.Types.ObjectId();
    const result = await Models.Customer.create(customer);
    return result;
  },

  async active(_id, token, active) {
    const query = { _id: _id, token: token };
    const newvalues = { active: active };
    const result = await Models.Customer.findOneAndUpdate(query, newvalues, { new: true });
    return result;
  },

  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },

  async update(customer) {
    // update basic profile fields (not token/active)
    const newvalues = {
      username: customer.username,
      password: customer.password,
      name: customer.name,
      phone: customer.phone,
      email: customer.email
    };
    const result = await Models.Customer.findByIdAndUpdate(
      customer._id,
      newvalues,
      { new: true }
    );
    return result;
  }
};

module.exports = CustomerDAO;