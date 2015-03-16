module.exports = {
 'name': String,
 'nick': String,
 'email': String,
 'password': String,
 'score': { type: Number, default: 0 },
 'soul': { type: Number, default: 100 },
 'position': [],
 'job': String,
 'skillUpgrading': [],
 'skillUpgrades': [],
 'attack': [],
 'defense': [],
 'forgotPassword': {
    'resetPasswordToken': String,
    'resetPasswordExpires': Date,
    'resetPasswordStatus': Boolean
  },
 'status': Boolean,
 'turns': [],
 'role': { type: Number, default: 0 }
};