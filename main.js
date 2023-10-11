"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//import necessary npm packages
var axios_1 = require("axios");
var FormData = require("form-data");
// Import necessary modules for handling cookies
var axios_cookiejar_support_1 = require("axios-cookiejar-support");
var tough_cookie_1 = require("tough-cookie");
// Define the products URL
var productsUrl = 'https://telfar.net/products.json';
// we can choose to have loop over productsUrl and add all products' variants in cart and generate checkout, awaiting your response on this.
// I am going for this product for now.
// Define the product URL
var productUrl = 'https://telfar.net/collections/telfar-track/products/cropped-track-jacket-oxblood.js';
// Define the cart URL
var cartAddUrl = 'https://telfar.net/cart/add.js';
// Define the cart URL
var cartUrl = 'https://telfar.net/cart.js';
// Define the checkout URL
var hostsite = 'https://telfar.net';
// Function to monitor the product
//we can include argument here for product so we can call the function, best case is we include in products loop
function monitorProduct() {
    return __awaiter(this, void 0, void 0, function () {
        var productResponse, productData, isAvailable, firstVariant, quantityOrdered, jar, client, url, config, cookies_1, cookieString, cartAddResponse, cartHeaders, shop_id, cookies_add, cookieMap, cart_ts, cart_ver, cartKey, currentTimestamp, cookieString1, formData, cartResponse, html, regex, match, token, newCheckoutUrl, checkoutResponse, checkoutHtml, tokenRegex, tokenMatch, authenticityToken, shippingAddress, checkout, formDataForCheckout, validateAddress, shippingRateUrl, shippingResponse, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    return [4 /*yield*/, axios_1.default.get(productUrl)];
                case 1:
                    productResponse = _a.sent();
                    productData = productResponse.data;
                    console.log("Checking if stock is available or not...");
                    isAvailable = productResponse.data.available && productResponse.data.variants[0].available;
                    if (!isAvailable) return [3 /*break*/, 8];
                    console.log("...Stock is Available");
                    console.log("Adding to cart as it is available in stock...");
                    firstVariant = productData.variants[0].id;
                    quantityOrdered = 1;
                    console.log("Adding only first variant with quantity 1 : " + "".concat(firstVariant));
                    jar = new tough_cookie_1.CookieJar();
                    client = (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({ jar: jar }));
                    url = "https://telfar.net/cart/".concat(firstVariant, ":").concat(quantityOrdered);
                    return [4 /*yield*/, client.get(url)];
                case 2:
                    config = (_a.sent()).config;
                    cookies_1 = {};
                    //addings values in cookies
                    config.jar.toJSON().cookies.forEach(function (cookie) {
                        cookies_1[cookie.key] = cookie.value || '';
                    });
                    cookieString = Object.entries(cookies_1)
                        .map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return "".concat(key, "=").concat(value || '');
                    })
                        .join('; ');
                    return [4 /*yield*/, client.post(cartAddUrl, {
                            id: firstVariant,
                            quantity: quantityOrdered
                        })];
                case 3:
                    cartAddResponse = _a.sent();
                    cartHeaders = cartAddResponse.headers;
                    shop_id = cartHeaders['x-shopid'];
                    cookies_add = cartHeaders['set-cookie'];
                    cookieMap = cookies_add.reduce(function (map, cookie) {
                        var _a = cookie.split('='), key = _a[0], value = _a[1];
                        map[key.trim()] = decodeURIComponent(value);
                        return map;
                    }, {});
                    cart_ts = cookieMap['cart_ts'].split(';')[0];
                    cart_ver = cookieMap['cart_ver'].split(';')[0];
                    cartKey = cookieMap['cart'].split(';')[0];
                    currentTimestamp = Math.floor(Date.now() / 1000);
                    if (cartAddResponse.status === 200) {
                        console.log("Adding to cart as it is available in stock...");
                    }
                    cookieString1 = "_checkout_queue_checkout_token=".concat(cookies_1['_checkout_queue_checkout_token'], "; _checkout_queue_token=").concat(cookies_1['_checkout_queue_token'], "; _cmp_a=").concat(cookies_1['_cmp_a'], "; _landing_page=").concat(cookies_1['_landing_page'], "; _orig_referrer=").concat(cookies_1['_orig_referrer'], "; _s=").concat(cookies_1['_s'], "; _secure_session_id=").concat(cookies_1['_secure_session_id'], "; _shopify_m=").concat(cookies_1['_shopify_m'], "; _shopify_s=").concat(cookies_1['_shopify_s'], "; _shopify_tm=").concat(cookies_1['_shopify_tm'], "; _shopify_tw=").concat(cookies_1['_shopify_tw'], "; _shopify_y=").concat(cookies_1['_shopify_y'], "; _tracking_consent=").concat(cookies_1['_tracking_consent'], "; _y=").concat(cookies_1['_y'], "; cart=").concat(cartKey, "; cart_currency=").concat(cookies_1['cart_currency'], "; cart_sig=").concat(cookies_1['cart_sig'], "; cart_ts=").concat(cart_ts, "; cart_ver=").concat(cart_ver, "; localization=").concat(cookies_1['localization'], "; secure_customer_sig=").concat(cookies_1['secure_customer_sig'], ";");
                    // Add the cookies to the cookie jar
                    jar.setCookie(cookieString1, 'https://telfar.net');
                    formData = new FormData();
                    formData.append('updates', '1');
                    formData.append('checkout', '');
                    return [4 /*yield*/, client.post(cartUrl, formData, {
                            headers: __assign(__assign({}, formData.getHeaders()), { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0', 'Cache-Control': 'no-cache' })
                        })];
                case 4:
                    cartResponse = _a.sent();
                    html = cartResponse.data;
                    regex = /var DF_CHECKOUT_TOKEN = "(.*?)";/g;
                    match = regex.exec(html);
                    token = '';
                    if (match) {
                        token = match[1];
                    }
                    else {
                        console.log("Token not found");
                    }
                    newCheckoutUrl = hostsite + "/".concat(shop_id, "/checkouts/") + cookies_1['tracked_start_checkout'];
                    // Output the checkout URL
                    console.log("Checkout URL : " + newCheckoutUrl);
                    return [4 /*yield*/, client.get(newCheckoutUrl)];
                case 5:
                    checkoutResponse = _a.sent();
                    checkoutHtml = checkoutResponse.data;
                    tokenRegex = /name="authenticity_token" value="(.*?)"/g;
                    tokenMatch = tokenRegex.exec(checkoutHtml);
                    authenticityToken = '';
                    if (tokenMatch) {
                        authenticityToken = tokenMatch[1];
                    }
                    else {
                        console.log("Authenticity token not found");
                    }
                    shippingAddress = {
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
                    checkout = {
                        shipping_address: shippingAddress,
                        email: shippingAddress['email'],
                        remember_me: false,
                        buyer_accepts_sms: 0,
                        sms_marketing_phone: '000',
                        client_details: {
                            browser_width: 1903,
                            browser_height: 955,
                            javascript_enabled: 1,
                            color_depth: 24,
                            java_enabled: false,
                            browser_tz: 240
                        }
                    };
                    formDataForCheckout = new FormData();
                    formDataForCheckout.append('_method', 'patch');
                    formDataForCheckout.append('authenticity_token', authenticityToken);
                    formDataForCheckout.append('checkout[email]', checkout['email']);
                    formDataForCheckout.append('checkout[buyer_accepts_marketing]', checkout['buyer_accepts_sms']);
                    formDataForCheckout.append('checkout[shipping_address][country]', checkout['shipping_address']['country']);
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
                    return [4 /*yield*/, client.post("https://app.roboturk.co/address_validator/api/checkout_validate", shippingAddress)];
                case 6:
                    validateAddress = _a.sent();
                    if (validateAddress.data === "Address is valid") {
                        console.log(validateAddress.data);
                    }
                    else {
                        console.log('Please check address again!');
                    }
                    shippingRateUrl = "https://telfar.net/cart/shipping_rates.json?shipping_address[zip]=".concat(checkout['shipping_address']['zip'], "&shipping_address[country]=").concat(checkout['shipping_address']['country'], "&shipping_address[province]=").concat(checkout['shipping_address']['state']);
                    console.log(shippingRateUrl);
                    return [4 /*yield*/, client.get(shippingRateUrl, {
                            headers: __assign(__assign({}, formData.getHeaders()), { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0', 'Cache-Control': 'no-cache' })
                        })];
                case 7:
                    shippingResponse = _a.sent();
                    console.log("Listing all the available shipping methods and its cost :");
                    shippingResponse.data.shipping_rates.forEach(function (rate) {
                        console.log("Name: ".concat(rate.name, ", Price: ").concat(rate.price));
                    });
                    return [3 /*break*/, 9];
                case 8:
                    //display console log if product is not in stock
                    console.log('Product is out of stock');
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
// Call the function to start monitoring
monitorProduct();
