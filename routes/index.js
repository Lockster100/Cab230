var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/API', function(req, res, next) {
  res.render('index', { title: 'Lots of routes available Including: City, Countries and more '});

});

router.get('/API/countries', function(req, res, next){
  req.db.distinct().from('data').select('country').orderBy('country', 'asc')
  .then(
    rows => {
      res.json({
        Error : false,
        Message : "Success",
        Country : rows

      })
    }
  )
  .catch(err => {
    console.log(err);
    res.json({
      Error : true,
      Message : "Invalid query parameters. Query parameters are not permitted",
    })
  })
})


router.get('/API/volcanoes/:Country/:populatedWithin', function(req, res, next){
  const Country = req.params.Country;
  const populatedWithin = req.params.populatedWithin;

  req.db.from('data').select('id', 'name', 'country', 'region', 'subregion').where('Country', '=', Country).andwhere('population_5km', '=', populatedWithin).orderBy('id', 'asc')
  .then(
    rows => {
      res.json({
        Error : false,
        Message : "Success",
        Volcanoes : rows

      })
    }
  )
  .catch(err => {
    console.log(err);
    res.json({
      Error : true,
      Message : "Country is a required query parameter",
    })
  })
})


router.get('/API/volcanoes/:id', function(req, res, next){
  const id = req.params.id;
  req.db.from('data').select('*').where('id', '=', id).orderBy('id', 'asc')
  .then(
    rows => {
      res.json({
        Error : false,
        Message : "Success",
        Volcanoes : rows,

      })
    }
  )
  .catch(err => {
    console.log(err);
    res.json({
      Error : true,
      Message : "Error in MySQL query",
      //needs more error handling
    })
  })
})







module.exports = router;



