import { AxiosResponse } from 'axios';
import axiosInstance from 'src/utils/axiosInstance';
import { NominalPriceDto } from '../dto/nominal-price.dto';

import { NOMINAL_PRICE_URL, HOUSING_ESTATE } from '../constants';

export const getNominalPriceItem = (params: { keyWord: string }) => {
  return axiosInstance.request({ ...NOMINAL_PRICE_URL, params: params });
};

export const getStaredEstateData = async function (): Promise<
  NominalPriceDto[][]
> {
  const promises = HOUSING_ESTATE.map((item: string) => {
    return getNominalPriceItem({ keyWord: item });
  });
  const datas = await Promise.all(promises);
  return (datas || []).map((item: AxiosResponse<NominalPriceDto[]>) => {
    if (item.status === 200) {
      return (item.data || []).map((subItem: NominalPriceDto) => {
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
  });
};
