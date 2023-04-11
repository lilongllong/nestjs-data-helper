import { Injectable } from '@nestjs/common';
import chromeLauncher from 'chrome-launcher';
import lighthouse, { Flags } from 'lighthouse';

@Injectable()
export class LightHouseService {
  private DEFAULT_OPTIONS: Flags = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['perfermance'],
  };
  async runLigthTask(url, options = this.DEFAULT_OPTIONS) {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const formatOptions = { ...this.DEFAULT_OPTIONS, ...options };
    const runnerResult = await lighthouse(url, formatOptions);
    const resportHtml = runnerResult.report;
    await chrome.kill();
    return resportHtml;
  }
}
