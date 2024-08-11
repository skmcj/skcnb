import { _dts } from '@/utils/domUtil';
import './index.scss';

/**
 * <div class="sk-waves">
 *   <svg
 *     class="waves-content"
 *     xmlns="http://www.w3.org/2000/svg"
 *     xmlns:xlink="http://www.w3.org/1999/xlink"
 *     viewBox="0 24 150 28"
 *     preserveAspectRatio="none"
 *     shape-rendering="auto">
 *     <defs>
 *       <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
 *     </defs>
 *     <g class="parallax">
 *       <use xlink:href="#gentle-wave" x="48" y="0"></use>
 *       <use xlink:href="#gentle-wave" x="48" y="3"></use>
 *       <use xlink:href="#gentle-wave" x="48" y="5"></use>
 *       <use xlink:href="#gentle-wave" x="48" y="7"></use>
 *     </g>
 *   </svg>
 * </div>
 */

/**
 * 创建波浪组件
 */
const createWave = () => {
  // 波浪外围盒
  const wave = _dts.ctBox('sk-waves');
  // svg
  const svg = _dts.ctSVGSvg('0 24 150 28', 'waves-content', void 0);
  svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('shape-rendering', 'auto');
  const defs = _dts.ctElNs('defs');
  const path = _dts.ctSVGPath(
    'M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z',
    void 0,
    'gentle-wave'
  );
  defs.appendChild(path);
  svg.appendChild(defs);
  const g = _dts.ctElNs('g');
  g.classList.add('parallax');
  for (let i = 1; i <= 4; i++) {
    const use = _dts.ctElNs('use');
    use.setAttribute('href', '#gentle-wave');
    use.setAttribute('x', '48');
    use.setAttribute('y', `${i * 2 - 1}`);
    g.appendChild(use);
  }

  svg.appendChild(g);
  wave.appendChild(svg);

  return wave;
};

export default createWave;
