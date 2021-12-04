var express = require("express");
var router = express.Router();
var uuid = require('uuid');
var Filter = require('bad-words'),
  filter = new Filter();

/* GET home page. */
router.get("/", function (req, res, next) {
  var newuser = true;
  if (!("idCookie" in req.cookies)) {
    res.cookie("idCookie", uuid.v1(), {
      maxAge: 24 * 60 * 60 * 1000
    });
  } else {
    var existing_index = users.findIndex(function (item, i) {
      return item.userId === req.cookies.idCookie;
    });
    if (existing_index == -1) {

      res.clearCookie("prevInputs");
      res.clearCookie("prevInputs");
    }
  }

  prevInputs = {
    "r": 127.5,
    "g": 127.5,
    "b": 127.5,
    "name": null
  };

  if ("prevInputs" in req.cookies) {
    prevInputs = JSON.parse(req.cookies.prevInputs);
    newuser = false
  } else {

  }

  res.render("index", {
    title: "E-Mote | Home",
    savedInputs: prevInputs,
    newuser
  });
});


router.post("/process_emotion", function (req, res) {

  var r = req.body.r;
  var g = req.body.g;
  var b = req.body.b;
  var name = req.body.name;
  // remove profanity
  if (name) {
    name = filter.clean(name);
  } else {
    name = "Stranger";
  }
  var bare_emottion_object = {
    "r": r,
    "g": g,
    "b": b,
    "name": name
  }

  // set the cookies
  res.cookie("prevInputs", JSON.stringify(bare_emottion_object), {
    maxAge: 24 * 60 * 60 * 1000
  });

  // inject the userID to bare emotion object
  bare_emottion_object.userId = req.cookies.idCookie;

  // search for userId in users to update or append
  var existing_index = users.findIndex(function (item, i) {
    return item.userId === bare_emottion_object.userId;
  });

  if (existing_index == -1) {
    users.push(bare_emottion_object);
  } else {
    users[existing_index] = bare_emottion_object;
  }



  res.status(200).end();

});

router.post("/get_users", function (req, res) {

  res.json(users).status(200).end();
});

module.exports = router;