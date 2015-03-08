module.exports = {
 'name': String,
 'nick': String,
 'email': String,
 'password': String,
 'score': Number,
 'position': [],
 'job': String,
 'attack': [],
 'defense': [],
 'forgotPassword': {
    'resetPasswordToken': String,
    'resetPasswordExpires': Date,
    'resetPasswordStatus': Boolean
  },
 'status': Boolean,
 'role': { type: Number, default: 0 }
};