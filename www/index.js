const path  = require('path')
const chokidar = require('chokidar');
const { exec, fork } = require('child_process');
// 初始化watcher
const watcher = chokidar.watch(path.join(__dirname, '../src'),{
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  },
  // // 忽略的文件
  // ignored: /node_modules|build|dist|\.pem|\.sed/,
  ignoreInitial: true, // 初始化不执行文件事件
  cwd: '.', // 表示当前目录
});
let task;
const run = () => {
  console.log(task ? '正在重启服务...' : '正在启动服务...')
  exec('npm run build',()=>{
    if (task) task.kill();
    task = fork(path.join(__dirname, '../dist/app.js'))
  })
}

// 监听文件事件
watcher.on('all',(event, path) => {
  run();
});

run();
