// Simple Doc generator. Navigates down a folder of files, and collect all comments starting with 2 slashes
// It processes those comments and the lines that immediately follow them to create a single documentation file.

var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var template = Handlebars.compile(fs.readFileSync('docs/template.handlebars', 'utf8'));

function makeRef(el) {
   return '#' + el.replace(/#/g, '-').replace(/\(.*/, '');
}

Handlebars.registerHelper('stripReplace', function(el) {
   return el.replace(/#/g, '-').replace(/\(.*/, '');
});
Handlebars.registerHelper('strip', function(el) {
   return el.replace(/\(.*/, '');
});
Handlebars.registerHelper('author', function(el) {
   var email = el.match(/\s*(.*?)\s*\<(.*)\>/);
   if (email) {
      return '<a href="mailto:' + email[2] + '">' + email[1] + '</a>'
   } else {
      return el.trim();
   }
});

var Parser = {
   dirPath: [],
   result: {},
   currentComment: [],
   followsComment: false,
   nameSpace: [],
   matches: [],
   functions: {},
   patterns: {
      comment: /^\s*\/\/\s(.*?)\s*$/,
      empty: /^\s*$/,
      function: /(?:(\w+(?:[.\w+]*))\s*=\s*)?function(?:\s+(\w+))?(\((?:\w+(?:\,\s*\w+)*)\))/
   }
}

Parser.finishComment = function finishComment(method) {
   if (Parser.currentComment.length === 0) { return; }
   if (method) {
      method = Parser.extractFunction(method);
   }
   this.matches.push({
      comment: Parser.cleanupComment(this.currentComment.join("\n")),
      method: method
   });
   this.currentComment = [];
   this.followsComment = false;
}

Parser.appendComment = function appendComment(line) {
   this.currentComment.push(line.match(this.patterns.comment)[1]);
   this.followsComment = true;
}

Parser.extractFunction = function extractFunction(line) {
   var match = line.match(this.patterns.function);
   var funName = (match[1] || match[2]).replace(".prototype.", "#");
   fullName = this.nameSpace.slice(1).concat(funName).join(".");
   this.functions[fullName] = true;
   return fullName + match[match.length - 1];
}

Parser.cleanupComment = function(comment) {
   return comment.replace(/\`([\w\.\#]*?)\`/g, function(_, el) {
      if (Parser.functions[el]) {
         return '<a href="' + makeRef(el) + '"><code>' + el + '</code></a>';
      } else {
         return '<code>' + el + '</code>';
      }
   }).replace(/\`(.*?)\`/g, function(_, el) {
      return '<code>' + el + '</code>';
   }).replace(/\_([^\_]*?)\_/g, function(_, el) {
      return '<em>' + el + '</em>'
   }).replace(/\n((?:\s{4}.*\n?)+)/g, function(_, el) {
      return '<pre>' + el + '</pre>';
   }).replace(/(?:(?:^|\n)\s*\d\.\s*.*)+/g, function(el) {
      return '<ol>' + el.replace(/\d\.\s*(.*)\n?/g, function(_, l) {
         return '<li>' + l + '</li>';
      }) + '</ol>';
   }).replace(/(?:(?:^|\n)\s*[\-\*]\s+.*)+/g, function(el) {
      return '<ul>' + el.replace(/[\-\*]\s+(.*)\n?/g, function(_, l) {
         return '<li>' + l + '</li>';
      }) + '</ul>';
   });
}

Parser.parseFile = function(filename) {
   var fullname = Parser.fullPath(filename);
   var lines = fs.readFileSync(fullname, "utf8").split("\n");
   var patterns = this.patterns;
   lines.forEach(function(line) {
      if (patterns.comment.test(line)) {
         Parser.appendComment(line);
      } else if (patterns.function.test(line) && Parser.followsComment) {
         Parser.finishComment(line);
      } else {
         Parser.finishComment(null);
      }
   });
}

Parser.parseFolder = function(foldername) {
   var fullname = Parser.fullPath(foldername);
   Parser.nameSpace.push(foldername[0].toUpperCase() + foldername.slice(1));
   Parser.dirPath.push(foldername);
   filenames = fs.readdirSync(fullname).sort(function(a, b) {
      // fname.js should go before a folder with the same name. Otherwise respect order
      if (path.extname(a) && !(path.extname(b)) && path.basename(a, path.extname(a)) === b) {
         return -1;
      } else if (path.extname(b) && !(path.extname(a)) && path.basename(b, path.extname(b)) === a) {
         return 1;
      } else {
          return a > b;
      }
   });
   filenames.forEach(Parser.parse);
   Parser.nameSpace.pop();
   Parser.dirPath.pop();
}

Parser.fullPath = function(filename) {
   return path.join.apply(null, this.dirPath.concat(filename));
}
Parser.parse = function(filename) {
   if (fs.statSync(Parser.fullPath(filename)).isDirectory()) {
      Parser.parseFolder(filename);
   } else {
      Parser.parseFile(filename);
   }
}

Parser.parseHeader = function() {
   // Takes out the first segment from matches, and uses the information in it to create a 'header'
   var header = Parser.matches.shift().comment.split('\n');
   var settings = Parser.settings = {};
   settings.moduleName = header.shift();
   settings.intro = '';
   header.forEach(function(line) {
      var parts = line.split(/\s*\:\s*/);
      if (parts.length === 1) {
         settings.intro += '\n' + line;
      } else {
         if (parts[0] === 'author') {
            settings.authors = settings.authors || [];
            settings.authors.push(parts[1]);
         } else {
            settings[parts[0]] = parts[1];
         }
      }
   });
}


Parser.parse('linAlg');
Parser.parseHeader();
// console.log("\n\nMATCHES:\n\n");

fs.writeFileSync('docs/linAlg.html', template(Parser));
// console.log(Parser.matches); //.forEach(console.log);
// console.log("\n\nFUNCTIONS:\n\n");
// console.log(Parser.functions);