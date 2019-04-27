import Router from "koa-router";
const router = new Router();
import { signup, signin } from "./api_user";

router.prefix("/api");

router.get("/", (ctx, next) => {
  ctx.status = 404;
  ctx.body = { message: "api root" };
});

router.post("/user/signup", signup);
router.post("/user/signin", signin);

export default router;
