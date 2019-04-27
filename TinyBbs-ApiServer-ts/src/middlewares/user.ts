import User from "../models/user";
import { RouterContext } from "koa-router";

function getSessionUid(ctx: RouterContext) {
    return ctx.session ? ctx.session.uid : null;
}

// get user json object
async function getCtxUser(userId: number) {
    const user = await User.findByUserId(userId);
    return user ? user.toJSON() : null;
}

export default async function sessionUser(ctx: RouterContext, next: () => Promise<any>) {
    const uidStart = getSessionUid(ctx);
    if (uidStart && !ctx.user) {
        if (!ctx.user) {
            ctx.user = await getCtxUser(uidStart);
            // console.log(`start user: ${ctx.user.username}`);
        }
    } else {
        // console.log("start user null");
        ctx.user = null;
    }
    await next();
    const uidEnd = getSessionUid(ctx);
    if (uidEnd) {
        if (uidEnd !== uidStart) {
            ctx.user = await getCtxUser(uidEnd);
            // console.log(`end user: ${ctx.user.username}`);
        }
    } else {
        // console.log("end user null");
        ctx.user = null;
    }
}
