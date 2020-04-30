import path from 'path';
import fs from 'fs';
import Router from "koa-router";
import jwt from '@/middleware/jwt';
import { ROUTER_MAP } from '@/constant'
import { RouteMeta } from './types/type'

const addRouter = (router: Router) => {
    const ctrPath = path.join(__dirname, 'controller')
    const modules: ObjectConstructor[] = [];
    // 扫描controller文件夹，获取所有controller 生成路由
    fs.readdirSync(ctrPath).forEach((name: string) => {
        if (/^[^.]+\.(t|j)s$/.test(name)) {
            modules.push(require(path.join(ctrPath, name)).default)
        }
    })
    // 结合meta数据添加路由 和 验证
    modules.forEach(m => {
        const routerMap: RouteMeta[] = Reflect.getMetadata(ROUTER_MAP, m, 'method') || [];
        if (routerMap.length) {
            const ctr = new m();
            routerMap.forEach(route => {
                const { name, method, path, isVerify } = route;
                router[method](path, jwt(path, isVerify), ctr[name]);
            })
        }
    })

}

export default addRouter;
