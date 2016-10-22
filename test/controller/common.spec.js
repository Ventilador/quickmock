import {
    $_CONTROLLER
} from './../../src/controllerHandler/controllerHandler.extensions.js';
import {
    QMAngular,
    isArrayLike,
    sanitizeModules
} from './../../src/controller/common.js';
import controllerHandler from './../../src/controllerHandler/controllerHandler.js';

describe('Util logic', function() {
    describe('array-like', function() {
        it('should return true for array-like objects', function() {
            expect(isArrayLike(arguments)).toBe(true);
            expect(isArrayLike([])).toBe(true);
            const testObject = {
                length: 1,
                0: 'lala'
            };
            expect(isArrayLike(testObject)).toBe(true);
            if (isArrayLike(testObject)) {
                expect(function() {
                    Array.prototype.slice.apply(testObject);
                }).not.toThrow();
            }
        });
    });
    describe('sanitizeModles', function() {
        it('should allow empty modules', function() {
            expect(function() {
                sanitizeModules();
            }).not.toThrow();
            expect(function() {
                sanitizeModules([]);
            }).not.toThrow();
            expect(function() {
                sanitizeModules({
                    length: 0
                });
            }).not.toThrow();
        });
        it('shoud add ng module it its not present', function() {
            expect(sanitizeModules().indexOf('ng')).not.toBe(-1);
            expect(sanitizeModules([]).indexOf('ng')).not.toBe(-1);
            expect(sanitizeModules({
                length: 0
            }).indexOf('ng')).not.toBe(-1);
        });
        it('should not add ng nor angular to the array', function() {
            expect(sanitizeModules('ng').length).toBe(1);
            expect(sanitizeModules('angular').length).toBe(1);
        });
        it('should allow passing arrays-like objects', function() {
            const object1 = ['module1', 'module2'];
            const object2 = arguments;
            const object3 = {
                length: 2,
                0: 'module1',
                1: 'module2'
            };
            [object1, object2, object3].forEach(function(value) {
                expect(function() {
                    const result = sanitizeModules(value);
                    expect(result.length).toBe(value.length + 1);
                }).not.toThrow();
            });
        });
        it('should move default ng/angular module to the first position', function() {
            const result1 = sanitizeModules(['module1', 'module2', 'ng']),
                result2 = sanitizeModules(['module1', 'module2', 'angular']);
            expect(result1[0]).toBe('ng');
            expect(result1.length).toBe(3);
            expect(result2[0]).toBe('ng');
            expect(result2.length).toBe(3);
        });
    });
    describe('QMAngular', function() {
        it('should return a scope when no arguments where given', function() {
            expect(QMAngular.create().$root).toBe(QMAngular.$rootScope);
        });
        it('should return the same scope reference when it receive a scope', function() {
            const scope = QMAngular.$rootScope.$new();
            expect(QMAngular.create(scope)).toBe(scope);
        });
        it('should return the same scope reference when it receives an isolated scope', function() {
            const scope = QMAngular.$rootScope.$new(true);
            expect(QMAngular.create(scope)).toBe(scope);
        });
        it('should return an scope with the properties of a passed object', function() {
            const toPass = {
                a: {}, // for reference checking
                b: {}
            };
            let returnedScope;
            expect(function() {
                returnedScope = QMAngular.create(toPass);
            }).not.toThrow();
            expect(returnedScope.a).toBe(toPass.a);
            expect(returnedScope.b).toBe(toPass.b);
        });
        it('should know when an object is a controller Constructor', function() {
            controllerHandler.clean();
            const controllerObj = controllerHandler.setScope({
                boundProperty: 'something'
            }).bindWith({
                boundProperty: '='
            }).new('withBindings');

            expect($_CONTROLLER.isController(controllerObj)).toBe(true);
            controllerObj.$destroy();
        });
    });
});