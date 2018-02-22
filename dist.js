'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (conf) {
  var config = {
    sessionName: 'default',
    baseURL: 'https://boss.myseu.cn/ws3/',
    requestDelegate: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url, method, headers, body) {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return require('axios')({ url: url, method: method, headers: headers, data: body });

              case 2:
                return _context.abrupt('return', _context.sent.data);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function requestDelegate(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }(),
    storageDelegate: {
      set: function set(key, value) {
        var _this = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  return _context2.abrupt('return', require('js-cookie').set(key, value));

                case 1:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this);
        }))();
      },
      get: function get(key) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
          return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  return _context3.abrupt('return', require('js-cookie').get(key));

                case 1:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this2);
        }))();
      }
    },
    onLogin: function onLogin(newToken) {},
    onLogout: function onLogout(oldToken) {},
    onError: function onError(res) {
      var e = new Error(res.reason);
      e.code = res.code;
      throw e;
    }
  };

  for (var key in conf) {
    config[key] = conf[key];
  }

  var token = null;

  var tokenKey = 'herald-' + config.sessionName + '-token';

  var changeToken = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(newValue) {
      var oldToken;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!token) {
                _context4.next = 10;
                break;
              }

              oldToken = token;

              token = null;

              if (!config.storageDelegate) {
                _context4.next = 6;
                break;
              }

              _context4.next = 6;
              return config.storageDelegate.set(tokenKey, '');

            case 6:
              _context4.t0 = config.onLogout;

              if (!_context4.t0) {
                _context4.next = 10;
                break;
              }

              _context4.next = 10;
              return config.onLogout(oldToken);

            case 10:
              token = newValue;

              if (!token) {
                _context4.next = 16;
                break;
              }

              config.onLogin && config.onLogin(token);

              if (!config.storageDelegate) {
                _context4.next = 16;
                break;
              }

              _context4.next = 16;
              return config.storageDelegate.set(tokenKey, token);

            case 16:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    }));

    return function changeToken(_x5) {
      return _ref2.apply(this, arguments);
    };
  }();

  var RouteBuilder = function RouteBuilder() {
    var route = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var handler = function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var last, method, path, url, body, headers, res;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                last = route[route.length - 1];
                method = ['get', 'post', 'put', 'delete'].find(function (k) {
                  return k === last;
                });

                if (!method) {
                  method = 'get';
                } else {
                  route.splice(-1, 1);
                }

                path = route.join('/');

                if (!(path === 'deauth')) {
                  _context5.next = 8;
                  break;
                }

                _context5.next = 7;
                return changeToken(null);

              case 7:
                return _context5.abrupt('return');

              case 8:
                url = config.baseURL + path;
                body = null, headers = {};

                if (method === 'get' || method === 'delete') {
                  url += '?' + (typeof params === 'string' ? params : (0, _keys2.default)(params).map(function (k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
                  }).join('&'));
                } else {
                  body = typeof params === 'string' ? params : (0, _stringify2.default)(params);
                  headers['Content-Type'] = 'application/json';
                }

                if (token) {
                  headers.token = token;
                }

                res = void 0;
                _context5.prev = 13;
                _context5.next = 16;
                return config.requestDelegate(url, method.toUpperCase(), headers, body);

              case 16:
                res = _context5.sent;
                _context5.next = 22;
                break;

              case 19:
                _context5.prev = 19;
                _context5.t0 = _context5['catch'](13);

                res = {
                  success: false,
                  code: 599,
                  reason: '请求失败'
                };

              case 22:

                if (typeof res === 'string') {
                  try {
                    res = JSON.parse(res);
                  } catch (e) {}
                }

                if (!res.success) {
                  _context5.next = 30;
                  break;
                }

                if (!(path === 'auth')) {
                  _context5.next = 27;
                  break;
                }

                _context5.next = 27;
                return changeToken(res.result);

              case 27:
                return _context5.abrupt('return', res.result);

              case 30:
                return _context5.abrupt('return', config.onError && config.onError(res));

              case 31:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, undefined, [[13, 19]]);
      }));

      return function handler() {
        return _ref3.apply(this, arguments);
      };
    }();

    var toString = function toString() {
      var _route = route;
      var last = _route[_route.length - 1];
      var method = ['get', 'post', 'put', 'delete'].find(function (k) {
        return k === last;
      });
      if (!method) {
        method = 'get';
      } else {
        _route.splice(-1, 1);
      }

      var path = _route.join('/');
      if (path === 'deauth') {
        return 'Call this function to deauth';
      } else {
        return 'Call this function to ' + method.toUpperCase() + ' ' + config.baseURL + path;
      }
    };

    var builder = new Proxy(handler, {
      set: function set(target, key, value) {
        if (key === 'token') {
          changeToken(value);
          return true;
        }
        return false;
      },
      get: function get(target, key) {
        if (key === 'isLogin') {
          return !!token;
        } else if (key === 'token') {
          return token || null;
        } else if (key === 'name') {
          return toString();
        } else if (key === 'toString' || key === 'valueOf') {
          return toString;
        } else if (key === 'inspect' || key === 'then') {
          return undefined;
        } else if (key === '__proto__') {
          return {};
        } else if (key === 'hasOwnProperty') {
          return function (k) {
            return k === 'token';
          };
        } else if (typeof key === 'string') {
          return RouteBuilder(route.concat(key));
        }
      }
    });

    return builder;
  };

  var prepare = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!config.storageDelegate) {
                _context6.next = 4;
                break;
              }

              _context6.next = 3;
              return config.storageDelegate.get(tokenKey);

            case 3:
              token = _context6.sent;

            case 4:
              if (token) {
                config.onLogin && config.onLogin(token);
              }

            case 5:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    }));

    return function prepare() {
      return _ref4.apply(this, arguments);
    };
  }();

  /* noawait */prepare();

  return RouteBuilder();
};
