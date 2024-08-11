import { throttle, debounce } from '@/utils/commonUtil';

interface ScrollOptions {
  /**
   * 模式
   * - 无
   * - 节流
   * - 防抖
   */
  mode?: 0 | 1 | 2;
  /**
   * 节流防抖的延迟时间
   * - 默认为 200 ms
   */
  delay?: number;
}

const DELAY = 200;

/**
 * 监听滚动
 * @param callback 回调函数
 * @param options 配置
 * @returns 取消监听函数
 */
const useScroll = (callback: () => void, options?: ScrollOptions) => {
  let opt = options || {};
  let mode = opt.mode === void 0 ? 1 : opt.mode;
  let delay = opt.delay === void 0 ? DELAY : opt.delay;
  let _callback = callback;
  if (mode === 1) {
    _callback = throttle(delay, callback);
  } else if (mode === 2) {
    _callback = debounce(delay, callback);
  }

  window.addEventListener('scroll', _callback);

  return () => {
    window.removeEventListener('scroll', _callback);
  };
};

export default useScroll;
