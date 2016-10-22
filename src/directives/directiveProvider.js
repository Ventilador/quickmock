import {
    ngModelDirective
} from './internalDirectives/ngModel.js';
import {
    ngClickDirective
} from './internalDirectives/ngClick.js';
import {
    ngIfDirective
} from './internalDirectives/ngIf.js';
import {
    ngTranslateDirective
} from './internalDirectives/ngTranslate.js';
import {
    ngBindDirective
} from './internalDirectives/ngBind.js';
import {
    ngClassDirective
} from './internalDirectives/ngClass.js';
import {
    ngDisabledDirective
} from './internalDirectives/ngDisabled.js';
import {
    toCamelCase,
    QMAngular
} from './../controller/common.js';
import {
    ngRepeatDirective
} from './internalDirectives/ngRepeat.js';
import {
    qmEqDirective
} from './internalDirectives/bindingMockers/qmEq.js';
export var directiveProvider = (function () {
    const directives = new Map(),
        toReturn = {},
        $transclude = function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {

            // No scope passed in:
            if (!QMAngular.isScope(scope)) {
                futureParentElement = cloneAttachFn;
                cloneAttachFn = scope;
                scope = undefined;
            }

        },
        internals = {
            ngIf: () => ngIfDirective(),
            ngClick: () => ngClickDirective(QMAngular.injector.get('$parse')),
            ngModel: () => ngModelDirective(QMAngular.injector.get('$parse')),
            ngDisabled: () => ngDisabledDirective(QMAngular.injector.get('$parse')),
            translate: () => ngTranslateDirective(QMAngular.injector.get('$translate'), QMAngular.injector.get('$parse')),
            ngBind: () => ngBindDirective(),
            ngClass: () => ngClassDirective(QMAngular.injector.get('$parse')),
            ngRepeat: () => ngRepeatDirective(QMAngular.injector.get('$parse'), QMAngular.injector.get('$animate'), $transclude),
            infiniteScroll: () => ngClickDirective(QMAngular.injector.get('$parse')),
            qmEq: () => qmEqDirective(QMAngular.injector.get('$parse')),
            translateValue: {

            }
        };
    internals.ngTranslate = internals.translate;


    toReturn.$get = function (directiveName) {
        if (angular.isString(directiveName)) {
            directiveName = toCamelCase(directiveName);
            if (internals[directiveName] &&
                (typeof internals[directiveName] === 'object' || (internals[directiveName] = internals[directiveName]()))) {
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
            directiveName = toCamelCase(directiveName);
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
        for (let key in configObject) {
            if (configObject.hasOwnProperty(key)) {
                directives.set(toCamelCase(key), toReturn.$get(configObject[key]));
            }
        }
    };

    return toReturn;
})();