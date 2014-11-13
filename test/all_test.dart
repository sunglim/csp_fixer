// Copyright (c) 2014, <your name>. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

library csp_fixer.test;

import 'dart:io';
import 'package:unittest/unittest.dart';
import 'package:csp_fixer/csp_fixer.dart';

main() {
  group('A group of tests', () {
    Awesome awesome;

    setUp(() {
      awesome = new Awesome();
    });

    tearDown(() {
      // Restore the action, 'Read file'.
      new File('paper-ripple.html_original').copySync('paper-ripple.html');
    });

    test('First Test', () {
      expect(awesome.isAwesome, isTrue);
    });
    
    test('Read file', () {
      Fix(new File('paper-ripple.html'));
      expect(new File('paper-ripple.html').readAsStringSync(),
             new File('paper-ripple-expected.html').readAsStringSync());
    });
  });
}
