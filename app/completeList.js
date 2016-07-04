angular.module('test', ['ng', 'pascalprecht.translate'])
    .controller('emptyController', [function() {
        this.name = 'emptyController';
    }])
    .controller('withInjections', ['$q', function($q) {
        this.q = $q;
    }])
    .controller('withBindings', [function() {
        this.boundProperty = this.boundProperty + ' modified';
    }])
    .config(['$translateProvider', function($translateProvider) {
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
    }]);
configureMocks();