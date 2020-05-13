import path from 'path';
import Koa from 'koa';
import koaStatic from 'koa-static'
import koaRouter from 'koa-router'
import koaBody from 'koa-body'
import ServiceClass from "@/bin/server";
import logger from 'koa-logger';
import favicon from 'koa-favicon';
import addRouter from './router'
import errorHandler from '@/middleware/error'
import {httpMethod} from '@/http';

const app  = new Koa();

const router = new koaRouter();

const baseDir = path.normalize(__dirname + '/..')

global.$http = httpMethod; // 设置http方法


app.use(logger())

// 格式化请求数据
app.use(koaBody({
    jsonLimit: 1024 * 1024 * 5,
    formLimit: 1024 * 1024 * 5,
    textLimit: 1024 * 1024 * 5,
    multipart: true, // 解析FormData数据
    formidable: { uploadDir: path.join(baseDir, 'upload') }
}));

// 设置静态文件夹
app.use(koaStatic(path.join(baseDir, 'public'), { index: false }));
app.use(favicon(path.join(baseDir, 'public/favicon.jpg')));

// 处理错误
app.use(errorHandler());

// 添加路由
addRouter(router);
app.use(router.routes()).use(router.allowedMethods());

const service = new ServiceClass(app);
service.openService().then(()=>{
    process.send('success')
})
