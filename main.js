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
        var productResponse, productData, isAvailable, first_variant, cartAddResponse, formData, cartResponse, html, match, token, newCheckoutUrl, callNewAPI, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, axios_1.default.get(productUrl)];
                case 1:
                    productResponse = _a.sent();
                    productData = productResponse.data;
                    isAvailable = productResponse.data.available;
                    if (!isAvailable) return [3 /*break*/, 5];
                    console.log("..Stock is Available..");
                    console.log("Adding to cart as it is available in stock...");
                    first_variant = productData.variants[0].id;
                    // Add the product to the cart
                    console.log("Adding only first variant with quantity 1 : " + "".concat(first_variant));
                    return [4 /*yield*/, axios_1.default.post(cartAddUrl, {
                            id: first_variant,
                            quantity: 1
                        })];
                case 2:
                    cartAddResponse = _a.sent();
                    if (cartAddResponse.status === 200) {
                        console.log("Adding to cart as it is available in stock...");
                    }
                    formData = new FormData();
                    formData.append('updates', '1');
                    formData.append('checkout', '');
                    return [4 /*yield*/, axios_1.default.post(cartUrl, formData, {
                            headers: __assign(__assign({}, formData.getHeaders()), { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0', 'Cookie': '_checkout_queue_checkout_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaVZoTURCaE9EQTRaakF6TWpFM09ETm1ZMkkyWlRrek9EVTNZbVExWWpCa05nWTZCa1ZVIiwiZXhwIjoiMjAyMy0xMC0wMlQyMjoyNDoyNi4yNzlaIiwicHVyIjoiY29va2llLl9jaGVja291dF9xdWV1ZV9jaGVja291dF90b2tlbiJ9fQ%3D%3D--90d4bef8f4b423877ce44aec881eac64bae6dc78; _checkout_queue_token=AnWPJ7JR2qrY-Rf3MXGfgXAyAeZTQnBf8F5YutIH5ryarA5wfepEqJpHJ6tV4_fKKK8f13LMpLERT-RapNuj8XZyCuMBJyayxWLyjUgC_TmKOYxmgxZVqUjnBMMisKP7qO9U-sumF7900Ufcm_BRPlvJf3NHF11m-XW_oX-pm9JqmfnbMNWAHkH3; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22merchant_geo%22%3A%22USNY%22%2C%22sale_of_data_region%22%3Afalse%7D; _landing_page=%2F8807204%2Fcheckouts%2Fa00a808f0321783fcb6e93857bd5b0d6; _orig_referrer=https%3A%2F%2Ftelfar.net%2Fcheckout.js; _s=bc11fd53-9726-4699-a282-209fd3181bb5; _secure_session_id=9a693edee6de472298a585a29c87c266; _shopify_m=session; _shopify_s=bc11fd53-9726-4699-a282-209fd3181bb5; _shopify_tm=; _shopify_tw=; _shopify_y=0468fb4b-db92-4035-aaba-63ba9225018b; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%22%22%2C%22s%22%3A%22%22%2C%22p%22%3A%22%22%2C%22m%22%3A%22%22%7D%7D%2C%22lim%22%3A%5B%22CCPA%22%2C%22GDPR%22%5D%2C%22region%22%3A%22CAON%22%2C%22reg%22%3A%22%22%2C%22v%22%3A%222.1%22%7D; _y=0468fb4b-db92-4035-aaba-63ba9225018b; cart=1f8be951af1ed62bda076efe11106e34; cart_currency=USD; cart_sig=b06cedb24e46c0a9662a57a213a09880; cart_ts=1696281866; cart_ver=gcp-us-east1%3A43; localization=US; secure_customer_sig=; unique_interaction_id=385688f7-d78c-4636-8585-4315fb1f3fde', 'Cache-Control': 'no-cache' })
                        })];
                case 3:
                    cartResponse = _a.sent();
                    html = cartResponse.data;
                    match = html.match(/checkouts\/(.*?)\?/);
                    token = match && match[1];
                    newCheckoutUrl = checkoutUrl + token;
                    //output requested for the evaluation
                    //the output you were looking for
                    console.log("Checkout URL before redirect: " + newCheckoutUrl);
                    return [4 /*yield*/, axios_1.default.get(newCheckoutUrl, {
                            maxRedirects: 10,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
                                'Cookie': '_checkout_queue_checkout_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaEpJaVZoTURCaE9EQTRaakF6TWpFM09ETm1ZMkkyWlRrek9EVTNZbVExWWpCa05nWTZCa1ZVIiwiZXhwIjoiMjAyMy0xMC0wMlQyMjoyNDoyNi4yNzlaIiwicHVyIjoiY29va2llLl9jaGVja291dF9xdWV1ZV9jaGVja291dF90b2tlbiJ9fQ%3D%3D--90d4bef8f4b423877ce44aec881eac64bae6dc78; _checkout_queue_token=AnWPJ7JR2qrY-Rf3MXGfgXAyAeZTQnBf8F5YutIH5ryarA5wfepEqJpHJ6tV4_fKKK8f13LMpLERT-RapNuj8XZyCuMBJyayxWLyjUgC_TmKOYxmgxZVqUjnBMMisKP7qO9U-sumF7900Ufcm_BRPlvJf3NHF11m-XW_oX-pm9JqmfnbMNWAHkH3; _cmp_a=%7B%22purposes%22%3A%7B%22a%22%3Atrue%2C%22p%22%3Atrue%2C%22m%22%3Atrue%2C%22t%22%3Atrue%7D%2C%22display_banner%22%3Afalse%2C%22merchant_geo%22%3A%22USNY%22%2C%22sale_of_data_region%22%3Afalse%7D; _landing_page=%2F8807204%2Fcheckouts%2Fa00a808f0321783fcb6e93857bd5b0d6; _orig_referrer=https%3A%2F%2Ftelfar.net%2Fcheckout.js; _s=bc11fd53-9726-4699-a282-209fd3181bb5; _secure_session_id=9a693edee6de472298a585a29c87c266; _shopify_m=session; _shopify_s=bc11fd53-9726-4699-a282-209fd3181bb5; _shopify_tm=; _shopify_tw=; _shopify_y=0468fb4b-db92-4035-aaba-63ba9225018b; _tracking_consent=%7B%22con%22%3A%7B%22CMP%22%3A%7B%22a%22%3A%22%22%2C%22s%22%3A%22%22%2C%22p%22%3A%22%22%2C%22m%22%3A%22%22%7D%7D%2C%22lim%22%3A%5B%22CCPA%22%2C%22GDPR%22%5D%2C%22region%22%3A%22CAON%22%2C%22reg%22%3A%22%22%2C%22v%22%3A%222.1%22%7D; _y=0468fb4b-db92-4035-aaba-63ba9225018b; cart=1f8be951af1ed62bda076efe11106e34; cart_currency=USD; cart_sig=b06cedb24e46c0a9662a57a213a09880; cart_ts=1696281866; cart_ver=gcp-us-east1%3A43; localization=US; secure_customer_sig=; unique_interaction_id=385688f7-d78c-4636-8585-4315fb1f3fde',
                                'Cache-Control': 'no-cache',
                            }
                        }).then(function (res) {
                            // console.log(res.status)
                            // //usually res.header will have location that will have answer for our redirect
                            // console.log(res.headers)
                            // //or we use below to get the redirect url
                            // console.log(res.request.res.responseUrl)
                            // console.log(res.request.res.responseURL)
                        }).catch(function (error) {
                            if (error.response.status === 302 || error.response.status === 301) {
                                var redirectUrl = error.response.request.res.responseUrl;
                                console.log("Redirect URL: " + redirectUrl);
                            }
                        })];
                case 4:
                    callNewAPI = _a.sent();
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
