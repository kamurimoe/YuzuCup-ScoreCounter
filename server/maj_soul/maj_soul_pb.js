import axios from "axios";
import protobuf from "protobufjs";

export default class MajSoulPB {
    constructor() {
        // this.header('Access-Control-Allow-Origin', '*');
        // this.header(
        //     'Access-Control-Allow-Headers',
        //     'x-requested-with,content-type'
        // );
        // this.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
        // this.header('Access-Control-Allow-Credentials', true);
        this.app = {
            majSoulHttp: null,
            protobufRoot: null,
            protobufWrapper: null,
            versionInfo: null,
            clientVersionString: null,
            tempPbVersionJson: {}
        }
        this.config = {
            majSoulBaseUrl: 'https://game.maj-soul.com/1/',
            majSoulWssUrl: 'wss://gateway-hw.maj-soul.com/gateway',
        }
    }

    async initJson() {
        if (!this.app.majSoulHttp) {
            this.app.majSoulHttp = axios.create({
                baseURL: this.config.majSoulBaseUrl
            });
        }
        if (!this.app.protobufRoot) {
            const version_info = await this.majSoulRequest('version.json');
            this.app.versionInfo = version_info
            this.app.clientVersionString =
                'web-' + version_info.version.replace(/\.[a-z]+$/i, '');
            // 判断是否需要更新pbVersionJson
            let get_json
            const tempPbVersionJson = this.app.tempPbVersionJson[version_info.version];
            if (!tempPbVersionJson) {
                this.app.tempPbVersionJson = null;
                const resInfo = await this.majSoulRequest(`resversion${version_info.version}.json`);
                const pbVersion = resInfo.res['res/proto/liqi.json'].prefix;
                get_json = await this.majSoulRequest(`${pbVersion}/res/proto/liqi.json`);
                this.app.tempPbVersionJson = {
                    [version_info.version]: get_json
                }
            }else {
                get_json = tempPbVersionJson;
            }

            await this.protobufInit(get_json)
        }
    }

    getVersionJson() {
        return this.app.tempPbVersionJson;
    }

    setVersionJson(version_Json) {
        this.app.tempPbVersionJson = version_Json
    }

    async protobufInit(json) {
        this.app.protobufRoot = protobuf.Root.fromJSON(json);
        this.app.protobufWrapper = this.app.protobufRoot.nested.lq.Wrapper;
        // console.log('protobuf data load complete');
    }

    // 请求雀魂相关json
    async majSoulRequest(url) {
        const res = await this.app.majSoulHttp.request(url);
        return res.data;
    }

    lookupMethod(path) {
        if (typeof path === 'string') {
            path = path.split('.');
        }
        if (path.length === 0) {
            return null;
        }
        const service = this.app.protobufRoot.lookupService(path.slice(0, -1));
        if (!service) {
            return null;
        }
        const name = path[path.length - 1];
        return service.methods[name];
    }

    delay(time = 1000) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
};
