var Matrix = require('../../linAlg/matrix');
var DiagM = Matrix.DiagM;
var expect = require('chai').expect;

console.log("!!!!!!     TODO: REENABLE DIAGM SPEC    !!!!!!");
return;
describe('Diagonal matrices', function() {
   var a1 = [4, 2, 5, 6];
   var v1 = new Matrix.Vector([4, 2, 5, 6]);
   var d1, d2;
   it('are created by providing diagonal as a vector or array', function() {
      expect(Matrix).itself.to.respondTo('diag');
      expect(function() { d1 = Matrix.diag(a1); }).to.not.throw(Error);
      expect(function() { d2 = Matrix.diag(v1); }).to.not.throw(Error);
      expect(d1).to.be.instanceof(DiagM);
      expect(d2).to.be.instanceof(DiagM);
   });
   it('have correct dimensions', function() {
      expect(d1.nrow).to.equal(a1.length);
      expect(d1.ncol).to.equal(a1.length);
      expect(d2.nrow).to.equal(v1.length);
      expect(d2.ncol).to.equal(v1.length);
   });
   it('have correct get/set/mutable', function() {
      for (var i = 1; i <= a1.length; i += 1) {
         expect(d1.get(i, i)).to.equal(a1[i - 1]);
         expect(d2.get(i, i)).to.equal(v1.get(i));
         for (var j = 1; j <= a1.length; j += 1) {
            if (j !== i) {
               expect(d1.get(i, j)).to.equal(0);
               expect(d2.get(i, j)).to.equal(0);
            }
         }
      }
      expect(d1.mutable()).to.be.false;
      expect(d2.mutable()).to.equal(v1.mutable());
      expect(function() { d1.mutable(true); }).to.not.throw(Error);
      expect(function() { d2.mutable(true); }).to.not.throw(Error);
      expect(function() { d1.set(1, 2, 3); }).to.throw(Error);
      expect(function() { d1.set(5, 5, 3); }).to.throw(Error);
      expect(function() { d1.set(0, 0, 3); }).to.throw(Error);
      expect(function() { d1.set(1, 1, 3); }).to.not.throw(Error);
      expect(d1.get(1,1)).to.equal(3);
      expect(function() { d2.set(3, 4, 3); }).to.throw(Error);
      expect(function() { d2.set(2, 2, 3); }).to.not.throw(Error);
      expect(d2.get(2,2)).to.equal(3);
   });
   it('have correct each', function() {
      var a1 = [4, 2, 5, 6];
      var v1 = new Matrix.Vector([4, 2, 5, 6]);
      d1 = Matrix.diag(a1);
      d2 = Matrix.diag(v1);
      // each with skipZeros == true ---> visit diagonal
      d1.each(function(v, i, j) {
         expect(i).to.equal(j);
         expect(v).to.equal(a1[i - 1]);
      }, true);
      var c = 0;
      // each with skipZeros == false
      d1.each(function(v, i, j) {
         c += 1;
         if (i !== j) { expect(v).to.equal(0); }
      });
      expect(c).to.equal(d1.nrow * d1.ncol);
      // eachRow, eachCol
      d1.eachRow(function(row, i) {
         expect(row).to.be.instanceof(Matrix.Vector);
         expect(row.get(i)).to.equal(a1[i - 1]);
         for (var j = 1; j <= a1.length; j += 1) {
            if (j !== i) { expect(row.get(j)).to.equal(0); }
         }
      });
      d2.eachCol(function(col, j) {
         expect(col).to.be.instanceof(Matrix.Vector);
         expect(col.get(j)).to.equal(v1.get(j));
         for (var i = 1; i <= v1.length; i += 1) {
            if (i !== j) { expect(col.get(i)).to.equal(0); }
         }
      });
   });
   it('have correct map', function() {
      var d3 = d1.map(function(v, i, j) { return v + i * j; }, true);  // DiagM
      var d4 = d1.map(function(v, i, j) { return v + i * j; });  // Dense
      expect(d3).to.be.instanceof(DiagM);
      expect(d4).to.not.be.instanceof(DiagM);
      expect(d4).to.be.instanceof(DenseM);
      expect(d3.sameDims(d1)).to.be.true;
      expect(d4.sameDims(d2)).to.be.true;
      for (var i = 1; i <= d3.nrow; i += 1) {
         expect(d3.get(i, i)).to.equal(d1.get(i, i) + i * i);
      }
      for (var i = 1; i <= d4.nrow; i += 1) {
         for (var j = 1; j <= d4.ncol; j += 1) {
            expect(d4.get(i, j)).to.equal(d2.get(i, j) + i * j);
         }
      }
   });
   it('can use rowView/colView to get/set, but only the diagonal element', function() {
      d1.mutable(true);
      // TODO: Add get tests
      for (var i = 1; i <= d1.nrow; i += 1) {
         expect(function() { d1.rowView(i).set(i, 10); }).to.not.throw(Error);
         expect(d1.get(i, i)).to.equal(10);
         for (var j = 1; j <= d1.ncol; j += 1) {
            if (j !== i) {
               expect(function() { d1.rowView(i).set(j, 10); }).to.throw(Error);
            }
         }
      }
   });
});