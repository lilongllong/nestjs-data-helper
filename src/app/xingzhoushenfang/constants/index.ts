export const HOUSING_ESTATE = [
  '万象新天',
  '领航城',
  '领航城领秀花园',
  '桃源居',
  '学府花园',
  '愉康花园',
];

export const AREA_LIST = ['南山', '龙华', '宝安'];

export const NOMINAL_PRICE_URL = {
  method: 'GET',
  url: 'https://www.xzsfbj.com.cn/api/house/getSales',
};

export const SALE_PRICE_URL = {
  url: 'https://www.xzsfbj.com.cn/api/house/getDeal',
  method: 'GET',
};

export const ESTATE_QUERY_URL = {
  method: 'POST',
  url: 'https://zjj.sz.gov.cn/fwzljgcx/pgsj/rentRefer/communityPage',
};

export const HOUSE_VARIABLES = {
  xingzhoushenfang: {
    name: 'xingzhoushenfang_sales',
    desc: '深圳房价小区价格更新进度追踪',
  },
};
