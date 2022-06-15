var express = require('express');
var router = express.Router();





/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');


});




router.post('/Register', function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required"
    })
    return;
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    res.status(400).json({
      error: true,
      message: "Invalid format email address"
    })

    req.db.from("user_data").select("*").where("email", "=", email)
      .then(user => {
        if (users.length > 0) {
          res.status(400).json({
            error: true,
            message: "Email already in use"
          });
          return;
        }
      })

    const hash = bycrypt.hashSync(password, 10);

    req.db.from("user_data").insert({ email, hash })
      .then(() => {
        res.status(400).json({
          error: false,
          message: "User created"
        });

      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          Error: true,
          Message: "Error in MySQL query"
        })
      });
  }
})



router.post('/Login', function (req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required"
    })
    return;
  }
  req.db.from("user_data").select("*").where("email", "=", email)
    .then(user => {
      if (users.length === 0) {
        res.status(400).json({
          error: true,
          message: "User not registered"
        });
        return;
      }
    })

  const hash = user[0].hash;

  if (!bycrypt.compareSync(password, hash)) {
    res.status(400).json({
      error: true,
      message: "Incorrect password"
    });
    return;
  }
  const expires_in = 60 * 60 * 24;
  const exp = Date.now() + expires_in * 1000;
  const token = jwt.sign({ email, exp }, secetKey);



  res.status(200).json({
    token,
    token_type: "Bearer",
    expires_in
  })

  .catch(err => {
    console.log(err);
    res.status(500).json({
      Error: true,
      Message: "Error in MySQL query"
    })
  })
})



module.exports = router;
