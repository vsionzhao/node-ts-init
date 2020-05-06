import 'reflect-metadata'
import { ROUTER_MAP } from '@/constant'
import {HttpType} from "@/types/global";

export type HttpMethodDecoratorType = (path: string, isVerify?: boolean) => (proto: any, name: string) => void;

/**
 * @desc 生成 http method 装饰器
 * @param {string} method - http method，如 get、post、head
 * @return Decorator - 装饰器
 */
function createMethodDecorator(method: string) {
    // 装饰器接收路由 path 作为参数
    let fn: HttpMethodDecoratorType = function (path: string, isVerify?: boolean) {
        return (proto: any, name: string) => {
            const target = proto.constructor;
            const routeMap = Reflect.getMetadata(ROUTER_MAP, target, 'method') || [];
            routeMap.push({ name, method, path, isVerify: !!isVerify });
            Reflect.defineMetadata(ROUTER_MAP, routeMap, target, 'method');
        };
    };
    return fn;
}

const httpMethod = {} as HttpType;

// 导出 http method 装饰器
export const post  = httpMethod.post = createMethodDecorator('post');

export const get = httpMethod.get = createMethodDecorator('get');

export const del = httpMethod.del = createMethodDecorator('del');

export const put = httpMethod.put = createMethodDecorator('put');

export const patch = httpMethod.patch = createMethodDecorator('patch');

export const options = httpMethod.options = createMethodDecorator('options');

export const head = httpMethod.head = createMethodDecorator('head');

export const all = httpMethod.all = createMethodDecorator('all');

export {
    httpMethod
}
