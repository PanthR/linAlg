var Matrix = require('../../linAlg/matrix');
var expect = require('chai').expect;

function random(i) { return Math.floor(Math.random() * i + 1); }

var A1 = new Matrix([4, 6, 7, 2, 1, 3, 5, 7.53, 9.95], { nrow : 3 });
var A2 = new Matrix({ 2: { 3: 8, 1: 2}, 1: { 1: 5 }}, { nrow : 3, ncol: 3 });
var A3 = new Matrix(function(i, j) { return i * j; }, { nrow: 3, ncol: 3 });
var v  = new Matrix.Vector([1.2, -1.1, 2.523]);

describe('rowBind', function() {
   var f1 = function() { return Matrix.rowBind(A1, v, A2, v, A3) };
   var f2 = function() { return Matrix.Vector.rowBind(v, A1, v, A2, A3) };
   var f3 = function() { return A1.rowBind(v, A2, v, A3) };
   var f4 = function() { return v.rowBind(A1, v, A2, A3) };
   it('exists as Matrix/Vector class and prototype method', function() {
      expect(Matrix).to.respondTo('rowBind');
      expect(Matrix.Vector).to.respondTo('rowBind');
      expect(Matrix).itself.to.respondTo('rowBind');
      expect(Matrix.Vector).itself.to.respondTo('rowBind');
      [f1, f2, f3, f4].forEach(function(f) {
         expect(f).to.not.throw(Error);
         expect(f()).to.be.instanceof(Matrix);
         expect(f().ncol).to.equal(3);
         expect(f().nrow).to.equal(11);
      });
   });
   it('has the correct values', function() {
      var res = f1();
      var res2 = f3();
      res.each(function(v, i, j) { expect(res2.get(i, j)).to.equal(v); });
      var c = 1;
      function test(row) { expect(res.rowView(c++).toArray()).to.deep.equal(row.toArray()); }
      A1.eachRow(test);
      test(v);
      A2.eachRow(test);
      test(v);
      A3.eachRow(test);
   });
});
describe('colBind', function() {
   var f1 = function() { return Matrix.colBind(A1, v, A2, v, A3) };
   var f2 = function() { return Matrix.Vector.colBind(v, A1, v, A2, A3) };
   var f3 = function() { return A1.colBind(v, A2, v, A3) };
   var f4 = function() { return v.colBind(A1, v, A2, A3) };
   it('exists as Matrix/Vector class and prototype method', function() {
      expect(Matrix).to.respondTo('colBind');
      expect(Matrix.Vector).to.respondTo('colBind');
      expect(Matrix).itself.to.respondTo('colBind');
      expect(Matrix.Vector).itself.to.respondTo('colBind');
      [f1, f2, f3, f4].forEach(function(f) {
         expect(f).to.not.throw(Error);
         expect(f()).to.be.instanceof(Matrix);
         expect(f().nrow).to.equal(3);
         expect(f().ncol).to.equal(11);
      });
   });
   it('has the correct values', function() {
      var res = f1();
      var res2 = f3();
      res.each(function(v, i, j) { expect(res2.get(i, j)).to.equal(v); });
      var c = 1;
      function test(col) { expect(res.colView(c++).toArray()).to.deep.equal(col.toArray()); }
      A1.eachCol(test);
      test(v);
      A2.eachCol(test);
      test(v);
      A3.eachCol(test);
   });
});