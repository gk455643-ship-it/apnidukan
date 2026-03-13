const Newsletter = require("../models/Newsletter");
const mailer = require("../mailer/index");

async function createRecord(req, res) {
  try {
    let data = new Newsletter(req.body);
    await data.save();
    res.send({
      result: "Done",
      data: data,
    });
    mailer.sendMail(
      {
        from: process.env.MAILER,
        to: data.email,
        subject: `Thanks for Subscribing – Exciting Offers Coming Your Way!`,
        html: `<div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 0;">
                          <tr>
                            <td align="center">
                              
                              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                                <tr>
                                  <td style="background-color:#0b3d91;padding:25px;text-align:center;">
                                    <h1 style="color:#ffffff;margin:0;font-size:26px;letter-spacing:1px;">
                                      ${process.env.SITE_NAME}
                                    </h1>
                                    <p style="color:#dbe6ff;margin:5px 0 0 0;font-size:14px;">
                                      Stay Updated with Latest Offers
                                    </p>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:40px 30px;color:#333333;">
                                    <h2 style="margin-top:0;color:#0b3d91;font-size:22px;">
                                      🎉 Subscription Confirmed!
                                    </h2>
                                    <p style="font-size:15px;line-height:24px;margin-bottom:20px;">
                                      Thank you for subscribing to the <strong>${process.env.SITE_NAME}</strong> newsletter!
                                    </p>
                                    <p style="font-size:15px;line-height:24px;margin-bottom:25px;">
                                      You will now receive updates about:
                                    </p>
                                    <ul style="font-size:14px;line-height:22px;color:#555555;padding-left:20px;margin-bottom:25px;">
                                      <li>🔥 Exclusive Deals & Discounts</li>
                                      <li>🆕 New Product Launches</li>
                                      <li>🎁 Special Festival Offers</li>
                                      <li>🛍️ Limited Time Sales</li>
                                    </ul>

                                    <!-- CTA Button -->
                                    <div style="text-align:center;margin:30px 0;">
                                      <a href="${process.env.SITE_URL}" 
                                        style="background-color:#0b3d91;color:#ffffff;
                                                text-decoration:none;padding:12px 30px;
                                                font-size:14px;border-radius:5px;
                                                display:inline-block;">
                                        Visit Store
                                      </a>
                                    </div>

                                    <p style="font-size:14px;line-height:22px;color:#555555;">
                                      If you did not subscribe to this newsletter, you can safely ignore this email.
                                    </p>

                                    <p style="font-size:14px;line-height:22px;color:#555555;">
                                      Thank you for being part of our community ❤️<br>
                                      <strong style="color:#0b3d91;">Team ${process.env.SITE_NAME}</strong>
                                    </p>

                                  </td>
                                </tr>
                                <tr>
                                  <td style="background-color:#0b3d91;padding:20px;text-align:center;">
                                    <p style="color:#ffffff;font-size:12px;margin:0;">
                                      © 2026 ${process.env.SITE_NAME}. All Rights Reserved.
                                    </p>
                                    <p style="color:#dbe6ff;font-size:12px;margin:5px 0 0 0;">
                                      You are receiving this email because you subscribed to our newsletter.
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
    let arr = [];
    if (error?.keyValue)
      arr = Object.keys(error.keyValue).map((key) => [
        key,
        `This ${key} Has Been Already Registered With us`,
      ]);
    else
      arr = Object.keys(error?.errors).map((key) => [
        key,
        error.errors[key].message,
      ]);
    let errorMessage = Object.fromEntries(arr);

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
    let data = await Newsletter.find().sort({ _id: -1 });
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
    let data = await Newsletter.findOne({ _id: req.params._id });
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
    let data = await Newsletter.findOne({ _id: req.params._id });
    if (data) {
      data.status = req.body.status ?? data.status;

      await data.save();
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
    res.send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}

async function deleteRecord(req, res) {
  try {
    let data = await Newsletter.findOne({ _id: req.params._id });
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
  getSingleRecord: getSingleRecord,
  updateRecord: updateRecord,
  deleteRecord: deleteRecord,
};
