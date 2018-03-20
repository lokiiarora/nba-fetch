const routeMap = () => {
    return [
        {
            route:'/api/v1/players',
            fileName:'playerFinal.json'
        },
        {
            route:'/api/v1/feed',
            fileName:'home_daily.json'
        },
        {
            route:'/api/v1/scoreboard',
            fileName:'scoreboard.json'
        },
        {
            route:'/api/v1/standings/conf',
            fileName:'standingsConf.json'
        },
        {
            route:'/api/v1/standings/div',
            fileName:'standingsDivision.json'
        },
        {
            route:'/api/v1/today',
            fileName:'today.json'
        },
        {
            route:'/api/v1/players/landing',
            fileName:'playersLanding.json'
        },
    ]
}
module.exports = routeMap;