'use strict';

describe('Directive: <%= directiveName %>', function () {
  var element, scope, $compile;

  beforeEach(module('<%= moduleName %>'));

  beforeEach(inject(function ($rootScope, _$compile_) {
    $compile = _$compile_;
    scope = $rootScope.$new();
    <% _.each(specScopeProps, function(prop) {
      %><%= prop %> <% 
    }); %>
    element = '<<%= directiveName %>></<%= directiveName %>>';
    element = $compile(element)(scope);
    scope.$digest();
  }));

  it('should ', function() {
    expect('someValue').toBe('someValue');
  });

});
