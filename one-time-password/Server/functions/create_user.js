const admin = require("firebase-admin");

module.exports = function(req, res) {
  // Verify user provided a phone number
  if (!req.body.phone) {
    return res.status(422).send({ error: "Bad Input" });
  }

  // Format phone number (only raw digits)
  // 1) Convert input to String
  // 2) Replaces any character that's a non-digit w/ ""
  const phone = String(req.body.phone).replace(/[^\d]/g, "");

  // Create  a new user account using that "cleaned" phone number
  admin
    .auth()
    .createUser({ uid: phone }) // creates new user object (async request so it creates a promise)
    .then(user => res.send(user)) // After the user is created, send it back to whoever made the request
    .catch(err => res.status(422).send({ error: err })); // If there was an error, we send an error response to let requestor know what happened

  // Respond to the user request, saying the account was made
};
