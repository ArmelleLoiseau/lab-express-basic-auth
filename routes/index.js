const router = require("express").Router();
const userModel = require("./../models/User.model");
const bcrypt = require("bcrypt"); // lib to encrypt data

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

// sign-up

router.post("/sign-up", async (req, res, next) => {
  try {
    const newUser = { ...req.body };

    // check that all the fields are filled
    if (!newUser.username || !newUser.password) {
      console.log("you're missing something");
      res.redirect("/");
    } else {
      // check if username already exists in DB
      const foundUser = await userModel.findOne({ username: newUser.username });

      if (foundUser) {
        console.log("this username already exists in our db");
        res.redirect("/");
      } else {
        // create a new db entry w/ hashed pw
        const hashedPw = bcrypt.hashSync(newUser.password, 10);
        console.log(hashedPw);
        newUser.password = hashedPw;
        await userModel.create(newUser);
        console.log("congrats, you're a member now");
        res.redirect("/");
      }
    }
  } catch (e) {
    next(e);
  }
});

// sign-in
router.post("/sign-in", async (req, res, next) => {
  // check that username exists in db
  try {
    const loggedUser = { ...req.body };
    const dbCheck = await userModel.findOne({ username: loggedUser.username });
    if (!dbCheck) {
      console.log("sorry, you must sign-up first");
      res.redirect("/");
    } else {
      // compare the password with pw stored
      const isSamePw = bcrypt.compareSync(
        loggedUser.password,
        dbCheck.password
      );
      if (!isSamePw) {
        console.log("sorry, wrong password");
        res.redirect("/");
      } else {
        // store session
        const userObject = dbCheck.toObject();
        delete userObject.password;
        req.session.currentUser = userObject;
        console.log("succesfully logged-in");
        console.log("req.session.currentUser");
        res.redirect("/private");
      }
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
