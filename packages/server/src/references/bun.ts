/// Everything is coming from
/// <https://bun.sh/docs/runtime/nodejs-apis>
///
/// That's where we get the compatibility tracking.

/**
 * > <https://github.com/oven-sh/bun/blob/3a45f2c71bb17fbad0168fa76b32ae0c8ee67935/docs/runtime/nodejs-apis.md>
 * 
 * This is to know when that list was updated for the last time.
 * If there's new commits on that page since then, we can simply
 * check the history.
 * 
 * You can simply check and compare with the latest page version on
 * <https://github.com/oven-sh/bun/blob/main/docs/runtime/nodejs-apis.md>.
 */
export const BUN_LAST_COMMIT_UPDATE = "3a45f2c71bb17fbad0168fa76b32ae0c8ee67935";

type ModulesNote = (
  /** These methods are implemented but everything else is not implemented. */
  | { not_implemented?: never, implemented: string[] }
  /** These methods are not implemented but everything else is implemented. */
  | { not_implemented: string[], implemented?: never }
)

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
export const BUN_BUILT_IN_MODULES_NOTES = {
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

  "node:crypto": {
    not_implemented: [
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
    ]
  },

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

  "node:fs": {
    not_implemented: [
      "fdatasync",
      "fdatasyncSync",

      "opendir",
      "opendirSync",

      "watchFile",
      "unwatchFile",

      "cp",
      "cpSync"

      // TODO: promises.open returns file descriptor instead of `FileHandle`
    ]
  },

  // Fully implemented.
  "node:http": {
    not_implemented: []
  },

  // Not implemented.
  "node:http2": {
    implemented: []
  },

  // Fully implemented.
  "node:https": {
    not_implemented: []
  },

  // Not implemented.
  "node:inspector": {
    implemented: []
  },

  // Fully implemented.
  "node:module": {
    not_implemented: []
  },

  "node:net": {
    not_implemented: [
      "getDefaultAutoSelectFamily",
      "setDefaultAutoSelectFamily",

      "SocketAddress",
      "BlockList"
    ]
  },

  // Fully implemented.
  "node:os": {
    not_implemented: []
  },
  
  // Fully implemented.
  "node:path": {
    not_implemented: []
  },

  // TODO: Recommend to use `performance` global instead of `perf_hooks.performance`.
  "node:perf_hooks": {
    implemented: [
      "performance.now",
      "performance.timeOrigin"
    ]
  },

  // NOTE: Not sure, we'll leave it as fully implemented for now.
  "node:process": {
    not_implemented: []
  },

  // Fully implemented.
  // TODO: Add a warning though that it is deprecated by Node.js
  "node:punycode": {
    not_implemented: []
  },

  // Fully implemented.
  "node:querystring": {
    not_implemented: []
  },

  // Fully implemented.
  "node:readline": {
    not_implemented: []
  },

  // Not implemented.
  "node:repl": {
    implemented: []
  },

  // Fully implemented.
  "node:stream": {
    not_implemented: []
  },
  
  // Fully implemented.
  "node:string_decoder": {
    not_implemented: []
  },

  // NOTE: Should look @ `node:util`
  "node:sys": {
    not_implemented: []
  },

  // Fully implemented.
  // NOTE: Recommended to use global `setTimeout`, etc. instead
  "node:timers": {
    not_implemented: []
  },

  "node:tls": {
    not_implemented: [
      "createSecurePair"
    ]
  },

  // Not implemented.
  "node:trace_events": {
    implemented: []
  },

  // Fully implemented.
  "node:tty": {
    not_implemented: []
  },

  // TODO: Recommend to use `URL` and `URLSearchParams` globals instead.
  "node:url": {
    not_implemented: [
      "domainToASCII",
      "domainToUnicode"
    ]
  },

  "node:util": {
    not_implemented: [
      "MIMEParams",
      "MIMEType",
      "formatWithOptions",
      "getSystemErrorMap",
      "getSystemErrorName",
      "parseArgs",
      "stripVTControlCharacters",
      "transferableAbortController",
      "transferableAbortSignal"
    ]
  },

  // TODO: Warn that `serialize` and `deserialize` use JavaScriptCore's wire format instead of V8's.
  // `bun:jsc` should be used instead.
  "node:v8": {
    implemented: [
      "serialize",
      "deserialize"
    ]
  },

  "node:vm": {
    implemented: [
      "ShadowRealm"
    ]
  },

  // TODO: Partially implemented.
  "node:wasi": {
    not_implemented: []
  },

  // TODO: Worker doesn't support the following options: eval, argv, execArgv, stdin, stdout, stderr, trackedUnmanagedFds, resourceLimits.
  "node:worker_threads": {
    not_implemented: [
      "markAsUntransferable",
      "moveMessagePortToContext",
      "getHeapSnapshot"
    ]
  },

  // NOTE: Some methods are not optimized.
  "node:zlib": {
    not_implemented: [
      "brotliCompress",
      "brotliCompressSync",
      "brotliDecompress",
      "brotliDecompressSync"
    ]
  }
} as Record<string, ModulesNote>;

export const BUN_BUILT_IN_GLOBALS_NOTES = [
  ["CompressionStream", false, "Not implemented."],
  ["Buffer", true, "Incomplete implementation of base64 and base64url encodings."],
  ["console", true, "Missing `Console` constructor."],
  ["DecompressionStream", false, "Not implemented."],

  ["PerformanceEntry", false, "Not implemented."],
  ["PerformanceMark", false, "Not implemented."],
  ["PerformanceMeasure", false, "Not implemented."],
  ["PerformanceObserver", false, "Not implemented."],
  ["PerformanceObserverEntryList", false, "Not implemented."],
  ["PerformanceResourceTiming", false, "Not implemented."],
  ["ReadableStreamBYOBReader", false, "Not implemented."],
  ["ReadableStreamBYOBRequest", false, "Not implemented."],
  ["TextDecoderStream", false, "Not implemented."],
  ["TextEncoderStream", false, "Not implemented."],

  ["process", true, [
    "allowedNodeEnvironmentFlags",
    "channel",
    "connected",
    "constrainedMemory",
    "disconnect",
    "getActiveResourcesInfo",
    "setActiveResourcesInfo",
    "setuid",
    "setgid",
    "setegid",
    "seteuid",
    "setgroups",
    "hasUncaughtExceptionCaptureCallback",
    "initGroups",
    "report",
    "resourceUsage",
    "send"
  ]]

] as Array<[name: string, implemented: boolean, notes: string] | [name: string, implemented: true, not_implemented_methods: string[]]>
