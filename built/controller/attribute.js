'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _common = require('./common.js');

function Attributes(element, attributesToCopy) {
    if (attributesToCopy) {
        var keys = Object.keys(attributesToCopy);
        var i, l, key;

        for (i = 0, l = keys.length; i < l; i++) {
            key = keys[i];
            this[key] = attributesToCopy[key];
        }
    } else {
        this.$attr = {};
    }

    this.$$element = element;
}
var $animate = angular.injector(['ng']).get('$animate');
var $$sanitizeUri = angular.injector(['ng']).get('$$sanitizeUri');
Attributes.prototype = {
    /**
     * @ngdoc method
     * @name $compile.directive.Attributes#$normalize
     * @kind function
     *
     * @description
     * Converts an attribute name (e.g. dash/colon/underscore-delimited string, optionally prefixed with `x-` or
     * `data-`) to its normalized, camelCase form.
     *
     * Also there is special case for Moz prefix starting with upper case letter.
     *
     * For further information check out the guide on {@link guide/directive#matching-directives Matching Directives}
     *
     * @param {string} name Name to normalize
     */
    $normalize: _common.toCamelCase,

    /**
     * @ngdoc method
     * @name $compile.directive.Attributes#$addClass
     * @kind function
     *
     * @description
     * Adds the CSS class value specified by the classVal parameter to the element. If animations
     * are enabled then an animation will be triggered for the class addition.
     *
     * @param {string} classVal The className value that will be added to the element
     */
    $addClass: function $addClass(classVal) {
        if (classVal && classVal.length > 0) {
            $animate.addClass(this.$$element, classVal);
        }
    },

    /**
     * @ngdoc method
     * @name $compile.directive.Attributes#$removeClass
     * @kind function
     *
     * @description
     * Removes the CSS class value specified by the classVal parameter from the element. If
     * animations are enabled then an animation will be triggered for the class removal.
     *
     * @param {string} classVal The className value that will be removed from the element
     */
    $removeClass: function $removeClass(classVal) {
        if (classVal && classVal.length > 0) {
            $animate.removeClass(this.$$element, classVal);
        }
    },

    /**
     * @ngdoc method
     * @name $compile.directive.Attributes#$updateClass
     * @kind function
     *
     * @description
     * Adds and removes the appropriate CSS class values to the element based on the difference
     * between the new and old CSS class values (specified as newClasses and oldClasses).
     *
     * @param {string} newClasses The current CSS className value
     * @param {string} oldClasses The former CSS className value
     */
    $updateClass: function $updateClass(newClasses, oldClasses) {
        var toAdd = tokenDifference(newClasses, oldClasses);
        if (toAdd && toAdd.length) {
            $animate.addClass(this.$$element, toAdd);
        }

        var toRemove = tokenDifference(oldClasses, newClasses);
        if (toRemove && toRemove.length) {
            $animate.removeClass(this.$$element, toRemove);
        }
    },

    /**
     * Set a normalized attribute on the element in a way such that all directives
     * can share the attribute. This function properly handles boolean attributes.
     * @param {string} key Normalized key. (ie ngAttribute)
     * @param {string|boolean} value The value to set. If `null` attribute will be deleted.
     * @param {boolean=} writeAttr If false, does not write the value to DOM element attribute.
     *     Defaults to true.
     * @param {string=} attrName Optional none normalized name. Defaults to key.
     */
    $set: function $set(key, value, writeAttr, attrName) {
        // TODO: decide whether or not to throw an error if "class"
        //is set through this function since it may cause $updateClass to
        //become unstable.

        var node = this.$$element[0],
            booleanKey = angular.getBooleanAttrName(node, key),
            aliasedKey = angular.getAliasedAttrName(key),
            observer = key,
            nodeName;

        if (booleanKey) {
            this.$$element.prop(key, value);
            attrName = booleanKey;
        } else if (aliasedKey) {
            this[aliasedKey] = value;
            observer = aliasedKey;
        }

        this[key] = value;

        // translate normalized key to actual key
        if (attrName) {
            this.$attr[key] = attrName;
        } else {
            attrName = this.$attr[key];
            if (!attrName) {
                this.$attr[key] = attrName = (0, _common.toSnakeCase)(key, '-');
            }
        }

        nodeName = nodeName_(this.$$element);

        if (nodeName === 'a' && (key === 'href' || key === 'xlinkHref') || nodeName === 'img' && key === 'src') {
            // sanitize a[href] and img[src] values
            this[key] = value = $$sanitizeUri(value, key === 'src');
        } else if (nodeName === 'img' && key === 'srcset' && angular.isDefined(value)) {
            // sanitize img[srcset] values
            var result = "";

            // first check if there are spaces because it's not the same pattern
            var trimmedSrcset = (0, _common.trim)(value);
            //                (   999x   ,|   999w   ,|   ,|,   )
            var srcPattern = /(\s+\d+x\s*,|\s+\d+w\s*,|\s+,|,\s+)/;
            var pattern = /\s/.test(trimmedSrcset) ? srcPattern : /(,)/;

            // split srcset into tuple of uri and descriptor except for the last item
            var rawUris = trimmedSrcset.split(pattern);

            // for each tuples
            var nbrUrisWith2parts = Math.floor(rawUris.length / 2);
            for (var i = 0; i < nbrUrisWith2parts; i++) {
                var innerIdx = i * 2;
                // sanitize the uri
                result += $$sanitizeUri((0, _common.trim)(rawUris[innerIdx]), true);
                // add the descriptor
                result += " " + (0, _common.trim)(rawUris[innerIdx + 1]);
            }

            // split the last item into uri and descriptor
            var lastTuple = (0, _common.trim)(rawUris[i * 2]).split(/\s/);

            // sanitize the last uri
            result += $$sanitizeUri((0, _common.trim)(lastTuple[0]), true);

            // and add the last descriptor if any
            if (lastTuple.length === 2) {
                result += " " + (0, _common.trim)(lastTuple[1]);
            }
            this[key] = value = result;
        }

        if (writeAttr !== false) {
            if (value === null || angular.isUndefined(value)) {
                this.$$element.removeAttr(attrName);
            } else {
                if (SIMPLE_ATTR_NAME.test(attrName)) {
                    this.$$element.attr(attrName, value);
                } else {
                    setSpecialAttr(this.$$element[0], attrName, value);
                }
            }
        }

        // fire observers
        var $$observers = this.$$observers;
        if ($$observers) {
            angular.forEach($$observers[observer], function (fn) {
                try {
                    fn(value);
                } catch (e) {
                    console.log(e);
                }
            });
        }
    },

    /**
     * @ngdoc method
     * @name $compile.directive.Attributes#$observe
     * @kind function
     *
     * @description
     * Observes an interpolated attribute.
     *
     * The observer function will be invoked once during the next `$digest` following
     * compilation. The observer is then invoked whenever the interpolated value
     * changes.
     *
     * @param {string} key Normalized key. (ie ngAttribute) .
     * @param {function(interpolatedValue)} fn Function that will be called whenever
              the interpolated value of the attribute changes.
     *        See the {@link guide/interpolation#how-text-and-attribute-bindings-work Interpolation
     *        guide} for more info.
     * @returns {function()} Returns a deregistration function for this observer.
     */
    $observe: function $observe(key, fn) {
        var attrs = this,
            $$observers = attrs.$$observers || (attrs.$$observers = new Map()),
            listeners = $$observers[key] || ($$observers[key] = []);

        listeners.push(fn);
        _common.scopeHelper.$rootScope.$evalAsync(function () {
            if (!listeners.$$inter && attrs.hasOwnProperty(key) && !angular.isUndefined(attrs[key])) {
                // no one registered attribute interpolation function, so lets call it manually
                fn(attrs[key]);
            }
        });

        return function () {
            angular.arrayRemove(listeners, fn);
        };
    }
};

function tokenDifference(str1, str2) {

    var values = '',
        tokens1 = str1.split(/\s+/),
        tokens2 = str2.split(/\s+/);

    outer: for (var i = 0; i < tokens1.length; i++) {
        var token = tokens1[i];

        for (var j = 0; j < tokens2.length; j++) {
            if (token === tokens2[j]) {
                continue outer;
            }
        }

        values += (values.length > 0 ? ' ' : '') + token;
    }
    return values;
}

function nodeName_(element) {
    var myElem = angular.element(element)[0];
    if (myElem) {
        return myElem.nodeName;
    }
}
var specialAttrHolder = window.document.createElement('div');
var SIMPLE_ATTR_NAME = /^\w/;

function setSpecialAttr(element, attrName, value) {
    // Attributes names that do not start with letters (such as `(click)`) cannot be set using `setAttribute`
    // so we have to jump through some hoops to get such an attribute
    // https://github.com/angular/angular.js/pull/13318
    specialAttrHolder.innerHTML = "<span " + attrName + ">";
    var attributes = specialAttrHolder.firstChild.attributes;
    var attribute = attributes[0];
    // We have to remove the attribute from its container element before we can add it to the destination element
    attributes.removeNamedItem(attribute.name);
    attribute.value = value;
    element.attributes.setNamedItem(attribute);
}
exports.default = Attributes;