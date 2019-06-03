import { MARKET_PATH, REQ_DELAY, delay, createMapping, formatNumber } from './utils';
import './style.css';

(async function() {
  let mapping = await createMapping();
  let total = 0;
  document.querySelector('.item-list__header').innerHTML += `<li class="item-list__header__cell__spacer"></li><li class="item-list__header__cell item-list__header__retainer--quantity">Price</li>`;

  for(let row of document.querySelectorAll('.sys_item_row')) {
    let name = row.querySelector('.item-list__name a').textContent;
    if(!mapping.has(name)) {
      row.innerHTML += `<p class="item-list__number">&mdash;</p>`;
    } else {
      let hq = !!row.querySelector('.ic_item_quality');
      let quantity = parseInt(row.querySelector('.item-list__number').textContent, 10);
      let market = await (await fetch(`${MARKET_PATH}/${mapping.get(name)}`)).json();
      let price = market.Prices.find(price => price.IsHQ === hq);
      
      total +=  price == undefined ? 0 : price.PricePerUnit * quantity;
      price = price == undefined ? '&mdash;' : formatNumber(price.PricePerUnit * quantity);
      row.innerHTML += `<p class="item-list__number">${price} <img src="https://img.finalfantasyxiv.com/lds/h/c/uMCAYmu8y-YJlt4chlkwATrxFo.png" alt="" /></p>`;
  
      await delay();
    }
  }

  console.log(`Total market value: ${formatNumber(total)} gil`);
})();