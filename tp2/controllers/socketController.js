export default class SocketController {
    #io;
    #clients;
    #currentValue;

    constructor(io) {
        this.#io = io;
        this.#clients = new Map();
        this.#currentValue = 0;
        // Interval used to roll random numbers that should be the same for the same range.
        setInterval(() => this.#currentValue = Math.round(Math.random() * 6) + 2, [2000]);
        // Could also be like :
        // setInterval(() => {
        //     const value = Math.round(Math.random() * 6) + 2;
        //     this.#clients.forEach((s, _tid) => {
        //         s.emit('fixed value', value);
        //     });
        // }, [2000]);
    }

    register(socket) {
        const timerId = this.#setupListeners(socket);
        this.#clients.set(socket.id, timerId);
    }

    #setupListeners(socket) {
        console.log(`connection done by ${socket.id}`);
    
        // Send different values to differents clients
	    // setInterval(() => socket.emit('random value', Math.round(Math.random() * 6) + 2), [2000]);
	    
        // Send the same value to different clients
        const timerId = setInterval(() => {
            
            socket.emit('fixed value', this.#currentValue);
            console.log(`Sent ${this.#currentValue} to ${socket.id}.`)
        }, [2000]);

        socket.on('disconnect', () => this.#disconnectSocket(socket));

        return timerId;
    }

    #disconnectSocket(socket) {
        const intervalId = this.#clients.get(socket.id);
        console.log(`Socket ${socket.id} just disconnected.`);
        clearInterval(intervalId);
        this.#clients.delete(socket.id);
    }

}