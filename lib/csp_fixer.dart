// Copyright (c) 2014, Sungguk Lim. All rights reserved. Use of this source code
// is governed by a BSD-style license that can be found in the LICENSE file.

library csp_fixer;

import 'dart:io';

import 'package:path/path.dart';
import 'package:html5lib/dom.dart' as dom;
import 'package:html5lib/parser.dart' show parse;

final _HTML_FNAME_RE = new RegExp(r'^.+\.(htm|html|HTM|HTML)$');

// Extract inline <script> blocks into a separate file.
void Fix(FileSystemEntity entity) {
  if (entity is Directory) {
    entity.listSync().forEach((sub_entity) {
      Fix(sub_entity);
    });
    return;
  }

  if (_HTML_FNAME_RE.matchAsPrefix(entity.path) == null)
    return;

  File readfile = entity;

  var htmlText = readfile.readAsStringSync();
  dom.Document htmlDom = parse(htmlText);
  List<dom.Node> script_dom = htmlDom.getElementsByTagName('script');

  int count = 0;
  script_dom.where((script_node) => script_node.attributes['src'] == null)
      .forEach((script_node) {
    File gen_file =
        new File('${readfile.path}.${count}.${_getExtension(script_node)}');
    gen_file.writeAsStringSync(script_node.text);

    script_node.innerHtml = '';
    script_node.attributes['src'] = '${basename(gen_file.path)}';
    count++;
  });
  if (count > 0)
    readfile.writeAsStringSync(htmlDom.outerHtml);
}

const _TYPE_TO_EXT = const {
  null: 'js',
  'application/javascript': 'js',
  'text/javascript': 'js',
  'application/dart': 'dart',
  'text/coffeescript': 'coffee'
};

String _getExtension(dom.Element script) {
  final String type = script.attributes['type'];
  final String ext = _TYPE_TO_EXT[type];
  // NOTE: The attempt to deduce the extension for an unknown type is only
  // half-decent.
  return ext != null ? ext : type.replaceAll('application/', '');
}
