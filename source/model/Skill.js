module.exports = {
  'lv': Number,
  'name': String,
  'type': String, // Passive / Passive-in-fight / Active / Active-in-fight
  'effective': String, // Area-party / Area-enemy / Solo / Solo-enemy
  'description': String, // description in view
  'observation': String, // description out view
  'delay': { type: Date, default: 0 }, // time waiting for use
  'souls': Number, // cost spell
  'upgradeSouls': Number, // cost buy
  'upgradeTime': Number, // minute
  'turns': { type: Number, default: 0 }, // #default 0 - infinity effect
  'recipe': Function,
  'common': { type: Boolean, default: false }, // all jobs have
  'status': { type: Boolean, default: false } // enable/disable
};