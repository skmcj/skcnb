import { defaultConfig, themeMap } from '@/themes/config';

const themeCf = window.themeConfig.theme;

/**
 * 博客名称
 */
export const blogName = window.themeConfig.blogName || defaultConfig.blogName;

/** 主题名 */
export const themeName = () => {
  let theme = window.themeConfig.theme;
  if (typeof theme === 'string') theme = themeMap[theme];
  if (typeof theme === 'object') theme = themeMap[theme.name];
  return theme || themeMap.default;
};
