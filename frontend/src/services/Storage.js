class LocalStorage {
    set(key, value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    }

    get(key) {
        let value = localStorage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }
        return value;
    }

    remove(key) {
        localStorage.removeItem(key);
    }
}

class SessionStorage {
    set(key, value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        sessionStorage.setItem(key, value);
    }

    get(key) {
        let value = sessionStorage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value);
            } catch (e) {
                return value;
            }
        }
        return value;
    }

    remove(key) {
        sessionStorage.removeItem(key);
    }
}

const storage = {
    'local': new LocalStorage(),
    'session': new SessionStorage()
};

export const useStorage = (type) => {
    if (storage.hasOwnProperty(type)) {
        return storage[type];
    } else {
        throw new Error("Undefined Storage Type");
    }
};
