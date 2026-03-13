const Contactus = require("../models/Contactus");
const mailer = require("../mailer/index");

async function createRecord(req, res) {
  try {
    let data = new Contactus(req.body);
    await data.save();
    res.send({
      result: "Done",
      data: data,
    });
    mailer.sendMail(
      {
        from: process.env.MAILER,
        to: data.email,
        subject: `Thanks for Contacting ${process.env.SITE_NAME} 💙`,
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
                                            Customer Support Team
                                          </p>
                                        </td>
                                      </tr>

                                      <!-- Body -->
                                      <tr>
                                        <td style="padding:40px 30px;color:#333333;">
                                          
                                          <h2 style="margin-top:0;color:#0b3d91;font-size:22px;">
                                            📩 We’ve Received Your Message
                                          </h2>

                                          <p style="font-size:15px;line-height:24px;">
                                            Hello <strong>${data.name}</strong>,
                                          </p>

                                          <p style="font-size:15px;line-height:24px;">
                                            Thank you for contacting <strong>${process.env.SITE_NAME}</strong>.  
                                            Our support team has received your query and will get back to you as soon as possible.
                                          </p>

                                          <!-- Query Box -->
                                          <div style="background-color:#f1f4fb;border-left:4px solid #0b3d91;padding:15px;margin:20px 0;">
                                            <p style="margin:0;font-size:14px;color:#333;">
                                              <strong>Your Message:</strong><br><br>
                                              ${data.message}
                                            </p>
                                          </div>

                                          <p style="font-size:14px;line-height:22px;color:#555555;">
                                            ⏳ Typical response time: 24–48 hours.
                                          </p>

                                          <p style="font-size:14px;line-height:22px;color:#555555;">
                                            If your issue is urgent, please reply directly to this email.
                                          </p>

                                          <p style="font-size:14px;color:#555555;margin-top:25px;">
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
                                            This is an automated confirmation email.
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
    mailer.sendMail(
      {
        from: process.env.MAILER,
        to: process.env.MAILER,
        subject: `New Contact Query Received - ${process.env.SITE_NAME}`,
        html: `<div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 0;">
                  <tr>
                    <td align="center">
                      
                      <table width="650" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
                        
                        <!-- Header -->
                        <tr>
                          <td style="background-color:#0b3d91;padding:20px;text-align:center;">
                            <h2 style="color:#ffffff;margin:0;">
                              ${process.env.SITE_NAME} - New Contact Query
                            </h2>
                          </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                          <td style="padding:30px;color:#333333;">
                            
                            <p style="font-size:15px;">
                              A new contact form submission has been received.
                            </p>

                            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;margin-top:15px;">
                              <tr>
                                <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Name</strong></td>
                                <td style="border:1px solid #ddd;">${data.name}</td>
                              </tr>
                              <tr>
                                <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Email</strong></td>
                                <td style="border:1px solid #ddd;">${data.email}</td>
                              </tr>
                              <tr>
                                <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Phone</strong></td>
                                <td style="border:1px solid #ddd;">${data.phone}</td>
                              </tr>
                              <tr>
                                <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Subject</strong></td>
                                <td style="border:1px solid #ddd;">${data.subject}</td>
                              </tr>
                              <tr>
                                <td style="background:#f1f4fb;border:1px solid #ddd;"><strong>Date</strong></td>
                                <td style="border:1px solid #ddd;">${data.createdAt}</td>
                              </tr>
                            </table>

                            <div style="margin-top:20px;background:#f9fafc;border-left:4px solid #0b3d91;padding:15px;">
                              <p style="margin:0;font-size:14px;">
                                <strong>Message:</strong><br><br>
                                ${data.message}
                              </p>
                            </div>

                            <p style="margin-top:20px;font-size:14px;color:#555;">
                              Please respond to the user within 24 hours.
                            </p>

                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="background-color:#0b3d91;padding:15px;text-align:center;">
                            <p style="color:#ffffff;font-size:12px;margin:0;">
                              Internal Notification - ${process.env.SITE_NAME}
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
    let data = await Contactus.find().sort({ _id: -1 });
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
    let data = await Contactus.findOne({ _id: req.params._id });
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
    let data = await Contactus.findOne({ _id: req.params._id });
    if (data) {
      data.status = req.body.status ?? data.status;

      await data.save();
      res.send({
        result: "Done",
        data: data,
      });
      mailer.sendMail(
        {
          from: process.env.MAILER,
          to: data.email,
          subject: `Your Issue Has Been Resolved - ${process.env.SITE_NAME}`,
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
                              Support Update
                            </p>
                          </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                          <td style="padding:40px 30px;color:#333333;">
                            
                            <h2 style="margin-top:0;color:#0b3d91;font-size:20px;">
                              ✅ Your Query Has Been Resolved
                            </h2>

                            <p style="font-size:15px;line-height:24px;">
                              Hello <strong>${data.name}</strong>,
                            </p>

                            <p style="font-size:15px;line-height:24px;">
                              We’re pleased to inform you that your recent support request has been successfully resolved by our team.
                            </p>

                            <p style="font-size:14px;line-height:22px;color:#555555;">
                              If you still have any concerns or need further assistance, feel free to reply to this email — we’re always happy to help.
                            </p>

                            <div style="text-align:center;margin:30px 0;">
                              <a href="${process.env.SITE_URL}" 
                                style="background-color:#0b3d91;color:#ffffff;
                                        text-decoration:none;padding:12px 30px;
                                        font-size:14px;border-radius:5px;
                                        display:inline-block;">
                                Visit Our Store
                              </a>
                            </div>

                            <p style="font-size:14px;color:#555555;">
                              Thank you for your patience and for choosing us 💙<br>
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
                              This is an automated support resolution email.
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
    res.send({
      result: "Fail",
      reason: "Internal Server Error",
    });
  }
}

async function deleteRecord(req, res) {
  try {
    let data = await Contactus.findOne({ _id: req.params._id });
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
