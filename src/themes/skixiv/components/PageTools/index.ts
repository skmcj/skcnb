import './index.scss';
import createBattery from './battery';
import useScroll from '../../hook/useScroll';
import { _dts } from '@/utils/domUtil';
import { initTheme, setTheme } from '@/utils/themeUtil';

/** 创建工具按钮 */
const createToolBtn = (icon: string, title?: string, url?: string) => {
  const btn = _dts.ctBox('sk-pagetool');
  const i = _dts.ctIcon(icon);
  if (url) {
    const link = _dts.ctLink(url);
    link.appendChild(i);
    btn.appendChild(link);
  } else btn.appendChild(i);
  if (title) {
    btn.setAttribute('title', title);
  }
  return btn;
};

const createScrollTop = () => {
  const btn = createToolBtn('ib-top', '返回顶部', '#top');
  const topDot = _dts.getEl('a[name="top"]');
  !topDot &&
    btn.addEventListener('click', () => {
      $('html, body').animate({ scrollTop: 0 }, 300);
    });
  return btn;
};

const createChangeTheme = () => {
  const btn = _dts.ctBox('sk-pagetool');
  const i = _dts.ctIcon('ib-sun');
  let theme = initTheme();
  i.setAttribute('class', theme === 'dark' ? 'ib-dark' : 'ib-sun');
  btn.appendChild(i);
  btn.setAttribute('title', '切换主题');
  btn.addEventListener('click', function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(theme);
    i.setAttribute('class', theme === 'dark' ? 'ib-dark' : 'ib-sun');
  });
  return btn;
};

const scrollPageTools = (tools: HTMLDivElement) => {
  let toolsVisible = false;
  const main = _dts.getElById('main');
  if (!main) return;
  const bindScrollPageTools = () => {
    const top = main.getBoundingClientRect().top;
    if (top <= 560) {
      if (!toolsVisible) {
        // 显示工具
        tools.classList.add('show');
        toolsVisible = true;
      }
    } else if (top >= 700) {
      if (toolsVisible) {
        tools.classList.remove('show');
        toolsVisible = false;
      }
    }
  };
  useScroll(bindScrollPageTools);
};

/**
 * 创建
 */
const createPageTools = () => {
  const pagetools = _dts.ctBox('sk-pagetools');
  const battery = createBattery();
  const topBtn = createScrollTop();
  const themeBtn = createChangeTheme();
  pagetools.appendChild(battery);
  pagetools.appendChild(themeBtn);
  pagetools.appendChild(topBtn);
  window.addEventListener('load', () => {
    scrollPageTools(pagetools);
  });
  return pagetools;
};

export default createPageTools;
