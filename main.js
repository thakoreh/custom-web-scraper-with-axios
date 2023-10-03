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
var axios_1 = require("axios");
var FormData = require("form-data");
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
var checkoutUrl = 'https://telfar.net/8807204/checkouts/';
// Function to monitor the product
//we can include argument here for product so we can call the function, best case is we include in products loop
function monitorProduct() {
    return __awaiter(this, void 0, void 0, function () {
        var productResponse, productData, isAvailable, firstVariant, quantityOrdered, jar, client, url, config, cookies_1, cookieString, cartAddResponse, cookies_add, cookieMap, cart_ts, cart_ver, cartKey, currentTimestamp, cookieString1, formData, cartResponse, html, regex, match, token, newCheckoutUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, axios_1.default.get(productUrl)];
                case 1:
                    productResponse = _a.sent();
                    productData = productResponse.data;
                    isAvailable = productResponse.data.available && productResponse.data.variants[0].available;
                    if (!isAvailable) return [3 /*break*/, 5];
                    console.log("..Stock is Available..");
                    console.log("Adding to cart as it is available in stock...");
                    firstVariant = productData.variants[0].id;
                    quantityOrdered = 1;
                    // Add the product to the cart
                    console.log("Adding only first variant with quantity 1 : " + "".concat(firstVariant));
                    jar = new tough_cookie_1.CookieJar();
                    client = (0, axios_cookiejar_support_1.wrapper)(axios_1.default.create({ jar: jar }));
                    url = "https://telfar.net/cart/".concat(firstVariant, ":").concat(quantityOrdered);
                    return [4 /*yield*/, client.get(url)];
                case 2:
                    config = (_a.sent()).config;
                    cookies_1 = {};
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
                            quantity: 1
                        })];
                case 3:
                    cartAddResponse = _a.sent();
                    cookies_add = cartAddResponse.headers['set-cookie'];
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
                    newCheckoutUrl = checkoutUrl + token;
                    // can also be found in response headers['tracked_start_checkout']
                    //output requested for the evaluation
                    //the output you were looking for
                    console.log("Checkout URL : " + newCheckoutUrl);
                    return [3 /*break*/, 6];
                case 5:
                    console.log('Product is out of stock');
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Call the function to start monitoring
monitorProduct();
