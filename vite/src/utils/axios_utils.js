import axios from "axios";
import {COM_POINT} from "../../../global.config.js";
import {inject} from "vue";

export const ajaxGet = (url, params) => {
    return axios
        .get(url, {
            params: params,
        })
        .catch((error) => {
            console.log(error.response);
        });
}

export const ajaxPost = (url, params) => {
    // console.log(params)
    return axios.post(url, params)

}

export const majSoulPost =  (info) => {
    return ajaxPost(`${COM_POINT.IP}:${COM_POINT.SERVER_PORT}/api/connect`, info)
}
export const fetchPaifuJson = async (uuid) => {
    return ajaxPost(`${COM_POINT.IP}:${COM_POINT.SERVER_PORT}/api/paifu`, {uuid: uuid})
}