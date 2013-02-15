var assert = require('chai').assert
  , statem = require('./../lib/statem');

describe('statem', function () {

  describe('two states, one event', function () {

    function checkit () {

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
    }

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

      checkit();

    });

    describe('with event definition', function () {

      beforeEach(function () {
        this.definition = {
          initial: 'A'
        , events: {
            poke: { A: 'B', B: 'A' }
          }
        };
        this.machine = statem.machine(this.definition);
      });

      checkit();

    });

  });

  describe('three states, two events', function () {

    function checkit() {

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

      });

      describe('on poke|poke', function () {

        beforeEach(function () {
          this.machine.send('poke');
          this.machine.send('poke');
        });

        it('transitions to state B then C', function () {
          assert.strictEqual(this.machine.state(), 'C');
        });

      });

      describe('on poke|poke|poke', function () {

        beforeEach(function () {
          this.machine.send('poke');
          this.machine.send('poke');
          this.machine.send('poke');
        });

        it('transitions to state B then C then C', function () {
          assert.strictEqual(this.machine.state(), 'C');
        });

      });

      describe('on poke|poke|prod', function () {

        beforeEach(function () {
          this.machine.send('poke');
          this.machine.send('poke');
          this.machine.send('prod');
        });

        it('transitions to state B then C then B', function () {
          assert.strictEqual(this.machine.state(), 'B');
        });

      });

      describe('on poke|poke|prod|prod', function () {

        beforeEach(function () {
          this.machine.send('poke');
          this.machine.send('poke');
          this.machine.send('prod');
          this.machine.send('prod');
        });

        it('transitions to state B then C then B then A', function () {
          assert.strictEqual(this.machine.state(), 'A');
        });

      });

      describe('on prod', function () {

        beforeEach(function () {
          this.machine.send('prod');
        });

        it('remains in state A', function () {
          assert.strictEqual(this.machine.state(), 'A');
        });

      });

      describe('on prod|prod', function () {

        beforeEach(function () {
          this.machine.send('prod');
          this.machine.send('prod');
        });

        it('remains in state A', function () {
          assert.strictEqual(this.machine.state(), 'A');
        });

      });

      describe('on prod|poke', function () {

        beforeEach(function () {
          this.machine.send('prod');
          this.machine.send('poke');
        });

        it('transitions to state B', function () {
          assert.strictEqual(this.machine.state(), 'B');
        });

      });

      describe('on prod|poke|prod', function () {

        beforeEach(function () {
          this.machine.send('prod');
          this.machine.send('poke');
          this.machine.send('prod');
        });

        it('transitions to state B then A', function () {
          assert.strictEqual(this.machine.state(), 'A');
        });

      });

    }

    describe('with state definition', function () {

      beforeEach(function () {
        this.definition = {
          initial: 'A'
        , states: {
            A: { poke: 'B', prod: 'A' }
          , B: { poke: 'C', prod: 'A' }
          , C: { poke: 'C', prod: 'B' }
          }
        };
        this.machine = statem.machine(this.definition);
      });

      checkit();

    });

    describe('with event definition', function () {

      beforeEach(function () {
        this.definition = {
          initial: 'A'
        , events: {
            poke: { A: 'B', B: 'C', C: 'C' }
          , prod: { A: 'A', B: 'A', C: 'B' }
          }
        };
        this.machine = statem.machine(this.definition);
      });

      checkit();

    });

  });

});
