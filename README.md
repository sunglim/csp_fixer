# csp_fixer
[![Build Status](https://drone.io/github.com/sunglim/csp_fixer/status.png)](https://drone.io/github.com/sunglim/csp_fixer/latest)

A library to fix csp issue from Chrome App.

## License
MIT License.

## Usage

A simple usage example:

    import 'package:csp_fixer/csp_fixer.dart';

    Fix(new Directory('foo'));

## To run from command-line:
Requirement:

Dart SDK 1.7 or greater on your path.
Set pub scripts on your PATH. See how to [Link1].

Install:

    $> pub global activate csp_fixer
    
Update:

    # activate csp_fixer again
    $> pub global activate csp_fixer
    
Run csp:

    # ./core_elements is where you want to fix csp issue.
    $> csp_fix ./core_elements

    # core.html is what you want to fix csp issue.
    $> csp_fix core.html
    
## Features and bugs

Please file feature requests and bugs at the [issue tracker][tracker].

[tracker]: https://github.com/sunglim/csp_fixer/issues
[Link1]: https://www.dartlang.org/tools/pub/cmd/pub-global.html#running-a-script-from-your-path
