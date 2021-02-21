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

// GET request for updating a category
router.get('/category/:id/update', categoryController.categoryUpdateGet);

// POST request for updating a category
router.post('/category/:id/update', categoryController.categoryUpdatePost);

// GET list of items in category
router.get('/category/:id', categoryController.categoryDetail);

/// Item Routes ///

// GET item list
router.get('/item', itemController.itemList);

// GET item detail
router.get('/item/:id', itemController.itemDetail);

// GET item create form
router.get('/item/create', itemController.itemCreateGet);

//POST item create form
router.post('/item/create', itemController.itemCreatePost);

// GET item delete form
router.get('/item/:id/delete', itemController.itemDeleteGet);

// POST item delete form
router.post('/item/:id/delete', itemController.itemDeletePost);

// GET item update form
router.get('/item/:id/update', itemController.itemUpdateGet);

// POST item update form
router.post('/item/:id/update', itemController.itemUpdatePost);

module.exports = router;