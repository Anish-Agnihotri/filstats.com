![FilStats logo](https://i.imgur.com/MRheYxC.png)

FilStats is a quick hack to visualize the Filecoin Storage Deal market. It retrieves data from the [Filscan RPC endpoint](https://filscan.io/#/), runs a few calculations to display on the front-end, and tosses the data into a Redis cache with a 1hr ttl.

## Run locally
FilStats is built with [NextJS](https://nextjs.org/) (and their Serverless functions on Vercel).

1. Copy `.env.sample` to `.env` and add in your Redis URL.
2. Install dependencies with `yarn` and run with `yarn run dev`.

## Structure
This is a quick hack put together in 1-2hrs so nothing fancy:

1. `components/Layout` has a parent wrapper containing Meta + global styling.
2. `pages/index.js` has the data element boxes
3. `pages/api/collect.js` has the endpoint to either retrieve data from cache, or calculate and add to cache (first load).
4. `pages/api/meta.js` uses `puppeteer` to generate meta images with embedded $/GB values on the fly.

## License
MIT, go wild.
