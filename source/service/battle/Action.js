module.exports = ( function() {

  var Action = function( action, users ) {

      this.score = users[ action.nick ].score;
      this.job = action.job;
      this.nick = action.nick;
      this.souls = action.souls;
      this.heroes = users[ action.nick ].heroes;
      this.skills = action.skills;
      this.skillsArea = action.skillsArea;
      this.skillsSolo = action.skillsSolo;
      this.attributes = users[ action.nick ].job.attributes;
      this.fight = {
        'passiveArea': true,
        'passiveSolo': true,
        'passiveAreaEnemy': true,
        'passiveSoloEnemy': true
      };
      this.turns = users[ action.nick ].job.turns;

    };

  return Action;

} () );