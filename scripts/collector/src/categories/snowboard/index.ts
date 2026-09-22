import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../engine/types';
import { burtonAdapter } from './brands/burton';
import { capitaAdapter } from './brands/capita';
import { jonesAdapter } from './brands/jones';
import { koruaShapesAdapter } from './brands/korua-shapes';
import { bataleonAdapter } from './brands/bataleon';
import { nitroAdapter } from './brands/nitro';
import { rideAdapter } from './brands/ride';
import { neverSummerAdapter } from './brands/never-summer';
import { yonexBadmintonAdapter } from '../badminton-racket/brands/yonex';
import { victorBadmintonAdapter } from '../badminton-racket/brands/victor';
import { msrTentAdapter } from '../tent/brands/msr';
import { naturehikeTentAdapter } from '../tent/brands/naturehike';
import { msrTarpAdapter } from '../tarp/brands/msr';
import { rabSleepingBagAdapter } from '../sleeping-bag/brands/rab';
import { naturehikeSleepingBagAdapter } from '../sleeping-bag/brands/naturehike';
import { msrCampingStoveAdapter } from '../camping-stove/brands/msr';
import { naturehikeCampingStoveAdapter } from '../camping-stove/brands/naturehike';
import { bioliteCampingLightAdapter } from '../camping-light/brands/biolite';
import { xiaomiCampingLightAdapter } from '../camping-light/brands/xiaomi';
import { ospreyHikingBackpackAdapter } from '../hiking-backpack/brands/osprey';
import { naturehikeHikingBackpackAdapter } from '../hiking-backpack/brands/naturehike';
import { kailasHikingBackpackAdapter } from '../hiking-backpack/brands/kailas';
import { tsurinoyaCastingRodAdapter } from '../casting-rod/brands/tsurinoya';
import { djiDroneAdapter } from '../drone/brands/dji';
import { igpsportBikeComputerAdapter } from '../bike-computer/brands/igpsport';
import { djiVideoCameraAdapter } from '../video-camera/brands/dji';
import { insta360CameraAdapter } from '../camera/brands/insta360';

export interface ProductAdapter {
  name: string;
  canHandle(target: CrawlTarget): boolean;
  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult;
}

const adapters: ProductAdapter[] = [
  yonexBadmintonAdapter,
  victorBadmintonAdapter,
  msrTentAdapter,
  naturehikeTentAdapter,
  msrTarpAdapter,
  rabSleepingBagAdapter,
  naturehikeSleepingBagAdapter,
  msrCampingStoveAdapter,
  naturehikeCampingStoveAdapter,
  bioliteCampingLightAdapter,
  xiaomiCampingLightAdapter,
  ospreyHikingBackpackAdapter,
  naturehikeHikingBackpackAdapter,
  kailasHikingBackpackAdapter,
  tsurinoyaCastingRodAdapter,
  djiDroneAdapter,
  igpsportBikeComputerAdapter,
  djiVideoCameraAdapter,
  insta360CameraAdapter,
  burtonAdapter,
  jonesAdapter,
  capitaAdapter,
  koruaShapesAdapter,
  bataleonAdapter,
  nitroAdapter,
  rideAdapter,
  neverSummerAdapter,
];

export function findCategoryAdapter(target: CrawlTarget): ProductAdapter {
  return (
    adapters.find((adapter) => adapter.canHandle(target)) ?? {
      name: `${target.category}/generic`,
      canHandle: () => true,
      normalize: () => ({
        normalizedSpecs: {},
        sourceNotes: ['当前品牌暂无专用 adapter，仅保存通用页面快照。'],
      }),
    }
  );
}
