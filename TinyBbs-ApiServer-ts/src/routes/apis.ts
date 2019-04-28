import Router from "koa-router";
const router = new Router();
import * as userApi from "./api_user";
import * as topicApi from "./api_topic";
import { basicAuthUser } from "../middlewares/user";

router.prefix("/api");

router.use(basicAuthUser);

router.get("/", (ctx, next) => {
  ctx.status = 404;
  ctx.body = { message: "api root" };
});

// user
router.post("/user/signup", userApi.signup);
router.post("/user/signin", userApi.signin);
router.get("/user/signout", userApi.signout);

// topic
router.get("/topic/latest", topicApi.latest);
router.get("/topic/:id", topicApi.get);
router.post("/topic/create", topicApi.create);

export default router;
