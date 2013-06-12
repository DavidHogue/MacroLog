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
                    baseUrl: "public/js",
                    mainConfigFile: "public/js/main.js",
                    out: "public/js/optimized.js",
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