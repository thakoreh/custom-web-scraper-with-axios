import axios from 'axios';
import * as FormData from 'form-data';

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
const checkoutUrl = 'https://telfar.net/8807204/checkouts/';

// Function to monitor the product
//we can include argument here for product so we can call the function, best case is we include in products loop
async function monitorProduct() {
  try {
    // Fetch the product data
    const productResponse = await axios.get(productUrl);
    const productData = productResponse.data;

    const isAvailable = productResponse.data.available

    // Check if the product is in stock
    if (isAvailable) {
      console.log("..Stock is Available..");
      console.log("Adding to cart as it is available in stock...");
      // adding only first variant for product awaiting reply from joe
      const first_variant = productData.variants[0].id
      // Add the product to the cart
      console.log("Adding only first variant with quantity 1 : "+`${first_variant}`)
      const cartAddResponse = await axios.post(cartAddUrl, {
        id: first_variant,
        quantity: 1
      });

      if (cartAddResponse.status===200) {
        console.log("Adding to cart as it is available in stock...");
      }
      
      var formData = new FormData();
      formData.append('updates', '1');
      formData.append('checkout', '');
      // Note : adding User-Agent, Cookie, Cache-Control is critical as we need to respect robot.txt and we are posing to be real user and not some bot trying to fetch all details.
      const cartResponse = await axios.post(cartUrl, formData, {
        headers: {...formData.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
        'Cookie': '_checkout_queue_checkout_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaVZoTURCaE9EQTRaakF6TWpFM09ETm1ZMkkyWlRrek9EVTNZbVExWWpCa05nWTZCa1ZVIiwiZXhwIjoiMjAyMy0xMC0wMlQyMjoyNDoyNi4yNzlaIiwicHVyIjoiY29va2llLl9jaGVja291dF9xdWV1ZV9jaGVja291dF90b2tlbiJ9fQ%3D%3D--90d4bef8f4b423877ce44aec881eac64bae6dc78; _checkout_queue_token=AnWPJ7JR2qrY-Rf3MXGfgXAyAeZTQnBf8F5YutIH5ryarA5wfepEqJpHJ6tV4_fKKK8f13LMpLERT-RapNuj8XZyCuMBJyayxWLyjUgC_TmKOYxmgxZVqUjnBMMisKP7qO9U-sumF7900Ufcm_BRPlvJf3NHF11m-XW_oX-pm9JqmfnbMNWAHkH3; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22merchant_geo%22%3A%22USNY%22%2C%22sale_of_data_region%22%3Afalse%7D; _landing_page=%2F8807204%2Fcheckouts%2Fa00a808f0321783fcb6e93857bd5b0d6; _orig_referrer=https%3A%2F%2Ftelfar.net%2Fcheckout.js; _s=bc11fd53-9726-4699-a282-209fd3181bb5; _secure_session_id=9a693edee6de472298a585a29c87c266; _shopify_m=session; _shopify_s=bc11fd53-9726-4699-a282-209fd3181bb5; _shopify_tm=; _shopify_tw=; _shopify_y=0468fb4b-db92-4035-aaba-63ba9225018b; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%22%22%2C%22s%22%3A%22%22%2C%22p%22%3A%22%22%2C%22m%22%3A%22%22%7D%7D%2C%22lim%22%3A%5B%22CCPA%22%2C%22GDPR%22%5D%2C%22region%22%3A%22CAON%22%2C%22reg%22%3A%22%22%2C%22v%22%3A%222.1%22%7D; _y=0468fb4b-db92-4035-aaba-63ba9225018b; cart=1f8be951af1ed62bda076efe11106e34; cart_currency=USD; cart_sig=b06cedb24e46c0a9662a57a213a09880; cart_ts=1696281866; cart_ver=gcp-us-east1%3A43; localization=US; secure_customer_sig=; unique_interaction_id=385688f7-d78c-4636-8585-4315fb1f3fde', // replace with your actual cookie value
        'Cache-Control': 'no-cache',
      }
      });

      let html: string = cartResponse.data;
      let match = html.match(/checkouts\/(.*?)\?/);
      let token: string | null = match && match[1];
      const newCheckoutUrl = checkoutUrl + token
      //output requested for the evaluation
      //the output you were looking for
      console.log("Checkout URL before redirect: " + newCheckoutUrl);
      

      const callNewAPI = await axios.get(newCheckoutUrl, { 
        maxRedirects: 10,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
          'Cookie': '_checkout_queue_checkout_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaVZoTURCaE9EQTRaakF6TWpFM09ETm1ZMkkyWlRrek9EVTNZbVExWWpCa05nWTZCa1ZVIiwiZXhwIjoiMjAyMy0xMC0wMlQyMjoyNDoyNi4yNzlaIiwicHVyIjoiY29va2llLl9jaGVja291dF9xdWV1ZV9jaGVja291dF90b2tlbiJ9fQ%3D%3D--90d4bef8f4b423877ce44aec881eac64bae6dc78; _checkout_queue_token=AnWPJ7JR2qrY-Rf3MXGfgXAyAeZTQnBf8F5YutIH5ryarA5wfepEqJpHJ6tV4_fKKK8f13LMpLERT-RapNuj8XZyCuMBJyayxWLyjUgC_TmKOYxmgxZVqUjnBMMisKP7qO9U-sumF7900Ufcm_BRPlvJf3NHF11m-XW_oX-pm9JqmfnbMNWAHkH3; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22merchant_geo%22%3A%22USNY%22%2C%22sale_of_data_region%22%3Afalse%7D; _landing_page=%2F8807204%2Fcheckouts%2Fa00a808f0321783fcb6e93857bd5b0d6; _orig_referrer=https%3A%2F%2Ftelfar.net%2Fcheckout.js; _s=bc11fd53-9726-4699-a282-209fd3181bb5; _secure_session_id=9a693edee6de472298a585a29c87c266; _shopify_m=session; _shopify_s=bc11fd53-9726-4699-a282-209fd3181bb5; _shopify_tm=; _shopify_tw=; _shopify_y=0468fb4b-db92-4035-aaba-63ba9225018b; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%22%22%2C%22s%22%3A%22%22%2C%22p%22%3A%22%22%2C%22m%22%3A%22%22%7D%7D%2C%22lim%22%3A%5B%22CCPA%22%2C%22GDPR%22%5D%2C%22region%22%3A%22CAON%22%2C%22reg%22%3A%22%22%2C%22v%22%3A%222.1%22%7D; _y=0468fb4b-db92-4035-aaba-63ba9225018b; cart=1f8be951af1ed62bda076efe11106e34; cart_currency=USD; cart_sig=b06cedb24e46c0a9662a57a213a09880; cart_ts=1696281866; cart_ver=gcp-us-east1%3A43; localization=US; secure_customer_sig=; unique_interaction_id=385688f7-d78c-4636-8585-4315fb1f3fde', // replace with your actual cookie value
        'Cache-Control': 'no-cache',
        }
      }
      ).then((res)=>{
        // console.log(res.status)
        // //usually res.header will have location that will have answer for our redirect
        // console.log(res.headers)
        // //or we use below to get the redirect url
        // console.log(res.request.res.responseUrl)
        // console.log(res.request.res.responseURL)
      }).catch((error) => {
        if (error.response.status === 302 || error.response.status === 301) {
          const redirectUrl = error.response.request.res.responseUrl;
          console.log("Redirect URL: " + redirectUrl);
        }
        
      });

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
