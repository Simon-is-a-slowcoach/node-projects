import User from "../models/user";
import { RouterContext } from "koa-router";
import auth from "basic-auth";

function getSessionUid(ctx: RouterContext) {
    return ctx.session ? ctx.session.uid : null;
}

async function getCtxUser(userId: number) {
    const user = await User.findByUserId(userId);
    return user || null;
}

async function getCtxRemoteUser(username: string, password: string) {
    const user = await User.authenticate(username, password);
    return user || null;
}

export async function basicAuthUser(ctx: RouterContext, next: () => Promise<any>) {
    const authResult = auth(ctx.req);
    const couldAuth = authResult && authResult.name && authResult.pass;
    if (couldAuth) {
        const { name: username, pass: password } = authResult;
        const user = await getCtxRemoteUser(username, password);
        // console.log(`basic-auth with user: ${user.username}`);
        ctx.remoteUser = user;
    }
    await next();
    ctx.remoteUser = null;
}

export async function sessionUser(ctx: RouterContext, next: () => Promise<any>) {
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
