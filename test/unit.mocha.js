var coreEvents = require('events')
  , assert = require('chai').assert
  , sinon = require('sinon')
  , statem = require('./../lib/statem');

describe('[unit] statem', function () {

  beforeEach(function () {

    this.states = {
      A: { poke: 'B', prod: 'A' }
    , B: { poke: 'C', prod: 'A' }
    , C: { poke: 'C', prod: 'B', invalid: 'C' }
    };

    // Equivalent event definition
    this.events = {
      poke: { A: 'B', B: 'C', C: 'C' }
    , prod: { A: 'A', B: 'A', C: 'B' }
    , invalid: { C: 'C' }
    };

    this.spyEmitter = new coreEvents.EventEmitter();
    sinon.spy(this.spyEmitter, 'on');
    sinon.spy(this.spyEmitter, 'emit');

    this.testState = 'testState';
    this.testEvent = 'testEvent';

    sinon.stub(coreEvents, 'EventEmitter').returns(this.spyEmitter);
  });

  afterEach(function () {
    coreEvents.EventEmitter.restore();
  });

  describe('Machine', function () {

    beforeEach(function () {
      this.machine = statem.machine({ initial: 'A', states: this.states });
    });

    describe('.prototype', function () {

      describe('.state', function () {

        it('returns the current state', function () {
          this.machine._state = this.testState;

          assert.strictEqual(this.machine.state(), this.testState);
        });

      });

      describe('.send', function () {

        it('emits the event', function () {
          this.machine.send(this.testEvent);

          assert.deepEqual(
            this.spyEmitter.emit.lastCall.args
          , [ this.testEvent ]
          );
        });

      });

      describe('.onEnter', function () {

        it('adds an enter observer', function () {
          var observer = function () {};

          this.machine.onEnter(this.testEvent, observer);

          assert.deepEqual(
            this.spyEmitter.on.lastCall.args
          , [ [ 'enter', this.testEvent ].join(':'), observer ]
          );
        });

      });

      describe('.onExit', function () {

        it('adds an exit observer', function () {
          var observer = function () {};

          this.machine.onExit(this.testEvent, observer);

          assert.deepEqual(
            this.spyEmitter.on.lastCall.args
          , [ [ 'exit', this.testEvent ].join(':'), observer ]
          );
        });

      });

    });

    describe('event handlers', function () {

      beforeEach(function () {

        this.observers = {};

        [ 'A', 'B', 'C' ].forEach(function (state) {
          this.observers['enter:' + state] = sinon.stub();
          this.observers['exit:' + state] = sinon.stub();

          this.machine.onEnter(state, this.observers['enter:' + state]);
          this.machine.onExit(state, this.observers['exit:' + state]);
        }, this);

      });

      describe('when in state A', function () {

        beforeEach(function () {
          this.machine._state = 'A';
        });

        describe('on poke', function () {

          beforeEach(function () {
            this.spyEmitter.emit('poke');
          });

          it('invokes the exit A observer', function () {
            assert.strictEqual(this.observers['exit:A'].callCount, 1);
          });

          it('transitions to B', function () {
            assert.strictEqual(this.machine.state(), 'B');
          });

          it('invokes the enter B observer', function () {
            assert.strictEqual(this.observers['enter:B'].callCount, 1);
          });

          it('invokes exit observers before entry observers', function () {
            sinon.assert.callOrder(
              this.observers['exit:A']
            , this.observers['enter:B']
            );
          });

        });

        describe('on prod', function () {

          beforeEach(function () {
            this.spyEmitter.emit('prod');
          });

          it('does not invoke exit A observers', function () {
            assert.strictEqual(this.observers['exit:A'].callCount, 0);
          });

          it('remains in state A', function () {
            assert.strictEqual(this.machine.state(), 'A');
          });

          it('does not invoke enter A observers', function () {
            assert.strictEqual(this.observers['enter:A'].callCount, 0);
          });

          it('does not invoke enter B observers', function () {
            assert.strictEqual(this.observers['enter:B'].callCount, 0);
          });

        });

      });

      describe('when in state B', function () {

        beforeEach(function () {
          this.machine._state = 'B';
        });

        describe('on poke', function () {

          beforeEach(function () {
            this.spyEmitter.emit('poke');
          });

          it('invokes the exit B observer', function () {
            assert.strictEqual(this.observers['exit:B'].callCount, 1);
          });

          it('transitions to C', function () {
            assert.strictEqual(this.machine.state(), 'C');
          });

          it('invokes the enter C observer', function () {
            assert.strictEqual(this.observers['enter:C'].callCount, 1);
          });

          it('invokes exit observers before entry observers', function () {
            sinon.assert.callOrder(
              this.observers['exit:B']
            , this.observers['enter:C']
            );
          });

        });

        describe('on prod', function () {

          beforeEach(function () {
            this.spyEmitter.emit('prod');
          });

          it('invokes the exit B observer', function () {
            assert.strictEqual(this.observers['exit:B'].callCount, 1);
          });

          it('transitions to A', function () {
            assert.strictEqual(this.machine.state(), 'A');
          });

          it('invokes the enter A observer', function () {
            assert.strictEqual(this.observers['enter:A'].callCount, 1);
          });

          it('invokes exit observers before entry observers', function () {
            sinon.assert.callOrder(
              this.observers['exit:B']
            , this.observers['enter:A']
            );
          });

        });

      });

      describe('when in state C', function () {

        beforeEach(function () {
          this.machine._state = 'C';
        });

        describe('on poke', function () {

          beforeEach(function () {
            this.spyEmitter.emit('poke');
          });

          it('does not invoke exit C observers', function () {
            assert.strictEqual(this.observers['exit:C'].callCount, 0);
          });

          it('remains in state C', function () {
            assert.strictEqual(this.machine.state(), 'C');
          });

          it('does not invoke enter C observers', function () {
            assert.strictEqual(this.observers['enter:C'].callCount, 0);
          });

          it('does not invoke enter B observers', function () {
            assert.strictEqual(this.observers['enter:B'].callCount, 0);
          });

        });

        describe('on prod', function () {

          beforeEach(function () {
            this.spyEmitter.emit('prod');
          });

          it('invokes the exit C observer', function () {
            assert.strictEqual(this.observers['exit:C'].callCount, 1);
          });

          it('transitions to B', function () {
            assert.strictEqual(this.machine.state(), 'B');
          });

          it('invokes the enter B observer', function () {
            assert.strictEqual(this.observers['enter:B'].callCount, 1);
          });

          it('invokes exit observers before entry observers', function () {
            sinon.assert.callOrder(
              this.observers['exit:C']
            , this.observers['enter:B']
            );
          });

        });

      });

    });

    describe('invalid transitions', function() {

      function invalidAssertions() {

        // Common test cases for invalid transitions. Expects the test context
        // to have an `event` attribute containing the string event and a
        // `regex` attribute containing an error matcher.

        it('throws', function () {
          assert.throws(
            function () {
              this.machine.send(this.event);
            }.bind(this)
          , this.regex
          );
        });

        it('does not change machine state', function () {
          var threw = false;

          this.machine._state = 'A';

          try {
            this.machine.send(this.event);
          }
          catch (e) {
            assert.equal(this.machine.state(), 'A');
            threw = true;
          }

          // safeguard to ensure we actually asserted
          assert.isTrue(threw);
        });
      }

      describe('for unknown events', function() {

        beforeEach(function () {
          this.event = 'test-event-unknown';
          this.regex = new RegExp(
            'unknown event.*\'' + this.event + '\''
          , 'i'
          );
        });

        invalidAssertions();

      });

      describe('for known events in non-accepting states', function() {

        beforeEach(function () {
          // The 'A' state does not accept 'invalid'
          this.event = 'invalid';
          this.regex = new RegExp(
            [
              'machine does not accept'
            , '\'invalid\''
            , 'in \'A\' state'
            ].join('.*')
          , 'i'
          );
        });

        invalidAssertions();

      });

    });

  });

});
