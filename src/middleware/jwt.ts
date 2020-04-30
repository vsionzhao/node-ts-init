import jsonWebToken from 'jsonwebtoken'
import {MiddleWare, ResultData} from "@/types/type";
import { app } from '@/config';
import log from '@/utils/logger';

const jwt: MiddleWare = (path: string, isVerify: boolean)  => async (ctx, next) => {
    // 签发token, 并设置到header
    ctx.sign = (payload: {uid: string, name: string}, exp: number|string) => {
        const token = jsonWebToken.sign(payload, app.secret, { expiresIn: exp || app.exp })
        ctx.set('Authorization', token);
    }

    // 校验token
    if (isVerify && path === ctx.path) {
        // 403
        if (!ctx.header || !ctx.header.authorization) {
            ctx.body = {code: 403, msg: 'Authorization not exist'}
        } else {
            const authorization = ctx.header.authorization;
            try {
                ctx.state.token = await jsonWebToken.verify(authorization, app.secret)
            } catch (err) {
                // 403
                err.url = ctx.url;
                log.error(err);
                let obj: ResultData = { code: 403, msg: err.message };
                if (ctx.app.env === 'development') {
                    obj.err = err;
                }
                ctx.body = obj;
            }

            // 通过验证
            if (ctx.state.token) await next();
        }
    } else {
        await next();
    }
}

export default jwt;
