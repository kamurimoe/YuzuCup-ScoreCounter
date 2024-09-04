import {paifuInfo} from "@/store/paifu_info_store.js";
import {paifuProcess} from "./paifu_process_store.js";
export const paifuActive = {
    active: null,
    setActive(json) {
        this.active = json;
        paifuInfo.toAll(json)
        paifuProcess.buildParams(json.data)
    },
    cancelActive() {
        this.active = null;
    },
    getActive() {
        return this.active;
    }
}
