import { INestApplication } from '@nestjs/common';
import axios from 'axios';
import * as schedule from 'node-schedule';
import axiosInstance from 'src/utils/axiosInstance';
import { XingzhoushenfangService } from 'src/app/xingzhoushenfang/xingzhoushenfang.service';

export const stopSchedule = () => {
  schedule.gracefulShutdown();
};

export const setupSchedule = (app: INestApplication) => {
  const roomService = app.get(XingzhoushenfangService);
  // roomService.updateAllNominalPriceScheduleJob();
  // roomService.queryCommunityData();
  // roomService.updateAllSalesPriceScheduleJob();
  // roomService.tempSalesUpdate();
  schedule.scheduleJob('0 0 0 * * *', function () {
    // 获取service进行数据保存
    const roomService = app.get(XingzhoushenfangService);
    roomService.queryNominalPriceData();
    console.log('触发请求');
  });
};

export const restartSchedule = (app: INestApplication) => {
  stopSchedule();
  setupSchedule(app);
};
