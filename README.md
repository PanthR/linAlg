linAlg.js
=========

A linear algebra library.

Linear algebra methods with effort towards efficiency and stability for medium/large-scale vectors and matrices.

`linAlg` is a project attempting to implement standard linear algebra methods for medium/large-scale vectors and matrices. 
The effort is on making operations easy to use and reasonably efficient for large vectors and matrices. No effort has been made to make the operations fast for a large number of small vectors or matrices.

The `linAlg` module is currently available as a node module, or via AMD. It offers access to two classes, `Vector` and `Matrix`.

Vector
------

Fixed length vectors and operations on them. Vectors are always treated as 1-indexed, so even if the vector has come from a regular Javascript array, that array's first element would be accessed via the vector at the 1 index.

The visible constructor `Vector` accepts the vector data in one of three forms:

- As a Javascript array of values. For instance `new Vector([3, 5, 6])`.
- As a Javascript object of the non-zero indices and their values. _A second argument indicating the desired vector length must be included_. For instance `new Vector({ 2: 5, 10: 3}, 20)` creates a length 20 vector with 2 non-zero values at indices 2 and 10.
- As a Javascript function, which when evaluated at an index will return the value of the vector at that index. _A second argument indicating the desired vector length must be included_. For instance `new Vector(function(x) { return x*x; }, 5)` will create the vector `[1, 4, 9, 16, 25]`.

Matrix
------
