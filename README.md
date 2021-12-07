@ubersetzer/cli
===============

Ubersetzer CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@ubersetzer/cli.svg)](https://npmjs.org/package/@ubersetzer/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@ubersetzer/cli.svg)](https://npmjs.org/package/@ubersetzer/cli)
[![License](https://img.shields.io/npm/l/@ubersetzer/cli.svg)](https://github.com/ubersetzerio/cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @ubersetzer/cli
$ ubersetzer COMMAND
running command...
$ ubersetzer (-v|--version|version)
@ubersetzer/cli/0.0.0 darwin-arm64 node-v14.17.1
$ ubersetzer --help [COMMAND]
USAGE
  $ ubersetzer COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ubersetzer hello [FILE]`](#ubersetzer-hello-file)
* [`ubersetzer help [COMMAND]`](#ubersetzer-help-command)

## `ubersetzer hello [FILE]`

describe the command here

```
USAGE
  $ ubersetzer hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ ubersetzer hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/ubersetzerio/cli/blob/v0.0.0/src/commands/hello.ts)_

## `ubersetzer help [COMMAND]`

display help for ubersetzer

```
USAGE
  $ ubersetzer help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.13/src/commands/help.ts)_
<!-- commandsstop -->
