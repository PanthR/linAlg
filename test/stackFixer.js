var oldconsoleError = console.error, errorStackDepth = 1;
var path = require('path');
var appRoot = path.resolve(__dirname, '..');
var regexp = /\.spec\.js\:\d+\:\d+/;

console.error = function () {//fmt, i, title, msg, stack
   var args = Array.prototype.slice.call( arguments, 0 ), stack = args[ 4 ], match;

   if ( stack ) {
      while (stack.indexOf(appRoot) > -1) {
         stack = stack.replace(appRoot, '', 'mg');
      }
      match = stack.match(regexp);
      if (match) {
         stack = stack.split('\n').slice(0, 3).join('\n') + '\n';
      }
      args[ 4 ] = stack;
   }

   oldconsoleError.apply( console, args );
};