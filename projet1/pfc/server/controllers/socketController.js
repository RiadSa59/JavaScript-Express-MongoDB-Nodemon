export default class SocketController {
    #io;
    #clients;
    #leftOk;
    #rightOk;
    #leftChoice;
    #rightChoice;
    #canBeStarted = false;
    #leftPlayer;
    #rightPlayer;
    #leftName;
    #rightName;
    #rightscore;
    #leftscore;
    #playedmatches;


    #againright;
    #againleft;

    constructor(io) {
        this.#io = io;
        this.#clients = [];
        this.#leftOk = false;
        this.#rightOk = false;
        this.#leftChoice = null;
        this.#rightscore = 0;
        this.#leftscore = 0 ; 
        this.#playedmatches = 0 ;
        this.#rightChoice = null;
        this.#canBeStarted = false;
        this.#leftPlayer = null;
        this.#rightPlayer = null;
        this.#leftName = null;
        this.#rightName = null ;

        this.#againleft= false;
        this.#againright = false ;
      }
      
      register(socket){
        this.#assignPlayers(socket);
        this.#setupListeners(socket);
        this.#welcome(socket);
        this.#clients.push(socket);
      }

      #setupListeners(socket) {
        console.log(`connection done by ${socket.id}`);

        socket.on('start_and_stop', arg => this.startStop(socket, arg));

        socket.on('mynameis',arg =>this.#setnames(socket,arg));

        socket.on('visitor_unauthorized', () => this.#disconnectSocket(socket));
        socket.on('disconnect', () => this.#disconnectSocket(socket));
        socket.on('playerChoices',(data) =>this.#playerChoice(socket,data));

        socket.on('playAgain',()=>this.#anotherone(socket));

        return socket.id;
    }

    #anotherone(socket){
        if (socket.id === this.#leftPlayer.id) {
            this.#againleft = true;
          } else if (socket.id === this.#rightPlayer.id) {
            this.#againright = true;
        }
        
          if (this.#againleft && this.#againright) {
            this.#leftscore = 0;
            this.#rightscore = 0;
            this.#playedmatches = 0;
            this.#againleft = false;
            this.#againright = false;

            this.#leftPlayer.emit('can_start');
            this.#rightPlayer.emit('can_start');


          }  
    }
    
    #setnames(socket,data) {
        if (this.#leftName === null && this.#leftPlayer.id === socket.id) {
            this.#leftName = data.playername ;
            console.log('Welcome %s',this.#leftName);
        } else if (this.#rightName === null && this.#rightPlayer.id === socket.id) {
            this.#rightName = data.playername ;
            console.log('Welcome %s',this.#rightName);


        } else {
            console.log(`You (${socket.id}) are a visitor.You can't have a name :D `);
        }
    }
    

      #disconnectSocket(socket) {
        console.log(`Socket ${socket.id} just disconnected.`);
        this.#removeFromClients(socket);

        if (socket.id === this.#leftPlayer?.id) {
            this.#leftPlayer = null;
            this.#rightPlayer?.emit('not_starting_anymore');
        }
        if (socket.id === this.#rightPlayer?.id) {
            this.#rightPlayer = null;
            this.#leftPlayer?.emit('not_starting_anymore');
        }
        socket.disconnect(true);
    }

    #emitToClients(socket, message, arg) {
        this.#clients.filter((sock) => sock.id !== socket.id)
            .forEach(sock => sock.emit(message, arg))
    }


    #welcome(socket) {
        this.#emitToClients(socket, 'welcome_other', {id: socket.id});
    }

      #assignPlayers(socket) {
        let welcomeArg;
        if (this.#leftPlayer === null) {
            console.log(`${socket.id} is assigned left`);
            this.#leftPlayer = socket;
            welcomeArg = 'leftPlayer';
            this.#verifyPlayersAreConnected();
        } else if (this.#rightPlayer === null) {
            this.#rightPlayer = socket;
            welcomeArg = 'rightPlayer';
            console.log(`${socket.id} is assigned right`);
            this.#verifyPlayersAreConnected();
        } else {
            console.log(`You (${socket.id}) are a visitor.`);
            welcomeArg = 'You can\'t play ';
        }
        socket.emit('welcome', {playerSpot: welcomeArg});
    }

    #verifyPlayersAreConnected() {
        console.log("Verifying...")
        if (this.#leftPlayer !== null && this.#rightPlayer !== null){
            Promise.resolve(() => console.log("Emitting to sockets"))
                .then(() => this.#rightPlayer.emit('can_start'), () => console.log("Not sent to right"))
                .then(() =>this.#leftPlayer.emit('can_start'), () => console.log("Not sent to left"))


            console.log("... OK!")
        }
    }

    #removeFromClients(socket) {
        const index = this.#clients.indexOf(socket);
        this.#clients.splice(index, 1);
    }
      
    startStop(socket, arg) {
        this.#emitToClients(socket, 'start_and_stop', arg);
    }


        
    #playerChoice(socket,data){


        if (this.#leftPlayer !== undefined && socket.id === this.#leftPlayer.id){
        this.#leftOk = true;
        this.#leftChoice = data.choice;
        console.log(this.#leftName," choose: ", this.#leftChoice);
        }
        else if (this.#rightPlayer !== undefined && socket.id === this.#rightPlayer.id){
        this.#rightOk=true;
        this.#rightChoice = data.choice;
        console.log(this.#rightName," choose: ", this.#rightChoice);
        }
        if (this.#leftOk && this.#rightOk){
            this.#leftOk = false;
            this.#rightOk = false;
            this.checkWinning(socket);
        }
    }
  
    checkWinning(socket) {
      let bigwinner;

      if (this.#leftChoice === this.#rightChoice) {
        bigwinner = "Tie";
      } else if (
        (this.#leftChoice === "rock" && this.#rightChoice === "scissors") ||
        (this.#leftChoice === "paper" && this.#rightChoice === "rock") ||
        (this.#leftChoice === "scissors" && this.#rightChoice === "paper")
      ) {
        this.#leftscore++;
    } else {
        this.#rightscore++;
    }

      this.#emitToClients(this.#leftPlayer, 'Scorechanges',{right : this.#rightscore , left :this.#leftscore,rname:this.#rightName,lname:this.#leftName});
      this.#emitToClients(this.#rightPlayer, 'Scorechanges',{right : this.#rightscore , left :this.#leftscore,rname:this.#rightName,lname:this.#leftName});
        
      if (!(this.#playedmatches === 5)){
            this.#leftPlayer.emit('can_start');
            this.#rightPlayer.emit('can_start');
        this.#playedmatches++;
        }else{

        switch (true) {
            case (this.#leftscore > this.#rightscore):
                bigwinner = this.#leftName;
                break;
            case (this.#leftscore < this.#rightscore):
                bigwinner = this.#rightName;
                break;
            default:
                bigwinner = "Tie";
        }

            this.#emitToClients(this.#leftPlayer, 'gameEnd',{bigwinner:bigwinner});
            this.#emitToClients(this.#rightPlayer, 'gameEnd',{bigwinner:bigwinner});
            this.#playedmatches = 0 ;
            this.#rightscore = 0 ;
            this.#leftscore = 0 ;
 
      console.log('Winner is : ',bigwinner);
      this.#canBeStarted = true;

        
        }



  
    }

}



  