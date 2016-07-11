'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ngRepeatDirective = ngRepeatDirective;

var _common = require('./../../controller/common.js');

function ngRepeatDirective($parse, $animate) {
    var NG_REMOVED = '$$NG_REMOVED';
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

    // const getBlockStart = function(block) {
    //     return block.clone[0];
    // };

    // const getBlockEnd = function(block) {
    //     return block.clone[block.clone.length - 1];
    // };
    return {
        name: 'ngRepeat',
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
            var trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn;
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
            var lastValue = {
                toAdd: [],
                toRemove: []
            };
            var watcher = $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
                lastValue = {
                    toAdd: [],
                    toRemove: []
                };
                var index,
                    length,
                    nextBlockMap = (0, _common.createMap)(),
                    collectionLength,
                    key,
                    value,
                    // key/value of iteration
                trackById,
                    trackByIdFn,
                    collectionKeys,
                    block,
                    // last object information {scope, element, id}
                nextBlockOrder,
                    elementsToRemove;
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
                nextBlockOrder = new Array(collectionLength); // locate existing items
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
                        throw ["Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: ", expression, ", Duplicate key: ", trackById, ", Duplicate value: ", value].join('');
                    } else {
                        // new never before seen block
                        lastValue.toAdd.push(nextBlockOrder[index] = {
                            id: trackById,
                            scope: $scope.$new(value),
                            clone: undefined
                        });
                        nextBlockMap[trackById] = true;
                    }
                } // remove leftover items
                for (var blockKey in lastBlockMap) {
                    lastValue.toRemove.push(block = lastBlockMap[blockKey]);
                    elementsToRemove = (0, _common.getBlockNodes)(block.clone);
                    $animate.leave(elementsToRemove);
                    if (elementsToRemove[0].parentNode) {
                        // if the element was not removed yet because of pending animation, mark it as deleted
                        // so that we can ignore it later
                        for (index = 0, length = elementsToRemove.length; index < length; index++) {
                            elementsToRemove[index][NG_REMOVED] = true;
                        }
                    }
                    block.scope.$destroy();
                } // we are not using forEach for perf reasons (trying to avoid #call)
                for (index = 0; index < collectionLength; index++) {
                    key = collection === collectionKeys ? index : collectionKeys[index];
                    value = collection[key];
                    block = nextBlockOrder[index];
                    if (block.scope) {
                        updateScope(block.scope, index, valueIdentifier, value, keyIdentifier, key, collectionLength);
                    }
                }
                lastBlockMap = nextBlockMap;
                subscriptors.forEach(function (fn) {
                    fn(lastValue);
                });
            });
            $scope.$on('$destroy', function () {
                do {
                    (subscriptors.shift || angular.noop)();
                } while (subscriptors.length);
                watcher();
            });
            var toReturn = function toReturn() {
                return lastValue;
            };
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
        }
    };
}