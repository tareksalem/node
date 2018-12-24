var query = {};
window.location.search.substring(1).split('&').forEach(function(pair) {
    pair = pair.split('=');
    if (pair[1] !== undefined) {
        var key = decodeURIComponent(pair[0]),
            val = decodeURIComponent(pair[1]),
            val = val ? val.replace(/\++/g, ' ').trim() : '';
        if (key.length === 0) {
            return;
        }
        if (query[key] === undefined) {
            query[key] = val;
        } else {
            if ("function" !== typeof query[key].push) {
                query[key] = [query[key]];
            }
            query[key].push(val);
        }
    }
});


class Router {
    // define some settings of class
    constructor(active) {
        this.request = {};
        this.request.location = window.location;
        this.response = {};
        this.response.render = function(status, path, parent, name, cb) {
            active.render(status, path, parent, name, cb);
        };
        this.response.useComponent = (component, parent) => {
            active.useComponent(component, parent);
        }
        this.response.renderComponent = function(cb, options, finish) {
            active.renderComponent(cb, options, finish);
        };
        this.response.filterContent = function(element, options, cb) {
            active.filterContent(element, options, cb);
        };
        this.response.redirect = function(url) {
            location.replace(url);
        };
        this.getRoutes = {};
        this.postRoutes = {};
        this.putRoutes = {};
        this.deleteRoutes = {};
        this.MainPathName = location.pathname;
        this.useRoutes = {};
    }
    getRoute(options) {
        var params = {};
        var request = this.request;
        request.query = query;
        var scapeError = options.scapeError;
        var response = this.response;
        options.method = "get";
        let errorPage = this.errorPage;
        let url = options.url;
        var urlArray = url.split(":");
        var paramsArr;
        if (urlArray.length > 0) {
            url = urlArray[0];
            urlArray.splice(0, 1);
            paramsArr = urlArray;

        }
        let MainPathName = this.MainPathName;
        let handler = options.handler;
        let title = options.title;
        let getRoutes = this.getRoutes;
        getRoutes[url] = options;
        document.addEventListener("click", (e) => {
            if (e.detail === 1) {
                var routers = document.querySelectorAll("[router]");
                let clickedRouter = Array.from(routers).find((router) => e.target === router);
                if (clickedRouter) {
                    e.preventDefault();
                    var routerVal = clickedRouter.getAttribute("router");
                    // check if the pathname of it equals the current pathname
                    if (scapeError === true) {
                        if (getRoutes[routerVal] !== undefined || routerVal.indexOf(url) !== -1) {
                            if (routerVal === url || routerVal.indexOf(url) !== -1) {
                                document.title = title;
                                var paramsValuesArr = routerVal.split(url);
                                paramsValuesArr.splice(0, 1);
                                paramsValuesArr = paramsValuesArr.join("");
                                paramsValuesArr = paramsValuesArr.split("/");
                                paramsValuesArr.splice(0, 1);
                                if (paramsValuesArr.length > 0) {
                                    paramsValuesArr.forEach((val, i) => {
                                        if (val == "/") {
                                            paramsValuesArr.splice(i, 1);
                                        }
                                    })
                                    paramsArr.forEach((param, i) => {
                                        if (paramsValuesArr[i] !== undefined) {
                                            params[param] = paramsValuesArr[i];
                                        }
                                    })
                                    request.params = params;
                                } else {
                                    request.params = {};
                                }
                                getRoutes[routerVal] = getRoutes[url];
                                let middlewares = getRoutes[routerVal].middlewares;
                                if (middlewares && middlewares.length > 0) {
                                    var nexted = 0;
                                    middlewares[0](request, response, next)

                                    function next() {
                                        nexted++;
                                        if (middlewares.length <= nexted) {
                                            history.pushState({
                                                url: routerVal,
                                                title: title,
                                                callback: getRoutes[routerVal].handler.toString()
                                            }, title, routerVal);
                                            return getRoutes[routerVal].handler(request, response);
                                        } else {
                                            return middlewares[nexted](request, response, next);
                                        }
                                    }
                                } else {
                                    history.pushState({
                                        url: routerVal,
                                        title: title,
                                        callback: getRoutes[routerVal].handler.toString()
                                    }, title, routerVal);
                                    getRoutes[routerVal].handler(request, response);
                                }
                            }
                        } else {
                            return errorPage();
                        }
                    } else if (scapeError === false) {
                        if (getRoutes[routerVal] !== undefined) {
                            if (routerVal === url) {
                                document.title = title;
                                let middlewares = getRoutes[routerVal].middlewares;
                                if (middlewares && middlewares.length > 0) {
                                    var nexted = 0;
                                    middlewares[0](request, response, next)

                                    function next() {
                                        nexted++;
                                        if (middlewares.length <= nexted) {
                                            history.pushState({
                                                url: routerVal,
                                                title: title,
                                                callback: getRoutes[routerVal].handler.toString()
                                            }, title, routerVal);
                                            return getRoutes[routerVal].handler(request, response);
                                        } else {
                                            return middlewares[nexted](request, response, next);
                                        }
                                    }
                                } else {
                                    history.pushState({
                                        url: routerVal,
                                        title: title,
                                        callback: getRoutes[routerVal].handler.toString()
                                    }, title, routerVal);
                                    getRoutes[routerVal].handler(request, response);
                                }
                            }
                        } else {
                            return errorPage();
                        }
                    }
                }
            }
        })
        if (scapeError === true) {
            if (getRoutes[MainPathName] !== undefined || MainPathName.indexOf(url) !== -1) {
                if (MainPathName === url || MainPathName.indexOf(url) !== -1) {
                    var paramsValuesArr = MainPathName.split(url);
                    paramsValuesArr.splice(0, 1);
                    paramsValuesArr = paramsValuesArr.join("");
                    paramsValuesArr = paramsValuesArr.split("/");
                    paramsValuesArr.splice(0, 1);
                    if (paramsValuesArr.length > 0) {
                        paramsValuesArr.forEach((val, i) => {
                            if (val == "/") {
                                paramsValuesArr.splice(i, 1);
                            }
                        })
                        paramsArr.forEach((param, i) => {
                            if (paramsValuesArr[i] !== undefined) {
                                params[param] = paramsValuesArr[i];
                            }
                        })
                        request.params = params;
                        getRoutes[MainPathName] = getRoutes[url];
                    } else {
                        // delete getRoutes[MainPathName];
                        request.params = {};
                    }
                    let middlewares = getRoutes[MainPathName].middlewares;
                    document.title = title;
                    if (middlewares && middlewares.length > 0) {
                        var nexted = 0;

                        function next() {
                            nexted++;
                            if (middlewares.length <= nexted) {
                                history.pushState({
                                    url: MainPathName,
                                    title: title,
                                    callback: handler.toString()
                                }, title, MainPathName);
                                return getRoutes[MainPathName].handler(request, response);
                            } else {
                                return middlewares[nexted](request, response, next);
                            }
                        }
                        middlewares[0](request, response, next)
                    } else {
                        history.pushState({
                            url: MainPathName,
                            title: title,
                            callback: handler.toString()
                        }, title, MainPathName);
                        return getRoutes[MainPathName].handler(request, response);
                    }
                }
            } else {
                return errorPage();
            }
        } else if (scapeError === false) {
            if (getRoutes[MainPathName] !== undefined) {
                if (MainPathName === url) {
                    console.log(MainPathName)
                    let middlewares = getRoutes[url].middlewares;
                    document.title = title;
                    if (middlewares && middlewares.length > 0) {
                        var nexted = 0;

                        function next() {
                            nexted++;
                            if (middlewares.length <= nexted) {
                                history.pushState({
                                    url: MainPathName,
                                    title: title,
                                    callback: handler.toString()
                                }, title, MainPathName);
                                return getRoutes[url].handler(request, response);
                            } else {
                                return middlewares[nexted](request, response, next);
                            }
                        }
                        middlewares[0](request, response, next)
                    } else {
                        history.pushState({
                            url: MainPathName,
                            title: title,
                            callback: handler.toString()
                        }, title, MainPathName);
                        return getRoutes[MainPathName].handler(request, response);
                    }
                }
            } else {
                return errorPage();
            }
        }
    }
    popState() {
        var pathname = location.pathname;
        var getRoutes = this.getRoutes;
        var request = this.request;
        var response = this.response;
        window.addEventListener("popstate", function(event) {
            if (event.state !== null) {
                if (getRoutes[event.state.url] !== undefined) {
                    if (event.state.title) {
                        document.querySelector("title").innerHTML = event.state.title;
                    }
                    let middlewares = getRoutes[event.state.url].middlewares;
                    if (middlewares && middlewares.length > 0) {
                        var nexted = 0;
                        middlewares[0](request, response, next)

                        function next() {
                            nexted++;
                            if (middlewares.length <= nexted) {
                                return getRoutes[event.state.url].handler(request, response);
                            } else {
                                return middlewares[nexted](request, response, next);
                            }
                        }
                    } else {
                        return getRoutes[event.state.url].handler(request, response);
                    }
                }
            }
        });
    }
    postRoute(options) {
        let url = options.url;
        let postRoutes = this.postRoutes;
        if (postRoutes[url] == undefined) {
            postRoutes[url] = options;
        }
        let request = this.request;
        let response = this.response;
        request.checks = {};
        let checks = request.checks;
        document.addEventListener("submit", function(e) {
            try {
                if (e.target.getAttribute("clientPosting") === "true") {
                    var submitionCount = 0;
                    e.preventDefault();
                    var body = {};
                    body.form = e.target;
                    request.action = body.form.action;
                    var inputs = body.form.querySelectorAll("input");
                    var textarea = body.form.querySelectorAll("textarea");
                    var selects = body.form.querySelectorAll("select");
                    selects.forEach(function(select, i) {
                        if (select.length > 0) {
                            var name = select.getAttribute("name");
                            body[name] = select;
                        }
                    });
                    inputs.forEach(function(input, i) {
                        if (inputs.length > 0) {
                            var name = input.getAttribute("name");
                            body[name] = input;
                        }
                    });
                    textarea.forEach((area, i) => {
                            if (textarea.length > 0) {
                                var textareaName = area.getAttribute("name");
                                body[textareaName] = area;
                            }
                        })
                        // add validation to the form
                    checks.checkEmpty = function(element, cb) {
                        var elementVal = typeof element == "object" ? element.value : typeof element == "string" ? element : "";
                        if (elementVal == "") {
                            if (!cb) {
                                return true;
                            }
                            if (cb) {
                                var empty = true;
                                return cb(empty)
                            }
                        } else {
                            if (cb) {
                                var empty = false;
                                return cb(empty);
                            } else {
                                return false;
                            }
                        }
                    }
                    checks.checkEmail = function(element, cb) {
                            var elementVal = typeof element == "object" ? element.value : typeof element == "string" ? element : "";
                            var regEx = new RegExp("@", "gi");
                            if (elementVal !== "") {
                                if (cb) {
                                    var test = regEx.test(elementVal);
                                    return cb(test);
                                } else {
                                    return regEx.test(elementVal);
                                }
                            }
                        }
                        // function to check if it is number
                    checks.checkIsNumber = function(element, cb) {
                        var elementVal = typeof element == "object" ? element.value : typeof element == "string" ? element : "";
                        if (elementVal !== "") {
                            var testNumber = Number.isInteger(Number(elementVal));
                            if (cb) {
                                return cb(testNumber);
                            } else {
                                return testNumber;
                            }
                        }
                    }

                    // function to check if contains a number
                    checks.checkContainsNumber = function(element, count, cb) {
                        var elementVal = typeof element == "object" ? element.value : typeof element == "string" ? element : "";
                        if (typeof count == "function" && !cb) {
                            cb = count;
                        }
                        count = typeof count == "number" ? count : 1;
                        var numArr = [];
                        if (elementVal !== "") {
                            Array.from(elementVal).forEach(function(letter) {
                                if (Number.isInteger(Number(letter))) {
                                    numArr.push(letter);
                                }
                            });
                            if (numArr.length === count) {
                                let result = true;
                                if (cb) {
                                    return cb(result);
                                } else {
                                    return result;
                                }
                            } else {
                                let result = false;
                                if (cb) {
                                    return cb(result);
                                } else {
                                    return result;
                                }
                            }
                        }
                    }
                    var act = new RegExp(location.origin, "gi");
                    act = act.exec(request.action);
                    var action = request.action.replace(act, "");
                    if (action === url) {
                        request.body = body;
                        request.action = action;
                        let middlewares = postRoutes[action].middlewares;
                        if (middlewares && middlewares.length > 0) {
                            var nexted = 0;
                            middlewares[0](request, response, next)

                            function next() {
                                nexted++;
                                if (middlewares.length <= nexted) {
                                    return postRoutes[action].handler(request, response);
                                } else {
                                    return middlewares[nexted](request, response, next);
                                }
                            }
                        } else {
                            return postRoutes[action].handler(request, response);
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
        });
    }
    redirect(url) {
        location.replace(url);
    }
    errorPage(cb) {
        if (this) {
            let useRoutes = this.useRoutes;
            let getRoutes = this.getRoutes;
            let MainPathName = location.pathname;
            var usedUrl = Object.keys(useRoutes).find((key) => MainPathName.indexOf(key) !== -1);
            var checker = setInterval(() => {
                if (document.readyState == "complete") {
                    clearTimeout(checker);
                    if (usedUrl) {
                        return true;
                    } else if (getRoutes[MainPathName] !== undefined) {
                        return true;
                    } else {
                        if (cb) {
                            return cb();
                        }
                    }
                }
            }, 10)
        }
    }
    error(cb) {
        console.log(this.getRoutes[this.MainPathName])
        console.log(this.MainPathName)
        console.log(this.getRoutes)
        if (this.getRoutes[this.MainPathName] !== undefined) {
            return true;
        } else {
            return cb(this.request, this.response);
        }
    }
}
export { Router };