const routeMap = () => {
    return [
        {
            route:'/players',
            fileName:'playerFinal.json'
        },
        {
            route:'/feed',
            fileName:'home_daily.json'
        },
        {
            route:'/scoreboard',
            fileName:'scoreboard.json'
        },
        {
            route:'/standings/conf',
            fileName:'standingsConf.json'
        },
        {
            route:'/standings/div',
            fileName:'standingsDivision.json'
        },
        {
            route:'/today',
            fileName:'today.json'
        },
        {
            route:'/players/landing',
            fileName:'playersLanding.json'
        },
    ]
}
module.exports = routeMap;