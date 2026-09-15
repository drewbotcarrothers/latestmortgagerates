/** Canonical city catalog for /cities/{slug}/ pages. */

export type ProvinceId =
  | "ON"
  | "BC"
  | "AB"
  | "QC"
  | "MB"
  | "SK"
  | "NS"
  | "NB"
  | "NL"
  | "PE";

export const PROVINCE_NAMES: Record<ProvinceId, string> = {
  ON: "Ontario",
  BC: "British Columbia",
  AB: "Alberta",
  QC: "Quebec",
  MB: "Manitoba",
  SK: "Saskatchewan",
  NS: "Nova Scotia",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  PE: "Prince Edward Island",
};

export interface CityRecord {
  slug: string;
  name: string;
  province: ProvinceId;
  /** Nearby city slugs that already have pages. */
  nearby: string[];
  /** High-search cities get extra editorial overrides. */
  featured?: boolean;
  region?: string;
}

export const CITIES: CityRecord[] = [
  { slug: "toronto", name: "Toronto", province: "ON", featured: true, region: "Greater Toronto Area", nearby: ["mississauga", "brampton", "vaughan", "hamilton", "markham"] },
  { slug: "mississauga", name: "Mississauga", province: "ON", featured: true, region: "Peel / GTA", nearby: ["toronto", "brampton", "oakville", "burlington"] },
  { slug: "brampton", name: "Brampton", province: "ON", featured: true, region: "Peel / GTA", nearby: ["mississauga", "toronto", "vaughan", "oakville"] },
  { slug: "hamilton", name: "Hamilton", province: "ON", featured: true, region: "Greater Toronto and Hamilton Area", nearby: ["burlington", "toronto", "st-catharines", "oakville"] },
  { slug: "ottawa", name: "Ottawa", province: "ON", featured: true, region: "National Capital Region", nearby: ["kingston", "montreal", "toronto"] },
  { slug: "london", name: "London", province: "ON", featured: true, region: "Southwestern Ontario", nearby: ["kitchener", "windsor", "waterloo"] },
  { slug: "kitchener", name: "Kitchener", province: "ON", featured: true, region: "Waterloo Region", nearby: ["waterloo", "guelph", "hamilton", "london"] },
  { slug: "vaughan", name: "Vaughan", province: "ON", region: "York Region / GTA", nearby: ["toronto", "markham", "brampton", "mississauga"] },
  { slug: "markham", name: "Markham", province: "ON", region: "York Region / GTA", nearby: ["toronto", "vaughan", "oshawa"] },
  { slug: "oakville", name: "Oakville", province: "ON", region: "Halton / GTA", nearby: ["mississauga", "burlington", "hamilton", "toronto"] },
  { slug: "burlington", name: "Burlington", province: "ON", region: "Halton / GTA", nearby: ["oakville", "hamilton", "mississauga"] },
  { slug: "oshawa", name: "Oshawa", province: "ON", region: "Durham / GTA", nearby: ["toronto", "markham", "barrie"] },
  { slug: "windsor", name: "Windsor", province: "ON", region: "Southwestern Ontario", nearby: ["london", "kitchener"] },
  { slug: "st-catharines", name: "St. Catharines", province: "ON", region: "Niagara", nearby: ["hamilton", "burlington", "toronto"] },
  { slug: "barrie", name: "Barrie", province: "ON", region: "Simcoe", nearby: ["toronto", "oshawa", "vaughan"] },
  { slug: "guelph", name: "Guelph", province: "ON", region: "Southwestern Ontario", nearby: ["kitchener", "waterloo", "hamilton"] },
  { slug: "waterloo", name: "Waterloo", province: "ON", region: "Waterloo Region", nearby: ["kitchener", "guelph", "london"] },
  { slug: "kingston", name: "Kingston", province: "ON", region: "Eastern Ontario", nearby: ["ottawa", "toronto"] },
  { slug: "sudbury", name: "Sudbury", province: "ON", region: "Northeastern Ontario", nearby: ["thunder-bay", "ottawa"] },
  { slug: "thunder-bay", name: "Thunder Bay", province: "ON", region: "Northwestern Ontario", nearby: ["sudbury", "winnipeg"] },

  { slug: "vancouver", name: "Vancouver", province: "BC", featured: true, region: "Metro Vancouver", nearby: ["burnaby", "richmond", "surrey", "coquitlam", "victoria"] },
  { slug: "victoria", name: "Victoria", province: "BC", featured: true, region: "Capital Regional District", nearby: ["vancouver", "nanaimo"] },
  { slug: "surrey", name: "Surrey", province: "BC", region: "Metro Vancouver", nearby: ["vancouver", "burnaby", "abbotsford", "coquitlam"] },
  { slug: "burnaby", name: "Burnaby", province: "BC", region: "Metro Vancouver", nearby: ["vancouver", "richmond", "coquitlam", "surrey"] },
  { slug: "richmond", name: "Richmond", province: "BC", region: "Metro Vancouver", nearby: ["vancouver", "burnaby", "surrey"] },
  { slug: "coquitlam", name: "Coquitlam", province: "BC", region: "Metro Vancouver", nearby: ["burnaby", "vancouver", "surrey"] },
  { slug: "kelowna", name: "Kelowna", province: "BC", region: "Okanagan", nearby: ["kamloops", "vancouver", "abbotsford"] },
  { slug: "abbotsford", name: "Abbotsford", province: "BC", region: "Fraser Valley", nearby: ["surrey", "vancouver", "kelowna"] },
  { slug: "nanaimo", name: "Nanaimo", province: "BC", region: "Vancouver Island", nearby: ["victoria", "vancouver"] },
  { slug: "kamloops", name: "Kamloops", province: "BC", region: "Interior", nearby: ["kelowna", "vancouver"] },

  { slug: "calgary", name: "Calgary", province: "AB", featured: true, region: "Southern Alberta", nearby: ["edmonton", "red-deer", "lethbridge"] },
  { slug: "edmonton", name: "Edmonton", province: "AB", featured: true, region: "Capital Region", nearby: ["calgary", "red-deer", "grande-prairie"] },
  { slug: "red-deer", name: "Red Deer", province: "AB", region: "Central Alberta", nearby: ["calgary", "edmonton"] },
  { slug: "lethbridge", name: "Lethbridge", province: "AB", region: "Southern Alberta", nearby: ["calgary", "medicine-hat"] },
  { slug: "medicine-hat", name: "Medicine Hat", province: "AB", region: "Southeastern Alberta", nearby: ["lethbridge", "calgary"] },
  { slug: "grande-prairie", name: "Grande Prairie", province: "AB", region: "Northwestern Alberta", nearby: ["edmonton", "red-deer"] },

  { slug: "montreal", name: "Montreal", province: "QC", featured: true, region: "Greater Montreal", nearby: ["quebec-city", "ottawa"] },
  { slug: "quebec-city", name: "Quebec City", province: "QC", featured: true, region: "Capitale-Nationale", nearby: ["montreal", "ottawa"] },

  { slug: "winnipeg", name: "Winnipeg", province: "MB", featured: true, region: "Capital Region", nearby: ["brandon", "thunder-bay"] },
  { slug: "brandon", name: "Brandon", province: "MB", region: "Westman", nearby: ["winnipeg", "regina"] },

  { slug: "saskatoon", name: "Saskatoon", province: "SK", region: "Central Saskatchewan", nearby: ["regina", "prince-albert"] },
  { slug: "regina", name: "Regina", province: "SK", region: "Southern Saskatchewan", nearby: ["saskatoon", "brandon"] },
  { slug: "prince-albert", name: "Prince Albert", province: "SK", region: "Northern Saskatchewan", nearby: ["saskatoon", "regina"] },

  { slug: "halifax", name: "Halifax", province: "NS", featured: true, region: "Halifax Regional Municipality", nearby: ["cape-breton", "moncton"] },
  { slug: "cape-breton", name: "Cape Breton", province: "NS", region: "Cape Breton Regional Municipality", nearby: ["halifax", "moncton"] },

  { slug: "moncton", name: "Moncton", province: "NB", region: "Southeastern New Brunswick", nearby: ["saint-john", "fredericton", "halifax"] },
  { slug: "saint-john", name: "Saint John", province: "NB", region: "Southern New Brunswick", nearby: ["moncton", "fredericton"] },
  { slug: "fredericton", name: "Fredericton", province: "NB", region: "Capital", nearby: ["moncton", "saint-john"] },

  { slug: "st-johns", name: "St. John's", province: "NL", region: "Avalon Peninsula", nearby: ["halifax", "charlottetown"] },
  { slug: "charlottetown", name: "Charlottetown", province: "PE", region: "Capital", nearby: ["halifax", "moncton"] },
];

const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

export function cityPath(slug: string): string {
  return `/cities/${slug}/`;
}

export function getCity(slug: string): CityRecord | undefined {
  return BY_SLUG.get(slug);
}

export function requireCity(slug: string): CityRecord {
  const city = BY_SLUG.get(slug);
  if (!city) {
    throw new Error(`Unknown city slug: ${slug}`);
  }
  return city;
}

export function allCitySlugs(): string[] {
  return CITIES.map((c) => c.slug);
}

export function citiesByProvince(): { province: ProvinceId; name: string; cities: CityRecord[] }[] {
  const order: ProvinceId[] = ["ON", "BC", "AB", "QC", "MB", "SK", "NS", "NB", "NL", "PE"];
  return order.map((province) => ({
    province,
    name: PROVINCE_NAMES[province],
    cities: CITIES.filter((c) => c.province === province),
  }));
}
