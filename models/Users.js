var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var nconf = require('nconf');
nconf.env().argv();
nconf.file('./config/config.json');

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {

    // set expiration to 2 days
    var today = new Date();
    var expires = new Date(today);
    expires.setDate(today.getDate() + 2);

    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            exp: parseInt(expires.getTime() / 1000)
        },
        nconf.get('JWT_SECRET_KEY'));
};

mongoose.model('User', UserSchema);