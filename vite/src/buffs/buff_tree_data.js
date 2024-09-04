import {reactive} from "vue";
import {buffList} from "./buff_builder.js";

export const buffTreeData = {
    data: reactive({}),
    form() {
        const buff_list = buffList;
        const field_tree = []
        const personal_tree = []
        buff_list.forEach((series, series_id) => {
            const field_series_node = []
            const personal_series_node = []
            series.forEach((style, style_id) => {
                const style_node = []
                style.params.forEach((buff, buff_id) => {
                    style_node.push({
                        value: `${series_id}-${style_id}-${buff_id}`,
                        label: style.desc(buff),
                    })
                })
                const node = {
                    value: `${series_id}-${style_id}`,
                    label: `类型${style_id}`,
                    children: style_node
                }
                if (style.field)
                    field_series_node.push(node)
                if (style.person)
                    personal_series_node.push(node)
            })
            field_tree.push({
                value: `${series_id}`,
                label: `系列${series_id}`,
                children: field_series_node
            })
            personal_tree.push({
                value: `${series_id}`,
                label: `系列${series_id}`,
                children: personal_series_node
            })
        })
        this.data.field_buff = field_tree;
        this.data.personal_buff = personal_tree;
    }
}