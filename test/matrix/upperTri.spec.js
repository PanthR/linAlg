var Matrix = require('../../linAlg/matrix');
var UpperTriM = Matrix.StructuredM.UpperTriM;
var chai = require('chai');
var expect = chai.expect;

describe('Upper triangular matrices', function() {
   var t1, t2, t3, triangs;
   var f1 = function(i, j) { return i / j; };
   var f2 = function(i, j) { return 2; };
   var a = new Matrix(Math.random, { nrow: 4, ncol: 5});
   var f3 = a.get.bind(a);
   it('can be constructed in 3 different ways', function() {
      expect(UpperTriM).to.be.defined;
      expect(function() {
         t1 = new UpperTriM(f1, 4);
      }).to.not.throw(Error);
      expect(function() { t2 = new UpperTriM(2, 4); }).to.not.throw(Error);
      expect(function() { t3 = new UpperTriM(a); }).to.not.throw(Error);
      triangs = [t1, t2, t3];
      triangs.forEach(function(t) {
         expect(t).to.be.instanceof(UpperTriM);
         expect(t).to.be.instanceof(Matrix);
         expect(t.nrow).to.equal(4);
         expect(t.ncol).to.equal(4);
      });
   });
   it('have the correct values', function() {
      var i, j;
      expect(t1).to.respondTo('get');
      for (i = 1; i <= 4; i += 1) {
         for (j = 1; j <= 4; j += 1) {
            expect([i, j, t1.get(i, j)]).to.deep.equal([i, j, i > j ? 0 : i / j]);
            expect(t2.get(i, j)).to.equal(i > j ? 0 : 2);
            expect(t3.get(i, j)).to.equal(i > j ? 0 : a.get(i, j));
         }
      }
   });
   it('have correct each', function() {
      function testPair(pair) {
         var c = 0;
         var m = pair[0];
         var f = function(i, j) { return i > j ? 0 :pair[1](i, j); };
         m.each(function(v, i, j) {
            c += 1;
            expect(i).to.be.at.most(j);
            expect(v).to.equal(f(i, j));
         });
         expect(c).to.equal(m.nrow * (m.nrow + 1) / 2);
         // eachRow, eachCol
         m.eachRow(function(row, i) {
            expect(row).to.be.instanceof(Matrix.Vector);
            for (var j = 1; j <= m.ncol; j += 1) {
               expect(row.get(j)).to.equal(f(i, j));
            }
         });
         m.eachCol(function(col, j) {
            expect(col).to.be.instanceof(Matrix.Vector);
            for (var i = 1; i <= m.nrow; i += 1) {
               expect(col.get(i)).to.equal(f(i, j));
            }
         });
      }
      [[t1, f1], [t2, f2], [t3, f3]].forEach(testPair);
   });
   it('have correct map which preserves structure', function() {
      function testPair(pair) {
         var c = 0;
         var m = pair[0];
         var f = function(i, j) { return i > j ? 0 : pair[1](i, j); };
         var m2 = m.map(function(v, i, j) {
            c += 1;
            expect(i).to.be.at.most(j);
            expect(v).to.equal(f(i, j));
            return v + i * j;
         });
         expect(m2).to.be.instanceof(UpperTriM);
         expect(m2.sameDims(m)).to.be.true;
         for (var i = 1; i <= m.nrow; i += 1) {
            for (var j = i; j <= m.nrow; j += 1) {
               expect(m2.get(i, j)).to.equal(m.get(i, j) + i * j);
            }
         }
         expect(c).to.equal(m.nrow * (m.nrow + 1) / 2);
      }
      [[t1, f1], [t2, f2], [t3, f3]].forEach(testPair);
   });
});