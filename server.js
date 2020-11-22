// importing libraries to the server to work with  them 
const express = require('express')
const path = require('path')
const urllib = require('urllib')
const bodyParser = require('body-parser')
//initalizing variabales 
const app = express()
let teamToId = {} // this is going to be our keys to the tables that we have locally 
let players = []//the array of all the players that we will recieve from external API 
let teams = [] // this is going to be the array of all the teams that are from the NPA API 
const port = 3030 // A NICE PORT TO MY SERVER

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extened: false }))




function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property].toLowerCase();
        if (!acc[key]) {
            acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
    }, {});
}

const updatingPlayers = (playersLeauge) => {
    for (let ind of playersLeauge) {
        if(ind.isActive == true )
            players.push({ imageUrl : `https://nba-players.herokuapp.com/players/${ind.lastName}/${ind.firstName}`,name: `${ind.firstName} ${ind.lastName}`, teamId: ind.teamId, jersey: ind.jersey, pos: ind.pos })
    }
}

const removingDuplicatedPlayers = (players)=>{
    for(let i =0 ;i<players.length ; i++){
        for(let j =+1 ; j<players.length ; j++){
            if(players[j].name == players[i].name){
                players.splice(j++,1)
            }
        }
    }
}

const loadDataFromAPI= async() => {
    urllib.request("https://nba-players.herokuapp.com/players-stats", function (err, data, res) {
        if (err) {
            // err
            return
        }
        const newData = JSON.parse(data);
        teams = groupBy(newData, `team_name`)
        //console.log(teams)

        urllib.request("http://data.nba.net/10s/prod/v1/2018/players.json", function (err, data, res) {
            if (err) {
                // err
                return
            }
            const newData = JSON.parse(data);
            players = []

            updatingPlayers(newData.league.standard)
            updatingPlayers(newData.league.africa)
            updatingPlayers(newData.league.sacramento)
            updatingPlayers(newData.league.vegas)
            updatingPlayers(newData.league.utah)
            removingDuplicatedPlayers(players)
            //console.log(players)
            const keys =  Object.keys(teams)
            teamToId = {} 
            for(let i of keys) {
                const playerinformation = players.find(element => {
                    for(let player of teams[i])
                        if (player.name == element.name)
                            return true
                    
                        return false
                        })

                if(playerinformation && playerinformation.teamId)
                    teamToId[i] = playerinformation.teamId
                
            }
            //console.log(teamToId)
            players = groupBy(players,'teamId')
            //console.log(players)
        })
        
        
    })
}
loadDataFromAPI()
setInterval(function(){
    loadDataFromAPI();
}, 360000);


app.get('/team/:teamName', function (req, res) {
    let teamName = req.params.teamName
    teamName = teamName.toLowerCase()
    const teamId = teamToId[teamName]
    res.send({players : players[teamId]})
})

app.get('/team/:teamName', function (req, res) {
    let teamName = req.params.teamName
    teamName = teamName.toLowerCase()
    const teamId = teamToId[teamName]
    res.send({players : players[teamId]})
})

app.get(`/alltheteams`, function (req, res){
    res.send(Object.keys(teamToId))
})

app.all('*', function(req, res) {
    res.redirect("http://www.google.com/");
});
app.listen(port, function () {
    console.log(`server runs on port : ${port}`)

})

