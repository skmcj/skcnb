import { _dts } from '@/utils/domUtil';
import './index.scss';
import { getCateData, type CateItem } from './tool';

/** 创建类别项 */
const createCateItem = (data: CateItem) => {
  const item = _dts.ctBox('sk-cate-item');
  const inner = _dts.ctBox('sk-cate-item-inner');
  const link = _dts.ctLink(data.url);
  const main = _dts.ctBox('sk-cate-item-content');
  const name = _dts.ctSpan(data.name, 'name');
  main.appendChild(name);
  if (data.count) {
    const count = _dts.ctSpan('', 'count');
    const icon = _dts.ctIcon('ib-lots');
    count.appendChild(icon);
    count.appendChild(_dts.ctText(data.count));
    main.appendChild(count);
  }
  link.appendChild(main);
  inner.appendChild(link);
  item.appendChild(inner);
  return item;
};

/**
 * 创建分类标签
 */
const createCateList = () => {
  const catelist = _dts.ctBox('sk-cate-list');
  const list = getCateData();
  for (const item of list) {
    const cate = createCateItem(item);
    catelist.appendChild(cate);
  }
  return catelist;
};

export default createCateList;
