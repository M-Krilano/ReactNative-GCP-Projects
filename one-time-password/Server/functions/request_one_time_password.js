const admin = require("firebase-admin");
const twilio = require("./twilio");

module.exports = function(req, res) {
  if (!req.body.phone) {
    return res.status(422).send({ error: "You must provide a phone number" });
  }

  // ensure phone number is okay
  const phone = String(req.body.phone).replace(/[^\d]/g, "");

  admin
    .auth()
    .getUser(phone)
    .then(userRecord => {
      const code = Math.floor(Math.random() * 8999 + 1000);
      // test user
      // twilio doesn't use promise, so we use callback function
      twilio.messages.create(
        {
          body: "Your code is " + code,
          to: phone,
          from: "+17472397624"
        },
        err => {
          if (err) {
            return res.status(422).send(err);
          }

          // created a new collection in db called 'users' and then added a new entry of the phone #
          admin
            .database()
            .ref("users/" + phone)
            .update({ code: code, codeValie: true }, () => {
              res.send({ success: true });
            });
        }
      );
    })
    .catch(err => {
      res.status(422).send({ error: err });
    });
};
