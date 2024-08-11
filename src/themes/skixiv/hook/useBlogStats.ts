import { getBlogStats } from '@/utils/cnblogUtil';

export type StatsType = 'post' | 'article' | 'comment' | 'read';

const statsDOMs: { [key: string]: HTMLElement[] } = {
  post: [],
  article: [],
  comment: [],
  read: []
};

let stats: BlogStats | undefined = undefined;

getBlogStats()
  .then(res => {
    stats = res;
    bindBlogStats();
  })
  .catch(() => {});

/**
 * 获取博客状态
 * @param type
 * @param dom
 */
const useBlogStats = (type: StatsType, dom: HTMLElement) => {
  if (stats) {
    dom.innerText = stats[type];
  } else {
    statsDOMs[type].push(dom);
  }
};

/** 绑定 */
const bindBlogStats = () => {
  if (!stats) return;
  for (const key of Object.keys(stats)) {
    for (const dom of statsDOMs[key]) {
      dom.innerText = stats[key as StatsType];
    }
    statsDOMs[key].length = 0;
  }
};

export default useBlogStats;
