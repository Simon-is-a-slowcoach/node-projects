import User from "../models/user";
import { RouterContext } from "koa-router";
import makeResp from "./utils";

export async function signup(ctx: RouterContext, next: () => Promise<any>) {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
        makeResp(ctx, 403, "username and password required");
        return;
    }
    const user = await new User({ username, password }).save();
    ctx.session.uid = user.id;
    ctx.body = {
        data: {
            user: user.toJSON()
        }
    };
}

export async function signin(ctx: RouterContext, next: () => Promise<any>) {
    const { username, password } = ctx.request.body;
    if (!username || !password) {
        makeResp(ctx, 403, "username and password required");
        return;
    }
    const matchedUser = await User.authenticate(username, password);
    if (matchedUser) {
        ctx.session.uid = matchedUser.id;
        ctx.body = {
            data: {
                user: matchedUser.toJSON()
            }
        };
    } else {
        makeResp(ctx, 401, "invalid username or password");
        ctx.session.uid = null;
    }
}

export function signout(ctx: RouterContext, next: () => Promise<any>) {
    ctx.session = null;
    ctx.body = {
        message: "logged out",
    };
}
