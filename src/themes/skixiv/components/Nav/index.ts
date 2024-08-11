import './index.scss';
import { getNavList } from '../../hook/useNavList';
import { getBlogTitle } from '@/utils/cnblogUtil';
import { _dts } from '@/utils/domUtil';

/**
 * <nav class="sk-nav-box">
 *   <span class="name">博客名</span>
 *   <div class="nav-list">
 *     <div class="nav-item">
 *       <i class="ib-*"></i>
 *       <span class="text"></span>
 *     </div>
 *   </div>
 * </nav>
 */

/**
 * 创建导航组件
 */
const createNav = () => {
  const nav = _dts.ctBox('sk-nav show');
  const navBox = _dts.ctNav('sk-nav-box');
  // 添加博客名称
  const cbName = getBlogTitle();
  if (cbName) {
    const name = _dts.ctSpan(cbName, 'name');
    navBox.appendChild(name);
  }

  const navList = _dts.ctBox('nav-list');
  const list = getNavList();
  for (const item of list) {
    const navItem = _dts.ctBox('nav-item');
    if (item.checked) navItem.classList.add('checked');
    const icon = _dts.ctIcon(item.icon);
    const text = _dts.ctSpan(item.text, 'text');
    navItem.appendChild(icon);
    navItem.appendChild(text);
    // navItem.addEventListener('click', () => clickedNav(item.name));
    // bindDOM(item.name, navItem);
    // 创建link
    const link = _dts.ctLink(item.url, 'sk-nav-link');
    link.setAttribute('title', item.name);
    link.appendChild(navItem);
    navList.appendChild(link);
    // navList.appendChild(navItem);
  }
  navBox.appendChild(navList);
  nav.appendChild(navBox);
  return nav;
};

export default createNav;
