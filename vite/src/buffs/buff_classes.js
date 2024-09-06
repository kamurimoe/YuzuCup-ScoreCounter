// Buff基类 参数方法
// owner:{} buff所属;
// players_num:4 玩家数量,考虑兼容类中分数均为[起家分数,下家分数,...形式记录];
// round_score:[] 本场分数;
// total_round_score:[[],[]] 整场总计分数;
// getScore() 返回固定格式给表格组件;
export class Buff {
    constructor(info = {}, owner = {}, operand = 0, arithmetic = 'plus', players_num = 4) {
        this.info = info;
        this.owner = owner;
        this.operand = operand;
        this.arithmetic = arithmetic;
        this.players_num = players_num;
        this.game_start = false;
        this.total_round_score = [];
        this.round_score = this.newScoreRecordParam(0);
    }

    newScoreRecordParam(content) {
        return Array.from({length: this.players_num}, _ => (content));
    }

    addScoreToSeat(score, seat) {
        this.round_score[seat] += score;
    }

    recordRound() {
        if (!this.game_start) return this.game_start = true
        this.total_round_score.push(this.round_score);
        this.round_score = this.newScoreRecordParam(0);
    }

    getScore() {
        return {
            info: this.info,
            sum: this.total_round_score.reduce((a, c) => {
                return a.map((sum, i) => sum + c[i]);
            }, this.newScoreRecordParam(0)), detail: this.total_round_score
        };
    }

    actionAnalyze(action) {
        if (action.type === 4 && action.game_event === 2) {
            this.recordRound();
        }
        this[action.result.name](action);
    }

    '.lq.RecordNewRound'() {
        this.recordRound();
    }

    '.lq.RecordDealTile'(action) {
    }

    '.lq.RecordDiscardTile'(action) {
    }

    '.lq.RecordChiPengGang'(action) {
    }

    '.lq.RecordAnGangAddGang'(action) {
    }

    '.lq.RecordBaBei'(action) {
    }

    '.lq.RecordHule'(action) {
    }

    '.lq.RecordNoTile'(action) {
    }

    '.lq.RecordLiuJu'(action) {
    }
}

export class HuleBuffSeries extends Buff {
    constructor(...params) {
        super(...params)
    }


    // 被重写函数
    getPlusTypeScoreCount(hule) {
    }

    // 被重写函数
    getMulTypeScoreCount(hule) {
    }

    addHuleMethod(hule) {
        if (this.arithmetic === 'plus') {
            const num = this.getPlusTypeScoreCount(hule) || 1
            this.addScoreToSeat(num * this.operand, hule.seat);
        } else if (this.arithmetic === 'mul') {
            const num = this.getMulTypeScoreCount(hule) || 1
            this.addScoreToSeat(hule.dadian * (this.operand * num - 1), hule.seat);
        }
    }

    '.lq.RecordHule'(action) {
        if (this.owner.seat === -1) {
            action.result.data.hules.forEach(hule => {
                this.addHuleMethod(hule);
            })
        } else {
            const hule = action.result.data.hules.filter(hule => hule.seat === this.owner.seat)[0]
            if (hule) this.addHuleMethod(hule);
        }
    }
}

export class HuleHandTilesSeries extends HuleBuffSeries {
    constructor(info, owner, hule_tiles = [], operand = 0, arithmetic = 'plus', withBaBei = false) {
        super(info, owner, operand, arithmetic)
        this.hule_tiles = hule_tiles;
        this.withBaBei = withBaBei;
    }

    getPlusTypeScoreCount(hule) {
        const BaBei = hule.fans.filter(fan => fan.id === 34)[0]; // 拔北番id:34
        return hule.hand.filter(tile => this.hule_tiles.includes(tile)).length
            + Number(this.hule_tiles.includes(hule.hu_tile)) + (this.withBaBei ? BaBei ? BaBei.val : 0 : 0);
    }
}

export class HuleRecordChiPengGangBaBeiSeries extends HuleBuffSeries {
    constructor(info, owner, record_actions = [], operand = 0, arithmetic = 'plus') {
        super(info, owner, operand, arithmetic);
        this.record_actions = record_actions;
        this.round_record = this.newScoreRecordParam(
            {Chi: 0, Peng: 0, Gang: 0, BaBei: 0, AnGang: 0, AddGang: 0})
        this.type_to_ChiPengGang = {1: 'Chi', 2: 'Peng', 3: 'Gang'}
        this.type_to_AnGangAddGang = {2: 'AddGang', 3: 'AnGang'}
    }

    getPlusTypeScoreCount(hule) {
        let num = 0;
        const action_scores = this.round_record[hule.seat]
        for (const action in action_scores) {
            if (this.record_actions.includes(action))
                num += action_scores[action]
        }
        return num;
    }

    getMulTypeScoreCount(hule) {
        return this.getPlusTypeScoreCount(hule);
    }

    '.lq.RecordChiPengGang'(action) {
        this.round_record[action.result.data.seat][this.type_to_ChiPengGang[action.result.data.type]] += 1;
    }

    '.lq.RecordAnGangAddGang'(action) {
        this.round_record[action.result.seat][this.type_to_AnGangAddGang[action.result.data.type]] += 1
    }

    'lq.RecordBaBei'(action) {
        this.round_record[action.result.data.seat].BaBei += 1;
    }

}