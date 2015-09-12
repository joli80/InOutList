module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-angular-gettext');

    grunt.initConfig({
        nggettext_extract: {
            pot: {
                files: {
                    'po/template.pot': ['www/templates/*.html']
                }
            },
        },
        nggettext_compile: {
            all: {
                files: {
                    'www/js/translations.js': ['po/*.po']
                }
            },
        },
    })

    //grunt.registerTask('default', ['nggettext_extract']);

};