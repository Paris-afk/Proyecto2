const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  //esto es para hacer que los campos sean requeridos
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
