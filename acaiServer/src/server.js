"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var fastify_1 = require("fastify");
var route_1 = require("./routes/route");
var jwt_1 = require("@fastify/jwt");
var login_1 = require("./routes/login");
var cookie_1 = require("@fastify/cookie");
var group_1 = require("./routes/group");
var cors_1 = require("@fastify/cors");
var get_month_revenue_1 = require("./routes/get-month-revenue");
var create_customer_1 = require("./routes/create-customer");
var get_products_1 = require("./routes/get-products");
var create_product_1 = require("./routes/create-product");
var get_customer_1 = require("./routes/get-customer");
var delete_product_1 = require("./routes/delete-product");
var delete_customers_1 = require("./routes/delete-customers");
var get_distributor_1 = require("./routes/get-distributor");
var create_shipment_1 = require("./routes/create-shipment");
var get_shipments_1 = require("./routes/get-shipments");
var delete_shipment_1 = require("./routes/delete-shipment");
var delete_user_1 = require("./routes/delete-user");
var get_orders_1 = require("./routes/get-orders");
var delete_order_1 = require("./routes/delete-order");
var create_distributors_1 = require("./routes/create-distributors");
var create_orders_1 = require("./routes/create-orders");
var create_order_items_1 = require("./routes/create-order-items");
dotenv_1.default.config();
var server = (0, fastify_1.default)();
server.register(cookie_1.default, {
    secret: 'supersecretCookie',
    parseOptions: {
        sameSite: 'none',
    },
});
server.register(cors_1.default, {
    origin: ['https://coders-acai.vercel.app', 'http://localhost:3000'],
    credentials: false,
});
server.register(jwt_1.default, {
    secret: 'supersecret',
});
server.register(get_customer_1.getCustomer);
server.register(create_customer_1.createCustomer);
server.register(delete_customers_1.deleteCustomer);
server.register(get_products_1.getProducts);
server.register(create_product_1.createProduct);
server.register(delete_product_1.deleteProduct);
server.register(get_month_revenue_1.GetMonthRevenue);
server.register(group_1.groupRoutes);
server.register(login_1.loginRoute);
server.register(route_1.userRoute);
server.register(get_distributor_1.getDistributor);
server.register(create_distributors_1.createDistributor);
server.register(create_shipment_1.createShipment);
server.register(get_shipments_1.getShipment);
server.register(delete_shipment_1.deleteShipment);
server.register(delete_user_1.deleteUser);
server.register(create_orders_1.createOrder);
server.register(get_orders_1.getOrders);
server.register(delete_order_1.deleteOrder);
server.register(create_order_items_1.createOrderItems);
server
    .listen({ port: 3333 })
    .then(function () {
    console.log("\uD83D\uDE80 HTTP Server running on port: 3333 \uD83D\uDE80");
})
    .catch(function (error) {
    console.error('Error starting the server:', error);
});
exports.default = server;
