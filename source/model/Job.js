module.exports = {
  'name': String,
  'description': String,
  'attributes': {
    'str': { type: Number, default: 0 },
    'vit': { type: Number, default: 0 },
    'agi': { type: Number, default: 0 },
    'dex': { type: Number, default: 0 },
    'int': { type: Number, default: 0 },
    'luk': { type: Number, default: 0 }
  },
  'sight': { type: Number, default: 1000 },
  'skills': [],
  'status': Boolean
};