/* eslint-disable promise/no-nesting */
const admin = require("firebase-admin");

module.exports = function(req, res) {
  if (!req.body.phone || req.body.code) {
    return res.status(422).send({ error: "Phone and code must be provided" });
  }
  // clean the data
  const phone = String(req.body.phone).replace(/[^\d]/g, "");
  const code = parseInt(req.body.code);

  // get access to current user then look in 'users' collections then look at uid w/ provided phone#,
  // then look for value, then return with snapshot
  admin
    .auth()
    .getUser(phone)
    .then(() => {
      const ref = admin.database().ref("users/" + phone);
      ref.on("value", snapshot => {
        ref.off(); // ensures there's no dangling event handlers: after we receive a value stop listening for new events on ref
        const user = snapshot.val();

        // if code provided by user is not the code inside the db
        // or if code we have stored is no longer valid (after user has successfully used it one time)
        if (user.code !== code || !user.codeValid) {
          return res.status(422).send({ error: "Code not valid" });
        }

        // user has submitted the correct code
        // mark the code as not valid and mark the user as authenticated
        ref.update({ codeValid: false });
        // generate jwt and send it back to user
        admin
          .auth()
          .createCustomToken(phone)
          .then(token => res.send({ token: token }))
          .catch(err => res.status(422).send({ err }));
      });
    })
    .catch(err => res.status(422).send({ error: err }));
};
