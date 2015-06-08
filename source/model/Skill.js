module.exports = {
  'lv': Number,
  'name': String,
  'type': String, // Passive / Passive-in-fight / Active / Active-in-fight
  'effective': String, // Area-party / Area-enemy / Solo / Solo-enemy
  'description': String,
  'observation': String,
  'delay': { type: Date, default: 0 }, // time waiting
  'souls': Number, // cost spell
  'upgradeSouls': Number, // cost buy
  'upgradeTime': Number, // minute
  'turns': { type: Number, default: 0 }, // #default 0 - infinity
  'recipe': Function,
  'common': { type: Boolean, default: false }, // all jobs have
  'status': Boolean // enable/disable
};