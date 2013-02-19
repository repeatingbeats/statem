# statem

[![Build Status](https://travis-ci.org/repeatingbeats/statem.png)](https://travis-ci.org/repeatingbeats/statem)

__statem__ is a simple JavaScript state machine for Node.js build on top of event emitters. It is currently under development; use at your own risk. The intent is to publish a stable, supported 1.0 version to npm when ready.

[Read about why I wrote this.](http://www.repeatingbeats.com/writings/2013/02/18/a-state-of-refactoring/)

## Supported Environments

Statem is built for Node and has a dependency on Node's [EventEmitter class](http://nodejs.org/api/events.html#events_class_events_eventemitter). At this time, no attempt is made to support browser environments.

## Usage

### Machine Definitions

Statem supports declarative machine definitions keyed on either states or events. All usage examples in this README are for the following simple state machine.

![Statem Machine Diagram](http://www.repeatingbeats.com/images/statem-271cde30.png)

#### State Definition

State definitions map state names to valid transitions for the given state. The transitions are defined as a map of events to the destination state of the transition.

```js
var statem = require('statem');

machine = statem.machine({
  initial: 'ready'
, states: {
    ready: {
      change: 'working'
    }
  , working: {
      change: 'stale'
    , done: 'ready'
    }
  , stale: {
      change: 'stale'
    , done: 'working'
    }
  }
});
```

#### Event Definition

Event definitions map event names to valid transitions for the given event. The transitions are defined as a map of existing states to destination states.

```js
var statem = require('statem');

machine = statem.machine({
  initial: 'ready'
, events: {
    change: {
      ready: 'working'
    , working: 'stale'
    , stale: 'stale'
    }
  , done: {
      working: 'ready'
    , stale: 'working'
    }
  }
});
```

### Observing State and Signalling Events

Machine state can be observed with the `state` method. Events are signalled via `send`.

```js
machine.state(); // 'ready'

machine.send('change');

machine.state(); // 'working'

machine.send('change');

machine.state(); // 'stale'

machine.send('done');

machine.state(); // 'working'

machine.send('done');

machine.state(); // 'ready'
```

### Observer Hooks

Statem notifies observers on state exit and entry.

```js
machine.onEnter('working', function () {
  // Invoked when machine enters 'working' state
});

machine.onExit('stale', function () {
  // Invoked when machine exits 'stale' state
});
```

## API

### Primary Entry Point

#### statem.machine(definition)

Creates a statem machine. Requires either a state or event definition.

    @param {Object} definition
      @property {string} initial  Initial state of the machine
      @property {Object} [states] State definition
      @property {Object} [events] Event definition

    @returns {Machine} Statem machine

### Machine Instance Methods

#### Machine.prototype.state()

Gets current machine state.

    @returns {string} Current state

#### Machine.prototype.send(event)

Signals event to machine.

    @param {string} event Event name

    @throws {Error} if event is unknown
    @throws {Error} if current state does not accept event

#### Machine.prototype.onEnter(state, observer)

Attaches a state entry observer.

    @param {string}   state    State name
    @param {Function} observer Invoked when the machine enters the state

#### Machine.prototype.onExit(state, observer)

Attaches a state exit observer.

    @param {string}   state    State name
    @param {Function} observer Invoked when the machine exits the state

## Testing

    $ make test

## Linting

    $ make lint

## Licence

Statem is MIT licensed. See [LICENSE](https://github.com/repeatingbeats/statem/blob/master/LICENSE).
