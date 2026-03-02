import { array, date, number, object, ref, string } from "yup";

const validationSchema = {
    /**
     * @var {Object}
     */
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
        pattern: "Invalid Format"
    },

    /**
     * Replace placeholders with rule parameters
     * @param {String} message
     * @param {Object} params
     * @returns {String}
     */
    format: function (string, params) {
        return string.replace(/{(\d+)}/g, (match, index) => {
            return typeof params[index] !== 'undefined' ? params[index] : match;
        });
    },

    /**
     * Get error message for a rule
     * @param {String} rule
     * @param {String|Object} messages
     * @param {Object} params
     * @returns {String}
     */
    getMessage: function (rule, messages, params) {
        let message;

        if (messages) {
            if (typeof messages === 'string') {
                message = messages;
            } else if (typeof messages === 'object' && messages[rule]) {
                message = messages[rule];
            }
        }

        if (!message && this.messages[rule]) {
            message = this.messages[rule];
        }

        if (message) {
            return this.format(message, params);
        }

        return message;
    },

    /**
     * Create Validation Schema
     * @param {Object} json
     * @param {Boolean} nested
     */
    createSchema: function (json, nested = false) {
        const schema = {};
        const rules = json.rules || {};
        const messages = json.messages || {};

        Object.keys(rules).forEach((key) => {
            let rule = rules[key];
            if (typeof rule === 'string') {
                rules[key] = {};
                rule.split(' ').forEach(function (value) {
                    value = value.trim();
                    if (value !== '') {
                        rules[key][value] = true;
                    }
                });
                rule = { ...rules[key] };
            } else if (!rule || typeof rule !== 'object') {
                rule = {};
            }

            let type = rule['type'] || 'string';
            delete rule.type;
            switch (type) {
                case 'number':
                    schema[key] = this.createNumberSchema(rule, messages[key] || {});
                    break;

                case 'date':
                    schema[key] = this.createDateSchema(rule, messages[key] || {});
                    break;

                case 'array':
                    schema[key] = this.createArraySchema(rule, messages[key] || {});
                    break;

                case 'string':
                default:
                    schema[key] = this.createStringSchema(rule, messages[key] || {});
                    break;
            }
        });

        if (nested) {
            return schema;
        }

        return object().shape(schema);
    },

    /**
     * Create schema for text fields
     * @param {Object} rules
     * @param {String|Object} messages
     */
    createStringSchema: function (rules, messages) {
        let schema = string();

        Object.keys(rules).forEach(rule => {
            switch (rule) {
                case "required":
                    schema = schema.required(this.getMessage(rule, messages));
                    break;

                case "email":
                    schema = schema.email(this.getMessage(rule, messages));
                    break;

                case "url":
                    schema = schema.url(this.getMessage(rule, messages));
                    break;

                case "minlength":
                    schema = schema.min(rules[rule], this.getMessage(rule, messages, [rules[rule]]));
                    break;

                case "maxlength":
                    schema = schema.max(rules[rule], this.getMessage(rule, messages, [rules[rule]]));
                    break;

                case "rangelength":
                    let params = rules[rule];
                    if (
                        !Array.isArray(params) || params.length !== 2 ||
                        isNaN(params[0]) || isNaN(params[1]) || params[0] > params[1]
                    ) {
                        throw new TypeError(
                            'The rangelength parameters provided are invalid. They should be an array of two numbers, with the first value less than or equal to the second.'
                        );
                    }
                    schema = schema.min(params[0], this.getMessage(rule, messages, params));
                    schema = schema.max(params[1], this.getMessage(rule, messages, params));
                    break;

                case "pattern":
                    let regex;
                    if (rules[rule] instanceof RegExp) {
                        regex = rules[rule];
                    } else {
                        regex = rules[rule];
                        if (typeof regex === 'string') {
                            regex = new RegExp(regex);
                        } else {
                            throw new TypeError(
                                `The regex pattern is invalid. The regex should be either a string or an instance of RegExp, got ${typeof regex}.`
                            );
                        }
                    }
                    schema = schema.matches(regex, this.getMessage(rule, messages));
                    break;

                case "equalTo":
                    schema = schema.equals([ref(rules[rule]), null], this.getMessage(rule, messages));
                    break;

                default:
                    break;
            }
        });

        return schema;
    },

    /**
     * Create schema for number fields
     * @param {Object} rules
     * @param {String|Object} messages
     */
    createNumberSchema: function (rules, messages) {
        let schema = number();

        Object.keys(rules).forEach(rule => {
            switch (rule) {
                case "required":
                    schema = schema.required(this.getMessage(rule, messages));
                    break;

                case "min":
                    schema = schema.min(rules[rule], this.getMessage(rule, messages, [rules[rule]]));
                    break;

                case "max":
                    schema = schema.max(rules[rule], this.getMessage(rule, messages, [rules[rule]]));
                    break;

                case "range":
                    let params = rules[rule];
                    if (
                        !Array.isArray(params) || params.length !== 2 ||
                        isNaN(params[0]) || isNaN(params[1]) || params[0] > params[1]
                    ) {
                        throw new TypeError(
                            'The range parameters provided are invalid. They should be an array of two numbers, with the first value less than or equal to the second.'
                        );
                    }
                    schema = schema.min(params[0], this.getMessage(rule, messages, params));
                    schema = schema.max(params[1], this.getMessage(rule, messages, params));
                    break;

                default:
                    break;
            }
        });

        return schema;
    },

    /**
    * Create schema for date fields
    * @param {Object} rules
    * @param {String|Object} messages
    */
    createDateSchema: function (rules, messages) {
        let schema = date();

        schema = schema.typeError(this.getMessage('date', messages));

        Object.keys(rules).forEach(rule => {
            switch (rule) {
                case "required":
                    schema = schema.required(this.getMessage(rule, messages));
                    break;

                case "min":
                    schema = schema.min(rules[rule], this.getMessage(rule, messages, [rules[rule]]));
                    break;

                case "max":
                    schema = schema.max(rules[rule], this.getMessage(rule, messages, [rules[rule]]));
                    break;

                default:
                    break;
            }
        });

        return schema;
    },

    /**
    * Create schema for array fields
    * @param {Object} rules
    * @param {String|Object} messages
    */
    createArraySchema: function (rules, messages) {
        let schema = array();
        let json;

        Object.keys(rules).forEach(rule => {
            switch (rule) {
                case "min":
                    schema = schema.min(rules[rule], this.getMessage(rule, messages, [rules[rule]]));
                    break;

                case "max":
                    schema = schema.max(rules[rule], this.getMessage(rule, messages, [rules[rule]]));
                    break;

                case "schema":
                    json = {
                        rules: rules["schema"],
                        messages: messages
                    };
                    schema = schema.of(this.createSchema(json, true));
                    break;

                default:
                    json = {
                        rules: {
                            "field": rules,
                        },
                        messages: {
                            "field": messages
                        }
                    };
                    let nestedSchema = this.createSchema(json, true);
                    if (nestedSchema['field']) {
                        schema = schema.of(nestedSchema['field']);
                    }
                    break;
            }
        });

        return schema;
    },

    /**
    * Create schema for tuple fields
    * @param {Object} rules
    * @param {String|Object} messages
    */
    createTupleSchema: function (rules, messages) {
        let schema = array();

        Object.keys(rules).forEach(rule => {
            switch (rule) {
                case "schema":
                    let json = {
                        rules: rules["schema"],
                        messages: messages
                    };
                    schema = schema.of(this.createSchema(json, true));
                    break;

                default:
                    break;
            }
        });

        return schema;
    }
};

export default validationSchema;