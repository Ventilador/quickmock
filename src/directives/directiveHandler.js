var directiveHandler = (function() {
    function getExpression(current, attribute) {
        let expression = current[0] && current[0].attributes.getNamedItem('ng-click');
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
        const childrens = object.children();
        for (let ii = 0; ii < childrens.length; ii++) {
            applyDirectivesToNodes(childrens[ii], attributeName, compiledDirective);
        }
    }

    function compile(obj, controllerService) {
        obj = angular.element(obj);
        for (let ii = 0; ii < obj[0].attributes.length; ii++) {
            const directiveName = obj[0].attributes[ii].name;
            const expression = obj[0].attributes[ii].value;
            let directive;
            if (directive = directiveProvider.$get(directiveName)) {
                const compiledDirective = directive.compile(controllerService, expression);
                if (directive.ApplyToChildren) {
                    applyDirectivesToNodes(obj, directiveName, compiledDirective);
                } else {
                    obj.data(directiveName, compiledDirective);
                }
            }

        }
        const childrens = obj.children();
        for (let ii = 0; ii < childrens.length; ii++) {
            compile(childrens[ii], controllerService);
        }
    }

    function control(controllerService, obj) {
        let current = angular.element(obj);
        if (!current || !controllerService) {
            return current;
        }
        compile(current, controllerService);
        let proto = current.prototype || current.__proto__;
        proto.ngFind = function(selector) {
            let values = {
                length: 0
            };
            for (let index = 0; index < this.length; index++) {
                values[values.length++] = this[index].querySelector(selector) || '';
            }
            return angular.element(join(values));
        }
        proto.click = function(locals) {
            if (this.length) {
                const click = this.data('ng-click');
                click && click(locals);
            }
        }
        return current;
    }

    return control;
})();