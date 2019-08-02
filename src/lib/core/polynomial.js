import Buffer from '../utils/buffer';
import * as GF from './galois-field';

/**
 * Multiplies two polynomials inside Galois Field
 *
 * @param  {Buffer} p1 Polynomial
 * @param  {Buffer} p2 Polynomial
 * @return {Buffer}    Product of p1 and p2
 */
export function mul(p1, p2) {
  const coeff = new Buffer(p1.length + p2.length - 1);
  coeff.fill(0);

  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      coeff[i + j] ^= GF.mul(p1[i], p2[j]);
    }
  }

  return coeff;
}

/**
 * Calculate the remainder of polynomials division
 *
 * @param  {Buffer} divident Polynomial
 * @param  {Buffer} divisor  Polynomial
 * @return {Buffer}          Remainder
 */
export function mod(divident, divisor) {
  let result = new Buffer(divident);

  while ((result.length - divisor.length) >= 0) {
    const coeff = result[0];

    for (let i = 0; i < divisor.length; i++) {
      result[i] ^= GF.mul(divisor[i], coeff);
    }

    // remove all zeros from buffer head
    let offset = 0;
    while (offset < result.length && result[offset] === 0) offset++;
    result = result.slice(offset);
  }

  return result;
}

/**
 * Generate an irreducible generator polynomial of specified degree
 * (used by Reed-Solomon encoder)
 *
 * @param  {Number} degree Degree of the generator polynomial
 * @return {Buffer}        Buffer containing polynomial coefficients
 */
export function generateECPolynomial(degree) {
  let poly = new Buffer([1]);
  for (let i = 0; i < degree; i++) {
    poly = mul(poly, [1, GF.exp(i)]);
  }

  return poly;
}
