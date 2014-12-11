// Copyright (c) 2014, <your name>. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

library csp_fixer.test;

import 'dart:io';
import 'package:unittest/unittest.dart';
import 'package:grinder/grinder_files.dart' as grinder_file;
import 'package:csp_fixer/csp_fixer.dart' as csp_fix;

main() {
  group('A group of tests', () {
    tearDown(() {
      Directory core_element_dir = new Directory('../test_resource/core_elements');
      grinder_file.deleteEntity(core_element_dir);
      grinder_file.copyDirectory(new Directory('../test_resource/core_elements_original'), core_element_dir);
     });

    test('Fix file', () {
      csp_fix.Fix(new File('./resource/mix_script.html'));
      // TODO(sunglim): check result.
    });

    test('Fix Directory', () {
      Directory target = new Directory('../test_resource/core_elements');
      csp_fix.Fix(target);

      List<int> content = new List<int>();
      target.listSync(recursive: true).forEach((entity){
        if (entity is File) {
          content.addAll(entity.readAsBytesSync());
        }
      });
      Directory expected = new Directory('../test_resource/core_elements_expected');
      List<int> expectedContent = new List<int>();
      expected.listSync(recursive: true).forEach((entity){
        if (entity is File) {
          expectedContent.addAll(entity.readAsBytesSync());
        }
      });
      expect(content, expectedContent);
    });
  });
}
