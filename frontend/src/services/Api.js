function parse(params, previous = '') {
    let key, index, subquery, query = '';

    for (key in params) {
        if (typeof params[key] === 'object' && params[key] !== null) {
            for (index in params[key]) {
                if (typeof params[key][index] === 'object' && params[key][index] !== null) {
                    if (Object.keys(params[key][index]).length > 0) {
                        subquery = parse(
                            params[key][index],
                            (previous === '' ? key : previous + '[' + key + ']') + '[' + index + ']'
                        );
                        if (subquery !== '') {
                            query += subquery + '&';
                        }
                    } else {
                        query += (previous === '' ? key : previous + '[' + key + ']')
                            + '[' + index + ']=' + params[key][index] + '&';
                    }
                } else if (params[key][index] !== undefined && params[key][index] !== null) {
                    query += (previous === '' ? key : previous + '[' + key + ']')
                        + '[' + index + ']=' + params[key][index] + '&';
                }
            }
        } else if (params[key] !== undefined && params[key] !== null) {
            query += (previous === '' ? key : previous + '[' + key + ']') + '=' + params[key] + '&';
        }
    }

    return query.slice(0, -1);
}

const Api = function () {
    return {
        requestAsync: function (url, method, params, headers, xhrFields = {}) {
            method = method.toUpperCase();

            let query = '';

            if (method === 'GET' || method === 'DELETE') {
                query = parse(params);
                if (query !== '') {
                    url += '?' + query;
                }
            }

            if (params instanceof FormData) {
                delete headers["Content-Type"];
            }

            let xhr = new XMLHttpRequest();
            xhr.open(method, url);

            Object.keys(headers).forEach(function (key) {
                xhr.setRequestHeader(key, headers[key]);
            });

            if (xhrFields.responseType) {
                xhr.responseType = xhrFields.responseType;
            }

            let promise = new Promise((resolve, reject) => {
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.getResponseHeader('Content-Type') === 'application/json') {
                            xhr.responseJSON = JSON.parse(xhr.responseText);
                        }
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr);
                        } else if (xhr.status < 200 || xhr.status >= 400) {
                            reject(xhr);
                        }
                    }
                }
            });

            if (query !== '') {
                xhr.send();
            } else if (params instanceof FormData) {
                xhr.send(params);
            } else {
                xhr.send(JSON.stringify(params));
            }

            return promise;
        },

        request: function (url, method, params, headers, xhrFields = {}) {
            method = method.toUpperCase();

            let query = '';

            if (method === 'GET' || method === 'DELETE') {
                query = parse(params);
                if (query !== '') {
                    url += '?' + query;
                }
            }

            if (params instanceof FormData) {
                delete headers["Content-Type"];
            }

            let xhr = new XMLHttpRequest();
            xhr.open(method, url, false);

            Object.keys(headers).forEach(function (key) {
                xhr.setRequestHeader(key, headers[key]);
            });

            if (xhrFields.responseType) {
                xhr.responseType = xhrFields.responseType;
            }

            if (query !== '') {
                xhr.send();
            } else if (params instanceof FormData) {
                xhr.send(params);
            } else {
                xhr.send(JSON.stringify(params));
            }

            if (xhr.getResponseHeader('Content-Type') === 'application/json') {
                xhr.responseJSON = JSON.parse(xhr.responseText);
            }
            if (xhr.status >= 200 && xhr.status < 300) {
                return xhr;
            } else if (xhr.status < 200 || xhr.status >= 400) {
                throw xhr;
            }
        },

        get: function (url, params = {}, headers = {}, async = true) {
            if (async) {
                return this.requestAsync(url, "GET", params, headers);
            } else {
                return this.request(url, "GET", params, headers);
            }
        },

        post: function (url, payload = {}, headers = {}, async = true) {
            if (!headers.hasOwnProperty("Content-Type")) {
                headers["Content-Type"] = "application/json";
            }

            if (async) {
                return this.requestAsync(url, "POST", payload, headers);
            } else {
                return this.request(url, "POST", payload, headers);
            }
        },

        put: function (url, payload = {}, headers = {}, async = true) {
            if (!headers.hasOwnProperty("Content-Type")) {
                headers["Content-Type"] = "application/json";
            }

            if (async) {
                return this.requestAsync(url, "PUT", payload, headers);
            } else {
                return this.request(url, "PUT", payload, headers);
            }
        },

        delete: function (url, headers = {}, async = true) {
            if (async) {
                return this.requestAsync(url, "DELETE", {}, headers);
            } else {
                return this.request(url, "DELETE", {}, headers);
            }
        },

        media: async function (url, params = {}, headers = {}, download = false, filename = "", responseType = "blob") {
            return this.requestAsync(url, "GET", params, headers, { "responseType": responseType })
                .then((response) => {
                    const header = response.getResponseHeader("Content-Disposition");
                    if (header) {
                        if (header.startsWith("attachment")) {
                            download = true;
                        }
                        if (!filename && header.indexOf("filename=") !== -1) {
                            filename = header.slice(header.indexOf("filename=") + 9).trim();
                            if (filename.startsWith('"') || filename.startsWith("'")) {
                                filename = filename.slice(1);
                            }
                            if (filename.endsWith('"') || filename.endsWith("'")) {
                                filename = filename.slice(0, -1);
                            }
                            filename = filename.trim();
                        }
                    }

                    const url = URL.createObjectURL(response.response);
                    if (download) {
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.target = "_blank";
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    } else {
                        window.open(url);
                    }
                    URL.revokeObjectURL(url);
                }).catch((response) => {
                    if (response.responseJSON && response.responseJSON.detail) {
                        throw new Error(response.responseJSON.detail);
                    } else {
                        throw new Error(response.responseText || "Something went wrong! Kindly try after sometime.");
                    }
                });
        }
    };
}();

export default Api;