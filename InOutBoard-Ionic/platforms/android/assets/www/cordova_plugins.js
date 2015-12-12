cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-ms-adal/www/utility.js",
        "id": "cordova-plugin-ms-adal.utility",
        "pluginId": "cordova-plugin-ms-adal",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-ms-adal/www/AuthenticationContext.js",
        "id": "cordova-plugin-ms-adal.AuthenticationContext",
        "pluginId": "cordova-plugin-ms-adal",
        "clobbers": [
            "Microsoft.ADAL.AuthenticationContext"
        ]
    },
    {
        "file": "plugins/cordova-plugin-ms-adal/www/CordovaBridge.js",
        "id": "cordova-plugin-ms-adal.CordovaBridge",
        "pluginId": "cordova-plugin-ms-adal"
    },
    {
        "file": "plugins/cordova-plugin-ms-adal/www/AuthenticationResult.js",
        "id": "cordova-plugin-ms-adal.AuthenticationResult",
        "pluginId": "cordova-plugin-ms-adal"
    },
    {
        "file": "plugins/cordova-plugin-ms-adal/www/TokenCache.js",
        "id": "cordova-plugin-ms-adal.TokenCache",
        "pluginId": "cordova-plugin-ms-adal"
    },
    {
        "file": "plugins/cordova-plugin-ms-adal/www/TokenCacheItem.js",
        "id": "cordova-plugin-ms-adal.TokenCacheItem",
        "pluginId": "cordova-plugin-ms-adal"
    },
    {
        "file": "plugins/cordova-plugin-ms-adal/www/UserInfo.js",
        "id": "cordova-plugin-ms-adal.UserInfo",
        "pluginId": "cordova-plugin-ms-adal"
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "pluginId": "cordova-plugin-whitelist",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-ms-adal": "0.6.0",
    "cordova-plugin-whitelist": "1.2.0"
}
// BOTTOM OF METADATA
});