var Matrix = require('../../linAlg/matrix');
var expect = require('chai').expect;

describe('View matrices', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3, 8, 9, 12, 5, 33, 25], { nrow : 3 });
   var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
   var f  = function(i, j) { return i - j; }
   var A3 = new Matrix(f, { nrow : 4, ncol: 6 });
   var A4 = A1.view([1, 3],[4, 2]);
   var A5 = A2.view(function a(i) { return 2;}, [3, 2], { nrow : 2}); // [[8,0],[8,0]]
   var A6 = A3.view(function a(i) { return 5 - i; }, 
      function b(j) { return 7 - j}, { nrow : 4, ncol: 6 });
   it('have correct dimensions', function() {
      expect(A4.nrow).to.equal(2);
      expect(A4.ncol).to.equal(2);
      expect(A5.nrow).to.equal(2);
      expect(A5.ncol).to.equal(2);
      expect(A6.nrow).to.equal(4);
      expect(A6.ncol).to.equal(6);
   });
   it('look up the correct values with get', function() {
      expect(A4.get(2,1)).to.equal(A1.get(3,4));
      expect(A4.get(2,2)).to.equal(A1.get(3,2));
      expect(A5.get(2,1)).to.equal(A2.get(2,3));
      expect(A5.get(1,2)).to.equal(A2.get(2,2));
      expect(A6.get(2,1)).to.equal(A3.get(3,6));
      expect(A6.get(3,6)).to.equal(A3.get(2,1));
   });
   it('respect changes to the target matrix', function() {
      A1.mutable(true).set(3,4,99);
      expect(A4.get(2, 1)).to.equal(99);
      A2.mutable(true).set(2, 3, 99);
      expect(A5.get(2, 1)).to.equal(99);
      A3.mutable(true).set(2, 1,99);
      expect(A6.get(3, 6)).to.equal(99);
   });
   it('respects the mutable setting of the target', function() {

   });
   it('when set, affect the target values', function() {

   });
});