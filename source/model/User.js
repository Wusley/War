module.exports = {
 'name': String,
 'nick': String,
 'email': String,
 'password': String,
 'status': Boolean,
 'position': {
    'latitude': Number,
    'longitude': Number
 },
 'forgotPassword': {
    'resetPasswordToken': String,
    'resetPasswordExpires': Date,
    'resetPasswordStatus': Boolean
  }
};