/// Everything is coming from
/// <https://bun.sh/docs/runtime/nodejs-apis>
///
/// That's where we get the compatibility tracking.

/**
 * > <https://github.com/oven-sh/bun/blob/6fd0043f6bf766cc488a88339059e8879fa07161/docs/runtime/nodejs-apis.md>
 * 
 * This is to know when that list was updated for the last time.
 * If there's new commits on that page since then, we can simply
 * check the history.
 * 
 * You can simply check and compare with the latest page version on
 * <https://github.com/oven-sh/bun/blob/main/docs/runtime/nodejs-apis.md>.
 */
const BUN_LAST_COMMIT_UPDATE = "6fd0043f6bf766cc488a88339059e8879fa07161";

/**
 * An object where we store the module name as a key
 * and another object as value.
 * 
 * That value can give either...
 * - only implemented functions/classes ;
 * - only not implemented functions/classes.
 * 
 * So, when there's only `implemented`, it means that every
 * other methods aren't implemented.
 * 
 * Same goes with only `not_implemented`, it means that every
 * other methods are implemented.
 */
const BUN_BUILT_IN_MODULES_NOT_IMPLEMENTED = {
  // Fully implemented.
  "node:assert": {
    not_implemented: []
  },

  "node:async_hooks": {
    implemented: ["AsyncLocalStorage", "AsyncResource"]
  },

  "node:child_process": {
    not_implemented: [
      // On `stdio` option, doesn't implement `Stream` yet.
      // "Stream",
      // These are in the `options` method from the `child_process` functions
      // `options` are the third parameters of those - except on `execSync` where it's the second parameter.
      // "options.gid", 
      // "options.uid"
    ]
  },

  // Not implemented.
  "node:cluster": {
    implemented: []
  },

  // Fully implemented.
  "node:console": {
    not_implemented: []
  },

  "node:crypto": [
    // https://nodejs.org/api/crypto.html#class-certificate
    "Certificate", 
    // https://nodejs.org/api/crypto.html#class-ecdh
    "ECDH",
    "createECDH",

    // https://nodejs.org/api/crypto.html#class-keyobject
    "KeyObject",

    // https://nodejs.org/api/crypto.html#class-x509certificate
    "X509Certificate",

    // https://nodejs.org/api/crypto.html#cryptocheckprimecandidate-options-callback
    "checkPrime",
    // https://nodejs.org/api/crypto.html#cryptocheckprimesynccandidate-options
    "checkPrimeSync",

    // https://nodejs.org/api/crypto.html#cryptocreateprivatekeykey
    "createPrivateKey",
    // https://nodejs.org/api/crypto.html#cryptocreatepublickeykey
    "createPublicKey",
    // https://nodejs.org/api/crypto.html#cryptocreatesecretkeykey-encoding
    "createSecretKey",

    // https://nodejs.org/api/crypto.html#cryptodiffiehellmanoptions
    "diffieHellman",

    // https://nodejs.org/api/crypto.html#cryptogeneratekeytype-options-callback
    "generateKey",
    // https://nodejs.org/api/crypto.html#cryptogeneratekeysynctype-options
    "generateKeySync",

    // https://nodejs.org/api/crypto.html#cryptogeneratekeypairtype-options-callback
    "generateKeyPair",
    // https://nodejs.org/api/crypto.html#cryptogeneratekeypairsynctype-options
    "generateKeyPairSync",

    // https://nodejs.org/api/crypto.html#cryptogenerateprimesize-options-callback
    "generatePrime",
    // https://nodejs.org/api/crypto.html#cryptogenerateprimesyncsize-options
    "generatePrimeSync",

    // https://nodejs.org/api/crypto.html#cryptogetcipherinfonameornid-options
    "getCipherInfo",

    // https://nodejs.org/api/crypto.html#cryptogetfips
    "getFips",
    // https://nodejs.org/api/crypto.html#cryptosetfipsbool
    "setFips",

    // https://nodejs.org/api/crypto.html#cryptohkdfdigest-ikm-salt-info-keylen-callback
    "hkdf",
    // https://nodejs.org/api/crypto.html#cryptohkdfsyncdigest-ikm-salt-info-keylen
    "hkdfSync",

    // https://nodejs.org/api/crypto.html#cryptosecureheapused
    "secureHeapUsed",

    // https://nodejs.org/api/crypto.html#cryptosetengineengine-flags
    "setEngine",
    
    // https://nodejs.org/api/crypto.html#cryptosignalgorithm-data-key-callback
    "sign",
    // https://nodejs.org/api/crypto.html#cryptoverifyalgorithm-data-key-signature-callback
    "verify"
  ],

  // Not implemented.
  "node:dgram": {
    implemented: []
  },

  // Fully implemented.
  "node:diagnostics_channel": {
    not_implemented: []
  },

  // Fully implemented.
  "node:dns": {
    not_implemented: []
  },

  // Fully implemented.
  "node:domain": {
    not_implemented: []
  },

  "node:events": {
    not_implemented: [
      // https://nodejs.org/api/events.html#eventsonemitter-eventname-options
      "on"
    ]
  },

  
}