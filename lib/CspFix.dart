// Copyright (c) 2014, <your name>. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

library CspFix;

import 'dart:async';
import 'dart:io';

export 'src/CspFix_base.dart';

Future Fix(FileSystemEntity file) {
  if (FileSystemEntity.isDirectorySync(file.path))
    return Fix(file);
  
  // read file
  // strip javascript and dart
  // save to external file
  // run next.
  return new Future();
}