const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function name(req, file, cb) {
    cb(null, "./uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

//el filtro no es obligatorio es solo por si no queremos que suban cualquier tipo de archivos
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    //si quisieramos mandar error si la imagen no fue valida seria y un callback
    //  cb(new Error("message"), true);
    cb(null, true); //esto es para aceptarlo
  } else {
    cb(null, false);
  }
};
//EL LIMITE Y EL FILTRO SON OPCIONALES
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //maximo 5MB
  },
  fileFilter: fileFilter,
}); //esto basicamente lo inicia y le pasamos la ubicacion ddonde guardara

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id productImage") //esto es para que muestro solo los datos que le estoy pidiendo
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        // product: docs, (esta es mi manera 1 !)
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/producs" + doc._id,
              required: "true",
            },
          };
        }),
      };
      //   if (docs.length >= 0) {
      // res.status(200).json(docs);
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", upload.single("productImage"), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created product succesfully",
        // createdProduct: result, (para evitar que solo muestre un resultado sin sentido es mejor enviar el objeto que deseamos asi que creamos el objeto)
        createdProduct: {
          name: result.name,
          price: result.price,
          id: result.id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })

    .exec()
    .then((result) => {
      // console.log(result);
      // res.status(200).json(result);
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http//localhost:3000/products" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "POST",
          url: "http://localhost:300/products",
          body: { name: "String", price: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
