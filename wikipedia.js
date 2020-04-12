const { get, asJson } = require('simple-get-promise');
const debug = require('debug')('wikipedia');
const cached = require('@piuccio/cached-function');

const WIKIPEDIA_COMPANY_CACHE = './input/cache/wikipedia-companies.json';
const WIKIPEDIA_RAILWAY_CACHE = './input/cache/wikipedia-railways.json';
const REDIRECTS = {
  名古屋市: '名古屋市交通局',
  福岡市: '福岡市交通局',
  伊賀市: '伊賀鉄道',
};

function buildWikipediaUrl(title) {
  const searchParams = new URLSearchParams();
  searchParams.append('action', 'parse');
  searchParams.append('format', 'json');
  searchParams.append('page', REDIRECTS[title] || title);
  searchParams.append('prop', 'wikitext|langlinks');
  searchParams.append('redirects', 1);
  searchParams.append('disabletoc', 1);
  return `https://ja.wikipedia.org/w/api.php?${searchParams}`;
}

exports.getCompanyDetails = cached(WIKIPEDIA_COMPANY_CACHE, async function (companyName) {
  debug(`Company name: ${companyName}`);
  const url = buildWikipediaUrl(companyName);
  debug(`Fetch: ${url}`);
  const response = await asJson(await get(url));
  if (response.error) {
    debug(`Error: ${response.error.info}`);
    return {};
  }
  const lines = response.parse.wikitext['*'].split('\n');
  const details = {};
  let inTemplate = false;
  lines.forEach((line) => {
    if (line === '{{基礎情報 会社') {
      inTemplate = true;
    } else if (inTemplate) {
      if (line === '}}') {
        inTemplate = false;
      } else {
        const [before, after = ''] = line.split('=');
        const key = before.substring(1).trim(); // substring removes the leading '|'
        const [value] = after.trim().split('<');
        if (value) {
          details[MAPPING[key] || key] = value.trim();
        }
      }
    }
  });
  return details;
});

exports.getRailwayDetails = cached(WIKIPEDIA_RAILWAY_CACHE, async function (railwayName) {
  debug(`Railway name: ${railwayName}`);
  const url = buildWikipediaUrl(railwayName);
  debug(`Fetch: ${url}`);
  const response = await asJson(await get(url));
  if (response.error) {
    debug(`Error: ${response.error.info}`);
    return {};
  }
  const link = response.parse.langlinks.find((_) => _.lang === 'en');
  return link ? {
    englishName: link.title || link['*'],
    ...link,
  } : {};
});

const MAPPING = {
  '社名': 'japaneseName',
  '英文社名': 'englishName',
  '外部リンク': 'website',
};
