import { defaultAvatar } from '@/utils/cnblogUtil';

/**
 * 获取用户信息
 * @returns
 */
const getAccountInfo = () => {
  return new Promise<CBUserInfo>((resolve, reject) => {
    $.ajax({
      type: 'get',
      url: 'https://account.cnblogs.com/user/userinfo',
      xhrFields: {
        withCredentials: !0
      },
      success: function (t) {
        if (t) resolve(t);
        else reject();
      },
      error: function () {
        reject();
      }
    });
  });
};

/* ================ 用户头像相关 ================ */
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
const bindUserAvatar = () => {
  // 头像获取成功，逐一绑定
  for (const dom of avatarDOMs) {
    dom.setAttribute('src', window.userInfo?.avatarName || defaultAvatar);
    dom.setAttribute('alt', 'avatar');
  }
  // 清空
  avatarDOMs.length = 0;
};

export const refreshUserInfo = () => {
  // 绑定用户头像
  bindUserAvatar();
  // 绑定其它信息：昵称···
};

/* ================ 初始化用户信息 ================ */

/**
 * 初始化博客信息
 */
export const initUserInfo = () => {
  getAccountInfo()
    .then(info => {
      window.userInfo = info;
      refreshUserInfo();
      // resolve(true);
    })
    .catch(() => {
      // 信息获取失败
      // reject(false);
    });
};
