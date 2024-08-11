import { ArticleInfo, getArticleInfo, updatePostStats } from '@/plugins/Article';
import './index.scss';
import { setBrand, setCover } from '../../hook/useBrand';
import { _dts } from '@/utils/domUtil';
import { CommentManager } from '@/plugins/Comment';
import { createBottomMess } from '../Article/tool';

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
const buildReward = () => {
  const posts = _dts.getElByCls<'div'>('post');
  if (!posts.length) return;
  const post = posts[0];
  const info = getArticleInfo();

  refreshHeader(info);

  const bottomMess = createBottomMess(0b0110, info);
  post.appendChild(bottomMess);

  // 评论
  const manager = new CommentManager();
  window.commentManager = manager;
  manager.initComments();

  // 修改提示
  const commentText = _dts.getElById('tbCommentBody');
  commentText && commentText.setAttribute('placeholder', '可在下方留下你的鼓励');

  // 更新文章状态
  updatePostStats();
};

export default buildReward;
