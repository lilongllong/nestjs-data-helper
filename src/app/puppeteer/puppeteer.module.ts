/**
 * @file: puppeteer 来实现 PDF 和 截图 生成网页图片
 */

import {
  DynamicModule,
  Logger,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';
import { Cluster } from 'puppeteer-cluster';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { PuppeteerService } from './puppeteer.service';

@Module({
  providers: [PuppeteerService],
})
export class PuppeteerModule
  implements OnApplicationShutdown, OnApplicationBootstrap, OnModuleDestroy
{
  constructor(private readonly moduleRef: ModuleRef) {}

  static register(): DynamicModule {
    const clusterProvider = {
      provide: 'puppeteer-cluster',
      async useFactory(cfg: ConfigService) {
        // 启动浏览器
        console.log(typeof cfg.get('PUPPETEER_CLUSTER_MAX_CONCURRENCY'));
        const cluster = await Cluster.launch({
          concurrency: Cluster[cfg.get('PUPPETEER_CLUSTER_CONCURRENCY')],
          maxConcurrency: Number(cfg.get('PUPPETEER_CLUSTER_MAX_CONCURRENCY')),
          timeout: Number(cfg.get('PUPPETEER_CLUSTER_TASK_TIMEOUT')),
          puppeteerOptions: {
            headless: true,
            userDataDir: './.chrome-temp',
            executablePath:
              '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            args: [
              '--disable-features=IsolateOrigins',
              '--disable-site-isolation-trials',
              '--autoplay-policy=user-gesture-required',
              '--disable-background-networking',
              '--disable-background-timer-throttling',
              '--disable-backgrounding-occluded-windows',
              '--disable-breakpad',
              '--disable-client-side-phishing-detection',
              '--disable-component-update',
              '--disable-default-apps',
              '--disable-dev-shm-usage',
              '--disable-domain-reliability',
              '--disable-extensions',
              '--disable-features=AudioServiceOutOfProcess',
              '--disable-hang-monitor',
              '--disable-ipc-flooding-protection',
              '--disable-notifications',
              '--disable-offer-store-unmasked-wallet-cards',
              '--disable-popup-blocking',
              '--disable-print-preview',
              '--disable-prompt-on-repost',
              '--disable-renderer-backgrounding',
              '--disable-setuid-sandbox',
              '--disable-speech-api',
              '--disable-sync',
              '--hide-scrollbars',
              '--ignore-gpu-blacklist',
              '--metrics-recording-only',
              '--mute-audio',
              '--no-default-browser-check',
              '--no-first-run',
              '--no-pings',
              '--no-sandbox',
              '--no-zygote',
              '--password-store=basic',
              '--use-gl=swiftshader',
              '--use-mock-keychain',
              // '--single-process',
              '--disable-gpu',
              '--deterministic-fetch',
              '--disk-cache-dir=./.chrome-cache',
            ],
          },
        });
        Logger.log('Cluster is launched successfully');
        return cluster;
      },
      inject: [ConfigService],
    };
    return {
      module: PuppeteerModule,
      providers: [clusterProvider],
      exports: [clusterProvider, PuppeteerService],
    };
  }
  async closePuppeteerCluster() {
    const cluster = this.moduleRef.get('puppeteer-cluster');
    cluster.close();
  }
  async onApplicationShutdown(signal?: string) {
    this.closePuppeteerCluster();
  }
  async onModuleDestroy() {
    this.closePuppeteerCluster();
  }
  async onApplicationBootstrap() {
    Logger.log('PuppeteerModule bootstrap success !');
  }
}
