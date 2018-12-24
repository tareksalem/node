const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const path = require("path");
const URL = require("url");
const helpers = require("./helpers/helpers");
const sessionModule = require("./sessionLib");
const loginSystem = require("./loginSystem");
// set the bas directiory of project
global.baseDir = __dirname;
class BuildServer {
    constructor() {
        this.helpers = {};
        this.helpers.enCrypt = helpers.enCrypt;
        this.helpers.beCrypt = helpers.beCrypt;
        this.helpers.validation = helpers.validation;
        this._stacks = [];
    }
    setConfig(options) {
        this.session = options.session;
        this.type = options.type
        this.setCookie = options.setCookie;
        process.env.ENCRYPTION_KEY = options.ENCRYPTION_KEY || "ncryptiontestforencryptionproces";
        this.serverOptions = options !== undefined ? options : {};
        var serverOptions = this.serverOptions;
        this.http = serverOptions.http || http || require("http");
        this.port = serverOptions.port !== undefined ? serverOptions.port : process.env.PORT || 3000;
        this.serverOptions = serverOptions;
        this.getRoutes = serverOptions.getRoutes !== undefined ? serverOptions.getRoutes : {};
        this.postRoutes = serverOptions.postRoutes !== undefined ? serverOptions.postRoutes : {};
        this.putRoutes = serverOptions.putRoutes !== undefined ? serverOptions.putRoutes : {};
        this.pathRoutes = serverOptions.patchRoutes !== undefined ? serverOptions.patchRoutes : {}
        this.deleteRoutes = serverOptions.deleteRoutes !== undefined ? serverOptions.deleteRoutes : {};
        this.handlers = serverOptions.handlers !== undefined ? serverOptions.handlers : {};
    }
    use(options) {
        options.path = options.path !== undefined && options.path !== "/" ? options.path : "*";
        options.type = "use";
        this._stacks.push(options);

    }
    addRoute(options) {
        let self = this;
        let handler = options.handler;
        let handlerName = options.handlerName;
        let method = options.method.toLowerCase();
        let reqPath = options.url.trim()
        self.handlers[handlerName] = handler;
        if (method === "get") {
            self.getRoutes[reqPath] = options;
        } else if (method === "post") {
            self.postRoutes[reqPath] = options;
        } else if (method === "put") {
            self.putRoutes[reqPath] = options;
        } else if (method === "patch") {
            self.patchRoutes[reqPath] = options;
        } else if (method === "delete") {
            self.deleteRoutes[reqPath] = options;
        }
    }
    initServer() {
        let useStaticArr = [];
        const http = this.http;
        const self = this;
        let getRoutes = this.getRoutes;
        let postRoutes = this.postRoutes;
        let putRoutes = this.putRoutes;
        let deleteRoutes = this.deleteRoutes;
        let patchRoutes = this.pathRoutes;
        let handlers = this.handlers;
        let port = this.port;
        let cookieOptions = this.setCookie;
        var staticArr = [];
        var requestsArr = [];
        var pathnames = [];
        var stacks = this._stacks;
        // flask messages
        var flash = {};
        flash.reset = function() {
            Object.keys(flash).forEach(function(fl) {
                if (fl != "reset") {
                    flash[fl] = undefined;
                }
            })
        }
        const server = http.createServer(function(req, res) {
            req.flash = flash;
            sessionModule.setSessionOptions({ req: req, res: res, cookieOptions: cookieOptions });
            if (self.session === true) {
                session.init(req, res);
            }
            res.sendFile = helpers.sendFile;
            res.render = function(options) {
                let layout = options.layout;
                let partials = options.partials;
                let body = options.body;
                let data = options.data
                helpers.render({
                    req: req,
                    res: res,
                    layout: layout,
                    partials: partials,
                    body: body,
                    data: data
                });
            }
            res.json = function(data) {
                helpers.json(res, data);
            }
            res.redirect = function(url) {
                res.writeHead(302, { "Location": url });
                return res.end("");
            }
            let url = URL.parse(req.url);
            let pathname = url.pathname.trim();
            let method = req.method.toLowerCase();
            let query = url.query;
            let headers = req.headers;
            req.method = method;
            req.query = url.query;
            req.pathname = pathname;
            let paramsArr = pathname.split(":");
            paramsArr.splice(0, 1);
            req.params = paramsArr;
            req.url = url;
            var requestInfo = {
                url: url,
                headers: headers,
                pathname: pathname,
                method: method,
                query: query,
                req: req,
                res: res,
                params: req.params
            };
            if (path.extname(pathname) === ".css" || path.extname(pathname) === ".js" || path.extname(pathname) === ".ts" || path.extname(pathname) === ".jpg" || path.extname(pathname) === ".txt" || path.extname(pathname) === ".png" || path.extname(pathname) === ".jpeg" || path.extname(pathname) === ".php" || path.extname(pathname) === ".ico" || path.extname(pathname) === ".json" || path.extname(pathname) === ".html" || path.extname(pathname) === ".mp3" || path.extname(pathname) === ".mp4" || path.extname(pathname) === ".m4r" || path.extname(pathname) === ".ogg" || path.extname(pathname) === ".ogv" || path.extname(pathname) === ".wmv" || path.extname(pathname) === ".mov" || path.extname(pathname) === ".3gp") {
                if (useStaticArr.length > 0) {
                    helpers.staticFiles(req, res, pathname, useStaticArr[0], handlers.errorPage, requestInfo, "use");
                }
            } else {
                stacks.forEach((obj) => {
                    obj.staticFolder = obj.staticFolder || self.serverOptions.staticFolder;
                    if (obj.path === "*") {
                        useStaticArr = [];
                        obj.staticFolder = obj.staticFolder || self.serverOptions.staticFolder;
                        useStaticArr.push(obj.staticFolder);

                        function useFuncAll() {
                            let middleWares = obj.middleWares;
                            if (middleWares) {
                                var nexted = 0;
                                middleWares[0](req, res, next);

                                function next() {
                                    nexted++;
                                    if (middleWares.length <= nexted) {
                                        return obj.handler(req, res);
                                    } else {
                                        return middleWares[nexted](req, res, next);
                                    }
                                }
                            } else {
                                return obj.handler(req, res);
                            }
                        }
                        useFuncAll();
                    } else {
                        if (pathname.indexOf(obj.path) !== -1) {
                            useStaticArr = [];
                            useStaticArr.push(obj.staticFolder);
                            obj.url = pathname;
                            obj.useFunc = true;
                            if (obj.methods === "all") {
                                getRoutes[pathname] = obj;
                                postRoutes[pathname] = obj;
                                putRoutes[pathname] = obj;
                                patchRoutes[pathname] = obj;
                                deleteRoutes[pathname] = obj;
                            } else {
                                obj.methods.forEach((method) => {
                                    if (method.toLowerCase() === "get") {
                                        getRoutes[pathname] = obj;
                                    } else if (method.toLowerCase() === "post") {
                                        postRoutes[pathname] = obj;
                                    } else if (method.toLowerCase() === "put") {
                                        putRoutes[pathname] = obj;
                                    } else if (method.toLowerCase() === "patch") {
                                        patchRoutes[pathname] = obj;
                                    } else if (method.toLowerCase() === "delete") {
                                        deleteRoutes[pathname] = obj;
                                    }
                                })
                            }

                            function useFuncSpec() {
                                let middleWares = obj.middleWares;
                                if (middleWares) {
                                    var nexted = 0;
                                    middleWares[0](req, res, next);

                                    function next() {
                                        nexted++;
                                        if (middleWares.length <= nexted) {
                                            return obj.handler(req, res);
                                        } else {
                                            return middleWares[nexted](req, res, next);
                                        }
                                    }
                                } else {
                                    return obj.handler(req, res);
                                }
                            }
                            useFuncSpec();
                        }
                    }
                })
            }
            if (method === "get") {
                var mainRequest = getRoutes[pathname] !== undefined ? getRoutes[pathname] : {};
                var requestData = {
                    pathname: pathname,
                    staticFolder: mainRequest.staticFolder
                }
                requestsArr.push(requestData);
                requestsArr.forEach((r) => r.staticFolder = r.staticFolder != undefined ? r.staticFolder : self.serverOptions.staticFolder);
                if (getRoutes[pathname] !== undefined) {
                    if (getRoutes[pathname].useFunc !== true) {
                        var routeStatic = requestsArr.find((r) => r.staticFolder !== undefined && r.pathname == pathname);
                        if (routeStatic) {
                            requestsArr.length = 0;
                            staticArr.length = 0;
                            staticArr.push(routeStatic);
                        } else {
                            requestsArr.length = 0;
                            staticArr.length = 0;
                            staticArr.push(self.serverOptions.staticFolder);
                        }
                        getRoutes[pathname].url = pathname;
                        var choseHandler = typeof getRoutes[pathname].handler == "string" ? handlers[getRoutes[pathname].handler] : getRoutes[pathname].handler;
                        let middleWares = getRoutes[pathname].middleWares;
                        if (middleWares) {
                            var nexted = 0;
                            middleWares[0](req, res, next);

                            function next() {
                                nexted++;
                                if (middleWares.length <= nexted) {
                                    return choseHandler(req, res);
                                } else {
                                    return middleWares[nexted](req, res, next);
                                }
                            }
                        } else {
                            choseHandler(req, res);
                        }
                    }
                } else if ((staticArr.length > 0) && (path.extname(pathname) === ".css" || path.extname(pathname) === ".js" || path.extname(pathname) === ".ts" || path.extname(pathname) === ".jpg" || path.extname(pathname) === ".txt" || path.extname(pathname) === ".png" || path.extname(pathname) === ".jpeg" || path.extname(pathname) === ".php" || path.extname(pathname) === ".ico" || path.extname(pathname) === ".json" || path.extname(pathname) === ".html" || path.extname(pathname) === ".mp3" || path.extname(pathname) === ".mp4" || path.extname(pathname) === ".m4r" || path.extname(pathname) === ".ogg" || path.extname(pathname) === ".ogv" || path.extname(pathname) === ".wmv" || path.extname(pathname) === ".mov" || path.extname(pathname) === ".3gp")) {
                    staticArr = staticArr;
                    helpers.staticFiles(req, res, pathname, staticArr[0].staticFolder, handlers.errorPage, requestInfo, "addRoute");
                } else {
                    res.writeHead(404);
                    return handlers.errorPage(req, res);
                }
            } else if (method === "post") {
                if (postRoutes[pathname] !== undefined) {
                    if (postRoutes[pathname].useFunc !== true) {
                        let comingData = "";
                        req.on("data", function(data) {
                            comingData += data;
                        })
                        req.on("end", function() {
                            if (comingData.length > 0) {
                                if (headers["content-type"] === "application/x-www-form-urlencoded") {
                                    comingData = querystring.parse(comingData);
                                } else if (headers["content-type"] === "application/json") {
                                    comingData = JSON.parse(comingData);
                                } else if (headers["content-type"] === "text/plain" || headers["content-type"] === "text/plain;charset=UTF-8") {
                                    try {
                                        comingData = JSON.parse(comingData);
                                    } catch (e) {
                                        comingData = comingData;
                                    }
                                }
                                req.data = comingData;
                            }
                            req.validation = helpers.validation;
                            var choseHandler = typeof postRoutes[pathname].handler == "string" ? handlers[postRoutes[pathname].handler] : postRoutes[pathname].handler;
                            let middleWares = postRoutes[pathname].middleWares;
                            if (middleWares && middleWares.length > 0) {
                                var nexted = 0;
                                middleWares[0](req, res, next);

                                function next() {
                                    nexted++;
                                    if (middleWares.length <= nexted) {
                                        return choseHandler(req, res);
                                    } else {
                                        return middleWares[nexted](req, res, next);
                                    }
                                }
                            } else {
                                choseHandler(req, res);
                            }
                        })
                    }
                } else {
                    res.writeHead(404);
                    handlers.errorPage(requestInfo);
                }
            } else if (method === "put") {
                if (putRoutes[pathname] !== undefined) {
                    if (putRoutes[pathname].useFunc !== true) {
                        let comingData = "";
                        req.on("data", function(data) {
                            comingData += data;
                        })
                        req.on("end", function() {
                            if (headers["content-type"] === "application/x-www-form-urlencoded") {
                                comingData = querystring.parse(comingData);
                            } else if (headers["content-type"] === "application/json") {
                                comingData = JSON.parse(comingData);
                            } else if (headers["content-type"] === "text/plain") {
                                try {
                                    comingData = JSON.parse(comingData);
                                } catch (e) {
                                    comingData = comingData;
                                }
                            }
                            req.data = comingData;
                            var choseHandler = typeof putRoutes[pathname].handler == "string" ? handlers[putRoutes[pathname].handler] : putRoutes[pathname].handler;
                            let middleWares = putRoutes[pathname].middleWares;
                            if (middleWares && middleWares.length > 0) {
                                var nexted = 0;
                                middleWares[0](req, res, next);

                                function next() {
                                    nexted++;
                                    if (middleWares.length <= nexted) {
                                        return choseHandler(req, res);
                                    } else {
                                        return middleWares[nexted](req, res, next);
                                    }
                                }
                            } else {
                                choseHandler(req, res);
                            }
                        })
                    }
                } else {
                    res.writeHead(404);
                    handlers.errorPage(requestInfo);
                }
            } else if (method === "patch  ") {
                if (patchRoutes[pathname] !== undefined) {
                    if (patchRoutes[pathname].useFunc !== true) {
                        let comingData = "";
                        req.on("data", function(data) {
                            comingData += data;
                        })
                        req.on("end", function() {
                            if (headers["content-type"] === "application/x-www-form-urlencoded") {
                                comingData = querystring.parse(comingData);
                            } else if (headers["content-type"] === "application/json") {
                                comingData = JSON.parse(comingData);
                            } else if (headers["content-type"] === "text/plain") {
                                try {
                                    comingData = JSON.parse(comingData);
                                } catch (e) {
                                    comingData = comingData;
                                }
                            }
                            req.data = comingData;
                            var choseHandler = typeof patchRoutes[pathname].handler == "string" ? handlers[patchRoutes[pathname].handler] : patchRoutes[pathname].handler;
                            let middleWares = patchRoutes[pathname].middleWares;
                            if (middleWares && middleWares.length > 0) {
                                var nexted = 0;
                                middleWares[0](req, res, next);

                                function next() {
                                    nexted++;
                                    if (middleWares.length <= nexted) {
                                        return choseHandler(req, res);
                                    } else {
                                        return middleWares[nexted](req, res, next);
                                    }
                                }
                            } else {
                                choseHandler(req, res);
                            }
                        })
                    }
                } else {
                    res.writeHead(404);
                    handlers.errorPage(requestInfo);
                }
            } else if (method === "delete") {
                if (deleteRoutes[pathname] !== undefined) {
                    if (deleteRoutes[pathname].useFunc !== true) {
                        let comingData = "";
                        req.on("data", function(data) {
                            comingData += data;
                        })
                        req.on("end", function() {
                            if (headers["content-type"] === "application/x-www-form-urlencoded") {
                                comingData = querystring.parse(comingData);
                            } else if (headers["content-type"] === "application/json") {
                                comingData = JSON.parse(comingData);
                            } else if (headers["content-type"] === "text/plain") {
                                try {
                                    comingData = JSON.parse(comingData);
                                } catch (e) {
                                    comingData = comingData;
                                }
                            }
                            req.data = comingData;
                            var choseHandler = typeof deleteRoutes[pathname].handler == "string" ? handlers[deleteRoutes[pathname].handler] : postRoutes[pathname].handler;
                            let middleWares = deleteRoutes[pathname].middleWares;
                            if (middleWares && middleWares.length > 0) {
                                var nexted = 0;
                                middleWares[0](req, res, next);

                                function next() {
                                    nexted++;
                                    if (middleWares.length <= nexted) {
                                        return choseHandler(req, res);
                                    } else {
                                        return middleWares[nexted](req, res, next);
                                    }
                                }
                            } else {
                                choseHandler(req, res);
                            }
                        })
                    }
                } else {
                    res.writeHead(404);
                    handlers.errorPage(requestInfo);
                }
            }
        })
        server.listen(port);
    }
}

module.exports = new BuildServer();