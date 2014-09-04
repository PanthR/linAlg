var Matrix = require('../../linAlg/matrix');
var chai = require('chai');
var expect = chai.expect;

describe('Matrix iterators', function() {
   var A1 = new Matrix([4, 6, 7, 2, 1, 3], { nrow : 2 });
   var A2 = new Matrix({ 2: { 3: 8, 4: 2}, 4: { 1: 5 }}, { nrow : 4, ncol: 6 });
   var A3 = new Matrix(function(i, j) { return i * j; }, { nrow: 4, ncol: 6 });
   var A4 = A3.view([3, 4], [1, 3]);
   describe('forEach', function() {
      var sorter = function(a, b) { 
         if (a[1] < b[1]) return -1;
         if (a[1] > b[1]) return 1;
         if (a[2] < b[2]) return -1;
         if (a[2] > b[2]) return 1;
         return -1;
      };
      it('exists', function() {
         expect(A1).to.respondTo('forEach');
         expect(A2).to.respondTo('forEach');
         expect(A3).to.respondTo('forEach');
         expect(A4).to.respondTo('forEach');
      });
      it('passes the correct arguments to f', function() {
         var f = function(val, i, j) { a.push([val, i, j]); };
         var a; // accumulator
         function testArray(m) {
            a = [];
            m.forEach(f);
            expect(a.length).to.equal(m.nrow * m.ncol); // if not skipZeros
            a.sort(sorter);
            var c = 0;
            for(var i = 1; i <= m.nrow; i += 1) {
               for(var j = 1; j <= m.ncol; j += 1) {
                  expect(a[c]).to.deep.equal([m.get(i, j), i, j]);
                  c += 1;
               }
            }
         }
         [A1, A2, A3, A4].forEach(testArray);
      });
      it('can be called with skipZeros set to true', function() {
         var f = function(val, i, j) { a.push([val, i, j]); };
         var a; // accumulator
         a = [];
         A2.forEach(f, true);
         expect(a.length).to.equal(3);
         a.sort(sorter);
         expect(a[0]).to.deep.equal([8, 2, 3]);
         expect(a[1]).to.deep.equal([2, 2, 4]);
         expect(a[2]).to.deep.equal([5, 4, 1]);
      });
   });
});