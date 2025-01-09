let chai, chaiHttp, io, expect;

before(async function () {
  // Dynamically import modules
  chai = (await import('chai')).default || (await import('chai'));
  chaiHttp = (await import('chai-http')).default || (await import('chai-http'));
  io = (await import('socket.io-client')).io;

  // Configure Chai
  chai.use(chaiHttp);
  expect = chai.expect;
});

const serverURL = 'http://localhost:3000';
let clientSocket;

describe('Server and Socket.IO Tests', function () {
  this.timeout(2000); // Extend timeout to 5 seconds for async operations

  before((done) => {
    setTimeout(done, 1000); // Wait for the server to initialize
  });

  after(() => {
    if (clientSocket) clientSocket.close();
  });

  it('should serve static files', (done) => {
    chai
      .request(serverURL)
      .get('/')
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
  });

  it('should allow a socket to connect and disconnect', (done) => {
    clientSocket = io(serverURL);

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).to.be.true;
      clientSocket.disconnect();
    });

    clientSocket.on('disconnect', () => {
      expect(clientSocket.connected).to.be.false;
      done();
    });
  });

  it('should emit random numbers to the client', (done) => {
    clientSocket = io(serverURL);
    let numberReceived = false;

    clientSocket.on('number', (data) => {
      expect(data).to.be.a('number');
      expect(data).to.be.within(0, 9);
      numberReceived = true;
      clientSocket.disconnect();
    });

    clientSocket.on('disconnect', () => {
      expect(numberReceived).to.be.true;
      done();
    });
  });
});
