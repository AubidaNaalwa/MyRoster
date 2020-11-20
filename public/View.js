class View{
    constructor(){
        this.handelBarSelectorOptionsSource = $(`#team-options-handlebars`).html()
        this.handelBarSelectorOptionsTemplate = Handlebars.compile(this.handelBarSelectorOptionsSource);

        this.handlebarsPlayerSource = $(`#team-players-handlebars`).html()
        this.handlebarsPlayerTemplate = Handlebars.compile(this.handlebarsPlayerSource);
    }

    renderTheSelectedBar(menuData){
        
        $('#selectbar').empty();
        const newHTML = this.handelBarSelectorOptionsTemplate({ teams : menuData } );
        $('#selectbar').append(newHTML);
    }

    renderTheTeamPlayers(data) { 
        $(`#teammateContainer`).empty()
        const newHTML = this.handlebarsPlayerTemplate({ players : data.players } );
        $('#teammateContainer').append(newHTML);
    }
}


