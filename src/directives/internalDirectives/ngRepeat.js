import {
    createMap,
    isArrayLike,
    //getBlockNodes,
    hashKey
} from './../../controller/common.js';
export function ngRepeatDirective($parse) {
    // const NG_REMOVED = '$$NG_REMOVED';
    const updateScope = function(scope, index, valueIdentifier, value, keyIdentifier, key, arrayLength) {
        // TODO(perf): generate setters to shave off ~40ms or 1-1.5%
        scope[valueIdentifier] = value;
        if (keyIdentifier) {
            scope[keyIdentifier] = key;
        }
        scope.$index = index;
        scope.$first = (index === 0);
        scope.$last = (index === (arrayLength - 1));
        scope.$middle = !(scope.$first || scope.$last);
        // jshint bitwise: false
        scope.$odd = !(scope.$even = (index & 1) === 0);
        // jshint bitwise: true
    };

    return {
        name: 'ngRepeat',
        compile: function(controllerService, expression) {
            const subscriptors = [];
            if (angular.isFunction(controllerService.create)) {
                controllerService.create();
            }
            const $scope = controllerService.controllerScope;
            let match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            if (!match) {
                throw ["Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '", expression, "'"].join('');
            }
            const lhs = match[1];
            const rhs = match[2];
            const aliasAs = match[3];
            const trackByExp = match[4];
            match = lhs.match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
            if (!match) {
                throw ["'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '", lhs, "'"].join('');
            }
            const valueIdentifier = match[3] || match[1];
            const keyIdentifier = match[2];

            if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) ||
                    /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent|\$root|\$id)$/.test(aliasAs))) {
                throw ["alias '", aliasAs, "' is invalid --- must be a valid JS identifier which is not a reserved name."].join('');
            }
            let trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn;
            const hashFnLocals = {
                $id: hashKey
            };

            if (trackByExp) {
                trackByExpGetter = $parse(trackByExp);
            } else {
                trackByIdArrayFn = function(key, value) {
                    return hashKey(value);
                };
                trackByIdObjFn = function(key) {
                    return key;
                };
            }
            if (trackByExpGetter) {
                trackByIdExpFn = function(key, value, index) {
                    // assign key, value, and $index to the locals so that they can be used in hash functions
                    if (keyIdentifier) {
                        hashFnLocals[keyIdentifier] = key;
                    }
                    hashFnLocals[valueIdentifier] = value;
                    hashFnLocals.$index = index;
                    return trackByExpGetter($scope, hashFnLocals);
                };
            }
            let lastBlockMap = createMap();
            let differences = createMap();
            const myObjects = [];
            const ngRepeatMinErr = () => {};
            const watcher = $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
                differences = {
                    added: [],
                    removed: [],
                    modified: []
                };
                let index,
                    nextBlockMap = createMap(),
                    collectionLength,
                    key, value, // key/value of iteration
                    trackById,
                    trackByIdFn,
                    collectionKeys,
                    block, // last object information {scope, element, id}
                    nextBlockOrder,
                    elementsToRemove;

                if (aliasAs) {
                    $scope[aliasAs] = collection;
                }

                if (isArrayLike(collection)) {
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
                    key = (collection === collectionKeys) ? index : collectionKeys[index];
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
                        angular.forEach(nextBlockOrder, function(block) {
                            if (block && block.scope) {
                                lastBlockMap[block.id] = block;
                            }
                        });
                        throw ngRepeatMinErr('dupes',
                            "Duplicates in a repeater are not allowed. Use 'track by' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}, Duplicate value: {2}",
                            expression, trackById, value);
                    } else {
                        // new never before seen block
                        nextBlockOrder[index] = {
                            id: trackById,
                            scope: undefined
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
                    key = (collection === collectionKeys) ? index : collectionKeys[index];
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
                subscriptors.forEach((fn) => {
                    fn(myObjects, differences);
                });
            });
            $scope.$on('$destroy', () => {
                while (subscriptors.length) {
                    (subscriptors.shift() || angular.noop)();
                }
                watcher();
            });
            const toReturn = () => {
                return {
                    objects: myObjects,
                    differences: differences
                };
            };
            toReturn.keyIdentifier = keyIdentifier || valueIdentifier;
            toReturn.changes = (callback) => {
                if (angular.isFunction(callback)) {
                    subscriptors.push(callback);
                    return () => {
                        const index = subscriptors.indexOf(callback);
                        subscriptors.splice(index, 1);
                    };
                }
                throw 'Callback is not a function';
            };
            return toReturn;
        }
    };
}