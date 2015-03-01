module.exports = {
 'name': String,
 'nick': String,
 'email': String,
 'password': String,
 'status': Boolean,
 'score': Number,
 'position': [],
 'attack': [],
 'defense': [],
 'forgotPassword': {
    'resetPasswordToken': String,
    'resetPasswordExpires': Date,
    'resetPasswordStatus': Boolean
  }
};