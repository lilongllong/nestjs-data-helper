/**
 * @description: 限定次数来进行请求
 * @example: 例如在5次内获取到结果
 * @description: 核心要点是完成tyscript的类型推定，其次高阶函数
 * @param T 指定返回数据类型，M指定参数类型
 */

export default function getLimitTimeRequest<T>(task: any, times: number) {
  // 获取axios的请求实例
  let timeCount = 0;
  async function execTask(resolve, reject, ...params: any[]): Promise<void> {
    if (timeCount > times) {
      reject(new Error('重试请求失败'));
    }
    try {
      const data: T = await task(...params);
      if (data) {
        resolve(data);
      } else {
        timeCount++;
        execTask(resolve, reject, params);
      }
    } catch (error) {
      timeCount++;
      execTask(resolve, reject, params);
    }
  }
  return function <M>(...params: M[]): Promise<T> {
    return new Promise((resolve, reject) => {
      execTask(resolve, reject, ...params);
    });
  };
}
