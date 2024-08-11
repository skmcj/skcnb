import { defaultConfig } from '@/themes/config';
import { SkMessage, SkDialog } from '@/utils/MessageUtil';

const blogDomain = 'https://www.cnblogs.com';

/**
 * 是否是博客拥有者
 * @returns {boolean}
 */
export const isOwner = () => window.isBlogOwner;

/**
 * 是否是登录用户
 * @returns {boolean}
 */
export const isLogined = () => window.isLogined;

/**
 * 博客App
 */
export const blogApp = window.currentBlogApp;

/** 博客名 */
export const blogName = getBlogName;

/**
 * 获取博客园昵称
 * @returns {string} 博客园昵称
 */
export function getBlogName() {
  if (openNews()) {
    return $('#profile_block>a:nth-of-type(1)').html().trim();
  }
  const headerTitle = $('#Header1_HeaderTitle').text().trim();
  if (headerTitle.length) {
    return headerTitle;
  }
  return blogApp;
}

/**
 * 获取博客园标题
 * @returns {string} 博客园标题
 */
export function getBlogTitle() {
  const headerTitle = $('#Header1_HeaderTitle').text().trim();
  if (headerTitle.length) {
    return headerTitle;
  }
  return blogApp;
}

/** 默认头像 */
export const defaultAvatar = 'https://pic.cnblogs.com/face/sample_face.gif';

/** 头像链接 */
export const avatarUrl = () => window.themeConfig.avatar || defaultConfig.avatar || defaultAvatar;

/** 首页链接 */
export const homeLink = `/${blogApp}`;
/** 分类链接 */
export const cateLink = `/${blogApp}/post-categories`;
/** 排行榜链接 */
export const rankLink = `/${blogApp}/most-viewed`;
/** 阅读排行榜链接 */
export const rankViewLink = `/${blogApp}/most-viewed`;
/** 推荐排行榜链接 */
export const rankLikeLink = `/${blogApp}/most-liked`;
/** 评论排行榜链接 */
export const rankCommentLink = `/${blogApp}/most-commented`;
/** 标签链接 */
export const tagLink = `/${blogApp}/tag`;
/** 友链链接 */
export const friendLink = `/${blogApp}/articles/-/FLinks`;
/** 打赏链接 */
export const rewardLink = `/${blogApp}/articles/-/Reward`;

/** 博客园首页链接 */
export const cnblogLink = blogDomain;
/* 新随笔 */
export const newPost = 'https://i.cnblogs.com/posts/edit';
/* 草稿箱 */
export const oldPost = 'https://i.cnblogs.com/posts';
/* 联系 */
export const send = $('#blog_nav_contact').attr('href') ?? '';
/* 订阅 */
export const rss = `${blogDomain}/${blogApp}/rss/`;
/* 管理 */
export const admin = 'https://i.cnblogs.com/';

/** 我的随笔 */
export const myPostLink = `${blogDomain}/${blogApp}/p`;
/** 我的评论 */
export const myCommentLink = `${blogDomain}/${blogApp}/MyComments.html`;
/** 我的参与 */
export const myOtherLink = `${blogDomain}/${blogApp}/OtherPosts.html`;
/** 最新评论 */
export const commentLink = `${blogDomain}/${blogApp}/comments`;

/** 粉丝 */
export const followsLink = `https://home.cnblogs.com/u/${blogApp}/relation/followers`;
/** 关注 */
export const followingLink = `https://home.cnblogs.com/u/${blogApp}/relation/following`;

/* 收藏 */
export const appWz = 'https://wz.cnblogs.com/';

/* 博问 */
export const appQ = 'https://q.cnblogs.com/';

/* 闪存 */
export const appIng = 'https://ing.cnblogs.com/';

/* 小组 */
export const appGroup = 'https://group.cnblogs.com/';

/* 消息 */
export const message = 'https://msg.cnblogs.com/';

/**
 * 关注
 */
export const getBlogUserGuid = () => {
  const guid = window.cb_blogUserGuid;
  if (guid) {
    return guid;
  } else {
    return $('#p_b_follow>a').attr('onclick')?.slice(8, -2) ?? '';
  }
};

/** 关注 */
export const follow = function (blogUserGuid: string) {
  return new Promise<string>((resolve, reject) => {
    if (!window.isLogined) {
      window.account.login();
      reject('未登录');
      return;
    }
    if (window.c_has_follwed) {
      SkDialog.info({
        content: '你已经关注过该博主！'
      });
      reject('你已经关注过该博主！');
      return;
    }
    blogUserGuid || (blogUserGuid = window.cb_blogUserGuid);
    SkMessage.info('正在提交...');
    $.ajax({
      url: window.getAjaxBaseUrl() + 'Follow/FollowBlogger.aspx',
      data: '{"blogUserGuid":"' + blogUserGuid + '"}',
      dataType: 'text',
      type: 'post',
      contentType: 'application/json; charset=utf-8',
      success: function (data) {
        if (data == '未登录') {
          window.account.login();
          reject('未登录');
        } else {
          window.c_has_follwed = true;
          SkMessage.success('关注成功');
          resolve('关注成功');
          $('.follower-count').each(function (index, element) {
            $(element).html(parseInt($(element).html()) + 1 + '');
          });
          window.followByGroup(blogUserGuid, !0);
        }
      },
      error: function (xhr) {
        xhr.status > 0 && SkMessage.warning('发生错误！麻烦反馈至contact@cnblogs.com');
        reject('发生错误！麻烦反馈至contact@cnblogs.com');
      }
    });
  });
};

/**
 * 取消关注
 */
export const unfollow = (blogUserGuid: string) => {
  return new Promise<string>((resolve, reject) => {
    SkDialog.success({
      title: '取消关注',
      content: '您确定要取消关注吗？',
      okText: '不关注了',
      cancelText: '再考虑一下'
    }).then(res => {
      SkMessage.info('正在提交...');
      $.ajax({
        url: window.getAjaxBaseUrl() + 'Follow/RemoveFollow.aspx',
        data: '{"blogUserGuid":"' + blogUserGuid + '"}',
        dataType: 'text',
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
          if (data == '未登录') {
            window.account.login();
            reject('未登录');
          } else {
            SkMessage.success('取消成功');
            $('.follower-count').each(function (index, element) {
              $(element).html(parseInt($(element).html()) - 1 + '');
            });
            resolve('取消成功');
          }
        },
        error: function (xhr) {
          xhr.status > 0 && SkMessage.warning('发生错误！麻烦反馈至 contact@cnblogs.com');
          reject('发生错误！麻烦反馈至 contact@cnblogs.com');
        }
      });
    });
  });
};

interface VoteParam {
  postId: number;
  voteType: 'Digg' | 'Bury';
  /** 是否撤回 */
  isAbandoned?: boolean;
}

/**
 * 推荐博文
 * @param postId 文章ID
 * @param voteType 操作类型：Digg - 推荐；Bury - 反对
 * @param isAbandoned 是否撤回
 * @returns
 */
export const votePost = (postId: number, voteType: 'Digg' | 'Bury', isAbandoned?: boolean) => {
  return new Promise<VoteParam>((resolve, reject) => {
    if (!postId) {
      SkMessage.warning('推荐出错误！postId不正确');
      reject();
    }
    isAbandoned || (isAbandoned = !1);
    const ajaxParam: VoteParam = {
      postId: +postId,
      voteType: voteType,
      isAbandoned: isAbandoned
    };
    SkMessage.info('提交中...');
    $.ajax({
      url: window.getAjaxBaseUrl() + 'vote/blogpost',
      type: 'post',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(ajaxParam),
      headers: {
        RequestVerificationToken: $('#antiforgery_token').val() as string
      },
      success: function (data: any) {
        if (data.isSuccess) {
          const res: VoteParam = {
            postId: +postId,
            voteType: voteType,
            isAbandoned: isAbandoned
          };
          SkMessage.success(data.message);
          resolve(res);
        } else {
          SkMessage.warning(data.message);
        }
        // TODO: 优化推荐机制，达到可取消
        // 一篇文章，不能同时支持和反对
        // 作者，不能支持和反对自己的文章
        /** Digg
         * 1. 推荐 - isAbandoned: false (已推荐，重复推荐或反对)
         * isSuccess: false; message: 您已支持过
         * 2. 推荐 - isAbandoned: false (首次推荐)
         * isSuccess: true; message: 支持成功
         * 3. 取消推荐 - isAbandoned: true
         * isSuccess: true; message: 取消支持成功
         * 4. 取消推荐 - isAbandoned: true (已取消过)
         * isSuccess: false; message: 您已取消过！
         * 5. 作者点击推荐或取消推荐
         * isSuccess: false; message: 不能推荐自己的内容
         */
        /** Bury
         * 1. 反对 - isAbandoned: false (已反对，重复反对或推荐)
         * isSuccess: false; message: 您已反对过
         * 2. 反对 - isAbandoned: false (首次反对)
         * isSuccess: true; message: 反对成功
         * 3. 取消反对 - isAbandoned: true
         * isSuccess: true; message: 取消反对成功
         * 4. 取消反对 - isAbandoned: true (已取消过)
         * isSuccess: false; message: 您已取消过！
         * 5. 作者点击反对或取消反对
         * isSuccess: false; message: 不能反对自己的内容
         */
      },
      error: function (xhr: any, textStatus: string) {
        xhr.status > 0 &&
          (xhr.status === 500
            ? SkMessage.warning('抱歉！发生了错误！麻烦反馈至contact@cnblogs.com')
            : xhr.stack === 429
            ? SkMessage.warning('抱歉，提交过于频繁，请稍后再试')
            : (SkMessage.error('抱歉，发生了错误，请尝试刷新页面！'),
              console.log('点赞失败，' + xhr.status + ', textStatus' + textStatus)));
        reject();
      }
    });
  });
};

/**
 * 判断是否已经关注
 * @returns {boolean} 是否已经关注
 */
export function getFollowState() {
  return window.c_has_follwed;
}

/**
 * 判断是否开启公告
 * @returns {boolean} 是否开启公告
 */
export const openNews = () => !!$('#profile_block').length;

/**
 * 获取粉丝数
 * @returns {number} 粉丝数
 */
export function getFollowers() {
  const count = openNews() ? $('#profile_block a:nth-of-type(3)').text().trim() : '未知';
  return count;
}

/**
 * 获取关注的人数
 * @returns {number} 关注的人数
 */
export function getFollowing() {
  const count = openNews() ? $('#profile_block a:nth-of-type(4)').text().trim() : '未知';
  return count;
}

/**
 * 获取园龄
 * @returns {string} 园龄
 */
export function getBlogAge() {
  return openNews() ? $('#profile_block a:nth-of-type(2)').text().trim() : '未知';
}

/** 获取个人信息 */
export function getProfile() {
  const name = window.themeConfig.name || blogName();
  const sign = window.themeConfig.sign || '暂无签名~';
  return {
    name,
    sign,
    msgs: [
      { name: '随笔', count: '**', url: myPostLink, stats: 'post' },
      { name: '园龄', count: getBlogAge() },
      { name: '粉丝', count: getFollowers(), url: followsLink }
    ]
  } as Profile;
}

/**
 * 获取消息数
 * @returns {(string|undefined)} 消息数
 */
export function getMessageCount() {
  return $('#msg_count').text();
}

/**
 * 获取随笔数量
 * @returns {string} 随笔数量
 */
export function getPostCount() {
  return $('#stats_post_count')
    .text()
    .trim()
    .replace(/[^0-9]/gi, '');
}

/**
 * 获取文章数量
 * @returns {string} 文章数量
 */
export function getArticleCount() {
  return $('#stats_article_count')
    .text()
    .trim()
    .replace(/[^0-9]/gi, '');
}

/**
 * 获取评论数量
 * @returns {string} 评论数量
 */
export function getCommentCount() {
  return $('#stats-comment_count')
    .text()
    .trim()
    .replace(/[^0-9]/gi, '');
}

/**
 * 获取博客访问总量
 * @returns {string} 博客访问总量
 */
export function getViewCount() {
  return $('#stats-total-view-count>span').text().trim();
}

/**
 * 判断文章是否打开了评论
 * @returns {boolean} 文章是否打开了评论
 */
export const isCommentTurnedOn = () => !!$('#tbCommentBody').length;

/**
 * 判断是否打开文章档案页
 * @returns
 */
export const isArchiveTurnedOn = () => !!$('#sidebar_postarchive').length;

/** 实体类名为 entrylistItem */
export const isEntryPage = () => !!$('.entrylistItem').length;

/** 实体类名为 day */
export const isPostDayPage = () => !!$('.day').length;

/**
 * 判断是否为随笔详情页
 * @returns {boolean} 是否为随笔详情页
 */
export function isPostDetailsPage() {
  // return !!$('#post_detail').length;
  return /^\/.+\/p\/.+/.test(location.pathname);
}

/**
 * 是否为首页
 * @returns {boolean} 是否为首页
 */
export function isHomePage() {
  // return !!$('.day').length;
  return /^\/[^\/]+$/.test(location.pathname);
}

/**
 * 判断是否为随笔分类页
 * @returns {boolean} 是否为随笔分类页
 */
export function isCatesPage() {
  // return !!$('.entrylistItem').length;
  return /^\/.+\/post-categories\/?/.test(location.pathname) || isCateDetailPage();
}

export function isCatePage() {
  // return !!$('.entrylistItem').length;
  return /^\/.+\/post-categories\/?/.test(location.pathname);
}

/**
 * 判断是否为随笔分类详情页
 * @returns {boolean} 是否为随笔分类页
 */
export function isCateDetailPage() {
  // return !!$('.entrylistItem').length;
  return /^\/.+\/category\/.+\.html$/.test(location.pathname);
}

/**
 * 判断是否为档案页
 * @returns {boolean} 是否为档案页
 */
export function isArchivePage() {
  // return !!$('.entrylistItem').length;
  return /\/archive\/?/.test(location.pathname);
}

/**
 * 判断是否为档案页-日期
 * @returns {boolean} 是否为档案页
 */
export function isArchiveDayPage() {
  // return !!$('.entrylistItem').length;
  return /\/archive(\/[0-9]+?){3}/.test(location.pathname);
}

/**
 * 判断是否为档案页-月
 * @returns {boolean} 是否为档案页
 */
export function isArchiveMonthPage() {
  // return !!$('.entrylistItem').length;
  return /\/archive(\/[0-9]+?){2}/.test(location.pathname);
}

/**
 * 判断是否为合集页
 * @returns {boolean} 是否为合集页
 */
export function isCollectionsPage() {
  // return !!$('.entrylistItem').length;
  return /\/collections\/?/.test(location.pathname);
}

/**
 * 判断是否为友链页
 * @returns {boolean} 是否为友链页
 */
export function isFLinksPage() {
  return /\/FLinks\/?/.test(location.pathname);
}

/**
 * 判断是否为打赏页
 * @returns {boolean} 是否为打赏页
 */
export function isRewardPage() {
  return /\/Reward\/?/.test(location.pathname);
}

/**
 * 自定义功能页
 */
export function isCustomPage() {
  return isFLinksPage() || isRewardPage();
}

/**
 * 判断是否为评论页
 * @returns {boolean} 是否为最新评论页
 */
export function isCommentsPage() {
  return /^\/.+\/comments\/?$/.test(location.pathname);
}

/**
 * 判断是否为随笔页
 * @returns {boolean} 是否为随笔页
 */
export function isPostPage() {
  return /^\/.+\/p\/?$/.test(location.pathname);
}

/**
 * 判断是否为排行榜页
 * @returns {boolean} 是否为排行榜页
 */
export function isRankPage() {
  return /^\/.+\/most-(viewed|commented|liked)\/?/.test(location.pathname);
}

/**
 * 判断是否为排行榜页
 * @returns {boolean} 是否为排行榜页
 */
export function isRankViewPage() {
  return /^\/.+\/most-viewed\/?/.test(location.pathname);
}

/**
 * 判断是否为排行榜页
 * @returns {boolean} 是否为排行榜页
 */
export function isRankCommentPage() {
  return /^\/.+\/most-commented\/?/.test(location.pathname);
}

/**
 * 判断是否为排行榜页
 * @returns {boolean} 是否为排行榜页
 */
export function isRankLikePage() {
  return /^\/.+\/most-liked\/?/.test(location.pathname);
}

/**
 * 是否为标签列表页
 * @returns {boolean} 是否为标签列表页
 */
export function isTagsPage(flag: boolean = false) {
  // return !!$('#taglist_main').length;
  if (flag) return /^\/.+\/tag\/?/.test(location.pathname);
  else return /^\/.+\/tag\/?$/.test(location.pathname);
}

/**
 * 是否为标签详情页
 * @returns {boolean} 是否为标签详情页
 */
export function isTagDetailPage() {
  // return !!$('#taglist_main').length;
  return /^\/.+\/tag\/.+/.test(location.pathname);
}

/**
 * 是否为文章详情页
 * @returns {boolean} 是否为文章详情页
 */
export function isArticleDetailPage() {
  return /^\/.+\/articles\/.+/.test(location.pathname);
}

export function isPADetailPage() {
  return /^\/.+\/(p|articles)\/((?!archive).)+/.test(location.pathname) && !isCustomPage();
}

/**
 * 判断是否为相册页
 * @returns {boolean} 是否为相册页
 */
export function isGalleryPage() {
  // return !!$('.gallery').length;
  return /^\/.+\/gallery\/.+/.test(location.pathname);
}

/**
 * 判断是否为相册详情页
 * @returns {boolean} 是否为相册页
 */
export function isGalleryDetailPage() {
  // return !!$('.gallery').length;
  return /^\/.+\/gallery\/image\/.+/.test(location.pathname);
}

/** 获取博客状态 */
export const getBlogStats = () => {
  return new Promise<BlogStats>((resolve, reject) => {
    $.ajax({
      url: window.getAjaxBaseUrl() + 'blog-stats',
      type: 'get',
      dataType: 'text',
      timeout: 1e3,
      success: function (data) {
        data && $('#blog_stats_place_holder').replaceWith(data);
        const ex = /随笔.+?(\d+)[\s\S]+文章.+?(\d+)[\s\S]+评论.+?(\d+)[\s\S]+阅读.+?(\d+)/.exec(data);
        if (ex) {
          resolve({
            post: ex[1],
            article: ex[2],
            comment: ex[3],
            read: ex[4]
          });
        } else {
          reject();
        }
      },
      error: function () {
        reject();
      }
    });
  });
};
