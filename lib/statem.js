var EventEmitter = require('events').EventEmitter
  , iterators = require('./iterators')
  , inverter = require('./inverter');

function handle(event, transitions, context) {
  return function () {
    var state = context.state()
      , next = transitions[state];

    context._state = next;
  };
}

function Machine(definition) {
  var events = definition.events || inverter.invert(definition.states);

  this._state = definition.initial;
  this._emitter = new EventEmitter();

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

module.exports = {

  machine: function (definition) {
    return new Machine(definition);
  }

};
