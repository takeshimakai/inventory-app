const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    photo: { data: Buffer, contentType: String }
  }
)

ItemSchema.virtual('url').get(function() {
  return `/item/${this._id}`;
})

module.exports = mongoose.model('Item', ItemSchema);