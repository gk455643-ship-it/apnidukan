const Checkout = require("../models/Checkout");
const mailer = require("../mailer/index");
const Razorpay = require("razorpay");

//Payment API
async function order(req, res) {
  try {
    const instance = new Razorpay({
      key_id: process.env.RPKEYID,
      key_secret: process.env.RPSECRETKEY,
    });
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
    };
    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
}
async function verifyOrder(req, res) {
  try {
    var check = await Checkout.findOne({ _id: req.body.checkid });
    check.rppid = req.body.razorpay_payment_id;
    check.paymentStatus = "Done";
    check.paymentMode = "Net Banking";
    await check.save();
    res.status(200).send({ result: "Done", message: "Payment Successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
}

async function createRecord(req, res) {
  try {
    let data = new Checkout(req.body);
    await data.save();
    let finalData = await Checkout.findOne({ _id: data._id })
      .populate("user", ["name", "username","email","phone"])
      .populate({
        path: "products.product",
        select: "name brand finalPrice stockQuantity stock pic",
        populate: {
          path: "brand",
          select: "-_id name",
        },
        options: {
          slice: {
            pic: 1,
          },
        },
      })
      .sort({ _id: -1 });

    res.send({
      result: "Done",
      data: finalData,
    });
    console.log(data);
    mailer.sendMail(
      {
        from: process.env.MAILER,
        to: data.deliveryAddress?.email,
        subject: `Your Order Has Been Placed Successfully 🎉`,
        html: `<div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 0;">
                          <tr>
                            <td align="center">
                              
                              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                                
                                <!-- Header -->
                                <tr>
                                  <td style="background-color:#0b3d91;padding:25px;text-align:center;">
                                    <h1 style="color:#ffffff;margin:0;font-size:24px;">
                                      ${process.env.SITE_NAME}
                                    </h1>
                                    <p style="color:#dbe6ff;margin:5px 0 0 0;font-size:13px;">
                                      Order Confirmation
                                    </p>
                                  </td>
                                </tr>

                                <!-- Body -->
                                <tr>
                                  <td style="padding:40px 30px;color:#333333;">
                                    
                                    <h2 style="margin-top:0;color:#0b3d91;font-size:20px;">
                                      🎉 Your Order Has Been Placed!
                                    </h2>

                                    <p style="font-size:15px;line-height:24px;">
                                      Hello <strong>${data.deliveryAddress.name}</strong>,
                                    </p>

                                    <p style="font-size:15px;line-height:24px;">
                                      Thank you for shopping with <strong>${process.env.SITE_NAME}</strong>.  
                                      Your order has been successfully placed.
                                    </p>

                                    <!-- Order Details -->
                                    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;margin-top:20px;">
                                      <tr>
                                        <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Order ID</strong></td>
                                        <td style="border:1px solid #ddd;">${data._id}</td>
                                      </tr>
                                      <tr>
                                        <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Order Date</strong></td>
                                        <td style="border:1px solid #ddd;">${data.createdAt}</td>
                                      </tr>
                                      <tr>
                                        <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Payment Method</strong></td>
                                        <td style="border:1px solid #ddd;">${data.paymentMode}</td>
                                      </tr>
                                      <tr>
                                        <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Total Amount</strong></td>
                                        <td style="border:1px solid #ddd;">₹ ${data.total}</td>
                                      </tr>
                                    </table>

                                    <p style="font-size:14px;line-height:22px;color:#555555;margin-top:20px;">
                                      📦 We are now preparing your order for shipment.  
                                      You will receive another email once it has been shipped.
                                    </p>

                                    <!-- CTA Button -->
                                    <div style="text-align:center;margin:30px 0;">
                                      <a href="${process.env.SITE_URL}/profile/option=Order" 
                                        style="background-color:#0b3d91;color:#ffffff;
                                                text-decoration:none;padding:12px 30px;
                                                font-size:14px;border-radius:5px;
                                                display:inline-block;">
                                        Track Your Order
                                      </a>
                                    </div>

                                    <p style="font-size:14px;color:#555555;">
                                      Thank you for choosing us 💙<br>
                                      <strong style="color:#0b3d91;">Team ${process.env.SITE_NAME}</strong>
                                    </p>

                                  </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                  <td style="background-color:#0b3d91;padding:20px;text-align:center;">
                                    <p style="color:#ffffff;font-size:12px;margin:0;">
                                      © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                                    </p>
                                    <p style="color:#dbe6ff;font-size:12px;margin:5px 0 0 0;">
                                      This is an automated transactional email.
                                    </p>
                                  </td>
                                </tr>

                              </table>

                            </td>
                          </tr>
                        </table>
                      </div>`,
      },
      (error) => {
        console.log(error);
      },
    );
  } catch (error) {
    // let errorMessage = {};
    // error?.errors?.name? (errorMessage.name = error?.errors?.name?.message): "";
    // error?.errors?.maincategory? (errorMessage.maincategory = error?.errors?.maincategory?.message): "";
    // error?.errors?.subcategory? (errorMessage.subcategory = error?.errors?.subcategory?.message): "";
    // error?.errors?.brand? (errorMessage.brand = error?.errors?.brand?.message): "";
    // error?.errors?.color? (errorMessage.color = error?.errors?.color?.message): "";
    // error?.errors?.size? (errorMessage.size = error?.errors?.size?.message): "";
    // error?.errors?.basePrice? (errorMessage.basePrice = error?.errors?.basePrice?.message): "";
    // error?.errors?.discount? (errorMessage.discount = error?.errors?.discount?.message): "";
    // error?.errors?.finalPrice? (errorMessage.finalPrice = error?.errors?.finalPrice?.message): "";
    // error?.errors?.stockQuantity? (errorMessage.stockQuantity = error?.errors?.stockQuantity?.message): "";
    // error?.errors?.pic ? (errorMessage.pic = error?.errors?.pic?.message) : "";
    let errorMessage = Object.fromEntries(
      Object.keys(error?.errors).map((key) => [key, error.errors[key].message]),
    );
    res.status(Object.values(errorMessage).length ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length
        ? errorMessage
        : "Interval Server Error",
    });
  }
}

async function getRecord(req, res) {
  try {
    let data = await Checkout.find()
      .populate("user", ["name", "username","email","phone"])
      .populate({
        path: "products.product",
        select: "name brand finalPrice stockQuantity stock pic",
        populate: {
          path: "brand",
          select: "-_id name",
        },
        options: {
          slice: {
            pic: 1,
          },
        },
      })
      .sort({ _id: -1 });
    res.send({
      result: "Done",
      count: data.length,
      data: data,
    });
  } catch (error) {
    res.send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}
async function getUserRecord(req, res) {
  try {
    let data = await Checkout.find({ user: req.params.userid })
      .populate("user", ["name", "username","email","phone"])
      .populate({
        path: "products.product",
        select: "name brand finalPrice stockQuantity stock pic",
        populate: {
          path: "brand",
          select: "-_id name",
        },
        options: {
          slice: {
            pic: 1,
          },
        },
      })
      .sort({ _id: -1 });
    res.send({
      result: "Done",
      count: data.length,
      data: data,
    });
  } catch (error) {
    res.send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}

async function getSingleRecord(req, res) {
  try {
    let data = await Checkout.findOne({ _id: req.params._id })
      .populate("user", ["name", "username","email","phone"])
      .populate({
        path: "products.product",
        select: "name brand finalPrice stockQuantity stock pic",
        populate: {
          path: "brand",
          select: "-_id name",
        },
        options: {
          slice: {
            pic: 1,
          },
        },
      })
      .sort({ _id: -1 });
    if (data) {
      res.send({
        result: "Done",
        data: data,
      });
    } else {
      res.status(404).send({
        result: "Fail",
        reason: "Record Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}

async function updateRecord(req, res) {
  try {
    let data = await Checkout.findOne({ _id: req.params._id });
    if (data) {
      data.orderStatus = req.body.orderStatus ?? data.orderStatus;
      data.paymentMode = req.body.paymentMode ?? data.paymentMode;
      data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus;
      data.rppid = req.body.rppid ?? data.rppid;

      await data.save();

      let finalData = await Checkout.findOne({ _id: data._id })
        .populate("user", ["name", "username","email","phone"])
        .populate({
          path: "products.product",
          select: "name brand finalPrice stockQuantity stock pic",
          populate: {
            path: "brand",
            select: "-_id name",
          },
          options: {
            slice: {
              pic: 1,
            },
          },
        })
        .sort({ _id: -1 });
      res.send({
        result: "Done",
        data: finalData,
      });
      mailer.sendMail(
        {
          from: process.env.MAILER,
          to: data.deliveryAddress?.email,
          subject: `Your Order Status Has Been Updated - ${process.env.SITE_NAME}`,
          html: `
          <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 0;">
                <tr>
                  <td align="center">
                    
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                      
                      <!-- Header -->
                      <tr>
                        <td style="background-color:#0b3d91;padding:25px;text-align:center;">
                          <h1 style="color:#ffffff;margin:0;font-size:24px;">
                            ${process.env.SITE_NAME}
                          </h1>
                          <p style="color:#dbe6ff;margin:5px 0 0 0;font-size:13px;">
                            Order Status Update
                          </p>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding:40px 30px;color:#333333;">
                          
                          <h2 style="margin-top:0;color:#0b3d91;font-size:20px;">
                            📦 Order Update
                          </h2>

                          <p style="font-size:15px;line-height:24px;">
                            Hello <strong>${data.deliveryAddress.name}</strong>,
                          </p>

                          <p style="font-size:15px;line-height:24px;">
                            The status of your order has been updated.
                          </p>

                          <!-- Order Info Table -->
                          <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;margin-top:20px;">
                            <tr>
                              <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Order ID</strong></td>
                              <td style="border:1px solid #ddd;">${data._id}</td>
                            </tr>
                            <tr>
                              <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Current Status</strong></td>
                              <td style="border:1px solid #ddd;color:#0b3d91;font-weight:bold;">
                                ${data.orderStatus}
                              </td>
                            </tr>
                            <tr>
                              <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Updated On</strong></td>
                              <td style="border:1px solid #ddd;">${data.updatedAt}</td>
                            </tr>
                          </table>

                          <p style="font-size:14px;line-height:22px;color:#555555;margin-top:20px;">
                            You can track your order anytime by visiting your account.
                          </p>

                          <!-- CTA Button -->
                          <div style="text-align:center;margin:30px 0;">
                            <a href="${process.env.SITE_URL}/profile?option=Order" 
                              style="background-color:#0b3d91;color:#ffffff;
                                      text-decoration:none;padding:12px 30px;
                                      font-size:14px;border-radius:5px;
                                      display:inline-block;">
                              Track Order
                            </a>
                          </div>

                          <p style="font-size:14px;color:#555555;">
                            If you have any questions, feel free to contact our support team.
                          </p>

                          <p style="font-size:14px;color:#555555;margin-top:20px;">
                            Thank you for shopping with us 💙<br>
                            <strong style="color:#0b3d91;">Team ${process.env.SITE_NAME}</strong>
                          </p>

                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color:#0b3d91;padding:20px;text-align:center;">
                          <p style="color:#ffffff;font-size:12px;margin:0;">
                            © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                          </p>
                          <p style="color:#dbe6ff;font-size:12px;margin:5px 0 0 0;">
                            This is an automated order update email.
                          </p>
                        </td>
                      </tr>

                    </table>

                  </td>
                </tr>
              </table>
            </div>`,
        },
        (error) => {
          console.log(error);
        },
      );
    } else {
      res.status(404).send({
        result: "Fail",
        reason: "Record Not Found",
      });
    }
  } catch (error) {
    let errorMessage = Object.fromEntries(
      Object.keys(error?.errors).map((key) => [key, error.errors[key].message]),
    );
    res.status(Object.values(errorMessage).length ? 400 : 500).send({
      result: "Fail",
      reason: Object.values(errorMessage).length
        ? errorMessage
        : "Interval Server Error",
    });
  }
}

async function deleteRecord(req, res) {
  try {
    let data = await Checkout.findOne({ _id: req.params._id });
    if (data) {
      await data.deleteOne();
      res.send({
        result: "Done",
      });
    } else {
      res.status(404).send({
        result: "Fail",
        reason: "Record Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}

module.exports = {
  createRecord: createRecord,
  getRecord: getRecord,
  getUserRecord: getUserRecord,
  getSingleRecord: getSingleRecord,
  updateRecord: updateRecord,
  deleteRecord: deleteRecord,
  order: order,
  verifyOrder: verifyOrder,
};
