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
   it('also gives us an inverse of the appropriate structure', function() {
      var A, L, U, D, I, b, CD, P;
      I = Matrix.const(1, 3);
      for (var i = 0; i < 20; i += 1) {
         A = new Matrix(Math.random, { nrow: 3, ncol: 3 });
         L = A.lower().pAdd(Matrix.const(2, 3));
         U = A.upper().pAdd(Matrix.const(2, 3));
         D = Matrix.diag(A.diagView());
         CD = Matrix.const(3, 3);
         P = new Matrix.PermM([1, 3, 2], 3);
         expect(A.mult(A.inverse()).equals(I, 0.000001)).to.be.true;
         expect(L.inverse().isA(Matrix.LowerTriM)).to.be.true;
         expect(L.mult(L.inverse()).equals(I, 0.000001)).to.be.true;
         expect(U.inverse().isA(Matrix.UpperTriM)).to.be.true;
         expect(U.mult(U.inverse()).equals(I, 0.000001)).to.be.true;
         expect(D.inverse().isA(Matrix.DiagM)).to.be.true;
         expect(D.mult(D.inverse()).equals(I, 0.000001)).to.be.true;
         expect(CD.inverse().isA(Matrix.CDiagM)).to.be.true;
         expect(CD.inverse().mult(CD).equals(I, 0.000001)).to.be.true;
         expect(new Matrix.SymmetricM(A).inverse().isA(Matrix.SymmetricM)).to.be.true;
         expect(P.inverse().isA(Matrix.PermM)).to.be.true;
         expect(P.inverse().mult(P).equals(I, 0.000001)).to.be.true;
      }
   });
});