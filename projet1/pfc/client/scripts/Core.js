'use strict';



let yourname = prompt('Enter your name');
while (!yourname) {
  yourname = prompt('Enter your name');
}

const rock = document.getElementById('rock');
const scissors = document.getElementById('scissors');
const paper = document.getElementById('paper');
const stats = document.getElementById('status');



const init = () =>{
    const socket = io();


    socket.on("connect", () => {
        console.log(`Connected with ID: ${socket.id}`);
    });

    socket.on("welcome", (data) => {
        console.log(`You have joined as: ${data.playerSpot}`);
        if (data.playerSpot === "leftPlayer" || data.playerSpot === "rightPlayer") {
            stats.textContent="Waiting for opponent...";
        } else {
            stats.textContent="Sorry, the game is full ! ";
            setButtons(true);
        }
    });

    socket.on("can_start", () => {
        console.log("Starting game...");
        stats.textContent="Opponent found! Make your choice!";
        setButtons(false);
    });

    socket.on("not_starting_anymore", () => {
        console.log("Opponent left, stopping game...");
        stats.textContent="Opponent left, waiting for new opponent...";
        setButtons(true);

    });

 

    socket.on("disconnect", () => {
        console.log("Disconnected from server");
        stats.textContent="Disconnected from server";

        setButtons(true);
    });

    socket.on("Scorechanges", (data) => {
        changescores(data);
    });


    


    paper.addEventListener('click',()=>{sendmychoice('paper');});
    scissors.addEventListener('click',()=>{sendmychoice('scissors');});
    rock.addEventListener('click',()=>{sendmychoice('rock');});
    
    
    
    
    const sendmychoice = (param) => {
        if (param.disabled === true) {
            return;
        }
        socket.emit("playerChoices", {  choice: param });
        console.log("Player chose: ",param);
        stats.textContent="Waiting for opponent...";
        setButtons(true);
    
        };


    const sendmyname = (myname)=>{
        socket.emit("mynameis" ,{ playername :myname});
        console.log("Player Name :",myname);

    }
    sendmyname(yourname);

    let playAgainBtn;

    socket.on("gameEnd", (data) => {
    console.log("Game has ended, winner is:", data.bigwinner);
    stats.textContent = data.bigwinner + " has won!";
    setButtons(true);

    if (!playAgainBtn) {
        playAgainBtn = document.createElement("button");
        playAgainBtn.id = "rungame";
        playAgainBtn.disabled = false;
        playAgainBtn.textContent = "Play again";
        document.body.appendChild(playAgainBtn);
    } else {
        playAgainBtn.disabled = false;
    }

    playAgainBtn.addEventListener("click", () => {
        playAgainBtn.disabled = true;
        socket.emit("playAgain");
    });
    });

    
    


}

window.addEventListener("load", init);





    function changescores(data){
            document.querySelector('#leftPlayer').innerHTML = data.lname + " : " + data.left;
    
            document.querySelector('#rightPlayer').innerHTML = data.rname + " : "+ data.right;
    
        }
    


    function setButtons(boolean){
        rock.disabled = boolean;
        scissors.disabled = boolean;
        paper.disabled = boolean;
    }


   





