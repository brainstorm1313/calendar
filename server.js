const express = require('express');
const webpack = require('webpack');
const proxy = require('express-http-proxy');

var cors = require('cors');

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const port = process.env.NODE_PORT || 3000;

const apiHost = process.env.API_HOST || 'http://localhost:9999';

app.use(cors());

app.use('/static', express.static('app/assets/public'));
app.use('/manifest.json', express.static('manifest.json'));

app.use(
    '/api/day',
    proxy(apiHost, {
        proxyReqPathResolver: req => {
            return `/day.php?date=${req.url.replace(/[^0-9]/g, '')}`;
        },
    })
);
app.use(
    '/api/reading',
    proxy(apiHost, {
        proxyReqPathResolver: req => {
            return `/bible.php?zachalo=${req.url.substring(1)}`;
        },
    })
);
app.use(
    '/api/readings',
    proxy(apiHost, {
        proxyReqPathResolver: req => {
            return `/day.php?date=${req.url.replace(/[^0-9]/g, '')}&readings=1`;
        },
    })
);
app.use(
    '/api/external-day',
    proxy('https://psmb.ru', {
        proxyReqPathResolver: req => {
            return `/?calendarDate=${req.url.substring(1)}`;
        },
    })
);
app.use(
    '/api/saint',
    proxy('https://psmb.ru', {
        proxyReqPathResolver: req => {
            return `https://psmb.ru/sv/${req.url.substring(1)}.html?json=1`;
        },
    })
);
if (isProd) {
    app.use('/', express.static('www'));
} else {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('./webpack.dev');
    const compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler));
    // NOTE: Only the client bundle needs to be passed to `webpack-hot-middleware`.
    app.use(webpackHotMiddleware(compiler));
}

app.listen(port, () => console.log(`=== Go to http://localhost:${port} ===`));
