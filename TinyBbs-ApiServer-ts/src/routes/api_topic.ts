import Topic from "../models/topic";
import { RouterContext } from "koa-router";
import makeResp from "./utils";

export async function get(ctx: RouterContext, next: () => Promise<any>) {
    const id = ctx.params.id;
    if (id == null) {
        makeResp(ctx, 404, "topic id required");
        return;
    }
    const topic = await Topic.findByTopicId(id);
    if (!topic) {
        makeResp(ctx, 404, "no such topic");
        return;
    }
    ctx.body = {
        data: {
            topic: topic.toJSON(),
        }
    };
}

export async function latest(ctx: RouterContext, next: () => Promise<any>) {
    let { page, limit } = ctx.query;
    page = +page || 0;
    limit = +limit || 10;
    const skip = page * limit;
    const topicsData = await Topic.find({}).skip(skip).limit(limit).sort({ createdAt: -1 }).populate("author");
    const topicsJSON = topicsData.map((topic) => topic.toJSON());
    ctx.body = {
        data: {
            topics: topicsJSON,
        }
    };
}

export async function create(ctx: RouterContext, next: () => Promise<any>) {
    const user = ctx.user || ctx.remoteUser;
    if (!user) {
        makeResp(ctx, 401, "needs to authenticate");
        return;
    }
    const { title, content } = ctx.request.body;
    if (!title || !content) {
        makeResp(ctx, 403, "title and content can't be empty");
        return;
    }
    const topic = await new Topic({ title, content, author: user }).save();
    ctx.body = {
        data: {
            topic: topic.toJSON(),
        }
    };
}
