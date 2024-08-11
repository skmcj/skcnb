import './index.scss';

/**
 * 创建
 */
const buildTag = () => {
  $('#taglist td span.small').each(function () {
    let text = this.innerText;
    this.innerText = text.replaceAll(/\(|\)/g, '');
  });
};

export default buildTag;
