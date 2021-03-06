import io from 'socket.io-client';

function getScoket() {
    return io('http://localhost:9092');
}

function on(event, callback) {
    const scoket = getScoket();

    scoket.on(event, callback);
}

export default {
    on,
};
