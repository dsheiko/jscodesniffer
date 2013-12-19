JS_CodeSniffer v.2.x
==============
[![Build Status](https://travis-ci.org/dsheiko/jscodesniffer.png)](https://travis-ci.org/dsheiko/jscodesniffer)
[![NPM version](https://badge.fury.io/js/jscodesniffer.png)](http://badge.fury.io/js/jscodesniffer)

JS_CodeSniffer is a node.js application that tokenises and "sniffs" JavaScript files to detect violations of a defined coding standard. It is an essential development tool that ensures your code remains clean and consistent.
A coding standard in JS_CodeSniffer is a collection of sniff files. Each sniff checks one part of the coding standard only. The default coding standard used by JS_CodeSniffer is the Idiomatic Style Manifesto (https://github.com/rwldrn/idiomatic.js).


JS Sniffer online available at http://jscodesniffer.dsheiko.com

## Setup

JS_CodeSniffer relies on node.js. If you don't have node.js installed, just follow the instructions:
https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager

Make sure all the required dependencies installed
```
npm i
```
Make sure the binary is executable
```
chmod +x jscs
```
You can also create a symlink to make it globally available
```
ln -s jscs /usr/local/bin/jscs
```

## Usage

Simply get detailed report on the file coding style according to Idiomatic Style Manifesto
```
./jscs source-code.js
```

![JS CodeSniffer Full Report Example](https://raw.github.com/dsheiko/jscodesniffer/master/doc/sample1.jpg "JS CodeSniffer Full Report Example")

Get detailed report on the coding style for all *.js/*.json files of the 'lib' folder according to jQuery Coding Style Guide
```
./jscs lib --standard=Jquery
```

Get summary report
```
./jscs lib --report-summary
```
![JS CodeSniffer Summary Report Example](https://raw.github.com/dsheiko/jscodesniffer/master/doc/sample2.jpg "JS CodeSniffer Summary Report Example")

Get XML report (which allows you to parse the output easily and use the results in your own scripts)
```
./jscs lib --report=xml
```

Setting up [Apache Ant](http://ant.apache.org/) build script reporting to [Jenkins](http://jenkins-ci.org) Checkstyle plugin.
NOTE: If you have phpcs-ci ant target, invoke it prior to this one. Jscs will find created by phpcs checkstyle.xml and extend its body instead of overriding the report.
```
<target name="jscs-ci"
         description="Find coding standard violations using JS_CodeSniffer and print human readable output.">
  <exec executable="jscs">
   <arg value="--standard=Jquery" />
   <arg value="--report=checkstyle" />
   <arg value="--report-file=${basedir}/build/logs/checkstyle.xml" />
   <arg path="${basedir}/src" />
  </exec>
 </target>
```

Setting up [Grunt](http://gruntjs.com/) task:

*Gruntfile.js*
```
grunt.loadNpmTasks('grunt-jscs');
grunt.initConfig({
     // Validate against jQuery coding standard
     jscs: {
        options: {
            "standard": "Jquery"
        },
        all: ["js-folder"]
     }
  });
```
*package.json*
```
"devDependencies": {
    //..
    "grunt-jscs": ">0.0.1"
  }
```

## Environments

Standard to sniff against can be enforced on the file by following instructions directly in the code
```
/* @jscs standard:Jquery */
```

## Using the Subversion pre-commit hook

A pre-commit hook is a feature available in the Subversion version control system that allows code to be validated before it is committed to the repository.
Edit scripts/jscs-svn-pre-commit and replace JSCS value with your own path to JS CodeSniffer
```
JSCS = "/your-path/jscodesniffer"
```

Make a symlink of scripts/jscs-svn-pre-commit in your repository hooks folder. E.g.
```
ln -s /<full path>/scripts/jscs-svn-pre-commit /repositories/<project>/hooks/pre-commit
```

## Using the git pre-commit hook
Make a symlink of scripts/jscs-git-pre-commit in your repository .git/hooks folder. E.g.
```
ln -s /<full path>/scripts/jscs-git-pre-commit /<project>/.git/hooks/pre-commit
```

