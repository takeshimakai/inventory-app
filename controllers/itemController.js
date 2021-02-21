const Item = require('../models/item');
const Category = require('../models/category');

const async = require('async');

// Display list of items
exports.itemList = (req, res, next) => {
  Item
  .find()
  .sort([['title', 'ascending']])
  .populate('category')
  .exec(function(err, items) {
    if (err) return next(err);
    res.render('itemList', { title: 'Items', items });
  });
};

// Display detail page of item
exports.itemDetail = (req, res, next) => {
  Item.findById(req.params.id).exec(function(err, item) {
    if (err) return next(err);
    res.render('itemDetail', { title: item.title, item });
  });
};

// Display item create form on GET
exports.itemCreateGet = (req, res, next) => {
  res.send('Not yet implemented.');
};

// Handle item create form on POST
exports.itemCreatePost = (req, res, next) => {
  res.send('Not yet implemented.');
};

// Display item delete form on GET
exports.itemDeleteGet = (req, res, next) => {
  res.send('Not yet implemented.');
};

// Handle item delete form on POST
exports.itemDeletePost = (req, res, next) => {
  res.send('Not yet implemented.');
};

// Display item edit form on GET
exports.itemEditGet = (req, res, next) => {
  res.send('Not yet implemented.');
};

// Handle item edit form on POST
exports.itemEditPost = (req, res, next) => {
  res.send('Not yet implemented.');
};