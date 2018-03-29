import axios from 'axios';
import _ from 'underscore';
// eslint-disable-next-line
self.onmessage = ({data}) => {
    if(data.message){
        switch(data.message){
            case 'playerPayload':
                fetchInitialPlayer();
                break;
            case 'fetchHomeData':
                fetchHomeData();
                break;
            case 'fetchStandingsData':
                fetchStandingsDataAndResolve()
                break;
            default: 
                self.postMessage({
                    type: 'default',
                    payload: "No Message found"
                })
            break;
        }
    }
    
}

const fetchInitialPlayer = () => {
    axios.get("http://nba-fetch.southeastasia.cloudapp.azure.com/api/v1/players")
        .then(res => {
            self.postMessage({
                payload: res.data,
                type: "success"
            });
        })
        .catch(e => {
            self.postMessage({
                payload: e,
                type: 'error'
            });
        })
}

const fetchStandingsDataAndResolve = () => {
    Promise.all(fetchStandingsData()).then(values => {
        let obj = {
            div: null,
            conf: null,
        };
        _.map(_.map(values, _ => _.data), (__,index) => {
            if(index === 0) obj["div"] = __
            if(index === 1) obj["conf"] = __
        });
        self.postMessage({
            payload: obj,
            type: 'success'
        });
    }).catch(e => {
        self.postMessage({
            payload: e,
            type: 'error'
        });
    })
}


const fetchHomeData = () => {
    Promise.all([...fetchStandingsData(), fetchScoreBoardData()]).then(values => {
        let obj = {
            standings: {
                div: null,
                conf: null,
            },
            scoreboard: null
        };
        _.map(_.map(values, _ => _.data), (__,index) => {
            if(index === 0) obj["standings"]["div"] = __
            if(index === 1) obj["standings"]["conf"] = __
            else obj["scoreboard"] = __
        });
        self.postMessage({
            payload: obj,
            type: 'success'
        });
    }).catch(e => {
        self.postMessage({
            payload: e,
            type: 'error'
        });
    })
}


const fetchScoreBoardData = () => axios.get("http://nba-fetch.southeastasia.cloudapp.azure.com/api/v1/scoreboard")

const fetchStandingsData = () => [
    axios.get("http://nba-fetch.southeastasia.cloudapp.azure.com/api/v1/standings/div"),
    axios.get("http://nba-fetch.southeastasia.cloudapp.azure.com/api/v1/standings/conf")
]