"use client";

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
};

type CountryProperties = {
  id: string;
  name: string;
  name_long: string;
};

const places: Place[] = [
  { id: "thailand", iso3: "THA", names: { zh: "泰国", en: "Thailand", ja: "タイ" } },
  { id: "vietnam", iso3: "VNM", names: { zh: "越南", en: "Vietnam", ja: "ベトナム" } },
  { id: "turkiye", iso3: "TUR", names: { zh: "土耳其", en: "Türkiye", ja: "トルコ" } },
  { id: "greece", iso3: "GRC", names: { zh: "希腊", en: "Greece", ja: "ギリシャ" } },
  {
    id: "hawaii",
    coordinates: [-156.333, 20.25],
    names: { zh: "美国 · 夏威夷", en: "United States · Hawaiʻi", ja: "アメリカ · ハワイ" },
  },
  { id: "france", iso3: "FRA", names: { zh: "法国", en: "France", ja: "フランス" } },
  { id: "netherlands", iso3: "NLD", names: { zh: "荷兰", en: "Netherlands", ja: "オランダ" } },
  { id: "korea", iso3: "KOR", names: { zh: "韩国", en: "South Korea", ja: "韓国" } },
  { id: "china", iso3: "CHN", names: { zh: "中国", en: "China", ja: "中国" } },
  { id: "taiwan", iso3: "TWN", names: { zh: "中国台湾", en: "Taiwan", ja: "台湾" } },
  {
    id: "hong-kong",
    coordinates: [114.167, 22.358],
    names: { zh: "香港", en: "Hong Kong", ja: "香港" },
  },
  {
    id: "macau",
    coordinates: [113.5394, 22.2111],
    names: { zh: "澳门", en: "Macao", ja: "マカオ" },
  },
  { id: "belgium", iso3: "BEL", names: { zh: "比利时", en: "Belgium", ja: "ベルギー" } },
];

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
  const [selectedId, setSelectedId] = useState("china");
  const selectedPlace = places.find((place) => place.id === selectedId) ?? places[0];

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

  const selectPlace = (id: string) => setSelectedId(id);

  return (
    <div className="travel-experience">
      <div className="travel-map-wrap">
        <svg
          className="travel-map"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
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

      <aside className="travel-photo-panel" aria-live="polite">
        <div className="travel-photo-index">{String(places.findIndex((place) => place.id === selectedId) + 1).padStart(2, "0")}</div>
        <h3>{selectedPlace.names[locale]}</h3>
        <div className="travel-photo-placeholder" aria-label={placeholderTitle}>
          <div className="travel-placeholder-sun" aria-hidden="true" />
          <span>{placeholderTitle}</span>
        </div>
        <p>{placeholderBody}</p>
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
