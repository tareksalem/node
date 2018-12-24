const Grandjs = require("../Grand");

Grandjs.use({
    path: "/",
    handler: (req, res) => {
        if (!req.headers.ajax) {
            res.render({
                data: {
                    title: "hello app"
                },
                container: "views",
                layout: "views/layouts/layout.html"
            })
        }
    }

})
Grandjs.addRoute({
    method: "get",
    url: "/ss",
    handlerName: "homePage",
    handler: (req, res) => {
        if (req.headers.ajax) {
            res.json({
                message: "hello world"
            })
        }
    }
})