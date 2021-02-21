const Category = require('../models/category');
const Item = require('../models/item');

const async = require('async');
const { body, validationResult } = require('express-validator');

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
    res.render('categoryDetail', { title: results.category.title, items: results.items, category: results.category });
  })
};

// Display category create form on GET
exports.categoryCreateGet = (req, res, next) => {
  res.render('categoryForm', { title: 'Create Category' });
};

// Handle category create form on POST
exports.categoryCreatePost = [
  body('category')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage('Please enter category.')
  .isAlpha()
  .withMessage('Category must be alphabet letters.'),

  body('description')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Please enter description.'),

  (req, res, next) => {
    const category = new Category(
      {
        title: req.body.category,
        description: req.body.description
      }
    );

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('categoryForm', { title: 'Create Category', category, errors: errors.array() });
      return;
    } else {
      Category.findOne({ 'title': category.title }).exec(function(err, foundCategory) {
        if (err) return next(err);
        if (foundCategory) {
          res.redirect(foundCategory.url);
        } else {
          category.save(function(err) {
            if (err) return next(err);
            res.redirect(category.url);
          });
        }
      });
    }
  }
];

// Display category delete form on GET
exports.categoryDeleteGet = (req, res, next) => {
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
    if (results.category == null) {
      res.redirect('/category');
    }
    res.render('categoryDelete', { category: results.category, items: results.items });
  })
};

// Handle category delete form on POST
exports.categoryDeletePost = (req, res, next) => {
  async.parallel({
    category: function(callback) {
      Category.findById(req.body.categoryid).exec(callback);
    },
    items: function(callback) {
      Item.find({ 'category': req.body.categoryid }).exec(callback);
    }
  },
  function(err, results) {
    if (err) return next(err);
    if (results.items.length > 0) {
      res.render('categoryDelete', { category: results.category, items: results.items });
      return;
    } else {
      Category.findByIdAndRemove(req.body.categoryid, function deleteCategory(err) {
        if (err) return next(err);
        res.redirect('/category');
      })
    }
  })
};

// Display category edit form on GET
exports.categoryEditGet = (req, res, next) => {
  Category.findById(req.params.id).exec(function(err, category) {
    if (err) return next(err);
    res.render('categoryForm', { title: `Edit Category: ${category.title}`, category });
  })
};

// Handle category edit form on POST
exports.categoryEditPost = [
  body('category')
  .trim()
  .isLength({ min: 1 })
  .escape()
  .withMessage('Please enter category.')
  .isAlpha()
  .withMessage('Category must be alphabet letters.'),

  body('description')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Please enter description.'),

  (req, res, next) => {
    const category = new Category(
      {
        title: req.body.category,
        description: req.body.description,
        _id: req.params.id
      }
    );

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('categoryForm', { title: `Edit Category: ${category.title}`, category, errors: errors.array() });
      return;
    } else {
      Category.findByIdAndUpdate(req.params.id, category, {}, function(err, theCategory) {
        if (err) return next(err);
        res.redirect(theCategory.url);
      })
    }
  }
]