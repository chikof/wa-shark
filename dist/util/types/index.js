"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharkHandlerListeners = exports.CommandHandlerListeners = void 0;
var CommandHandlerListeners;
(function (CommandHandlerListeners) {
    CommandHandlerListeners["COMMAND_ERROR"] = "commandError";
    CommandHandlerListeners["COMMAND_COOLDOWN"] = "commandCooldown";
    CommandHandlerListeners["COMMAND_STARTED"] = "commandStarted";
    CommandHandlerListeners["COMMAND_FINISHED"] = "commandFinished";
    CommandHandlerListeners["COMMAND_BLOCKED"] = "commandBlocked";
    CommandHandlerListeners["MESSAGE_BLOCKED"] = "messageBlocked";
})(CommandHandlerListeners = exports.CommandHandlerListeners || (exports.CommandHandlerListeners = {}));
var SharkHandlerListeners;
(function (SharkHandlerListeners) {
    SharkHandlerListeners["LOAD"] = "load";
    SharkHandlerListeners["REMOVE"] = "remove";
})(SharkHandlerListeners = exports.SharkHandlerListeners || (exports.SharkHandlerListeners = {}));
