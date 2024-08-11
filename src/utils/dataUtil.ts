const cover = {
  list: [],
  count: 0
};

const sign = {
  list: [],
  count: 0
};

const defaultCover =
  'https://images.weserv.nl/?url=https://images.cnblogs.com/cnblogs_com/blogs/821083/galleries/2413232/o_240730154349_IPC-1.webp';

const defaultSign = '抽到断水水更流';

const blogId = currentBlogId || 821083;

/**
 * 获取封面列表
 */
const getCoverList = () => {
  return new Promise<number>((resolve, reject) => {
    $.ajax({
      type: 'get',
      url: `https://files.cnblogs.com/files/blogs/${blogId}/coverList.json`,
      dataType: 'jsonp',
      jsonpCallback: 'parseCover',
      success: data => {
        if (data) {
          cover.list = data;
          cover.count = data.length;
          resolve(cover.count ?? 0);
        }
      },
      error: () => {
        reject();
      }
    });
  });
};

/**
 * 从cover列表中取一张
 * @param type
 * @returns
 */
const getCover = (type: ExeractType, count?: number) => {
  if (type === 'random') {
    // 每次请求随机获取一张
    const rad = Math.round(Math.random() * (cover.count - 1));
    return cover.list[rad];
  } else if (type === 'count') {
    const rad = count ? count % cover.count : 0;
    return cover.list[rad];
  } else {
    // 根据日期获取，当天固定
    const rad = Math.round(Date.now() / 86400000) % cover.count;
    return cover.list[rad];
  }
};

/**
 * 随机获取一张Cover
 * @param {'random' | 'daily'} type
 * @returns
 */
export const randomCover = (type: ExeractType = 'daily', count?: number) => {
  return new Promise<string>((resolve, reject) => {
    if (!cover.count) {
      getCoverList()
        .then(() => {
          resolve(getCover(type, count));
        })
        .catch(() => {
          resolve(defaultCover);
        });
    } else {
      resolve(getCover(type, count));
    }
  });
};

/**
 * 获取签名列表
 */
const getSignList = () => {
  return new Promise<number>((resolve, reject) => {
    $.ajax({
      type: 'get',
      url: `https://files.cnblogs.com/files/blogs/${blogId}/signList.json`,
      dataType: 'jsonp',
      jsonpCallback: 'parseSign',
      success: data => {
        if (data) {
          sign.list = data;
          sign.count = data.length;
          resolve(sign.count ?? 0);
        }
      },
      error: () => {
        reject();
      }
    });
  });
};

/**
 * 从sign列表中取一张
 * @param type
 * @returns
 */
const getSign = (type: ExeractType, count?: number) => {
  if (type === 'random') {
    // 每次请求随机获取一张
    const rad = Math.round(Math.random() * (sign.count - 1));
    return sign.list[rad];
  } else if (type === 'count') {
    // 根据索引获取
    const rad = count ? count % sign.count : 0;
    return sign.list[rad];
  } else {
    // 根据日期获取，当天固定
    const rad = Math.round(Date.now() / 86400000) % sign.count;
    return sign.list[rad];
  }
};

/**
 * 随机获取一张Cover
 * @param {ExeractType} type
 * @returns
 */
export const randomSign = (type: ExeractType = 'daily', count?: number) => {
  return new Promise<string>((resolve, reject) => {
    if (!sign.count) {
      getSignList()
        .then(() => {
          resolve(getSign(type, count));
        })
        .catch(() => {
          resolve(defaultSign);
        });
    } else {
      resolve(getSign(type, count));
    }
  });
};
