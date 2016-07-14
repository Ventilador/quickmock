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
    toCamelCase,
    scopeHelper
} from './../controller/common.js';
import {
    ngRepeatDirective
} from './internalDirectives/ngRepeat.js';
var directiveProvider = (function() {
    let $translate = angular.injector(['ng', 'pascalprecht.translate']).get('$translate');
    const directives = new Map(),
        toReturn = {},
        $parse = angular.injector(['ng']).get('$parse'),
        $animate = angular.injector(['ng']).get('$animate'),
        $transclude = function controllersBoundTransclude(scope, cloneAttachFn, futureParentElement) {

            // No scope passed in:
            if (!scopeHelper.isScope(scope)) {
                futureParentElement = cloneAttachFn;
                cloneAttachFn = scope;
                scope = undefined;
            }

        },
        internals = {
            ngIf: ngIfDirective(),
            ngClick: ngClickDirective($parse),
            ngModel: ngModelDirective($parse),
            ngDisabled: ngIfDirective(),
            translate: ngTranslateDirective($translate, $parse),
            ngBind: ngBindDirective(),
            ngClass: ngClassDirective($parse),
            ngRepeat: ngRepeatDirective($parse, $animate, $transclude),
            translateValue: {

            }
        };
    internals.ngTranslate = internals.translate;


    toReturn.$get = function(directiveName) {
        if (angular.isString(directiveName)) {
            directiveName = toCamelCase(directiveName);
            if (internals[directiveName]) {
                return internals[directiveName];
            }
        }
        return directives.get(directiveName);
    };
    toReturn.$put = function(directiveName, directiveConstructor) {
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
    toReturn.$clean = function() {
        directives.clear();
    };
    toReturn.useModule = (moduleName) => {
        $translate = angular.injector(['ng', 'pascalprecht.translate'].concat(moduleName)).get('$translate');
        internals.translate.changeService($translate);
    };
    return toReturn;
})();
export default directiveProvider;