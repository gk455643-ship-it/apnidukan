const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Name is Mandatory"],
    },
    maincategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Maincategory",
      required: [true, "Maincategory Id is Mandatory"],
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: [true, "Subcategory Id is Mandatory"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand Id is Mandatory"],
    },
    color: {
      type: Array,
      required: [true, "Product Color is Mandatory"],
    },
    size: {
      type: Array,
      required: [true, "Product Size is Mandatory"],
    },
    basePrice: {
      type: Number,
      required: [true, "Product Base Price is Mandatory"],
    },
    discount: {
      type: Number,
      required: [true, "Discount on Product is Mandatory"],
    },
    finalPrice: {
      type: Number,
      required: [true, "Product Final Price is Mandatory"],
    },
    stock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, "Product Stock Quantity is Mandatory"],
    },
    description: {
      type: String,
      default: "",
    },
    pic: {
      type: Array,
      required: [true, "Product Pic is Mandatory"],
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
