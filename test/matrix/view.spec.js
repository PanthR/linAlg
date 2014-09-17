var Matrix = require('../../linAlg/matrix');
var chai = require('chai');
var expect = chai.expect;

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
      A4.mutable(true); A1.mutable(false);
      expect(A4.mutable()).to.be.false;
      expect(function() { A4.set(1, 1, 2); }).to.throw(Error);
      A1.mutable(true);
      expect(A4.mutable()).to.be.true;
      expect(function() { A4.set(1, 1, 2); }).to.not.throw(Error);
   });
   it('when set, affect the target values', function() {
      A4.mutable(true).set(2, 1, 100);
      expect(A1.get(3, 4)).to.equal(100);
      A5.mutable(true).set(2, 1, 100);
      expect(A2.get(2, 3)).to.equal(100);
      A6.mutable(true).set(3, 6, 100);
      expect(A3.get(2, 1)).to.equal(100);
   });
   it('work on diagonal targets', function() {
      var D = Matrix.diag([2, 5, 6, 10]);
      var V = D.view([1, 2], [2, 3, 4]);
      expect(V.get(1, 1)).to.equal(0);
      expect(V.get(2, 1)).to.equal(5);
      expect(V.get(2, 3)).to.equal(0);
      expect(V.toArray(true)[0]).to.deep.equal([0, 0, 0]);
      expect(V.toArray(true)[1]).to.deep.equal([5, 0, 0]);
      expect(V.mutable()).to.be.false;
      expect(function() { V.mutable(true); }).to.not.throw(Error);
      expect(D.mutable()).to.be.true;
      expect(function() { V.set(2, 1, 3); }).to.not.throw(Error);
      expect(D.get(2, 2)).to.equal(3);
      expect(function() { V.set(2, 2, 3); }).to.throw(Error);
   });
});
describe('Matrix to Vector:', function() {
   describe('rowView', function() {
      var A1 = new Matrix([4, 6, 7, 2, 1, 3, 8, 9, 12, 5, 33, 25], { nrow : 3 });
      var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
      var f  = function(i, j) { return i - j; }
      var A3 = new Matrix(f, { nrow : 4, ncol: 6 });
      var A4 = A1.view([1, 3],[4, 2]);
      var v1 = A1.rowView(2);
      var v2 = A2.rowView(2);
      var v3 = A3.rowView(3);
      var v4 = A4.rowView(2);
      it('returns a vector', function() {
         expect(A1).to.respondTo('rowView');
         expect(v1).to.be.instanceof(Matrix.Vector);
         expect(v1.length).to.equal(A1.ncol);
         expect(v4.length).to.equal(A4.ncol);
      });
      it('should error if out of bounds', function() {
         expect(function() { A1.rowView(0); }).to.throw(Error);
         expect(function() { A1.rowView(A1.nrow + 1); }).to.throw(Error);
      });
      it('with values from the correct row', function() {
         expect(v1.toArray()).to.deep.equal([6, 1, 9, 33]);
         expect(v2.toArray()).to.deep.equal([0, 0, 8, 2, 0, 0]);
         expect(v3.toArray()).to.deep.equal([2, 1, 0, -1, -2, -3]);
         expect(v4.toArray()).to.deep.equal([A1.get(3, 4), A1.get(3, 2)]);
      });
      it('setting values in Vector changes values in Matrix', function() {
         v1.mutable(true).set(3, 23);
         expect(A1.get(2, 3)).to.equal(23);
         v4.set(2, 24);
         expect(A4.get(2, 2)).to.equal(24);
         expect(A1.get(3, 2)).to.equal(24);
      });
      it('setting values in Matrix changes values in Vector', function() {
         A2.mutable(true).set(2, 3, 25);
         expect(v2.get(3)).to.equal(25);
         expect(v2.get(2)).to.equal(0);
         A2.set(1, 3, 26);
         expect(v2.get(3)).to.equal(25);
      });
   });
});
describe('colView', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3, 8, 9, 12, 5, 33, 25], { nrow : 3 });
   var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
   var f  = function(i, j) { return i - j; }
   var A3 = new Matrix(f, { nrow : 4, ncol: 6 });
   var A4 = A1.view([1, 3],[4, 2]);
   var v1 = A1.colView(2);
   var v2 = A2.colView(4);
   var v3 = A3.colView(3);
   var v4 = A4.colView(2);
   it('returns a vector', function() {
      expect(A1).to.respondTo('colView');
      expect(v1).to.be.instanceof(Matrix.Vector);
      expect(v1.length).to.equal(A1.nrow);
      expect(v4.length).to.equal(A4.nrow);
   });
   it('should error if out of bounds', function() {
      expect(function() { A1.colView(0); }).to.throw(Error);
      expect(function() { A1.colView(A1.ncol + 1); }).to.throw(Error);
   });
   it('with values from the correct column', function() {
      expect(v1.toArray()).to.deep.equal([2, 1, 3]);
      expect(v2.toArray()).to.deep.equal([0, 2, 0, 0]);
      expect(v3.toArray()).to.deep.equal([-2, -1, 0, 1]);
      expect(v4.toArray()).to.deep.equal([A1.get(1, 2), A1.get(3, 2)]);
   });
   it('setting values in Vector changes values in Matrix', function() {
      v1.mutable(true).set(3, 23);
      expect(A1.get(3, 2)).to.equal(23);
      v4.set(2, 24);
      expect(A4.get(2, 2)).to.equal(24);
      expect(A1.get(3, 2)).to.equal(24);
   });
   it('setting values in Matrix changes values in Vector', function() {
      A2.mutable(true).set(3, 4, 25);
      expect(v2.get(3)).to.equal(25);
      expect(v2.get(2)).to.equal(2);
      A2.set(3, 3, 26);
      expect(v2.get(3)).to.equal(25);
   });
});
describe('diagView', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3, 8, 9, 12, 5, 33, 25], { nrow : 3 });
   var f  = function(i, j) { return i - j; }
   var A2 = new Matrix(f, { nrow : 6, ncol: 4 });
   var indexArray = [
         [A1,],[A1, 0], [A1, 1], [A1, 2], [A1, 3], [A1, 4],
         [A1, -1], [A1, -2], [A1, -3], [A1, -4],
         [A2,],[A2, 0], [A2, 1], [A2, 2], [A2, 3], [A2, 4],
         [A2, -1], [A2, -2], [A2, -3], [A2, -4]];
   it('returns a vector, or errors if out of bounds', function() {
      expect(A1).to.respondTo('diagView');
      indexArray.forEach(function(pair) {
         var A = pair[0];
         var ind = pair[1];
         var v;
         function f() { v = A.diagView(ind); }
         if (ind >= A.ncol || -ind >= A.nrow) {
            expect(f).to.throw(Error);
         } else {
            expect(f).to.not.throw(Error);
            expect(v).to.be.instanceof(Matrix.Vector);
         }
      });
   });
   it('with values from the correct diagonal', function() {
      indexArray.forEach(function(pair) {
         var A = pair[0];
         var ind = pair[1] || 0;
         if (ind >= A.ncol || -ind >= A.nrow) {
            // nothing
         } else {
            var v = A.diagView(ind);
            var reachedEnd = false;
            A._get = function(i, j) {
               expect(j - i).to.equal(ind);
               expect(i >= 1 && i <= A.nrow).to.be.okay;
               expect(j).to.be.within(1, A.ncol);
               if (j === A.ncol || i === A.nrow) { reachedEnd = true; }
               return Math.min(i, j); // should be vector_i
            };
            for (var i = 1; i <= v.length; i += 1) {
               expect(v.get(i)).to.equal(i);
            }
            expect(reachedEnd).to.be.true;
         }
      });
   });
   it('setting values in Vector changes values in Matrix', function() {
      indexArray.forEach(function(pair) {
         var A = pair[0];
         var ind = pair[1] || 0;
         if (ind >= A.ncol || -ind >= A.nrow) {
            // nothing
         } else {
            var v = A.diagView(ind);
            expect(v.mutable()).to.be.false;
            expect(function() { v.set(1, 55)}).to.throw(Error);
            expect(function() { v.mutable(true); }).to.not.throw(Error);
            expect(A.mutable()).to.be.true;
            var reachedEnd = false;
            A._set = function(i, j, val) {
               expect(j - i).to.equal(ind);
               expect(i >= 1 && i <= A.nrow).to.be.okay;
               expect(j).to.be.within(1, A.ncol);
               if (j === A.ncol || i === A.nrow) { reachedEnd = true; }
               expect(val).to.equal(Math.min(i, j));
            };
            for (var i = 1; i <= v.length; i += 1) {
               v.set(i, i);
            }
            expect(reachedEnd).to.be.true;
            v.mutable(false);
         }
      });
   });
});
describe('Matrix#rows', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3, 8, 9, 12, 5, 33, 25], { nrow : 3 });
   var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
   var f  = function(i, j) { return i - j; }
   var A3 = new Matrix(f, { nrow : 4, ncol: 6 });
   var A4 = A1.view([1, 3],[4, 2]);
   var A5 = A2.view(function a(i) { return 2;}, [3, 2], { nrow : 2}); // [[8,0],[8,0]]
   var A6 = A3.view(function a(i) { return 5 - i; }, 
      function b(j) { return 7 - j}, { nrow : 4, ncol: 6 });
   it('exists and returns an array of rowViews', function() {
      expect(Matrix).to.respondTo('rows');
      [A1, A2, A3, A4, A5, A6].forEach(function(m) {
         expect(function() { m.rows(); }).to.not.throw(Error);
         expect(m.rows().length).to.equal(m.nrow);
         expect(m.rows()[0]).to.be.instanceof(Matrix.Vector);
         expect(m.rows()[0].length).to.equal(m.ncol);
      });
   });
   it('has the correct values', function() {
      [A1, A2, A3, A4, A5, A6].forEach(function(m) {
         var rows = m.rows();
         for (var i = 1; i <= m.nrow; i += 1) {
            for (var j = 1; j <= m.ncol; j += 1) {
               expect(rows[i - 1].get(j)).to.equal(m.get(i, j));
            }
         }
      });
   });
});
describe('Matrix#cols', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3, 8, 9, 12, 5, 33, 25], { nrow : 3 });
   var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
   var f  = function(i, j) { return i - j; }
   var A3 = new Matrix(f, { nrow : 4, ncol: 6 });
   var A4 = A1.view([1, 3],[4, 2]);
   var A5 = A2.view(function a(i) { return 2;}, [3, 2], { nrow : 2}); // [[8,0],[8,0]]
   var A6 = A3.view(function a(i) { return 5 - i; }, 
      function b(j) { return 7 - j}, { nrow : 4, ncol: 6 });
   it('exists and returns an array of colViews', function() {
      expect(Matrix).to.respondTo('cols');
      [A1, A2, A3, A4, A5, A6].forEach(function(m) {
         expect(function() { m.cols(); }).to.not.throw(Error);
         expect(m.cols().length).to.equal(m.ncol);
         expect(m.cols()[0]).to.be.instanceof(Matrix.Vector);
         expect(m.cols()[0].length).to.equal(m.nrow);
      });
   });
   it('has the correct values', function() {
      [A1, A2, A3, A4, A5, A6].forEach(function(m) {
         var cols = m.cols();
         for (var i = 1; i <= m.nrow; i += 1) {
            for (var j = 1; j <= m.ncol; j += 1) {
               expect(cols[j - 1].get(i)).to.equal(m.get(i, j));
            }
         }
      });
   });
});