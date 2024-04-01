import { Injectable, Logger } from '@nestjs/common';
import {
  MinioService as NestMinioService,
  MinioModuleOptions,
} from 'nestjs-minio-module';
import { BucketItem } from 'minio';
import { ConfigService } from '@nestjs/config';
import { createReadStream, createWriteStream } from 'fs';
import { rm } from 'fs/promises';
import { Model, Connection, Types } from 'mongoose';

import ChunkDTO from './dto/chunk.dto';
import MergeChunkDTO from './dto/mergeChunk.dto';

type Options = {
  bucketName?: string;
} & MinioModuleOptions;

@Injectable()
export class MinioService extends NestMinioService {
  constructor(
    readonly options: Options,
    private readonly configService: ConfigService,
  ) {
    super(options);
  }
  async upload(fileName: string, file: Buffer, type: string) {
    return this.putObject(this.options.bucketName, fileName, file, {
      'Content-Type': type,
    });
  }

  async download(fileName: string) {
    Logger.log(`读取文件-${fileName}`);
    return this.getObject(this.options.bucketName, fileName);
  }
  async uploadChunk(data: ChunkDTO) {
    const fileName = data.chunk.path.substring(
      data.chunk.path.lastIndexOf('/') + 1,
    );

    const filePath =
      this.configService.get('MINIO_PREFIX') +
      `/${data.sessionId}/chunks/${data.fileHash}/${fileName}`;

    await this.upload(
      filePath,
      //@ts-ignore
      createReadStream(data.chunk.path),
      'application/octet-stream',
    );

    rm(data.chunk.path);

    return { code: 0, data: fileName };
  }

  async mergeChunks(data: MergeChunkDTO) {
    const filePath =
      this.configService.get('MINIO_PREFIX') +
      `/${data.sessionId}/${data.fileHash}`;

    const chunks = await this.listObjectsInfo(
      this.configService.get('MINIO_PREFIX') +
        `/${data.sessionId}/chunks/${data.fileHash}/`,
    );

    const sourceList = chunks
      .sort((a, b) => {
        const aName = a.name.substring(a.name.lastIndexOf('/') + 1);
        const bName = b.name.substring(b.name.lastIndexOf('/') + 1);

        return Number(aName.split('-')[1]) - Number(bName.split('-')[1]);
      })
      .map(
        (chunk) =>
          //@ts-ignore
          new CopySourceOptions({
            Bucket: this.options.bucketName,
            Object: chunk.name,
          }),
      );
    //@ts-ignore
    const dest = new CopyDestinationOptions({
      Bucket: this.options.bucketName,
      Object: filePath,
    });

    await this.composeObject(dest, sourceList);

    return {
      code: 0,
      data: { fileHash: data.fileHash, filePath, sessionId: data.sessionId },
    };
  }

  async getStorageInfo(params: { prefix?: string }): Promise<
    {
      prefix?: string;
      name: string;
      lastModified: Date;
      etag: string;
      size: number;
    }[]
  > {
    return new Promise((resolve, reject) => {
      const data = [];
      const objects = this.listObjectsV2(
        this.options.bucketName,
        params.prefix,
        true,
      );

      objects.on('data', (obj) => {
        data.push(obj);
      });
      objects.on('end', () => {
        resolve(data);
      });
      objects.on('error', (err) => {
        reject(err);
      });
    });
  }

  async getMinioStorageInfo(): Promise<{
    code: string;
    msg: string;
    data: {
      bucket: string;
      quota: number;
      used: number;
    };
    success: boolean;
  }> {
    const params = {
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
      bucket: this.configService.get('MINIO_BUCKET_NAME'),
      instanceCode: 'INSTANCE_INNER',
    };
    // return {
    //   code: '0',
    //   msg: 'ok',
    //   data: {
    //     bucket: '001407storage',
    //     quota: 10737418240,
    //     used: 56004358,
    //   },
    //   success: true,
    // };
    try {
      const res = await this.fetch(`/fileaccess/user/usage`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      return res.json();
    } catch (error) {
      return {
        code: '-1',
        msg: '请求失败' + error.message,
        data: {} as any,
        success: false,
      };
    }
  }
  async fetch(path: string, init?: RequestInit) {
    const response = await fetch(
      this.configService.get('MINIO_BASE_URL') + path,
      init,
    );
    switch (response.status) {
      case 200:
        return response;
      default:
        throw new Error(response.status + ': ' + (await response.text()));
    }
  }
  async listObjectsInfo(
    prefix: string,
    recursive?: boolean,
  ): Promise<BucketItem[]> {
    return new Promise((resolve, reject) => {
      const objects = [];
      const stream = this.listObjects(
        this.options.bucketName,
        prefix,
        recursive,
      );
      stream.on('data', (obj) => {
        objects.push(obj);
      });

      stream.on('end', () => {
        resolve(objects);
      });
      stream.on('error', function (e) {
        reject(e);
      });
    });
  }
}
