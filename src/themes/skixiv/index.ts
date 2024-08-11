import '../../assets/font/skcnbfont-dev.css';
import './style/index.scss';
import createHeader from './components/Header';
import createLeftSilder from './components/LeftSilder';
import buildMain from './components/Main';
import createPageTools from './components/PageTools';
import { initUserInfo } from '@/plugins/User';
import { _dts } from '@/utils/domUtil';
import { showLoading, hideLoading } from '@/utils/loadingUtil';
import { bindLogo } from '@/utils/themeUtil';
import { printThemeInfo } from './log';
import { getDuration } from '../config';

/**
 * 该主题比较追求性能，所以节点构建使用 createElement 和 appendChild ，牺牲了一部分代码可读性
 * 如果需要保证代码可读性，可使用 DOMString 和 append
 */

(function skixiv() {
  showLoading();
  /** 初始化用户(访问我博客的登录用户)信息 */
  initUserInfo();

  // 首页
  const home = _dts.getElById('home');
  const header = createHeader();
  home?.insertBefore(header, home.firstChild);

  const main = _dts.getElById('mainContent');
  const leftSilder = createLeftSilder();
  main?.insertBefore(leftSilder, main.firstChild);

  buildMain();

  bindLogo();

  // 页面工具
  const pageTools = createPageTools();
  document.body.appendChild(pageTools);

  window.addEventListener('load', () => {
    // 页面加载完成
    // 输出主题信息
    printThemeInfo();
    hideLoading(getDuration());
  });
})();
