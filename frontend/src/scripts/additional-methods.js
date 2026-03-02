import validator from "./validator";

validator.addRule("mobileIN", function (v) {
    v = v.replace( /\s+/g, "" );
    return v === '' || (v.length > 9 && v.match( /^[6-9]\d{9}$/ ));
}, "Please specify a valid mobile number.");

validator.addRule( "emailUsername", function( v, domain ) {
    if (domain[0] !== '@') {
        domain = '@' + domain;
    }
    if (v !== '') {
        v += domain;
    }
    return validator.rules.email.call(this, v);
}, "Please enter a valid email address." );