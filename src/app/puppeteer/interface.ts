import { PDFOptions, ScreenshotOptions } from 'puppeteer';

export interface ViewPort {
  width: number;
  height: number;
}

export interface PDFTaskParams {
  url: string;
  viewport?: ViewPort;
  timeout?: number;
  options?: PDFOptions;
  mediaType?: string;
}

export interface ImageTaskParams {
  url: string;
  viewport?: ViewPort;
  timeout?: number;
  options?: ScreenshotOptions;
  mediaType?: string;
}
