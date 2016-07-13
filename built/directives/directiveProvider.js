'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ngModel = require('./internalDirectives/ngModel.js');

var _ngClick = require('./internalDirectives/ngClick.js');

var _ngIf = require('./internalDirectives/ngIf.js');

var _ngTranslate = require('./internalDirectives/ngTranslate.js');

var _ngBind = require('./internalDirectives/ngBind.js');

var _ngClass = require('./internalDirectives/ngClass.js');

var _common = require('./../controller/common.js');

var _ngRepeat = require('./internalDirectives/ngRepeat.js');

var directiveProvider = function () {
    var $translate = angular.injector(['ng', 'pascalprecht.translate']).get('$translate');
    var directives = new Map(),
        toReturn = {},
        $parse = angular.injector(['ng']).get('$parse'),
        $animate = angular.injector(['ng']).get('$animate'),
        $transclude = function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {

        // No scope passed in:
        if (!_common.scopeHelper.isScope(scope)) {
            futureParentElement = cloneAttachFn;
            cloneAttachFn = scope;
            scope = undefined;
        }
    },
        internals = {
        ngIf: (0, _ngIf.ngIfDirective)(),
        ngClick: (0, _ngClick.ngClickDirective)($parse),
        ngModel: (0, _ngModel.ngModelDirective)($parse),
        ngDisabled: (0, _ngIf.ngIfDirective)(),
        translate: (0, _ngTranslate.ngTranslateDirective)($translate, $parse),
        ngBind: (0, _ngBind.ngBindDirective)(),
        ngClass: (0, _ngClass.ngClassDirective)($parse),
        ngRepeat: (0, _ngRepeat.ngRepeatDirective)($parse, $animate, $transclude),
        translateValue: {}
    };
    internals.ngTranslate = internals.translate;

    toReturn.$get = function (directiveName) {
        if (angular.isString(directiveName)) {
            directiveName = (0, _common.toCamelCase)(directiveName);
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
            directiveName = (0, _common.toCamelCase)(directiveName);
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
    toReturn.useModule = function (moduleName) {
        $translate = angular.injector(['ng', 'pascalprecht.translate'].concat(moduleName)).get('$translate');
        internals.translate.changeService($translate);
    };
    return toReturn;
}();
exports.default = directiveProvider;