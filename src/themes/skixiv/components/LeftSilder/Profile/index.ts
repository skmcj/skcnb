import './index.scss';
import useBlogStats from '../../../hook/useBlogStats';
import { bindBus } from '../../../hook/useBus';
import { _dts } from '@/utils/domUtil';

/** 创建计数卡 */
const createProfileMsg = (list: ProfileMsg[]) => {
  /**
   * <div class="sk-profile-msgs">
   *   <div class="sk-profile-msg">
   *     <span class="title">随笔</span>
   *     <span class="text">64</span>
   *   </div>
   * </div>
   */
  const msgs = _dts.ctBox('sk-profile-msgs');
  for (const item of list) {
    const msg = _dts.ctBox('sk-profile-msg');
    const title = _dts.ctSpan(item.name, 'title');
    const count = _dts.ctSpan(item.count, 'text');
    msg.appendChild(title);
    msg.appendChild(count);
    if (item.stats) {
      useBlogStats(item.stats, count);
    }
    if (item.name === '粉丝') {
      bindBus(
        'follow',
        (data: boolean) => {
          const old = parseInt(count.innerText);
          if (data) {
            count.innerText = `${old + 1}`;
          } else {
            count.innerText = `${old - 1}`;
          }
        },
        true
      );
    }
    if (item.url) {
      const link = _dts.ctLink(item.url, 'sk-profile-link sk-profile-item');
      link.setAttribute('title', item.name);
      link.appendChild(msg);
      msgs.appendChild(link);
    } else {
      msg.classList.add('sk-profile-item');
      msgs.appendChild(msg);
    }
  }
  return msgs;
};

/**
 * 创建个人信息栏
 */
const createProfile = (data: Profile) => {
  const profile = _dts.ctBox('sk-profile');
  // 昵称
  const nickname = _dts.ctSpan(data.name, 'sk-profile-name');
  // 签名
  const sign = _dts.ctSpan(data.sign, 'sk-profile-sign');
  // 信息
  const msgs = createProfileMsg(data.msgs);
  profile.appendChild(nickname);
  profile.appendChild(sign);
  profile.appendChild(msgs);
  return profile;
};

export default createProfile;
