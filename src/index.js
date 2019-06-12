const fs = require('fs');
const sirv = require('sirv');
const {join} = require('path');
const {createServer} = require('http');
const puppeteer = require('puppeteer');

const expression = 'document.documentElement.outerHTML';

async function render(url, browser, opts) {
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle0'});
  opts.selector && await page.waitForSelector(opts.selector);
  opts.wait && await page.waitFor(opts.wait);
  opts.script && await page.evaluate(opts.script);
  const content = await page.evaluate(expression);
  await page.close();
  return content;
}

module.exports = async function(root, routes, opts = { headless: true }) {
  routes = [].concat(routes).sort(x => x === '/' ? 0 : -1);
  const decorator = opts.decorator || (html => html);
  const browser = await puppeteer.launch({
    headless: opts.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  let fn;
  let onNoMatch = (req, res) => ((req.path = '/'), fn(req, res, () => ((res.statusCode = 404), res.end())));
  let server = createServer((fn = sirv(root, {onNoMatch}))).listen();
  let url = `http://localhost:${server.address().port}`;

  const results = [];
  for (const route of routes) {
    const html = decorator(await render(url+route, browser, opts));
    const path = opts.index
      ? join(route, `index.html`)
      : join(`${route === '/' ? 'index' : route}.html`);
    results.push({html, route, path});
  }

  await browser.close();
  server.close();

  return results;
}
