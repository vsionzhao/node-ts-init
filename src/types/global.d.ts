import {HttpMethodDecoratorType} from '@/http'
type HttpTypekey = 'post'|'get'|'del'|'put'|'patch'|'options'|'head'|'all'

declare type HttpType = Record<HttpTypekey, HttpMethodDecoratorType>

declare global {
    const $http: HttpType
}
