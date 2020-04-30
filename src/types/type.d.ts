import { Context, Next } from "koa"

export type ResultData = {
    code: number;
    msg?: string;
    data?: any;
    err?: any;
}

type RouteMeta = {
    name: string;
    method: string;
    path: string;
    isVerify: boolean;
}

export type MiddleWare = (...arg: any[]) => (ctx: Context, next?: Next) => Promise<void>;

