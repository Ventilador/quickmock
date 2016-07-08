var directiveHandler = (function() {
    var proto = angular.element.prototype;
    proto.ngFind = function(selector) {
        var values = {
            length: 0
        };
        for (var index = 0; index < this.length; index++) {
            values[values.length++] = this[index].querySelector(selector) || '';
        }
        return angular.element(join(values));
    };
    proto.click = function(locals) {
        if (this.length) {
            var click = this.data('ng-click');
            return click && click(locals);
        }
    };
    proto.text = function() {
        if (this.length) {
            var click = this.data('ng-bind');
            return click && click.apply(undefined, arguments);
        }
    };

    function getExpression(current, attribute) {
        var expression = current[0] && current[0].attributes.getNamedItem('ng-click');
        if (expression !== undefined && expression !== null) {
            expression = expression.value;
            return expression;
        }
    }

    function join(obj) {
        return Array.prototype.concat.apply([], obj);
    }

    function applyDirectivesToNodes(object, attributeName, compiledDirective) {
        object = angular.element(object);
        object.data(attributeName, compiledDirective);
        var childrens = object.children();
        for (var ii = 0; ii < childrens.length; ii++) {
            applyDirectivesToNodes(childrens[ii], attributeName, compiledDirective);
        }
    }

    function compile(obj, controllerService) {
        obj = angular.element(obj);
        for (var ii = 0; ii < obj[0].attributes.length; ii++) {
            var directiveName = obj[0].attributes[ii].name;
            var expression = obj[0].attributes[ii].value;
            var directive;
            if ((directive = directiveProvider.$get(directiveName))) {
                var compiledDirective = directive.compile(controllerService, expression);
                if (directive.ApplyToChildren) {
                    applyDirectivesToNodes(obj, directiveName, compiledDirective);
                } else {
                    obj.data(directiveName, compiledDirective);
                }
            }

        }
        var childrens = obj.children();
        for (ii = 0; ii < childrens.length; ii++) {
            compile(childrens[ii], controllerService);
        }
    }

    function control(controllerService, obj) {
        var current = angular.element(obj);
        if (!current || !controllerService) {
            return current;
        }
        compile(current, controllerService);

        return current;
    }

    return control;
})();

module.export = directiveHandler;