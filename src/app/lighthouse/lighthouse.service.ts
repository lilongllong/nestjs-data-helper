import { Injectable } from '@nestjs/common';
import * as chromeLauncher from 'chrome-launcher';
import * as lighthouse from 'lighthouse';

@Injectable()
export class LightHouseService {
  private DEFAULT_OPTIONS: lighthouse.Flags = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'seo', 'accessibility', 'best-practices'],
  };
  async runLigthTask(url, options = this.DEFAULT_OPTIONS) {
    const chrome = await chromeLauncher.launch({
      // startingUrl: url,
      chromeFlags: ['--headless'],
    });
    const formatOptions = {
      ...this.DEFAULT_OPTIONS,
      ...options,
      port: chrome.port,
    };
    console.log(chrome, formatOptions, url);
    const runnerResult = await lighthouse(url, formatOptions);
    const resportHtml = runnerResult.report;
    await chrome.kill();
    return resportHtml;
  }
}
