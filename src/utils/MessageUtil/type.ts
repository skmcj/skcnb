/** 消息容器 */
export interface MessageNodes {
  /** 父容器 */
  parent: HTMLDivElement | null;
  /** 消息数量 */
  count: number;
}

/** 消息类型 */
export type MessagesType = 'info' | 'success' | 'warning' | 'error' | 'help' | 'none';

/** 消息定位 */
export type MessagePosType = 'left' | 'center' | 'right';

/** 消息配置 */
export interface MessageOptions {
  /** 消息类型 */
  type?: MessagesType;
  /** 消息内容 */
  content: string;
  /** 关闭延时，0为不自动关闭 */
  duration?: number;
  /** 是否可关闭 */
  closeable?: boolean;
  pos?: MessagePosType;
  /** 自定义图标 */
  icon?: string;
  /** 自定义类 */
  class?: string;
  /** 关闭回调 */
  onClose?: () => void;
}

export interface DialogOptions {
  /** 类型 */
  type?: MessagesType;
  /** 标题 */
  title?: string;
  /** 提示内容 */
  content: string;
  /** 自定义类 */
  class?: string;
  /** 是否展示遮罩 */
  mask?: boolean;
  /** 是否有底部按钮 */
  footer?: boolean;
  /** 是否关闭后自动销毁 */
  destroy?: boolean;
  /** 是否可关闭 */
  closeable?: boolean;
  /** 确定文本 */
  okText?: string;
  /** 取消文本 */
  cancelText?: string;
  /** 确定回调 */
  onOk?: Function;
  /** 取消回调 */
  onCancel?: Function;
  /** 关闭后 */
  afterClose?: Function;
}

export type DialogBtnType = 'confirm' | 'cancel';

/** 对话框操作工具 */
export interface DialogInstance {
  options: DialogOptions;
  resolve: (e: DialogPromiseProps) => void;
  reject: (e: DialogPromiseProps) => void;
}
export interface DialogPromiseProps {
  event: MouseEvent;
  dom: HTMLElement | null;
  action: DialogBtnType;
}
/** 对话框创建结果 */
export interface DialogInstanceResult {
  show: () => Promise<DialogPromiseProps>;
  close: () => void;
}
