module.export = ngIfDirective;

function ngIfDirective() {
    return {
        regex: /ng-if="(.*)"/,
        compile: function(expression, controllerService) {
            var subscriptors = [];
            var lastValue;
            if (scopeHelper.isController(controllerService)) {
                if (controllerService.create) {
                    controllerService.create();
                }
                var watcher = controllerService.watch(expression, function() {
                    lastValue = arguments[0];
                    for (var ii = 0; ii < subscriptors.length; ii++) {
                        subscriptors[ii].apply(subscriptors, arguments);
                    }
                });
                controllerService.parentScope.$on('$destroy', function() {
                    do {
                        subscriptors.shift();
                    } while (subscriptors.length);
                    watcher();
                });
                var toReturn = function(callback) {
                    subscriptors.push(callback);
                    return function() {
                        var index = subscriptors.indexOf(callback);
                        subscriptors.splice(index, 1);
                    };
                };
                toReturn.value = function() {
                    return lastValue;
                };
                return toReturn;
            }
            throw 'Error in ngIf';
        }
    };
}