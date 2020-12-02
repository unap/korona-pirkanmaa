const fetch = require('node-fetch');
const jsdom = require('jsdom');

async function getData() {
  const resp = await fetch('https://www.tays.fi/fi-fi/sairaanhoitopiiri/Koronavirus_COVID19/Koronavirus_lukuina');
  const htmlString = await resp.text();
  const dom = new jsdom.JSDOM(htmlString);

  const rows = dom.window.document.querySelectorAll('#Content_Content_ncContent > table tbody tr');
  const data = [];

  for (let i = 1; i < rows.length; i++) {
    const tds = rows[i].querySelectorAll('td');
    const date = tds[0].textContent;
    const count = parseInt(tds[1].textContent, 10);
    data.push({ date, count });
  }

  return data.reverse();
}

exports.handler = async () => {
  const data = await getData();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
