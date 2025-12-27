function We() {
  return "contract";
}
var fe = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(t) {
      this.groups = [], this.each = !1, this.context = void 0, this.type = t.type, this.name = t.name, this.target = t.target, this.propertyName = t.propertyName, this.constraints = t?.constraints, this.constraintCls = t.constraintCls, this.validationTypeOptions = t.validationTypeOptions, t.validationOptions && (this.message = t.validationOptions.message, this.groups = t.validationOptions.groups, this.always = t.validationOptions.always, this.each = t.validationOptions.each, this.context = t.validationOptions.context);
    }
    return e;
  })()
), he = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.transform = function(t) {
      var r = [];
      return Object.keys(t.properties).forEach(function(n) {
        t.properties[n].forEach(function(i) {
          var s = {
            message: i.message,
            groups: i.groups,
            always: i.always,
            each: i.each
          }, o = {
            type: i.type,
            name: i.name,
            target: t.name,
            propertyName: n,
            constraints: i.constraints,
            validationTypeOptions: i.options,
            validationOptions: s
          };
          r.push(new fe(o));
        });
      }), r;
    }, e;
  })()
);
function me() {
  if (typeof globalThis < "u")
    return globalThis;
  if (typeof global < "u")
    return global;
  if (typeof window < "u")
    return window;
  if (typeof self < "u")
    return self;
}
var _e = function(e) {
  var t = typeof Symbol == "function" && Symbol.iterator, r = t && e[t], n = 0;
  if (r) return r.call(e);
  if (e && typeof e.length == "number") return {
    next: function() {
      return e && n >= e.length && (e = void 0), { value: e && e[n++], done: !e };
    }
  };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, K = function(e, t) {
  var r = typeof Symbol == "function" && e[Symbol.iterator];
  if (!r) return e;
  var n = r.call(e), i, s = [], o;
  try {
    for (; (t === void 0 || t-- > 0) && !(i = n.next()).done; ) s.push(i.value);
  } catch (f) {
    o = { error: f };
  } finally {
    try {
      i && !i.done && (r = n.return) && r.call(n);
    } finally {
      if (o) throw o.error;
    }
  }
  return s;
}, xe = function(e, t, r) {
  if (r || arguments.length === 2) for (var n = 0, i = t.length, s; n < i; n++)
    (s || !(n in t)) && (s || (s = Array.prototype.slice.call(t, 0, n)), s[n] = t[n]);
  return e.concat(s || Array.prototype.slice.call(t));
}, le = (
  /** @class */
  (function() {
    function e() {
      this.validationMetadatas = /* @__PURE__ */ new Map(), this.constraintMetadatas = /* @__PURE__ */ new Map();
    }
    return Object.defineProperty(e.prototype, "hasValidationMetaData", {
      get: function() {
        return !!this.validationMetadatas.size;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.addValidationSchema = function(t) {
      var r = this, n = new he().transform(t);
      n.forEach(function(i) {
        return r.addValidationMetadata(i);
      });
    }, e.prototype.addValidationMetadata = function(t) {
      var r = this.validationMetadatas.get(t.target);
      r ? r.push(t) : this.validationMetadatas.set(t.target, [t]);
    }, e.prototype.addConstraintMetadata = function(t) {
      var r = this.constraintMetadatas.get(t.target);
      r ? r.push(t) : this.constraintMetadatas.set(t.target, [t]);
    }, e.prototype.groupByPropertyName = function(t) {
      var r = {};
      return t.forEach(function(n) {
        r[n.propertyName] || (r[n.propertyName] = []), r[n.propertyName].push(n);
      }), r;
    }, e.prototype.getTargetValidationMetadatas = function(t, r, n, i, s) {
      var o, f, u = function(a) {
        return typeof a.always < "u" ? a.always : a.groups && a.groups.length ? !1 : n;
      }, g = function(a) {
        return !!(i && (!s || !s.length) && a.groups && a.groups.length);
      }, h = this.validationMetadatas.get(t) || [], d = h.filter(function(a) {
        return a.target !== t && a.target !== r ? !1 : u(a) ? !0 : g(a) ? !1 : s && s.length > 0 ? a.groups && !!a.groups.find(function(_) {
          return s.indexOf(_) !== -1;
        }) : !0;
      }), y = [];
      try {
        for (var x = _e(this.validationMetadatas.entries()), b = x.next(); !b.done; b = x.next()) {
          var D = K(b.value, 2), L = D[0], U = D[1];
          t.prototype instanceof L && y.push.apply(y, xe([], K(U), !1));
        }
      } catch (a) {
        o = { error: a };
      } finally {
        try {
          b && !b.done && (f = x.return) && f.call(x);
        } finally {
          if (o) throw o.error;
        }
      }
      var B = y.filter(function(a) {
        return typeof a.target == "string" || a.target === t || a.target instanceof Function && !(t.prototype instanceof a.target) ? !1 : u(a) ? !0 : g(a) ? !1 : s && s.length > 0 ? a.groups && !!a.groups.find(function(_) {
          return s.indexOf(_) !== -1;
        }) : !0;
      }), v = B.filter(function(a) {
        return !d.find(function(_) {
          return _.propertyName === a.propertyName && _.type === a.type;
        });
      });
      return d.concat(v);
    }, e.prototype.getTargetValidatorConstraints = function(t) {
      return this.constraintMetadatas.get(t) || [];
    }, e;
  })()
);
function ee() {
  var e = me();
  return e.classValidatorMetadataStorage || (e.classValidatorMetadataStorage = new le()), e.classValidatorMetadataStorage;
}
var te = (
  /** @class */
  (function() {
    function e() {
    }
    return e.isValid = function(t) {
      var r = this;
      return t !== "isValid" && t !== "getMessage" && Object.keys(this).map(function(n) {
        return r[n];
      }).indexOf(t) !== -1;
    }, e.CUSTOM_VALIDATION = "customValidation", e.NESTED_VALIDATION = "nestedValidation", e.PROMISE_VALIDATION = "promiseValidation", e.CONDITIONAL_VALIDATION = "conditionalValidation", e.WHITELIST = "whitelistValidation", e.IS_DEFINED = "isDefined", e;
  })()
), be = new /** @class */
((function() {
  function e() {
    this.instances = [];
  }
  return e.prototype.get = function(t) {
    var r = this.instances.find(function(n) {
      return n.type === t;
    });
    return r || (r = { type: t, object: new t() }, this.instances.push(r)), r.object;
  }, e;
})())();
function ce(e) {
  return be.get(e);
}
var we = (
  /** @class */
  (function() {
    function e(t, r, n) {
      n === void 0 && (n = !1), this.target = t, this.name = r, this.async = n;
    }
    return Object.defineProperty(e.prototype, "instance", {
      // -------------------------------------------------------------------------
      // Accessors
      // -------------------------------------------------------------------------
      /**
       * Instance of the target custom validation class which performs validation.
       */
      get: function() {
        return ce(this.target);
      },
      enumerable: !1,
      configurable: !0
    }), e;
  })()
);
function Me(e) {
  var t;
  if (e.validator instanceof Function) {
    t = e.validator;
    var r = ce(le).getTargetValidatorConstraints(e.validator);
    if (r.length > 1)
      throw "More than one implementation of ValidatorConstraintInterface found for validator on: ".concat(e.target.name, ":").concat(e.propertyName);
  } else {
    var n = e.validator;
    t = /** @class */
    (function() {
      function s() {
      }
      return s.prototype.validate = function(o, f) {
        return n.validate(o, f);
      }, s.prototype.defaultMessage = function(o) {
        return n.defaultMessage ? n.defaultMessage(o) : "";
      }, s;
    })(), ee().addConstraintMetadata(new we(t, e.name, e.async));
  }
  var i = {
    type: e.name && te.isValid(e.name) ? e.name : te.CUSTOM_VALIDATION,
    name: e.name,
    target: e.target,
    propertyName: e.propertyName,
    validationOptions: e.options,
    constraintCls: t,
    constraints: e.constraints
  };
  ee().addValidationMetadata(new fe(i));
}
function S(e, t) {
  return function(r) {
    var n = "";
    return e(n, r);
  };
}
function F(e, t) {
  return function(r, n) {
    Me({
      name: e.name,
      target: r.constructor,
      propertyName: n,
      options: t,
      constraints: e.constraints,
      validator: e.validator
    });
  };
}
function Ie(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var E = { exports: {} }, re;
function R() {
  return re || (re = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", {
      value: !0
    }), t.default = r;
    function r(n) {
      if (n == null) throw new TypeError("Expected a string but received a ".concat(n));
      if (n.constructor.name !== "String") throw new TypeError("Expected a string but received a ".concat(n.constructor.name));
    }
    e.exports = t.default, e.exports.default = t.default;
  })(E, E.exports)), E.exports;
}
var N = { exports: {} }, ne;
function de() {
  return ne || (ne = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", {
      value: !0
    }), t.default = r;
    function r() {
      var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0;
      for (var s in i)
        typeof n[s] > "u" && (n[s] = i[s]);
      return n;
    }
    e.exports = t.default, e.exports.default = t.default;
  })(N, N.exports)), N.exports;
}
var Se = "isNotEmpty";
function Fe(e) {
  return e !== "" && e !== null && e !== void 0;
}
function l(e) {
  return F({
    name: Se,
    validator: {
      validate: function(t, r) {
        return Fe(t);
      },
      defaultMessage: S(function(t) {
        return t + "$property should not be empty";
      })
    }
  }, e);
}
var A = { exports: {} }, ae;
function De() {
  return ae || (ae = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", {
      value: !0
    }), t.default = s;
    var r = n(/* @__PURE__ */ R());
    function n(o) {
      return o && o.__esModule ? o : { default: o };
    }
    function i(o) {
      "@babel/helpers - typeof";
      return i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(f) {
        return typeof f;
      } : function(f) {
        return f && typeof Symbol == "function" && f.constructor === Symbol && f !== Symbol.prototype ? "symbol" : typeof f;
      }, i(o);
    }
    function s(o, f) {
      (0, r.default)(o);
      var u, g;
      i(f) === "object" ? (u = f.min || 0, g = f.max) : (u = arguments[1], g = arguments[2]);
      var h = encodeURI(o).split(/%..|./).length - 1;
      return h >= u && (typeof g > "u" || h <= g);
    }
    e.exports = t.default, e.exports.default = t.default;
  })(A, A.exports)), A.exports;
}
var T = { exports: {} }, V = { exports: {} }, ie;
function Oe() {
  return ie || (ie = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", {
      value: !0
    }), t.default = n;
    function r(i) {
      return Object.prototype.toString.call(i) === "[object RegExp]";
    }
    function n(i, s) {
      for (var o = 0; o < s.length; o++) {
        var f = s[o];
        if (i === f || r(f) && f.test(i))
          return !0;
      }
      return !1;
    }
    e.exports = t.default, e.exports.default = t.default;
  })(V, V.exports)), V.exports;
}
var q = { exports: {} }, oe;
function Ee() {
  return oe || (oe = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", {
      value: !0
    }), t.default = o;
    var r = i(/* @__PURE__ */ R()), n = i(/* @__PURE__ */ de());
    function i(f) {
      return f && f.__esModule ? f : { default: f };
    }
    var s = {
      require_tld: !0,
      allow_underscores: !1,
      allow_trailing_dot: !1,
      allow_numeric_tld: !1,
      allow_wildcard: !1,
      ignore_max_length: !1
    };
    function o(f, u) {
      (0, r.default)(f), u = (0, n.default)(u, s), u.allow_trailing_dot && f[f.length - 1] === "." && (f = f.substring(0, f.length - 1)), u.allow_wildcard === !0 && f.indexOf("*.") === 0 && (f = f.substring(2));
      var g = f.split("."), h = g[g.length - 1];
      return u.require_tld && (g.length < 2 || !u.allow_numeric_tld && !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(h) || /\s/.test(h)) || !u.allow_numeric_tld && /^\d+$/.test(h) ? !1 : g.every(function(d) {
        return !(d.length > 63 && !u.ignore_max_length || !/^[a-z_\u00a1-\uffff0-9-]+$/i.test(d) || /[\uff01-\uff5e]/.test(d) || /^-|-$/.test(d) || !u.allow_underscores && /_/.test(d));
      });
    }
    e.exports = t.default, e.exports.default = t.default;
  })(q, q.exports)), q.exports;
}
var P = { exports: {} }, ue;
function Ne() {
  return ue || (ue = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", {
      value: !0
    }), t.default = h;
    var r = n(/* @__PURE__ */ R());
    function n(d) {
      return d && d.__esModule ? d : { default: d };
    }
    function i(d) {
      "@babel/helpers - typeof";
      return i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(y) {
        return typeof y;
      } : function(y) {
        return y && typeof Symbol == "function" && y.constructor === Symbol && y !== Symbol.prototype ? "symbol" : typeof y;
      }, i(d);
    }
    var s = "(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])", o = "(".concat(s, "[.]){3}").concat(s), f = new RegExp("^".concat(o, "$")), u = "(?:[0-9a-fA-F]{1,4})", g = new RegExp("^(" + "(?:".concat(u, ":){7}(?:").concat(u, "|:)|") + "(?:".concat(u, ":){6}(?:").concat(o, "|:").concat(u, "|:)|") + "(?:".concat(u, ":){5}(?::").concat(o, "|(:").concat(u, "){1,2}|:)|") + "(?:".concat(u, ":){4}(?:(:").concat(u, "){0,1}:").concat(o, "|(:").concat(u, "){1,3}|:)|") + "(?:".concat(u, ":){3}(?:(:").concat(u, "){0,2}:").concat(o, "|(:").concat(u, "){1,4}|:)|") + "(?:".concat(u, ":){2}(?:(:").concat(u, "){0,3}:").concat(o, "|(:").concat(u, "){1,5}|:)|") + "(?:".concat(u, ":){1}(?:(:").concat(u, "){0,4}:").concat(o, "|(:").concat(u, "){1,6}|:)|") + "(?::((?::".concat(u, "){0,5}:").concat(o, "|(?::").concat(u, "){1,7}|:))") + ")(%[0-9a-zA-Z.]{1,})?$");
    function h(d) {
      var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      (0, r.default)(d);
      var x = (i(y) === "object" ? y.version : arguments[1]) || "";
      return x ? x.toString() === "4" ? f.test(d) : x.toString() === "6" ? g.test(d) : !1 : h(d, {
        version: 4
      }) || h(d, {
        version: 6
      });
    }
    e.exports = t.default, e.exports.default = t.default;
  })(P, P.exports)), P.exports;
}
var se;
function Ae() {
  return se || (se = 1, (function(e, t) {
    Object.defineProperty(t, "__esModule", {
      value: !0
    }), t.default = B;
    var r = u(/* @__PURE__ */ R()), n = u(/* @__PURE__ */ Oe()), i = u(/* @__PURE__ */ De()), s = u(/* @__PURE__ */ Ee()), o = u(/* @__PURE__ */ Ne()), f = u(/* @__PURE__ */ de());
    function u(v) {
      return v && v.__esModule ? v : { default: v };
    }
    var g = {
      allow_display_name: !1,
      allow_underscores: !1,
      require_display_name: !1,
      allow_utf8_local_part: !0,
      require_tld: !0,
      blacklisted_chars: "",
      ignore_max_length: !1,
      host_blacklist: [],
      host_whitelist: []
    }, h = /^([^\x00-\x1F\x7F-\x9F\cX]+)</i, d = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i, y = /^[a-z\d]+$/, x = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i, b = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i, D = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i, L = 254;
    function U(v) {
      var a = v.replace(/^"(.+)"$/, "$1");
      if (!a.trim())
        return !1;
      var _ = /[\.";<>]/.test(a);
      if (_) {
        if (a === v)
          return !1;
        var w = a.split('"').length === a.split('\\"').length;
        if (!w)
          return !1;
      }
      return !0;
    }
    function B(v, a) {
      if ((0, r.default)(v), a = (0, f.default)(a, g), a.require_display_name || a.allow_display_name) {
        var _ = v.match(h);
        if (_) {
          var w = _[1];
          if (v = v.replace(w, "").replace(/(^<|>$)/g, ""), w.endsWith(" ") && (w = w.slice(0, -1)), !U(w))
            return !1;
        } else if (a.require_display_name)
          return !1;
      }
      if (!a.ignore_max_length && v.length > L)
        return !1;
      var X = v.split("@"), M = X.pop(), O = M.toLowerCase();
      if (a.host_blacklist.length > 0 && (0, n.default)(O, a.host_blacklist) || a.host_whitelist.length > 0 && !(0, n.default)(O, a.host_whitelist))
        return !1;
      var m = X.join("@");
      if (a.domain_specific_validation && (O === "gmail.com" || O === "googlemail.com")) {
        m = m.toLowerCase();
        var Y = m.split("+")[0];
        if (!(0, i.default)(Y.replace(/\./g, ""), {
          min: 6,
          max: 30
        }))
          return !1;
        for (var Z = Y.split("."), z = 0; z < Z.length; z++)
          if (!y.test(Z[z]))
            return !1;
      }
      if (a.ignore_max_length === !1 && (!(0, i.default)(m, {
        max: 64
      }) || !(0, i.default)(M, {
        max: 254
      })))
        return !1;
      if (!(0, s.default)(M, {
        require_tld: a.require_tld,
        ignore_max_length: a.ignore_max_length,
        allow_underscores: a.allow_underscores
      })) {
        if (!a.allow_ip_domain)
          return !1;
        if (!(0, o.default)(M)) {
          if (!M.startsWith("[") || !M.endsWith("]"))
            return !1;
          var $ = M.slice(1, -1);
          if ($.length === 0 || !(0, o.default)($))
            return !1;
        }
      }
      if (a.blacklisted_chars && m.search(new RegExp("[".concat(a.blacklisted_chars, "]+"), "g")) !== -1)
        return !1;
      if (m[0] === '"' && m[m.length - 1] === '"')
        return m = m.slice(1, m.length - 1), a.allow_utf8_local_part ? D.test(m) : x.test(m);
      for (var ye = a.allow_utf8_local_part ? b : d, J = m.split("."), H = 0; H < J.length; H++)
        if (!ye.test(J[H]))
          return !1;
      return !0;
    }
    e.exports = t.default, e.exports.default = t.default;
  })(T, T.exports)), T.exports;
}
var Te = /* @__PURE__ */ Ae();
const Ve = /* @__PURE__ */ Ie(Te);
var qe = "isEmail";
function Pe(e, t) {
  return typeof e == "string" && Ve(e, t);
}
function Re(e, t) {
  return F({
    name: qe,
    constraints: [e],
    validator: {
      validate: function(r, n) {
        return Pe(r, n?.constraints[0]);
      },
      defaultMessage: S(function(r) {
        return r + "$property must be an email";
      })
    }
  }, t);
}
var ke = "isDate";
function Ce(e) {
  return e instanceof Date && !isNaN(e.getTime());
}
function k(e) {
  return F({
    name: ke,
    validator: {
      validate: function(t, r) {
        return Ce(t);
      },
      defaultMessage: S(function(t) {
        return t + "$property must be a Date instance";
      })
    }
  }, e);
}
var je = "isNumber";
function Le(e, t) {
  if (t === void 0 && (t = {}), typeof e != "number")
    return !1;
  if (e === 1 / 0 || e === -1 / 0)
    return !!t.allowInfinity;
  if (Number.isNaN(e))
    return !!t.allowNaN;
  if (t.maxDecimalPlaces !== void 0) {
    var r = 0;
    if (e % 1 !== 0 && (r = e.toString().split(".")[1].length), r > t.maxDecimalPlaces)
      return !1;
  }
  return Number.isFinite(e);
}
function C(e, t) {
  return e === void 0 && (e = {}), F({
    name: je,
    constraints: [e],
    validator: {
      validate: function(r, n) {
        return Le(r, n?.constraints[0]);
      },
      defaultMessage: S(function(r) {
        return r + "$property must be a number conforming to the specified constraints";
      })
    }
  }, t);
}
var Ue = "isString";
function Be(e) {
  return e instanceof String || typeof e == "string";
}
function p(e) {
  return F({
    name: Ue,
    validator: {
      validate: function(t, r) {
        return Be(t);
      },
      defaultMessage: S(function(t) {
        return t + "$property must be a string";
      })
    }
  }, e);
}
var ze = Object.defineProperty, c = (e, t, r, n) => {
  for (var i = void 0, s = e.length - 1, o; s >= 0; s--)
    (o = e[s]) && (i = o(t, r, i) || i);
  return i && ze(t, r, i), i;
};
class j {
  constructor(t, r, n, i) {
    this.token = t, this.refreshToken = r, this.userId = n, this.name = i;
  }
  token;
  refreshToken;
  userId;
  name;
}
c([
  p(),
  l()
], j.prototype, "token");
c([
  p(),
  l()
], j.prototype, "refreshToken");
c([
  C(),
  l()
], j.prototype, "userId");
c([
  p(),
  l()
], j.prototype, "name");
class I {
  token;
  userId;
  name;
  expiresAt;
  createdAt;
  updatedAt;
}
c([
  p(),
  l()
], I.prototype, "token");
c([
  C(),
  l()
], I.prototype, "userId");
c([
  p(),
  l()
], I.prototype, "name");
c([
  k(),
  l()
], I.prototype, "expiresAt");
c([
  k(),
  l()
], I.prototype, "createdAt");
c([
  k(),
  l()
], I.prototype, "updatedAt");
class pe {
  email;
  password;
}
c([
  p(),
  l()
], pe.prototype, "email");
c([
  p(),
  l()
], pe.prototype, "password");
class He {
  userId;
}
c([
  C(),
  l()
], He.prototype, "userId");
class Q {
  email;
  password;
  name;
}
c([
  p(),
  l()
], Q.prototype, "email");
c([
  p(),
  l()
], Q.prototype, "password");
c([
  p(),
  l()
], Q.prototype, "name");
class Qe {
  email;
}
c([
  p(),
  l()
], Qe.prototype, "email");
class ge {
  token;
  password;
}
c([
  p(),
  l()
], ge.prototype, "token");
c([
  p(),
  l()
], ge.prototype, "password");
class W {
  token;
  expiresAt;
  resetLink;
}
c([
  p(),
  l()
], W.prototype, "token");
c([
  k(),
  l()
], W.prototype, "expiresAt");
c([
  p(),
  l()
], W.prototype, "resetLink");
class ve {
  userId;
  redirect;
}
c([
  C(),
  l()
], ve.prototype, "userId");
c([
  p(),
  l()
], ve.prototype, "redirect");
class G {
  email;
  name;
  password;
}
c([
  Re(),
  l()
], G.prototype, "email");
c([
  p(),
  l()
], G.prototype, "name");
c([
  p(),
  l()
], G.prototype, "password");
export {
  G as CreateUserDto,
  pe as LoginDto,
  ve as LoginResponseDto,
  ge as ResetConfirmDto,
  Qe as ResetRequestDto,
  W as ResetResponseDto,
  I as SessionDto,
  He as SignoutDto,
  Q as SignupDto,
  j as UserIdentityDto,
  We as contract
};
