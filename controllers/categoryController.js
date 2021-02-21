const Category = require('../models/category');
const Item = require('../models/item');

const async = require('async');

// Display categories
exports.categoryList = (req, res, next) => {
  Category
  .find()
  .sort([['title', 'ascending']])
  .exec(function(err, categories) {
    if (err) return next(err);
    res.render('categoryList', { title: 'Categories', categories });
  })
};

// Display items in category
exports.categoryDetail = (req, res, next) => {
  async.parallel({
    category: function(callback) {
      Category.findById(req.params.id).exec(callback);
    },
    items: function(callback) {
      Item.find({ 'category': req.params.id }).exec(callback);
    }
  },
  function(err, results) {
    if (err) return next(err);
    if (results.category === null) {
      const err = new Error('Category not found.');
      err.status = 404;
      return next(err);
    };
    res.render('categoryDetail', { title: results.category.title, items: results.items });
  })
};

// Display category create form on GET
exports.categoryCreateGet = (req, res, next) => {
  res.send('Not yet implemented.');
};

// Handle category create form on POST
exports.categoryCreatePost = (req, res, next) => {
  res.send('Not yet implemented.');
};

// Display category delete form on GET
exports.categoryDeleteGet = (req, res, next) => {
  res.send('Not yet implemented.');
};

// Handle category delete form on POST
exports.categoryDeletePost = (req, res, next) => {
  res.send('Not yet implemented.');
};

// Display category update form on GET
exports.categoryUpdateGet = (req, res, next) => {
  res.send('Not yet implemented.');
};

// Handle category update form on POST
exports.categoryUpdatePost = (req, res, next) => {
  res.send('Not yet implemented.');
};