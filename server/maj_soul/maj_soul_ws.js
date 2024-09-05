import WebSocket from 'ws'
import _isBuffer from 'lodash/isBuffer.js'
import {v4} from 'uuid'
import hmacSHA512 from 'crypto-js/hmac-sha256.js'
import MajSoulPB from "./maj_soul_pb.js";

export default class MajSoulWS extends MajSoulPB {
    constructor() {
        super()
        this.res = null;
        this.ws = null;
        this.userInfo = {}
        this.messageQueue = [];
        this.reqIndex = 1;
        this._inflightRequests = {};
        this.deviceInfo = {
            platform: 'pc',
            hardware: 'pc',
            os: 'windows',
            os_version: 'win10',
            is_browser: true,
            software: 'Chrome',
            sale_platform: 'web'
        };
    }

    parseRecords(gameDetailRecords, json) {
        try {
            const pbWrapper = this.app.protobufWrapper
            if (gameDetailRecords.version === 0) {
                for (let i in gameDetailRecords.records) {
                    const record = pbWrapper.decode(gameDetailRecords.records[i]);
                    const name_split = record.name.split('.');
                    const pb = this.app.protobufRoot.nested[name_split[1]][name_split[2]];
                    const data = JSON.parse(JSON.stringify(pb.decode(record.data)));
                    json.records[i] = { name: record.name, data: data };
                }
            } else if (gameDetailRecords.version === 210715) {
                for (let i in gameDetailRecords.actions) {
                    if (gameDetailRecords.actions[i].type === 1) {
                        const record = pbWrapper.decode(
                            gameDetailRecords.actions[i].result
                        );
                        const name_split = record.name.split('.');
                        const pb = this.app.protobufRoot.nested[name_split[1]][name_split[2]];
                        const data = JSON.parse(JSON.stringify(pb.decode(record.data)));
                        json.actions[i].result = { name: record.name, data: data };
                    }
                }
            } else {
                throw "Unknown version: " + gameDetailRecords.version;
            }
        } catch (e) {
            throw e;
        }
        return json;
    }
    decodeDataJson(gameRecord) {
        const pbWrapper = this.app.protobufWrapper
        // methodObj.parent.parent.lookupType(
        //     ".lq.GameDetailRecords"
        // );
        const pbGameDetailRecords = this.app.protobufRoot.nested.lq.GameDetailRecords
        const gameDetailRecordsWrapper = pbWrapper.decode(gameRecord.data);
        const gameDetailRecords = pbGameDetailRecords.decode(
            gameDetailRecordsWrapper.data
        );
        let gameDetailRecordsJson = JSON.parse(JSON.stringify(gameDetailRecords));
        gameDetailRecordsJson = this.parseRecords(
            gameDetailRecords,
            gameDetailRecordsJson
        );
        gameRecord.data = "";
        let gameRecordJson = JSON.parse(JSON.stringify(gameRecord));
        gameRecordJson.data = {
            name: gameDetailRecordsWrapper.name,
            data: gameDetailRecordsJson,
        };
        return gameRecordJson
    }

    async get_paifu(uuid) {
        try {
            const form_uuid = uuid.replace(/^.*=(.*)_a.*$/, "$1");
            const json = await this.getPaifuByPage(form_uuid);
            return Promise.resolve(await this.decodeDataJson(json));
        } catch (e) {
            throw e
        } finally {
        }
    }


    // encode请求参数
    encodeRequest({methodName, payload}) {
        const currentIndex = this.reqIndex++;
        const methodObj = this.lookupMethod(methodName);
        const requestType = methodObj.parent.parent.lookupType(methodObj.requestType);
        const responseType = methodObj.parent.parent.lookupType(methodObj.responseType);
        const msg = this.app.protobufWrapper
            .encode({
                name: methodName,
                data: requestType.encode(payload).finish()
            })
            .finish();
        this._inflightRequests[currentIndex] = {
            methodName, typeObj: responseType
        };
        return {
            reqIndex: currentIndex,
            buffer: Buffer.concat([Buffer.from([2, currentIndex & 0xff, currentIndex >> 8]), msg])
        };
    }

    // decode请求参数
    decodeMessage(buf) {
        const type = buf[0];
        if (type === 3) {
            const reqIndex = buf[1] | (buf[2] << 8);
            const msg = this.app.protobufWrapper.decode(buf.slice(3));
            const {typeObj, methodName} = this._inflightRequests[reqIndex] || {};
            if (!typeObj) {
                throw new Error(`Unknown request ${reqIndex}`);
            }
            delete this._inflightRequests[reqIndex];
            return {
                type, reqIndex, methodName, payload: typeObj.decode(msg.data)
            };
        }
        return null;
    }

    // 建立websocket连接
    createConnection() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.config.majSoulWssUrl, {
                perMessageDeflate: false
            });
            this.ws.on('error', (error) => {
                reject(error);
            });
            this.ws.on('close', () => {
                console.log("已注销");
            });
            this.ws.on('open', async function open() {
                resolve();
            });
            this.ws.on('message', (data) => {
                if (data && _isBuffer(data)) {
                    const decodeData = this.decodeMessage(data);
                    if (decodeData) {
                        this.messageQueue.push(decodeData);
                    }
                }
            });
        })
    }

    // 发送websoket请求
    websocketRequest(methodName, payload) {
        return new Promise(async (resolve) => {
            const encodeData = this.encodeRequest({
                methodName, payload
            });
            this.ws.send(encodeData.buffer);
            const res = await this.getMessage(encodeData.reqIndex);
            resolve(res ? res.payload : null);
        });
    }

    // 获取websocket返回的值
    async getMessage(reqIndex) {
        let delayTime = 0;
        while (this.messageQueue.length === 0 || this.messageQueue.findIndex((item) => item.reqIndex === reqIndex) === -1) {
            await this.delay(200);
            delayTime += 200;
            if (delayTime > 10000) {
                return null;
            }
        }
        const index = this.messageQueue.findIndex((item) => item.reqIndex === reqIndex);
        const result = this.messageQueue[index];
        this.messageQueue.splice(index, 1);
        return result;
    }


    // 雀魂账号密码登录
    async majSoulLogin(userInfo) {
        const {username, password} = userInfo;
        if (this.ws) {
            if (this.userInfo.username === username)
                return Promise.reject({
                    login: true,
                    msg: '已登录该账号',
                });
            else await this.majSoulLogout()
        }
        await this.createConnection()
        const res = await this.websocketRequest('.lq.Lobby.login', {
            account: username,
            password: password, //hmacSHA512(password, 'lailai').toString(),
            reconnect: true,
            device: this.deviceInfo,
            random_key: v4(),
            client_version: {
                resource: this.app.versionInfo.version
            },
            gen_access_token: true,
            type: 0,
            currency_platforms: [],
            client_version_string: this.app.clientVersionString,
            tag: 'cn'
        });
        if (res && res.error) {
            this.ws = null;
            return Promise.reject({
                login: false,
                msg: `账号登录失败:请检查账号密码`
            });
        }
        this.userInfo = userInfo;
    }

    async majSoulLogout() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    async getPaifuByPage(uuid) {
        return await this.websocketRequest('.lq.Lobby.fetchGameRecord', {
            game_uuid: uuid, client_version_string: this.app.clientVersionString
        });
    }


};