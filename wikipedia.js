const { get, asJson } = require('simple-get-promise');
const debug = require('debug')('wikipedia');
const cached = require('@piuccio/cached-function');

const WIKIPEDIA_COMPANY_CACHE = './input/cache/wikipedia-companies.json';

function buildWikipediaUrl(title) {
  const searchParams = new URLSearchParams();
  searchParams.append('action', 'parse');
  searchParams.append('format', 'json');
  searchParams.append('page', title);
  searchParams.append('prop', 'wikitext');
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
        const value = after.trim();
        if (after) {
          details[MAPPING[key] || key] = after;
        }
      }
    }
  });
  return details;
});

const MAPPING = {
  '社名': 'japaneseName',
  '英文社名': 'englishName',
  '外部リンク': 'website',
};
