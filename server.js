//get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Beer = require('./models/beer');

//connect to beerlocker Mongo Db
mongoose.connect('mongodb://localhost:27017/beerlocker');

//Create out express application
var app= express();


//use body-parser
app.use(bodyParser());


//Use environment defined port or 3000
var port = process.env.PORT || 3000;

//create express router

var router = express.Router();

//Inital dummy route for testing
//http://localhost:3000/api

router.get('/', function(req, res) {
    res.json({ message: 'You are running dangerously low on beer!' });
});

//register all our routes with api
app.use('/api', router);

//create a new route with the prefix /beers
var beersRoute = router.route('/beers');

//create end point  /api/beers for the  POSTS
beersRoute.post(function(req,res){
        //create new instance of Beer model
    var beer= new Beer();

    //set the values for beer properties that come form the POST data - using the body parser created earlier
    beer.name = req.body.name;
    beer.type =req.body.type;
    beer.quantity=req.body.quantity;

    //save the beer and check for error
    beer.save(function(err){
        if(err) res.send(err);
         res.json({message: "Beer added to the locker",data:beer})
     })
 })

//RETURN ALL BEERS
//Use the beers route but will create and endpoint for /api/beers for GET
beersRoute.get(function(req, res){
   //Use the beer model to find all beer
    Beer.find (function(err,beers){
        if(err)res.send(err);

        res.json(beers);
    })

})







//RETURN A SINGLE BEER
//create a new route with the /beers/:beer_id prefix
var beerRoute = router.route('/beers/:beer_id');

// Create endpoint /api/beers/:beer_id for GET
 beerRoute.get(function(req, res){
 //Use the Beer modeltofins a specific beer
    Beer.findById(req.params.beer_id,function(err,beer){

        if(err) res.send(err);

          res.json(beer);

    })

})

//Create endpoint  /api/beers/:beer_id  for PUT usin beerRoute
beerRoute.put(function(req, res){
    //Use BErrmodel to finda  specific beer
    Beer.findById(req.params.beer_id, function(err, beer){
        if(err)res.send(err);

        //Update the existing beer quantity
        beer.quantity = req.body.quantity;

        //save the beer and check for errors
        beer.save(function(err){

            if(err) res.send(err);

            res.json(beer)



        })
})


})

//Create endpoint /api/beers/:beer-Id for DELETE
beerRoute.delete (function(req,res){
    //Use the Beermodel to find a specific beer and remove it
    Beer.findByIdAndRemove(req.params.beer_id, function(err){
                if (err) res.send(err);
                res.json({message:"Beer removed from the locker!"});
  })


})












//start the  server
app.listen(port);
console.log('Insert beer on port ' + port);