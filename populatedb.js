#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const Category = require('./models/category');
const Item = require('./models/item');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const categories = [];
const items = [];

function categoryCreate(title, description, cb) {
  const category = new Category({ title, description });

  category.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category);
    cb(null, category);
  })
}

function itemCreate(title, description, price, quantity, category, cb) {
  const item = new Item({ title, description, price, quantity, category });

  item.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item);
    cb(null, item);
  })
}

function createCategories(cb) {
  async.parallel([
    function(callback) {
      categoryCreate('Tables', 'Our collection of tables.', callback)
    },
    function(callback) {
      categoryCreate('Seating', 'Our collection of seating.', callback);
    },
    function(callback) {
      categoryCreate('Storage', 'Our collection of storage solutions.', callback);
    }
  ], cb)
}

function createItems(cb) {
  async.parallel([
    function(callback) {
      itemCreate('Wooden Table', 'Made of sustainably sourced hardwood.', 900, 2, categories[0], callback);
    },
    function(callback) {
      itemCreate('Gold Table', 'Made entirely of gold because why not.', 198000, 1, categories[0], callback);
    },
    function(callback) {
      itemCreate('Paper Chair', 'Don\'t sit on it.', 129, 5, categories[1], callback);
    },
    function(callback) {
      itemCreate('Tall Cabinet', 'Cabinet is 20\' high. You\'ll need a ladder.', 798, 3, categories[2], callback);
    }
  ], cb)
}

async.series(
  [
    createCategories,
    createItems
  ],
  // Optional callback
  function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('Items: ' + items); 
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);