var coreEvents = require('events')
  , util = require('util')
  , iterators = require('./iterators')
  , inverter = require('./inverter');

function namespace(ns, state) {
  return [ ns, state ].join(':');
}

function handle(event, transitions, context) {
  return function () {
    var state = context.state()
      , next = transitions[state];

    if (typeof next === 'undefined') {
      throw new Error(
        util.format(
          'The machine does not accept \'%s\' in \'%s\' state'
        , event
        , state
        )
      );
    }

    if (state !== next) {
      context._emitter.emit(namespace('exit', state));
      context._state = next;
      context._emitter.emit(namespace('enter', next));
    }
  };
}

/**
 * @constructor
 *
 * @see statem.machine
 */
function Machine(definition) {
  this._events = definition.events || inverter.invert(definition.states);

  this._state = definition.initial;
  this._emitter = new coreEvents.EventEmitter();

  iterators.iterate(this._events, function (transitions, event) {
    this._emitter.on(event, handle(event, transitions, this));
  }, this);
}

/**
 * Gets current machine state.
 *
 * @returns {string} Current state
 */
Machine.prototype.state = function () {
  return this._state;
};

/**
 * Signals event to machine.
 *
 * @param {string} event Event name
 *
 * @throws {Error} if event is unknown
 * @throws {Error} if current state does not accept event
 */
Machine.prototype.send = function (event) {
  if (!(event in this._events)) {
    throw new Error(
      util.format(
        'Unknown event \'%s\''
      , event
      )
    );
  }

  this._emitter.emit(event);
};

/**
 * Attaches a state entry observer.
 *
 * @param {string}   state    State name
 * @param {Function} observer Invoked when the machine enters the state
 */
Machine.prototype.onEnter = function (state, observer) {
  this._emitter.on(namespace('enter', state), observer);
};

/**
 * Attaches a state exit observer.
 *
 * @param {string}   state    State name
 * @param {Function} observer Invoked when the machine exits the state
 */
Machine.prototype.onExit = function (state, observer) {
  this._emitter.on(namespace('exit', state), observer);
};

module.exports = {

  /**
   * Creates a statem machine. Requires either a state or event definition.
   *
   * @param {Object} definition
   *   @property {string} initial  Initial state of the machine
   *   @property {Object} [states] State definition
   *   @property {Object} [events] Event definition
   *
   * @returns {Machine} Statem machine
   */
  machine: function (definition) {
    return new Machine(definition);
  }

};
