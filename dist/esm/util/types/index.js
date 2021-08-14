export var CommandHandlerListeners;
(function (CommandHandlerListeners) {
    CommandHandlerListeners["COMMAND_ERROR"] = "commandError";
    CommandHandlerListeners["COMMAND_COOLDOWN"] = "commandCooldown";
    CommandHandlerListeners["COMMAND_STARTED"] = "commandStarted";
    CommandHandlerListeners["COMMAND_FINISHED"] = "commandFinished";
    CommandHandlerListeners["COMMAND_BLOCKED"] = "commandBlocked";
    CommandHandlerListeners["MESSAGE_BLOCKED"] = "messageBlocked";
})(CommandHandlerListeners || (CommandHandlerListeners = {}));
export var SharkHandlerListeners;
(function (SharkHandlerListeners) {
    SharkHandlerListeners["LOAD"] = "load";
    SharkHandlerListeners["REMOVE"] = "remove";
})(SharkHandlerListeners || (SharkHandlerListeners = {}));
