type ThemeType = 'light' | 'dark';

const codeTheme = (theme: ThemeType) => {
  theme === 'dark'
    ? window.highlighter.setTheme(window.darkModeCodeHighlightTheme)
    : window.highlighter.setTheme(window.codeHighlightTheme);
};

const validateTheme = (val?: string) => {
  let theme: ThemeType = 'light';
  if (val && val === 'dark') theme = 'dark';
  else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark';
  }
  return theme;
};

/**
 * 设置主题
 * @param theme light | dark
 */
export const setTheme = (theme: ThemeType) => {
  theme = validateTheme(theme);
  codeTheme(theme);
  document.documentElement.setAttribute('theme', theme);
  localStorage.setItem('themeMode', theme);
  return theme;
};

/**
 * 初始化主题
 */
export const initTheme = () => {
  const storageTheme = localStorage.getItem('themeMode');
  const theme = validateTheme(storageTheme ?? '');
  setTheme(theme);
  return theme;
};

/**
 * 设置logo
 * @param url
 */
export const setLogo = function (url: string) {
  const fav = document.getElementById('favicon');
  if (!fav) {
    console.warn('Unable to set Logo');
    return;
  }
  const exec = /\.(svg|png|ico)/.exec(url);
  if (!exec) {
    console.warn('Logo type not supported');
    return;
  }
  const types: any = {
    svg: 'image/svg+xml',
    png: 'image/png',
    ico: 'image/x-icon'
  };
  fav.setAttribute('href', url);
  fav.setAttribute('type', types[exec[1]]);
};

/** 绑定Logo */
export const bindLogo = function () {
  const logo = window.themeConfig.logo;
  if (!logo) return;
  setLogo(logo);
};
