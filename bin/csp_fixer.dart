// Copyright (c) 2014, Sungguk Lim. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

library csp_fixer.cli;

import 'dart:io';
import 'package:path/path.dart';
import 'package:csp_fixer/csp_fixer.dart' as csp_fixer;

void main(List<String> args)
{
  csp_fixer.Fix((new FileSystemEntity(args[0]));
}
