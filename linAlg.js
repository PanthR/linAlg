(function(define) {'use strict';
define(function(require) {

   /**
    * Javascript implementation of Linear Algebra Concepts.
    * @module LinAlg
    * @version 0.0.1
    * @author Haris Skiadas <skiadas@hanover.edu>, Barb Wahl <wahl@hanover.edu>
    */
   var LinAlg;
   
   /**
    * Linear Algebra module offers a framework for Linear Algebra computations
    * with a goal to making those operations reasonably efficient for large sizes.
    * If you will only be using small matrices and/or vectors, but require a huge
    * number of them, you might find this library unsuitable.
    */
   LinAlg = {};
   
   /** Implementation of fixed-length vectors. */
   LinAlg.Vector = require('./vector');
   /** Implementation of 2-dimensional matrices. */
   LinAlg.Matrix = require('./matrix');

   return LinAlg;

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
