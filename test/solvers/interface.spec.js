var Matrix = require('../../linAlg/matrix');
var utils = require('../../linAlg/utils');
var chai = require('chai');
var expect = chai.expect;
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);

describe('Matrix#solve', function() {
   it('exists', function() {
      expect(Matrix).to.respondTo('solve');
   });
   it('only calls getSolver once per matrix', function() {
      var A = new Matrix(Math.random, { nrow: 3, ncol: 3 });
      var spy = sinon.spy(A, 'getSolver');
      for (var i = 0; i < 5; i += 1) {
         A.solve(new Matrix.Vector(Math.random, 3));
      }
      expect(spy.called).to.be.true;
      expect(spy.calledOnce).to.be.true;
      expect(spy.returnValues[0]).to.be.instanceof(Matrix.Solver.PLUS);
      expect(new Matrix.SymmetricM(Math.random, 3).pAdd(Matrix.const(3, 3)).getSolver())
            .to.be.instanceof(Matrix.Solver.CholeskyS);
      expect(new Matrix(function(i, j) { return i > j ? 0 : 1 }, { nrow: 3, ncol: 3 })
            .getSolver()).to.be.instanceof(Matrix.Solver.UpperS);
   });
   it('solves Ax = b', function() {
      var A, L, U, b;
      for (var i = 0; i < 20; i += 1) {
         A = new Matrix(Math.random, { nrow: 3, ncol: 3 });
         L = A.lower().pAdd(Matrix.const(2, 3));
         U = A.upper().pAdd(Matrix.const(2, 3));
         b = new Matrix.Vector(Math.random, 3);
         [A, L, U].forEach(function(A) {
            expect(A.mult(A.solve(b)).equals(b, 0.000001)).to.be.true;
         });
      }
   });
});