module.exports = {
  'lv': Number,
  'name': String,
  'type': String,
  'description': String,
  'observation': String,
  'delay': { type: Date, default: 0 }, // time waiting
  'soul': Number, // cost spell
  'upgradeSoul': Number, // cost buy
  'upgradeTime': Number, // minute
  'turns': { type: Number, default: 0 }, // #default 0 - infinity
  'recipe': Function,
  'common': Boolean, // basic skill
  'status': Boolean // enable/disable
};