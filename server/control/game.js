const Router = require("koa-router")
const { v4: uuidv4 } = require("uuid")

var candidate_games = {
   /* game_id1: {
        player: {
            player_id1: {

            },
            player_id2: {

            }
        },
        ball: {

        }
    }*/
}

var games = {

}

var startGame = async (ctx, next) => {
    const player = ctx.params.name
    const dt = ctx.request.query
    const c_games = Object.keys(candidate_games)
    if (c_games.length){
        const game_id = c_games[0]
        let game = candidate_games[game_id]
        delete candidate_games[game_id]
        game.player[player] = dt[player]
        games[game_id] = game
        ctx.response.body = {
            game_id: game_id,
            status: "go"
        }
    }else{
        const game_id = uuidv4()
        let game = {player: {[player]: dt[player]},
                    ball: {
                        start: player
                    }}
        candidate_games[game_id] = game
        ctx.response.body = {
            game_id: game_id,
            status: "wait"
        }
    }
}

var updateGame = async (ctx, next) => {
    const player = ctx.params.name
    const game_id = ctx.params.game
    const dt = ctx.request.query
    if (!games[game_id])
        ctx.response.body = {
            err: 1,
            msg: "no this game"
        }
    else{
        games[game_id].player[player] = dt[player]
        if (dt.ball.start == player)
            games[game_id].player.ball = dt.ball
        ctx.response.body = games[game_id]
    }
}

const router = new Router()
/*
    get/game/start/palyer_id
    req: {
        player_id: {
            ***
        }
    }
    res: {
        game_id: ***,
        status: "wait/go"
    }
*/
router.get("/start/:name", startGame)
/*
    get/game/update/player_id/game_id
    req: {
        player_id: {
            ***
        },
        ball: {  //if start is player_id

        }
    }
    res: {
        err: 1,
        msg: ""
    } || game_info
*/
router.get("/update/:name/:game", updateGame)

module.exports = router