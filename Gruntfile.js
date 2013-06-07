module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-requirejs");
    grunt.loadNpmTasks("grunt-contrib-qunit");

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        
        requirejs: {
            compile: {
                options: {
                    almond: true,
                    name: "main",
                    baseUrl: "js",
                    mainConfigFile: "js/main.js",
                    out: "js/optimized.js",
                    wrap: true
                }
            }
        },
        
        qunit: {
            all: {
                options: {
                    urls: [
                        "tests/tests.html"
                    ]
                }
            }
        }
    });
    
    grunt.registerTask("default", "requirejs");
};