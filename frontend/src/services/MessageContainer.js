import { emitCustomEvent } from "./Event";

class MessageContainer {
    constructor(name) {
        if (!name) {
            throw new TypeError("Argument name cannot be empty.");
        } else if (typeof name !== 'string') {
            throw new TypeError("Argument name should be of type string, got " + (typeof name));
        }

        this.name = name;
        this.messages = [];
        this.timeout = null;
    }

    getName() {
        return this.name;
    }

    trigger(eventName) {
        if (!this.timeout) {
            this.timeout = setTimeout(function () {
                emitCustomEvent(eventName, this);
                clearTimeout(this.timeout);
                this.timeout = null;
            }.bind(this), 400);
        }
    }

    addMessage(type, message) {
        this.messages.push({
            type: type,
            message: message
        });

        this.trigger('message.update.' + this.name);
    }

    addSuccessMessage(message) {
        this.addMessage('success', message);
    }

    addWarningMessage(message) {
        this.addMessage('warning', message);
    }

    addInfoMessage(message) {
        this.addMessage('info', message);
    }

    addErrorMessage(message) {
        this.addMessage('error', message);
    }

    getMessages() {
        let messages = [...this.messages];
        this.messages = [];
        return messages;
    }
}

const instances = {};

/**
 * @param {String} name
 * @returns {MessageContainer}
 */
export default function getMessageContainer(name) {
    if (!name) {
        name = '*';
    }

    if (!instances[name]) {
        instances[name] = new MessageContainer(name);
    }

    return instances[name];
}
