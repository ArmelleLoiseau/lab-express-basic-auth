const router = require("express").Router();
const userModel = require("./../models/User.model");
const protectRoute = require("./../middlewares/protectRoute");

router.get("/", protectRoute, async (req, res, next) => {
  try {
    const user = await userModel.findOne({ username: req.session.username });
    res.render("private.hbs", {
      user,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
