import { follow, unfollow, getBlogUserGuid, getFollowState, votePost } from '@/utils/cnblogUtil';
import { callBus } from './useBus';
import { _dts } from '@/utils/domUtil';

/** 处理关注相关操作 */
export const handleFollow = () => {
  const guid = getBlogUserGuid();
  if (getFollowState()) {
    // 取消关注
    unfollow(guid)
      .then(() => {
        // 取消成功
        // 粉丝数减1
        callBus('follow', false);
      })
      .catch(() => {});
  } else {
    // 关注
    follow(guid)
      .then(res => {
        // 关注成功
        // 粉丝数加1
        callBus('follow', true);
      })
      .catch(err => {});
  }
};

/**
 * 处理推荐相关操作
 * @param postId 文章ID
 * @param voteType 类型
 * @param flag 是否撤回
 */
export const handleVote = (postId: number = 1010101, voteType: 'Digg' | 'Bury', flag: boolean = false) => {
  votePost(postId, voteType, flag)
    .then(res => {
      const domId = `${voteType.toLocaleLowerCase()}-count`;
      const dom = _dts.getElById(domId);
      // console.log(domId);
      if (dom) {
        let temp = dom.innerText || '0';
        // console.log(temp);
        if (!flag) dom.innerText = `${parseInt(temp) + 1}`;
        else dom.innerText = `${parseInt(temp) - 1}`;
      }
    })
    .catch(err => {});
};
