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
 '_groupId': String,
 'attack': [],
 'defense': [],
 'forgotPassword': {
    'resetPasswordToken': String,
    'resetPasswordExpires': Date,
    'resetPasswordStatus': Boolean
  }
};