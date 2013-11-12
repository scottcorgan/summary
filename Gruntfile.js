var path = require('path');
var cheerio = require('cheerio');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    uglify: {
      scripts: {
        files: {
          './www/summary.min.js': './www/summary.js'
        }
      }
    },
    
    connect: {
      server: {
        options: {
         port: 5000,
          base: './www'
        }
      }
    },
    
    watch: {
      files: './src/**/**.*',
      tasks: ['build']
    }
  });


  grunt.registerTask('summarize', function () {
    var summary = grunt.file.readJSON('summary.json');
    
    buildDefaultStyles();
    buildDefaultScripts();
    buildFavicon();
    buildBaseFile(summary);
    
    grunt.log.write('Compiled templates');
    grunt.log.writeln('');
    
    function buildDefaultStyles () {
      var prism = grunt.file.read('./lib/css/prism.css');
      var molten = grunt.file.read('./lib/css/molten.css');
      var base = grunt.file.read('./lib/css/base.css');
      
      grunt.file.write('www/summary.css', prism + molten + base);
    }
    
    function buildDefaultScripts () {
      var scrollto = grunt.file.read('./lib/js/jquery.scrollto.js');
      var prism = grunt.file.read('./lib/js/prism.js');
      var base = grunt.file.read('./lib/js/base.js');

      grunt.file.write('./www/summary.js', scrollto + prism + base);
    }
    
    function buildFavicon () {
      grunt.file.copy('./lib/favicon.png', './www/favicon.png');
    }
    
    function buildBaseFile (summary) {
      var baseFileContents = grunt.file.read('./lib/index.html');
      var $ = cheerio.load(baseFileContents);
      
      $('title').text(summary.title + ' - ' + summary.subtitle);
      $('h1').text(summary.title);
      $('h2').text(summary.subtitle);
      
      Object.keys(summary.sections).forEach(function (key) {
        var sectionTitle = summary.sections[key];
        var sectionTemplatePath = path.join('src/sections', key + '.html');
        var templateContents = grunt.file.read(sectionTemplatePath);
        var $section = cheerio.load('<div id="' + key + '" title="' + sectionTitle + '" class="section"><hr></div>');
        
        $section('.section').append(templateContents);
        $('.sections-wrapper').find('.wrapper').append($section.html());
      });
      
      grunt.file.write('./www/index.html', $.html());
    }
  });
  

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  
  grunt.registerTask('build', ['summarize', 'uglify']);
  grunt.registerTask('server', ['summarize', 'connect', 'watch']);
  grunt.registerTask('default', ['server']);
};