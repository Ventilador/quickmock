export function ngClickDirective($parse) {
    return {
        compile: function (controllerService, expression) {
            if (angular.isString(expression)) {
                expression = $parse(expression);
            }
            if (controllerService.create) {
                controllerService.create();
            }

            var click = function (event) {
                if (!event || (!event.currentTarget.disabled && !event.isPropagationStopped() && !event.isDefaultPrevented())) {
                    expression(controllerService.controllerScope);
                    controllerService.$apply();
                }
            };
            click.onDestroy = function (fn) {
                controllerService.controllerScope.$on('$destroy', fn);
            };
            return click;
        },
        attachToElement: function (controllerService, $element) {
            const clickData = $element.data('ng-click');
            $element.bind('click', clickData);
            clickData.onDestroy(() => $element.unbind());
        },
        name: 'ng-click'
    };
}