import { useEffect, useRef } from "react";

let targetElement;

function getElement() {
    if (!targetElement) {
        targetElement = document.createElement('div');
    }
    return targetElement;
}

function useCustomEventListener(eventName, eventHandler, deps) {
    let element = useRef(null);
    if (!Array.isArray(deps)) {
        deps = [];
    }
    useEffect(function () {
        if (!element.current) {
            element.current = getElement();
        }
        let el = element.current;
        function handleEvent(event) {
            let data = event.detail;
            eventHandler(data);
        }
        el.addEventListener(eventName, handleEvent, false);
        return function () {
            if (el) {
                el.removeEventListener(eventName, handleEvent, false);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return function (el) {
        element.current = el;
    }
}

function emitCustomEvent(eventName, data) {
    let element = getElement();
    let event = new CustomEvent(eventName, { detail: data });
    element.dispatchEvent(event);
}

function newCustomEventEmitter() {
    let element;
    function emitter(el) {
        element = el;
    }
    emitter.emit = function (eventName, data) {
        var event = new CustomEvent(eventName, { bubbles: true, detail: data });
        if (element) {
            element.dispatchEvent(event);
        }
    };
    return emitter;
}

export { emitCustomEvent, newCustomEventEmitter, useCustomEventListener };
