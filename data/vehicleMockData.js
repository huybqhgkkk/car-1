export const brands = [
  { id: "toyota", name: "Toyota", logo: "/images/resource/brand-1.png" },
  { id: "honda", name: "Honda", logo: "/images/resource/brand-2.png" },
  { id: "hyundai", name: "Hyundai", logo: "/images/resource/brand-3.png" },
  { id: "kia", name: "Kia", logo: "/images/resource/brand-4.png" },
  { id: "mazda", name: "Mazda", logo: "/images/resource/brand-5.png" },
  { id: "ford", name: "Ford", logo: "/images/resource/brand-3.png" },
  { id: "mercedes", name: "Mercedes-Benz", logo: "/images/resource/brand-4.png" },
  { id: "bmw", name: "BMW", logo: "/images/resource/brand-2.png" },
  { id: "audi", name: "Audi", logo: "/images/resource/brand-1.png" },
  { id: "vinfast", name: "VinFast", logo: "/images/resource/brand-6.png" },
  { id: "mitsubishi", name: "Mitsubishi", logo: "/images/resource/brand-5.png" },
  { id: "nissan", name: "Nissan", logo: "/images/resource/brand-6.png" },
];

export const models = {
  toyota: [
    { id: "camry", name: "Camry" },
    { id: "corolla-cross", name: "Corolla Cross" },
    { id: "fortuner", name: "Fortuner" },
    { id: "vios", name: "Vios" },
    { id: "innova", name: "Innova" },
    { id: "raize", name: "Raize" },
    { id: "yaris", name: "Yaris Cross" },
    { id: "land-cruiser", name: "Land Cruiser" },
  ],
  honda: [
    { id: "civic", name: "Civic" },
    { id: "crv", name: "CR-V" },
    { id: "city", name: "City" },
    { id: "hrv", name: "HR-V" },
    { id: "accord", name: "Accord" },
    { id: "brio", name: "Brio" },
  ],
  hyundai: [
    { id: "accent", name: "Accent" },
    { id: "tucson", name: "Tucson" },
    { id: "santafe", name: "Santa Fe" },
    { id: "creta", name: "Creta" },
    { id: "stargazer", name: "Stargazer" },
    { id: "elantra", name: "Elantra" },
  ],
  kia: [
    { id: "morning", name: "Morning" },
    { id: "seltos", name: "Seltos" },
    { id: "k3", name: "K3" },
    { id: "k5", name: "K5" },
    { id: "sorento", name: "Sorento" },
    { id: "carnival", name: "Carnival" },
  ],
  mazda: [
    { id: "cx5", name: "CX-5" },
    { id: "cx8", name: "CX-8" },
    { id: "mazda3", name: "Mazda3" },
    { id: "mazda6", name: "Mazda6" },
    { id: "cx3", name: "CX-3" },
    { id: "bt50", name: "BT-50" },
  ],
  ford: [
    { id: "ranger", name: "Ranger" },
    { id: "everest", name: "Everest" },
    { id: "territory", name: "Territory" },
    { id: "explorer", name: "Explorer" },
  ],
  mercedes: [
    { id: "c200", name: "C 200" },
    { id: "c300", name: "C 300" },
    { id: "e300", name: "E 300" },
    { id: "glc200", name: "GLC 200" },
    { id: "gla200", name: "GLA 200" },
    { id: "s450", name: "S 450" },
  ],
  bmw: [
    { id: "320i", name: "320i" },
    { id: "520i", name: "520i" },
    { id: "x1", name: "X1" },
    { id: "x3", name: "X3" },
    { id: "x5", name: "X5" },
    { id: "x7", name: "X7" },
  ],
  audi: [
    { id: "a4", name: "A4" },
    { id: "a6", name: "A6" },
    { id: "q3", name: "Q3" },
    { id: "q5", name: "Q5" },
    { id: "q7", name: "Q7" },
    { id: "e-tron", name: "e-tron" },
  ],
  vinfast: [
    { id: "vf8", name: "VF 8" },
    { id: "vf9", name: "VF 9" },
    { id: "vfe34", name: "VF e34" },
    { id: "lux-a", name: "Lux A2.0" },
    { id: "lux-sa", name: "Lux SA2.0" },
    { id: "fadil", name: "Fadil" },
  ],
  mitsubishi: [
    { id: "xpander", name: "Xpander" },
    { id: "outlander", name: "Outlander" },
    { id: "attrage", name: "Attrage" },
    { id: "pajero-sport", name: "Pajero Sport" },
    { id: "triton", name: "Triton" },
  ],
  nissan: [
    { id: "navara", name: "Navara" },
    { id: "xtrail", name: "X-Trail" },
    { id: "almera", name: "Almera" },
    { id: "kicks", name: "Kicks" },
  ],
};

export const yearsByModel = {
  // Toyota
  camry: ["2024", "2023", "2022", "2021", "2020", "2019"],
  "corolla-cross": ["2024", "2023", "2022", "2021", "2020"],
  fortuner: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"],
  vios: ["2024", "2023", "2022", "2021", "2020"],
  // Honda
  civic: ["2024", "2023", "2022", "2021", "2020"],
  crv: ["2024", "2023", "2022", "2021", "2020"],
  city: ["2024", "2023", "2022", "2021"],
  // Hyundai
  accent: ["2024", "2023", "2022", "2021", "2020"],
  tucson: ["2024", "2023", "2022"],
  santafe: ["2024", "2023", "2022", "2021"],
  // Default fallback
  _default: ["2024", "2023", "2022", "2021", "2020", "2019", "2018"],
};

export const versions = {
  "camry-2024": [
    { id: "2.0q", name: "2.0Q" },
    { id: "2.5q", name: "2.5Q" },
    { id: "2.5hv", name: "2.5HV (Hybrid)" },
  ],
  "camry-2023": [
    { id: "2.0q", name: "2.0Q" },
    { id: "2.5q", name: "2.5Q" },
  ],
  "civic-2024": [
    { id: "g", name: "G" },
    { id: "rs", name: "RS" },
    { id: "e-hev", name: "e:HEV RS" },
  ],
  "crv-2024": [
    { id: "e", name: "E" },
    { id: "g", name: "G" },
    { id: "l", name: "L" },
    { id: "rs", name: "RS" },
  ],
  "accent-2024": [
    { id: "1.4mt", name: "1.4 MT" },
    { id: "1.4at", name: "1.4 AT" },
    { id: "1.4at-dac-biet", name: "1.4 AT Đặc biệt" },
  ],
  "tucson-2024": [
    { id: "2.0-tieu-chuan", name: "2.0 Tiêu chuẩn" },
    { id: "2.0-dac-biet", name: "2.0 Đặc biệt" },
    { id: "1.6t-dac-biet", name: "1.6T Đặc biệt" },
  ],
  _default: [
    { id: "standard", name: "Tiêu chuẩn" },
    { id: "premium", name: "Cao cấp" },
    { id: "luxury", name: "Sang trọng" },
  ],
};

export const bodyTypes = [
  { id: "sedan", name: "Sedan" },
  { id: "suv", name: "SUV / Crossover" },
  { id: "hatchback", name: "Hatchback" },
  { id: "coupe", name: "Coupe" },
  { id: "convertible", name: "Convertible" },
  { id: "pickup", name: "Bán tải (Pickup)" },
  { id: "mpv", name: "MPV / Minivan" },
  { id: "wagon", name: "Wagon" },
  { id: "van", name: "Van" },
];

export const exteriorColors = [
  "Trắng", "Đen", "Bạc", "Xám", "Đỏ", "Xanh dương",
  "Xanh lá", "Nâu", "Vàng", "Cam", "Khác",
];

export const interiorColors = [
  "Đen", "Be (Kem)", "Nâu", "Xám", "Đỏ", "Trắng", "Khác",
];

export function getModels(brandId) {
  return models[brandId] || [];
}

export function getYears(modelId) {
  return yearsByModel[modelId] || yearsByModel._default;
}

export function getVersions(modelId, year) {
  const key = `${modelId}-${year}`;
  return versions[key] || versions._default;
}
