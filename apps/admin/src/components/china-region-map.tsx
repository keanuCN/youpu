'use client';

import { china } from '@esmjs/geo';
import { MapChart } from 'echarts/charts';
import { TooltipComponent, VisualMapComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import type { EChartsOption, TooltipComponentFormatterCallbackParams } from 'echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useMemo } from 'react';

echarts.use([MapChart, TooltipComponent, VisualMapComponent, CanvasRenderer]);
// @ts-expect-error @esmjs/geo exports valid GeoJSON, while ECharts' map input type is narrower.
echarts.registerMap('youpu-china', { geoJSON: china });

interface RegionStat {
  region: string;
  visitors: number;
}

interface ChinaGeoJSON {
  features: Array<{ properties: { name: string } }>;
}

const geoFeatures = (china as unknown as ChinaGeoJSON).features.filter(({ properties }) => properties.name);

export function ChinaRegionMap({ regions }: { regions: RegionStat[] }) {
  const option = useMemo<EChartsOption>(() => {
    const countByProvince = new Map<string, number>();
    for (const item of regions) {
      const province = normalizeProvince(item.region);
      if (province) countByProvince.set(province, (countByProvince.get(province) ?? 0) + item.visitors);
    }

    const data = geoFeatures.map(({ properties }) => {
      const province = normalizeProvince(properties.name);
      return { name: properties.name, value: province ? countByProvince.get(province) ?? 0 : 0 };
    });
    const max = Math.max(1, ...data.map((item) => item.value));

    return {
      animationDuration: 300,
      tooltip: {
        trigger: 'item',
        confine: true,
        backgroundColor: '#202822',
        borderWidth: 0,
        textStyle: { color: '#f8f6f0', fontSize: 12 },
        formatter: (params: TooltipComponentFormatterCallbackParams) => {
          const item = Array.isArray(params) ? params[0] : params;
          return `${item?.name ?? '地区'}<br/>独立访客：${Number(item?.value ?? 0).toLocaleString('zh-CN')}`;
        },
      },
      visualMap: {
        type: 'continuous',
        min: 0,
        max,
        left: 12,
        bottom: 6,
        itemWidth: 10,
        itemHeight: 84,
        text: ['较多', '较少'],
        textStyle: { color: '#6f7770', fontSize: 10 },
        inRange: { color: ['#e8e6df', '#b6c8bd', '#6d9281', '#315b49'] },
        calculable: false,
      },
      series: [{
        type: 'map',
        map: 'youpu-china',
        name: '独立访客',
        data,
        roam: false,
        selectedMode: false,
        layoutCenter: ['50%', '50%'],
          layoutSize: '108%',
        label: { show: false },
        itemStyle: { areaColor: '#eeece5', borderColor: '#fffdf8', borderWidth: 1.1 },
        emphasis: {
          label: { show: true, color: '#26372e', fontSize: 10, fontWeight: 600 },
          itemStyle: { areaColor: '#d6a65f', borderColor: '#fffdf8', borderWidth: 1.2 },
        },
        select: { itemStyle: { areaColor: '#d6a65f' } },
      }],
    };
  }, [regions]);

  return (
    <div className="china-region-chart" role="img" aria-label="中国各省独立访客分布地图，悬停省份查看人数">
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        notMerge
        lazyUpdate
        opts={{ renderer: 'canvas' }}
        style={{ width: '100%', height: '500px' }}
      />
    </div>
  );
}

function normalizeProvince(name: string): string | null {
  const value = name
    .replace(/特别行政区$/, '')
    .replace(/(壮族|回族|维吾尔)?自治区$/, '')
    .replace(/[省市]$/, '');
  const normalized = value === '中国' ? null : value;
  return normalized;
}
