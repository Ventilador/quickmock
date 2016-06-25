angular.module('test', ['ng'])
    .controller('emptyController', [function() {
        this.name = 'emptyController';
    }])
    .controller('withInjections', ['$q', function($q) {
        this.q = $q;
    }])
    .controller('withBindings', [function() {
        this.boundProperty = this.boundProperty + ' modified';
    }]);