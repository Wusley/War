module.exports = ( function() {

  var _ = require( 'underscore' );

  var shareObj = function() {
    this.share = [];
  };

  var sharePassiveGroupA = new shareObj();
  var sharePassiveGroupB = new shareObj();

  var shareActiveGroupA = new shareObj();
  var shareActiveGroupB = new shareObj();

  var Skill = function( sharePassiveGroupA, sharePassiveGroupB, shareActiveGroupA, shareActiveGroupB ) {

    this.passive = {
      area: [],
      areaTurnIn: sharePassiveGroupA,
      areaTurnOut: sharePassiveGroupB
    };

    this.active = {
      area: [],
      areaTurnIn: shareActiveGroupA,
      areaTurnOut: shareActiveGroupB
    };

  };

  var skillsA = new Skill( sharePassiveGroupB, sharePassiveGroupA, shareActiveGroupB, shareActiveGroupA ),
      skillsB = new Skill( sharePassiveGroupA, sharePassiveGroupB, shareActiveGroupA, shareActiveGroupB );

  return {
    groupA: skillsA,
    groupB: skillsB
  };

} () );