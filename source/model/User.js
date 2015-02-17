module.exports = {
 'name': String,
 'nick': String,
 'email': String,
 'password': String,
 'status': Boolean,
 'forgotPassword': {
    'resetPasswordToken': String,
    'resetPasswordExpires': Date,
    'resetPasswordStatus': Boolean
  }
};