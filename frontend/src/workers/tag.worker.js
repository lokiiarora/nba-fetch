import _ from 'underscore';

self.onmessage = ({data}) => {
    // self.postMessage({
    //     type:'success',
    //     data: tagData(data)
    // })
    tagData(data);
}

const tagData = ({data}) => {
    let {conf,div,player} = data;
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