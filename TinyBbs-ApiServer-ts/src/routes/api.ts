import Router from "koa-router";
const router = new Router();
import { signup, signin, signout } from "./api_user";
import { basicAuthUser } from "../middlewares/user";

router.prefix("/api");

router.use(basicAuthUser);

router.get("/", (ctx, next) => {
  ctx.status = 404;
  ctx.body = { message: "api root" };
});

router.post("/user/signup", signup);
router.post("/user/signin", signin);
router.get("/user/signout", signout);

export default router;
