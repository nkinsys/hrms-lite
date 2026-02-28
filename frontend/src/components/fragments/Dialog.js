import { Fragment, useRef, useState } from "react";
import Alert from "./Dialog/Alert";
import Confirm from "./Dialog/Confirm";
import { emitCustomEvent, useCustomEventListener } from "../../services/Event";

export default function Dialog() {
    const [dialogs, setDialogs] = useState({});
    const opened = useRef([]);

    useCustomEventListener('dialog.create', (options) => {
        const dialog = {
            id: options.id,
            open: options.open,
            content: ''
        };
        switch (options.type) {
            case 'alert':
                dialog.content = <Alert {...options}></Alert>;
                break;

            case 'confirm':
                dialog.content = <Confirm {...options}></Confirm>;
                break;

            default:
                dialog.content = '';
        }
        dialogs[dialog.id] = dialog;
        if (dialog.open) {
            opened.current.push(dialog.id);
        }
        setDialogs({...dialogs});
    });

    useCustomEventListener('dialog.open', (id) => {
        if (dialogs[id]) {
            dialogs[id].open = true;
            opened.current.push(id);
            setDialogs({...dialogs});
        }
    });

    useCustomEventListener('dialog.close', (id) => {
        if (dialogs[id]) {
            dialogs[id].open = false;
            let index = opened.current.indexOf(id);
            if (index !== -1) {
                opened.current.splice(index, 1);
            }
            setDialogs({...dialogs});
        }
    });

    useCustomEventListener('dialog.destroy', (id) => {
        delete dialogs[id];
        let index = opened.current.indexOf(id);
        if (index !== -1) {
            opened.current.splice(index, 1);
        }
        setDialogs({...dialogs});
    });

    return (
        <>
            {opened.current.map((id) => {
                return <Fragment key={id}>{dialogs[id].content}</Fragment>;
            })}
        </>
    );
}

function create(options) {
    const id = options.id;
    const callback = options.callback;
    const destroyOnClose = options.destroyOnClose;

    const obj = {
        open: function () {
            emitCustomEvent("dialog.open", id);
        },
        close: function (result) {
            emitCustomEvent("dialog.close", id);
            if (typeof callback === "function") {
                callback(result);
            }
            if (destroyOnClose) {
                emitCustomEvent("dialog.destroy", id);
            }
        }
    };

    if (!destroyOnClose) {
        obj.destroy = function () {
            emitCustomEvent("dialog.destroy", id);
        };
    }

    options.callback = obj.close;
    emitCustomEvent("dialog.create", options);
    return Object.freeze(obj);
}

export function alert(options) {
    let opts = {
        id: Date.now(),
        type: 'alert',
        open: true,
        title: 'Attention',
        content: '',
        buttonLabel: 'Ok',
        callback: undefined,
        destroyOnClose: true
    };
    if (typeof options === 'object') {
        opts = {...opts, ...options}
    }
    return create(opts);
}

export function confirm(options) {
    let opts = {
        id: Date.now(),
        type: 'confirm',
        open: true,
        title: '',
        content: '',
        confirmButtonLabel: 'Ok',
        cancelButtonLabel: 'Cancel',
        callback: undefined,
        destroyOnClose: true
    };
    if (typeof options === 'object') {
        opts = {...opts, ...options}
    }
    return create(opts);
}
