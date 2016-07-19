var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: String, default: new Date().toString() }
});

userSchema.pre("save", function(done, next) {
  var user = this;

  if(!user.isModified("password")) return done();

  bcrypt.hash(this.password, null, null, function(err, hash) {
    if(err) return next(err);

    user.password = hash;
    done();
  });
});

userSchema.methods.comparePassword = function(cPassword, cb) {
  bcrypt.compare(cPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.statics.auth = function(username, password, cb) {
  this.findOne({$or: [{username: username},{email: username}]}, function(err, user) {
    if(err) return cb(err);

    if(user) {
      user.comparePassword(password, function(err, isMatch) {
        if(err) return cb(err);

        if(isMatch) {
          return cb(null, true, user);
        } else {
          return cb(null, false);
        }
      });
    } else {
      return cb(null, false);
    }
  });
};

module.exports = mongoose.model("User", userSchema);
