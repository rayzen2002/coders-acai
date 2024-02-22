"use strict";
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
exports.createOrder = void 0;
var zod_1 = require("zod");
var auth_1 = require("../../lib/auth");
var database_1 = require("../../infra/prisma/database");
var axios_1 = require("axios");
function createOrder(server) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            server.post('/order', { preHandler: [auth_1.auth] }, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var orderSchema, orderValues, customer, order_1, productsNames, NonFlatproducts, products_1, orderItemsBodies, totalInCentsArray, totalInCents, orderResponse, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            orderSchema = zod_1.z.object({
                                customerName: zod_1.z.string(),
                                orderItems: zod_1.z.array(zod_1.z.object({
                                    productName: zod_1.z.string(),
                                    quantity: zod_1.z.number(),
                                })),
                            });
                            orderValues = orderSchema.parse(req.body);
                            return [4 /*yield*/, database_1.prisma.customers.findFirst({
                                    where: {
                                        name: orderValues.customerName,
                                    },
                                })];
                        case 1:
                            customer = _a.sent();
                            if (!customer) {
                                return [2 /*return*/, res.status(404).send('Customer not found')];
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 6, , 7]);
                            return [4 /*yield*/, database_1.prisma.orders.create({
                                    data: {
                                        customerId: customer.id,
                                        total_in_cents: 0,
                                    },
                                })];
                        case 3:
                            order_1 = _a.sent();
                            productsNames = orderValues.orderItems.map(function (orderItem) {
                                return orderItem.productName;
                            });
                            return [4 /*yield*/, Promise.all(productsNames.map(function (productName) { return __awaiter(_this, void 0, void 0, function () {
                                    var listOfProducts;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, database_1.prisma.products.findMany({
                                                    where: {
                                                        name: productName,
                                                    },
                                                })];
                                            case 1:
                                                listOfProducts = _a.sent();
                                                return [2 /*return*/, listOfProducts];
                                        }
                                    });
                                }); }))];
                        case 4:
                            NonFlatproducts = _a.sent();
                            products_1 = NonFlatproducts.flat();
                            orderItemsBodies = orderValues.orderItems.map(function (orderItem, index) {
                                return {
                                    orderId: order_1.id,
                                    productId: products_1[index].id,
                                    quantity: orderItem.quantity,
                                };
                            });
                            Promise.all(orderItemsBodies.map(function (orderItemsBody) {
                                return axios_1.default.post("https://coders-acai-pm2c.vercel.app/order-item", orderItemsBody);
                            }));
                            totalInCentsArray = products_1.map(function (product, i) {
                                var total = product.price_in_cents * orderValues.orderItems[i].quantity;
                                return total;
                            });
                            totalInCents = totalInCentsArray.reduce(function (partialSum, value) { return partialSum + value; }, 0);
                            return [4 /*yield*/, database_1.prisma.orders.update({
                                    where: {
                                        id: order_1.id,
                                    },
                                    data: {
                                        total_in_cents: totalInCents,
                                    },
                                })];
                        case 5:
                            orderResponse = _a.sent();
                            return [2 /*return*/, res.status(201).send({ id: orderResponse.id })];
                        case 6:
                            error_1 = _a.sent();
                            console.error(error_1);
                            res.status(409);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
exports.createOrder = createOrder;
