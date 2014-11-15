// Copyright (c) 2014, Sungguk Lim. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

library csp_fixer.cli;

import 'dart:io';
import 'package:csp_fixer/csp_fixer.dart' as csp_fixer;

void main(List<String> args)
{
  if (args.length == 0) {
    print ("csp_fixer will remove inline javascript and generate external javascript file.");
    print ("Usage: csp_fixer <directory || file>");
    print ("  e.g,.: csp_fixer ./core-meta");
    exit(-1);
  }

  String entity = args[0];
  csp_fixer.Fix(FileSystemEntity.isDirectorySync(entity) ? 
                new Directory(entity) : new File(entity));
}
