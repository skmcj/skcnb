import './index.scss';
import { SkMessage } from '@/utils/MessageUtil';
import { defaultAvatar } from '@/utils/cnblogUtil';
import { useUserAvatar } from '@/plugins/User';
import { _dts } from '@/utils/domUtil';

interface CommentPageParam {
  postId: number;
  pageIndex?: number;
  anchorCommentId: number;
  isDesc: boolean;
  order: number;
  loadCommentBox: boolean;
}

interface CommentAction {
  text: string;
  value: string;
}

interface Comment {
  postId: number;
  id: number;
  content: string;
  date: string;
  /** 楼层 */
  layer: number;
  /** 评论者 */
  author: string;
  homeUrl: string;
  diggCount: number;
  buryCount: number;
  avatar: string;
  /** 操作 */
  actions: CommentAction[];
  /** 是否楼主 */
  isLz?: boolean;
}

interface CommentBlock {
  count: number;
  comments: Comment[];
  pager: string;
  form?: string;
}

interface CommentOther {
  maxId: number;
  maxDate: string;
}

type VoteType = 'Digg' | 'Bury';

// 暂未设计：当没有评论时，用svg插画显示
const nothingCommentsCover = '';

/**
 * 重新设计封装了相关评论API
 * 用于替换自带的commentManager
 */

/** 提取评论数据 */
class CommentExtract {
  private idRegs;
  constructor() {
    this.idRegs = [/comment_anchor_(\d+)/, /a_comment_author_(\d+)/, /comment_body_(\d+)/, /comment_(\d+)_avatar/];
  }

  /**
   * 提取
   */
  public extract(cms: string) {
    const comment: Comment = {
      postId: this.getPostId(cms),
      id: this.getId(cms),
      content: this.getBody(cms),
      date: this.getDate(cms),
      layer: this.getLayer(cms),
      author: this.getAuthor(cms),
      homeUrl: this.getHomeUrl(cms),
      diggCount: this.getDiggCount(cms),
      buryCount: this.getBuryCount(cms),
      avatar: this.getAvatar(cms),
      isLz: this.getLz(cms),
      actions: this.getActions(cms)
    };
    return comment;
  }

  /** 提取分页器 */
  public extractPager(cms: string) {
    const exec = /<div id="comment_pager_bottom">([\s\S]+?<\/div>)\s*?<\/div>/.exec(cms);
    return exec ? exec[1].trim() : '';
  }

  /** 提取其它信息 */
  public extractOther(cms: string) {
    return {
      maxId: this.getMaxId(cms),
      maxDate: this.getMaxDate(cms)
    } as CommentOther;
  }

  /** 获取评论数量 */
  public getCommentCount() {
    return $('#post_comment_count').html();
  }

  /** 获取评论ID */
  private getId(cms: string) {
    let id = 0;
    for (let i = 0; i < this.idRegs.length; i++) {
      const exec = this.idRegs[i].exec(cms);
      if (exec) {
        id = parseInt(exec[1]);
        break;
      }
    }
    return id;
  }

  /** 获取文章ID */
  private getPostId(cms: string) {
    const exec = /DelComment\(\d+, this,'(\d+)'\)/.exec(cms);
    return exec ? parseInt(exec[1]) : 0;
  }

  /** 获取评论体 */
  private getBody(cms: string) {
    const exec = /<div id="comment_body_\d+"[\s\S]*?>([\s\S]+?)<\/div>\s*<div class="comment_vote">/.exec(cms);
    return exec ? exec[1].trim() : '';
  }

  /** 获取日期 */
  private getDate(cms: string) {
    const exec = /<span class="comment_date">(.+)<\/span>/.exec(cms);
    return exec ? exec[1].trim() : '';
  }

  /** 获取操作函数 */
  private getActionFunc(act: string) {
    let func = '';
    switch (act) {
      case '修改':
        func = 'commentManager.getCommentBody';
        break;
      case '回复':
        func = 'commentManager.replyComment';
        break;
      case '引用':
        func = 'commentManager.quoteComment';
        break;
      case '删除':
        func = 'commentManager.delComment';
        break;
    }
    return func;
  }

  /** 获取操作列表 */
  private getActions(cms: string) {
    const actions: CommentAction[] = [];
    const actExec = /<span class="comment_actions">([\s\S]+?)<\/span>/.exec(cms);
    if (actExec) {
      const actStr = actExec[1];
      const acts = actStr.match(/<a[\s\S]+?<\/a>/g);
      if (acts) {
        for (const act of acts) {
          const temp = /<a\s*?href=".+?"\s*?onclick="[\s\S]+?\((.+?)\)">([\s\S]+?)<\/a>/.exec(act);
          if (!temp) continue;
          if (!temp[2]) continue;
          actions.push({
            text: temp[2].trim(),
            value: `return ${this.getActionFunc(temp[2].trim())}(${temp[1].trim()})`
          });
        }
      }
    }
    return actions;
  }

  /** 获取作者 */
  private getAuthor(cms: string) {
    const exec = /<a id="a_comment_author_\d+?"[\s\S]*?>([\s\S]+?)<\/a>/.exec(cms);
    return exec ? exec[1].trim() : '';
  }

  /** 获取头像 */
  private getAvatar(cms: string) {
    const exec = /<span id="comment_\d+_avatar" style=".+">([\s\S]+?)<\/span>/.exec(cms);
    return exec ? exec[1].trim() : defaultAvatar;
  }

  /** 获取评论者主页地址 */
  private getHomeUrl(cms: string) {
    const exec = /<a id="a_comment_author_\d+"[\s\S]*?href="(.+?)"[\s\S]+?>/.exec(cms);
    return exec ? exec[1].trim() : location.href;
  }

  /** 获取楼主 */
  private getLz(cms: string) {
    const exec = /louzhu/.exec(cms);
    return exec ? true : false;
  }

  /** 获取楼层 */
  private getLayer(cms: string) {
    const exec = /#(\d+)楼/.exec(cms);
    return exec ? parseInt(exec[1]) : -1;
  }

  /** 获取支持数 */
  private getDiggCount(cms: string) {
    const exec = /支持\(?(\d+)\)?/.exec(cms);
    return exec ? parseInt(exec[1]) : 0;
  }

  /** 获取反对数 */
  private getBuryCount(cms: string) {
    const exec = /反对\(?(\d+)\)?/.exec(cms);
    return exec ? parseInt(exec[1]) : 0;
  }

  /** 获取最大ID */
  private getMaxId(cms: string) {
    const exec = /comment-maxId[\s\S]*?>([\s\S]+?)</.exec(cms);
    return exec ? parseInt(exec[1].trim()) : 0;
  }

  /** 获取最大Date */
  private getMaxDate(cms: string) {
    const exec = /comment-maxDate[\s\S]*?>([\s\S]+?)</.exec(cms);
    return exec ? exec[1].trim() : '';
  }
}

/** 渲染器 */
class CommentRenderer {
  private dom: HTMLElement | null;

  private titDom: HTMLElement | null;

  private cmsDom: HTMLElement | null;

  private pgDom: HTMLElement | null;

  private initFlag: boolean;

  constructor() {
    this.dom = null;
    this.titDom = null;
    this.cmsDom = null;
    this.pgDom = null;
    this.initFlag = false;
  }

  /** 初始化 */
  public initRenderer() {
    this.initCommentDOM();
    this.dom = _dts.getElById('blog-comments-placeholder');
    let content = '';
    if (this.dom) {
      content = this.dom.innerHTML;
      this.dom.textContent = '';
      this.titDom = this.createBox('sk-comment-title');
      this.cmsDom = this.createBox('sk-comments');
      this.pgDom = this.createBox('sk-comment-pager', 'comment_pager');
      this.dom.appendChild(this.titDom);
      this.dom.appendChild(this.cmsDom);
      this.dom.appendChild(this.pgDom);
      this.initFlag = true;
    }
    return content;
  }

  private initCommentDOM() {
    // 评论信息
    const commentsDom = _dts.getElById('blog-comments-placeholder');
    const commentFormDom = _dts.getElById('comment_form');
    commentsDom && commentFormDom && commentsDom.parentElement?.insertBefore(commentFormDom, commentsDom);
    // 输入框
    if (!window.isLogined) {
      // 未登录
    } else {
      if (this.isCommentTurnedOn()) {
        this.showCommentForm();
      } else {
        const commentInput = _dts.getElById('comment_form_container');
        if (commentInput) {
          commentInput.textContent = '';
          const tip = _dts.ctSpan('', 'sk-comment-noallow');
          tip.appendChild(_dts.ctIcon('ib-tip-1'));
          tip.appendChild(_dts.ctSpan('评论功能已被禁用'));
          commentInput.appendChild(tip);
        }
      }
    }
  }

  private showCommentForm() {
    const commentInput = _dts.getElById('comment_form_container');
    if (commentInput) {
      commentInput.insertBefore(this.createAvatar(void 0, true), commentInput.firstChild);
    }
    const commentText = _dts.getElById('tbCommentBody');
    commentText && commentText.setAttribute('placeholder', '说出你的想法');
    // 工具
    const editBtn = _dts.getElById('btn_edit_comment');
    editBtn && (editBtn.innerText = '');
    const previewBtn = _dts.getElById('btn_preview_comment');
    previewBtn && (previewBtn.innerText = '');
    // 移动提交按钮
    const ctextarea = _dts.getElByCls('comment_textarea');
    if (ctextarea.length > 0) {
      const ct = ctextarea[0];
      const submit = _dts.getElById('commentbox_opt');
      submit && ct.appendChild(submit);
      submit && submit.insertBefore(this.createTip('ib-tip-3', '支持Markdown语法'), submit.firstChild);
    }
    // 取消修改按钮
    $('#span_comment_canceledit a').attr('onclick', 'return commentManager.cancelCommentEdit()');
    $('.commentbox_footer').remove();
  }

  /** 是否可以评论 */
  private isCommentTurnedOn() {
    if (allowComments !== void 0) return allowComments;
    else return _dts.getElById('tbCommentBody') ? true : false;
  }

  /** 重置 */
  public reset() {
    if (this.initFlag) {
      this.cmsDom && (this.cmsDom.textContent = '');
      this.pgDom && (this.pgDom.textContent = '');
    } else {
      this.initRenderer();
    }
  }

  /** 渲染评论条 */
  public drawComment(data: Comment) {
    if (this.cmsDom) {
      this.cmsDom.appendChild(this.createComment(data));
    }
  }

  /** 渲染评论列表 */
  public drawComments(cms: Comment[]) {
    if (this.cmsDom) {
      if (cms.length > 0) {
        this.titDom && (this.titDom.style.display = 'flex');
        for (const cm of cms) {
          this.cmsDom.appendChild(this.createComment(cm));
        }
      } else {
        this.titDom && (this.titDom.style.display = 'none');
        this.cmsDom.appendChild(this.createNothingTip());
      }
    }
  }

  /** 渲染标题栏 */
  public drawTitle(count?: number | string) {
    if (this.titDom) {
      this.titDom.textContent = '';
      const title = _dts.ctSpan(void 0, 'title');
      if (count) {
        title.appendChild(_dts.ctText('已有评论'));
        title.appendChild(this.createSpan(`${count}`, 'post_comment_count', 'comment_count'));
        title.appendChild(_dts.ctText('条'));
      } else {
        title.innerText = '评论列表';
      }
      const tools = this.createBox('sk-comment-sort');
      tools.appendChild(this.createSpan('默认', 'comment-sort-item', 'comment_sort_default'));
      tools.appendChild(this.createSpan('按时间', 'comment-sort-item active', 'comment_sort_time'));
      tools.appendChild(this.createSpan('按推荐', 'comment-sort-item', 'comment_sort_digg'));
      tools.appendChild(this.createIcon('ib-up-num', 'comment_sort_icon'));
      this.titDom.appendChild(title);
      this.titDom.appendChild(tools);
    }
  }

  /** 渲染分页器 */
  public drawPager(pgs?: string) {
    if (this.pgDom) {
      if (pgs) $(this.pgDom).append(pgs);
    }
  }

  private createNothingTip() {
    const box = this.createBox('nothing-comments');
    box.appendChild(this.createSpan('这里还是一片荒漠(｡•́︿•̀｡)'));
    return box;
  }

  /** 创建评论 */
  private createComment(data: Comment) {
    const comment = this.createBox('sk-comment', `${data.id}`);
    // 头像
    const left = this.createBox('sk-comment-left');
    left.appendChild(this.createAvatar(data.avatar));
    left.appendChild(this.createSpan(`#${data.layer}楼`, 'layer'));
    // 主要内容
    const main = this.createBox('sk-comment-main');
    // - 昵称
    const author = this.createBox('sk-comment-author');
    author.appendChild(this.createLink(data.homeUrl, data.author, 'author', `comment_author_${data.id}`, true));
    data.isLz && author.appendChild(this.createSpan('up', 'sk-comment-label'));
    // - 评论内容
    const content = this.createBox('sk-comment-body cnblogs-markdown', `comment_body_${data.id}`);
    $(content).append(data.content);
    // - 底部信息：日期、支持、反对、修改、删除、回复、引用
    const footer = this.createBox('sk-comment-footer');
    footer.appendChild(this.createSpan(data.date, 'date'));
    const vote = this.createBox('sk-comment-vote');
    vote.appendChild(this.createVote(data.diggCount, data.id, 'Digg'));
    vote.appendChild(this.createVote(data.buryCount, data.id, 'Bury'));
    footer.appendChild(vote);
    const actions = this.createBox('sk-comment-actions');
    for (const act of data.actions) {
      const action = this.createLink('javascript:void(0);', act.text);
      action.setAttribute('onclick', act.value);
      actions.appendChild(action);
    }
    footer.appendChild(actions);
    main.appendChild(author);
    main.appendChild(content);
    main.appendChild(footer);
    comment.appendChild(left);
    comment.appendChild(main);
    return comment;
  }

  /** 创建支持|反对按钮 */
  private createVote(count: number, commentId: number, voteType: 'Digg' | 'Bury') {
    const vote = this.createLink(
      'javascript:void(0);',
      '',
      `vote-${voteType.toLocaleLowerCase()}`,
      `comment_vote_${voteType.toLocaleLowerCase()}_${commentId}`
    );
    vote.setAttribute('title', voteType === 'Bury' ? '反对' : '支持');
    vote.setAttribute(
      'onclick',
      `return commentManager.voteComment(${commentId}, '${voteType}', this.parentElement, false);`
    );
    vote.appendChild(this.createIcon('ib-digg'));
    vote.appendChild(
      this.createSpan(`${count}`, 'vote-count', `comment_${voteType.toLocaleLowerCase()}_count_${commentId}`)
    );
    return vote;
  }

  /** 创建span标签 */
  private createSpan(text: string, cls?: string, id?: string, title?: string) {
    const span = _dts.ctSpan(text, cls, id);
    title && span.setAttribute('title', title);
    return span;
  }

  /** 创建icon图标 */
  private createIcon(cls?: string, id?: string, title?: string) {
    const i = _dts.ctIcon(cls, id);
    title && i.setAttribute('title', title);
    return i;
  }

  /** 创建头像 */
  private createAvatar(url?: string, isUser: boolean = false) {
    const avatar = this.createBox('sk-comment-avatar');
    const img = _dts.ctImg();
    if (isUser) {
      useUserAvatar(img);
    } else {
      img.setAttribute('src', url || defaultAvatar);
    }
    avatar.appendChild(img);
    return avatar;
  }

  /** 创建链接 */
  private createLink(url: string, text: string, cls?: string, id?: string, bk?: boolean) {
    const link = _dts.ctLink(url, cls, id);
    bk && link.setAttribute('target', '_blank');
    link.innerText = text;
    return link;
  }

  /** 创建盒子 */
  private createBox(cls?: string, id?: string) {
    const div = _dts.ctBox(cls, id);
    return div;
  }

  /** 创建提示 */
  private createTip(icon: string, text: string) {
    const tip = this.createBox('sk-comment-tip');
    tip.appendChild(this.createIcon(icon));
    tip.appendChild(this.createSpan(text, 'content'));
    return tip;
  }
}

// 魔改官方 blogCommentManager
/** 自定义评论管理器 */
export class CommentManager {
  private isCommentBoxLoaed;

  // 评论处理器
  private deal;
  // 评论渲染器
  private draw;
  // 当前页码
  private currentPage;
  // 页量
  private pageSize: number | undefined;

  private maxId;
  private maxDate;

  constructor() {
    this.isCommentBoxLoaed = false;
    this.currentPage = 0;
    this.pageSize = void 0;
    this.maxId = 0;
    this.maxDate = '';
    this.deal = new CommentExtract();
    this.draw = new CommentRenderer();
  }

  private getCurrentPage() {
    return this.currentPage;
  }

  /** 初始化评论列表 */
  initComments() {
    const comments = this.draw.initRenderer();
    this.draw.drawTitle(this.deal.getCommentCount());
    this.drawComments(this.dealComments(comments));
    this.draw.drawPager(this.deal.extractPager(comments));
    this.bindListener();
  }

  /** 显示评论输入框 */
  showCommentForm() {}

  /**
   * 获取评论数据
   * @param pageIndex 页码, 0-n
   * @param pageSize 每页数量
   * @param commentId 评论ID
   * @returns
   */
  getComments(pageIndex: number, pageSize?: number, commentId?: number) {
    let isScrollToCommentAnchor, anchorCommentId;
    this.currentPage = pageIndex;
    isScrollToCommentAnchor = !1;
    anchorCommentId = 0;
    typeof commentId != 'undefined' && ((anchorCommentId = commentId), (isScrollToCommentAnchor = !0));
    isScrollToCommentAnchor ||
      pageIndex !== 0 ||
      this.getFromHash('anchor') === undefined ||
      ((isScrollToCommentAnchor = !0), (anchorCommentId = this.getFromHash('anchor')));
    pageIndex > 0 && (this.addToHash('anchor', '!comments'), _dts.getElById('!comments')?.scrollIntoView());
    let isDesc = this.getFromHash('desc') === 'true',
      order = +this.getFromHash('order'),
      ajaxParam: CommentPageParam = {
        postId: window.cb_entryId,
        pageIndex: pageIndex,
        anchorCommentId: anchorCommentId,
        isDesc: isDesc,
        order: order,
        loadCommentBox: !this.isCommentBoxLoaed
      };
    pageIndex || delete ajaxParam.pageIndex;
    // $('#blog-comments-placeholder').html(
    //   '<div style="color:green;margin:50px;font-weight:normal;">努力加载评论中...</div>'
    // );
    const manager = this;
    return new Promise<CommentBlock>((resolve, reject) => {
      $.ajax({
        url: window.getAjaxBaseUrl() + 'comments-block',
        data: ajaxParam,
        type: 'get',
        timeout: 1e4,
        dataType: 'json',
        success: function (data) {
          resolve({
            count: data.commentCount as number,
            comments: manager.dealComments(data.comments),
            pager: manager.deal.extractPager(data.comments),
            form: data.commentForm
          });
          // data.commentCount && data.comments ? showComments(data.comments) : $('#blog-comments-placeholder').html('');
          // manager.isCommentBoxLoaed !== !0 &&
          //   data.commentForm &&
          //   (manager.showCommentForm(data.commentForm), (manager.isCommentBoxLoaed = !0));
        },
        error: function (data) {
          // data.status > 0 && $('#blog-comments-placeholder').html('抱歉！发生了错误！麻烦反馈至contact@cnblogs.com');
          SkMessage.warning('抱歉！发生了错误！麻烦反馈至contact@cnblogs.com');
          reject();
        }
      });
    });
  }

  /**
   * 处理评论
   * @param comments 带有评论数据的HTML字符串
   */
  dealComments(comments: string) {
    const cms: Comment[] = [];
    if (comments) {
      this.dealOther(comments);
      const reg = /<div class="feedbackItem">([\s\S]+?<\/div>)\s*<\/div>/g;
      let domStrs = comments.match(reg);
      if (domStrs) {
        for (const item of domStrs) {
          cms.push(this.deal.extract(item));
        }
      }
    }
    return cms;
  }

  /** 处理其它信息 */
  dealOther(comments: string) {
    const temp = this.deal.extractOther(comments);
    this.maxId = temp.maxId;
    this.maxDate = temp.maxDate;
  }

  /**
   * 渲染评论
   * @param comments
   */
  drawComments(comments: Comment[]) {
    this.draw.drawComments(comments);
    markdown_highlight('#blog-comments-placeholder');
    cb_mathjax_render('blog-comments-placeholder');
    zoomManager.apply('.sk-comment-body img');
    initCodeBlockToolbar($('#blog-comments-placeholder')[0]);
  }

  /**
   * 刷新评论
   * @param pageIndex 页码, 0-n
   * @param pageSize 每页数量
   * @param commentId 评论ID
   */
  renderComments(pageIndex: number, pageSize?: number, commentId?: number) {
    // 获取评论
    this.getComments(pageIndex, pageSize, commentId)
      .then(res => {
        $('#comment_count').html(`${res.count}`);
        const dom = _dts.getElById('blog-comments-placeholder');
        if (dom) {
          this.draw.reset();
          this.drawComments(res.comments);
          this.draw.drawPager(res.pager);
          this.bindListener();
        }
      })
      .catch(err => {});
    // 渲染
  }

  /** 提交评论 */
  postComment() {
    $('#btn_comment_submit').val() == '修改评论' && $('#comment_edit_id').html() != ''
      ? this.updateComment().catch(e => {})
      : this.addComment().catch(e => {});
  }

  /** 添加评论 */
  addComment() {
    const manager = this;
    return new Promise<string>((resolve, reject) => {
      const content = manager.getCommentContent();
      if (!content) {
        SkMessage.info('请输入评论内容！');
        reject();
        return;
      }
      if (content.length > 4e3) {
        SkMessage.warning('评论内容过长，超过4000个字数限制！当前长度：' + content.length);
        reject();
        return;
      }
      if (window.cb_entryId <= 0) {
        SkMessage.warning('postId不正确');
        reject();
        return;
      }
      SkMessage.info('评论提交中...');
      $('#btn_comment_submit').attr('disabled', 'disabled');
      const comment: any = {};
      comment.postId = window.cb_entryId;
      comment.body = content;
      const parentCommentId = $('#span_parentcomment_id').text();
      comment.parentCommentId = /(\d)/.test(parentCommentId) ? parseInt(parentCommentId, 10) : 0;
      $.ajax({
        url: window.getAjaxBaseUrl() + 'PostComment/Add.aspx',
        data: JSON.stringify(comment),
        type: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        headers: {
          RequestVerificationToken: $('#antiforgery_token').val() as string
        },
        timeout: 3e4,
        success: function (data) {
          if (data) {
            /**
             * data 结构
             *  - duration: string
             *  - isSuccess: boolean
             *  - message: string (HTML)
             */
            if (data.isSuccess) {
              SkMessage.success('评论成功');
              $('#tbCommentBody').val('');
              $('#btn_edit_comment').trigger('click');
              commentEditor.removeComment();
              // markdown_highlight('#divCommentShow');
              // cb_mathjax_render('divCommentShow');
              // zoomManager.apply('#divCommentShow img');
              manager.resetCommentBox();
              manager.renderComments(manager.getCurrentPage());
              resolve(data.message);
            } else {
              if (data.message) {
                SkMessage.info(data.message);
              } else {
                SkMessage.warning('抱歉，评论提交失败！麻烦反馈至 contact@cnblogs.com');
              }
              reject();
            }
          } else {
            SkMessage.warning('未知错误');
            reject();
          }
          $('#btn_comment_submit').removeAttr('disabled');
        },
        error: function (xhr, textStatus) {
          if (xhr.status === 500) {
            SkMessage.warning('抱歉，发生了错误！麻烦反馈至 contact@cnblogs.com');
          } else if (xhr.status === 429) {
            SkMessage.warning('抱歉，提交过于频繁，请稍后再试');
          } else if (xhr.status > 0) {
            SkMessage.warning('抱歉，评论提交失败，请尝试刷新页面！');
            console.log('评论提交失败，错误码：' + xhr.status + ' 错误信息：' + xhr.responseText);
          } else {
            SkMessage.warning('抱歉，评论提交失败！xhr.status: ' + xhr.status + ', textStatus: ' + textStatus);
          }
          $('#btn_comment_submit').removeAttr('disabled');
          reject();
        }
      });
    });
  }

  /** 修改评论 */
  updateComment() {
    return new Promise<string>((resolve, reject) => {
      const comment: any = {};
      comment.commentId = parseInt($('#comment_edit_id').html());
      comment.body = $('#tbCommentBody').val();
      $.ajax({
        url: window.getAjaxBaseUrl() + 'PostComment/Update.aspx',
        data: JSON.stringify(comment),
        type: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        headers: {
          RequestVerificationToken: $('#antiforgery_token').val() as string
        },
        success: function (data) {
          if (data) {
            if (data.isSuccess) {
              SkMessage.success('修改成功');
              $('#comment_body_' + comment.commentId).html(data.message);
              this.resetCommentBox();
              commentEditor.removeComment();
              markdown_highlight('#comment_body_' + comment.commentId);
              resolve(data.message);
            } else {
              SkMessage.info(data.message);
              reject();
            }
          } else {
            SkMessage.warning('抱歉！评论修改失败！请与管理员联系(contact@cnblogs.com)');
            reject();
          }
        },
        error: function (xhr, textStatus) {
          if (xhr.status === 500) {
            SkMessage.warning('抱歉！评论修改失败！请联系管理员 contact@cnblogs.com');
          } else {
            SkMessage.warning('抱歉！评论修改失败！请尝试刷新页面');
            console.log('抱歉，评论提交失败！xhr.status: ' + xhr.status + ', textStatus: ' + textStatus);
          }
          reject();
        }
      });
    });
  }

  /** 删除评论 */
  delComment(id: number, element?: HTMLElement, parentId?: number | string) {
    // console.log('delComment: ', id, element, parentId);
    if (confirm('确认要删除该评论吗?')) {
      const currentId = id;
      const currentEl = element;
      const manager = this;
      $.ajax({
        url: window.getAjaxBaseUrl() + 'comment/DeleteComment.aspx',
        type: 'post',
        data: JSON.stringify({
          commentId: currentId,
          pageIndex: manager.getCurrentPage(),
          parentId: parentId ? +parentId : void 0
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        timeout: 1e4,
        headers: {
          RequestVerificationToken: $('#antiforgery_token').val() as string
        },
        success: function (data) {
          if (data) {
            SkMessage.success('删除成功');
            $(`#${currentId}`).remove();
            // 刷新评论
            manager.renderComments(manager.getCurrentPage());
          } else {
            SkMessage.error('删除失败');
          }
        },
        error: function () {
          // $(currentDelElement).html('删除失败！');
          SkMessage.error('删除失败');
        }
      });
    }
    return false;
  }

  /** 引用评论 */
  quoteComment(commentId: number, replyTo: string) {
    // console.log(`quoteComment: ${commentId}, ${replyTo}`);
    $('#span_parentcomment_id').html(`${commentId}`);
    $('#span_comment_replyto').html(replyTo);
    this.reqCommentBody(commentId)
      .then(res => {
        let author, lines, toQuote;
        if (res) {
          author = $(`#comment_author_${commentId}`).text().trim();
          res.length > 300 && (res = res.substring(0, 300) + '...');
          lines = res.split('\n');
          toQuote = '@' + author + '\n';
          for (let i = 0; i < lines.length; i++) toQuote += '> ' + lines[i].trim() + '\n';
          $('#comment_edit_id').html(`${commentId}`);
          $('#tbCommentBody').trigger('focus');
          $('#tbCommentBody').val(toQuote + '-----\n');
        }
      })
      .catch(err => {
        SkMessage.error('引用内容获取失败');
      });
    return false;
  }

  /** 回复评论 */
  replyComment(commentId: number, replyTo: string) {
    // console.log(`replyComment: ${commentId}, ${replyTo}`);
    let author = $(`#comment_author_${commentId}`).text().trim();
    $('#tbCommentBody')
      .trigger('focus')
      .val('@' + author + '\n' + $('#tbCommentBody').val());
    $('#span_parentcomment_id').html(`${commentId}`);
    replyTo.length > 0 && $('#span_comment_replyto').html(replyTo);
    return false;
  }

  /**
   * 支持|反对评论
   * @param commentId 评论ID
   * @param voteType 操作类型
   * @param voteDom 按钮DOM
   * @param isAbandoned 是否取消
   */
  voteComment(commentId: number, voteType: VoteType, voteDom: HTMLElement, isAbandoned: boolean) {
    // console.log(`voteComment: ${commentId}, ${voteType}, ${voteDom}, ${isAbandoned}`);
    if (commentId) {
      isAbandoned || (isAbandoned = false);
      const param = {
        postId: window.cb_entryId,
        commentId: +commentId,
        voteType: voteType,
        isAbandoned: isAbandoned
      };
      const manager = this;
      $.ajax({
        url: window.getAjaxBaseUrl() + 'vote/comment',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(param),
        headers: {
          RequestVerificationToken: $('#antiforgery_token').val() as string
        },
        success: function (data) {
          if (data.isSuccess) {
            // 操作成功
            manager.changeVoteCount(commentId, voteType, isAbandoned);
            manager.changeVoteTitle(commentId, voteType, !isAbandoned);
          } else {
            if (data.message && data.message.indexOf('System.') < 0) {
              SkMessage.warning(data.message);
            } else {
              SkMessage.error('抱歉！发生了错误！麻烦反馈至contact@cnblogs.com');
            }
            if (data.id) {
              if (data.id === 1) {
                // 1 - 已经支持过
                manager.changeVoteTitle(commentId, 'Digg', true);
              } else if (data.id === 2) {
                // 2 - 已经反对过
                manager.changeVoteTitle(commentId, 'Bury', true);
              } else {
                // 0 - 已经取消过
                manager.changeVoteTitle(commentId, voteType, false);
              }
            }
          }
        },
        error: function (xhr, errorTextStatus) {
          if (xhr.status > 0) {
            if (xhr.status === 500) {
              SkMessage.error('抱歉！发生了错误！麻烦反馈至contact@cnblogs.com');
            } else if (xhr.status === 429) {
              SkMessage.error('歉，提交过于频繁，请稍后再试');
            } else {
              SkMessage.error('抱歉！发生了错误！请刷新页面后重试');
              console.log(xhr.status + ', errorTestStatus' + errorTextStatus);
            }
          }
        }
      });
    } else {
      SkMessage.warning('操作出错，commentId不正确');
    }
    return false;
  }

  /** 获取评论内容 */
  getCommentBody(commentId: number) {
    // console.log(`getCommentBody: ${commentId}`);
    this.reqCommentBody(commentId)
      .then(res => {
        $('#tbCommentBody').trigger('focus');
        $('#tbCommentBody').val(res);
        $('#btn_comment_submit').val('修改评论');
        $('#span_comment_canceledit').css('display', 'inline');
      })
      .catch(err => {
        SkMessage.error('评论内容获取失败');
      });
    return false;
  }

  /** 取消修改 */
  cancelCommentEdit() {
    confirm('确认取消修改吗？') && this.resetCommentBox();
  }

  /** 请求评论内容 */
  reqCommentBody(commentId: number) {
    return new Promise<string>((resolve, reject) => {
      $.ajax({
        url: window.getAjaxBaseUrl() + 'comment/GetCommentBody.aspx',
        type: 'post',
        data: JSON.stringify({
          commentId: commentId
        }),
        dataType: 'text',
        contentType: 'application/json; charset=utf-8',
        timeout: 1e4,
        success: function (data) {
          if (data) resolve(data);
          else reject(data);
        },
        error: function (data) {
          reject(data);
        }
      });
    });
  }

  /** 绑定事件 */
  bindListener() {
    const manager = this;
    window.addEventListener('load', () => {
      this.changeSortActive();
      // 默认排序
      $('#comment_sort_default').on('click', function () {
        history.replaceState('', '', location.pathname + '#!comments');
        manager.removeFromHash('order');
        manager.renderSortComment();
        $('#comment_sort_default').addClass('active');
      });
      // 按时间
      $('#comment_sort_time').on('click', function () {
        manager.addToHash('order', 0);
        const flag = $('#comment_sort_time').hasClass('active');
        manager.renderSortComment(flag);
      });
      // 按支持数
      $('#comment_sort_digg').on('click', function () {
        manager.addToHash('order', 1);
        const flag = $('#comment_sort_digg').hasClass('active');
        manager.renderSortComment(flag);
      });
      // 升序降序
      $('#comment_sort_icon').on('click', function () {
        manager.renderSortComment(true);
      });
    });
  }

  /** 渲染排序评论列表 */
  renderSortComment(flag?: boolean) {
    // 是否降序
    const isDesc = this.getFromHash('desc') === 'true';
    if (flag) {
      this.addToHash('desc', !isDesc);
    }
    this.renderComments(1, this.pageSize);
    this.changeSortActive();
  }

  /** 更改 排序工具 样式 */
  changeSortActive() {
    const order = this.getFromHash('order');
    const isDesc = this.getFromHash('desc') === 'true';
    $('.comment-sort-item').removeClass('active');
    if (order === '0') {
      $('#comment_sort_time').addClass('active');
    } else if (order === '1') {
      $('#comment_sort_digg').addClass('active');
    } else {
      $('#comment_sort_default').addClass('active');
    }
    if (isDesc) {
      $('#comment_sort_icon').attr('class', 'ib-down-num');
      $('#comment_sort_icon').attr('title', '降序');
    } else {
      $('#comment_sort_icon').attr('class', 'ib-up-num');
      $('#comment_sort_icon').attr('title', '升序');
    }
  }

  /** 改变 CommentVote 数量 */
  changeVoteCount(commentId: number, voteType: VoteType, isAbandoned: boolean) {
    const countId = `comment_${voteType.toLocaleLowerCase()}_count_${commentId}`;
    const countDom = _dts.getElById(countId);
    if (countDom) {
      let count = countDom.innerText || '0';
      isAbandoned ? (countDom.innerText = `${parseInt(count) - 1}`) : (countDom.innerText = `${parseInt(count) + 1}`);
    }
  }

  /** 改变 CommentVote 标题 */
  changeVoteTitle(commentId: number, voteType: VoteType, flag?: boolean) {
    const voteId = `comment_vote_${voteType.toLocaleLowerCase()}_${commentId}`;
    const voteDom = _dts.getElById(voteId);
    if (voteDom) {
      if (flag) {
        voteDom.classList.add('active');
        voteDom.setAttribute('title', `取消${voteType === 'Bury' ? '反对' : '支持'}`);
        voteDom.setAttribute(
          'onclick',
          `return commentManager.voteComment(${commentId}, '${voteType}', this.parentElement, true)`
        );
      } else {
        voteDom.classList.remove('active');
        voteDom.setAttribute('title', `${voteType === 'Bury' ? '反对' : '支持'}`);
        voteDom.setAttribute(
          'onclick',
          `return commentManager.voteComment(${commentId}, '${voteType}', this.parentElement, false)`
        );
      }
    }
  }

  /**
   * 获取评论输入内容
   * @returns 输入内容
   */
  getCommentContent() {
    const dom = _dts.getElById('tbCommentBody') as HTMLTextAreaElement;
    return dom ? dom.value.trim() : '';
  }

  /** 重置评论输入框 */
  resetCommentBox() {
    $('#btn_comment_submit').val('提交评论');
    $('#comment_edit_id').html('');
    $('#tbCommentBody').val('').show();
    $('#tbCommentBodyPreview').hide();
    $('#span_comment_canceledit').css('display', 'none');
  }

  buildHashMap() {
    let hashTable, map, i;
    if (!location.hash) return new Map();
    for (
      hashTable = location.hash
        .substring(1)
        .split('&')
        .map(function (item) {
          var arr = item.split('=');
          return arr.length === 1 ? ['anchor', arr[0]] : [arr[0], arr[1]];
        }),
        map = new Map(),
        i = 0;
      i < hashTable.length;
      i++
    )
      map.set(hashTable[i][0], hashTable[i][1]);
    return map;
  }
  getFromHash(key: string) {
    let map = this.buildHashMap();
    return map.get(key);
  }
  applyHashMap(map: Map<string, any>) {
    location.hash =
      '#' +
      [...map]
        .map(function (item) {
          return item[0] === 'anchor' ? item[1] : item[0] + '=' + item[1];
        })
        .join('&');
  }
  addToHash(key: string, value: any) {
    let map = this.buildHashMap();
    map.set(key, value);
    this.applyHashMap(map);
  }
  removeFromHash(key: string) {
    let map = this.buildHashMap();
    map.delete(key);
    this.applyHashMap(map);
  }
}

// 添加评论
// 刷新评论
// 删除评论
// 修改

// 回复
