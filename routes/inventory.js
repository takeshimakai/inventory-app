const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');

// '/' redirect
router.get('/', function(req, res) {
  res.redirect('/category');
});

/// Category Routes ///

// GET category list
router.get('/category', categoryController.categoryList);

// GET request for creating a category
router.get('/category/create', categoryController.categoryCreateGet);

// POST request for creating a category
router.post('/category/create', categoryController.categoryCreatePost);

// GET request for deleting a category
router.get('/category/:id/delete', categoryController.categoryDeleteGet);

// POST request for deleting a category
router.post('/category/:id/delete', categoryController.categoryDeletePost);

// GET request for editing a category
router.get('/category/:id/edit', categoryController.categoryEditGet);

// POST request for editing a category
router.post('/category/:id/edit', categoryController.categoryEditPost);

// GET list of items in category
router.get('/category/:id', categoryController.categoryDetail);

/// Item Routes ///

// GET item list
router.get('/item', itemController.itemList);

// GET item create form
router.get('/item/create', itemController.itemCreateGet);

//POST item create form
router.post('/item/create', itemController.itemCreatePost);

// GET item delete form
router.get('/item/:id/delete', itemController.itemDeleteGet);

// POST item delete form
router.post('/item/:id/delete', itemController.itemDeletePost);

// GET item edit form
router.get('/item/:id/edit', itemController.itemEditGet);

// POST item edit form
router.post('/item/:id/edit', itemController.itemEditPost);

// GET item detail
router.get('/item/:id', itemController.itemDetail);

module.exports = router;