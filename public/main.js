class Controller  { 
    constructor(){
        this.model = new Model()
        this.view = new View()

    }

    getTeamsToUpdateTheBarSeclector() {
        this.model.getUpdatedTeamsNames().then((value => this.view.renderTheSelectedBar(value)))
    }

    getPlayersUsingTeamName(teamName){
        this.model.getupdatedPlayersFromTheServer(teamName).then((value => this.view.renderTheTeamPlayers(value)))
    }


}

const controller = new Controller()
controller.getTeamsToUpdateTheBarSeclector()

$("#headContainer").on('click',`#buttonSearch` , function(){
    console.log($(this).attr('id'))
    const teamName = $(`#selectbar :selected`).val()
    controller.getPlayersUsingTeamName(teamName)
})


$("#teammateContainer").on("onError",".playerImage", function(){
    $(this).attr("src","not_found.png")
})


const imageError = function(data){
    $(data).attr("src","not_found.png")
}

