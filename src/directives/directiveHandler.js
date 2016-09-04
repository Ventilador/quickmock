import directiveProvider from './directiveProvider.js';
import {toCamelCase} from './../controller/common.js';
import 'perfnow';
import $ from 'jquery';
(
    function (_$) {
        function newId() {
            let uuid;
            /* jshint ignore:start*/
            let d = performance.now();
            uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (arguments[0] == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            /* jshint ignore:end*/
            return uuid;
        }
        const text = _$.fn.text,
            click = _$.fn.click,
            attr = _$.fn.attr,
            clone = _$.fn.clone;

        _$.fn.extend({
            text: function () {
                for (var index = 0; index < this.length; index++) {
                    var element = $(this[index]);
                    if (!element.prop('disabled')) {
                        const textFn = element.data('ng-model') || text;
                        textFn.apply(this, arguments);
                    }
                }
                return text.apply(this) || '';
            },
            click: function (locals) {
                for (var index = 0; index < this.length; index++) {
                    var element = $(this[index]);
                    if (!element.prop('disabled')) {
                        const ngClick = element.data('ng-click');
                        if (ngClick) {
                            ngClick(locals);
                        }
                    }
                }
                return click.apply(this, arguments);
            },
            $text: text,
            attrs: function () {
                if (arguments.length === 0) {
                    if (this.length === 0) {
                        return;
                    }

                    var obj = {};
                    $.each(this[0].attributes, function () {
                        if (this.specified) {
                            obj[this.name] = this.value;
                        }
                    });
                    return obj;
                }
                return attr.apply(this, arguments);
            },
            trackerId: function () {
                if (arguments.length === 1) {
                    if (arguments[0] === true) {
                        if (!$(this).attr('tracker-data')) {
                            $(this).attr('tracker-data', newId());
                        }
                    } else {
                        $(this).attr('tracker-data', arguments[0]);
                    }
                }
                return $(this).attr('tracker-data');
            },
            clone: function (createId) {
                const toReturn = clone.apply(this);
                if (createId) {
                    toReturn.trackerId(newId());
                }
                return toReturn;
            },
            isCloneOf: function (otherElement) {
                return $(this).trackerId(true) === $(otherElement).trackerId(true);
            },
            getValue: function (directiveName) {
                directiveName = toCamelCase(directiveName);
                const data = this.data(directiveName);
                return data && data.get();

            },
            setValue: function (directiveName, newValue) {
                directiveName = toCamelCase(directiveName);
                const data = this.data(directiveName);
                if (data) {
                    data.set(newValue);
                }
            }
        });
        _$.fn.init.prototype = _$.fn;
    }
)($);
var directiveHandler = (function () {
    const sortedArray = function () { };
    sortedArray.prototype = Array.prototype;
    sortedArray.prototype.$push = function (directive) {
        let ii = 0;
        while (ii < this.length && this[ii].priority < directive.priority) {
            ii++;
        }
        if (ii < this.length && this[ii].priority === directive.priority) {
            // console.debug('same priority found keeping pushing order');
            Array.prototype.splice.call(this, ii + 1, 0, directive);
        } else {
            Array.prototype.splice.call(this, ii, 0, directive);
        }
    };

    function getTransclude(obj, toCompile, controllerService, domHandler, comment) {
        const internalClon = obj.clone();
        let found;
        let ii;
        for (ii = 0; ii < toCompile.length; ii++) {
            if (toCompile[ii].directive.transclude) {
                if (found) {
                    throw 'Cannot have two transclusions in the same element';
                }
                found = true;
                domHandler.replace(obj, comment);
                break;
            }
        }


        return function (fn, scope) {
            let newScope = fn;
            if (typeof fn !== 'function') {
                fn = scope;
            } else {
                newScope = undefined;
            }
            const myClon = internalClon.clone(newScope);
            let currentScope = controllerService.$new(newScope, true);
            if (found) {
                toCompile.splice(ii, 1);
                found = false;
            }
            domHandler.createComment();
            /* jshint -W069*/
            delete myClon['prevObject'];
            /* jshint +W069*/
            collectAndCompileNodes(myClon, currentScope, toCompile);
            fn(myClon, currentScope);
        };
    }

    function getDomHandler(container, parent, after) {
        return {
            createComment: function () {
                if (!$(container[0]).isCloneOf(after)) {
                    Array.prototype.splice.apply(container, Array.prototype.concat.apply([0, 0], after));
                }
            },
            enter: function (nodes, internalAfter) {
                if (parent && parent.length) {
                    if (parent.find(internalAfter).length) {
                        internalAfter.after(nodes);
                    } else if (parent.find(after).length) {
                        after.after(nodes);
                    } else {
                        $(parent.children().last()).after(nodes);
                    }
                } else if (container.length) {
                    let ii;
                    internalAfter = internalAfter || after;
                    if (internalAfter) {
                        for (ii = 0; ii < container.length; ii++) {
                            if ($(container[ii]).isCloneOf(internalAfter)) {
                                break;
                            }
                        }
                    }
                    Array.prototype.splice.apply(container, Array.prototype.concat.apply([ii + 1, 0], nodes));
                } else {
                    Array.prototype.push.apply(container, nodes);
                }
            },
            leave: function (nodes) {
                if (container.parent().length) {
                    nodes.remove();
                } else {
                    let node;
                    while (nodes.length) {
                        nodes.length--;
                        node = nodes[nodes.length];
                        let notFound = true;
                        for (let index = 0; index < container.length; index++) {
                            if ($(container[index]).isCloneOf(node)) {
                                Array.prototype.splice.call(container, index, 1);
                                notFound = false;
                                break;
                            }
                        }
                        if (notFound) {
                            console.log('could not find the node');
                        }
                    }
                }
            },
            replace: function (oldNodes, newNodes) {
                if (parent && parent.length) {
                    parent.find(oldNodes).replaceWith(newNodes);
                } else {
                    let from = -1, to = 0;
                    for (var index = 0; index < container.length; index++) {
                        if ($(container[index]).isCloneOf(oldNodes[to++])) {
                            if (from === -1) {
                                from = index;
                            }
                        }
                    }
                    if (from === -1) {
                        Array.prototype.push.apply(container, newNodes);
                    } else {
                        Array.prototype.splice.apply(container, Array.prototype.concat.apply([from, to], newNodes));
                    }
                }
            }
        };
    }
    function collectDirectives(node) {
        const toReturn = new sortedArray();
        let length = (node.attributes && node.attributes.length) || 0;
        for (let ii = 0; ii < length; ii++) {
            const directiveName = node.attributes[ii].name;
            const expression = node.attributes[ii].value;
            let directive;
            if (directive = directiveProvider.$get(directiveName.toLowerCase())) {
                directive.priority = typeof directive.priority === 'number' ? directive.priority : 9999;
                toReturn.$push({
                    exp: expression,
                    directive: directive,
                    name: directive.name || directiveName
                });
            }
        }
        return toReturn;
    }

    function applyDirectivesToNode(compiledNode, transcludeFn, controllerService, domHandler, toCompile) {
        toCompile.forEach((elem) => {
            if (!compiledNode.data('compiled-directives')) {
                compiledNode.data('compiled-directives', []);
            }
            const compiledDirective = elem.directive.compile(controllerService, elem.exp);
            compiledNode.data('compiled-directives').push(compiledDirective);
            compiledNode.data(elem.name, compiledDirective);
            if (angular.isFunction(elem.directive.attachToElement)) {
                if (!elem.directive.name) {
                    controllerService.$$directiveName = toCamelCase(elem.name);
                }
                elem.directive.attachToElement(controllerService, compiledNode, transcludeFn, domHandler);
                if (!elem.directive.name) {
                    delete controllerService.$$directiveName;
                }
            }
        });
    }
    function createComment() {
        return $('<!-- DOM-' + counter++ + '-->');
    }
    function compile(node, nodes, toCompile, comment, controllerService) {
        if (node.nodeName === '#text') {
            return;
        }
        const compiledNode = $(node);
        const domHandler = getDomHandler(nodes, nodes.parent(), comment);
        const transcludeFn = getTransclude($(node), toCompile, controllerService, domHandler, comment, nodes);
        applyDirectivesToNode(compiledNode, transcludeFn, controllerService, domHandler, toCompile);

    }
    let counter;
    function collectAndCompileNodes(nodes, controllerService, toCompile) {
        if (!nodes || !nodes.length) {
            return;
        }
        $.each(nodes, function () {
            const comment = createComment();
            const toCompilePrivate = toCompile || collectDirectives(this);
            if (toCompilePrivate.length) {
                compile(this, nodes, toCompilePrivate, comment, controllerService);
            }
            if (this.childNodes && this.childNodes.length) {
                collectAndCompileNodes($(this.childNodes), controllerService);
            }
        });


    }

    function control(controllerService, obj, config) {
        counter = 0;
        if (config) {
            directiveProvider.config(config);
        }
        let current = $(obj || '');
        if (!current || !controllerService) {
            return current;
        }
        collectAndCompileNodes(current, controllerService);
        return current;
    }

    return control;
})();
export default directiveHandler;
