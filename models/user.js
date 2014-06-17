
//load required packages
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

//define our user schema
var Userschema =  new mongoose.Schema(
    {

        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    });

//Execute before each user.save() call
Userschema.pre('save', function(callback){
    var user = this;

    //Break out if the password hasn't cahnged
    if(!user.isModified('password')) return callback();

    //Password has changes seo we need to hash it using bcrypt
    bcrypt.genSalt(5, function(err,salt){

        if(err) return callback(err);

        bcrypt.hash(user.password,salt,null,function(err,hash){

            if(err)
              return callback(err);
            user.password = hash;
            callback();

        })


    })
});

//Export the Mongoose model

module.exports = mongoose.model ('User', Userschema);


