const config = () => {
    return {
        daily: [
            "/home_daily.json",
            "/playersLanding.json",
            "/standingsConf.json",
            "/standingsDivision.json",
            "/today.json"
        ],
        oneTime: [
            "/active_players.json",
            "/playerFinal.json",
            "/players.json"
        ]
    }
}

module.exports = config;