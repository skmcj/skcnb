interface SocialMapItem {
  icon: string;
  name: string;
}

interface SocialMap {
  [key: string]: SocialMapItem;
}

const socialMap: SocialMap = {
  github: { icon: 'ib-github', name: 'github' },
  tumblr: { icon: 'ib-tumblr', name: 'tumblr' },
  pinterest: { icon: 'ib-pinterest', name: 'pinterest' },
  steam: { icon: 'ib-steam', name: 'steam' },
  coding: { icon: 'ib-coding', name: 'coding' },
  kugou: { icon: 'ib-kugou', name: '酷狗' },
  cnblog: { icon: 'ib-cnblog-f', name: '博客园' },
  epic: { icon: 'ib-epic', name: 'epic' },
  gmail: { icon: 'ib-gmail', name: '谷歌邮箱' },
  zhishixingqiu: { icon: 'ib-zhishixingqiu', name: '知识星球' },
  niuke: { icon: 'ib-niuke', name: '牛客' },
  xianyu: { icon: 'ib-xianyu', name: '闲鱼' },
  momo: { icon: 'ib-momo', name: '陌陌' },
  aifadian: { icon: 'ib-aifadian-line', name: '爱发电' },
  whatsapp: { icon: 'ib-whatsapp-line', name: 'whatsapp' },
  ximalaya: { icon: 'ib-ximalaya', name: '喜马拉雅' },
  tieba: { icon: 'ib-tieba', name: '贴吧' },
  sspai: { icon: 'ib-sspai', name: '少数派' },
  line: { icon: 'ib-line-line', name: 'line' },
  jike: { icon: 'ib-jike', name: '即刻' },
  kuaishou: { icon: 'ib-kuaishou', name: '快手' },
  minecraft: { icon: 'ib-minecraft', name: 'minecraft' },
  bluesky: { icon: 'ib-bluesky', name: 'bluesky' },
  douban: { icon: 'ib-douban', name: '豆瓣' },
  linkedin: { icon: 'ib-linkedin', name: 'linkedin' },
  reddit: { icon: 'ib-reddit', name: 'reddit' },
  'stack-overflow': { icon: 'ib-stack-overflow', name: 'stack-overflow' },
  codepen: { icon: 'ib-codepen', name: 'codepen' },
  qqmusic: { icon: 'ib-qqmusic', name: 'QQ音乐' },
  youtube: { icon: 'ib-youtube', name: 'youtube' },
  weibo: { icon: 'ib-weibo', name: '微博' },
  facebook: { icon: 'ib-facebook-fill', name: 'facebook' },
  ins: { icon: 'ib-ins-line', name: 'ins' },
  bilibili: { icon: 'ib-bilibili-line', name: '哔哩哔哩' },
  discord: { icon: 'ib-discord-line', name: 'discord' },
  pixiv: { icon: 'ib-pixiv', name: 'pixiv' },
  gitee: { icon: 'ib-gitee', name: 'gitee' },
  xiaohongshu: { icon: 'ib-xiaohongshu', name: '小红书' },
  toutiao: { icon: 'ib-toutiao', name: '今日头条' },
  csdn: { icon: 'ib-csdn', name: 'csdn' },
  telegram: { icon: 'ib-telegram', name: 'telegram' },
  jianshu: { icon: 'ib-jianshu', name: '简书' },
  douyin: { icon: 'ib-douyin', name: '抖音' },
  ixigua: { icon: 'ib-ixigua', name: '西瓜视频' },
  weixin: { icon: 'ib-weixin', name: '微信' },
  zhihu: { icon: 'ib-zhihu', name: '知乎' },
  twitter: { icon: 'ib-twitter-x', name: 'twitter' },
  qq: { icon: 'ib-qq', name: 'QQ' },
  wangyiyun: { icon: 'ib-wangyiyun', name: '网易云' },
  leetcode: { icon: 'ib-leetcode', name: '力扣' },
  twitch: { icon: 'ib-twitch', name: 'Twitch' },
  acfun: { icon: 'ib-acfun', name: 'A站' },
  'pan-baidu': { icon: 'ib-pan-baidu', name: '百度网盘' },
  email: { icon: 'ib-contact', name: '邮箱' }
};

/** 获取社交圈配置 */
const useSocial = () => {
  if (!window.themeConfig.social) return undefined;
  const map = window.themeConfig.social;
  const social: SocialItem[] = [];
  for (const item of Object.keys(map)) {
    if (typeof map[item] === 'object') {
      // social item value is object: {}
      social.push({
        text: map[item].text,
        url: map[item].url,
        icon: map[item].icon,
        color: map[item].color
      });
    } else {
      if (typeof map[item] !== 'string') continue;
      // social item value is string: ''
      if (socialMap[item]) {
        social.push({
          text: socialMap[item].name,
          url: map[item],
          icon: socialMap[item].icon
        });
      } else {
        social.push({
          text: item,
          url: map[item]
        });
      }
    }
  }
  return social;
};

export default useSocial;
