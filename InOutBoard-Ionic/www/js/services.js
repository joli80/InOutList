angular.module('inoutlist.services', [])

.factory('Adal', function () {

    var authority = 'https://login.windows.net/common';
    var resourceUrl = 'https://graph.windows.net/';
    var appId = '2f4abeff-eedf-4f1b-a008-d60acd8d0b4e';
    var redirectUrl = 'http://AdalSample';

    var tenantName = 'infracontrolcom.onmicrosoft.com';
    var endpointUrl = resourceUrl + tenantName;

    var authContext;

    function pre(json) {
        return '<pre>' + JSON.stringify(json, null, 4) + '</pre>';
    }

    function acquireToken(onSuccess, onError) {
        if (authContext == null) {
            console.error('Authentication context isn\'t created yet. Create context first');
            return;
        }

        authContext.acquireTokenAsync(resourceUrl, appId, redirectUrl)
            .then(function (authResult) {
                console.log('Acquired token successfully: ' + pre(authResult));
                if (onSuccess) {
                    onSuccess(authResult);
                }
            }, function (err) {
                console.error("Failed to acquire token: " + pre(err));
                if (onError) {
                    onError(err);
                }
            });
    }

    return {
        createContext: function () {

            Microsoft.ADAL.AuthenticationContext.createAsync(authority)
            .then(function (context) {
                authContext = context;
                console.log("Created authentication context for authority URL: " + context.authority);
            }, function (err) {
                console.error(pre(err));
            });
        },
        acquireToken: acquireToken,
        acquireTokenSilent: function (onSuccess, onError) {
            if (authContext == null) {
                console.error('Authentication context isn\'t created yet. Create context first');
                return;
            }

            // testUserId parameter is needed if you have > 1 token cache items to avoid "multiple_matching_tokens_detected" error
            // Note: This is for the test purposes only
            authContext.tokenCache.readItems()
                .then(function (cacheItems) {
                    var userId;
                    if (cacheItems.length) {
                        userId = cacheItems[0].userInfo.userId;
                    }

                    authContext.acquireTokenSilentAsync(resourceUrl, appId, userId)
                        .then(function (authResult) {
                            console.log('Acquired token successfully: ' + pre(authResult));
                            if (onSuccess) {
                                onSuccess(authResult);
                            }
                        }, function (err) {
                            console.error("Failed to acquire token silently: " + pre(err));
                            acquireToken(onSuccess, onError);
                        });
                }, function (err) {
                    console.error("Unable to get User ID from token cache. Have you acquired token already? " + pre(err));
                });
        },
    };
})

.factory('People', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var people = [{
        id: 0,
        name: 'Johan Lindqvist',
        errand: 'Tjänsteärende',
        returns: 'lunch',
        face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        errand: 'Hey, it\'s me',
        face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
        id: 2,
        name: 'Andrew Jostlin',
        errand: 'Did you get the ice cream?',
        face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
    }, {
        id: 3,
        name: 'Adam Bradleyson',
        errand: 'I should buy a boat',
        face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
        id: 4,
        name: 'Perry Governor',
        errand: 'Look at my mukluks!',
        face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
    }];

    return {
        all: function () {
            return people;
        },
        //remove: function(chat) {
        //    people.splice(people.indexOf(chat), 1);
        //},
        get: function (id) {
            for (var i = 0; i < people.length; i++) {
                if (people[i].id === parseInt(id)) {
                    return people[i];
                }
            }
            return null;
        }
    };
});
