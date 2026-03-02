const validator = {
    rules: {
        required: function (v) {
            return v !== '';
        },
        email: function (v) {
            return v === '' ||
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(v);
        },
        minlength: function (v, minlength) {
            return v === '' || minlength === undefined || v.length >= minlength;
        },
        maxlength: function (v, maxlength) {
            return v === '' || maxlength === undefined || v.length <= maxlength;
        },
        rangelength: function (v, props) {
            const [minlength, maxlength] = props;
            if (v !== '') {
                if (minlength !== undefined && v.length < minlength) {
                    return false;
                }
                if (maxlength !== undefined && v.length > maxlength) {
                    return false;
                }
            }
            return true;
        }
    },
    
    messages: {
        required: "This field is required.",
        remote: "Please fix this field.",
        email: "Please enter a valid email address.",
        url: "Please enter a valid URL.",
        date: "Please enter a valid date.",
        dateISO: "Please enter a valid date (ISO).",
        number: "Please enter a valid number.",
        digits: "Please enter only digits.",
        equalTo: "Please enter the same value again.",
        maxlength: "Please enter no more than {0} characters.",
        minlength: "Please enter at least {0} characters.",
        rangelength: "Please enter a value between {0} and {1} characters long.",
        range: "Please enter a value between {0} and {1}.",
        max: "Please enter a value less than or equal to {0}.",
        min: "Please enter a value greater than or equal to {0}.",
        step: "Please enter a multiple of {0}.",
    },
    
    format: function(string, params) {
        return string.replace(/{(\d+)}/g, (match, index) => {
            return typeof params[index] !== 'undefined' ? params[index] : match;
        });
    },
    
    validate: function(element, validation) {
        let result = true;
    
        Object.keys(validation).forEach((rule) => {
            if (this.rules[rule] !== undefined) {
                if (this.rules[rule](element.value, validation[rule]) === false) {
                    result = this.format(this.messages[rule], {...validation[rule]});
                    return false;
                }
            }
        });
    
        let label = element.parentElement.querySelector("label[class='error']");
    
        if (result !== true) {
            if (label === null) {
                label = document.createElement("label");
                label.classList.add("error", "d-none");
                label.setAttribute("for", element.id);
                element.insertAdjacentElement("afterend", label);
            }
            label.innerText = result;
            label.classList.remove("d-none");
            return false;
        } else if (label !== null) {
            label.classList.add('d-none');
        }
    
        return true;
    },

    addRule: function (name, callback, message) {
        if (typeof name !== "string") {
            throw new TypeError(
                `Argument name should be of type string, got ${typeof callback}.`
            );
        } else if (name === '') {
            throw new TypeError("Argument name cannot be empty.");
        } else if (this.rules[name] !== undefined) {
            throw new TypeError(`There is already a rule for the term "${name}".`);
        }

        if (!(callback instanceof Function)) {
            throw new TypeError(
                `Argument callback should be a callback function, got ${typeof callback}.`
            );
        }

        if (typeof message !== "string") {
            throw new TypeError(
                `Argument message should be of type string, got ${typeof callback}.`
            );
        } else if (message === '') {
            throw new TypeError("Argument message cannot be empty.");
        }

        this.rules[name] = callback;
        this.messages[name] = message;
    }
}

export default validator;