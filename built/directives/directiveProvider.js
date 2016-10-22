'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.directiveProvider = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ngModel = require('./internalDirectives/ngModel.js');

var _ngClick = require('./internalDirectives/ngClick.js');

var _ngIf = require('./internalDirectives/ngIf.js');

var _ngTranslate = require('./internalDirectives/ngTranslate.js');

var _ngBind = require('./internalDirectives/ngBind.js');

var _ngClass = require('./internalDirectives/ngClass.js');

var _ngDisabled = require('./internalDirectives/ngDisabled.js');

var _common = require('./../controller/common.js');

var _ngRepeat = require('./internalDirectives/ngRepeat.js');

var _qmEq = require('./internalDirectives/bindingMockers/qmEq.js');

var directiveProvider = exports.directiveProvider = function () {
    var directives = new Map(),
        toReturn = {},
        $transclude = function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {

        // No scope passed in:
        if (!_common.QMAngular.isScope(scope)) {
            futureParentElement = cloneAttachFn;
            cloneAttachFn = scope;
            scope = undefined;
        }
    },
        internals = {
        ngIf: function ngIf() {
            return (0, _ngIf.ngIfDirective)();
        },
        ngClick: function ngClick() {
            return (0, _ngClick.ngClickDirective)(_common.QMAngular.injector.get('$parse'));
        },
        ngModel: function ngModel() {
            return (0, _ngModel.ngModelDirective)(_common.QMAngular.injector.get('$parse'));
        },
        ngDisabled: function ngDisabled() {
            return (0, _ngDisabled.ngDisabledDirective)(_common.QMAngular.injector.get('$parse'));
        },
        translate: function translate() {
            return (0, _ngTranslate.ngTranslateDirective)(_common.QMAngular.injector.get('$translate'), _common.QMAngular.injector.get('$parse'));
        },
        ngBind: function ngBind() {
            return (0, _ngBind.ngBindDirective)();
        },
        ngClass: function ngClass() {
            return (0, _ngClass.ngClassDirective)(_common.QMAngular.injector.get('$parse'));
        },
        ngRepeat: function ngRepeat() {
            return (0, _ngRepeat.ngRepeatDirective)(_common.QMAngular.injector.get('$parse'), _common.QMAngular.injector.get('$animate'), $transclude);
        },
        infiniteScroll: function infiniteScroll() {
            return (0, _ngClick.ngClickDirective)(_common.QMAngular.injector.get('$parse'));
        },
        qmEq: function qmEq() {
            return (0, _qmEq.qmEqDirective)(_common.QMAngular.injector.get('$parse'));
        },
        translateValue: {}
    };
    internals.ngTranslate = internals.translate;

    toReturn.$get = function (directiveName) {
        if (angular.isString(directiveName)) {
            directiveName = (0, _common.toCamelCase)(directiveName);
            if (internals[directiveName] && (_typeof(internals[directiveName]) === 'object' || (internals[directiveName] = internals[directiveName]()))) {
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

    toReturn.config = function (configObject, dontClean) {
        if (!dontClean) {
            toReturn.$clean();
        }
        for (var key in configObject) {
            if (configObject.hasOwnProperty(key)) {
                directives.set((0, _common.toCamelCase)(key), toReturn.$get(configObject[key]));
            }
        }
    };

    return toReturn;
}();