import { Component, createContext, useEffect, useRef, useState } from "react";

const Views = {
    Mobile: 'mobile',
    Tablet: 'tablet',
    Desktop: 'desktop'
};

let current = null;

function getView() {
    if (window.matchMedia('(min-width: 1024px)').matches) {
        current = Views.Desktop;
    } else if (window.matchMedia('(min-width: 768px)').matches) {
        current = Views.Tablet;
    } else {
        current = Views.Mobile;
    }

    return current;
}

function getViewStates() {
    let state = {
        isMobile: false,
        isTablet: false,
        isDesktop: false
    };

    switch (getView()) {
        case Views.Desktop:
            state.isDesktop = true;
            break;
            
        case Views.Tablet:
            state.isTablet = true;
            break;
            
        default:
            state.isMobile = true;
            break;
    }

    return state;
}

export const ViewContext = createContext();

export const useView = () => {
    const prevView = useRef(getView());
    const [view, setView] = useState(prevView.current);
    
    useEffect(function () {
        function updateView() {
            let currentView = getView();
            if (currentView !== prevView.current) {
                setView(currentView);
                prevView.current = currentView;
            }
        }
        window.addEventListener('resize', updateView);

        return () => {
            window.removeEventListener('resize', updateView);
        }
    }, []);

    return view;
};

const isMobile = () => {
    return current === Views.Mobile;
}

const isTablet = () => {
    return current === Views.Tablet;
}

const isDesktop = () => {
    return current === Views.Desktop;
}

class AbstractView extends Component {
    constructor(props) {
        super(props);

        this.state = getViewStates();

        this.updateViewStates = this.updateViewStates.bind(this);
    }

    updateViewStates() {
        this.setState(getViewStates());
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateViewStates);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateViewStates);
    }
}

class MobileView extends AbstractView {
    render() {
        return this.state.isMobile ? this.props.children : '';
    }
}

class TabletView extends AbstractView {
    render() {
        return this.state.isTablet ? this.props.children : '';
    }
}

class DesktopView extends AbstractView {
    render() {
        return this.state.isDesktop ? this.props.children : '';
    }
}

export { isMobile, isTablet, isDesktop, MobileView, TabletView, DesktopView };
