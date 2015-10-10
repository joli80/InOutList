angular.module('inoutlist.services', [])

.factory('InOutListApi', function (Adal, $resource) {

    var apiUrl = "https://www1.infracontrol.com/InOutBoardApi/api/";
    //var apiUrl = "http://localhost:9557/api/";
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

    function getPersons(onSuccess, onError) {
        Adal.authenticate(audience, function (result) {
            person(result.accessToken).query(function (persons) {
                api.all = persons;
                if (onSuccess)
                    onSuccess();
            }, function (err) {
                console.error(err);
                if (onError)
                    onError(err);
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

.factory('GraphApi', function (Adal, $resource, FileReader) {
    var resourceUri = "https://graph.windows.net",
        graphApiVersion = "1.6",
        tenantId = '7e046de7-97c5-4177-b6a6-e5852edf378e';

    //return getUsersUrl + "/" + tenantId + "/users/" + objectId + "/thumbnailPhoto?api-version=" + graphApiVersion;

    function users(authResult) {
        var url = resourceUri + "/" + tenantId + "/users?api-version=" + graphApiVersion;
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

    function thumbnail(authResult, objectId) {
        var url = resourceUri + "/" + tenantId + "/users/" + objectId + "/thumbnailPhoto?api-version=" + graphApiVersion;
        var user = $resource(url, {}, {
            query: {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + authResult.accessToken
                },
                transformResponse: function (data, headersGetter) {
                    var contentType = headersGetter('content-type');
                    var blob = new Blob([data], { type: contentType });
                    return { blob: blob };
                },
                responseType: "arraybuffer"
            }
        });
        return user;
    };

    //function blobToDataURL(blob, callback) {
    //    var a = new FileReader();
    //    a.onload = function (e) { callback(e.target.result); }
    //    a.readAsDataURL(blob);
    //}

    function getUsers(onSuccess, onError) {
        Adal.authenticate(resourceUri, function (result) {
            var userId = result.userInfo.userId;
            users(result).query(function (users) {
                api.users = users.value;
                api.me = getUser(userId);
                if (onSuccess)
                    onSuccess();
            }, function (err) {
                console.error(err);
                if (onError)
                    onError(err);
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

    function getThumbnail(objectId, onSuccess, scope) {
        Adal.authenticate(resourceUri, function (result) {
            thumbnail(result, objectId).query(function (imgData) {
                if (onSuccess) {
                    FileReader.readAsDataURL(imgData.blob, scope).then(onSuccess);

                    //blobToDataURL(imgData.blob, onSuccess);
                }
            }, function (err) {
                console.error(err);
                if (onError)
                    onError;
            });
        });
    }

    var api = {
        update: getUsers,
        users: [],
        getUser: getUser,
        me: {},
        getThumbnail: getThumbnail
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

    var combinedUsersAndPersons = {};
    function getCombined(id) {
        var c = combinedUsersAndPersons[id];
        if (!c) {
            c = combined(id);
            combinedUsersAndPersons[id] = c;
        }
        return c;
    }

    function getUsers(scope, onSuccess, onError) {
        GraphApi.update(function () {
            for (var i = 0; i < GraphApi.users.length; i++) {
                var user = GraphApi.users[i];
                var c = getCombined(user.userPrincipalName.toLowerCase());
                c.setUser(user);

                GraphApi.getThumbnail(GraphApi.me.objectId, function (img) {
                    c.face = img;
                }, scope);
            }

            people.me = getCombined(GraphApi.me.userPrincipalName.toLowerCase());

            if (onSuccess)
                onSuccess();
        }, onError);
    }

    function getPersons(onSuccess, onError) {
        InOutListApi.update(function () {
            for (var i = 0; i < InOutListApi.all.length; i++) {
                var person = InOutListApi.all[i];
                if (person.Email) {
                    var c = getCombined(person.Email.toLowerCase());
                    c.setPerson(person);
                }
            }

            if (onSuccess)
                onSuccess();
        }, onError);
    }

    function update(scope, onSuccess, onError) {
        getUsers(scope, onSuccess, onError);
        getPersons(onSuccess, onError);
    }

    function combined(id) {

        var person = {}, user = {};

        var c = {
            id: id,
            setPerson: function (p) {
                person = p;
                c.show = p != undefined;
            },
            setUser: function (u) {
                user = u;
            },
            name: function () {
                return person.Name || user.displayName;
            },
            mobile: function () { return person.CellPhone || user.mobile; },
            phone: function () { return person.CellPhone || user.mobile; },
            email: function () { return user.userPrincipalName; },
            status: function () { return person.StatusMessage; },
            returns: function () { return person.BackAgainMessage; },
            face: '',
            show: false
        };

        return c;

    }

    var people = {
        update: update,
        all: combinedUsersAndPersons,
        me: {},
        get: getCombined
    };
    return people;
});
