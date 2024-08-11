import { _dts } from '@/utils/domUtil';
import './index.scss';

/**
 * 创建
 */
const createFooter = () => {
  let footer = _dts.getElById('footer');
  if (!footer) {
    footer = _dts.ctBox('div');
  }
  return footer;
};

export default createFooter;
