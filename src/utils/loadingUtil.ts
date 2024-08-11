let flag = false;
let timer: NodeJS.Timeout | null = null;
let time = -1;
const HideAniDelay = 300;

/**
 * 展示Loading
 */
export const showLoading = () => {
  const dom = document.getElementById('loading');
  dom && (dom.classList.remove('hide'), dom.classList.add('show'));
  // 禁止页面滚动
  document.body.classList.add('lock-scroll');
  flag = true;
  time = Date.now();
};

/**
 * 隐藏Loading
 * @param duration 延时
 *  - 如果Loading已加载[duration]ms，直接关闭
 *  - 如果Loading未加载够[duration]ms，等待延时足够再关闭
 */
export const hideLoading = (duration: number = 0) => {
  if (duration > 0) {
    if (time === -1) handleHide();
    else {
      let now = Date.now();
      let stamp = time + duration;
      if (timer) clearTimeout(timer);
      if (stamp > now) {
        // 延时关闭
        timer = setTimeout(handleHide, stamp - now);
      } else {
        // 立即关闭
        handleHide();
      }
    }
  } else {
    handleHide();
  }
};

/**
 * 隐藏Loading
 */
const handleHide = () => {
  const dom = document.getElementById('loading');
  document.body.classList.remove('lock-scroll');
  dom && dom.classList.add('before-hide');
  setTimeout(() => {
    dom && (dom.classList.remove('show', 'before-hide'), dom.classList.add('hide'));
  }, HideAniDelay);
  flag = false;
  time = -1;
  timer && clearTimeout(timer);
};
