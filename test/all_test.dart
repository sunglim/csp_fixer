// Copyright (c) 2014, <your name>. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

library csp_fixer.test;

import 'dart:io';
import 'package:unittest/unittest.dart';
import 'package:csp_fixer/csp_fixer.dart';

main() {
  group('A group of tests', () {
    tearDown(() {
      new File('./resource/core-meta-original.html')
          .copySync('./resource/core-meta.html');
    });

    test ('One File', () {
      Fix(new File('./resource/core-meta.html'));
      expect(new File('./resource/core-meta-expect.html').readAsStringSync(),
             new File('./resource/core-meta.html').readAsStringSync());
    });
  });
}
