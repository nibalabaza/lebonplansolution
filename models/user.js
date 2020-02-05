var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    firstName: {
        type: String
    },
    surname: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'normal'],
        default: 'normal'
    },
    picture: {
        type: String
    }
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', UserSchema);

module.exports = User;