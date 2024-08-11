/** 主题列表 */
export const themeMap: ThemeMap = {
  skixiv: 'skixiv',
  default: 'skixiv'
};

/** 默认配置 */
export const defaultConfig: ThemeConfig = {
  avatar: 'images/avatar-default.svg',
  duration: 1500
};

export const getDuration = () => {
  const dur = window.themeConfig.duration;
  if (typeof dur === 'number') return dur;
  else return defaultConfig.duration ?? 1500;
};

/** 主题默认配置 */
export const skixivDefaultConfig = {
  name: 'skixiv',
  btmess: 0b11000,
  // defaultCover: 'https://images.cnblogs.com/cnblogs_com/blogs/821083/galleries/2413232/o_240730154349_IPC-1.webp',
  // defaultSign: '抽刀断水水更流',
  mticket: {
    type: 'fixed',
    prebg:
      'https://images.weserv.nl/?url=https://images.cnblogs.com/cnblogs_com/blogs/821083/galleries/2413232/o_240730154349_IPC-1.webp',
    sufbg:
      'https://images.weserv.nl/?url=https://images.cnblogs.com/cnblogs_com/blogs/821083/galleries/2413232/o_240730155511_qzlvvq.webp',
    count: 0
  }
};
