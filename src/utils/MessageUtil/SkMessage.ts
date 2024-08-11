import { createIcon } from './SkIcon';
import type { MessageOptions, MessageNodes, MessagesType } from './type';

/** 结点表 */
const nodes: MessageNodes = {
  parent: null,
  count: 0
};

/** 默认延时 */
const DURATION = 3000;

/** 销毁延时 */
const DESTROYDURATION = 300;

/** 创建消息主体容器 */
const createMessages = () => {
  // <div class="sk-messages"></div>
  const messages = document.createElement('div');
  messages.classList.add('sk-messages');
  return messages;
};

/** 创建消息体 */
const createMessage = (options: MessageOptions) => {
  // <div class="sk-message">
  //   <div class="sk-message-inner">
  //     <span class="sk-message-icon">
  //       <!-- svg or i -->
  //     </span>
  //     <span class="sk-message-content"></span>
  //     <span class="sk-message-close"></span>
  //   </div>
  // </div>
  const message = document.createElement('div');
  const pos = options.pos || 'right';
  message.classList.add('sk-message', `pos-${pos}`);
  if (options.class) {
    message.classList.add(options.class);
  }
  // 类型
  const tpp = options.type || 'info';
  const inner = document.createElement('div');
  inner.classList.add('sk-message-inner', `sk-message-${tpp}`);
  // 图标
  if (tpp !== 'none') {
    const icon = document.createElement('span');
    icon.classList.add('sk-message-icon');
    if (options.icon) {
      const i = document.createElement('i');
      i.classList.add(options.icon);
      icon.appendChild(i);
    } else {
      const svg = createIcon(tpp);
      icon.appendChild(svg);
    }
    inner.appendChild(icon);
  }
  // 内容
  const content = document.createElement('span');
  content.classList.add('sk-message-content');
  content.innerText = options.content;
  inner.appendChild(content);
  // 关闭按钮
  if (options.closeable || options.duration === 0) {
    const close = document.createElement('span');
    close.classList.add('sk-message-close');
    const svg = createIcon('close');
    close.appendChild(svg);
    close.addEventListener('click', () => {
      destroyMessage(message);
      options.onClose && options.onClose();
    });
    inner.appendChild(close);
  }
  message.appendChild(inner);
  return message;
};

/** 初始化消息 */
const initMessage = () => {
  if (!nodes.parent) {
    nodes.parent = createMessages();
    document.body.appendChild(nodes.parent);
  }
};

/** 销毁消息组件 */
const destroyMessages = () => {
  if (nodes.parent) {
    nodes.parent.classList.add('sk-messages-destroy');
    setTimeout(() => {
      nodes.parent && document.body.removeChild(nodes.parent);
    }, DESTROYDURATION);
  }
};

/** 销毁消息组件 */
const destroyMessage = (message: HTMLDivElement) => {
  message.classList.add('sk-message-destroy');
  setTimeout(() => {
    nodes.parent && nodes.parent.removeChild(message);
  }, DESTROYDURATION);
};

/**
 * info消息
 * @param options
 */
const messageInstance = (options: MessageOptions) => {
  const message = createMessage(options);
  nodes.parent?.appendChild(message);
  nodes.count += 1;
  // 延时，默认3s
  const duration = options.duration == void 0 ? DURATION : options.duration;
  if (duration > 0) {
    setTimeout(() => {
      destroyMessage(message);
      options.onClose && options.onClose();
      nodes.count -= 1;
    }, duration);
  }
};

/** 消息接口 */
const SkMessage = function (options: MessageOptions) {
  initMessage();
  messageInstance(options);
};

/** Info消息 */
SkMessage.info = function (options: MessageOptions | string) {
  initMessage();
  const opt: MessageOptions = {
    content: ''
  };
  if (typeof options === 'string') {
    opt.content = options;
  } else {
    Object.assign(opt, options);
  }
  opt.type = 'info';
  messageInstance(opt);
};
/** Success消息 */
SkMessage.success = function (options: MessageOptions | string) {
  initMessage();
  const opt: MessageOptions = {
    content: ''
  };
  if (typeof options === 'string') {
    opt.content = options;
  } else {
    Object.assign(opt, options);
  }
  opt.type = 'success';
  messageInstance(opt);
};
/** Warning消息 */
SkMessage.warning = function (options: MessageOptions | string) {
  initMessage();
  const opt: MessageOptions = {
    content: ''
  };
  if (typeof options === 'string') {
    opt.content = options;
  } else {
    Object.assign(opt, options);
  }
  opt.type = 'warning';
  messageInstance(opt);
};
/** Error消息 */
SkMessage.error = function (options: MessageOptions | string) {
  initMessage();
  const opt: MessageOptions = {
    content: ''
  };
  if (typeof options === 'string') {
    opt.content = options;
  } else {
    Object.assign(opt, options);
  }
  opt.type = 'error';
  messageInstance(opt);
};
/** Help消息 */
SkMessage.help = function (options: MessageOptions | string) {
  initMessage();
  const opt: MessageOptions = {
    content: ''
  };
  if (typeof options === 'string') {
    opt.content = options;
  } else {
    Object.assign(opt, options);
  }
  opt.type = 'help';
  messageInstance(opt);
};
/** Default消息 */
SkMessage.default = function (options: MessageOptions | string) {
  initMessage();
  const opt: MessageOptions = {
    content: ''
  };
  if (typeof options === 'string') {
    opt.content = options;
  } else {
    Object.assign(opt, options);
  }
  opt.type = 'none';
  messageInstance(opt);
};

/** 消息 */
SkMessage.open = function (text: string, tp?: MessagesType) {
  const options: MessageOptions = {
    content: text
  };
  initMessage();
  options.type = tp || 'info';
  messageInstance(options);
};

/** 销毁 */
SkMessage.destroy = function () {
  destroyMessages();
};

export default SkMessage;
