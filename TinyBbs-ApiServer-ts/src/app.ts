import Koa from "koa";
// import views = require("koa-views");
import json = require("koa-json");
import onerror = require("koa-onerror");
import bodyparser = require("koa-bodyparser");
import logger = require("koa-logger");
import session from "koa-session";

import { sessionUser } from "./middlewares/user";

import index from "./routes/index";
import apis from "./routes/apis";
import connectDb from "./models/dbConnector";

const app = new Koa();

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ["json", "form", "text"],
}));
app.use(json());
app.use(logger());
app.use((require("koa-static"))(__dirname + "/public"));

// session middleware
app.keys = ["some secret hurr"];
const sessionConfig = {
  key: "koa:sess",
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};
app.use(session(sessionConfig, app));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = +(new Date()) - +start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(sessionUser);

// routes
app.use(index.routes());
app.use(index.allowedMethods());
app.use(apis.routes());
app.use(apis.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

// database(mongoose)
connectDb(app);

export = app;
