const FILES_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function get_relative_url(route) {
    if (!route) {
        return '';
    }

    if (!route.startsWith(FILES_BASE_URL)) {
        return route;
    }

    return route.substr(FILES_BASE_URL.length - 1);
}

function get_absolute_url(route) {
    if (route.startsWith(FILES_BASE_URL)) {
        return route;
    }

    if (route.startsWith('/')) {
        route = route.substr(1);
    }

    return FILES_BASE_URL + route;
}

export {get_relative_url, get_absolute_url}