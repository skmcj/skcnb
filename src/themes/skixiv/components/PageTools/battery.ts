import { _dts } from '@/utils/domUtil';
import useScroll from '../../hook/useScroll';

const scrollBattery = (inner: HTMLDivElement, label: HTMLSpanElement) => {
  const bindScrollBattery = () => {
    // 距顶部
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 可视区高度
    let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    // 滚动条总高度
    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    let total = scrollHeight - clientHeight;
    const pb = Math.round((scrollTop / total) * 100);
    inner.style.transform = `translateY(${100 - pb}%)`;
    inner.style.filter = `hue-rotate(${100 - pb}deg)`;
    label.innerText = `${pb}%`;
  };
  bindScrollBattery();
  useScroll(bindScrollBattery);
};

/** 创建电池百分比组件 */
const createBattery = () => {
  const battery = _dts.ctBox('sk-battery');
  // 电极
  const pole = _dts.ctBox('pole');
  // 主体
  const container = _dts.ctBox('battery-container');
  // 内部构造
  const inner = _dts.ctBox('battery-inner');
  for (let i = 0; i < 3; i++) {
    // 波浪
    const wave = _dts.ctBox('g-wave');
    inner.appendChild(wave);
  }
  // 标签
  const label = _dts.ctSpan('0%', 'label');
  window.addEventListener('load', () => {
    scrollBattery(inner, label);
  });
  container.appendChild(inner);
  container.appendChild(label);
  battery.appendChild(pole);
  battery.appendChild(container);
  return battery;
};

export default createBattery;
