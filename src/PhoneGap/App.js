// module PhoneGap.App

exports.initialize = function(app) {
    return function() {
        app.initialize();
        return {};
    };
};
