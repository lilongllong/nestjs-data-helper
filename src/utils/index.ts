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
