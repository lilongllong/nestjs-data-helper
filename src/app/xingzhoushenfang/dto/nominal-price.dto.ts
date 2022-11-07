import {} from 'typeorm';

/**
 * {"id":633761,"houseId":105108714580,"title":"地铁口精装大三房，使用面积大，户型好","layout":"4室2厅","acreage":70.75,"orientation":"西北","estate":"万象新天","tags":"近地铁 VR房源","refPrice":460,"price":599,"originalUrl":"https://sz.ke.com/ershoufang/105108714580.html","site":"贝壳","date":"2022-11-07","unitPrice":"8.47","refScale":"0.30","changeType":"reduce","changePrice":56,"changeRate":"0.0855","changeDay":3}
 */

export class NominalPriceDto {
  id?: number;
  ref_id: number; // 行舟深房网的id
  houseId: string;
  title: string;
  layout: string;
  acreage: number; // 面积
  orientation: string;
  estate: string;
  tags: string;
  refPrice: number;
  price: number;
  originalUrl: string;
  site: string;
  data: string; //
  unitPrice: number;
  refScale: number;
  changeType: string;
  changePrice: number; // 加价情况
  changeRate: number; // 字符串转数字
  changeDay: string;
}

export class CommunityDto {
  zoneName: string;
  districtname: string;
  communityName: string;
}
