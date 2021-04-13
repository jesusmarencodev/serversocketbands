const BandList = require("./band-list");

class Sockets {
  constructor(io){
    this.io = io;
    this.bandList = new BandList();
    this.socketEvents();
  }


  socketEvents(){
    //On connection
    this.io.on('connection', ( socket ) => {

      console.log("cliente conectado");

      //Emitir al cliente conectado todas las bandas actuales

      socket.emit('current-bands', this.bandList.getBands());

      //Votar por la banda
      socket.on('votar-banda', (id)=>{
        this.bandList.increaseVotes( id );
        //solo emite al cliente
        //socket.emit('current-bands', this.bandList.getBands());

        //emitimos a todos los clientes
        this.io.emit('current-bands', this.bandList.getBands());
      });

      socket.on('eliminar-banda', (id)=>{
        this.bandList.removeBand( id );
        //emitimos a todos los clientes
        this.io.emit('current-bands', this.bandList.getBands());
      });

      
      socket.on('cambiar-nombre-banda', ({id, nombre:name})=>{
        this.bandList.changeName( id, name );
        //emitimos a todos los clientes
        this.io.emit('current-bands', this.bandList.getBands());
      });

      socket.on('nueva-banda', ({ nombre:name})=>{
        this.bandList.addBand( name );
        //emitimos a todos los clientes
        this.io.emit('current-bands', this.bandList.getBands());
      });

    });
    
  }
}

module.exports = Sockets;