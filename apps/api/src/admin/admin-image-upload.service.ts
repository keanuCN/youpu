import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { TosClient } from '@volcengine/tos-sdk';
import { env } from '../config/env';

export interface TosImageConfig {
  region: string;
  bucket: string;
  endpoint: string;
  accessKey: string;
  secretKey: string;
  publicBaseUrl: string;
}

export interface ProductImageUpload {
  buffer: Buffer;
  mimetype: string;
}

interface TosImageObject {
  key: string;
  body: Buffer;
  contentType: 'image/webp';
}

type PutTosObject = (object: TosImageObject) => Promise<unknown>;
type ImageDirectory = 'product-images' | 'review-images';

const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const MAX_INPUT_PIXELS = 40_000_000;
const IMAGE_FORMATS: Record<string, string> = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function normalizeTosEndpoint(endpoint: string): string {
  return new URL(endpoint).host;
}

export async function normalizeProductImage(buffer: Buffer, mimetype: string): Promise<Buffer> {
  if (!IMAGE_FORMATS[mimetype]) {
    throw new BadRequestException('仅支持 JPEG、PNG 或 WebP 图片');
  }
  if (!buffer.length || buffer.length > MAX_INPUT_BYTES) {
    throw new BadRequestException('图片不能为空，且不能超过 10 MB');
  }

  try {
    const image = sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS });
    const metadata = await image.metadata();
    if (!Object.values(IMAGE_FORMATS).includes(metadata.format ?? '')) {
      throw new BadRequestException('仅支持 JPEG、PNG 或 WebP 图片');
    }
    if (metadata.format !== IMAGE_FORMATS[mimetype] || (metadata.pages ?? 1) > 1) {
      throw new BadRequestException('图片内容与文件类型不匹配，或包含动画帧');
    }
    return await image
      .rotate()
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch (error) {
    if (error instanceof BadRequestException) throw error;
    throw new BadRequestException('仅支持 JPEG、PNG 或 WebP 图片');
  }
}

export async function uploadProductImage(
  config: TosImageConfig,
  input: ProductImageUpload,
  putObject: PutTosObject,
  createId: () => string = randomUUID,
  directory: ImageDirectory = 'product-images',
): Promise<{ url: string; key: string; size: number }> {
  const body = await normalizeProductImage(input.buffer, input.mimetype);
  const key = `${directory}/${createId()}.webp`;
  await putObject({ key, body, contentType: 'image/webp' });
  return {
    url: `${config.publicBaseUrl.replace(/\/$/, '')}/${key}`,
    key,
    size: body.length,
  };
}

@Injectable()
export class AdminImageUploadService {
  private readonly config: TosImageConfig | null;
  private readonly client: TosClient | null;

  constructor() {
    const { TOS_REGION, TOS_BUCKET, TOS_ENDPOINT, TOS_ACCESS_KEY, TOS_SECRET_KEY, TOS_PUBLIC_BASE_URL } = env;
    this.config = TOS_REGION && TOS_BUCKET && TOS_ENDPOINT && TOS_ACCESS_KEY && TOS_SECRET_KEY && TOS_PUBLIC_BASE_URL
      ? {
          region: TOS_REGION,
          bucket: TOS_BUCKET,
          endpoint: TOS_ENDPOINT,
          accessKey: TOS_ACCESS_KEY,
          secretKey: TOS_SECRET_KEY,
          publicBaseUrl: TOS_PUBLIC_BASE_URL,
        }
      : null;
    this.client = this.config
      ? new TosClient({
          region: this.config.region,
          endpoint: normalizeTosEndpoint(this.config.endpoint),
          accessKeyId: this.config.accessKey,
          accessKeySecret: this.config.secretKey,
        })
      : null;
  }

  async upload(input: ProductImageUpload): Promise<{ url: string; key: string; size: number }> {
    return this.uploadToDirectory(input, 'product-images');
  }

  async uploadReviewImage(input: ProductImageUpload): Promise<{ url: string; key: string; size: number }> {
    return this.uploadToDirectory(input, 'review-images');
  }

  private async uploadToDirectory(input: ProductImageUpload, directory: ImageDirectory): Promise<{ url: string; key: string; size: number }> {
    if (!this.config || !this.client) {
      throw new ServiceUnavailableException('图片存储尚未配置，请在 API 环境变量中配置 TOS');
    }
    return uploadProductImage(this.config, input, async ({ key, body, contentType }) => {
      await this.client!.putObject({
        bucket: this.config!.bucket,
        key,
        body,
        contentType,
        cacheControl: 'public, max-age=31536000, immutable',
        forbidOverwrite: true,
      });
    }, randomUUID, directory);
  }
}
