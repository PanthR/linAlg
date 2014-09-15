var Matrix = require('../../linAlg/matrix');
var DiagM = Matrix.StructuredM.DiagM;
var expect = require('chai').expect;

describe('Diagonal matrices', function() {
   var a1 = [4, 2, 5, 6];
   var v1 = new Matrix.Vector([4, 2, 5, 6]);
   var v3 = new Matrix.Vector(function(i) { return i * i; }, 5);
   var d1, d2, d3, diags;
   it('are created by providing diagonal as a vector or array', function() {
      expect(Matrix).itself.to.respondTo('diag');
      expect(function() { d1 = Matrix.diag(a1); }).to.not.throw(Error);
      expect(function() { d2 = Matrix.diag(v1); }).to.not.throw(Error);
      expect(function() { d3 = Matrix.diag(v3); }).to.not.throw(Error);
      diags = [d1, d2, d3];
      diags.forEach(function(d) {
         expect(d).to.be.instanceof(DiagM);
      })
   });
   it('have correct dimensions', function() {
      diags.forEach(function(d) {
         expect(d.nrow).to.equal(d.ncol);
      });
      expect(d1.nrow).to.equal(a1.length);
      expect(d2.nrow).to.equal(v1.length);
      expect(d3.nrow).to.equal(v3.length);
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
      expect(d3.mutable()).to.be.false;
      expect(function() { d3.mutable(true); }).to.not.throw(Error);
      for (var i = 1; i <= 5; i += 1) {
         expect(d3.get(i, i)).to.equal(i * i);
         var r = Math.random();
         expect(function() { d3.set(i, i, r); }).to.not.throw(Error);
         expect(d3.get(i, i)).to.equal(r);
      }
   });
   it('have correct each', function() {
      var a1 = [4, 2, 5, 6];
      var v1 = new Matrix.Vector([4, 2, 5, 6]);
      d1 = Matrix.diag(a1);
      d2 = Matrix.diag(v1);
      // each with skipZeros == true ---> visit diagonal
      var c = 0;
      d1.each(function(v, i, j) {
         c += 1;
         expect(i).to.equal(j);
         expect(v).to.equal(a1[i - 1]);
      });
      expect(c).to.equal(d1.nrow);
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
   it('have correct map which preserves structure', function() {
      function f2(v, i, j) { 
         expect(v).to.equal(d1.get(i,j));
         expect(i).to.equal(j);
         return v + i * j;
      }
      var d3 = d1.map(f2);  // DiagM
      expect(d3).to.be.instanceof(DiagM);
      expect(Matrix.sameDims(d3, d1)).to.be.true;
      for (var i = 1; i <= d3.nrow; i += 1) {
         expect(d3.get(i, i)).to.equal(d1.get(i, i) + i * i);
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