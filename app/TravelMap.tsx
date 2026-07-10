"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { geoGraticule10, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "@d3-maps/atlas/world/countries/countries-110m";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Locale } from "./content";

type Place = {
  id: string;
  iso3?: string;
  coordinates?: [number, number];
  names: Record<Locale, string>;
  photos?: Photo[];
};

type Photo = {
  src: string;
  alt: Record<Locale, string>;
};

type CountryProperties = {
  id: string;
  name: string;
  name_long: string;
};

const places: Place[] = [
  { id: "thailand", iso3: "THA", names: { zh: "泰国", en: "Thailand", ja: "タイ" } },
  { id: "vietnam", iso3: "VNM", names: { zh: "越南", en: "Vietnam", ja: "ベトナム" } },
  {
    id: "turkiye",
    iso3: "TUR",
    names: { zh: "土耳其", en: "Türkiye", ja: "トルコ" },
    photos: [
      {
        src: "/travel/turkiye/marina-fisherman.jpg",
        alt: {
          zh: "土耳其海港夜色中的渔人、猫与木船",
          en: "A fisherman, a cat, and wooden boats at a Turkish marina at night",
          ja: "トルコの夜の港に並ぶ木造船と釣り人、猫",
        },
      },
    ],
  },
  {
    id: "greece",
    iso3: "GRC",
    names: { zh: "希腊", en: "Greece", ja: "ギリシャ" },
    photos: [
      {
        src: "/travel/greece/seaside-street.jpg",
        alt: {
          zh: "希腊海边街道上的骑行者与蓝色海面",
          en: "A cyclist passing a bright blue Greek seafront",
          ja: "青い海を望むギリシャの海辺を走るサイクリスト",
        },
      },
      {
        src: "/travel/greece/waterfront-evening.jpg",
        alt: {
          zh: "希腊海边餐厅的蓝调时刻",
          en: "Blue hour at a waterfront restaurant in Greece",
          ja: "ギリシャの海辺のレストランで迎えるブルーアワー",
        },
      },
      {
        src: "/travel/greece/coastal-beach.jpg",
        alt: {
          zh: "希腊海岸的树荫、沙滩与深蓝海水",
          en: "A shaded beach and deep-blue water on the Greek coast",
          ja: "木陰と深い青の海が広がるギリシャのビーチ",
        },
      },
      {
        src: "/travel/greece/restaurant-evening.jpg",
        alt: {
          zh: "希腊小镇夜幕下热闹的街边餐厅",
          en: "A lively street restaurant at dusk in a Greek town",
          ja: "夕暮れのギリシャの街で賑わうレストラン",
        },
      },
    ],
  },
  {
    id: "spain",
    iso3: "ESP",
    names: { zh: "西班牙", en: "Spain", ja: "スペイン" },
    photos: [
      {
        src: "/travel/spain/barcelona-sagrada-01.jpg",
        alt: {
          zh: "从高处俯瞰巴塞罗那与圣家堂",
          en: "Barcelona and the Sagrada Família seen from above",
          ja: "高台から望むバルセロナとサグラダ・ファミリア",
        },
      },
      {
        src: "/travel/spain/barcelona-sagrada-02.jpg",
        alt: {
          zh: "巴塞罗那城市天际线中的圣家堂",
          en: "The Sagrada Família rising above Barcelona",
          ja: "バルセロナの街並みにそびえるサグラダ・ファミリア",
        },
      },
      {
        src: "/travel/spain/cycling-cafe.jpg",
        alt: {
          zh: "西班牙街角自行车咖啡馆前小憩的骑行者",
          en: "Cyclists resting outside a corner café in Spain",
          ja: "スペインの街角のカフェで休むサイクリスト",
        },
      },
      {
        src: "/travel/spain/coastal-town.jpg",
        alt: {
          zh: "夕阳照亮的西班牙海岸小镇与海湾",
          en: "A Spanish coastal town and bay in warm evening light",
          ja: "夕陽に照らされたスペインの海辺の町と入り江",
        },
      },
    ],
  },
  {
    id: "hawaii",
    coordinates: [-156.333, 20.25],
    names: { zh: "美国 · 夏威夷", en: "United States · Hawaiʻi", ja: "アメリカ · ハワイ" },
    photos: [
      {
        src: "/travel/hawaii/honolulu-street.jpg",
        alt: {
          zh: "夏威夷檀香山树荫下的街角",
          en: "A tree-lined street corner in Honolulu, Hawaiʻi",
          ja: "木陰が広がるハワイ・ホノルルの街角",
        },
      },
    ],
  },
  { id: "france", iso3: "FRA", names: { zh: "法国", en: "France", ja: "フランス" } },
  {
    id: "netherlands",
    iso3: "NLD",
    names: { zh: "荷兰", en: "Netherlands", ja: "オランダ" },
    photos: [
      {
        src: "/travel/netherlands/cyclists-under-trees.jpg",
        alt: {
          zh: "荷兰林荫街道上的两位骑行者",
          en: "Two cyclists beneath leafy trees in the Netherlands",
          ja: "オランダの並木道を走る二人のサイクリスト",
        },
      },
    ],
  },
  {
    id: "belgium",
    iso3: "BEL",
    names: { zh: "比利时", en: "Belgium", ja: "ベルギー" },
    photos: [
      {
        src: "/travel/belgium/ghent-old-town.jpg",
        alt: {
          zh: "从钟楼俯瞰比利时根特老城的教堂与街道",
          en: "A church and old-town streets seen from above in Ghent, Belgium",
          ja: "鐘楼から見下ろすベルギー・ゲント旧市街の教会と通り",
        },
      },
    ],
  },
  {
    id: "korea",
    iso3: "KOR",
    names: { zh: "韩国", en: "South Korea", ja: "韓国" },
    photos: [
      {
        src: "/travel/korea/seoul-tower.jpg",
        alt: {
          zh: "首尔街巷尽头的南山首尔塔",
          en: "N Seoul Tower above a neighborhood street",
          ja: "街並みの向こうに見えるNソウルタワー",
        },
      },
      {
        src: "/travel/korea/city-street.jpg",
        alt: {
          zh: "晴日里繁忙的韩国城市街道",
          en: "A busy South Korean city street on a clear day",
          ja: "晴れた日の賑やかな韓国の街角",
        },
      },
      {
        src: "/travel/korea/busan-hillside.jpg",
        alt: {
          zh: "釜山山坡上层叠的彩色房屋",
          en: "Colorful homes layered across a hillside in Busan",
          ja: "釜山の斜面に連なる色鮮やかな家々",
        },
      },
      {
        src: "/travel/korea/railway-crossing.jpg",
        alt: {
          zh: "韩国居民区里纵横交错的铁路道口与电线",
          en: "A railway crossing and layered overhead wires in a South Korean neighborhood",
          ja: "韓国の住宅街に広がる踏切と幾重もの架線",
        },
      },
    ],
  },
  {
    id: "japan",
    iso3: "JPN",
    names: { zh: "日本", en: "Japan", ja: "日本" },
    photos: [
      {
        src: "/travel/japan/cherry-blossoms.jpg",
        alt: {
          zh: "晴空下盛开的日本樱花与合影的人们",
          en: "People gathering beneath cherry blossoms in Japan",
          ja: "青空の下、満開の桜と記念撮影を楽しむ人々",
        },
      },
      {
        src: "/travel/japan/riverside-cycling.jpg",
        alt: {
          zh: "樱花与油菜花之间沿河骑行的人们",
          en: "Cyclists riding between cherry blossoms and yellow flowers by a river",
          ja: "桜と菜の花に囲まれた川沿いを走るサイクリスト",
        },
      },
      {
        src: "/travel/japan/coastal-hillside.jpg",
        alt: {
          zh: "日本海边山城通向港口的石阶",
          en: "Stone steps descending through a Japanese hillside town toward the harbor",
          ja: "港へと下る日本の坂の町の石段",
        },
      },
      {
        src: "/travel/japan/autumn-temple.jpg",
        alt: {
          zh: "日本寺院参道上金黄与深红的秋叶",
          en: "Golden and deep-red autumn leaves along a temple path in Japan",
          ja: "日本の寺院の参道を彩る黄金色と深紅の紅葉",
        },
      },
      {
        src: "/travel/japan/cherry-blossom-shop.jpg",
        alt: {
          zh: "樱花盛开时日本老街上的鲜鱼店",
          en: "A neighborhood fish shop beneath cherry blossoms in Japan",
          ja: "桜の下に佇む日本の町の鮮魚店",
        },
      },
    ],
  },
  { id: "china", iso3: "CHN", names: { zh: "中国", en: "China", ja: "中国" } },
  {
    id: "taiwan",
    iso3: "TWN",
    names: { zh: "中国台湾", en: "Taiwan", ja: "台湾" },
    photos: [
      {
        src: "/travel/taiwan/jiufen-lanterns.jpg",
        alt: {
          zh: "雨夜里九份老街层叠的红灯笼",
          en: "Red lanterns lining Jiufen Old Street on a rainy night",
          ja: "雨の夜、九份老街に連なる赤い提灯",
        },
      },
      {
        src: "/travel/taiwan/taipei-101-frame.jpg",
        alt: {
          zh: "被弧形建筑框住的台北 101",
          en: "Taipei 101 framed by two curved buildings",
          ja: "曲線的な建物の間にそびえる台北101",
        },
      },
      {
        src: "/travel/taiwan/taipei-101-alley.jpg",
        alt: {
          zh: "云雾中的台北 101 与老街巷",
          en: "Taipei 101 rising through mist beyond a narrow alley",
          ja: "路地の向こう、雲の中にそびえる台北101",
        },
      },
    ],
  },
  {
    id: "hong-kong",
    coordinates: [114.167, 22.358],
    names: { zh: "中国香港", en: "China · Hong Kong", ja: "中国・香港" },
  },
  {
    id: "macau",
    coordinates: [113.5394, 22.2111],
    names: { zh: "中国澳门", en: "China · Macao", ja: "中国・マカオ" },
  },
];

const galleryUi: Record<
  Locale,
  { previous: string; next: string; count: (current: number, total: number) => string }
> = {
  zh: {
    previous: "上一张照片",
    next: "下一张照片",
    count: (current, total) => `第 ${current} / ${total} 张`,
  },
  en: {
    previous: "Previous photo",
    next: "Next photo",
    count: (current, total) => `${current} of ${total}`,
  },
  ja: {
    previous: "前の写真",
    next: "次の写真",
    count: (current, total) => `${current} / ${total} 枚`,
  },
};

const placeByIso = new Map(places.filter((place) => place.iso3).map((place) => [place.iso3!, place]));
const WIDTH = 1040;
const HEIGHT = 520;

export function TravelMap({
  locale,
  mapLabel,
  visitedLabel,
  placeholderTitle,
  placeholderBody,
}: {
  locale: Locale;
  mapLabel: string;
  visitedLabel: string;
  placeholderTitle: string;
  placeholderBody: string;
}) {
  const [selectedId, setSelectedId] = useState("japan");
  const [photoIndex, setPhotoIndex] = useState(0);
  const selectedPlace = places.find((place) => place.id === selectedId) ?? places[0];
  const selectedPhotos = selectedPlace.photos ?? [];
  const selectedPhoto = selectedPhotos[photoIndex] ?? selectedPhotos[0];

  const { countries, path, markers, graticulePath, spherePath } = useMemo(() => {
    const countriesFeature = feature(
      world,
      world.objects.features,
    ) as FeatureCollection<Geometry, CountryProperties>;
    const projection = geoNaturalEarth1().fitExtent(
      [
        [18, 18],
        [WIDTH - 18, HEIGHT - 18],
      ],
      { type: "Sphere" },
    );
    const pathGenerator = geoPath(projection);

    return {
      countries: countriesFeature.features,
      path: pathGenerator,
      graticulePath: pathGenerator(geoGraticule10()),
      spherePath: pathGenerator({ type: "Sphere" }),
      markers: places
        .filter((place) => place.coordinates)
        .map((place) => ({ place, point: projection(place.coordinates!) }))
        .filter((marker): marker is { place: Place; point: [number, number] } => Boolean(marker.point)),
    };
  }, []);

  const selectPlace = (id: string) => {
    setSelectedId(id);
    setPhotoIndex(0);
  };

  const showPreviousPhoto = () => {
    if (selectedPhotos.length < 2) return;
    setPhotoIndex((current) => (current - 1 + selectedPhotos.length) % selectedPhotos.length);
  };

  const showNextPhoto = () => {
    if (selectedPhotos.length < 2) return;
    setPhotoIndex((current) => (current + 1) % selectedPhotos.length);
  };

  return (
    <div className="travel-experience">
      <div className="travel-map-wrap">
        <svg
          className="travel-map"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="group"
          aria-label={mapLabel}
        >
          <path className="travel-map-ocean" d={spherePath ?? undefined} />
          <path className="travel-map-graticule" d={graticulePath ?? undefined} />
          {countries.map((country) => {
            const place = placeByIso.get(country.properties.id);
            const isSelected = place?.id === selectedId;
            const d = path(country as Feature<Geometry, CountryProperties>);
            if (!d) return null;

            if (!place) {
              return <path className="travel-country" d={d} key={country.properties.id} aria-hidden="true" />;
            }

            return (
              <path
                className={isSelected ? "travel-country visited selected" : "travel-country visited"}
                d={d}
                key={country.properties.id}
                role="button"
                aria-label={place.names[locale]}
                aria-pressed={isSelected}
                onClick={() => selectPlace(place.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectPlace(place.id);
                  }
                }}
                tabIndex={0}
              />
            );
          })}
          {markers.map(({ place, point }) => {
            const isSelected = place.id === selectedId;
            return (
              <g
                className={isSelected ? "travel-marker selected" : "travel-marker"}
                key={place.id}
                role="button"
                aria-label={place.names[locale]}
                aria-pressed={isSelected}
                onClick={() => selectPlace(place.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectPlace(place.id);
                  }
                }}
                tabIndex={0}
                transform={`translate(${point[0]} ${point[1]})`}
              >
                <circle className="travel-marker-ring" r="11" />
                <circle className="travel-marker-core" r="4" />
              </g>
            );
          })}
        </svg>
        <div className="travel-map-count">
          <strong>{places.length}</strong>
          <span>{visitedLabel}</span>
        </div>
      </div>

      <aside className="travel-photo-panel" aria-labelledby="travel-place-heading">
        <div className="travel-photo-index">{String(places.findIndex((place) => place.id === selectedId) + 1).padStart(2, "0")}</div>
        <h3 id="travel-place-heading">{selectedPlace.names[locale]}</h3>
        {selectedPhoto ? (
          <>
            <figure className="travel-gallery">
              <div className="travel-gallery-frame">
                <Image
                  fill
                  unoptimized
                  src={selectedPhoto.src}
                  alt=""
                  aria-hidden="true"
                  className="travel-gallery-backdrop"
                  sizes="(max-width: 820px) calc(100vw - 76px), 360px"
                />
                <Image
                  fill
                  unoptimized
                  src={selectedPhoto.src}
                  alt={selectedPhoto.alt[locale]}
                  className="travel-gallery-photo"
                  style={{ objectFit: "contain" }}
                  sizes="(max-width: 820px) calc(100vw - 76px), 360px"
                />
              </div>
              <figcaption>{selectedPhoto.alt[locale]}</figcaption>
            </figure>
            <div className="travel-gallery-controls">
              <button
                type="button"
                aria-label={galleryUi[locale].previous}
                disabled={selectedPhotos.length < 2}
                onClick={showPreviousPhoto}
              >
                ←
              </button>
              <span className="travel-gallery-count" role="status" aria-live="polite">
                {galleryUi[locale].count(photoIndex + 1, selectedPhotos.length)}
              </span>
              <button
                type="button"
                aria-label={galleryUi[locale].next}
                disabled={selectedPhotos.length < 2}
                onClick={showNextPhoto}
              >
                →
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="travel-photo-placeholder" aria-label={placeholderTitle}>
              <div className="travel-placeholder-sun" aria-hidden="true" />
              <span>{placeholderTitle}</span>
            </div>
            <p>{placeholderBody}</p>
          </>
        )}
      </aside>

      <div className="travel-place-list" aria-label={visitedLabel}>
        {places.map((place) => (
          <button
            type="button"
            key={place.id}
            aria-pressed={place.id === selectedId}
            onClick={() => selectPlace(place.id)}
          >
            {place.names[locale]}
          </button>
        ))}
      </div>
    </div>
  );
}
