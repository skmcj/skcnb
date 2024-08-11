import './index.scss';
import createAvatar from './Avatar';
import createProfile from './Profile';
import useScroll from '../../hook/useScroll';
import { createCatalog } from '../../hook/useCatalog';
import { createArchive } from '../../hook/useArchive';
import { getProfile, isPADetailPage, isArchiveTurnedOn } from '@/utils/cnblogUtil';
import { getNavList, getToolList, type NavItem } from '../../hook/useNavList';
import { isPhone, lockScorll, cancelLockScorll } from '@/utils/commonUtil';
import { _dts } from '@/utils/domUtil';

let fixFlag = false;

/** 绑定滚动 */
const bindSilderScroll = (silder: HTMLDivElement) => {
  const mainContent = _dts.getElById('mainContent');
  if (!mainContent) return;
  const top = mainContent.getBoundingClientRect().top;
  if (fixFlag) {
    if (top > 0) {
      silder.classList.remove('fixed');
      fixFlag = false;
    }
  } else {
    if (top < 0) {
      silder.classList.add('fixed');
      fixFlag = true;
    }
  }
};

/** 创建底部工具栏 */
const createBottomTool = () => {
  const tools = _dts.ctBox('sk-silder-tools');
  const list = getToolList();
  for (const item of list) {
    const link = _dts.ctLink(item.url);
    link.setAttribute('title', item.name);
    link.setAttribute('target', '_blank');
    const tool = _dts.ctBox('sk-silder-tool');
    const icon = _dts.ctIcon(item.icon);
    if (item.color) icon.style.color = item.color;
    tool.appendChild(icon);
    link.appendChild(tool);
    tools.appendChild(link);
  }
  return tools;
};

/** 创建显隐控制按钮 */
const createControl = () => {
  const btn = _dts.ctBox('sk-silder-control');
  const icon = _dts.ctIcon('ib-user');
  btn.appendChild(icon);
  return btn;
};

const createCloseBtn = () => {
  const btn = _dts.ctBox('close-btn');
  const icon = _dts.ctIcon('ib-close');
  btn.appendChild(icon);
  return btn;
};

/** 创建侧边导航项 */
const createNavItem = (data: NavItem) => {
  /**
   * <div class="sk-silder-nav-item">
   *   <a class="sk-silder-nav-link">
   *     <i class="${icon}"></i>
   *     <span class="text">${name}</span>
   *   </a>
   * </div>
   */
  const item = _dts.ctBox('sk-silder-nav-item');
  if (data.checked) item.classList.add('checked');
  const link = _dts.ctLink(data.url, 'sk-silder-nav-link');
  link.setAttribute('title', data.text);
  const icon = _dts.ctIcon(data.icon);
  const name = _dts.ctSpan(data.text, 'text');
  link.appendChild(icon);
  link.appendChild(name);
  item.appendChild(link);
  return item;
};

/** 侧边导航 */
const createNav = () => {
  const nav = _dts.ctNav('sk-silder-nav');
  const list = getNavList();
  for (const item of list) {
    const navItem = createNavItem(item);
    nav.appendChild(navItem);
  }
  return nav;
};

/** 创建tab */
interface TabDict {
  site: TabItem;
  catalog: TabItem;
  archive: TabItem;
  [key: string]: TabItem;
}
type TabId = 'site' | 'catalog' | 'archive';
interface TabItem {
  id: TabId;
  name: string;
  icon: string;
  checked: boolean;
  created: boolean;
  dom?: HTMLDivElement;
  target?: HTMLDivElement;
}
const tabDict: TabDict = {
  site: {
    id: 'site',
    name: '站点概览',
    icon: 'ib-user',
    checked: true,
    created: true
  },
  archive: {
    id: 'archive',
    name: '文章归档',
    icon: 'ib-series',
    checked: false,
    created: false
  },
  catalog: {
    id: 'catalog',
    name: '文章目录',
    icon: 'ib-catalog',
    checked: false,
    created: false
  }
};
// 选择Tab
const checkTab = (id: TabId) => {
  for (const key in tabDict) {
    if (tabDict[key].dom) {
      if (key !== id) {
        tabDict[key].dom?.classList.remove('active');
        tabDict[key].checked = false;
        tabDict[key].target?.classList.add('hide');
      } else {
        tabDict[key].dom?.classList.add('active');
        tabDict[key].checked = true;
        tabDict[key].target?.classList.remove('hide');
      }
    }
  }
};
const createTab = (item: TabItem) => {
  const tab = _dts.ctBox('sk-silder-tab');
  if (item.checked) {
    tab.classList.add('active');
  }
  tab.setAttribute('data-id', item.id);
  const icon = _dts.ctIcon(item.icon);
  const text = _dts.ctSpan(item.name);
  tab.appendChild(icon);
  tab.appendChild(text);
  return tab;
};
const createSilderTab = () => {
  const tabs = _dts.ctBox('sk-silder-tabs');
  for (const key in tabDict) {
    if (!tabDict[key].created) continue;
    const tab = createTab(tabDict[key]);
    tabs.appendChild(tab);
    tab.addEventListener('click', e => {
      if (e.currentTarget) {
        const id = (e.currentTarget as HTMLDivElement).dataset['id'] as TabId;
        if (!id) return;
        if (tabDict[id].checked) return;
        checkTab(id);
      }
    });
    tabDict[key].dom = tab;
  }
  return tabs;
};

// 创建目录
const createCataList = () => {
  const content = _dts.ctBox('catalog sk-silder-content hide');
  const cata = createCatalog();
  content.appendChild(cata);
  return content;
};
// 创建归档
const createArchiveList = () => {
  const content = _dts.ctBox('archive sk-silder-content hide');
  const archive = createArchive();
  content.appendChild(archive);
  return content;
};
// 创建站长信息
const createSite = () => {
  const content = _dts.ctBox('site sk-silder-content');
  const avatar = createAvatar();
  const profileData = getProfile();
  const profile = createProfile(profileData);
  const nav = createNav();
  content.appendChild(avatar);
  content.appendChild(profile);
  content.appendChild(nav);
  return content;
};

/**
 * 创建侧边栏
 */
const createLeftSilder = () => {
  const leftsilder = _dts.ctBox('sk-silder');
  const inner = _dts.ctBox('sk-silder-inner');

  // 绑定滚动
  if (!isPhone()) {
    // window.addEventListener('scroll', () => {
    //   bindSilderScroll(leftsilder);
    // });
    useScroll(
      () => {
        bindSilderScroll(leftsilder);
      },
      { mode: 0 }
    );
  } else {
    leftsilder.classList.add('pkg', 'hide');
    leftsilder.style.display = 'none';
    const control = createControl();
    // 创建控制按钮
    const show = () => {
      // 导航显示
      leftsilder.classList.remove('hide');
      leftsilder.classList.add('show');
      leftsilder.style.display = 'flex';

      // 按钮隐藏
      control.classList.remove('show');
      control.classList.add('hide');
      setTimeout(() => {
        control.style.display = 'none';
      }, 280);
      lockScorll();
    };
    const hide = () => {
      // 导航隐藏
      leftsilder.classList.add('hide');
      leftsilder.classList.remove('show');

      cancelLockScorll();
      setTimeout(() => {
        leftsilder.style.display = 'none';
      }, 280);
      // 按钮显示
      control.classList.remove('hide');
      control.classList.add('show');
      control.style.display = 'flex';
    };
    control.addEventListener('click', () => {
      show();
    });
    document.body.appendChild(control);
    // 关闭按钮
    const closeBtn = createCloseBtn();
    closeBtn.addEventListener('click', () => {
      hide();
    });
    leftsilder.appendChild(closeBtn);
  }
  // 创建站点信息
  const site = createSite();
  tabDict['site'].target = site;
  inner.appendChild(site);
  // 创建归档信息
  if (isArchiveTurnedOn()) {
    const archive = createArchiveList();
    tabDict['archive'].target = archive;
    tabDict['archive'].created = true;
    inner.appendChild(archive);
  }
  // 创建目录信息
  if (isPADetailPage()) {
    const catalog = createCataList();
    tabDict['catalog'].target = catalog;
    tabDict['catalog'].created = true;
    inner.appendChild(catalog);
  }
  const tabs = createSilderTab();
  // 初始化
  if (isPADetailPage()) {
    checkTab('catalog');
  }
  // 创建工具
  const tools = createBottomTool();
  leftsilder.appendChild(tabs);
  leftsilder.appendChild(inner);
  leftsilder.appendChild(tools);
  return leftsilder;
};

export default createLeftSilder;
