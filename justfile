mod frontend 'frontend/justfile'
mod etls 'etls/justfile'

alias c := check
alias d := dev

default: build

build:
    just frontend build

check:
    prek run --all-files

dev:
    just frontend dev
