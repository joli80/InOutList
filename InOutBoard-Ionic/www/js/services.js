angular.module('inoutlist.services', [])

.factory('Adal', function () {

    var authority = "https://login.windows.net/common",
        redirectUri = "http://AdalSample",
        resourceUri = "https://graph.windows.net",
        clientId = "2f4abeff-eedf-4f1b-a008-d60acd8d0b4e",
        graphApiVersion = "2013-11-08";

    function pre(json) {
        return '<pre>' + JSON.stringify(json, null, 4) + '</pre>';
    }

    return {
        authenticate: function (authCompletedCallback) {

            var authContext = new Microsoft.ADAL.AuthenticationContext(authority);
            authContext.tokenCache.readItems().then(function (items) {
                if (items.length > 0) {
                    authority = items[0].authority;
                    authContext = new Microsoft.ADAL.AuthenticationContext(authority);
                }

                // Attempt to authorize user silently
                authContext.acquireTokenSilentAsync(resourceUri, clientId)
                .then(authCompletedCallback, function () {
                    // We require user credentials so triggers authentication dialog
                    authContext.acquireTokenAsync(resourceUri, clientId, redirectUri)
                    .then(authCompletedCallback, function (err) {
                        console.error("Failed to authenticate: " + pre(err));
                    });
                });
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
