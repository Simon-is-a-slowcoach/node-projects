import Router from "koa-router";
const router = new Router();

router.prefix("/api");

router.get("/", (ctx, next) => {
  ctx.status = 404;
  ctx.body = { message: "api root" };
});

export default router;
