angular.module('inoutlist.services', [])

.factory('Adal', function () {

    var authority = "https://login.windows.net/common",
        redirectUri = "http://InOutList",
        resourceUri = "https://graph.windows.net",
        clientId = "f0a67ebb-50d3-4de0-aae1-a44b3ff62773",
        graphApiVersion = "1.6";

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
                        console.error("Failed to authenticate: " + JSON.stringify(err));
                    });
                });
            });

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

    function getUsers(onSuccess) {
        Adal.authenticate(function (result) {
            userId = result.userInfo.userId;
            Adal.getUsers(result, function (users) {
                //console.log(users);
                if (onSuccess) {
                    onSuccess(users.value);
                }

            });
        });
    }

    // Some fake testing data
    //var people = [{
    //    id: 0,
    //    name: 'Johan Lindqvist',
    //    errand: 'Tjänsteärende',
    //    returns: 'lunch',
    //    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    //}, {
    //    id: 1,
    //    name: 'Max Lynx',
    //    errand: 'Hey, it\'s me',
    //    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    //}, {
    //    id: 2,
    //    name: 'Andrew Jostlin',
    //    errand: 'Did you get the ice cream?',
    //    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
    //}, {
    //    id: 3,
    //    name: 'Adam Bradleyson',
    //    errand: 'I should buy a boat',
    //    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    //}, {
    //    id: 4,
    //    name: 'Perry Governor',
    //    errand: 'Look at my mukluks!',
    //    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
    //}];

    var people = {
        update: getUsers,
        get: function (id) {
            //for (var i = 0; i < people.length; i++) {
            //    if (people[i].id === parseInt(id)) {
            //        return people[i];
            //    }
            //}
            return null;
        }
    };

    return people;
});
