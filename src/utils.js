const ROOT = 'https://xivapi.com'
const SERVER = 'Faerie';

export const REQ_DELAY = 1000 / 10; // 10 requests per second
export const ID_PATH = `${ROOT}/search?indexes=item&filters=ItemSearchCategory.ID%3E=9&columns=ID,Name&limit=250`;
export const MARKET_PATH = `${ROOT}/market/${SERVER}/item`;

export function formatNumber(num) {
  return `${num}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function delay() {
  return new Promise(resolve => {
    setTimeout(resolve, REQ_DELAY);
  })
}

export async function createMapping() {
  let cache = localStorage.getItem('mappingCache')
  if(cache !== null) {
    return new Map(JSON.parse(cache));
  } else {
    let mapping = new Map();
    let data = await (await fetch(ID_PATH)).json();

    while(data.Pagination.PageNext !== null) {
      data.Results.forEach(item => {
        mapping.set(item.Name, item.ID);
      });

      await delay(); // 10 requests/second
      data = await (await fetch(`${ID_PATH}&page=${data.Pagination.PageNext}`)).json()
    }

    localStorage.setItem('mappingCache', JSON.stringify([...mapping]));

    return mapping;
  }
}