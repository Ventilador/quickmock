function configureMocks() {
    angular.module('SampleMocks', [])
        .service('___$q', ['$q', function(q) {
            console.log(q);
            return;
        }]);
}