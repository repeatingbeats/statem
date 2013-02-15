GRUNT :=./node_modules/.bin/grunt
MOCHA :=./node_modules/.bin/mocha
TESTS := test/*.mocha.js

GREP ?=.*

lint:
	$(GRUNT) lint

watch:
	$(GRUNT) watch

test: lint
	NODE_ENV=test $(MOCHA) --grep "$(GREP)" $(TESTS)

test-debug:
	NODE_ENV=test $(MOCHA) --debug-brk --grep "$(GREP)" $(TESTS)

.PHONY: lint watch test test-debug
