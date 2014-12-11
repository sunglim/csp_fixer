
"use strict";

var a = document.querySelector("#a");
var b = document.querySelector("#b");

var animationA = new Animation(a, {"left": "100%"}, {duration: 10});
var animationB = new Animation(b, {"left": "100%"}, {duration: 10});
var animationAClone = animationA.clone();
var animationBClone = animationB.clone();

var playerA;
at(1.0, function() {
    playerA = document.timeline.play(animationA);
  });
var playerB;
at(2.0, function() {
    playerB = document.timeline.play(animationB);
  });
var playerAB;
at(3.0, function() {
    playerAB = document.timeline.play(new AnimationGroup([animationAClone, animationBClone]));
  });

// These test_at calls are not in a *-checks.js file so they
// can be declared after the calls to play() are scheduled.

timing_test(function () {
    at(0.0, function() {
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var aPlayers = a.getCurrentPlayers();
      var bPlayers = b.getCurrentPlayers();
      assert_equals(timelinePlayers.length, 0, "timelinePlayers count");
      assert_equals(aPlayers.length, 0, "Players on A length");
      assert_equals(bPlayers.length, 0, "Players on B length");
    });
  }, "Check current players at t=0");
timing_test(function () {
    at(1.0, function() {
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var aPlayers = a.getCurrentPlayers();
      var bPlayers = b.getCurrentPlayers();
      assert_equals(timelinePlayers.length, 1, "timelinePlayers count");
      assert_in_array(playerA, timelinePlayers, "timelinePlayers contains playerA");
      assert_equals(aPlayers.length, 1, "Players on A length");
      assert_in_array(playerA, aPlayers, "Players on A contains playerA");
      assert_equals(bPlayers.length, 0, "Players on B length");
    });
  }, "Check current players at t=1");
timing_test(function () {
    at(2.0, function() {
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var aPlayers = a.getCurrentPlayers();
      var bPlayers = b.getCurrentPlayers();
      assert_equals(timelinePlayers.length, 2, "timelinePlayers count");
      assert_in_array(playerA, timelinePlayers, "timelinePlayers contains playerA");
      assert_in_array(playerB, timelinePlayers, "timelinePlayers contains playerB");
      assert_equals(aPlayers.length, 1, "Players on A length");
      assert_in_array(playerA, aPlayers, "Players on A contains playerA");
      assert_equals(bPlayers.length, 1, "Players on B length");
      assert_in_array(playerB, bPlayers, "Players on B contains playerB");
    });
  }, "Check current players at t=2");
timing_test(function () {
    at(3.0, function() {
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var aPlayers = a.getCurrentPlayers();
      var bPlayers = b.getCurrentPlayers();
      assert_equals(timelinePlayers.length, 3, "timelinePlayers count");
      assert_in_array(playerA, timelinePlayers, "timelinePlayers contains playerA");
      assert_in_array(playerB, timelinePlayers, "timelinePlayers contains playerB");
      assert_in_array(playerAB, timelinePlayers, "timelinePlayers contains playerAB");
      assert_equals(aPlayers.length, 2, "Players on A length");
      assert_in_array(playerA, aPlayers, "Players on A contains playerA");
      assert_in_array(playerAB, aPlayers, "Players on A contains playerAB");
      assert_equals(bPlayers.length, 2, "Players on B length");
      assert_in_array(playerB, bPlayers, "Players on B contains playerB");
      assert_in_array(playerAB, bPlayers, "Players on B contains playerAB");
    });
  }, "Check current players at t=3");
timing_test(function () {
    at(5.0, function() {
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var aPlayers = a.getCurrentPlayers();
      var bPlayers = b.getCurrentPlayers();
      assert_equals(timelinePlayers.length, 3, "timelinePlayers count");
      assert_in_array(playerA, timelinePlayers, "timelinePlayers contains playerA");
      assert_in_array(playerB, timelinePlayers, "timelinePlayers contains playerB");
      assert_in_array(playerAB, timelinePlayers, "timelinePlayers contains playerAB");
      assert_equals(aPlayers.length, 2, "Players on A length");
      assert_in_array(playerA, aPlayers, "Players on A contains playerA");
      assert_in_array(playerAB, aPlayers, "Players on A contains playerAB");
      assert_equals(bPlayers.length, 2, "Players on B length");
      assert_in_array(playerB, bPlayers, "Players on B contains playerB");
      assert_in_array(playerAB, bPlayers, "Players on B contains playerAB");
    });
  }, "Check current players at t=5");
timing_test(function () {
    at(11.0, function() {
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var aPlayers = a.getCurrentPlayers();
      var bPlayers = b.getCurrentPlayers();
      assert_equals(timelinePlayers.length, 2, "timelinePlayers count");
      assert_in_array(playerB, timelinePlayers, "timelinePlayers contains playerB");
      assert_in_array(playerAB, timelinePlayers, "timelinePlayers contains playerAB");
      assert_equals(aPlayers.length, 1, "Players on A length");
      assert_in_array(playerAB, aPlayers, "Players on A contains playerAB");
      assert_equals(bPlayers.length, 2, "Players on B length");
      assert_in_array(playerB, bPlayers, "Players on B contains playerB");
      assert_in_array(playerAB, bPlayers, "Players on B contains playerAB");
    });
  }, "Check current players at t=11");
timing_test(function () {
    at(11.5, function() {
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var aPlayers = a.getCurrentPlayers();
      var bPlayers = b.getCurrentPlayers();
      assert_equals(timelinePlayers.length, 2, "timelinePlayers count");
      assert_in_array(playerB, timelinePlayers, "timelinePlayers contains playerB");
      assert_in_array(playerAB, timelinePlayers, "timelinePlayers contains playerAB");
      assert_equals(aPlayers.length, 1, "Players on A length");
      assert_in_array(playerAB, aPlayers, "Players on A contains playerAB");
      assert_equals(bPlayers.length, 2, "Players on B length");
      assert_in_array(playerB, bPlayers, "Players on B contains playerB");
      assert_in_array(playerAB, bPlayers, "Players on B contains playerAB");
    });
  }, "Check current players at t=11.5");
timing_test(function () {
    at(12.0, function() {
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var aPlayers = a.getCurrentPlayers();
      var bPlayers = b.getCurrentPlayers();
      assert_equals(timelinePlayers.length, 1, "timelinePlayers count");
      assert_in_array(playerAB, timelinePlayers, "timelinePlayers contains playerAB");
      assert_equals(aPlayers.length, 1, "Players on A length");
      assert_in_array(playerAB, aPlayers, "Players on A contains playerAB");
      assert_equals(bPlayers.length, 1, "Players on B length");
      assert_in_array(playerAB, bPlayers, "Players on B contains playerAB");
    });
  }, "Check current players at t=12");
timing_test(function () {
    at(12.5, function() {
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var aPlayers = a.getCurrentPlayers();
      var bPlayers = b.getCurrentPlayers();
      assert_equals(timelinePlayers.length, 1, "timelinePlayers count");
      assert_in_array(playerAB, timelinePlayers, "timelinePlayers contains playerAB");
      assert_equals(aPlayers.length, 1, "Players on A length");
      assert_in_array(playerAB, aPlayers, "Players on A contains playerAB");
      assert_equals(bPlayers.length, 1, "Players on B length");
      assert_in_array(playerAB, bPlayers, "Players on B contains playerAB");
    });
  }, "Check current players at t=12.5");
timing_test(function () {
    at(13.0, function() {
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var aPlayers = a.getCurrentPlayers();
      var bPlayers = b.getCurrentPlayers();
      assert_equals(timelinePlayers.length, 0, "timelinePlayers count");
      assert_equals(aPlayers.length, 0, "Players on A length");
      assert_equals(bPlayers.length, 0, "Players on B length");
    });
  }, "Check current players at t=13");
timing_test(function () {
    at(13.5, function() {
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var timelinePlayers = document.timeline.getCurrentPlayers();
      var aPlayers = a.getCurrentPlayers();
      var bPlayers = b.getCurrentPlayers();
      assert_equals(timelinePlayers.length, 0, "timelinePlayers count");
      assert_equals(aPlayers.length, 0, "Players on A length");
      assert_equals(bPlayers.length, 0, "Players on B length");
    });
  }, "Check current players at t=13.5");

timing_test(function () {
    at(0.0, function() {
      var aAnimations = a.getCurrentAnimations();
      var bAnimations = b.getCurrentAnimations();
      assert_equals(aAnimations.length, 0, "Animations on A count");
      assert_equals(bAnimations.length, 0, "Animations on B count");
    });
  }, "Check current animations at t=0");
timing_test(function () {
    at(1.0, function() {
      var aAnimations = a.getCurrentAnimations();
      var bAnimations = b.getCurrentAnimations();
      assert_equals(aAnimations.length, 1, "Animations on A count");
      assert_in_array(animationA, aAnimations, "Animations on A contains animationA");
      assert_equals(bAnimations.length, 0, "Animations on B count");
    });
  }, "Check current animations at t=1");
timing_test(function () {
    at(2.0, function() {
      var aAnimations = a.getCurrentAnimations();
      var bAnimations = b.getCurrentAnimations();
      assert_equals(aAnimations.length, 1, "Animations on A count");
      assert_in_array(animationA, aAnimations, "Animations on A contains animationA");
      assert_equals(bAnimations.length, 1, "Animations on B count");
      assert_in_array(animationB, bAnimations, "Animations on B contains animationB");
    });
  }, "Check current animations at t=2");
timing_test(function () {
    at(3.0, function() {
      var aAnimations = a.getCurrentAnimations();
      var bAnimations = b.getCurrentAnimations();
      assert_equals(aAnimations.length, 2, "Animations on A count");
      assert_in_array(animationA, aAnimations, "Animations on A contains animationA");
      assert_in_array(animationAClone, aAnimations, "Animations on A contains animationAClone");
      assert_equals(bAnimations.length, 2, "Animations on B count");
      assert_in_array(animationB, bAnimations, "Animations on B contains animationB");
      assert_in_array(animationBClone, bAnimations, "Animations on B contains animationBClone");
    });
  }, "Check current animations at t=3");
timing_test(function () {
    at(5.0, function() {
      var aAnimations = a.getCurrentAnimations();
      var bAnimations = b.getCurrentAnimations();
      assert_equals(aAnimations.length, 2, "Animations on A count");
      assert_in_array(animationA, aAnimations, "Animations on A contains animationA");
      assert_in_array(animationAClone, aAnimations, "Animations on A contains animationAClone");
      assert_equals(bAnimations.length, 2, "Animations on B count");
      assert_in_array(animationB, bAnimations, "Animations on B contains animationB");
      assert_in_array(animationBClone, bAnimations, "Animations on B contains animationBClone");
    });
  }, "Check current animations at t=5");
timing_test(function () {
    at(11.0, function() {
      var aAnimations = a.getCurrentAnimations();
      var bAnimations = b.getCurrentAnimations();
      assert_equals(aAnimations.length, 1, "Animations on A count");
      assert_in_array(animationAClone, aAnimations, "Animations on A contains animationAClone");
      assert_equals(bAnimations.length, 2, "Animations on B count");
      assert_in_array(animationB, bAnimations, "Animations on B contains animationB");
      assert_in_array(animationBClone, bAnimations, "Animations on B contains animationBClone");
    });
  }, "Check current animations at t=11");
timing_test(function () {
    at(11.5, function() {
      var aAnimations = a.getCurrentAnimations();
      var bAnimations = b.getCurrentAnimations();
      assert_equals(aAnimations.length, 1, "Animations on A count");
      assert_in_array(animationAClone, aAnimations, "Animations on A contains animationAClone");
      assert_equals(bAnimations.length, 2, "Animations on B count");
      assert_in_array(animationB, bAnimations, "Animations on B contains animationB");
      assert_in_array(animationBClone, bAnimations, "Animations on B contains animationBClone");
    });
  }, "Check current animations at t=11.5");
timing_test(function () {
    at(12.0, function() {
      var aAnimations = a.getCurrentAnimations();
      var bAnimations = b.getCurrentAnimations();
      assert_equals(aAnimations.length, 1, "Animations on A count");
      assert_in_array(animationAClone, aAnimations, "Animations on A contains animationAClone");
      assert_equals(bAnimations.length, 1, "Animations on B count");
      assert_in_array(animationBClone, bAnimations, "Animations on B contains animationBClone");
    });
  }, "Check current animations at t=12");
timing_test(function () {
    at(12.5, function() {
      var aAnimations = a.getCurrentAnimations();
      var bAnimations = b.getCurrentAnimations();
      assert_equals(aAnimations.length, 1, "Animations on A count");
      assert_in_array(animationAClone, aAnimations, "Animations on A contains animationAClone");
      assert_equals(bAnimations.length, 1, "Animations on B count");
      assert_in_array(animationBClone, bAnimations, "Animations on B contains animationBClone");
    });
  }, "Check current animations at t=12.5");
timing_test(function () {
    at(13.0, function() {
      var aAnimations = a.getCurrentAnimations();
      var bAnimations = b.getCurrentAnimations();
      assert_equals(aAnimations.length, 0, "Animations on A count");
      assert_equals(bAnimations.length, 0, "Animations on B count");
    });
  }, "Check current animations at t=13");
timing_test(function () {
    at(13.5, function() {
      var aAnimations = a.getCurrentAnimations();
      var bAnimations = b.getCurrentAnimations();
      assert_equals(aAnimations.length, 0, "Animations on A count");
      assert_equals(bAnimations.length, 0, "Animations on B count");
    });
  }, "Check current animations at t=13.5");

