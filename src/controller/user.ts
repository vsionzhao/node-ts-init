import { Context } from 'koa'
export default class User {
    @$http.get('/user')
    userInfo(ctx: Context){
        return ctx.body = {
            code: 1,
            msg: '用户不存在'
        };
    }
    @$http.get('/user2')
    userInfo2(ctx: Context){
        return ctx.body = {
            code: 0,
            msg: '用户存在'
        };
    }
}
