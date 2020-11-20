class Model{
    construct(){

    }   
    getUpdatedTeamsNames(){
        return $.get('/alltheteams', function(data){
            return data;
        })
    }
    getupdatedPlayersFromTheServer(teamName){
        return $.get(`/team/${teamName}`, function(data){
            return data;
        })
    }

}

$()