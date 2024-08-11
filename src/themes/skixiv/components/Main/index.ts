import './index.scss';
import createCards from '../Card';
import createCateList from '../CateList';
import buildArticle from '../Article';
import buildPostLists from '../PostLists';
import buildTag from '../Tag';
import buildFLinks from '../FLinks';
import createBtMess from '../BtMess';
import createFooter from '../Footer';
import {
  isHomePage,
  isCateDetailPage,
  isCatePage,
  isPADetailPage,
  isRankPage,
  isTagsPage,
  isTagDetailPage,
  isCommentsPage,
  isArchivePage,
  isFLinksPage,
  isGalleryPage,
  isGalleryDetailPage,
  isCollectionsPage,
  isRewardPage,
  isPostDayPage,
  isEntryPage,
  isPostPage
} from '@/utils/cnblogUtil';
import { setCover, setBrand, coverFlag, brandFlag } from '../../hook/useBrand';
import { _dts } from '@/utils/domUtil';
import { createGallery, createGalleryDetail } from '../Gallery';
import buildReward from '../Reward';

/** 清理文档流 */
const clearFlow = () => {
  if (isPostDayPage()) $('.day').remove();
  if (isEntryPage()) {
    $('.entrylist').remove();
    $('.entrylistTitle').remove();
    $('entrylistDescription').remove();
  }
  if (isCatePage()) {
    $('.category-block-list').remove();
  }
  if (isGalleryPage() || isGalleryDetailPage()) {
    $('.gallery').remove();
  }
};

// 初始化文档流
const initFlow = () => {
  if (isHomePage()) {
    $('#homepage_top_pager').remove();
  }
  if (
    isCateDetailPage() ||
    isRankPage() ||
    isTagDetailPage() ||
    isCommentsPage() ||
    isCollectionsPage() ||
    isPostPage()
  ) {
    if ($('.pager').length >= 2) {
      $('.pager:first').remove();
    }
  }
};

/**
 * 创建
 */
const buildMain = () => {
  const forFlow = _dts.getElByCls<'div'>('forFlow');
  if (forFlow.length <= 0) return;
  const main = forFlow[0] as HTMLDivElement;
  main.classList.add('sk-main');
  // main.style.display = 'none';
  initFlow();
  if (isHomePage() || isCateDetailPage() || isArchivePage() || isCollectionsPage()) {
    // 文章列表
    const cards = createCards();
    main.insertBefore(cards, main.firstChild);
  } else if (isCatePage()) {
    // 类别页
    // setBrand({ title: '分类' });
    const cateList = createCateList();
    main.insertBefore(cateList, main.firstChild);
  } else if (isPADetailPage()) {
    // 文章页
    buildArticle();
  } else if (isRankPage() || isTagDetailPage() || isCommentsPage() || isPostPage()) {
    // 排行榜
    buildPostLists();
  } else if (isTagsPage()) {
    // 标签
    buildTag();
  } else if (isFLinksPage()) {
    // 友链
    buildFLinks();
  } else if (isRewardPage()) {
    // 打赏页
    buildReward();
  } else if (isGalleryPage() && !isGalleryDetailPage()) {
    // 相册页
    const gallery = createGallery();
    main.appendChild(gallery);
  } else if (isGalleryDetailPage()) {
    // 相册详情页
    const detail = createGalleryDetail();
    main.appendChild(detail);
  }
  if (!brandFlag()) {
    setBrand();
  }
  if (!coverFlag()) {
    setCover();
  }
  const btMess = createBtMess();
  main.appendChild(btMess);
  const footer = createFooter();
  main.appendChild(footer);
  clearFlow();
  // main.style.display = 'block';
};

export default buildMain;
