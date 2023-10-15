//import necessary npm packages
import axios from 'axios';
import * as FormData from 'form-data';
import * as cheerio from 'cheerio';
// Import necessary modules for handling cookies
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
    console.log("Checking if stock is available or not...");
    const isAvailable = productResponse.data.available && productResponse.data.variants[0].available

    // Check if the main product is in stock and also first variant as we are only taking that under consideration for now (testing purpose)
    if (isAvailable) {
      console.log("...Stock is Available");
      console.log("Adding to cart as it is available in stock...");
      // Get the ID of the first variant and set the quantity to 1
      const firstVariant = productData.variants[0].id
      const quantityOrdered = 1
      
      console.log("Adding only first variant with quantity 1 : "+`${firstVariant}`)

      // Create a cookie jar and a client with cookie support
      const jar = new CookieJar();
      // wrapping axios with jar , now any changes to jar for cookies will be available to all the following axios requests, easier to keep track of all the cookies used
      const client = wrapper(axios.create({ jar }));

      const url = `https://telfar.net/cart/${firstVariant}:${quantityOrdered}`
      const {config} = await client.get(url);
      //using cookies to store in it which we find available cookies from the cart/ url
      let cookies = {};
      //addings values in cookies
      config.jar.toJSON().cookies.forEach((cookie) => {
        cookies[cookie.key] = cookie.value || '';
      });
      const cookieString = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value || ''}`)
      .join('; ');


      // Add the product to the cart
      const cartAddResponse = await client.post(cartAddUrl, {
        id: firstVariant,
        quantity: quantityOrdered
      });
      const cartHeaders = cartAddResponse.headers
      const shop_id = cartHeaders['x-shopid']
      const cookies_add = cartHeaders['set-cookie']
      //using cookieMap to find available cookies from the cart/add/ url // somehow we are missing some cookies from cart/ so we need to use cart/add, could be good-first-issue for new dev to figure this out
      const cookieMap = cookies_add.reduce((map, cookie) => {
        const [key, value] = cookie.split('=');
        map[key.trim()] = decodeURIComponent(value);
        return map;
      }, {});
      // extracting various other required params and storing in separate variables as needed
      const cart_ts = cookieMap['cart_ts'].split(';')[0]
      const cart_ver = cookieMap['cart_ver'].split(';')[0]
      const cartKey = cookieMap['cart'].split(';')[0]

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (cartAddResponse.status===200) {
        console.log("Adding to cart as it is available in stock...");
      }
      var cookieString1 = `_checkout_queue_checkout_token=${cookies['_checkout_queue_checkout_token']}; _checkout_queue_token=${cookies['_checkout_queue_token']}; _cmp_a=${cookies['_cmp_a']}; _landing_page=${cookies['_landing_page']}; _orig_referrer=${cookies['_orig_referrer']}; _s=${cookies['_s']}; _secure_session_id=${cookies['_secure_session_id']}; _shopify_m=${cookies['_shopify_m']}; _shopify_s=${cookies['_shopify_s']}; _shopify_tm=${cookies['_shopify_tm']}; _shopify_tw=${cookies['_shopify_tw']}; _shopify_y=${cookies['_shopify_y']}; _tracking_consent=${cookies['_tracking_consent']}; _y=${cookies['_y']}; cart=${cartKey}; cart_currency=${cookies['cart_currency']}; cart_sig=${cookies['cart_sig']}; cart_ts=${cart_ts}; cart_ver=${cart_ver}; localization=${cookies['localization']}; secure_customer_sig=${cookies['secure_customer_sig']};`
      // Add the cookies to the cookie jar
      jar.setCookie(cookieString1, 'https://telfar.net');

      // Create a FormData object for the cart request
      var formData = new FormData();
      formData.append('updates', '1');
      formData.append('checkout', '');
      
      // Note : adding User-Agent, Cookie, Cache-Control is critical as we need to respect robot.txt and we are posing to be real user and not some bot trying to fetch all details.
      // Make a POST request to the cart URL with the necessary headers
      const cartResponse = await client.post(cartUrl, formData, {
        headers: {...formData.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
        'Cache-Control': 'no-cache',
      }
      });
      // Get the HTML response from the cart request
      let html: string = cartResponse.data;
      // Extract the checkout token from the HTML response
      let regex = /var DF_CHECKOUT_TOKEN = "(.*?)";/g;
      let match = regex.exec(html);
      let token = '';
      if (match) {
          token = match[1];

      } else {
          console.log("Token not found");
      }
      // Construct the checkout URL using the shop ID and checkout token
      // const newCheckoutUrl = hostsite +`/${shop_id}/checkouts/` + token
      const newCheckoutUrl = hostsite +`/${shop_id}/checkouts/` + cookies['tracked_start_checkout']
      // Output the checkout URL
      console.log("Checkout URL : " + newCheckoutUrl);

      // Fetch the checkout page
      const checkoutResponse = await client.get(newCheckoutUrl);
      let checkoutHtml: string = checkoutResponse.data;

      // Extract the authenticity token using regex
      let tokenRegex = /name="authenticity_token" value="(.*?)"/g;
      let tokenMatch = tokenRegex.exec(checkoutHtml);
      let authenticityToken = '';
      if (tokenMatch) {
        authenticityToken = tokenMatch[1];
        
      } else {
        console.log("Authenticity token not found");
      }

      // Define the shipping address # hardcoded shipping address for testing purposes
      let shippingAddress = {

          "email": "Jone.Doe+telfar@gmail.com",
          "phone": "2269759412",
          "company": "home",
          "first_name": "Jone",
          "last_name": "Doe",
          "address_1": "8647 SAN YSIDRO AVE",
          "address_2": "UNIT M-4",
          "city": "GILROY",
          "zip": "95020-3644",
          "country": "United States",
          "state": "CA",
          "shop": "shop-telfar",
          "token": "45d125ed9e4428ed2eaa4824d47bd3c6",
          "step": "contact_information",
          "shipping": true
      };
      //structuring checkout payload, it can be used for dynamic fetch for later stages
      var checkout = {
        shipping_address : shippingAddress,
        email :shippingAddress['email'],
        remember_me: false,
        buyer_accepts_sms: 0,
        sms_marketing_phone:'000',
        client_details: {
          browser_width: 1903,
          browser_height: 955,
          javascript_enabled: 1,
          color_depth: 24,
          java_enabled: false,
          browser_tz: 240
        }
      }
      // URL is used for validating addresses : https://app.roboturk.co/address_validator/api/checkout_validate
      // data-shipping-methods tag to search for shipping options

      // Create a FormData object for the cart request
      //hardcoded for now, just for testing
      var formDataForCheckout = new FormData();
      formDataForCheckout.append('_method', 'patch');
      formDataForCheckout.append('authenticity_token', authenticityToken);
      formDataForCheckout.append('checkout[email]', checkout['email']);
      formDataForCheckout.append('checkout[buyer_accepts_marketing]', checkout['buyer_accepts_sms']);
      formDataForCheckout.append('checkout[shipping_address][country]',checkout['shipping_address']['country']);
      formDataForCheckout.append('checkout[shipping_address][first_name]', checkout['shipping_address']['first_name']);
      formDataForCheckout.append('checkout[shipping_address][last_name]', checkout['shipping_address']['last_name']);
      formDataForCheckout.append('checkout[shipping_address][company]', checkout['shipping_address']['company']);
      formDataForCheckout.append('checkout[shipping_address][address1]', checkout['shipping_address']['address_1']);
      formDataForCheckout.append('checkout[shipping_address][address2]', checkout['shipping_address']['address_2']);
      formDataForCheckout.append('checkout[shipping_address][city]', checkout['shipping_address']['city']);
      formDataForCheckout.append('checkout[shipping_address][state]', checkout['shipping_address']['state']);
      formDataForCheckout.append('checkout[shipping_address][zip]', checkout['shipping_address']['zip']);
      formDataForCheckout.append('checkout[shipping_address][phone]', checkout['shipping_address']['phone']);
      formDataForCheckout.append('checkout[remember_me]', checkout['remember_me']);
      formDataForCheckout.append('checkout[sms_marketing_phone]', checkout['sms_marketing_phone']);
      // #not required but still putting it here incase we need it in future
      // formDataForCheckout.append('checkout[client_details][browser_width]', '522');
      // formDataForCheckout.append('checkout[client_details][browser_height]', '868');
      // formDataForCheckout.append('checkout[client_details][javascript_enabled]', '1');
      // formDataForCheckout.append('checkout[client_details][color_depth]', '24');
      // formDataForCheckout.append('checkout[client_details][java_enabled]', 'false');
      // formDataForCheckout.append('checkout[client_details][browser_tz]', '240');


      
      //validate our address
      const validateAddress = await client.post("https://app.roboturk.co/address_validator/api/checkout_validate",shippingAddress) 

      if (validateAddress.data==="Address is valid") {
        console.log(validateAddress.data)
      }
      else {
        console.log('Please check address again!');
      }
      // Getting shipping rates based on address provided earlier
      let shippingRateUrl = `https://telfar.net/cart/shipping_rates.json?shipping_address[zip]=${checkout['shipping_address']['zip']}&shipping_address[country]=${checkout['shipping_address']['country']}&shipping_address[province]=${checkout['shipping_address']['state']}`
      const shippingResponse = await client.get(shippingRateUrl, {
        headers: {...formDataForCheckout.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (W4indows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
        'Cache-Control': 'no-cache',
      }
      });
      
      console.log("Listing all the available shipping methods and its cost :")
      //additional logic from my end that we will take what is least expensive shipping option for us and using that for next step
      let minRate = Number.MAX_VALUE;
      let minRateName = '';
      shippingResponse.data.shipping_rates.forEach(rate => {
        console.log(`Name: ${rate.name}, Price: ${rate.price}`);
        if(rate.price < minRate) {
          minRate = rate.price;
          minRateName = rate.name;
        }
      });

      console.log(`Minimum rate we found from the list is ${minRate} for ${minRateName}. We will be using that for submitting...`);
      let shippingIDString = encodeURIComponent('shopify-'+ minRateName+'-' + minRate)
      console.log(shippingIDString)
      var postCheckoutData = new FormData()
      postCheckoutData.append('_method', 'patch');
      postCheckoutData.append('authenticity_token', authenticityToken);
      postCheckoutData.append('previous_step', 'shipping_method');
      postCheckoutData.append('step', 'payment_method');
      postCheckoutData.append('checkout[shipping_rate][id]', shippingIDString);
      // #not required but still putting it here incase we need it in future
      // postCheckoutData.append('checkout[client_details][browser_width]', '522');
      // postCheckoutData.append('checkout[client_details][browser_height]', '868');
      // postCheckoutData.append('checkout[client_details][javascript_enabled]', '1');
      // postCheckoutData.append('checkout[client_details][color_depth]', '24');
      // postCheckoutData.append('checkout[client_details][java_enabled]', 'false');
      // postCheckoutData.append('checkout[client_details][browser_tz]', '240');

      const postCheckoutURL = await client.post(newCheckoutUrl,postCheckoutData, {
        headers: {...postCheckoutData.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
        'Cache-Control': 'no-cache',
      }
      }
      )
      if (postCheckoutURL.status===200){

        console.log("Submitting previous data, on the payment page now..")

        // let submitWithShippingRate=`${newCheckoutUrl}?previous_step=shipping_method&step=payment_method`

        // const getCheckoutURL = await client.get(submitWithShippingRate)
        // console.log(getCheckoutURL)
      }

      


    }
     else {
      //display console log if product is not in stock
      console.log('Product is out of stock');
    }

    
  } catch (error) {
    console.error(error);
  }
}

// Call the function to start monitoring
monitorProduct();