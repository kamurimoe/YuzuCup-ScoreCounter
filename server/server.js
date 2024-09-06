import express from 'express'
import {COM_POINT, DIRs} from '../global.config.js'
import MajSoulWS from "./maj_soul/maj_soul_ws.js";
import {read_json, save_json} from './utils/json_rw.js'

const app = express();

// 解析 JSON 请求体
app.use(express.json());
app.all('*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next()
})
const maj_soul_wsc = new MajSoulWS()
const json = read_json(DIRs.FILE_SAVE_DIR, 'info.json')
if (Object.keys(json).length) {
    maj_soul_wsc.setVersionJson(json)
}
maj_soul_wsc.initJson().then(() => {
    const version_json = maj_soul_wsc.getVersionJson()
    if (version_json) {
        save_json(version_json, DIRs.FILE_SAVE_DIR, 'info.json')
    }
})


app.post('/api/connect', (req, res) => {
    const {code, userInfo} = req.body
    if (code) {
        maj_soul_wsc.majSoulLogin(userInfo).then(() => {
            res.json({code: true, login: true, msg: '登录成功'})
        }).catch((e) => {
            res.json({code: false, ...e})
        })
    } else {
        maj_soul_wsc.majSoulLogout().then(() => {
            res.json({code: true, login: false, msg: '已注销'})
        }).catch((e) => {
            res.json({code: false, login: true, msg: `注销失败:${e.msg}`})
        })
    }
});

app.post('/api/paifu', (req, res) => {
    if (maj_soul_wsc.ws) {
        maj_soul_wsc.get_paifu(req.body.uuid).then((data) => {
            save_json(data, DIRs.FILE_SAVE_PAIFU_DIR, `${data.head.uuid}.json`)
            res.json({
                code: true, msg: '下载成功', data: data
            })
        }).catch((e) => {
            res.json({code: false, msg: `下载失败:${e.message}`})
        })
    } else {
        res.json({code: false, login: false, msg: '未登录'})
        throw "未登录"
    }
});
// 启动服务器
export const runServer = () => app.listen(COM_POINT.SERVER_PORT, () => {
    console.log(`Server running on ${COM_POINT.IP}:${COM_POINT.SERVER_PORT}`);
});