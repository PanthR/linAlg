var Matrix = require('../../linAlg/matrix');
var TabularM = Matrix.TabularM;
var expect = require('chai').expect;

describe('Tabular matrices', function() {
   var f = function(i, j) { return i - j; }
   var A1 = new TabularM(f, { nrow : 4, ncol: 6 });
   it('have a constructor Matrix.TabularM and are Matrix\'s', function() {
      expect(TabularM).to.exist;
      expect(A1).to.be.instanceof(TabularM);
      expect(A1).to.be.instanceof(Matrix);
   });
   it('are formed when the Matrix constructor is fed a function', function() {
      expect(new Matrix(f, { nrow : 4, ncol: 6 })).to.be.instanceof(TabularM);
   });
   it('have properly set dimensions', function() {
      expect(A1.nrow).to.equal(4);
      expect(A1.ncol).to.equal(6);
   });
   it('are 1-indexed and read by column by default', function() {
      expect(A1.get(2, 3)).to.equal(2 - 3);
      expect(A1.get(4, 1)).to.equal(4 - 1);
      expect(A1.get(1, 1)).to.equal(1 - 1);
   });
   it('return 0 for out-of-bounds indices', function() {
      expect(A1.get(1, 0)).to.equal(0);
      expect(A1.get(0, 2)).to.equal(0);
      expect(A1.get(1, 7)).to.equal(0);
      expect(A1.get(5, 1)).to.equal(0);
   });
})