import {matchBuffMethodById} from "../buffs/buff_builder.js";

export const paifuProcess = {
    // 场地id定为0,seat为-1,表示场地buff所属
    field_owner: {account_id: 0, seat: -1},
    field_buffs_objects: [],
    personal_buffs_objects: [],
    buildParams(paifu_data) {
        this.paifu_data = paifu_data;
        this.method = paifu_data.name;
        this.version = paifu_data.data.version;
        this.actions = paifu_data.data.actions;
    },
    initObjects() {
        this.field_buffs_objects = [];
        this.personal_buffs_objects = [];
    },
    buildBuffs(field_buff, players_info) {
        this.initObjects();
        field_buff.forEach(buff_id => {
            this.field_buffs_objects.push(matchBuffMethodById(buff_id, this.field_owner))
        })

        players_info.forEach(player_info => {
            player_info.buffs.forEach(buff_id => {
                this.personal_buffs_objects.push(matchBuffMethodById(buff_id, {...player_info}))
            })
        })

    },
    buildActions() {
        for (let action of this.actions) {
            if (action.type === 1) {
                this.field_buffs_objects.forEach((item) => {
                    item.actionAnalyze(action)
                })
                this.personal_buffs_objects.forEach((item) => {
                    item.actionAnalyze(action)
                })

            }
        }
        const buff_score = {
            field_buff_score: this.formBuffScore(this.field_buffs_objects),
            personal_buff_score: this.formBuffScore(this.personal_buffs_objects)
        };
        const total_score = this.formTotalScore(buff_score);
        return {
            ...buff_score,
            total_score: total_score
        }
    },
    formBuffScore(buffs_objects) {
        const buff_score = {}
        buffs_objects.forEach(item => {
            const owner_score = buff_score[item.owner.account_id] || []
            owner_score.push(item.getScore())
            buff_score[item.owner.account_id] = owner_score;
        })
        return buff_score;
    },
    formTotalScore({field_buff_score, personal_buff_score}) {
        const all_singe_buff_sum = [];
        Object.keys(field_buff_score).forEach(id => {
            field_buff_score[id].forEach(item => all_singe_buff_sum.push(item.sum))
        })
        Object.keys(personal_buff_score).forEach(id => {
            personal_buff_score[id].forEach(item => all_singe_buff_sum.push(item.sum))
        })

        return all_singe_buff_sum.reduce((a, c) => {
            return a.map((sum, i) => sum + c[i]);
        }, Array(4).fill(0))

    }
}