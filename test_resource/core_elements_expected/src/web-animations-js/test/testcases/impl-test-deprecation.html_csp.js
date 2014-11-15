
"use strict";

var useAncient = function(deprecationDate) {
  _WebAnimationsTestingUtilities._deprecated('Ancient', deprecationDate,
      'Please use Modern instead.');
};

var useOld = function(deprecationDate) {
  _WebAnimationsTestingUtilities._deprecated('Old', deprecationDate,
      'Please use New instead.');
};

var useSuperseded = function(deprecationDate) {
  _WebAnimationsTestingUtilities._deprecated('Superseded', deprecationDate,
      'See Replacement.');
};

test(function() {
  var deprecationDate = new Date();
  deprecationDate.setDate(deprecationDate.getDate() - 85);
  var cutoffDate = new Date(deprecationDate);
  cutoffDate.setMonth(cutoffDate.getMonth() + 3); // 3 months grace period

  var warnings = [];
  var savedConsoleWarn = console.warn;
  try {
    console.warn = function(message) {
      warnings.push(message);
    };

    var firstExpectedWarning = 'Web Animations: Old is deprecated and will stop working on ' + cutoffDate.toDateString() + '. Please use New instead.';
    var secondExpectedWarning = 'Web Animations: Superseded is deprecated and will stop working on ' + cutoffDate.toDateString() + '. See Replacement.';

    useOld(deprecationDate);
    assert_equals(warnings.length, 1);
    assert_equals(warnings[0], firstExpectedWarning);

    useOld(deprecationDate);
    assert_equals(warnings.length, 1);

    useSuperseded(deprecationDate);
    assert_equals(warnings.length, 2);
    assert_equals(warnings[1], secondExpectedWarning);

    useSuperseded(deprecationDate);
    assert_equals(warnings.length, 2);
  } finally {
    console.warn = savedConsoleWarn;
  }
}, 'Warn the first time each recently deprecated feature is used');

test(function() {
  var deprecationDate = new Date(new Date());
  deprecationDate.setDate(deprecationDate.getDate() - 95);

  for (var i = 0; i < 2; ++i) {
    try {
      useAncient();
      assert_true(false);
    } catch (e) {
      assert_equals(e.message, 'Ancient is no longer supported. Please use Modern instead.');
    }
  }
}, 'Throw each time an anciently deprecated feature is used');

