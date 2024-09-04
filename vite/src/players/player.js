export class Player {
    constructor(id) {
        this.id = id;
        this.buffs = [];
        this.nickname = '';
    }
    setBuffs(buffs) {
        this.buffs = buffs;
    }
}