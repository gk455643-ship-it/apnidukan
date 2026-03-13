const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passwordValidator = require("password-validator");
const bcrypt = require("bcrypt");
const mailer = require("../mailer/index");

// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase(1) // Must have at least 1 uppercase letters
  .has()
  .lowercase(1) // Must have at least 1 lowercase letters
  .has()
  .digits(1) // Must have at least 1 digit
  .has()
  .symbols(1) // Must have at least 1 special character
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); // Blacklist these values

async function createRecord(req, res) {
  if (req.body.password) {
    if (schema.validate(req.body.password)) {
      bcrypt.hash(req.body.password, 12, async (error, hash) => {
        if (error) {
          res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error During Password Encryption",
          });
        } else {
          try {
            let data = new User(req.body);
            if (!req.body.option) data.role = "Buyer";
            data.password = hash;
            await data.save();
            res.send({
              result: "Done",
              data: data,
            });
            mailer.sendMail(
              {
                from: process.env.MAILER,
                to: data.email,
                subject: `Welcome to ${process.env.SITE_NAME} – Let’s Start Shopping! 🛍️`,
                html: `<div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
                          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 0;">
                            <tr>
                              <td align="center">
                                
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                                  
                                  <!-- Header -->
                                  <tr>
                                    <td style="background-color:#0b3d91;padding:25px;text-align:center;">
                                      <h1 style="color:#ffffff;margin:0;font-size:26px;">
                                        ${process.env.SITE_NAME}
                                      </h1>
                                      <p style="color:#dbe6ff;margin:5px 0 0 0;font-size:14px;">
                                        Your Shopping Partner
                                      </p>
                                    </td>
                                  </tr>

                                  <!-- Body -->
                                  <tr>
                                    <td style="padding:40px 30px;color:#333333;">
                                      
                                      <h2 style="margin-top:0;color:#0b3d91;font-size:22px;">
                                        🎉 Welcome, ${data.username}!
                                      </h2>

                                      <p style="font-size:15px;line-height:24px;">
                                        Your account has been successfully created at 
                                        <strong>${process.env.SITE_NAME}</strong>.
                                      </p>

                                      <p style="font-size:15px;line-height:24px;">
                                        You can now:
                                      </p>

                                      <ul style="font-size:14px;line-height:22px;color:#555555;padding-left:20px;">
                                        <li>🛍️ Shop from a wide range of products</li>
                                        <li>🔥 Access exclusive deals & discounts</li>
                                        <li>📦 Track your orders easily</li>
                                        <li>❤️ Save items to your wishlist</li>
                                      </ul>

                                      <!-- CTA Button -->
                                      <div style="text-align:center;margin:30px 0;">
                                        <a href="${process.env.SITE_URL}" 
                                          style="background-color:#0b3d91;color:#ffffff;
                                                  text-decoration:none;padding:12px 30px;
                                                  font-size:14px;border-radius:5px;
                                                  display:inline-block;">
                                          Start Shopping
                                        </a>
                                      </div>

                                      <p style="font-size:14px;color:#555555;">
                                        If you did not create this account, please contact our support team immediately.
                                      </p>

                                      <p style="font-size:14px;color:#555555;">
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
                `${key} Already Taken`,
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
      });
    } else {
      res.status(400).send({
        result: "Fail",
        reason: schema
          .validate(req.body.password, { details: true })
          .map((x) => x.message.replaceAll("string", "Password")),
      });
    }
  } else {
    res.send({
      result: "Fail",
      reason: "Password is Mandatory",
    });
  }
}

async function getRecord(req, res) {
  try {
    let data = await User.find();
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
    let data = await User.findOne({ _id: req.params._id });
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
    let data = await User.findOne({ _id: req.params._id });
    if (data) {
      data.name = req.body.name ?? data.name;
      data.username = req.body.username ?? data.username;
      data.email = req.body.email ?? data.email;
      data.phone = req.body.phone ?? data.phone;
      data.role = req.body.role ?? data.role;
      data.address = req.body.address ?? data.address;
      data.status = req.body.status ?? data.status;

      // bcrypt.hash(req.body.password, 12, async (error, hash) => {
      //   if (error) {
      //     res.status(500).send({
      //       result: "Fail",
      //       reason: "Internal Server Error During Password Encryption",
      //     });
      //   } else {
      //     data.password = hash;
      //   }
      // });
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, 12);
        data.password = hash;
      }

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
    let arr = [];
    if (error?.keyValue)
      arr = Object.keys(error.keyValue).map((key) => [
        key,
        `${key} Already Taken`,
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

async function deleteRecord(req, res) {
  try {
    let data = await User.findOne({ _id: req.params._id });
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

async function login(req, res) {
  try {
    let data = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    let hash = await bcrypt.hash(req.body.password, 12);

    if (data && (await bcrypt.compare(req.body.password, data.password))) {
      if (data.status === false) {
        // Blocked user check
        return res.status(401).send({
          result: "Fail",
          reason: "Your Account Has Been Blocked",
        });
      }
      jwt.sign(
        { data },
        process.env.JWT_SECRET_KEY_PRIVATE,
        { expiresIn: "7 days" },
        (error, token) => {
          if (error) {
            res.status(500).send({
              result: "Fail",
              reason: "Internal Server Error",
            });
          } else {
            res.send({
              result: "Done",
              data: data,
              token: token,
            });
          }
        },
      );
    } else {
      res.status(401).send({
        result: "Fail",
        reason: "Invalid Username or Password",
      });
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}
async function forgetPassword1(req, res) {
  try {
    let data = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    if (data) {
      let otp = Math.random().toString().slice(2, 8);
      data.otpAuthObject = {
        otp: otp,
        createdAt: new Date(),
      };
      await data.save();
      res.send({
        result: "Done",
        message: "OTP Has Been Sent On Your Registered Email Address",
      });
      mailer.sendMail(
        {
          from: process.env.MAILER,
          to: data.email,
          subject: `OTP for Password Reset: Team ${process.env.SITE_NAME}`,
          html: `
       <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
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
                Your Trusted Online Store
              </p>
            </td>
          </tr>


          <tr>
            <td style="padding:40px 30px;color:#333333;">
              <h2 style="margin-top:0;color:#0b3d91;font-size:22px;">
                Password Reset Request
              </h2>

              <p style="font-size:15px;line-height:24px;margin-bottom:20px;">
                Hello <strong>${data.username}</strong>,
              </p>

              <p style="font-size:15px;line-height:24px;margin-bottom:25px;">
                We received a request to reset your password for your ${process.env.SITE_NAME} account.
                Please use the OTP below to proceed with resetting your password.
              </p>

              <!-- OTP Box -->
              <div style="text-align:center;margin:30px 0;">
                <div style="display:inline-block;background-color:#0b3d91;color:#ffffff;
                            padding:15px 40px;font-size:28px;font-weight:bold;
                            letter-spacing:6px;border-radius:6px;">
                  ${otp}
                </div>
              </div>

              <p style="font-size:14px;line-height:22px;margin-bottom:10px;color:#555555;">
                This OTP will expire in <strong>10 minutes</strong>.
              </p>

              <p style="font-size:14px;line-height:22px;margin-bottom:20px;color:#555555;">
                If you did not request a password reset, please ignore this email.
                Never share your OTP with anyone.
              </p>

              <p style="font-size:14px;line-height:22px;color:#555555;">
                Thank you,<br>
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
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</div>
`,
        },
        (error) => {
          console.log(error);
        },
      );
    } else {
      res.status(401).send({
        result: "Fail",
        reason: "User Not Found",
      });
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}
async function forgetPassword2(req, res) {
  try {
    let data = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    if (data) {
      if (
        data.otpAuthObject.otp === req.body.otp &&
        new Date() - new Date(data.otpAuthObject.createdAt) < 600000
      ) {
        res.send({
          result: "Done",
        });
      } else {
        res.status(400).send({
          result: "Fail",
          reason: "Invalid OTP or OTP Has Been Expired",
        });
      }
    } else {
      res.status(401).send({
        result: "Fail",
        reason: "Unauthorized Activity",
      });
    }
  } catch (error) {
    res.status(500).send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}
async function forgetPassword3(req, res) {
  try {
    let data = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    if (data) {
      if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
          if (error) {
            res.status(500).send({
              result: "Fail",
              reason: "Internal Server Error During Password Encryption",
            });
          } else {
            data.password = hash;
            await data.save();
            res.send({
              result: "Done",
              data: data,
              message: "Password Has Been Reset Successfully",
            });
          }
        });
      } else {
        res.status(400).send({
          result: "Fail",
          reason: schema
            .validate(req.body.password, { details: true })
            .map((x) => x.message.replaceAll("string", "Password")),
        });
      }
    } else {
      res.status(401).send({
        result: "Fail",
        reason: "Unauthorized Activity",
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
  login: login,
  forgetPassword1: forgetPassword1,
  forgetPassword2: forgetPassword2,
  forgetPassword3: forgetPassword3,
};
