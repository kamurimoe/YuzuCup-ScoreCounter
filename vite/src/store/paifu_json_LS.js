import {fetchPaifuJson} from "@/utils/axios_utils.js";
import {htmlDownload} from '@/utils/html_download.js'

export const paifuJsonLS = {
    setItem(uuid, json) {
        localStorage.setItem(uuid, JSON.stringify(json))
    },
    getItem(uuid) {
        return new Promise(async (resolve, reject) => {
            const json_str = localStorage.getItem(uuid);
            if (json_str) {
                const json = JSON.parse(json_str)
                resolve({msg: "读取到LS", data: json});
            } else {
                await fetchPaifuJson(uuid).then((res) => {
                    if (!res.data.code) {
                        reject(res.data)
                    } else {
                        const json = res.data.data
                        this.setItem(uuid, json)
                        resolve({msg: "成功抓取", data: json})
                    }
                })
            }
        });
    },
    async htmlDownloadJson(url) {
        return await this.getItem(this.formToUuid(url)).then(data => {
            htmlDownload(data.data, `${data.data.head.uuid}.json`)
            return data
        }).catch(e=>e)
    },
    delItem(uuid) {
        localStorage.removeItem(uuid);
    },
    formToUuid(url) {
        return url.replace(/^.*=(.*)_a.*$/, "$1");
    },

}