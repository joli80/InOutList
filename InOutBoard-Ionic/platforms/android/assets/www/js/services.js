angular.module('inoutlist.services', [])

//.factory('InOutBoard', function (Adal, InOutBoard) {

.factory('InOutListApi', function (Adal, $resource) {

    //var url = "https://www1.infracontrol.com/InOutBoard/api/";
    var apiUrl = "http://localhost:9557/api/";
    var audience = "http://infracontrolcom.onmicrosoft.com/inoutlistapi";

    //Adal.register(function () {
    //    getPersons();
    //}, 'InOutBoard');

    // getPersons();

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

    var people = [];
    function getPersons() {
        Adal.authenticate(audience, function (result) {
            person(result.accessToken).query(function (persons) {
                people = persons;
            }, function (err) {
                console.error(err);
            });
        });
    }

    return {
        people: people
    };

})


.factory('GraphApi', function (Adal, $resource) {
    var resourceUri = "https://graph.windows.net",
        graphApiVersion = "1.6";

    function getUsers(authResult, onSuccess) {
        var req = new XMLHttpRequest();
        var url = resourceUri + "/" + authResult.tenantId + "/users?api-version=" + graphApiVersion;
        // url = searchText ? url + "&$filter=mailNickname eq '" + searchText + "'" : url + "&$top=10";

        req.open("GET", url, true);
        req.setRequestHeader('Authorization', 'Bearer ' + authResult.accessToken);

        req.onload = function (e) {
            if (e.target.status >= 200 && e.target.status < 300) {
                if (onSuccess) {
                    onSuccess(JSON.parse(e.target.response));
                }
                return;
            }
            console.error('Data request failed: ' + e.target.response);
        };
        req.onerror = function (e) {
            console.error('Data request failed: ' + e.error);
        }

        req.send();
    }

    var userId
    function update(onSuccess) {
        Adal.authenticate(resourceUri, function (result) {
            userId = result.userInfo.userId;
            getUsers(result, function (users) {
                api.users = users.value;
                api.me = getUser(userId);
                if (onSuccess) {
                    onSuccess();
                }
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
        update: update,
        users: [],
        getUser: getUser,
        me: {}
    };

    return api;
})

.factory('Adal', function () {

    var authority = "https://login.windows.net/common",
        redirectUri = "http://InOutList",
        //resourceUri = "https://graph.windows.net",
        clientId = "f0a67ebb-50d3-4de0-aae1-a44b3ff62773";
    //graphApiVersion = "1.6";

    var userId; // = result.userInfo.userId;

    //var listeners = {};
    //function callListeners(event, args) {
    //    for (key in listeners) {
    //        var cb = listeners[key];
    //        cb(event, args);
    //    }
    //};

    //var accessToken;
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
            //callListeners('initialized');
        },
        //register: function (callback, id) {
        //    listeners[id] = callback;
        //},
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

        },
        getUserId: function () {
            return userId;
        }
        //getAccessToken: function () {
        //    return accessToken
        //},

    };
})


.factory('People', function (GraphApi) {
    // Might use a resource here that returns a JSON array

    //var userId;
    //var people = [];

    //Adal.register(function () {
    //    getUsers();
    //}, 'People');

    function getUsers(onSuccess) {
        GraphApi.update(function () {
            people.all = GraphApi.users;
            people.me = GraphApi.me;
            onSuccess();
            //callListeners('updated', people);
        });
    }

    //var listeners = {};
    //function callListeners(event, args) {
    //    for (key in listeners) {
    //        var cb = listeners[key];
    //        cb(event, args);
    //    }
    //};

    var people = {
        update: getUsers,
        all: [],
        me: {}
        //getAll: function () {
        //    return people;
        //},
        //get: getUser,
        //getMe: function () {
        //    return getUser(userId);
        //},
        //register: function (callback, id) {
        //    listeners[id] = callback;
        //},
    };
    return people;
});
