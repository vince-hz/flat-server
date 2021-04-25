import { FastifySchema, PatchRequest, Response } from "../../../../../types/Server";
import { FastifyReply } from "fastify";
import { Status } from "../../../../../constants/Project";
import { ErrorCode } from "../../../../../ErrorCode";
import { registerOrLoginWechat } from "../Utils";

export const callback = async (
    req: PatchRequest<{
        Querystring: CallbackQuery;
    }>,
    reply: FastifyReply,
): Response<CallbackResponse> => {
    const { state: authUUID, code } = req.query;

    try {
        return await registerOrLoginWechat(code, authUUID, "MOBILE", reply);
    } catch (err: unknown) {
        console.error(err);

        return {
            status: Status.Failed,
            code: ErrorCode.CurrentProcessFailed,
        };
    }
};

interface CallbackQuery {
    state: string;
    code: string;
}

export const callbackSchemaType: FastifySchema<{
    querystring: CallbackQuery;
}> = {
    querystring: {
        type: "object",
        required: ["state", "code"],
        properties: {
            state: {
                type: "string",
                format: "uuid-v4",
            },
            code: {
                type: "string",
            },
        },
    },
};

interface CallbackResponse {
    name: string;
    avatar: string;
    userUUID: string;
    token: string;
}
