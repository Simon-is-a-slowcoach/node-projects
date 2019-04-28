import Comment from "../models/comment";
import Topic from "../models/topic";
import { RouterContext } from "koa-router";
import makeResp from "./utils";
import { ICommentDocument } from "../models/interfaces/ICommentDocument";
import { ITopicDocument } from "../models/interfaces/ITopicDocument";

export async function get(ctx: RouterContext, next: () => Promise<any>) {
    const id = ctx.params.id;
    if (id == null) {
        makeResp(ctx, 404, "comment id required");
        return;
    }
    const comment = await Comment.findByCommentId(id);
    if (!comment) {
        makeResp(ctx, 404, "no such comment");
        return;
    }
    ctx.body = {
        data: {
            comment: comment.toJSON(),
        }
    };
}

export async function latest(ctx: RouterContext, next: () => Promise<any>) {
    let { page, limit, topicId, commentId } = ctx.query;
    page = +page || 0;
    limit = +limit || 10;
    const skip = page * limit;

    topicId = +topicId || null;
    commentId = +commentId || null;

    let topic: ITopicDocument = null;
    if (topicId) {
        topic = await Topic.findByTopicId(topicId);
        if (!topic) {
            makeResp(ctx, 400, "invalid topic id");
            return;
        }
    }

    let replyTo: ICommentDocument = null;
    if (commentId) {
        replyTo = await Comment.findByCommentId(commentId);
        if (!replyTo) {
            makeResp(ctx, 400, "invalid comment id");
            return;
        }
    }

    if (topic && replyTo && replyTo.underTopic.id !== topic.id) {
        makeResp(ctx, 400, "invalid topic or reply id");
        return;
    }

    const query: any = {};
    if (topic ) {
        query.underTopic = topic;
    }
    if (replyTo) {
        query.replyTo = replyTo;
    }

    const commentsData = await Comment.find(query)
        .skip(skip).limit(limit).sort({ createdAt: -1 })
        .populate([{ path: "author" }, { path: "underTopic" }, { path: "replyTo" }]);
    const commentsJSON = commentsData.map((comment) => comment.toJSON());
    ctx.body = {
        data: {
            comments: commentsJSON,
        }
    };
}

export async function create(ctx: RouterContext, next: () => Promise<any>) {
    const user = ctx.user || ctx.remoteUser;
    if (!user) {
        makeResp(ctx, 401, "needs to authenticate");
        return;
    }
    const { content, topicId, replyToId } = ctx.request.body;
    if (!content) {
        makeResp(ctx, 400, "can not create empty content");
        return;
    }
    if (!topicId) {
        makeResp(ctx, 400, "topic id required");
        return;
    }
    const topic = await Topic.findByTopicId(topicId);
    if (!topic) {
        makeResp(ctx, 400, "invalid topic id");
        return;
    }
    let replyTo: ICommentDocument = null;
    let repliedCommentNeedsUpdate = false;
    if (replyToId) {
        replyTo = await Comment.findByCommentId(replyToId);
        if (!replyTo) {
            makeResp(ctx, 400, "invalid reply to id");
            return;
        } else {
            repliedCommentNeedsUpdate = !replyTo.replied;
            replyTo.replied = true;
        }
    }

    if (topic && replyTo && topic.id !== replyTo.underTopic.id) {
        makeResp(ctx, 400, "invalid topic or reply id");
        return;
    }

    let comment = new Comment({ content, author: user, underTopic: topic, replyTo });
    if (!repliedCommentNeedsUpdate) {
        comment = await comment.save();
    } else {
        comment = (await Promise.all([replyTo.save(), comment.save()]))[1];
    }
    ctx.body = {
        data: {
            comment: comment.toJSON(),
        }
    };
}
