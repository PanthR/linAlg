/**
 * Algebraic Permutations on finite sets.
 * @module Permutation
 * @author Haris Skiadas <skiadas@hanover.edu>, Barb Wahl <wahl@hanover.edu>
 */

(function(define) {'use strict';
define(function(require) {

   /**
    * A class representing permutations on sets `{1, 2, ..., n}`. Permutations are
    * represented via a "function object" whose key-value pairs are non-fixed points of
    * the permutation. In other words, if `s(i) = j` and `j` is not equal to `i`, then
    * the object contains a key `i` with value `j`. If a key `i` does not appear in the
    * object then `s(i) = i`. For example the cycle `(2 4)` can be represented as the
    * object `{ 2: 4, 4: 2 }`.
    *
    * The size `n` is only implicit; permutations can be thought of as functions on any
    * set big enough to contain their non-fixed points.
    * The first argument, `relation`, needs to be either an array representing a cycle,
    * an array of arrays representing a product of cycles, or a "function object".
    *
    * It can also be called with another `Permutation` as first argument, in which case
    * it returns that permutation.
    */
   function Permutation(relation) {
      if (relation instanceof Permutation) { return relation; }
      if (!this instanceof Permutation) { return new Permutation(relation); }
      this.nonfixed = Permutation.cycleToObject(relation || {});
   }

   Permutation.prototype = Object.create({});

   Permutation.prototype.get = function get(i) {
      if (i < 1) { throw new Error('Permutations require positive arguments.'); }
      return this.nonfixed[i] || i;
   };

   /**
    * Return the composed permutation of `this` followed by `other`.
    * `other` may be a `Permutation`, a cycle, array of cycles, or a "function object".
    */
   Permutation.prototype.compose = function compose(other) {
      other = other instanceof Permutation ?
              other.nonfixed :
              Permutation.cycleToObject(other);
      return new Permutation(_compose(this.nonfixed, other));
   };
   // Helper methods

   /**
    * Return an array representing the cycle representation of the permutation.
    */
   Permutation.prototype.toCycles = function toCycles() {
      var cycles, cycle, visited, start, key, relation;

      cycles = [];
      visited = {};
      relation = this.nonfixed;
      for (key in relation) {
         if (relation.hasOwnProperty(key) && !visited[key]) {
            start = parseInt(key);
            cycle = [start];
            visited[key] = true;
            while (relation[key] !== start) {
               key = relation[key];
               visited[key] = true;
               cycle.push(key);
            }
            cycles.push(cycle);
         }
      }
      return cycles;
   };

   /**
    * Return the function object represented by the cycle. Helper method.
    * It also recognizes an array of cycles, or a "function object".
    */
   Permutation.cycleToObject = function cycleToObject(cycles) {
      var result;
      if (!Array.isArray(cycles)) { return cycles; }
      cycles = Array.isArray(cycles[0]) ? cycles : [cycles];
      result = {};
      cycles.forEach(function(cycle) {
         result = _compose(result, convert(cycle));
      });
      return result;
   };

   // Helper methods

   // Converts a single cycle to a function object
   function convert(cycle) {
      var result, i;
      result = {};
      for (i = 0; i < cycle.length; i += 1) {
         result[cycle[i]] = cycle[(i + 1) % cycle.length];
      }
      return result;
   }

   // Composes two "function objects"
   function _compose(first, second) {
      var keys, result;
      result = {};
      keys = Object.keys(first).concat(Object.keys(second));
      keys.forEach(function(key) {
         var value;
         key = parseInt(key);
         value = first[key] || key;
         value = second[value] || value;
         if (value !== key) { result[key] = value; }
      });
      return result;
   }

   return Permutation;

});

}(typeof define === 'function' && define.amd ? define : function(factory) {
   'use strict';
   module.exports = factory(require);
}));
