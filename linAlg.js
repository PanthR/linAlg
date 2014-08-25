(function(define) {'use strict';
define(function(require) {

   /**
    * Javascript implementation of Linear Algebra Concepts.
    * @module LinAlg
    * @version 0.0.1
    * @author Haris Skiadas <skiadas@hanover.edu>, Barb Wahl <wahl@hanover.edu>
    */
   var LinAlg = {};
   
   /* Fixed length vectors */
   LinAlg.Vector = require('./vector');
   /* Fixed dimension 2-dimensional matrices */
   LinAlg.Matrix = require('./matrix');

   return LinAlg;

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
