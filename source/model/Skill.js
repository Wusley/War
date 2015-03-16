module.exports = {
  'lv': Number,
  'name': String,
  'type': String,
  'description': String,
  'observation': String,
  'castSoul': Number,
  'upgradeSoul': Number,
  'upgradeTime': Number, // minute
  'turns': { type: Number, default: 0 }, // #default 0 - infinity
  'recipe': {},
  'common': Boolean,
  'status': Boolean
};