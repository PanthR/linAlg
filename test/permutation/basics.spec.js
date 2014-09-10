var Permutation = require('../../linAlg/permutation');
var expect = require('chai').expect;

describe('Permutations', function() {
   var p1, p2, p3;
   it('are constructed from cycles', function() {
      expect(function() { p1 = new Permutation([2, 4, 5]); }).to.not.throw(Error);
      expect(function() { p2 = new Permutation([[2, 4], [1, 4, 7]]); }).to.not.throw(Error);
      expect(function() {
         p3 = new Permutation({ 1: 4, 4: 7, 7: 1, 2: 5, 5: 2});
      }).to.not.throw(Error);
      expect(function() { new Permutation(p1); }).to.not.throw(Error);
      expect(new Permutation(p1)).to.equal(p1);
      expect(p1).to.be.instanceof(Permutation);
      expect(p2).to.be.instanceof(Permutation);
      expect(p3).to.be.instanceof(Permutation);
   });
   it('have a proper get method', function() {
      expect(p1).to.respondTo('get');
      [
         [p1, 2, 4], [p1, 5, 2], [p1, 1, 1], [p1, 7, 7],
         [p2, 1, 4], [p2, 2, 7], [p2, 4, 2], [p2, 7, 1],
         [p3, 1, 4], [p3, 6, 6], [p3, 5, 2]
      ].forEach(function(triple) {
         expect(triple[0].get(triple[1])).to.equal(triple[2]);
      });
   });
   it('can be composed', function() {
      expect(p1).to.respondTo('compose');
      var p4 = p1.compose(p2);
      [
         [1, 4], [2, 2], [3, 3], [4, 5], [5, 7], [7, 1]
      ].forEach(function(pair) {
         expect(p4.get(pair[0])).to.equal(pair[1]);
      });
   });
   it('can return a cycle form', function() {
      expect(p1).to.respondTo('toCycles');
      [[p1, [[2, 4, 5]]],
       [p2, [[1, 4, 2, 7]]],
       [p3, [[1, 4, 7], [2, 5]]]
      ].forEach(function(pair) {
         var cycles = pair[0].toCycles();
         expect(cycles.length).to.equal(pair[1].length);
         for (var i = 0; i < pair[1].length; i += 1) {
            expect(cycles[i]).to.deep.equal(pair[1][i]);
         }
      });
   });
});