angular.module('inoutlist.services', [])

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
