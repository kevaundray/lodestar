 //BLS JS
 //Copyright (C) 2018 ChainSafe Systems

  // This program is free software: you can redistribute it and/or modify
 // it under the terms of the GNU General Public License as published by
 // the Free Software Foundation, either version 3 of the License, or
 // (at your option) any later version.
 //
 // This program is distributed in the hope that it will be useful,
 // but WITHOUT ANY WARRANTY; without even the implied warranty of
 // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 // GNU General Public License for more details.
 //
 // You should have received a copy of the GNU General Public License
 // along with this program.  If not, see <http://www.gnu.org/licenses/>.

const CTX = require("../milagro-crypto-js")
const ctx = new CTX("BLS381")
const rand = require("csprng")
const rng = new ctx.RAND()
const { SHA3 } = require("sha3")
const hash = new SHA3(256)

const get_rand = (bytes) => {
    return rand(bytes*8, 16) // rand accepts bits and radix
}

// generate EC key pair (P, k) using pwd and salt
const gen_key_pair = (pwd, salt) => {
    let k = []
    let P = []

    k = ctx.ECDH.PBKDF2(ctx.ECP.HASH_TYPE, pwd, salt, get_rand(), ctx.ECP.AESKEY)

    ctx.ECDH.KEY_PAIR_GENERATE(null, k, P)

    return {k, P}
}

// multiply point P by scalar k
// Z = P*k
// return curve point
const scalar_mult = (P, k) => {
    Z = []
    ctx.ECDH.ECPSVDP_DH(P, k, Z)
    return Z
}


// perform Z = k*G1
// return curve point
const scalar_base_mult = (k) => {
    G = ctx.ECP.generator()
    return scalar_mult(G, k)
}

// add P1, P2, return the result which is another curve point
const add = (P1, P2) => {
    P1.add(P2)
    return P1
}

// performs sha3(m) and returns a binary-encoded buffer
const hash_string = (m) => {
    hash.update(m)
    return hash.digest()
}

// perform H(m) = sha3(m)*G
// not sure if this is the correct method to hash to curve
// returns a point on the curve
const hash_to_curve = (m) => {
    return scalar_base_mult(hash_string(m))
}

// perform S = k*H(m) where S is the signature and H(m) is the hash of the message to
// the curve
// return S, a curve point
const bls_sign = (k, m) => {
    return scalar_mult(hash_to_curve(m), k)
}

// perform e(P, H(m)) == e(G, S) where P is our public key, m is our message, S is
// our signature, and G is the generator point
const bls_verify = (S, P, m) => {

}

// perform S = S_1 + ... + S_n where n is the number of signatures to aggregate
// return (S, P_1 ... P_n, m_1 ... m_n)
const bls_aggregate = (S_arr, P_arr, m_arr) => {

}


module.exports = {get_rand, gen_key_pair, scalar_mult, scalar_base_mult, add, hash_string, hash_to_curve}
