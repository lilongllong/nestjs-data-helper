import { AxiosResponse } from 'axios';
import axiosInstance from 'src/utils/axiosInstance';
import {
  NominalPriceDto,
  CommunityDto,
  SalesDto,
} from '../dto/nominal-price.dto';

import {
  NOMINAL_PRICE_URL,
  HOUSING_ESTATE,
  AREA_LIST,
  ESTATE_QUERY_URL,
  SALE_PRICE_URL,
} from '../constants';

export const getNominalPriceItem = async (params: {
  keyWord: string;
}): Promise<NominalPriceDto[]> => {
  const delay = () =>
    new Promise((resolve) => {
      setTimeout(resolve, 10000 + Math.random() * 10000);
    });
  await delay();
  const res = await axiosInstance.request({
    ...NOMINAL_PRICE_URL,
    params: params,
  });
  if (res.status === 200) {
    return (res.data || []).map((subItem: NominalPriceDto) => {
      const data = {
        ...subItem,
        ref_id: subItem.id,
        changeRate: Number(subItem.changeRate),
        refScale: Number(subItem.refScale),
        unitPrice: Number(subItem.unitPrice),
        houseId: String(subItem.houseId),
      } as NominalPriceDto;
      delete data.id;
      return data;
    });
  } else {
    return [];
  }
};

export const getSalesPriceItem = async (params: {
  keyWord: string;
}): Promise<SalesDto[]> => {
  const delay = () =>
    new Promise((resolve) => {
      setTimeout(resolve, 5000 + Math.random() * 5000);
    });
  await delay();
  const res = await axiosInstance.request({
    ...SALE_PRICE_URL,
    headers: {
      Host: 'www.xzsfbj.com.cn',
      Origin: 'https://www.xzsfbj.com.cn',
      Referer: 'https://www.xzsfbj.com.cn/web/h5.html',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
    },
    data: params,
  });
  if (res.status === 200 && res.data?.errCode === 0) {
    return (res.data.data || []).map((subItem: SalesDto) => {
      const data = {
        ...subItem,
        ref_id: subItem.id,
        unitPrice:
          (subItem.unitPrice as any) === '***' ? 0 : Number(subItem.unitPrice),
        price: (subItem.price as any) === '***' ? 0 : Number(subItem.price),
      } as SalesDto;
      delete data.id;
      return data;
    });
  } else {
    return [];
  }
};

export const getCommunity = async (params: any) => {
  const firstDataRes = await axiosInstance.request({
    ...ESTATE_QUERY_URL,
    headers: {
      Cookie:
        '_trs_uv=l5ukii4t_914_65kf; JSESSIONID=VRJSkdWdfPVI0ZiWg1h4MOdanBwqrxfvHFbhZuOaq46HkepdVT-a!2012806727; session-cookie=46007885',
      Origin: 'https://zjj.sz.gov.cn',
      Referer: 'https://zjj.sz.gov.cn/fwzljgcx/vue/list',
      'X-CSRF-TOKEN': 'ed51b964-9c83-4037-a67f-8dc1b0521095', // TOKEN要动态获取
    },
    data: {
      area: params.area,
      page: params.page,
      rows: params.rows,
      searchText: params.searchText,
      street: params.street,
    },
  });
  if (firstDataRes.status === 200 && firstDataRes.data.code === 0) {
    const total = firstDataRes.data?.data.total || 0;
    const list = (firstDataRes.data?.data?.list || []).map(
      (item: {
        communityName: string;
        districtname: string;
        zoneName: string;
      }) => ({
        communityName: item.communityName,
        districtname: item.districtname,
        zoneName: item.zoneName,
      }),
    );
    return { list, total };
  }
  return { list: [], total: 0 };
};

export const getCommunityByArea = async (params: { area: string }) => {
  const firstData = await getCommunity({
    area: params.area,
    page: 1,
    rows: 10,
    searchText: '',
    street: '',
  });
  if (firstData.list?.length > 0 && firstData.total > 0) {
    let page = 1;
    while (page * 10 < firstData.total) {
      const delay = () =>
        new Promise((resolve) => {
          setTimeout(resolve, Math.random() * 10000);
        });
      await delay();
      const res = await getCommunity({
        area: params.area,
        page,
        rows: 10,
        searchText: '',
        street: '',
      });
      if (res.list?.length > 0 && res.total > 0) {
        firstData.list = [...firstData.list, ...res.list];
      }
      // page = firstData.total;
      page++;
    }
  }
  return firstData;
};

export const getStaredEstateData = async function (): Promise<
  NominalPriceDto[][]
> {
  const promises = HOUSING_ESTATE.map((item: string) => {
    return getNominalPriceItem({ keyWord: item });
  });
  const datas = await Promise.all(promises);
  return datas;
};

export const getAllEstates = async function (): Promise<CommunityDto[]> {
  const promises = AREA_LIST.map((item: string) =>
    getCommunityByArea({ area: item }),
  );
  const datus = await Promise.all(promises);
  return datus.reduce((target, curr) => {
    return [...target, ...(curr.list || [])];
  }, []);
};
