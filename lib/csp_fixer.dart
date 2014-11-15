// Copyright (c) 2014, Sungguk Lim. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

library csp_fixer;

import 'dart:io';
import 'package:path/path.dart';

// Run csp fix. create new javascript file.
// handle only first <script /> tag.
void Fix(FileSystemEntity file) {
  if (file is Directory) {
    Directory current = file;
    current.listSync().forEach((one) {
      return Fix(one);
    });
  }

  // How Directory can enter here?
  if (file is Directory) {
    return;
  }
  File readfile = file;
  if (!readfile.path.endsWith('.html'))
    return;

  // TODO(sungguk) : Use domParser. string.indexOf treats <script> in comment.
  final String SCRIPT_START = '<script>';
  final String SCRIPT_END = '</script>';
  String content = readfile.readAsStringSync();
  // To get actual <script> tag. which is not a comment.
  // TODO: Use DomParser.
  int scriptStart = content.lastIndexOf(SCRIPT_START);
  int scriptEnd = content.indexOf(SCRIPT_END, scriptStart + 30);
  if (scriptStart == -1 || scriptEnd == -1)
    return;
  String scriptContent =
      content.substring(scriptStart + SCRIPT_START.length, scriptEnd);

  File scriptFile = new File(readfile.path + '_csp.js');
  scriptFile.createSync();
  scriptFile.writeAsStringSync(scriptContent);

  content = content.substring(0, scriptStart)
          + '<script src="${basename(scriptFile.path)}"></script>'
          + content.substring(scriptEnd + SCRIPT_END.length);
  readfile.writeAsStringSync(content);
}
