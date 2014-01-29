describe('pagination directive', function () {

  var $scope, element, lis;
  beforeEach(module('directives'));
  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope;
    $scope.numPages = 5;
    $scope.currentPage = 3;
    element = $compile('<pagination num-pages="numPages" current-
                       page="currentPage"></pagination>')($scope);
                       $scope.$digest();
                       lis = function() { return element.find('li'); };
                     }));
  it('has the number of the page as text in each page item',
     function() {
      for(var i=1; i<=$scope.numPages;i++) {
        expect(lis().eq(i).text()).toEqual(''+i);
      }
    });
  it('sets the current-page to be active', function() {
    var currentPageItem = lis().eq($scope.currentPage);
    expect(currentPageItem.hasClass('active')).toBe(true);
  });
