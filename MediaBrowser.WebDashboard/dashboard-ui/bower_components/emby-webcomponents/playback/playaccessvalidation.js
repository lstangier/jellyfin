define(["connectionManager", "globalize"], function(connectionManager, globalize) {
    "use strict";

    function getRequirePromise(deps) {
        return new Promise(function(resolve, reject) {
            require(deps, resolve)
        })
    }

    function showErrorMessage() {
        return getRequirePromise(["alert"]).then(function(alert) {
            return alert(globalize.translate("sharedcomponents#MessagePlayAccessRestricted")).then(function() {
                return Promise.reject()
            })
        })
    }

    function PlayAccessValidation() {
        this.name = "Playback validation", this.type = "preplayintercept", this.id = "playaccessvalidation", this.order = -2
    }
    return PlayAccessValidation.prototype.intercept = function(options) {
        var item = options.item;
        if (!item) return Promise.resolve();
        var serverId = item.ServerId;
        return serverId ? connectionManager.getApiClient(serverId).getCurrentUser().then(function(user) {
            return user.Policy.EnableMediaPlayback ? Promise.resolve() : options.fullscreen ? showErrorMessage() : Promise.reject()
        }) : Promise.resolve()
    }, PlayAccessValidation
});