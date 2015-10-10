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
                }
            }, function (err) {
                console.error(err);
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

    var combinedUsersAndPersons = {};
    function getAndAddCombined(id) {
        var c = combinedUsersAndPersons[id];
        if (!c) {
            c = combined(id);
            combinedUsersAndPersons[id] = c;
        }
        return c;
    }

    function getCombined(id) {
        return combinedUsersAndPersons[id];
    }

    function getUsers(scope, onSuccess, onError) {
        GraphApi.update(function () {
            for (var i = 0; i < GraphApi.users.length; i++) {
                var user = GraphApi.users[i];
                var c = getAndAddCombined(user.userPrincipalName.toLowerCase());
                c.setUser(user);
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
                    var c = getAndAddCombined(person.Email.toLowerCase());
                    c.setPerson(person);
                }
            }

            if (onSuccess)
                onSuccess();
        }, onError);
    }

    var test = true;
    function update(scope, onSuccess, onError) {

        if (test) {
            createTestData();
            return;
        }

        getUsers(scope, onSuccess, onError);
        getPersons(onSuccess, onError);
    }

    function createTestData() {

        for (var i = 0; i < 5; i++) {
            var c = getAndAddCombined(i);
            c.name = 'Name' + i;
            c.mobile = 'Mobile' + i;
            c.show = true;
            c.status = "Jobbar :fråga: hemma";
            c.returns = "kl " + i;
            c.statusCode = i;
        }

        people.me = getCombined(0);

    }

    function get(id, scope) {
        var c = getCombined(id);
        if (c)
            c.getFace(scope);
        return c;
    }

    function combined(id) {

        var thumbnail;

        var c = {
            id: id,
            user: {},
            person: {},
            setPerson: function (p) {
                c.person = p;
                c.show = true;
                c.update();
            },
            setUser: function (u) {
                c.user = u;
                c.update();
            },
            update: function () {
                c.objectId = c.user.objectId;
                c.name = c.person.Name || c.user.displayName;
                c.mobile = c.person.CellPhone || c.user.mobile;
                c.phone = c.person.Phone;
                c.email = c.user.userPrincipalName;
                c.status = c.person.StatusMessage;
                c.returns = c.person.BackAgainMessage;
                c.statusCode = c.person.Status;
            },
            show: false,
            objectId: undefined,
            name: '',
            mobile: '',
            phone: '',
            email: '',
            status: '',
            returns: '',
            face: '',
            getFace: function (scope) {
                if (!c.face) {
                    c.face = 'img/profile.png';

                    if (test)
                        return;

                    GraphApi.getThumbnail(c.objectId, function (img) {
                        c.face = img;
                    }, scope);
                }
            },
            statusCode: undefined,
            statusColor: function () {
                switch (c.statusCode) {
                    case 0:
                        return "green";
                    case 1:
                    case 12:
                    case 13:
                        return "red";
                    case 2:
                    case 21:
                    case 22:
                    case 23:
                    case 24:
                        return "yellow";
                    case 3:
                        return "green-light";
                    case 14:
                        return "purple";
                    case 11:
                        return "blue";
                    default:
                        return 'red';

                }
            },
            statusText: function () {
                var re = /\:(.*)\:/;
                return c.status
                        .replace('ä', 'a').replace('å', 'a').replace('ö', 'o')
                        .replace(re, '<img src="img/$1.gif" alt="$1" />');
            }
        };

        return c;

    }

    var people = {
        update: update,
        all: function () {
            var array = [];
            for (var id in combinedUsersAndPersons) {
                if (combinedUsersAndPersons.hasOwnProperty(id)) {
                    var person = combinedUsersAndPersons[id];
                    if (person.show)
                        array.push(person);
                }
            }
            return array;
        },
        me: {},
        get: get
    };
    return people;
});
