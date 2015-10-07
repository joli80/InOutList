angular.module('inoutlist.services', [])

.factory('InOutListApi', function (Adal, $resource) {

    //var url = "https://www1.infracontrol.com/InOutBoard/api/";
    var apiUrl = "http://localhost:9557/api/";
    var audience = "http://infracontrolcom.onmicrosoft.com/inoutlistapi";

    function person(token) {
        var person = $resource(apiUrl + 'persons/:id', {}, {
            query: {
                method: 'GET',
                isArray: true,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }
        });
        return person;
    };

    function getPersons(onSuccess) {
        Adal.authenticate(audience, function (result) {
            person(result.accessToken).query(function (persons) {
                api.all = persons;
                onSuccess();
            }, function (err) {
                console.error(err);
            });
        });
    }

    function getPerson(id) {
        for (var i = 0; i < api.all.length; i++) {
            var person = api.all[i];
            if (person.Id == id) {
                return person;
            }
        }
    }

    var api = {
        all: [],
        update: getPersons,
        getPerson: getPerson
    };

    return api;

})

.factory('GraphApi', function (Adal, $resource) {
    var resourceUri = "https://graph.windows.net",
        graphApiVersion = "1.6";

    function users(authResult) {
        var url = resourceUri + "/" + authResult.tenantId + "/users?api-version=" + graphApiVersion;
        var user = $resource(url, {}, {
            query: {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + authResult.accessToken
                }
            }
        });
        return user;
    };

    var userId;
    function getUsers(onSuccess) {
        Adal.authenticate(resourceUri, function (result) {
            userId = result.userInfo.userId;
            users(result).query(function (users) {
                api.users = users.value;
                api.me = getUser(userId);
                onSuccess();
            }, function (err) {
                console.error(err);
            });
        });
    }

    function getUser(objectId) {
        for (var i = 0; i < api.users.length; i++) {
            if (api.users[i].objectId === objectId) {
                return api.users[i];
            }
        }
        return null;
    }

    var api = {
        update: getUsers,
        users: [],
        getUser: getUser,
        me: {}
    };

    return api;
})

.factory('Adal', function () {

    var authority = "https://login.windows.net/common",
        redirectUri = "http://InOutList",
        clientId = "f0a67ebb-50d3-4de0-aae1-a44b3ff62773";

    var userId;
    var initialised = false;

    function onAuthCompleted(authResult, authCompletedCallback) {
        userId = authResult.userInfo.userId;
        if (authCompletedCallback) {
            authCompletedCallback(authResult);
        }
    }

    return {
        init: function () {
            initialised = true;
        },
        authenticate: function (resourceUri, authCompletedCallback) {
            var authContext = new Microsoft.ADAL.AuthenticationContext(authority);
            authContext.tokenCache.readItems().then(function (items) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.resource == resourceUri) {
                        authority = item.authority;
                        accessToken = item.accessToken;
                        authContext = new Microsoft.ADAL.AuthenticationContext(authority);
                    }
                }

                // Attempt to authorize user silently
                authContext.acquireTokenSilentAsync(resourceUri, clientId).then(function (authResult) {
                    onAuthCompleted(authResult, authCompletedCallback);
                }, function () {
                    // We require user credentials so triggers authentication dialog
                    authContext.acquireTokenAsync(resourceUri, clientId, redirectUri).then(function (authResult) {
                        onAuthCompleted(authResult, authCompletedCallback);
                    }, function (err) {
                        console.error("Failed to authenticate: " + JSON.stringify(err));
                    });
                });
            });

        }
    };
})

.factory('People', function (GraphApi, InOutListApi) {
    // Might use a resource here that returns a JSON array

    function getUsers(onSuccess) {
        GraphApi.update(function () {
            //people.all = GraphApi.users;
            people.me = GraphApi.me;
            onSuccess();
        });
    }

    function getPersons(onSuccess) {
        InOutListApi.update(function () {
            people.all = InOutListApi.all;
            //people.me = GraphApi.me;
            onSuccess();
        });
    }

    function getPerson(id) {
        return InOutListApi.getPerson(id);
    }

    function update(onSuccess) {
        getUsers(onSuccess);
        getPersons(onSuccess);
    }

    var people = {
        update: update,
        all: [],
        me: {},
        get: getPerson
    };
    return people;
});
