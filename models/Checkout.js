const mongoose = require("mongoose");

const CheckoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is Mandatory"],
    },
    deliveryAddress: {
      type: Object,
      required: [true, "Delivery Address is Mandatory"],
    },
    orderStatus: {
      type: String,
      default: "Order is Placed",
    },
    paymentMode: {
      type: String,
      default: "COD",
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    rppid: {
      type: String,
      default: null,
    },
    shipping: {
      type: Number,
      required: [true, "Shipping Amount is Mandatory"],
    },
    total: {
      type: Number,
      required: [true, "Total Amount is Mandatory"],
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal Amount is Mandatory"],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product Id is Mandatory"],
        },
        color: {
          type: String,
          required: [true, "Color Field is Mandatory"],
        },
        size: {
          type: String,
          required: [true, "Size Field is Mandatory"],
        },
        qty: {
          type: Number,
          required: [true, "Product Quantity is Mandatory"],
        },
        total: {
          type: Number,
          required: [true, "Total Amount is Mandatory"],
        },
      },
    ],
  },
  { timestamps: true },
);

const Checkout = mongoose.model("Checkout", CheckoutSchema);
module.exports = Checkout;
