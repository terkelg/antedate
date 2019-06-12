const antedate = require('../src');
const {join} = require('path');
const test = require('tape');

const content = str => /<div id="app".*>(.*)<\/div>/i.exec(str)[1]

const site = join(__dirname, 'site');

const app = async (routes, opts) => {
  let renders = await antedate(site, routes, opts);
  return renders.map(render => content(render.html))
}

test('standard', t => {
  t.is(typeof antedate, 'function');
  t.end();
});

test('return', async t => {
  let renders = await antedate(site, ['/'])
  t.is(Array.isArray(renders), true);
  t.is(renders[0].html.includes('/'), true);
  t.is(renders[0].route, '/');
  t.is(renders[0].path, 'index.html');
  t.end();
});

test('rendered content', async t => {
  let renders = await app('/');
  t.is(renders[0], '/');

  renders = await app(['/', '/about']);
  t.is(renders[0], '/about');
  t.is(renders[1], '/');
  t.end();
});

test('options - index', async t => {
  let renders = await antedate(site, ['/about', '/'], { index: true })
  t.is(Array.isArray(renders), true);
  t.is(renders[0].route, '/about');
  t.is(renders[0].path, '/about/index.html');
  t.is(renders[1].route, '/');
  t.is(renders[1].path, '/index.html');
  t.end();
});

test('options - script', async t => {
  let renders = await app(['/'], {
    headless: true,
    wait: 500,
    selector: '.prerender',
    script: () => {
      document.querySelector('#app').innerHTML = 'prerender'
    },
    decorator: html => html.toUpperCase()
  });
  t.is(renders[0], 'PRERENDER');
  t.end();
});
