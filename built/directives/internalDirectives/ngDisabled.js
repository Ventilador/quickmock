'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngDisabledDirective = ngDisabledDirective;

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _common = require('./../../controller/common.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ngDisabledDirective($parse) {
    return {
        compile: function compile(controllerService, expression) {
            var subscriptors = [];
            if (controllerService.create) {
                controllerService.create();
            }
            var lastValue = void 0;
            var getter = $parse(expression);
            controllerService.watch(function () {
                if (lastValue !== (lastValue = !!getter(controllerService.controllerScope))) {
                    subscriptors.forEach(function (fn) {
                        fn(lastValue);
                    });
                }
            });
            var toReturn = function toReturn() {
                return lastValue;
            };
            controllerService.controllerScope.$on('$destroy', function () {
                subscriptors.length = 0;
            });
            toReturn.changes = function (callback) {
                if (angular.isFunction(callback)) {
                    subscriptors.push(callback);
                    return function () {
                        var index = subscriptors.indexOf(callback);
                        subscriptors.splice(index, 1);
                    };
                }
                throw 'Callback is not a function';
            };
            return toReturn;
        },
        attachToElement: function attachToElement(controllerService, elem) {
            var model = elem.data('ng-disabled');
            model.changes(function (newValue) {
                (0, _jquery2.default)((0, _common.recurseObjects)(elem)).prop('disabled', newValue);
            });
        },
        name: 'ng-disabled'
    };
}