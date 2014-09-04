var Matrix = require('../../linAlg/matrix');
var expect = require('chai').expect;

describe('Matrix constructor', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3], { nrow : 2 });
   var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
   var A3 = new Matrix(function(i, j) { return i * j; }, { nrow: 4, ncol: 6 });
   var A4 = A3.view([3, 4], [1, 3]);
   it('if called with a matrix arg, returns that matrix', function() {
      [A1, A2, A3, A4].forEach(function(m) { 
         expect(new Matrix(m)).to.equal(m);
      });
   });
});