'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngClickDirective = ngClickDirective;
function ngClickDirective($parse) {
    return {
        compile: function compile(controllerService, expression) {
            if (angular.isString(expression)) {
                expression = $parse(expression);
            }
            if (controllerService.create) {
                controllerService.create();
            }

            var click = function click(event) {
                if (!event || !event.currentTarget.disabled && !event.isPropagationStopped() && !event.isDefaultPrevented()) {
                    expression(controllerService.controllerScope);
                    controllerService.$apply();
                }
            };
            click.onDestroy = function (fn) {
                controllerService.controllerScope.$on('$destroy', fn);
            };
            return click;
        },
        attachToElement: function attachToElement(controllerService, $element) {
            var clickData = $element.data('ng-click');
            $element.bind('click', clickData);
            clickData.onDestroy(function () {
                return $element.unbind();
            });
        },
        name: 'ng-click'
    };
}