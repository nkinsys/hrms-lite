import React from "react";
import DocumentMeta from "react-document-meta";
import Column from "../elements/Column";
import Dialog from "../fragments/Dialog";

const meta = {
    title: '',
    description: "Demo project for React JS",
    canonical: null,
    meta: {
        charset: "utf-8",
        name: {
            "viewport": "width=device-width, initial-scale=1",
            "theme-color": "#000000",
            "keywords": "react,react-js,react.js,reactjs"
        }
    }
};

let root = document.getElementById("root");

class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.bodyClasses = [];

        this.pageClass = [undefined, null, ""].includes(props.pageClass)
            ? this.getPageClassFromUrl()
            : props.pageClass;

        if (props.bodyClasses) {
            this.addBodyClass(props.bodyClasses);
        }

        let url = window.location.href;
        if (url.lastIndexOf('/') === url.length - 1) {
            url = url.slice(0, -1);
        }

        this.state = {
            meta: { ...meta, ...{ canonical: url } }
        };
    }

    /**
     * @param {string} className
     */
    addBodyClass(className) {
        className = className.replace(/\s+/g, ' ');
        className.split(' ').forEach(className => {
            if (!this.bodyClasses.includes(className)) {
                this.bodyClasses.push(className);
            }
        });
    }

    getPageClassFromUrl() {
        if (window.location.pathname === '/') {
            return "home";
        }
        let pageClass = '';
        window.location.pathname.split('/').forEach((value) => {
            pageClass = value + '-';
        });
        pageClass = pageClass.slice(0, -1);
        return pageClass.toLowerCase();
    }

    static getColumns(children) {
        let columns = {
            'main': []
        };

        if (Array.isArray(children)) {
            children.forEach(element => {
                if (element) {
                    columns['main'].push(element);
                }
            });
        } else {
            columns['main'].push(children);
        }

        return columns;
    }

    static getDerivedStateFromProps(props, state) {
        if (props.meta !== undefined) {
            state['meta'] = { ...state['meta'], ...props.meta };
        }
        state['messages'] = Array.isArray(props.messages) ? props.messages : [];
        state['columns'] = Layout.getColumns(props.children);
        return state;
    }

    componentDidMount() {
        // console.log("Component Did Mount");
        root.classList.add(this.class, this.pageClass, ...this.bodyClasses);

        if (this.state.messages.length > 0) {
            setTimeout(function () {
                this.setState({ messages: [] });
            }.bind(this), 2000);
        }

        delete this.state.columns;
    }

    componentDidUpdate() {
        // console.log("Component Did Update");
        if (this.state.messages.length > 0) {
            setTimeout(function () {
                this.setState({ messages: [] });
            }.bind(this), 2000);
        }

        delete this.state.columns;
    }

    componentWillUnmount() {
        // console.log("Component Will Unmount");
        root.classList.remove(this.class, this.pageClass, ...this.bodyClasses);
    }
}

export default class Empty extends Layout {
    constructor(props) {
        super(props);

        this.class = "page-layout-empty";
    }

    render() {
        return (
            <>
                <DocumentMeta {...this.state.meta}></DocumentMeta>
                <Column blocks={this.state.columns.main}></Column>
                <Dialog></Dialog>
            </>
        );
    }
}
