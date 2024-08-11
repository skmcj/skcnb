import './index.scss';
import { setBrand, setCover } from '../../hook/useBrand';
import { getArticleInfo, getPrevAndNext, showCates, updatePostStats } from '@/plugins/Article';
import type { ArticleCate, ArticleInfo } from '@/plugins/Article';
import { CommentManager } from '@/plugins/Comment';
import { createBottomMess } from './tool';
import { _dts } from '@/utils/domUtil';

// 目录
// 样式
// 评论
// 底部标签

// 类别
const createCate = (data: ArticleCate[]) => {
  const cates = _dts.ctBox('sk-post-cates');
  const icon = _dts.ctIcon('ib-series');
  cates.appendChild(icon);
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const cate = _dts.ctBox('sk-post-cate');
      if (i > 0) {
        cate.classList.add('bf');
      }
      const link = _dts.ctLink(data[i].url);
      link.setAttribute('target', '_blank');
      link.innerText = data[i].name;
      cate.appendChild(link);
      cates.appendChild(cate);
    }
  } else {
    const span = _dts.ctSpan('暂未分类', 'sk-post-cate');
    cates.appendChild(span);
  }

  return cates;
};

// 更新header信息
const refreshHeader = (data: ArticleInfo) => {
  if (data.cover) {
    setCover(data.cover);
  }
  setBrand({
    title: data.title,
    desc: data.desc,
    info: [
      { icon: 'ib-view', text: data.view, cls: 'post_view_count' },
      { icon: 'ib-comment', text: data.comment, cls: 'post_comment_count' },
      { icon: 'ib-digg', text: data.digg, cls: 'post_digg_count' }
    ]
  });
};

/**
 * 创建
 */
const buildArticle = () => {
  const posts = _dts.getElByCls('post');
  if (!posts.length) return;
  const post = posts[0];
  const info = getArticleInfo();
  const context = getPrevAndNext();
  // console.log('article info', info);
  // console.log('article context', context);
  // header设置标题、封面、日期等
  refreshHeader(info);
  // 顶部插入类别信息
  const topMess = _dts.ctBox('sk-post-top');
  if (info.cates.length > 0) {
    topMess.appendChild(createCate(info.cates));
  } else {
    showCates((cates: ArticleCate[]) => {
      topMess.appendChild(createCate(cates));
    });
  }

  post.insertBefore(topMess, post.firstChild);
  // 底部插入标签、版权信息、上下篇
  const bottomMess = createBottomMess(0b1111, info, context);
  post.appendChild(bottomMess);

  // 评论列表
  const manager = new CommentManager();
  window.commentManager = manager;
  manager.initComments();

  // 更新文章状态
  updatePostStats();
};

export default buildArticle;
