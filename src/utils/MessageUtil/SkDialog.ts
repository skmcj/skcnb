import { createIcon } from './SkIcon';
import type { DialogOptions, DialogBtnType, DialogInstance, DialogInstanceResult } from './type';

/** 对话框操作工具表 */
const instanceMap = new WeakMap<HTMLElement, DialogInstance>();

// 关闭延时
const CLOSEDURATION = 500;

/** 创建按钮 */
const createButton = (text: string, parent: HTMLElement, type: DialogBtnType = 'confirm') => {
  // <button class="sk-dialog-btn">
  //   <span>text</span>
  // </button>
  const btn = document.createElement('button');
  btn.classList.add('sk-dialog-btn', `sk-dialog-btn-${type}`);
  const span = document.createElement('span');
  span.innerText = text;
  btn.appendChild(span);
  btn.addEventListener('click', e => {
    const instance = instanceMap.get(parent);
    instance?.options.afterClose && instance?.options.afterClose();

    const dom = instance?.options.destroy ? null : parent;
    if (type === 'confirm') {
      instance?.options.onOk && instance?.options.onOk();
      instance?.resolve({
        dom,
        action: type,
        event: e
      });
    } else {
      instance?.options.onCancel && instance?.options.onCancel();
      instance?.reject({
        dom,
        action: type,
        event: e
      });
    }
  });
  return btn;
};

/** 创建Dialog */
const createDialog = (options: DialogOptions) => {
  // <div class="sk-dialog">
  //   <div class="sk-dialog-mask"></div>
  //   <div class="sk-dialog-main">
  //     <div class="sk-dialog-title"><span class="text">标题</span></div>
  //     <div class="sk-dialog-content">
  //       <span class="sk-dialog-icon"></span>
  //       <span class="text"></span>
  //     </div>
  //     <div class="sk-dialog-footer">
  //       <button class="sk-dialog-btn">取消</button>
  //     </div>
  //   </div>
  // </div>
  const tpp = options.type || 'none';
  const dialog = document.createElement('div');
  dialog.classList.add('sk-dialog');
  if (tpp !== 'none') {
    dialog.classList.add(`sk-dialog-${tpp}`);
  }
  // 遮罩
  if (options.mask !== false) {
    const mask = document.createElement('div');
    mask.classList.add('sk-dialog-mask');
    dialog.appendChild(mask);
  }
  // 主体
  const main = document.createElement('div');
  main.classList.add('sk-dialog-main');
  // 标题
  if (options.title) {
    const title = document.createElement('div');
    title.classList.add('sk-dialog-title');
    const text = document.createElement('span');
    text.classList.add('text');
    text.innerText = options.title;
    title.appendChild(text);
    main.appendChild(title);
  }
  // 内容
  const content = document.createElement('div');
  content.classList.add('sk-dialog-content');
  // 图标
  if (tpp !== 'none') {
    const icon = document.createElement('span');
    icon.classList.add('sk-dialog-icon');
    const svg = createIcon(tpp);
    icon.appendChild(svg);
    content.appendChild(icon);
  }
  const text = document.createElement('span');
  text.classList.add('text');
  text.innerText = options.content;
  content.appendChild(text);
  main.appendChild(content);
  // 按钮组
  if (options.footer === void 0 || options.footer) {
    const footer = document.createElement('div');
    footer.classList.add('sk-dialog-footer');
    const okText = options.okText || '确认';
    const cancelText = options.cancelText || '取消';
    const cancelBtn = createButton(cancelText, dialog, 'cancel');
    const okBtn = createButton(okText, dialog, 'confirm');
    footer.appendChild(cancelBtn);
    footer.appendChild(okBtn);
    main.appendChild(footer);
  }
  dialog.appendChild(main);
  return dialog;
};

/** Dialog生成器 */
const dialogInstance = (options: DialogOptions) => {
  const dialog = createDialog(options);
  dialog.style.display = 'none';
  document.body.appendChild(dialog);
  // 显示
  const show = () => {
    dialog.classList.remove('sk-dialog-close');
    dialog.classList.add('sk-dialog-show');
    document.body.classList.add('lock-scroll');
    dialog.style.display = 'flex';
    return new Promise((resolve, reject) => {
      instanceMap.set(dialog, {
        options,
        resolve,
        reject
      });
    });
  };
  // 关闭
  const close = () => {
    dialog.classList.remove('sk-dialog-show');
    dialog.classList.add('sk-dialog-close');
    document.body.classList.remove('lock-scroll');
    setTimeout(() => {
      if (options.destroy === false) {
        // 隐藏
        dialog.style.display = 'none';
      } else {
        // 销毁
        document.body.removeChild(dialog);
        instanceMap.delete(dialog);
        // console.log('canche', instanceMap.has(dialog));
      }
    }, CLOSEDURATION);
  };
  options.afterClose = close;

  return {
    show,
    close
  } as DialogInstanceResult;
};

const SkDialog = function (options: DialogOptions) {
  const dialog = dialogInstance(options);
  return dialog;
};

/** Info Dialog */
SkDialog.info = (options: DialogOptions) => {
  options.type = 'info';
  const dialog = dialogInstance(options);
  return dialog.show();
};

/** Success Dialog */
SkDialog.success = (options: DialogOptions) => {
  options.type = 'success';
  const dialog = dialogInstance(options);
  return dialog.show();
};

/** Warning Dialog */
SkDialog.warning = (options: DialogOptions) => {
  options.type = 'warning';
  const dialog = dialogInstance(options);
  return dialog.show();
};

/** Error Dialog */
SkDialog.error = (options: DialogOptions) => {
  options.type = 'error';
  const dialog = dialogInstance(options);
  return dialog.show();
};

/** Help Dialog */
SkDialog.help = (options: DialogOptions) => {
  options.type = 'help';
  const dialog = dialogInstance(options);
  return dialog.show();
};

export default SkDialog;
