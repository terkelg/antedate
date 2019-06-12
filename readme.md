# Antedate

> Pre-render static websites with ease.

Antedate is a simple API and CLI that uses Chrome pupeteer to pre-render client-side websites.
It automatically spins up a local server and renders each route provided.

## Install

```
$ npm install antedate
```


## Usage

You can either use the [API](#api) or [CLI](#cli).

```
$ antedate render -r /home -r /about
```

```js
import antedate from 'antedate'

const routes = ['/', '/about', '/contact'];
const site = './site';

await antedate(site, routes);
// => [
//      { html: '....', route: '/', path: '/index.html' },
//      { html: '....', route: '/about', path: '/about.html' }
//      ...
// ]

await antedate(site, routes, { headless: false, dirs: true });
// => [
//      { html: '....', route: '/', path: '/index.html' },
//      { html: '....', route: '/about', path: '/about/index.html' }
//      ...
// ]
```


## CLI

The module also comes with an CLI 

```
  Description
    Pre-render the routes given

  Usage
    $ antedate render [options]

  Options
    -s, --selector    Wait for the following selector before rendering
    -w, --wait        MS to wait before saving page. Happens after selector wait
    -r, --route       Prerender the route specified
    -d, --dir         Directory containing the static site  (default .)
    -o, --output      Output directory  (default ./static)
    -h, --help        Displays this message

  Examples
    $ antedate render -r /home -r /about
```


## API

### antedate(root, routes, opts?)
Returns: `Array`

Returns a rendering function that will optionally accept a [`date`](#date) value as its only argument.

#### root
Type: `String`<br>
Required: `true`

Path to the directory containing the static site to pre-render. Antedate automatically starts a local server.

#### routes
Type: `Array`<br>
Required: `true`

Array of routes to be rendered. The root `/` is always rendered last.
E.g. `['/about', '/contact', '/']`.

#### opts
Type: `Object`<br>
Required: `false`

##### headless
Type: `Boolean`<br>
Default: `false`

Wether to run puppeteer in headless mode.

##### selector
Type: `String`<br>
Default: ``

Wait for `selector` to appear before rendering the site. E.g. `body.prerender`.

##### wait
Type: `Number`<br>
Default: ``

Milliseconds to before rendering the site. 
> **OBS:** This happens after the [selector](#selector) option if both are provided.

##### script
Type: `Function`<br>
Default: ``

A callback function to execute on the page before the rendering happens. 

##### decorator
Type: `Function`<br>
Default: ``

A decorator function that allows you to manupulate the rendered HTML string.

```js
await antedate(site, routes, { decorator: html => html.toUpperCase()});
```


## Credit

The idea and logic is based on code from [PWA](https://github.com/lukeed/pwa) by [Luke Edwards](https://github.com/lukeed). See original implementation in [build.js](https://github.com/lukeed/pwa/blob/master/packages/cli/lib/build.js#L114) in [@pwa/cli](https://github.com/lukeed/pwa/blob/master/packages/cli).


## License

[MIT License](LICENSE) @ [Terkel Gjervig](https://terkel.com)