const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }, //esto es para hacer una relacion con otra tabla
  quantity: {
    type: Number,
    default: 1,
    //se pone default porque no sabemos cuantos productos va a querer
  },
  //en ref:'' va el nombre con el que queremos conectar en este caso es Product
});

//el primer valor de aqui es el nombre en este caso "Order"
module.exports = mongoose.model("Order", orderSchema);
