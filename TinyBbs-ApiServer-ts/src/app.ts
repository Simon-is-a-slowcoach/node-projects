import Koa from "koa";
const app = new Koa();
// import views = require("koa-views");
import json = require("koa-json");
import onerror = require("koa-onerror");
import bodyparser = require("koa-bodyparser");
import logger = require("koa-logger");

import index from "./routes/index";
import api from "./routes/api";

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ["json", "form", "text"],
}));
app.use(json());
app.use(logger());
app.use((require("koa-static"))(__dirname + "/public"));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = +(new Date()) - +start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes());
app.use(index.allowedMethods());
app.use(api.routes());
app.use(api.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

export = app;
