'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngRepeatDirective = ngRepeatDirective;

var _common = require('./../../controller/common.js');

function ngRepeatDirective($parse) {
    // const NG_REMOVED = '$$NG_REMOVED';
    var updateScope = function updateScope(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
        // TODO(perf): generate setters to shave off ~40ms or 1-1.5%
        scope[valueIdentifier] = value;
        if (keyIdentifier) {
            scope[keyIdentifier] = key;
        }
        scope.$index = index;
        scope.$first = index === 0;
        scope.$last = index === arrayLength - 1;
        scope.$middle = !(scope.$first || scope.$last);
        // jshint bitwise: false
        scope.$odd = !(scope.$even = (index & 1) === 0);
        // jshint bitwise: true
    };

    return {
        transclude: true,
        name: 'ngRepeat',
        priority: 0,
        compile: function compile(controllerService, expression) {
            var subscriptors = [];
            if (angular.isFunction(controllerService.create)) {
                controllerService.create();
            }
            var $scope = controllerService.controllerScope;
            var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            if (!match) {
                throw ["Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '", expression, "'"].join('');
            }
            var lhs = match[1];
            var rhs = match[2];
            var aliasAs = match[3];
            var trackByExp = match[4];
            match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
            if (!match) {
                throw ["'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '", lhs, "'"].join('');
            }
            var valueIdentifier = match[3] || match[1];
            var keyIdentifier = match[2];

            if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) || /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) {
                throw ["alias '", aliasAs, "' is invalid --- must be a valid JS identifier which is not a reserved name."].join('');
            }
            var trackByExpGetter = void 0,
                trackByIdExpFn = void 0,
                trackByIdArrayFn = void 0,
                trackByIdObjFn = void 0;
            var hashFnLocals = {
                $id: _common.hashKey
            };

            if (trackByExp) {
                trackByExpGetter = $parse(trackByExp);
            } else {
                trackByIdArrayFn = function trackByIdArrayFn(key, value) {
                    return (0, _common.hashKey)(value);
                };
                trackByIdObjFn = function trackByIdObjFn(key) {
                    return key;
                };
            }
            if (trackByExpGetter) {
                trackByIdExpFn = function trackByIdExpFn(key, value, index) {
                    // assign key, value, and $index to the locals so that they can be used in hash functions
                    if (keyIdentifier) {
                        hashFnLocals[keyIdentifier] = key;
                    }
                    hashFnLocals[valueIdentifier] = value;
                    hashFnLocals.$index = index;
                    return trackByExpGetter($scope, hashFnLocals);
                };
            }
            var lastBlockMap = (0, _common.createMap)();
            var differences = (0, _common.createMap)();
            var myObjects = [];
            var ngRepeatMinErr = function ngRepeatMinErr() {};
            var watcher = $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
                differences = {
                    added: [],
                    removed: [],
                    modified: []
                };
                var index = void 0,
                    nextBlockMap = (0, _common.createMap)(),
                    collectionLength = void 0,
                    key = void 0,
                    value = void 0,
                    // key/value of iteration
                trackById = void 0,
                    trackByIdFn = void 0,
                    collectionKeys = void 0,
                    block = void 0,
                    // last object information {scope, element, id}
                nextBlockOrder = void 0,
                    elementsToRemove = void 0;

                if (aliasAs) {
                    $scope[aliasAs] = collection;
                }

                if ((0, _common.isArrayLike)(collection)) {
                    collectionKeys = collection;
                    trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                } else {
                    trackByIdFn = trackByIdExpFn || trackByIdObjFn;
                    // if object, extract keys, in enumeration order, unsorted
                    collectionKeys = [];
                    for (var itemKey in collection) {
                        if (hasOwnProperty.call(collection, itemKey) && itemKey.charAt(0) !== '$') {
                            collectionKeys.push(itemKey);
                        }
                    }
                }

                collectionLength = collectionKeys.length;
                nextBlockOrder = new Array(collectionLength);

                // locate existing items
                for (index = 0; index < collectionLength; index++) {
                    key = collection === collectionKeys ? index : collectionKeys[index];
                    value = collection[key];
                    trackById = trackByIdFn(key, value, index);
                    if (lastBlockMap[trackById]) {
                        // found previously seen block
                        block = lastBlockMap[trackById];
                        delete lastBlockMap[trackById];
                        nextBlockMap[trackById] = block;
                        nextBlockOrder[index] = block;
                    } else if (nextBlockMap[trackById]) {
                        // if collision detected. restore lastBlockMap and throw an error
                        angular.forEach(nextBlockOrder, function (block) {
                            if (block && block.scope) {
                                lastBlockMap[block.id] = block;
                            }
                        });
                        throw ngRepeatMinErr('dupes', "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}", expression, trackById, value);
                    } else {
                        // new never before seen block
                        nextBlockOrder[index] = {
                            id: trackById,
                            scope: undefined,
                            clone: undefined
                        };
                        nextBlockMap[trackById] = true;
                    }
                }

                // remove leftover items
                for (var blockKey in lastBlockMap) {
                    block = lastBlockMap[blockKey];
                    elementsToRemove = myObjects.indexOf(block);
                    myObjects.splice(elementsToRemove, 1);
                    differences.removed.push(block);
                    block.scope.$destroy();
                }

                // we are not using forEach for perf reasons (trying to avoid #call)
                for (index = 0; index < collectionLength; index++) {
                    key = collection === collectionKeys ? index : collectionKeys[index];
                    value = collection[key];
                    block = nextBlockOrder[index];
                    if (block.scope) {
                        // if we have already seen this object, then we need to reuse the
                        // associated scope/element
                        updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                        differences.modified.push(block);
                    } else {
                        // new item which we don't know about
                        block.scope = $scope.$new();

                        myObjects.splice(index, 0, block);
                        differences.added.push(block);
                        nextBlockMap[block.id] = block;
                        updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                    }
                    block.index = index;
                }

                lastBlockMap = nextBlockMap;
                subscriptors.forEach(function (fn) {
                    fn(myObjects, differences);
                });
            });
            $scope.$on('$destroy', function () {
                subscriptors.length = 0;
                watcher();
            });
            var toReturn = function toReturn() {
                return {
                    objects: myObjects,
                    differences: differences
                };
            };
            toReturn.keyIdentifier = keyIdentifier || valueIdentifier;
            toReturn.changes = function (callback) {
                if (angular.isFunction(callback)) {
                    subscriptors.push(callback);
                    return function () {
                        var index = subscriptors.indexOf(callback);
                        subscriptors.splice(index, 1);
                    };
                }
                throw 'Callback is not a function';
            };
            return toReturn;
        },
        attachToElement: function attachToElement(controllerService, elem, $transclude, $animate) {
            var directive = elem.data('ng-repeat');
            function getPreviousNode(modifications, index) {
                if (index) {
                    while (index--) {
                        if (modifications[index].action !== 'remove') {
                            return index;
                        }
                    }
                }
                return -1;
            }
            directive.changes(function (objects, differences) {

                if (objects && differences) {
                    (function () {
                        var toModify = {
                            length: objects.length
                        };
                        differences.removed.forEach(function (element) {
                            element.action = 'remove';
                            toModify[element.index] = element;
                        });
                        differences.modified.forEach(function (element) {
                            element.action = 'same';
                            toModify[element.index] = element;
                        });
                        differences.added.forEach(function (element) {
                            if (toModify[element.index] && toModify[element.index].action === 'remove') {
                                toModify[element.index].action = 'replace';
                                toModify[element.index].scope = element.scope;
                            } else {
                                element.action = 'add';
                                toModify[element.index] = element;
                            }
                        });

                        var _loop = function _loop(ii) {
                            if (toModify[ii]) {
                                switch (toModify[ii].action) {
                                    case 'remove':
                                        $animate.leave(toModify[ii].clone);
                                        break;
                                    case 'add':
                                        $transclude(toModify[ii].scope, function (clone) {
                                            toModify[ii].clone = clone;
                                            var index = getPreviousNode(toModify, ii);
                                            if (index === -1) {
                                                $animate.enter(clone);
                                            } else {
                                                $animate.enter(clone, toModify[index].clone);
                                            }
                                        });
                                        break;
                                    case 'replace':
                                        $transclude(toModify[ii].scope, function (clone) {
                                            $animate.replace(toModify[ii].clone, toModify[ii].clone = clone);
                                            toModify[ii].newClone = undefined;
                                            delete toModify[ii].newClone;
                                        });
                                        break;
                                    default:
                                        break;
                                }
                                delete toModify[ii].action;
                            }
                        };

                        for (var ii = 0; ii < toModify.length; ii++) {
                            _loop(ii);
                        }
                    })();
                }
            });
        },
        removeOnTransclusion: ['ng-repeat']
    };
}