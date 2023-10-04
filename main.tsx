import axios from 'axios';
import * as FormData from 'form-data';

import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

// Define the products URL
const productsUrl = 'https://telfar.net/products.json';

// we can choose to have loop over productsUrl and add all products' variants in cart and generate checkout, awaiting your response on this.
// I am going for this product for now.

// Define the product URL
const productUrl = 'https://telfar.net/collections/telfar-track/products/cropped-track-jacket-oxblood.js';

// Define the cart URL
const cartAddUrl = 'https://telfar.net/cart/add.js';

// Define the cart URL
const cartUrl = 'https://telfar.net/cart.js';

// Define the checkout URL
const hostsite = 'https://telfar.net';

// Function to monitor the product
//we can include argument here for product so we can call the function, best case is we include in products loop
async function monitorProduct() {
  try {
    // Fetch the product data
    const productResponse = await axios.get(productUrl);
    const productData = productResponse.data;
    const isAvailable = productResponse.data.available && productResponse.data.variants[0].available

    // Check if the main product is in stock and also first variant as we are only taking that under consideration for now (testing purpose)
    if (isAvailable) {
      console.log("..Stock is Available..");
      console.log("Adding to cart as it is available in stock...");
      // adding only first variant for product awaiting reply from joe
      const firstVariant = productData.variants[0].id
      const quantityOrdered = 1
      // Add the product to the cart
      console.log("Adding only first variant with quantity 1 : "+`${firstVariant}`)

      
      const jar = new CookieJar();
      const client = wrapper(axios.create({ jar }));

      const url = `https://telfar.net/cart/${firstVariant}:${quantityOrdered}`
      const {config} = await client.get(url);

      let cookies = {};
      config.jar.toJSON().cookies.forEach((cookie) => {
        cookies[cookie.key] = cookie.value || '';
      });
      const cookieString = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value || ''}`)
      .join('; ');



      const cartAddResponse = await client.post(cartAddUrl, {
        id: firstVariant,
        quantity: 1
      });
      const cartHeaders = cartAddResponse.headers
      const shop_id = cartHeaders['x-shopid']
      const cookies_add = cartHeaders['set-cookie']
      const cookieMap = cookies_add.reduce((map, cookie) => {
        const [key, value] = cookie.split('=');
        map[key.trim()] = decodeURIComponent(value);
        return map;
      }, {});
      
      const cart_ts = cookieMap['cart_ts'].split(';')[0]
      const cart_ver = cookieMap['cart_ver'].split(';')[0]
      const cartKey = cookieMap['cart'].split(';')[0]

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (cartAddResponse.status===200) {
        console.log("Adding to cart as it is available in stock...");
      }
      var cookieString1 = `_checkout_queue_checkout_token=${cookies['_checkout_queue_checkout_token']}; _checkout_queue_token=${cookies['_checkout_queue_token']}; _cmp_a=${cookies['_cmp_a']}; _landing_page=${cookies['_landing_page']}; _orig_referrer=${cookies['_orig_referrer']}; _s=${cookies['_s']}; _secure_session_id=${cookies['_secure_session_id']}; _shopify_m=${cookies['_shopify_m']}; _shopify_s=${cookies['_shopify_s']}; _shopify_tm=${cookies['_shopify_tm']}; _shopify_tw=${cookies['_shopify_tw']}; _shopify_y=${cookies['_shopify_y']}; _tracking_consent=${cookies['_tracking_consent']}; _y=${cookies['_y']}; cart=${cartKey}; cart_currency=${cookies['cart_currency']}; cart_sig=${cookies['cart_sig']}; cart_ts=${cart_ts}; cart_ver=${cart_ver}; localization=${cookies['localization']}; secure_customer_sig=${cookies['secure_customer_sig']};`
      jar.setCookie(cookieString1, 'https://telfar.net');

      var formData = new FormData();
      formData.append('updates', '1');
      formData.append('checkout', '');
      
      // Note : adding User-Agent, Cookie, Cache-Control is critical as we need to respect robot.txt and we are posing to be real user and not some bot trying to fetch all details.
      const cartResponse = await client.post(cartUrl, formData, {
        headers: {...formData.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
        'Cache-Control': 'no-cache',
      }
      });
      let html: string = cartResponse.data;

      let regex = /var DF_CHECKOUT_TOKEN = "(.*?)";/g;
      let match = regex.exec(html);
      let token = '';
      if (match) {
          token = match[1];

      } else {
          console.log("Token not found");
      }

      const newCheckoutUrl = hostsite +`/${shop_id}/checkouts/` + token
      // can also be found in response headers['tracked_start_checkout']
      //output requested for the evaluation
      //the output you were looking for
      console.log("Checkout URL : " + newCheckoutUrl);



    }
     else {
      console.log('Product is out of stock');
    }

    
  } catch (error) {
    console.error(error);
  }
}

// Call the function to start monitoring
monitorProduct();
