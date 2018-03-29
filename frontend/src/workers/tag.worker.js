import _ from 'underscore';

self.onmessage = ({data}) => {
    // self.postMessage({
    //     type:'success',
    //     data: tagData(data)
    // })
    switch(data.type) {
        case 'tagSmall':
            tagData(data.payload);
            break;
        case 'tagTotal':
            tagDataAll(data.payload);
            break;
        case 'tagForTeams':
            tagTeams(data.payload);
            break;
        case 'getTeamDataAndRoster':
            tagTeamsAndGetRoster(data.payload);
            break;
        default:
            break;
    }
}

const chunks = function(array, size) {
    var results = [], arr = Array.from(array);
    while (arr.length) {
        results.push(arr.splice(0, size));
    }
    return results;
};

const tagTeamsAndGetRoster = ({player, id}) => {
    let roster = player.filter(i => i.teamData.tricode === id);
    self.postMessage({
        type:'success',
        payload: {
            roster: chunks(roster,2),
            metaData: roster[0].teamData
        }
    })
}


const tagTeams = ({player}) => 
    self.postMessage({
        type: 'success',
        payload:  _.uniq(player.map(_ => _.teamData.tricode))
    });

const tagDataAll = ({conf, div,player}) => {
    let obj = {
        conf:{
            east:[],
            west:[]
        },
        div:{
            east: {
                atlantic: [],
                central: [],
                southeast: []
            },
            west: {
                northwest: [],
                pacific: [],
                southwest: []
            }
        }
    };
    obj.conf.east = conf.data.east.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x}));
    obj.conf.west = conf.data.west.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x}));
    obj.div.east.atlantic = div.data.east.atlantic.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x}));
    obj.div.east.central = div.data.east.central.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x}));
    obj.div.east.southeast = div.data.east.southeast.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x}));
    obj.div.west.northwest = div.data.west.northwest.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x}));
    obj.div.west.pacific = div.data.west.pacific.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x}));
    obj.div.west.southwest = div.data.west.southwest.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x}));
    self.postMessage({
        type: 'success',
        payload: obj
    });
}

const tagData = ({conf, div, player}) => {
    let obj = {
        conf:{
            east:[],
            west:[]
        },
        div:{
            east: {
                atlantic: [],
                central: [],
                southeast: []
            },
            west: {
                northwest: [],
                pacific: [],
                southwest: []
            }
        }
    };
    obj.conf.east = conf.data.east.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x})).slice(0,5);
    obj.conf.west = conf.data.west.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x})).slice(0,5);
    obj.div.east.atlantic = div.data.east.atlantic.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x})).slice(0,2);
    obj.div.east.central = div.data.east.central.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x})).slice(0,2);
    obj.div.east.southeast = div.data.east.southeast.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x})).slice(0,2);
    obj.div.west.northwest = div.data.west.northwest.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x})).slice(0,2);
    obj.div.west.pacific = div.data.west.pacific.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x})).slice(0,2);
    obj.div.west.southwest = div.data.west.southwest.map(x => Object.assign({}, {...searchTeamId(player,x["teamId"]), ...x})).slice(0,2);
    self.postMessage({
        type: 'success',
        payload: obj
    });
}

const searchTeamId = (player , id) => {
    let obj = player.filter(f => f.teamId === id)[0].teamData;
    return {
        teamTag: obj.tricode,
        city: obj.city,
        nickname: obj.nickname
    }
}