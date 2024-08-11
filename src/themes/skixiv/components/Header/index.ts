import './index.scss';
import createNav from '../Nav';
import createCover from '../Cover';
import createWave from '../Wave';
import createBrand from '../Brand';
import { isPhone } from '@/utils/commonUtil';
import useScroll from '../../hook/useScroll';
import { _dts } from '@/utils/domUtil';

/**
 * <div id="sk-header">
 *     <Nav class="nav"></Nav>
 *     <div id="sk-cover" class="fix">
 *         <img src="${imgUrl}" alt="header-cover" />
 *     </div>
 *     <div class="sk-brand"></div>
 *     <Wave id="sk-wave"></Wave>
 * </div>
 */

/**
 * 绑定事件
 * @param nv
 * @param cv
 * @param wv
 * @param tv
 */
const bind = (nv: HTMLDivElement, cv: HTMLDivElement, wv: HTMLDivElement, hd: HTMLDivElement, tv: number = 360) => {
  let waveFlag = true;
  let navFlag = true;
  const bindScroll = () => {
    const top = wv.getBoundingClientRect().top;
    if (top > tv) {
      // 加上 fixed
      if (!waveFlag) {
        cv.classList.add('fixed');
        waveFlag = true;
      }
    } else {
      if (waveFlag) {
        cv.classList.remove('fixed');
        waveFlag = false;
      }
    }
    if (top > 82) {
      if (!navFlag) {
        nv.classList.add('show');
        // nv.style.animationName = 'nav-show';
        navFlag = true;
      }
    } else {
      if (navFlag) {
        nv.classList.remove('show');
        // nv.style.animationName = 'nav-hide';
        navFlag = false;
      }
    }
  };
  if (!isPhone()) {
    const temp = wv.offsetTop - tv;
    // const temp = wv.getBoundingClientRect().top - tv;
    cv.style.setProperty('--cv-top', `${Math.round(temp)}px`);
    // window.addEventListener('scroll', bindScroll);
    useScroll(bindScroll, { mode: 0 });
  } else {
    cv.classList.remove('fixed');
  }
};

/**
 * 创建头部组件
 */
const createHeader = () => {
  const header = _dts.ctBox('sk-header');
  const nav = createNav();
  header.appendChild(nav);
  const cover = createCover();
  cover.classList.add('fixed');
  header.appendChild(cover);
  const brand = createBrand();
  header.appendChild(brand);
  const wave = createWave();
  header.appendChild(wave);
  window.addEventListener('load', function () {
    bind(nav, cover, wave, header);
  });
  // bind(cover, wave);
  return header;
};

export default createHeader;
