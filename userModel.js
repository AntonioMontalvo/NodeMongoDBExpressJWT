var mongoose = require('mongoose');//use mongoose in the model

var Schema = mongoose.Schema;//now we can use the mongoose Schema class amd stachi it as Schema

var signUpInfo = new Schema({//create an instance of Schema to configure how our data is recorded (keys and values)

	username: {
		type: String
	},
	password: {
		type: String
	}	
});

var User = mongoose.model('SignUp', signUpInfo);// here we create our  model from the Schema, using mongoose model method. The first argument is the name of the name of the collection ins singular.

module.exports = User;