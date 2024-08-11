interface BusHandle {
  flag: boolean;
  handle: (arg: any) => void;
}

const map = new Map<string, BusHandle[]>();

/** 绑定 */
export const bindBus = (name: string, func: (arg: any) => void, flag: boolean = false, firstRun: boolean = false) => {
  if (map.has(name)) {
    const funs = map.get(name);
    funs?.push({ flag, handle: func });
  } else {
    const funs: BusHandle[] = [];
    funs.push({ flag, handle: func });
    map.set(name, funs);
  }
};

/** 运行 */
export const callBus = (name: string, data: any) => {
  const funs = map.get(name);
  if (funs) {
    const newFuns: BusHandle[] = [];
    for (let i = 0; i < funs.length; i++) {
      funs[i].handle(data);
      if (funs[i].flag) {
        newFuns.push(funs[i]);
      }
    }
    map.set(name, newFuns);
  }
};
