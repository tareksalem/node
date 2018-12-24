const Grandjs = require("./backend/Grand");
const http = require("http");
Grandjs.setConfig({
    port: process.env.PORT || 8000,
    http: http,
    staticFolder: "frontend",
    session: true,
    ENCRYPTION_KEY: "ncryptiontestforencryptionproces",
    setCookie: {
        expires: {
            days: 20,
            minutes: 30
        }
    },
    handlers: {
        errorPage: (req, res) => {
            res.json({
                message: "page not found"
            })
        }
    }
});

Grandjs.initServer();
require("./backend/routers/index");