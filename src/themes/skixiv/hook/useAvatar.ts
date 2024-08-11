import { defaultAvatar } from '@/utils/cnblogUtil';

/** 头像相关DOM */
const avatarDOMs: HTMLImageElement[] = [];

/**
 * 为DOM绑定头像
 * @param dom
 */
export const useUserAvatar = (dom: HTMLImageElement) => {
  if (window.userInfo) {
    // 如果头像已经获取
    // 直接绑定
    dom.setAttribute('src', window.userInfo.avatarName || defaultAvatar);
    dom.setAttribute('alt', 'avatar');
  } else {
    // 还未获取，暂存
    avatarDOMs.push(dom);
  }
};

/** 绑定头像 */
export const bindUserAvatar = () => {
  // 头像获取成功，逐一绑定
  for (const dom of avatarDOMs) {
    dom.setAttribute('src', window.userInfo?.avatarName || defaultAvatar);
    dom.setAttribute('alt', 'avatar');
  }
  // 清空
  avatarDOMs.length = 0;
};
