var directiveHandler = (function() {
<<<<<<< HEAD
    var proto = angular.element.prototype;
=======
    let proto = angular.element.prototype || angular.element.__proto__;
>>>>>>> parent of 259f405... Changed let const to var for proteus
    proto.ngFind = function(selector) {
        let values = {
            length: 0
        };
        for (let index = 0; index < this.length; index++) {
            values[values.length++] = this[index].querySelector(selector) || '';
        }
        return angular.element(join(values));
    };
    proto.click = function(locals) {
        if (this.length) {
            const click = this.data('ng-click');
            return click && click(locals);
        }
    };
    proto.text = function() {
        if (this.length) {
            const click = this.data('ng-bind');
            return click && click.apply(undefined, arguments);
        }
    };

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
<<<<<<< HEAD
        for (var ii = 0; ii < obj[0].attributes.length; ii++) {
            var directiveName = obj[0].attributes[ii].name;
            var expression = obj[0].attributes[ii].value;
            var directive;
            if ((directive = directiveProvider.$get(directiveName))) {
                var compiledDirective = directive.compile(controllerService, expression);
=======
        for (let ii = 0; ii < obj[0].attributes.length; ii++) {
            const directiveName = obj[0].attributes[ii].name;
            const expression = obj[0].attributes[ii].value;
            let directive;
            if (directive = directiveProvider.$get(directiveName)) {
                const compiledDirective = directive.compile(controllerService, expression);
>>>>>>> parent of 259f405... Changed let const to var for proteus
                if (directive.ApplyToChildren) {
                    applyDirectivesToNodes(obj, directiveName, compiledDirective);
                } else {
                    obj.data(directiveName, compiledDirective);
                }
            }

        }
<<<<<<< HEAD
        var childrens = obj.children();
        for (ii = 0; ii < childrens.length; ii++) {
=======
        const childrens = obj.children();
        for (let ii = 0; ii < childrens.length; ii++) {
>>>>>>> parent of 259f405... Changed let const to var for proteus
            compile(childrens[ii], controllerService);
        }
    }

    function control(controllerService, obj) {
        let current = angular.element(obj);
        if (!current || !controllerService) {
            return current;
        }
        compile(current, controllerService);

        return current;
    }

    return control;
})();

module.export = directiveHandler;