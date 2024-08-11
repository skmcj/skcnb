import { themeMap } from './themes/config';

/**
 * 加载对应主题
 */

/** 远程加载主题文件 */
const fetchScript = function (url: string, sFunc: Function = function () {}) {
  $.ajax({
    url,
    type: 'GET',
    dataType: 'script',
    cache: !0,
    success: () => sFunc()
  });
};

/**
 * 校验URL
 */
const validateUrl = function (url: string) {
  return /^https?:\/\//.test(url);
};

/**
 * 获取当前文件的请求头
 * @returns
 */
const getCurrentHost = function () {
  // if (!document.currentScript) return '';
  // const src = document.currentScript.getAttribute('src');
  // return src ? src.substring(0, src.lastIndexOf('/')) : '';
  return `https://blog-static.cnblogs.com/files/blogs/${currentBlogId}`;
};

/**
 * 获取主题名
 * @param config
 * @returns
 */
const getThemeName = function (name: string | undefined) {
  // 默认主题
  if (typeof name !== 'string') return themeMap.default;
  return themeMap[name] ?? themeMap.default;
};

/**
 * 获取主题地址
 * @param uri
 * @returns
 */
const getThemeUrl = function (uri: string) {
  if (validateUrl(uri)) return uri;
  return `${getCurrentHost()}/${uri}.js?t=${Date.now()}`;
};

/**
 * 加载
 * @param config 配置
 */
const loader = function (config: ThemeConfig) {
  if (config) {
    window.themeConfig = config;
  }
  let theme = config.theme;
  if (typeof config.theme === 'object') {
    theme = config.theme.name;
  }
  // 加载主题脚本
  fetchScript(getThemeUrl(getThemeName(config.name)));
};

/**
 * 加载主题
 * @param config 配置
 */
const loadingTheme = function (config: ThemeConfig) {
  try {
    loader(config);
  } catch (e) {
    console.warn(`Loading Theme By SkCnb Error: ${e}`);
  }
};

window.loadingTheme = loadingTheme;
