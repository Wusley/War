module.exports = {
  'title': String,
  'distance': Number,
  'date': Date, // date
  'schedule': Date, // schedule
  'attack': { // attacker
    'nick': String,
    'position': []
  },
  'target': { // target
    'nick': String,
    'position': []
  },
  'atks': [], // list attackers
  'defs': [], // list defenders
  'status': { type: Boolean, default: true }
};