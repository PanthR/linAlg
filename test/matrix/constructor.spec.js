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

describe('Matrix#toArray', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3], { nrow : 2 });
   var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
   var A3 = new Matrix(function(i, j) { return i * j; }, { nrow: 4, ncol: 6 });
   var A4 = A3.view([3, 4], [1, 3]);
   it('is aliased by Matrix#get (with 0 or 1 args)', function() {
      expect(A1.get()).to.be.instanceof(Array);
      expect(A1.get().length).to.equal(A1.ncol);
      expect(A2.get(true)).to.be.instanceof(Array);
      expect(A2.get(true).length).to.equal(A2.nrow);
   })
   it('works when byRow is true', function() {
      expect(A1).to.respondTo('toArray');
      function testArray(m) {
         var a = m.toArray(true);
         expect(a.length).to.equal(m.nrow);
         for(var i = 1; i <= m.nrow; i += 1) {
            expect(a[i - 1]).to.deep.equal(m.rowView(i).toArray());
         }
      }
      [A1, A2, A3, A4].forEach(testArray);
   });
   it('works when byRow is false or undefined', function() {
      expect(A1).to.respondTo('toArray');
      function testArray(m) {
         var a = m.toArray();
         expect(a.length).to.equal(m.ncol);
         for(var i = 1; i <= m.ncol; i += 1) {
            expect(a[i - 1]).to.deep.equal(m.colView(i).toArray());
         }
      }
      [A1, A2, A3, A4].forEach(testArray);
   });
});

describe('Matrix#toVector', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3], { nrow : 2 });
   var A2 = new Matrix([4, 6, 7, 2, 1, 3], { nrow : 2, byRow: true });
   var A3 = new Matrix(function(i, j) { return i * j; }, { nrow: 4, ncol: 6 });
   var A4 = A3.view([3, 4], [1, 3]); // Rows: [[3, 9], [4, 12]]
   var v1, v1b, v2, v2b, v3, v3b, v4, v4b;
   it('should exist', function() {
      expect(A1).to.respondTo('toVector');
      v1 = A1.toVector();
      v1b = A1.toVector(true);
      v2 = A2.toVector();
      v2b = A2.toVector(true);
      v3 = A3.toVector();
      v3b = A3.toVector(true);
      v4 = A4.toVector();
      v4b = A4.toVector(true);
   });
   it('should return a vector', function() {
      [v1, v1b, v2, v2b, v3, v3b, v4, v4b].forEach(function(v) {
         expect(v).to.be.instanceof(Matrix.Vector);
      });
   });
   it('returns a vector with the correct values', function() {
      expect(v1.toArray()).to.deep.equal([4, 6, 7, 2, 1, 3]);
      expect(v1b.toArray()).to.deep.equal([4, 7, 1, 6, 2, 3]);
      expect(v2.toArray()).to.deep.equal([4, 2, 6, 1, 7, 3]);
      expect(v2b.toArray()).to.deep.equal([4, 6, 7, 2, 1, 3]);
      expect(v4.toArray()).to.deep.equal([3, 4, 9, 12]);
      expect(v4b.toArray()).to.deep.equal([3, 9, 4, 12]);
   });
   // it('returns a vector independent of the matrix', function() {
   //    function test(A, v) {
   //       v.mutable(true).set(1, 20);
   //       expect(v.get(1)).to.equal(20);
   //       expect(A.get(1, 1)).to.not.equal(20);
   //       expect(A.mutable()).to.be.false;
   //       A.mutable(true).set(1, 1, 21);
   //       expect(v.get(1)).to.equal(20);
   //       A.mutable(false);
   //       expect(v.mutable()).to.be.true;
   //    }
   //    [[A1, v1], [A1, v1b], [A2, v2], [A2, v2b]].forEach(test);
   // });
});