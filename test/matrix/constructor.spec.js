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