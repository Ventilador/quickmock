import { QMAngular } from './../src/controller/common.js';
export default function Config() {
    angular.module('test', ['ng', 'pascalprecht.translate'])
        .mockService('$q', [function () {
            return jasmine.createSpy('___$q');
        }])
        .mockService('$timeout', ['$timeout', function () {
            return jasmine.createSpy('___$timeout');
        }])
        .mockService('$scope', [function () { return {}; }])
        .controller('emptyController', [function () {
            this.name = 'emptyController';
        }])
        .controller('withInjections', ['$q', '$timeout', function ($q, t) {
            this.$q = $q;
            this.$timeout = t;
        }])
        .controller('withBindings', [function () {
            this.boundProperty = this.boundProperty + ' modified';
        }])
        .controller('withScope', ['$scope', function (scope) {
            this.scope = scope;
        }])
        .config(['$translateProvider', function ($translateProvider) {
            $translateProvider.translations('en', {
                TITLE: 'Hello',
                FOO: 'This is a paragraph.',
                BUTTON_LANG_EN: 'english',
                BUTTON_LANG_DE: 'german'
            });
            $translateProvider.translations('de', {
                TITLE: 'Hallo',
                FOO: 'Dies ist ein Paragraph.',
                BUTTON_LANG_EN: 'englisch',
                BUTTON_LANG_DE: 'deutsch'
            });
            $translateProvider.preferredLanguage('en');
            $translateProvider.use('en');
        }]);
    QMAngular.loadModules('test', 'ngMock');
}