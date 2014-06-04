'use strict';

describe('Directive: queryLoader', function () {

  // load the directive's module
  beforeEach(module('bbvaBenchmarkApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<query-loader></query-loader>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the queryLoader directive');
  }));
});
