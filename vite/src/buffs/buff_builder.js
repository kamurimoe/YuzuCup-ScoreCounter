import {HuleHandTilesSeries} from "./buff_classes.js";

export const tiles_zh = {
    s: {'0': '红5', 'm': '万', 's': '索', 'p': '饼'},
    z: {'1z': '东', '2z': '南', '3z': '西', '4z': '北', '5z': '白', '6z': '发', '7z': '中'}
}
export const tiles2zh = (tiles = []) => {
    const result = [];
    tiles.forEach((tile, i) =>
        result.push(tile[1] === 'z' ? tiles_zh.z[tile] :
            (tile[0] === '0' ? tiles_zh.s["0"] : tile[0]) + tiles_zh.s[tile[1]]))
    return result
}
export const actions_zh = {
    'Chi': '吃', 'Peng': '碰', 'Gang': '明杠', 'AddGang': '补杠', 'AnGang': '暗杠', 'BaBei': '拔北',
    'Ming': '鸣牌', 'LiQi': '立直', 'Hule': '和了', 'Rong': '荣和', 'ZiMo': '自摸'
}
// buffList:[series[style{params[buffs[buff]}]]
export const buffList = [[{
    params: [[['1m'], 6000], [['9m'], 6000], [['1p'], 6000], [['2p'], 4000], [['3p'], 4000], [['4p'], 4000],
        [['5p'], 4000], [['6p'], 4000], [['7p'], 4000], [['8p'], 4000], [['9p'], 6000], [['1s'], 6000],
        [['2s'], 4000], [['3s'], 4000], [['4s'], 4000], [['5s'], 4000], [['6s'], 4000], [['7s'], 4000],
        [['8s'], 4000], [['9s'], 6000], [['1z'], 2000], [['2z'], 2000], [['3z'], 2000], [['5z'], 2000],
        [['6z'], 2000], [['7z'], 2000], [['1p', '4p', '7p'], 1000], [['2p', '5p', '8p'], 1000],
        [['3p', '6p', '9p'], 1000], [['1s', '4s', '7s'], 1000],
        [['2s', '5s', '8s'], 1000], [['3s', '6s', '9s'], 1000]],
    field: true,
    person: false,
    affiliated_class: HuleHandTilesSeries,
    desc: (param) =>
        `胡牌时，手牌中每拥有一枚${tiles2zh(param[0]).join('、')}${param[1] > 0 ? '加' : '减'}${param[1]}点数`,
    type: 'plus'
}, {
    params: [[['1m'], 1500], [['9m'], 1500], [['1p'], 1500], [['2p'], 1000], [['3p'], 1000], [['4p'], 1000],
        [['5p'], 1000], [['6p'], 1000], [['7p'], 1000], [['8p'], 1000], [['9p'], 1500], [['1s'], 1500],
        [['2s'], 1000], [['3s'], 1000], [['4s'], 1000], [['5s'], 1000], [['6s'], 1000], [['7s'], 1000],
        [['8s'], 1000], [['9s'], 1000], [['1z'], 500], [['2z'], 500], [['3z'], 500],
        [['5z'], 500], [['6z'], 500], [['7z'], 500], [['1p', '4p', '7p'], 250], [['2p', '5p', '8p'], 250],
        [['3p', '6p', '9p'], 250], [['1s', '4s', '7s'], 250], [['2s', '5s', '8s'], 250],
        [['3s', '6s', '9s'], 250], [['1p', '4p', '7p'], -1000], [['2p', '5p', '8p'], -1000],
        [['3p', '6p', '9p'], -1000], [['1s', '4s', '7s'], -1000], [['2s', '5s', '8s'], -1000],
        [['3s', '6s', '9s'], -1000]
    ],
    field: true,
    person: true,
    affiliated_class: HuleHandTilesSeries,
    desc: (param) =>
        `胡牌时，每拥有一枚${tiles2zh(param[0]).join('、')}${param[1] > 0 ? '加' : '减'}${param[1]}点数`,
    type: 'plus'
}, {
    params: [[['4z'], 8000]],
    field: true,
    person: false,
    desc: (param) =>
        `胡牌时，手牌中每拥有一枚${tiles2zh(param[0]).join('、')}${param[1] > 0 ? '加' : '减'}${param[1]}点数(不含拔北)`,
    type: 'plus'
}, {
    params: [[['4z'], 500]],
    field: true,
    person: true,
    desc: (param) =>
        `胡牌时，每拥有一枚${tiles2zh(param[0]).join('、')}${param[1] > 0 ? '加' : '减'}${param[1]}点数(含拔北)`,
    type: 'plus'
}],
    // series_1: [{
    //     params: [[['Chi', 'Peng', 'Gang', 'BaBei'], -8000]],
    //     field: true,
    //     person: true,
    //     desc: (param) =>
    //         `胡牌时，每有一次鸣牌（${actions_zh[param[0]].join('、')})${param[1] > 0 ? '加' : '减'}${param[1]}点数`,
    //     type: 'plus'
    // }, {
    //     params: [[['Chi', 'Peng', 'Gang', 'BaBei'], 2000], [['Gang', 'AnGang', 'AddGang'], 12000]],
    //     field: false,
    //     person: true,
    //     desc: (param) =>
    //         `胡牌时，本人每有一次（${actions_zh[param[0]].join('、')})${param[1] > 0 ? '加' : '减'}${param[1]}点数`,
    //     type: 'plus'
    // }, {
    //     params: [[['Gang', 'AnGang', 'AddGang'], 1.25]],
    //     field: false,
    //     person: true,
    //     desc: (param) =>
    //         `胡牌时，本人每有一次杠（${actions_zh[param[0]].join('、')})，点数✖${param[1]}结算`,
    //     type: 'mul'
    // }, {
    //     params: [[['Gang'], 2], [['AddGang'], 2], [['AnGang'], 3]],
    //     field: true,
    //     person: true,
    //     desc: ['胡牌时，本人每有一次', '', '，点数x', '', '结算'],
    //     type: 'mul'
    // }],
    // series_2: [{
    //     params: [[[{Fans: 2, method: '=', multi: true}], 2], [[{Fans: 3, method: '=', multi: true}], 2],
    //         [[{Fans: 5, method: '=', multi: true}], 2], [[{Fans: 6, method: '=', multi: true}], 2]],
    //     field: true,
    //     person: true,
    //     desc: ['胡牌时，每有一个', '', '番番种（如有副露情况以实际结算为准、不计入宝牌），点数x', '', '结算'],
    //     type: 'mul'
    // },
    //     //     {
    //     //     params: [[[{li_dora: 0, method: '!='}], 0]],
    //     //     field: true,
    //     //     person: true,
    //     //     desc: ['深渊的惩罚：胡牌时，若出现里宝牌，本次胡牌不得分'],
    //     //     type: 'mul'
    //     // }, {
    //     //     params: [[[{li_dora: 0, method: '!='}], 0]],
    //     //     field: false,
    //     //     person: true,
    //     //     desc: ['深渊的偏袒：他人胡牌时，若出现里宝牌，本次胡牌不得分'],
    //     //     type: 'mul'
    //     // },
    // ],
    // series_3: [{
    //     params: [[['Chi', 'Peng', 'Gang', 'BaBei'], 100], [['Chi', 'Peng', 'Gang', 'BaBei'], 200],
    //         [['Chi', 'Peng', 'Gang', 'BaBei'], 300], [['Chi', 'Peng', 'Gang', 'BaBei'], 400],
    //         [['Chi', 'Peng', 'Gang'], 500], [['Chi', 'Peng', 'Gang'], 600],
    //         [['Chi', 'Peng', 'Gang'], 700], [['Chi', 'Peng', 'Gang'], 800],
    //         [['Gang', 'AnGang', 'AddGang'], 800], [['Gang', 'AnGang', 'AddGang'], 900],
    //         [['Gang', 'AnGang', 'AddGang'], 1000], [['Gang', 'AnGang', 'AddGang'], 1100],
    //         [['Gang', 'AnGang', 'AddGang'], 1200], [['Gang', 'AnGang', 'AddGang'], 1300],
    //         [['Gang', 'AnGang', 'AddGang'], 1400], [['Gang', 'AnGang', 'AddGang'], 1500],
    //         [['Gang', 'AnGang', 'AddGang'], 1600],],
    //     field: false,
    //     person: true,
    //     desc: ['胡牌时，场内所有人每有一次（', '', '）加', '', '点数'],
    //     type: 'plus'
    // },
    // ]

]

// return scoreFunction()
export const matchBuffMethodById = (id = '', owner = {}) => {
    const path = id.split('-');
    const buff_style = buffList[path[0]][path[1]]
    const [hule_tiles, single_bonus] = buff_style.params[path[2]]
    return new buff_style.affiliated_class(owner, hule_tiles, single_bonus)
    // return new HuleHandTilesSeries(owner, ['1z','3p'], 2000)
}
