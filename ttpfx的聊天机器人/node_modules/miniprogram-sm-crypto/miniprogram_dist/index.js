module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("jsbn");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 消息扩展
var W = new Uint32Array(68);
var M = new Uint32Array(64); // W'

/**
 * 循环左移
 */
function rotl(x, n) {
  var s = n & 31;
  return x << s | x >>> 32 - s;
}

/**
 * 二进制异或运算
 */
function xor(x, y) {
  var result = [];
  for (var i = x.length - 1; i >= 0; i--) {
    result[i] = (x[i] ^ y[i]) & 0xff;
  }return result;
}

/**
 * 压缩函数中的置换函数 P0(X) = X xor (X <<< 9) xor (X <<< 17)
 */
function P0(X) {
  return X ^ rotl(X, 9) ^ rotl(X, 17);
}

/**
 * 消息扩展中的置换函数 P1(X) = X xor (X <<< 15) xor (X <<< 23)
 */
function P1(X) {
  return X ^ rotl(X, 15) ^ rotl(X, 23);
}

/**
 * sm3 本体
 */
function sm3(array) {
  var len = array.length * 8;

  // k 是满足 len + 1 + k = 448mod512 的最小的非负整数
  var k = len % 512;
  // 如果 448 <= (512 % len) < 512，需要多补充 (len % 448) 比特'0'以满足总比特长度为512的倍数
  k = k >= 448 ? 512 - k % 448 - 1 : 448 - k - 1;

  // 填充
  var kArr = new Array((k - 7) / 8);
  var lenArr = new Array(8);
  for (var i = 0, _len = kArr.length; i < _len; i++) {
    kArr[i] = 0;
  }for (var _i = 0, _len2 = lenArr.length; _i < _len2; _i++) {
    lenArr[_i] = 0;
  }len = len.toString(2);
  for (var _i2 = 7; _i2 >= 0; _i2--) {
    if (len.length > 8) {
      var start = len.length - 8;
      lenArr[_i2] = parseInt(len.substr(start), 2);
      len = len.substr(0, start);
    } else if (len.length > 0) {
      lenArr[_i2] = parseInt(len, 2);
      len = '';
    }
  }
  var m = new Uint8Array([].concat(array, [0x80], kArr, lenArr));
  var dataView = new DataView(m.buffer, 0);

  // 迭代压缩
  var n = m.length / 64;
  var V = new Uint32Array([0x7380166f, 0x4914b2b9, 0x172442d7, 0xda8a0600, 0xa96f30bc, 0x163138aa, 0xe38dee4d, 0xb0fb0e4e]);
  for (var _i3 = 0; _i3 < n; _i3++) {
    W.fill(0);
    M.fill(0);

    // 将消息分组B划分为 16 个字 W0， W1，……，W15
    var _start = 16 * _i3;
    for (var j = 0; j < 16; j++) {
      W[j] = dataView.getUint32((_start + j) * 4, false);
    }

    // W16 ～ W67：W[j] <- P1(W[j−16] xor W[j−9] xor (W[j−3] <<< 15)) xor (W[j−13] <<< 7) xor W[j−6]
    for (var _j = 16; _j < 68; _j++) {
      W[_j] = P1(W[_j - 16] ^ W[_j - 9] ^ rotl(W[_j - 3], 15)) ^ rotl(W[_j - 13], 7) ^ W[_j - 6];
    }

    // W′0 ～ W′63：W′[j] = W[j] xor W[j+4]
    for (var _j2 = 0; _j2 < 64; _j2++) {
      M[_j2] = W[_j2] ^ W[_j2 + 4];
    }

    // 压缩
    var T1 = 0x79cc4519;
    var T2 = 0x7a879d8a;
    // 字寄存器
    var A = V[0];
    var B = V[1];
    var C = V[2];
    var D = V[3];
    var E = V[4];
    var F = V[5];
    var G = V[6];
    var H = V[7];
    // 中间变量
    var SS1 = void 0;
    var SS2 = void 0;
    var TT1 = void 0;
    var TT2 = void 0;
    var T = void 0;
    for (var _j3 = 0; _j3 < 64; _j3++) {
      T = _j3 >= 0 && _j3 <= 15 ? T1 : T2;
      SS1 = rotl(rotl(A, 12) + E + rotl(T, _j3), 7);
      SS2 = SS1 ^ rotl(A, 12);

      TT1 = (_j3 >= 0 && _j3 <= 15 ? A ^ B ^ C : A & B | A & C | B & C) + D + SS2 + M[_j3];
      TT2 = (_j3 >= 0 && _j3 <= 15 ? E ^ F ^ G : E & F | ~E & G) + H + SS1 + W[_j3];

      D = C;
      C = rotl(B, 9);
      B = A;
      A = TT1;
      H = G;
      G = rotl(F, 19);
      F = E;
      E = P0(TT2);
    }

    V[0] ^= A;
    V[1] ^= B;
    V[2] ^= C;
    V[3] ^= D;
    V[4] ^= E;
    V[5] ^= F;
    V[6] ^= G;
    V[7] ^= H;
  }

  // 转回 uint8
  var result = [];
  for (var _i4 = 0, _len3 = V.length; _i4 < _len3; _i4++) {
    var word = V[_i4];
    result.push((word & 0xff000000) >>> 24, (word & 0xff0000) >>> 16, (word & 0xff00) >>> 8, word & 0xff);
  }

  return result;
}

/**
 * hmac 实现
 */
var blockLen = 64;
var iPad = new Uint8Array(blockLen);
var oPad = new Uint8Array(blockLen);
for (var i = 0; i < blockLen; i++) {
  iPad[i] = 0x36;
  oPad[i] = 0x5c;
}
function hmac(input, key) {
  // 密钥填充
  if (key.length > blockLen) key = sm3(key);
  while (key.length < blockLen) {
    key.push(0);
  }var iPadKey = xor(key, iPad);
  var oPadKey = xor(key, oPad);

  var hash = sm3([].concat(iPadKey, input));
  return sm3([].concat(oPadKey, hash));
}

module.exports = {
  sm3: sm3,
  hmac: hmac
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  sm2: __webpack_require__(3),
  sm3: __webpack_require__(7),
  sm4: __webpack_require__(8)
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable no-use-before-define */
var _require = __webpack_require__(0),
    BigInteger = _require.BigInteger;

var _require2 = __webpack_require__(4),
    encodeDer = _require2.encodeDer,
    decodeDer = _require2.decodeDer;

var _ = __webpack_require__(5);
var sm3 = __webpack_require__(1).sm3;

var _$generateEcparam = _.generateEcparam(),
    G = _$generateEcparam.G,
    curve = _$generateEcparam.curve,
    n = _$generateEcparam.n;

var C1C2C3 = 0;

/**
 * 加密
 */
function doEncrypt(msg, publicKey) {
  var cipherMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  msg = typeof msg === 'string' ? _.hexToArray(_.utf8ToHex(msg)) : Array.prototype.slice.call(msg);
  publicKey = _.getGlobalCurve().decodePointHex(publicKey); // 先将公钥转成点

  var keypair = _.generateKeyPairHex();
  var k = new BigInteger(keypair.privateKey, 16); // 随机数 k

  // c1 = k * G
  var c1 = keypair.publicKey;
  if (c1.length > 128) c1 = c1.substr(c1.length - 128);

  // (x2, y2) = k * publicKey
  var p = publicKey.multiply(k);
  var x2 = _.hexToArray(_.leftPad(p.getX().toBigInteger().toRadix(16), 64));
  var y2 = _.hexToArray(_.leftPad(p.getY().toBigInteger().toRadix(16), 64));

  // c3 = hash(x2 || msg || y2)
  var c3 = _.arrayToHex(sm3([].concat(x2, msg, y2)));

  var ct = 1;
  var offset = 0;
  var t = []; // 256 位
  var z = [].concat(x2, y2);
  var nextT = function nextT() {
    // (1) Hai = hash(z || ct)
    // (2) ct++
    t = sm3([].concat(z, [ct >> 24 & 0x00ff, ct >> 16 & 0x00ff, ct >> 8 & 0x00ff, ct & 0x00ff]));
    ct++;
    offset = 0;
  };
  nextT(); // 先生成 Ha1

  for (var i = 0, len = msg.length; i < len; i++) {
    // t = Ha1 || Ha2 || Ha3 || Ha4
    if (offset === t.length) nextT();

    // c2 = msg ^ t
    msg[i] ^= t[offset++] & 0xff;
  }
  var c2 = _.arrayToHex(msg);

  return cipherMode === C1C2C3 ? c1 + c2 + c3 : c1 + c3 + c2;
}

/**
 * 解密
 */
function doDecrypt(encryptData, privateKey) {
  var cipherMode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$output = _ref.output,
      output = _ref$output === undefined ? 'string' : _ref$output;

  privateKey = new BigInteger(privateKey, 16);

  var c3 = encryptData.substr(128, 64);
  var c2 = encryptData.substr(128 + 64);

  if (cipherMode === C1C2C3) {
    c3 = encryptData.substr(encryptData.length - 64);
    c2 = encryptData.substr(128, encryptData.length - 128 - 64);
  }

  var msg = _.hexToArray(c2);
  var c1 = _.getGlobalCurve().decodePointHex('04' + encryptData.substr(0, 128));

  var p = c1.multiply(privateKey);
  var x2 = _.hexToArray(_.leftPad(p.getX().toBigInteger().toRadix(16), 64));
  var y2 = _.hexToArray(_.leftPad(p.getY().toBigInteger().toRadix(16), 64));

  var ct = 1;
  var offset = 0;
  var t = []; // 256 位
  var z = [].concat(x2, y2);
  var nextT = function nextT() {
    // (1) Hai = hash(z || ct)
    // (2) ct++
    t = sm3([].concat(z, [ct >> 24 & 0x00ff, ct >> 16 & 0x00ff, ct >> 8 & 0x00ff, ct & 0x00ff]));
    ct++;
    offset = 0;
  };
  nextT(); // 先生成 Ha1

  for (var i = 0, len = msg.length; i < len; i++) {
    // t = Ha1 || Ha2 || Ha3 || Ha4
    if (offset === t.length) nextT();

    // c2 = msg ^ t
    msg[i] ^= t[offset++] & 0xff;
  }

  // c3 = hash(x2 || msg || y2)
  var checkC3 = _.arrayToHex(sm3([].concat(x2, msg, y2)));

  if (checkC3 === c3.toLowerCase()) {
    return output === 'array' ? msg : _.arrayToUtf8(msg);
  } else {
    return output === 'array' ? [] : '';
  }
}

/**
 * 签名
 */
function doSignature(msg, privateKey) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      pointPool = _ref2.pointPool,
      der = _ref2.der,
      hash = _ref2.hash,
      publicKey = _ref2.publicKey,
      userId = _ref2.userId;

  var hashHex = typeof msg === 'string' ? _.utf8ToHex(msg) : _.arrayToHex(msg);

  if (hash) {
    // sm3杂凑
    publicKey = publicKey || getPublicKeyFromPrivateKey(privateKey);
    hashHex = getHash(hashHex, publicKey, userId);
  }

  var dA = new BigInteger(privateKey, 16);
  var e = new BigInteger(hashHex, 16);

  // k
  var k = null;
  var r = null;
  var s = null;

  do {
    do {
      var point = void 0;
      if (pointPool && pointPool.length) {
        point = pointPool.pop();
      } else {
        point = getPoint();
      }
      k = point.k;

      // r = (e + x1) mod n
      r = e.add(point.x1).mod(n);
    } while (r.equals(BigInteger.ZERO) || r.add(k).equals(n));

    // s = ((1 + dA)^-1 * (k - r * dA)) mod n
    s = dA.add(BigInteger.ONE).modInverse(n).multiply(k.subtract(r.multiply(dA))).mod(n);
  } while (s.equals(BigInteger.ZERO));

  if (der) return encodeDer(r, s); // asn.1 der 编码

  return _.leftPad(r.toString(16), 64) + _.leftPad(s.toString(16), 64);
}

/**
 * 验签
 */
function doVerifySignature(msg, signHex, publicKey) {
  var _ref3 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      der = _ref3.der,
      hash = _ref3.hash,
      userId = _ref3.userId;

  var hashHex = typeof msg === 'string' ? _.utf8ToHex(msg) : _.arrayToHex(msg);

  if (hash) {
    // sm3杂凑
    hashHex = getHash(hashHex, publicKey, userId);
  }

  var r = void 0;var s = void 0;
  if (der) {
    var decodeDerObj = decodeDer(signHex); // asn.1 der 解码
    r = decodeDerObj.r;
    s = decodeDerObj.s;
  } else {
    r = new BigInteger(signHex.substring(0, 64), 16);
    s = new BigInteger(signHex.substring(64), 16);
  }

  var PA = curve.decodePointHex(publicKey);
  var e = new BigInteger(hashHex, 16);

  // t = (r + s) mod n
  var t = r.add(s).mod(n);

  if (t.equals(BigInteger.ZERO)) return false;

  // x1y1 = s * G + t * PA
  var x1y1 = G.multiply(s).add(PA.multiply(t));

  // R = (e + x1) mod n
  var R = e.add(x1y1.getX().toBigInteger()).mod(n);

  return r.equals(R);
}

/**
 * sm3杂凑算法
 */
function getHash(hashHex, publicKey) {
  var userId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '1234567812345678';

  // z = hash(entl || userId || a || b || gx || gy || px || py)
  userId = _.utf8ToHex(userId);
  var a = _.leftPad(G.curve.a.toBigInteger().toRadix(16), 64);
  var b = _.leftPad(G.curve.b.toBigInteger().toRadix(16), 64);
  var gx = _.leftPad(G.getX().toBigInteger().toRadix(16), 64);
  var gy = _.leftPad(G.getY().toBigInteger().toRadix(16), 64);
  var px = void 0;
  var py = void 0;
  if (publicKey.length === 128) {
    px = publicKey.substr(0, 64);
    py = publicKey.substr(64, 64);
  } else {
    var point = G.curve.decodePointHex(publicKey);
    px = _.leftPad(point.getX().toBigInteger().toRadix(16), 64);
    py = _.leftPad(point.getY().toBigInteger().toRadix(16), 64);
  }
  var data = _.hexToArray(userId + a + b + gx + gy + px + py);

  var entl = userId.length * 4;
  data.unshift(entl & 0x00ff);
  data.unshift(entl >> 8 & 0x00ff);

  var z = sm3(data);

  // e = hash(z || msg)
  return _.arrayToHex(sm3(z.concat(_.hexToArray(hashHex))));
}

/**
 * 计算公钥
 */
function getPublicKeyFromPrivateKey(privateKey) {
  var PA = G.multiply(new BigInteger(privateKey, 16));
  var x = _.leftPad(PA.getX().toBigInteger().toString(16), 64);
  var y = _.leftPad(PA.getY().toBigInteger().toString(16), 64);
  return '04' + x + y;
}

/**
 * 获取椭圆曲线点
 */
function getPoint() {
  var keypair = _.generateKeyPairHex();
  var PA = curve.decodePointHex(keypair.publicKey);

  keypair.k = new BigInteger(keypair.privateKey, 16);
  keypair.x1 = PA.getX().toBigInteger();

  return keypair;
}

module.exports = {
  generateKeyPairHex: _.generateKeyPairHex,
  compressPublicKeyHex: _.compressPublicKeyHex,
  comparePublicKeyHex: _.comparePublicKeyHex,
  doEncrypt: doEncrypt,
  doDecrypt: doDecrypt,
  doSignature: doSignature,
  doVerifySignature: doVerifySignature,
  getPoint: getPoint,
  verifyPublicKey: _.verifyPublicKey
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable class-methods-use-this */
var _require = __webpack_require__(0),
    BigInteger = _require.BigInteger;

function bigintToValue(bigint) {
  var h = bigint.toString(16);
  if (h[0] !== '-') {
    // 正数
    if (h.length % 2 === 1) h = '0' + h; // 补齐到整字节
    else if (!h.match(/^[0-7]/)) h = '00' + h; // 非0开头，则补一个全0字节
  } else {
    // 负数
    h = h.substr(1);

    var len = h.length;
    if (len % 2 === 1) len += 1; // 补齐到整字节
    else if (!h.match(/^[0-7]/)) len += 2; // 非0开头，则补一个全0字节

    var mask = '';
    for (var i = 0; i < len; i++) {
      mask += 'f';
    }mask = new BigInteger(mask, 16);

    // 对绝对值取反，加1
    h = mask.xor(bigint).add(BigInteger.ONE);
    h = h.toString(16).replace(/^-/, '');
  }
  return h;
}

var ASN1Object = function () {
  function ASN1Object() {
    _classCallCheck(this, ASN1Object);

    this.tlv = null;
    this.t = '00';
    this.l = '00';
    this.v = '';
  }

  /**
   * 获取 der 编码比特流16进制串
   */


  ASN1Object.prototype.getEncodedHex = function getEncodedHex() {
    if (!this.tlv) {
      this.v = this.getValue();
      this.l = this.getLength();
      this.tlv = this.t + this.l + this.v;
    }
    return this.tlv;
  };

  ASN1Object.prototype.getLength = function getLength() {
    var n = this.v.length / 2; // 字节数
    var nHex = n.toString(16);
    if (nHex.length % 2 === 1) nHex = '0' + nHex; // 补齐到整字节

    if (n < 128) {
      // 短格式，以 0 开头
      return nHex;
    } else {
      // 长格式，以 1 开头
      var head = 128 + nHex.length / 2; // 1(1位) + 真正的长度占用字节数(7位) + 真正的长度
      return head.toString(16) + nHex;
    }
  };

  ASN1Object.prototype.getValue = function getValue() {
    return '';
  };

  return ASN1Object;
}();

var DERInteger = function (_ASN1Object) {
  _inherits(DERInteger, _ASN1Object);

  function DERInteger(bigint) {
    _classCallCheck(this, DERInteger);

    var _this = _possibleConstructorReturn(this, _ASN1Object.call(this));

    _this.t = '02'; // 整型标签说明
    if (bigint) _this.v = bigintToValue(bigint);
    return _this;
  }

  DERInteger.prototype.getValue = function getValue() {
    return this.v;
  };

  return DERInteger;
}(ASN1Object);

var DERSequence = function (_ASN1Object2) {
  _inherits(DERSequence, _ASN1Object2);

  function DERSequence(asn1Array) {
    _classCallCheck(this, DERSequence);

    var _this2 = _possibleConstructorReturn(this, _ASN1Object2.call(this));

    _this2.t = '30'; // 序列标签说明
    _this2.asn1Array = asn1Array;
    return _this2;
  }

  DERSequence.prototype.getValue = function getValue() {
    this.v = this.asn1Array.map(function (asn1Object) {
      return asn1Object.getEncodedHex();
    }).join('');
    return this.v;
  };

  return DERSequence;
}(ASN1Object);

/**
 * 获取 l 占用字节数
 */


function getLenOfL(str, start) {
  if (+str[start + 2] < 8) return 1; // l 以0开头，则表示短格式，只占一个字节
  return +str.substr(start + 2, 2) & 0x7f + 1; // 长格式，取第一个字节后7位作为长度真正占用字节数，再加上本身
}

/**
 * 获取 l
 */
function getL(str, start) {
  // 获取 l
  var len = getLenOfL(str, start);
  var l = str.substr(start + 2, len * 2);

  if (!l) return -1;
  var bigint = +l[0] < 8 ? new BigInteger(l, 16) : new BigInteger(l.substr(2), 16);

  return bigint.intValue();
}

/**
 * 获取 v 的位置
 */
function getStartOfV(str, start) {
  var len = getLenOfL(str, start);
  return start + (len + 1) * 2;
}

module.exports = {
  /**
   * ASN.1 der 编码，针对 sm2 签名
   */
  encodeDer: function encodeDer(r, s) {
    var derR = new DERInteger(r);
    var derS = new DERInteger(s);
    var derSeq = new DERSequence([derR, derS]);

    return derSeq.getEncodedHex();
  },


  /**
   * 解析 ASN.1 der，针对 sm2 验签
   */
  decodeDer: function decodeDer(input) {
    // 结构：
    // input = | tSeq | lSeq | vSeq |
    // vSeq = | tR | lR | vR | tS | lS | vS |
    var start = getStartOfV(input, 0);

    var vIndexR = getStartOfV(input, start);
    var lR = getL(input, start);
    var vR = input.substr(vIndexR, lR * 2);

    var nextStart = vIndexR + vR.length;
    var vIndexS = getStartOfV(input, nextStart);
    var lS = getL(input, nextStart);
    var vS = input.substr(vIndexS, lS * 2);

    var r = new BigInteger(vR, 16);
    var s = new BigInteger(vS, 16);

    return { r: r, s: s };
  }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable no-bitwise, no-mixed-operators, no-use-before-define, max-len */
var _require = __webpack_require__(0),
    BigInteger = _require.BigInteger,
    SecureRandom = _require.SecureRandom;

var _require2 = __webpack_require__(6),
    ECCurveFp = _require2.ECCurveFp;

var rng = new SecureRandom();

var _generateEcparam = generateEcparam(),
    curve = _generateEcparam.curve,
    G = _generateEcparam.G,
    n = _generateEcparam.n;

/**
 * 获取公共椭圆曲线
 */


function getGlobalCurve() {
  return curve;
}

/**
 * 生成ecparam
 */
function generateEcparam() {
  // 椭圆曲线
  var p = new BigInteger('FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFF', 16);
  var a = new BigInteger('FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFC', 16);
  var b = new BigInteger('28E9FA9E9D9F5E344D5A9E4BCF6509A7F39789F515AB8F92DDBCBD414D940E93', 16);
  var curve = new ECCurveFp(p, a, b);

  // 基点
  var gxHex = '32C4AE2C1F1981195F9904466A39C9948FE30BBFF2660BE1715A4589334C74C7';
  var gyHex = 'BC3736A2F4F6779C59BDCEE36B692153D0A9877CC62A474002DF32E52139F0A0';
  var G = curve.decodePointHex('04' + gxHex + gyHex);

  var n = new BigInteger('FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFF7203DF6B21C6052B53BBF40939D54123', 16);

  return { curve: curve, G: G, n: n };
}

/**
 * 生成密钥对：publicKey = privateKey * G
 */
function generateKeyPairHex(a, b, c) {
  var random = a ? new BigInteger(a, b, c) : new BigInteger(n.bitLength(), rng);
  var d = random.mod(n.subtract(BigInteger.ONE)).add(BigInteger.ONE); // 随机数
  var privateKey = leftPad(d.toString(16), 64);

  var P = G.multiply(d); // P = dG，p 为公钥，d 为私钥
  var Px = leftPad(P.getX().toBigInteger().toString(16), 64);
  var Py = leftPad(P.getY().toBigInteger().toString(16), 64);
  var publicKey = '04' + Px + Py;

  return { privateKey: privateKey, publicKey: publicKey };
}

/**
 * 生成压缩公钥
 */
function compressPublicKeyHex(s) {
  if (s.length !== 130) throw new Error('Invalid public key to compress');

  var len = (s.length - 2) / 2;
  var xHex = s.substr(2, len);
  var y = new BigInteger(s.substr(len + 2, len), 16);

  var prefix = '03';
  if (y.mod(new BigInteger('2')).equals(BigInteger.ZERO)) prefix = '02';

  return prefix + xHex;
}

/**
 * utf8串转16进制串
 */
function utf8ToHex(input) {
  input = unescape(encodeURIComponent(input));

  var length = input.length;

  // 转换到字数组
  var words = [];
  for (var i = 0; i < length; i++) {
    words[i >>> 2] |= (input.charCodeAt(i) & 0xff) << 24 - i % 4 * 8;
  }

  // 转换到16进制
  var hexChars = [];
  for (var _i = 0; _i < length; _i++) {
    var bite = words[_i >>> 2] >>> 24 - _i % 4 * 8 & 0xff;
    hexChars.push((bite >>> 4).toString(16));
    hexChars.push((bite & 0x0f).toString(16));
  }

  return hexChars.join('');
}

/**
 * 补全16进制字符串
 */
function leftPad(input, num) {
  if (input.length >= num) return input;

  return new Array(num - input.length + 1).join('0') + input;
}

/**
 * 转成16进制串
 */
function arrayToHex(arr) {
  return arr.map(function (item) {
    item = item.toString(16);
    return item.length === 1 ? '0' + item : item;
  }).join('');
}

/**
 * 转成utf8串
 */
function arrayToUtf8(arr) {
  var words = [];
  var j = 0;
  for (var i = 0; i < arr.length * 2; i += 2) {
    words[i >>> 3] |= parseInt(arr[j], 10) << 24 - i % 8 * 4;
    j++;
  }

  try {
    var latin1Chars = [];

    for (var _i2 = 0; _i2 < arr.length; _i2++) {
      var bite = words[_i2 >>> 2] >>> 24 - _i2 % 4 * 8 & 0xff;
      latin1Chars.push(String.fromCharCode(bite));
    }

    return decodeURIComponent(escape(latin1Chars.join('')));
  } catch (e) {
    throw new Error('Malformed UTF-8 data');
  }
}

/**
 * 转成字节数组
 */
function hexToArray(hexStr) {
  var words = [];
  var hexStrLength = hexStr.length;

  if (hexStrLength % 2 !== 0) {
    hexStr = leftPad(hexStr, hexStrLength + 1);
  }

  hexStrLength = hexStr.length;

  for (var i = 0; i < hexStrLength; i += 2) {
    words.push(parseInt(hexStr.substr(i, 2), 16));
  }
  return words;
}

/**
 * 验证公钥是否为椭圆曲线上的点
 */
function verifyPublicKey(publicKey) {
  var point = curve.decodePointHex(publicKey);
  if (!point) return false;

  var x = point.getX();
  var y = point.getY();

  // 验证 y^2 是否等于 x^3 + ax + b
  return y.square().equals(x.multiply(x.square()).add(x.multiply(curve.a)).add(curve.b));
}

/**
 * 验证公钥是否等价，等价返回true
 */
function comparePublicKeyHex(publicKey1, publicKey2) {
  var point1 = curve.decodePointHex(publicKey1);
  if (!point1) return false;

  var point2 = curve.decodePointHex(publicKey2);
  if (!point2) return false;

  return point1.equals(point2);
}

module.exports = {
  getGlobalCurve: getGlobalCurve,
  generateEcparam: generateEcparam,
  generateKeyPairHex: generateKeyPairHex,
  compressPublicKeyHex: compressPublicKeyHex,
  utf8ToHex: utf8ToHex,
  leftPad: leftPad,
  arrayToHex: arrayToHex,
  arrayToUtf8: arrayToUtf8,
  hexToArray: hexToArray,
  verifyPublicKey: verifyPublicKey,
  comparePublicKeyHex: comparePublicKeyHex
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-case-declarations, max-len */
var _require = __webpack_require__(0),
    BigInteger = _require.BigInteger;

/**
 * thanks for Tom Wu : http://www-cs-students.stanford.edu/~tjw/jsbn/
 *
 * Basic Javascript Elliptic Curve implementation
 * Ported loosely from BouncyCastle's Java EC code
 * Only Fp curves implemented for now
 */

var TWO = new BigInteger('2');
var THREE = new BigInteger('3');

/**
 * 椭圆曲线域元素
 */

var ECFieldElementFp = function () {
  function ECFieldElementFp(q, x) {
    _classCallCheck(this, ECFieldElementFp);

    this.x = x;
    this.q = q;
    // TODO if (x.compareTo(q) >= 0) error
  }

  /**
   * 判断相等
   */


  ECFieldElementFp.prototype.equals = function equals(other) {
    if (other === this) return true;
    return this.q.equals(other.q) && this.x.equals(other.x);
  };

  /**
   * 返回具体数值
   */


  ECFieldElementFp.prototype.toBigInteger = function toBigInteger() {
    return this.x;
  };

  /**
   * 取反
   */


  ECFieldElementFp.prototype.negate = function negate() {
    return new ECFieldElementFp(this.q, this.x.negate().mod(this.q));
  };

  /**
   * 相加
   */


  ECFieldElementFp.prototype.add = function add(b) {
    return new ECFieldElementFp(this.q, this.x.add(b.toBigInteger()).mod(this.q));
  };

  /**
   * 相减
   */


  ECFieldElementFp.prototype.subtract = function subtract(b) {
    return new ECFieldElementFp(this.q, this.x.subtract(b.toBigInteger()).mod(this.q));
  };

  /**
   * 相乘
   */


  ECFieldElementFp.prototype.multiply = function multiply(b) {
    return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger()).mod(this.q));
  };

  /**
   * 相除
   */


  ECFieldElementFp.prototype.divide = function divide(b) {
    return new ECFieldElementFp(this.q, this.x.multiply(b.toBigInteger().modInverse(this.q)).mod(this.q));
  };

  /**
   * 平方
   */


  ECFieldElementFp.prototype.square = function square() {
    return new ECFieldElementFp(this.q, this.x.square().mod(this.q));
  };

  return ECFieldElementFp;
}();

var ECPointFp = function () {
  function ECPointFp(curve, x, y, z) {
    _classCallCheck(this, ECPointFp);

    this.curve = curve;
    this.x = x;
    this.y = y;
    // 标准射影坐标系：zinv == null 或 z * zinv == 1
    this.z = z == null ? BigInteger.ONE : z;
    this.zinv = null;
    // TODO: compression flag
  }

  ECPointFp.prototype.getX = function getX() {
    if (this.zinv === null) this.zinv = this.z.modInverse(this.curve.q);

    return this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q));
  };

  ECPointFp.prototype.getY = function getY() {
    if (this.zinv === null) this.zinv = this.z.modInverse(this.curve.q);

    return this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q));
  };

  /**
   * 判断相等
   */


  ECPointFp.prototype.equals = function equals(other) {
    if (other === this) return true;
    if (this.isInfinity()) return other.isInfinity();
    if (other.isInfinity()) return this.isInfinity();

    // u = y2 * z1 - y1 * z2
    var u = other.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(other.z)).mod(this.curve.q);
    if (!u.equals(BigInteger.ZERO)) return false;

    // v = x2 * z1 - x1 * z2
    var v = other.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(other.z)).mod(this.curve.q);
    return v.equals(BigInteger.ZERO);
  };

  /**
   * 是否是无穷远点
   */


  ECPointFp.prototype.isInfinity = function isInfinity() {
    if (this.x === null && this.y === null) return true;
    return this.z.equals(BigInteger.ZERO) && !this.y.toBigInteger().equals(BigInteger.ZERO);
  };

  /**
   * 取反，x 轴对称点
   */


  ECPointFp.prototype.negate = function negate() {
    return new ECPointFp(this.curve, this.x, this.y.negate(), this.z);
  };

  /**
   * 相加
   *
   * 标准射影坐标系：
   *
   * λ1 = x1 * z2
   * λ2 = x2 * z1
   * λ3 = λ1 − λ2
   * λ4 = y1 * z2
   * λ5 = y2 * z1
   * λ6 = λ4 − λ5
   * λ7 = λ1 + λ2
   * λ8 = z1 * z2
   * λ9 = λ3^2
   * λ10 = λ3 * λ9
   * λ11 = λ8 * λ6^2 − λ7 * λ9
   * x3 = λ3 * λ11
   * y3 = λ6 * (λ9 * λ1 − λ11) − λ4 * λ10
   * z3 = λ10 * λ8
   */


  ECPointFp.prototype.add = function add(b) {
    if (this.isInfinity()) return b;
    if (b.isInfinity()) return this;

    var x1 = this.x.toBigInteger();
    var y1 = this.y.toBigInteger();
    var z1 = this.z;
    var x2 = b.x.toBigInteger();
    var y2 = b.y.toBigInteger();
    var z2 = b.z;
    var q = this.curve.q;

    var w1 = x1.multiply(z2).mod(q);
    var w2 = x2.multiply(z1).mod(q);
    var w3 = w1.subtract(w2);
    var w4 = y1.multiply(z2).mod(q);
    var w5 = y2.multiply(z1).mod(q);
    var w6 = w4.subtract(w5);

    if (BigInteger.ZERO.equals(w3)) {
      if (BigInteger.ZERO.equals(w6)) {
        return this.twice(); // this == b，计算自加
      }
      return this.curve.infinity; // this == -b，则返回无穷远点
    }

    var w7 = w1.add(w2);
    var w8 = z1.multiply(z2).mod(q);
    var w9 = w3.square().mod(q);
    var w10 = w3.multiply(w9).mod(q);
    var w11 = w8.multiply(w6.square()).subtract(w7.multiply(w9)).mod(q);

    var x3 = w3.multiply(w11).mod(q);
    var y3 = w6.multiply(w9.multiply(w1).subtract(w11)).subtract(w4.multiply(w10)).mod(q);
    var z3 = w10.multiply(w8).mod(q);

    return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
  };

  /**
   * 自加
   *
   * 标准射影坐标系：
   *
   * λ1 = 3 * x1^2 + a * z1^2
   * λ2 = 2 * y1 * z1
   * λ3 = y1^2
   * λ4 = λ3 * x1 * z1
   * λ5 = λ2^2
   * λ6 = λ1^2 − 8 * λ4
   * x3 = λ2 * λ6
   * y3 = λ1 * (4 * λ4 − λ6) − 2 * λ5 * λ3
   * z3 = λ2 * λ5
   */


  ECPointFp.prototype.twice = function twice() {
    if (this.isInfinity()) return this;
    if (!this.y.toBigInteger().signum()) return this.curve.infinity;

    var x1 = this.x.toBigInteger();
    var y1 = this.y.toBigInteger();
    var z1 = this.z;
    var q = this.curve.q;
    var a = this.curve.a.toBigInteger();

    var w1 = x1.square().multiply(THREE).add(a.multiply(z1.square())).mod(q);
    var w2 = y1.shiftLeft(1).multiply(z1).mod(q);
    var w3 = y1.square().mod(q);
    var w4 = w3.multiply(x1).multiply(z1).mod(q);
    var w5 = w2.square().mod(q);
    var w6 = w1.square().subtract(w4.shiftLeft(3)).mod(q);

    var x3 = w2.multiply(w6).mod(q);
    var y3 = w1.multiply(w4.shiftLeft(2).subtract(w6)).subtract(w5.shiftLeft(1).multiply(w3)).mod(q);
    var z3 = w2.multiply(w5).mod(q);

    return new ECPointFp(this.curve, this.curve.fromBigInteger(x3), this.curve.fromBigInteger(y3), z3);
  };

  /**
   * 倍点计算
   */


  ECPointFp.prototype.multiply = function multiply(k) {
    if (this.isInfinity()) return this;
    if (!k.signum()) return this.curve.infinity;

    // 使用加减法
    var k3 = k.multiply(THREE);
    var neg = this.negate();
    var Q = this;

    for (var i = k3.bitLength() - 2; i > 0; i--) {
      Q = Q.twice();

      var k3Bit = k3.testBit(i);
      var kBit = k.testBit(i);

      if (k3Bit !== kBit) {
        Q = Q.add(k3Bit ? this : neg);
      }
    }

    return Q;
  };

  return ECPointFp;
}();

/**
 * 椭圆曲线 y^2 = x^3 + ax + b
 */


var ECCurveFp = function () {
  function ECCurveFp(q, a, b) {
    _classCallCheck(this, ECCurveFp);

    this.q = q;
    this.a = this.fromBigInteger(a);
    this.b = this.fromBigInteger(b);
    this.infinity = new ECPointFp(this, null, null); // 无穷远点
  }

  /**
   * 判断两个椭圆曲线是否相等
   */


  ECCurveFp.prototype.equals = function equals(other) {
    if (other === this) return true;
    return this.q.equals(other.q) && this.a.equals(other.a) && this.b.equals(other.b);
  };

  /**
   * 生成椭圆曲线域元素
   */


  ECCurveFp.prototype.fromBigInteger = function fromBigInteger(x) {
    return new ECFieldElementFp(this.q, x);
  };

  /**
   * 解析 16 进制串为椭圆曲线点
   */


  ECCurveFp.prototype.decodePointHex = function decodePointHex(s) {
    switch (parseInt(s.substr(0, 2), 16)) {
      // 第一个字节
      case 0:
        return this.infinity;
      case 2:
      case 3:
        // 压缩
        var x = this.fromBigInteger(new BigInteger(s.substr(2), 16));
        // 对 p ≡ 3 (mod4)，即存在正整数 u，使得 p = 4u + 3
        // 计算 y = (√ (x^3 + ax + b) % p)^(u + 1) modp
        var y = this.fromBigInteger(x.multiply(x.square()).add(x.multiply(this.a)).add(this.b).toBigInteger().modPow(this.q.divide(new BigInteger('4')).add(BigInteger.ONE), this.q));
        // 算出结果 2 进制最后 1 位不等于第 1 个字节减 2 则取反
        if (!y.toBigInteger().mod(TWO).equals(new BigInteger(s.substr(0, 2), 16).subtract(TWO))) {
          y = y.negate();
        }
        return new ECPointFp(this, x, y);
      case 4:
      case 6:
      case 7:
        var len = (s.length - 2) / 2;
        var xHex = s.substr(2, len);
        var yHex = s.substr(len + 2, len);

        return new ECPointFp(this, this.fromBigInteger(new BigInteger(xHex, 16)), this.fromBigInteger(new BigInteger(yHex, 16)));
      default:
        // 不支持
        return null;
    }
  };

  return ECCurveFp;
}();

module.exports = {
  ECPointFp: ECPointFp,
  ECCurveFp: ECCurveFp
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(1),
    sm3 = _require.sm3,
    hmac = _require.hmac;

/**
 * 补全16进制字符串
 */


function leftPad(input, num) {
  if (input.length >= num) return input;

  return new Array(num - input.length + 1).join('0') + input;
}

/**
 * 字节数组转 16 进制串
 */
function ArrayToHex(arr) {
  return arr.map(function (item) {
    item = item.toString(16);
    return item.length === 1 ? '0' + item : item;
  }).join('');
}

/**
 * 转成字节数组
 */
function hexToArray(hexStr) {
  var words = [];
  var hexStrLength = hexStr.length;

  if (hexStrLength % 2 !== 0) {
    hexStr = leftPad(hexStr, hexStrLength + 1);
  }

  hexStrLength = hexStr.length;

  for (var i = 0; i < hexStrLength; i += 2) {
    words.push(parseInt(hexStr.substr(i, 2), 16));
  }
  return words;
}

/**
 * utf8 串转字节数组
 */
function utf8ToArray(str) {
  var arr = [];

  for (var i = 0, len = str.length; i < len; i++) {
    var point = str.codePointAt(i);

    if (point <= 0x007f) {
      // 单字节，标量值：00000000 00000000 0zzzzzzz
      arr.push(point);
    } else if (point <= 0x07ff) {
      // 双字节，标量值：00000000 00000yyy yyzzzzzz
      arr.push(0xc0 | point >>> 6); // 110yyyyy（0xc0-0xdf）
      arr.push(0x80 | point & 0x3f); // 10zzzzzz（0x80-0xbf）
    } else if (point <= 0xD7FF || point >= 0xE000 && point <= 0xFFFF) {
      // 三字节：标量值：00000000 xxxxyyyy yyzzzzzz
      arr.push(0xe0 | point >>> 12); // 1110xxxx（0xe0-0xef）
      arr.push(0x80 | point >>> 6 & 0x3f); // 10yyyyyy（0x80-0xbf）
      arr.push(0x80 | point & 0x3f); // 10zzzzzz（0x80-0xbf）
    } else if (point >= 0x010000 && point <= 0x10FFFF) {
      // 四字节：标量值：000wwwxx xxxxyyyy yyzzzzzz
      i++;
      arr.push(0xf0 | point >>> 18 & 0x1c); // 11110www（0xf0-0xf7）
      arr.push(0x80 | point >>> 12 & 0x3f); // 10xxxxxx（0x80-0xbf）
      arr.push(0x80 | point >>> 6 & 0x3f); // 10yyyyyy（0x80-0xbf）
      arr.push(0x80 | point & 0x3f); // 10zzzzzz（0x80-0xbf）
    } else {
      // 五、六字节，暂时不支持
      arr.push(point);
      throw new Error('input is not supported');
    }
  }

  return arr;
}

module.exports = function (input, options) {
  input = typeof input === 'string' ? utf8ToArray(input) : Array.prototype.slice.call(input);

  if (options) {
    var mode = options.mode || 'hmac';
    if (mode !== 'hmac') throw new Error('invalid mode');

    var key = options.key;
    if (!key) throw new Error('invalid key');

    key = typeof key === 'string' ? hexToArray(key) : Array.prototype.slice.call(key);
    return ArrayToHex(hmac(input, key));
  }

  return ArrayToHex(sm3(input));
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable no-bitwise, no-mixed-operators, complexity */
var DECRYPT = 0;
var ROUND = 32;
var BLOCK = 16;

var Sbox = [0xd6, 0x90, 0xe9, 0xfe, 0xcc, 0xe1, 0x3d, 0xb7, 0x16, 0xb6, 0x14, 0xc2, 0x28, 0xfb, 0x2c, 0x05, 0x2b, 0x67, 0x9a, 0x76, 0x2a, 0xbe, 0x04, 0xc3, 0xaa, 0x44, 0x13, 0x26, 0x49, 0x86, 0x06, 0x99, 0x9c, 0x42, 0x50, 0xf4, 0x91, 0xef, 0x98, 0x7a, 0x33, 0x54, 0x0b, 0x43, 0xed, 0xcf, 0xac, 0x62, 0xe4, 0xb3, 0x1c, 0xa9, 0xc9, 0x08, 0xe8, 0x95, 0x80, 0xdf, 0x94, 0xfa, 0x75, 0x8f, 0x3f, 0xa6, 0x47, 0x07, 0xa7, 0xfc, 0xf3, 0x73, 0x17, 0xba, 0x83, 0x59, 0x3c, 0x19, 0xe6, 0x85, 0x4f, 0xa8, 0x68, 0x6b, 0x81, 0xb2, 0x71, 0x64, 0xda, 0x8b, 0xf8, 0xeb, 0x0f, 0x4b, 0x70, 0x56, 0x9d, 0x35, 0x1e, 0x24, 0x0e, 0x5e, 0x63, 0x58, 0xd1, 0xa2, 0x25, 0x22, 0x7c, 0x3b, 0x01, 0x21, 0x78, 0x87, 0xd4, 0x00, 0x46, 0x57, 0x9f, 0xd3, 0x27, 0x52, 0x4c, 0x36, 0x02, 0xe7, 0xa0, 0xc4, 0xc8, 0x9e, 0xea, 0xbf, 0x8a, 0xd2, 0x40, 0xc7, 0x38, 0xb5, 0xa3, 0xf7, 0xf2, 0xce, 0xf9, 0x61, 0x15, 0xa1, 0xe0, 0xae, 0x5d, 0xa4, 0x9b, 0x34, 0x1a, 0x55, 0xad, 0x93, 0x32, 0x30, 0xf5, 0x8c, 0xb1, 0xe3, 0x1d, 0xf6, 0xe2, 0x2e, 0x82, 0x66, 0xca, 0x60, 0xc0, 0x29, 0x23, 0xab, 0x0d, 0x53, 0x4e, 0x6f, 0xd5, 0xdb, 0x37, 0x45, 0xde, 0xfd, 0x8e, 0x2f, 0x03, 0xff, 0x6a, 0x72, 0x6d, 0x6c, 0x5b, 0x51, 0x8d, 0x1b, 0xaf, 0x92, 0xbb, 0xdd, 0xbc, 0x7f, 0x11, 0xd9, 0x5c, 0x41, 0x1f, 0x10, 0x5a, 0xd8, 0x0a, 0xc1, 0x31, 0x88, 0xa5, 0xcd, 0x7b, 0xbd, 0x2d, 0x74, 0xd0, 0x12, 0xb8, 0xe5, 0xb4, 0xb0, 0x89, 0x69, 0x97, 0x4a, 0x0c, 0x96, 0x77, 0x7e, 0x65, 0xb9, 0xf1, 0x09, 0xc5, 0x6e, 0xc6, 0x84, 0x18, 0xf0, 0x7d, 0xec, 0x3a, 0xdc, 0x4d, 0x20, 0x79, 0xee, 0x5f, 0x3e, 0xd7, 0xcb, 0x39, 0x48];

var CK = [0x00070e15, 0x1c232a31, 0x383f464d, 0x545b6269, 0x70777e85, 0x8c939aa1, 0xa8afb6bd, 0xc4cbd2d9, 0xe0e7eef5, 0xfc030a11, 0x181f262d, 0x343b4249, 0x50575e65, 0x6c737a81, 0x888f969d, 0xa4abb2b9, 0xc0c7ced5, 0xdce3eaf1, 0xf8ff060d, 0x141b2229, 0x30373e45, 0x4c535a61, 0x686f767d, 0x848b9299, 0xa0a7aeb5, 0xbcc3cad1, 0xd8dfe6ed, 0xf4fb0209, 0x10171e25, 0x2c333a41, 0x484f565d, 0x646b7279];

/**
 * 16 进制串转字节数组
 */
function hexToArray(str) {
  var arr = [];
  for (var i = 0, len = str.length; i < len; i += 2) {
    arr.push(parseInt(str.substr(i, 2), 16));
  }
  return arr;
}

/**
 * 字节数组转 16 进制串
 */
function ArrayToHex(arr) {
  return arr.map(function (item) {
    item = item.toString(16);
    return item.length === 1 ? '0' + item : item;
  }).join('');
}

/**
 * utf8 串转字节数组
 */
function utf8ToArray(str) {
  var arr = [];

  for (var i = 0, len = str.length; i < len; i++) {
    var point = str.codePointAt(i);

    if (point <= 0x007f) {
      // 单字节，标量值：00000000 00000000 0zzzzzzz
      arr.push(point);
    } else if (point <= 0x07ff) {
      // 双字节，标量值：00000000 00000yyy yyzzzzzz
      arr.push(0xc0 | point >>> 6); // 110yyyyy（0xc0-0xdf）
      arr.push(0x80 | point & 0x3f); // 10zzzzzz（0x80-0xbf）
    } else if (point <= 0xD7FF || point >= 0xE000 && point <= 0xFFFF) {
      // 三字节：标量值：00000000 xxxxyyyy yyzzzzzz
      arr.push(0xe0 | point >>> 12); // 1110xxxx（0xe0-0xef）
      arr.push(0x80 | point >>> 6 & 0x3f); // 10yyyyyy（0x80-0xbf）
      arr.push(0x80 | point & 0x3f); // 10zzzzzz（0x80-0xbf）
    } else if (point >= 0x010000 && point <= 0x10FFFF) {
      // 四字节：标量值：000wwwxx xxxxyyyy yyzzzzzz
      i++;
      arr.push(0xf0 | point >>> 18 & 0x1c); // 11110www（0xf0-0xf7）
      arr.push(0x80 | point >>> 12 & 0x3f); // 10xxxxxx（0x80-0xbf）
      arr.push(0x80 | point >>> 6 & 0x3f); // 10yyyyyy（0x80-0xbf）
      arr.push(0x80 | point & 0x3f); // 10zzzzzz（0x80-0xbf）
    } else {
      // 五、六字节，暂时不支持
      arr.push(point);
      throw new Error('input is not supported');
    }
  }

  return arr;
}

/**
 * 字节数组转 utf8 串
 */
function arrayToUtf8(arr) {
  var str = [];
  for (var i = 0, len = arr.length; i < len; i++) {
    if (arr[i] >= 0xf0 && arr[i] <= 0xf7) {
      // 四字节
      str.push(String.fromCodePoint(((arr[i] & 0x07) << 18) + ((arr[i + 1] & 0x3f) << 12) + ((arr[i + 2] & 0x3f) << 6) + (arr[i + 3] & 0x3f)));
      i += 3;
    } else if (arr[i] >= 0xe0 && arr[i] <= 0xef) {
      // 三字节
      str.push(String.fromCodePoint(((arr[i] & 0x0f) << 12) + ((arr[i + 1] & 0x3f) << 6) + (arr[i + 2] & 0x3f)));
      i += 2;
    } else if (arr[i] >= 0xc0 && arr[i] <= 0xdf) {
      // 双字节
      str.push(String.fromCodePoint(((arr[i] & 0x1f) << 6) + (arr[i + 1] & 0x3f)));
      i++;
    } else {
      // 单字节
      str.push(String.fromCodePoint(arr[i]));
    }
  }

  return str.join('');
}

/**
 * 32 比特循环左移
 */
function rotl(x, y) {
  return x << y | x >>> 32 - y;
}

/**
 * 非线性变换
 */
function byteSub(a) {
  return (Sbox[a >>> 24 & 0xFF] & 0xFF) << 24 | (Sbox[a >>> 16 & 0xFF] & 0xFF) << 16 | (Sbox[a >>> 8 & 0xFF] & 0xFF) << 8 | Sbox[a & 0xFF] & 0xFF;
}

/**
 * 线性变换，加密/解密用
 */
function l1(b) {
  return b ^ rotl(b, 2) ^ rotl(b, 10) ^ rotl(b, 18) ^ rotl(b, 24);
}

/**
 * 线性变换，生成轮密钥用
 */
function l2(b) {
  return b ^ rotl(b, 13) ^ rotl(b, 23);
}

/**
 * 以一组 128 比特进行加密/解密操作
 */
function sms4Crypt(input, output, roundKey) {
  var x = new Array(4);

  // 字节数组转成字数组（此处 1 字 = 32 比特）
  var tmp = new Array(4);
  for (var i = 0; i < 4; i++) {
    tmp[0] = input[4 * i] & 0xff;
    tmp[1] = input[4 * i + 1] & 0xff;
    tmp[2] = input[4 * i + 2] & 0xff;
    tmp[3] = input[4 * i + 3] & 0xff;
    x[i] = tmp[0] << 24 | tmp[1] << 16 | tmp[2] << 8 | tmp[3];
  }

  // x[i + 4] = x[i] ^ l1(byteSub(x[i + 1] ^ x[i + 2] ^ x[i + 3] ^ roundKey[i]))
  for (var r = 0, mid; r < 32; r += 4) {
    mid = x[1] ^ x[2] ^ x[3] ^ roundKey[r + 0];
    x[0] ^= l1(byteSub(mid)); // x[4]

    mid = x[2] ^ x[3] ^ x[0] ^ roundKey[r + 1];
    x[1] ^= l1(byteSub(mid)); // x[5]

    mid = x[3] ^ x[0] ^ x[1] ^ roundKey[r + 2];
    x[2] ^= l1(byteSub(mid)); // x[6]

    mid = x[0] ^ x[1] ^ x[2] ^ roundKey[r + 3];
    x[3] ^= l1(byteSub(mid)); // x[7]
  }

  // 反序变换
  for (var j = 0; j < 16; j += 4) {
    output[j] = x[3 - j / 4] >>> 24 & 0xff;
    output[j + 1] = x[3 - j / 4] >>> 16 & 0xff;
    output[j + 2] = x[3 - j / 4] >>> 8 & 0xff;
    output[j + 3] = x[3 - j / 4] & 0xff;
  }
}

/**
 * 密钥扩展算法
 */
function sms4KeyExt(key, roundKey, cryptFlag) {
  var x = new Array(4);

  // 字节数组转成字数组（此处 1 字 = 32 比特）
  var tmp = new Array(4);
  for (var i = 0; i < 4; i++) {
    tmp[0] = key[0 + 4 * i] & 0xff;
    tmp[1] = key[1 + 4 * i] & 0xff;
    tmp[2] = key[2 + 4 * i] & 0xff;
    tmp[3] = key[3 + 4 * i] & 0xff;
    x[i] = tmp[0] << 24 | tmp[1] << 16 | tmp[2] << 8 | tmp[3];
  }

  // 与系统参数做异或
  x[0] ^= 0xa3b1bac6;
  x[1] ^= 0x56aa3350;
  x[2] ^= 0x677d9197;
  x[3] ^= 0xb27022dc;

  // roundKey[i] = x[i + 4] = x[i] ^ l2(byteSub(x[i + 1] ^ x[i + 2] ^ x[i + 3] ^ CK[i]))
  for (var r = 0, mid; r < 32; r += 4) {
    mid = x[1] ^ x[2] ^ x[3] ^ CK[r + 0];
    roundKey[r + 0] = x[0] ^= l2(byteSub(mid)); // x[4]

    mid = x[2] ^ x[3] ^ x[0] ^ CK[r + 1];
    roundKey[r + 1] = x[1] ^= l2(byteSub(mid)); // x[5]

    mid = x[3] ^ x[0] ^ x[1] ^ CK[r + 2];
    roundKey[r + 2] = x[2] ^= l2(byteSub(mid)); // x[6]

    mid = x[0] ^ x[1] ^ x[2] ^ CK[r + 3];
    roundKey[r + 3] = x[3] ^= l2(byteSub(mid)); // x[7]
  }

  // 解密时使用反序的轮密钥
  if (cryptFlag === DECRYPT) {
    for (var _r = 0, _mid; _r < 16; _r++) {
      _mid = roundKey[_r];
      roundKey[_r] = roundKey[31 - _r];
      roundKey[31 - _r] = _mid;
    }
  }
}

function sm4(inArray, key, cryptFlag) {
  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref$padding = _ref.padding,
      padding = _ref$padding === undefined ? 'pkcs#7' : _ref$padding,
      mode = _ref.mode,
      _ref$iv = _ref.iv,
      iv = _ref$iv === undefined ? [] : _ref$iv,
      _ref$output = _ref.output,
      output = _ref$output === undefined ? 'string' : _ref$output;

  if (mode === 'cbc') {
    // CBC 模式，默认走 ECB 模式
    if (typeof iv === 'string') iv = hexToArray(iv);
    if (iv.length !== 128 / 8) {
      // iv 不是 128 比特
      throw new Error('iv is invalid');
    }
  }

  // 检查 key
  if (typeof key === 'string') key = hexToArray(key);
  if (key.length !== 128 / 8) {
    // key 不是 128 比特
    throw new Error('key is invalid');
  }

  // 检查输入
  if (typeof inArray === 'string') {
    if (cryptFlag !== DECRYPT) {
      // 加密，输入为 utf8 串
      inArray = utf8ToArray(inArray);
    } else {
      // 解密，输入为 16 进制串
      inArray = hexToArray(inArray);
    }
  } else {
    inArray = [].concat(inArray);
  }

  // 新增填充，sm4 是 16 个字节一个分组，所以统一走到 pkcs#7
  if ((padding === 'pkcs#5' || padding === 'pkcs#7') && cryptFlag !== DECRYPT) {
    var paddingCount = BLOCK - inArray.length % BLOCK;
    for (var i = 0; i < paddingCount; i++) {
      inArray.push(paddingCount);
    }
  }

  // 生成轮密钥
  var roundKey = new Array(ROUND);
  sms4KeyExt(key, roundKey, cryptFlag);

  var outArray = [];
  var lastVector = iv;
  var restLen = inArray.length;
  var point = 0;
  while (restLen >= BLOCK) {
    var input = inArray.slice(point, point + 16);
    var _output = new Array(16);

    if (mode === 'cbc') {
      for (var _i = 0; _i < BLOCK; _i++) {
        if (cryptFlag !== DECRYPT) {
          // 加密过程在组加密前进行异或
          input[_i] ^= lastVector[_i];
        }
      }
    }

    sms4Crypt(input, _output, roundKey);

    for (var _i2 = 0; _i2 < BLOCK; _i2++) {
      if (mode === 'cbc') {
        if (cryptFlag === DECRYPT) {
          // 解密过程在组解密后进行异或
          _output[_i2] ^= lastVector[_i2];
        }
      }

      outArray[point + _i2] = _output[_i2];
    }

    if (mode === 'cbc') {
      if (cryptFlag !== DECRYPT) {
        // 使用上一次输出作为加密向量
        lastVector = _output;
      } else {
        // 使用上一次输入作为解密向量
        lastVector = input;
      }
    }

    restLen -= BLOCK;
    point += BLOCK;
  }

  // 去除填充，sm4 是 16 个字节一个分组，所以统一走到 pkcs#7
  if ((padding === 'pkcs#5' || padding === 'pkcs#7') && cryptFlag === DECRYPT) {
    var len = outArray.length;
    var _paddingCount = outArray[len - 1];
    for (var _i3 = 1; _i3 <= _paddingCount; _i3++) {
      if (outArray[len - _i3] !== _paddingCount) throw new Error('padding is invalid');
    }
    outArray.splice(len - _paddingCount, _paddingCount);
  }

  // 调整输出
  if (output !== 'array') {
    if (cryptFlag !== DECRYPT) {
      // 加密，输出转 16 进制串
      return ArrayToHex(outArray);
    } else {
      // 解密，输出转 utf8 串
      return arrayToUtf8(outArray);
    }
  } else {
    return outArray;
  }
}

module.exports = {
  encrypt: function encrypt(inArray, key, options) {
    return sm4(inArray, key, 1, options);
  },
  decrypt: function decrypt(inArray, key, options) {
    return sm4(inArray, key, 0, options);
  }
};

/***/ })
/******/ ]);