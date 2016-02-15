// module Main

exports.alert = function(str) {
    return function() {
        alert(str);
        return {};
    };
};

exports.alertAff = function(str) {
    return function(cb, eb) {
        alert(str);
        return cb({});
    };
};
