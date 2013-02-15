var assert = require('chai').assert
  , statem = require('./../lib/statem');

describe('statem', function () {

  describe('two states, one transition', function () {

    describe('with state definition', function () {

      beforeEach(function () {
        this.definition = {
          initial: 'A'
        , states: {
            A: { poke: 'B' }
          , B: { poke: 'A' }
          }
        };
        this.machine = statem.machine(this.definition);
      });

      it('begins in state A', function () {
        assert.strictEqual(this.machine.state(), 'A');
      });

      describe('on poke', function () {

        beforeEach(function () {
          this.machine.send('poke');
        });

        it('transitions to state B', function () {
          assert.strictEqual(this.machine.state(), 'B');
        });

        describe('on a second poke', function () {

          beforeEach(function () {
            this.machine.send('poke');
          });

          it('transitions back to state A', function () {
            assert.strictEqual(this.machine.state(), 'A');
          });

        });

      });

    });

  });

});
