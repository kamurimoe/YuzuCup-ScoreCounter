export class Buff {
    constructor(owner = {}) {
        this.owner = owner;
        this.total_score = [];
        this.initRoundScore();
    }

    initRoundScore() {
        this.round_score = [0, 0, 0, 0];
    }

    add_round(score, seat) {
        this.round_score[seat] += score;
    }

    recordRound() {
        this.total_score.push(this.round_score);
        this.initRoundScore();
    }

    getScore() {
        return {
            sum: this.total_score.reduce((a, c) => {
                return a.map((sum, i) => sum + c[i]);
            }, Array(this.round_score.length).fill(0)),
            detail: this.total_score
        };
    }

    actionAnalyze(action) {
        return this[action.result.name](action);
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

// export class HuleBuffSeries extends Buff {
//     constructor() {
//         super()
//     }
//     '.lq.RecordHule'(action){
//
//     }
// }

export class HuleHandTilesSeries extends Buff {
    constructor(owner, hule_tiles = [], single_bonus = 0) {
        super(owner)
        this.hule_tiles = hule_tiles;
        this.single_bonus = single_bonus;
    }

    addByHandTails(hand_tiles = [], seat = 3) {
        this.add_round(hand_tiles.filter(tile =>
            this.hule_tiles.includes(tile)).length * this.single_bonus, seat);
    }

    '.lq.RecordHule'(action) {
        if (this.owner.seat === -1) {
            action.result.data.hules.forEach(hule => {
                this.addByHandTails(hule.hand, hule.seat)
            })
        } else {
            const hule = action.result.data.hules.filter(hule => hule.seat === this.owner.seat)[0]
            if (hule) this.addByHandTails(hule.hand, this.owner.seat)
        }
    }
}

export class HuleRecordChiPengGangBaBeiSeries extends Buff {
    constructor(owner, arithmetic, record_actions = [], single_bonus = 0) {
        super(owner);
        this.record_actions = record_actions;
        this.single_bonus = single_bonus;
    }

    addByRecordActions(action = []) {
        // this.record_actions.filter(())
    }

    '.lq.RecordChiPengGang'(action) {
        this.addByRecordActions(action);
    }

    'lq.RecordBaBei'(action) {
        this.addByRecordActions(action);
    }

    'lq.RecordHule'(action) {
        this.addByRecordActions(action);
    }

}