const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const crypto = require("crypto");
global.root_dir = "../../";
const helpers = {
    hash: function(string) {
        if (typeof string === "string" && string.length > 0) {
            let hash = crypto.createHmac("sha256", "hashPassowrd").update(string).digest();
            return hash;
        } else {
            return false;
        }
    }
};
// function to hash passwords

// validation method to validate body data of request
helpers.validation = {};
// validate the email
helpers.validation.checkEmail = function(string, cb) {
    var elementVal = string;
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
helpers.validation.notEmpty = function(string, cb) {
        elementVal = string !== undefined ? string : "";
        if (elementVal === "") {
            if (!cb) {
                return false;
            }
            if (cb) {
                var empty = false;
                return cb(empty)
            }
        } else {
            if (cb) {
                var empty = true;
                return cb(empty);
            } else {
                return true;
            }
        }
    }
    // method to check if the value is contains a number
helpers.validation.checkContainsNumber = function(string, count, cb) {
    var elementVal = string;
    if (typeof count === "function" && !cb) {
        cb = count;
    }
    count = typeof count === "number" ? count : 1;
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
helpers.validation.checkIsNumber = function(element, cb) {
        var elementVal = element;
        if (elementVal !== "") {
            var testNumber = Number.isInteger(Number(elementVal));
            if (cb) {
                return cb(testNumber);
            } else {
                return testNumber;
            }
        }
    }
    // function to crypt strings
    // Must be 256 bytes (32 characters)

helpers.enCrypt = function(text) {
        var IV_LENGTH = 16; // For AES, this is always 16
        var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
    // const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY = "ncryptiontestforencryptionproces";
helpers.deCrypt = function(text) {
        var IV_LENGTH = 16; // For AES, this is always 16
        var ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
        let textParts = text.split(':');
        let iv = new Buffer(textParts.shift(), 'hex');
        let encryptedText = new Buffer(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    // function to parse cookies
helpers.parseCookies = function(request) {
    var list = {},
        rc = request.headers.cookie;
    rc && rc.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}
helpers.render = function(options) {
    let data = options.data ? options.data : {};
    let layout = options.layout;
    let container = options.container || "views"
        // container = path.join(baseDir, container);
        // container = path.resolve(, container)
    let body = options.body ? fs.readFileSync(`${global.root_dir}/${container}/${options.body}`, "utf8") : "<body></body>";
    body = handlebars.compile(body, { strict: true });
    body = body(data);
    data.body = body;
    let req = options.req;
    let res = options.res;
    let partials = options.partials ? options.partials : [];
    if (partials.length > 0) {
        partials.forEach(function(partial) {
            let partialName = path.basename(partial).split(".")[0];
            var partialFile = fs.readFileSync(`${global.root_dir}${container}/${partial}`, "utf8");
            handlebars.registerPartial(partialName, partialFile);
        })
    }
    // try {
    var htmlFile = fs.readFileSync(`${global.root_dir}/${container}/${layout}`, "utf8");
    if (htmlFile) {
        htmlFile = handlebars.compile(htmlFile, { strict: true });
        htmlFile = htmlFile(data);
        res.end(htmlFile);
    }
    // } catch (e) {
    res.writeHead(302);
    res.end("");
    // }
}
helpers.json = function(res, data) {
    data = JSON.stringify(data);
    res.end(data);
}
helpers.sendFile = function(req, res, file) {
    var mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/js",
        ".png": "image/png",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpg",
        ".json": "application/json",
        ".txt": "text/text",
        ".xml": "text/xml"
    };
    var fileSource = path.join(__dirname, global.root_dir + file);
    fs.exists(fileSource, function(exist) {
        if (exist) {
            var headers = { "content-type": mimeTypes[path.extname(file)] };
            var fileStream = fs.createReadStream(fileSource);
            res.writeHead(200, headers);
            fileStream.pipe(res);
        } else {
            res.writeHead(302);
        }
    })
}
helpers.staticFiles = function(req, res, pathname, staticFolder, errorPage, info, typeReq) {
    var sourceFolder = staticFolder;
    var mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "text/js",
        ".png": "image/png",
        ".jpeg": "image/jpeg",
        ".jpg": "image/jpeg",
        ".json": "application/json",
        ".mp3": "audio/mpeg",
        ".mp4": "video/mp4",
        ".flv": "video/x-flv",
        ".m3u8": "application/x-mpegURL",
        ".ts": "video/MP2T",
        ".3gp": "video/3gpp",
        ".mov": "video/quicktime",
        ".avi": "video/x-msvideo",
        ".wmv": "video/x-ms-wmv",
        ".ogg": "audio/ogg",
        ".ogv": "video/ogg",
        ".opus": "audio/ogg",
    };
    // staticFolder = staticFolder !== staticFolder ? staticFolder : "";
    var dirName = path.join(__dirname, `${global.root_dir}/${sourceFolder}`);
    var fileSource = path.join(dirName, pathname);
    console.log(fileSource)
    var existFile = fs.existsSync(fileSource);
    console.log(existFile)
    if (existFile) {
        try {
            var headers = { "Content-Type": mimeTypes[path.extname(pathname)] };
            var fileStream = fs.createReadStream(fileSource);
            res.writeHead(200, headers);
            if (typeReq === "use") {
                res.end(fs.readFileSync(fileSource))
            } else if (typeReq === "addRoute") {
                fileStream.pipe(res);
            }
        } catch (e) {
            return false;
        }
    } else {
        res.writeHead(304);
        res.end("")
            // if (typeReq === "use") {
            // res.end("");
            // } else if (typeReq === "addRoute") {
            // return helpers.staticFiles(req, res, pathname, staticFolder, errorPage, info, typeReq);
            // errorPage(req, res);
            // }
    }
}


module.exports = helpers;