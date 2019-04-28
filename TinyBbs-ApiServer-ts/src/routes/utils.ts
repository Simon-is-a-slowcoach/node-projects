import { RouterContext } from "koa-router";

export default function makeResp(ctx: RouterContext, status: number, message: string) {
    ctx.status = status;
    ctx.body = {
        message,
    };
}
