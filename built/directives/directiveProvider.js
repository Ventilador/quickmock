'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ngBind = require('./internalDirectives/ngBind.js');

var _ngClick = require('./internalDirectives/ngClick.js');

var _ngIf = require('./internalDirectives/ngIf.js');

var _ngTranslate = require('./internalDirectives/ngTranslate.js');

console.log('directiveProvider');

var directiveProvider = function () {
    var directives = new Map(),
        toReturn = {},
        $parse = angular.injector(['ng']).get('$parse'),
        $translate = angular.injector(['ng', 'pascalprecht.translate']).get('$translate'),
        SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g,
        internals = {
        ngIf: (0, _ngIf.ngIfDirective)(),
        ngClick: (0, _ngClick.ngClickDirective)($parse),
        ngBind: (0, _ngBind.ngBindDirective)($parse),
        ngDisabled: (0, _ngIf.ngIfDirective)(),
        translate: (0, _ngTranslate.ngTranslateDirective)($translate, $parse),
        ngRepeat: {
            regex: '<div></div>',
            compile: function compile() {}
        },
        ngModel: {
            regex: '<input type="text"/>',
            compile: function compile() {}
        },
        translateValue: {},
        ngClass: {}
    };

    toReturn.toCamelCase = function (name) {
        return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
    };
    toReturn.$get = function (directiveName) {
        if (angular.isString(directiveName)) {
            directiveName = toReturn.toCamelCase(directiveName);
            if (internals[directiveName]) {
                return internals[directiveName];
            }
        }
        return directives.get(directiveName);
    };
    toReturn.$put = function (directiveName, directiveConstructor) {
        if (!angular.isFunction(directiveConstructor)) {
            throw 'directiveConstructor is not a function';
        }
        if (angular.isString(directiveName)) {
            directiveName = toReturn.toCamelCase(directiveName);
        }
        if (directives.has(directiveName)) {
            if (arguments.length === 3 && angular.isFunction(arguments[2]) && arguments[2]() === true) {
                directives.set(directiveName, directiveConstructor());
                console.log(['directive', directiveName, 'has been overwritten'].join(' '));
                return;
            }
            throw 'Cannot overwrite ' + directiveName + '.\nForgeting to clean much';
        }
        directives.set(directiveName, directiveConstructor());
    };
    toReturn.$clean = function () {
        directives.clear();
    };

    return toReturn;
}();
console.log('directiveProvider end');
exports.default = directiveProvider;