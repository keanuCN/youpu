import fs from 'node:fs';
import path from 'node:path';

type PriceEntry = { value?: number; min?: number; max?: number; currency: string; source: string };

const root = path.resolve(import.meta.dirname, '../..');
const prices: Record<string, PriceEntry> = {
  // Salomon 2026-27 US official product listings
  'salomon-abstract-2027': { value: 549.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/sports/snowboarding/snowboards' },
  'salomon-huck-knife-2027': { value: 579.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/sports/snowboarding/snowboards' },
  'salomon-assassin-2026': { value: 649.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/sports/snowboarding/snowboards' },
  'salomon-assassin-pro-2027': { value: 699.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/sports/snowboarding/snowboards' },
  // Jones 2027 women's official US collection
  'jones-dream-weaver-2-0-2027': { value: 549.95, currency: 'USD', source: 'https://www.jonessnowboards.com/collections/womens-snowboards' },
  'jones-twin-sister-2027': { value: 599.95, currency: 'USD', source: 'https://www.jonessnowboards.com/collections/womens-snowboards' },
  // Official regional MSRP
  'capita-birds-of-a-feather-2027': { value: 729.95, currency: 'CAD', source: 'https://capitasnowboarding.com/en-ca/products/capita-birds-of-a-feather-womens-snowboard-2027' },
  'never-summer-proto-t3-fr-2027': { value: 719.99, currency: 'USD', source: 'https://neversummer.com/products/mens-proto-t3-fr-snowboard' },
  'burton-process-flying-v-2027': { value: 549.95, currency: 'USD', source: 'https://www.burton.com/en-us/products/mens-burton-process-flying-v-snowboard-107121' },
  'burton-talent-scout-2027': { value: 549.95, currency: 'USD', source: 'https://www.burton.com/en-us/products/womens-burton-talent-scout-camber-snowboard-132181' },
  'burton-good-company-2027': { value: 449.95, currency: 'USD', source: 'https://www.burton.com/en-us/products/burton-good-company-camber-snowboard-235951' },
  'decathlon-all-road-900-2026': { value: 279.99, currency: 'GBP', source: 'https://www.decathlon.co.uk/p/adults-snowboarding-board-for-slope-and-freeride-all-road-900/332434/c314c29m8643399' },
  'decathlon-park-ride-500-2026': { value: 199.99, currency: 'GBP', source: 'https://www.decathlon.co.uk/p/mens-all-mountain-and-freestyle-snowboard-park-and-ride-500-green/306010/c49c1m8938817' },
  'decathlon-snb-100-2026': { value: 149.99, currency: 'CAD', source: 'https://www.decathlon.ca/en/p/all-mountain-and-freestyle-snowboard-snb-100/309522/c193m8660203' },
  'bc-stream-r2-2026': { value: 101200, currency: 'JPY', source: 'https://www.follows.co.jp/SHOP/1213bc-r2.html' },
  'bc-stream-riders-spec-dr-2027': { value: 129800, currency: 'JPY', source: 'https://www.follows.co.jp/SHOP/sn-sb-bc-004.html' },
  'bc-stream-rx-2027': { value: 147400, currency: 'JPY', source: 'https://joint.shop-pro.jp/?pid=190349875' },
  'gray-despe-wood-2027': { value: 93500, currency: 'JPY', source: 'https://graysnowboards.co.jp/product/' },
  'gray-desperado-2024': { value: 108900, currency: 'JPY', source: 'https://graysnowboards.co.jp/product2324/' },
  'gray-desperado-ti-type-r-2027': { min: 198000, max: 209000, currency: 'JPY', source: 'https://graysnowboards.co.jp/product/' },
  'gray-dsprd-ti-iz-2027': { value: 154000, currency: 'JPY', source: 'https://graysnowboards.co.jp/product/' },
  'gray-dsprd-ti-type-x-ver-s-2027': { value: 198000, currency: 'JPY', source: 'https://graysnowboards.co.jp/product/' },
  'gray-epic-2027': { value: 126500, currency: 'JPY', source: 'https://graysnowboards.co.jp/product/' },
  'gray-lovebuzz-58-2027': { value: 93500, currency: 'JPY', source: 'https://graysnowboards.co.jp/product/' },
  'gray-prodigy-2027': { value: 126500, currency: 'JPY', source: 'https://graysnowboards.co.jp/product/' },
  'gray-sonicalmach-lt-2027': { value: 93500, currency: 'JPY', source: 'https://graysnowboards.co.jp/product/' },
  'gray-sonicalmach-lt-ver-c-2027': { value: 99000, currency: 'JPY', source: 'https://graysnowboards.co.jp/product/' },
  'gray-tycoon-type-s-iz-2027': { value: 198000, currency: 'JPY', source: 'https://graysnowboards.co.jp/product/' },
  'ogasaka-ct-2026': { min: 114400, max: 116600, currency: 'JPY', source: 'https://www.ogasaka-snowboard.com/product_25_03_ct.html' },
  'ogasaka-fc-2026': { min: 126500, max: 128700, currency: 'JPY', source: 'https://www.ogasaka-snowboard.com/product_25_08_fc.html' },
  'ogasaka-fc-s-2026': { min: 129800, max: 132000, currency: 'JPY', source: 'https://www.ogasaka-snowboard.com/product_25_09_fc-s.html' },
  'ogasaka-shin-2026': { value: 121000, currency: 'JPY', source: 'https://www.ogasaka-snowboard.com/product_25_12_shin-160.html' },

  // Nitro 2026-27 official EU prices
  'nitro-bianca-tls-plus-2027': { value: 549.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },
  'nitro-sentinel-boa-2027': { value: 329.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },
  'nitro-sentinel-tls-2027': { value: 279.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },
  'nitro-tangent-tls-2027': { value: 239.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },
  'nitro-team-boa-2027': { value: 529.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },
  'nitro-team-pro-mk-tls-2027': { value: 529.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },
  'nitro-team-tls-2027': { value: 479.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },
  'nitro-team-tls-wide-2027': { value: 479.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },
  'nitro-venture-boa-2027': { value: 399.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },
  'nitro-venture-pro-tls-2027': { value: 399.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },
  'nitro-venture-step-on-tls-2027': { value: 489.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },
  'nitro-venture-tls-2027': { value: 349.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/boots-26-27' },

  // Nitro official EU 2026-27 board listings
  'nitro-alternator-2027': { value: 599.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/snowboards-mountain-26-27/products/alternator-snowboard-1' },
  'nitro-beast-2026': { value: 729.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/products/beast-snowboard' },
  'nitro-optisym-2027': { value: 499.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/it/collections/all-26-27/products/optisym-snowboard-1' },
  'nitro-t1-2027': { value: 579.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/products/t1-snowboard-1' },

  // Burton 2027 US official collection prices
  'burton-cartel-re-flex-2027': { value: 299.95, currency: 'USD', source: 'https://www.burton.com/en-us/collections/snowboard-bindings' },
  'burton-cartel-x-re-flex-2027': { value: 349.95, currency: 'USD', source: 'https://www.burton.com/en-us/collections/snowboard-bindings' },
  'burton-freestyle-re-flex-2027': { value: 189.95, currency: 'USD', source: 'https://www.burton.com/en-us/collections/strap-snowboard-bindings' },
  'burton-genesis-re-flex-2027': { value: 399.95, currency: 'USD', source: 'https://www.burton.com/en-us/collections/snowboard-bindings' },
  'burton-lexa-x-est-2027': { value: 379.95, currency: 'USD', source: 'https://www.burton.com/en-us/collections/snowboard-bindings' },
  'burton-mission-re-flex-2027': { value: 249.95, currency: 'USD', source: 'https://www.burton.com/en-us/collections/mens-snowboard-bindings' },
  'burton-step-on-genesis-re-flex-2027': { value: 399.95, currency: 'USD', source: 'https://www.burton.com/en-us/collections/snowboard-bindings' },
  'burton-step-on-re-flex-2027': { value: 279.95, currency: 'USD', source: 'https://www.burton.com/en-us/collections/snowboard-bindings' },

  // Salomon 2026 US official binding collection
  'salomon-district-binding-2026': { value: 299.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/collection/winter-sports/snowboarding/bindings' },
  'salomon-district-pro-binding-2026': { value: 319.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/collection/winter-sports/snowboarding/bindings' },
  'salomon-edb-binding-2026': { value: 249.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/collection/winter-sports/snowboarding/bindings' },
  'salomon-edb-prime-binding-2026': { value: 279.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/collection/winter-sports/snowboarding/bindings' },
  'salomon-highlander-binding-2026': { value: 379.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/collection/winter-sports/snowboarding/bindings' },
  'salomon-hologram-binding-2026': { value: 359.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/collection/winter-sports/snowboarding/bindings' },
  'salomon-pact-binding-2026': { value: 159.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/collection/winter-sports/snowboarding/bindings' },
  'salomon-rhythm-binding-2026': { value: 189.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/collection/winter-sports/snowboarding/bindings' },

  // Nidecker / Flow 2026-27 US official listing prices
  'flow-fenix-binding-2027': { value: 269.95, currency: 'USD', source: 'https://www.nidecker.com/collections/men-bindings' },
  'flow-fuse-binding-2026': { value: 319.95, currency: 'USD', source: 'https://www.nidecker.com/collections/men-bindings' },
  'flow-fuse-hybrid-binding-2026': { value: 319.95, currency: 'USD', source: 'https://www.nidecker.com/collections/men-bindings' },
  'flow-nexus-binding-2027': { value: 209.95, currency: 'USD', source: 'https://www.nidecker.com/collections/men-bindings' },
  'flow-nx2-carbon-binding-2027': { value: 479.95, currency: 'USD', source: 'https://www.nidecker.com/collections/men-bindings' },
  'flow-nx2-hybrid-binding-2027': { value: 399.95, currency: 'USD', source: 'https://www.nidecker.com/collections/men-bindings' },
  'nidecker-kaon-plus-2026': { value: 279.95, currency: 'USD', source: 'https://www.nidecker.com/collections/men-bindings' },
  'nidecker-lt-supermatic-2026': { value: 479.95, currency: 'USD', source: 'https://www.nidecker.com/collections/men-bindings' },
  'nidecker-og-supermatic-2026': { value: 429.95, currency: 'USD', source: 'https://www.nidecker.com/collections/men-bindings' },
  'nidecker-orbit-binding-2027': { value: 249.95, currency: 'USD', source: 'https://www.nidecker.com/collections/men-bindings' },

  // Rome 2026-27 US official collection prices
  'rome-390-boss-aw-binding-2027': { value: 349.95, currency: 'USD', source: 'https://romesnowboards.com/collections/snowboard-bindings' },
  'rome-390-boss-fw-binding-2027': { value: 369.95, currency: 'USD', source: 'https://romesnowboards.com/collections/snowboard-bindings' },
  'rome-brass-aw-binding-2027': { value: 349.95, currency: 'USD', source: 'https://romesnowboards.com/collections/snowboard-bindings' },
  'rome-katana-aw-binding-2027': { value: 399.95, currency: 'USD', source: 'https://romesnowboards.com/collections/snowboard-bindings' },
  'rome-katana-aw-fase-binding-2027': { value: 429.95, currency: 'USD', source: 'https://romesnowboards.com/collections/snowboard-bindings' },
  'rome-katana-aw-pro-fase-binding-2027': { value: 499.95, currency: 'USD', source: 'https://romesnowboards.com/collections/all/bindings' },
  'rome-katana-fw-pro-binding-2027': { value: 469.95, currency: 'USD', source: 'https://romesnowboards.com/collections/snowboard-bindings' },
  'rome-volt-fase-binding-2027': { value: 329.95, currency: 'USD', source: 'https://romesnowboards.com/collections/snowboard-bindings' },

  // COSONE official shop current price
  'cosone-step-on-binding-2026': { value: 2599, currency: 'CNY', source: 'https://www.cos1.net/' },

  // Nitro 2026-27 official EU bindings collection
  'nitro-fate-binding-2027': { value: 299.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/bindings-26-27' },
  'nitro-one-binding-2027': { value: 299.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/bindings-26-27' },
  'nitro-phantom-binding-2027': { value: 399.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/bindings-26-27' },
  'nitro-phantom-plus-binding-2027': { value: 439.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/bindings-26-27' },
  'nitro-poison-binding-2027': { value: 349.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/bindings-26-27' },
  'nitro-rambler-binding-2027': { value: 239.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/bindings-26-27' },
  'nitro-talent-binding-2027': { value: 179.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/bindings-26-27' },
  'nitro-team-binding-2027': { value: 319.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/bindings-26-27' },
  'nitro-team-pro-binding-2027': { value: 359.9, currency: 'EUR', source: 'https://www.nitrosnowboards.com/collections/bindings-26-27' },

  // Jones 2026 US official binding collection
  'jones-mercury-binding-2026': { value: 369.95, currency: 'USD', source: 'https://www.jonessnowboards.com/collections/mens-traditional-two-strap-bindings' },
  'jones-mercury-fase-binding-2026': { value: 379.95, currency: 'USD', source: 'https://www.jonessnowboards.com/collections/men-best-sellers' },
  'jones-orion-binding-2026': { value: 329.95, currency: 'USD', source: 'https://www.jonessnowboards.com/collections/mens-traditional-two-strap-bindings' },

  // Union 2027 official North American shop listings
  'union-atlas-2027': { value: 399.95, currency: 'USD', source: 'https://unionbindingcompany.com/products/union-atlas-mens-snowboard-binding-2027' },
  'union-atlas-pro-2027': { value: 499.95, currency: 'USD', source: 'https://unionbindingcompany.com/products/union-atlas-pro-unisex-snowboard-binding-2027' },
  'union-force-2027': { value: 349.95, currency: 'USD', source: 'https://unionbindingcompany.com/products/union-force-mens-snowboard-binding-2027' },
  'union-force-classic-2027': { value: 249.95, currency: 'USD', source: 'https://unionbindingcompany.com/products/union-force-classic-mens-snowboard-binding-2027' },
  'union-legacy-2027': { value: 349.95, currency: 'USD', source: 'https://unionbindingcompany.com/en-ca/products/union-legacy-womens-snowboard-binding-2027' },
  'union-trilogy-2027': { value: 46200, currency: 'JPY', source: 'https://jp.unionbindingcompany.com/products/union-trilogy-womens-snowboard-binding-2027' },
  'union-ultra-2027': { value: 329.95, currency: 'USD', source: 'https://unionbindingcompany.com/products/union-ultra-womens-snowboard-binding-2027' },
  'decathlon-snb-500-binding-2026': { value: 170, currency: 'CAD', source: 'https://www.decathlon.ca/en/p/snowboard-bindings-snb-500/336603/c227m8668654' },

  // FLUX official Japan shop 2026-27 JPY retail prices
  'flux-cv-2027': { value: 55000, currency: 'JPY', source: 'https://flux-bindings.com/en/collections/bindings2627/' },
  'flux-ds-2027': { value: 49500, currency: 'JPY', source: 'https://flux-bindings.com/en/collections/bindings2627/' },
  'flux-gs-2026': { value: 41800, currency: 'JPY', source: 'https://flux-bindings.com/en/collections/bindings' },
  'flux-xf-2026': { value: 49500, currency: 'JPY', source: 'https://flux-bindings.com/en/collections/bindings' },
  'flux-xv-2026': { value: 73700, currency: 'JPY', source: 'https://flux-bindings.com/en/collections/bindings2627/' },

  // Alpine ski official US catalogue prices
  'atomic-redster-q7-2026': { value: 1030, currency: 'USD', source: 'https://www.atomic.com/en-us/collections/ato-featured-family-redster?page=1' },
  'atomic-redster-q7-8-2026': { value: 1030, currency: 'USD', source: 'https://www.atomic.com/en-us/collections/ato-featured-family-redster?page=1' },
  'atomic-redster-q9-2026': { value: 1385, currency: 'USD', source: 'https://www.atomic.com/en-us/collections/ato-featured-family-redster?page=1' },
  'atomic-redster-q9-8-2026': { value: 1385, currency: 'USD', source: 'https://www.atomic.com/en-us/collections/ato-featured-family-redster?page=1' },
  'atomic-redster-s9-2026': { value: 1385, currency: 'USD', source: 'https://www.atomic.com/en-us/collections/ato-featured-family-redster?page=1' },
  'rossignol-soul-102-2027': { value: 799.95, currency: 'USD', source: 'https://www.rossignol.com/us-en/sports/alpine-ski/skis' },
  'rossignol-forza-50-cam-2026': { value: 899.95, currency: 'USD', source: 'https://www.rossignol.com/us-en/sports/alpine-ski/skis' },
  'rossignol-hero-elite-lt-ti-2027': { value: 1349.95, currency: 'USD', source: 'https://www.rossignol.com/us-en/sports/alpine-ski/skis' },
  'rossignol-hero-master-lt-r22-2027': { value: 1429.95, currency: 'USD', source: 'https://www.rossignol.com/us-en/sports/alpine-ski/skis' },
  'salomon-qst-106-2027': { value: 849.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/men/shopby/4_57065' },
  'salomon-stance-84-2027': { value: 799.95, currency: 'USD', source: 'https://www.salomon.com/en-us/c/men/shopby/4_57065' },
  'salomon-mtn-86-carbon-2027': { value: 749.95, currency: 'USD', source: 'https://www.salomon.com/en-us/product/mtn-86-carbon-li8310' },
  'salomon-qst-blank-2027': { value: 899.95, currency: 'USD', source: 'https://www.salomon.com/en-us/product/s-lab-qst-blank-li7032' },
  'salomon-qst-92-2027': { value: 699.99, currency: 'USD', source: 'https://www.sportchek.ca/en/pdp/salomon-qst-92-men-s-skis-2024-78581872f.html' },
  'salomon-qst-98-2027': { value: 649.95, currency: 'USD', source: 'https://www.evo.com/products/238117-salomon-qst-98-skis-2024' },

  // HEAD ski sets and catalog prices, matched by model year and article number
  'head-e-sl-pro-2026': { value: 1310, currency: 'EUR', source: 'https://www.head.com/fr_MC/product/worldcup-rebels-e-sl-pro-313236-set' },
  'head-e-slr-2026': { value: 829.9, currency: 'EUR', source: 'https://preisvergleich.heise.de/head-worldcup-rebels-e-slr-pr-11-gw-inkl-bindung-modell-2025-2026-313365-a3617720.html' },
  'head-easy-joy-r-2026': { value: 401, currency: 'EUR', source: 'https://www.snow-concept.com/en/head-easy-joy-r-ski-set-joy-9-gw-slr-bindings-white-women-x27-s.html' },
  'head-shape-e-v5-2026': { value: 725, currency: 'USD', source: 'https://img1.wsimg.com/blobby/go/3c75046d-27b1-48f2-8c85-4fcee384abf2/downloads/383a3ba9-007e-442e-a92d-fdc0140aa976/HEAD_RETAIL%20PRICING_FOR%20PRINT_12.20_01%202_combi.pdf?ver=1744650386194' },
  'head-shape-v2-2026': { value: 82500, currency: 'JPY', source: 'https://steep.jp/wp-content/uploads/2025/05/HEAD_UserCatalog2025-26_Web.pdf' },
  'head-shape-v2-r-2026': { value: 450, currency: 'EUR', source: 'https://esqui-outlet.com/en/skis/4650-head-shape-v2-r-amt-ski-set-316225-pr-10-gw-bindings-114528.html' },
  'head-supershape-e-magnum-2026': { value: 181500, currency: 'JPY', source: 'https://steep.jp/wp-content/uploads/2025/05/HEAD_UserCatalog2025-26_Web.pdf' },
  // Nordica 2026-27 suggested retail prices from current authorized ski retailers
  'nordica-enforcer-104-2027': { value: 899.99, currency: 'USD', source: 'https://www.ski-depot.com/collections/nordica-skis' },
  'nordica-enforcer-89-2027': { value: 749.99, currency: 'USD', source: 'https://www.ski-depot.com/collections/nordica-skis' },
  'nordica-enforcer-94-2027': { value: 799.99, currency: 'USD', source: 'https://www.ski-depot.com/collections/nordica-skis' },
  'nordica-enforcer-99-2027': { value: 849.99, currency: 'USD', source: 'https://www.ski-depot.com/collections/nordica-skis' },
  'nordica-santa-ana-102-2027': { value: 899.99, currency: 'USD', source: 'https://www.skiessentials.com/products/2026-nordica-santa-ana-102-women-s-skis-0a548500' },
  'rossignol-forza-40-ca-xpress-2027': { value: 544, currency: 'EUR', source: 'https://www.rossignol.com/nl-en/mens-forza-40-ca-xpress-piste-skis-RAPPX05000157.html' },
  'rossignol-experience-76-2026': { value: 549.95, currency: 'CAD', source: 'https://www.rossignol.com/ca-en/experience-76-xpress-RAMFT04000152.html' },

  // Decathlon official UK price
  'decathlon-snb-500-ziprotect-jacket-2026': { value: 129.99, currency: 'GBP', source: 'https://www.decathlon.co.uk/p/mens-warm-and-durable-snowboard-jacket-snb-500-ziprotect-camel-and-black/350525/c152c382m8881806' },
};

let updated = 0;
const missing: string[] = [];
for (const [slug, entry] of Object.entries(prices)) {
  const dirs = ['snowboard', 'snowboard-binding', 'snowboard-boot', 'skis', 'skiing-apparel'];
  const file = dirs.map((dir) => path.join(root, 'data', dir, `${slug}.yaml`)).find(fs.existsSync);
  if (!file) { missing.push(slug); continue; }
  let source = fs.readFileSync(file, 'utf8');
  const min = entry.min ?? entry.value;
  const max = entry.max ?? entry.value;
  if (min === undefined || max === undefined) { missing.push(`${slug}: no amount`); continue; }
  const priceBlock = `price:\n  min: ${min}\n  max: ${max}\n  currency: ${entry.currency}`;
  if (/^price:\s*$/m.test(source)) source = source.replace(/^price:\r?\n[\s\S]*?(?=^specs:)/m, `${priceBlock}\n`);
  else source = source.replace(/^specs:\s*$/m, `${priceBlock}\nspecs:`);
  const urlLine = /^([ \t]*origin_url:\s*[^\r\n]+\r?\n)/m;
  if (/^\s*snapshot_url:/m.test(source)) source = source.replace(/^([ \t]*snapshot_url:)\s*[^\r\n]*/m, `$1 ${entry.source}`);
  else source = source.replace(urlLine, `$1  snapshot_url: ${entry.source}\n`);
  fs.writeFileSync(file, source, 'utf8');
  updated++;
}
console.log(`Updated ${updated} products; skipped products with existing prices; unresolved slugs: ${missing.join(', ') || 'none'}`);
