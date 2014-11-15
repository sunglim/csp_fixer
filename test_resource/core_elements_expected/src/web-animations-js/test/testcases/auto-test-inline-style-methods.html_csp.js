
'use strict';

var target = document.querySelector('#target');

document.timeline.play(new Animation(target, {left: '100px', composite: 'add'}, {duration: 1 * 1000, iterations: 2, direction: 'alternate'}));

at(0.5 * 1000, function() {
  assert_equals(target.style.length, 0);
  assert_in_array(target.style.getPropertyValue('left'), ['', null]);
});

testharness_timeline.schedule(function() {
  target.style.setProperty('left' , '50px');
  assert_styles(target, {left: '150px'}, 'getComputedStyle() should return correct value after setting inline style.');
}, 1000);

at(1.5 * 1000, function() {
  assert_equals(target.style.length, 1);
  assert_equals(target.style.getPropertyValue('left'), '50px');
});

testharness_timeline.schedule(function() {
  target.style.setProperty('left' , '100px');
  target.style.setProperty('background-color' , 'green');
}, 2500);

at(3 * 1000, function() {
  assert_equals(target.style.length, 2);
  assert_equals(target.style.getPropertyValue('left'), '100px');
  assert_equals(target.style.getPropertyValue('background-color'), 'green');
});

