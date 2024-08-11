(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
      factory((global.throttleDebounce = {})));
})(this, function (exports) {
  'use strict';

  /* eslint-disable no-undefined,no-param-reassign,no-shadow */

  /**
   * 对函数执行进行节流
   * 特别适用于对resize和scroll等事件的处理程序执行进行速率限制
   *
   * @param {number} delay - 一个零或更大的毫秒延迟值。对于事件回调，值为100或250（甚至更高）最为有用
   * @param {Function} callback - 一个将在延迟毫秒后执行的函数。当调用节流函数时，将原样传递 `this` 上下文和所有参数给 `callback`.
   * @param {object} [options] - 一个配置选项的对象
   * @param {boolean} [options.noTrailing] - 可选，默认为 false。如果 noTrailing 为 true，则只有在每隔`delay`毫秒后，当节流函数被调用时，callback 才会执行。如果 noTrailing 为 false或未指定，则在最后一次节流函数调用`delay`毫秒之后，callback 将再次执行一次。（在`delay`毫秒未调用节流函数后，内部计数器将被重置）
   * @param {boolean} [options.noLeading] - 可选，默认为 false。如果 noLeading 为 false，则第一个节流函数调用将立即执行 callback。如果 `noLeading` 为 `true`，则第一个回调执行将被跳过。需要注意的是：
   * - 如果同时 `noLeading` 和 `noTrailing` 都为 `true`，回调将永远不会被执行
   * @param {boolean} [options.debounceMode] - 是一个可选参数，默认为`false`。如果`debounceMode`为`true`(在开始时),则在`delay`毫秒后调用 `clear`。如果`debounceMode`为 `false`(在结束时)，则在`delay`毫秒后调用 `callback`
   *
   * @returns {Function} 返回一个新的，经过缓冲的函数
   */
  function throttle(delay, callback, options) {
    var _ref = options || {},
      _ref$noTrailing = _ref.noTrailing,
      noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing,
      _ref$noLeading = _ref.noLeading,
      noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading,
      _ref$debounceMode = _ref.debounceMode,
      debounceMode = _ref$debounceMode === void 0 ? undefined : _ref$debounceMode;
    /*
     * After wrapper has stopped being called, this timeout ensures that
     * `callback` is executed at the proper times in `throttle` and `end`
     * debounce modes.
     */

    var timeoutID;
    var cancelled = false; // Keep track of the last time `callback` was executed.

    var lastExec = 0; // Function to clear existing timeout

    function clearExistingTimeout() {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
    } // Function to cancel next exec

    function cancel(options) {
      var _ref2 = options || {},
        _ref2$upcomingOnly = _ref2.upcomingOnly,
        upcomingOnly = _ref2$upcomingOnly === void 0 ? false : _ref2$upcomingOnly;

      clearExistingTimeout();
      cancelled = !upcomingOnly;
    }
    /*
     * The `wrapper` function encapsulates all of the throttling / debouncing
     * functionality and when executed will limit the rate at which `callback`
     * is executed.
     */

    function wrapper() {
      for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
        arguments_[_key] = arguments[_key];
      }

      var self = this;
      var elapsed = Date.now() - lastExec;

      if (cancelled) {
        return;
      } // Execute `callback` and update the `lastExec` timestamp.

      function exec() {
        lastExec = Date.now();
        callback.apply(self, arguments_);
      }
      /*
       * If `debounceMode` is true (at begin) this is used to clear the flag
       * to allow future `callback` executions.
       */

      function clear() {
        timeoutID = undefined;
      }

      if (!noLeading && debounceMode && !timeoutID) {
        /*
         * Since `wrapper` is being called for the first time and
         * `debounceMode` is true (at begin), execute `callback`
         * and noLeading != true.
         */
        exec();
      }

      clearExistingTimeout();

      if (debounceMode === undefined && elapsed > delay) {
        if (noLeading) {
          /*
           * In throttle mode with noLeading, if `delay` time has
           * been exceeded, update `lastExec` and schedule `callback`
           * to execute after `delay` ms.
           */
          lastExec = Date.now();

          if (!noTrailing) {
            timeoutID = setTimeout(debounceMode ? clear : exec, delay);
          }
        } else {
          /*
           * In throttle mode without noLeading, if `delay` time has been exceeded, execute
           * `callback`.
           */
          exec();
        }
      } else if (noTrailing !== true) {
        /*
         * In trailing throttle mode, since `delay` time has not been
         * exceeded, schedule `callback` to execute `delay` ms after most
         * recent execution.
         *
         * If `debounceMode` is true (at begin), schedule `clear` to execute
         * after `delay` ms.
         *
         * If `debounceMode` is false (at end), schedule `callback` to
         * execute after `delay` ms.
         */
        timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
      }
    }

    wrapper.cancel = cancel; // Return the wrapper function.

    return wrapper;
  }

  /* eslint-disable no-undefined */
  /**
   * Debounce execution of a function. Debouncing, unlike throttling,
   * guarantees that a function is only executed a single time, either at the
   * very beginning of a series of calls, or at the very end.
   *
   * @param {number} delay -               A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
   * @param {Function} callback -          A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is, to `callback` when the debounced-function is executed.
   * @param {object} [options] -           An object to configure options.
   * @param {boolean} [options.atBegin] - 可选，默认为false。如果 atBegin 为 false 或未指定，回调将只执行在最后一次防抖函数调用'delay'毫秒之后；如果 atBegin 为 true, callback 将只在第一次防抖函数调用时执行。(在节流函数没有被调用延迟毫秒后，内部计数器被重置)。
   *
   * @returns {Function} A new, debounced function.
   */

  function debounce(delay, callback, options) {
    var _ref = options || {},
      _ref$atBegin = _ref.atBegin,
      atBegin = _ref$atBegin === void 0 ? false : _ref$atBegin;

    return throttle(delay, callback, {
      debounceMode: atBegin !== false
    });
  }

  exports.debounce = debounce;
  exports.throttle = throttle;

  Object.defineProperty(exports, '__esModule', { value: true });
});
//# sourceMappingURL=index.js.map
