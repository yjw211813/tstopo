// 已废弃, 前端直接读写本地日志文件

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8180;

app.use(express.json());

// 创建 logs 目录（如果不存在）
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

// 新增一个用于写入日志的 POST 接口
app.post('/write-log', (req, res) => {
    const logData = JSON.stringify(req.body, null, 2); // 格式化 json 数据
    const logFilePath = path.join(__dirname, 'logs', 'updateNetworkData.log');

    fs.appendFile(logFilePath, logData + '\n', (err) => {
        if (err) {
            console.error('写入日志文件失败:', err);
            return res.status(500).send('内部服务器错误');
        }
        res.status(200).send('日志文件更新成功');
    });
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
