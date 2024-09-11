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
var fs = require("fs");
var path = require("path");
var api = "https://api.bilibili.com/x/web-interface/view?";
/*
    Access Internet for json content
*/
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, newData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP Error! Status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    newData = JSON.parse(JSON.stringify(data, replacer, 2));
                    return [2 /*return*/, Promise.resolve(newData)];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching data:', error_1);
                    return [2 /*return*/, Promise.reject(error_1)];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/*
    filter function
*/
function replacer(key, value) {
    if (key === 'ttl') {
        return undefined;
    }
    if (key === 'data') {
        return { bvid: value.bvid, videos: value.videos, tname: value.tname, pic: value.pic, title: value.title,
            pubdate: value.pubdate, desc: value.desc, duration: value.duration, name: value.owner.name,
            view: value.stat.view, danmuku: value.stat.danmuku, reply: value.stat.reply, favorite: value.stat.favorite,
            coin: value.stat.coin, share: value.stat.share, like: value.stat.like
        };
    }
    return value;
}
/*
    check the aid and bvid number, if error, just throw error.
*/
function vidNoCheck(bvid) {
    var letter = bvid.substring(0, 2).toLowerCase();
    var num = bvid.substring(2);
    if (letter === "bv") {
        var api_bv = api.concat("bvid=").concat(bvid);
        return api_bv;
    }
    else if (letter === "av") {
        var api_av = api.concat("aid=").concat(num);
        return api_av;
    }
    else {
        console.error('You should put avid and bvid');
        // console.log(letter)
        // console.log(num)
        process.exit(1);
    }
}
/* basic function of getting json from api, filter and video number check */
/*
    check if the directory exists, if not, create the folder recursively, or error if failed.
*/
function checkVaildDirectory(path) {
    return __awaiter(this, void 0, void 0, function () {
        var isDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.stat(path)];
                case 1:
                    isDir = (_a.sent()).isDirectory();
                    if (isDir) {
                        return [2 /*return*/, Promise.resolve()];
                    }
                    fs.promises.mkdir(path, { recursive: true }).catch(function (error) {
                        console.error("Can't create folder: " + error);
                        return Promise.reject(error);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
/*
    write a json document with string
*/
function writeToJson(path, title, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    try {
                        checkVaildDirectory(path);
                        // const jsonData = JSON.parse(data)
                        console.log(data);
                        var jsonString = JSON.stringify(data, null, 2);
                        var p = path.concat("/".concat(title, ".json"));
                        // console.log(data)
                        fs.writeFile(p, jsonString, 'utf8', function (error) {
                            if (error) {
                                console.error("Error writing JSON File: ".concat(error));
                                reject(error);
                            }
                            else {
                                console.log("JSON has been written successfully.");
                                resolve();
                            }
                        });
                    }
                    catch (parseError) {
                        console.log("Error parsing JSON string: ", parseError);
                        reject();
                    }
                })];
        });
    });
}
function main(args) {
    if (args.length != 1) {
        console.error('Usage: node helper.js <arg>');
        process.exit(1);
    }
    try {
        var pa_1 = path.join(__dirname, "jsonfile");
        var title_1 = args[0];
        fetchData(vidNoCheck(args[0])).then(function (jsonData) {
            writeToJson(pa_1, title_1, jsonData);
        });
    }
    catch (error) {
        console.error('Error: ' + error);
    }
}
var arg = process.argv.slice(2);
main(arg);
