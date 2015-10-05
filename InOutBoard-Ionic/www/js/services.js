angular.module('inoutlist.services', [])

.factory('InOutBoard', function (Adal, $resource) {

    //var url = "https://www1.infracontrol.com/InOutBoard/api/";
    var url = "http://localhost:9557/api/";

    Adal.register(function () {
        getPersons();
    }, 'InOutBoard');

    getPersons();

    var person = $resource(url + 'person/:id', {}, {
        query: {
            method: 'GET',
            isArray: true,
            headers: {
                'Authorization': 'Bearer ' + Adal.getAccessToken()
            }
        }
    });

    var people = [];
    function getPersons() {
        Adal.authenticate(function (result) {
            person.query(function (persons) {
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

.factory('Adal', function () {

    var authority = "https://login.windows.net/common",
        redirectUri = "http://InOutList",
        resourceUri = "https://graph.windows.net",
        clientId = "f0a67ebb-50d3-4de0-aae1-a44b3ff62773",
        graphApiVersion = "1.6";

    var listeners = {};
    function callListeners(event, args) {
        for (key in listeners) {
            var cb = listeners[key];
            cb(event, args);
        }
    };

    var accessToken;

    return {
        init: function () {
            callListeners('initialized');
        },
        register: function (callback, id) {
            listeners[id] = callback;
        },
        authenticate: function (authCompletedCallback) {

            var authContext = new Microsoft.ADAL.AuthenticationContext(authority);
            authContext.tokenCache.readItems().then(function (items) {
                if (items.length > 0) {
                    authority = items[0].authority;
                    accessToken = items[0].accessToken;
                    authContext = new Microsoft.ADAL.AuthenticationContext(authority);
                }

                // Attempt to authorize user silently
                authContext.acquireTokenSilentAsync(resourceUri, clientId)
                .then(authCompletedCallback, function () {
                    // We require user credentials so triggers authentication dialog
                    authContext.acquireTokenAsync(resourceUri, clientId, redirectUri)
                    .then(authCompletedCallback, function (err) {
                        console.error("Failed to authenticate: " + JSON.stringify(err));
                    });
                });
            });

        },
        getAccessToken: function () {
            return accessToken
        },
        getUsers: function (authResult, onSuccess) {
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
        },
    };
})

.factory('People', function (Adal) {
    // Might use a resource here that returns a JSON array

    var userId;
    var people = [];

    Adal.register(function () {
        getUsers();
    }, 'People');

    function getUsers() {
        Adal.authenticate(function (result) {
            userId = result.userInfo.userId;
            Adal.getUsers(result, function (users) {
                people = users.value;
                callListeners('updated', people);
            });
        });
    }

    function getUser(objectId) {
        for (var i = 0; i < people.length; i++) {
            if (people[i].objectId === objectId) {
                return people[i];
            }
        }
        return null;
    }

    var listeners = {};
    function callListeners(event, args) {
        for (key in listeners) {
            var cb = listeners[key];
            cb(event, args);
        }
    };

    return {
        getAll: function () {
            return people;
        },
        get: getUser,
        getMe: function () {
            return getUser(userId);
        },
        register: function (callback, id) {
            listeners[id] = callback;
        },
    };

});
