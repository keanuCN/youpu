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
import { insta360ActionCamAdapter } from '../action-cam/brands/insta360';
import { insta360CameraAdapter } from '../camera/brands/insta360';
import { amazfitSportsWatchAdapter } from '../sports-watch/brands/amazfit';
import { timemoreGrinderAdapter } from '../grinder/brands/timemore';
import { viltroxLensAdapter } from '../lens/brands/viltrox';
import { nisiFilterAdapter } from '../filter/brands/nisi';
import { siruiTripodAdapter } from '../tripod/brands/sirui';
import { djiGimbalAdapter } from '../gimbal/brands/dji';
import { djiMicrophoneAdapter } from '../microphone/brands/dji';
import { godoxVideoLightAdapter } from '../video-light/brands/godox';
import { lexarMemoryCardAdapter } from '../memory-card/brands/lexar';
import { akkoEsportsKeyboardAdapter } from '../esports-keyboard/brands/akko';
import { monsgeekEsportsKeyboardAdapter } from '../esports-keyboard/brands/monsgeek';

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
  insta360ActionCamAdapter,
  insta360CameraAdapter,
  amazfitSportsWatchAdapter,
  timemoreGrinderAdapter,
  viltroxLensAdapter,
  nisiFilterAdapter,
  siruiTripodAdapter,
  djiGimbalAdapter,
  djiMicrophoneAdapter,
  godoxVideoLightAdapter,
  lexarMemoryCardAdapter,
  akkoEsportsKeyboardAdapter,
  monsgeekEsportsKeyboardAdapter,
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
