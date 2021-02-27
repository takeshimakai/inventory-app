const Item = require('../models/item');
const Category = require('../models/category');

const async = require('async');
const { body, validationResult } = require('express-validator');

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
  Item
  .findById(req.params.id)
  .populate('category')
  .exec(function(err, item) {
    if (err) return next(err);
    res.render('itemDetail', { title: item.title, item });
  });
};

// Display item create form on GET
exports.itemCreateGet = (req, res, next) => {
  Category
  .find()
  .sort([['title', 'ascending']])
  .exec(function(err, categories) {
    if (err) return next(err);
    res.render('itemForm', { title: 'Create Item', categories });
  });
};

// Handle item create form on POST
exports.itemCreatePost = [
  body('title')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage('Please enter title.'),

  body('description')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Please enter description.'),

  (req, res, next) => {
    const item = new Item(
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        photo: { data: req.file.buffer, contentType: req.file.mimetype }
      }
    )

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      Category
      .find()
      .sort([['title', 'ascending']])
      .exec(function(err, categories) {
        if (err) return next(err);
        res.render('itemForm', { title: 'Create Item', categories, item, errors: errors.array() });
      });
      return;
    } else {
      item.save(function(err) {
        if (err) return next(err);
        res.redirect(item.url);
      })
    }
  }
];

// Display item delete form on GET
exports.itemDeleteGet = (req, res, next) => {
  Item.findById(req.params.id).exec(function(err, item) {
    if (err) return next(err);
    res.render('itemDelete', { title: `Delete Item: ${item.title}`, item });
  });
};

// Handle item delete form on POST
exports.itemDeletePost = (req, res, next) => {
  Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
    if (err) return next(err);
    res.redirect('/item');
  })
};

// Display item edit form on GET
exports.itemEditGet = (req, res, next) => {
  async.parallel({
    item: function(callback) {
      Item.findById(req.params.id).exec(callback);
    },
    categories: function(callback) {
      Category.find().exec(callback);
    }
  },
  function(err, results) {
    if (err) return next(err);
    res.render('itemForm', { title: `Edit Item: ${results.item.title}`, item: results.item, categories: results.categories });
  });
};

// Handle item edit form on POST
exports.itemEditPost = [
  body('title')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage('Please enter title.'),

  body('description')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Please enter description.'),

  (req, res, next) => {
    const item = new Item(
      {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        photo: { data: req.file.buffer, contentType: req.file.mimetype },
        _id: req.params.id
      }
    );

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      Category
      .find()
      .sort([['title', 'ascending']])
      .exec(function(err, categories) {
        if (err) return next(err);
        res.render('itemForm', { title: `Edit Item: ${item.title}`, categories, item, errors: errors.array() });
      });
      return;
    } else {
      Item.findByIdAndUpdate(req.params.id, item, {}, function(err, theItem) {
        if (err) return next(err);
        res.redirect(theItem.url);
      })
    }
  }
];