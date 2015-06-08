module.exports = {
  'name': String,
  'description': String,
  'attributes': { // max 300 points
    'atkP': { type: Number, default: 0 },
    'atkM': { type: Number, default: 0 },
    'defP': { type: Number, default: 0 }, // %
    'defM': { type: Number, default: 0 }, // %
    'evadeP': { type: Number, default: 0 }, // %
    'evadeM': { type: Number, default: 0 }, // %
    'atkSpeed': { type: Number, default: 0 }, // %
    'magicSpell': { type: Number, default: 0 }, // %
    'accuracy': { type: Number, default: 0 }, // %
    'critical': { type: Number, default: 0 } // %
  },
  'sight': { type: Number, default: 1000 },  // meters
  'skills': [],
  'fight': {
    // 'passiveAreaEnemy': {},
    // 'passiveAreaParty': {},
    // 'passiveSingleEnemy': {},
    // 'passiveSingle': {},
    // ''
  },
  // 'passiveFightSkillsStatus': { type: Boolean, default: false },
  'turns': Number,
  'status': Boolean
};