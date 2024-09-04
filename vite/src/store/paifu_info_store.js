import {reactive} from "vue";

export const paifuInfo = {
    data: reactive({}),
    toOverviewData(paifu_json) {
        const overview = []
        const overview_points = []
        const {uuid, start_time, end_time, accounts, result} = paifu_json.head
        overview.push(...[
            {key: '牌谱uuid', value: uuid, etc: ''},
            {key: '对局时间', value: `${start_time}-${end_time}`, etc: ''},
        ])

        const seat_zh = ['起', '下', '对', '上']
        result.players.forEach((item, index) => {
            const player_seat = (item.seat ? item.seat : 0)
            const ac = accounts.filter(a => a.seat === player_seat)[0]
            // overview
            const q = ac.account_id / 8388608
            const lang = q < 7 ? '中' : q < 13 ? '日' : '英'
            const order = `${index + 1}位`
            overview.push({
                key: `${order}(${item.part_point_1})`,//,
                value: ac.nickname,
                etc: `${seat_zh[player_seat]}家, id:${ac.account_id}, 语言:${lang}`
            })
            // overview_points
            overview_points.push({
                account_id: ac.account_id,
                buffs: [`0-1-${player_seat}`],  // 测试用
                seat: player_seat,
                player: `${order}:${ac.nickname}`,
                point: item.part_point_1,
            })
        })
        this.data.overview = overview; // 牌谱详情用
        this.data.overview_points = overview_points; // buff计算用素点
    },
    toDetailData(paifu_json) {
        // const detail_data = []
        // this.data.detail = detail_data;
    },
    toAll(json) {
        this.toOverviewData(json)
        this.toDetailData(json)


    }
}