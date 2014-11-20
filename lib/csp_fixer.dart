// Copyright (c) 2014, Sungguk Lim. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

library csp_fixer;

import 'dart:io';

import 'package:path/path.dart';
import 'package:html5lib/dom.dart' as dom;
import 'package:html5lib/parser.dart' show parse;

// Extract inline <script> blocks into a separate file.
void Fix(FileSystemEntity entity) {
  if (entity is Directory) {
    entity.listSync().forEach((directory_entity) {
      return Fix(directory_entity);
    });
  }
  // How Directory can enter here?
  if (entity is Directory) {
    return;
  }
  

  File readfile = entity;
  if (!readfile.path.endsWith('.html'))
    return;

  var htmlText = readfile.readAsStringSync();
  dom.Document htmlDom = parse(htmlText);
  List<dom.Node> script_dom = htmlDom.getElementsByTagName('script');

  int count = 0;
  script_dom.takeWhile((script_node) => script_node.attributes['src'] == null)
      .forEach((script_node) {
    File gen_file = new File('${readfile.path}.${count}.js');
    gen_file.writeAsStringSync(script_node.text);

    script_node.innerHtml = '';
    script_node.attributes['src'] = '${basename(gen_file.path)}';
    count++;
  });
  if (count > 0)
    readfile.writeAsStringSync(htmlDom.outerHtml);
}
