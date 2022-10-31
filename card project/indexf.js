const hello = "Hello World! I hope it is good to you";
const http = require("http");
const fs = require("fs");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./replace-template.js");
console.log(hello);
const templatemain = fs.readFileSync(`${__dirname}/index.html`, "utf-8");
const templatecard = fs.readFileSync(
  `${__dirname}/card-template.html`,
  "utf-8"
);
const templateproduct = fs.readFileSync(
  `${__dirname}/product-template.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
const productdata = JSON.parse(data);
const slug = productdata.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugify("Fresh Avacados", { lower: true }));
console.log(slug);
// //////////\
// SERVER

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardshtml = productdata
      .map((el) => replaceTemplate(templatecard, el))
      .join("");
    const output = templatemain.replace(`{%PRODUCT_CARDS%}`, cardshtml);
    res.end(output);
    // const card = productdata[query.id];
    // const output = replaceTemplate(templatemain, card);
    // res.end(output);
    // const product = productdata[query.id];
    // const output = replaceTemplate(templateproduct, product);
    // res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = productdata[query.id];
    const output = replaceTemplate(templateproduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(templatecard);
  } else {
    res.end(`<h1>Page not found</h1>`);
  }
});
server.listen(8000, "127.0.0.1", () =>
  console.log("listen to request on port 8000")
);



