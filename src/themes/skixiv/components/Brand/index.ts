import './index.scss';
import { bindBrand } from '../../hook/useBrand';
import { _dts } from '@/utils/domUtil';

/**
 * <div class="sk-brand">
 *   <span class="title"></span>
 *   <div class="info">
 *     <span class="item"><i class="ib-*"></i>内容</span>
 *   </div>
 * </div>
 */

/**
 * 创建封面牌
 */
const createBrand = () => {
  const brand = _dts.ctBox('sk-brand');
  bindBrand(brand);
  return brand;
};

export default createBrand;
