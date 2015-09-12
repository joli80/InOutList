angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('sv', {"Me":"Jag","People":"Personer"});
/* jshint +W100 */
}]);