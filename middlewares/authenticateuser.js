const path = require('path');
module.exports = (req, res, next) => {
  if (!req.session.user) {
    res.send("You must be logged in");
    return;
  }
  //else continue
  next();
};
