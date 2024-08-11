/**
 * 判断当前设备是否为手机
 * @returns {boolean} 当前设备是否为手机
 */
export function isPhone() {
  const width = window.innerWidth;
  return width <= 768 || isRealPhone();
}
/**
 * 判断当前设备是否为手机
 * @returns {boolean} 当前设备是否为手机
 */
export function isRealPhone() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** 锁定滚动 */
export function lockScorll() {
  document.body.classList.add('lock-scroll');
}

/** 取消锁定滚动 */
export function cancelLockScorll() {
  document.body.classList.remove('lock-scroll');
}

/** 获取当前链接 */
export function getCurrentHref() {
  const href = location.href;
  if (/#[^/]*$/.test(href)) {
    const exec = /^(.+)#[^/]*$/.exec(href);
    return exec ? exec[1] : href;
  }
  return href;
}

/** 节流防抖 */
interface ThrottleOptions {
  /**
   * 是否不执行最后一次
   * - 可选，默认为`false`
   *   - 例：delay为3秒，三秒中点击的5五次，只有第一次会触发，`noTrailing`判断第五次是否在3秒后执行）
   * - 如果`noTrailing`为`true`，则只有在每隔`delay`毫秒后，当节流函数被调用时，`callback`才会执行
   * - 如果`noTrailing`为`false`或未指定，则在最后一次节流函数调用`delay`毫秒之后，`callback`将再次执行一次
   * - (在`delay`毫秒未调用节流函数后，内部计数器将被重置)
   */
  noTrailing?: boolean;
  /**
   * 是否跳过第一次执行
   * - 可选，默认为`false`
   * - 如果`noLeading`为`false`，则第一个节流函数调用将立即执行`callback`
   * - 如果`noLeading`为`true`，则第一个回调执行将被跳过
   * - 需要注意的是：
   *   - 如果`noLeading`和`noTrailing`同时为`true`，回调将永远不会被执行
   */
  noLeading?: boolean;
  /**
   * 是否开启防抖模式
   * - 是一个可选参数，默认为`false`
   * - 如果`debounceMode`为`true`(在开始时),则在`delay`毫秒后调用 `clear`
   * - 如果`debounceMode`为`false`(在结束时)，则在`delay`毫秒后调用 `callback`
   */
  debounceMode?: boolean;
}

/**
 * 对函数执行进行节流
 * - 特别适用于对resize和scroll等事件的处理程序执行进行速率限制
 * @param {number} delay - 一个零或更大的毫秒延迟值。对于事件回调，值为100或250(甚至更高)最为有用
 * @param {Function} callback - 一个将在`delay`毫秒后执行的函数。当调用节流函数时，将原样传递`this`上下文和所有参数给`callback`
 * @param {ThrottleOptions} options - 一个配置选项的对象
 * @returns
 */
export const throttle = function (delay: number, callback: Function, options?: ThrottleOptions) {
  let opt = options || {},
    noTrailing = opt.noTrailing === void 0 ? false : opt.noTrailing,
    noLeading = opt.noLeading === void 0 ? false : opt.noLeading,
    debounceMode = opt.debounceMode === void 0 ? void 0 : opt.debounceMode;

  /*
   * 在 wrapper 停止被调用后，该 timeout 确保在节流和防抖模式下，`callback`会在适当的时间被执行
   */

  let timeoutID: string | number | NodeJS.Timeout | undefined;
  // 记录最后一次执行`callback`的时间
  let cancelled = false;
  // 帮助函数清除现有的 timeout
  let lastExec = 0;

  /** 清除下一次运行 */
  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  }

  /**
   * 取消函数运行
   * @param upcomingOnly 是否取消即将运行的
   */
  function cancel(upcomingOnly?: boolean) {
    let _upcomingOnly = upcomingOnly === void 0 ? false : upcomingOnly;
    clearExistingTimeout();
    cancelled = !_upcomingOnly;
  }

  function wrapper(this: any) {
    let _len = arguments.length,
      _arguments = new Array(_len);
    for (let _key = 0; _key < _len; _key++) {
      _arguments[_key] = arguments[_key];
    }

    let self = this;
    let elapsed = Date.now() - lastExec;

    if (cancelled) {
      return;
    }

    // 执行`callback`和更新`lastExec`的时间戳
    function exec() {
      lastExec = Date.now();
      callback.apply(self, _arguments);
    }
    /*
     * 如果`debounceMode`为`true`(在开始时)，则用于清除标志以允许新的`callback`执行。
     */
    function clear() {
      timeoutID = void 0;
    }

    if (!noLeading && debounceMode && !timeoutID) {
      /** 当`noLeading` != `true`及`debounceMode`为`true`时，运行`wrapper` */
      // 防抖模式
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === void 0 && elapsed > delay) {
      if (noLeading) {
        /*
         * 当节流模式下`noLeading`为true，如果超过了`delay`时间，则更新`lastExec`，并安排在`delay`毫秒后执行`callback`
         */
        lastExec = Date.now();

        if (!noTrailing) {
          timeoutID = setTimeout(debounceMode ? clear : exec, delay);
        }
      } else {
        /*
         * 在节流模式下，当`noLeading`为`false`，如果超过了`delay`时间，则执行`callback`
         */
        exec();
      }
    } else if (noTrailing !== true) {
      /*
       * 在`noTrailing`不为`true`的节流模式下，如果尚未超过`delay`时间，让`callback`在最接近`delay`毫秒的时间后执行
       * 如果`debounceMode`为`true`(开始时)，则在`delay`毫秒后执行`clear`
       * 如果`debounceMode`为`false`(结束时)，则在`delay`毫秒后执行`callback`
       */
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === void 0 ? delay - elapsed : delay);
    }
  }
  wrapper.cancel = cancel;

  return wrapper;
};

/**
 * 对函数进行防抖执行
 * - 与节流不同，防抖保证一个函数只执行一次，要么在一系列调用的最开始，要么在最后
 * @param {number} delay - 一个零或更大的毫秒延迟值。对于事件回调，值为100或250(甚至更高)最为有用
 * @param {Function} callback - 一个将在`delay`毫秒后执行的函数。当调用防抖函数时，将原样传递`this`上下文和所有参数给`callback`
 * @param {boolean} atBegin - 可选，默认为false。如果`atBegin`为`false`或未指定，回调将只执行在最后一次防抖函数调用'delay'毫秒之后；如果`atBegin`为`true`，`callback`将只在第一次防抖函数调用时执行(在节流函数没有被调用延迟毫秒后，内部计数器被重置)
 */
export const debounce = (delay: number, callback: Function, atBegin?: boolean) => {
  let _atBegin = atBegin === void 0 ? false : atBegin;
  return throttle(delay, callback, {
    debounceMode: _atBegin !== false
  });
};
