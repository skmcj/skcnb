import './index.scss';
import { bindCover } from '../../hook/useBrand';
import { _dts } from '@/utils/domUtil';

/**
 * <div id="sk-cover" class="fix">
 *     <img src="${imgUrl}" alt="header-cover" />
 * </div>
 */

/**
 * 创建封面
 */
const createCover = () => {
  const cover = _dts.ctBox('sk-cover');
  const img = _dts.ctImg();
  img.setAttribute('alt', 'cover');
  cover.appendChild(img);
  bindCover(img);
  return cover;
};

export default createCover;
