const SPECIAL_COUNTRY_CODES: Record<string, string> = {
  England: 'gb-eng',
  Scotland: 'gb-sct',
  Wales: 'gb-wls',
  'Northern Ireland': 'gb-nir',
  Spain: 'es',
  France: 'fr',
  Germany: 'de',
  Italy: 'it',
  Portugal: 'pt',
  Netherlands: 'nl',
  Belgium: 'be',
  Brazil: 'br',
  Argentina: 'ar',
  Uruguay: 'uy',
  Colombia: 'co',
  Norway: 'no',
  Sweden: 'se',
  Denmark: 'dk',
  Croatia: 'hr',
  Serbia: 'rs',
  Slovenia: 'si',
  Poland: 'pl',
  Austria: 'at',
  Switzerland: 'ch',
  Turkey: 'tr',
  Greece: 'gr',
  Nigeria: 'ng',
  Senegal: 'sn',
  Ghana: 'gh',
  Cameroon: 'cm',
  'Ivory Coast': 'ci',
  "Côte d'Ivoire": 'ci',
  Morocco: 'ma',
  Algeria: 'dz',
  Egypt: 'eg',
  Japan: 'jp',
  'South Korea': 'kr',
  Korea: 'kr',
  Australia: 'au',
  Canada: 'ca',
  'United States': 'us',
  USA: 'us',
  Mexico: 'mx',
  Ecuador: 'ec',
  Chile: 'cl',
  Ukraine: 'ua',
  Czechia: 'cz',
  'Czech Republic': 'cz',
  Slovakia: 'sk',
  Hungary: 'hu',
  Romania: 'ro',
  Georgia: 'ge',
  Israel: 'il',
};

export function getCountryFlagUrl(countryName: string): string {
  if (!countryName) return '';

  const cleanName = countryName.trim();

  const code =
    SPECIAL_COUNTRY_CODES[cleanName] ||
    SPECIAL_COUNTRY_CODES[cleanName.replace(/\s+/g, ' ')];

  if (code) {
    return `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
  }

  return 'https://flagcdn.com/w80/un.png';
}