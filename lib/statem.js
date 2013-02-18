var coreEvents = require('events')
  , iterators = require('./iterators')
  , inverter = require('./inverter');

function namespace(ns, state) {
  return [ ns, state ].join(':');
}

function handle(event, transitions, context) {
  return function () {
    var state = context.state()
      , next = transitions[state];

    if (state !== next) {
      context._emitter.emit(namespace('exit', state));
      context._state = next;
      context._emitter.emit(namespace('enter', next));
    }
  };
}

function Machine(definition) {
  var events = definition.events || inverter.invert(definition.states);

  this._state = definition.initial;
  this._emitter = new coreEvents.EventEmitter();

  iterators.iterate(events, function (transitions, event) {
    this._emitter.on(event, handle(event, transitions, this));
  }, this);
}

Machine.prototype.state = function () {
  return this._state;
};

Machine.prototype.send = function (event) {
  this._emitter.emit(event);
};

Machine.prototype.onEnter = function (state, observer) {
  this._emitter.on(namespace('enter', state), observer);
};

Machine.prototype.onExit = function (state, observer) {
  this._emitter.on(namespace('exit', state), observer);
};

module.exports = {

  machine: function (definition) {
    return new Machine(definition);
  }

};
