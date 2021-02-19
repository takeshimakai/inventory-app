const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true }
  }
)

CategorySchema.virtual('url').get(function() {
  const formattedTitle = this.title.toLowerCase().replace(/\s/g, '-');
  return `/${formattedTitle}`;
});

module.exports = mongoose.model('Category', CategorySchema);