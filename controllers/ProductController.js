const Product = require("../models/Product");
const Newsletter = require("../models/Newsletter");
const fs = require("fs");
const mailer = require("../mailer/index");

async function createRecord(req, res) {
  try {
    let data = new Product(req.body);
    if (req.files) {
      data.pic = Array.from(req.files).map((x) => x.path);
    }
    await data.save();
    let finalData = await Product.findOne({ _id: data._id })
      .populate("maincategory", ["name", "pic"])
      .populate("subcategory", ["name", "pic"])
      .populate("brand", ["name"]);
    res.send({
      result: "Done",
      data: finalData,
    });
    let newsletter = await Newsletter.find();

    newsletter.forEach((item) => {
      mailer.sendMail(
        {
          from: process.env.MAILER,
          to: item.email,
          subject: `Introducing Our New Arrival 🚀 - ${process.env.SITE_NAME}`,
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
                                  New Arrival Just Dropped!
                                </p>
                              </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                              <td style="padding:40px 30px;color:#333333;text-align:center;">
                                
                                <h2 style="margin-top:0;color:#0b3d91;font-size:22px;">
                                  🚀 Introducing Our Latest Product
                                </h2>

                                <p style="font-size:15px;line-height:24px;">
                                  Dear Customer,
                                </p>

                                <p style="font-size:15px;line-height:24px;">
                                  We’re excited to announce the launch of our newest product at 
                                  <strong>${process.env.SITE_NAME}</strong>!
                                </p>
                                <!-- Product Details -->
                                <h3 style="color:#0b3d91;margin-bottom:10px;">
                                  ${data.name}
                                </h3>

                                <p style="font-size:14px;line-height:22px;color:#555555;">
                                  ${data.description}
                                </p>

                                <p style="font-size:18px;color:#0b3d91;font-weight:bold;margin:15px 0;">
                                  ₹ ${data.finalPrice}
                                </p>

                                <!-- CTA Button -->
                                <div style="margin:30px 0;">
                                  <a href="${process.env.SITE_URL}/product/${data._id}" 
                                    style="background-color:#0b3d91;color:#ffffff;
                                            text-decoration:none;padding:12px 30px;
                                            font-size:14px;border-radius:5px;
                                            display:inline-block;">
                                    View Product
                                  </a>
                                </div>

                                <p style="font-size:14px;color:#555555;">
                                  Be among the first to grab it before it sells out!
                                </p>

                                <p style="font-size:14px;color:#555555;margin-top:25px;">
                                  Happy Shopping 💙<br>
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
                                  You are receiving this email because you are subscribed to updates.
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
    });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {}
    }
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
    let data = await Product.find()
      .populate("maincategory", ["name", "pic"])
      .populate("subcategory", ["name", "pic"])
      .populate("brand", ["name", "pic"])
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
    let data = await Product.findOne({ _id: req.params._id })
      .populate("maincategory", ["name", "pic"])
      .populate("subcategory", ["name", "pic"])
      .populate("brand", ["name", "pic"]);
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
    let data = await Product.findOne({ _id: req.params._id });
    if (data) {
      if (req.body.option) {
        data.stock = req.body.stock ?? data.stock;
        data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;
        await data.save();
      } else {
        data.name = req.body.name ?? data.name;
        data.maincategory = req.body.maincategory ?? data.maincategory;
        data.subcategory = req.body.subcategory ?? data.subcategory;
        data.brand = req.body.brand ?? data.brand;
        data.color = req.body.color ?? data.color;
        data.size = req.body.size ?? data.size;
        data.basePrice = req.body.basePrice ?? data.basePrice;
        data.discount = req.body.discount ?? data.discount;
        data.finalPrice = req.body.finalPrice ?? data.finalPrice;
        data.description = req.body.description ?? data.description;
        data.status = req.body.status ?? data.status;
        data.stock = req.body.stock ?? data.stock;
        data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;

        await data.save();
        if ((await data.save()) && req.files) {
          data.pic.forEach((x) => {
            if (!req.body.oldPics?.includes(x)) {
              fs.unlink(x, (error) => {});
            }
          });
          if (typeof req.body.oldPics === "undefined")
            data.pic = Array.from(req.files).map((x) => x.path);
          else
            data.pic = req.body.oldPics?.concat(
              Array.from(req.files).map((x) => x.path),
            );

          await data.save();
        }
      }
      let finalData = await Product.findOne({ _id: data._id })
        .populate("maincategory", ["name"])
        .populate("subcategory", ["name"])
        .populate("brand", ["name"]);
      res.send({
        result: "Done",
        data: finalData,
      });
    } else {
      res.status(404).send({
        result: "Fail",
        reason: "Record Not Found",
      });
    }
  } catch (error) {
    if (req.files) {
      Array.from(res.files).forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (error) {}
      });
    }
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
    let data = await Product.findOne({ _id: req.params._id });
    if (data) {
      data.pic.forEach((file) => {
        try {
          fs.unlinkSync(file);
        } catch (error) {}
      });
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
  getSingleRecord: getSingleRecord,
  updateRecord: updateRecord,
  deleteRecord: deleteRecord,
};
