import './index.scss';
// import useAvatar from '../../hook/useAvatar';
import useSocial from '../../../hook/useSocial';
import { handleFollow } from '../../../hook/useState';
import { bindBus } from '../../../hook/useBus';
import { avatarUrl, getFollowState } from '@/utils/cnblogUtil';
import { _dts } from '@/utils/domUtil';

/**
 * <div class="sk-avatar">
 *   <div class="avatar-inner">
 *     <div class="avatar-main">
 *       <img />
 *       <span>收藏</span>
 *     </div>
 *     <ul class="social-list">
 *       <li class="social-item">
 *         <a><i icon></i></a>
 *       </li>
 *     </ul>
 *   </div>
 * </div>
 */

/** 社交项 */
const createSocialItem = (options: SocialItem, rad: number = 0) => {
  const item = _dts.ctEl('li', 'social-item');

  const inner = _dts.ctBox('social-item-inner');
  inner.setAttribute('title', options.text);

  const link = _dts.ctLink(options.url ?? '');
  link.setAttribute('target', '_blank');
  link.setAttribute('title', options.text);
  if (options.icon) {
    const icon = _dts.ctIcon(options.icon);
    if (options.color) icon.style.color = options.color;
    link.appendChild(icon);
  } else {
    const icon = _dts.ctSpan(options.text.charAt(0));
    link.appendChild(icon);
  }
  inner.appendChild(link);
  item.appendChild(inner);

  // 旋转
  item.style.transform = `rotateZ(${rad}deg)`;
  inner.style.transform = `rotateZ(-${rad}deg)`;

  return item;
};

/**
 * 创建社交圈
 */
const createSocialList = () => {
  const socialList = _dts.ctEl('ul', 'social-list');

  // 添加社交项
  const socials = useSocial();
  if (socials) {
    const count = socials.length;
    const rad = Math.round(360 / count);
    for (let i = 0; i < count; i++) {
      let r = i * rad;
      const item = createSocialItem(socials[i], r);
      socialList.appendChild(item);
    }
  }

  return socialList;
};

/**
 * 创建头像
 */
const createAvatarMain = () => {
  const avatarMain = _dts.ctBox('avatar-main');
  // 头像
  const img = _dts.ctImg(avatarUrl());
  // useAvatar(img);
  img.setAttribute('alt', 'avatar');
  avatarMain.appendChild(img);
  // 收藏按钮
  const btn = _dts.ctSpan('', 'follow-btn');
  if (getFollowState()) {
    btn.setAttribute('title', '取消关注');
    btn.classList.add('is-follow');
  } else {
    btn.setAttribute('title', '关注');
  }
  bindBus(
    'follow',
    (data: boolean) => {
      if (data) {
        btn.setAttribute('title', '取消关注');
        btn.classList.add('is-follow');
      } else {
        btn.setAttribute('title', '关注');
      }
    },
    true
  );

  const icon = _dts.ctIcon('ib-follow');
  btn.appendChild(icon);
  btn.addEventListener('click', () => {
    handleFollow();
  });
  avatarMain.appendChild(btn);

  return avatarMain;
};

/**
 * 创建头像
 */
const createAvatar = () => {
  const avatar = _dts.ctBox('sk-avatar');

  const inner = document.createElement('div');
  inner.classList.add('avatar-inner');
  // 社交圈
  const socialList = createSocialList();
  inner.appendChild(socialList);
  // 头像
  const avatarMain = createAvatarMain();
  inner.appendChild(avatarMain);

  avatar.appendChild(inner);
  return avatar;
};

export default createAvatar;
