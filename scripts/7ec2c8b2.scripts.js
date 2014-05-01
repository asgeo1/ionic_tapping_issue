(function () {
  (function (window, document, undefined) {
    'use strict';
    function minErr(module) {
      return function () {
        var code = arguments[0], prefix = '[' + (module ? module + ':' : '') + code + '] ', template = arguments[1], templateArgs = arguments, stringify = function (obj) {
            if (typeof obj === 'function') {
              return obj.toString().replace(/ \{[\s\S]*$/, '');
            } else if (typeof obj === 'undefined') {
              return 'undefined';
            } else if (typeof obj !== 'string') {
              return JSON.stringify(obj);
            }
            return obj;
          }, message, i;
        message = prefix + template.replace(/\{\d+\}/g, function (match) {
          var index = +match.slice(1, -1), arg;
          if (index + 2 < templateArgs.length) {
            arg = templateArgs[index + 2];
            if (typeof arg === 'function') {
              return arg.toString().replace(/ ?\{[\s\S]*$/, '');
            } else if (typeof arg === 'undefined') {
              return 'undefined';
            } else if (typeof arg !== 'string') {
              return toJson(arg);
            }
            return arg;
          }
          return match;
        });
        message = message + '\nhttp://errors.angularjs.org/1.2.12/' + (module ? module + '/' : '') + code;
        for (i = 2; i < arguments.length; i++) {
          message = message + (i == 2 ? '?' : '&') + 'p' + (i - 2) + '=' + encodeURIComponent(stringify(arguments[i]));
        }
        return new Error(message);
      };
    }
    var lowercase = function (string) {
      return isString(string) ? string.toLowerCase() : string;
    };
    var uppercase = function (string) {
      return isString(string) ? string.toUpperCase() : string;
    };
    var manualLowercase = function (s) {
      return isString(s) ? s.replace(/[A-Z]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) | 32);
      }) : s;
    };
    var manualUppercase = function (s) {
      return isString(s) ? s.replace(/[a-z]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) & ~32);
      }) : s;
    };
    if ('i' !== 'I'.toLowerCase()) {
      lowercase = manualLowercase;
      uppercase = manualUppercase;
    }
    var msie, jqLite, jQuery, slice = [].slice, push = [].push, toString = Object.prototype.toString, ngMinErr = minErr('ng'), _angular = window.angular, angular = window.angular || (window.angular = {}), angularModule, nodeName_, uid = [
        '0',
        '0',
        '0'
      ];
    msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
    if (isNaN(msie)) {
      msie = int((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
    }
    function isArrayLike(obj) {
      if (obj == null || isWindow(obj)) {
        return false;
      }
      var length = obj.length;
      if (obj.nodeType === 1 && length) {
        return true;
      }
      return isString(obj) || isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj;
    }
    function forEach(obj, iterator, context) {
      var key;
      if (obj) {
        if (isFunction(obj)) {
          for (key in obj) {
            if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
              iterator.call(context, obj[key], key);
            }
          }
        } else if (obj.forEach && obj.forEach !== forEach) {
          obj.forEach(iterator, context);
        } else if (isArrayLike(obj)) {
          for (key = 0; key < obj.length; key++)
            iterator.call(context, obj[key], key);
        } else {
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              iterator.call(context, obj[key], key);
            }
          }
        }
      }
      return obj;
    }
    function sortedKeys(obj) {
      var keys = [];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          keys.push(key);
        }
      }
      return keys.sort();
    }
    function forEachSorted(obj, iterator, context) {
      var keys = sortedKeys(obj);
      for (var i = 0; i < keys.length; i++) {
        iterator.call(context, obj[keys[i]], keys[i]);
      }
      return keys;
    }
    function reverseParams(iteratorFn) {
      return function (value, key) {
        iteratorFn(key, value);
      };
    }
    function nextUid() {
      var index = uid.length;
      var digit;
      while (index) {
        index--;
        digit = uid[index].charCodeAt(0);
        if (digit == 57) {
          uid[index] = 'A';
          return uid.join('');
        }
        if (digit == 90) {
          uid[index] = '0';
        } else {
          uid[index] = String.fromCharCode(digit + 1);
          return uid.join('');
        }
      }
      uid.unshift('0');
      return uid.join('');
    }
    function setHashKey(obj, h) {
      if (h) {
        obj.$$hashKey = h;
      } else {
        delete obj.$$hashKey;
      }
    }
    function extend(dst) {
      var h = dst.$$hashKey;
      forEach(arguments, function (obj) {
        if (obj !== dst) {
          forEach(obj, function (value, key) {
            dst[key] = value;
          });
        }
      });
      setHashKey(dst, h);
      return dst;
    }
    function int(str) {
      return parseInt(str, 10);
    }
    function inherit(parent, extra) {
      return extend(new (extend(function () {
      }, { prototype: parent }))(), extra);
    }
    function noop() {
    }
    noop.$inject = [];
    function identity($) {
      return $;
    }
    identity.$inject = [];
    function valueFn(value) {
      return function () {
        return value;
      };
    }
    function isUndefined(value) {
      return typeof value === 'undefined';
    }
    function isDefined(value) {
      return typeof value !== 'undefined';
    }
    function isObject(value) {
      return value != null && typeof value === 'object';
    }
    function isString(value) {
      return typeof value === 'string';
    }
    function isNumber(value) {
      return typeof value === 'number';
    }
    function isDate(value) {
      return toString.call(value) === '[object Date]';
    }
    function isArray(value) {
      return toString.call(value) === '[object Array]';
    }
    function isFunction(value) {
      return typeof value === 'function';
    }
    function isRegExp(value) {
      return toString.call(value) === '[object RegExp]';
    }
    function isWindow(obj) {
      return obj && obj.document && obj.location && obj.alert && obj.setInterval;
    }
    function isScope(obj) {
      return obj && obj.$evalAsync && obj.$watch;
    }
    function isFile(obj) {
      return toString.call(obj) === '[object File]';
    }
    function isBoolean(value) {
      return typeof value === 'boolean';
    }
    var trim = function () {
        if (!String.prototype.trim) {
          return function (value) {
            return isString(value) ? value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : value;
          };
        }
        return function (value) {
          return isString(value) ? value.trim() : value;
        };
      }();
    function isElement(node) {
      return !!(node && (node.nodeName || node.on && node.find));
    }
    function makeMap(str) {
      var obj = {}, items = str.split(','), i;
      for (i = 0; i < items.length; i++)
        obj[items[i]] = true;
      return obj;
    }
    if (msie < 9) {
      nodeName_ = function (element) {
        element = element.nodeName ? element : element[0];
        return element.scopeName && element.scopeName != 'HTML' ? uppercase(element.scopeName + ':' + element.nodeName) : element.nodeName;
      };
    } else {
      nodeName_ = function (element) {
        return element.nodeName ? element.nodeName : element[0].nodeName;
      };
    }
    function map(obj, iterator, context) {
      var results = [];
      forEach(obj, function (value, index, list) {
        results.push(iterator.call(context, value, index, list));
      });
      return results;
    }
    function size(obj, ownPropsOnly) {
      var count = 0, key;
      if (isArray(obj) || isString(obj)) {
        return obj.length;
      } else if (isObject(obj)) {
        for (key in obj)
          if (!ownPropsOnly || obj.hasOwnProperty(key))
            count++;
      }
      return count;
    }
    function includes(array, obj) {
      return indexOf(array, obj) != -1;
    }
    function indexOf(array, obj) {
      if (array.indexOf)
        return array.indexOf(obj);
      for (var i = 0; i < array.length; i++) {
        if (obj === array[i])
          return i;
      }
      return -1;
    }
    function arrayRemove(array, value) {
      var index = indexOf(array, value);
      if (index >= 0)
        array.splice(index, 1);
      return value;
    }
    function isLeafNode(node) {
      if (node) {
        switch (node.nodeName) {
        case 'OPTION':
        case 'PRE':
        case 'TITLE':
          return true;
        }
      }
      return false;
    }
    function copy(source, destination) {
      if (isWindow(source) || isScope(source)) {
        throw ngMinErr('cpws', 'Can\'t copy! Making copies of Window or Scope instances is not supported.');
      }
      if (!destination) {
        destination = source;
        if (source) {
          if (isArray(source)) {
            destination = copy(source, []);
          } else if (isDate(source)) {
            destination = new Date(source.getTime());
          } else if (isRegExp(source)) {
            destination = new RegExp(source.source);
          } else if (isObject(source)) {
            destination = copy(source, {});
          }
        }
      } else {
        if (source === destination)
          throw ngMinErr('cpi', 'Can\'t copy! Source and destination are identical.');
        if (isArray(source)) {
          destination.length = 0;
          for (var i = 0; i < source.length; i++) {
            destination.push(copy(source[i]));
          }
        } else {
          var h = destination.$$hashKey;
          forEach(destination, function (value, key) {
            delete destination[key];
          });
          for (var key in source) {
            destination[key] = copy(source[key]);
          }
          setHashKey(destination, h);
        }
      }
      return destination;
    }
    function shallowCopy(src, dst) {
      dst = dst || {};
      for (var key in src) {
        if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
          dst[key] = src[key];
        }
      }
      return dst;
    }
    function equals(o1, o2) {
      if (o1 === o2)
        return true;
      if (o1 === null || o2 === null)
        return false;
      if (o1 !== o1 && o2 !== o2)
        return true;
      var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
      if (t1 == t2) {
        if (t1 == 'object') {
          if (isArray(o1)) {
            if (!isArray(o2))
              return false;
            if ((length = o1.length) == o2.length) {
              for (key = 0; key < length; key++) {
                if (!equals(o1[key], o2[key]))
                  return false;
              }
              return true;
            }
          } else if (isDate(o1)) {
            return isDate(o2) && o1.getTime() == o2.getTime();
          } else if (isRegExp(o1) && isRegExp(o2)) {
            return o1.toString() == o2.toString();
          } else {
            if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2))
              return false;
            keySet = {};
            for (key in o1) {
              if (key.charAt(0) === '$' || isFunction(o1[key]))
                continue;
              if (!equals(o1[key], o2[key]))
                return false;
              keySet[key] = true;
            }
            for (key in o2) {
              if (!keySet.hasOwnProperty(key) && key.charAt(0) !== '$' && o2[key] !== undefined && !isFunction(o2[key]))
                return false;
            }
            return true;
          }
        }
      }
      return false;
    }
    function csp() {
      return document.securityPolicy && document.securityPolicy.isActive || document.querySelector && !!(document.querySelector('[ng-csp]') || document.querySelector('[data-ng-csp]'));
    }
    function concat(array1, array2, index) {
      return array1.concat(slice.call(array2, index));
    }
    function sliceArgs(args, startIndex) {
      return slice.call(args, startIndex || 0);
    }
    function bind(self, fn) {
      var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
      if (isFunction(fn) && !(fn instanceof RegExp)) {
        return curryArgs.length ? function () {
          return arguments.length ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0))) : fn.apply(self, curryArgs);
        } : function () {
          return arguments.length ? fn.apply(self, arguments) : fn.call(self);
        };
      } else {
        return fn;
      }
    }
    function toJsonReplacer(key, value) {
      var val = value;
      if (typeof key === 'string' && key.charAt(0) === '$') {
        val = undefined;
      } else if (isWindow(value)) {
        val = '$WINDOW';
      } else if (value && document === value) {
        val = '$DOCUMENT';
      } else if (isScope(value)) {
        val = '$SCOPE';
      }
      return val;
    }
    function toJson(obj, pretty) {
      if (typeof obj === 'undefined')
        return undefined;
      return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
    }
    function fromJson(json) {
      return isString(json) ? JSON.parse(json) : json;
    }
    function toBoolean(value) {
      if (typeof value === 'function') {
        value = true;
      } else if (value && value.length !== 0) {
        var v = lowercase('' + value);
        value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
      } else {
        value = false;
      }
      return value;
    }
    function startingTag(element) {
      element = jqLite(element).clone();
      try {
        element.empty();
      } catch (e) {
      }
      var TEXT_NODE = 3;
      var elemHtml = jqLite('<div>').append(element).html();
      try {
        return element[0].nodeType === TEXT_NODE ? lowercase(elemHtml) : elemHtml.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/, function (match, nodeName) {
          return '<' + lowercase(nodeName);
        });
      } catch (e) {
        return lowercase(elemHtml);
      }
    }
    function tryDecodeURIComponent(value) {
      try {
        return decodeURIComponent(value);
      } catch (e) {
      }
    }
    function parseKeyValue(keyValue) {
      var obj = {}, key_value, key;
      forEach((keyValue || '').split('&'), function (keyValue) {
        if (keyValue) {
          key_value = keyValue.split('=');
          key = tryDecodeURIComponent(key_value[0]);
          if (isDefined(key)) {
            var val = isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
            if (!obj[key]) {
              obj[key] = val;
            } else if (isArray(obj[key])) {
              obj[key].push(val);
            } else {
              obj[key] = [
                obj[key],
                val
              ];
            }
          }
        }
      });
      return obj;
    }
    function toKeyValue(obj) {
      var parts = [];
      forEach(obj, function (value, key) {
        if (isArray(value)) {
          forEach(value, function (arrayValue) {
            parts.push(encodeUriQuery(key, true) + (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
          });
        } else {
          parts.push(encodeUriQuery(key, true) + (value === true ? '' : '=' + encodeUriQuery(value, true)));
        }
      });
      return parts.length ? parts.join('&') : '';
    }
    function encodeUriSegment(val) {
      return encodeUriQuery(val, true).replace(/%26/gi, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
    }
    function encodeUriQuery(val, pctEncodeSpaces) {
      return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, pctEncodeSpaces ? '%20' : '+');
    }
    function angularInit(element, bootstrap) {
      var elements = [element], appElement, module, names = [
          'ng:app',
          'ng-app',
          'x-ng-app',
          'data-ng-app'
        ], NG_APP_CLASS_REGEXP = /\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;
      function append(element) {
        element && elements.push(element);
      }
      forEach(names, function (name) {
        names[name] = true;
        append(document.getElementById(name));
        name = name.replace(':', '\\:');
        if (element.querySelectorAll) {
          forEach(element.querySelectorAll('.' + name), append);
          forEach(element.querySelectorAll('.' + name + '\\:'), append);
          forEach(element.querySelectorAll('[' + name + ']'), append);
        }
      });
      forEach(elements, function (element) {
        if (!appElement) {
          var className = ' ' + element.className + ' ';
          var match = NG_APP_CLASS_REGEXP.exec(className);
          if (match) {
            appElement = element;
            module = (match[2] || '').replace(/\s+/g, ',');
          } else {
            forEach(element.attributes, function (attr) {
              if (!appElement && names[attr.name]) {
                appElement = element;
                module = attr.value;
              }
            });
          }
        }
      });
      if (appElement) {
        bootstrap(appElement, module ? [module] : []);
      }
    }
    function bootstrap(element, modules) {
      var doBootstrap = function () {
        element = jqLite(element);
        if (element.injector()) {
          var tag = element[0] === document ? 'document' : startingTag(element);
          throw ngMinErr('btstrpd', 'App Already Bootstrapped with this Element \'{0}\'', tag);
        }
        modules = modules || [];
        modules.unshift([
          '$provide',
          function ($provide) {
            $provide.value('$rootElement', element);
          }
        ]);
        modules.unshift('ng');
        var injector = createInjector(modules);
        injector.invoke([
          '$rootScope',
          '$rootElement',
          '$compile',
          '$injector',
          '$animate',
          function (scope, element, compile, injector, animate) {
            scope.$apply(function () {
              element.data('$injector', injector);
              compile(element)(scope);
            });
          }
        ]);
        return injector;
      };
      var NG_DEFER_BOOTSTRAP = /^NG_DEFER_BOOTSTRAP!/;
      if (window && !NG_DEFER_BOOTSTRAP.test(window.name)) {
        return doBootstrap();
      }
      window.name = window.name.replace(NG_DEFER_BOOTSTRAP, '');
      angular.resumeBootstrap = function (extraModules) {
        forEach(extraModules, function (module) {
          modules.push(module);
        });
        doBootstrap();
      };
    }
    var SNAKE_CASE_REGEXP = /[A-Z]/g;
    function snake_case(name, separator) {
      separator = separator || '_';
      return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
        return (pos ? separator : '') + letter.toLowerCase();
      });
    }
    function bindJQuery() {
      jQuery = window.jQuery;
      if (jQuery) {
        jqLite = jQuery;
        extend(jQuery.fn, {
          scope: JQLitePrototype.scope,
          isolateScope: JQLitePrototype.isolateScope,
          controller: JQLitePrototype.controller,
          injector: JQLitePrototype.injector,
          inheritedData: JQLitePrototype.inheritedData
        });
        jqLitePatchJQueryRemove('remove', true, true, false);
        jqLitePatchJQueryRemove('empty', false, false, false);
        jqLitePatchJQueryRemove('html', false, false, true);
      } else {
        jqLite = JQLite;
      }
      angular.element = jqLite;
    }
    function assertArg(arg, name, reason) {
      if (!arg) {
        throw ngMinErr('areq', 'Argument \'{0}\' is {1}', name || '?', reason || 'required');
      }
      return arg;
    }
    function assertArgFn(arg, name, acceptArrayAnnotation) {
      if (acceptArrayAnnotation && isArray(arg)) {
        arg = arg[arg.length - 1];
      }
      assertArg(isFunction(arg), name, 'not a function, got ' + (arg && typeof arg == 'object' ? arg.constructor.name || 'Object' : typeof arg));
      return arg;
    }
    function assertNotHasOwnProperty(name, context) {
      if (name === 'hasOwnProperty') {
        throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
      }
    }
    function getter(obj, path, bindFnToScope) {
      if (!path)
        return obj;
      var keys = path.split('.');
      var key;
      var lastInstance = obj;
      var len = keys.length;
      for (var i = 0; i < len; i++) {
        key = keys[i];
        if (obj) {
          obj = (lastInstance = obj)[key];
        }
      }
      if (!bindFnToScope && isFunction(obj)) {
        return bind(lastInstance, obj);
      }
      return obj;
    }
    function getBlockElements(nodes) {
      var startNode = nodes[0], endNode = nodes[nodes.length - 1];
      if (startNode === endNode) {
        return jqLite(startNode);
      }
      var element = startNode;
      var elements = [element];
      do {
        element = element.nextSibling;
        if (!element)
          break;
        elements.push(element);
      } while (element !== endNode);
      return jqLite(elements);
    }
    function setupModuleLoader(window) {
      var $injectorMinErr = minErr('$injector');
      var ngMinErr = minErr('ng');
      function ensure(obj, name, factory) {
        return obj[name] || (obj[name] = factory());
      }
      var angular = ensure(window, 'angular', Object);
      angular.$$minErr = angular.$$minErr || minErr;
      return ensure(angular, 'module', function () {
        var modules = {};
        return function module(name, requires, configFn) {
          var assertNotHasOwnProperty = function (name, context) {
            if (name === 'hasOwnProperty') {
              throw ngMinErr('badname', 'hasOwnProperty is not a valid {0} name', context);
            }
          };
          assertNotHasOwnProperty(name, 'module');
          if (requires && modules.hasOwnProperty(name)) {
            modules[name] = null;
          }
          return ensure(modules, name, function () {
            if (!requires) {
              throw $injectorMinErr('nomod', 'Module \'{0}\' is not available! You either misspelled ' + 'the module name or forgot to load it. If registering a module ensure that you ' + 'specify the dependencies as the second argument.', name);
            }
            var invokeQueue = [];
            var runBlocks = [];
            var config = invokeLater('$injector', 'invoke');
            var moduleInstance = {
                _invokeQueue: invokeQueue,
                _runBlocks: runBlocks,
                requires: requires,
                name: name,
                provider: invokeLater('$provide', 'provider'),
                factory: invokeLater('$provide', 'factory'),
                service: invokeLater('$provide', 'service'),
                value: invokeLater('$provide', 'value'),
                constant: invokeLater('$provide', 'constant', 'unshift'),
                animation: invokeLater('$animateProvider', 'register'),
                filter: invokeLater('$filterProvider', 'register'),
                controller: invokeLater('$controllerProvider', 'register'),
                directive: invokeLater('$compileProvider', 'directive'),
                config: config,
                run: function (block) {
                  runBlocks.push(block);
                  return this;
                }
              };
            if (configFn) {
              config(configFn);
            }
            return moduleInstance;
            function invokeLater(provider, method, insertMethod) {
              return function () {
                invokeQueue[insertMethod || 'push']([
                  provider,
                  method,
                  arguments
                ]);
                return moduleInstance;
              };
            }
          });
        };
      });
    }
    var version = {
        full: '1.2.12',
        major: 1,
        minor: 2,
        dot: 12,
        codeName: 'cauliflower-eradication'
      };
    function publishExternalAPI(angular) {
      extend(angular, {
        'bootstrap': bootstrap,
        'copy': copy,
        'extend': extend,
        'equals': equals,
        'element': jqLite,
        'forEach': forEach,
        'injector': createInjector,
        'noop': noop,
        'bind': bind,
        'toJson': toJson,
        'fromJson': fromJson,
        'identity': identity,
        'isUndefined': isUndefined,
        'isDefined': isDefined,
        'isString': isString,
        'isFunction': isFunction,
        'isObject': isObject,
        'isNumber': isNumber,
        'isElement': isElement,
        'isArray': isArray,
        'version': version,
        'isDate': isDate,
        'lowercase': lowercase,
        'uppercase': uppercase,
        'callbacks': { counter: 0 },
        '$$minErr': minErr,
        '$$csp': csp
      });
      angularModule = setupModuleLoader(window);
      try {
        angularModule('ngLocale');
      } catch (e) {
        angularModule('ngLocale', []).provider('$locale', $LocaleProvider);
      }
      angularModule('ng', ['ngLocale'], [
        '$provide',
        function ngModule($provide) {
          $provide.provider({ $$sanitizeUri: $$SanitizeUriProvider });
          $provide.provider('$compile', $CompileProvider).directive({
            a: htmlAnchorDirective,
            input: inputDirective,
            textarea: inputDirective,
            form: formDirective,
            script: scriptDirective,
            select: selectDirective,
            style: styleDirective,
            option: optionDirective,
            ngBind: ngBindDirective,
            ngBindHtml: ngBindHtmlDirective,
            ngBindTemplate: ngBindTemplateDirective,
            ngClass: ngClassDirective,
            ngClassEven: ngClassEvenDirective,
            ngClassOdd: ngClassOddDirective,
            ngCloak: ngCloakDirective,
            ngController: ngControllerDirective,
            ngForm: ngFormDirective,
            ngHide: ngHideDirective,
            ngIf: ngIfDirective,
            ngInclude: ngIncludeDirective,
            ngInit: ngInitDirective,
            ngNonBindable: ngNonBindableDirective,
            ngPluralize: ngPluralizeDirective,
            ngRepeat: ngRepeatDirective,
            ngShow: ngShowDirective,
            ngStyle: ngStyleDirective,
            ngSwitch: ngSwitchDirective,
            ngSwitchWhen: ngSwitchWhenDirective,
            ngSwitchDefault: ngSwitchDefaultDirective,
            ngOptions: ngOptionsDirective,
            ngTransclude: ngTranscludeDirective,
            ngModel: ngModelDirective,
            ngList: ngListDirective,
            ngChange: ngChangeDirective,
            required: requiredDirective,
            ngRequired: requiredDirective,
            ngValue: ngValueDirective
          }).directive({ ngInclude: ngIncludeFillContentDirective }).directive(ngAttributeAliasDirectives).directive(ngEventDirectives);
          $provide.provider({
            $anchorScroll: $AnchorScrollProvider,
            $animate: $AnimateProvider,
            $browser: $BrowserProvider,
            $cacheFactory: $CacheFactoryProvider,
            $controller: $ControllerProvider,
            $document: $DocumentProvider,
            $exceptionHandler: $ExceptionHandlerProvider,
            $filter: $FilterProvider,
            $interpolate: $InterpolateProvider,
            $interval: $IntervalProvider,
            $http: $HttpProvider,
            $httpBackend: $HttpBackendProvider,
            $location: $LocationProvider,
            $log: $LogProvider,
            $parse: $ParseProvider,
            $rootScope: $RootScopeProvider,
            $q: $QProvider,
            $sce: $SceProvider,
            $sceDelegate: $SceDelegateProvider,
            $sniffer: $SnifferProvider,
            $templateCache: $TemplateCacheProvider,
            $timeout: $TimeoutProvider,
            $window: $WindowProvider
          });
        }
      ]);
    }
    var jqCache = JQLite.cache = {}, jqName = JQLite.expando = 'ng-' + new Date().getTime(), jqId = 1, addEventListenerFn = window.document.addEventListener ? function (element, type, fn) {
        element.addEventListener(type, fn, false);
      } : function (element, type, fn) {
        element.attachEvent('on' + type, fn);
      }, removeEventListenerFn = window.document.removeEventListener ? function (element, type, fn) {
        element.removeEventListener(type, fn, false);
      } : function (element, type, fn) {
        element.detachEvent('on' + type, fn);
      };
    function jqNextId() {
      return ++jqId;
    }
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;
    var jqLiteMinErr = minErr('jqLite');
    function camelCase(name) {
      return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      }).replace(MOZ_HACK_REGEXP, 'Moz$1');
    }
    function jqLitePatchJQueryRemove(name, dispatchThis, filterElems, getterIfNoArguments) {
      var originalJqFn = jQuery.fn[name];
      originalJqFn = originalJqFn.$original || originalJqFn;
      removePatch.$original = originalJqFn;
      jQuery.fn[name] = removePatch;
      function removePatch(param) {
        var list = filterElems && param ? [this.filter(param)] : [this], fireEvent = dispatchThis, set, setIndex, setLength, element, childIndex, childLength, children;
        if (!getterIfNoArguments || param != null) {
          while (list.length) {
            set = list.shift();
            for (setIndex = 0, setLength = set.length; setIndex < setLength; setIndex++) {
              element = jqLite(set[setIndex]);
              if (fireEvent) {
                element.triggerHandler('$destroy');
              } else {
                fireEvent = !fireEvent;
              }
              for (childIndex = 0, childLength = (children = element.children()).length; childIndex < childLength; childIndex++) {
                list.push(jQuery(children[childIndex]));
              }
            }
          }
        }
        return originalJqFn.apply(this, arguments);
      }
    }
    function JQLite(element) {
      if (element instanceof JQLite) {
        return element;
      }
      if (isString(element)) {
        element = trim(element);
      }
      if (!(this instanceof JQLite)) {
        if (isString(element) && element.charAt(0) != '<') {
          throw jqLiteMinErr('nosel', 'Looking up elements via selectors is not supported by jqLite! See: http://docs.angularjs.org/api/angular.element');
        }
        return new JQLite(element);
      }
      if (isString(element)) {
        var div = document.createElement('div');
        div.innerHTML = '<div>&#160;</div>' + element;
        div.removeChild(div.firstChild);
        jqLiteAddNodes(this, div.childNodes);
        var fragment = jqLite(document.createDocumentFragment());
        fragment.append(this);
      } else {
        jqLiteAddNodes(this, element);
      }
    }
    function jqLiteClone(element) {
      return element.cloneNode(true);
    }
    function jqLiteDealoc(element) {
      jqLiteRemoveData(element);
      for (var i = 0, children = element.childNodes || []; i < children.length; i++) {
        jqLiteDealoc(children[i]);
      }
    }
    function jqLiteOff(element, type, fn, unsupported) {
      if (isDefined(unsupported))
        throw jqLiteMinErr('offargs', 'jqLite#off() does not support the `selector` argument');
      var events = jqLiteExpandoStore(element, 'events'), handle = jqLiteExpandoStore(element, 'handle');
      if (!handle)
        return;
      if (isUndefined(type)) {
        forEach(events, function (eventHandler, type) {
          removeEventListenerFn(element, type, eventHandler);
          delete events[type];
        });
      } else {
        forEach(type.split(' '), function (type) {
          if (isUndefined(fn)) {
            removeEventListenerFn(element, type, events[type]);
            delete events[type];
          } else {
            arrayRemove(events[type] || [], fn);
          }
        });
      }
    }
    function jqLiteRemoveData(element, name) {
      var expandoId = element[jqName], expandoStore = jqCache[expandoId];
      if (expandoStore) {
        if (name) {
          delete jqCache[expandoId].data[name];
          return;
        }
        if (expandoStore.handle) {
          expandoStore.events.$destroy && expandoStore.handle({}, '$destroy');
          jqLiteOff(element);
        }
        delete jqCache[expandoId];
        element[jqName] = undefined;
      }
    }
    function jqLiteExpandoStore(element, key, value) {
      var expandoId = element[jqName], expandoStore = jqCache[expandoId || -1];
      if (isDefined(value)) {
        if (!expandoStore) {
          element[jqName] = expandoId = jqNextId();
          expandoStore = jqCache[expandoId] = {};
        }
        expandoStore[key] = value;
      } else {
        return expandoStore && expandoStore[key];
      }
    }
    function jqLiteData(element, key, value) {
      var data = jqLiteExpandoStore(element, 'data'), isSetter = isDefined(value), keyDefined = !isSetter && isDefined(key), isSimpleGetter = keyDefined && !isObject(key);
      if (!data && !isSimpleGetter) {
        jqLiteExpandoStore(element, 'data', data = {});
      }
      if (isSetter) {
        data[key] = value;
      } else {
        if (keyDefined) {
          if (isSimpleGetter) {
            return data && data[key];
          } else {
            extend(data, key);
          }
        } else {
          return data;
        }
      }
    }
    function jqLiteHasClass(element, selector) {
      if (!element.getAttribute)
        return false;
      return (' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').indexOf(' ' + selector + ' ') > -1;
    }
    function jqLiteRemoveClass(element, cssClasses) {
      if (cssClasses && element.setAttribute) {
        forEach(cssClasses.split(' '), function (cssClass) {
          element.setAttribute('class', trim((' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').replace(' ' + trim(cssClass) + ' ', ' ')));
        });
      }
    }
    function jqLiteAddClass(element, cssClasses) {
      if (cssClasses && element.setAttribute) {
        var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ');
        forEach(cssClasses.split(' '), function (cssClass) {
          cssClass = trim(cssClass);
          if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
            existingClasses += cssClass + ' ';
          }
        });
        element.setAttribute('class', trim(existingClasses));
      }
    }
    function jqLiteAddNodes(root, elements) {
      if (elements) {
        elements = !elements.nodeName && isDefined(elements.length) && !isWindow(elements) ? elements : [elements];
        for (var i = 0; i < elements.length; i++) {
          root.push(elements[i]);
        }
      }
    }
    function jqLiteController(element, name) {
      return jqLiteInheritedData(element, '$' + (name || 'ngController') + 'Controller');
    }
    function jqLiteInheritedData(element, name, value) {
      element = jqLite(element);
      if (element[0].nodeType == 9) {
        element = element.find('html');
      }
      var names = isArray(name) ? name : [name];
      while (element.length) {
        for (var i = 0, ii = names.length; i < ii; i++) {
          if ((value = element.data(names[i])) !== undefined)
            return value;
        }
        element = element.parent();
      }
    }
    function jqLiteEmpty(element) {
      for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {
        jqLiteDealoc(childNodes[i]);
      }
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }
    var JQLitePrototype = JQLite.prototype = {
        ready: function (fn) {
          var fired = false;
          function trigger() {
            if (fired)
              return;
            fired = true;
            fn();
          }
          if (document.readyState === 'complete') {
            setTimeout(trigger);
          } else {
            this.on('DOMContentLoaded', trigger);
            JQLite(window).on('load', trigger);
          }
        },
        toString: function () {
          var value = [];
          forEach(this, function (e) {
            value.push('' + e);
          });
          return '[' + value.join(', ') + ']';
        },
        eq: function (index) {
          return index >= 0 ? jqLite(this[index]) : jqLite(this[this.length + index]);
        },
        length: 0,
        push: push,
        sort: [].sort,
        splice: [].splice
      };
    var BOOLEAN_ATTR = {};
    forEach('multiple,selected,checked,disabled,readOnly,required,open'.split(','), function (value) {
      BOOLEAN_ATTR[lowercase(value)] = value;
    });
    var BOOLEAN_ELEMENTS = {};
    forEach('input,select,option,textarea,button,form,details'.split(','), function (value) {
      BOOLEAN_ELEMENTS[uppercase(value)] = true;
    });
    function getBooleanAttrName(element, name) {
      var booleanAttr = BOOLEAN_ATTR[name.toLowerCase()];
      return booleanAttr && BOOLEAN_ELEMENTS[element.nodeName] && booleanAttr;
    }
    forEach({
      data: jqLiteData,
      inheritedData: jqLiteInheritedData,
      scope: function (element) {
        return jqLite(element).data('$scope') || jqLiteInheritedData(element.parentNode || element, [
          '$isolateScope',
          '$scope'
        ]);
      },
      isolateScope: function (element) {
        return jqLite(element).data('$isolateScope') || jqLite(element).data('$isolateScopeNoTemplate');
      },
      controller: jqLiteController,
      injector: function (element) {
        return jqLiteInheritedData(element, '$injector');
      },
      removeAttr: function (element, name) {
        element.removeAttribute(name);
      },
      hasClass: jqLiteHasClass,
      css: function (element, name, value) {
        name = camelCase(name);
        if (isDefined(value)) {
          element.style[name] = value;
        } else {
          var val;
          if (msie <= 8) {
            val = element.currentStyle && element.currentStyle[name];
            if (val === '')
              val = 'auto';
          }
          val = val || element.style[name];
          if (msie <= 8) {
            val = val === '' ? undefined : val;
          }
          return val;
        }
      },
      attr: function (element, name, value) {
        var lowercasedName = lowercase(name);
        if (BOOLEAN_ATTR[lowercasedName]) {
          if (isDefined(value)) {
            if (!!value) {
              element[name] = true;
              element.setAttribute(name, lowercasedName);
            } else {
              element[name] = false;
              element.removeAttribute(lowercasedName);
            }
          } else {
            return element[name] || (element.attributes.getNamedItem(name) || noop).specified ? lowercasedName : undefined;
          }
        } else if (isDefined(value)) {
          element.setAttribute(name, value);
        } else if (element.getAttribute) {
          var ret = element.getAttribute(name, 2);
          return ret === null ? undefined : ret;
        }
      },
      prop: function (element, name, value) {
        if (isDefined(value)) {
          element[name] = value;
        } else {
          return element[name];
        }
      },
      text: function () {
        var NODE_TYPE_TEXT_PROPERTY = [];
        if (msie < 9) {
          NODE_TYPE_TEXT_PROPERTY[1] = 'innerText';
          NODE_TYPE_TEXT_PROPERTY[3] = 'nodeValue';
        } else {
          NODE_TYPE_TEXT_PROPERTY[1] = NODE_TYPE_TEXT_PROPERTY[3] = 'textContent';
        }
        getText.$dv = '';
        return getText;
        function getText(element, value) {
          var textProp = NODE_TYPE_TEXT_PROPERTY[element.nodeType];
          if (isUndefined(value)) {
            return textProp ? element[textProp] : '';
          }
          element[textProp] = value;
        }
      }(),
      val: function (element, value) {
        if (isUndefined(value)) {
          if (nodeName_(element) === 'SELECT' && element.multiple) {
            var result = [];
            forEach(element.options, function (option) {
              if (option.selected) {
                result.push(option.value || option.text);
              }
            });
            return result.length === 0 ? null : result;
          }
          return element.value;
        }
        element.value = value;
      },
      html: function (element, value) {
        if (isUndefined(value)) {
          return element.innerHTML;
        }
        for (var i = 0, childNodes = element.childNodes; i < childNodes.length; i++) {
          jqLiteDealoc(childNodes[i]);
        }
        element.innerHTML = value;
      },
      empty: jqLiteEmpty
    }, function (fn, name) {
      JQLite.prototype[name] = function (arg1, arg2) {
        var i, key;
        if (fn !== jqLiteEmpty && (fn.length == 2 && (fn !== jqLiteHasClass && fn !== jqLiteController) ? arg1 : arg2) === undefined) {
          if (isObject(arg1)) {
            for (i = 0; i < this.length; i++) {
              if (fn === jqLiteData) {
                fn(this[i], arg1);
              } else {
                for (key in arg1) {
                  fn(this[i], key, arg1[key]);
                }
              }
            }
            return this;
          } else {
            var value = fn.$dv;
            var jj = value === undefined ? Math.min(this.length, 1) : this.length;
            for (var j = 0; j < jj; j++) {
              var nodeValue = fn(this[j], arg1, arg2);
              value = value ? value + nodeValue : nodeValue;
            }
            return value;
          }
        } else {
          for (i = 0; i < this.length; i++) {
            fn(this[i], arg1, arg2);
          }
          return this;
        }
      };
    });
    function createEventHandler(element, events) {
      var eventHandler = function (event, type) {
        if (!event.preventDefault) {
          event.preventDefault = function () {
            event.returnValue = false;
          };
        }
        if (!event.stopPropagation) {
          event.stopPropagation = function () {
            event.cancelBubble = true;
          };
        }
        if (!event.target) {
          event.target = event.srcElement || document;
        }
        if (isUndefined(event.defaultPrevented)) {
          var prevent = event.preventDefault;
          event.preventDefault = function () {
            event.defaultPrevented = true;
            prevent.call(event);
          };
          event.defaultPrevented = false;
        }
        event.isDefaultPrevented = function () {
          return event.defaultPrevented || event.returnValue === false;
        };
        var eventHandlersCopy = shallowCopy(events[type || event.type] || []);
        forEach(eventHandlersCopy, function (fn) {
          fn.call(element, event);
        });
        if (msie <= 8) {
          event.preventDefault = null;
          event.stopPropagation = null;
          event.isDefaultPrevented = null;
        } else {
          delete event.preventDefault;
          delete event.stopPropagation;
          delete event.isDefaultPrevented;
        }
      };
      eventHandler.elem = element;
      return eventHandler;
    }
    forEach({
      removeData: jqLiteRemoveData,
      dealoc: jqLiteDealoc,
      on: function onFn(element, type, fn, unsupported) {
        if (isDefined(unsupported))
          throw jqLiteMinErr('onargs', 'jqLite#on() does not support the `selector` or `eventData` parameters');
        var events = jqLiteExpandoStore(element, 'events'), handle = jqLiteExpandoStore(element, 'handle');
        if (!events)
          jqLiteExpandoStore(element, 'events', events = {});
        if (!handle)
          jqLiteExpandoStore(element, 'handle', handle = createEventHandler(element, events));
        forEach(type.split(' '), function (type) {
          var eventFns = events[type];
          if (!eventFns) {
            if (type == 'mouseenter' || type == 'mouseleave') {
              var contains = document.body.contains || document.body.compareDocumentPosition ? function (a, b) {
                  var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
                  return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
                } : function (a, b) {
                  if (b) {
                    while (b = b.parentNode) {
                      if (b === a) {
                        return true;
                      }
                    }
                  }
                  return false;
                };
              events[type] = [];
              var eventmap = {
                  mouseleave: 'mouseout',
                  mouseenter: 'mouseover'
                };
              onFn(element, eventmap[type], function (event) {
                var target = this, related = event.relatedTarget;
                if (!related || related !== target && !contains(target, related)) {
                  handle(event, type);
                }
              });
            } else {
              addEventListenerFn(element, type, handle);
              events[type] = [];
            }
            eventFns = events[type];
          }
          eventFns.push(fn);
        });
      },
      off: jqLiteOff,
      one: function (element, type, fn) {
        element = jqLite(element);
        element.on(type, function onFn() {
          element.off(type, fn);
          element.off(type, onFn);
        });
        element.on(type, fn);
      },
      replaceWith: function (element, replaceNode) {
        var index, parent = element.parentNode;
        jqLiteDealoc(element);
        forEach(new JQLite(replaceNode), function (node) {
          if (index) {
            parent.insertBefore(node, index.nextSibling);
          } else {
            parent.replaceChild(node, element);
          }
          index = node;
        });
      },
      children: function (element) {
        var children = [];
        forEach(element.childNodes, function (element) {
          if (element.nodeType === 1)
            children.push(element);
        });
        return children;
      },
      contents: function (element) {
        return element.childNodes || [];
      },
      append: function (element, node) {
        forEach(new JQLite(node), function (child) {
          if (element.nodeType === 1 || element.nodeType === 11) {
            element.appendChild(child);
          }
        });
      },
      prepend: function (element, node) {
        if (element.nodeType === 1) {
          var index = element.firstChild;
          forEach(new JQLite(node), function (child) {
            element.insertBefore(child, index);
          });
        }
      },
      wrap: function (element, wrapNode) {
        wrapNode = jqLite(wrapNode)[0];
        var parent = element.parentNode;
        if (parent) {
          parent.replaceChild(wrapNode, element);
        }
        wrapNode.appendChild(element);
      },
      remove: function (element) {
        jqLiteDealoc(element);
        var parent = element.parentNode;
        if (parent)
          parent.removeChild(element);
      },
      after: function (element, newElement) {
        var index = element, parent = element.parentNode;
        forEach(new JQLite(newElement), function (node) {
          parent.insertBefore(node, index.nextSibling);
          index = node;
        });
      },
      addClass: jqLiteAddClass,
      removeClass: jqLiteRemoveClass,
      toggleClass: function (element, selector, condition) {
        if (isUndefined(condition)) {
          condition = !jqLiteHasClass(element, selector);
        }
        (condition ? jqLiteAddClass : jqLiteRemoveClass)(element, selector);
      },
      parent: function (element) {
        var parent = element.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
      },
      next: function (element) {
        if (element.nextElementSibling) {
          return element.nextElementSibling;
        }
        var elm = element.nextSibling;
        while (elm != null && elm.nodeType !== 1) {
          elm = elm.nextSibling;
        }
        return elm;
      },
      find: function (element, selector) {
        if (element.getElementsByTagName) {
          return element.getElementsByTagName(selector);
        } else {
          return [];
        }
      },
      clone: jqLiteClone,
      triggerHandler: function (element, eventName, eventData) {
        var eventFns = (jqLiteExpandoStore(element, 'events') || {})[eventName];
        eventData = eventData || [];
        var event = [{
              preventDefault: noop,
              stopPropagation: noop
            }];
        forEach(eventFns, function (fn) {
          fn.apply(element, event.concat(eventData));
        });
      }
    }, function (fn, name) {
      JQLite.prototype[name] = function (arg1, arg2, arg3) {
        var value;
        for (var i = 0; i < this.length; i++) {
          if (isUndefined(value)) {
            value = fn(this[i], arg1, arg2, arg3);
            if (isDefined(value)) {
              value = jqLite(value);
            }
          } else {
            jqLiteAddNodes(value, fn(this[i], arg1, arg2, arg3));
          }
        }
        return isDefined(value) ? value : this;
      };
      JQLite.prototype.bind = JQLite.prototype.on;
      JQLite.prototype.unbind = JQLite.prototype.off;
    });
    function hashKey(obj) {
      var objType = typeof obj, key;
      if (objType == 'object' && obj !== null) {
        if (typeof (key = obj.$$hashKey) == 'function') {
          key = obj.$$hashKey();
        } else if (key === undefined) {
          key = obj.$$hashKey = nextUid();
        }
      } else {
        key = obj;
      }
      return objType + ':' + key;
    }
    function HashMap(array) {
      forEach(array, this.put, this);
    }
    HashMap.prototype = {
      put: function (key, value) {
        this[hashKey(key)] = value;
      },
      get: function (key) {
        return this[hashKey(key)];
      },
      remove: function (key) {
        var value = this[key = hashKey(key)];
        delete this[key];
        return value;
      }
    };
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
    var $injectorMinErr = minErr('$injector');
    function annotate(fn) {
      var $inject, fnText, argDecl, last;
      if (typeof fn == 'function') {
        if (!($inject = fn.$inject)) {
          $inject = [];
          if (fn.length) {
            fnText = fn.toString().replace(STRIP_COMMENTS, '');
            argDecl = fnText.match(FN_ARGS);
            forEach(argDecl[1].split(FN_ARG_SPLIT), function (arg) {
              arg.replace(FN_ARG, function (all, underscore, name) {
                $inject.push(name);
              });
            });
          }
          fn.$inject = $inject;
        }
      } else if (isArray(fn)) {
        last = fn.length - 1;
        assertArgFn(fn[last], 'fn');
        $inject = fn.slice(0, last);
      } else {
        assertArgFn(fn, 'fn', true);
      }
      return $inject;
    }
    function createInjector(modulesToLoad) {
      var INSTANTIATING = {}, providerSuffix = 'Provider', path = [], loadedModules = new HashMap(), providerCache = {
          $provide: {
            provider: supportObject(provider),
            factory: supportObject(factory),
            service: supportObject(service),
            value: supportObject(value),
            constant: supportObject(constant),
            decorator: decorator
          }
        }, providerInjector = providerCache.$injector = createInternalInjector(providerCache, function () {
          throw $injectorMinErr('unpr', 'Unknown provider: {0}', path.join(' <- '));
        }), instanceCache = {}, instanceInjector = instanceCache.$injector = createInternalInjector(instanceCache, function (servicename) {
          var provider = providerInjector.get(servicename + providerSuffix);
          return instanceInjector.invoke(provider.$get, provider);
        });
      forEach(loadModules(modulesToLoad), function (fn) {
        instanceInjector.invoke(fn || noop);
      });
      return instanceInjector;
      function supportObject(delegate) {
        return function (key, value) {
          if (isObject(key)) {
            forEach(key, reverseParams(delegate));
          } else {
            return delegate(key, value);
          }
        };
      }
      function provider(name, provider_) {
        assertNotHasOwnProperty(name, 'service');
        if (isFunction(provider_) || isArray(provider_)) {
          provider_ = providerInjector.instantiate(provider_);
        }
        if (!provider_.$get) {
          throw $injectorMinErr('pget', 'Provider \'{0}\' must define $get factory method.', name);
        }
        return providerCache[name + providerSuffix] = provider_;
      }
      function factory(name, factoryFn) {
        return provider(name, { $get: factoryFn });
      }
      function service(name, constructor) {
        return factory(name, [
          '$injector',
          function ($injector) {
            return $injector.instantiate(constructor);
          }
        ]);
      }
      function value(name, val) {
        return factory(name, valueFn(val));
      }
      function constant(name, value) {
        assertNotHasOwnProperty(name, 'constant');
        providerCache[name] = value;
        instanceCache[name] = value;
      }
      function decorator(serviceName, decorFn) {
        var origProvider = providerInjector.get(serviceName + providerSuffix), orig$get = origProvider.$get;
        origProvider.$get = function () {
          var origInstance = instanceInjector.invoke(orig$get, origProvider);
          return instanceInjector.invoke(decorFn, null, { $delegate: origInstance });
        };
      }
      function loadModules(modulesToLoad) {
        var runBlocks = [], moduleFn, invokeQueue, i, ii;
        forEach(modulesToLoad, function (module) {
          if (loadedModules.get(module))
            return;
          loadedModules.put(module, true);
          try {
            if (isString(module)) {
              moduleFn = angularModule(module);
              runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);
              for (invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++) {
                var invokeArgs = invokeQueue[i], provider = providerInjector.get(invokeArgs[0]);
                provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
              }
            } else if (isFunction(module)) {
              runBlocks.push(providerInjector.invoke(module));
            } else if (isArray(module)) {
              runBlocks.push(providerInjector.invoke(module));
            } else {
              assertArgFn(module, 'module');
            }
          } catch (e) {
            if (isArray(module)) {
              module = module[module.length - 1];
            }
            if (e.message && e.stack && e.stack.indexOf(e.message) == -1) {
              e = e.message + '\n' + e.stack;
            }
            throw $injectorMinErr('modulerr', 'Failed to instantiate module {0} due to:\n{1}', module, e.stack || e.message || e);
          }
        });
        return runBlocks;
      }
      function createInternalInjector(cache, factory) {
        function getService(serviceName) {
          if (cache.hasOwnProperty(serviceName)) {
            if (cache[serviceName] === INSTANTIATING) {
              throw $injectorMinErr('cdep', 'Circular dependency found: {0}', path.join(' <- '));
            }
            return cache[serviceName];
          } else {
            try {
              path.unshift(serviceName);
              cache[serviceName] = INSTANTIATING;
              return cache[serviceName] = factory(serviceName);
            } catch (err) {
              if (cache[serviceName] === INSTANTIATING) {
                delete cache[serviceName];
              }
              throw err;
            } finally {
              path.shift();
            }
          }
        }
        function invoke(fn, self, locals) {
          var args = [], $inject = annotate(fn), length, i, key;
          for (i = 0, length = $inject.length; i < length; i++) {
            key = $inject[i];
            if (typeof key !== 'string') {
              throw $injectorMinErr('itkn', 'Incorrect injection token! Expected service name as string, got {0}', key);
            }
            args.push(locals && locals.hasOwnProperty(key) ? locals[key] : getService(key));
          }
          if (!fn.$inject) {
            fn = fn[length];
          }
          return fn.apply(self, args);
        }
        function instantiate(Type, locals) {
          var Constructor = function () {
            }, instance, returnedValue;
          Constructor.prototype = (isArray(Type) ? Type[Type.length - 1] : Type).prototype;
          instance = new Constructor();
          returnedValue = invoke(Type, instance, locals);
          return isObject(returnedValue) || isFunction(returnedValue) ? returnedValue : instance;
        }
        return {
          invoke: invoke,
          instantiate: instantiate,
          get: getService,
          annotate: annotate,
          has: function (name) {
            return providerCache.hasOwnProperty(name + providerSuffix) || cache.hasOwnProperty(name);
          }
        };
      }
    }
    function $AnchorScrollProvider() {
      var autoScrollingEnabled = true;
      this.disableAutoScrolling = function () {
        autoScrollingEnabled = false;
      };
      this.$get = [
        '$window',
        '$location',
        '$rootScope',
        function ($window, $location, $rootScope) {
          var document = $window.document;
          function getFirstAnchor(list) {
            var result = null;
            forEach(list, function (element) {
              if (!result && lowercase(element.nodeName) === 'a')
                result = element;
            });
            return result;
          }
          function scroll() {
            var hash = $location.hash(), elm;
            if (!hash)
              $window.scrollTo(0, 0);
            else if (elm = document.getElementById(hash))
              elm.scrollIntoView();
            else if (elm = getFirstAnchor(document.getElementsByName(hash)))
              elm.scrollIntoView();
            else if (hash === 'top')
              $window.scrollTo(0, 0);
          }
          if (autoScrollingEnabled) {
            $rootScope.$watch(function autoScrollWatch() {
              return $location.hash();
            }, function autoScrollWatchAction() {
              $rootScope.$evalAsync(scroll);
            });
          }
          return scroll;
        }
      ];
    }
    var $animateMinErr = minErr('$animate');
    var $AnimateProvider = [
        '$provide',
        function ($provide) {
          this.$$selectors = {};
          this.register = function (name, factory) {
            var key = name + '-animation';
            if (name && name.charAt(0) != '.')
              throw $animateMinErr('notcsel', 'Expecting class selector starting with \'.\' got \'{0}\'.', name);
            this.$$selectors[name.substr(1)] = key;
            $provide.factory(key, factory);
          };
          this.classNameFilter = function (expression) {
            if (arguments.length === 1) {
              this.$$classNameFilter = expression instanceof RegExp ? expression : null;
            }
            return this.$$classNameFilter;
          };
          this.$get = [
            '$timeout',
            function ($timeout) {
              return {
                enter: function (element, parent, after, done) {
                  if (after) {
                    after.after(element);
                  } else {
                    if (!parent || !parent[0]) {
                      parent = after.parent();
                    }
                    parent.append(element);
                  }
                  done && $timeout(done, 0, false);
                },
                leave: function (element, done) {
                  element.remove();
                  done && $timeout(done, 0, false);
                },
                move: function (element, parent, after, done) {
                  this.enter(element, parent, after, done);
                },
                addClass: function (element, className, done) {
                  className = isString(className) ? className : isArray(className) ? className.join(' ') : '';
                  forEach(element, function (element) {
                    jqLiteAddClass(element, className);
                  });
                  done && $timeout(done, 0, false);
                },
                removeClass: function (element, className, done) {
                  className = isString(className) ? className : isArray(className) ? className.join(' ') : '';
                  forEach(element, function (element) {
                    jqLiteRemoveClass(element, className);
                  });
                  done && $timeout(done, 0, false);
                },
                enabled: noop
              };
            }
          ];
        }
      ];
    function Browser(window, document, $log, $sniffer) {
      var self = this, rawDocument = document[0], location = window.location, history = window.history, setTimeout = window.setTimeout, clearTimeout = window.clearTimeout, pendingDeferIds = {};
      self.isMock = false;
      var outstandingRequestCount = 0;
      var outstandingRequestCallbacks = [];
      self.$$completeOutstandingRequest = completeOutstandingRequest;
      self.$$incOutstandingRequestCount = function () {
        outstandingRequestCount++;
      };
      function completeOutstandingRequest(fn) {
        try {
          fn.apply(null, sliceArgs(arguments, 1));
        } finally {
          outstandingRequestCount--;
          if (outstandingRequestCount === 0) {
            while (outstandingRequestCallbacks.length) {
              try {
                outstandingRequestCallbacks.pop()();
              } catch (e) {
                $log.error(e);
              }
            }
          }
        }
      }
      self.notifyWhenNoOutstandingRequests = function (callback) {
        forEach(pollFns, function (pollFn) {
          pollFn();
        });
        if (outstandingRequestCount === 0) {
          callback();
        } else {
          outstandingRequestCallbacks.push(callback);
        }
      };
      var pollFns = [], pollTimeout;
      self.addPollFn = function (fn) {
        if (isUndefined(pollTimeout))
          startPoller(100, setTimeout);
        pollFns.push(fn);
        return fn;
      };
      function startPoller(interval, setTimeout) {
        (function check() {
          forEach(pollFns, function (pollFn) {
            pollFn();
          });
          pollTimeout = setTimeout(check, interval);
        }());
      }
      var lastBrowserUrl = location.href, baseElement = document.find('base'), newLocation = null;
      self.url = function (url, replace) {
        if (location !== window.location)
          location = window.location;
        if (history !== window.history)
          history = window.history;
        if (url) {
          if (lastBrowserUrl == url)
            return;
          lastBrowserUrl = url;
          if ($sniffer.history) {
            if (replace)
              history.replaceState(null, '', url);
            else {
              history.pushState(null, '', url);
              baseElement.attr('href', baseElement.attr('href'));
            }
          } else {
            newLocation = url;
            if (replace) {
              location.replace(url);
            } else {
              location.href = url;
            }
          }
          return self;
        } else {
          return newLocation || location.href.replace(/%27/g, '\'');
        }
      };
      var urlChangeListeners = [], urlChangeInit = false;
      function fireUrlChange() {
        newLocation = null;
        if (lastBrowserUrl == self.url())
          return;
        lastBrowserUrl = self.url();
        forEach(urlChangeListeners, function (listener) {
          listener(self.url());
        });
      }
      self.onUrlChange = function (callback) {
        if (!urlChangeInit) {
          if ($sniffer.history)
            jqLite(window).on('popstate', fireUrlChange);
          if ($sniffer.hashchange)
            jqLite(window).on('hashchange', fireUrlChange);
          else
            self.addPollFn(fireUrlChange);
          urlChangeInit = true;
        }
        urlChangeListeners.push(callback);
        return callback;
      };
      self.baseHref = function () {
        var href = baseElement.attr('href');
        return href ? href.replace(/^(https?\:)?\/\/[^\/]*/, '') : '';
      };
      var lastCookies = {};
      var lastCookieString = '';
      var cookiePath = self.baseHref();
      self.cookies = function (name, value) {
        var cookieLength, cookieArray, cookie, i, index;
        if (name) {
          if (value === undefined) {
            rawDocument.cookie = escape(name) + '=;path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:00 GMT';
          } else {
            if (isString(value)) {
              cookieLength = (rawDocument.cookie = escape(name) + '=' + escape(value) + ';path=' + cookiePath).length + 1;
              if (cookieLength > 4096) {
                $log.warn('Cookie \'' + name + '\' possibly not set or overflowed because it was too large (' + cookieLength + ' > 4096 bytes)!');
              }
            }
          }
        } else {
          if (rawDocument.cookie !== lastCookieString) {
            lastCookieString = rawDocument.cookie;
            cookieArray = lastCookieString.split('; ');
            lastCookies = {};
            for (i = 0; i < cookieArray.length; i++) {
              cookie = cookieArray[i];
              index = cookie.indexOf('=');
              if (index > 0) {
                name = unescape(cookie.substring(0, index));
                if (lastCookies[name] === undefined) {
                  lastCookies[name] = unescape(cookie.substring(index + 1));
                }
              }
            }
          }
          return lastCookies;
        }
      };
      self.defer = function (fn, delay) {
        var timeoutId;
        outstandingRequestCount++;
        timeoutId = setTimeout(function () {
          delete pendingDeferIds[timeoutId];
          completeOutstandingRequest(fn);
        }, delay || 0);
        pendingDeferIds[timeoutId] = true;
        return timeoutId;
      };
      self.defer.cancel = function (deferId) {
        if (pendingDeferIds[deferId]) {
          delete pendingDeferIds[deferId];
          clearTimeout(deferId);
          completeOutstandingRequest(noop);
          return true;
        }
        return false;
      };
    }
    function $BrowserProvider() {
      this.$get = [
        '$window',
        '$log',
        '$sniffer',
        '$document',
        function ($window, $log, $sniffer, $document) {
          return new Browser($window, $document, $log, $sniffer);
        }
      ];
    }
    function $CacheFactoryProvider() {
      this.$get = function () {
        var caches = {};
        function cacheFactory(cacheId, options) {
          if (cacheId in caches) {
            throw minErr('$cacheFactory')('iid', 'CacheId \'{0}\' is already taken!', cacheId);
          }
          var size = 0, stats = extend({}, options, { id: cacheId }), data = {}, capacity = options && options.capacity || Number.MAX_VALUE, lruHash = {}, freshEnd = null, staleEnd = null;
          return caches[cacheId] = {
            put: function (key, value) {
              var lruEntry = lruHash[key] || (lruHash[key] = { key: key });
              refresh(lruEntry);
              if (isUndefined(value))
                return;
              if (!(key in data))
                size++;
              data[key] = value;
              if (size > capacity) {
                this.remove(staleEnd.key);
              }
              return value;
            },
            get: function (key) {
              var lruEntry = lruHash[key];
              if (!lruEntry)
                return;
              refresh(lruEntry);
              return data[key];
            },
            remove: function (key) {
              var lruEntry = lruHash[key];
              if (!lruEntry)
                return;
              if (lruEntry == freshEnd)
                freshEnd = lruEntry.p;
              if (lruEntry == staleEnd)
                staleEnd = lruEntry.n;
              link(lruEntry.n, lruEntry.p);
              delete lruHash[key];
              delete data[key];
              size--;
            },
            removeAll: function () {
              data = {};
              size = 0;
              lruHash = {};
              freshEnd = staleEnd = null;
            },
            destroy: function () {
              data = null;
              stats = null;
              lruHash = null;
              delete caches[cacheId];
            },
            info: function () {
              return extend({}, stats, { size: size });
            }
          };
          function refresh(entry) {
            if (entry != freshEnd) {
              if (!staleEnd) {
                staleEnd = entry;
              } else if (staleEnd == entry) {
                staleEnd = entry.n;
              }
              link(entry.n, entry.p);
              link(entry, freshEnd);
              freshEnd = entry;
              freshEnd.n = null;
            }
          }
          function link(nextEntry, prevEntry) {
            if (nextEntry != prevEntry) {
              if (nextEntry)
                nextEntry.p = prevEntry;
              if (prevEntry)
                prevEntry.n = nextEntry;
            }
          }
        }
        cacheFactory.info = function () {
          var info = {};
          forEach(caches, function (cache, cacheId) {
            info[cacheId] = cache.info();
          });
          return info;
        };
        cacheFactory.get = function (cacheId) {
          return caches[cacheId];
        };
        return cacheFactory;
      };
    }
    function $TemplateCacheProvider() {
      this.$get = [
        '$cacheFactory',
        function ($cacheFactory) {
          return $cacheFactory('templates');
        }
      ];
    }
    var $compileMinErr = minErr('$compile');
    $CompileProvider.$inject = [
      '$provide',
      '$$sanitizeUriProvider'
    ];
    function $CompileProvider($provide, $$sanitizeUriProvider) {
      var hasDirectives = {}, Suffix = 'Directive', COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/, CLASS_DIRECTIVE_REGEXP = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/;
      var EVENT_HANDLER_ATTR_REGEXP = /^(on[a-z]+|formaction)$/;
      this.directive = function registerDirective(name, directiveFactory) {
        assertNotHasOwnProperty(name, 'directive');
        if (isString(name)) {
          assertArg(directiveFactory, 'directiveFactory');
          if (!hasDirectives.hasOwnProperty(name)) {
            hasDirectives[name] = [];
            $provide.factory(name + Suffix, [
              '$injector',
              '$exceptionHandler',
              function ($injector, $exceptionHandler) {
                var directives = [];
                forEach(hasDirectives[name], function (directiveFactory, index) {
                  try {
                    var directive = $injector.invoke(directiveFactory);
                    if (isFunction(directive)) {
                      directive = { compile: valueFn(directive) };
                    } else if (!directive.compile && directive.link) {
                      directive.compile = valueFn(directive.link);
                    }
                    directive.priority = directive.priority || 0;
                    directive.index = index;
                    directive.name = directive.name || name;
                    directive.require = directive.require || directive.controller && directive.name;
                    directive.restrict = directive.restrict || 'A';
                    directives.push(directive);
                  } catch (e) {
                    $exceptionHandler(e);
                  }
                });
                return directives;
              }
            ]);
          }
          hasDirectives[name].push(directiveFactory);
        } else {
          forEach(name, reverseParams(registerDirective));
        }
        return this;
      };
      this.aHrefSanitizationWhitelist = function (regexp) {
        if (isDefined(regexp)) {
          $$sanitizeUriProvider.aHrefSanitizationWhitelist(regexp);
          return this;
        } else {
          return $$sanitizeUriProvider.aHrefSanitizationWhitelist();
        }
      };
      this.imgSrcSanitizationWhitelist = function (regexp) {
        if (isDefined(regexp)) {
          $$sanitizeUriProvider.imgSrcSanitizationWhitelist(regexp);
          return this;
        } else {
          return $$sanitizeUriProvider.imgSrcSanitizationWhitelist();
        }
      };
      this.$get = [
        '$injector',
        '$interpolate',
        '$exceptionHandler',
        '$http',
        '$templateCache',
        '$parse',
        '$controller',
        '$rootScope',
        '$document',
        '$sce',
        '$animate',
        '$$sanitizeUri',
        function ($injector, $interpolate, $exceptionHandler, $http, $templateCache, $parse, $controller, $rootScope, $document, $sce, $animate, $$sanitizeUri) {
          var Attributes = function (element, attr) {
            this.$$element = element;
            this.$attr = attr || {};
          };
          Attributes.prototype = {
            $normalize: directiveNormalize,
            $addClass: function (classVal) {
              if (classVal && classVal.length > 0) {
                $animate.addClass(this.$$element, classVal);
              }
            },
            $removeClass: function (classVal) {
              if (classVal && classVal.length > 0) {
                $animate.removeClass(this.$$element, classVal);
              }
            },
            $updateClass: function (newClasses, oldClasses) {
              this.$removeClass(tokenDifference(oldClasses, newClasses));
              this.$addClass(tokenDifference(newClasses, oldClasses));
            },
            $set: function (key, value, writeAttr, attrName) {
              var booleanKey = getBooleanAttrName(this.$$element[0], key), normalizedVal, nodeName;
              if (booleanKey) {
                this.$$element.prop(key, value);
                attrName = booleanKey;
              }
              this[key] = value;
              if (attrName) {
                this.$attr[key] = attrName;
              } else {
                attrName = this.$attr[key];
                if (!attrName) {
                  this.$attr[key] = attrName = snake_case(key, '-');
                }
              }
              nodeName = nodeName_(this.$$element);
              if (nodeName === 'A' && key === 'href' || nodeName === 'IMG' && key === 'src') {
                this[key] = value = $$sanitizeUri(value, key === 'src');
              }
              if (writeAttr !== false) {
                if (value === null || value === undefined) {
                  this.$$element.removeAttr(attrName);
                } else {
                  this.$$element.attr(attrName, value);
                }
              }
              var $$observers = this.$$observers;
              $$observers && forEach($$observers[key], function (fn) {
                try {
                  fn(value);
                } catch (e) {
                  $exceptionHandler(e);
                }
              });
            },
            $observe: function (key, fn) {
              var attrs = this, $$observers = attrs.$$observers || (attrs.$$observers = {}), listeners = $$observers[key] || ($$observers[key] = []);
              listeners.push(fn);
              $rootScope.$evalAsync(function () {
                if (!listeners.$$inter) {
                  fn(attrs[key]);
                }
              });
              return fn;
            }
          };
          var startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), denormalizeTemplate = startSymbol == '{{' || endSymbol == '}}' ? identity : function denormalizeTemplate(template) {
              return template.replace(/\{\{/g, startSymbol).replace(/}}/g, endSymbol);
            }, NG_ATTR_BINDING = /^ngAttr[A-Z]/;
          return compile;
          function compile($compileNodes, transcludeFn, maxPriority, ignoreDirective, previousCompileContext) {
            if (!($compileNodes instanceof jqLite)) {
              $compileNodes = jqLite($compileNodes);
            }
            forEach($compileNodes, function (node, index) {
              if (node.nodeType == 3 && node.nodeValue.match(/\S+/)) {
                $compileNodes[index] = node = jqLite(node).wrap('<span></span>').parent()[0];
              }
            });
            var compositeLinkFn = compileNodes($compileNodes, transcludeFn, $compileNodes, maxPriority, ignoreDirective, previousCompileContext);
            safeAddClass($compileNodes, 'ng-scope');
            return function publicLinkFn(scope, cloneConnectFn, transcludeControllers) {
              assertArg(scope, 'scope');
              var $linkNode = cloneConnectFn ? JQLitePrototype.clone.call($compileNodes) : $compileNodes;
              forEach(transcludeControllers, function (instance, name) {
                $linkNode.data('$' + name + 'Controller', instance);
              });
              for (var i = 0, ii = $linkNode.length; i < ii; i++) {
                var node = $linkNode[i], nodeType = node.nodeType;
                if (nodeType === 1 || nodeType === 9) {
                  $linkNode.eq(i).data('$scope', scope);
                }
              }
              if (cloneConnectFn)
                cloneConnectFn($linkNode, scope);
              if (compositeLinkFn)
                compositeLinkFn(scope, $linkNode, $linkNode);
              return $linkNode;
            };
          }
          function safeAddClass($element, className) {
            try {
              $element.addClass(className);
            } catch (e) {
            }
          }
          function compileNodes(nodeList, transcludeFn, $rootElement, maxPriority, ignoreDirective, previousCompileContext) {
            var linkFns = [], attrs, directives, nodeLinkFn, childNodes, childLinkFn, linkFnFound;
            for (var i = 0; i < nodeList.length; i++) {
              attrs = new Attributes();
              directives = collectDirectives(nodeList[i], [], attrs, i === 0 ? maxPriority : undefined, ignoreDirective);
              nodeLinkFn = directives.length ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, $rootElement, null, [], [], previousCompileContext) : null;
              if (nodeLinkFn && nodeLinkFn.scope) {
                safeAddClass(jqLite(nodeList[i]), 'ng-scope');
              }
              childLinkFn = nodeLinkFn && nodeLinkFn.terminal || !(childNodes = nodeList[i].childNodes) || !childNodes.length ? null : compileNodes(childNodes, nodeLinkFn ? nodeLinkFn.transclude : transcludeFn);
              linkFns.push(nodeLinkFn, childLinkFn);
              linkFnFound = linkFnFound || nodeLinkFn || childLinkFn;
              previousCompileContext = null;
            }
            return linkFnFound ? compositeLinkFn : null;
            function compositeLinkFn(scope, nodeList, $rootElement, boundTranscludeFn) {
              var nodeLinkFn, childLinkFn, node, $node, childScope, childTranscludeFn, i, ii, n;
              var nodeListLength = nodeList.length, stableNodeList = new Array(nodeListLength);
              for (i = 0; i < nodeListLength; i++) {
                stableNodeList[i] = nodeList[i];
              }
              for (i = 0, n = 0, ii = linkFns.length; i < ii; n++) {
                node = stableNodeList[n];
                nodeLinkFn = linkFns[i++];
                childLinkFn = linkFns[i++];
                $node = jqLite(node);
                if (nodeLinkFn) {
                  if (nodeLinkFn.scope) {
                    childScope = scope.$new();
                    $node.data('$scope', childScope);
                  } else {
                    childScope = scope;
                  }
                  childTranscludeFn = nodeLinkFn.transclude;
                  if (childTranscludeFn || !boundTranscludeFn && transcludeFn) {
                    nodeLinkFn(childLinkFn, childScope, node, $rootElement, createBoundTranscludeFn(scope, childTranscludeFn || transcludeFn));
                  } else {
                    nodeLinkFn(childLinkFn, childScope, node, $rootElement, boundTranscludeFn);
                  }
                } else if (childLinkFn) {
                  childLinkFn(scope, node.childNodes, undefined, boundTranscludeFn);
                }
              }
            }
          }
          function createBoundTranscludeFn(scope, transcludeFn) {
            return function boundTranscludeFn(transcludedScope, cloneFn, controllers) {
              var scopeCreated = false;
              if (!transcludedScope) {
                transcludedScope = scope.$new();
                transcludedScope.$$transcluded = true;
                scopeCreated = true;
              }
              var clone = transcludeFn(transcludedScope, cloneFn, controllers);
              if (scopeCreated) {
                clone.on('$destroy', bind(transcludedScope, transcludedScope.$destroy));
              }
              return clone;
            };
          }
          function collectDirectives(node, directives, attrs, maxPriority, ignoreDirective) {
            var nodeType = node.nodeType, attrsMap = attrs.$attr, match, className;
            switch (nodeType) {
            case 1:
              addDirective(directives, directiveNormalize(nodeName_(node).toLowerCase()), 'E', maxPriority, ignoreDirective);
              for (var attr, name, nName, ngAttrName, value, nAttrs = node.attributes, j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
                var attrStartName = false;
                var attrEndName = false;
                attr = nAttrs[j];
                if (!msie || msie >= 8 || attr.specified) {
                  name = attr.name;
                  ngAttrName = directiveNormalize(name);
                  if (NG_ATTR_BINDING.test(ngAttrName)) {
                    name = snake_case(ngAttrName.substr(6), '-');
                  }
                  var directiveNName = ngAttrName.replace(/(Start|End)$/, '');
                  if (ngAttrName === directiveNName + 'Start') {
                    attrStartName = name;
                    attrEndName = name.substr(0, name.length - 5) + 'end';
                    name = name.substr(0, name.length - 6);
                  }
                  nName = directiveNormalize(name.toLowerCase());
                  attrsMap[nName] = name;
                  attrs[nName] = value = trim(attr.value);
                  if (getBooleanAttrName(node, nName)) {
                    attrs[nName] = true;
                  }
                  addAttrInterpolateDirective(node, directives, value, nName);
                  addDirective(directives, nName, 'A', maxPriority, ignoreDirective, attrStartName, attrEndName);
                }
              }
              className = node.className;
              if (isString(className) && className !== '') {
                while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
                  nName = directiveNormalize(match[2]);
                  if (addDirective(directives, nName, 'C', maxPriority, ignoreDirective)) {
                    attrs[nName] = trim(match[3]);
                  }
                  className = className.substr(match.index + match[0].length);
                }
              }
              break;
            case 3:
              addTextInterpolateDirective(directives, node.nodeValue);
              break;
            case 8:
              try {
                match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
                if (match) {
                  nName = directiveNormalize(match[1]);
                  if (addDirective(directives, nName, 'M', maxPriority, ignoreDirective)) {
                    attrs[nName] = trim(match[2]);
                  }
                }
              } catch (e) {
              }
              break;
            }
            directives.sort(byPriority);
            return directives;
          }
          function groupScan(node, attrStart, attrEnd) {
            var nodes = [];
            var depth = 0;
            if (attrStart && node.hasAttribute && node.hasAttribute(attrStart)) {
              var startNode = node;
              do {
                if (!node) {
                  throw $compileMinErr('uterdir', 'Unterminated attribute, found \'{0}\' but no matching \'{1}\' found.', attrStart, attrEnd);
                }
                if (node.nodeType == 1) {
                  if (node.hasAttribute(attrStart))
                    depth++;
                  if (node.hasAttribute(attrEnd))
                    depth--;
                }
                nodes.push(node);
                node = node.nextSibling;
              } while (depth > 0);
            } else {
              nodes.push(node);
            }
            return jqLite(nodes);
          }
          function groupElementsLinkFnWrapper(linkFn, attrStart, attrEnd) {
            return function (scope, element, attrs, controllers, transcludeFn) {
              element = groupScan(element[0], attrStart, attrEnd);
              return linkFn(scope, element, attrs, controllers, transcludeFn);
            };
          }
          function applyDirectivesToNode(directives, compileNode, templateAttrs, transcludeFn, jqCollection, originalReplaceDirective, preLinkFns, postLinkFns, previousCompileContext) {
            previousCompileContext = previousCompileContext || {};
            var terminalPriority = -Number.MAX_VALUE, newScopeDirective, controllerDirectives = previousCompileContext.controllerDirectives, newIsolateScopeDirective = previousCompileContext.newIsolateScopeDirective, templateDirective = previousCompileContext.templateDirective, nonTlbTranscludeDirective = previousCompileContext.nonTlbTranscludeDirective, hasTranscludeDirective = false, hasElementTranscludeDirective = false, $compileNode = templateAttrs.$$element = jqLite(compileNode), directive, directiveName, $template, replaceDirective = originalReplaceDirective, childTranscludeFn = transcludeFn, linkFn, directiveValue;
            for (var i = 0, ii = directives.length; i < ii; i++) {
              directive = directives[i];
              var attrStart = directive.$$start;
              var attrEnd = directive.$$end;
              if (attrStart) {
                $compileNode = groupScan(compileNode, attrStart, attrEnd);
              }
              $template = undefined;
              if (terminalPriority > directive.priority) {
                break;
              }
              if (directiveValue = directive.scope) {
                newScopeDirective = newScopeDirective || directive;
                if (!directive.templateUrl) {
                  assertNoDuplicate('new/isolated scope', newIsolateScopeDirective, directive, $compileNode);
                  if (isObject(directiveValue)) {
                    newIsolateScopeDirective = directive;
                  }
                }
              }
              directiveName = directive.name;
              if (!directive.templateUrl && directive.controller) {
                directiveValue = directive.controller;
                controllerDirectives = controllerDirectives || {};
                assertNoDuplicate('\'' + directiveName + '\' controller', controllerDirectives[directiveName], directive, $compileNode);
                controllerDirectives[directiveName] = directive;
              }
              if (directiveValue = directive.transclude) {
                hasTranscludeDirective = true;
                if (!directive.$$tlb) {
                  assertNoDuplicate('transclusion', nonTlbTranscludeDirective, directive, $compileNode);
                  nonTlbTranscludeDirective = directive;
                }
                if (directiveValue == 'element') {
                  hasElementTranscludeDirective = true;
                  terminalPriority = directive.priority;
                  $template = groupScan(compileNode, attrStart, attrEnd);
                  $compileNode = templateAttrs.$$element = jqLite(document.createComment(' ' + directiveName + ': ' + templateAttrs[directiveName] + ' '));
                  compileNode = $compileNode[0];
                  replaceWith(jqCollection, jqLite(sliceArgs($template)), compileNode);
                  childTranscludeFn = compile($template, transcludeFn, terminalPriority, replaceDirective && replaceDirective.name, { nonTlbTranscludeDirective: nonTlbTranscludeDirective });
                } else {
                  $template = jqLite(jqLiteClone(compileNode)).contents();
                  $compileNode.empty();
                  childTranscludeFn = compile($template, transcludeFn);
                }
              }
              if (directive.template) {
                assertNoDuplicate('template', templateDirective, directive, $compileNode);
                templateDirective = directive;
                directiveValue = isFunction(directive.template) ? directive.template($compileNode, templateAttrs) : directive.template;
                directiveValue = denormalizeTemplate(directiveValue);
                if (directive.replace) {
                  replaceDirective = directive;
                  $template = jqLite('<div>' + trim(directiveValue) + '</div>').contents();
                  compileNode = $template[0];
                  if ($template.length != 1 || compileNode.nodeType !== 1) {
                    throw $compileMinErr('tplrt', 'Template for directive \'{0}\' must have exactly one root element. {1}', directiveName, '');
                  }
                  replaceWith(jqCollection, $compileNode, compileNode);
                  var newTemplateAttrs = { $attr: {} };
                  var templateDirectives = collectDirectives(compileNode, [], newTemplateAttrs);
                  var unprocessedDirectives = directives.splice(i + 1, directives.length - (i + 1));
                  if (newIsolateScopeDirective) {
                    markDirectivesAsIsolate(templateDirectives);
                  }
                  directives = directives.concat(templateDirectives).concat(unprocessedDirectives);
                  mergeTemplateAttributes(templateAttrs, newTemplateAttrs);
                  ii = directives.length;
                } else {
                  $compileNode.html(directiveValue);
                }
              }
              if (directive.templateUrl) {
                assertNoDuplicate('template', templateDirective, directive, $compileNode);
                templateDirective = directive;
                if (directive.replace) {
                  replaceDirective = directive;
                }
                nodeLinkFn = compileTemplateUrl(directives.splice(i, directives.length - i), $compileNode, templateAttrs, jqCollection, childTranscludeFn, preLinkFns, postLinkFns, {
                  controllerDirectives: controllerDirectives,
                  newIsolateScopeDirective: newIsolateScopeDirective,
                  templateDirective: templateDirective,
                  nonTlbTranscludeDirective: nonTlbTranscludeDirective
                });
                ii = directives.length;
              } else if (directive.compile) {
                try {
                  linkFn = directive.compile($compileNode, templateAttrs, childTranscludeFn);
                  if (isFunction(linkFn)) {
                    addLinkFns(null, linkFn, attrStart, attrEnd);
                  } else if (linkFn) {
                    addLinkFns(linkFn.pre, linkFn.post, attrStart, attrEnd);
                  }
                } catch (e) {
                  $exceptionHandler(e, startingTag($compileNode));
                }
              }
              if (directive.terminal) {
                nodeLinkFn.terminal = true;
                terminalPriority = Math.max(terminalPriority, directive.priority);
              }
            }
            nodeLinkFn.scope = newScopeDirective && newScopeDirective.scope === true;
            nodeLinkFn.transclude = hasTranscludeDirective && childTranscludeFn;
            return nodeLinkFn;
            function addLinkFns(pre, post, attrStart, attrEnd) {
              if (pre) {
                if (attrStart)
                  pre = groupElementsLinkFnWrapper(pre, attrStart, attrEnd);
                pre.require = directive.require;
                if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                  pre = cloneAndAnnotateFn(pre, { isolateScope: true });
                }
                preLinkFns.push(pre);
              }
              if (post) {
                if (attrStart)
                  post = groupElementsLinkFnWrapper(post, attrStart, attrEnd);
                post.require = directive.require;
                if (newIsolateScopeDirective === directive || directive.$$isolateScope) {
                  post = cloneAndAnnotateFn(post, { isolateScope: true });
                }
                postLinkFns.push(post);
              }
            }
            function getControllers(require, $element, elementControllers) {
              var value, retrievalMethod = 'data', optional = false;
              if (isString(require)) {
                while ((value = require.charAt(0)) == '^' || value == '?') {
                  require = require.substr(1);
                  if (value == '^') {
                    retrievalMethod = 'inheritedData';
                  }
                  optional = optional || value == '?';
                }
                value = null;
                if (elementControllers && retrievalMethod === 'data') {
                  value = elementControllers[require];
                }
                value = value || $element[retrievalMethod]('$' + require + 'Controller');
                if (!value && !optional) {
                  throw $compileMinErr('ctreq', 'Controller \'{0}\', required by directive \'{1}\', can\'t be found!', require, directiveName);
                }
                return value;
              } else if (isArray(require)) {
                value = [];
                forEach(require, function (require) {
                  value.push(getControllers(require, $element, elementControllers));
                });
              }
              return value;
            }
            function nodeLinkFn(childLinkFn, scope, linkNode, $rootElement, boundTranscludeFn) {
              var attrs, $element, i, ii, linkFn, controller, isolateScope, elementControllers = {}, transcludeFn;
              if (compileNode === linkNode) {
                attrs = templateAttrs;
              } else {
                attrs = shallowCopy(templateAttrs, new Attributes(jqLite(linkNode), templateAttrs.$attr));
              }
              $element = attrs.$$element;
              if (newIsolateScopeDirective) {
                var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
                var $linkNode = jqLite(linkNode);
                isolateScope = scope.$new(true);
                if (templateDirective && templateDirective === newIsolateScopeDirective.$$originalDirective) {
                  $linkNode.data('$isolateScope', isolateScope);
                } else {
                  $linkNode.data('$isolateScopeNoTemplate', isolateScope);
                }
                safeAddClass($linkNode, 'ng-isolate-scope');
                forEach(newIsolateScopeDirective.scope, function (definition, scopeName) {
                  var match = definition.match(LOCAL_REGEXP) || [], attrName = match[3] || scopeName, optional = match[2] == '?', mode = match[1], lastValue, parentGet, parentSet, compare;
                  isolateScope.$$isolateBindings[scopeName] = mode + attrName;
                  switch (mode) {
                  case '@':
                    attrs.$observe(attrName, function (value) {
                      isolateScope[scopeName] = value;
                    });
                    attrs.$$observers[attrName].$$scope = scope;
                    if (attrs[attrName]) {
                      isolateScope[scopeName] = $interpolate(attrs[attrName])(scope);
                    }
                    break;
                  case '=':
                    if (optional && !attrs[attrName]) {
                      return;
                    }
                    parentGet = $parse(attrs[attrName]);
                    if (parentGet.literal) {
                      compare = equals;
                    } else {
                      compare = function (a, b) {
                        return a === b;
                      };
                    }
                    parentSet = parentGet.assign || function () {
                      lastValue = isolateScope[scopeName] = parentGet(scope);
                      throw $compileMinErr('nonassign', 'Expression \'{0}\' used with directive \'{1}\' is non-assignable!', attrs[attrName], newIsolateScopeDirective.name);
                    };
                    lastValue = isolateScope[scopeName] = parentGet(scope);
                    isolateScope.$watch(function parentValueWatch() {
                      var parentValue = parentGet(scope);
                      if (!compare(parentValue, isolateScope[scopeName])) {
                        if (!compare(parentValue, lastValue)) {
                          isolateScope[scopeName] = parentValue;
                        } else {
                          parentSet(scope, parentValue = isolateScope[scopeName]);
                        }
                      }
                      return lastValue = parentValue;
                    }, null, parentGet.literal);
                    break;
                  case '&':
                    parentGet = $parse(attrs[attrName]);
                    isolateScope[scopeName] = function (locals) {
                      return parentGet(scope, locals);
                    };
                    break;
                  default:
                    throw $compileMinErr('iscp', 'Invalid isolate scope definition for directive \'{0}\'.' + ' Definition: {... {1}: \'{2}\' ...}', newIsolateScopeDirective.name, scopeName, definition);
                  }
                });
              }
              transcludeFn = boundTranscludeFn && controllersBoundTransclude;
              if (controllerDirectives) {
                forEach(controllerDirectives, function (directive) {
                  var locals = {
                      $scope: directive === newIsolateScopeDirective || directive.$$isolateScope ? isolateScope : scope,
                      $element: $element,
                      $attrs: attrs,
                      $transclude: transcludeFn
                    }, controllerInstance;
                  controller = directive.controller;
                  if (controller == '@') {
                    controller = attrs[directive.name];
                  }
                  controllerInstance = $controller(controller, locals);
                  elementControllers[directive.name] = controllerInstance;
                  if (!hasElementTranscludeDirective) {
                    $element.data('$' + directive.name + 'Controller', controllerInstance);
                  }
                  if (directive.controllerAs) {
                    locals.$scope[directive.controllerAs] = controllerInstance;
                  }
                });
              }
              for (i = 0, ii = preLinkFns.length; i < ii; i++) {
                try {
                  linkFn = preLinkFns[i];
                  linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
                } catch (e) {
                  $exceptionHandler(e, startingTag($element));
                }
              }
              var scopeToChild = scope;
              if (newIsolateScopeDirective && (newIsolateScopeDirective.template || newIsolateScopeDirective.templateUrl === null)) {
                scopeToChild = isolateScope;
              }
              childLinkFn && childLinkFn(scopeToChild, linkNode.childNodes, undefined, boundTranscludeFn);
              for (i = postLinkFns.length - 1; i >= 0; i--) {
                try {
                  linkFn = postLinkFns[i];
                  linkFn(linkFn.isolateScope ? isolateScope : scope, $element, attrs, linkFn.require && getControllers(linkFn.require, $element, elementControllers), transcludeFn);
                } catch (e) {
                  $exceptionHandler(e, startingTag($element));
                }
              }
              function controllersBoundTransclude(scope, cloneAttachFn) {
                var transcludeControllers;
                if (arguments.length < 2) {
                  cloneAttachFn = scope;
                  scope = undefined;
                }
                if (hasElementTranscludeDirective) {
                  transcludeControllers = elementControllers;
                }
                return boundTranscludeFn(scope, cloneAttachFn, transcludeControllers);
              }
            }
          }
          function markDirectivesAsIsolate(directives) {
            for (var j = 0, jj = directives.length; j < jj; j++) {
              directives[j] = inherit(directives[j], { $$isolateScope: true });
            }
          }
          function addDirective(tDirectives, name, location, maxPriority, ignoreDirective, startAttrName, endAttrName) {
            if (name === ignoreDirective)
              return null;
            var match = null;
            if (hasDirectives.hasOwnProperty(name)) {
              for (var directive, directives = $injector.get(name + Suffix), i = 0, ii = directives.length; i < ii; i++) {
                try {
                  directive = directives[i];
                  if ((maxPriority === undefined || maxPriority > directive.priority) && directive.restrict.indexOf(location) != -1) {
                    if (startAttrName) {
                      directive = inherit(directive, {
                        $$start: startAttrName,
                        $$end: endAttrName
                      });
                    }
                    tDirectives.push(directive);
                    match = directive;
                  }
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
            }
            return match;
          }
          function mergeTemplateAttributes(dst, src) {
            var srcAttr = src.$attr, dstAttr = dst.$attr, $element = dst.$$element;
            forEach(dst, function (value, key) {
              if (key.charAt(0) != '$') {
                if (src[key]) {
                  value += (key === 'style' ? ';' : ' ') + src[key];
                }
                dst.$set(key, value, true, srcAttr[key]);
              }
            });
            forEach(src, function (value, key) {
              if (key == 'class') {
                safeAddClass($element, value);
                dst['class'] = (dst['class'] ? dst['class'] + ' ' : '') + value;
              } else if (key == 'style') {
                $element.attr('style', $element.attr('style') + ';' + value);
                dst['style'] = (dst['style'] ? dst['style'] + ';' : '') + value;
              } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
                dst[key] = value;
                dstAttr[key] = srcAttr[key];
              }
            });
          }
          function compileTemplateUrl(directives, $compileNode, tAttrs, $rootElement, childTranscludeFn, preLinkFns, postLinkFns, previousCompileContext) {
            var linkQueue = [], afterTemplateNodeLinkFn, afterTemplateChildLinkFn, beforeTemplateCompileNode = $compileNode[0], origAsyncDirective = directives.shift(), derivedSyncDirective = extend({}, origAsyncDirective, {
                templateUrl: null,
                transclude: null,
                replace: null,
                $$originalDirective: origAsyncDirective
              }), templateUrl = isFunction(origAsyncDirective.templateUrl) ? origAsyncDirective.templateUrl($compileNode, tAttrs) : origAsyncDirective.templateUrl;
            $compileNode.empty();
            $http.get($sce.getTrustedResourceUrl(templateUrl), { cache: $templateCache }).success(function (content) {
              var compileNode, tempTemplateAttrs, $template, childBoundTranscludeFn;
              content = denormalizeTemplate(content);
              if (origAsyncDirective.replace) {
                $template = jqLite('<div>' + trim(content) + '</div>').contents();
                compileNode = $template[0];
                if ($template.length != 1 || compileNode.nodeType !== 1) {
                  throw $compileMinErr('tplrt', 'Template for directive \'{0}\' must have exactly one root element. {1}', origAsyncDirective.name, templateUrl);
                }
                tempTemplateAttrs = { $attr: {} };
                replaceWith($rootElement, $compileNode, compileNode);
                var templateDirectives = collectDirectives(compileNode, [], tempTemplateAttrs);
                if (isObject(origAsyncDirective.scope)) {
                  markDirectivesAsIsolate(templateDirectives);
                }
                directives = templateDirectives.concat(directives);
                mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
              } else {
                compileNode = beforeTemplateCompileNode;
                $compileNode.html(content);
              }
              directives.unshift(derivedSyncDirective);
              afterTemplateNodeLinkFn = applyDirectivesToNode(directives, compileNode, tAttrs, childTranscludeFn, $compileNode, origAsyncDirective, preLinkFns, postLinkFns, previousCompileContext);
              forEach($rootElement, function (node, i) {
                if (node == compileNode) {
                  $rootElement[i] = $compileNode[0];
                }
              });
              afterTemplateChildLinkFn = compileNodes($compileNode[0].childNodes, childTranscludeFn);
              while (linkQueue.length) {
                var scope = linkQueue.shift(), beforeTemplateLinkNode = linkQueue.shift(), linkRootElement = linkQueue.shift(), boundTranscludeFn = linkQueue.shift(), linkNode = $compileNode[0];
                if (beforeTemplateLinkNode !== beforeTemplateCompileNode) {
                  var oldClasses = beforeTemplateLinkNode.className;
                  linkNode = jqLiteClone(compileNode);
                  replaceWith(linkRootElement, jqLite(beforeTemplateLinkNode), linkNode);
                  safeAddClass(jqLite(linkNode), oldClasses);
                }
                if (afterTemplateNodeLinkFn.transclude) {
                  childBoundTranscludeFn = createBoundTranscludeFn(scope, afterTemplateNodeLinkFn.transclude);
                } else {
                  childBoundTranscludeFn = boundTranscludeFn;
                }
                afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, linkNode, $rootElement, childBoundTranscludeFn);
              }
              linkQueue = null;
            }).error(function (response, code, headers, config) {
              throw $compileMinErr('tpload', 'Failed to load template: {0}', config.url);
            });
            return function delayedNodeLinkFn(ignoreChildLinkFn, scope, node, rootElement, boundTranscludeFn) {
              if (linkQueue) {
                linkQueue.push(scope);
                linkQueue.push(node);
                linkQueue.push(rootElement);
                linkQueue.push(boundTranscludeFn);
              } else {
                afterTemplateNodeLinkFn(afterTemplateChildLinkFn, scope, node, rootElement, boundTranscludeFn);
              }
            };
          }
          function byPriority(a, b) {
            var diff = b.priority - a.priority;
            if (diff !== 0)
              return diff;
            if (a.name !== b.name)
              return a.name < b.name ? -1 : 1;
            return a.index - b.index;
          }
          function assertNoDuplicate(what, previousDirective, directive, element) {
            if (previousDirective) {
              throw $compileMinErr('multidir', 'Multiple directives [{0}, {1}] asking for {2} on: {3}', previousDirective.name, directive.name, what, startingTag(element));
            }
          }
          function addTextInterpolateDirective(directives, text) {
            var interpolateFn = $interpolate(text, true);
            if (interpolateFn) {
              directives.push({
                priority: 0,
                compile: valueFn(function textInterpolateLinkFn(scope, node) {
                  var parent = node.parent(), bindings = parent.data('$binding') || [];
                  bindings.push(interpolateFn);
                  safeAddClass(parent.data('$binding', bindings), 'ng-binding');
                  scope.$watch(interpolateFn, function interpolateFnWatchAction(value) {
                    node[0].nodeValue = value;
                  });
                })
              });
            }
          }
          function getTrustedContext(node, attrNormalizedName) {
            if (attrNormalizedName == 'srcdoc') {
              return $sce.HTML;
            }
            var tag = nodeName_(node);
            if (attrNormalizedName == 'xlinkHref' || tag == 'FORM' && attrNormalizedName == 'action' || tag != 'IMG' && (attrNormalizedName == 'src' || attrNormalizedName == 'ngSrc')) {
              return $sce.RESOURCE_URL;
            }
          }
          function addAttrInterpolateDirective(node, directives, value, name) {
            var interpolateFn = $interpolate(value, true);
            if (!interpolateFn)
              return;
            if (name === 'multiple' && nodeName_(node) === 'SELECT') {
              throw $compileMinErr('selmulti', 'Binding to the \'multiple\' attribute is not supported. Element: {0}', startingTag(node));
            }
            directives.push({
              priority: 100,
              compile: function () {
                return {
                  pre: function attrInterpolatePreLinkFn(scope, element, attr) {
                    var $$observers = attr.$$observers || (attr.$$observers = {});
                    if (EVENT_HANDLER_ATTR_REGEXP.test(name)) {
                      throw $compileMinErr('nodomevents', 'Interpolations for HTML DOM event attributes are disallowed.  Please use the ' + 'ng- versions (such as ng-click instead of onclick) instead.');
                    }
                    interpolateFn = $interpolate(attr[name], true, getTrustedContext(node, name));
                    if (!interpolateFn)
                      return;
                    attr[name] = interpolateFn(scope);
                    ($$observers[name] || ($$observers[name] = [])).$$inter = true;
                    (attr.$$observers && attr.$$observers[name].$$scope || scope).$watch(interpolateFn, function interpolateFnWatchAction(newValue, oldValue) {
                      if (name === 'class' && newValue != oldValue) {
                        attr.$updateClass(newValue, oldValue);
                      } else {
                        attr.$set(name, newValue);
                      }
                    });
                  }
                };
              }
            });
          }
          function replaceWith($rootElement, elementsToRemove, newNode) {
            var firstElementToRemove = elementsToRemove[0], removeCount = elementsToRemove.length, parent = firstElementToRemove.parentNode, i, ii;
            if ($rootElement) {
              for (i = 0, ii = $rootElement.length; i < ii; i++) {
                if ($rootElement[i] == firstElementToRemove) {
                  $rootElement[i++] = newNode;
                  for (var j = i, j2 = j + removeCount - 1, jj = $rootElement.length; j < jj; j++, j2++) {
                    if (j2 < jj) {
                      $rootElement[j] = $rootElement[j2];
                    } else {
                      delete $rootElement[j];
                    }
                  }
                  $rootElement.length -= removeCount - 1;
                  break;
                }
              }
            }
            if (parent) {
              parent.replaceChild(newNode, firstElementToRemove);
            }
            var fragment = document.createDocumentFragment();
            fragment.appendChild(firstElementToRemove);
            newNode[jqLite.expando] = firstElementToRemove[jqLite.expando];
            for (var k = 1, kk = elementsToRemove.length; k < kk; k++) {
              var element = elementsToRemove[k];
              jqLite(element).remove();
              fragment.appendChild(element);
              delete elementsToRemove[k];
            }
            elementsToRemove[0] = newNode;
            elementsToRemove.length = 1;
          }
          function cloneAndAnnotateFn(fn, annotation) {
            return extend(function () {
              return fn.apply(null, arguments);
            }, fn, annotation);
          }
        }
      ];
    }
    var PREFIX_REGEXP = /^(x[\:\-_]|data[\:\-_])/i;
    function directiveNormalize(name) {
      return camelCase(name.replace(PREFIX_REGEXP, ''));
    }
    function nodesetLinkingFn(scope, nodeList, rootElement, boundTranscludeFn) {
    }
    function directiveLinkingFn(nodesetLinkingFn, scope, node, rootElement, boundTranscludeFn) {
    }
    function tokenDifference(str1, str2) {
      var values = '', tokens1 = str1.split(/\s+/), tokens2 = str2.split(/\s+/);
      outer:
        for (var i = 0; i < tokens1.length; i++) {
          var token = tokens1[i];
          for (var j = 0; j < tokens2.length; j++) {
            if (token == tokens2[j])
              continue outer;
          }
          values += (values.length > 0 ? ' ' : '') + token;
        }
      return values;
    }
    function $ControllerProvider() {
      var controllers = {}, CNTRL_REG = /^(\S+)(\s+as\s+(\w+))?$/;
      this.register = function (name, constructor) {
        assertNotHasOwnProperty(name, 'controller');
        if (isObject(name)) {
          extend(controllers, name);
        } else {
          controllers[name] = constructor;
        }
      };
      this.$get = [
        '$injector',
        '$window',
        function ($injector, $window) {
          return function (expression, locals) {
            var instance, match, constructor, identifier;
            if (isString(expression)) {
              match = expression.match(CNTRL_REG), constructor = match[1], identifier = match[3];
              expression = controllers.hasOwnProperty(constructor) ? controllers[constructor] : getter(locals.$scope, constructor, true) || getter($window, constructor, true);
              assertArgFn(expression, constructor, true);
            }
            instance = $injector.instantiate(expression, locals);
            if (identifier) {
              if (!(locals && typeof locals.$scope == 'object')) {
                throw minErr('$controller')('noscp', 'Cannot export controller \'{0}\' as \'{1}\'! No $scope object provided via `locals`.', constructor || expression.name, identifier);
              }
              locals.$scope[identifier] = instance;
            }
            return instance;
          };
        }
      ];
    }
    function $DocumentProvider() {
      this.$get = [
        '$window',
        function (window) {
          return jqLite(window.document);
        }
      ];
    }
    function $ExceptionHandlerProvider() {
      this.$get = [
        '$log',
        function ($log) {
          return function (exception, cause) {
            $log.error.apply($log, arguments);
          };
        }
      ];
    }
    function parseHeaders(headers) {
      var parsed = {}, key, val, i;
      if (!headers)
        return parsed;
      forEach(headers.split('\n'), function (line) {
        i = line.indexOf(':');
        key = lowercase(trim(line.substr(0, i)));
        val = trim(line.substr(i + 1));
        if (key) {
          if (parsed[key]) {
            parsed[key] += ', ' + val;
          } else {
            parsed[key] = val;
          }
        }
      });
      return parsed;
    }
    function headersGetter(headers) {
      var headersObj = isObject(headers) ? headers : undefined;
      return function (name) {
        if (!headersObj)
          headersObj = parseHeaders(headers);
        if (name) {
          return headersObj[lowercase(name)] || null;
        }
        return headersObj;
      };
    }
    function transformData(data, headers, fns) {
      if (isFunction(fns))
        return fns(data, headers);
      forEach(fns, function (fn) {
        data = fn(data, headers);
      });
      return data;
    }
    function isSuccess(status) {
      return 200 <= status && status < 300;
    }
    function $HttpProvider() {
      var JSON_START = /^\s*(\[|\{[^\{])/, JSON_END = /[\}\]]\s*$/, PROTECTION_PREFIX = /^\)\]\}',?\n/, CONTENT_TYPE_APPLICATION_JSON = { 'Content-Type': 'application/json;charset=utf-8' };
      var defaults = this.defaults = {
          transformResponse: [function (data) {
              if (isString(data)) {
                data = data.replace(PROTECTION_PREFIX, '');
                if (JSON_START.test(data) && JSON_END.test(data))
                  data = fromJson(data);
              }
              return data;
            }],
          transformRequest: [function (d) {
              return isObject(d) && !isFile(d) ? toJson(d) : d;
            }],
          headers: {
            common: { 'Accept': 'application/json, text/plain, */*' },
            post: copy(CONTENT_TYPE_APPLICATION_JSON),
            put: copy(CONTENT_TYPE_APPLICATION_JSON),
            patch: copy(CONTENT_TYPE_APPLICATION_JSON)
          },
          xsrfCookieName: 'XSRF-TOKEN',
          xsrfHeaderName: 'X-XSRF-TOKEN'
        };
      var interceptorFactories = this.interceptors = [];
      var responseInterceptorFactories = this.responseInterceptors = [];
      this.$get = [
        '$httpBackend',
        '$browser',
        '$cacheFactory',
        '$rootScope',
        '$q',
        '$injector',
        function ($httpBackend, $browser, $cacheFactory, $rootScope, $q, $injector) {
          var defaultCache = $cacheFactory('$http');
          var reversedInterceptors = [];
          forEach(interceptorFactories, function (interceptorFactory) {
            reversedInterceptors.unshift(isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
          });
          forEach(responseInterceptorFactories, function (interceptorFactory, index) {
            var responseFn = isString(interceptorFactory) ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory);
            reversedInterceptors.splice(index, 0, {
              response: function (response) {
                return responseFn($q.when(response));
              },
              responseError: function (response) {
                return responseFn($q.reject(response));
              }
            });
          });
          function $http(requestConfig) {
            var config = {
                transformRequest: defaults.transformRequest,
                transformResponse: defaults.transformResponse
              };
            var headers = mergeHeaders(requestConfig);
            extend(config, requestConfig);
            config.headers = headers;
            config.method = uppercase(config.method);
            var xsrfValue = urlIsSameOrigin(config.url) ? $browser.cookies()[config.xsrfCookieName || defaults.xsrfCookieName] : undefined;
            if (xsrfValue) {
              headers[config.xsrfHeaderName || defaults.xsrfHeaderName] = xsrfValue;
            }
            var serverRequest = function (config) {
              headers = config.headers;
              var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);
              if (isUndefined(config.data)) {
                forEach(headers, function (value, header) {
                  if (lowercase(header) === 'content-type') {
                    delete headers[header];
                  }
                });
              }
              if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
                config.withCredentials = defaults.withCredentials;
              }
              return sendReq(config, reqData, headers).then(transformResponse, transformResponse);
            };
            var chain = [
                serverRequest,
                undefined
              ];
            var promise = $q.when(config);
            forEach(reversedInterceptors, function (interceptor) {
              if (interceptor.request || interceptor.requestError) {
                chain.unshift(interceptor.request, interceptor.requestError);
              }
              if (interceptor.response || interceptor.responseError) {
                chain.push(interceptor.response, interceptor.responseError);
              }
            });
            while (chain.length) {
              var thenFn = chain.shift();
              var rejectFn = chain.shift();
              promise = promise.then(thenFn, rejectFn);
            }
            promise.success = function (fn) {
              promise.then(function (response) {
                fn(response.data, response.status, response.headers, config);
              });
              return promise;
            };
            promise.error = function (fn) {
              promise.then(null, function (response) {
                fn(response.data, response.status, response.headers, config);
              });
              return promise;
            };
            return promise;
            function transformResponse(response) {
              var resp = extend({}, response, { data: transformData(response.data, response.headers, config.transformResponse) });
              return isSuccess(response.status) ? resp : $q.reject(resp);
            }
            function mergeHeaders(config) {
              var defHeaders = defaults.headers, reqHeaders = extend({}, config.headers), defHeaderName, lowercaseDefHeaderName, reqHeaderName;
              defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);
              execHeaders(defHeaders);
              execHeaders(reqHeaders);
              defaultHeadersIteration:
                for (defHeaderName in defHeaders) {
                  lowercaseDefHeaderName = lowercase(defHeaderName);
                  for (reqHeaderName in reqHeaders) {
                    if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
                      continue defaultHeadersIteration;
                    }
                  }
                  reqHeaders[defHeaderName] = defHeaders[defHeaderName];
                }
              return reqHeaders;
              function execHeaders(headers) {
                var headerContent;
                forEach(headers, function (headerFn, header) {
                  if (isFunction(headerFn)) {
                    headerContent = headerFn();
                    if (headerContent != null) {
                      headers[header] = headerContent;
                    } else {
                      delete headers[header];
                    }
                  }
                });
              }
            }
          }
          $http.pendingRequests = [];
          createShortMethods('get', 'delete', 'head', 'jsonp');
          createShortMethodsWithData('post', 'put');
          $http.defaults = defaults;
          return $http;
          function createShortMethods(names) {
            forEach(arguments, function (name) {
              $http[name] = function (url, config) {
                return $http(extend(config || {}, {
                  method: name,
                  url: url
                }));
              };
            });
          }
          function createShortMethodsWithData(name) {
            forEach(arguments, function (name) {
              $http[name] = function (url, data, config) {
                return $http(extend(config || {}, {
                  method: name,
                  url: url,
                  data: data
                }));
              };
            });
          }
          function sendReq(config, reqData, reqHeaders) {
            var deferred = $q.defer(), promise = deferred.promise, cache, cachedResp, url = buildUrl(config.url, config.params);
            $http.pendingRequests.push(config);
            promise.then(removePendingReq, removePendingReq);
            if ((config.cache || defaults.cache) && config.cache !== false && config.method == 'GET') {
              cache = isObject(config.cache) ? config.cache : isObject(defaults.cache) ? defaults.cache : defaultCache;
            }
            if (cache) {
              cachedResp = cache.get(url);
              if (isDefined(cachedResp)) {
                if (cachedResp.then) {
                  cachedResp.then(removePendingReq, removePendingReq);
                  return cachedResp;
                } else {
                  if (isArray(cachedResp)) {
                    resolvePromise(cachedResp[1], cachedResp[0], copy(cachedResp[2]));
                  } else {
                    resolvePromise(cachedResp, 200, {});
                  }
                }
              } else {
                cache.put(url, promise);
              }
            }
            if (isUndefined(cachedResp)) {
              $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout, config.withCredentials, config.responseType);
            }
            return promise;
            function done(status, response, headersString) {
              if (cache) {
                if (isSuccess(status)) {
                  cache.put(url, [
                    status,
                    response,
                    parseHeaders(headersString)
                  ]);
                } else {
                  cache.remove(url);
                }
              }
              resolvePromise(response, status, headersString);
              if (!$rootScope.$$phase)
                $rootScope.$apply();
            }
            function resolvePromise(response, status, headers) {
              status = Math.max(status, 0);
              (isSuccess(status) ? deferred.resolve : deferred.reject)({
                data: response,
                status: status,
                headers: headersGetter(headers),
                config: config
              });
            }
            function removePendingReq() {
              var idx = indexOf($http.pendingRequests, config);
              if (idx !== -1)
                $http.pendingRequests.splice(idx, 1);
            }
          }
          function buildUrl(url, params) {
            if (!params)
              return url;
            var parts = [];
            forEachSorted(params, function (value, key) {
              if (value === null || isUndefined(value))
                return;
              if (!isArray(value))
                value = [value];
              forEach(value, function (v) {
                if (isObject(v)) {
                  v = toJson(v);
                }
                parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(v));
              });
            });
            return url + (url.indexOf('?') == -1 ? '?' : '&') + parts.join('&');
          }
        }
      ];
    }
    function createXhr(method) {
      if (msie <= 8 && (!method.match(/^(get|post|head|put|delete|options)$/i) || !window.XMLHttpRequest)) {
        return new window.ActiveXObject('Microsoft.XMLHTTP');
      } else if (window.XMLHttpRequest) {
        return new window.XMLHttpRequest();
      }
      throw minErr('$httpBackend')('noxhr', 'This browser does not support XMLHttpRequest.');
    }
    function $HttpBackendProvider() {
      this.$get = [
        '$browser',
        '$window',
        '$document',
        function ($browser, $window, $document) {
          return createHttpBackend($browser, createXhr, $browser.defer, $window.angular.callbacks, $document[0]);
        }
      ];
    }
    function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
      var ABORTED = -1;
      return function (method, url, post, callback, headers, timeout, withCredentials, responseType) {
        var status;
        $browser.$$incOutstandingRequestCount();
        url = url || $browser.url();
        if (lowercase(method) == 'jsonp') {
          var callbackId = '_' + (callbacks.counter++).toString(36);
          callbacks[callbackId] = function (data) {
            callbacks[callbackId].data = data;
          };
          var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId), function () {
              if (callbacks[callbackId].data) {
                completeRequest(callback, 200, callbacks[callbackId].data);
              } else {
                completeRequest(callback, status || -2);
              }
              callbacks[callbackId] = angular.noop;
            });
        } else {
          var xhr = createXhr(method);
          xhr.open(method, url, true);
          forEach(headers, function (value, key) {
            if (isDefined(value)) {
              xhr.setRequestHeader(key, value);
            }
          });
          xhr.onreadystatechange = function () {
            if (xhr && xhr.readyState == 4) {
              var responseHeaders = null, response = null;
              if (status !== ABORTED) {
                responseHeaders = xhr.getAllResponseHeaders();
                response = 'response' in xhr ? xhr.response : xhr.responseText;
              }
              completeRequest(callback, status || xhr.status, response, responseHeaders);
            }
          };
          if (withCredentials) {
            xhr.withCredentials = true;
          }
          if (responseType) {
            try {
              xhr.responseType = responseType;
            } catch (e) {
              if (responseType !== 'json') {
                throw e;
              }
            }
          }
          xhr.send(post || null);
        }
        if (timeout > 0) {
          var timeoutId = $browserDefer(timeoutRequest, timeout);
        } else if (timeout && timeout.then) {
          timeout.then(timeoutRequest);
        }
        function timeoutRequest() {
          status = ABORTED;
          jsonpDone && jsonpDone();
          xhr && xhr.abort();
        }
        function completeRequest(callback, status, response, headersString) {
          timeoutId && $browserDefer.cancel(timeoutId);
          jsonpDone = xhr = null;
          status = status === 0 ? response ? 200 : 404 : status;
          status = status == 1223 ? 204 : status;
          callback(status, response, headersString);
          $browser.$$completeOutstandingRequest(noop);
        }
      };
      function jsonpReq(url, done) {
        var script = rawDocument.createElement('script'), doneWrapper = function () {
            script.onreadystatechange = script.onload = script.onerror = null;
            rawDocument.body.removeChild(script);
            if (done)
              done();
          };
        script.type = 'text/javascript';
        script.src = url;
        if (msie && msie <= 8) {
          script.onreadystatechange = function () {
            if (/loaded|complete/.test(script.readyState)) {
              doneWrapper();
            }
          };
        } else {
          script.onload = script.onerror = function () {
            doneWrapper();
          };
        }
        rawDocument.body.appendChild(script);
        return doneWrapper;
      }
    }
    var $interpolateMinErr = minErr('$interpolate');
    function $InterpolateProvider() {
      var startSymbol = '{{';
      var endSymbol = '}}';
      this.startSymbol = function (value) {
        if (value) {
          startSymbol = value;
          return this;
        } else {
          return startSymbol;
        }
      };
      this.endSymbol = function (value) {
        if (value) {
          endSymbol = value;
          return this;
        } else {
          return endSymbol;
        }
      };
      this.$get = [
        '$parse',
        '$exceptionHandler',
        '$sce',
        function ($parse, $exceptionHandler, $sce) {
          var startSymbolLength = startSymbol.length, endSymbolLength = endSymbol.length;
          function $interpolate(text, mustHaveExpression, trustedContext) {
            var startIndex, endIndex, index = 0, parts = [], length = text.length, hasInterpolation = false, fn, exp, concat = [];
            while (index < length) {
              if ((startIndex = text.indexOf(startSymbol, index)) != -1 && (endIndex = text.indexOf(endSymbol, startIndex + startSymbolLength)) != -1) {
                index != startIndex && parts.push(text.substring(index, startIndex));
                parts.push(fn = $parse(exp = text.substring(startIndex + startSymbolLength, endIndex)));
                fn.exp = exp;
                index = endIndex + endSymbolLength;
                hasInterpolation = true;
              } else {
                index != length && parts.push(text.substring(index));
                index = length;
              }
            }
            if (!(length = parts.length)) {
              parts.push('');
              length = 1;
            }
            if (trustedContext && parts.length > 1) {
              throw $interpolateMinErr('noconcat', 'Error while interpolating: {0}\nStrict Contextual Escaping disallows ' + 'interpolations that concatenate multiple expressions when a trusted value is ' + 'required.  See http://docs.angularjs.org/api/ng.$sce', text);
            }
            if (!mustHaveExpression || hasInterpolation) {
              concat.length = length;
              fn = function (context) {
                try {
                  for (var i = 0, ii = length, part; i < ii; i++) {
                    if (typeof (part = parts[i]) == 'function') {
                      part = part(context);
                      if (trustedContext) {
                        part = $sce.getTrusted(trustedContext, part);
                      } else {
                        part = $sce.valueOf(part);
                      }
                      if (part === null || isUndefined(part)) {
                        part = '';
                      } else if (typeof part != 'string') {
                        part = toJson(part);
                      }
                    }
                    concat[i] = part;
                  }
                  return concat.join('');
                } catch (err) {
                  var newErr = $interpolateMinErr('interr', 'Can\'t interpolate: {0}\n{1}', text, err.toString());
                  $exceptionHandler(newErr);
                }
              };
              fn.exp = text;
              fn.parts = parts;
              return fn;
            }
          }
          $interpolate.startSymbol = function () {
            return startSymbol;
          };
          $interpolate.endSymbol = function () {
            return endSymbol;
          };
          return $interpolate;
        }
      ];
    }
    function $IntervalProvider() {
      this.$get = [
        '$rootScope',
        '$window',
        '$q',
        function ($rootScope, $window, $q) {
          var intervals = {};
          function interval(fn, delay, count, invokeApply) {
            var setInterval = $window.setInterval, clearInterval = $window.clearInterval, deferred = $q.defer(), promise = deferred.promise, iteration = 0, skipApply = isDefined(invokeApply) && !invokeApply;
            count = isDefined(count) ? count : 0;
            promise.then(null, null, fn);
            promise.$$intervalId = setInterval(function tick() {
              deferred.notify(iteration++);
              if (count > 0 && iteration >= count) {
                deferred.resolve(iteration);
                clearInterval(promise.$$intervalId);
                delete intervals[promise.$$intervalId];
              }
              if (!skipApply)
                $rootScope.$apply();
            }, delay);
            intervals[promise.$$intervalId] = deferred;
            return promise;
          }
          interval.cancel = function (promise) {
            if (promise && promise.$$intervalId in intervals) {
              intervals[promise.$$intervalId].reject('canceled');
              clearInterval(promise.$$intervalId);
              delete intervals[promise.$$intervalId];
              return true;
            }
            return false;
          };
          return interval;
        }
      ];
    }
    function $LocaleProvider() {
      this.$get = function () {
        return {
          id: 'en-us',
          NUMBER_FORMATS: {
            DECIMAL_SEP: '.',
            GROUP_SEP: ',',
            PATTERNS: [
              {
                minInt: 1,
                minFrac: 0,
                maxFrac: 3,
                posPre: '',
                posSuf: '',
                negPre: '-',
                negSuf: '',
                gSize: 3,
                lgSize: 3
              },
              {
                minInt: 1,
                minFrac: 2,
                maxFrac: 2,
                posPre: '\xa4',
                posSuf: '',
                negPre: '(\xa4',
                negSuf: ')',
                gSize: 3,
                lgSize: 3
              }
            ],
            CURRENCY_SYM: '$'
          },
          DATETIME_FORMATS: {
            MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
            SHORTMONTH: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
            DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
            SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
            AMPMS: [
              'AM',
              'PM'
            ],
            medium: 'MMM d, y h:mm:ss a',
            short: 'M/d/yy h:mm a',
            fullDate: 'EEEE, MMMM d, y',
            longDate: 'MMMM d, y',
            mediumDate: 'MMM d, y',
            shortDate: 'M/d/yy',
            mediumTime: 'h:mm:ss a',
            shortTime: 'h:mm a'
          },
          pluralCat: function (num) {
            if (num === 1) {
              return 'one';
            }
            return 'other';
          }
        };
      };
    }
    var PATH_MATCH = /^([^\?#]*)(\?([^#]*))?(#(.*))?$/, DEFAULT_PORTS = {
        'http': 80,
        'https': 443,
        'ftp': 21
      };
    var $locationMinErr = minErr('$location');
    function encodePath(path) {
      var segments = path.split('/'), i = segments.length;
      while (i--) {
        segments[i] = encodeUriSegment(segments[i]);
      }
      return segments.join('/');
    }
    function parseAbsoluteUrl(absoluteUrl, locationObj, appBase) {
      var parsedUrl = urlResolve(absoluteUrl, appBase);
      locationObj.$$protocol = parsedUrl.protocol;
      locationObj.$$host = parsedUrl.hostname;
      locationObj.$$port = int(parsedUrl.port) || DEFAULT_PORTS[parsedUrl.protocol] || null;
    }
    function parseAppUrl(relativeUrl, locationObj, appBase) {
      var prefixed = relativeUrl.charAt(0) !== '/';
      if (prefixed) {
        relativeUrl = '/' + relativeUrl;
      }
      var match = urlResolve(relativeUrl, appBase);
      locationObj.$$path = decodeURIComponent(prefixed && match.pathname.charAt(0) === '/' ? match.pathname.substring(1) : match.pathname);
      locationObj.$$search = parseKeyValue(match.search);
      locationObj.$$hash = decodeURIComponent(match.hash);
      if (locationObj.$$path && locationObj.$$path.charAt(0) != '/') {
        locationObj.$$path = '/' + locationObj.$$path;
      }
    }
    function beginsWith(begin, whole) {
      if (whole.indexOf(begin) === 0) {
        return whole.substr(begin.length);
      }
    }
    function stripHash(url) {
      var index = url.indexOf('#');
      return index == -1 ? url : url.substr(0, index);
    }
    function stripFile(url) {
      return url.substr(0, stripHash(url).lastIndexOf('/') + 1);
    }
    function serverBase(url) {
      return url.substring(0, url.indexOf('/', url.indexOf('//') + 2));
    }
    function LocationHtml5Url(appBase, basePrefix) {
      this.$$html5 = true;
      basePrefix = basePrefix || '';
      var appBaseNoFile = stripFile(appBase);
      parseAbsoluteUrl(appBase, this, appBase);
      this.$$parse = function (url) {
        var pathUrl = beginsWith(appBaseNoFile, url);
        if (!isString(pathUrl)) {
          throw $locationMinErr('ipthprfx', 'Invalid url "{0}", missing path prefix "{1}".', url, appBaseNoFile);
        }
        parseAppUrl(pathUrl, this, appBase);
        if (!this.$$path) {
          this.$$path = '/';
        }
        this.$$compose();
      };
      this.$$compose = function () {
        var search = toKeyValue(this.$$search), hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
        this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
        this.$$absUrl = appBaseNoFile + this.$$url.substr(1);
      };
      this.$$rewrite = function (url) {
        var appUrl, prevAppUrl;
        if ((appUrl = beginsWith(appBase, url)) !== undefined) {
          prevAppUrl = appUrl;
          if ((appUrl = beginsWith(basePrefix, appUrl)) !== undefined) {
            return appBaseNoFile + (beginsWith('/', appUrl) || appUrl);
          } else {
            return appBase + prevAppUrl;
          }
        } else if ((appUrl = beginsWith(appBaseNoFile, url)) !== undefined) {
          return appBaseNoFile + appUrl;
        } else if (appBaseNoFile == url + '/') {
          return appBaseNoFile;
        }
      };
    }
    function LocationHashbangUrl(appBase, hashPrefix) {
      var appBaseNoFile = stripFile(appBase);
      parseAbsoluteUrl(appBase, this, appBase);
      this.$$parse = function (url) {
        var withoutBaseUrl = beginsWith(appBase, url) || beginsWith(appBaseNoFile, url);
        var withoutHashUrl = withoutBaseUrl.charAt(0) == '#' ? beginsWith(hashPrefix, withoutBaseUrl) : this.$$html5 ? withoutBaseUrl : '';
        if (!isString(withoutHashUrl)) {
          throw $locationMinErr('ihshprfx', 'Invalid url "{0}", missing hash prefix "{1}".', url, hashPrefix);
        }
        parseAppUrl(withoutHashUrl, this, appBase);
        this.$$path = removeWindowsDriveName(this.$$path, withoutHashUrl, appBase);
        this.$$compose();
        function removeWindowsDriveName(path, url, base) {
          var windowsFilePathExp = /^\/?.*?:(\/.*)/;
          var firstPathSegmentMatch;
          if (url.indexOf(base) === 0) {
            url = url.replace(base, '');
          }
          if (windowsFilePathExp.exec(url)) {
            return path;
          }
          firstPathSegmentMatch = windowsFilePathExp.exec(path);
          return firstPathSegmentMatch ? firstPathSegmentMatch[1] : path;
        }
      };
      this.$$compose = function () {
        var search = toKeyValue(this.$$search), hash = this.$$hash ? '#' + encodeUriSegment(this.$$hash) : '';
        this.$$url = encodePath(this.$$path) + (search ? '?' + search : '') + hash;
        this.$$absUrl = appBase + (this.$$url ? hashPrefix + this.$$url : '');
      };
      this.$$rewrite = function (url) {
        if (stripHash(appBase) == stripHash(url)) {
          return url;
        }
      };
    }
    function LocationHashbangInHtml5Url(appBase, hashPrefix) {
      this.$$html5 = true;
      LocationHashbangUrl.apply(this, arguments);
      var appBaseNoFile = stripFile(appBase);
      this.$$rewrite = function (url) {
        var appUrl;
        if (appBase == stripHash(url)) {
          return url;
        } else if (appUrl = beginsWith(appBaseNoFile, url)) {
          return appBase + hashPrefix + appUrl;
        } else if (appBaseNoFile === url + '/') {
          return appBaseNoFile;
        }
      };
    }
    LocationHashbangInHtml5Url.prototype = LocationHashbangUrl.prototype = LocationHtml5Url.prototype = {
      $$html5: false,
      $$replace: false,
      absUrl: locationGetter('$$absUrl'),
      url: function (url, replace) {
        if (isUndefined(url))
          return this.$$url;
        var match = PATH_MATCH.exec(url);
        if (match[1])
          this.path(decodeURIComponent(match[1]));
        if (match[2] || match[1])
          this.search(match[3] || '');
        this.hash(match[5] || '', replace);
        return this;
      },
      protocol: locationGetter('$$protocol'),
      host: locationGetter('$$host'),
      port: locationGetter('$$port'),
      path: locationGetterSetter('$$path', function (path) {
        return path.charAt(0) == '/' ? path : '/' + path;
      }),
      search: function (search, paramValue) {
        switch (arguments.length) {
        case 0:
          return this.$$search;
        case 1:
          if (isString(search)) {
            this.$$search = parseKeyValue(search);
          } else if (isObject(search)) {
            this.$$search = search;
          } else {
            throw $locationMinErr('isrcharg', 'The first argument of the `$location#search()` call must be a string or an object.');
          }
          break;
        default:
          if (isUndefined(paramValue) || paramValue === null) {
            delete this.$$search[search];
          } else {
            this.$$search[search] = paramValue;
          }
        }
        this.$$compose();
        return this;
      },
      hash: locationGetterSetter('$$hash', identity),
      replace: function () {
        this.$$replace = true;
        return this;
      }
    };
    function locationGetter(property) {
      return function () {
        return this[property];
      };
    }
    function locationGetterSetter(property, preprocess) {
      return function (value) {
        if (isUndefined(value))
          return this[property];
        this[property] = preprocess(value);
        this.$$compose();
        return this;
      };
    }
    function $LocationProvider() {
      var hashPrefix = '', html5Mode = false;
      this.hashPrefix = function (prefix) {
        if (isDefined(prefix)) {
          hashPrefix = prefix;
          return this;
        } else {
          return hashPrefix;
        }
      };
      this.html5Mode = function (mode) {
        if (isDefined(mode)) {
          html5Mode = mode;
          return this;
        } else {
          return html5Mode;
        }
      };
      this.$get = [
        '$rootScope',
        '$browser',
        '$sniffer',
        '$rootElement',
        function ($rootScope, $browser, $sniffer, $rootElement) {
          var $location, LocationMode, baseHref = $browser.baseHref(), initialUrl = $browser.url(), appBase;
          if (html5Mode) {
            appBase = serverBase(initialUrl) + (baseHref || '/');
            LocationMode = $sniffer.history ? LocationHtml5Url : LocationHashbangInHtml5Url;
          } else {
            appBase = stripHash(initialUrl);
            LocationMode = LocationHashbangUrl;
          }
          $location = new LocationMode(appBase, '#' + hashPrefix);
          $location.$$parse($location.$$rewrite(initialUrl));
          $rootElement.on('click', function (event) {
            if (event.ctrlKey || event.metaKey || event.which == 2)
              return;
            var elm = jqLite(event.target);
            while (lowercase(elm[0].nodeName) !== 'a') {
              if (elm[0] === $rootElement[0] || !(elm = elm.parent())[0])
                return;
            }
            var absHref = elm.prop('href');
            if (isObject(absHref) && absHref.toString() === '[object SVGAnimatedString]') {
              absHref = urlResolve(absHref.animVal).href;
            }
            var rewrittenUrl = $location.$$rewrite(absHref);
            if (absHref && !elm.attr('target') && rewrittenUrl && !event.isDefaultPrevented()) {
              event.preventDefault();
              if (rewrittenUrl != $browser.url()) {
                $location.$$parse(rewrittenUrl);
                $rootScope.$apply();
                window.angular['ff-684208-preventDefault'] = true;
              }
            }
          });
          if ($location.absUrl() != initialUrl) {
            $browser.url($location.absUrl(), true);
          }
          $browser.onUrlChange(function (newUrl) {
            if ($location.absUrl() != newUrl) {
              $rootScope.$evalAsync(function () {
                var oldUrl = $location.absUrl();
                $location.$$parse(newUrl);
                if ($rootScope.$broadcast('$locationChangeStart', newUrl, oldUrl).defaultPrevented) {
                  $location.$$parse(oldUrl);
                  $browser.url(oldUrl);
                } else {
                  afterLocationChange(oldUrl);
                }
              });
              if (!$rootScope.$$phase)
                $rootScope.$digest();
            }
          });
          var changeCounter = 0;
          $rootScope.$watch(function $locationWatch() {
            var oldUrl = $browser.url();
            var currentReplace = $location.$$replace;
            if (!changeCounter || oldUrl != $location.absUrl()) {
              changeCounter++;
              $rootScope.$evalAsync(function () {
                if ($rootScope.$broadcast('$locationChangeStart', $location.absUrl(), oldUrl).defaultPrevented) {
                  $location.$$parse(oldUrl);
                } else {
                  $browser.url($location.absUrl(), currentReplace);
                  afterLocationChange(oldUrl);
                }
              });
            }
            $location.$$replace = false;
            return changeCounter;
          });
          return $location;
          function afterLocationChange(oldUrl) {
            $rootScope.$broadcast('$locationChangeSuccess', $location.absUrl(), oldUrl);
          }
        }
      ];
    }
    function $LogProvider() {
      var debug = true, self = this;
      this.debugEnabled = function (flag) {
        if (isDefined(flag)) {
          debug = flag;
          return this;
        } else {
          return debug;
        }
      };
      this.$get = [
        '$window',
        function ($window) {
          return {
            log: consoleLog('log'),
            info: consoleLog('info'),
            warn: consoleLog('warn'),
            error: consoleLog('error'),
            debug: function () {
              var fn = consoleLog('debug');
              return function () {
                if (debug) {
                  fn.apply(self, arguments);
                }
              };
            }()
          };
          function formatError(arg) {
            if (arg instanceof Error) {
              if (arg.stack) {
                arg = arg.message && arg.stack.indexOf(arg.message) === -1 ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
              } else if (arg.sourceURL) {
                arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
              }
            }
            return arg;
          }
          function consoleLog(type) {
            var console = $window.console || {}, logFn = console[type] || console.log || noop, hasApply = false;
            try {
              hasApply = !!logFn.apply;
            } catch (e) {
            }
            if (hasApply) {
              return function () {
                var args = [];
                forEach(arguments, function (arg) {
                  args.push(formatError(arg));
                });
                return logFn.apply(console, args);
              };
            }
            return function (arg1, arg2) {
              logFn(arg1, arg2 == null ? '' : arg2);
            };
          }
        }
      ];
    }
    var $parseMinErr = minErr('$parse');
    var promiseWarningCache = {};
    var promiseWarning;
    function ensureSafeMemberName(name, fullExpression) {
      if (name === 'constructor') {
        throw $parseMinErr('isecfld', 'Referencing "constructor" field in Angular expressions is disallowed! Expression: {0}', fullExpression);
      }
      return name;
    }
    function ensureSafeObject(obj, fullExpression) {
      if (obj) {
        if (obj.constructor === obj) {
          throw $parseMinErr('isecfn', 'Referencing Function in Angular expressions is disallowed! Expression: {0}', fullExpression);
        } else if (obj.document && obj.location && obj.alert && obj.setInterval) {
          throw $parseMinErr('isecwindow', 'Referencing the Window in Angular expressions is disallowed! Expression: {0}', fullExpression);
        } else if (obj.children && (obj.nodeName || obj.on && obj.find)) {
          throw $parseMinErr('isecdom', 'Referencing DOM nodes in Angular expressions is disallowed! Expression: {0}', fullExpression);
        }
      }
      return obj;
    }
    var OPERATORS = {
        'null': function () {
          return null;
        },
        'true': function () {
          return true;
        },
        'false': function () {
          return false;
        },
        undefined: noop,
        '+': function (self, locals, a, b) {
          a = a(self, locals);
          b = b(self, locals);
          if (isDefined(a)) {
            if (isDefined(b)) {
              return a + b;
            }
            return a;
          }
          return isDefined(b) ? b : undefined;
        },
        '-': function (self, locals, a, b) {
          a = a(self, locals);
          b = b(self, locals);
          return (isDefined(a) ? a : 0) - (isDefined(b) ? b : 0);
        },
        '*': function (self, locals, a, b) {
          return a(self, locals) * b(self, locals);
        },
        '/': function (self, locals, a, b) {
          return a(self, locals) / b(self, locals);
        },
        '%': function (self, locals, a, b) {
          return a(self, locals) % b(self, locals);
        },
        '^': function (self, locals, a, b) {
          return a(self, locals) ^ b(self, locals);
        },
        '=': noop,
        '===': function (self, locals, a, b) {
          return a(self, locals) === b(self, locals);
        },
        '!==': function (self, locals, a, b) {
          return a(self, locals) !== b(self, locals);
        },
        '==': function (self, locals, a, b) {
          return a(self, locals) == b(self, locals);
        },
        '!=': function (self, locals, a, b) {
          return a(self, locals) != b(self, locals);
        },
        '<': function (self, locals, a, b) {
          return a(self, locals) < b(self, locals);
        },
        '>': function (self, locals, a, b) {
          return a(self, locals) > b(self, locals);
        },
        '<=': function (self, locals, a, b) {
          return a(self, locals) <= b(self, locals);
        },
        '>=': function (self, locals, a, b) {
          return a(self, locals) >= b(self, locals);
        },
        '&&': function (self, locals, a, b) {
          return a(self, locals) && b(self, locals);
        },
        '||': function (self, locals, a, b) {
          return a(self, locals) || b(self, locals);
        },
        '&': function (self, locals, a, b) {
          return a(self, locals) & b(self, locals);
        },
        '|': function (self, locals, a, b) {
          return b(self, locals)(self, locals, a(self, locals));
        },
        '!': function (self, locals, a) {
          return !a(self, locals);
        }
      };
    var ESCAPE = {
        'n': '\n',
        'f': '\f',
        'r': '\r',
        't': '\t',
        'v': '\x0B',
        '\'': '\'',
        '"': '"'
      };
    var Lexer = function (options) {
      this.options = options;
    };
    Lexer.prototype = {
      constructor: Lexer,
      lex: function (text) {
        this.text = text;
        this.index = 0;
        this.ch = undefined;
        this.lastCh = ':';
        this.tokens = [];
        var token;
        var json = [];
        while (this.index < this.text.length) {
          this.ch = this.text.charAt(this.index);
          if (this.is('"\'')) {
            this.readString(this.ch);
          } else if (this.isNumber(this.ch) || this.is('.') && this.isNumber(this.peek())) {
            this.readNumber();
          } else if (this.isIdent(this.ch)) {
            this.readIdent();
            if (this.was('{,') && json[0] === '{' && (token = this.tokens[this.tokens.length - 1])) {
              token.json = token.text.indexOf('.') === -1;
            }
          } else if (this.is('(){}[].,;:?')) {
            this.tokens.push({
              index: this.index,
              text: this.ch,
              json: this.was(':[,') && this.is('{[') || this.is('}]:,')
            });
            if (this.is('{['))
              json.unshift(this.ch);
            if (this.is('}]'))
              json.shift();
            this.index++;
          } else if (this.isWhitespace(this.ch)) {
            this.index++;
            continue;
          } else {
            var ch2 = this.ch + this.peek();
            var ch3 = ch2 + this.peek(2);
            var fn = OPERATORS[this.ch];
            var fn2 = OPERATORS[ch2];
            var fn3 = OPERATORS[ch3];
            if (fn3) {
              this.tokens.push({
                index: this.index,
                text: ch3,
                fn: fn3
              });
              this.index += 3;
            } else if (fn2) {
              this.tokens.push({
                index: this.index,
                text: ch2,
                fn: fn2
              });
              this.index += 2;
            } else if (fn) {
              this.tokens.push({
                index: this.index,
                text: this.ch,
                fn: fn,
                json: this.was('[,:') && this.is('+-')
              });
              this.index += 1;
            } else {
              this.throwError('Unexpected next character ', this.index, this.index + 1);
            }
          }
          this.lastCh = this.ch;
        }
        return this.tokens;
      },
      is: function (chars) {
        return chars.indexOf(this.ch) !== -1;
      },
      was: function (chars) {
        return chars.indexOf(this.lastCh) !== -1;
      },
      peek: function (i) {
        var num = i || 1;
        return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
      },
      isNumber: function (ch) {
        return '0' <= ch && ch <= '9';
      },
      isWhitespace: function (ch) {
        return ch === ' ' || ch === '\r' || ch === '\t' || ch === '\n' || ch === '\x0B' || ch === '\xa0';
      },
      isIdent: function (ch) {
        return 'a' <= ch && ch <= 'z' || 'A' <= ch && ch <= 'Z' || '_' === ch || ch === '$';
      },
      isExpOperator: function (ch) {
        return ch === '-' || ch === '+' || this.isNumber(ch);
      },
      throwError: function (error, start, end) {
        end = end || this.index;
        var colStr = isDefined(start) ? 's ' + start + '-' + this.index + ' [' + this.text.substring(start, end) + ']' : ' ' + end;
        throw $parseMinErr('lexerr', 'Lexer Error: {0} at column{1} in expression [{2}].', error, colStr, this.text);
      },
      readNumber: function () {
        var number = '';
        var start = this.index;
        while (this.index < this.text.length) {
          var ch = lowercase(this.text.charAt(this.index));
          if (ch == '.' || this.isNumber(ch)) {
            number += ch;
          } else {
            var peekCh = this.peek();
            if (ch == 'e' && this.isExpOperator(peekCh)) {
              number += ch;
            } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == 'e') {
              number += ch;
            } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == 'e') {
              this.throwError('Invalid exponent');
            } else {
              break;
            }
          }
          this.index++;
        }
        number = 1 * number;
        this.tokens.push({
          index: start,
          text: number,
          json: true,
          fn: function () {
            return number;
          }
        });
      },
      readIdent: function () {
        var parser = this;
        var ident = '';
        var start = this.index;
        var lastDot, peekIndex, methodName, ch;
        while (this.index < this.text.length) {
          ch = this.text.charAt(this.index);
          if (ch === '.' || this.isIdent(ch) || this.isNumber(ch)) {
            if (ch === '.')
              lastDot = this.index;
            ident += ch;
          } else {
            break;
          }
          this.index++;
        }
        if (lastDot) {
          peekIndex = this.index;
          while (peekIndex < this.text.length) {
            ch = this.text.charAt(peekIndex);
            if (ch === '(') {
              methodName = ident.substr(lastDot - start + 1);
              ident = ident.substr(0, lastDot - start);
              this.index = peekIndex;
              break;
            }
            if (this.isWhitespace(ch)) {
              peekIndex++;
            } else {
              break;
            }
          }
        }
        var token = {
            index: start,
            text: ident
          };
        if (OPERATORS.hasOwnProperty(ident)) {
          token.fn = OPERATORS[ident];
          token.json = OPERATORS[ident];
        } else {
          var getter = getterFn(ident, this.options, this.text);
          token.fn = extend(function (self, locals) {
            return getter(self, locals);
          }, {
            assign: function (self, value) {
              return setter(self, ident, value, parser.text, parser.options);
            }
          });
        }
        this.tokens.push(token);
        if (methodName) {
          this.tokens.push({
            index: lastDot,
            text: '.',
            json: false
          });
          this.tokens.push({
            index: lastDot + 1,
            text: methodName,
            json: false
          });
        }
      },
      readString: function (quote) {
        var start = this.index;
        this.index++;
        var string = '';
        var rawString = quote;
        var escape = false;
        while (this.index < this.text.length) {
          var ch = this.text.charAt(this.index);
          rawString += ch;
          if (escape) {
            if (ch === 'u') {
              var hex = this.text.substring(this.index + 1, this.index + 5);
              if (!hex.match(/[\da-f]{4}/i))
                this.throwError('Invalid unicode escape [\\u' + hex + ']');
              this.index += 4;
              string += String.fromCharCode(parseInt(hex, 16));
            } else {
              var rep = ESCAPE[ch];
              if (rep) {
                string += rep;
              } else {
                string += ch;
              }
            }
            escape = false;
          } else if (ch === '\\') {
            escape = true;
          } else if (ch === quote) {
            this.index++;
            this.tokens.push({
              index: start,
              text: rawString,
              string: string,
              json: true,
              fn: function () {
                return string;
              }
            });
            return;
          } else {
            string += ch;
          }
          this.index++;
        }
        this.throwError('Unterminated quote', start);
      }
    };
    var Parser = function (lexer, $filter, options) {
      this.lexer = lexer;
      this.$filter = $filter;
      this.options = options;
    };
    Parser.ZERO = function () {
      return 0;
    };
    Parser.prototype = {
      constructor: Parser,
      parse: function (text, json) {
        this.text = text;
        this.json = json;
        this.tokens = this.lexer.lex(text);
        if (json) {
          this.assignment = this.logicalOR;
          this.functionCall = this.fieldAccess = this.objectIndex = this.filterChain = function () {
            this.throwError('is not valid json', {
              text: text,
              index: 0
            });
          };
        }
        var value = json ? this.primary() : this.statements();
        if (this.tokens.length !== 0) {
          this.throwError('is an unexpected token', this.tokens[0]);
        }
        value.literal = !!value.literal;
        value.constant = !!value.constant;
        return value;
      },
      primary: function () {
        var primary;
        if (this.expect('(')) {
          primary = this.filterChain();
          this.consume(')');
        } else if (this.expect('[')) {
          primary = this.arrayDeclaration();
        } else if (this.expect('{')) {
          primary = this.object();
        } else {
          var token = this.expect();
          primary = token.fn;
          if (!primary) {
            this.throwError('not a primary expression', token);
          }
          if (token.json) {
            primary.constant = true;
            primary.literal = true;
          }
        }
        var next, context;
        while (next = this.expect('(', '[', '.')) {
          if (next.text === '(') {
            primary = this.functionCall(primary, context);
            context = null;
          } else if (next.text === '[') {
            context = primary;
            primary = this.objectIndex(primary);
          } else if (next.text === '.') {
            context = primary;
            primary = this.fieldAccess(primary);
          } else {
            this.throwError('IMPOSSIBLE');
          }
        }
        return primary;
      },
      throwError: function (msg, token) {
        throw $parseMinErr('syntax', 'Syntax Error: Token \'{0}\' {1} at column {2} of the expression [{3}] starting at [{4}].', token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
      },
      peekToken: function () {
        if (this.tokens.length === 0)
          throw $parseMinErr('ueoe', 'Unexpected end of expression: {0}', this.text);
        return this.tokens[0];
      },
      peek: function (e1, e2, e3, e4) {
        if (this.tokens.length > 0) {
          var token = this.tokens[0];
          var t = token.text;
          if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
            return token;
          }
        }
        return false;
      },
      expect: function (e1, e2, e3, e4) {
        var token = this.peek(e1, e2, e3, e4);
        if (token) {
          if (this.json && !token.json) {
            this.throwError('is not valid json', token);
          }
          this.tokens.shift();
          return token;
        }
        return false;
      },
      consume: function (e1) {
        if (!this.expect(e1)) {
          this.throwError('is unexpected, expecting [' + e1 + ']', this.peek());
        }
      },
      unaryFn: function (fn, right) {
        return extend(function (self, locals) {
          return fn(self, locals, right);
        }, { constant: right.constant });
      },
      ternaryFn: function (left, middle, right) {
        return extend(function (self, locals) {
          return left(self, locals) ? middle(self, locals) : right(self, locals);
        }, { constant: left.constant && middle.constant && right.constant });
      },
      binaryFn: function (left, fn, right) {
        return extend(function (self, locals) {
          return fn(self, locals, left, right);
        }, { constant: left.constant && right.constant });
      },
      statements: function () {
        var statements = [];
        while (true) {
          if (this.tokens.length > 0 && !this.peek('}', ')', ';', ']'))
            statements.push(this.filterChain());
          if (!this.expect(';')) {
            return statements.length === 1 ? statements[0] : function (self, locals) {
              var value;
              for (var i = 0; i < statements.length; i++) {
                var statement = statements[i];
                if (statement) {
                  value = statement(self, locals);
                }
              }
              return value;
            };
          }
        }
      },
      filterChain: function () {
        var left = this.expression();
        var token;
        while (true) {
          if (token = this.expect('|')) {
            left = this.binaryFn(left, token.fn, this.filter());
          } else {
            return left;
          }
        }
      },
      filter: function () {
        var token = this.expect();
        var fn = this.$filter(token.text);
        var argsFn = [];
        while (true) {
          if (token = this.expect(':')) {
            argsFn.push(this.expression());
          } else {
            var fnInvoke = function (self, locals, input) {
              var args = [input];
              for (var i = 0; i < argsFn.length; i++) {
                args.push(argsFn[i](self, locals));
              }
              return fn.apply(self, args);
            };
            return function () {
              return fnInvoke;
            };
          }
        }
      },
      expression: function () {
        return this.assignment();
      },
      assignment: function () {
        var left = this.ternary();
        var right;
        var token;
        if (token = this.expect('=')) {
          if (!left.assign) {
            this.throwError('implies assignment but [' + this.text.substring(0, token.index) + '] can not be assigned to', token);
          }
          right = this.ternary();
          return function (scope, locals) {
            return left.assign(scope, right(scope, locals), locals);
          };
        }
        return left;
      },
      ternary: function () {
        var left = this.logicalOR();
        var middle;
        var token;
        if (token = this.expect('?')) {
          middle = this.ternary();
          if (token = this.expect(':')) {
            return this.ternaryFn(left, middle, this.ternary());
          } else {
            this.throwError('expected :', token);
          }
        } else {
          return left;
        }
      },
      logicalOR: function () {
        var left = this.logicalAND();
        var token;
        while (true) {
          if (token = this.expect('||')) {
            left = this.binaryFn(left, token.fn, this.logicalAND());
          } else {
            return left;
          }
        }
      },
      logicalAND: function () {
        var left = this.equality();
        var token;
        if (token = this.expect('&&')) {
          left = this.binaryFn(left, token.fn, this.logicalAND());
        }
        return left;
      },
      equality: function () {
        var left = this.relational();
        var token;
        if (token = this.expect('==', '!=', '===', '!==')) {
          left = this.binaryFn(left, token.fn, this.equality());
        }
        return left;
      },
      relational: function () {
        var left = this.additive();
        var token;
        if (token = this.expect('<', '>', '<=', '>=')) {
          left = this.binaryFn(left, token.fn, this.relational());
        }
        return left;
      },
      additive: function () {
        var left = this.multiplicative();
        var token;
        while (token = this.expect('+', '-')) {
          left = this.binaryFn(left, token.fn, this.multiplicative());
        }
        return left;
      },
      multiplicative: function () {
        var left = this.unary();
        var token;
        while (token = this.expect('*', '/', '%')) {
          left = this.binaryFn(left, token.fn, this.unary());
        }
        return left;
      },
      unary: function () {
        var token;
        if (this.expect('+')) {
          return this.primary();
        } else if (token = this.expect('-')) {
          return this.binaryFn(Parser.ZERO, token.fn, this.unary());
        } else if (token = this.expect('!')) {
          return this.unaryFn(token.fn, this.unary());
        } else {
          return this.primary();
        }
      },
      fieldAccess: function (object) {
        var parser = this;
        var field = this.expect().text;
        var getter = getterFn(field, this.options, this.text);
        return extend(function (scope, locals, self) {
          return getter(self || object(scope, locals));
        }, {
          assign: function (scope, value, locals) {
            return setter(object(scope, locals), field, value, parser.text, parser.options);
          }
        });
      },
      objectIndex: function (obj) {
        var parser = this;
        var indexFn = this.expression();
        this.consume(']');
        return extend(function (self, locals) {
          var o = obj(self, locals), i = indexFn(self, locals), v, p;
          if (!o)
            return undefined;
          v = ensureSafeObject(o[i], parser.text);
          if (v && v.then && parser.options.unwrapPromises) {
            p = v;
            if (!('$$v' in v)) {
              p.$$v = undefined;
              p.then(function (val) {
                p.$$v = val;
              });
            }
            v = v.$$v;
          }
          return v;
        }, {
          assign: function (self, value, locals) {
            var key = indexFn(self, locals);
            var safe = ensureSafeObject(obj(self, locals), parser.text);
            return safe[key] = value;
          }
        });
      },
      functionCall: function (fn, contextGetter) {
        var argsFn = [];
        if (this.peekToken().text !== ')') {
          do {
            argsFn.push(this.expression());
          } while (this.expect(','));
        }
        this.consume(')');
        var parser = this;
        return function (scope, locals) {
          var args = [];
          var context = contextGetter ? contextGetter(scope, locals) : scope;
          for (var i = 0; i < argsFn.length; i++) {
            args.push(argsFn[i](scope, locals));
          }
          var fnPtr = fn(scope, locals, context) || noop;
          ensureSafeObject(context, parser.text);
          ensureSafeObject(fnPtr, parser.text);
          var v = fnPtr.apply ? fnPtr.apply(context, args) : fnPtr(args[0], args[1], args[2], args[3], args[4]);
          return ensureSafeObject(v, parser.text);
        };
      },
      arrayDeclaration: function () {
        var elementFns = [];
        var allConstant = true;
        if (this.peekToken().text !== ']') {
          do {
            var elementFn = this.expression();
            elementFns.push(elementFn);
            if (!elementFn.constant) {
              allConstant = false;
            }
          } while (this.expect(','));
        }
        this.consume(']');
        return extend(function (self, locals) {
          var array = [];
          for (var i = 0; i < elementFns.length; i++) {
            array.push(elementFns[i](self, locals));
          }
          return array;
        }, {
          literal: true,
          constant: allConstant
        });
      },
      object: function () {
        var keyValues = [];
        var allConstant = true;
        if (this.peekToken().text !== '}') {
          do {
            var token = this.expect(), key = token.string || token.text;
            this.consume(':');
            var value = this.expression();
            keyValues.push({
              key: key,
              value: value
            });
            if (!value.constant) {
              allConstant = false;
            }
          } while (this.expect(','));
        }
        this.consume('}');
        return extend(function (self, locals) {
          var object = {};
          for (var i = 0; i < keyValues.length; i++) {
            var keyValue = keyValues[i];
            object[keyValue.key] = keyValue.value(self, locals);
          }
          return object;
        }, {
          literal: true,
          constant: allConstant
        });
      }
    };
    function setter(obj, path, setValue, fullExp, options) {
      options = options || {};
      var element = path.split('.'), key;
      for (var i = 0; element.length > 1; i++) {
        key = ensureSafeMemberName(element.shift(), fullExp);
        var propertyObj = obj[key];
        if (!propertyObj) {
          propertyObj = {};
          obj[key] = propertyObj;
        }
        obj = propertyObj;
        if (obj.then && options.unwrapPromises) {
          promiseWarning(fullExp);
          if (!('$$v' in obj)) {
            (function (promise) {
              promise.then(function (val) {
                promise.$$v = val;
              });
            }(obj));
          }
          if (obj.$$v === undefined) {
            obj.$$v = {};
          }
          obj = obj.$$v;
        }
      }
      key = ensureSafeMemberName(element.shift(), fullExp);
      obj[key] = setValue;
      return setValue;
    }
    var getterFnCache = {};
    function cspSafeGetterFn(key0, key1, key2, key3, key4, fullExp, options) {
      ensureSafeMemberName(key0, fullExp);
      ensureSafeMemberName(key1, fullExp);
      ensureSafeMemberName(key2, fullExp);
      ensureSafeMemberName(key3, fullExp);
      ensureSafeMemberName(key4, fullExp);
      return !options.unwrapPromises ? function cspSafeGetter(scope, locals) {
        var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope;
        if (pathVal == null)
          return pathVal;
        pathVal = pathVal[key0];
        if (!key1)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = pathVal[key1];
        if (!key2)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = pathVal[key2];
        if (!key3)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = pathVal[key3];
        if (!key4)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = pathVal[key4];
        return pathVal;
      } : function cspSafePromiseEnabledGetter(scope, locals) {
        var pathVal = locals && locals.hasOwnProperty(key0) ? locals : scope, promise;
        if (pathVal == null)
          return pathVal;
        pathVal = pathVal[key0];
        if (pathVal && pathVal.then) {
          promiseWarning(fullExp);
          if (!('$$v' in pathVal)) {
            promise = pathVal;
            promise.$$v = undefined;
            promise.then(function (val) {
              promise.$$v = val;
            });
          }
          pathVal = pathVal.$$v;
        }
        if (!key1)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = pathVal[key1];
        if (pathVal && pathVal.then) {
          promiseWarning(fullExp);
          if (!('$$v' in pathVal)) {
            promise = pathVal;
            promise.$$v = undefined;
            promise.then(function (val) {
              promise.$$v = val;
            });
          }
          pathVal = pathVal.$$v;
        }
        if (!key2)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = pathVal[key2];
        if (pathVal && pathVal.then) {
          promiseWarning(fullExp);
          if (!('$$v' in pathVal)) {
            promise = pathVal;
            promise.$$v = undefined;
            promise.then(function (val) {
              promise.$$v = val;
            });
          }
          pathVal = pathVal.$$v;
        }
        if (!key3)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = pathVal[key3];
        if (pathVal && pathVal.then) {
          promiseWarning(fullExp);
          if (!('$$v' in pathVal)) {
            promise = pathVal;
            promise.$$v = undefined;
            promise.then(function (val) {
              promise.$$v = val;
            });
          }
          pathVal = pathVal.$$v;
        }
        if (!key4)
          return pathVal;
        if (pathVal == null)
          return undefined;
        pathVal = pathVal[key4];
        if (pathVal && pathVal.then) {
          promiseWarning(fullExp);
          if (!('$$v' in pathVal)) {
            promise = pathVal;
            promise.$$v = undefined;
            promise.then(function (val) {
              promise.$$v = val;
            });
          }
          pathVal = pathVal.$$v;
        }
        return pathVal;
      };
    }
    function simpleGetterFn1(key0, fullExp) {
      ensureSafeMemberName(key0, fullExp);
      return function simpleGetterFn1(scope, locals) {
        if (scope == null)
          return undefined;
        return (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
      };
    }
    function simpleGetterFn2(key0, key1, fullExp) {
      ensureSafeMemberName(key0, fullExp);
      ensureSafeMemberName(key1, fullExp);
      return function simpleGetterFn2(scope, locals) {
        if (scope == null)
          return undefined;
        scope = (locals && locals.hasOwnProperty(key0) ? locals : scope)[key0];
        return scope == null ? undefined : scope[key1];
      };
    }
    function getterFn(path, options, fullExp) {
      if (getterFnCache.hasOwnProperty(path)) {
        return getterFnCache[path];
      }
      var pathKeys = path.split('.'), pathKeysLength = pathKeys.length, fn;
      if (!options.unwrapPromises && pathKeysLength === 1) {
        fn = simpleGetterFn1(pathKeys[0], fullExp);
      } else if (!options.unwrapPromises && pathKeysLength === 2) {
        fn = simpleGetterFn2(pathKeys[0], pathKeys[1], fullExp);
      } else if (options.csp) {
        if (pathKeysLength < 6) {
          fn = cspSafeGetterFn(pathKeys[0], pathKeys[1], pathKeys[2], pathKeys[3], pathKeys[4], fullExp, options);
        } else {
          fn = function (scope, locals) {
            var i = 0, val;
            do {
              val = cspSafeGetterFn(pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], pathKeys[i++], fullExp, options)(scope, locals);
              locals = undefined;
              scope = val;
            } while (i < pathKeysLength);
            return val;
          };
        }
      } else {
        var code = 'var p;\n';
        forEach(pathKeys, function (key, index) {
          ensureSafeMemberName(key, fullExp);
          code += 'if(s == null) return undefined;\n' + 's=' + (index ? 's' : '((k&&k.hasOwnProperty("' + key + '"))?k:s)') + '["' + key + '"]' + ';\n' + (options.unwrapPromises ? 'if (s && s.then) {\n' + ' pw("' + fullExp.replace(/(["\r\n])/g, '\\$1') + '");\n' + ' if (!("$$v" in s)) {\n' + ' p=s;\n' + ' p.$$v = undefined;\n' + ' p.then(function(v) {p.$$v=v;});\n' + '}\n' + ' s=s.$$v\n' + '}\n' : '');
        });
        code += 'return s;';
        var evaledFnGetter = new Function('s', 'k', 'pw', code);
        evaledFnGetter.toString = valueFn(code);
        fn = options.unwrapPromises ? function (scope, locals) {
          return evaledFnGetter(scope, locals, promiseWarning);
        } : evaledFnGetter;
      }
      if (path !== 'hasOwnProperty') {
        getterFnCache[path] = fn;
      }
      return fn;
    }
    function $ParseProvider() {
      var cache = {};
      var $parseOptions = {
          csp: false,
          unwrapPromises: false,
          logPromiseWarnings: true
        };
      this.unwrapPromises = function (value) {
        if (isDefined(value)) {
          $parseOptions.unwrapPromises = !!value;
          return this;
        } else {
          return $parseOptions.unwrapPromises;
        }
      };
      this.logPromiseWarnings = function (value) {
        if (isDefined(value)) {
          $parseOptions.logPromiseWarnings = value;
          return this;
        } else {
          return $parseOptions.logPromiseWarnings;
        }
      };
      this.$get = [
        '$filter',
        '$sniffer',
        '$log',
        function ($filter, $sniffer, $log) {
          $parseOptions.csp = $sniffer.csp;
          promiseWarning = function promiseWarningFn(fullExp) {
            if (!$parseOptions.logPromiseWarnings || promiseWarningCache.hasOwnProperty(fullExp))
              return;
            promiseWarningCache[fullExp] = true;
            $log.warn('[$parse] Promise found in the expression `' + fullExp + '`. ' + 'Automatic unwrapping of promises in Angular expressions is deprecated.');
          };
          return function (exp) {
            var parsedExpression;
            switch (typeof exp) {
            case 'string':
              if (cache.hasOwnProperty(exp)) {
                return cache[exp];
              }
              var lexer = new Lexer($parseOptions);
              var parser = new Parser(lexer, $filter, $parseOptions);
              parsedExpression = parser.parse(exp, false);
              if (exp !== 'hasOwnProperty') {
                cache[exp] = parsedExpression;
              }
              return parsedExpression;
            case 'function':
              return exp;
            default:
              return noop;
            }
          };
        }
      ];
    }
    function $QProvider() {
      this.$get = [
        '$rootScope',
        '$exceptionHandler',
        function ($rootScope, $exceptionHandler) {
          return qFactory(function (callback) {
            $rootScope.$evalAsync(callback);
          }, $exceptionHandler);
        }
      ];
    }
    function qFactory(nextTick, exceptionHandler) {
      var defer = function () {
        var pending = [], value, deferred;
        deferred = {
          resolve: function (val) {
            if (pending) {
              var callbacks = pending;
              pending = undefined;
              value = ref(val);
              if (callbacks.length) {
                nextTick(function () {
                  var callback;
                  for (var i = 0, ii = callbacks.length; i < ii; i++) {
                    callback = callbacks[i];
                    value.then(callback[0], callback[1], callback[2]);
                  }
                });
              }
            }
          },
          reject: function (reason) {
            deferred.resolve(createInternalRejectedPromise(reason));
          },
          notify: function (progress) {
            if (pending) {
              var callbacks = pending;
              if (pending.length) {
                nextTick(function () {
                  var callback;
                  for (var i = 0, ii = callbacks.length; i < ii; i++) {
                    callback = callbacks[i];
                    callback[2](progress);
                  }
                });
              }
            }
          },
          promise: {
            then: function (callback, errback, progressback) {
              var result = defer();
              var wrappedCallback = function (value) {
                try {
                  result.resolve((isFunction(callback) ? callback : defaultCallback)(value));
                } catch (e) {
                  result.reject(e);
                  exceptionHandler(e);
                }
              };
              var wrappedErrback = function (reason) {
                try {
                  result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
                } catch (e) {
                  result.reject(e);
                  exceptionHandler(e);
                }
              };
              var wrappedProgressback = function (progress) {
                try {
                  result.notify((isFunction(progressback) ? progressback : defaultCallback)(progress));
                } catch (e) {
                  exceptionHandler(e);
                }
              };
              if (pending) {
                pending.push([
                  wrappedCallback,
                  wrappedErrback,
                  wrappedProgressback
                ]);
              } else {
                value.then(wrappedCallback, wrappedErrback, wrappedProgressback);
              }
              return result.promise;
            },
            'catch': function (callback) {
              return this.then(null, callback);
            },
            'finally': function (callback) {
              function makePromise(value, resolved) {
                var result = defer();
                if (resolved) {
                  result.resolve(value);
                } else {
                  result.reject(value);
                }
                return result.promise;
              }
              function handleCallback(value, isResolved) {
                var callbackOutput = null;
                try {
                  callbackOutput = (callback || defaultCallback)();
                } catch (e) {
                  return makePromise(e, false);
                }
                if (callbackOutput && isFunction(callbackOutput.then)) {
                  return callbackOutput.then(function () {
                    return makePromise(value, isResolved);
                  }, function (error) {
                    return makePromise(error, false);
                  });
                } else {
                  return makePromise(value, isResolved);
                }
              }
              return this.then(function (value) {
                return handleCallback(value, true);
              }, function (error) {
                return handleCallback(error, false);
              });
            }
          }
        };
        return deferred;
      };
      var ref = function (value) {
        if (value && isFunction(value.then))
          return value;
        return {
          then: function (callback) {
            var result = defer();
            nextTick(function () {
              result.resolve(callback(value));
            });
            return result.promise;
          }
        };
      };
      var reject = function (reason) {
        var result = defer();
        result.reject(reason);
        return result.promise;
      };
      var createInternalRejectedPromise = function (reason) {
        return {
          then: function (callback, errback) {
            var result = defer();
            nextTick(function () {
              try {
                result.resolve((isFunction(errback) ? errback : defaultErrback)(reason));
              } catch (e) {
                result.reject(e);
                exceptionHandler(e);
              }
            });
            return result.promise;
          }
        };
      };
      var when = function (value, callback, errback, progressback) {
        var result = defer(), done;
        var wrappedCallback = function (value) {
          try {
            return (isFunction(callback) ? callback : defaultCallback)(value);
          } catch (e) {
            exceptionHandler(e);
            return reject(e);
          }
        };
        var wrappedErrback = function (reason) {
          try {
            return (isFunction(errback) ? errback : defaultErrback)(reason);
          } catch (e) {
            exceptionHandler(e);
            return reject(e);
          }
        };
        var wrappedProgressback = function (progress) {
          try {
            return (isFunction(progressback) ? progressback : defaultCallback)(progress);
          } catch (e) {
            exceptionHandler(e);
          }
        };
        nextTick(function () {
          ref(value).then(function (value) {
            if (done)
              return;
            done = true;
            result.resolve(ref(value).then(wrappedCallback, wrappedErrback, wrappedProgressback));
          }, function (reason) {
            if (done)
              return;
            done = true;
            result.resolve(wrappedErrback(reason));
          }, function (progress) {
            if (done)
              return;
            result.notify(wrappedProgressback(progress));
          });
        });
        return result.promise;
      };
      function defaultCallback(value) {
        return value;
      }
      function defaultErrback(reason) {
        return reject(reason);
      }
      function all(promises) {
        var deferred = defer(), counter = 0, results = isArray(promises) ? [] : {};
        forEach(promises, function (promise, key) {
          counter++;
          ref(promise).then(function (value) {
            if (results.hasOwnProperty(key))
              return;
            results[key] = value;
            if (!--counter)
              deferred.resolve(results);
          }, function (reason) {
            if (results.hasOwnProperty(key))
              return;
            deferred.reject(reason);
          });
        });
        if (counter === 0) {
          deferred.resolve(results);
        }
        return deferred.promise;
      }
      return {
        defer: defer,
        reject: reject,
        when: when,
        all: all
      };
    }
    function $RootScopeProvider() {
      var TTL = 10;
      var $rootScopeMinErr = minErr('$rootScope');
      var lastDirtyWatch = null;
      this.digestTtl = function (value) {
        if (arguments.length) {
          TTL = value;
        }
        return TTL;
      };
      this.$get = [
        '$injector',
        '$exceptionHandler',
        '$parse',
        '$browser',
        function ($injector, $exceptionHandler, $parse, $browser) {
          function Scope() {
            this.$id = nextUid();
            this.$$phase = this.$parent = this.$$watchers = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
            this['this'] = this.$root = this;
            this.$$destroyed = false;
            this.$$asyncQueue = [];
            this.$$postDigestQueue = [];
            this.$$listeners = {};
            this.$$listenerCount = {};
            this.$$isolateBindings = {};
          }
          Scope.prototype = {
            constructor: Scope,
            $new: function (isolate) {
              var ChildScope, child;
              if (isolate) {
                child = new Scope();
                child.$root = this.$root;
                child.$$asyncQueue = this.$$asyncQueue;
                child.$$postDigestQueue = this.$$postDigestQueue;
              } else {
                ChildScope = function () {
                };
                ChildScope.prototype = this;
                child = new ChildScope();
                child.$id = nextUid();
              }
              child['this'] = child;
              child.$$listeners = {};
              child.$$listenerCount = {};
              child.$parent = this;
              child.$$watchers = child.$$nextSibling = child.$$childHead = child.$$childTail = null;
              child.$$prevSibling = this.$$childTail;
              if (this.$$childHead) {
                this.$$childTail.$$nextSibling = child;
                this.$$childTail = child;
              } else {
                this.$$childHead = this.$$childTail = child;
              }
              return child;
            },
            $watch: function (watchExp, listener, objectEquality) {
              var scope = this, get = compileToFn(watchExp, 'watch'), array = scope.$$watchers, watcher = {
                  fn: listener,
                  last: initWatchVal,
                  get: get,
                  exp: watchExp,
                  eq: !!objectEquality
                };
              lastDirtyWatch = null;
              if (!isFunction(listener)) {
                var listenFn = compileToFn(listener || noop, 'listener');
                watcher.fn = function (newVal, oldVal, scope) {
                  listenFn(scope);
                };
              }
              if (typeof watchExp == 'string' && get.constant) {
                var originalFn = watcher.fn;
                watcher.fn = function (newVal, oldVal, scope) {
                  originalFn.call(this, newVal, oldVal, scope);
                  arrayRemove(array, watcher);
                };
              }
              if (!array) {
                array = scope.$$watchers = [];
              }
              array.unshift(watcher);
              return function () {
                arrayRemove(array, watcher);
                lastDirtyWatch = null;
              };
            },
            $watchCollection: function (obj, listener) {
              var self = this;
              var oldValue;
              var newValue;
              var changeDetected = 0;
              var objGetter = $parse(obj);
              var internalArray = [];
              var internalObject = {};
              var oldLength = 0;
              function $watchCollectionWatch() {
                newValue = objGetter(self);
                var newLength, key;
                if (!isObject(newValue)) {
                  if (oldValue !== newValue) {
                    oldValue = newValue;
                    changeDetected++;
                  }
                } else if (isArrayLike(newValue)) {
                  if (oldValue !== internalArray) {
                    oldValue = internalArray;
                    oldLength = oldValue.length = 0;
                    changeDetected++;
                  }
                  newLength = newValue.length;
                  if (oldLength !== newLength) {
                    changeDetected++;
                    oldValue.length = oldLength = newLength;
                  }
                  for (var i = 0; i < newLength; i++) {
                    if (oldValue[i] !== newValue[i]) {
                      changeDetected++;
                      oldValue[i] = newValue[i];
                    }
                  }
                } else {
                  if (oldValue !== internalObject) {
                    oldValue = internalObject = {};
                    oldLength = 0;
                    changeDetected++;
                  }
                  newLength = 0;
                  for (key in newValue) {
                    if (newValue.hasOwnProperty(key)) {
                      newLength++;
                      if (oldValue.hasOwnProperty(key)) {
                        if (oldValue[key] !== newValue[key]) {
                          changeDetected++;
                          oldValue[key] = newValue[key];
                        }
                      } else {
                        oldLength++;
                        oldValue[key] = newValue[key];
                        changeDetected++;
                      }
                    }
                  }
                  if (oldLength > newLength) {
                    changeDetected++;
                    for (key in oldValue) {
                      if (oldValue.hasOwnProperty(key) && !newValue.hasOwnProperty(key)) {
                        oldLength--;
                        delete oldValue[key];
                      }
                    }
                  }
                }
                return changeDetected;
              }
              function $watchCollectionAction() {
                listener(newValue, oldValue, self);
              }
              return this.$watch($watchCollectionWatch, $watchCollectionAction);
            },
            $digest: function () {
              var watch, value, last, watchers, asyncQueue = this.$$asyncQueue, postDigestQueue = this.$$postDigestQueue, length, dirty, ttl = TTL, next, current, target = this, watchLog = [], logIdx, logMsg, asyncTask;
              beginPhase('$digest');
              lastDirtyWatch = null;
              do {
                dirty = false;
                current = target;
                while (asyncQueue.length) {
                  try {
                    asyncTask = asyncQueue.shift();
                    asyncTask.scope.$eval(asyncTask.expression);
                  } catch (e) {
                    clearPhase();
                    $exceptionHandler(e);
                  }
                  lastDirtyWatch = null;
                }
                traverseScopesLoop:
                  do {
                    if (watchers = current.$$watchers) {
                      length = watchers.length;
                      while (length--) {
                        try {
                          watch = watchers[length];
                          if (watch) {
                            if ((value = watch.get(current)) !== (last = watch.last) && !(watch.eq ? equals(value, last) : typeof value == 'number' && typeof last == 'number' && isNaN(value) && isNaN(last))) {
                              dirty = true;
                              lastDirtyWatch = watch;
                              watch.last = watch.eq ? copy(value) : value;
                              watch.fn(value, last === initWatchVal ? value : last, current);
                              if (ttl < 5) {
                                logIdx = 4 - ttl;
                                if (!watchLog[logIdx])
                                  watchLog[logIdx] = [];
                                logMsg = isFunction(watch.exp) ? 'fn: ' + (watch.exp.name || watch.exp.toString()) : watch.exp;
                                logMsg += '; newVal: ' + toJson(value) + '; oldVal: ' + toJson(last);
                                watchLog[logIdx].push(logMsg);
                              }
                            } else if (watch === lastDirtyWatch) {
                              dirty = false;
                              break traverseScopesLoop;
                            }
                          }
                        } catch (e) {
                          clearPhase();
                          $exceptionHandler(e);
                        }
                      }
                    }
                    if (!(next = current.$$childHead || current !== target && current.$$nextSibling)) {
                      while (current !== target && !(next = current.$$nextSibling)) {
                        current = current.$parent;
                      }
                    }
                  } while (current = next);
                if ((dirty || asyncQueue.length) && !ttl--) {
                  clearPhase();
                  throw $rootScopeMinErr('infdig', '{0} $digest() iterations reached. Aborting!\n' + 'Watchers fired in the last 5 iterations: {1}', TTL, toJson(watchLog));
                }
              } while (dirty || asyncQueue.length);
              clearPhase();
              while (postDigestQueue.length) {
                try {
                  postDigestQueue.shift()();
                } catch (e) {
                  $exceptionHandler(e);
                }
              }
            },
            $destroy: function () {
              if (this.$$destroyed)
                return;
              var parent = this.$parent;
              this.$broadcast('$destroy');
              this.$$destroyed = true;
              if (this === $rootScope)
                return;
              forEach(this.$$listenerCount, bind(null, decrementListenerCount, this));
              if (parent.$$childHead == this)
                parent.$$childHead = this.$$nextSibling;
              if (parent.$$childTail == this)
                parent.$$childTail = this.$$prevSibling;
              if (this.$$prevSibling)
                this.$$prevSibling.$$nextSibling = this.$$nextSibling;
              if (this.$$nextSibling)
                this.$$nextSibling.$$prevSibling = this.$$prevSibling;
              this.$parent = this.$$nextSibling = this.$$prevSibling = this.$$childHead = this.$$childTail = null;
            },
            $eval: function (expr, locals) {
              return $parse(expr)(this, locals);
            },
            $evalAsync: function (expr) {
              if (!$rootScope.$$phase && !$rootScope.$$asyncQueue.length) {
                $browser.defer(function () {
                  if ($rootScope.$$asyncQueue.length) {
                    $rootScope.$digest();
                  }
                });
              }
              this.$$asyncQueue.push({
                scope: this,
                expression: expr
              });
            },
            $$postDigest: function (fn) {
              this.$$postDigestQueue.push(fn);
            },
            $apply: function (expr) {
              try {
                beginPhase('$apply');
                return this.$eval(expr);
              } catch (e) {
                $exceptionHandler(e);
              } finally {
                clearPhase();
                try {
                  $rootScope.$digest();
                } catch (e) {
                  $exceptionHandler(e);
                  throw e;
                }
              }
            },
            $on: function (name, listener) {
              var namedListeners = this.$$listeners[name];
              if (!namedListeners) {
                this.$$listeners[name] = namedListeners = [];
              }
              namedListeners.push(listener);
              var current = this;
              do {
                if (!current.$$listenerCount[name]) {
                  current.$$listenerCount[name] = 0;
                }
                current.$$listenerCount[name]++;
              } while (current = current.$parent);
              var self = this;
              return function () {
                namedListeners[indexOf(namedListeners, listener)] = null;
                decrementListenerCount(self, 1, name);
              };
            },
            $emit: function (name, args) {
              var empty = [], namedListeners, scope = this, stopPropagation = false, event = {
                  name: name,
                  targetScope: scope,
                  stopPropagation: function () {
                    stopPropagation = true;
                  },
                  preventDefault: function () {
                    event.defaultPrevented = true;
                  },
                  defaultPrevented: false
                }, listenerArgs = concat([event], arguments, 1), i, length;
              do {
                namedListeners = scope.$$listeners[name] || empty;
                event.currentScope = scope;
                for (i = 0, length = namedListeners.length; i < length; i++) {
                  if (!namedListeners[i]) {
                    namedListeners.splice(i, 1);
                    i--;
                    length--;
                    continue;
                  }
                  try {
                    namedListeners[i].apply(null, listenerArgs);
                  } catch (e) {
                    $exceptionHandler(e);
                  }
                }
                if (stopPropagation)
                  return event;
                scope = scope.$parent;
              } while (scope);
              return event;
            },
            $broadcast: function (name, args) {
              var target = this, current = target, next = target, event = {
                  name: name,
                  targetScope: target,
                  preventDefault: function () {
                    event.defaultPrevented = true;
                  },
                  defaultPrevented: false
                }, listenerArgs = concat([event], arguments, 1), listeners, i, length;
              while (current = next) {
                event.currentScope = current;
                listeners = current.$$listeners[name] || [];
                for (i = 0, length = listeners.length; i < length; i++) {
                  if (!listeners[i]) {
                    listeners.splice(i, 1);
                    i--;
                    length--;
                    continue;
                  }
                  try {
                    listeners[i].apply(null, listenerArgs);
                  } catch (e) {
                    $exceptionHandler(e);
                  }
                }
                if (!(next = current.$$listenerCount[name] && current.$$childHead || current !== target && current.$$nextSibling)) {
                  while (current !== target && !(next = current.$$nextSibling)) {
                    current = current.$parent;
                  }
                }
              }
              return event;
            }
          };
          var $rootScope = new Scope();
          return $rootScope;
          function beginPhase(phase) {
            if ($rootScope.$$phase) {
              throw $rootScopeMinErr('inprog', '{0} already in progress', $rootScope.$$phase);
            }
            $rootScope.$$phase = phase;
          }
          function clearPhase() {
            $rootScope.$$phase = null;
          }
          function compileToFn(exp, name) {
            var fn = $parse(exp);
            assertArgFn(fn, name);
            return fn;
          }
          function decrementListenerCount(current, count, name) {
            do {
              current.$$listenerCount[name] -= count;
              if (current.$$listenerCount[name] === 0) {
                delete current.$$listenerCount[name];
              }
            } while (current = current.$parent);
          }
          function initWatchVal() {
          }
        }
      ];
    }
    function $$SanitizeUriProvider() {
      var aHrefSanitizationWhitelist = /^\s*(https?|ftp|mailto|tel|file):/, imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file):|data:image\//;
      this.aHrefSanitizationWhitelist = function (regexp) {
        if (isDefined(regexp)) {
          aHrefSanitizationWhitelist = regexp;
          return this;
        }
        return aHrefSanitizationWhitelist;
      };
      this.imgSrcSanitizationWhitelist = function (regexp) {
        if (isDefined(regexp)) {
          imgSrcSanitizationWhitelist = regexp;
          return this;
        }
        return imgSrcSanitizationWhitelist;
      };
      this.$get = function () {
        return function sanitizeUri(uri, isImage) {
          var regex = isImage ? imgSrcSanitizationWhitelist : aHrefSanitizationWhitelist;
          var normalizedVal;
          if (!msie || msie >= 8) {
            normalizedVal = urlResolve(uri).href;
            if (normalizedVal !== '' && !normalizedVal.match(regex)) {
              return 'unsafe:' + normalizedVal;
            }
          }
          return uri;
        };
      };
    }
    var $sceMinErr = minErr('$sce');
    var SCE_CONTEXTS = {
        HTML: 'html',
        CSS: 'css',
        URL: 'url',
        RESOURCE_URL: 'resourceUrl',
        JS: 'js'
      };
    function escapeForRegexp(s) {
      return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
    }
    function adjustMatcher(matcher) {
      if (matcher === 'self') {
        return matcher;
      } else if (isString(matcher)) {
        if (matcher.indexOf('***') > -1) {
          throw $sceMinErr('iwcard', 'Illegal sequence *** in string matcher.  String: {0}', matcher);
        }
        matcher = escapeForRegexp(matcher).replace('\\*\\*', '.*').replace('\\*', '[^:/.?&;]*');
        return new RegExp('^' + matcher + '$');
      } else if (isRegExp(matcher)) {
        return new RegExp('^' + matcher.source + '$');
      } else {
        throw $sceMinErr('imatcher', 'Matchers may only be "self", string patterns or RegExp objects');
      }
    }
    function adjustMatchers(matchers) {
      var adjustedMatchers = [];
      if (isDefined(matchers)) {
        forEach(matchers, function (matcher) {
          adjustedMatchers.push(adjustMatcher(matcher));
        });
      }
      return adjustedMatchers;
    }
    function $SceDelegateProvider() {
      this.SCE_CONTEXTS = SCE_CONTEXTS;
      var resourceUrlWhitelist = ['self'], resourceUrlBlacklist = [];
      this.resourceUrlWhitelist = function (value) {
        if (arguments.length) {
          resourceUrlWhitelist = adjustMatchers(value);
        }
        return resourceUrlWhitelist;
      };
      this.resourceUrlBlacklist = function (value) {
        if (arguments.length) {
          resourceUrlBlacklist = adjustMatchers(value);
        }
        return resourceUrlBlacklist;
      };
      this.$get = [
        '$injector',
        function ($injector) {
          var htmlSanitizer = function htmlSanitizer(html) {
            throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
          };
          if ($injector.has('$sanitize')) {
            htmlSanitizer = $injector.get('$sanitize');
          }
          function matchUrl(matcher, parsedUrl) {
            if (matcher === 'self') {
              return urlIsSameOrigin(parsedUrl);
            } else {
              return !!matcher.exec(parsedUrl.href);
            }
          }
          function isResourceUrlAllowedByPolicy(url) {
            var parsedUrl = urlResolve(url.toString());
            var i, n, allowed = false;
            for (i = 0, n = resourceUrlWhitelist.length; i < n; i++) {
              if (matchUrl(resourceUrlWhitelist[i], parsedUrl)) {
                allowed = true;
                break;
              }
            }
            if (allowed) {
              for (i = 0, n = resourceUrlBlacklist.length; i < n; i++) {
                if (matchUrl(resourceUrlBlacklist[i], parsedUrl)) {
                  allowed = false;
                  break;
                }
              }
            }
            return allowed;
          }
          function generateHolderType(Base) {
            var holderType = function TrustedValueHolderType(trustedValue) {
              this.$$unwrapTrustedValue = function () {
                return trustedValue;
              };
            };
            if (Base) {
              holderType.prototype = new Base();
            }
            holderType.prototype.valueOf = function sceValueOf() {
              return this.$$unwrapTrustedValue();
            };
            holderType.prototype.toString = function sceToString() {
              return this.$$unwrapTrustedValue().toString();
            };
            return holderType;
          }
          var trustedValueHolderBase = generateHolderType(), byType = {};
          byType[SCE_CONTEXTS.HTML] = generateHolderType(trustedValueHolderBase);
          byType[SCE_CONTEXTS.CSS] = generateHolderType(trustedValueHolderBase);
          byType[SCE_CONTEXTS.URL] = generateHolderType(trustedValueHolderBase);
          byType[SCE_CONTEXTS.JS] = generateHolderType(trustedValueHolderBase);
          byType[SCE_CONTEXTS.RESOURCE_URL] = generateHolderType(byType[SCE_CONTEXTS.URL]);
          function trustAs(type, trustedValue) {
            var Constructor = byType.hasOwnProperty(type) ? byType[type] : null;
            if (!Constructor) {
              throw $sceMinErr('icontext', 'Attempted to trust a value in invalid context. Context: {0}; Value: {1}', type, trustedValue);
            }
            if (trustedValue === null || trustedValue === undefined || trustedValue === '') {
              return trustedValue;
            }
            if (typeof trustedValue !== 'string') {
              throw $sceMinErr('itype', 'Attempted to trust a non-string value in a content requiring a string: Context: {0}', type);
            }
            return new Constructor(trustedValue);
          }
          function valueOf(maybeTrusted) {
            if (maybeTrusted instanceof trustedValueHolderBase) {
              return maybeTrusted.$$unwrapTrustedValue();
            } else {
              return maybeTrusted;
            }
          }
          function getTrusted(type, maybeTrusted) {
            if (maybeTrusted === null || maybeTrusted === undefined || maybeTrusted === '') {
              return maybeTrusted;
            }
            var constructor = byType.hasOwnProperty(type) ? byType[type] : null;
            if (constructor && maybeTrusted instanceof constructor) {
              return maybeTrusted.$$unwrapTrustedValue();
            }
            if (type === SCE_CONTEXTS.RESOURCE_URL) {
              if (isResourceUrlAllowedByPolicy(maybeTrusted)) {
                return maybeTrusted;
              } else {
                throw $sceMinErr('insecurl', 'Blocked loading resource from url not allowed by $sceDelegate policy.  URL: {0}', maybeTrusted.toString());
              }
            } else if (type === SCE_CONTEXTS.HTML) {
              return htmlSanitizer(maybeTrusted);
            }
            throw $sceMinErr('unsafe', 'Attempting to use an unsafe value in a safe context.');
          }
          return {
            trustAs: trustAs,
            getTrusted: getTrusted,
            valueOf: valueOf
          };
        }
      ];
    }
    function $SceProvider() {
      var enabled = true;
      this.enabled = function (value) {
        if (arguments.length) {
          enabled = !!value;
        }
        return enabled;
      };
      this.$get = [
        '$parse',
        '$sniffer',
        '$sceDelegate',
        function ($parse, $sniffer, $sceDelegate) {
          if (enabled && $sniffer.msie && $sniffer.msieDocumentMode < 8) {
            throw $sceMinErr('iequirks', 'Strict Contextual Escaping does not support Internet Explorer version < 9 in quirks ' + 'mode.  You can fix this by adding the text <!doctype html> to the top of your HTML ' + 'document.  See http://docs.angularjs.org/api/ng.$sce for more information.');
          }
          var sce = copy(SCE_CONTEXTS);
          sce.isEnabled = function () {
            return enabled;
          };
          sce.trustAs = $sceDelegate.trustAs;
          sce.getTrusted = $sceDelegate.getTrusted;
          sce.valueOf = $sceDelegate.valueOf;
          if (!enabled) {
            sce.trustAs = sce.getTrusted = function (type, value) {
              return value;
            };
            sce.valueOf = identity;
          }
          sce.parseAs = function sceParseAs(type, expr) {
            var parsed = $parse(expr);
            if (parsed.literal && parsed.constant) {
              return parsed;
            } else {
              return function sceParseAsTrusted(self, locals) {
                return sce.getTrusted(type, parsed(self, locals));
              };
            }
          };
          var parse = sce.parseAs, getTrusted = sce.getTrusted, trustAs = sce.trustAs;
          forEach(SCE_CONTEXTS, function (enumValue, name) {
            var lName = lowercase(name);
            sce[camelCase('parse_as_' + lName)] = function (expr) {
              return parse(enumValue, expr);
            };
            sce[camelCase('get_trusted_' + lName)] = function (value) {
              return getTrusted(enumValue, value);
            };
            sce[camelCase('trust_as_' + lName)] = function (value) {
              return trustAs(enumValue, value);
            };
          });
          return sce;
        }
      ];
    }
    function $SnifferProvider() {
      this.$get = [
        '$window',
        '$document',
        function ($window, $document) {
          var eventSupport = {}, android = int((/android (\d+)/.exec(lowercase(($window.navigator || {}).userAgent)) || [])[1]), boxee = /Boxee/i.test(($window.navigator || {}).userAgent), document = $document[0] || {}, documentMode = document.documentMode, vendorPrefix, vendorRegex = /^(Moz|webkit|O|ms)(?=[A-Z])/, bodyStyle = document.body && document.body.style, transitions = false, animations = false, match;
          if (bodyStyle) {
            for (var prop in bodyStyle) {
              if (match = vendorRegex.exec(prop)) {
                vendorPrefix = match[0];
                vendorPrefix = vendorPrefix.substr(0, 1).toUpperCase() + vendorPrefix.substr(1);
                break;
              }
            }
            if (!vendorPrefix) {
              vendorPrefix = 'WebkitOpacity' in bodyStyle && 'webkit';
            }
            transitions = !!('transition' in bodyStyle || vendorPrefix + 'Transition' in bodyStyle);
            animations = !!('animation' in bodyStyle || vendorPrefix + 'Animation' in bodyStyle);
            if (android && (!transitions || !animations)) {
              transitions = isString(document.body.style.webkitTransition);
              animations = isString(document.body.style.webkitAnimation);
            }
          }
          return {
            history: !!($window.history && $window.history.pushState && !(android < 4) && !boxee),
            hashchange: 'onhashchange' in $window && (!documentMode || documentMode > 7),
            hasEvent: function (event) {
              if (event == 'input' && msie == 9)
                return false;
              if (isUndefined(eventSupport[event])) {
                var divElm = document.createElement('div');
                eventSupport[event] = 'on' + event in divElm;
              }
              return eventSupport[event];
            },
            csp: csp(),
            vendorPrefix: vendorPrefix,
            transitions: transitions,
            animations: animations,
            android: android,
            msie: msie,
            msieDocumentMode: documentMode
          };
        }
      ];
    }
    function $TimeoutProvider() {
      this.$get = [
        '$rootScope',
        '$browser',
        '$q',
        '$exceptionHandler',
        function ($rootScope, $browser, $q, $exceptionHandler) {
          var deferreds = {};
          function timeout(fn, delay, invokeApply) {
            var deferred = $q.defer(), promise = deferred.promise, skipApply = isDefined(invokeApply) && !invokeApply, timeoutId;
            timeoutId = $browser.defer(function () {
              try {
                deferred.resolve(fn());
              } catch (e) {
                deferred.reject(e);
                $exceptionHandler(e);
              } finally {
                delete deferreds[promise.$$timeoutId];
              }
              if (!skipApply)
                $rootScope.$apply();
            }, delay);
            promise.$$timeoutId = timeoutId;
            deferreds[timeoutId] = deferred;
            return promise;
          }
          timeout.cancel = function (promise) {
            if (promise && promise.$$timeoutId in deferreds) {
              deferreds[promise.$$timeoutId].reject('canceled');
              delete deferreds[promise.$$timeoutId];
              return $browser.defer.cancel(promise.$$timeoutId);
            }
            return false;
          };
          return timeout;
        }
      ];
    }
    var urlParsingNode = document.createElement('a');
    var originUrl = urlResolve(window.location.href, true);
    function urlResolve(url, base) {
      var href = url;
      if (msie) {
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute('href', href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
      };
    }
    function urlIsSameOrigin(requestUrl) {
      var parsed = isString(requestUrl) ? urlResolve(requestUrl) : requestUrl;
      return parsed.protocol === originUrl.protocol && parsed.host === originUrl.host;
    }
    function $WindowProvider() {
      this.$get = valueFn(window);
    }
    $FilterProvider.$inject = ['$provide'];
    function $FilterProvider($provide) {
      var suffix = 'Filter';
      function register(name, factory) {
        if (isObject(name)) {
          var filters = {};
          forEach(name, function (filter, key) {
            filters[key] = register(key, filter);
          });
          return filters;
        } else {
          return $provide.factory(name + suffix, factory);
        }
      }
      this.register = register;
      this.$get = [
        '$injector',
        function ($injector) {
          return function (name) {
            return $injector.get(name + suffix);
          };
        }
      ];
      register('currency', currencyFilter);
      register('date', dateFilter);
      register('filter', filterFilter);
      register('json', jsonFilter);
      register('limitTo', limitToFilter);
      register('lowercase', lowercaseFilter);
      register('number', numberFilter);
      register('orderBy', orderByFilter);
      register('uppercase', uppercaseFilter);
    }
    function filterFilter() {
      return function (array, expression, comparator) {
        if (!isArray(array))
          return array;
        var comparatorType = typeof comparator, predicates = [];
        predicates.check = function (value) {
          for (var j = 0; j < predicates.length; j++) {
            if (!predicates[j](value)) {
              return false;
            }
          }
          return true;
        };
        if (comparatorType !== 'function') {
          if (comparatorType === 'boolean' && comparator) {
            comparator = function (obj, text) {
              return angular.equals(obj, text);
            };
          } else {
            comparator = function (obj, text) {
              text = ('' + text).toLowerCase();
              return ('' + obj).toLowerCase().indexOf(text) > -1;
            };
          }
        }
        var search = function (obj, text) {
          if (typeof text == 'string' && text.charAt(0) === '!') {
            return !search(obj, text.substr(1));
          }
          switch (typeof obj) {
          case 'boolean':
          case 'number':
          case 'string':
            return comparator(obj, text);
          case 'object':
            switch (typeof text) {
            case 'object':
              return comparator(obj, text);
            default:
              for (var objKey in obj) {
                if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                  return true;
                }
              }
              break;
            }
            return false;
          case 'array':
            for (var i = 0; i < obj.length; i++) {
              if (search(obj[i], text)) {
                return true;
              }
            }
            return false;
          default:
            return false;
          }
        };
        switch (typeof expression) {
        case 'boolean':
        case 'number':
        case 'string':
          expression = { $: expression };
        case 'object':
          for (var key in expression) {
            (function (path) {
              if (typeof expression[path] == 'undefined')
                return;
              predicates.push(function (value) {
                return search(path == '$' ? value : value && value[path], expression[path]);
              });
            }(key));
          }
          break;
        case 'function':
          predicates.push(expression);
          break;
        default:
          return array;
        }
        var filtered = [];
        for (var j = 0; j < array.length; j++) {
          var value = array[j];
          if (predicates.check(value)) {
            filtered.push(value);
          }
        }
        return filtered;
      };
    }
    currencyFilter.$inject = ['$locale'];
    function currencyFilter($locale) {
      var formats = $locale.NUMBER_FORMATS;
      return function (amount, currencySymbol) {
        if (isUndefined(currencySymbol))
          currencySymbol = formats.CURRENCY_SYM;
        return formatNumber(amount, formats.PATTERNS[1], formats.GROUP_SEP, formats.DECIMAL_SEP, 2).replace(/\u00A4/g, currencySymbol);
      };
    }
    numberFilter.$inject = ['$locale'];
    function numberFilter($locale) {
      var formats = $locale.NUMBER_FORMATS;
      return function (number, fractionSize) {
        return formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize);
      };
    }
    var DECIMAL_SEP = '.';
    function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
      if (isNaN(number) || !isFinite(number))
        return '';
      var isNegative = number < 0;
      number = Math.abs(number);
      var numStr = number + '', formatedText = '', parts = [];
      var hasExponent = false;
      if (numStr.indexOf('e') !== -1) {
        var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
        if (match && match[2] == '-' && match[3] > fractionSize + 1) {
          numStr = '0';
        } else {
          formatedText = numStr;
          hasExponent = true;
        }
      }
      if (!hasExponent) {
        var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;
        if (isUndefined(fractionSize)) {
          fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
        }
        var pow = Math.pow(10, fractionSize);
        number = Math.round(number * pow) / pow;
        var fraction = ('' + number).split(DECIMAL_SEP);
        var whole = fraction[0];
        fraction = fraction[1] || '';
        var i, pos = 0, lgroup = pattern.lgSize, group = pattern.gSize;
        if (whole.length >= lgroup + group) {
          pos = whole.length - lgroup;
          for (i = 0; i < pos; i++) {
            if ((pos - i) % group === 0 && i !== 0) {
              formatedText += groupSep;
            }
            formatedText += whole.charAt(i);
          }
        }
        for (i = pos; i < whole.length; i++) {
          if ((whole.length - i) % lgroup === 0 && i !== 0) {
            formatedText += groupSep;
          }
          formatedText += whole.charAt(i);
        }
        while (fraction.length < fractionSize) {
          fraction += '0';
        }
        if (fractionSize && fractionSize !== '0')
          formatedText += decimalSep + fraction.substr(0, fractionSize);
      } else {
        if (fractionSize > 0 && number > -1 && number < 1) {
          formatedText = number.toFixed(fractionSize);
        }
      }
      parts.push(isNegative ? pattern.negPre : pattern.posPre);
      parts.push(formatedText);
      parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
      return parts.join('');
    }
    function padNumber(num, digits, trim) {
      var neg = '';
      if (num < 0) {
        neg = '-';
        num = -num;
      }
      num = '' + num;
      while (num.length < digits)
        num = '0' + num;
      if (trim)
        num = num.substr(num.length - digits);
      return neg + num;
    }
    function dateGetter(name, size, offset, trim) {
      offset = offset || 0;
      return function (date) {
        var value = date['get' + name]();
        if (offset > 0 || value > -offset)
          value += offset;
        if (value === 0 && offset == -12)
          value = 12;
        return padNumber(value, size, trim);
      };
    }
    function dateStrGetter(name, shortForm) {
      return function (date, formats) {
        var value = date['get' + name]();
        var get = uppercase(shortForm ? 'SHORT' + name : name);
        return formats[get][value];
      };
    }
    function timeZoneGetter(date) {
      var zone = -1 * date.getTimezoneOffset();
      var paddedZone = zone >= 0 ? '+' : '';
      paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);
      return paddedZone;
    }
    function ampmGetter(date, formats) {
      return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
    }
    var DATE_FORMATS = {
        yyyy: dateGetter('FullYear', 4),
        yy: dateGetter('FullYear', 2, 0, true),
        y: dateGetter('FullYear', 1),
        MMMM: dateStrGetter('Month'),
        MMM: dateStrGetter('Month', true),
        MM: dateGetter('Month', 2, 1),
        M: dateGetter('Month', 1, 1),
        dd: dateGetter('Date', 2),
        d: dateGetter('Date', 1),
        HH: dateGetter('Hours', 2),
        H: dateGetter('Hours', 1),
        hh: dateGetter('Hours', 2, -12),
        h: dateGetter('Hours', 1, -12),
        mm: dateGetter('Minutes', 2),
        m: dateGetter('Minutes', 1),
        ss: dateGetter('Seconds', 2),
        s: dateGetter('Seconds', 1),
        sss: dateGetter('Milliseconds', 3),
        EEEE: dateStrGetter('Day'),
        EEE: dateStrGetter('Day', true),
        a: ampmGetter,
        Z: timeZoneGetter
      };
    var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/, NUMBER_STRING = /^\-?\d+$/;
    dateFilter.$inject = ['$locale'];
    function dateFilter($locale) {
      var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
      function jsonStringToDate(string) {
        var match;
        if (match = string.match(R_ISO8601_STR)) {
          var date = new Date(0), tzHour = 0, tzMin = 0, dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear, timeSetter = match[8] ? date.setUTCHours : date.setHours;
          if (match[9]) {
            tzHour = int(match[9] + match[10]);
            tzMin = int(match[9] + match[11]);
          }
          dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
          var h = int(match[4] || 0) - tzHour;
          var m = int(match[5] || 0) - tzMin;
          var s = int(match[6] || 0);
          var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
          timeSetter.call(date, h, m, s, ms);
          return date;
        }
        return string;
      }
      return function (date, format) {
        var text = '', parts = [], fn, match;
        format = format || 'mediumDate';
        format = $locale.DATETIME_FORMATS[format] || format;
        if (isString(date)) {
          if (NUMBER_STRING.test(date)) {
            date = int(date);
          } else {
            date = jsonStringToDate(date);
          }
        }
        if (isNumber(date)) {
          date = new Date(date);
        }
        if (!isDate(date)) {
          return date;
        }
        while (format) {
          match = DATE_FORMATS_SPLIT.exec(format);
          if (match) {
            parts = concat(parts, match, 1);
            format = parts.pop();
          } else {
            parts.push(format);
            format = null;
          }
        }
        forEach(parts, function (value) {
          fn = DATE_FORMATS[value];
          text += fn ? fn(date, $locale.DATETIME_FORMATS) : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
        });
        return text;
      };
    }
    function jsonFilter() {
      return function (object) {
        return toJson(object, true);
      };
    }
    var lowercaseFilter = valueFn(lowercase);
    var uppercaseFilter = valueFn(uppercase);
    function limitToFilter() {
      return function (input, limit) {
        if (!isArray(input) && !isString(input))
          return input;
        limit = int(limit);
        if (isString(input)) {
          if (limit) {
            return limit >= 0 ? input.slice(0, limit) : input.slice(limit, input.length);
          } else {
            return '';
          }
        }
        var out = [], i, n;
        if (limit > input.length)
          limit = input.length;
        else if (limit < -input.length)
          limit = -input.length;
        if (limit > 0) {
          i = 0;
          n = limit;
        } else {
          i = input.length + limit;
          n = input.length;
        }
        for (; i < n; i++) {
          out.push(input[i]);
        }
        return out;
      };
    }
    orderByFilter.$inject = ['$parse'];
    function orderByFilter($parse) {
      return function (array, sortPredicate, reverseOrder) {
        if (!isArray(array))
          return array;
        if (!sortPredicate)
          return array;
        sortPredicate = isArray(sortPredicate) ? sortPredicate : [sortPredicate];
        sortPredicate = map(sortPredicate, function (predicate) {
          var descending = false, get = predicate || identity;
          if (isString(predicate)) {
            if (predicate.charAt(0) == '+' || predicate.charAt(0) == '-') {
              descending = predicate.charAt(0) == '-';
              predicate = predicate.substring(1);
            }
            get = $parse(predicate);
          }
          return reverseComparator(function (a, b) {
            return compare(get(a), get(b));
          }, descending);
        });
        var arrayCopy = [];
        for (var i = 0; i < array.length; i++) {
          arrayCopy.push(array[i]);
        }
        return arrayCopy.sort(reverseComparator(comparator, reverseOrder));
        function comparator(o1, o2) {
          for (var i = 0; i < sortPredicate.length; i++) {
            var comp = sortPredicate[i](o1, o2);
            if (comp !== 0)
              return comp;
          }
          return 0;
        }
        function reverseComparator(comp, descending) {
          return toBoolean(descending) ? function (a, b) {
            return comp(b, a);
          } : comp;
        }
        function compare(v1, v2) {
          var t1 = typeof v1;
          var t2 = typeof v2;
          if (t1 == t2) {
            if (t1 == 'string') {
              v1 = v1.toLowerCase();
              v2 = v2.toLowerCase();
            }
            if (v1 === v2)
              return 0;
            return v1 < v2 ? -1 : 1;
          } else {
            return t1 < t2 ? -1 : 1;
          }
        }
      };
    }
    function ngDirective(directive) {
      if (isFunction(directive)) {
        directive = { link: directive };
      }
      directive.restrict = directive.restrict || 'AC';
      return valueFn(directive);
    }
    var htmlAnchorDirective = valueFn({
        restrict: 'E',
        compile: function (element, attr) {
          if (msie <= 8) {
            if (!attr.href && !attr.name) {
              attr.$set('href', '');
            }
            element.append(document.createComment('IE fix'));
          }
          if (!attr.href && !attr.xlinkHref && !attr.name) {
            return function (scope, element) {
              var href = toString.call(element.prop('href')) === '[object SVGAnimatedString]' ? 'xlink:href' : 'href';
              element.on('click', function (event) {
                if (!element.attr(href)) {
                  event.preventDefault();
                }
              });
            };
          }
        }
      });
    var ngAttributeAliasDirectives = {};
    forEach(BOOLEAN_ATTR, function (propName, attrName) {
      if (propName == 'multiple')
        return;
      var normalized = directiveNormalize('ng-' + attrName);
      ngAttributeAliasDirectives[normalized] = function () {
        return {
          priority: 100,
          link: function (scope, element, attr) {
            scope.$watch(attr[normalized], function ngBooleanAttrWatchAction(value) {
              attr.$set(attrName, !!value);
            });
          }
        };
      };
    });
    forEach([
      'src',
      'srcset',
      'href'
    ], function (attrName) {
      var normalized = directiveNormalize('ng-' + attrName);
      ngAttributeAliasDirectives[normalized] = function () {
        return {
          priority: 99,
          link: function (scope, element, attr) {
            attr.$observe(normalized, function (value) {
              if (!value)
                return;
              attr.$set(attrName, value);
              if (msie)
                element.prop(attrName, attr[attrName]);
            });
          }
        };
      };
    });
    var nullFormCtrl = {
        $addControl: noop,
        $removeControl: noop,
        $setValidity: noop,
        $setDirty: noop,
        $setPristine: noop
      };
    FormController.$inject = [
      '$element',
      '$attrs',
      '$scope'
    ];
    function FormController(element, attrs) {
      var form = this, parentForm = element.parent().controller('form') || nullFormCtrl, invalidCount = 0, errors = form.$error = {}, controls = [];
      form.$name = attrs.name || attrs.ngForm;
      form.$dirty = false;
      form.$pristine = true;
      form.$valid = true;
      form.$invalid = false;
      parentForm.$addControl(form);
      element.addClass(PRISTINE_CLASS);
      toggleValidCss(true);
      function toggleValidCss(isValid, validationErrorKey) {
        validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
        element.removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
      }
      form.$addControl = function (control) {
        assertNotHasOwnProperty(control.$name, 'input');
        controls.push(control);
        if (control.$name) {
          form[control.$name] = control;
        }
      };
      form.$removeControl = function (control) {
        if (control.$name && form[control.$name] === control) {
          delete form[control.$name];
        }
        forEach(errors, function (queue, validationToken) {
          form.$setValidity(validationToken, true, control);
        });
        arrayRemove(controls, control);
      };
      form.$setValidity = function (validationToken, isValid, control) {
        var queue = errors[validationToken];
        if (isValid) {
          if (queue) {
            arrayRemove(queue, control);
            if (!queue.length) {
              invalidCount--;
              if (!invalidCount) {
                toggleValidCss(isValid);
                form.$valid = true;
                form.$invalid = false;
              }
              errors[validationToken] = false;
              toggleValidCss(true, validationToken);
              parentForm.$setValidity(validationToken, true, form);
            }
          }
        } else {
          if (!invalidCount) {
            toggleValidCss(isValid);
          }
          if (queue) {
            if (includes(queue, control))
              return;
          } else {
            errors[validationToken] = queue = [];
            invalidCount++;
            toggleValidCss(false, validationToken);
            parentForm.$setValidity(validationToken, false, form);
          }
          queue.push(control);
          form.$valid = false;
          form.$invalid = true;
        }
      };
      form.$setDirty = function () {
        element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
        form.$dirty = true;
        form.$pristine = false;
        parentForm.$setDirty();
      };
      form.$setPristine = function () {
        element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);
        form.$dirty = false;
        form.$pristine = true;
        forEach(controls, function (control) {
          control.$setPristine();
        });
      };
    }
    var formDirectiveFactory = function (isNgForm) {
      return [
        '$timeout',
        function ($timeout) {
          var formDirective = {
              name: 'form',
              restrict: isNgForm ? 'EAC' : 'E',
              controller: FormController,
              compile: function () {
                return {
                  pre: function (scope, formElement, attr, controller) {
                    if (!attr.action) {
                      var preventDefaultListener = function (event) {
                        event.preventDefault ? event.preventDefault() : event.returnValue = false;
                      };
                      addEventListenerFn(formElement[0], 'submit', preventDefaultListener);
                      formElement.on('$destroy', function () {
                        $timeout(function () {
                          removeEventListenerFn(formElement[0], 'submit', preventDefaultListener);
                        }, 0, false);
                      });
                    }
                    var parentFormCtrl = formElement.parent().controller('form'), alias = attr.name || attr.ngForm;
                    if (alias) {
                      setter(scope, alias, controller, alias);
                    }
                    if (parentFormCtrl) {
                      formElement.on('$destroy', function () {
                        parentFormCtrl.$removeControl(controller);
                        if (alias) {
                          setter(scope, alias, undefined, alias);
                        }
                        extend(controller, nullFormCtrl);
                      });
                    }
                  }
                };
              }
            };
          return formDirective;
        }
      ];
    };
    var formDirective = formDirectiveFactory();
    var ngFormDirective = formDirectiveFactory(true);
    var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
    var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
    var inputType = {
        'text': textInputType,
        'number': numberInputType,
        'url': urlInputType,
        'email': emailInputType,
        'radio': radioInputType,
        'checkbox': checkboxInputType,
        'hidden': noop,
        'button': noop,
        'submit': noop,
        'reset': noop
      };
    function validate(ctrl, validatorName, validity, value) {
      ctrl.$setValidity(validatorName, validity);
      return validity ? value : undefined;
    }
    function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      if (!$sniffer.android) {
        var composing = false;
        element.on('compositionstart', function (data) {
          composing = true;
        });
        element.on('compositionend', function () {
          composing = false;
        });
      }
      var listener = function () {
        if (composing)
          return;
        var value = element.val();
        if (toBoolean(attr.ngTrim || 'T')) {
          value = trim(value);
        }
        if (ctrl.$viewValue !== value) {
          if (scope.$$phase) {
            ctrl.$setViewValue(value);
          } else {
            scope.$apply(function () {
              ctrl.$setViewValue(value);
            });
          }
        }
      };
      if ($sniffer.hasEvent('input')) {
        element.on('input', listener);
      } else {
        var timeout;
        var deferListener = function () {
          if (!timeout) {
            timeout = $browser.defer(function () {
              listener();
              timeout = null;
            });
          }
        };
        element.on('keydown', function (event) {
          var key = event.keyCode;
          if (key === 91 || 15 < key && key < 19 || 37 <= key && key <= 40)
            return;
          deferListener();
        });
        if ($sniffer.hasEvent('paste')) {
          element.on('paste cut', deferListener);
        }
      }
      element.on('change', listener);
      ctrl.$render = function () {
        element.val(ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
      };
      var pattern = attr.ngPattern, patternValidator, match;
      if (pattern) {
        var validateRegex = function (regexp, value) {
          return validate(ctrl, 'pattern', ctrl.$isEmpty(value) || regexp.test(value), value);
        };
        match = pattern.match(/^\/(.*)\/([gim]*)$/);
        if (match) {
          pattern = new RegExp(match[1], match[2]);
          patternValidator = function (value) {
            return validateRegex(pattern, value);
          };
        } else {
          patternValidator = function (value) {
            var patternObj = scope.$eval(pattern);
            if (!patternObj || !patternObj.test) {
              throw minErr('ngPattern')('noregexp', 'Expected {0} to be a RegExp but was {1}. Element: {2}', pattern, patternObj, startingTag(element));
            }
            return validateRegex(patternObj, value);
          };
        }
        ctrl.$formatters.push(patternValidator);
        ctrl.$parsers.push(patternValidator);
      }
      if (attr.ngMinlength) {
        var minlength = int(attr.ngMinlength);
        var minLengthValidator = function (value) {
          return validate(ctrl, 'minlength', ctrl.$isEmpty(value) || value.length >= minlength, value);
        };
        ctrl.$parsers.push(minLengthValidator);
        ctrl.$formatters.push(minLengthValidator);
      }
      if (attr.ngMaxlength) {
        var maxlength = int(attr.ngMaxlength);
        var maxLengthValidator = function (value) {
          return validate(ctrl, 'maxlength', ctrl.$isEmpty(value) || value.length <= maxlength, value);
        };
        ctrl.$parsers.push(maxLengthValidator);
        ctrl.$formatters.push(maxLengthValidator);
      }
    }
    function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      textInputType(scope, element, attr, ctrl, $sniffer, $browser);
      ctrl.$parsers.push(function (value) {
        var empty = ctrl.$isEmpty(value);
        if (empty || NUMBER_REGEXP.test(value)) {
          ctrl.$setValidity('number', true);
          return value === '' ? null : empty ? value : parseFloat(value);
        } else {
          ctrl.$setValidity('number', false);
          return undefined;
        }
      });
      ctrl.$formatters.push(function (value) {
        return ctrl.$isEmpty(value) ? '' : '' + value;
      });
      if (attr.min) {
        var minValidator = function (value) {
          var min = parseFloat(attr.min);
          return validate(ctrl, 'min', ctrl.$isEmpty(value) || value >= min, value);
        };
        ctrl.$parsers.push(minValidator);
        ctrl.$formatters.push(minValidator);
      }
      if (attr.max) {
        var maxValidator = function (value) {
          var max = parseFloat(attr.max);
          return validate(ctrl, 'max', ctrl.$isEmpty(value) || value <= max, value);
        };
        ctrl.$parsers.push(maxValidator);
        ctrl.$formatters.push(maxValidator);
      }
      ctrl.$formatters.push(function (value) {
        return validate(ctrl, 'number', ctrl.$isEmpty(value) || isNumber(value), value);
      });
    }
    function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      textInputType(scope, element, attr, ctrl, $sniffer, $browser);
      var urlValidator = function (value) {
        return validate(ctrl, 'url', ctrl.$isEmpty(value) || URL_REGEXP.test(value), value);
      };
      ctrl.$formatters.push(urlValidator);
      ctrl.$parsers.push(urlValidator);
    }
    function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
      textInputType(scope, element, attr, ctrl, $sniffer, $browser);
      var emailValidator = function (value) {
        return validate(ctrl, 'email', ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value), value);
      };
      ctrl.$formatters.push(emailValidator);
      ctrl.$parsers.push(emailValidator);
    }
    function radioInputType(scope, element, attr, ctrl) {
      if (isUndefined(attr.name)) {
        element.attr('name', nextUid());
      }
      element.on('click', function () {
        if (element[0].checked) {
          scope.$apply(function () {
            ctrl.$setViewValue(attr.value);
          });
        }
      });
      ctrl.$render = function () {
        var value = attr.value;
        element[0].checked = value == ctrl.$viewValue;
      };
      attr.$observe('value', ctrl.$render);
    }
    function checkboxInputType(scope, element, attr, ctrl) {
      var trueValue = attr.ngTrueValue, falseValue = attr.ngFalseValue;
      if (!isString(trueValue))
        trueValue = true;
      if (!isString(falseValue))
        falseValue = false;
      element.on('click', function () {
        scope.$apply(function () {
          ctrl.$setViewValue(element[0].checked);
        });
      });
      ctrl.$render = function () {
        element[0].checked = ctrl.$viewValue;
      };
      ctrl.$isEmpty = function (value) {
        return value !== trueValue;
      };
      ctrl.$formatters.push(function (value) {
        return value === trueValue;
      });
      ctrl.$parsers.push(function (value) {
        return value ? trueValue : falseValue;
      });
    }
    var inputDirective = [
        '$browser',
        '$sniffer',
        function ($browser, $sniffer) {
          return {
            restrict: 'E',
            require: '?ngModel',
            link: function (scope, element, attr, ctrl) {
              if (ctrl) {
                (inputType[lowercase(attr.type)] || inputType.text)(scope, element, attr, ctrl, $sniffer, $browser);
              }
            }
          };
        }
      ];
    var VALID_CLASS = 'ng-valid', INVALID_CLASS = 'ng-invalid', PRISTINE_CLASS = 'ng-pristine', DIRTY_CLASS = 'ng-dirty';
    var NgModelController = [
        '$scope',
        '$exceptionHandler',
        '$attrs',
        '$element',
        '$parse',
        function ($scope, $exceptionHandler, $attr, $element, $parse) {
          this.$viewValue = Number.NaN;
          this.$modelValue = Number.NaN;
          this.$parsers = [];
          this.$formatters = [];
          this.$viewChangeListeners = [];
          this.$pristine = true;
          this.$dirty = false;
          this.$valid = true;
          this.$invalid = false;
          this.$name = $attr.name;
          var ngModelGet = $parse($attr.ngModel), ngModelSet = ngModelGet.assign;
          if (!ngModelSet) {
            throw minErr('ngModel')('nonassign', 'Expression \'{0}\' is non-assignable. Element: {1}', $attr.ngModel, startingTag($element));
          }
          this.$render = noop;
          this.$isEmpty = function (value) {
            return isUndefined(value) || value === '' || value === null || value !== value;
          };
          var parentForm = $element.inheritedData('$formController') || nullFormCtrl, invalidCount = 0, $error = this.$error = {};
          $element.addClass(PRISTINE_CLASS);
          toggleValidCss(true);
          function toggleValidCss(isValid, validationErrorKey) {
            validationErrorKey = validationErrorKey ? '-' + snake_case(validationErrorKey, '-') : '';
            $element.removeClass((isValid ? INVALID_CLASS : VALID_CLASS) + validationErrorKey).addClass((isValid ? VALID_CLASS : INVALID_CLASS) + validationErrorKey);
          }
          this.$setValidity = function (validationErrorKey, isValid) {
            if ($error[validationErrorKey] === !isValid)
              return;
            if (isValid) {
              if ($error[validationErrorKey])
                invalidCount--;
              if (!invalidCount) {
                toggleValidCss(true);
                this.$valid = true;
                this.$invalid = false;
              }
            } else {
              toggleValidCss(false);
              this.$invalid = true;
              this.$valid = false;
              invalidCount++;
            }
            $error[validationErrorKey] = !isValid;
            toggleValidCss(isValid, validationErrorKey);
            parentForm.$setValidity(validationErrorKey, isValid, this);
          };
          this.$setPristine = function () {
            this.$dirty = false;
            this.$pristine = true;
            $element.removeClass(DIRTY_CLASS).addClass(PRISTINE_CLASS);
          };
          this.$setViewValue = function (value) {
            this.$viewValue = value;
            if (this.$pristine) {
              this.$dirty = true;
              this.$pristine = false;
              $element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
              parentForm.$setDirty();
            }
            forEach(this.$parsers, function (fn) {
              value = fn(value);
            });
            if (this.$modelValue !== value) {
              this.$modelValue = value;
              ngModelSet($scope, value);
              forEach(this.$viewChangeListeners, function (listener) {
                try {
                  listener();
                } catch (e) {
                  $exceptionHandler(e);
                }
              });
            }
          };
          var ctrl = this;
          $scope.$watch(function ngModelWatch() {
            var value = ngModelGet($scope);
            if (ctrl.$modelValue !== value) {
              var formatters = ctrl.$formatters, idx = formatters.length;
              ctrl.$modelValue = value;
              while (idx--) {
                value = formatters[idx](value);
              }
              if (ctrl.$viewValue !== value) {
                ctrl.$viewValue = value;
                ctrl.$render();
              }
            }
            return value;
          });
        }
      ];
    var ngModelDirective = function () {
      return {
        require: [
          'ngModel',
          '^?form'
        ],
        controller: NgModelController,
        link: function (scope, element, attr, ctrls) {
          var modelCtrl = ctrls[0], formCtrl = ctrls[1] || nullFormCtrl;
          formCtrl.$addControl(modelCtrl);
          scope.$on('$destroy', function () {
            formCtrl.$removeControl(modelCtrl);
          });
        }
      };
    };
    var ngChangeDirective = valueFn({
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
          ctrl.$viewChangeListeners.push(function () {
            scope.$eval(attr.ngChange);
          });
        }
      });
    var requiredDirective = function () {
      return {
        require: '?ngModel',
        link: function (scope, elm, attr, ctrl) {
          if (!ctrl)
            return;
          attr.required = true;
          var validator = function (value) {
            if (attr.required && ctrl.$isEmpty(value)) {
              ctrl.$setValidity('required', false);
              return;
            } else {
              ctrl.$setValidity('required', true);
              return value;
            }
          };
          ctrl.$formatters.push(validator);
          ctrl.$parsers.unshift(validator);
          attr.$observe('required', function () {
            validator(ctrl.$viewValue);
          });
        }
      };
    };
    var ngListDirective = function () {
      return {
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
          var match = /\/(.*)\//.exec(attr.ngList), separator = match && new RegExp(match[1]) || attr.ngList || ',';
          var parse = function (viewValue) {
            if (isUndefined(viewValue))
              return;
            var list = [];
            if (viewValue) {
              forEach(viewValue.split(separator), function (value) {
                if (value)
                  list.push(trim(value));
              });
            }
            return list;
          };
          ctrl.$parsers.push(parse);
          ctrl.$formatters.push(function (value) {
            if (isArray(value)) {
              return value.join(', ');
            }
            return undefined;
          });
          ctrl.$isEmpty = function (value) {
            return !value || !value.length;
          };
        }
      };
    };
    var CONSTANT_VALUE_REGEXP = /^(true|false|\d+)$/;
    var ngValueDirective = function () {
      return {
        priority: 100,
        compile: function (tpl, tplAttr) {
          if (CONSTANT_VALUE_REGEXP.test(tplAttr.ngValue)) {
            return function ngValueConstantLink(scope, elm, attr) {
              attr.$set('value', scope.$eval(attr.ngValue));
            };
          } else {
            return function ngValueLink(scope, elm, attr) {
              scope.$watch(attr.ngValue, function valueWatchAction(value) {
                attr.$set('value', value);
              });
            };
          }
        }
      };
    };
    var ngBindDirective = ngDirective(function (scope, element, attr) {
        element.addClass('ng-binding').data('$binding', attr.ngBind);
        scope.$watch(attr.ngBind, function ngBindWatchAction(value) {
          element.text(value == undefined ? '' : value);
        });
      });
    var ngBindTemplateDirective = [
        '$interpolate',
        function ($interpolate) {
          return function (scope, element, attr) {
            var interpolateFn = $interpolate(element.attr(attr.$attr.ngBindTemplate));
            element.addClass('ng-binding').data('$binding', interpolateFn);
            attr.$observe('ngBindTemplate', function (value) {
              element.text(value);
            });
          };
        }
      ];
    var ngBindHtmlDirective = [
        '$sce',
        '$parse',
        function ($sce, $parse) {
          return function (scope, element, attr) {
            element.addClass('ng-binding').data('$binding', attr.ngBindHtml);
            var parsed = $parse(attr.ngBindHtml);
            function getStringValue() {
              return (parsed(scope) || '').toString();
            }
            scope.$watch(getStringValue, function ngBindHtmlWatchAction(value) {
              element.html($sce.getTrustedHtml(parsed(scope)) || '');
            });
          };
        }
      ];
    function classDirective(name, selector) {
      name = 'ngClass' + name;
      return function () {
        return {
          restrict: 'AC',
          link: function (scope, element, attr) {
            var oldVal;
            scope.$watch(attr[name], ngClassWatchAction, true);
            attr.$observe('class', function (value) {
              ngClassWatchAction(scope.$eval(attr[name]));
            });
            if (name !== 'ngClass') {
              scope.$watch('$index', function ($index, old$index) {
                var mod = $index & 1;
                if (mod !== old$index & 1) {
                  var classes = flattenClasses(scope.$eval(attr[name]));
                  mod === selector ? attr.$addClass(classes) : attr.$removeClass(classes);
                }
              });
            }
            function ngClassWatchAction(newVal) {
              if (selector === true || scope.$index % 2 === selector) {
                var newClasses = flattenClasses(newVal || '');
                if (!oldVal) {
                  attr.$addClass(newClasses);
                } else if (!equals(newVal, oldVal)) {
                  attr.$updateClass(newClasses, flattenClasses(oldVal));
                }
              }
              oldVal = copy(newVal);
            }
            function flattenClasses(classVal) {
              if (isArray(classVal)) {
                return classVal.join(' ');
              } else if (isObject(classVal)) {
                var classes = [], i = 0;
                forEach(classVal, function (v, k) {
                  if (v) {
                    classes.push(k);
                  }
                });
                return classes.join(' ');
              }
              return classVal;
            }
          }
        };
      };
    }
    var ngClassDirective = classDirective('', true);
    var ngClassOddDirective = classDirective('Odd', 0);
    var ngClassEvenDirective = classDirective('Even', 1);
    var ngCloakDirective = ngDirective({
        compile: function (element, attr) {
          attr.$set('ngCloak', undefined);
          element.removeClass('ng-cloak');
        }
      });
    var ngControllerDirective = [function () {
          return {
            scope: true,
            controller: '@',
            priority: 500
          };
        }];
    var ngEventDirectives = {};
    forEach('click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '), function (name) {
      var directiveName = directiveNormalize('ng-' + name);
      ngEventDirectives[directiveName] = [
        '$parse',
        function ($parse) {
          return {
            compile: function ($element, attr) {
              var fn = $parse(attr[directiveName]);
              return function (scope, element, attr) {
                element.on(lowercase(name), function (event) {
                  scope.$apply(function () {
                    fn(scope, { $event: event });
                  });
                });
              };
            }
          };
        }
      ];
    });
    var ngIfDirective = [
        '$animate',
        function ($animate) {
          return {
            transclude: 'element',
            priority: 600,
            terminal: true,
            restrict: 'A',
            $$tlb: true,
            link: function ($scope, $element, $attr, ctrl, $transclude) {
              var block, childScope;
              $scope.$watch($attr.ngIf, function ngIfWatchAction(value) {
                if (toBoolean(value)) {
                  if (!childScope) {
                    childScope = $scope.$new();
                    $transclude(childScope, function (clone) {
                      clone[clone.length++] = document.createComment(' end ngIf: ' + $attr.ngIf + ' ');
                      block = { clone: clone };
                      $animate.enter(clone, $element.parent(), $element);
                    });
                  }
                } else {
                  if (childScope) {
                    childScope.$destroy();
                    childScope = null;
                  }
                  if (block) {
                    $animate.leave(getBlockElements(block.clone));
                    block = null;
                  }
                }
              });
            }
          };
        }
      ];
    var ngIncludeDirective = [
        '$http',
        '$templateCache',
        '$anchorScroll',
        '$animate',
        '$sce',
        function ($http, $templateCache, $anchorScroll, $animate, $sce) {
          return {
            restrict: 'ECA',
            priority: 400,
            terminal: true,
            transclude: 'element',
            controller: angular.noop,
            compile: function (element, attr) {
              var srcExp = attr.ngInclude || attr.src, onloadExp = attr.onload || '', autoScrollExp = attr.autoscroll;
              return function (scope, $element, $attr, ctrl, $transclude) {
                var changeCounter = 0, currentScope, currentElement;
                var cleanupLastIncludeContent = function () {
                  if (currentScope) {
                    currentScope.$destroy();
                    currentScope = null;
                  }
                  if (currentElement) {
                    $animate.leave(currentElement);
                    currentElement = null;
                  }
                };
                scope.$watch($sce.parseAsResourceUrl(srcExp), function ngIncludeWatchAction(src) {
                  var afterAnimation = function () {
                    if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                      $anchorScroll();
                    }
                  };
                  var thisChangeId = ++changeCounter;
                  if (src) {
                    $http.get(src, { cache: $templateCache }).success(function (response) {
                      if (thisChangeId !== changeCounter)
                        return;
                      var newScope = scope.$new();
                      ctrl.template = response;
                      var clone = $transclude(newScope, function (clone) {
                          cleanupLastIncludeContent();
                          $animate.enter(clone, null, $element, afterAnimation);
                        });
                      currentScope = newScope;
                      currentElement = clone;
                      currentScope.$emit('$includeContentLoaded');
                      scope.$eval(onloadExp);
                    }).error(function () {
                      if (thisChangeId === changeCounter)
                        cleanupLastIncludeContent();
                    });
                    scope.$emit('$includeContentRequested');
                  } else {
                    cleanupLastIncludeContent();
                    ctrl.template = null;
                  }
                });
              };
            }
          };
        }
      ];
    var ngIncludeFillContentDirective = [
        '$compile',
        function ($compile) {
          return {
            restrict: 'ECA',
            priority: -400,
            require: 'ngInclude',
            link: function (scope, $element, $attr, ctrl) {
              $element.html(ctrl.template);
              $compile($element.contents())(scope);
            }
          };
        }
      ];
    var ngInitDirective = ngDirective({
        priority: 450,
        compile: function () {
          return {
            pre: function (scope, element, attrs) {
              scope.$eval(attrs.ngInit);
            }
          };
        }
      });
    var ngNonBindableDirective = ngDirective({
        terminal: true,
        priority: 1000
      });
    var ngPluralizeDirective = [
        '$locale',
        '$interpolate',
        function ($locale, $interpolate) {
          var BRACE = /{}/g;
          return {
            restrict: 'EA',
            link: function (scope, element, attr) {
              var numberExp = attr.count, whenExp = attr.$attr.when && element.attr(attr.$attr.when), offset = attr.offset || 0, whens = scope.$eval(whenExp) || {}, whensExpFns = {}, startSymbol = $interpolate.startSymbol(), endSymbol = $interpolate.endSymbol(), isWhen = /^when(Minus)?(.+)$/;
              forEach(attr, function (expression, attributeName) {
                if (isWhen.test(attributeName)) {
                  whens[lowercase(attributeName.replace('when', '').replace('Minus', '-'))] = element.attr(attr.$attr[attributeName]);
                }
              });
              forEach(whens, function (expression, key) {
                whensExpFns[key] = $interpolate(expression.replace(BRACE, startSymbol + numberExp + '-' + offset + endSymbol));
              });
              scope.$watch(function ngPluralizeWatch() {
                var value = parseFloat(scope.$eval(numberExp));
                if (!isNaN(value)) {
                  if (!(value in whens))
                    value = $locale.pluralCat(value - offset);
                  return whensExpFns[value](scope, element, true);
                } else {
                  return '';
                }
              }, function ngPluralizeWatchAction(newVal) {
                element.text(newVal);
              });
            }
          };
        }
      ];
    var ngRepeatDirective = [
        '$parse',
        '$animate',
        function ($parse, $animate) {
          var NG_REMOVED = '$$NG_REMOVED';
          var ngRepeatMinErr = minErr('ngRepeat');
          return {
            transclude: 'element',
            priority: 1000,
            terminal: true,
            $$tlb: true,
            link: function ($scope, $element, $attr, ctrl, $transclude) {
              var expression = $attr.ngRepeat;
              var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/), trackByExp, trackByExpGetter, trackByIdExpFn, trackByIdArrayFn, trackByIdObjFn, lhs, rhs, valueIdentifier, keyIdentifier, hashFnLocals = { $id: hashKey };
              if (!match) {
                throw ngRepeatMinErr('iexp', 'Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.', expression);
              }
              lhs = match[1];
              rhs = match[2];
              trackByExp = match[3];
              if (trackByExp) {
                trackByExpGetter = $parse(trackByExp);
                trackByIdExpFn = function (key, value, index) {
                  if (keyIdentifier)
                    hashFnLocals[keyIdentifier] = key;
                  hashFnLocals[valueIdentifier] = value;
                  hashFnLocals.$index = index;
                  return trackByExpGetter($scope, hashFnLocals);
                };
              } else {
                trackByIdArrayFn = function (key, value) {
                  return hashKey(value);
                };
                trackByIdObjFn = function (key) {
                  return key;
                };
              }
              match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
              if (!match) {
                throw ngRepeatMinErr('iidexp', '\'_item_\' in \'_item_ in _collection_\' should be an identifier or \'(_key_, _value_)\' expression, but got \'{0}\'.', lhs);
              }
              valueIdentifier = match[3] || match[1];
              keyIdentifier = match[2];
              var lastBlockMap = {};
              $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
                var index, length, previousNode = $element[0], nextNode, nextBlockMap = {}, arrayLength, childScope, key, value, trackById, trackByIdFn, collectionKeys, block, nextBlockOrder = [], elementsToRemove;
                if (isArrayLike(collection)) {
                  collectionKeys = collection;
                  trackByIdFn = trackByIdExpFn || trackByIdArrayFn;
                } else {
                  trackByIdFn = trackByIdExpFn || trackByIdObjFn;
                  collectionKeys = [];
                  for (key in collection) {
                    if (collection.hasOwnProperty(key) && key.charAt(0) != '$') {
                      collectionKeys.push(key);
                    }
                  }
                  collectionKeys.sort();
                }
                arrayLength = collectionKeys.length;
                length = nextBlockOrder.length = collectionKeys.length;
                for (index = 0; index < length; index++) {
                  key = collection === collectionKeys ? index : collectionKeys[index];
                  value = collection[key];
                  trackById = trackByIdFn(key, value, index);
                  assertNotHasOwnProperty(trackById, '`track by` id');
                  if (lastBlockMap.hasOwnProperty(trackById)) {
                    block = lastBlockMap[trackById];
                    delete lastBlockMap[trackById];
                    nextBlockMap[trackById] = block;
                    nextBlockOrder[index] = block;
                  } else if (nextBlockMap.hasOwnProperty(trackById)) {
                    forEach(nextBlockOrder, function (block) {
                      if (block && block.scope)
                        lastBlockMap[block.id] = block;
                    });
                    throw ngRepeatMinErr('dupes', 'Duplicates in a repeater are not allowed. Use \'track by\' expression to specify unique keys. Repeater: {0}, Duplicate key: {1}', expression, trackById);
                  } else {
                    nextBlockOrder[index] = { id: trackById };
                    nextBlockMap[trackById] = false;
                  }
                }
                for (key in lastBlockMap) {
                  if (lastBlockMap.hasOwnProperty(key)) {
                    block = lastBlockMap[key];
                    elementsToRemove = getBlockElements(block.clone);
                    $animate.leave(elementsToRemove);
                    forEach(elementsToRemove, function (element) {
                      element[NG_REMOVED] = true;
                    });
                    block.scope.$destroy();
                  }
                }
                for (index = 0, length = collectionKeys.length; index < length; index++) {
                  key = collection === collectionKeys ? index : collectionKeys[index];
                  value = collection[key];
                  block = nextBlockOrder[index];
                  if (nextBlockOrder[index - 1])
                    previousNode = getBlockEnd(nextBlockOrder[index - 1]);
                  if (block.scope) {
                    childScope = block.scope;
                    nextNode = previousNode;
                    do {
                      nextNode = nextNode.nextSibling;
                    } while (nextNode && nextNode[NG_REMOVED]);
                    if (getBlockStart(block) != nextNode) {
                      $animate.move(getBlockElements(block.clone), null, jqLite(previousNode));
                    }
                    previousNode = getBlockEnd(block);
                  } else {
                    childScope = $scope.$new();
                  }
                  childScope[valueIdentifier] = value;
                  if (keyIdentifier)
                    childScope[keyIdentifier] = key;
                  childScope.$index = index;
                  childScope.$first = index === 0;
                  childScope.$last = index === arrayLength - 1;
                  childScope.$middle = !(childScope.$first || childScope.$last);
                  childScope.$odd = !(childScope.$even = (index & 1) === 0);
                  if (!block.scope) {
                    $transclude(childScope, function (clone) {
                      clone[clone.length++] = document.createComment(' end ngRepeat: ' + expression + ' ');
                      $animate.enter(clone, null, jqLite(previousNode));
                      previousNode = clone;
                      block.scope = childScope;
                      block.clone = clone;
                      nextBlockMap[block.id] = block;
                    });
                  }
                }
                lastBlockMap = nextBlockMap;
              });
            }
          };
          function getBlockStart(block) {
            return block.clone[0];
          }
          function getBlockEnd(block) {
            return block.clone[block.clone.length - 1];
          }
        }
      ];
    var ngShowDirective = [
        '$animate',
        function ($animate) {
          return function (scope, element, attr) {
            scope.$watch(attr.ngShow, function ngShowWatchAction(value) {
              $animate[toBoolean(value) ? 'removeClass' : 'addClass'](element, 'ng-hide');
            });
          };
        }
      ];
    var ngHideDirective = [
        '$animate',
        function ($animate) {
          return function (scope, element, attr) {
            scope.$watch(attr.ngHide, function ngHideWatchAction(value) {
              $animate[toBoolean(value) ? 'addClass' : 'removeClass'](element, 'ng-hide');
            });
          };
        }
      ];
    var ngStyleDirective = ngDirective(function (scope, element, attr) {
        scope.$watch(attr.ngStyle, function ngStyleWatchAction(newStyles, oldStyles) {
          if (oldStyles && newStyles !== oldStyles) {
            forEach(oldStyles, function (val, style) {
              element.css(style, '');
            });
          }
          if (newStyles)
            element.css(newStyles);
        }, true);
      });
    var ngSwitchDirective = [
        '$animate',
        function ($animate) {
          return {
            restrict: 'EA',
            require: 'ngSwitch',
            controller: [
              '$scope',
              function ngSwitchController() {
                this.cases = {};
              }
            ],
            link: function (scope, element, attr, ngSwitchController) {
              var watchExpr = attr.ngSwitch || attr.on, selectedTranscludes, selectedElements, selectedScopes = [];
              scope.$watch(watchExpr, function ngSwitchWatchAction(value) {
                for (var i = 0, ii = selectedScopes.length; i < ii; i++) {
                  selectedScopes[i].$destroy();
                  $animate.leave(selectedElements[i]);
                }
                selectedElements = [];
                selectedScopes = [];
                if (selectedTranscludes = ngSwitchController.cases['!' + value] || ngSwitchController.cases['?']) {
                  scope.$eval(attr.change);
                  forEach(selectedTranscludes, function (selectedTransclude) {
                    var selectedScope = scope.$new();
                    selectedScopes.push(selectedScope);
                    selectedTransclude.transclude(selectedScope, function (caseElement) {
                      var anchor = selectedTransclude.element;
                      selectedElements.push(caseElement);
                      $animate.enter(caseElement, anchor.parent(), anchor);
                    });
                  });
                }
              });
            }
          };
        }
      ];
    var ngSwitchWhenDirective = ngDirective({
        transclude: 'element',
        priority: 800,
        require: '^ngSwitch',
        link: function (scope, element, attrs, ctrl, $transclude) {
          ctrl.cases['!' + attrs.ngSwitchWhen] = ctrl.cases['!' + attrs.ngSwitchWhen] || [];
          ctrl.cases['!' + attrs.ngSwitchWhen].push({
            transclude: $transclude,
            element: element
          });
        }
      });
    var ngSwitchDefaultDirective = ngDirective({
        transclude: 'element',
        priority: 800,
        require: '^ngSwitch',
        link: function (scope, element, attr, ctrl, $transclude) {
          ctrl.cases['?'] = ctrl.cases['?'] || [];
          ctrl.cases['?'].push({
            transclude: $transclude,
            element: element
          });
        }
      });
    var ngTranscludeDirective = ngDirective({
        controller: [
          '$element',
          '$transclude',
          function ($element, $transclude) {
            if (!$transclude) {
              throw minErr('ngTransclude')('orphan', 'Illegal use of ngTransclude directive in the template! ' + 'No parent directive that requires a transclusion found. ' + 'Element: {0}', startingTag($element));
            }
            this.$transclude = $transclude;
          }
        ],
        link: function ($scope, $element, $attrs, controller) {
          controller.$transclude(function (clone) {
            $element.empty();
            $element.append(clone);
          });
        }
      });
    var scriptDirective = [
        '$templateCache',
        function ($templateCache) {
          return {
            restrict: 'E',
            terminal: true,
            compile: function (element, attr) {
              if (attr.type == 'text/ng-template') {
                var templateUrl = attr.id, text = element[0].text;
                $templateCache.put(templateUrl, text);
              }
            }
          };
        }
      ];
    var ngOptionsMinErr = minErr('ngOptions');
    var ngOptionsDirective = valueFn({ terminal: true });
    var selectDirective = [
        '$compile',
        '$parse',
        function ($compile, $parse) {
          var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/, nullModelCtrl = { $setViewValue: noop };
          return {
            restrict: 'E',
            require: [
              'select',
              '?ngModel'
            ],
            controller: [
              '$element',
              '$scope',
              '$attrs',
              function ($element, $scope, $attrs) {
                var self = this, optionsMap = {}, ngModelCtrl = nullModelCtrl, nullOption, unknownOption;
                self.databound = $attrs.ngModel;
                self.init = function (ngModelCtrl_, nullOption_, unknownOption_) {
                  ngModelCtrl = ngModelCtrl_;
                  nullOption = nullOption_;
                  unknownOption = unknownOption_;
                };
                self.addOption = function (value) {
                  assertNotHasOwnProperty(value, '"option value"');
                  optionsMap[value] = true;
                  if (ngModelCtrl.$viewValue == value) {
                    $element.val(value);
                    if (unknownOption.parent())
                      unknownOption.remove();
                  }
                };
                self.removeOption = function (value) {
                  if (this.hasOption(value)) {
                    delete optionsMap[value];
                    if (ngModelCtrl.$viewValue == value) {
                      this.renderUnknownOption(value);
                    }
                  }
                };
                self.renderUnknownOption = function (val) {
                  var unknownVal = '? ' + hashKey(val) + ' ?';
                  unknownOption.val(unknownVal);
                  $element.prepend(unknownOption);
                  $element.val(unknownVal);
                  unknownOption.prop('selected', true);
                };
                self.hasOption = function (value) {
                  return optionsMap.hasOwnProperty(value);
                };
                $scope.$on('$destroy', function () {
                  self.renderUnknownOption = noop;
                });
              }
            ],
            link: function (scope, element, attr, ctrls) {
              if (!ctrls[1])
                return;
              var selectCtrl = ctrls[0], ngModelCtrl = ctrls[1], multiple = attr.multiple, optionsExp = attr.ngOptions, nullOption = false, emptyOption, optionTemplate = jqLite(document.createElement('option')), optGroupTemplate = jqLite(document.createElement('optgroup')), unknownOption = optionTemplate.clone();
              for (var i = 0, children = element.children(), ii = children.length; i < ii; i++) {
                if (children[i].value === '') {
                  emptyOption = nullOption = children.eq(i);
                  break;
                }
              }
              selectCtrl.init(ngModelCtrl, nullOption, unknownOption);
              if (multiple) {
                ngModelCtrl.$isEmpty = function (value) {
                  return !value || value.length === 0;
                };
              }
              if (optionsExp)
                setupAsOptions(scope, element, ngModelCtrl);
              else if (multiple)
                setupAsMultiple(scope, element, ngModelCtrl);
              else
                setupAsSingle(scope, element, ngModelCtrl, selectCtrl);
              function setupAsSingle(scope, selectElement, ngModelCtrl, selectCtrl) {
                ngModelCtrl.$render = function () {
                  var viewValue = ngModelCtrl.$viewValue;
                  if (selectCtrl.hasOption(viewValue)) {
                    if (unknownOption.parent())
                      unknownOption.remove();
                    selectElement.val(viewValue);
                    if (viewValue === '')
                      emptyOption.prop('selected', true);
                  } else {
                    if (isUndefined(viewValue) && emptyOption) {
                      selectElement.val('');
                    } else {
                      selectCtrl.renderUnknownOption(viewValue);
                    }
                  }
                };
                selectElement.on('change', function () {
                  scope.$apply(function () {
                    if (unknownOption.parent())
                      unknownOption.remove();
                    ngModelCtrl.$setViewValue(selectElement.val());
                  });
                });
              }
              function setupAsMultiple(scope, selectElement, ctrl) {
                var lastView;
                ctrl.$render = function () {
                  var items = new HashMap(ctrl.$viewValue);
                  forEach(selectElement.find('option'), function (option) {
                    option.selected = isDefined(items.get(option.value));
                  });
                };
                scope.$watch(function selectMultipleWatch() {
                  if (!equals(lastView, ctrl.$viewValue)) {
                    lastView = copy(ctrl.$viewValue);
                    ctrl.$render();
                  }
                });
                selectElement.on('change', function () {
                  scope.$apply(function () {
                    var array = [];
                    forEach(selectElement.find('option'), function (option) {
                      if (option.selected) {
                        array.push(option.value);
                      }
                    });
                    ctrl.$setViewValue(array);
                  });
                });
              }
              function setupAsOptions(scope, selectElement, ctrl) {
                var match;
                if (!(match = optionsExp.match(NG_OPTIONS_REGEXP))) {
                  throw ngOptionsMinErr('iexp', 'Expected expression in form of ' + '\'_select_ (as _label_)? for (_key_,)?_value_ in _collection_\'' + ' but got \'{0}\'. Element: {1}', optionsExp, startingTag(selectElement));
                }
                var displayFn = $parse(match[2] || match[1]), valueName = match[4] || match[6], keyName = match[5], groupByFn = $parse(match[3] || ''), valueFn = $parse(match[2] ? match[1] : valueName), valuesFn = $parse(match[7]), track = match[8], trackFn = track ? $parse(match[8]) : null, optionGroupsCache = [[{
                        element: selectElement,
                        label: ''
                      }]];
                if (nullOption) {
                  $compile(nullOption)(scope);
                  nullOption.removeClass('ng-scope');
                  nullOption.remove();
                }
                selectElement.empty();
                selectElement.on('change', function () {
                  scope.$apply(function () {
                    var optionGroup, collection = valuesFn(scope) || [], locals = {}, key, value, optionElement, index, groupIndex, length, groupLength, trackIndex;
                    if (multiple) {
                      value = [];
                      for (groupIndex = 0, groupLength = optionGroupsCache.length; groupIndex < groupLength; groupIndex++) {
                        optionGroup = optionGroupsCache[groupIndex];
                        for (index = 1, length = optionGroup.length; index < length; index++) {
                          if ((optionElement = optionGroup[index].element)[0].selected) {
                            key = optionElement.val();
                            if (keyName)
                              locals[keyName] = key;
                            if (trackFn) {
                              for (trackIndex = 0; trackIndex < collection.length; trackIndex++) {
                                locals[valueName] = collection[trackIndex];
                                if (trackFn(scope, locals) == key)
                                  break;
                              }
                            } else {
                              locals[valueName] = collection[key];
                            }
                            value.push(valueFn(scope, locals));
                          }
                        }
                      }
                    } else {
                      key = selectElement.val();
                      if (key == '?') {
                        value = undefined;
                      } else if (key === '') {
                        value = null;
                      } else {
                        if (trackFn) {
                          for (trackIndex = 0; trackIndex < collection.length; trackIndex++) {
                            locals[valueName] = collection[trackIndex];
                            if (trackFn(scope, locals) == key) {
                              value = valueFn(scope, locals);
                              break;
                            }
                          }
                        } else {
                          locals[valueName] = collection[key];
                          if (keyName)
                            locals[keyName] = key;
                          value = valueFn(scope, locals);
                        }
                      }
                    }
                    ctrl.$setViewValue(value);
                  });
                });
                ctrl.$render = render;
                scope.$watch(render);
                function render() {
                  var optionGroups = { '': [] }, optionGroupNames = [''], optionGroupName, optionGroup, option, existingParent, existingOptions, existingOption, modelValue = ctrl.$modelValue, values = valuesFn(scope) || [], keys = keyName ? sortedKeys(values) : values, key, groupLength, length, groupIndex, index, locals = {}, selected, selectedSet = false, lastElement, element, label;
                  if (multiple) {
                    if (trackFn && isArray(modelValue)) {
                      selectedSet = new HashMap([]);
                      for (var trackIndex = 0; trackIndex < modelValue.length; trackIndex++) {
                        locals[valueName] = modelValue[trackIndex];
                        selectedSet.put(trackFn(scope, locals), modelValue[trackIndex]);
                      }
                    } else {
                      selectedSet = new HashMap(modelValue);
                    }
                  }
                  for (index = 0; length = keys.length, index < length; index++) {
                    key = index;
                    if (keyName) {
                      key = keys[index];
                      if (key.charAt(0) === '$')
                        continue;
                      locals[keyName] = key;
                    }
                    locals[valueName] = values[key];
                    optionGroupName = groupByFn(scope, locals) || '';
                    if (!(optionGroup = optionGroups[optionGroupName])) {
                      optionGroup = optionGroups[optionGroupName] = [];
                      optionGroupNames.push(optionGroupName);
                    }
                    if (multiple) {
                      selected = isDefined(selectedSet.remove(trackFn ? trackFn(scope, locals) : valueFn(scope, locals)));
                    } else {
                      if (trackFn) {
                        var modelCast = {};
                        modelCast[valueName] = modelValue;
                        selected = trackFn(scope, modelCast) === trackFn(scope, locals);
                      } else {
                        selected = modelValue === valueFn(scope, locals);
                      }
                      selectedSet = selectedSet || selected;
                    }
                    label = displayFn(scope, locals);
                    label = isDefined(label) ? label : '';
                    optionGroup.push({
                      id: trackFn ? trackFn(scope, locals) : keyName ? keys[index] : index,
                      label: label,
                      selected: selected
                    });
                  }
                  if (!multiple) {
                    if (nullOption || modelValue === null) {
                      optionGroups[''].unshift({
                        id: '',
                        label: '',
                        selected: !selectedSet
                      });
                    } else if (!selectedSet) {
                      optionGroups[''].unshift({
                        id: '?',
                        label: '',
                        selected: true
                      });
                    }
                  }
                  for (groupIndex = 0, groupLength = optionGroupNames.length; groupIndex < groupLength; groupIndex++) {
                    optionGroupName = optionGroupNames[groupIndex];
                    optionGroup = optionGroups[optionGroupName];
                    if (optionGroupsCache.length <= groupIndex) {
                      existingParent = {
                        element: optGroupTemplate.clone().attr('label', optionGroupName),
                        label: optionGroup.label
                      };
                      existingOptions = [existingParent];
                      optionGroupsCache.push(existingOptions);
                      selectElement.append(existingParent.element);
                    } else {
                      existingOptions = optionGroupsCache[groupIndex];
                      existingParent = existingOptions[0];
                      if (existingParent.label != optionGroupName) {
                        existingParent.element.attr('label', existingParent.label = optionGroupName);
                      }
                    }
                    lastElement = null;
                    for (index = 0, length = optionGroup.length; index < length; index++) {
                      option = optionGroup[index];
                      if (existingOption = existingOptions[index + 1]) {
                        lastElement = existingOption.element;
                        if (existingOption.label !== option.label) {
                          lastElement.text(existingOption.label = option.label);
                        }
                        if (existingOption.id !== option.id) {
                          lastElement.val(existingOption.id = option.id);
                        }
                        if (lastElement[0].selected !== option.selected) {
                          lastElement.prop('selected', existingOption.selected = option.selected);
                        }
                      } else {
                        if (option.id === '' && nullOption) {
                          element = nullOption;
                        } else {
                          (element = optionTemplate.clone()).val(option.id).attr('selected', option.selected).text(option.label);
                        }
                        existingOptions.push(existingOption = {
                          element: element,
                          label: option.label,
                          id: option.id,
                          selected: option.selected
                        });
                        if (lastElement) {
                          lastElement.after(element);
                        } else {
                          existingParent.element.append(element);
                        }
                        lastElement = element;
                      }
                    }
                    index++;
                    while (existingOptions.length > index) {
                      existingOptions.pop().element.remove();
                    }
                  }
                  while (optionGroupsCache.length > groupIndex) {
                    optionGroupsCache.pop()[0].element.remove();
                  }
                }
              }
            }
          };
        }
      ];
    var optionDirective = [
        '$interpolate',
        function ($interpolate) {
          var nullSelectCtrl = {
              addOption: noop,
              removeOption: noop
            };
          return {
            restrict: 'E',
            priority: 100,
            compile: function (element, attr) {
              if (isUndefined(attr.value)) {
                var interpolateFn = $interpolate(element.text(), true);
                if (!interpolateFn) {
                  attr.$set('value', element.text());
                }
              }
              return function (scope, element, attr) {
                var selectCtrlName = '$selectController', parent = element.parent(), selectCtrl = parent.data(selectCtrlName) || parent.parent().data(selectCtrlName);
                if (selectCtrl && selectCtrl.databound) {
                  element.prop('selected', false);
                } else {
                  selectCtrl = nullSelectCtrl;
                }
                if (interpolateFn) {
                  scope.$watch(interpolateFn, function interpolateWatchAction(newVal, oldVal) {
                    attr.$set('value', newVal);
                    if (newVal !== oldVal)
                      selectCtrl.removeOption(oldVal);
                    selectCtrl.addOption(newVal);
                  });
                } else {
                  selectCtrl.addOption(attr.value);
                }
                element.on('$destroy', function () {
                  selectCtrl.removeOption(attr.value);
                });
              };
            }
          };
        }
      ];
    var styleDirective = valueFn({
        restrict: 'E',
        terminal: true
      });
    bindJQuery();
    publishExternalAPI(angular);
    jqLite(document).ready(function () {
      angularInit(document, bootstrap);
    });
  }(window, document));
  !angular.$$csp() && angular.element(document).find('head').prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}</style>');
  define('angular', function (global) {
    return function () {
      var ret, fn;
      return ret || global.angular;
    };
  }(this));
  (function (window, angular, undefined) {
    'use strict';
    angular.module('ngAnimate', ['ng']).factory('$$animateReflow', [
      '$window',
      '$timeout',
      function ($window, $timeout) {
        var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || function (fn) {
            return $timeout(fn, 10, false);
          };
        var cancelAnimationFrame = $window.cancelAnimationFrame || $window.webkitCancelAnimationFrame || function (timer) {
            return $timeout.cancel(timer);
          };
        return function (fn) {
          var id = requestAnimationFrame(fn);
          return function () {
            cancelAnimationFrame(id);
          };
        };
      }
    ]).config([
      '$provide',
      '$animateProvider',
      function ($provide, $animateProvider) {
        var noop = angular.noop;
        var forEach = angular.forEach;
        var selectors = $animateProvider.$$selectors;
        var ELEMENT_NODE = 1;
        var NG_ANIMATE_STATE = '$$ngAnimateState';
        var NG_ANIMATE_CLASS_NAME = 'ng-animate';
        var rootAnimateState = { running: true };
        function extractElementNode(element) {
          for (var i = 0; i < element.length; i++) {
            var elm = element[i];
            if (elm.nodeType == ELEMENT_NODE) {
              return elm;
            }
          }
        }
        function isMatchingElement(elm1, elm2) {
          return extractElementNode(elm1) == extractElementNode(elm2);
        }
        $provide.decorator('$animate', [
          '$delegate',
          '$injector',
          '$sniffer',
          '$rootElement',
          '$timeout',
          '$rootScope',
          '$document',
          function ($delegate, $injector, $sniffer, $rootElement, $timeout, $rootScope, $document) {
            $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);
            $rootScope.$$postDigest(function () {
              $rootScope.$$postDigest(function () {
                rootAnimateState.running = false;
              });
            });
            var classNameFilter = $animateProvider.classNameFilter();
            var isAnimatableClassName = !classNameFilter ? function () {
                return true;
              } : function (className) {
                return classNameFilter.test(className);
              };
            function async(fn) {
              return $timeout(fn, 0, false);
            }
            function lookup(name) {
              if (name) {
                var matches = [], flagMap = {}, classes = name.substr(1).split('.');
                if ($sniffer.transitions || $sniffer.animations) {
                  classes.push('');
                }
                for (var i = 0; i < classes.length; i++) {
                  var klass = classes[i], selectorFactoryName = selectors[klass];
                  if (selectorFactoryName && !flagMap[klass]) {
                    matches.push($injector.get(selectorFactoryName));
                    flagMap[klass] = true;
                  }
                }
                return matches;
              }
            }
            return {
              enter: function (element, parentElement, afterElement, doneCallback) {
                this.enabled(false, element);
                $delegate.enter(element, parentElement, afterElement);
                $rootScope.$$postDigest(function () {
                  performAnimation('enter', 'ng-enter', element, parentElement, afterElement, noop, doneCallback);
                });
              },
              leave: function (element, doneCallback) {
                cancelChildAnimations(element);
                this.enabled(false, element);
                $rootScope.$$postDigest(function () {
                  performAnimation('leave', 'ng-leave', element, null, null, function () {
                    $delegate.leave(element);
                  }, doneCallback);
                });
              },
              move: function (element, parentElement, afterElement, doneCallback) {
                cancelChildAnimations(element);
                this.enabled(false, element);
                $delegate.move(element, parentElement, afterElement);
                $rootScope.$$postDigest(function () {
                  performAnimation('move', 'ng-move', element, parentElement, afterElement, noop, doneCallback);
                });
              },
              addClass: function (element, className, doneCallback) {
                performAnimation('addClass', className, element, null, null, function () {
                  $delegate.addClass(element, className);
                }, doneCallback);
              },
              removeClass: function (element, className, doneCallback) {
                performAnimation('removeClass', className, element, null, null, function () {
                  $delegate.removeClass(element, className);
                }, doneCallback);
              },
              enabled: function (value, element) {
                switch (arguments.length) {
                case 2:
                  if (value) {
                    cleanup(element);
                  } else {
                    var data = element.data(NG_ANIMATE_STATE) || {};
                    data.disabled = true;
                    element.data(NG_ANIMATE_STATE, data);
                  }
                  break;
                case 1:
                  rootAnimateState.disabled = !value;
                  break;
                default:
                  value = !rootAnimateState.disabled;
                  break;
                }
                return !!value;
              }
            };
            function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, doneCallback) {
              var currentClassName, classes, node = extractElementNode(element);
              if (node) {
                currentClassName = node.className;
                classes = currentClassName + ' ' + className;
              }
              if (!node || !isAnimatableClassName(classes)) {
                fireDOMOperation();
                fireBeforeCallbackAsync();
                fireAfterCallbackAsync();
                closeAnimation();
                return;
              }
              var animationLookup = (' ' + classes).replace(/\s+/g, '.');
              if (!parentElement) {
                parentElement = afterElement ? afterElement.parent() : element.parent();
              }
              var matches = lookup(animationLookup);
              var isClassBased = animationEvent == 'addClass' || animationEvent == 'removeClass';
              var ngAnimateState = element.data(NG_ANIMATE_STATE) || {};
              if (animationsDisabled(element, parentElement) || matches.length === 0) {
                fireDOMOperation();
                fireBeforeCallbackAsync();
                fireAfterCallbackAsync();
                closeAnimation();
                return;
              }
              var animations = [];
              var allowAnimations = isClassBased ? !ngAnimateState.disabled && (!ngAnimateState.running || !ngAnimateState.structural) : true;
              if (allowAnimations) {
                forEach(matches, function (animation) {
                  if (!animation.allowCancel || animation.allowCancel(element, animationEvent, className)) {
                    var beforeFn, afterFn = animation[animationEvent];
                    if (animationEvent == 'leave') {
                      beforeFn = afterFn;
                      afterFn = null;
                    } else {
                      beforeFn = animation['before' + animationEvent.charAt(0).toUpperCase() + animationEvent.substr(1)];
                    }
                    animations.push({
                      before: beforeFn,
                      after: afterFn
                    });
                  }
                });
              }
              if (animations.length === 0) {
                fireDOMOperation();
                fireBeforeCallbackAsync();
                fireAfterCallbackAsync();
                fireDoneCallbackAsync();
                return;
              }
              var ONE_SPACE = ' ';
              var futureClassName = ONE_SPACE + currentClassName + ONE_SPACE;
              if (ngAnimateState.running) {
                $timeout.cancel(ngAnimateState.closeAnimationTimeout);
                cleanup(element);
                cancelAnimations(ngAnimateState.animations);
                var isFullyClassBasedAnimation = isClassBased && !ngAnimateState.structural;
                var isRevertingClassAnimation = isFullyClassBasedAnimation && ngAnimateState.className == className && animationEvent != ngAnimateState.event;
                if (ngAnimateState.beforeComplete || isRevertingClassAnimation) {
                  (ngAnimateState.done || noop)(true);
                } else if (isFullyClassBasedAnimation) {
                  futureClassName = ngAnimateState.event == 'removeClass' ? futureClassName.replace(ONE_SPACE + ngAnimateState.className + ONE_SPACE, ONE_SPACE) : futureClassName + ngAnimateState.className + ONE_SPACE;
                }
              }
              var classNameToken = ONE_SPACE + className + ONE_SPACE;
              if (animationEvent == 'addClass' && futureClassName.indexOf(classNameToken) >= 0 || animationEvent == 'removeClass' && futureClassName.indexOf(classNameToken) == -1) {
                fireDOMOperation();
                fireBeforeCallbackAsync();
                fireAfterCallbackAsync();
                fireDoneCallbackAsync();
                return;
              }
              element.addClass(NG_ANIMATE_CLASS_NAME);
              element.data(NG_ANIMATE_STATE, {
                running: true,
                event: animationEvent,
                className: className,
                structural: !isClassBased,
                animations: animations,
                done: onBeforeAnimationsComplete
              });
              invokeRegisteredAnimationFns(animations, 'before', onBeforeAnimationsComplete);
              function onBeforeAnimationsComplete(cancelled) {
                fireDOMOperation();
                if (cancelled === true) {
                  closeAnimation();
                  return;
                }
                var data = element.data(NG_ANIMATE_STATE);
                if (data) {
                  data.done = closeAnimation;
                  element.data(NG_ANIMATE_STATE, data);
                }
                invokeRegisteredAnimationFns(animations, 'after', closeAnimation);
              }
              function invokeRegisteredAnimationFns(animations, phase, allAnimationFnsComplete) {
                phase == 'after' ? fireAfterCallbackAsync() : fireBeforeCallbackAsync();
                var endFnName = phase + 'End';
                forEach(animations, function (animation, index) {
                  var animationPhaseCompleted = function () {
                    progress(index, phase);
                  };
                  if (phase == 'before' && (animationEvent == 'enter' || animationEvent == 'move')) {
                    animationPhaseCompleted();
                    return;
                  }
                  if (animation[phase]) {
                    animation[endFnName] = isClassBased ? animation[phase](element, className, animationPhaseCompleted) : animation[phase](element, animationPhaseCompleted);
                  } else {
                    animationPhaseCompleted();
                  }
                });
                function progress(index, phase) {
                  var phaseCompletionFlag = phase + 'Complete';
                  var currentAnimation = animations[index];
                  currentAnimation[phaseCompletionFlag] = true;
                  (currentAnimation[endFnName] || noop)();
                  for (var i = 0; i < animations.length; i++) {
                    if (!animations[i][phaseCompletionFlag])
                      return;
                  }
                  allAnimationFnsComplete();
                }
              }
              function fireDOMCallback(animationPhase) {
                element.triggerHandler('$animate:' + animationPhase, {
                  event: animationEvent,
                  className: className
                });
              }
              function fireBeforeCallbackAsync() {
                async(function () {
                  fireDOMCallback('before');
                });
              }
              function fireAfterCallbackAsync() {
                async(function () {
                  fireDOMCallback('after');
                });
              }
              function fireDoneCallbackAsync() {
                async(function () {
                  fireDOMCallback('close');
                  doneCallback && doneCallback();
                });
              }
              function fireDOMOperation() {
                if (!fireDOMOperation.hasBeenRun) {
                  fireDOMOperation.hasBeenRun = true;
                  domOperation();
                }
              }
              function closeAnimation() {
                if (!closeAnimation.hasBeenRun) {
                  closeAnimation.hasBeenRun = true;
                  var data = element.data(NG_ANIMATE_STATE);
                  if (data) {
                    if (isClassBased) {
                      cleanup(element);
                    } else {
                      data.closeAnimationTimeout = async(function () {
                        cleanup(element);
                      });
                      element.data(NG_ANIMATE_STATE, data);
                    }
                  }
                  fireDoneCallbackAsync();
                }
              }
            }
            function cancelChildAnimations(element) {
              var node = extractElementNode(element);
              forEach(node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME), function (element) {
                element = angular.element(element);
                var data = element.data(NG_ANIMATE_STATE);
                if (data) {
                  cancelAnimations(data.animations);
                  cleanup(element);
                }
              });
            }
            function cancelAnimations(animations) {
              var isCancelledFlag = true;
              forEach(animations, function (animation) {
                if (!animation.beforeComplete) {
                  (animation.beforeEnd || noop)(isCancelledFlag);
                }
                if (!animation.afterComplete) {
                  (animation.afterEnd || noop)(isCancelledFlag);
                }
              });
            }
            function cleanup(element) {
              if (isMatchingElement(element, $rootElement)) {
                if (!rootAnimateState.disabled) {
                  rootAnimateState.running = false;
                  rootAnimateState.structural = false;
                }
              } else {
                element.removeClass(NG_ANIMATE_CLASS_NAME);
                element.removeData(NG_ANIMATE_STATE);
              }
            }
            function animationsDisabled(element, parentElement) {
              if (rootAnimateState.disabled)
                return true;
              if (isMatchingElement(element, $rootElement)) {
                return rootAnimateState.disabled || rootAnimateState.running;
              }
              do {
                if (parentElement.length === 0)
                  break;
                var isRoot = isMatchingElement(parentElement, $rootElement);
                var state = isRoot ? rootAnimateState : parentElement.data(NG_ANIMATE_STATE);
                var result = state && (!!state.disabled || !!state.running);
                if (isRoot || result) {
                  return result;
                }
                if (isRoot)
                  return true;
              } while (parentElement = parentElement.parent());
              return true;
            }
          }
        ]);
        $animateProvider.register('', [
          '$window',
          '$sniffer',
          '$timeout',
          '$$animateReflow',
          function ($window, $sniffer, $timeout, $$animateReflow) {
            var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;
            if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
              CSS_PREFIX = '-webkit-';
              TRANSITION_PROP = 'WebkitTransition';
              TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
            } else {
              TRANSITION_PROP = 'transition';
              TRANSITIONEND_EVENT = 'transitionend';
            }
            if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
              CSS_PREFIX = '-webkit-';
              ANIMATION_PROP = 'WebkitAnimation';
              ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
            } else {
              ANIMATION_PROP = 'animation';
              ANIMATIONEND_EVENT = 'animationend';
            }
            var DURATION_KEY = 'Duration';
            var PROPERTY_KEY = 'Property';
            var DELAY_KEY = 'Delay';
            var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
            var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
            var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
            var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
            var CLOSING_TIME_BUFFER = 1.5;
            var ONE_SECOND = 1000;
            var animationCounter = 0;
            var lookupCache = {};
            var parentCounter = 0;
            var animationReflowQueue = [];
            var animationElementQueue = [];
            var cancelAnimationReflow;
            var closingAnimationTime = 0;
            var timeOut = false;
            function afterReflow(element, callback) {
              if (cancelAnimationReflow) {
                cancelAnimationReflow();
              }
              animationReflowQueue.push(callback);
              var node = extractElementNode(element);
              element = angular.element(node);
              animationElementQueue.push(element);
              var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
              var stagger = elementData.stagger;
              var staggerTime = elementData.itemIndex * (Math.max(stagger.animationDelay, stagger.transitionDelay) || 0);
              var animationTime = (elementData.maxDelay + elementData.maxDuration) * CLOSING_TIME_BUFFER;
              closingAnimationTime = Math.max(closingAnimationTime, (staggerTime + animationTime) * ONE_SECOND);
              elementData.animationCount = animationCounter;
              cancelAnimationReflow = $$animateReflow(function () {
                forEach(animationReflowQueue, function (fn) {
                  fn();
                });
                var elementQueueSnapshot = [];
                var animationCounterSnapshot = animationCounter;
                forEach(animationElementQueue, function (elm) {
                  elementQueueSnapshot.push(elm);
                });
                $timeout(function () {
                  closeAllAnimations(elementQueueSnapshot, animationCounterSnapshot);
                  elementQueueSnapshot = null;
                }, closingAnimationTime, false);
                animationReflowQueue = [];
                animationElementQueue = [];
                cancelAnimationReflow = null;
                lookupCache = {};
                closingAnimationTime = 0;
                animationCounter++;
              });
            }
            function closeAllAnimations(elements, count) {
              forEach(elements, function (element) {
                var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
                if (elementData && elementData.animationCount == count) {
                  (elementData.closeAnimationFn || noop)();
                }
              });
            }
            function getElementAnimationDetails(element, cacheKey) {
              var data = cacheKey ? lookupCache[cacheKey] : null;
              if (!data) {
                var transitionDuration = 0;
                var transitionDelay = 0;
                var animationDuration = 0;
                var animationDelay = 0;
                var transitionDelayStyle;
                var animationDelayStyle;
                var transitionDurationStyle;
                var transitionPropertyStyle;
                forEach(element, function (element) {
                  if (element.nodeType == ELEMENT_NODE) {
                    var elementStyles = $window.getComputedStyle(element) || {};
                    transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];
                    transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);
                    transitionPropertyStyle = elementStyles[TRANSITION_PROP + PROPERTY_KEY];
                    transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];
                    transitionDelay = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);
                    animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];
                    animationDelay = Math.max(parseMaxTime(animationDelayStyle), animationDelay);
                    var aDuration = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);
                    if (aDuration > 0) {
                      aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
                    }
                    animationDuration = Math.max(aDuration, animationDuration);
                  }
                });
                data = {
                  total: 0,
                  transitionPropertyStyle: transitionPropertyStyle,
                  transitionDurationStyle: transitionDurationStyle,
                  transitionDelayStyle: transitionDelayStyle,
                  transitionDelay: transitionDelay,
                  transitionDuration: transitionDuration,
                  animationDelayStyle: animationDelayStyle,
                  animationDelay: animationDelay,
                  animationDuration: animationDuration
                };
                if (cacheKey) {
                  lookupCache[cacheKey] = data;
                }
              }
              return data;
            }
            function parseMaxTime(str) {
              var maxValue = 0;
              var values = angular.isString(str) ? str.split(/\s*,\s*/) : [];
              forEach(values, function (value) {
                maxValue = Math.max(parseFloat(value) || 0, maxValue);
              });
              return maxValue;
            }
            function getCacheKey(element) {
              var parentElement = element.parent();
              var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
              if (!parentID) {
                parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
                parentID = parentCounter;
              }
              return parentID + '-' + extractElementNode(element).className;
            }
            function animateSetup(element, className, calculationDecorator) {
              var cacheKey = getCacheKey(element);
              var eventCacheKey = cacheKey + ' ' + className;
              var stagger = {};
              var itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;
              if (itemIndex > 0) {
                var staggerClassName = className + '-stagger';
                var staggerCacheKey = cacheKey + ' ' + staggerClassName;
                var applyClasses = !lookupCache[staggerCacheKey];
                applyClasses && element.addClass(staggerClassName);
                stagger = getElementAnimationDetails(element, staggerCacheKey);
                applyClasses && element.removeClass(staggerClassName);
              }
              calculationDecorator = calculationDecorator || function (fn) {
                return fn();
              };
              element.addClass(className);
              var timings = calculationDecorator(function () {
                  return getElementAnimationDetails(element, eventCacheKey);
                });
              var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay);
              var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
              if (maxDuration === 0) {
                element.removeClass(className);
                return false;
              }
              var activeClassName = '';
              timings.transitionDuration > 0 ? blockTransitions(element) : blockKeyframeAnimations(element);
              forEach(className.split(' '), function (klass, i) {
                activeClassName += (i > 0 ? ' ' : '') + klass + '-active';
              });
              element.data(NG_ANIMATE_CSS_DATA_KEY, {
                className: className,
                activeClassName: activeClassName,
                maxDuration: maxDuration,
                maxDelay: maxDelay,
                classes: className + ' ' + activeClassName,
                timings: timings,
                stagger: stagger,
                itemIndex: itemIndex
              });
              return true;
            }
            function blockTransitions(element) {
              extractElementNode(element).style[TRANSITION_PROP + PROPERTY_KEY] = 'none';
            }
            function blockKeyframeAnimations(element) {
              extractElementNode(element).style[ANIMATION_PROP] = 'none 0s';
            }
            function unblockTransitions(element) {
              var prop = TRANSITION_PROP + PROPERTY_KEY;
              var node = extractElementNode(element);
              if (node.style[prop] && node.style[prop].length > 0) {
                node.style[prop] = '';
              }
            }
            function unblockKeyframeAnimations(element) {
              var prop = ANIMATION_PROP;
              var node = extractElementNode(element);
              if (node.style[prop] && node.style[prop].length > 0) {
                node.style[prop] = '';
              }
            }
            function animateRun(element, className, activeAnimationComplete) {
              var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
              var node = extractElementNode(element);
              if (node.className.indexOf(className) == -1 || !elementData) {
                activeAnimationComplete();
                return;
              }
              var timings = elementData.timings;
              var stagger = elementData.stagger;
              var maxDuration = elementData.maxDuration;
              var activeClassName = elementData.activeClassName;
              var maxDelayTime = Math.max(timings.transitionDelay, timings.animationDelay) * ONE_SECOND;
              var startTime = Date.now();
              var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;
              var itemIndex = elementData.itemIndex;
              var style = '', appliedStyles = [];
              if (timings.transitionDuration > 0) {
                var propertyStyle = timings.transitionPropertyStyle;
                if (propertyStyle.indexOf('all') == -1) {
                  style += CSS_PREFIX + 'transition-property: ' + propertyStyle + ';';
                  style += CSS_PREFIX + 'transition-duration: ' + timings.transitionDurationStyle + ';';
                  appliedStyles.push(CSS_PREFIX + 'transition-property');
                  appliedStyles.push(CSS_PREFIX + 'transition-duration');
                }
              }
              if (itemIndex > 0) {
                if (stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
                  var delayStyle = timings.transitionDelayStyle;
                  style += CSS_PREFIX + 'transition-delay: ' + prepareStaggerDelay(delayStyle, stagger.transitionDelay, itemIndex) + '; ';
                  appliedStyles.push(CSS_PREFIX + 'transition-delay');
                }
                if (stagger.animationDelay > 0 && stagger.animationDuration === 0) {
                  style += CSS_PREFIX + 'animation-delay: ' + prepareStaggerDelay(timings.animationDelayStyle, stagger.animationDelay, itemIndex) + '; ';
                  appliedStyles.push(CSS_PREFIX + 'animation-delay');
                }
              }
              if (appliedStyles.length > 0) {
                var oldStyle = node.getAttribute('style') || '';
                node.setAttribute('style', oldStyle + ' ' + style);
              }
              element.on(css3AnimationEvents, onAnimationProgress);
              element.addClass(activeClassName);
              elementData.closeAnimationFn = function () {
                onEnd();
                activeAnimationComplete();
              };
              return onEnd;
              function onEnd(cancelled) {
                element.off(css3AnimationEvents, onAnimationProgress);
                element.removeClass(activeClassName);
                animateClose(element, className);
                var node = extractElementNode(element);
                for (var i in appliedStyles) {
                  node.style.removeProperty(appliedStyles[i]);
                }
              }
              function onAnimationProgress(event) {
                event.stopPropagation();
                var ev = event.originalEvent || event;
                var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();
                var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));
                if (Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
                  activeAnimationComplete();
                }
              }
            }
            function prepareStaggerDelay(delayStyle, staggerDelay, index) {
              var style = '';
              forEach(delayStyle.split(','), function (val, i) {
                style += (i > 0 ? ',' : '') + (index * staggerDelay + parseInt(val, 10)) + 's';
              });
              return style;
            }
            function animateBefore(element, className, calculationDecorator) {
              if (animateSetup(element, className, calculationDecorator)) {
                return function (cancelled) {
                  cancelled && animateClose(element, className);
                };
              }
            }
            function animateAfter(element, className, afterAnimationComplete) {
              if (element.data(NG_ANIMATE_CSS_DATA_KEY)) {
                return animateRun(element, className, afterAnimationComplete);
              } else {
                animateClose(element, className);
                afterAnimationComplete();
              }
            }
            function animate(element, className, animationComplete) {
              var preReflowCancellation = animateBefore(element, className);
              if (!preReflowCancellation) {
                animationComplete();
                return;
              }
              var cancel = preReflowCancellation;
              afterReflow(element, function () {
                unblockTransitions(element);
                unblockKeyframeAnimations(element);
                cancel = animateAfter(element, className, animationComplete);
              });
              return function (cancelled) {
                (cancel || noop)(cancelled);
              };
            }
            function animateClose(element, className) {
              element.removeClass(className);
              element.removeData(NG_ANIMATE_CSS_DATA_KEY);
            }
            return {
              allowCancel: function (element, animationEvent, className) {
                var oldClasses = (element.data(NG_ANIMATE_CSS_DATA_KEY) || {}).classes;
                if (!oldClasses || [
                    'enter',
                    'leave',
                    'move'
                  ].indexOf(animationEvent) >= 0) {
                  return true;
                }
                var parentElement = element.parent();
                var clone = angular.element(extractElementNode(element).cloneNode());
                clone.attr('style', 'position:absolute; top:-9999px; left:-9999px');
                clone.removeAttr('id');
                clone.empty();
                forEach(oldClasses.split(' '), function (klass) {
                  clone.removeClass(klass);
                });
                var suffix = animationEvent == 'addClass' ? '-add' : '-remove';
                clone.addClass(suffixClasses(className, suffix));
                parentElement.append(clone);
                var timings = getElementAnimationDetails(clone);
                clone.remove();
                return Math.max(timings.transitionDuration, timings.animationDuration) > 0;
              },
              enter: function (element, animationCompleted) {
                return animate(element, 'ng-enter', animationCompleted);
              },
              leave: function (element, animationCompleted) {
                return animate(element, 'ng-leave', animationCompleted);
              },
              move: function (element, animationCompleted) {
                return animate(element, 'ng-move', animationCompleted);
              },
              beforeAddClass: function (element, className, animationCompleted) {
                var cancellationMethod = animateBefore(element, suffixClasses(className, '-add'), function (fn) {
                    element.addClass(className);
                    var timings = fn();
                    element.removeClass(className);
                    return timings;
                  });
                if (cancellationMethod) {
                  afterReflow(element, function () {
                    unblockTransitions(element);
                    unblockKeyframeAnimations(element);
                    animationCompleted();
                  });
                  return cancellationMethod;
                }
                animationCompleted();
              },
              addClass: function (element, className, animationCompleted) {
                return animateAfter(element, suffixClasses(className, '-add'), animationCompleted);
              },
              beforeRemoveClass: function (element, className, animationCompleted) {
                var cancellationMethod = animateBefore(element, suffixClasses(className, '-remove'), function (fn) {
                    var klass = element.attr('class');
                    element.removeClass(className);
                    var timings = fn();
                    element.attr('class', klass);
                    return timings;
                  });
                if (cancellationMethod) {
                  afterReflow(element, function () {
                    unblockTransitions(element);
                    unblockKeyframeAnimations(element);
                    animationCompleted();
                  });
                  return cancellationMethod;
                }
                animationCompleted();
              },
              removeClass: function (element, className, animationCompleted) {
                return animateAfter(element, suffixClasses(className, '-remove'), animationCompleted);
              }
            };
            function suffixClasses(classes, suffix) {
              var className = '';
              classes = angular.isArray(classes) ? classes : classes.split(/\s+/);
              forEach(classes, function (klass, i) {
                if (klass && klass.length > 0) {
                  className += (i > 0 ? ' ' : '') + klass + suffix;
                }
              });
              return className;
            }
          }
        ]);
      }
    ]);
  }(window, window.angular));
  define('angular-animate', ['angular'], function () {
  });
  (function (window, angular, undefined) {
    'use strict';
    var $sanitizeMinErr = angular.$$minErr('$sanitize');
    function $SanitizeProvider() {
      this.$get = [
        '$$sanitizeUri',
        function ($$sanitizeUri) {
          return function (html) {
            var buf = [];
            htmlParser(html, htmlSanitizeWriter(buf, function (uri, isImage) {
              return !/^unsafe/.test($$sanitizeUri(uri, isImage));
            }));
            return buf.join('');
          };
        }
      ];
    }
    function sanitizeText(chars) {
      var buf = [];
      var writer = htmlSanitizeWriter(buf, angular.noop);
      writer.chars(chars);
      return buf.join('');
    }
    var START_TAG_REGEXP = /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/, END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/, ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g, BEGIN_TAG_REGEXP = /^</, BEGING_END_TAGE_REGEXP = /^<\s*\//, COMMENT_REGEXP = /<!--(.*?)-->/g, DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i, CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g, NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;
    var voidElements = makeMap('area,br,col,hr,img,wbr');
    var optionalEndTagBlockElements = makeMap('colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr'), optionalEndTagInlineElements = makeMap('rp,rt'), optionalEndTagElements = angular.extend({}, optionalEndTagInlineElements, optionalEndTagBlockElements);
    var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap('address,article,' + 'aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,' + 'h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul'));
    var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap('a,abbr,acronym,b,' + 'bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,' + 'samp,small,span,strike,strong,sub,sup,time,tt,u,var'));
    var specialElements = makeMap('script,style');
    var validElements = angular.extend({}, voidElements, blockElements, inlineElements, optionalEndTagElements);
    var uriAttrs = makeMap('background,cite,href,longdesc,src,usemap');
    var validAttrs = angular.extend({}, uriAttrs, makeMap('abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,' + 'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,' + 'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,' + 'scope,scrolling,shape,size,span,start,summary,target,title,type,' + 'valign,value,vspace,width'));
    function makeMap(str) {
      var obj = {}, items = str.split(','), i;
      for (i = 0; i < items.length; i++)
        obj[items[i]] = true;
      return obj;
    }
    function htmlParser(html, handler) {
      var index, chars, match, stack = [], last = html;
      stack.last = function () {
        return stack[stack.length - 1];
      };
      while (html) {
        chars = true;
        if (!stack.last() || !specialElements[stack.last()]) {
          if (html.indexOf('<!--') === 0) {
            index = html.indexOf('--', 4);
            if (index >= 0 && html.lastIndexOf('-->', index) === index) {
              if (handler.comment)
                handler.comment(html.substring(4, index));
              html = html.substring(index + 3);
              chars = false;
            }
          } else if (DOCTYPE_REGEXP.test(html)) {
            match = html.match(DOCTYPE_REGEXP);
            if (match) {
              html = html.replace(match[0], '');
              chars = false;
            }
          } else if (BEGING_END_TAGE_REGEXP.test(html)) {
            match = html.match(END_TAG_REGEXP);
            if (match) {
              html = html.substring(match[0].length);
              match[0].replace(END_TAG_REGEXP, parseEndTag);
              chars = false;
            }
          } else if (BEGIN_TAG_REGEXP.test(html)) {
            match = html.match(START_TAG_REGEXP);
            if (match) {
              html = html.substring(match[0].length);
              match[0].replace(START_TAG_REGEXP, parseStartTag);
              chars = false;
            }
          }
          if (chars) {
            index = html.indexOf('<');
            var text = index < 0 ? html : html.substring(0, index);
            html = index < 0 ? '' : html.substring(index);
            if (handler.chars)
              handler.chars(decodeEntities(text));
          }
        } else {
          html = html.replace(new RegExp('(.*)<\\s*\\/\\s*' + stack.last() + '[^>]*>', 'i'), function (all, text) {
            text = text.replace(COMMENT_REGEXP, '$1').replace(CDATA_REGEXP, '$1');
            if (handler.chars)
              handler.chars(decodeEntities(text));
            return '';
          });
          parseEndTag('', stack.last());
        }
        if (html == last) {
          throw $sanitizeMinErr('badparse', 'The sanitizer was unable to parse the following block ' + 'of html: {0}', html);
        }
        last = html;
      }
      parseEndTag();
      function parseStartTag(tag, tagName, rest, unary) {
        tagName = angular.lowercase(tagName);
        if (blockElements[tagName]) {
          while (stack.last() && inlineElements[stack.last()]) {
            parseEndTag('', stack.last());
          }
        }
        if (optionalEndTagElements[tagName] && stack.last() == tagName) {
          parseEndTag('', tagName);
        }
        unary = voidElements[tagName] || !!unary;
        if (!unary)
          stack.push(tagName);
        var attrs = {};
        rest.replace(ATTR_REGEXP, function (match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
          var value = doubleQuotedValue || singleQuotedValue || unquotedValue || '';
          attrs[name] = decodeEntities(value);
        });
        if (handler.start)
          handler.start(tagName, attrs, unary);
      }
      function parseEndTag(tag, tagName) {
        var pos = 0, i;
        tagName = angular.lowercase(tagName);
        if (tagName)
          for (pos = stack.length - 1; pos >= 0; pos--)
            if (stack[pos] == tagName)
              break;
        if (pos >= 0) {
          for (i = stack.length - 1; i >= pos; i--)
            if (handler.end)
              handler.end(stack[i]);
          stack.length = pos;
        }
      }
    }
    var hiddenPre = document.createElement('pre');
    var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
    function decodeEntities(value) {
      if (!value) {
        return '';
      }
      var parts = spaceRe.exec(value);
      var spaceBefore = parts[1];
      var spaceAfter = parts[3];
      var content = parts[2];
      if (content) {
        hiddenPre.innerHTML = content.replace(/</g, '&lt;');
        content = 'textContent' in hiddenPre ? hiddenPre.textContent : hiddenPre.innerText;
      }
      return spaceBefore + content + spaceAfter;
    }
    function encodeEntities(value) {
      return value.replace(/&/g, '&amp;').replace(NON_ALPHANUMERIC_REGEXP, function (value) {
        return '&#' + value.charCodeAt(0) + ';';
      }).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function htmlSanitizeWriter(buf, uriValidator) {
      var ignore = false;
      var out = angular.bind(buf, buf.push);
      return {
        start: function (tag, attrs, unary) {
          tag = angular.lowercase(tag);
          if (!ignore && specialElements[tag]) {
            ignore = tag;
          }
          if (!ignore && validElements[tag] === true) {
            out('<');
            out(tag);
            angular.forEach(attrs, function (value, key) {
              var lkey = angular.lowercase(key);
              var isImage = tag === 'img' && lkey === 'src' || lkey === 'background';
              if (validAttrs[lkey] === true && (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
                out(' ');
                out(key);
                out('="');
                out(encodeEntities(value));
                out('"');
              }
            });
            out(unary ? '/>' : '>');
          }
        },
        end: function (tag) {
          tag = angular.lowercase(tag);
          if (!ignore && validElements[tag] === true) {
            out('</');
            out(tag);
            out('>');
          }
          if (tag == ignore) {
            ignore = false;
          }
        },
        chars: function (chars) {
          if (!ignore) {
            out(encodeEntities(chars));
          }
        }
      };
    }
    angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);
    angular.module('ngSanitize').filter('linky', [
      '$sanitize',
      function ($sanitize) {
        var LINKY_URL_REGEXP = /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/, MAILTO_REGEXP = /^mailto:/;
        return function (text, target) {
          if (!text)
            return text;
          var match;
          var raw = text;
          var html = [];
          var url;
          var i;
          while (match = raw.match(LINKY_URL_REGEXP)) {
            url = match[0];
            if (match[2] == match[3])
              url = 'mailto:' + url;
            i = match.index;
            addText(raw.substr(0, i));
            addLink(url, match[0].replace(MAILTO_REGEXP, ''));
            raw = raw.substring(i + match[0].length);
          }
          addText(raw);
          return $sanitize(html.join(''));
          function addText(text) {
            if (!text) {
              return;
            }
            html.push(sanitizeText(text));
          }
          function addLink(url, text) {
            html.push('<a ');
            if (angular.isDefined(target)) {
              html.push('target="');
              html.push(target);
              html.push('" ');
            }
            html.push('href="');
            html.push(url);
            html.push('">');
            addText(text);
            html.push('</a>');
          }
        };
      }
    ]);
  }(window, window.angular));
  define('angular-sanitize', ['angular'], function () {
  });
  if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
    module.exports = 'ui.router';
  }
  (function (window, angular, undefined) {
    'use strict';
    var isDefined = angular.isDefined, isFunction = angular.isFunction, isString = angular.isString, isObject = angular.isObject, isArray = angular.isArray, forEach = angular.forEach, extend = angular.extend, copy = angular.copy;
    function inherit(parent, extra) {
      return extend(new (extend(function () {
      }, { prototype: parent }))(), extra);
    }
    function merge(dst) {
      forEach(arguments, function (obj) {
        if (obj !== dst) {
          forEach(obj, function (value, key) {
            if (!dst.hasOwnProperty(key))
              dst[key] = value;
          });
        }
      });
      return dst;
    }
    function ancestors(first, second) {
      var path = [];
      for (var n in first.path) {
        if (first.path[n] === '')
          continue;
        if (!second.path[n])
          break;
        path.push(first.path[n]);
      }
      return path;
    }
    function keys(object) {
      if (Object.keys) {
        return Object.keys(object);
      }
      var result = [];
      angular.forEach(object, function (val, key) {
        result.push(key);
      });
      return result;
    }
    function arraySearch(array, value) {
      if (Array.prototype.indexOf) {
        return array.indexOf(value, Number(arguments[2]) || 0);
      }
      var len = array.length >>> 0, from = Number(arguments[2]) || 0;
      from = from < 0 ? Math.ceil(from) : Math.floor(from);
      if (from < 0)
        from += len;
      for (; from < len; from++) {
        if (from in array && array[from] === value)
          return from;
      }
      return -1;
    }
    function inheritParams(currentParams, newParams, $current, $to) {
      var parents = ancestors($current, $to), parentParams, inherited = {}, inheritList = [];
      for (var i in parents) {
        if (!parents[i].params || !parents[i].params.length)
          continue;
        parentParams = parents[i].params;
        for (var j in parentParams) {
          if (arraySearch(inheritList, parentParams[j]) >= 0)
            continue;
          inheritList.push(parentParams[j]);
          inherited[parentParams[j]] = currentParams[parentParams[j]];
        }
      }
      return extend({}, inherited, newParams);
    }
    function normalize(keys, values) {
      var normalized = {};
      forEach(keys, function (name) {
        var value = values[name];
        normalized[name] = value != null ? String(value) : null;
      });
      return normalized;
    }
    function equalForKeys(a, b, keys) {
      if (!keys) {
        keys = [];
        for (var n in a)
          keys.push(n);
      }
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (a[k] != b[k])
          return false;
      }
      return true;
    }
    function filterByKeys(keys, values) {
      var filtered = {};
      forEach(keys, function (name) {
        filtered[name] = values[name];
      });
      return filtered;
    }
    angular.module('ui.router.util', ['ng']);
    angular.module('ui.router.router', ['ui.router.util']);
    angular.module('ui.router.state', [
      'ui.router.router',
      'ui.router.util'
    ]);
    angular.module('ui.router', ['ui.router.state']);
    angular.module('ui.router.compat', ['ui.router']);
    $Resolve.$inject = [
      '$q',
      '$injector'
    ];
    function $Resolve($q, $injector) {
      var VISIT_IN_PROGRESS = 1, VISIT_DONE = 2, NOTHING = {}, NO_DEPENDENCIES = [], NO_LOCALS = NOTHING, NO_PARENT = extend($q.when(NOTHING), {
          $$promises: NOTHING,
          $$values: NOTHING
        });
      this.study = function (invocables) {
        if (!isObject(invocables))
          throw new Error('\'invocables\' must be an object');
        var plan = [], cycle = [], visited = {};
        function visit(value, key) {
          if (visited[key] === VISIT_DONE)
            return;
          cycle.push(key);
          if (visited[key] === VISIT_IN_PROGRESS) {
            cycle.splice(0, cycle.indexOf(key));
            throw new Error('Cyclic dependency: ' + cycle.join(' -> '));
          }
          visited[key] = VISIT_IN_PROGRESS;
          if (isString(value)) {
            plan.push(key, [function () {
                return $injector.get(value);
              }], NO_DEPENDENCIES);
          } else {
            var params = $injector.annotate(value);
            forEach(params, function (param) {
              if (param !== key && invocables.hasOwnProperty(param))
                visit(invocables[param], param);
            });
            plan.push(key, value, params);
          }
          cycle.pop();
          visited[key] = VISIT_DONE;
        }
        forEach(invocables, visit);
        invocables = cycle = visited = null;
        function isResolve(value) {
          return isObject(value) && value.then && value.$$promises;
        }
        return function (locals, parent, self) {
          if (isResolve(locals) && self === undefined) {
            self = parent;
            parent = locals;
            locals = null;
          }
          if (!locals)
            locals = NO_LOCALS;
          else if (!isObject(locals)) {
            throw new Error('\'locals\' must be an object');
          }
          if (!parent)
            parent = NO_PARENT;
          else if (!isResolve(parent)) {
            throw new Error('\'parent\' must be a promise returned by $resolve.resolve()');
          }
          var resolution = $q.defer(), result = resolution.promise, promises = result.$$promises = {}, values = extend({}, locals), wait = 1 + plan.length / 3, merged = false;
          function done() {
            if (!--wait) {
              if (!merged)
                merge(values, parent.$$values);
              result.$$values = values;
              result.$$promises = true;
              resolution.resolve(values);
            }
          }
          function fail(reason) {
            result.$$failure = reason;
            resolution.reject(reason);
          }
          if (isDefined(parent.$$failure)) {
            fail(parent.$$failure);
            return result;
          }
          if (parent.$$values) {
            merged = merge(values, parent.$$values);
            done();
          } else {
            extend(promises, parent.$$promises);
            parent.then(done, fail);
          }
          for (var i = 0, ii = plan.length; i < ii; i += 3) {
            if (locals.hasOwnProperty(plan[i]))
              done();
            else
              invoke(plan[i], plan[i + 1], plan[i + 2]);
          }
          function invoke(key, invocable, params) {
            var invocation = $q.defer(), waitParams = 0;
            function onfailure(reason) {
              invocation.reject(reason);
              fail(reason);
            }
            forEach(params, function (dep) {
              if (promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep)) {
                waitParams++;
                promises[dep].then(function (result) {
                  values[dep] = result;
                  if (!--waitParams)
                    proceed();
                }, onfailure);
              }
            });
            if (!waitParams)
              proceed();
            function proceed() {
              if (isDefined(result.$$failure))
                return;
              try {
                invocation.resolve($injector.invoke(invocable, self, values));
                invocation.promise.then(function (result) {
                  values[key] = result;
                  done();
                }, onfailure);
              } catch (e) {
                onfailure(e);
              }
            }
            promises[key] = invocation.promise;
          }
          return result;
        };
      };
      this.resolve = function (invocables, locals, parent, self) {
        return this.study(invocables)(locals, parent, self);
      };
    }
    angular.module('ui.router.util').service('$resolve', $Resolve);
    $TemplateFactory.$inject = [
      '$http',
      '$templateCache',
      '$injector'
    ];
    function $TemplateFactory($http, $templateCache, $injector) {
      this.fromConfig = function (config, params, locals) {
        return isDefined(config.template) ? this.fromString(config.template, params) : isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) : isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) : null;
      };
      this.fromString = function (template, params) {
        return isFunction(template) ? template(params) : template;
      };
      this.fromUrl = function (url, params) {
        if (isFunction(url))
          url = url(params);
        if (url == null)
          return null;
        else
          return $http.get(url, { cache: $templateCache }).then(function (response) {
            return response.data;
          });
      };
      this.fromProvider = function (provider, params, locals) {
        return $injector.invoke(provider, null, locals || { params: params });
      };
    }
    angular.module('ui.router.util').service('$templateFactory', $TemplateFactory);
    function UrlMatcher(pattern) {
      var placeholder = /([:*])(\w+)|\{(\w+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g, names = {}, compiled = '^', last = 0, m, segments = this.segments = [], params = this.params = [];
      function addParameter(id) {
        if (!/^\w+(-+\w+)*$/.test(id))
          throw new Error('Invalid parameter name \'' + id + '\' in pattern \'' + pattern + '\'');
        if (names[id])
          throw new Error('Duplicate parameter name \'' + id + '\' in pattern \'' + pattern + '\'');
        names[id] = true;
        params.push(id);
      }
      function quoteRegExp(string) {
        return string.replace(/[\\\[\]\^$*+?.()|{}]/g, '\\$&');
      }
      this.source = pattern;
      var id, regexp, segment;
      while (m = placeholder.exec(pattern)) {
        id = m[2] || m[3];
        regexp = m[4] || (m[1] == '*' ? '.*' : '[^/]*');
        segment = pattern.substring(last, m.index);
        if (segment.indexOf('?') >= 0)
          break;
        compiled += quoteRegExp(segment) + '(' + regexp + ')';
        addParameter(id);
        segments.push(segment);
        last = placeholder.lastIndex;
      }
      segment = pattern.substring(last);
      var i = segment.indexOf('?');
      if (i >= 0) {
        var search = this.sourceSearch = segment.substring(i);
        segment = segment.substring(0, i);
        this.sourcePath = pattern.substring(0, last + i);
        forEach(search.substring(1).split(/[&?]/), addParameter);
      } else {
        this.sourcePath = pattern;
        this.sourceSearch = '';
      }
      compiled += quoteRegExp(segment) + '$';
      segments.push(segment);
      this.regexp = new RegExp(compiled);
      this.prefix = segments[0];
    }
    UrlMatcher.prototype.concat = function (pattern) {
      return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch);
    };
    UrlMatcher.prototype.toString = function () {
      return this.source;
    };
    UrlMatcher.prototype.exec = function (path, searchParams) {
      var m = this.regexp.exec(path);
      if (!m)
        return null;
      var params = this.params, nTotal = params.length, nPath = this.segments.length - 1, values = {}, i;
      if (nPath !== m.length - 1)
        throw new Error('Unbalanced capture group in route \'' + this.source + '\'');
      for (i = 0; i < nPath; i++)
        values[params[i]] = m[i + 1];
      for (; i < nTotal; i++)
        values[params[i]] = searchParams[params[i]];
      return values;
    };
    UrlMatcher.prototype.parameters = function () {
      return this.params;
    };
    UrlMatcher.prototype.format = function (values) {
      var segments = this.segments, params = this.params;
      if (!values)
        return segments.join('');
      var nPath = segments.length - 1, nTotal = params.length, result = segments[0], i, search, value;
      for (i = 0; i < nPath; i++) {
        value = values[params[i]];
        if (value != null)
          result += encodeURIComponent(value);
        result += segments[i + 1];
      }
      for (; i < nTotal; i++) {
        value = values[params[i]];
        if (value != null) {
          result += (search ? '&' : '?') + params[i] + '=' + encodeURIComponent(value);
          search = true;
        }
      }
      return result;
    };
    function $UrlMatcherFactory() {
      this.compile = function (pattern) {
        return new UrlMatcher(pattern);
      };
      this.isMatcher = function (o) {
        return isObject(o) && isFunction(o.exec) && isFunction(o.format) && isFunction(o.concat);
      };
      this.$get = function () {
        return this;
      };
    }
    angular.module('ui.router.util').provider('$urlMatcherFactory', $UrlMatcherFactory);
    $UrlRouterProvider.$inject = ['$urlMatcherFactoryProvider'];
    function $UrlRouterProvider($urlMatcherFactory) {
      var rules = [], otherwise = null;
      function regExpPrefix(re) {
        var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(re.source);
        return prefix != null ? prefix[1].replace(/\\(.)/g, '$1') : '';
      }
      function interpolate(pattern, match) {
        return pattern.replace(/\$(\$|\d{1,2})/, function (m, what) {
          return match[what === '$' ? 0 : Number(what)];
        });
      }
      this.rule = function (rule) {
        if (!isFunction(rule))
          throw new Error('\'rule\' must be a function');
        rules.push(rule);
        return this;
      };
      this.otherwise = function (rule) {
        if (isString(rule)) {
          var redirect = rule;
          rule = function () {
            return redirect;
          };
        } else if (!isFunction(rule))
          throw new Error('\'rule\' must be a function');
        otherwise = rule;
        return this;
      };
      function handleIfMatch($injector, handler, match) {
        if (!match)
          return false;
        var result = $injector.invoke(handler, handler, { $match: match });
        return isDefined(result) ? result : true;
      }
      this.when = function (what, handler) {
        var redirect, handlerIsString = isString(handler);
        if (isString(what))
          what = $urlMatcherFactory.compile(what);
        if (!handlerIsString && !isFunction(handler) && !isArray(handler))
          throw new Error('invalid \'handler\' in when()');
        var strategies = {
            matcher: function (what, handler) {
              if (handlerIsString) {
                redirect = $urlMatcherFactory.compile(handler);
                handler = [
                  '$match',
                  function ($match) {
                    return redirect.format($match);
                  }
                ];
              }
              return extend(function ($injector, $location) {
                return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()));
              }, { prefix: isString(what.prefix) ? what.prefix : '' });
            },
            regex: function (what, handler) {
              if (what.global || what.sticky)
                throw new Error('when() RegExp must not be global or sticky');
              if (handlerIsString) {
                redirect = handler;
                handler = [
                  '$match',
                  function ($match) {
                    return interpolate(redirect, $match);
                  }
                ];
              }
              return extend(function ($injector, $location) {
                return handleIfMatch($injector, handler, what.exec($location.path()));
              }, { prefix: regExpPrefix(what) });
            }
          };
        var check = {
            matcher: $urlMatcherFactory.isMatcher(what),
            regex: what instanceof RegExp
          };
        for (var n in check) {
          if (check[n]) {
            return this.rule(strategies[n](what, handler));
          }
        }
        throw new Error('invalid \'what\' in when()');
      };
      this.$get = [
        '$location',
        '$rootScope',
        '$injector',
        function ($location, $rootScope, $injector) {
          function update(evt) {
            if (evt && evt.defaultPrevented)
              return;
            function check(rule) {
              var handled = rule($injector, $location);
              if (handled) {
                if (isString(handled))
                  $location.replace().url(handled);
                return true;
              }
              return false;
            }
            var n = rules.length, i;
            for (i = 0; i < n; i++) {
              if (check(rules[i]))
                return;
            }
            if (otherwise)
              check(otherwise);
          }
          $rootScope.$on('$locationChangeSuccess', update);
          return {
            sync: function () {
              update();
            }
          };
        }
      ];
    }
    angular.module('ui.router.router').provider('$urlRouter', $UrlRouterProvider);
    $StateProvider.$inject = [
      '$urlRouterProvider',
      '$urlMatcherFactoryProvider',
      '$locationProvider'
    ];
    function $StateProvider($urlRouterProvider, $urlMatcherFactory, $locationProvider) {
      var root, states = {}, $state, queue = {}, abstractKey = 'abstract';
      var stateBuilder = {
          parent: function (state) {
            if (isDefined(state.parent) && state.parent)
              return findState(state.parent);
            var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
            return compositeName ? findState(compositeName[1]) : root;
          },
          data: function (state) {
            if (state.parent && state.parent.data) {
              state.data = state.self.data = extend({}, state.parent.data, state.data);
            }
            return state.data;
          },
          url: function (state) {
            var url = state.url;
            if (isString(url)) {
              if (url.charAt(0) == '^') {
                return $urlMatcherFactory.compile(url.substring(1));
              }
              return (state.parent.navigable || root).url.concat(url);
            }
            if ($urlMatcherFactory.isMatcher(url) || url == null) {
              return url;
            }
            throw new Error('Invalid url \'' + url + '\' in state \'' + state + '\'');
          },
          navigable: function (state) {
            return state.url ? state : state.parent ? state.parent.navigable : null;
          },
          params: function (state) {
            if (!state.params) {
              return state.url ? state.url.parameters() : state.parent.params;
            }
            if (!isArray(state.params))
              throw new Error('Invalid params in state \'' + state + '\'');
            if (state.url)
              throw new Error('Both params and url specicified in state \'' + state + '\'');
            return state.params;
          },
          views: function (state) {
            var views = {};
            forEach(isDefined(state.views) ? state.views : { '': state }, function (view, name) {
              if (name.indexOf('@') < 0)
                name += '@' + state.parent.name;
              views[name] = view;
            });
            return views;
          },
          ownParams: function (state) {
            if (!state.parent) {
              return state.params;
            }
            var paramNames = {};
            forEach(state.params, function (p) {
              paramNames[p] = true;
            });
            forEach(state.parent.params, function (p) {
              if (!paramNames[p]) {
                throw new Error('Missing required parameter \'' + p + '\' in state \'' + state.name + '\'');
              }
              paramNames[p] = false;
            });
            var ownParams = [];
            forEach(paramNames, function (own, p) {
              if (own)
                ownParams.push(p);
            });
            return ownParams;
          },
          path: function (state) {
            return state.parent ? state.parent.path.concat(state) : [];
          },
          includes: function (state) {
            var includes = state.parent ? extend({}, state.parent.includes) : {};
            includes[state.name] = true;
            return includes;
          },
          $delegates: {}
        };
      function isRelative(stateName) {
        return stateName.indexOf('.') === 0 || stateName.indexOf('^') === 0;
      }
      function findState(stateOrName, base) {
        var isStr = isString(stateOrName), name = isStr ? stateOrName : stateOrName.name, path = isRelative(name);
        if (path) {
          if (!base)
            throw new Error('No reference point given for path \'' + name + '\'');
          var rel = name.split('.'), i = 0, pathLength = rel.length, current = base;
          for (; i < pathLength; i++) {
            if (rel[i] === '' && i === 0) {
              current = base;
              continue;
            }
            if (rel[i] === '^') {
              if (!current.parent)
                throw new Error('Path \'' + name + '\' not valid for state \'' + base.name + '\'');
              current = current.parent;
              continue;
            }
            break;
          }
          rel = rel.slice(i).join('.');
          name = current.name + (current.name && rel ? '.' : '') + rel;
        }
        var state = states[name];
        if (state && (isStr || !isStr && (state === stateOrName || state.self === stateOrName))) {
          return state;
        }
        return undefined;
      }
      function queueState(parentName, state) {
        if (!queue[parentName]) {
          queue[parentName] = [];
        }
        queue[parentName].push(state);
      }
      function registerState(state) {
        state = inherit(state, {
          self: state,
          resolve: state.resolve || {},
          toString: function () {
            return this.name;
          }
        });
        var name = state.name;
        if (!isString(name) || name.indexOf('@') >= 0)
          throw new Error('State must have a valid name');
        if (states.hasOwnProperty(name))
          throw new Error('State \'' + name + '\'\' is already defined');
        var parentName = name.indexOf('.') !== -1 ? name.substring(0, name.lastIndexOf('.')) : isString(state.parent) ? state.parent : '';
        if (parentName && !states[parentName]) {
          return queueState(parentName, state.self);
        }
        for (var key in stateBuilder) {
          if (isFunction(stateBuilder[key]))
            state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]);
        }
        states[name] = state;
        if (!state[abstractKey] && state.url) {
          $urlRouterProvider.when(state.url, [
            '$match',
            '$stateParams',
            function ($match, $stateParams) {
              if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
                $state.transitionTo(state, $match, { location: false });
              }
            }
          ]);
        }
        if (queue[name]) {
          for (var i = 0; i < queue[name].length; i++) {
            registerState(queue[name][i]);
          }
        }
        return state;
      }
      root = registerState({
        name: '',
        url: '^',
        views: null,
        'abstract': true
      });
      root.navigable = null;
      this.decorator = decorator;
      function decorator(name, func) {
        if (isString(name) && !isDefined(func)) {
          return stateBuilder[name];
        }
        if (!isFunction(func) || !isString(name)) {
          return this;
        }
        if (stateBuilder[name] && !stateBuilder.$delegates[name]) {
          stateBuilder.$delegates[name] = stateBuilder[name];
        }
        stateBuilder[name] = func;
        return this;
      }
      this.state = state;
      function state(name, definition) {
        if (isObject(name))
          definition = name;
        else
          definition.name = name;
        registerState(definition);
        return this;
      }
      this.$get = $get;
      $get.$inject = [
        '$rootScope',
        '$q',
        '$view',
        '$injector',
        '$resolve',
        '$stateParams',
        '$location',
        '$urlRouter'
      ];
      function $get($rootScope, $q, $view, $injector, $resolve, $stateParams, $location, $urlRouter) {
        var TransitionSuperseded = $q.reject(new Error('transition superseded'));
        var TransitionPrevented = $q.reject(new Error('transition prevented'));
        var TransitionAborted = $q.reject(new Error('transition aborted'));
        var TransitionFailed = $q.reject(new Error('transition failed'));
        var currentLocation = $location.url();
        function syncUrl() {
          if ($location.url() !== currentLocation) {
            $location.url(currentLocation);
            $location.replace();
          }
        }
        root.locals = {
          resolve: null,
          globals: { $stateParams: {} }
        };
        $state = {
          params: {},
          current: root.self,
          $current: root,
          transition: null
        };
        $state.reload = function reload() {
          $state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: false
          });
        };
        $state.go = function go(to, params, options) {
          return this.transitionTo(to, params, extend({
            inherit: true,
            relative: $state.$current
          }, options));
        };
        $state.transitionTo = function transitionTo(to, toParams, options) {
          toParams = toParams || {};
          options = extend({
            location: true,
            inherit: false,
            relative: null,
            notify: true,
            reload: false,
            $retry: false
          }, options || {});
          var from = $state.$current, fromParams = $state.params, fromPath = from.path;
          var evt, toState = findState(to, options.relative);
          if (!isDefined(toState)) {
            var redirect = {
                to: to,
                toParams: toParams,
                options: options
              };
            evt = $rootScope.$broadcast('$stateNotFound', redirect, from.self, fromParams);
            if (evt.defaultPrevented) {
              syncUrl();
              return TransitionAborted;
            }
            if (evt.retry) {
              if (options.$retry) {
                syncUrl();
                return TransitionFailed;
              }
              var retryTransition = $state.transition = $q.when(evt.retry);
              retryTransition.then(function () {
                if (retryTransition !== $state.transition)
                  return TransitionSuperseded;
                redirect.options.$retry = true;
                return $state.transitionTo(redirect.to, redirect.toParams, redirect.options);
              }, function () {
                return TransitionAborted;
              });
              syncUrl();
              return retryTransition;
            }
            to = redirect.to;
            toParams = redirect.toParams;
            options = redirect.options;
            toState = findState(to, options.relative);
            if (!isDefined(toState)) {
              if (options.relative)
                throw new Error('Could not resolve \'' + to + '\' from state \'' + options.relative + '\'');
              throw new Error('No such state \'' + to + '\'');
            }
          }
          if (toState[abstractKey])
            throw new Error('Cannot transition to abstract state \'' + to + '\'');
          if (options.inherit)
            toParams = inheritParams($stateParams, toParams || {}, $state.$current, toState);
          to = toState;
          var toPath = to.path;
          var keep, state, locals = root.locals, toLocals = [];
          for (keep = 0, state = toPath[keep]; state && state === fromPath[keep] && equalForKeys(toParams, fromParams, state.ownParams) && !options.reload; keep++, state = toPath[keep]) {
            locals = toLocals[keep] = state.locals;
          }
          if (shouldTriggerReload(to, from, locals, options)) {
            if (to.self.reloadOnSearch !== false)
              syncUrl();
            $state.transition = null;
            return $q.when($state.current);
          }
          toParams = normalize(to.params, toParams || {});
          if (options.notify) {
            evt = $rootScope.$broadcast('$stateChangeStart', to.self, toParams, from.self, fromParams);
            if (evt.defaultPrevented) {
              syncUrl();
              return TransitionPrevented;
            }
          }
          var resolved = $q.when(locals);
          for (var l = keep; l < toPath.length; l++, state = toPath[l]) {
            locals = toLocals[l] = inherit(locals);
            resolved = resolveState(state, toParams, state === to, resolved, locals);
          }
          var transition = $state.transition = resolved.then(function () {
              var l, entering, exiting;
              if ($state.transition !== transition)
                return TransitionSuperseded;
              for (l = fromPath.length - 1; l >= keep; l--) {
                exiting = fromPath[l];
                if (exiting.self.onExit) {
                  $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals);
                }
                exiting.locals = null;
              }
              for (l = keep; l < toPath.length; l++) {
                entering = toPath[l];
                entering.locals = toLocals[l];
                if (entering.self.onEnter) {
                  $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
                }
              }
              if ($state.transition !== transition)
                return TransitionSuperseded;
              $state.$current = to;
              $state.current = to.self;
              $state.params = toParams;
              copy($state.params, $stateParams);
              $state.transition = null;
              var toNav = to.navigable;
              if (options.location && toNav) {
                $location.url(toNav.url.format(toNav.locals.globals.$stateParams));
                if (options.location === 'replace') {
                  $location.replace();
                }
              }
              if (options.notify) {
                $rootScope.$broadcast('$stateChangeSuccess', to.self, toParams, from.self, fromParams);
              }
              currentLocation = $location.url();
              return $state.current;
            }, function (error) {
              if ($state.transition !== transition)
                return TransitionSuperseded;
              $state.transition = null;
              $rootScope.$broadcast('$stateChangeError', to.self, toParams, from.self, fromParams, error);
              syncUrl();
              return $q.reject(error);
            });
          return transition;
        };
        $state.is = function is(stateOrName, params) {
          var state = findState(stateOrName);
          if (!isDefined(state)) {
            return undefined;
          }
          if ($state.$current !== state) {
            return false;
          }
          return isDefined(params) ? angular.equals($stateParams, params) : true;
        };
        $state.includes = function includes(stateOrName, params) {
          var state = findState(stateOrName);
          if (!isDefined(state)) {
            return undefined;
          }
          if (!isDefined($state.$current.includes[state.name])) {
            return false;
          }
          var validParams = true;
          angular.forEach(params, function (value, key) {
            if (!isDefined($stateParams[key]) || $stateParams[key] !== value) {
              validParams = false;
            }
          });
          return validParams;
        };
        $state.href = function href(stateOrName, params, options) {
          options = extend({
            lossy: true,
            inherit: false,
            absolute: false,
            relative: $state.$current
          }, options || {});
          var state = findState(stateOrName, options.relative);
          if (!isDefined(state))
            return null;
          params = inheritParams($stateParams, params || {}, $state.$current, state);
          var nav = state && options.lossy ? state.navigable : state;
          var url = nav && nav.url ? nav.url.format(normalize(state.params, params || {})) : null;
          if (!$locationProvider.html5Mode() && url) {
            url = '#' + $locationProvider.hashPrefix() + url;
          }
          if (options.absolute && url) {
            url = $location.protocol() + '://' + $location.host() + ($location.port() == 80 || $location.port() == 443 ? '' : ':' + $location.port()) + (!$locationProvider.html5Mode() && url ? '/' : '') + url;
          }
          return url;
        };
        $state.get = function (stateOrName, context) {
          if (!isDefined(stateOrName)) {
            var list = [];
            forEach(states, function (state) {
              list.push(state.self);
            });
            return list;
          }
          var state = findState(stateOrName, context);
          return state && state.self ? state.self : null;
        };
        function resolveState(state, params, paramsAreFiltered, inherited, dst) {
          var $stateParams = paramsAreFiltered ? params : filterByKeys(state.params, params);
          var locals = { $stateParams: $stateParams };
          dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
          var promises = [dst.resolve.then(function (globals) {
                dst.globals = globals;
              })];
          if (inherited)
            promises.push(inherited);
          forEach(state.views, function (view, name) {
            var injectables = view.resolve && view.resolve !== state.resolve ? view.resolve : {};
            injectables.$template = [function () {
                return $view.load(name, {
                  view: view,
                  locals: locals,
                  params: $stateParams,
                  notify: false
                }) || '';
              }];
            promises.push($resolve.resolve(injectables, locals, dst.resolve, state).then(function (result) {
              if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
                var injectLocals = angular.extend({}, injectables, locals);
                result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals);
              } else {
                result.$$controller = view.controller;
              }
              result.$$state = state;
              dst[name] = result;
            }));
          });
          return $q.all(promises).then(function (values) {
            return dst;
          });
        }
        return $state;
      }
      function shouldTriggerReload(to, from, locals, options) {
        if (to === from && (locals === from.locals && !options.reload || to.self.reloadOnSearch === false)) {
          return true;
        }
      }
    }
    angular.module('ui.router.state').value('$stateParams', {}).provider('$state', $StateProvider);
    $ViewProvider.$inject = [];
    function $ViewProvider() {
      this.$get = $get;
      $get.$inject = [
        '$rootScope',
        '$templateFactory'
      ];
      function $get($rootScope, $templateFactory) {
        return {
          load: function load(name, options) {
            var result, defaults = {
                template: null,
                controller: null,
                view: null,
                locals: null,
                notify: true,
                async: true,
                params: {}
              };
            options = extend(defaults, options);
            if (options.view) {
              result = $templateFactory.fromConfig(options.view, options.params, options.locals);
            }
            if (result && options.notify) {
              $rootScope.$broadcast('$viewContentLoading', options);
            }
            return result;
          }
        };
      }
    }
    angular.module('ui.router.state').provider('$view', $ViewProvider);
    $ViewDirective.$inject = [
      '$state',
      '$compile',
      '$controller',
      '$injector',
      '$anchorScroll'
    ];
    function $ViewDirective($state, $compile, $controller, $injector, $anchorScroll) {
      var $animator = $injector.has('$animator') ? $injector.get('$animator') : false;
      var viewIsUpdating = false;
      var directive = {
          restrict: 'ECA',
          terminal: true,
          priority: 1000,
          transclude: true,
          compile: function (element, attr, transclude) {
            return function (scope, element, attr) {
              var viewScope, viewLocals, name = attr[directive.name] || attr.name || '', onloadExp = attr.onload || '', animate = $animator && $animator(scope, attr), initialView = transclude(scope);
              var renderer = function (doAnimate) {
                return {
                  'true': {
                    remove: function (element) {
                      animate.leave(element.contents(), element);
                    },
                    restore: function (compiled, element) {
                      animate.enter(compiled, element);
                    },
                    populate: function (template, element) {
                      var contents = angular.element('<div></div>').html(template).contents();
                      animate.enter(contents, element);
                      return contents;
                    }
                  },
                  'false': {
                    remove: function (element) {
                      element.html('');
                    },
                    restore: function (compiled, element) {
                      element.append(compiled);
                    },
                    populate: function (template, element) {
                      element.html(template);
                      return element.contents();
                    }
                  }
                }[doAnimate.toString()];
              };
              element.append(initialView);
              var parent = element.parent().inheritedData('$uiView');
              if (name.indexOf('@') < 0)
                name = name + '@' + (parent ? parent.state.name : '');
              var view = {
                  name: name,
                  state: null
                };
              element.data('$uiView', view);
              var eventHook = function () {
                if (viewIsUpdating)
                  return;
                viewIsUpdating = true;
                try {
                  updateView(true);
                } catch (e) {
                  viewIsUpdating = false;
                  throw e;
                }
                viewIsUpdating = false;
              };
              scope.$on('$stateChangeSuccess', eventHook);
              scope.$on('$viewContentLoading', eventHook);
              updateView(false);
              function updateView(doAnimate) {
                var locals = $state.$current && $state.$current.locals[name];
                if (locals === viewLocals)
                  return;
                var render = renderer(animate && doAnimate);
                render.remove(element);
                if (viewScope) {
                  viewScope.$destroy();
                  viewScope = null;
                }
                if (!locals) {
                  viewLocals = null;
                  view.state = null;
                  return render.restore(initialView, element);
                }
                viewLocals = locals;
                view.state = locals.$$state;
                var link = $compile(render.populate(locals.$template, element));
                viewScope = scope.$new();
                if (locals.$$controller) {
                  locals.$scope = viewScope;
                  var controller = $controller(locals.$$controller, locals);
                  element.children().data('$ngControllerController', controller);
                }
                link(viewScope);
                viewScope.$emit('$viewContentLoaded');
                if (onloadExp)
                  viewScope.$eval(onloadExp);
                $anchorScroll();
              }
            };
          }
        };
      return directive;
    }
    angular.module('ui.router.state').directive('uiView', $ViewDirective);
    function parseStateRef(ref) {
      var parsed = ref.replace(/\n/g, ' ').match(/^([^(]+?)\s*(\((.*)\))?$/);
      if (!parsed || parsed.length !== 4)
        throw new Error('Invalid state ref \'' + ref + '\'');
      return {
        state: parsed[1],
        paramExpr: parsed[3] || null
      };
    }
    function stateContext(el) {
      var stateData = el.parent().inheritedData('$uiView');
      if (stateData && stateData.state && stateData.state.name) {
        return stateData.state;
      }
    }
    $StateRefDirective.$inject = [
      '$state',
      '$timeout'
    ];
    function $StateRefDirective($state, $timeout) {
      return {
        restrict: 'A',
        require: '?^uiSrefActive',
        link: function (scope, element, attrs, uiSrefActive) {
          var ref = parseStateRef(attrs.uiSref);
          var params = null, url = null, base = stateContext(element) || $state.$current;
          var isForm = element[0].nodeName === 'FORM';
          var attr = isForm ? 'action' : 'href', nav = true;
          var update = function (newVal) {
            if (newVal)
              params = newVal;
            if (!nav)
              return;
            var newHref = $state.href(ref.state, params, { relative: base });
            if (!newHref) {
              nav = false;
              return false;
            }
            element[0][attr] = newHref;
            if (uiSrefActive) {
              uiSrefActive.$$setStateInfo(ref.state, params);
            }
          };
          if (ref.paramExpr) {
            scope.$watch(ref.paramExpr, function (newVal, oldVal) {
              if (newVal !== params)
                update(newVal);
            }, true);
            params = scope.$eval(ref.paramExpr);
          }
          update();
          if (isForm)
            return;
          element.bind('click', function (e) {
            var button = e.which || e.button;
            if ((button === 0 || button == 1) && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
              $timeout(function () {
                scope.$apply(function () {
                  $state.go(ref.state, params, { relative: base });
                });
              });
              e.preventDefault();
            }
          });
        }
      };
    }
    $StateActiveDirective.$inject = [
      '$state',
      '$stateParams',
      '$interpolate'
    ];
    function $StateActiveDirective($state, $stateParams, $interpolate) {
      return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs) {
          var state, params, activeClass;
          activeClass = $interpolate($attrs.uiSrefActive || '', false)($scope);
          this.$$setStateInfo = function (newState, newParams) {
            state = $state.get(newState, stateContext($element));
            params = newParams;
            update();
          };
          $scope.$on('$stateChangeSuccess', update);
          function update() {
            if ($state.$current.self === state && matchesParams()) {
              $element.addClass(activeClass);
            } else {
              $element.removeClass(activeClass);
            }
          }
          function matchesParams() {
            return !params || equalForKeys(params, $stateParams);
          }
        }
      };
    }
    angular.module('ui.router.state').directive('uiSref', $StateRefDirective).directive('uiSrefActive', $StateActiveDirective);
    $RouteProvider.$inject = [
      '$stateProvider',
      '$urlRouterProvider'
    ];
    function $RouteProvider($stateProvider, $urlRouterProvider) {
      var routes = [];
      onEnterRoute.$inject = ['$$state'];
      function onEnterRoute($$state) {
        this.locals = $$state.locals.globals;
        this.params = this.locals.$stateParams;
      }
      function onExitRoute() {
        this.locals = null;
        this.params = null;
      }
      this.when = when;
      function when(url, route) {
        if (route.redirectTo != null) {
          var redirect = route.redirectTo, handler;
          if (isString(redirect)) {
            handler = redirect;
          } else if (isFunction(redirect)) {
            handler = function (params, $location) {
              return redirect(params, $location.path(), $location.search());
            };
          } else {
            throw new Error('Invalid \'redirectTo\' in when()');
          }
          $urlRouterProvider.when(url, handler);
        } else {
          $stateProvider.state(inherit(route, {
            parent: null,
            name: 'route:' + encodeURIComponent(url),
            url: url,
            onEnter: onEnterRoute,
            onExit: onExitRoute
          }));
        }
        routes.push(route);
        return this;
      }
      this.$get = $get;
      $get.$inject = [
        '$state',
        '$rootScope',
        '$routeParams'
      ];
      function $get($state, $rootScope, $routeParams) {
        var $route = {
            routes: routes,
            params: $routeParams,
            current: undefined
          };
        function stateAsRoute(state) {
          return state.name !== '' ? state : undefined;
        }
        $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
          $rootScope.$broadcast('$routeChangeStart', stateAsRoute(to), stateAsRoute(from));
        });
        $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
          $route.current = stateAsRoute(to);
          $rootScope.$broadcast('$routeChangeSuccess', stateAsRoute(to), stateAsRoute(from));
          copy(toParams, $route.params);
        });
        $rootScope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams, error) {
          $rootScope.$broadcast('$routeChangeError', stateAsRoute(to), stateAsRoute(from), error);
        });
        return $route;
      }
    }
    angular.module('ui.router.compat').provider('$route', $RouteProvider).directive('ngView', $ViewDirective);
  }(window, window.angular));
  define('angular-ui-router', ['angular'], function () {
  });
  (function () {
    window.ionic = {
      controllers: {},
      views: {},
      version: '1.0.0-beta.2'
    };
    (function (ionic) {
      var bezierCoord = function (x, y) {
        if (!x)
          x = 0;
        if (!y)
          y = 0;
        return {
          x: x,
          y: y
        };
      };
      function B1(t) {
        return t * t * t;
      }
      function B2(t) {
        return 3 * t * t * (1 - t);
      }
      function B3(t) {
        return 3 * t * (1 - t) * (1 - t);
      }
      function B4(t) {
        return (1 - t) * (1 - t) * (1 - t);
      }
      ionic.Animator = {
        getQuadraticBezier: function (percent, C1, C2, C3, C4) {
          var pos = new bezierCoord();
          pos.x = C1.x * B1(percent) + C2.x * B2(percent) + C3.x * B3(percent) + C4.x * B4(percent);
          pos.y = C1.y * B1(percent) + C2.y * B2(percent) + C3.y * B3(percent) + C4.y * B4(percent);
          return pos;
        },
        getCubicBezier: function (x1, y1, x2, y2, duration) {
          epsilon = 1000 / 60 / duration / 4;
          var curveX = function (t) {
            var v = 1 - t;
            return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
          };
          var curveY = function (t) {
            var v = 1 - t;
            return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
          };
          var derivativeCurveX = function (t) {
            var v = 1 - t;
            return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (-t * t * t + 2 * v * t) * x2;
          };
          return function (t) {
            var x = t, t0, t1, t2, x2, d2, i;
            for (t2 = x, i = 0; i < 8; i++) {
              x2 = curveX(t2) - x;
              if (Math.abs(x2) < epsilon)
                return curveY(t2);
              d2 = derivativeCurveX(t2);
              if (Math.abs(d2) < 0.000001)
                break;
              t2 = t2 - x2 / d2;
            }
            t0 = 0, t1 = 1, t2 = x;
            if (t2 < t0)
              return curveY(t0);
            if (t2 > t1)
              return curveY(t1);
            while (t0 < t1) {
              x2 = curveX(t2);
              if (Math.abs(x2 - x) < epsilon)
                return curveY(t2);
              if (x > x2)
                t0 = t2;
              else
                t1 = t2;
              t2 = (t1 - t0) * 0.5 + t0;
            }
            return curveY(t2);
          };
        },
        animate: function (element, className, fn) {
          return {
            leave: function () {
              var endFunc = function () {
                element.classList.remove('leave');
                element.classList.remove('leave-active');
                element.removeEventListener('webkitTransitionEnd', endFunc);
                element.removeEventListener('transitionEnd', endFunc);
              };
              element.addEventListener('webkitTransitionEnd', endFunc);
              element.addEventListener('transitionEnd', endFunc);
              element.classList.add('leave');
              element.classList.add('leave-active');
              return this;
            },
            enter: function () {
              var endFunc = function () {
                element.classList.remove('enter');
                element.classList.remove('enter-active');
                element.removeEventListener('webkitTransitionEnd', endFunc);
                element.removeEventListener('transitionEnd', endFunc);
              };
              element.addEventListener('webkitTransitionEnd', endFunc);
              element.addEventListener('transitionEnd', endFunc);
              element.classList.add('enter');
              element.classList.add('enter-active');
              return this;
            }
          };
        }
      };
    }(ionic));
    (function (window, document, ionic) {
      var readyCallbacks = [];
      var isDomReady = false;
      function domReady() {
        isDomReady = true;
        for (var x = 0; x < readyCallbacks.length; x++) {
          ionic.requestAnimationFrame(readyCallbacks[x]);
        }
        readyCallbacks = [];
        document.removeEventListener('DOMContentLoaded', domReady);
      }
      document.addEventListener('DOMContentLoaded', domReady);
      window._rAF = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
          window.setTimeout(callback, 16);
        };
      }();
      ionic.DomUtil = {
        requestAnimationFrame: function (cb) {
          window._rAF(cb);
        },
        animationFrameThrottle: function (cb) {
          var args, isQueued, context;
          return function () {
            args = arguments;
            context = this;
            if (!isQueued) {
              isQueued = true;
              ionic.requestAnimationFrame(function () {
                cb.apply(context, args);
                isQueued = false;
              });
            }
          };
        },
        getPositionInParent: function (el) {
          return {
            left: el.offsetLeft,
            top: el.offsetTop
          };
        },
        ready: function (cb) {
          if (isDomReady || document.readyState === 'complete') {
            ionic.requestAnimationFrame(cb);
          } else {
            readyCallbacks.push(cb);
          }
        },
        getTextBounds: function (textNode) {
          if (document.createRange) {
            var range = document.createRange();
            range.selectNodeContents(textNode);
            if (range.getBoundingClientRect) {
              var rect = range.getBoundingClientRect();
              if (rect) {
                var sx = window.scrollX;
                var sy = window.scrollY;
                return {
                  top: rect.top + sy,
                  left: rect.left + sx,
                  right: rect.left + sx + rect.width,
                  bottom: rect.top + sy + rect.height,
                  width: rect.width,
                  height: rect.height
                };
              }
            }
          }
          return null;
        },
        getChildIndex: function (element, type) {
          if (type) {
            var ch = element.parentNode.children;
            var c;
            for (var i = 0, k = 0, j = ch.length; i < j; i++) {
              c = ch[i];
              if (c.nodeName && c.nodeName.toLowerCase() == type) {
                if (c == element) {
                  return k;
                }
                k++;
              }
            }
          }
          return Array.prototype.slice.call(element.parentNode.children).indexOf(element);
        },
        swapNodes: function (src, dest) {
          dest.parentNode.insertBefore(src, dest);
        },
        centerElementByMargin: function (el) {
          el.style.marginLeft = -el.offsetWidth / 2 + 'px';
          el.style.marginTop = -el.offsetHeight / 2 + 'px';
        },
        centerElementByMarginTwice: function (el) {
          ionic.requestAnimationFrame(function () {
            ionic.DomUtil.centerElementByMargin(el);
            ionic.requestAnimationFrame(function () {
              ionic.DomUtil.centerElementByMargin(el);
            });
          });
        },
        getParentWithClass: function (e, className, depth) {
          depth = depth || 10;
          while (e.parentNode && depth--) {
            if (e.parentNode.classList && e.parentNode.classList.contains(className)) {
              return e.parentNode;
            }
            e = e.parentNode;
          }
          return null;
        },
        getParentOrSelfWithClass: function (e, className, depth) {
          depth = depth || 10;
          while (e && depth--) {
            if (e.classList && e.classList.contains(className)) {
              return e;
            }
            e = e.parentNode;
          }
          return null;
        },
        rectContains: function (x, y, x1, y1, x2, y2) {
          if (x < x1 || x > x2)
            return false;
          if (y < y1 || y > y2)
            return false;
          return true;
        }
      };
      ionic.requestAnimationFrame = ionic.DomUtil.requestAnimationFrame;
      ionic.animationFrameThrottle = ionic.DomUtil.animationFrameThrottle;
    }(window, document, ionic));
    (function (ionic) {
      if (!window.CustomEvent) {
        (function () {
          var CustomEvent;
          CustomEvent = function (event, params) {
            var evt;
            params = params || {
              bubbles: false,
              cancelable: false,
              detail: undefined
            };
            try {
              evt = document.createEvent('CustomEvent');
              evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            } catch (error) {
              evt = document.createEvent('Event');
              for (var param in params) {
                evt[param] = params[param];
              }
              evt.initEvent(event, params.bubbles, params.cancelable);
            }
            return evt;
          };
          CustomEvent.prototype = window.Event.prototype;
          window.CustomEvent = CustomEvent;
        }());
      }
      ionic.EventController = {
        VIRTUALIZED_EVENTS: [
          'tap',
          'swipe',
          'swiperight',
          'swipeleft',
          'drag',
          'hold',
          'release'
        ],
        trigger: function (eventType, data, bubbles, cancelable) {
          var event = new CustomEvent(eventType, {
              detail: data,
              bubbles: !!bubbles,
              cancelable: !!cancelable
            });
          data && data.target && data.target.dispatchEvent && data.target.dispatchEvent(event) || window.dispatchEvent(event);
        },
        on: function (type, callback, element) {
          var e = element || window;
          for (var i = 0, j = this.VIRTUALIZED_EVENTS.length; i < j; i++) {
            if (type == this.VIRTUALIZED_EVENTS[i]) {
              var gesture = new ionic.Gesture(element);
              gesture.on(type, callback);
              return gesture;
            }
          }
          e.addEventListener(type, callback);
        },
        off: function (type, callback, element) {
          element.removeEventListener(type, callback);
        },
        onGesture: function (type, callback, element) {
          var gesture = new ionic.Gesture(element);
          gesture.on(type, callback);
          return gesture;
        },
        offGesture: function (gesture, type, callback) {
          gesture.off(type, callback);
        },
        handlePopState: function (event) {
        }
      };
      ionic.on = function () {
        ionic.EventController.on.apply(ionic.EventController, arguments);
      };
      ionic.off = function () {
        ionic.EventController.off.apply(ionic.EventController, arguments);
      };
      ionic.trigger = ionic.EventController.trigger;
      ionic.onGesture = function () {
        return ionic.EventController.onGesture.apply(ionic.EventController.onGesture, arguments);
      };
      ionic.offGesture = function () {
        return ionic.EventController.offGesture.apply(ionic.EventController.offGesture, arguments);
      };
    }(window.ionic));
    (function (ionic) {
      ionic.Gesture = function (element, options) {
        return new ionic.Gestures.Instance(element, options || {});
      };
      ionic.Gestures = {};
      ionic.Gestures.defaults = { stop_browser_behavior: 'disable-user-behavior' };
      ionic.Gestures.HAS_POINTEREVENTS = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;
      ionic.Gestures.HAS_TOUCHEVENTS = 'ontouchstart' in window;
      ionic.Gestures.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i;
      ionic.Gestures.NO_MOUSEEVENTS = ionic.Gestures.HAS_TOUCHEVENTS && window.navigator.userAgent.match(ionic.Gestures.MOBILE_REGEX);
      ionic.Gestures.EVENT_TYPES = {};
      ionic.Gestures.DIRECTION_DOWN = 'down';
      ionic.Gestures.DIRECTION_LEFT = 'left';
      ionic.Gestures.DIRECTION_UP = 'up';
      ionic.Gestures.DIRECTION_RIGHT = 'right';
      ionic.Gestures.POINTER_MOUSE = 'mouse';
      ionic.Gestures.POINTER_TOUCH = 'touch';
      ionic.Gestures.POINTER_PEN = 'pen';
      ionic.Gestures.EVENT_START = 'start';
      ionic.Gestures.EVENT_MOVE = 'move';
      ionic.Gestures.EVENT_END = 'end';
      ionic.Gestures.DOCUMENT = window.document;
      ionic.Gestures.plugins = {};
      ionic.Gestures.READY = false;
      function setup() {
        if (ionic.Gestures.READY) {
          return;
        }
        ionic.Gestures.event.determineEventTypes();
        for (var name in ionic.Gestures.gestures) {
          if (ionic.Gestures.gestures.hasOwnProperty(name)) {
            ionic.Gestures.detection.register(ionic.Gestures.gestures[name]);
          }
        }
        ionic.Gestures.event.onTouch(ionic.Gestures.DOCUMENT, ionic.Gestures.EVENT_MOVE, ionic.Gestures.detection.detect);
        ionic.Gestures.event.onTouch(ionic.Gestures.DOCUMENT, ionic.Gestures.EVENT_END, ionic.Gestures.detection.detect);
        ionic.Gestures.READY = true;
      }
      ionic.Gestures.Instance = function (element, options) {
        var self = this;
        if (element === null) {
          void 0;
          return;
        }
        setup();
        this.element = element;
        this.enabled = true;
        this.options = ionic.Gestures.utils.extend(ionic.Gestures.utils.extend({}, ionic.Gestures.defaults), options || {});
        if (this.options.stop_browser_behavior) {
          ionic.Gestures.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior);
        }
        ionic.Gestures.event.onTouch(element, ionic.Gestures.EVENT_START, function (ev) {
          if (self.enabled) {
            ionic.Gestures.detection.startDetect(self, ev);
          }
        });
        return this;
      };
      ionic.Gestures.Instance.prototype = {
        on: function onEvent(gesture, handler) {
          var gestures = gesture.split(' ');
          for (var t = 0; t < gestures.length; t++) {
            this.element.addEventListener(gestures[t], handler, false);
          }
          return this;
        },
        off: function offEvent(gesture, handler) {
          var gestures = gesture.split(' ');
          for (var t = 0; t < gestures.length; t++) {
            this.element.removeEventListener(gestures[t], handler, false);
          }
          return this;
        },
        trigger: function triggerEvent(gesture, eventData) {
          var event = ionic.Gestures.DOCUMENT.createEvent('Event');
          event.initEvent(gesture, true, true);
          event.gesture = eventData;
          var element = this.element;
          if (ionic.Gestures.utils.hasParent(eventData.target, element)) {
            element = eventData.target;
          }
          element.dispatchEvent(event);
          return this;
        },
        enable: function enable(state) {
          this.enabled = state;
          return this;
        }
      };
      var last_move_event = null;
      var enable_detect = false;
      var touch_triggered = false;
      ionic.Gestures.event = {
        bindDom: function (element, type, handler) {
          var types = type.split(' ');
          for (var t = 0; t < types.length; t++) {
            element.addEventListener(types[t], handler, false);
          }
        },
        onTouch: function onTouch(element, eventType, handler) {
          var self = this;
          this.bindDom(element, ionic.Gestures.EVENT_TYPES[eventType], function bindDomOnTouch(ev) {
            var sourceEventType = ev.type.toLowerCase();
            if (sourceEventType.match(/mouse/) && touch_triggered) {
              return;
            } else if (sourceEventType.match(/touch/) || sourceEventType.match(/pointerdown/) || sourceEventType.match(/mouse/) && ev.which === 1) {
              enable_detect = true;
            } else if (sourceEventType.match(/mouse/) && ev.which !== 1) {
              enable_detect = false;
            }
            if (sourceEventType.match(/touch|pointer/)) {
              touch_triggered = true;
            }
            var count_touches = 0;
            if (enable_detect) {
              if (ionic.Gestures.HAS_POINTEREVENTS && eventType != ionic.Gestures.EVENT_END) {
                count_touches = ionic.Gestures.PointerEvent.updatePointer(eventType, ev);
              } else if (sourceEventType.match(/touch/)) {
                count_touches = ev.touches.length;
              } else if (!touch_triggered) {
                count_touches = sourceEventType.match(/up/) ? 0 : 1;
              }
              if (count_touches > 0 && eventType == ionic.Gestures.EVENT_END) {
                eventType = ionic.Gestures.EVENT_MOVE;
              } else if (!count_touches) {
                eventType = ionic.Gestures.EVENT_END;
              }
              if (count_touches || last_move_event === null) {
                last_move_event = ev;
              }
              handler.call(ionic.Gestures.detection, self.collectEventData(element, eventType, self.getTouchList(last_move_event, eventType), ev));
              if (ionic.Gestures.HAS_POINTEREVENTS && eventType == ionic.Gestures.EVENT_END) {
                count_touches = ionic.Gestures.PointerEvent.updatePointer(eventType, ev);
              }
            }
            if (!count_touches) {
              last_move_event = null;
              enable_detect = false;
              touch_triggered = false;
              ionic.Gestures.PointerEvent.reset();
            }
          });
        },
        determineEventTypes: function determineEventTypes() {
          var types;
          if (ionic.Gestures.HAS_POINTEREVENTS) {
            types = ionic.Gestures.PointerEvent.getEvents();
          } else if (ionic.Gestures.NO_MOUSEEVENTS) {
            types = [
              'touchstart',
              'touchmove',
              'touchend touchcancel'
            ];
          } else {
            types = [
              'touchstart mousedown',
              'touchmove mousemove',
              'touchend touchcancel mouseup'
            ];
          }
          ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_START] = types[0];
          ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_MOVE] = types[1];
          ionic.Gestures.EVENT_TYPES[ionic.Gestures.EVENT_END] = types[2];
        },
        getTouchList: function getTouchList(ev) {
          if (ionic.Gestures.HAS_POINTEREVENTS) {
            return ionic.Gestures.PointerEvent.getTouchList();
          } else if (ev.touches) {
            return ev.touches;
          } else {
            ev.indentifier = 1;
            return [ev];
          }
        },
        collectEventData: function collectEventData(element, eventType, touches, ev) {
          var pointerType = ionic.Gestures.POINTER_TOUCH;
          if (ev.type.match(/mouse/) || ionic.Gestures.PointerEvent.matchType(ionic.Gestures.POINTER_MOUSE, ev)) {
            pointerType = ionic.Gestures.POINTER_MOUSE;
          }
          return {
            center: ionic.Gestures.utils.getCenter(touches),
            timeStamp: new Date().getTime(),
            target: ev.target,
            touches: touches,
            eventType: eventType,
            pointerType: pointerType,
            srcEvent: ev,
            preventDefault: function () {
              if (this.srcEvent.preventManipulation) {
                this.srcEvent.preventManipulation();
              }
              if (this.srcEvent.preventDefault) {
              }
            },
            stopPropagation: function () {
              this.srcEvent.stopPropagation();
            },
            stopDetect: function () {
              return ionic.Gestures.detection.stopDetect();
            }
          };
        }
      };
      ionic.Gestures.PointerEvent = {
        pointers: {},
        getTouchList: function () {
          var self = this;
          var touchlist = [];
          Object.keys(self.pointers).sort().forEach(function (id) {
            touchlist.push(self.pointers[id]);
          });
          return touchlist;
        },
        updatePointer: function (type, pointerEvent) {
          if (type == ionic.Gestures.EVENT_END) {
            this.pointers = {};
          } else {
            pointerEvent.identifier = pointerEvent.pointerId;
            this.pointers[pointerEvent.pointerId] = pointerEvent;
          }
          return Object.keys(this.pointers).length;
        },
        matchType: function (pointerType, ev) {
          if (!ev.pointerType) {
            return false;
          }
          var types = {};
          types[ionic.Gestures.POINTER_MOUSE] = ev.pointerType == ev.MSPOINTER_TYPE_MOUSE || ev.pointerType == ionic.Gestures.POINTER_MOUSE;
          types[ionic.Gestures.POINTER_TOUCH] = ev.pointerType == ev.MSPOINTER_TYPE_TOUCH || ev.pointerType == ionic.Gestures.POINTER_TOUCH;
          types[ionic.Gestures.POINTER_PEN] = ev.pointerType == ev.MSPOINTER_TYPE_PEN || ev.pointerType == ionic.Gestures.POINTER_PEN;
          return types[pointerType];
        },
        getEvents: function () {
          return [
            'pointerdown MSPointerDown',
            'pointermove MSPointerMove',
            'pointerup pointercancel MSPointerUp MSPointerCancel'
          ];
        },
        reset: function () {
          this.pointers = {};
        }
      };
      ionic.Gestures.utils = {
        extend: function extend(dest, src, merge) {
          for (var key in src) {
            if (dest[key] !== undefined && merge) {
              continue;
            }
            dest[key] = src[key];
          }
          return dest;
        },
        hasParent: function (node, parent) {
          while (node) {
            if (node == parent) {
              return true;
            }
            node = node.parentNode;
          }
          return false;
        },
        getCenter: function getCenter(touches) {
          var valuesX = [], valuesY = [];
          for (var t = 0, len = touches.length; t < len; t++) {
            valuesX.push(touches[t].pageX);
            valuesY.push(touches[t].pageY);
          }
          return {
            pageX: (Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2,
            pageY: (Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2
          };
        },
        getVelocity: function getVelocity(delta_time, delta_x, delta_y) {
          return {
            x: Math.abs(delta_x / delta_time) || 0,
            y: Math.abs(delta_y / delta_time) || 0
          };
        },
        getAngle: function getAngle(touch1, touch2) {
          var y = touch2.pageY - touch1.pageY, x = touch2.pageX - touch1.pageX;
          return Math.atan2(y, x) * 180 / Math.PI;
        },
        getDirection: function getDirection(touch1, touch2) {
          var x = Math.abs(touch1.pageX - touch2.pageX), y = Math.abs(touch1.pageY - touch2.pageY);
          if (x >= y) {
            return touch1.pageX - touch2.pageX > 0 ? ionic.Gestures.DIRECTION_LEFT : ionic.Gestures.DIRECTION_RIGHT;
          } else {
            return touch1.pageY - touch2.pageY > 0 ? ionic.Gestures.DIRECTION_UP : ionic.Gestures.DIRECTION_DOWN;
          }
        },
        getDistance: function getDistance(touch1, touch2) {
          var x = touch2.pageX - touch1.pageX, y = touch2.pageY - touch1.pageY;
          return Math.sqrt(x * x + y * y);
        },
        getScale: function getScale(start, end) {
          if (start.length >= 2 && end.length >= 2) {
            return this.getDistance(end[0], end[1]) / this.getDistance(start[0], start[1]);
          }
          return 1;
        },
        getRotation: function getRotation(start, end) {
          if (start.length >= 2 && end.length >= 2) {
            return this.getAngle(end[1], end[0]) - this.getAngle(start[1], start[0]);
          }
          return 0;
        },
        isVertical: function isVertical(direction) {
          return direction == ionic.Gestures.DIRECTION_UP || direction == ionic.Gestures.DIRECTION_DOWN;
        },
        stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_class) {
          if (element && element.classList) {
            element.classList.add(css_class);
            element.onselectstart = function () {
              return false;
            };
          }
        }
      };
      ionic.Gestures.detection = {
        gestures: [],
        current: null,
        previous: null,
        stopped: false,
        startDetect: function startDetect(inst, eventData) {
          if (this.current) {
            return;
          }
          this.stopped = false;
          this.current = {
            inst: inst,
            startEvent: ionic.Gestures.utils.extend({}, eventData),
            lastEvent: false,
            name: ''
          };
          this.detect(eventData);
        },
        detect: function detect(eventData) {
          if (!this.current || this.stopped) {
            return;
          }
          eventData = this.extendEventData(eventData);
          var inst_options = this.current.inst.options;
          for (var g = 0, len = this.gestures.length; g < len; g++) {
            var gesture = this.gestures[g];
            if (!this.stopped && inst_options[gesture.name] !== false) {
              if (gesture.handler.call(gesture, eventData, this.current.inst) === false) {
                this.stopDetect();
                break;
              }
            }
          }
          if (this.current) {
            this.current.lastEvent = eventData;
          }
          if (eventData.eventType == ionic.Gestures.EVENT_END && !eventData.touches.length - 1) {
            this.stopDetect();
          }
          return eventData;
        },
        stopDetect: function stopDetect() {
          this.previous = ionic.Gestures.utils.extend({}, this.current);
          this.current = null;
          this.stopped = true;
        },
        extendEventData: function extendEventData(ev) {
          var startEv = this.current.startEvent;
          if (startEv && (ev.touches.length != startEv.touches.length || ev.touches === startEv.touches)) {
            startEv.touches = [];
            for (var i = 0, len = ev.touches.length; i < len; i++) {
              startEv.touches.push(ionic.Gestures.utils.extend({}, ev.touches[i]));
            }
          }
          var delta_time = ev.timeStamp - startEv.timeStamp, delta_x = ev.center.pageX - startEv.center.pageX, delta_y = ev.center.pageY - startEv.center.pageY, velocity = ionic.Gestures.utils.getVelocity(delta_time, delta_x, delta_y);
          ionic.Gestures.utils.extend(ev, {
            deltaTime: delta_time,
            deltaX: delta_x,
            deltaY: delta_y,
            velocityX: velocity.x,
            velocityY: velocity.y,
            distance: ionic.Gestures.utils.getDistance(startEv.center, ev.center),
            angle: ionic.Gestures.utils.getAngle(startEv.center, ev.center),
            direction: ionic.Gestures.utils.getDirection(startEv.center, ev.center),
            scale: ionic.Gestures.utils.getScale(startEv.touches, ev.touches),
            rotation: ionic.Gestures.utils.getRotation(startEv.touches, ev.touches),
            startEvent: startEv
          });
          return ev;
        },
        register: function register(gesture) {
          var options = gesture.defaults || {};
          if (options[gesture.name] === undefined) {
            options[gesture.name] = true;
          }
          ionic.Gestures.utils.extend(ionic.Gestures.defaults, options, true);
          gesture.index = gesture.index || 1000;
          this.gestures.push(gesture);
          this.gestures.sort(function (a, b) {
            if (a.index < b.index) {
              return -1;
            }
            if (a.index > b.index) {
              return 1;
            }
            return 0;
          });
          return this.gestures;
        }
      };
      ionic.Gestures.gestures = ionic.Gestures.gestures || {};
      ionic.Gestures.gestures.Hold = {
        name: 'hold',
        index: 10,
        defaults: {
          hold_timeout: 500,
          hold_threshold: 1
        },
        timer: null,
        handler: function holdGesture(ev, inst) {
          switch (ev.eventType) {
          case ionic.Gestures.EVENT_START:
            clearTimeout(this.timer);
            ionic.Gestures.detection.current.name = this.name;
            this.timer = setTimeout(function () {
              if (ionic.Gestures.detection.current.name == 'hold') {
                inst.trigger('hold', ev);
              }
            }, inst.options.hold_timeout);
            break;
          case ionic.Gestures.EVENT_MOVE:
            if (ev.distance > inst.options.hold_threshold) {
              clearTimeout(this.timer);
            }
            break;
          case ionic.Gestures.EVENT_END:
            clearTimeout(this.timer);
            break;
          }
        }
      };
      ionic.Gestures.gestures.Tap = {
        name: 'tap',
        index: 100,
        defaults: {
          tap_max_touchtime: 250,
          tap_max_distance: 10,
          tap_always: true,
          doubletap_distance: 20,
          doubletap_interval: 300
        },
        handler: function tapGesture(ev, inst) {
          if (ev.eventType == ionic.Gestures.EVENT_END && ev.srcEvent.type != 'touchcancel') {
            var prev = ionic.Gestures.detection.previous, did_doubletap = false;
            if (ev.deltaTime > inst.options.tap_max_touchtime || ev.distance > inst.options.tap_max_distance) {
              return;
            }
            if (prev && prev.name == 'tap' && ev.timeStamp - prev.lastEvent.timeStamp < inst.options.doubletap_interval && ev.distance < inst.options.doubletap_distance) {
              inst.trigger('doubletap', ev);
              did_doubletap = true;
            }
            if (!did_doubletap || inst.options.tap_always) {
              ionic.Gestures.detection.current.name = 'tap';
              inst.trigger(ionic.Gestures.detection.current.name, ev);
            }
          }
        }
      };
      ionic.Gestures.gestures.Swipe = {
        name: 'swipe',
        index: 40,
        defaults: {
          swipe_max_touches: 1,
          swipe_velocity: 0.7
        },
        handler: function swipeGesture(ev, inst) {
          if (ev.eventType == ionic.Gestures.EVENT_END) {
            if (inst.options.swipe_max_touches > 0 && ev.touches.length > inst.options.swipe_max_touches) {
              return;
            }
            if (ev.velocityX > inst.options.swipe_velocity || ev.velocityY > inst.options.swipe_velocity) {
              inst.trigger(this.name, ev);
              inst.trigger(this.name + ev.direction, ev);
            }
          }
        }
      };
      ionic.Gestures.gestures.Drag = {
        name: 'drag',
        index: 50,
        defaults: {
          drag_min_distance: 10,
          correct_for_drag_min_distance: true,
          drag_max_touches: 1,
          drag_block_horizontal: true,
          drag_block_vertical: true,
          drag_lock_to_axis: false,
          drag_lock_min_distance: 25
        },
        triggered: false,
        handler: function dragGesture(ev, inst) {
          if (ionic.Gestures.detection.current.name != this.name && this.triggered) {
            inst.trigger(this.name + 'end', ev);
            this.triggered = false;
            return;
          }
          if (inst.options.drag_max_touches > 0 && ev.touches.length > inst.options.drag_max_touches) {
            return;
          }
          switch (ev.eventType) {
          case ionic.Gestures.EVENT_START:
            this.triggered = false;
            break;
          case ionic.Gestures.EVENT_MOVE:
            if (ev.distance < inst.options.drag_min_distance && ionic.Gestures.detection.current.name != this.name) {
              return;
            }
            if (ionic.Gestures.detection.current.name != this.name) {
              ionic.Gestures.detection.current.name = this.name;
              if (inst.options.correct_for_drag_min_distance) {
                var factor = Math.abs(inst.options.drag_min_distance / ev.distance);
                ionic.Gestures.detection.current.startEvent.center.pageX += ev.deltaX * factor;
                ionic.Gestures.detection.current.startEvent.center.pageY += ev.deltaY * factor;
                ev = ionic.Gestures.detection.extendEventData(ev);
              }
            }
            if (ionic.Gestures.detection.current.lastEvent.drag_locked_to_axis || inst.options.drag_lock_to_axis && inst.options.drag_lock_min_distance <= ev.distance) {
              ev.drag_locked_to_axis = true;
            }
            var last_direction = ionic.Gestures.detection.current.lastEvent.direction;
            if (ev.drag_locked_to_axis && last_direction !== ev.direction) {
              if (ionic.Gestures.utils.isVertical(last_direction)) {
                ev.direction = ev.deltaY < 0 ? ionic.Gestures.DIRECTION_UP : ionic.Gestures.DIRECTION_DOWN;
              } else {
                ev.direction = ev.deltaX < 0 ? ionic.Gestures.DIRECTION_LEFT : ionic.Gestures.DIRECTION_RIGHT;
              }
            }
            if (!this.triggered) {
              inst.trigger(this.name + 'start', ev);
              this.triggered = true;
            }
            inst.trigger(this.name, ev);
            inst.trigger(this.name + ev.direction, ev);
            if (inst.options.drag_block_vertical && ionic.Gestures.utils.isVertical(ev.direction) || inst.options.drag_block_horizontal && !ionic.Gestures.utils.isVertical(ev.direction)) {
              ev.preventDefault();
            }
            break;
          case ionic.Gestures.EVENT_END:
            if (this.triggered) {
              inst.trigger(this.name + 'end', ev);
            }
            this.triggered = false;
            break;
          }
        }
      };
      ionic.Gestures.gestures.Transform = {
        name: 'transform',
        index: 45,
        defaults: {
          transform_min_scale: 0.01,
          transform_min_rotation: 1,
          transform_always_block: false
        },
        triggered: false,
        handler: function transformGesture(ev, inst) {
          if (ionic.Gestures.detection.current.name != this.name && this.triggered) {
            inst.trigger(this.name + 'end', ev);
            this.triggered = false;
            return;
          }
          if (ev.touches.length < 2) {
            return;
          }
          if (inst.options.transform_always_block) {
            ev.preventDefault();
          }
          switch (ev.eventType) {
          case ionic.Gestures.EVENT_START:
            this.triggered = false;
            break;
          case ionic.Gestures.EVENT_MOVE:
            var scale_threshold = Math.abs(1 - ev.scale);
            var rotation_threshold = Math.abs(ev.rotation);
            if (scale_threshold < inst.options.transform_min_scale && rotation_threshold < inst.options.transform_min_rotation) {
              return;
            }
            ionic.Gestures.detection.current.name = this.name;
            if (!this.triggered) {
              inst.trigger(this.name + 'start', ev);
              this.triggered = true;
            }
            inst.trigger(this.name, ev);
            if (rotation_threshold > inst.options.transform_min_rotation) {
              inst.trigger('rotate', ev);
            }
            if (scale_threshold > inst.options.transform_min_scale) {
              inst.trigger('pinch', ev);
              inst.trigger('pinch' + (ev.scale < 1 ? 'in' : 'out'), ev);
            }
            break;
          case ionic.Gestures.EVENT_END:
            if (this.triggered) {
              inst.trigger(this.name + 'end', ev);
            }
            this.triggered = false;
            break;
          }
        }
      };
      ionic.Gestures.gestures.Touch = {
        name: 'touch',
        index: -Infinity,
        defaults: {
          prevent_default: false,
          prevent_mouseevents: false
        },
        handler: function touchGesture(ev, inst) {
          if (inst.options.prevent_mouseevents && ev.pointerType == ionic.Gestures.POINTER_MOUSE) {
            ev.stopDetect();
            return;
          }
          if (inst.options.prevent_default) {
            ev.preventDefault();
          }
          if (ev.eventType == ionic.Gestures.EVENT_START) {
            inst.trigger(this.name, ev);
          }
        }
      };
      ionic.Gestures.gestures.Release = {
        name: 'release',
        index: Infinity,
        handler: function releaseGesture(ev, inst) {
          if (ev.eventType == ionic.Gestures.EVENT_END) {
            inst.trigger(this.name, ev);
          }
        }
      };
    }(window.ionic));
    (function (window, document, ionic) {
      ionic.Platform = {
        isReady: false,
        isFullScreen: false,
        platforms: null,
        grade: null,
        ua: navigator.userAgent,
        ready: function (cb) {
          if (this.isReady) {
            cb();
          } else {
            readyCallbacks.push(cb);
          }
        },
        detect: function () {
          ionic.Platform._checkPlatforms();
          ionic.requestAnimationFrame(function () {
            for (var i = 0; i < ionic.Platform.platforms.length; i++) {
              document.body.classList.add('platform-' + ionic.Platform.platforms[i]);
            }
            document.body.classList.add('grade-' + ionic.Platform.grade);
          });
        },
        device: function () {
          if (window.device)
            return window.device;
          if (this.isWebView())
            void 0;
          return {};
        },
        _checkPlatforms: function (platforms) {
          this.platforms = [];
          this.grade = 'a';
          if (this.isWebView()) {
            this.platforms.push('webview');
            this.platforms.push('cordova');
          }
          if (this.isIPad())
            this.platforms.push('ipad');
          var platform = this.platform();
          if (platform) {
            this.platforms.push(platform);
            var version = this.version();
            if (version) {
              var v = version.toString();
              if (v.indexOf('.') > 0) {
                v = v.replace('.', '_');
              } else {
                v += '_0';
              }
              this.platforms.push(platform + v.split('_')[0]);
              this.platforms.push(platform + v);
              if (this.isAndroid() && version < 4.4) {
                this.grade = version < 4 ? 'c' : 'b';
              }
            }
          }
        },
        isWebView: function () {
          return !(!window.cordova && !window.PhoneGap && !window.phonegap);
        },
        isIPad: function () {
          return this.ua.toLowerCase().indexOf('ipad') >= 0;
        },
        isIOS: function () {
          return this.is('ios');
        },
        isAndroid: function () {
          return this.is('android');
        },
        platform: function () {
          if (platformName === null)
            this.setPlatform(this.device().platform);
          return platformName;
        },
        setPlatform: function (n) {
          if (typeof n != 'undefined' && n !== null && n.length) {
            platformName = n.toLowerCase();
          } else if (this.ua.indexOf('Android') > 0) {
            platformName = 'android';
          } else if (this.ua.indexOf('iPhone') > -1 || this.ua.indexOf('iPad') > -1 || this.ua.indexOf('iPod') > -1) {
            platformName = 'ios';
          } else {
            platformName = '';
          }
        },
        version: function () {
          if (platformVersion === null)
            this.setVersion(this.device().version);
          return platformVersion;
        },
        setVersion: function (v) {
          if (typeof v != 'undefined' && v !== null) {
            v = v.split('.');
            v = parseFloat(v[0] + '.' + (v.length > 1 ? v[1] : 0));
            if (!isNaN(v)) {
              platformVersion = v;
              return;
            }
          }
          platformVersion = 0;
          var pName = this.platform();
          var versionMatch = {
              'android': /Android (\d+).(\d+)?/,
              'ios': /OS (\d+)_(\d+)?/
            };
          if (versionMatch[pName]) {
            v = this.ua.match(versionMatch[pName]);
            if (v.length > 2) {
              platformVersion = parseFloat(v[1] + '.' + v[2]);
            }
          }
        },
        is: function (type) {
          type = type.toLowerCase();
          if (this.platforms) {
            for (var x = 0; x < this.platforms.length; x++) {
              if (this.platforms[x] === type)
                return true;
            }
          }
          var pName = this.platform();
          if (pName) {
            return pName === type.toLowerCase();
          }
          return this.ua.toLowerCase().indexOf(type) >= 0;
        },
        exitApp: function () {
          this.ready(function () {
            navigator.app && navigator.app.exitApp && navigator.app.exitApp();
          });
        },
        showStatusBar: function (val) {
          this._showStatusBar = val;
          this.ready(function () {
            ionic.requestAnimationFrame(function () {
              if (ionic.Platform._showStatusBar) {
                window.StatusBar && window.StatusBar.show();
                document.body.classList.remove('status-bar-hide');
              } else {
                window.StatusBar && window.StatusBar.hide();
                document.body.classList.add('status-bar-hide');
              }
            });
          });
        },
        fullScreen: function (showFullScreen, showStatusBar) {
          this.isFullScreen = showFullScreen !== false;
          ionic.DomUtil.ready(function () {
            ionic.requestAnimationFrame(function () {
              if (ionic.Platform.isFullScreen) {
                document.body.classList.add('fullscreen');
              } else {
                document.body.classList.remove('fullscreen');
              }
            });
            ionic.Platform.showStatusBar(showStatusBar === true);
          });
        }
      };
      var platformName = null, platformVersion = null, readyCallbacks = [];
      function onWindowLoad() {
        if (ionic.Platform.isWebView()) {
          document.addEventListener('deviceready', onPlatformReady, false);
        } else {
          onPlatformReady();
        }
        window.removeEventListener('load', onWindowLoad, false);
      }
      window.addEventListener('load', onWindowLoad, false);
      function onPlatformReady() {
        ionic.Platform.isReady = true;
        ionic.Platform.detect();
        for (var x = 0; x < readyCallbacks.length; x++) {
          readyCallbacks[x]();
        }
        readyCallbacks = [];
        ionic.trigger('platformready', { target: document });
        ionic.requestAnimationFrame(function () {
          document.body.classList.add('platform-ready');
        });
      }
    }(this, document, ionic));
    (function (document, ionic) {
      'use strict';
      ionic.CSS = {};
      (function () {
        var i, keys = [
            'webkitTransform',
            'transform',
            '-webkit-transform',
            'webkit-transform',
            '-moz-transform',
            'moz-transform',
            'MozTransform',
            'mozTransform'
          ];
        for (i = 0; i < keys.length; i++) {
          if (document.documentElement.style[keys[i]] !== undefined) {
            ionic.CSS.TRANSFORM = keys[i];
            break;
          }
        }
        keys = [
          'webkitTransition',
          'mozTransition',
          'transition'
        ];
        for (i = 0; i < keys.length; i++) {
          if (document.documentElement.style[keys[i]] !== undefined) {
            ionic.CSS.TRANSITION = keys[i];
            break;
          }
        }
      }());
      if (!('classList' in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
        Object.defineProperty(HTMLElement.prototype, 'classList', {
          get: function () {
            var self = this;
            function update(fn) {
              return function () {
                var x, classes = self.className.split(/\s+/);
                for (x = 0; x < arguments.length; x++) {
                  fn(classes, classes.indexOf(arguments[x]), arguments[x]);
                }
                self.className = classes.join(' ');
              };
            }
            return {
              add: update(function (classes, index, value) {
                ~index || classes.push(value);
              }),
              remove: update(function (classes, index) {
                ~index && classes.splice(index, 1);
              }),
              toggle: update(function (classes, index, value) {
                ~index ? classes.splice(index, 1) : classes.push(value);
              }),
              contains: function (value) {
                return !!~self.className.split(/\s+/).indexOf(value);
              },
              item: function (i) {
                return self.className.split(/\s+/)[i] || null;
              }
            };
          }
        });
      }
    }(document, ionic));
    var tapDoc;
    var tapActiveEle;
    var tapEnabledTouchEvents;
    var tapMouseResetTimer;
    var tapPointerMoved;
    var tapPointerStart;
    var tapTouchFocusedInput;
    var TAP_RELEASE_TOLERANCE = 6;
    var tapEventListeners = {
        'click': tapClickGateKeeper,
        'mousedown': tapMouseDown,
        'mouseup': tapMouseUp,
        'mousemove': tapMouseMove,
        'touchstart': tapTouchStart,
        'touchend': tapTouchEnd,
        'touchcancel': tapTouchCancel,
        'touchmove': tapTouchMove,
        'focusin': tapFocusIn,
        'focusout': tapFocusOut
      };
    ionic.tap = {
      register: function (ele) {
        tapDoc = ele;
        tapEventListener('click', true, true);
        tapEventListener('mouseup');
        tapEventListener('mousedown');
        tapEventListener('touchstart');
        tapEventListener('touchend');
        tapEventListener('touchcancel');
        tapEventListener('focusin');
        tapEventListener('focusout');
        return function () {
          for (var type in tapEventListeners) {
            tapEventListener(type, false);
          }
          tapDoc = null;
          tapActiveEle = null;
          tapEnabledTouchEvents = false;
          tapPointerMoved = false;
          tapPointerStart = null;
        };
      },
      ignoreScrollStart: function (e) {
        return e.defaultPrevented || e.target.isContentEditable || e.target.type === 'range' || (e.target.dataset ? e.target.dataset.preventScroll : e.target.getAttribute('data-prevent-default')) == 'true' || !!/object|embed/i.test(e.target.tagName);
      },
      isTextInput: function (ele) {
        return !!ele && (ele.tagName == 'TEXTAREA' || ele.contentEditable === 'true' || ele.tagName == 'INPUT' && !/radio|checkbox|range|file|submit|reset/i.test(ele.type));
      },
      isLabelWithTextInput: function (ele) {
        var container = tapContainingElement(ele, false);
        return !!container && ionic.tap.isTextInput(tapTargetElement(container));
      },
      containsOrIsTextInput: function (ele) {
        return ionic.tap.isTextInput(ele) || ionic.tap.isLabelWithTextInput(ele);
      },
      cloneFocusedInput: function (container, scrollIntance) {
        if (ionic.tap.hasCheckedClone)
          return;
        ionic.tap.hasCheckedClone = true;
        ionic.requestAnimationFrame(function () {
          var focusInput = container.querySelector(':focus');
          if (ionic.tap.isTextInput(focusInput)) {
            var clonedInput = focusInput.parentElement.querySelector('.cloned-text-input');
            if (!clonedInput) {
              clonedInput = document.createElement(focusInput.tagName);
              clonedInput.type = focusInput.type;
              clonedInput.value = focusInput.value;
              clonedInput.className = 'cloned-text-input';
              clonedInput.readOnly = true;
              focusInput.parentElement.insertBefore(clonedInput, focusInput);
              focusInput.style.top = focusInput.offsetTop;
              focusInput.classList.add('previous-input-focus');
            }
          }
        });
      },
      hasCheckedClone: false,
      removeClonedInputs: function (container, scrollIntance) {
        ionic.tap.hasCheckedClone = false;
        ionic.requestAnimationFrame(function () {
          var clonedInputs = container.querySelectorAll('.cloned-text-input');
          var previousInputFocus = container.querySelectorAll('.previous-input-focus');
          var x;
          for (x = 0; x < clonedInputs.length; x++) {
            clonedInputs[x].parentElement.removeChild(clonedInputs[x]);
          }
          for (x = 0; x < previousInputFocus.length; x++) {
            previousInputFocus[x].classList.remove('previous-input-focus');
            previousInputFocus[x].style.top = '';
            previousInputFocus[x].focus();
          }
        });
      }
    };
    function tapEventListener(type, enable, useCapture) {
      if (enable !== false) {
        tapDoc.addEventListener(type, tapEventListeners[type], useCapture);
      } else {
        tapDoc.removeEventListener(type, tapEventListeners[type]);
      }
    }
    function tapClick(e) {
      var container = tapContainingElement(e.target);
      var ele = tapTargetElement(container);
      if (tapRequiresNativeClick(ele) || tapPointerMoved)
        return false;
      var c = getPointerCoordinates(e);
      void 0;
      triggerMouseEvent('click', ele, c.x, c.y);
      tapHandleFocus(ele);
    }
    function triggerMouseEvent(type, ele, x, y) {
      var clickEvent = document.createEvent('MouseEvents');
      clickEvent.initMouseEvent(type, true, true, window, 1, 0, 0, x, y, false, false, false, false, 0, null);
      clickEvent.isIonicTap = true;
      ele.dispatchEvent(clickEvent);
    }
    function tapClickGateKeeper(e) {
      if (e.target.type == 'submit' && e.detail === 0) {
        return;
      }
      if (ionic.scroll.isScrolling && ionic.tap.containsOrIsTextInput(e.target) || !e.isIonicTap && !tapRequiresNativeClick(e.target)) {
        void 0;
        e.stopPropagation();
        if (!ionic.tap.isLabelWithTextInput(e.target)) {
          e.preventDefault();
        }
        return false;
      }
    }
    function tapRequiresNativeClick(ele) {
      if (!ele || ele.disabled || /file|range/i.test(ele.type) || /object|video/i.test(ele.tagName)) {
        return true;
      }
      if (ele.nodeType === 1) {
        var element = ele;
        while (element) {
          if ((element.dataset ? element.dataset.tapDisabled : element.getAttribute('data-tap-disabled')) == 'true') {
            return true;
          }
          element = element.parentElement;
        }
      }
      return false;
    }
    function tapMouseDown(e) {
      if (e.isIonicTap || tapIgnoreEvent(e))
        return;
      if (tapEnabledTouchEvents) {
        void 0;
        e.stopPropagation();
        if (!ionic.tap.isTextInput(e.target)) {
          e.preventDefault();
        }
        return false;
      }
      tapPointerMoved = false;
      tapPointerStart = getPointerCoordinates(e);
      tapEventListener('mousemove');
      ionic.activator.start(e);
    }
    function tapMouseUp(e) {
      if (tapEnabledTouchEvents) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      if (tapIgnoreEvent(e))
        return;
      if (!tapHasPointerMoved(e)) {
        tapClick(e);
      }
      tapEventListener('mousemove', false);
      ionic.activator.end();
      tapPointerMoved = false;
    }
    function tapMouseMove(e) {
      if (tapHasPointerMoved(e)) {
        tapEventListener('mousemove', false);
        ionic.activator.end();
        tapPointerMoved = true;
        return false;
      }
    }
    function tapTouchStart(e) {
      if (tapIgnoreEvent(e))
        return;
      tapPointerMoved = false;
      tapEnableTouchEvents();
      tapPointerStart = getPointerCoordinates(e);
      tapEventListener('touchmove');
      ionic.activator.start(e);
      if (ionic.Platform.isIOS() && ionic.tap.isLabelWithTextInput(e.target)) {
        var textInput = tapTargetElement(tapContainingElement(e.target));
        if (textInput !== tapActiveEle) {
          e.preventDefault();
        }
      }
    }
    function tapTouchEnd(e) {
      if (tapIgnoreEvent(e))
        return;
      tapEnableTouchEvents();
      if (!tapHasPointerMoved(e)) {
        tapClick(e);
      }
      tapTouchCancel();
    }
    function tapTouchMove(e) {
      if (tapHasPointerMoved(e)) {
        tapPointerMoved = true;
        tapEventListener('touchmove', false);
        ionic.activator.end();
        return false;
      }
    }
    function tapTouchCancel(e) {
      tapEventListener('touchmove', false);
      ionic.activator.end();
      tapPointerMoved = false;
    }
    function tapEnableTouchEvents() {
      tapEnabledTouchEvents = true;
      clearTimeout(tapMouseResetTimer);
      tapMouseResetTimer = setTimeout(function () {
        tapEnabledTouchEvents = false;
      }, 2000);
    }
    function tapIgnoreEvent(e) {
      if (e.isTapHandled)
        return true;
      e.isTapHandled = true;
      if (ionic.scroll.isScrolling && ionic.tap.containsOrIsTextInput(e.target)) {
        e.preventDefault();
        return true;
      }
    }
    function tapHandleFocus(ele) {
      tapTouchFocusedInput = null;
      var triggerFocusIn = false;
      if (ele.tagName == 'SELECT') {
        triggerMouseEvent('mousedown', ele, 0, 0);
        ele.focus && ele.focus();
        triggerFocusIn = true;
      } else if (tapActiveElement() === ele) {
        triggerFocusIn = true;
      } else if (/input|textarea/i.test(ele.tagName)) {
        triggerFocusIn = true;
        ele.focus && ele.focus();
        ele.value = ele.value;
        if (tapEnabledTouchEvents) {
          tapTouchFocusedInput = ele;
        }
      } else {
        tapFocusOutActive();
      }
      if (triggerFocusIn) {
        tapActiveElement(ele);
        ionic.trigger('ionic.focusin', { target: ele }, true);
      }
    }
    function tapFocusOutActive() {
      var ele = tapActiveElement();
      if (ele && /input|textarea|select/i.test(ele.tagName)) {
        void 0;
        ele.blur();
      }
      tapActiveElement(null);
    }
    function tapFocusIn(e) {
      if (tapEnabledTouchEvents && ionic.tap.isTextInput(tapActiveElement()) && ionic.tap.isTextInput(tapTouchFocusedInput) && tapTouchFocusedInput !== e.target) {
        void 0;
        tapTouchFocusedInput.focus();
        tapTouchFocusedInput = null;
      }
      ionic.scroll.isScrolling = false;
    }
    function tapFocusOut() {
      tapActiveElement(null);
    }
    function tapActiveElement(ele) {
      if (arguments.length) {
        tapActiveEle = ele;
      }
      return tapActiveEle || document.activeElement;
    }
    function tapHasPointerMoved(endEvent) {
      if (!endEvent || !tapPointerStart || tapPointerStart.x === 0 && tapPointerStart.y === 0) {
        return false;
      }
      var endCoordinates = getPointerCoordinates(endEvent);
      return Math.abs(tapPointerStart.x - endCoordinates.x) > TAP_RELEASE_TOLERANCE || Math.abs(tapPointerStart.y - endCoordinates.y) > TAP_RELEASE_TOLERANCE;
    }
    function getPointerCoordinates(event) {
      var c = {
          x: 0,
          y: 0
        };
      if (event) {
        var touches = event.touches && event.touches.length ? event.touches : [event];
        var e = event.changedTouches && event.changedTouches[0] || touches[0];
        if (e) {
          c.x = e.clientX || e.pageX || 0;
          c.y = e.clientY || e.pageY || 0;
        }
      }
      return c;
    }
    function tapContainingElement(ele, allowSelf) {
      var climbEle = ele;
      for (var x = 0; x < 6; x++) {
        if (!climbEle)
          break;
        if (climbEle.tagName === 'LABEL')
          return climbEle;
        climbEle = ele.parentElement;
      }
      if (allowSelf !== false)
        return ele;
    }
    function tapTargetElement(ele) {
      if (ele && ele.tagName === 'LABEL') {
        if (ele.control)
          return ele.control;
        if (ele.querySelector) {
          var control = ele.querySelector('input,textarea,select');
          if (control)
            return control;
        }
      }
      return ele;
    }
    ionic.DomUtil.ready(function () {
      ionic.tap.register(document);
    });
    (function (document, ionic) {
      'use strict';
      var queueElements = {};
      var activeElements = {};
      var keyId = 0;
      var ACTIVATED_CLASS = 'activated';
      ionic.activator = {
        start: function (e) {
          var self = this;
          ionic.requestAnimationFrame(function () {
            if (tapRequiresNativeClick(e.target))
              return;
            var ele = e.target;
            var eleToActivate;
            for (var x = 0; x < 4; x++) {
              if (!ele || ele.nodeType !== 1)
                break;
              if (eleToActivate && ele.classList.contains('item')) {
                eleToActivate = ele;
                break;
              }
              if (ele.tagName == 'A' || ele.tagName == 'BUTTON' || ele.hasAttribute('ng-click')) {
                eleToActivate = ele;
              }
              if (ele.classList.contains('button')) {
                eleToActivate = ele;
                break;
              }
              ele = ele.parentElement;
            }
            if (eleToActivate) {
              queueElements[keyId] = eleToActivate;
              if (e.type === 'touchstart') {
                self._activateTimeout = setTimeout(activateElements, 80);
              } else {
                ionic.requestAnimationFrame(activateElements);
              }
              keyId = keyId > 19 ? 0 : keyId + 1;
            }
          });
        },
        end: function () {
          clearTimeout(this._activateTimeout);
          setTimeout(clear, 200);
        }
      };
      function clear() {
        queueElements = {};
        ionic.requestAnimationFrame(deactivateElements);
      }
      function activateElements() {
        void 0;
        for (var key in queueElements) {
          if (queueElements[key]) {
            queueElements[key].classList.add(ACTIVATED_CLASS);
            activeElements[key] = queueElements[key];
          }
        }
        queueElements = {};
      }
      function deactivateElements() {
        for (var key in activeElements) {
          if (activeElements[key]) {
            activeElements[key].classList.remove(ACTIVATED_CLASS);
            delete activeElements[key];
          }
        }
      }
    }(document, ionic));
    (function (ionic) {
      var uid = [
          '0',
          '0',
          '0'
        ];
      ionic.Utils = {
        arrayMove: function (arr, old_index, new_index) {
          if (new_index >= arr.length) {
            var k = new_index - arr.length;
            while (k-- + 1) {
              arr.push(undefined);
            }
          }
          arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
          return arr;
        },
        proxy: function (func, context) {
          var args = Array.prototype.slice.call(arguments, 2);
          return function () {
            return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
          };
        },
        debounce: function (func, wait, immediate) {
          var timeout, args, context, timestamp, result;
          return function () {
            context = this;
            args = arguments;
            timestamp = new Date();
            var later = function () {
              var last = new Date() - timestamp;
              if (last < wait) {
                timeout = setTimeout(later, wait - last);
              } else {
                timeout = null;
                if (!immediate)
                  result = func.apply(context, args);
              }
            };
            var callNow = immediate && !timeout;
            if (!timeout) {
              timeout = setTimeout(later, wait);
            }
            if (callNow)
              result = func.apply(context, args);
            return result;
          };
        },
        throttle: function (func, wait, options) {
          var context, args, result;
          var timeout = null;
          var previous = 0;
          options || (options = {});
          var later = function () {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
          };
          return function () {
            var now = Date.now();
            if (!previous && options.leading === false)
              previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
              clearTimeout(timeout);
              timeout = null;
              previous = now;
              result = func.apply(context, args);
            } else if (!timeout && options.trailing !== false) {
              timeout = setTimeout(later, remaining);
            }
            return result;
          };
        },
        inherit: function (protoProps, staticProps) {
          var parent = this;
          var child;
          if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
          } else {
            child = function () {
              return parent.apply(this, arguments);
            };
          }
          ionic.extend(child, parent, staticProps);
          var Surrogate = function () {
            this.constructor = child;
          };
          Surrogate.prototype = parent.prototype;
          child.prototype = new Surrogate();
          if (protoProps)
            ionic.extend(child.prototype, protoProps);
          child.__super__ = parent.prototype;
          return child;
        },
        extend: function (obj) {
          var args = Array.prototype.slice.call(arguments, 1);
          for (var i = 0; i < args.length; i++) {
            var source = args[i];
            if (source) {
              for (var prop in source) {
                obj[prop] = source[prop];
              }
            }
          }
          return obj;
        },
        nextUid: function () {
          var index = uid.length;
          var digit;
          while (index) {
            index--;
            digit = uid[index].charCodeAt(0);
            if (digit == 57) {
              uid[index] = 'A';
              return uid.join('');
            }
            if (digit == 90) {
              uid[index] = '0';
            } else {
              uid[index] = String.fromCharCode(digit + 1);
              return uid.join('');
            }
          }
          uid.unshift('0');
          return uid.join('');
        }
      };
      ionic.inherit = ionic.Utils.inherit;
      ionic.extend = ionic.Utils.extend;
      ionic.throttle = ionic.Utils.throttle;
      ionic.proxy = ionic.Utils.proxy;
      ionic.debounce = ionic.Utils.debounce;
    }(window.ionic));
    var keyboardViewportHeight = window.innerHeight;
    var keyboardIsOpen;
    var keyboardActiveElement;
    var keyboardFocusOutTimer;
    var keyboardFocusInTimer;
    var KEYBOARD_OPEN_CSS = 'keyboard-open';
    var SCROLL_CONTAINER_CSS = 'scroll';
    ionic.keyboard = {
      isOpen: false,
      height: null
    };
    function keyboardInit() {
      if (keyboardHasPlugin()) {
        window.addEventListener('native.showkeyboard', keyboardNativeShow);
      }
      document.body.addEventListener('ionic.focusin', keyboardBrowserFocusIn);
      document.body.addEventListener('focusin', keyboardBrowserFocusIn);
      document.body.addEventListener('focusout', keyboardFocusOut);
      document.body.addEventListener('orientationchange', keyboardOrientationChange);
      document.removeEventListener('touchstart', keyboardInit);
    }
    function keyboardNativeShow(e) {
      ionic.keyboard.height = e.keyboardHeight;
    }
    function keyboardBrowserFocusIn(e) {
      if (!e.target || !ionic.tap.isTextInput(e.target) || !keyboardIsWithinScroll(e.target))
        return;
      document.addEventListener('keydown', keyboardOnKeyDown, false);
      document.body.scrollTop = 0;
      document.body.querySelector('.scroll-content').scrollTop = 0;
      keyboardActiveElement = e.target;
      keyboardSetShow(e);
    }
    function keyboardSetShow(e) {
      clearTimeout(keyboardFocusInTimer);
      clearTimeout(keyboardFocusOutTimer);
      keyboardFocusInTimer = setTimeout(function () {
        var keyboardHeight = keyboardGetHeight();
        var elementBounds = keyboardActiveElement.getBoundingClientRect();
        keyboardShow(e.target, elementBounds.top, elementBounds.bottom, keyboardViewportHeight, keyboardHeight);
      }, 32);
    }
    function keyboardShow(element, elementTop, elementBottom, viewportHeight, keyboardHeight) {
      var details = {
          target: element,
          elementTop: Math.round(elementTop),
          elementBottom: Math.round(elementBottom),
          keyboardHeight: keyboardHeight
        };
      if (keyboardIsOverWebView()) {
        details.contentHeight = viewportHeight - keyboardHeight;
      } else {
        details.contentHeight = viewportHeight;
      }
      void 0;
      details.keyboardTopOffset = details.elementTop - details.contentHeight;
      void 0;
      details.isElementUnderKeyboard = details.elementBottom > details.contentHeight;
      ionic.keyboard.isOpen = true;
      keyboardActiveElement = element;
      ionic.trigger('scrollChildIntoView', details, true);
      ionic.requestAnimationFrame(function () {
        document.body.classList.add(KEYBOARD_OPEN_CSS);
      });
      document.addEventListener('touchmove', keyboardPreventDefault, false);
      return details;
    }
    function keyboardFocusOut(e) {
      clearTimeout(keyboardFocusInTimer);
      clearTimeout(keyboardFocusOutTimer);
      keyboardFocusOutTimer = setTimeout(keyboardHide, 350);
    }
    function keyboardHide() {
      void 0;
      ionic.keyboard.isOpen = false;
      ionic.trigger('resetScrollView', { target: keyboardActiveElement }, true);
      ionic.requestAnimationFrame(function () {
        document.body.classList.remove(KEYBOARD_OPEN_CSS);
      });
      document.removeEventListener('touchmove', keyboardPreventDefault);
      document.removeEventListener('keydown', keyboardOnKeyDown);
    }
    function keyboardUpdateViewportHeight() {
      if (window.innerHeight > keyboardViewportHeight) {
        keyboardViewportHeight = window.innerHeight;
      }
    }
    function keyboardOnKeyDown(e) {
      if (ionic.scroll.isScrolling) {
        keyboardPreventDefault(e);
      }
    }
    function keyboardPreventDefault(e) {
      e.preventDefault();
    }
    function keyboardOrientationChange() {
      keyboardViewportHeight = window.innerHeight;
      setTimeout(function () {
        keyboardViewportHeight = window.innerHeight;
      }, 999);
    }
    function keyboardGetHeight() {
      if (ionic.keyboard.height) {
        return ionic.keyboard.height;
      }
      if (ionic.Platform.isIOS()) {
        if (ionic.Platform.isWebView()) {
          return 260;
        }
        return 216;
      } else if (ionic.Platform.isAndroid()) {
        if (ionic.Platform.isWebView()) {
          return 220;
        }
        if (ionic.Platform.version() <= 4.3) {
          return 230;
        }
      }
      return 275;
    }
    function keyboardIsWithinScroll(ele) {
      while (ele) {
        if (ele.classList.contains(SCROLL_CONTAINER_CSS)) {
          return true;
        }
        ele = ele.parentElement;
      }
      return false;
    }
    function keyboardIsOverWebView() {
      return ionic.Platform.isIOS() || ionic.Platform.isAndroid() && !ionic.Platform.isWebView();
    }
    function keyboardHasPlugin() {
      return !!(window.cordova && cordova.plugins && cordova.plugins.Keyboard);
    }
    ionic.Platform.ready(function () {
      keyboardUpdateViewportHeight();
      setTimeout(keyboardUpdateViewportHeight, 999);
      document.addEventListener('touchstart', keyboardInit, false);
    });
    var viewportTag;
    var viewportProperties = {};
    function viewportLoadTag() {
      var x;
      for (x = 0; x < document.head.children.length; x++) {
        if (document.head.children[x].name == 'viewport') {
          viewportTag = document.head.children[x];
          break;
        }
      }
      if (viewportTag) {
        var props = viewportTag.content.toLowerCase().replace(/\s+/g, '').split(',');
        var keyValue;
        for (x = 0; x < props.length; x++) {
          keyValue = props[x].split('=');
          if (keyValue.length == 2)
            viewportProperties[keyValue[0]] = keyValue[1];
        }
        viewportInitWebView();
      }
    }
    function viewportInitWebView() {
      var hasViewportChange = false;
      if (ionic.Platform.isWebView()) {
        if (viewportProperties.height != 'device-height') {
          viewportProperties.height = 'device-height';
          hasViewportChange = true;
        }
      } else if (viewportProperties.height) {
        delete viewportProperties.height;
        hasViewportChange = true;
      }
      if (hasViewportChange)
        viewportUpdate();
    }
    function viewportUpdate(updates) {
      if (!viewportTag)
        return;
      ionic.Utils.extend(viewportProperties, updates);
      var key, props = [];
      for (key in viewportProperties) {
        if (viewportProperties[key])
          props.push(key + '=' + viewportProperties[key]);
      }
      viewportTag.content = props.join(',');
    }
    ionic.DomUtil.ready(function () {
      viewportLoadTag();
    });
    (function (ionic) {
      'use strict';
      ionic.views.View = function () {
        this.initialize.apply(this, arguments);
      };
      ionic.views.View.inherit = ionic.inherit;
      ionic.extend(ionic.views.View.prototype, {
        initialize: function () {
        }
      });
    }(window.ionic));
    (function (global) {
      var time = Date.now || function () {
          return +new Date();
        };
      var desiredFrames = 60;
      var millisecondsPerSecond = 1000;
      var running = {};
      var counter = 1;
      if (!global.core) {
        global.core = { effect: {} };
      }
      var core = global.core;
      if (!core.effect) {
        core.effect = {};
      }
      core.effect.Animate = {
        requestAnimationFrame: function () {
          var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame;
          var isNative = !!requestFrame;
          if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
            isNative = false;
          }
          if (isNative) {
            return function (callback, root) {
              requestFrame(callback, root);
            };
          }
          var TARGET_FPS = 60;
          var requests = {};
          var requestCount = 0;
          var rafHandle = 1;
          var intervalHandle = null;
          var lastActive = +new Date();
          return function (callback, root) {
            var callbackHandle = rafHandle++;
            requests[callbackHandle] = callback;
            requestCount++;
            if (intervalHandle === null) {
              intervalHandle = setInterval(function () {
                var time = +new Date();
                var currentRequests = requests;
                requests = {};
                requestCount = 0;
                for (var key in currentRequests) {
                  if (currentRequests.hasOwnProperty(key)) {
                    currentRequests[key](time);
                    lastActive = time;
                  }
                }
                if (time - lastActive > 2500) {
                  clearInterval(intervalHandle);
                  intervalHandle = null;
                }
              }, 1000 / TARGET_FPS);
            }
            return callbackHandle;
          };
        }(),
        stop: function (id) {
          var cleared = running[id] != null;
          if (cleared) {
            running[id] = null;
          }
          return cleared;
        },
        isRunning: function (id) {
          return running[id] != null;
        },
        start: function (stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
          var start = time();
          var lastFrame = start;
          var percent = 0;
          var dropCounter = 0;
          var id = counter++;
          if (!root) {
            root = document.body;
          }
          if (id % 20 === 0) {
            var newRunning = {};
            for (var usedId in running) {
              newRunning[usedId] = true;
            }
            running = newRunning;
          }
          var step = function (virtual) {
            var render = virtual !== true;
            var now = time();
            if (!running[id] || verifyCallback && !verifyCallback(id)) {
              running[id] = null;
              completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, false);
              return;
            }
            if (render) {
              var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
              for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
                step(true);
                dropCounter++;
              }
            }
            if (duration) {
              percent = (now - start) / duration;
              if (percent > 1) {
                percent = 1;
              }
            }
            var value = easingMethod ? easingMethod(percent) : percent;
            if ((stepCallback(value, now, render) === false || percent === 1) && render) {
              running[id] = null;
              completedCallback && completedCallback(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, percent === 1 || duration == null);
            } else if (render) {
              lastFrame = now;
              core.effect.Animate.requestAnimationFrame(step, root);
            }
          };
          running[id] = true;
          core.effect.Animate.requestAnimationFrame(step, root);
          return id;
        }
      };
    }(this));
    var Scroller;
    (function (ionic) {
      var NOOP = function () {
      };
      var easeOutCubic = function (pos) {
        return Math.pow(pos - 1, 3) + 1;
      };
      var easeInOutCubic = function (pos) {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 3);
        }
        return 0.5 * (Math.pow(pos - 2, 3) + 2);
      };
      ionic.views.Scroll = ionic.views.View.inherit({
        initialize: function (options) {
          var self = this;
          this.__container = options.el;
          this.__content = options.el.firstElementChild;
          setTimeout(function () {
            if (self.__container && self.__content) {
              self.__container.scrollTop = 0;
              self.__content.scrollTop = 0;
            }
          });
          this.options = {
            scrollingX: false,
            scrollbarX: true,
            scrollingY: true,
            scrollbarY: true,
            startX: 0,
            startY: 0,
            wheelDampen: 6,
            minScrollbarSizeX: 5,
            minScrollbarSizeY: 5,
            scrollbarsFade: true,
            scrollbarFadeDelay: 300,
            scrollbarResizeFadeDelay: 1000,
            animating: true,
            animationDuration: 250,
            bouncing: true,
            locking: true,
            paging: false,
            snapping: false,
            zooming: false,
            minZoom: 0.5,
            maxZoom: 3,
            speedMultiplier: 1,
            scrollingComplete: NOOP,
            penetrationDeceleration: 0.03,
            penetrationAcceleration: 0.08,
            scrollEventInterval: 10,
            getContentWidth: function () {
              return Math.max(self.__content.scrollWidth, self.__content.offsetWidth);
            },
            getContentHeight: function () {
              return Math.max(self.__content.scrollHeight, self.__content.offsetHeight);
            }
          };
          for (var key in options) {
            this.options[key] = options[key];
          }
          this.hintResize = ionic.debounce(function () {
            self.resize();
          }, 1000, true);
          this.onScroll = function (scrollTop) {
            if (!ionic.scroll.isScrolling) {
              setTimeout(self.setScrollStart, 50);
            } else {
              clearTimeout(self.scrollTimer);
              self.scrollTimer = setTimeout(self.setScrollStop, 80);
            }
          };
          this.setScrollStart = function () {
            ionic.scroll.isScrolling = Math.abs(ionic.scroll.lastTop - self.__scrollTop) > 1;
            clearTimeout(self.scrollTimer);
            self.scrollTimer = setTimeout(self.setScrollStop, 80);
          };
          this.setScrollStop = function () {
            ionic.scroll.isScrolling = false;
            ionic.scroll.lastTop = self.__scrollTop;
          };
          this.triggerScrollEvent = ionic.throttle(function () {
            ionic.trigger('scroll', {
              scrollTop: self.__scrollTop,
              scrollLeft: self.__scrollLeft,
              target: self.__container
            });
          }, this.options.scrollEventInterval);
          this.triggerScrollEndEvent = function () {
            ionic.trigger('scrollend', {
              scrollTop: self.__scrollTop,
              scrollLeft: self.__scrollLeft,
              target: self.__container
            });
          };
          this.__scrollLeft = this.options.startX;
          this.__scrollTop = this.options.startY;
          this.__callback = this.getRenderFn();
          this.__initEventHandlers();
          this.__createScrollbars();
        },
        run: function () {
          this.resize();
          this.__fadeScrollbars('out', this.options.scrollbarResizeFadeDelay);
        },
        __isSingleTouch: false,
        __isTracking: false,
        __didDecelerationComplete: false,
        __isGesturing: false,
        __isDragging: false,
        __isDecelerating: false,
        __isAnimating: false,
        __clientLeft: 0,
        __clientTop: 0,
        __clientWidth: 0,
        __clientHeight: 0,
        __contentWidth: 0,
        __contentHeight: 0,
        __snapWidth: 100,
        __snapHeight: 100,
        __refreshHeight: null,
        __refreshActive: false,
        __refreshActivate: null,
        __refreshDeactivate: null,
        __refreshStart: null,
        __zoomLevel: 1,
        __scrollLeft: 0,
        __scrollTop: 0,
        __maxScrollLeft: 0,
        __maxScrollTop: 0,
        __scheduledLeft: 0,
        __scheduledTop: 0,
        __scheduledZoom: 0,
        __lastTouchLeft: null,
        __lastTouchTop: null,
        __lastTouchMove: null,
        __positions: null,
        __minDecelerationScrollLeft: null,
        __minDecelerationScrollTop: null,
        __maxDecelerationScrollLeft: null,
        __maxDecelerationScrollTop: null,
        __decelerationVelocityX: null,
        __decelerationVelocityY: null,
        __transformProperty: null,
        __perspectiveProperty: null,
        __indicatorX: null,
        __indicatorY: null,
        __scrollbarFadeTimeout: null,
        __didWaitForSize: null,
        __sizerTimeout: null,
        __initEventHandlers: function () {
          var self = this;
          var container = this.__container;
          container.addEventListener('scrollChildIntoView', function (e) {
            if (!self.isScrolledIntoView) {
              container.style.height = container.clientHeight - e.detail.keyboardHeight + 'px';
              container.style.overflow = 'visible';
              self.isScrolledIntoView = true;
              self.resize();
            }
            if (e.detail.isElementUnderKeyboard) {
              ionic.scroll.isScrolling = true;
              setTimeout(function () {
                var scrollViewMidpointOffset = container.clientHeight * 0.5;
                var scrollTop = e.detail.keyboardTopOffset + scrollViewMidpointOffset;
                void 0;
                ionic.tap.cloneFocusedInput(container, self);
                self.scrollBy(0, scrollTop, true);
                self.onScroll();
              }, ionic.Platform.isIOS() ? 80 : 350);
            }
            e.stopPropagation();
          });
          container.addEventListener('resetScrollView', function (e) {
            self.isScrolledIntoView = false;
            container.style.height = '';
            container.style.overflow = '';
            self.resize();
            ionic.scroll.isScrolling = false;
          });
          self.touchStart = function (e) {
            self.startCoordinates = getPointerCoordinates(e);
            if (ionic.tap.ignoreScrollStart(e)) {
              return;
            }
            if (ionic.tap.containsOrIsTextInput(e.target)) {
              self.__hasStarted = false;
              return;
            }
            self.__isSelectable = true;
            self.__enableScrollY = true;
            self.__hasStarted = true;
            self.doTouchStart(e.touches, e.timeStamp);
            e.preventDefault();
          };
          self.touchMove = function (e) {
            if (e.defaultPrevented) {
              return;
            }
            if (!self.__hasStarted && ionic.tap.containsOrIsTextInput(e.target)) {
              self.__hasStarted = true;
              self.doTouchStart(e.touches, e.timeStamp);
              e.preventDefault();
              return;
            }
            if (self.startCoordinates) {
              var currentCoordinates = getPointerCoordinates(e);
              if (self.__isSelectable && ionic.tap.isTextInput(e.target) && Math.abs(self.startCoordinates.x - currentCoordinates.x) > 20) {
                self.__enableScrollY = false;
                self.__isSelectable = true;
              }
              if (self.__enableScrollY && Math.abs(self.startCoordinates.y - currentCoordinates.y) > 10) {
                self.__isSelectable = false;
                ionic.tap.cloneFocusedInput(container, self);
              }
            }
            self.doTouchMove(e.touches, e.timeStamp);
          };
          self.touchEnd = function (e) {
            self.doTouchEnd(e.timeStamp);
            self.__hasStarted = false;
            self.__isSelectable = true;
            self.__enableScrollY = true;
            if (!self.__isDragging && !self.__isDecelerating && !self.__isAnimating) {
              ionic.tap.removeClonedInputs(container, self);
            }
          };
          self.options.orgScrollingComplete = self.options.scrollingComplete;
          self.options.scrollingComplete = function () {
            ionic.tap.removeClonedInputs(container, self);
            self.options.orgScrollingComplete();
          };
          if ('ontouchstart' in window) {
            container.addEventListener('touchstart', self.touchStart, false);
            document.addEventListener('touchmove', self.touchMove, false);
            document.addEventListener('touchend', self.touchEnd, false);
            document.addEventListener('touchcancel', self.touchEnd, false);
          } else {
            var mousedown = false;
            container.addEventListener('mousedown', function (e) {
              if (ionic.tap.ignoreScrollStart(e) || e.target.tagName === 'SELECT') {
                return;
              }
              self.doTouchStart([{
                  pageX: e.pageX,
                  pageY: e.pageY
                }], e.timeStamp);
              e.preventDefault();
              mousedown = true;
            }, false);
            document.addEventListener('mousemove', function (e) {
              if (!mousedown || e.defaultPrevented) {
                return;
              }
              self.doTouchMove([{
                  pageX: e.pageX,
                  pageY: e.pageY
                }], e.timeStamp);
              mousedown = true;
            }, false);
            document.addEventListener('mouseup', function (e) {
              if (!mousedown) {
                return;
              }
              self.doTouchEnd(e.timeStamp);
              mousedown = false;
            }, false);
            var wheelShowBarFn = ionic.debounce(function () {
                self.__fadeScrollbars('in');
              }, 500, true);
            var wheelHideBarFn = ionic.debounce(function () {
                self.__fadeScrollbars('out');
              }, 100, false);
            document.addEventListener('mousewheel', function (e) {
              wheelShowBarFn();
              self.scrollBy(e.wheelDeltaX / self.options.wheelDampen, -e.wheelDeltaY / self.options.wheelDampen);
              wheelHideBarFn();
            });
          }
        },
        __createScrollbar: function (direction) {
          var bar = document.createElement('div'), indicator = document.createElement('div');
          indicator.className = 'scroll-bar-indicator';
          if (direction == 'h') {
            bar.className = 'scroll-bar scroll-bar-h';
          } else {
            bar.className = 'scroll-bar scroll-bar-v';
          }
          bar.appendChild(indicator);
          return bar;
        },
        __createScrollbars: function () {
          var indicatorX, indicatorY;
          if (this.options.scrollingX) {
            indicatorX = {
              el: this.__createScrollbar('h'),
              sizeRatio: 1
            };
            indicatorX.indicator = indicatorX.el.children[0];
            if (this.options.scrollbarX) {
              this.__container.appendChild(indicatorX.el);
            }
            this.__indicatorX = indicatorX;
          }
          if (this.options.scrollingY) {
            indicatorY = {
              el: this.__createScrollbar('v'),
              sizeRatio: 1
            };
            indicatorY.indicator = indicatorY.el.children[0];
            if (this.options.scrollbarY) {
              this.__container.appendChild(indicatorY.el);
            }
            this.__indicatorY = indicatorY;
          }
        },
        __resizeScrollbars: function () {
          var self = this;
          if (self.__indicatorX) {
            var width = Math.max(Math.round(self.__clientWidth * self.__clientWidth / self.__contentWidth), 20);
            if (width > self.__contentWidth) {
              width = 0;
            }
            self.__indicatorX.size = width;
            self.__indicatorX.minScale = this.options.minScrollbarSizeX / width;
            self.__indicatorX.indicator.style.width = width + 'px';
            self.__indicatorX.maxPos = self.__clientWidth - width;
            self.__indicatorX.sizeRatio = self.__maxScrollLeft ? self.__indicatorX.maxPos / self.__maxScrollLeft : 1;
          }
          if (self.__indicatorY) {
            var height = Math.max(Math.round(self.__clientHeight * self.__clientHeight / self.__contentHeight), 20);
            if (height > self.__contentHeight) {
              height = 0;
            }
            self.__indicatorY.size = height;
            self.__indicatorY.minScale = this.options.minScrollbarSizeY / height;
            self.__indicatorY.maxPos = self.__clientHeight - height;
            self.__indicatorY.indicator.style.height = height + 'px';
            self.__indicatorY.sizeRatio = self.__maxScrollTop ? self.__indicatorY.maxPos / self.__maxScrollTop : 1;
          }
        },
        __repositionScrollbars: function () {
          var self = this, width, heightScale, widthDiff, heightDiff, x, y, xstop = 0, ystop = 0;
          if (self.__indicatorX) {
            if (self.__indicatorY)
              xstop = 10;
            x = Math.round(self.__indicatorX.sizeRatio * self.__scrollLeft) || 0, widthDiff = self.__scrollLeft - (self.__maxScrollLeft - xstop);
            if (self.__scrollLeft < 0) {
              widthScale = Math.max(self.__indicatorX.minScale, (self.__indicatorX.size - Math.abs(self.__scrollLeft)) / self.__indicatorX.size);
              x = 0;
              self.__indicatorX.indicator.style[self.__transformOriginProperty] = 'left center';
            } else if (widthDiff > 0) {
              widthScale = Math.max(self.__indicatorX.minScale, (self.__indicatorX.size - widthDiff) / self.__indicatorX.size);
              x = self.__indicatorX.maxPos - xstop;
              self.__indicatorX.indicator.style[self.__transformOriginProperty] = 'right center';
            } else {
              x = Math.min(self.__maxScrollLeft, Math.max(0, x));
              widthScale = 1;
            }
            self.__indicatorX.indicator.style[self.__transformProperty] = 'translate3d(' + x + 'px, 0, 0) scaleX(' + widthScale + ')';
          }
          if (self.__indicatorY) {
            y = Math.round(self.__indicatorY.sizeRatio * self.__scrollTop) || 0;
            if (self.__indicatorX)
              ystop = 10;
            heightDiff = self.__scrollTop - (self.__maxScrollTop - ystop);
            if (self.__scrollTop < 0) {
              heightScale = Math.max(self.__indicatorY.minScale, (self.__indicatorY.size - Math.abs(self.__scrollTop)) / self.__indicatorY.size);
              y = 0;
              self.__indicatorY.indicator.style[self.__transformOriginProperty] = 'center top';
            } else if (heightDiff > 0) {
              heightScale = Math.max(self.__indicatorY.minScale, (self.__indicatorY.size - heightDiff) / self.__indicatorY.size);
              y = self.__indicatorY.maxPos - ystop;
              self.__indicatorY.indicator.style[self.__transformOriginProperty] = 'center bottom';
            } else {
              y = Math.min(self.__maxScrollTop, Math.max(0, y));
              heightScale = 1;
            }
            self.__indicatorY.indicator.style[self.__transformProperty] = 'translate3d(0,' + y + 'px, 0) scaleY(' + heightScale + ')';
          }
        },
        __fadeScrollbars: function (direction, delay) {
          var self = this;
          if (!this.options.scrollbarsFade) {
            return;
          }
          var className = 'scroll-bar-fade-out';
          if (self.options.scrollbarsFade === true) {
            clearTimeout(self.__scrollbarFadeTimeout);
            if (direction == 'in') {
              if (self.__indicatorX) {
                self.__indicatorX.indicator.classList.remove(className);
              }
              if (self.__indicatorY) {
                self.__indicatorY.indicator.classList.remove(className);
              }
            } else {
              self.__scrollbarFadeTimeout = setTimeout(function () {
                if (self.__indicatorX) {
                  self.__indicatorX.indicator.classList.add(className);
                }
                if (self.__indicatorY) {
                  self.__indicatorY.indicator.classList.add(className);
                }
              }, delay || self.options.scrollbarFadeDelay);
            }
          }
        },
        __scrollingComplete: function () {
          var self = this;
          self.options.scrollingComplete();
          self.__fadeScrollbars('out');
        },
        resize: function () {
          this.setDimensions(this.__container.clientWidth, this.__container.clientHeight, this.options.getContentWidth(), this.options.getContentHeight());
        },
        getRenderFn: function () {
          var self = this;
          var content = this.__content;
          var docStyle = document.documentElement.style;
          var engine;
          if ('MozAppearance' in docStyle) {
            engine = 'gecko';
          } else if ('WebkitAppearance' in docStyle) {
            engine = 'webkit';
          } else if (typeof navigator.cpuClass === 'string') {
            engine = 'trident';
          }
          var vendorPrefix = {
              trident: 'ms',
              gecko: 'Moz',
              webkit: 'Webkit',
              presto: 'O'
            }[engine];
          var helperElem = document.createElement('div');
          var undef;
          var perspectiveProperty = vendorPrefix + 'Perspective';
          var transformProperty = vendorPrefix + 'Transform';
          var transformOriginProperty = vendorPrefix + 'TransformOrigin';
          self.__perspectiveProperty = transformProperty;
          self.__transformProperty = transformProperty;
          self.__transformOriginProperty = transformOriginProperty;
          if (helperElem.style[perspectiveProperty] !== undef) {
            return function (left, top, zoom, wasResize) {
              content.style[transformProperty] = 'translate3d(' + -left + 'px,' + -top + 'px,0)';
              self.__repositionScrollbars();
              if (!wasResize) {
                self.triggerScrollEvent();
              }
            };
          } else if (helperElem.style[transformProperty] !== undef) {
            return function (left, top, zoom, wasResize) {
              content.style[transformProperty] = 'translate(' + -left + 'px,' + -top + 'px)';
              self.__repositionScrollbars();
              if (!wasResize) {
                self.triggerScrollEvent();
              }
            };
          } else {
            return function (left, top, zoom, wasResize) {
              content.style.marginLeft = left ? -left / zoom + 'px' : '';
              content.style.marginTop = top ? -top / zoom + 'px' : '';
              content.style.zoom = zoom || '';
              self.__repositionScrollbars();
              if (!wasResize) {
                self.triggerScrollEvent();
              }
            };
          }
        },
        setDimensions: function (clientWidth, clientHeight, contentWidth, contentHeight) {
          var self = this;
          if (clientWidth === +clientWidth) {
            self.__clientWidth = clientWidth;
          }
          if (clientHeight === +clientHeight) {
            self.__clientHeight = clientHeight;
          }
          if (contentWidth === +contentWidth) {
            self.__contentWidth = contentWidth;
          }
          if (contentHeight === +contentHeight) {
            self.__contentHeight = contentHeight;
          }
          self.__computeScrollMax();
          self.__resizeScrollbars();
          self.scrollTo(self.__scrollLeft, self.__scrollTop, true, null, true);
        },
        setPosition: function (left, top) {
          var self = this;
          self.__clientLeft = left || 0;
          self.__clientTop = top || 0;
        },
        setSnapSize: function (width, height) {
          var self = this;
          self.__snapWidth = width;
          self.__snapHeight = height;
        },
        activatePullToRefresh: function (height, activateCallback, deactivateCallback, startCallback) {
          var self = this;
          self.__refreshHeight = height;
          self.__refreshActivate = activateCallback;
          self.__refreshDeactivate = deactivateCallback;
          self.__refreshStart = startCallback;
        },
        triggerPullToRefresh: function () {
          this.__publish(this.__scrollLeft, -this.__refreshHeight, this.__zoomLevel, true);
          if (this.__refreshStart) {
            this.__refreshStart();
          }
        },
        finishPullToRefresh: function () {
          var self = this;
          self.__refreshActive = false;
          if (self.__refreshDeactivate) {
            self.__refreshDeactivate();
          }
          self.scrollTo(self.__scrollLeft, self.__scrollTop, true);
        },
        getValues: function () {
          var self = this;
          return {
            left: self.__scrollLeft,
            top: self.__scrollTop,
            zoom: self.__zoomLevel
          };
        },
        getScrollMax: function () {
          var self = this;
          return {
            left: self.__maxScrollLeft,
            top: self.__maxScrollTop
          };
        },
        zoomTo: function (level, animate, originLeft, originTop) {
          var self = this;
          if (!self.options.zooming) {
            throw new Error('Zooming is not enabled!');
          }
          if (self.__isDecelerating) {
            core.effect.Animate.stop(self.__isDecelerating);
            self.__isDecelerating = false;
          }
          var oldLevel = self.__zoomLevel;
          if (originLeft == null) {
            originLeft = self.__clientWidth / 2;
          }
          if (originTop == null) {
            originTop = self.__clientHeight / 2;
          }
          level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);
          self.__computeScrollMax(level);
          var left = (originLeft + self.__scrollLeft) * level / oldLevel - originLeft;
          var top = (originTop + self.__scrollTop) * level / oldLevel - originTop;
          if (left > self.__maxScrollLeft) {
            left = self.__maxScrollLeft;
          } else if (left < 0) {
            left = 0;
          }
          if (top > self.__maxScrollTop) {
            top = self.__maxScrollTop;
          } else if (top < 0) {
            top = 0;
          }
          self.__publish(left, top, level, animate);
        },
        zoomBy: function (factor, animate, originLeft, originTop) {
          var self = this;
          self.zoomTo(self.__zoomLevel * factor, animate, originLeft, originTop);
        },
        scrollTo: function (left, top, animate, zoom, wasResize) {
          var self = this;
          if (self.__isDecelerating) {
            core.effect.Animate.stop(self.__isDecelerating);
            self.__isDecelerating = false;
          }
          if (zoom != null && zoom !== self.__zoomLevel) {
            if (!self.options.zooming) {
              throw new Error('Zooming is not enabled!');
            }
            left *= zoom;
            top *= zoom;
            self.__computeScrollMax(zoom);
          } else {
            zoom = self.__zoomLevel;
          }
          if (!self.options.scrollingX) {
            left = self.__scrollLeft;
          } else {
            if (self.options.paging) {
              left = Math.round(left / self.__clientWidth) * self.__clientWidth;
            } else if (self.options.snapping) {
              left = Math.round(left / self.__snapWidth) * self.__snapWidth;
            }
          }
          if (!self.options.scrollingY) {
            top = self.__scrollTop;
          } else {
            if (self.options.paging) {
              top = Math.round(top / self.__clientHeight) * self.__clientHeight;
            } else if (self.options.snapping) {
              top = Math.round(top / self.__snapHeight) * self.__snapHeight;
            }
          }
          left = Math.max(Math.min(self.__maxScrollLeft, left), 0);
          top = Math.max(Math.min(self.__maxScrollTop, top), 0);
          if (left === self.__scrollLeft && top === self.__scrollTop) {
            animate = false;
          }
          self.__publish(left, top, zoom, animate, wasResize);
        },
        scrollBy: function (left, top, animate) {
          var self = this;
          var startLeft = self.__isAnimating ? self.__scheduledLeft : self.__scrollLeft;
          var startTop = self.__isAnimating ? self.__scheduledTop : self.__scrollTop;
          self.scrollTo(startLeft + (left || 0), startTop + (top || 0), animate);
        },
        doMouseZoom: function (wheelDelta, timeStamp, pageX, pageY) {
          var self = this;
          var change = wheelDelta > 0 ? 0.97 : 1.03;
          return self.zoomTo(self.__zoomLevel * change, false, pageX - self.__clientLeft, pageY - self.__clientTop);
        },
        doTouchStart: function (touches, timeStamp) {
          this.hintResize();
          if (touches.length == null) {
            throw new Error('Invalid touch list: ' + touches);
          }
          if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf();
          }
          if (typeof timeStamp !== 'number') {
            throw new Error('Invalid timestamp value: ' + timeStamp);
          }
          var self = this;
          self.__interruptedAnimation = true;
          if (self.__isDecelerating) {
            core.effect.Animate.stop(self.__isDecelerating);
            self.__isDecelerating = false;
            self.__interruptedAnimation = true;
          }
          if (self.__isAnimating) {
            core.effect.Animate.stop(self.__isAnimating);
            self.__isAnimating = false;
            self.__interruptedAnimation = true;
          }
          var currentTouchLeft, currentTouchTop;
          var isSingleTouch = touches.length === 1;
          if (isSingleTouch) {
            currentTouchLeft = touches[0].pageX;
            currentTouchTop = touches[0].pageY;
          } else {
            currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
            currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
          }
          self.__initialTouchLeft = currentTouchLeft;
          self.__initialTouchTop = currentTouchTop;
          self.__zoomLevelStart = self.__zoomLevel;
          self.__lastTouchLeft = currentTouchLeft;
          self.__lastTouchTop = currentTouchTop;
          self.__lastTouchMove = timeStamp;
          self.__lastScale = 1;
          self.__enableScrollX = !isSingleTouch && self.options.scrollingX;
          self.__enableScrollY = !isSingleTouch && self.options.scrollingY;
          self.__isTracking = true;
          self.__didDecelerationComplete = false;
          self.__isDragging = !isSingleTouch;
          self.__isSingleTouch = isSingleTouch;
          self.__positions = [];
        },
        doTouchMove: function (touches, timeStamp, scale) {
          if (touches.length == null) {
            throw new Error('Invalid touch list: ' + touches);
          }
          if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf();
          }
          if (typeof timeStamp !== 'number') {
            throw new Error('Invalid timestamp value: ' + timeStamp);
          }
          var self = this;
          if (!self.__isTracking) {
            return;
          }
          var currentTouchLeft, currentTouchTop;
          if (touches.length === 2) {
            currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
            currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
          } else {
            currentTouchLeft = touches[0].pageX;
            currentTouchTop = touches[0].pageY;
          }
          var positions = self.__positions;
          if (self.__isDragging) {
            var moveX = currentTouchLeft - self.__lastTouchLeft;
            var moveY = currentTouchTop - self.__lastTouchTop;
            var scrollLeft = self.__scrollLeft;
            var scrollTop = self.__scrollTop;
            var level = self.__zoomLevel;
            if (scale != null && self.options.zooming) {
              var oldLevel = level;
              level = level / self.__lastScale * scale;
              level = Math.max(Math.min(level, self.options.maxZoom), self.options.minZoom);
              if (oldLevel !== level) {
                var currentTouchLeftRel = currentTouchLeft - self.__clientLeft;
                var currentTouchTopRel = currentTouchTop - self.__clientTop;
                scrollLeft = (currentTouchLeftRel + scrollLeft) * level / oldLevel - currentTouchLeftRel;
                scrollTop = (currentTouchTopRel + scrollTop) * level / oldLevel - currentTouchTopRel;
                self.__computeScrollMax(level);
              }
            }
            if (self.__enableScrollX) {
              scrollLeft -= moveX * this.options.speedMultiplier;
              var maxScrollLeft = self.__maxScrollLeft;
              if (scrollLeft > maxScrollLeft || scrollLeft < 0) {
                if (self.options.bouncing) {
                  scrollLeft += moveX / 2 * this.options.speedMultiplier;
                } else if (scrollLeft > maxScrollLeft) {
                  scrollLeft = maxScrollLeft;
                } else {
                  scrollLeft = 0;
                }
              }
            }
            if (self.__enableScrollY) {
              scrollTop -= moveY * this.options.speedMultiplier;
              var maxScrollTop = self.__maxScrollTop;
              if (scrollTop > maxScrollTop || scrollTop < 0) {
                if (self.options.bouncing || self.__refreshHeight && scrollTop < 0) {
                  scrollTop += moveY / 2 * this.options.speedMultiplier;
                  if (!self.__enableScrollX && self.__refreshHeight != null) {
                    if (!self.__refreshActive && scrollTop <= -self.__refreshHeight) {
                      self.__refreshActive = true;
                      if (self.__refreshActivate) {
                        self.__refreshActivate();
                      }
                    } else if (self.__refreshActive && scrollTop > -self.__refreshHeight) {
                      self.__refreshActive = false;
                      if (self.__refreshDeactivate) {
                        self.__refreshDeactivate();
                      }
                    }
                  }
                } else if (scrollTop > maxScrollTop) {
                  scrollTop = maxScrollTop;
                } else {
                  scrollTop = 0;
                }
              }
            }
            if (positions.length > 60) {
              positions.splice(0, 30);
            }
            positions.push(scrollLeft, scrollTop, timeStamp);
            self.__publish(scrollLeft, scrollTop, level);
          } else {
            var minimumTrackingForScroll = self.options.locking ? 3 : 0;
            var minimumTrackingForDrag = 5;
            var distanceX = Math.abs(currentTouchLeft - self.__initialTouchLeft);
            var distanceY = Math.abs(currentTouchTop - self.__initialTouchTop);
            self.__enableScrollX = self.options.scrollingX && distanceX >= minimumTrackingForScroll;
            self.__enableScrollY = self.options.scrollingY && distanceY >= minimumTrackingForScroll;
            positions.push(self.__scrollLeft, self.__scrollTop, timeStamp);
            self.__isDragging = (self.__enableScrollX || self.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);
            if (self.__isDragging) {
              self.__interruptedAnimation = false;
              self.__fadeScrollbars('in');
            }
          }
          self.__lastTouchLeft = currentTouchLeft;
          self.__lastTouchTop = currentTouchTop;
          self.__lastTouchMove = timeStamp;
          self.__lastScale = scale;
        },
        doTouchEnd: function (timeStamp) {
          if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf();
          }
          if (typeof timeStamp !== 'number') {
            throw new Error('Invalid timestamp value: ' + timeStamp);
          }
          var self = this;
          if (!self.__isTracking) {
            return;
          }
          self.__isTracking = false;
          if (self.__isDragging) {
            self.__isDragging = false;
            if (self.__isSingleTouch && self.options.animating && timeStamp - self.__lastTouchMove <= 100) {
              var positions = self.__positions;
              var endPos = positions.length - 1;
              var startPos = endPos;
              for (var i = endPos; i > 0 && positions[i] > self.__lastTouchMove - 100; i -= 3) {
                startPos = i;
              }
              if (startPos !== endPos) {
                var timeOffset = positions[endPos] - positions[startPos];
                var movedLeft = self.__scrollLeft - positions[startPos - 2];
                var movedTop = self.__scrollTop - positions[startPos - 1];
                self.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
                self.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);
                var minVelocityToStartDeceleration = self.options.paging || self.options.snapping ? 4 : 1;
                if (Math.abs(self.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(self.__decelerationVelocityY) > minVelocityToStartDeceleration) {
                  if (!self.__refreshActive) {
                    self.__startDeceleration(timeStamp);
                  }
                }
              } else {
                self.__scrollingComplete();
              }
            } else if (timeStamp - self.__lastTouchMove > 100) {
              self.__scrollingComplete();
            }
          }
          if (!self.__isDecelerating) {
            if (self.__refreshActive && self.__refreshStart) {
              self.__publish(self.__scrollLeft, -self.__refreshHeight, self.__zoomLevel, true);
              if (self.__refreshStart) {
                self.__refreshStart();
              }
            } else {
              if (self.__interruptedAnimation || self.__isDragging) {
                self.__scrollingComplete();
              }
              self.scrollTo(self.__scrollLeft, self.__scrollTop, true, self.__zoomLevel);
              if (self.__refreshActive) {
                self.__refreshActive = false;
                if (self.__refreshDeactivate) {
                  self.__refreshDeactivate();
                }
              }
            }
          }
          self.__positions.length = 0;
        },
        __publish: function (left, top, zoom, animate, wasResize) {
          var self = this;
          var wasAnimating = self.__isAnimating;
          if (wasAnimating) {
            core.effect.Animate.stop(wasAnimating);
            self.__isAnimating = false;
          }
          if (animate && self.options.animating) {
            self.__scheduledLeft = left;
            self.__scheduledTop = top;
            self.__scheduledZoom = zoom;
            var oldLeft = self.__scrollLeft;
            var oldTop = self.__scrollTop;
            var oldZoom = self.__zoomLevel;
            var diffLeft = left - oldLeft;
            var diffTop = top - oldTop;
            var diffZoom = zoom - oldZoom;
            var step = function (percent, now, render) {
              if (render) {
                self.__scrollLeft = oldLeft + diffLeft * percent;
                self.__scrollTop = oldTop + diffTop * percent;
                self.__zoomLevel = oldZoom + diffZoom * percent;
                if (self.__callback) {
                  self.__callback(self.__scrollLeft, self.__scrollTop, self.__zoomLevel, wasResize);
                }
              }
            };
            var verify = function (id) {
              return self.__isAnimating === id;
            };
            var completed = function (renderedFramesPerSecond, animationId, wasFinished) {
              if (animationId === self.__isAnimating) {
                self.__isAnimating = false;
              }
              if (self.__didDecelerationComplete || wasFinished) {
                self.__scrollingComplete();
              }
              if (self.options.zooming) {
                self.__computeScrollMax();
              }
            };
            self.__isAnimating = core.effect.Animate.start(step, verify, completed, self.options.animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);
          } else {
            self.__scheduledLeft = self.__scrollLeft = left;
            self.__scheduledTop = self.__scrollTop = top;
            self.__scheduledZoom = self.__zoomLevel = zoom;
            if (self.__callback) {
              self.__callback(left, top, zoom, wasResize);
            }
            if (self.options.zooming) {
              self.__computeScrollMax();
            }
          }
        },
        __computeScrollMax: function (zoomLevel) {
          var self = this;
          if (zoomLevel == null) {
            zoomLevel = self.__zoomLevel;
          }
          self.__maxScrollLeft = Math.max(self.__contentWidth * zoomLevel - self.__clientWidth, 0);
          self.__maxScrollTop = Math.max(self.__contentHeight * zoomLevel - self.__clientHeight, 0);
          if (!self.__didWaitForSize && self.__maxScrollLeft == 0 && self.__maxScrollTop == 0) {
            self.__didWaitForSize = true;
            self.__waitForSize();
          }
        },
        __waitForSize: function () {
          var self = this;
          clearTimeout(self.__sizerTimeout);
          var sizer = function () {
            self.resize();
            if (self.options.scrollingX && self.__maxScrollLeft == 0 || self.options.scrollingY && self.__maxScrollTop == 0) {
            }
          };
          sizer();
          self.__sizerTimeout = setTimeout(sizer, 1000);
        },
        __startDeceleration: function (timeStamp) {
          var self = this;
          if (self.options.paging) {
            var scrollLeft = Math.max(Math.min(self.__scrollLeft, self.__maxScrollLeft), 0);
            var scrollTop = Math.max(Math.min(self.__scrollTop, self.__maxScrollTop), 0);
            var clientWidth = self.__clientWidth;
            var clientHeight = self.__clientHeight;
            self.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
            self.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
            self.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
            self.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;
          } else {
            self.__minDecelerationScrollLeft = 0;
            self.__minDecelerationScrollTop = 0;
            self.__maxDecelerationScrollLeft = self.__maxScrollLeft;
            self.__maxDecelerationScrollTop = self.__maxScrollTop;
          }
          var step = function (percent, now, render) {
            self.__stepThroughDeceleration(render);
          };
          self.__minVelocityToKeepDecelerating = self.options.snapping ? 4 : 0.1;
          var verify = function () {
            var shouldContinue = Math.abs(self.__decelerationVelocityX) >= self.__minVelocityToKeepDecelerating || Math.abs(self.__decelerationVelocityY) >= self.__minVelocityToKeepDecelerating;
            if (!shouldContinue) {
              self.__didDecelerationComplete = true;
            }
            return shouldContinue;
          };
          var completed = function (renderedFramesPerSecond, animationId, wasFinished) {
            self.__isDecelerating = false;
            if (self.__didDecelerationComplete) {
              self.__scrollingComplete();
            }
            if (self.options.paging) {
              self.scrollTo(self.__scrollLeft, self.__scrollTop, self.options.snapping);
            }
          };
          self.__isDecelerating = core.effect.Animate.start(step, verify, completed);
        },
        __stepThroughDeceleration: function (render) {
          var self = this;
          var scrollLeft = self.__scrollLeft + self.__decelerationVelocityX;
          var scrollTop = self.__scrollTop + self.__decelerationVelocityY;
          if (!self.options.bouncing) {
            var scrollLeftFixed = Math.max(Math.min(self.__maxDecelerationScrollLeft, scrollLeft), self.__minDecelerationScrollLeft);
            if (scrollLeftFixed !== scrollLeft) {
              scrollLeft = scrollLeftFixed;
              self.__decelerationVelocityX = 0;
            }
            var scrollTopFixed = Math.max(Math.min(self.__maxDecelerationScrollTop, scrollTop), self.__minDecelerationScrollTop);
            if (scrollTopFixed !== scrollTop) {
              scrollTop = scrollTopFixed;
              self.__decelerationVelocityY = 0;
            }
          }
          if (render) {
            self.__publish(scrollLeft, scrollTop, self.__zoomLevel);
          } else {
            self.__scrollLeft = scrollLeft;
            self.__scrollTop = scrollTop;
          }
          if (!self.options.paging) {
            var frictionFactor = 0.95;
            self.__decelerationVelocityX *= frictionFactor;
            self.__decelerationVelocityY *= frictionFactor;
          }
          if (self.options.bouncing) {
            var scrollOutsideX = 0;
            var scrollOutsideY = 0;
            var penetrationDeceleration = self.options.penetrationDeceleration;
            var penetrationAcceleration = self.options.penetrationAcceleration;
            if (scrollLeft < self.__minDecelerationScrollLeft) {
              scrollOutsideX = self.__minDecelerationScrollLeft - scrollLeft;
            } else if (scrollLeft > self.__maxDecelerationScrollLeft) {
              scrollOutsideX = self.__maxDecelerationScrollLeft - scrollLeft;
            }
            if (scrollTop < self.__minDecelerationScrollTop) {
              scrollOutsideY = self.__minDecelerationScrollTop - scrollTop;
            } else if (scrollTop > self.__maxDecelerationScrollTop) {
              scrollOutsideY = self.__maxDecelerationScrollTop - scrollTop;
            }
            if (scrollOutsideX !== 0) {
              var isHeadingOutwardsX = scrollOutsideX * self.__decelerationVelocityX <= self.__minDecelerationScrollLeft;
              if (isHeadingOutwardsX) {
                self.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
              }
              var isStoppedX = Math.abs(self.__decelerationVelocityX) <= self.__minVelocityToKeepDecelerating;
              if (!isHeadingOutwardsX || isStoppedX) {
                self.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
              }
            }
            if (scrollOutsideY !== 0) {
              var isHeadingOutwardsY = scrollOutsideY * self.__decelerationVelocityY <= self.__minDecelerationScrollTop;
              if (isHeadingOutwardsY) {
                self.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
              }
              var isStoppedY = Math.abs(self.__decelerationVelocityY) <= self.__minVelocityToKeepDecelerating;
              if (!isHeadingOutwardsY || isStoppedY) {
                self.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
              }
            }
          }
        }
      });
      ionic.scroll = {
        isScrolling: false,
        lastTop: 0
      };
    }(ionic));
    (function (ionic) {
      'use strict';
      ionic.views.ActionSheet = ionic.views.View.inherit({
        initialize: function (opts) {
          this.el = opts.el;
        },
        show: function () {
          this.el.offsetWidth;
          this.el.classList.add('active');
        },
        hide: function () {
          this.el.offsetWidth;
          this.el.classList.remove('active');
        }
      });
    }(ionic));
    (function (ionic) {
      'use strict';
      ionic.views.HeaderBar = ionic.views.View.inherit({
        initialize: function (opts) {
          this.el = opts.el;
          ionic.extend(this, { alignTitle: 'center' }, opts);
          this.align();
        },
        align: function (align) {
          align || (align = this.alignTitle);
          var titleEl = this.el.querySelector('.title');
          if (!titleEl) {
            return;
          }
          var self = this;
          ionic.requestAnimationFrame(function () {
            var i, c, childSize;
            var childNodes = self.el.childNodes;
            var leftWidth = 0;
            var rightWidth = 0;
            var isCountingRightWidth = false;
            for (i = 0; i < childNodes.length; i++) {
              c = childNodes[i];
              if (c.tagName && c.tagName.toLowerCase() == 'h1') {
                isCountingRightWidth = true;
                continue;
              }
              childSize = null;
              if (c.nodeType == 3) {
                childSize = ionic.DomUtil.getTextBounds(c).width;
              } else if (c.nodeType == 1) {
                childSize = c.offsetWidth;
              }
              if (childSize) {
                if (isCountingRightWidth) {
                  rightWidth += childSize;
                } else {
                  leftWidth += childSize;
                }
              }
            }
            var margin = Math.max(leftWidth, rightWidth) + 10;
            if (align == 'center') {
              if (margin > 10) {
                titleEl.style.left = margin + 'px';
                titleEl.style.right = margin + 'px';
              }
              if (titleEl.offsetWidth < titleEl.scrollWidth) {
                if (rightWidth > 0) {
                  titleEl.style.right = rightWidth + 5 + 'px';
                }
              }
            } else if (align == 'left') {
              titleEl.classList.add('title-left');
              if (leftWidth > 0) {
                titleEl.style.left = leftWidth + 15 + 'px';
              }
            } else if (align == 'right') {
              titleEl.classList.add('title-right');
              if (rightWidth > 0) {
                titleEl.style.right = rightWidth + 15 + 'px';
              }
            }
          });
        }
      });
    }(ionic));
    (function (ionic) {
      'use strict';
      var ITEM_CLASS = 'item';
      var ITEM_CONTENT_CLASS = 'item-content';
      var ITEM_SLIDING_CLASS = 'item-sliding';
      var ITEM_OPTIONS_CLASS = 'item-options';
      var ITEM_PLACEHOLDER_CLASS = 'item-placeholder';
      var ITEM_REORDERING_CLASS = 'item-reordering';
      var ITEM_REORDER_BTN_CLASS = 'item-reorder';
      var DragOp = function () {
      };
      DragOp.prototype = {
        start: function (e) {
        },
        drag: function (e) {
        },
        end: function (e) {
        },
        isSameItem: function (item) {
          return false;
        }
      };
      var SlideDrag = function (opts) {
        this.dragThresholdX = opts.dragThresholdX || 10;
        this.el = opts.el;
        this.canSwipe = opts.canSwipe;
      };
      SlideDrag.prototype = new DragOp();
      SlideDrag.prototype.start = function (e) {
        var content, buttons, offsetX, buttonsWidth;
        if (!this.canSwipe()) {
          return;
        }
        if (e.target.classList.contains(ITEM_CONTENT_CLASS)) {
          content = e.target;
        } else if (e.target.classList.contains(ITEM_CLASS)) {
          content = e.target.querySelector('.' + ITEM_CONTENT_CLASS);
        } else {
          content = ionic.DomUtil.getParentWithClass(e.target, ITEM_CONTENT_CLASS);
        }
        if (!content) {
          return;
        }
        content.classList.remove(ITEM_SLIDING_CLASS);
        offsetX = parseFloat(content.style[ionic.CSS.TRANSFORM].replace('translate3d(', '').split(',')[0]) || 0;
        buttons = content.parentNode.querySelector('.' + ITEM_OPTIONS_CLASS);
        if (!buttons) {
          return;
        }
        buttons.classList.remove('invisible');
        buttonsWidth = buttons.offsetWidth;
        this._currentDrag = {
          buttons: buttons,
          buttonsWidth: buttonsWidth,
          content: content,
          startOffsetX: offsetX
        };
      };
      SlideDrag.prototype.isSameItem = function (op) {
        if (op._lastDrag && this._currentDrag) {
          return this._currentDrag.content == op._lastDrag.content;
        }
        return false;
      };
      SlideDrag.prototype.clean = function (e) {
        var lastDrag = this._lastDrag;
        if (!lastDrag)
          return;
        ionic.requestAnimationFrame(function () {
          lastDrag.content.style[ionic.CSS.TRANSITION] = '';
          lastDrag.content.style[ionic.CSS.TRANSFORM] = '';
          setTimeout(function () {
            lastDrag.buttons && lastDrag.buttons.classList.add('invisible');
          }, 250);
        });
      };
      SlideDrag.prototype.drag = ionic.animationFrameThrottle(function (e) {
        var buttonsWidth;
        if (!this._currentDrag) {
          return;
        }
        if (!this._isDragging && (Math.abs(e.gesture.deltaX) > this.dragThresholdX || Math.abs(this._currentDrag.startOffsetX) > 0)) {
          this._isDragging = true;
        }
        if (this._isDragging) {
          buttonsWidth = this._currentDrag.buttonsWidth;
          var newX = Math.min(0, this._currentDrag.startOffsetX + e.gesture.deltaX);
          if (newX < -buttonsWidth) {
            newX = Math.min(-buttonsWidth, -buttonsWidth + (e.gesture.deltaX + buttonsWidth) * 0.4);
          }
          this._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + newX + 'px, 0, 0)';
          this._currentDrag.content.style[ionic.CSS.TRANSITION] = 'none';
        }
      });
      SlideDrag.prototype.end = function (e, doneCallback) {
        var _this = this;
        if (!this._currentDrag) {
          doneCallback && doneCallback();
          return;
        }
        var restingPoint = -this._currentDrag.buttonsWidth;
        if (e.gesture.deltaX > -(this._currentDrag.buttonsWidth / 2)) {
          if (e.gesture.direction == 'left' && Math.abs(e.gesture.velocityX) < 0.3) {
            restingPoint = 0;
          } else if (e.gesture.direction == 'right') {
            restingPoint = 0;
          }
        }
        ionic.requestAnimationFrame(function () {
          if (restingPoint === 0) {
            _this._currentDrag.content.style[ionic.CSS.TRANSFORM] = '';
            var buttons = _this._currentDrag.buttons;
            setTimeout(function () {
              buttons && buttons.classList.add('invisible');
            }, 250);
          } else {
            _this._currentDrag.content.style[ionic.CSS.TRANSFORM] = 'translate3d(' + restingPoint + 'px, 0, 0)';
          }
          _this._currentDrag.content.style[ionic.CSS.TRANSITION] = '';
          _this._lastDrag = _this._currentDrag;
          _this._currentDrag = null;
          doneCallback && doneCallback();
        });
      };
      var ReorderDrag = function (opts) {
        this.dragThresholdY = opts.dragThresholdY || 0;
        this.onReorder = opts.onReorder;
        this.listEl = opts.listEl;
        this.el = opts.el;
        this.scrollEl = opts.scrollEl;
        this.scrollView = opts.scrollView;
      };
      ReorderDrag.prototype = new DragOp();
      ReorderDrag.prototype._moveElement = function (e) {
        var y = e.gesture.center.pageY - this._currentDrag.elementHeight + this._currentDrag.scrollDelta - this.listEl.offsetTop;
        this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + y + 'px, 0)';
      };
      ReorderDrag.prototype.start = function (e) {
        var content;
        var startIndex = ionic.DomUtil.getChildIndex(this.el, this.el.nodeName.toLowerCase());
        var elementHeight = this.el.scrollHeight;
        var placeholder = this.el.cloneNode(true);
        placeholder.classList.add(ITEM_PLACEHOLDER_CLASS);
        this.el.parentNode.insertBefore(placeholder, this.el);
        this.el.classList.add(ITEM_REORDERING_CLASS);
        this._currentDrag = {
          elementHeight: elementHeight,
          startIndex: startIndex,
          placeholder: placeholder,
          scrollHeight: scroll,
          list: placeholder.parentNode,
          scrollDelta: 0
        };
        this._moveElement(e);
      };
      ReorderDrag.prototype.drag = ionic.animationFrameThrottle(function (e) {
        if (!this._currentDrag) {
          return;
        }
        var scrollY = 0;
        var pageY = e.gesture.center.pageY;
        if (this.scrollView) {
          var container = this.scrollEl;
          scrollY = this.scrollView.getValues().top;
          var containerTop = container.offsetTop;
          var pixelsPastTop = containerTop - pageY + this._currentDrag.elementHeight / 2;
          var pixelsPastBottom = pageY + this._currentDrag.elementHeight / 2 - containerTop - container.offsetHeight;
          if (e.gesture.deltaY < 0 && pixelsPastTop > 0 && scrollY > 0) {
            this.scrollView.scrollBy(null, -pixelsPastTop);
            this._currentDrag.scrollDelta -= pixelsPastTop;
          }
          if (e.gesture.deltaY > 0 && pixelsPastBottom > 0) {
            if (scrollY < this.scrollView.getScrollMax().top) {
              this.scrollView.scrollBy(null, pixelsPastBottom);
              this._currentDrag.scrollDelta += pixelsPastBottom;
            }
          }
        }
        if (!this._isDragging && Math.abs(e.gesture.deltaY) > this.dragThresholdY) {
          this._isDragging = true;
        }
        if (this._isDragging) {
          this._moveElement(e);
          this._currentDrag.currentY = scrollY + pageY - this._currentDrag.placeholder.parentNode.offsetTop;
          this._reorderItems();
        }
      });
      ReorderDrag.prototype._reorderItems = function () {
        var self = this;
        var placeholder = this._currentDrag.placeholder;
        var siblings = Array.prototype.slice.call(this._currentDrag.placeholder.parentNode.children).filter(function (el) {
            return el !== self.el;
          });
        var index = siblings.indexOf(this._currentDrag.placeholder);
        var topSibling = siblings[Math.max(0, index - 1)];
        var bottomSibling = siblings[Math.min(siblings.length, index + 1)];
        var thisOffsetTop = this._currentDrag.currentY;
        if (topSibling && thisOffsetTop < topSibling.offsetTop + topSibling.offsetHeight / 2) {
          ionic.DomUtil.swapNodes(this._currentDrag.placeholder, topSibling);
          return index - 1;
        } else if (bottomSibling && thisOffsetTop > bottomSibling.offsetTop + bottomSibling.offsetHeight / 2) {
          ionic.DomUtil.swapNodes(bottomSibling, this._currentDrag.placeholder);
          return index + 1;
        }
      };
      ReorderDrag.prototype.end = function (e, doneCallback) {
        if (!this._currentDrag) {
          doneCallback && doneCallback();
          return;
        }
        var placeholder = this._currentDrag.placeholder;
        var finalPosition = ionic.DomUtil.getChildIndex(placeholder, placeholder.nodeName.toLowerCase());
        this.el.classList.remove(ITEM_REORDERING_CLASS);
        this.el.style[ionic.CSS.TRANSFORM] = '';
        placeholder.parentNode.insertBefore(this.el, placeholder);
        placeholder.parentNode.removeChild(placeholder);
        this.onReorder && this.onReorder(this.el, this._currentDrag.startIndex, finalPosition);
        this._currentDrag = null;
        doneCallback && doneCallback();
      };
      ionic.views.ListView = ionic.views.View.inherit({
        initialize: function (opts) {
          var _this = this;
          opts = ionic.extend({
            onReorder: function (el, oldIndex, newIndex) {
            },
            virtualRemoveThreshold: -200,
            virtualAddThreshold: 200,
            canSwipe: function () {
              return true;
            }
          }, opts);
          ionic.extend(this, opts);
          if (!this.itemHeight && this.listEl) {
            this.itemHeight = this.listEl.children[0] && parseInt(this.listEl.children[0].style.height, 10);
          }
          this.onRefresh = opts.onRefresh || function () {
          };
          this.onRefreshOpening = opts.onRefreshOpening || function () {
          };
          this.onRefreshHolding = opts.onRefreshHolding || function () {
          };
          window.ionic.onGesture('release', function (e) {
            _this._handleEndDrag(e);
          }, this.el);
          window.ionic.onGesture('drag', function (e) {
            _this._handleDrag(e);
          }, this.el);
          this._initDrag();
        },
        stopRefreshing: function () {
          var refresher = this.el.querySelector('.list-refresher');
          refresher.style.height = '0px';
        },
        didScroll: function (e) {
          if (this.isVirtual) {
            var itemHeight = this.itemHeight;
            var totalItems = this.listEl.children.length;
            var scrollHeight = e.target.scrollHeight;
            var viewportHeight = this.el.parentNode.offsetHeight;
            var scrollTop = e.scrollTop;
            var highWater = Math.max(0, e.scrollTop + this.virtualRemoveThreshold);
            var lowWater = Math.min(scrollHeight, Math.abs(e.scrollTop) + viewportHeight + this.virtualAddThreshold);
            var itemsPerViewport = Math.floor((lowWater - highWater) / itemHeight);
            var first = parseInt(Math.abs(highWater / itemHeight), 10);
            var last = parseInt(Math.abs(lowWater / itemHeight), 10);
            this._virtualItemsToRemove = Array.prototype.slice.call(this.listEl.children, 0, first);
            var nodes = Array.prototype.slice.call(this.listEl.children, first, first + itemsPerViewport);
            this.renderViewport && this.renderViewport(highWater, lowWater, first, last);
          }
        },
        didStopScrolling: function (e) {
          if (this.isVirtual) {
            for (var i = 0; i < this._virtualItemsToRemove.length; i++) {
              var el = this._virtualItemsToRemove[i];
              this.didHideItem && this.didHideItem(i);
            }
          }
        },
        clearDragEffects: function () {
          if (this._lastDragOp) {
            this._lastDragOp.clean && this._lastDragOp.clean();
            this._lastDragOp = null;
          }
        },
        _initDrag: function () {
          this._lastDragOp = this._dragOp;
          this._dragOp = null;
        },
        _getItem: function (target) {
          while (target) {
            if (target.classList.contains(ITEM_CLASS)) {
              return target;
            }
            target = target.parentNode;
          }
          return null;
        },
        _startDrag: function (e) {
          var _this = this;
          var didStart = false;
          this._isDragging = false;
          var lastDragOp = this._lastDragOp;
          if (ionic.DomUtil.getParentOrSelfWithClass(e.target, ITEM_REORDER_BTN_CLASS) && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
            var item = this._getItem(e.target);
            if (item) {
              this._dragOp = new ReorderDrag({
                listEl: this.el,
                el: item,
                scrollEl: this.scrollEl,
                scrollView: this.scrollView,
                onReorder: function (el, start, end) {
                  _this.onReorder && _this.onReorder(el, start, end);
                }
              });
              this._dragOp.start(e);
              e.preventDefault();
            }
          } else if (!this._didDragUpOrDown && (e.gesture.direction == 'left' || e.gesture.direction == 'right') && Math.abs(e.gesture.deltaX) > 5) {
            var item = this._getItem(e.target);
            if (item && item.querySelector('.item-options')) {
              this._dragOp = new SlideDrag({
                el: this.el,
                canSwipe: this.canSwipe
              });
              this._dragOp.start(e);
              e.preventDefault();
            }
          }
          if (lastDragOp && this._dragOp && !this._dragOp.isSameItem(lastDragOp) && e.defaultPrevented) {
            lastDragOp.clean && lastDragOp.clean();
          }
        },
        _handleEndDrag: function (e) {
          var _this = this;
          this._didDragUpOrDown = false;
          if (!this._dragOp) {
            return;
          }
          this._dragOp.end(e, function () {
            _this._initDrag();
          });
        },
        _handleDrag: function (e) {
          var _this = this, content, buttons;
          if (Math.abs(e.gesture.deltaY) > 5) {
            this._didDragUpOrDown = true;
          }
          if (!this.isDragging && !this._dragOp) {
            this._startDrag(e);
          }
          if (!this._dragOp) {
            return;
          }
          e.gesture.srcEvent.preventDefault();
          this._dragOp.drag(e);
        }
      });
    }(ionic));
    (function (ionic) {
      'use strict';
      ionic.views.Modal = ionic.views.View.inherit({
        initialize: function (opts) {
          opts = ionic.extend({
            focusFirstInput: false,
            unfocusOnHide: true,
            focusFirstDelay: 600
          }, opts);
          ionic.extend(this, opts);
          this.el = opts.el;
        },
        show: function () {
          var self = this;
          if (self.focusFirstInput) {
            window.setTimeout(function () {
              var input = self.el.querySelector('input, textarea');
              input && input.focus && input.focus();
            }, self.focusFirstDelay);
          }
        },
        hide: function () {
          if (this.unfocusOnHide) {
            var inputs = this.el.querySelectorAll('input, textarea');
            window.setTimeout(function () {
              for (var i = 0; i < inputs.length; i++) {
                inputs[i].blur && inputs[i].blur();
              }
            });
          }
        }
      });
    }(ionic));
    (function (ionic) {
      'use strict';
      ionic.views.SideMenu = ionic.views.View.inherit({
        initialize: function (opts) {
          this.el = opts.el;
          this.isEnabled = typeof opts.isEnabled === 'undefined' ? true : opts.isEnabled;
          this.setWidth(opts.width);
        },
        getFullWidth: function () {
          return this.width;
        },
        setWidth: function (width) {
          this.width = width;
          this.el.style.width = width + 'px';
        },
        setIsEnabled: function (isEnabled) {
          this.isEnabled = isEnabled;
        },
        bringUp: function () {
          if (this.el.style.zIndex !== '0') {
            this.el.style.zIndex = '0';
          }
        },
        pushDown: function () {
          if (this.el.style.zIndex !== '-1') {
            this.el.style.zIndex = '-1';
          }
        }
      });
      ionic.views.SideMenuContent = ionic.views.View.inherit({
        initialize: function (opts) {
          var _this = this;
          ionic.extend(this, {
            animationClass: 'menu-animated',
            onDrag: function (e) {
            },
            onEndDrag: function (e) {
            }
          }, opts);
          ionic.onGesture('drag', ionic.proxy(this._onDrag, this), this.el);
          ionic.onGesture('release', ionic.proxy(this._onEndDrag, this), this.el);
        },
        _onDrag: function (e) {
          this.onDrag && this.onDrag(e);
        },
        _onEndDrag: function (e) {
          this.onEndDrag && this.onEndDrag(e);
        },
        disableAnimation: function () {
          this.el.classList.remove(this.animationClass);
        },
        enableAnimation: function () {
          this.el.classList.add(this.animationClass);
        },
        getTranslateX: function () {
          return parseFloat(this.el.style[ionic.CSS.TRANSFORM].replace('translate3d(', '').split(',')[0]);
        },
        setTranslateX: ionic.animationFrameThrottle(function (x) {
          this.el.style[ionic.CSS.TRANSFORM] = 'translate3d(' + x + 'px, 0, 0)';
        })
      });
    }(ionic));
    (function (ionic) {
      'use strict';
      ionic.views.Slider = ionic.views.View.inherit({
        initialize: function (options) {
          var noop = function () {
          };
          var offloadFn = function (fn) {
            setTimeout(fn || noop, 0);
          };
          var browser = {
              addEventListener: !!window.addEventListener,
              touch: 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch,
              transitions: function (temp) {
                var props = [
                    'transitionProperty',
                    'WebkitTransition',
                    'MozTransition',
                    'OTransition',
                    'msTransition'
                  ];
                for (var i in props)
                  if (temp.style[props[i]] !== undefined)
                    return true;
                return false;
              }(document.createElement('swipe'))
            };
          var container = options.el;
          if (!container)
            return;
          var element = container.children[0];
          var slides, slidePos, width, length;
          options = options || {};
          var index = parseInt(options.startSlide, 10) || 0;
          var speed = options.speed || 300;
          options.continuous = options.continuous !== undefined ? options.continuous : true;
          function setup() {
            slides = element.children;
            length = slides.length;
            if (slides.length < 2)
              options.continuous = false;
            if (browser.transitions && options.continuous && slides.length < 3) {
              element.appendChild(slides[0].cloneNode(true));
              element.appendChild(element.children[1].cloneNode(true));
              slides = element.children;
            }
            slidePos = new Array(slides.length);
            width = container.getBoundingClientRect().width || container.offsetWidth;
            element.style.width = slides.length * width + 'px';
            var pos = slides.length;
            while (pos--) {
              var slide = slides[pos];
              slide.style.width = width + 'px';
              slide.setAttribute('data-index', pos);
              if (browser.transitions) {
                slide.style.left = pos * -width + 'px';
                move(pos, index > pos ? -width : index < pos ? width : 0, 0);
              }
            }
            if (options.continuous && browser.transitions) {
              move(circle(index - 1), -width, 0);
              move(circle(index + 1), width, 0);
            }
            if (!browser.transitions)
              element.style.left = index * -width + 'px';
            container.style.visibility = 'visible';
            options.slidesChanged && options.slidesChanged();
          }
          function prev() {
            if (options.continuous)
              slide(index - 1);
            else if (index)
              slide(index - 1);
          }
          function next() {
            if (options.continuous)
              slide(index + 1);
            else if (index < slides.length - 1)
              slide(index + 1);
          }
          function circle(index) {
            return (slides.length + index % slides.length) % slides.length;
          }
          function slide(to, slideSpeed) {
            if (index == to)
              return;
            if (browser.transitions) {
              var direction = Math.abs(index - to) / (index - to);
              if (options.continuous) {
                var natural_direction = direction;
                direction = -slidePos[circle(to)] / width;
                if (direction !== natural_direction)
                  to = -direction * slides.length + to;
              }
              var diff = Math.abs(index - to) - 1;
              while (diff--)
                move(circle((to > index ? to : index) - diff - 1), width * direction, 0);
              to = circle(to);
              move(index, width * direction, slideSpeed || speed);
              move(to, 0, slideSpeed || speed);
              if (options.continuous)
                move(circle(to - direction), -(width * direction), 0);
            } else {
              to = circle(to);
              animate(index * -width, to * -width, slideSpeed || speed);
            }
            index = to;
            offloadFn(options.callback && options.callback(index, slides[index]));
          }
          function move(index, dist, speed) {
            translate(index, dist, speed);
            slidePos[index] = dist;
          }
          function translate(index, dist, speed) {
            var slide = slides[index];
            var style = slide && slide.style;
            if (!style)
              return;
            style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = speed + 'ms';
            style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
            style.msTransform = style.MozTransform = style.OTransform = 'translateX(' + dist + 'px)';
          }
          function animate(from, to, speed) {
            if (!speed) {
              element.style.left = to + 'px';
              return;
            }
            var start = +new Date();
            var timer = setInterval(function () {
                var timeElap = +new Date() - start;
                if (timeElap > speed) {
                  element.style.left = to + 'px';
                  if (delay)
                    begin();
                  options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
                  clearInterval(timer);
                  return;
                }
                element.style.left = (to - from) * (Math.floor(timeElap / speed * 100) / 100) + from + 'px';
              }, 4);
          }
          var delay = options.auto || 0;
          var interval;
          function begin() {
            interval = setTimeout(next, delay);
          }
          function stop() {
            delay = options.auto || 0;
            clearTimeout(interval);
          }
          var start = {};
          var delta = {};
          var isScrolling;
          var events = {
              handleEvent: function (event) {
                if (event.type == 'mousedown' || event.type == 'mouseup' || event.type == 'mousemove') {
                  event.touches = [{
                      pageX: event.pageX,
                      pageY: event.pageY
                    }];
                }
                switch (event.type) {
                case 'mousedown':
                  this.start(event);
                  break;
                case 'touchstart':
                  this.start(event);
                  break;
                case 'touchmove':
                  this.move(event);
                  break;
                case 'mousemove':
                  this.move(event);
                  break;
                case 'touchend':
                  offloadFn(this.end(event));
                  break;
                case 'mouseup':
                  offloadFn(this.end(event));
                  break;
                case 'webkitTransitionEnd':
                case 'msTransitionEnd':
                case 'oTransitionEnd':
                case 'otransitionend':
                case 'transitionend':
                  offloadFn(this.transitionEnd(event));
                  break;
                case 'resize':
                  offloadFn(setup);
                  break;
                }
                if (options.stopPropagation)
                  event.stopPropagation();
              },
              start: function (event) {
                var touches = event.touches[0];
                start = {
                  x: touches.pageX,
                  y: touches.pageY,
                  time: +new Date()
                };
                isScrolling = undefined;
                delta = {};
                if (browser.touch) {
                  element.addEventListener('touchmove', this, false);
                  element.addEventListener('touchend', this, false);
                } else {
                  element.addEventListener('mousemove', this, false);
                  element.addEventListener('mouseup', this, false);
                  document.addEventListener('mouseup', this, false);
                }
              },
              move: function (event) {
                if (event.touches.length > 1 || event.scale && event.scale !== 1)
                  return;
                if (options.disableScroll)
                  event.preventDefault();
                var touches = event.touches[0];
                delta = {
                  x: touches.pageX - start.x,
                  y: touches.pageY - start.y
                };
                if (typeof isScrolling == 'undefined') {
                  isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
                }
                if (!isScrolling) {
                  event.preventDefault();
                  stop();
                  if (options.continuous) {
                    translate(circle(index - 1), delta.x + slidePos[circle(index - 1)], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(circle(index + 1), delta.x + slidePos[circle(index + 1)], 0);
                  } else {
                    delta.x = delta.x / (!index && delta.x > 0 || index == slides.length - 1 && delta.x < 0 ? Math.abs(delta.x) / width + 1 : 1);
                    translate(index - 1, delta.x + slidePos[index - 1], 0);
                    translate(index, delta.x + slidePos[index], 0);
                    translate(index + 1, delta.x + slidePos[index + 1], 0);
                  }
                }
              },
              end: function (event) {
                var duration = +new Date() - start.time;
                var isValidSlide = Number(duration) < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > width / 2;
                var isPastBounds = !index && delta.x > 0 || index == slides.length - 1 && delta.x < 0;
                if (options.continuous)
                  isPastBounds = false;
                var direction = delta.x < 0;
                if (!isScrolling) {
                  if (isValidSlide && !isPastBounds) {
                    if (direction) {
                      if (options.continuous) {
                        move(circle(index - 1), -width, 0);
                        move(circle(index + 2), width, 0);
                      } else {
                        move(index - 1, -width, 0);
                      }
                      move(index, slidePos[index] - width, speed);
                      move(circle(index + 1), slidePos[circle(index + 1)] - width, speed);
                      index = circle(index + 1);
                    } else {
                      if (options.continuous) {
                        move(circle(index + 1), width, 0);
                        move(circle(index - 2), -width, 0);
                      } else {
                        move(index + 1, width, 0);
                      }
                      move(index, slidePos[index] + width, speed);
                      move(circle(index - 1), slidePos[circle(index - 1)] + width, speed);
                      index = circle(index - 1);
                    }
                    options.callback && options.callback(index, slides[index]);
                  } else {
                    if (options.continuous) {
                      move(circle(index - 1), -width, speed);
                      move(index, 0, speed);
                      move(circle(index + 1), width, speed);
                    } else {
                      move(index - 1, -width, speed);
                      move(index, 0, speed);
                      move(index + 1, width, speed);
                    }
                  }
                }
                if (browser.touch) {
                  element.removeEventListener('touchmove', events, false);
                  element.removeEventListener('touchend', events, false);
                } else {
                  element.removeEventListener('mousemove', events, false);
                  element.removeEventListener('mouseup', events, false);
                  document.removeEventListener('mouseup', events, false);
                }
              },
              transitionEnd: function (event) {
                if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
                  if (delay)
                    begin();
                  options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);
                }
              }
            };
          this.update = function () {
            setTimeout(setup);
          };
          this.setup = function () {
            setup();
          };
          this.slide = function (to, speed) {
            stop();
            slide(to, speed);
          };
          this.prev = this.previous = function () {
            stop();
            prev();
          };
          this.next = function () {
            stop();
            next();
          };
          this.stop = function () {
            stop();
          };
          this.currentIndex = function () {
            return index;
          };
          this.slidesCount = function () {
            return length;
          };
          this.kill = function () {
            stop();
            element.style.width = '';
            element.style.left = '';
            var pos = slides.length;
            while (pos--) {
              var slide = slides[pos];
              slide.style.width = '';
              slide.style.left = '';
              if (browser.transitions)
                translate(pos, 0, 0);
            }
            if (browser.addEventListener) {
              element.removeEventListener('touchstart', events, false);
              element.removeEventListener('webkitTransitionEnd', events, false);
              element.removeEventListener('msTransitionEnd', events, false);
              element.removeEventListener('oTransitionEnd', events, false);
              element.removeEventListener('otransitionend', events, false);
              element.removeEventListener('transitionend', events, false);
              window.removeEventListener('resize', events, false);
            } else {
              window.onresize = null;
            }
          };
          this.load = function () {
            setup();
            if (delay)
              begin();
            if (browser.addEventListener) {
              if (browser.touch) {
                element.addEventListener('touchstart', events, false);
              } else {
                element.addEventListener('mousedown', events, false);
              }
              if (browser.transitions) {
                element.addEventListener('webkitTransitionEnd', events, false);
                element.addEventListener('msTransitionEnd', events, false);
                element.addEventListener('oTransitionEnd', events, false);
                element.addEventListener('otransitionend', events, false);
                element.addEventListener('transitionend', events, false);
              }
              window.addEventListener('resize', events, false);
            } else {
              window.onresize = function () {
                setup();
              };
            }
          };
        }
      });
    }(ionic));
    (function (ionic) {
      'use strict';
      ionic.views.Toggle = ionic.views.View.inherit({
        initialize: function (opts) {
          var self = this;
          this.el = opts.el;
          this.checkbox = opts.checkbox;
          this.track = opts.track;
          this.handle = opts.handle;
          this.openPercent = -1;
          this.onChange = opts.onChange || function () {
          };
          this.triggerThreshold = opts.triggerThreshold || 20;
          this.dragStartHandler = function (e) {
            self.dragStart(e);
          };
          this.dragHandler = function (e) {
            self.drag(e);
          };
          this.holdHandler = function (e) {
            self.hold(e);
          };
          this.releaseHandler = function (e) {
            self.release(e);
          };
          this.dragStartGesture = ionic.onGesture('dragstart', this.dragStartHandler, this.el);
          this.dragGesture = ionic.onGesture('drag', this.dragHandler, this.el);
          this.dragHoldGesture = ionic.onGesture('hold', this.holdHandler, this.el);
          this.dragReleaseGesture = ionic.onGesture('release', this.releaseHandler, this.el);
        },
        destroy: function () {
          ionic.offGesture(this.dragStartGesture, 'dragstart', this.dragStartGesture);
          ionic.offGesture(this.dragGesture, 'drag', this.dragGesture);
          ionic.offGesture(this.dragHoldGesture, 'hold', this.holdHandler);
          ionic.offGesture(this.dragReleaseGesture, 'release', this.releaseHandler);
        },
        tap: function (e) {
          if (this.el.getAttribute('disabled') !== 'disabled') {
            this.val(!this.checkbox.checked);
          }
        },
        dragStart: function (e) {
          if (this.checkbox.disabled)
            return;
          this._dragInfo = {
            width: this.el.offsetWidth,
            left: this.el.offsetLeft,
            right: this.el.offsetLeft + this.el.offsetWidth,
            triggerX: this.el.offsetWidth / 2,
            initialState: this.checkbox.checked
          };
          e.gesture.srcEvent.preventDefault();
          this.hold(e);
        },
        drag: function (e) {
          var self = this;
          if (!this._dragInfo) {
            return;
          }
          e.gesture.srcEvent.preventDefault();
          ionic.requestAnimationFrame(function (amount) {
            var slidePageLeft = self.track.offsetLeft + self.handle.offsetWidth / 2;
            var slidePageRight = self.track.offsetLeft + self.track.offsetWidth - self.handle.offsetWidth / 2;
            var dx = e.gesture.deltaX;
            var px = e.gesture.touches[0].pageX - self._dragInfo.left;
            var mx = self._dragInfo.width - self.triggerThreshold;
            if (self._dragInfo.initialState) {
              if (px < self.triggerThreshold) {
                self.setOpenPercent(0);
              } else if (px > self._dragInfo.triggerX) {
                self.setOpenPercent(100);
              }
            } else {
              if (px < self._dragInfo.triggerX) {
                self.setOpenPercent(0);
              } else if (px > mx) {
                self.setOpenPercent(100);
              }
            }
          });
        },
        endDrag: function (e) {
          this._dragInfo = null;
        },
        hold: function (e) {
          this.el.classList.add('dragging');
        },
        release: function (e) {
          this.el.classList.remove('dragging');
          this.endDrag(e);
        },
        setOpenPercent: function (openPercent) {
          if (this.openPercent < 0 || (openPercent < this.openPercent - 3 || openPercent > this.openPercent + 3)) {
            this.openPercent = openPercent;
            if (openPercent === 0) {
              this.val(false);
            } else if (openPercent === 100) {
              this.val(true);
            } else {
              var openPixel = Math.round(openPercent / 100 * this.track.offsetWidth - this.handle.offsetWidth);
              openPixel = openPixel < 1 ? 0 : openPixel;
              this.handle.style[ionic.CSS.TRANSFORM] = 'translate3d(' + openPixel + 'px,0,0)';
            }
          }
        },
        val: function (value) {
          if (value === true || value === false) {
            if (this.handle.style[ionic.CSS.TRANSFORM] !== '') {
              this.handle.style[ionic.CSS.TRANSFORM] = '';
            }
            this.checkbox.checked = value;
            this.openPercent = value ? 100 : 0;
            this.onChange && this.onChange();
          }
          return this.checkbox.checked;
        }
      });
    }(ionic));
    (function (ionic) {
      'use strict';
      ionic.controllers.ViewController = function (options) {
        this.initialize.apply(this, arguments);
      };
      ionic.controllers.ViewController.inherit = ionic.inherit;
      ionic.extend(ionic.controllers.ViewController.prototype, {
        initialize: function () {
        },
        destroy: function () {
        }
      });
    }(window.ionic));
    (function (ionic) {
      'use strict';
      ionic.controllers.SideMenuController = ionic.controllers.ViewController.inherit({
        initialize: function (options) {
          var self = this;
          this.left = options.left;
          this.right = options.right;
          this.content = options.content;
          this.dragThresholdX = options.dragThresholdX || 10;
          this._rightShowing = false;
          this._leftShowing = false;
          this._isDragging = false;
          if (this.content) {
            this.content.onDrag = function (e) {
              self._handleDrag(e);
            };
            this.content.onEndDrag = function (e) {
              self._endDrag(e);
            };
          }
        },
        setContent: function (content) {
          var self = this;
          this.content = content;
          this.content.onDrag = function (e) {
            self._handleDrag(e);
          };
          this.content.endDrag = function (e) {
            self._endDrag(e);
          };
        },
        isOpenLeft: function () {
          return this.getOpenAmount() > 0;
        },
        isOpenRight: function () {
          return this.getOpenAmount() < 0;
        },
        toggleLeft: function (shouldOpen) {
          var openAmount = this.getOpenAmount();
          if (arguments.length === 0) {
            shouldOpen = openAmount <= 0;
          }
          this.content.enableAnimation();
          if (!shouldOpen) {
            this.openPercentage(0);
          } else {
            this.openPercentage(100);
          }
        },
        toggleRight: function (shouldOpen) {
          var openAmount = this.getOpenAmount();
          if (arguments.length === 0) {
            shouldOpen = openAmount >= 0;
          }
          this.content.enableAnimation();
          if (!shouldOpen) {
            this.openPercentage(0);
          } else {
            this.openPercentage(-100);
          }
        },
        close: function () {
          this.openPercentage(0);
        },
        getOpenAmount: function () {
          return this.content && this.content.getTranslateX() || 0;
        },
        getOpenRatio: function () {
          var amount = this.getOpenAmount();
          if (amount >= 0) {
            return amount / this.left.width;
          }
          return amount / this.right.width;
        },
        isOpen: function () {
          return this.getOpenAmount() !== 0;
        },
        getOpenPercentage: function () {
          return this.getOpenRatio() * 100;
        },
        openPercentage: function (percentage) {
          var p = percentage / 100;
          if (this.left && percentage >= 0) {
            this.openAmount(this.left.width * p);
          } else if (this.right && percentage < 0) {
            var maxRight = this.right.width;
            this.openAmount(this.right.width * p);
          }
        },
        openAmount: function (amount) {
          var maxLeft = this.left && this.left.width || 0;
          var maxRight = this.right && this.right.width || 0;
          if (!(this.left && this.left.isEnabled) && amount > 0) {
            this.content.setTranslateX(0);
            return;
          }
          if (!(this.right && this.right.isEnabled) && amount < 0) {
            this.content.setTranslateX(0);
            return;
          }
          if (this._leftShowing && amount > maxLeft) {
            this.content.setTranslateX(maxLeft);
            return;
          }
          if (this._rightShowing && amount < -maxRight) {
            this.content.setTranslateX(-maxRight);
            return;
          }
          this.content.setTranslateX(amount);
          if (amount >= 0) {
            this._leftShowing = true;
            this._rightShowing = false;
            if (amount > 0) {
              this.right && this.right.pushDown && this.right.pushDown();
              this.left && this.left.bringUp && this.left.bringUp();
            }
          } else {
            this._rightShowing = true;
            this._leftShowing = false;
            this.right && this.right.bringUp && this.right.bringUp();
            this.left && this.left.pushDown && this.left.pushDown();
          }
        },
        snapToRest: function (e) {
          this.content.enableAnimation();
          this._isDragging = false;
          var ratio = this.getOpenRatio();
          if (ratio === 0) {
            this.openPercentage(0);
            return;
          }
          var velocityThreshold = 0.3;
          var velocityX = e.gesture.velocityX;
          var direction = e.gesture.direction;
          if (ratio > 0 && ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
            this.openPercentage(0);
          } else if (ratio > 0.5 && direction == 'left' && velocityX < velocityThreshold) {
            this.openPercentage(100);
          } else if (ratio < 0 && ratio > -0.5 && direction == 'left' && velocityX < velocityThreshold) {
            this.openPercentage(0);
          } else if (ratio < 0.5 && direction == 'right' && velocityX < velocityThreshold) {
            this.openPercentage(-100);
          } else if (direction == 'right' && ratio >= 0 && (ratio >= 0.5 || velocityX > velocityThreshold)) {
            this.openPercentage(100);
          } else if (direction == 'left' && ratio <= 0 && (ratio <= -0.5 || velocityX > velocityThreshold)) {
            this.openPercentage(-100);
          } else {
            this.openPercentage(0);
          }
        },
        _endDrag: function (e) {
          if (this._isDragging) {
            this.snapToRest(e);
          }
          this._startX = null;
          this._lastX = null;
          this._offsetX = null;
        },
        _handleDrag: function (e) {
          if (!this._startX) {
            this._startX = e.gesture.touches[0].pageX;
            this._lastX = this._startX;
          } else {
            this._lastX = e.gesture.touches[0].pageX;
          }
          if (!this._isDragging && Math.abs(this._lastX - this._startX) > this.dragThresholdX) {
            this._startX = this._lastX;
            this._isDragging = true;
            this.content.disableAnimation();
            this._offsetX = this.getOpenAmount();
          }
          if (this._isDragging) {
            this.openAmount(this._offsetX + (this._lastX - this._startX));
          }
        }
      });
    }(ionic));
  }());
  define('ionic', function (global) {
    return function () {
      var ret, fn;
      return ret || global.ionic;
    };
  }(this));
  (function () {
    var deprecated = {
        method: function (msg, log, fn) {
          var called = false;
          return function deprecatedMethod() {
            if (!called) {
              called = true;
              log(msg);
            }
            return fn.apply(this, arguments);
          };
        },
        field: function (msg, log, parent, field, val) {
          var called = false;
          var getter = function () {
            if (!called) {
              called = true;
              log(msg);
            }
            return val;
          };
          var setter = function (v) {
            if (!called) {
              called = true;
              log(msg);
            }
            val = v;
            return v;
          };
          Object.defineProperty(parent, field, {
            get: getter,
            set: setter,
            enumerable: true
          });
          return;
        }
      };
    var IonicModule = angular.module('ionic', [
        'ngAnimate',
        'ngSanitize',
        'ui.router'
      ]);
    IonicModule.factory('$ionicActionSheet', [
      '$rootScope',
      '$document',
      '$compile',
      '$animate',
      '$timeout',
      '$ionicTemplateLoader',
      '$ionicPlatform',
      function ($rootScope, $document, $compile, $animate, $timeout, $ionicTemplateLoader, $ionicPlatform) {
        return {
          show: function (opts) {
            var scope = $rootScope.$new(true);
            angular.extend(scope, {
              cancel: angular.noop,
              buttonClicked: angular.noop,
              destructiveButtonClicked: angular.noop
            }, opts);
            var element = $compile('<ion-action-sheet buttons="buttons"></ion-action-sheet>')(scope);
            var sheetEl = angular.element(element[0].querySelector('.action-sheet-wrapper'));
            var hideSheet = function (didCancel) {
              sheetEl.removeClass('action-sheet-up');
              if (didCancel) {
                $timeout(function () {
                  opts.cancel();
                }, 200);
              }
              $animate.removeClass(element, 'active', function () {
                scope.$destroy();
              });
              $document[0].body.classList.remove('action-sheet-open');
              scope.$deregisterBackButton && scope.$deregisterBackButton();
            };
            scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(function () {
              hideSheet();
            }, 300);
            scope.cancel = function () {
              hideSheet(true);
            };
            scope.buttonClicked = function (index) {
              if ((opts.buttonClicked && opts.buttonClicked(index)) === true) {
                hideSheet(false);
              }
            };
            scope.destructiveButtonClicked = function () {
              if ((opts.destructiveButtonClicked && opts.destructiveButtonClicked()) === true) {
                hideSheet(false);
              }
            };
            $document[0].body.appendChild(element[0]);
            $document[0].body.classList.add('action-sheet-open');
            var sheet = new ionic.views.ActionSheet({ el: element[0] });
            scope.sheet = sheet;
            $animate.addClass(element, 'active');
            $timeout(function () {
              sheetEl.addClass('action-sheet-up');
            }, 20);
            return sheet;
          }
        };
      }
    ]);
    angular.element.prototype.addClass = function (cssClasses) {
      var x, y, cssClass, el, splitClasses, existingClasses;
      if (cssClasses && cssClasses != 'ng-scope' && cssClasses != 'ng-isolate-scope') {
        for (x = 0; x < this.length; x++) {
          el = this[x];
          if (el.setAttribute) {
            if (cssClasses.indexOf(' ') < 0) {
              el.classList.add(cssClasses);
            } else {
              existingClasses = (' ' + (el.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ');
              splitClasses = cssClasses.split(' ');
              for (y = 0; y < splitClasses.length; y++) {
                cssClass = splitClasses[y].trim();
                if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
                  existingClasses += cssClass + ' ';
                }
              }
              el.setAttribute('class', existingClasses.trim());
            }
          }
        }
      }
      return this;
    };
    angular.element.prototype.removeClass = function (cssClasses) {
      var x, y, splitClasses, cssClass, el;
      if (cssClasses) {
        for (x = 0; x < this.length; x++) {
          el = this[x];
          if (el.getAttribute) {
            if (cssClasses.indexOf(' ') < 0) {
              el.classList.remove(cssClasses);
            } else {
              splitClasses = cssClasses.split(' ');
              for (y = 0; y < splitClasses.length; y++) {
                cssClass = splitClasses[y];
                el.setAttribute('class', (' ' + (el.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, ' ').replace(' ' + cssClass.trim() + ' ', ' ').trim());
              }
            }
          }
        }
      }
      return this;
    };
    IonicModule.factory('$ionicBackdrop', [
      '$document',
      function ($document) {
        var el = angular.element('<div class="backdrop">');
        var backdropHolds = 0;
        $document[0].body.appendChild(el[0]);
        return {
          retain: retain,
          release: release,
          _element: el
        };
        function retain() {
          if (++backdropHolds === 1) {
            el.addClass('visible');
            ionic.requestAnimationFrame(function () {
              backdropHolds && el.addClass('active');
            });
          }
        }
        function release() {
          if (--backdropHolds === 0) {
            el.removeClass('active');
            setTimeout(function () {
              !backdropHolds && el.removeClass('visible');
            }, 100);
          }
        }
      }
    ]);
    IonicModule.factory('$ionicBind', [
      '$parse',
      '$interpolate',
      function ($parse, $interpolate) {
        var LOCAL_REGEXP = /^\s*([@=&])(\??)\s*(\w*)\s*$/;
        return function (scope, attrs, bindDefinition) {
          angular.forEach(bindDefinition || {}, function (definition, scopeName) {
            var match = definition.match(LOCAL_REGEXP) || [], attrName = match[3] || scopeName, mode = match[1], parentGet, unwatch;
            switch (mode) {
            case '@':
              if (!attrs[attrName]) {
                return;
              }
              attrs.$observe(attrName, function (value) {
                scope[scopeName] = value;
              });
              if (attrs[attrName]) {
                scope[scopeName] = $interpolate(attrs[attrName])(scope);
              }
              break;
            case '=':
              if (!attrs[attrName]) {
                return;
              }
              unwatch = scope.$watch(attrs[attrName], function (value) {
                scope[scopeName] = value;
              });
              scope.$on('$destroy', unwatch);
              break;
            case '&':
              if (attrs[attrName] && attrs[attrName].match(RegExp(scopeName + '(.*?)'))) {
                throw new Error('& expression binding "' + scopeName + '" looks like it will recursively call "' + attrs[attrName] + '" and cause a stack overflow! Please choose a different scopeName.');
              }
              parentGet = $parse(attrs[attrName]);
              scope[scopeName] = function (locals) {
                return parentGet(scope, locals);
              };
              break;
            }
          });
        };
      }
    ]);
    IonicModule.factory('$collectionDataSource', [
      '$cacheFactory',
      '$parse',
      function ($cacheFactory, $parse) {
        var nextCacheId = 0;
        function CollectionRepeatDataSource(options) {
          var self = this;
          this.scope = options.scope;
          this.transcludeFn = options.transcludeFn;
          this.transcludeParent = options.transcludeParent;
          this.keyExpr = options.keyExpr;
          this.listExpr = options.listExpr;
          this.trackByExpr = options.trackByExpr;
          this.heightGetter = options.heightGetter;
          this.widthGetter = options.widthGetter;
          this.dimensions = [];
          this.data = [];
          if (this.trackByExpr) {
            var trackByGetter = $parse(this.trackByExpr);
            var hashFnLocals = { $id: hashKey };
            this.itemHashGetter = function (index, value) {
              hashFnLocals[self.keyExpr] = value;
              hashFnLocals.$index = index;
              return trackByGetter(self.scope, hashFnLocals);
            };
          } else {
            this.itemHashGetter = function (index, value) {
              return hashKey(value);
            };
          }
          var cacheKeys = {};
          this.itemCache = $cacheFactory(nextCacheId++, { size: 500 });
          var _put = this.itemCache.put;
          this.itemCache.put = function (key, value) {
            cacheKeys[key] = true;
            return _put(key, value);
          };
          var _remove = this.itemCache.remove;
          this.itemCache.remove = function (key) {
            delete cacheKeys[key];
            return _remove(key);
          };
          this.itemCache.keys = function () {
            return Object.keys(cacheKeys);
          };
        }
        CollectionRepeatDataSource.prototype = {
          destroy: function () {
            this.dimensions.length = 0;
            this.itemCache.keys().forEach(function (key) {
              var item = this.itemCache.get(key);
              item.element.remove();
              item.scope.$destroy();
            }, this);
            this.itemCache.removeAll();
          },
          calculateDataDimensions: function () {
            var locals = {};
            this.dimensions = this.data.map(function (value, index) {
              locals[this.keyExpr] = value;
              locals.$index = index;
              return {
                width: this.widthGetter(this.scope, locals),
                height: this.heightGetter(this.scope, locals)
              };
            }, this);
          },
          compileItem: function (index, value) {
            var key = this.itemHashGetter(index, value);
            var cachedItem = this.itemCache.get(key);
            if (cachedItem)
              return cachedItem;
            var item = {};
            item.scope = this.scope.$new();
            item.scope[this.keyExpr] = value;
            this.transcludeFn(item.scope, function (clone) {
              item.element = clone;
              item.element[0].style.position = 'absolute';
            });
            return this.itemCache.put(key, item);
          },
          getItem: function (index) {
            var value = this.data[index];
            var item = this.compileItem(index, value);
            if (item.scope.$index !== index) {
              item.scope.$index = index;
              item.scope.$first = index === 0;
              item.scope.$last = index === this.getLength() - 1;
              item.scope.$middle = !(item.scope.$first || item.scope.$last);
              item.scope.$odd = !(item.scope.$even = (index & 1) === 0);
            }
            return item;
          },
          detachItem: function (item) {
            var i, node, parent;
            for (i = 0; i < item.element.length; i++) {
              node = item.element[i];
              parent = node.parentNode;
              parent && parent.removeChild(node);
            }
            disconnectScope(item.scope);
          },
          attachItem: function (item) {
            if (!item.element[0].parentNode) {
              this.transcludeParent[0].appendChild(item.element[0]);
            }
            reconnectScope(item.scope);
          },
          getLength: function () {
            return this.data && this.data.length || 0;
          },
          setData: function (value) {
            this.data = value || [];
            this.calculateDataDimensions();
          }
        };
        return CollectionRepeatDataSource;
      }
    ]);
    function hashKey(obj) {
      var objType = typeof obj, key;
      if (objType == 'object' && obj !== null) {
        if (typeof (key = obj.$$hashKey) == 'function') {
          key = obj.$$hashKey();
        } else if (key === undefined) {
          key = obj.$$hashKey = ionic.Utils.nextUid();
        }
      } else {
        key = obj;
      }
      return objType + ':' + key;
    }
    function disconnectScope(scope) {
      if (scope.$root === scope) {
        return;
      }
      var parent = scope.$parent;
      scope.$$disconnected = true;
      if (parent.$$childHead === scope) {
        parent.$$childHead = scope.$$nextSibling;
      }
      if (parent.$$childTail === scope) {
        parent.$$childTail = scope.$$prevSibling;
      }
      if (scope.$$prevSibling) {
        scope.$$prevSibling.$$nextSibling = scope.$$nextSibling;
      }
      if (scope.$$nextSibling) {
        scope.$$nextSibling.$$prevSibling = scope.$$prevSibling;
      }
      scope.$$nextSibling = scope.$$prevSibling = null;
    }
    function reconnectScope(scope) {
      if (scope.$root === scope) {
        return;
      }
      if (!scope.$$disconnected) {
        return;
      }
      var parent = scope.$parent;
      scope.$$disconnected = false;
      scope.$$prevSibling = parent.$$childTail;
      if (parent.$$childHead) {
        parent.$$childTail.$$nextSibling = scope;
        parent.$$childTail = scope;
      } else {
        parent.$$childHead = parent.$$childTail = scope;
      }
    }
    IonicModule.factory('$collectionRepeatManager', [
      '$rootScope',
      '$timeout',
      function ($rootScope, $timeout) {
        function CollectionRepeatManager(options) {
          var self = this;
          this.dataSource = options.dataSource;
          this.element = options.element;
          this.scrollView = options.scrollView;
          this.isVertical = !!this.scrollView.options.scrollingY;
          this.renderedItems = {};
          this.lastRenderScrollValue = this.bufferTransformOffset = this.hasBufferStartIndex = this.hasBufferEndIndex = this.bufferItemsLength = 0;
          this.setCurrentIndex(0);
          this.scrollView.__$callback = this.scrollView.__callback;
          this.scrollView.__callback = angular.bind(this, this.renderScroll);
          function getViewportSize() {
            return self.viewportSize;
          }
          if (this.isVertical) {
            this.scrollView.options.getContentHeight = getViewportSize;
            this.scrollValue = function () {
              return this.scrollView.__scrollTop;
            };
            this.scrollMaxValue = function () {
              return this.scrollView.__maxScrollTop;
            };
            this.scrollSize = function () {
              return this.scrollView.__clientHeight;
            };
            this.secondaryScrollSize = function () {
              return this.scrollView.__clientWidth;
            };
            this.transformString = function (y, x) {
              return 'translate3d(' + x + 'px,' + y + 'px,0)';
            };
            this.primaryDimension = function (dim) {
              return dim.height;
            };
            this.secondaryDimension = function (dim) {
              return dim.width;
            };
          } else {
            this.scrollView.options.getContentWidth = getViewportSize;
            this.scrollValue = function () {
              return this.scrollView.__scrollLeft;
            };
            this.scrollMaxValue = function () {
              return this.scrollView.__maxScrollLeft;
            };
            this.scrollSize = function () {
              return this.scrollView.__clientWidth;
            };
            this.secondaryScrollSize = function () {
              return this.scrollView.__clientHeight;
            };
            this.transformString = function (x, y) {
              return 'translate3d(' + x + 'px,' + y + 'px,0)';
            };
            this.primaryDimension = function (dim) {
              return dim.width;
            };
            this.secondaryDimension = function (dim) {
              return dim.height;
            };
          }
        }
        CollectionRepeatManager.prototype = {
          destroy: function () {
            for (var i in this.renderedItems) {
              this.removeItem(i);
            }
          },
          calculateDimensions: function () {
            var primaryPos = 0;
            var secondaryPos = 0;
            var len = this.dataSource.dimensions.length;
            var secondaryScrollSize = this.secondaryScrollSize();
            var previous;
            return this.dataSource.dimensions.map(function (dim) {
              var rect = {
                  primarySize: this.primaryDimension(dim),
                  secondarySize: Math.min(this.secondaryDimension(dim), secondaryScrollSize)
                };
              if (previous) {
                secondaryPos += previous.secondarySize;
                if (previous.primaryPos === primaryPos && secondaryPos + rect.secondarySize > secondaryScrollSize) {
                  secondaryPos = 0;
                  primaryPos += previous.primarySize;
                } else {
                }
              }
              rect.primaryPos = primaryPos;
              rect.secondaryPos = secondaryPos;
              previous = rect;
              return rect;
            }, this);
          },
          resize: function () {
            this.dimensions = this.calculateDimensions();
            var last = this.dimensions[this.dimensions.length - 1];
            this.viewportSize = last ? last.primaryPos + last.primarySize : 0;
            this.setCurrentIndex(0);
            this.render(true);
          },
          setCurrentIndex: function (index, height) {
            this.currentIndex = index;
            this.hasPrevIndex = index > 0;
            if (this.hasPrevIndex) {
              this.previousPos = this.dimensions[index - 1].primaryPos;
            }
            this.hasNextIndex = index + 1 < this.dataSource.getLength();
            if (this.hasNextIndex) {
              this.nextPos = this.dimensions[index + 1].primaryPos;
            }
          },
          renderScroll: ionic.animationFrameThrottle(function (transformLeft, transformTop, zoom, wasResize) {
            if (this.isVertical) {
              transformTop = this.getTransformPosition(transformTop);
            } else {
              transformLeft = this.getTransformPosition(transformLeft);
            }
            return this.scrollView.__$callback(transformLeft, transformTop, zoom, wasResize);
          }),
          getTransformPosition: function (transformPos) {
            if (this.hasNextIndex && transformPos >= this.nextPos || this.hasPrevIndex && transformPos < this.previousPos || Math.abs(transformPos - this.lastRenderScrollValue) > 100) {
              this.render();
            }
            return transformPos - this.lastRenderScrollValue;
          },
          getIndexForScrollValue: function (i, scrollValue) {
            var rect;
            if (scrollValue <= this.dimensions[i].primaryPos) {
              while ((rect = this.dimensions[i - 1]) && rect.primaryPos > scrollValue) {
                i--;
              }
            } else {
              while ((rect = this.dimensions[i + 1]) && rect.primaryPos < scrollValue) {
                i++;
              }
            }
            return i;
          },
          render: function (shouldRedrawAll) {
            var i;
            if (this.currentIndex >= this.dataSource.getLength() || shouldRedrawAll) {
              for (i in this.renderedItems) {
                this.removeItem(i);
              }
              if (this.currentIndex >= this.dataSource.getLength())
                return null;
            }
            var rect;
            var scrollValue = this.scrollValue();
            var scrollDelta = scrollValue - this.lastRenderScrollValue;
            var scrollSize = this.scrollSize();
            var scrollSizeEnd = scrollSize + scrollValue;
            var startIndex = this.getIndexForScrollValue(this.currentIndex, scrollValue);
            var bufferStartIndex = Math.max(startIndex - 1, 0);
            while (bufferStartIndex > 0 && (rect = this.dimensions[bufferStartIndex]) && rect.primaryPos === this.dimensions[startIndex - 1].primaryPos) {
              bufferStartIndex--;
            }
            var startPos = this.dimensions[bufferStartIndex].primaryPos;
            i = bufferStartIndex;
            while ((rect = this.dimensions[i]) && rect.primaryPos - rect.primarySize < scrollSizeEnd) {
              this.renderItem(i, rect.primaryPos - startPos, rect.secondaryPos);
              i++;
            }
            var bufferEndIndex = i - 1;
            for (i in this.renderedItems) {
              if (i < bufferStartIndex || i > bufferEndIndex) {
                this.removeItem(i);
              }
            }
            this.setCurrentIndex(startIndex);
            this.lastRenderScrollValue = startPos;
            if (!this.dataSource.scope.$$phase) {
              this.dataSource.scope.$digest();
            }
          },
          renderItem: function (dataIndex, primaryPos, secondaryPos) {
            var item = this.dataSource.getItem(dataIndex);
            if (item) {
              this.dataSource.attachItem(item);
              item.element[0].style[ionic.CSS.TRANSFORM] = this.transformString(primaryPos, secondaryPos, secondaryPos);
              this.renderedItems[dataIndex] = item;
            } else {
              delete this.renderedItems[dataIndex];
            }
          },
          removeItem: function (dataIndex) {
            var item = this.renderedItems[dataIndex];
            if (item) {
              this.dataSource.detachItem(item);
              delete this.renderedItems[dataIndex];
            }
          }
        };
        return CollectionRepeatManager;
      }
    ]);
    function delegateService(methodNames) {
      return [
        '$log',
        function ($log) {
          var delegate = this;
          var instances = this._instances = [];
          this._registerInstance = function (instance, handle) {
            instance.$$delegateHandle = handle;
            instances.push(instance);
            return function deregister() {
              var index = instances.indexOf(instance);
              if (index !== -1) {
                instances.splice(index, 1);
              }
            };
          };
          this.$getByHandle = function (handle) {
            if (!handle) {
              return delegate;
            }
            return new InstanceForHandle(handle);
          };
          function InstanceForHandle(handle) {
            this.handle = handle;
          }
          methodNames.forEach(function (methodName) {
            InstanceForHandle.prototype[methodName] = function () {
              var handle = this.handle;
              var args = arguments;
              var matchingInstancesFound = 0;
              var finalResult;
              var result;
              instances.forEach(function (instance) {
                if (instance.$$delegateHandle === handle) {
                  matchingInstancesFound++;
                  result = instance[methodName].apply(instance, args);
                  if (matchingInstancesFound === 1) {
                    finalResult = result;
                  }
                }
              });
              if (!matchingInstancesFound) {
                return $log.warn('Delegate for handle "' + this.handle + '" could not find a ' + 'corresponding element with delegate-handle="' + this.handle + '"! ' + methodName + '() was not called!\n' + 'Possible cause: If you are calling ' + methodName + '() immediately, and ' + 'your element with delegate-handle="' + this.handle + '" is a child of your ' + 'controller, then your element may not be compiled yet. Put a $timeout ' + 'around your call to ' + methodName + '() and try again.');
              }
              return finalResult;
            };
            delegate[methodName] = function () {
              var args = arguments;
              var finalResult;
              var result;
              instances.forEach(function (instance, index) {
                result = instance[methodName].apply(instance, args);
                if (index === 0) {
                  finalResult = result;
                }
              });
              return finalResult;
            };
            function callMethod(instancesToUse, methodName, args) {
              var finalResult;
              var result;
              instancesToUse.forEach(function (instance, index) {
                result = instance[methodName].apply(instance, args);
                if (index === 0) {
                  finalResult = result;
                }
              });
              return finalResult;
            }
          });
        }
      ];
    }
    IonicModule.factory('$ionicGesture', [function () {
        return {
          on: function (eventType, cb, $element) {
            return window.ionic.onGesture(eventType, cb, $element[0]);
          },
          off: function (gesture, eventType, cb) {
            return window.ionic.offGesture(gesture, eventType, cb);
          }
        };
      }]);
    var LOADING_TPL = '<div class="loading">' + '</div>';
    var LOADING_HIDE_DEPRECATED = '$ionicLoading instance.hide() has been deprecated. Use $ionicLoading.hide().';
    var LOADING_SHOW_DEPRECATED = '$ionicLoading instance.show() has been deprecated. Use $ionicLoading.show().';
    var LOADING_SET_DEPRECATED = '$ionicLoading instance.setContent() has been deprecated. Use $ionicLoading.show({ template: \'my content\' }).';
    IonicModule.factory('$ionicLoading', [
      '$document',
      '$ionicTemplateLoader',
      '$ionicBackdrop',
      '$timeout',
      '$q',
      '$log',
      '$compile',
      function ($document, $ionicTemplateLoader, $ionicBackdrop, $timeout, $q, $log, $compile) {
        var loaderInstance;
        var loadingShowDelay = $q.when();
        return {
          show: showLoader,
          hide: hideLoader,
          _getLoader: getLoader
        };
        function getLoader() {
          if (!loaderInstance) {
            loaderInstance = $ionicTemplateLoader.compile({
              template: LOADING_TPL,
              appendTo: $document[0].body
            }).then(function (loader) {
              var self = loader;
              loader.show = function (options) {
                var templatePromise = options.templateUrl ? $ionicTemplateLoader.load(options.templateUrl) : $q.when(options.template || options.content || '');
                if (!this.isShown) {
                  this.hasBackdrop = !options.noBackdrop && options.showBackdrop !== false;
                  if (this.hasBackdrop) {
                    $ionicBackdrop.retain();
                  }
                }
                if (options.duration) {
                  $timeout.cancel(this.durationTimeout);
                  this.durationTimeout = $timeout(angular.bind(this, this.hide), +options.duration);
                }
                templatePromise.then(function (html) {
                  if (html) {
                    self.element.html(html);
                    $compile(self.element.contents())(self.scope);
                  }
                  if (self.isShown) {
                    self.element.addClass('visible');
                    ionic.DomUtil.centerElementByMarginTwice(self.element[0]);
                    ionic.requestAnimationFrame(function () {
                      self.isShown && self.element.addClass('active');
                    });
                  }
                });
                this.isShown = true;
              };
              loader.hide = function () {
                if (this.isShown) {
                  if (this.hasBackdrop) {
                    $ionicBackdrop.release();
                  }
                  self.element.removeClass('active');
                  setTimeout(function () {
                    !self.isShown && self.element.removeClass('visible');
                  }, 200);
                }
                $timeout.cancel(this.durationTimeout);
                this.isShown = false;
              };
              return loader;
            });
          }
          return $q.when(loaderInstance);
        }
        function showLoader(options) {
          options || (options = {});
          var delay = options.delay || options.showDelay || 0;
          $timeout.cancel(loadingShowDelay);
          loadingShowDelay = $timeout(angular.noop, delay);
          loadingShowDelay.then(getLoader).then(function (loader) {
            return loader.show(options);
          });
          return {
            hide: deprecated.method(LOADING_HIDE_DEPRECATED, $log.error, hideLoader),
            show: deprecated.method(LOADING_SHOW_DEPRECATED, $log.error, function () {
              showLoader(options);
            }),
            setContent: deprecated.method(LOADING_SET_DEPRECATED, $log.error, function (content) {
              getLoader().then(function (loader) {
                loader.show({ template: content });
              });
            })
          };
        }
        function hideLoader() {
          $timeout.cancel(loadingShowDelay);
          getLoader().then(function (loader) {
            loader.hide();
          });
        }
      }
    ]);
    IonicModule.factory('$ionicModal', [
      '$rootScope',
      '$document',
      '$compile',
      '$timeout',
      '$ionicPlatform',
      '$ionicTemplateLoader',
      '$q',
      function ($rootScope, $document, $compile, $timeout, $ionicPlatform, $ionicTemplateLoader, $q) {
        var ModalView = ionic.views.Modal.inherit({
            initialize: function (opts) {
              ionic.views.Modal.prototype.initialize.call(this, opts);
              this.animation = opts.animation || 'slide-in-up';
            },
            show: function () {
              var self = this;
              var modalEl = angular.element(self.modalEl);
              self.el.classList.remove('hide');
              $document[0].body.classList.add('modal-open');
              if (!self.el.parentElement) {
                modalEl.addClass(self.animation);
                $document[0].body.appendChild(self.el);
              }
              modalEl.addClass('ng-enter active').removeClass('ng-leave ng-leave-active');
              self._isShown = true;
              self._deregisterBackButton = $ionicPlatform.registerBackButtonAction(function () {
                self.hide();
              }, 200);
              self._isOpenPromise = $q.defer();
              ionic.views.Modal.prototype.show.call(self);
              $timeout(function () {
                modalEl.addClass('ng-enter-active');
                self.scope.$parent && self.scope.$parent.$broadcast('modal.shown', self);
                self.el.classList.add('active');
              }, 20);
              return $timeout(angular.noop, 400);
            },
            hide: function () {
              var self = this;
              var modalEl = angular.element(self.modalEl);
              self.el.classList.remove('active');
              modalEl.addClass('ng-leave');
              $timeout(function () {
                modalEl.addClass('ng-leave-active').removeClass('ng-enter ng-enter-active active');
              }, 20);
              self._isShown = false;
              self.scope.$parent && self.scope.$parent.$broadcast('modal.hidden', self);
              self._deregisterBackButton && self._deregisterBackButton();
              ionic.views.Modal.prototype.hide.call(self);
              return $timeout(function () {
                $document[0].body.classList.remove('modal-open');
                self.el.classList.add('hide');
              }, 500);
            },
            remove: function () {
              var self = this;
              self.scope.$parent && self.scope.$parent.$broadcast('modal.removed', self);
              return self.hide().then(function () {
                self.scope.$destroy();
                angular.element(self.el).remove();
              });
            },
            isShown: function () {
              return !!this._isShown;
            }
          });
        var createModal = function (templateString, options) {
          var scope = options.scope && options.scope.$new() || $rootScope.$new(true);
          var element = $compile('<ion-modal>' + templateString + '</ion-modal>')(scope);
          options.el = element[0];
          options.modalEl = options.el.querySelector('.modal');
          var modal = new ModalView(options);
          modal.scope = scope;
          if (!options.scope) {
            scope.modal = modal;
          }
          return modal;
        };
        return {
          fromTemplate: function (templateString, options) {
            var modal = createModal(templateString, options || {});
            return modal;
          },
          fromTemplateUrl: function (url, options, _) {
            var cb;
            if (angular.isFunction(options)) {
              cb = options;
              options = _;
            }
            return $ionicTemplateLoader.load(url).then(function (templateString) {
              var modal = createModal(templateString, options || {});
              cb && cb(modal);
              return modal;
            });
          }
        };
      }
    ]);
    IonicModule.service('$ionicNavBarDelegate', delegateService([
      'back',
      'align',
      'showBackButton',
      'showBar',
      'setTitle',
      'changeTitle',
      'getTitle',
      'getPreviousTitle'
    ]));
    IonicModule.provider('$ionicPlatform', function () {
      return {
        $get: [
          '$q',
          '$rootScope',
          function ($q, $rootScope) {
            var self = {
                onHardwareBackButton: function (cb) {
                  ionic.Platform.ready(function () {
                    document.addEventListener('backbutton', cb, false);
                  });
                },
                offHardwareBackButton: function (fn) {
                  ionic.Platform.ready(function () {
                    document.removeEventListener('backbutton', fn);
                  });
                },
                $backButtonActions: {},
                registerBackButtonAction: function (fn, priority, actionId) {
                  if (!self._hasBackButtonHandler) {
                    self.$backButtonActions = {};
                    self.onHardwareBackButton(self.hardwareBackButtonClick);
                    self._hasBackButtonHandler = true;
                  }
                  var action = {
                      id: actionId ? actionId : ionic.Utils.nextUid(),
                      priority: priority ? priority : 0,
                      fn: fn
                    };
                  self.$backButtonActions[action.id] = action;
                  return function () {
                    delete self.$backButtonActions[action.id];
                  };
                },
                hardwareBackButtonClick: function (e) {
                  var priorityAction, actionId;
                  for (actionId in self.$backButtonActions) {
                    if (!priorityAction || self.$backButtonActions[actionId].priority >= priorityAction.priority) {
                      priorityAction = self.$backButtonActions[actionId];
                    }
                  }
                  if (priorityAction) {
                    priorityAction.fn(e);
                    return priorityAction;
                  }
                },
                is: function (type) {
                  return ionic.Platform.is(type);
                },
                ready: function (cb) {
                  var q = $q.defer();
                  ionic.Platform.ready(function () {
                    q.resolve();
                    cb && cb();
                  });
                  return q.promise;
                }
              };
            return self;
          }
        ]
      };
    });
    var POPUP_TPL = '<div class="popup">' + '<div class="popup-head">' + '<h3 class="popup-title" ng-bind-html="title"></h3>' + '<h5 class="popup-sub-title" ng-bind-html="subTitle" ng-if="subTitle"></h5>' + '</div>' + '<div class="popup-body">' + '</div>' + '<div class="popup-buttons row">' + '<button ng-repeat="button in buttons" ng-click="$buttonTapped(button, $event)" class="button col" ng-class="button.type || \'button-default\'" ng-bind-html="button.text"></button>' + '</div>' + '</div>';
    IonicModule.factory('$ionicPopup', [
      '$animate',
      '$ionicTemplateLoader',
      '$ionicBackdrop',
      '$log',
      '$q',
      '$timeout',
      '$rootScope',
      '$document',
      '$compile',
      function ($animate, $ionicTemplateLoader, $ionicBackdrop, $log, $q, $timeout, $rootScope, $document, $compile) {
        var config = { stackPushDelay: 50 };
        var popupStack = [];
        var $ionicPopup = {
            show: showPopup,
            alert: showAlert,
            confirm: showConfirm,
            prompt: showPrompt,
            _createPopup: createPopup,
            _popupStack: popupStack
          };
        return $ionicPopup;
        function createPopup(options) {
          options = angular.extend({
            scope: null,
            title: '',
            buttons: []
          }, options || {});
          var popupPromise = $ionicTemplateLoader.compile({
              template: POPUP_TPL,
              scope: options.scope && options.scope.$new(),
              appendTo: $document[0].body
            });
          var contentPromise = options.templateUrl ? $ionicTemplateLoader.load(options.templateUrl) : $q.when(options.template || options.content || '');
          return $q.all([
            popupPromise,
            contentPromise
          ]).then(function (results) {
            var self = results[0];
            var content = results[1];
            var responseDeferred = $q.defer();
            self.responseDeferred = responseDeferred;
            var body = angular.element(self.element[0].querySelector('.popup-body'));
            if (content) {
              body.html(content);
              $compile(body.contents())(self.scope);
            } else {
              body.remove();
            }
            angular.extend(self.scope, {
              title: options.title,
              buttons: options.buttons,
              subTitle: options.subTitle,
              $buttonTapped: function (button, event) {
                var result = (button.onTap || angular.noop)(event);
                event = event.originalEvent || event;
                if (!event.defaultPrevented) {
                  responseDeferred.resolve(result);
                }
              }
            });
            self.show = function () {
              if (self.isShown)
                return;
              self.isShown = true;
              ionic.requestAnimationFrame(function () {
                if (!self.isShown)
                  return;
                self.element.removeClass('popup-hidden');
                self.element.addClass('popup-showing active');
                ionic.DomUtil.centerElementByMarginTwice(self.element[0]);
                focusInputOrButton(self.element);
              });
            };
            self.hide = function (callback) {
              callback = callback || angular.noop;
              if (!self.isShown)
                return callback();
              self.isShown = false;
              self.element.removeClass('active');
              self.element.addClass('popup-hidden');
              $timeout(callback, 250);
            };
            self.remove = function () {
              if (self.removed)
                return;
              self.hide(function () {
                self.element.remove();
                self.scope.$destroy();
              });
              self.removed = true;
            };
            return self;
          });
        }
        function showPopup(options) {
          var popupPromise = $ionicPopup._createPopup(options);
          var previousPopup = popupStack[0];
          if (previousPopup) {
            previousPopup.hide();
          }
          var resultPromise = $timeout(angular.noop, previousPopup ? config.stackPushDelay : 0).then(function () {
              return popupPromise;
            }).then(function (popup) {
              if (!previousPopup) {
                document.body.classList.add('popup-open');
                $ionicBackdrop.retain();
              }
              popupStack.unshift(popup);
              popup.show();
              popup.responseDeferred.notify({ close: resultPromise.close });
              return popup.responseDeferred.promise.then(function (result) {
                var index = popupStack.indexOf(popup);
                if (index !== -1) {
                  popupStack.splice(index, 1);
                }
                popup.remove();
                var previousPopup = popupStack[0];
                if (previousPopup) {
                  previousPopup.show();
                } else {
                  document.body.classList.remove('popup-open');
                  $ionicBackdrop.release();
                }
                return result;
              });
            });
          function close(result) {
            popupPromise.then(function (popup) {
              if (!popup.removed) {
                popup.responseDeferred.resolve(result);
              }
            });
          }
          resultPromise.close = close;
          return resultPromise;
        }
        function focusInputOrButton(element) {
          var inputs = element[0].querySelectorAll('input');
          if (!inputs.length) {
            inputs = element[0].querySelectorAll('button');
          }
          var last = inputs[inputs.length - 1];
          if (last) {
            last.focus();
          }
        }
        function showAlert(opts) {
          return showPopup(angular.extend({
            buttons: [{
                text: opts.okText || 'OK',
                type: opts.okType || 'button-positive',
                onTap: function (e) {
                  return true;
                }
              }]
          }, opts || {}));
        }
        function showConfirm(opts) {
          return showPopup(angular.extend({
            buttons: [
              {
                text: opts.cancelText || 'Cancel',
                type: opts.cancelType || 'button-default',
                onTap: function (e) {
                  return false;
                }
              },
              {
                text: opts.okText || 'OK',
                type: opts.okType || 'button-positive',
                onTap: function (e) {
                  return true;
                }
              }
            ]
          }, opts || {}));
        }
        function showPrompt(opts) {
          var scope = $rootScope.$new(true);
          scope.data = {};
          return showPopup(angular.extend({
            template: '<input ng-model="data.response" type="' + (opts.inputType || 'text') + '" placeholder="' + (opts.inputPlaceholder || '') + '">',
            scope: scope,
            buttons: [
              {
                text: opts.cancelText || 'Cancel',
                type: opts.cancelType || 'button-default',
                onTap: function (e) {
                }
              },
              {
                text: opts.okText || 'OK',
                type: opts.okType || 'button-positive',
                onTap: function (e) {
                  return scope.data.response || '';
                }
              }
            ]
          }, opts || {}));
        }
      }
    ]);
    IonicModule.service('$ionicScrollDelegate', delegateService([
      'resize',
      'scrollTop',
      'scrollBottom',
      'scrollTo',
      'scrollBy',
      'getScrollPosition',
      'anchorScroll',
      'getScrollView',
      'rememberScrollPosition',
      'forgetScrollPosition',
      'scrollToRememberedPosition'
    ]));
    IonicModule.service('$ionicSideMenuDelegate', delegateService([
      'toggleLeft',
      'toggleRight',
      'getOpenRatio',
      'isOpen',
      'isOpenLeft',
      'isOpenRight',
      'canDragContent'
    ]));
    IonicModule.service('$ionicSlideBoxDelegate', delegateService([
      'update',
      'slide',
      'previous',
      'next',
      'stop',
      'currentIndex',
      'slidesCount'
    ]));
    IonicModule.service('$ionicTabsDelegate', delegateService([
      'select',
      'selectedIndex'
    ]));
    IonicModule.factory('$ionicTemplateLoader', [
      '$compile',
      '$controller',
      '$http',
      '$q',
      '$rootScope',
      '$templateCache',
      function ($compile, $controller, $http, $q, $rootScope, $templateCache) {
        return {
          load: fetchTemplate,
          compile: loadAndCompile
        };
        function fetchTemplate(url) {
          return $http.get(url, { cache: $templateCache }).then(function (response) {
            return response.data && response.data.trim();
          });
        }
        function loadAndCompile(options) {
          options = angular.extend({
            template: '',
            templateUrl: '',
            scope: null,
            controller: null,
            locals: {},
            appendTo: null
          }, options || {});
          var templatePromise = options.templateUrl ? this.load(options.templateUrl) : $q.when(options.template);
          return templatePromise.then(function (template) {
            var controller;
            var scope = options.scope || $rootScope.$new();
            var element = angular.element('<div>').html(template).contents();
            if (options.controller) {
              controller = $controller(options.controller, angular.extend(options.locals, { $scope: scope }));
              element.children().data('$ngControllerController', controller);
            }
            if (options.appendTo) {
              angular.element(options.appendTo).append(element);
            }
            $compile(element)(scope);
            return {
              element: element,
              scope: scope
            };
          });
        }
      }
    ]);
    IonicModule.run([
      '$rootScope',
      '$state',
      '$location',
      '$document',
      '$animate',
      '$ionicPlatform',
      '$ionicViewService',
      function ($rootScope, $state, $location, $document, $animate, $ionicPlatform, $ionicViewService) {
        $rootScope.$viewHistory = {
          histories: {
            root: {
              historyId: 'root',
              parentHistoryId: null,
              stack: [],
              cursor: -1
            }
          },
          views: {},
          backView: null,
          forwardView: null,
          currentView: null,
          disabledRegistrableTagNames: []
        };
        if ($ionicViewService.disableRegisterByTagName) {
          $ionicViewService.disableRegisterByTagName('ion-tabs');
          $ionicViewService.disableRegisterByTagName('ion-side-menus');
        }
        $rootScope.$on('viewState.changeHistory', function (e, data) {
          if (!data)
            return;
          var hist = data.historyId ? $rootScope.$viewHistory.histories[data.historyId] : null;
          if (hist && hist.cursor > -1 && hist.cursor < hist.stack.length) {
            var view = hist.stack[hist.cursor];
            return view.go(data);
          }
          if (!data.url && data.uiSref) {
            data.url = $state.href(data.uiSref);
          }
          if (data.url) {
            if (data.url.indexOf('#') === 0) {
              data.url = data.url.replace('#', '');
            }
            if (data.url !== $location.url()) {
              $location.url(data.url);
            }
          }
        });
        $rootScope.$on('viewState.viewEnter', function (e, data) {
          if (data && data.title) {
            $document[0].title = data.title;
          }
        });
        function onHardwareBackButton(e) {
          if ($rootScope.$viewHistory.backView) {
            $rootScope.$viewHistory.backView.go();
          } else {
            ionic.Platform.exitApp();
          }
          e.preventDefault();
          return false;
        }
        $ionicPlatform.registerBackButtonAction(onHardwareBackButton, 100);
      }
    ]).factory('$ionicViewService', [
      '$rootScope',
      '$state',
      '$location',
      '$window',
      '$injector',
      '$animate',
      function ($rootScope, $state, $location, $window, $injector, $animate) {
        var View = function () {
        };
        View.prototype.initialize = function (data) {
          if (data) {
            for (var name in data)
              this[name] = data[name];
            return this;
          }
          return null;
        };
        View.prototype.go = function () {
          if (this.stateName) {
            return $state.go(this.stateName, this.stateParams);
          }
          if (this.url && this.url !== $location.url()) {
            if ($rootScope.$viewHistory.backView === this) {
              return $window.history.go(-1);
            } else if ($rootScope.$viewHistory.forwardView === this) {
              return $window.history.go(1);
            }
            $location.url(this.url);
            return;
          }
          return null;
        };
        View.prototype.destroy = function () {
          if (this.scope) {
            this.scope.$destroy && this.scope.$destroy();
            this.scope = null;
          }
        };
        function createViewId(stateId) {
          return ionic.Utils.nextUid();
        }
        return {
          register: function (containerScope, element) {
            var viewHistory = $rootScope.$viewHistory, currentStateId = this.getCurrentStateId(), hist = this._getHistory(containerScope), currentView = viewHistory.currentView, backView = viewHistory.backView, forwardView = viewHistory.forwardView, nextViewOptions = this.nextViewOptions(), rsp = {
                viewId: null,
                navAction: null,
                navDirection: null,
                historyId: hist.historyId
              };
            if (element && !this.isTagNameRegistrable(element)) {
              rsp.navAction = 'disabledByTagName';
              return rsp;
            }
            if (currentView && currentView.stateId === currentStateId && currentView.historyId === hist.historyId) {
              rsp.navAction = 'noChange';
              return rsp;
            }
            if (viewHistory.forcedNav) {
              ionic.Utils.extend(rsp, viewHistory.forcedNav);
              $rootScope.$viewHistory.forcedNav = null;
            } else if (backView && backView.stateId === currentStateId) {
              rsp.viewId = backView.viewId;
              rsp.navAction = 'moveBack';
              rsp.viewId = backView.viewId;
              if (backView.historyId === currentView.historyId) {
                rsp.navDirection = 'back';
              }
            } else if (forwardView && forwardView.stateId === currentStateId) {
              rsp.viewId = forwardView.viewId;
              rsp.navAction = 'moveForward';
              if (forwardView.historyId === currentView.historyId) {
                rsp.navDirection = 'forward';
              }
              var parentHistory = this._getParentHistoryObj(containerScope);
              if (forwardView.historyId && parentHistory.scope) {
                parentHistory.scope.$historyId = forwardView.historyId;
                rsp.historyId = forwardView.historyId;
              }
            } else if (currentView && currentView.historyId !== hist.historyId && hist.cursor > -1 && hist.stack.length > 0 && hist.cursor < hist.stack.length && hist.stack[hist.cursor].stateId === currentStateId) {
              rsp.viewId = hist.stack[hist.cursor].viewId;
              rsp.navAction = 'moveBack';
            } else {
              rsp.viewId = createViewId(currentStateId);
              if (currentView) {
                currentView.forwardViewId = rsp.viewId;
                if (hist.historyId === currentView.historyId) {
                  rsp.navDirection = 'forward';
                }
                rsp.navAction = 'newView';
                if (forwardView && currentView.stateId !== forwardView.stateId) {
                  var forwardsHistory = this._getHistoryById(forwardView.historyId);
                  if (forwardsHistory) {
                    for (var x = forwardsHistory.stack.length - 1; x >= forwardView.index; x--) {
                      forwardsHistory.stack[x].destroy();
                      forwardsHistory.stack.splice(x);
                    }
                  }
                }
              } else {
                rsp.navAction = 'initialView';
              }
              viewHistory.views[rsp.viewId] = this.createView({
                viewId: rsp.viewId,
                index: hist.stack.length,
                historyId: hist.historyId,
                backViewId: currentView && currentView.viewId ? currentView.viewId : null,
                forwardViewId: null,
                stateId: currentStateId,
                stateName: this.getCurrentStateName(),
                stateParams: this.getCurrentStateParams(),
                url: $location.url()
              });
              if (rsp.navAction == 'moveBack') {
                $rootScope.$emit('$viewHistory.viewBack', currentView.viewId, rsp.viewId);
              }
              hist.stack.push(viewHistory.views[rsp.viewId]);
            }
            if (nextViewOptions) {
              if (nextViewOptions.disableAnimate)
                rsp.navDirection = null;
              if (nextViewOptions.disableBack)
                viewHistory.views[rsp.viewId].backViewId = null;
              this.nextViewOptions(null);
            }
            this.setNavViews(rsp.viewId);
            hist.cursor = viewHistory.currentView.index;
            return rsp;
          },
          setNavViews: function (viewId) {
            var viewHistory = $rootScope.$viewHistory;
            viewHistory.currentView = this._getViewById(viewId);
            viewHistory.backView = this._getBackView(viewHistory.currentView);
            viewHistory.forwardView = this._getForwardView(viewHistory.currentView);
            $rootScope.$broadcast('$viewHistory.historyChange', { showBack: viewHistory.backView && viewHistory.backView.historyId === viewHistory.currentView.historyId });
          },
          registerHistory: function (scope) {
            scope.$historyId = ionic.Utils.nextUid();
          },
          createView: function (data) {
            var newView = new View();
            return newView.initialize(data);
          },
          getCurrentView: function () {
            return $rootScope.$viewHistory.currentView;
          },
          getBackView: function () {
            return $rootScope.$viewHistory.backView;
          },
          getForwardView: function () {
            return $rootScope.$viewHistory.forwardView;
          },
          getNavDirection: function () {
            return $rootScope.$viewHistory.navDirection;
          },
          getCurrentStateName: function () {
            return $state && $state.current ? $state.current.name : null;
          },
          isCurrentStateNavView: function (navView) {
            return $state && $state.current && $state.current.views && $state.current.views[navView] ? true : false;
          },
          getCurrentStateParams: function () {
            var rtn;
            if ($state && $state.params) {
              for (var key in $state.params) {
                if ($state.params.hasOwnProperty(key)) {
                  rtn = rtn || {};
                  rtn[key] = $state.params[key];
                }
              }
            }
            return rtn;
          },
          getCurrentStateId: function () {
            var id;
            if ($state && $state.current && $state.current.name) {
              id = $state.current.name;
              if ($state.params) {
                for (var key in $state.params) {
                  if ($state.params.hasOwnProperty(key) && $state.params[key]) {
                    id += '_' + key + '=' + $state.params[key];
                  }
                }
              }
              return id;
            }
            return ionic.Utils.nextUid();
          },
          goToHistoryRoot: function (historyId) {
            if (historyId) {
              var hist = $rootScope.$viewHistory.histories[historyId];
              if (hist && hist.stack.length) {
                if ($rootScope.$viewHistory.currentView && $rootScope.$viewHistory.currentView.viewId === hist.stack[0].viewId) {
                  return;
                }
                $rootScope.$viewHistory.forcedNav = {
                  viewId: hist.stack[0].viewId,
                  navAction: 'moveBack',
                  navDirection: 'back'
                };
                hist.stack[0].go();
              }
            }
          },
          _getViewById: function (viewId) {
            return viewId ? $rootScope.$viewHistory.views[viewId] : null;
          },
          _getBackView: function (view) {
            return view ? this._getViewById(view.backViewId) : null;
          },
          _getForwardView: function (view) {
            return view ? this._getViewById(view.forwardViewId) : null;
          },
          _getHistoryById: function (historyId) {
            return historyId ? $rootScope.$viewHistory.histories[historyId] : null;
          },
          _getHistory: function (scope) {
            var histObj = this._getParentHistoryObj(scope);
            if (!$rootScope.$viewHistory.histories[histObj.historyId]) {
              $rootScope.$viewHistory.histories[histObj.historyId] = {
                historyId: histObj.historyId,
                parentHistoryId: this._getParentHistoryObj(histObj.scope.$parent).historyId,
                stack: [],
                cursor: -1
              };
            }
            return $rootScope.$viewHistory.histories[histObj.historyId];
          },
          _getParentHistoryObj: function (scope) {
            var parentScope = scope;
            while (parentScope) {
              if (parentScope.hasOwnProperty('$historyId')) {
                return {
                  historyId: parentScope.$historyId,
                  scope: parentScope
                };
              }
              parentScope = parentScope.$parent;
            }
            return {
              historyId: 'root',
              scope: $rootScope
            };
          },
          nextViewOptions: function (opts) {
            if (arguments.length) {
              this._nextOpts = opts;
            } else {
              return this._nextOpts;
            }
          },
          getRenderer: function (navViewElement, navViewAttrs, navViewScope) {
            var service = this;
            var registerData;
            var doAnimation;
            var animationClass = getParentAnimationClass(navViewElement[0]);
            function getParentAnimationClass(el) {
              var className = '';
              while (!className && el) {
                className = el.getAttribute('animation');
                el = el.parentElement;
              }
              return className;
            }
            function setAnimationClass() {
              if (animationClass) {
                navViewElement[0].classList.add(animationClass);
              }
              if (registerData.navDirection === 'back') {
                navViewElement[0].classList.add('reverse');
              } else {
                navViewElement[0].classList.remove('reverse');
              }
            }
            return function (shouldAnimate) {
              return {
                enter: function (element) {
                  if (doAnimation && shouldAnimate) {
                    setAnimationClass();
                    element.addClass('ng-enter');
                    document.body.classList.add('disable-pointer-events');
                    $animate.enter(element, navViewElement, null, function () {
                      document.body.classList.remove('disable-pointer-events');
                      if (animationClass) {
                        navViewElement[0].classList.remove(animationClass);
                      }
                    });
                    return;
                  }
                  navViewElement.append(element);
                },
                leave: function () {
                  var element = navViewElement.contents();
                  if (doAnimation && shouldAnimate) {
                    setAnimationClass();
                    $animate.leave(element, function () {
                      element.remove();
                    });
                    return;
                  }
                  element.remove();
                },
                register: function (element) {
                  registerData = service.register(navViewScope, element);
                  doAnimation = animationClass !== null && registerData.navDirection !== null;
                  return registerData;
                }
              };
            };
          },
          disableRegisterByTagName: function (tagName) {
            $rootScope.$viewHistory.disabledRegistrableTagNames.push(tagName.toUpperCase());
          },
          isTagNameRegistrable: function (element) {
            var x, y, disabledTags = $rootScope.$viewHistory.disabledRegistrableTagNames;
            for (x = 0; x < element.length; x++) {
              if (element[x].nodeType !== 1)
                continue;
              for (y = 0; y < disabledTags.length; y++) {
                if (element[x].tagName === disabledTags[y]) {
                  return false;
                }
              }
            }
            return true;
          },
          clearHistory: function () {
            var histories = $rootScope.$viewHistory.histories, currentView = $rootScope.$viewHistory.currentView;
            for (var historyId in histories) {
              if (histories[historyId].stack) {
                histories[historyId].stack = [];
                histories[historyId].cursor = -1;
              }
              if (currentView.historyId === historyId) {
                currentView.backViewId = null;
                currentView.forwardViewId = null;
                histories[historyId].stack.push(currentView);
              } else if (histories[historyId].destroy) {
                histories[historyId].destroy();
              }
            }
            for (var viewId in $rootScope.$viewHistory.views) {
              if (viewId !== currentView.viewId) {
                delete $rootScope.$viewHistory.views[viewId];
              }
            }
            this.setNavViews(currentView.viewId);
          }
        };
      }
    ]);
    IonicModule.config([
      '$provide',
      function ($provide) {
        function $LocationDecorator($location, $timeout) {
          $location.__hash = $location.hash;
          $location.hash = function (value) {
            if (angular.isDefined(value)) {
              $timeout(function () {
                var scroll = document.querySelector('.scroll-content');
                if (scroll)
                  scroll.scrollTop = 0;
              }, 0, false);
            }
            return $location.__hash(value);
          };
          return $location;
        }
        $provide.decorator('$location', [
          '$delegate',
          '$timeout',
          $LocationDecorator
        ]);
      }
    ]);
    IonicModule.service('$ionicListDelegate', delegateService([
      'showReorder',
      'showDelete',
      'canSwipeItems',
      'closeOptionButtons'
    ])).controller('$ionicList', [
      '$scope',
      '$attrs',
      '$parse',
      '$ionicListDelegate',
      function ($scope, $attrs, $parse, $ionicListDelegate) {
        var isSwipeable = true;
        var isReorderShown = false;
        var isDeleteShown = false;
        var deregisterInstance = $ionicListDelegate._registerInstance(this, $attrs.delegateHandle);
        $scope.$on('$destroy', deregisterInstance);
        this.showReorder = function (show) {
          if (arguments.length) {
            isReorderShown = !!show;
          }
          return isReorderShown;
        };
        this.showDelete = function (show) {
          if (arguments.length) {
            isDeleteShown = !!show;
          }
          return isDeleteShown;
        };
        this.canSwipeItems = function (can) {
          if (arguments.length) {
            isSwipeable = !!can;
          }
          return isSwipeable;
        };
        this.closeOptionButtons = function () {
          this.listView && this.listView.clearDragEffects();
        };
      }
    ]);
    IonicModule.controller('$ionicNavBar', [
      '$scope',
      '$element',
      '$attrs',
      '$ionicViewService',
      '$animate',
      '$compile',
      '$ionicNavBarDelegate',
      function ($scope, $element, $attrs, $ionicViewService, $animate, $compile, $ionicNavBarDelegate) {
        $element.parent().data('$ionNavBarController', this);
        var deregisterInstance = $ionicNavBarDelegate._registerInstance(this, $attrs.delegateHandle);
        $scope.$on('$destroy', deregisterInstance);
        var self = this;
        this.leftButtonsElement = angular.element($element[0].querySelector('.buttons.left-buttons'));
        this.rightButtonsElement = angular.element($element[0].querySelector('.buttons.right-buttons'));
        this.back = function (e) {
          var backView = $ionicViewService.getBackView();
          backView && backView.go();
          e && (e.alreadyHandled = true);
          return false;
        };
        this.align = function (direction) {
          this._headerBarView.align(direction);
        };
        this.showBackButton = function (show) {
          if (arguments.length) {
            $scope.backButtonShown = !!show;
          }
          return !!($scope.hasBackButton && $scope.backButtonShown);
        };
        this.showBar = function (show) {
          if (arguments.length) {
            $scope.isInvisible = !show;
            $scope.$parent.$hasHeader = !!show;
          }
          return !$scope.isInvisible;
        };
        this.setTitle = function (title) {
          $scope.oldTitle = $scope.title;
          $scope.title = title || '';
        };
        this.changeTitle = function (title, direction) {
          if ($scope.title === title) {
            return false;
          }
          this.setTitle(title);
          $scope.isReverse = direction == 'back';
          $scope.shouldAnimate = !!direction;
          if (!$scope.shouldAnimate) {
            this._headerBarView.align();
          } else {
            this._animateTitles();
          }
          return true;
        };
        this.getTitle = function () {
          return $scope.title || '';
        };
        this.getPreviousTitle = function () {
          return $scope.oldTitle || '';
        };
        this._animateTitles = function () {
          var oldTitleEl, newTitleEl, currentTitles;
          currentTitles = $element[0].querySelectorAll('.title');
          if (currentTitles.length) {
            oldTitleEl = $compile('<h1 class="title" ng-bind-html="oldTitle"></h1>')($scope);
            angular.element(currentTitles[0]).replaceWith(oldTitleEl);
          }
          newTitleEl = $compile('<h1 class="title invisible" ng-bind-html="title"></h1>')($scope);
          ionic.requestAnimationFrame(function () {
            oldTitleEl && $animate.leave(angular.element(oldTitleEl));
            var insert = oldTitleEl && angular.element(oldTitleEl) || null;
            $animate.enter(newTitleEl, $element, insert, function () {
              self._headerBarView.align();
            });
            angular.forEach(currentTitles, function (el) {
              if (el && el.parentNode) {
                angular.element(el).remove();
              }
            });
            $scope.$digest();
            ionic.requestAnimationFrame(function () {
              newTitleEl[0].classList.remove('invisible');
            });
          });
        };
      }
    ]);
    IonicModule.factory('$$scrollValueCache', function () {
      return {};
    }).controller('$ionicScroll', [
      '$scope',
      'scrollViewOptions',
      '$timeout',
      '$window',
      '$$scrollValueCache',
      '$location',
      '$rootScope',
      '$document',
      '$ionicScrollDelegate',
      function ($scope, scrollViewOptions, $timeout, $window, $$scrollValueCache, $location, $rootScope, $document, $ionicScrollDelegate) {
        var self = this;
        this._scrollViewOptions = scrollViewOptions;
        var element = this.element = scrollViewOptions.el;
        var $element = this.$element = angular.element(element);
        var scrollView = this.scrollView = new ionic.views.Scroll(scrollViewOptions);
        ($element.parent().length ? $element.parent() : $element).data('$$ionicScrollController', this);
        var deregisterInstance = $ionicScrollDelegate._registerInstance(this, scrollViewOptions.delegateHandle);
        if (!angular.isDefined(scrollViewOptions.bouncing)) {
          ionic.Platform.ready(function () {
            scrollView.options.bouncing = !ionic.Platform.isAndroid();
          });
        }
        var resize = angular.bind(scrollView, scrollView.resize);
        ionic.on('resize', resize, $window);
        var backListenDone = angular.noop;
        $scope.$on('$destroy', function () {
          deregisterInstance();
          ionic.off('resize', resize, $window);
          $window.removeEventListener('resize', resize);
          backListenDone();
          if (self._rememberScrollId) {
            $$scrollValueCache[self._rememberScrollId] = scrollView.getValues();
          }
        });
        $element.on('scroll', function (e) {
          var detail = (e.originalEvent || e).detail || {};
          $scope.$onScroll && $scope.$onScroll({
            event: e,
            scrollTop: detail.scrollTop || 0,
            scrollLeft: detail.scrollLeft || 0
          });
        });
        $scope.$on('$viewContentLoaded', function (e, historyData) {
          if (e.defaultPrevented) {
            return;
          }
          e.preventDefault();
          var viewId = historyData && historyData.viewId;
          if (viewId) {
            self.rememberScrollPosition(viewId);
            self.scrollToRememberedPosition();
            backListenDone = $rootScope.$on('$viewHistory.viewBack', function (e, fromViewId, toViewId) {
              if (viewId === fromViewId) {
                self.forgetScrollPosition();
              }
            });
          }
        });
        $timeout(function () {
          scrollView.run();
        });
        this._rememberScrollId = null;
        this.getScrollView = function () {
          return this.scrollView;
        };
        this.getScrollPosition = function () {
          return this.scrollView.getValues();
        };
        this.resize = function () {
          return $timeout(resize);
        };
        this.scrollTop = function (shouldAnimate) {
          this.resize().then(function () {
            scrollView.scrollTo(0, 0, !!shouldAnimate);
          });
        };
        this.scrollBottom = function (shouldAnimate) {
          this.resize().then(function () {
            var max = scrollView.getScrollMax();
            scrollView.scrollTo(max.left, max.top, !!shouldAnimate);
          });
        };
        this.scrollTo = function (left, top, shouldAnimate) {
          this.resize().then(function () {
            scrollView.scrollTo(left, top, !!shouldAnimate);
          });
        };
        this.scrollBy = function (left, top, shouldAnimate) {
          this.resize().then(function () {
            scrollView.scrollBy(left, top, !!shouldAnimate);
          });
        };
        this.anchorScroll = function (shouldAnimate) {
          this.resize().then(function () {
            var hash = $location.hash();
            var elm = hash && $document[0].getElementById(hash);
            if (hash && elm) {
              var scroll = ionic.DomUtil.getPositionInParent(elm, self.$element);
              scrollView.scrollTo(scroll.left, scroll.top, !!shouldAnimate);
            } else {
              scrollView.scrollTo(0, 0, !!shouldAnimate);
            }
          });
        };
        this.rememberScrollPosition = function (id) {
          if (!id) {
            throw new Error('Must supply an id to remember the scroll by!');
          }
          this._rememberScrollId = id;
        };
        this.forgetScrollPosition = function () {
          delete $$scrollValueCache[this._rememberScrollId];
          this._rememberScrollId = null;
        };
        this.scrollToRememberedPosition = function (shouldAnimate) {
          var values = $$scrollValueCache[this._rememberScrollId];
          if (values) {
            this.resize().then(function () {
              scrollView.scrollTo(+values.left, +values.top, shouldAnimate);
            });
          }
        };
        this._setRefresher = function (refresherScope, refresherElement) {
          var refresher = this.refresher = refresherElement;
          var refresherHeight = self.refresher.clientHeight || 0;
          scrollView.activatePullToRefresh(refresherHeight, function () {
            refresher.classList.add('active');
            refresherScope.$onPulling();
          }, function () {
            refresher.classList.remove('refreshing');
            refresher.classList.remove('active');
          }, function () {
            refresher.classList.add('refreshing');
            refresherScope.$onRefresh();
          });
        };
      }
    ]);
    IonicModule.controller('$ionicSideMenus', [
      '$scope',
      '$attrs',
      '$ionicSideMenuDelegate',
      function ($scope, $attrs, $ionicSideMenuDelegate) {
        angular.extend(this, ionic.controllers.SideMenuController.prototype);
        ionic.controllers.SideMenuController.call(this, {
          left: { width: 275 },
          right: { width: 275 }
        });
        this.canDragContent = function (canDrag) {
          if (arguments.length) {
            $scope.dragContent = !!canDrag;
          }
          return $scope.dragContent;
        };
        this.isDraggableTarget = function (e) {
          return $scope.dragContent && (!e.gesture.srcEvent.defaultPrevented && !e.target.tagName.match(/input|textarea|select|object|embed/i) && !e.target.isContentEditable && !(e.target.dataset ? e.target.dataset.preventScroll : e.target.getAttribute('data-prevent-default') == 'true'));
        };
        $scope.sideMenuContentTranslateX = 0;
        var deregisterInstance = $ionicSideMenuDelegate._registerInstance(this, $attrs.delegateHandle);
        $scope.$on('$destroy', deregisterInstance);
      }
    ]);
    IonicModule.controller('$ionicTab', [
      '$scope',
      '$ionicViewService',
      '$attrs',
      '$location',
      '$state',
      function ($scope, $ionicViewService, $attrs, $location, $state) {
        this.$scope = $scope;
        this.hrefMatchesState = function () {
          return $attrs.href && $location.path().indexOf($attrs.href.replace(/^#/, '').replace(/\/$/, '')) === 0;
        };
        this.srefMatchesState = function () {
          return $attrs.uiSref && $state.includes($attrs.uiSref.split('(')[0]);
        };
        this.navNameMatchesState = function () {
          return this.navViewName && $ionicViewService.isCurrentStateNavView(this.navViewName);
        };
        this.tabMatchesState = function () {
          return this.hrefMatchesState() || this.srefMatchesState() || this.navNameMatchesState();
        };
      }
    ]);
    IonicModule.controller('$ionicTabs', [
      '$scope',
      '$ionicViewService',
      '$element',
      function ($scope, $ionicViewService, $element) {
        var _selectedTab = null;
        var self = this;
        self.tabs = [];
        self.selectedIndex = function () {
          return self.tabs.indexOf(_selectedTab);
        };
        self.selectedTab = function () {
          return _selectedTab;
        };
        self.add = function (tab) {
          $ionicViewService.registerHistory(tab);
          self.tabs.push(tab);
          if (self.tabs.length === 1) {
            self.select(tab);
          }
        };
        self.remove = function (tab) {
          var tabIndex = self.tabs.indexOf(tab);
          if (tabIndex === -1) {
            return;
          }
          if (tab.$tabSelected) {
            self.deselect(tab);
            if (self.tabs.length === 1) {
            } else {
              var newTabIndex = tabIndex === self.tabs.length - 1 ? tabIndex - 1 : tabIndex + 1;
              self.select(self.tabs[newTabIndex]);
            }
          }
          self.tabs.splice(tabIndex, 1);
        };
        self.deselect = function (tab) {
          if (tab.$tabSelected) {
            _selectedTab = null;
            tab.$tabSelected = false;
            (tab.onDeselect || angular.noop)();
          }
        };
        self.select = function (tab, shouldEmitEvent) {
          var tabIndex;
          if (angular.isNumber(tab)) {
            tabIndex = tab;
            tab = self.tabs[tabIndex];
          } else {
            tabIndex = self.tabs.indexOf(tab);
          }
          if (!tab || tabIndex == -1) {
            throw new Error('Cannot select tab "' + tabIndex + '"!');
          }
          if (_selectedTab && _selectedTab.$historyId == tab.$historyId) {
            if (shouldEmitEvent) {
              $ionicViewService.goToHistoryRoot(tab.$historyId);
            }
          } else {
            angular.forEach(self.tabs, function (tab) {
              self.deselect(tab);
            });
            _selectedTab = tab;
            tab.$tabSelected = true;
            (tab.onSelect || angular.noop)();
            if (shouldEmitEvent) {
              var viewData = {
                  type: 'tab',
                  tabIndex: tabIndex,
                  historyId: tab.$historyId,
                  navViewName: tab.navViewName,
                  hasNavView: !!tab.navViewName,
                  title: tab.title,
                  url: tab.href,
                  uiSref: tab.uiSref
                };
              $scope.$emit('viewState.changeHistory', viewData);
            }
          }
        };
      }
    ]);
    IonicModule.directive('ionActionSheet', [
      '$document',
      function ($document) {
        return {
          restrict: 'E',
          scope: true,
          replace: true,
          link: function ($scope, $element) {
            var keyUp = function (e) {
              if (e.which == 27) {
                $scope.cancel();
                $scope.$apply();
              }
            };
            var backdropClick = function (e) {
              if (e.target == $element[0]) {
                $scope.cancel();
                $scope.$apply();
              }
            };
            $scope.$on('$destroy', function () {
              $element.remove();
              $document.unbind('keyup', keyUp);
            });
            $document.bind('keyup', keyUp);
            $element.bind('click', backdropClick);
          },
          template: '<div class="action-sheet-backdrop">' + '<div class="action-sheet-wrapper">' + '<div class="action-sheet">' + '<div class="action-sheet-group">' + '<div class="action-sheet-title" ng-if="titleText">{{titleText}}</div>' + '<button class="button" ng-click="buttonClicked($index)" ng-repeat="button in buttons">{{button.text}}</button>' + '</div>' + '<div class="action-sheet-group" ng-if="destructiveText">' + '<button class="button destructive" ng-click="destructiveButtonClicked()">{{destructiveText}}</button>' + '</div>' + '<div class="action-sheet-group" ng-if="cancelText">' + '<button class="button" ng-click="cancel()">{{cancelText}}</button>' + '</div>' + '</div>' + '</div>' + '</div>'
        };
      }
    ]);
    IonicModule.directive('ionCheckbox', function () {
      return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        scope: {
          ngModel: '=?',
          ngValue: '=?',
          ngChecked: '=?',
          ngDisabled: '=?',
          ngChange: '&'
        },
        transclude: true,
        template: '<label class="item item-checkbox">' + '<div class="checkbox checkbox-input-hidden disable-pointer-events">' + '<input type="checkbox" ng-model="ngModel" ng-value="ngValue" ng-change="ngChange()">' + '<i class="checkbox-icon"></i>' + '</div>' + '<div class="item-content disable-pointer-events" ng-transclude></div>' + '</label>',
        compile: function (element, attr) {
          var input = element.find('input');
          if (attr.name)
            input.attr('name', attr.name);
          if (attr.ngChecked)
            input.attr('ng-checked', attr.ngChecked);
          if (attr.ngDisabled)
            input.attr('ng-disabled', attr.ngDisabled);
          if (attr.ngTrueValue)
            input.attr('ng-true-value', attr.ngTrueValue);
          if (attr.ngFalseValue)
            input.attr('ng-false-value', attr.ngFalseValue);
        }
      };
    });
    IonicModule.directive('collectionRepeat', [
      '$collectionRepeatManager',
      '$collectionDataSource',
      '$parse',
      function ($collectionRepeatManager, $collectionDataSource, $parse) {
        return {
          priority: 1000,
          transclude: 'element',
          terminal: true,
          $$tlb: true,
          require: '^$ionicScroll',
          link: function ($scope, $element, $attr, scrollCtrl, $transclude) {
            var scrollView = scrollCtrl.scrollView;
            if (scrollView.options.scrollingX && scrollView.options.scrollingY) {
              throw new Error('Cannot create a collection-repeat within a scrollView that is scrollable on both x and y axis.  Choose either x direction or y direction.');
            }
            var isVertical = !!scrollView.options.scrollingY;
            if (isVertical && !$attr.collectionItemHeight) {
              throw new Error('collection-repeat expected attribute collection-item-height to be a an expression that returns a number.');
            } else if (!isVertical && !$attr.collectionItemWidth) {
              throw new Error('collection-repeat expected attribute collection-item-width to be a an expression that returns a number.');
            }
            $attr.collectionItemHeight = $attr.collectionItemHeight || '100%';
            $attr.collectionItemWidth = $attr.collectionItemWidth || '100%';
            var heightParsed = $attr.collectionItemHeight ? $parse($attr.collectionItemHeight) : function () {
                return scrollView.__clientHeight;
              };
            var widthParsed = $attr.collectionItemWidth ? $parse($attr.collectionItemWidth) : function () {
                return scrollView.__clientWidth;
              };
            var heightGetter = function (scope, locals) {
              var result = heightParsed(scope, locals);
              if (angular.isString(result) && result.indexOf('%') > -1) {
                return Math.floor(parseInt(result, 10) / 100 * scrollView.__clientHeight);
              }
              return result;
            };
            var widthGetter = function (scope, locals) {
              var result = widthParsed(scope, locals);
              if (angular.isString(result) && result.indexOf('%') > -1) {
                return Math.floor(parseInt(result, 10) / 100 * scrollView.__clientWidth);
              }
              return result;
            };
            var match = $attr.collectionRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
            if (!match) {
              throw new Error('collection-repeat expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'' + $attr.collectionRepeat + '\'.');
            }
            var dataSource = new $collectionDataSource({
                scope: $scope,
                transcludeFn: $transclude,
                transcludeParent: $element.parent(),
                keyExpr: match[1],
                listExpr: match[2],
                trackByExpr: match[3],
                heightGetter: heightGetter,
                widthGetter: widthGetter
              });
            var collectionRepeatManager = new $collectionRepeatManager({
                dataSource: dataSource,
                element: scrollCtrl.$element,
                scrollView: scrollCtrl.scrollView
              });
            $scope.$watchCollection(dataSource.listExpr, function (value) {
              if (value && !angular.isArray(value)) {
                throw new Error('collection-repeat expects an array to repeat over, but instead got \'' + typeof value + '\'.');
              }
              rerender(value);
            });
            function rerender(value) {
              scrollView.resize();
              dataSource.setData(value);
              collectionRepeatManager.resize();
            }
            var resize = angular.bind(collectionRepeatManager, collectionRepeatManager.resize);
            ionic.on('resize', function () {
              rerender($scope.$eval(dataSource.listExpr));
            }, window);
            $scope.$on('$destroy', function () {
              collectionRepeatManager.destroy();
              dataSource.destroy();
              ionic.off('resize', resize, window);
            });
          }
        };
      }
    ]);
    IonicModule.directive('ionContent', [
      '$timeout',
      '$controller',
      '$ionicBind',
      function ($timeout, $controller, $ionicBind) {
        return {
          restrict: 'E',
          require: '^?ionNavView',
          scope: true,
          priority: 800,
          compile: function (element, attr) {
            var innerElement;
            element.addClass('scroll-content');
            if (attr.scroll != 'false') {
              innerElement = angular.element('<div class="scroll"></div>');
              innerElement.append(element.contents());
              element.append(innerElement);
            }
            return { pre: prelink };
            function prelink($scope, $element, $attr, navViewCtrl) {
              var parentScope = $scope.$parent;
              $scope.$watch(function () {
                return (parentScope.$hasHeader ? ' has-header' : '') + (parentScope.$hasSubheader ? ' has-subheader' : '') + (parentScope.$hasFooter ? ' has-footer' : '') + (parentScope.$hasSubfooter ? ' has-subfooter' : '') + (parentScope.$hasTabs ? ' has-tabs' : '') + (parentScope.$hasTabsTop ? ' has-tabs-top' : '');
              }, function (className, oldClassName) {
                $element.removeClass(oldClassName);
                $element.addClass(className);
              });
              $scope.$hasHeader = $scope.$hasSubheader = $scope.$hasFooter = $scope.$hasSubfooter = $scope.$hasTabs = $scope.$hasTabsTop = false;
              $ionicBind($scope, $attr, {
                $onScroll: '&onScroll',
                $onScrollComplete: '&onScrollComplete',
                hasBouncing: '@',
                scroll: '@',
                padding: '@',
                hasScrollX: '@',
                hasScrollY: '@',
                scrollbarX: '@',
                scrollbarY: '@',
                startX: '@',
                startY: '@',
                scrollEventInterval: '@'
              });
              if (angular.isDefined($attr.padding)) {
                $scope.$watch($attr.padding, function (newVal) {
                  (innerElement || $element).toggleClass('padding', !!newVal);
                });
              }
              if ($scope.scroll === 'false') {
              } else if (attr.overflowScroll === 'true') {
                $element.addClass('overflow-scroll');
              } else {
                $controller('$ionicScroll', {
                  $scope: $scope,
                  scrollViewOptions: {
                    el: $element[0],
                    delegateHandle: attr.delegateHandle,
                    bouncing: $scope.$eval($scope.hasBouncing),
                    startX: $scope.$eval($scope.startX) || 0,
                    startY: $scope.$eval($scope.startY) || 0,
                    scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
                    scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
                    scrollingX: $scope.$eval($scope.hasScrollX) === true,
                    scrollingY: $scope.$eval($scope.hasScrollY) !== false,
                    scrollEventInterval: parseInt($scope.scrollEventInterval, 10) || 10,
                    scrollingComplete: function () {
                      $scope.$onScrollComplete({
                        scrollTop: this.__scrollTop,
                        scrollLeft: this.__scrollLeft
                      });
                    }
                  }
                });
              }
            }
          }
        };
      }
    ]);
    IonicModule.directive('ionNavBar', tapScrollToTopDirective()).directive('ionHeaderBar', tapScrollToTopDirective()).directive('ionHeaderBar', headerFooterBarDirective(true)).directive('ionFooterBar', headerFooterBarDirective(false));
    function tapScrollToTopDirective() {
      return [
        '$ionicScrollDelegate',
        function ($ionicScrollDelegate) {
          return {
            restrict: 'E',
            link: function ($scope, $element, $attr) {
              ionic.on('tap', onTap, $element[0]);
              $scope.$on('$destroy', function () {
                ionic.off('tap', onTap, $element[0]);
              });
              function onTap(e) {
                var depth = 3;
                var current = e.target;
                while (depth-- && current) {
                  if (current.classList.contains('button') || current.tagName.match(/input|textarea|select/i) || current.isContentEditable) {
                    return;
                  }
                  current = current.parentNode;
                }
                var touch = e.gesture && e.gesture.touches[0] || e.detail.touches[0];
                var bounds = $element[0].getBoundingClientRect();
                if (ionic.DomUtil.rectContains(touch.pageX, touch.pageY, bounds.left, bounds.top - 20, bounds.left + bounds.width, bounds.top + bounds.height)) {
                  $ionicScrollDelegate.scrollTop(true);
                }
              }
            }
          };
        }
      ];
    }
    function headerFooterBarDirective(isHeader) {
      return [function () {
          return {
            restrict: 'E',
            compile: function ($element, $attr) {
              $element.addClass(isHeader ? 'bar bar-header' : 'bar bar-footer');
              return { pre: prelink };
              function prelink($scope, $element, $attr) {
                var hb = new ionic.views.HeaderBar({
                    el: $element[0],
                    alignTitle: $attr.alignTitle || 'center'
                  });
                var el = $element[0];
                var parentScope = $scope.$parent || $scope;
                if (isHeader) {
                  $scope.$watch(function () {
                    return el.className;
                  }, function (value) {
                    var isSubheader = value.indexOf('bar-subheader') !== -1;
                    parentScope.$hasHeader = !isSubheader;
                    parentScope.$hasSubheader = isSubheader;
                  });
                  $scope.$on('$destroy', function () {
                    parentScope.$hasHeader = parentScope.$hasSubheader = null;
                  });
                } else {
                  $scope.$watch(function () {
                    return el.className;
                  }, function (value) {
                    var isSubfooter = value.indexOf('bar-subfooter') !== -1;
                    parentScope.$hasFooter = !isSubfooter;
                    parentScope.$hasSubfooter = isSubfooter;
                  });
                  $scope.$on('$destroy', function () {
                    parentScope.$hasFooter = parentScope.$hasSubfooter = null;
                  });
                  $scope.$watch('$hasTabs', function (val) {
                    $element.toggleClass('has-tabs', !!val);
                  });
                }
              }
            }
          };
        }];
    }
    IonicModule.directive('ionInfiniteScroll', [
      '$timeout',
      function ($timeout) {
        function calculateMaxValue(distance, maximum, isPercent) {
          return isPercent ? maximum * (1 - parseInt(distance, 10) / 100) : maximum - parseInt(distance, 10);
        }
        return {
          restrict: 'E',
          require: [
            '^$ionicScroll',
            'ionInfiniteScroll'
          ],
          template: '<div class="scroll-infinite">' + '<div class="scroll-infinite-content">' + '<i class="icon {{icon()}} icon-refreshing"></i>' + '</div>' + '</div>',
          scope: true,
          controller: [
            '$scope',
            '$attrs',
            function ($scope, $attrs) {
              this.isLoading = false;
              this.scrollView = null;
              this.getMaxScroll = function () {
                var distance = ($attrs.distance || '1%').trim();
                var isPercent = distance.indexOf('%') !== -1;
                var maxValues = this.scrollView.getScrollMax();
                return {
                  left: this.scrollView.options.scrollingX ? calculateMaxValue(distance, maxValues.left, isPercent) : -1,
                  top: this.scrollView.options.scrollingY ? calculateMaxValue(distance, maxValues.top, isPercent) : -1
                };
              };
            }
          ],
          link: function ($scope, $element, $attrs, ctrls) {
            var scrollCtrl = ctrls[0];
            var infiniteScrollCtrl = ctrls[1];
            var scrollView = infiniteScrollCtrl.scrollView = scrollCtrl.scrollView;
            $scope.icon = function () {
              return angular.isDefined($attrs.icon) ? $attrs.icon : 'ion-loading-d';
            };
            var onInfinite = function () {
              $element[0].classList.add('active');
              infiniteScrollCtrl.isLoading = true;
              $scope.$parent && $scope.$parent.$apply($attrs.onInfinite || '');
            };
            var finishInfiniteScroll = function () {
              $element[0].classList.remove('active');
              $timeout(function () {
                scrollView.resize();
              }, 0, false);
              infiniteScrollCtrl.isLoading = false;
            };
            $scope.$on('scroll.infiniteScrollComplete', function () {
              finishInfiniteScroll();
            });
            $scope.$on('$destroy', function () {
              scrollCtrl.$element.off('scroll', checkBounds);
            });
            var checkBounds = ionic.animationFrameThrottle(checkInfiniteBounds);
            setTimeout(checkBounds);
            scrollCtrl.$element.on('scroll', checkBounds);
            function checkInfiniteBounds() {
              if (infiniteScrollCtrl.isLoading)
                return;
              var scrollValues = scrollView.getValues();
              var maxScroll = infiniteScrollCtrl.getMaxScroll();
              if (maxScroll.top === 0) {
                return;
              }
              if (maxScroll.left !== -1 && scrollValues.left >= maxScroll.left || maxScroll.top !== -1 && scrollValues.top >= maxScroll.top) {
                onInfinite();
              }
            }
          }
        };
      }
    ]);
    var ITEM_TPL_CONTENT_ANCHOR = '<a class="item-content" ng-href="{{$href()}}"></a>';
    var ITEM_TPL_CONTENT = '<div class="item-content"></div>';
    IonicModule.directive('ionItem', [
      '$animate',
      '$compile',
      function ($animate, $compile) {
        return {
          restrict: 'E',
          controller: [
            '$scope',
            '$element',
            function ($scope, $element) {
              this.$scope = $scope;
              this.$element = $element;
            }
          ],
          priorty: Number.MAX_VALUE,
          require: [
            'ionItem',
            '^ionList'
          ],
          scope: true,
          compile: function ($element, $attrs) {
            var isAnchor = angular.isDefined($attrs.href) || angular.isDefined($attrs.ngHref);
            var isComplexItem = isAnchor || /ion-(delete|option|reorder)-button/i.test($element.html());
            if (isComplexItem) {
              var innerElement = angular.element(isAnchor ? ITEM_TPL_CONTENT_ANCHOR : ITEM_TPL_CONTENT);
              innerElement.append($element.contents());
              $element.append(innerElement);
              $element.addClass('item item-complex');
            } else {
              $element.addClass('item');
            }
            return function link($scope, $element, $attrs) {
              $scope.$href = function () {
                return $attrs.href || $attrs.ngHref;
              };
            };
          }
        };
      }
    ]);
    var ITEM_TPL_DELETE_BUTTON = '<div class="item-left-edit item-delete ng-hide">' + '</div>';
    IonicModule.directive('ionDeleteButton', [
      '$animate',
      function ($animate) {
        return {
          restrict: 'E',
          require: [
            '^ionItem',
            '^ionList'
          ],
          priority: Number.MAX_VALUE,
          compile: function ($element, $attr) {
            $attr.$set('class', ($attr.class || '') + ' button icon button-icon', true);
            return function ($scope, $element, $attr, ctrls) {
              var itemCtrl = ctrls[0];
              var listCtrl = ctrls[1];
              var container = angular.element(ITEM_TPL_DELETE_BUTTON);
              container.append($element);
              itemCtrl.$element.append(container).addClass('item-left-editable');
              if (listCtrl.showDelete()) {
                $animate.removeClass(container, 'ng-hide');
              }
            };
          }
        };
      }
    ]);
    var ITEM_TPL_OPTION_BUTTONS = '<div class="item-options invisible">' + '</div>';
    IonicModule.directive('ionOptionButton', [
      '$compile',
      function ($compile) {
        return {
          restrict: 'E',
          require: '^ionItem',
          priority: Number.MAX_VALUE,
          compile: function ($element, $attr) {
            $attr.$set('class', ($attr.class || '') + ' button', true);
            return function ($scope, $element, $attr, itemCtrl) {
              if (!itemCtrl.optionsContainer) {
                itemCtrl.optionsContainer = angular.element(ITEM_TPL_OPTION_BUTTONS);
                itemCtrl.$element.append(itemCtrl.optionsContainer);
              }
              itemCtrl.optionsContainer.append($element);
              $element.on('click', eventStopPropagation);
            };
          }
        };
      }
    ]);
    var ITEM_TPL_REORDER_BUTTON = '<div data-prevent-scroll="true" class="item-right-edit item-reorder ng-hide">' + '</div>';
    IonicModule.directive('ionReorderButton', [
      '$animate',
      function ($animate) {
        return {
          restrict: 'E',
          require: [
            '^ionItem',
            '^ionList'
          ],
          priority: Number.MAX_VALUE,
          compile: function ($element, $attr) {
            $attr.$set('class', ($attr.class || '') + ' button icon button-icon', true);
            $element[0].setAttribute('data-prevent-scroll', true);
            return function ($scope, $element, $attr, ctrls) {
              var itemCtrl = ctrls[0];
              var listCtrl = ctrls[1];
              $scope.$onReorder = function (oldIndex, newIndex) {
                $scope.$eval($attr.onReorder, {
                  $fromIndex: oldIndex,
                  $toIndex: newIndex
                });
              };
              var container = angular.element(ITEM_TPL_REORDER_BUTTON);
              container.append($element);
              itemCtrl.$element.append(container).addClass('item-right-editable');
              if (listCtrl.showReorder()) {
                $animate.removeClass(container, 'ng-hide');
              }
            };
          }
        };
      }
    ]);
    IonicModule.directive('ionList', [
      '$animate',
      '$timeout',
      function ($animate, $timeout) {
        return {
          restrict: 'E',
          require: [
            'ionList',
            '^?$ionicScroll'
          ],
          controller: '$ionicList',
          compile: function ($element, $attr) {
            var listEl = angular.element('<div class="list">').append($element.contents());
            $element.append(listEl);
            return function ($scope, $element, $attrs, ctrls) {
              var listCtrl = ctrls[0];
              var scrollCtrl = ctrls[1];
              $timeout(init);
              function init() {
                var listView = listCtrl.listView = new ionic.views.ListView({
                    el: $element[0],
                    listEl: $element.children()[0],
                    scrollEl: scrollCtrl && scrollCtrl.element,
                    scrollView: scrollCtrl && scrollCtrl.scrollView,
                    onReorder: function (el, oldIndex, newIndex) {
                      var itemScope = angular.element(el).scope();
                      if (itemScope && itemScope.$onReorder) {
                        itemScope.$onReorder(oldIndex, newIndex);
                      }
                    },
                    canSwipe: function () {
                      return listCtrl.canSwipeItems();
                    }
                  });
                if (angular.isDefined($attr.canSwipe)) {
                  $scope.$watch('!!(' + $attr.canSwipe + ')', function (value) {
                    listCtrl.canSwipeItems(value);
                  });
                }
                if (angular.isDefined($attr.showDelete)) {
                  $scope.$watch('!!(' + $attr.showDelete + ')', function (value) {
                    listCtrl.showDelete(value);
                  });
                }
                if (angular.isDefined($attr.showReorder)) {
                  $scope.$watch('!!(' + $attr.showReorder + ')', function (value) {
                    listCtrl.showReorder(value);
                  });
                }
                $scope.$watch(function () {
                  return listCtrl.showDelete();
                }, function (isShown, wasShown) {
                  if (!isShown && !wasShown) {
                    return;
                  }
                  if (isShown)
                    listCtrl.closeOptionButtons();
                  listCtrl.canSwipeItems(!isShown);
                  $element.children().toggleClass('list-left-editing', isShown);
                  toggleNgHide('.item-delete.item-left-edit', isShown);
                  toggleTapDisabled('.item-content', isShown);
                });
                $scope.$watch(function () {
                  return listCtrl.showReorder();
                }, function (isShown, wasShown) {
                  if (!isShown && !wasShown) {
                    return;
                  }
                  if (isShown)
                    listCtrl.closeOptionButtons();
                  listCtrl.canSwipeItems(!isShown);
                  $element.children().toggleClass('list-right-editing', isShown);
                  toggleNgHide('.item-reorder.item-right-edit', isShown);
                  toggleTapDisabled('.item-content', isShown);
                });
                function toggleNgHide(selector, shouldShow) {
                  angular.forEach($element[0].querySelectorAll(selector), function (node) {
                    if (shouldShow) {
                      $animate.removeClass(angular.element(node), 'ng-hide');
                    } else {
                      $animate.addClass(angular.element(node), 'ng-hide');
                    }
                  });
                }
                function toggleTapDisabled(selector, shouldDisable) {
                  var el = angular.element($element[0].querySelectorAll(selector));
                  if (shouldDisable) {
                    el.attr('data-tap-disabled', 'true');
                  } else {
                    el.removeAttr('data-tap-disabled');
                  }
                }
              }
            };
          }
        };
      }
    ]);
    IonicModule.directive('menuClose', [
      '$ionicViewService',
      function ($ionicViewService) {
        return {
          restrict: 'AC',
          require: '^ionSideMenus',
          link: function ($scope, $element, $attr, sideMenuCtrl) {
            $element.bind('click', function () {
              sideMenuCtrl.close();
            });
          }
        };
      }
    ]);
    IonicModule.directive('menuToggle', [
      '$ionicViewService',
      function ($ionicViewService) {
        return {
          restrict: 'AC',
          require: '^ionSideMenus',
          link: function ($scope, $element, $attr, sideMenuCtrl) {
            var side = $attr.menuToggle || 'left';
            $element.bind('click', function () {
              if (side === 'left') {
                sideMenuCtrl.toggleLeft();
              } else if (side === 'right') {
                sideMenuCtrl.toggleRight();
              }
            });
          }
        };
      }
    ]);
    IonicModule.directive('ionModal', [function () {
        return {
          restrict: 'E',
          transclude: true,
          replace: true,
          template: '<div class="modal-backdrop">' + '<div class="modal-wrapper" ng-transclude></div>' + '</div>'
        };
      }]);
    IonicModule.directive('ionNavBackButton', [
      '$animate',
      function ($animate) {
        return {
          restrict: 'E',
          require: '^ionNavBar',
          compile: function (tElement, tAttrs) {
            tElement.addClass('button back-button ng-hide');
            return function ($scope, $element, $attr, navBarCtrl) {
              if (!$attr.ngClick) {
                $scope.$navBack = navBarCtrl.back;
                $element.on('click', function (event) {
                  $scope.$apply(function () {
                    $scope.$navBack(event);
                  });
                });
              }
              var deregisterListener = $scope.$parent.$on('$viewHistory.historyChange', function (e, data) {
                  $scope.hasBackButton = !!data.showBack;
                });
              $scope.$on('$destroy', deregisterListener);
              $scope.$watch('!!(backButtonShown && hasBackButton)', ionic.animationFrameThrottle(function (show) {
                if (show)
                  $animate.removeClass($element, 'ng-hide');
                else
                  $animate.addClass($element, 'ng-hide');
              }));
            };
          }
        };
      }
    ]);
    IonicModule.directive('ionNavBar', [
      '$ionicViewService',
      '$rootScope',
      '$animate',
      '$compile',
      function ($ionicViewService, $rootScope, $animate, $compile) {
        return {
          restrict: 'E',
          controller: '$ionicNavBar',
          scope: true,
          compile: function (tElement, tAttrs) {
            tElement.addClass('bar bar-header nav-bar').append('<div class="buttons left-buttons"> ' + '</div>' + '<h1 ng-bind-html="title" class="title"></h1>' + '<div class="buttons right-buttons"> ' + '</div>');
            return { pre: prelink };
            function prelink($scope, $element, $attr, navBarCtrl) {
              navBarCtrl._headerBarView = new ionic.views.HeaderBar({
                el: $element[0],
                alignTitle: $attr.alignTitle || 'center'
              });
              $scope.backButtonShown = false;
              $scope.shouldAnimate = true;
              $scope.isReverse = false;
              $scope.isInvisible = true;
              $scope.$on('$destroy', function () {
                $scope.$parent.$hasHeader = false;
              });
              $scope.$watch(function () {
                return ($scope.isReverse ? ' reverse' : '') + ($scope.isInvisible ? ' invisible' : '') + (!$scope.shouldAnimate ? ' no-animation' : '');
              }, function (className, oldClassName) {
                $element.removeClass(oldClassName);
                $element.addClass(className);
              });
            }
          }
        };
      }
    ]);
    IonicModule.directive('ionNavButtons', [
      '$compile',
      '$animate',
      function ($compile, $animate) {
        return {
          require: '^ionNavBar',
          restrict: 'E',
          compile: function ($element, $attrs) {
            var content = $element.contents().remove();
            return function ($scope, $element, $attrs, navBarCtrl) {
              var navElement = $attrs.side === 'right' ? navBarCtrl.rightButtonsElement : navBarCtrl.leftButtonsElement;
              var buttons = angular.element('<span>').append(content);
              $element.append(buttons);
              $compile(buttons)($scope);
              ionic.requestAnimationFrame(function () {
                $animate.enter(buttons, navElement);
              });
              $scope.$on('$destroy', function () {
                $animate.leave(buttons);
              });
              $element.css('display', 'none');
            };
          }
        };
      }
    ]);
    IonicModule.directive('navClear', [
      '$ionicViewService',
      '$state',
      '$location',
      '$window',
      '$rootScope',
      function ($ionicViewService, $location, $state, $window, $rootScope) {
        $rootScope.$on('$stateChangeError', function () {
          $ionicViewService.nextViewOptions(null);
        });
        return {
          priority: 100,
          restrict: 'AC',
          compile: function ($element) {
            return { pre: prelink };
            function prelink($scope, $element, $attrs) {
              var unregisterListener;
              function listenForStateChange() {
                unregisterListener = $scope.$on('$stateChangeStart', function () {
                  $ionicViewService.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                  });
                  unregisterListener();
                });
                $window.setTimeout(unregisterListener, 300);
              }
              $element.on('click', listenForStateChange);
            }
          }
        };
      }
    ]);
    IonicModule.directive('ionNavView', [
      '$ionicViewService',
      '$state',
      '$compile',
      '$controller',
      '$animate',
      function ($ionicViewService, $state, $compile, $controller, $animate) {
        var viewIsUpdating = false;
        var directive = {
            restrict: 'E',
            terminal: true,
            priority: 2000,
            transclude: true,
            controller: function () {
            },
            compile: function (element, attr, transclude) {
              return function (scope, element, attr, navViewCtrl) {
                var viewScope, viewLocals, name = attr[directive.name] || attr.name || '', onloadExp = attr.onload || '', initialView = transclude(scope);
                element.append(initialView);
                var parent = element.parent().inheritedData('$uiView');
                if (name.indexOf('@') < 0)
                  name = name + '@' + (parent ? parent.state.name : '');
                var view = {
                    name: name,
                    state: null
                  };
                element.data('$uiView', view);
                var eventHook = function () {
                  if (viewIsUpdating)
                    return;
                  viewIsUpdating = true;
                  try {
                    updateView(true);
                  } catch (e) {
                    viewIsUpdating = false;
                    throw e;
                  }
                  viewIsUpdating = false;
                };
                scope.$on('$stateChangeSuccess', eventHook);
                updateView(false);
                function updateView(doAnimate) {
                  if ($animate.enabled() === false) {
                    doAnimate = false;
                  }
                  var locals = $state.$current && $state.$current.locals[name];
                  if (locals === viewLocals)
                    return;
                  var renderer = $ionicViewService.getRenderer(element, attr, scope);
                  if (viewScope) {
                    viewScope.$destroy();
                    viewScope = null;
                  }
                  if (!locals) {
                    viewLocals = null;
                    view.state = null;
                    return element.append(initialView);
                  }
                  var newElement = angular.element('<div></div>').html(locals.$template).contents();
                  var viewRegisterData = renderer().register(newElement);
                  renderer(doAnimate).leave();
                  viewLocals = locals;
                  view.state = locals.$$state;
                  renderer(doAnimate).enter(newElement);
                  var link = $compile(newElement);
                  viewScope = scope.$new();
                  viewScope.$navDirection = viewRegisterData.navDirection;
                  if (locals.$$controller) {
                    locals.$scope = viewScope;
                    var controller = $controller(locals.$$controller, locals);
                    element.children().data('$ngControllerController', controller);
                  }
                  link(viewScope);
                  var viewHistoryData = $ionicViewService._getViewById(viewRegisterData.viewId) || {};
                  viewScope.$broadcast('$viewContentLoaded', viewHistoryData);
                  if (onloadExp)
                    viewScope.$eval(onloadExp);
                  newElement = null;
                }
              };
            }
          };
        return directive;
      }
    ]);
    IonicModule.config([
      '$provide',
      function ($provide) {
        $provide.decorator('ngClickDirective', [
          '$delegate',
          function ($delegate) {
            $delegate.shift();
            return $delegate;
          }
        ]);
      }
    ]).factory('$ionicNgClick', [
      '$parse',
      function ($parse) {
        return function (scope, element, clickExpr) {
          var clickHandler = $parse(clickExpr);
          element.on('click', function (event) {
            scope.$apply(function () {
              clickHandler(scope, { $event: event });
            });
          });
          element.onclick = function (event) {
          };
        };
      }
    ]).directive('ngClick', [
      '$ionicNgClick',
      function ($ionicNgClick) {
        return function (scope, element, attr) {
          $ionicNgClick(scope, element, attr.ngClick);
        };
      }
    ]).directive('ionStopEvent', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          element.bind(attr.ionStopEvent, eventStopPropagation);
        }
      };
    });
    function eventStopPropagation(e) {
      e.stopPropagation();
    }
    IonicModule.directive('ionPane', function () {
      return {
        restrict: 'E',
        link: function (scope, element, attr) {
          element.addClass('pane');
        }
      };
    });
    IonicModule.directive('ionRadio', function () {
      return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        scope: {
          ngModel: '=?',
          ngValue: '=?',
          ngChange: '&',
          icon: '@'
        },
        transclude: true,
        template: '<label class="item item-radio">' + '<input type="radio" name="radio-group"' + ' ng-model="ngModel" ng-value="ngValue" ng-change="ngChange()">' + '<div class="item-content disable-pointer-events" ng-transclude></div>' + '<i class="radio-icon disable-pointer-events icon ion-checkmark"></i>' + '</label>',
        compile: function (element, attr) {
          if (attr.name)
            element.children().eq(0).attr('name', attr.name);
          if (attr.icon)
            element.children().eq(2).removeClass('ion-checkmark').addClass(attr.icon);
        }
      };
    });
    IonicModule.directive('ionRefresher', [
      '$ionicBind',
      function ($ionicBind) {
        return {
          restrict: 'E',
          replace: true,
          require: '^$ionicScroll',
          template: '<div class="scroll-refresher">' + '<div class="ionic-refresher-content">' + '<i class="icon {{pullingIcon}} icon-pulling"></i>' + '<div class="text-pulling" ng-bind-html="pullingText"></div>' + '<i class="icon {{refreshingIcon}} icon-refreshing"></i>' + '<div class="text-refreshing" ng-bind-html="refreshingText"></div>' + '</div>' + '</div>',
          compile: function ($element, $attrs) {
            if (angular.isUndefined($attrs.pullingIcon)) {
              $attrs.$set('pullingIcon', 'ion-arrow-down-c');
            }
            if (angular.isUndefined($attrs.refreshingIcon)) {
              $attrs.$set('refreshingIcon', 'ion-loading-d');
            }
            return function ($scope, $element, $attrs, scrollCtrl) {
              $ionicBind($scope, $attrs, {
                pullingIcon: '@',
                pullingText: '@',
                refreshingIcon: '@',
                refreshingText: '@',
                $onRefresh: '&onRefresh',
                $onPulling: '&onPulling'
              });
              scrollCtrl._setRefresher($scope, $element[0]);
              $scope.$on('scroll.refreshComplete', function () {
                $element[0].classList.remove('active');
                scrollCtrl.scrollView.finishPullToRefresh();
              });
            };
          }
        };
      }
    ]);
    IonicModule.directive('ionScroll', [
      '$timeout',
      '$controller',
      '$ionicBind',
      function ($timeout, $controller, $ionicBind) {
        return {
          restrict: 'E',
          scope: true,
          controller: function () {
          },
          compile: function (element, attr) {
            element.addClass('scroll-view');
            var innerElement = angular.element('<div class="scroll"></div>');
            innerElement.append(element.contents());
            element.append(innerElement);
            return { pre: prelink };
            function prelink($scope, $element, $attr) {
              var scrollView, scrollCtrl;
              $ionicBind($scope, $attr, {
                direction: '@',
                paging: '@',
                $onScroll: '&onScroll',
                scroll: '@',
                scrollbarX: '@',
                scrollbarY: '@'
              });
              if (angular.isDefined($attr.padding)) {
                $scope.$watch($attr.padding, function (newVal) {
                  innerElement.toggleClass('padding', !!newVal);
                });
              }
              if ($scope.$eval($scope.paging) === true) {
                innerElement.addClass('scroll-paging');
              }
              if (!$scope.direction) {
                $scope.direction = 'y';
              }
              var isPaging = $scope.$eval($scope.paging) === true;
              var scrollViewOptions = {
                  el: $element[0],
                  delegateHandle: $attr.delegateHandle,
                  paging: isPaging,
                  scrollbarX: $scope.$eval($scope.scrollbarX) !== false,
                  scrollbarY: $scope.$eval($scope.scrollbarY) !== false,
                  scrollingX: $scope.direction.indexOf('x') >= 0,
                  scrollingY: $scope.direction.indexOf('y') >= 0
                };
              if (isPaging) {
                scrollViewOptions.speedMultiplier = 0.8;
                scrollViewOptions.bouncing = false;
              }
              scrollCtrl = $controller('$ionicScroll', {
                $scope: $scope,
                scrollViewOptions: scrollViewOptions
              });
              scrollView = $scope.$parent.scrollView = scrollCtrl.scrollView;
            }
          }
        };
      }
    ]);
    IonicModule.directive('ionSideMenu', function () {
      return {
        restrict: 'E',
        require: '^ionSideMenus',
        scope: true,
        compile: function (element, attr) {
          angular.isUndefined(attr.isEnabled) && attr.$set('isEnabled', 'true');
          angular.isUndefined(attr.width) && attr.$set('width', '275');
          element.addClass('menu menu-' + attr.side);
          return function ($scope, $element, $attr, sideMenuCtrl) {
            $scope.side = $attr.side || 'left';
            var sideMenu = sideMenuCtrl[$scope.side] = new ionic.views.SideMenu({
                width: 275,
                el: $element[0],
                isEnabled: true
              });
            $scope.$watch($attr.width, function (val) {
              var numberVal = +val;
              if (numberVal && numberVal == val) {
                sideMenu.setWidth(+val);
              }
            });
            $scope.$watch($attr.isEnabled, function (val) {
              sideMenu.setIsEnabled(!!val);
            });
          };
        }
      };
    });
    IonicModule.directive('ionSideMenuContent', [
      '$timeout',
      '$ionicGesture',
      function ($timeout, $ionicGesture) {
        return {
          restrict: 'EA',
          require: '^ionSideMenus',
          scope: true,
          compile: function (element, attr) {
            return { pre: prelink };
            function prelink($scope, $element, $attr, sideMenuCtrl) {
              $element.addClass('menu-content pane');
              if (angular.isDefined(attr.dragContent)) {
                $scope.$watch(attr.dragContent, function (value) {
                  sideMenuCtrl.canDragContent(value);
                });
              } else {
                sideMenuCtrl.canDragContent(true);
              }
              var defaultPrevented = false;
              var isDragging = false;
              function contentTap(e) {
                if (sideMenuCtrl.getOpenAmount() !== 0) {
                  sideMenuCtrl.close();
                  e.gesture.srcEvent.preventDefault();
                }
              }
              ionic.on('tap', contentTap, $element[0]);
              var dragFn = function (e) {
                if (defaultPrevented || !sideMenuCtrl.isDraggableTarget(e))
                  return;
                isDragging = true;
                sideMenuCtrl._handleDrag(e);
                e.gesture.srcEvent.preventDefault();
              };
              var dragVertFn = function (e) {
                if (isDragging) {
                  e.gesture.srcEvent.preventDefault();
                }
              };
              var dragRightGesture = $ionicGesture.on('dragright', dragFn, $element);
              var dragLeftGesture = $ionicGesture.on('dragleft', dragFn, $element);
              var dragUpGesture = $ionicGesture.on('dragup', dragVertFn, $element);
              var dragDownGesture = $ionicGesture.on('dragdown', dragVertFn, $element);
              var dragReleaseFn = function (e) {
                isDragging = false;
                if (!defaultPrevented) {
                  sideMenuCtrl._endDrag(e);
                }
                defaultPrevented = false;
              };
              var releaseGesture = $ionicGesture.on('release', dragReleaseFn, $element);
              sideMenuCtrl.setContent({
                onDrag: function (e) {
                },
                endDrag: function (e) {
                },
                getTranslateX: function () {
                  return $scope.sideMenuContentTranslateX || 0;
                },
                setTranslateX: ionic.animationFrameThrottle(function (amount) {
                  $element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + amount + 'px, 0, 0)';
                  $timeout(function () {
                    $scope.sideMenuContentTranslateX = amount;
                  });
                }),
                enableAnimation: function () {
                  $scope.animationEnabled = true;
                  $element[0].classList.add('menu-animated');
                },
                disableAnimation: function () {
                  $scope.animationEnabled = false;
                  $element[0].classList.remove('menu-animated');
                }
              });
              $scope.$on('$destroy', function () {
                $ionicGesture.off(dragLeftGesture, 'dragleft', dragFn);
                $ionicGesture.off(dragRightGesture, 'dragright', dragFn);
                $ionicGesture.off(dragUpGesture, 'dragup', dragFn);
                $ionicGesture.off(dragDownGesture, 'dragdown', dragFn);
                $ionicGesture.off(releaseGesture, 'release', dragReleaseFn);
                ionic.off('tap', contentTap, $element[0]);
              });
            }
          }
        };
      }
    ]);
    IonicModule.directive('ionSideMenus', [function () {
        return {
          restrict: 'ECA',
          replace: true,
          transclude: true,
          controller: '$ionicSideMenus',
          template: '<div class="view" ng-transclude></div>'
        };
      }]);
    IonicModule.directive('ionSlideBox', [
      '$timeout',
      '$compile',
      '$ionicSlideBoxDelegate',
      function ($timeout, $compile, $ionicSlideBoxDelegate) {
        return {
          restrict: 'E',
          replace: true,
          transclude: true,
          scope: {
            doesContinue: '@',
            slideInterval: '@',
            showPager: '@',
            pagerClick: '&',
            disableScroll: '@',
            onSlideChanged: '&',
            activeSlide: '=?'
          },
          controller: [
            '$scope',
            '$element',
            '$attrs',
            function ($scope, $element, $attrs) {
              var _this = this;
              var continuous = $scope.$eval($scope.doesContinue) === true;
              var slideInterval = continuous ? $scope.$eval($scope.slideInterval) || 4000 : 0;
              var slider = new ionic.views.Slider({
                  el: $element[0],
                  auto: slideInterval,
                  disableScroll: $scope.$eval($scope.disableScroll) === true || false,
                  continuous: continuous,
                  startSlide: $scope.activeSlide,
                  slidesChanged: function () {
                    $scope.currentSlide = slider.currentIndex();
                    $timeout(function () {
                    });
                  },
                  callback: function (slideIndex) {
                    $scope.currentSlide = slideIndex;
                    $scope.onSlideChanged({ index: $scope.currentSlide });
                    $scope.$parent.$broadcast('slideBox.slideChanged', slideIndex);
                    $scope.activeSlide = slideIndex;
                    $timeout(function () {
                    });
                  }
                });
              $scope.$watch('activeSlide', function (nv) {
                if (angular.isDefined(nv)) {
                  slider.slide(nv);
                }
              });
              $scope.$on('slideBox.nextSlide', function () {
                slider.next();
              });
              $scope.$on('slideBox.prevSlide', function () {
                slider.prev();
              });
              $scope.$on('slideBox.setSlide', function (e, index) {
                slider.slide(index);
              });
              this.__slider = slider;
              var deregisterInstance = $ionicSlideBoxDelegate._registerInstance(slider, $attrs.delegateHandle);
              $scope.$on('$destroy', deregisterInstance);
              this.slidesCount = function () {
                return slider.slidesCount();
              };
              this.onPagerClick = function (index) {
                void 0;
                $scope.pagerClick({ index: index });
              };
              $timeout(function () {
                slider.load();
              });
            }
          ],
          template: '<div class="slider">            <div class="slider-slides" ng-transclude>            </div>          </div>',
          link: function ($scope, $element, $attr, slideBoxCtrl) {
            if ($scope.$eval($scope.showPager) !== false) {
              var childScope = $scope.$new();
              var pager = angular.element('<ion-pager></ion-pager>');
              $element.append(pager);
              $compile(pager)(childScope);
            }
          }
        };
      }
    ]).directive('ionSlide', function () {
      return {
        restrict: 'E',
        require: '^ionSlideBox',
        compile: function (element, attr) {
          element.addClass('slider-slide');
          return function ($scope, $element, $attr) {
          };
        }
      };
    }).directive('ionPager', function () {
      return {
        restrict: 'E',
        replace: true,
        require: '^ionSlideBox',
        template: '<div class="slider-pager"><span class="slider-pager-page" ng-repeat="slide in numSlides() track by $index" ng-class="{active: $index == currentSlide}" ng-click="pagerClick($index)"><i class="icon ion-record"></i></span></div>',
        link: function ($scope, $element, $attr, slideBox) {
          var selectPage = function (index) {
            var children = $element[0].children;
            var length = children.length;
            for (var i = 0; i < length; i++) {
              if (i == index) {
                children[i].classList.add('active');
              } else {
                children[i].classList.remove('active');
              }
            }
          };
          $scope.pagerClick = function (index) {
            slideBox.onPagerClick(index);
          };
          $scope.numSlides = function () {
            return new Array(slideBox.slidesCount());
          };
          $scope.$watch('currentSlide', function (v) {
            selectPage(v);
          });
        }
      };
    });
    IonicModule.directive('ionTab', [
      '$rootScope',
      '$animate',
      '$ionicBind',
      '$compile',
      function ($rootScope, $animate, $ionicBind, $compile) {
        function attrStr(k, v) {
          return angular.isDefined(v) ? ' ' + k + '="' + v + '"' : '';
        }
        return {
          restrict: 'E',
          require: [
            '^ionTabs',
            'ionTab'
          ],
          replace: true,
          controller: '$ionicTab',
          scope: true,
          compile: function (element, attr) {
            var navView = element[0].querySelector('ion-nav-view') || element[0].querySelector('data-ion-nav-view');
            var navViewName = navView && navView.getAttribute('name');
            var tabNavElement = angular.element('<ion-tab-nav' + attrStr('ng-click', attr.ngClick) + attrStr('title', attr.title) + attrStr('icon', attr.icon) + attrStr('icon-on', attr.iconOn) + attrStr('icon-off', attr.iconOff) + attrStr('badge', attr.badge) + attrStr('badge-style', attr.badgeStyle) + '></ion-tab-nav>');
            var tabContent = angular.element('<div class="pane">').append(element.contents().remove());
            return function link($scope, $element, $attr, ctrls) {
              var childScope;
              var childElement;
              var tabsCtrl = ctrls[0];
              var tabCtrl = ctrls[1];
              $ionicBind($scope, $attr, {
                animate: '=',
                onSelect: '&',
                onDeselect: '&',
                title: '@',
                uiSref: '@',
                href: '@'
              });
              tabsCtrl.add($scope);
              $scope.$on('$destroy', function () {
                tabsCtrl.remove($scope);
                tabNavElement.isolateScope().$destroy();
                tabNavElement.remove();
              });
              $element[0].removeAttribute('title');
              if (navViewName) {
                tabCtrl.navViewName = navViewName;
              }
              $scope.$on('$stateChangeSuccess', selectIfMatchesState);
              selectIfMatchesState();
              function selectIfMatchesState() {
                if (tabCtrl.tabMatchesState()) {
                  tabsCtrl.select($scope);
                }
              }
              tabNavElement.data('$ionTabsController', tabsCtrl);
              tabNavElement.data('$ionTabController', tabCtrl);
              tabsCtrl.$tabsElement.append($compile(tabNavElement)($scope));
              $scope.$watch('$tabSelected', function (value) {
                childScope && childScope.$destroy();
                childScope = null;
                childElement && $animate.leave(childElement);
                childElement = null;
                if (value) {
                  childScope = $scope.$new();
                  childElement = tabContent.clone();
                  $animate.enter(childElement, tabsCtrl.$element);
                  $compile(childElement)(childScope);
                }
              });
            };
          }
        };
      }
    ]);
    IonicModule.directive('ionTabNav', [function () {
        return {
          restrict: 'E',
          replace: true,
          require: [
            '^ionTabs',
            '^ionTab'
          ],
          template: '<a ng-class="{\'tab-item-active\': isTabActive(), \'has-badge\':badge}" ' + ' class="tab-item">' + '<span class="badge {{badgeStyle}}" ng-if="badge">{{badge}}</span>' + '<i class="icon {{getIconOn()}}" ng-if="getIconOn() && isTabActive()"></i>' + '<i class="icon {{getIconOff()}}" ng-if="getIconOff() && !isTabActive()"></i>' + '<span class="tab-title" ng-bind-html="title"></span>' + '</a>',
          scope: {
            title: '@',
            icon: '@',
            iconOn: '@',
            iconOff: '@',
            badge: '=',
            badgeStyle: '@'
          },
          compile: function (element, attr, transclude) {
            return function link($scope, $element, $attrs, ctrls) {
              var tabsCtrl = ctrls[0], tabCtrl = ctrls[1];
              $element[0].removeAttribute('title');
              $scope.selectTab = function (e) {
                e.preventDefault();
                tabsCtrl.select(tabCtrl.$scope, true);
              };
              if (!$attrs.ngClick) {
                $element.on('click', function (event) {
                  $scope.$apply(function () {
                    $scope.selectTab(event);
                  });
                });
              }
              $scope.getIconOn = function () {
                return $scope.iconOn || $scope.icon;
              };
              $scope.getIconOff = function () {
                return $scope.iconOff || $scope.icon;
              };
              $scope.isTabActive = function () {
                return tabsCtrl.selectedTab() === tabCtrl.$scope;
              };
            };
          }
        };
      }]);
    IonicModule.directive('ionTabs', [
      '$ionicViewService',
      '$ionicTabsDelegate',
      function ($ionicViewService, $ionicTabsDelegate) {
        return {
          restrict: 'E',
          scope: true,
          controller: '$ionicTabs',
          compile: function (element, attr) {
            element.addClass('view');
            var innerElement = angular.element('<div class="tabs"></div>');
            innerElement.append(element.contents());
            element.append(innerElement);
            return { pre: prelink };
            function prelink($scope, $element, $attr, tabsCtrl) {
              var deregisterInstance = $ionicTabsDelegate._registerInstance(tabsCtrl, $attr.delegateHandle);
              $scope.$on('$destroy', deregisterInstance);
              tabsCtrl.$scope = $scope;
              tabsCtrl.$element = $element;
              tabsCtrl.$tabsElement = angular.element($element[0].querySelector('.tabs'));
              var el = $element[0];
              $scope.$watch(function () {
                return el.className;
              }, function (value) {
                var isTabsTop = value.indexOf('tabs-top') !== -1;
                var isHidden = value.indexOf('tabs-item-hide') !== -1;
                $scope.$hasTabs = !isTabsTop && !isHidden;
                $scope.$hasTabsTop = isTabsTop && !isHidden;
              });
              $scope.$on('$destroy', function () {
                $scope.$hasTabs = $scope.$hasTabsTop = null;
              });
            }
          }
        };
      }
    ]);
    IonicModule.directive('ionToggle', [
      '$ionicGesture',
      '$timeout',
      function ($ionicGesture, $timeout) {
        return {
          restrict: 'E',
          replace: true,
          require: '?ngModel',
          scope: {
            ngModel: '=?',
            ngValue: '=?',
            ngChecked: '=?',
            ngChange: '&',
            ngDisabled: '=?'
          },
          transclude: true,
          template: '<div class="item item-toggle">' + '<div ng-transclude></div>' + '<label class="toggle">' + '<input type="checkbox" ng-model="ngModel" ng-value="ngValue" ng-change="ngChange()" ng-disabled="ngDisabled">' + '<div class="track">' + '<div class="handle"></div>' + '</div>' + '</label>' + '</div>',
          compile: function (element, attr) {
            var input = element.find('input');
            if (attr.name)
              input.attr('name', attr.name);
            if (attr.ngChecked)
              input.attr('ng-checked', 'ngChecked');
            if (attr.ngTrueValue)
              input.attr('ng-true-value', attr.ngTrueValue);
            if (attr.ngFalseValue)
              input.attr('ng-false-value', attr.ngFalseValue);
            return function ($scope, $element, $attr) {
              var el, checkbox, track, handle;
              el = $element[0].getElementsByTagName('label')[0];
              checkbox = el.children[0];
              track = el.children[1];
              handle = track.children[0];
              var ngModelController = angular.element(checkbox).controller('ngModel');
              $scope.toggle = new ionic.views.Toggle({
                el: el,
                track: track,
                checkbox: checkbox,
                handle: handle,
                onChange: function () {
                  if (checkbox.checked) {
                    ngModelController.$setViewValue(true);
                  } else {
                    ngModelController.$setViewValue(false);
                  }
                  $scope.$apply();
                }
              });
              $scope.$on('$destroy', function () {
                $scope.toggle.destroy();
              });
            };
          }
        };
      }
    ]);
    IonicModule.directive('ionView', [
      '$ionicViewService',
      '$rootScope',
      '$animate',
      function ($ionicViewService, $rootScope, $animate) {
        return {
          restrict: 'EA',
          priority: 1000,
          require: '^?ionNavBar',
          compile: function (tElement, tAttrs, transclude) {
            tElement.addClass('pane');
            tElement[0].removeAttribute('title');
            return function link($scope, $element, $attr, navBarCtrl) {
              if (!navBarCtrl) {
                return;
              }
              if (angular.isDefined($attr.title)) {
                var initialTitle = $attr.title;
                navBarCtrl.changeTitle(initialTitle, $scope.$navDirection);
                $attr.$observe('title', function (val, oldVal) {
                  if (val !== initialTitle) {
                    navBarCtrl.setTitle(val);
                  }
                });
              }
              $scope.$watch($attr.hideBackButton, function (value) {
                navBarCtrl.showBackButton(!value);
              });
              $scope.$watch($attr.hideNavBar, function (value) {
                navBarCtrl.showBar(!value);
              });
            };
          }
        };
      }
    ]);
  }());
  define('ionic-angular', [
    'angular',
    'ionic'
  ], function () {
  });
  angular.module('surpassMobileApp', ['ionic']);
  ;
  define('app', [
    'angular',
    'angular-animate',
    'angular-sanitize',
    'angular-ui-router',
    'ionic',
    'ionic-angular'
  ], function () {
  });
  angular.module('surpassMobileApp').controller('AppCtrl', [
    '$scope',
    function ($scope) {
      $scope.user = 'adam';
      $scope.hello = function () {
        alert('hello');
      };
    }
  ]);
  define('controllers/app', ['app'], function () {
  });
  require.config({
    paths: {
      'angular': '../bower_components/angular/angular',
      'angular-ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
      'angular-animate': '../bower_components/angular-animate/angular-animate',
      'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize',
      'ionic': '../bower_components/ionic/release/js/ionic',
      'ionic-angular': '../bower_components/ionic/release/js/ionic-angular'
    },
    shim: {
      'angular': { exports: 'angular' },
      'ionic': { exports: 'ionic' },
      'ionic-angular': {
        deps: [
          'angular',
          'ionic'
        ]
      },
      'angular-ui-router': { deps: ['angular'] },
      'angular-animate': { deps: ['angular'] },
      'angular-sanitize': { deps: ['angular'] },
      'app': {
        deps: [
          'angular',
          'angular-animate',
          'angular-sanitize',
          'angular-ui-router',
          'ionic',
          'ionic-angular'
        ]
      },
      'controllers/app': { deps: ['app'] }
    }
  });
  require([
    'require',
    'controllers/app'
  ], function () {
    'use strict';
    angular.bootstrap(document, ['surpassMobileApp']);
  });
  define('main', function () {
  });
}());
