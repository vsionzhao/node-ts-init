import Koa from 'koa';
import {Server as HttpServer} from 'http';


export default class Service{
    private app: Koa;
    private port: number;           // 端口号
    private restartCount: number;  // 重试次数
    private readonly restartMax: number;    // 重试最大次数
    private readonly waiting: number;   // 重试等待时间
    private service: HttpServer;
    constructor(app: Koa) {
        this.app  = app;
        this.port = +process.env.NODE_PORT || 8000;
        this.restartCount = 0;
        this.restartMax = 5;
        this.waiting = 1000;
    }

    public openService(port: number = this.port){
        return new Promise((resolve, reject)=>{
            if (this.service){
                this.service.close();
            }
            this.service = this.app.listen({
                host:'localhost',
                port,
                exclusive: true
            }).on('error', (e: any)=>{
                this.onerror(e)
                reject(e);
            }).on("listening", ()=>{
                this.onsuccess();
                resolve();
            })
        });
    }

    public restart(){
        if (this.restartCount < this.restartMax ){
            setTimeout(()=>{
                this.openService(++this.port)
                this.restartCount = this.restartCount + 1;
            }, this.waiting)
        }
    }

    private onsuccess(){
        const address = this.service.address();
        const listingPath = typeof address === 'string'? address : `http://${address.address}:${this.port}`;
        this.restartCount = 0;
        process.title='node-ts'
        console.log(`listing to path: ${listingPath}`)
    }

    private onerror(e: any){
        if (e.code === 'EADDRINUSE'){
            console.log('地址正被监听，系统重试中...');
            this.service.close();
            this.restart();
        }
    }
}
