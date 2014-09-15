var Matrix = require('../../linAlg/matrix');
var CDiagM = Matrix.StructuredM.CDiagM;
var expect = require('chai').expect;

describe('Constant-Diagonal matrices', function() {
   var d1, d2, d3, diags;
   var vals = [5.2, 5.4, 5.5];
   it('are created by providing value and dimension', function() {
      expect(CDiagM).to.exist;
      expect(Matrix).itself.to.respondTo('const');
      expect(function() { d1 = Matrix.const(5.2, 4); }).to.not.throw(Error);
      expect(function() { d2 = Matrix.const(5.4, { nrow: 4 }); }).to.not.throw(Error);
      expect(function() { d3 = Matrix.const(5.5, d1); }).to.not.throw(Error);
      diags = [d1, d2, d3];
      diags.forEach(function(d) {
         expect(d).to.be.instanceof(CDiagM);
      });
   });
   it('have correct dimensions', function() {
      diags.forEach(function(d) {
         expect(d.nrow).to.equal(d.ncol);
         expect(d.nrow).to.equal(4);
      });
   });
   it('have correct get and cannot become mutable', function() {
      diags.forEach(function(d, ind) {
         for (var i = 1; i <= 4; i += 1) {
            for (var j = 1; j <= 4; j += 1) {
               expect(d.get(i, j)).to.equal(i === j ? vals[ind] : 0);
            }
         }
         expect(d.get(d.nrow + 2, d.nrow + 2)).to.equal(0);
         expect(d.get(0, 0)).to.equal(0);
         expect(d.mutable()).to.be.false;
         expect(function() { d.mutable(true); }).to.throw(Error);
         expect(function() { d.set(1, 1, 3); }).to.throw(Error);
      });
   });
   it('have correct each', function() {
      diags.forEach(function(d, ind) {
         var c = 0;
         d.each(function(v, i, j) {
            c += 1;
            expect(i).to.equal(j);
            expect(v).to.equal(vals[ind]);
         });
         expect(c).to.equal(d.nrow);
         // eachRow, eachCol
         d.eachRow(function(row, i) {
            expect(row).to.be.instanceof(Matrix.Vector);
            expect(row.get(i)).to.equal(vals[ind]);
            for (var j = 1; j <= d.ncol; j += 1) {
               if (j !== i) { expect(row.get(j)).to.equal(0); }
            }
         });
         d.eachCol(function(col, j) {
            expect(col).to.be.instanceof(Matrix.Vector);
            expect(col.get(j)).to.equal(vals[ind]);
            for (var i = 1; i <= d.nrow; i += 1) {
               if (i !== j) { expect(col.get(i)).to.equal(0); }
            }
         });
      });
   });
   it('have correct map which preserves structure', function() {
      diags.forEach(function (d, ind) {
         var c = 0;
         function f2(v, i, j) { 
            c += 1;
            expect(v).to.equal(d.get(i,j));
            expect(i).to.equal(j);
            return v + i * j;
         }
         var m = d.map(f2);  // DiagM
         expect(m).to.be.instanceof(Matrix.StructuredM.DiagM);
         expect(Matrix.sameDims(m, d)).to.be.true;
         for (var i = 1; i <= d.nrow; i += 1) {
            expect(m.get(i, i)).to.equal(vals[ind] + i * i);
         }
         expect(c).to.equal(d.nrow);
      });
   });
});