#!/usr/bin/env node

const antedate = require('./index');
const {writer} = require('./util/fs');
const pkg = require('../package.json');
const eliminate = require('eliminate');
const {join} = require('path');
const sade = require('sade');

const prog = sade('antedate');
prog.version(pkg.version);

prog
  .command('render')
  .describe('Pre-render the routes given')
  .option('-s, --selector', 'Wait for the following selector before rendering')
  .option('-w, --wait', 'MS to wait before saving page. Happens after selector wait')
  .option('-r, --route', 'Prerender the route specified')
  .option('-d, --dir', 'Directory containing the static site', '.')
  .option('-o, --output', 'Output directory', './static')
  .example('render -r / -r /home -r /about')
  .example('render -r / -r /home -r /about --wait 400')
  .action(async opts => {
    try {
      const renders = await antedate(opts.dir, opts.route, opts);
      renders.forEach(async render => {
        const path = join(opts.output, render.path);
        await eliminate(path).catch(e => {});
        (await writer(path)).end('<!DOCTYPE html>'+render.html);
      });
    } catch (e) {
      console.error(e);
    }
  });

prog.parse(process.argv);
