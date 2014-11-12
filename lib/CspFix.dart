// Copyright (c) 2014, <your name>. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

library CspFix;

import 'dart:io';

export 'src/CspFix_base.dart';

// Run csp fix. create new javascript file.
// handle only first <script /> tag.
void Fix(FileSystemEntity file) {
  if (FileSystemEntity.isDirectorySync(file.path)) {
    Directory current = file;
    current.listSync(recursive: true).forEach((one) {
      return Fix(current);
    });
  }
  
  File readfile = file;
  String content = readfile.readAsStringSync().toLowerCase();
  int scriptStart = content.indexOf('<script');
  int scriptEnd = content.indexOf('script>', scriptStart + 30);
  String scriptContent = content.substring(scriptStart, scriptEnd + 7);
  
  File scriptFile = new File(readfile.path + '_csp.js');
  scriptFile.createSync();
  scriptFile.writeAsStringSync(scriptContent);
  
  content = content.substring(0, scriptStart)
          + '<script src="${scriptFile.path}"></script>'
          + content.substring(scriptEnd + 7);
  readfile.writeAsStringSync(content);
}
