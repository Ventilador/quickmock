function configureMocks() {
    angular.module('SampleMocks', [])
        .service('___$q', ['$q', function(q) {
            return;
        }]);
}