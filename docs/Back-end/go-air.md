# Air

Air is a Golang server hot reload tool.

## Installation

Follow the [official instruction](https://github.com/air-verse/air), using the `go install` which is recommanded by official docs.

`go install github.com/air-verse/air@latest`

## Configuration

1. Identify where the air binary file was just installed. It may not be install at `~/.air`

2. In my case, it's installed at `~/go/bin/air`. Therefore, we'll need to move this file to `~/.air`

   `mv ~/go/bin/air ~/.air`

3. Setting the alias in `./.zshrc ` as stated in the docs

   `alias air='~/.air'`

> Reference for zsh configuration: https://github.com/air-verse/air/issues/135

## Start using it

1. initailization

   - use existed air config file: `air -c .air.toml`

   - or initial one with defaults: `air inti`



2. start

   `air`