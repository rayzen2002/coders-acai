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
exports.userRoute = void 0;
var database_1 = require("../../infra/prisma/database");
var zod_1 = require("zod");
var auth_1 = require("../../lib/auth");
function userRoute(server) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            server.get('/users', { preHandler: [auth_1.auth] }, function (req) { return __awaiter(_this, void 0, void 0, function () {
                var querySchema, mode, usersDb, users;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            querySchema = zod_1.z.object({
                                mode: zod_1.z.string().optional(),
                            });
                            mode = querySchema.parse(req.query).mode;
                            if (!!mode) return [3 /*break*/, 2];
                            return [4 /*yield*/, database_1.prisma.user.findMany({
                                    include: {
                                        groups: {
                                            include: {
                                                groups: {
                                                    select: {
                                                        groupName: true,
                                                        levelOfAccess: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                })];
                        case 1:
                            usersDb = _a.sent();
                            users = usersDb.map(function (user) {
                                return {
                                    id: user.id,
                                    username: user.username,
                                    groups: user.groups.map(function (group) {
                                        return {
                                            groupName: group.groups.groupName,
                                            levelOfAccess: group.groups.levelOfAccess,
                                        };
                                    }),
                                };
                            });
                            return [2 /*return*/, { users: users }];
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
            server.post('/user', { preHandler: auth_1.auth }, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var bodySchema, _a, password, username, group, groups, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            bodySchema = zod_1.z.object({
                                password: zod_1.z.string(),
                                mode: zod_1.z.string().optional(),
                                username: zod_1.z.string(),
                                group: zod_1.z.string().array(),
                            });
                            _a = bodySchema.parse(req.body), password = _a.password, username = _a.username, group = _a.group;
                            return [4 /*yield*/, database_1.prisma.groups.findMany({
                                    where: {
                                        groupName: {
                                            in: group,
                                        },
                                    },
                                })];
                        case 1:
                            groups = _b.sent();
                            console.log(groups);
                            console.log(password);
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 6, , 7]);
                            if (!groups[0].groupName) return [3 /*break*/, 4];
                            return [4 /*yield*/, database_1.prisma.user.create({
                                    data: {
                                        username: username,
                                        password: password,
                                        groups: {
                                            create: groups.map(function (group) { return ({
                                                groups: { connect: { id: group.id } },
                                                assignedAt: new Date(),
                                                assignedBy: 'admin',
                                            }); }),
                                        },
                                    },
                                })];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 4: throw new Error();
                        case 5:
                            res.status(201);
                            return [3 /*break*/, 7];
                        case 6:
                            error_1 = _b.sent();
                            console.error(error_1);
                            res.status(409).send('Grupo inexistente');
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            }); });
            server.get('/user/:id', { preHandler: auth_1.auth }, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var paramsSchema, id, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            paramsSchema = zod_1.z.object({
                                id: zod_1.z.string().uuid(),
                            });
                            id = paramsSchema.parse(req.params).id;
                            console.log(id);
                            return [4 /*yield*/, database_1.prisma.user.findFirst({
                                    where: {
                                        id: id,
                                    },
                                })];
                        case 1:
                            user = _a.sent();
                            return [2 /*return*/, { user: user }];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
exports.userRoute = userRoute;
