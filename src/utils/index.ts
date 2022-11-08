import getLimitTimeRequest from './limitTimeTask';

const mockTask = function (pre: number, curr: number): Promise<number> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('请求失败'));
      resolve(pre + curr);
    }, 1000);
  });
};

export async function exec() {
  const handler = getLimitTimeRequest<number>(mockTask, 5);
  const data = await handler<number>(5, 7);
  console.log(data);
}

export function formatCommunityName(name: string) {
  // 首先移除 (*) 的数据
  // 移除 * 期的数据
  // 移除
  return name
    .replace(/\(.*?\)/g, '')
    .replace(/（.*?）/g, '')
    .replace(/[一|二|三|四|五|六|七|八|九]期/g, '');
}
