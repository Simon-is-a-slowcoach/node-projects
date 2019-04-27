import User from "../models/user";
import { RouterContext } from "koa-router";

export async function signup(ctx: RouterContext, next: () => Promise<any>) {
    const { username, password } = ctx.request.body;
    const user = await new User({ username, password }).save();
    ctx.body = {
        data: {
            user: user.toJSON()
        }
    };
}

export async function signin(ctx: RouterContext, next: () => Promise<any>) {
    const { username, password } = ctx.request.body;
    const matchedUser = await User.authenticate(username, password);
    if (matchedUser) {
        ctx.body = {
            data: {
                user: matchedUser.toJSON()
            }
        };
    } else {
        ctx.status = 401;
        ctx.body = { message: "invalid username or password" };
    }
}
