let chai, io, expect, http;

before(async function () {
  // Dynamically import modules
  chai = (await import('chai')).default || (await import('chai'));
  io = (await import('socket.io-client')).io;
  http = (await import('http')).default || require('http');

  expect = chai.expect;
});

const serverURL = 'http://localhost:3000';
let clientSocket;

describe('Server, API, and Socket.IO Tests', function () {
  this.timeout(10000); // Extend timeout to 10 seconds for async operations

  before((done) => {
    setTimeout(done, 1000); // Wait for the server to initialize
  });

  after(() => {
    if (clientSocket) clientSocket.close();
  });

  it('should serve the index.html file', (done) => {
    http.get(serverURL, (res) => {
      expect(res.statusCode).to.equal(200);
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        expect(data).to.include('<!DOCTYPE html>'); // Check for HTML content
        done();
      });
    }).on('error', (err) => done(err));
  });

  it('should return a list of categories from /api/cats', (done) => {
    http.get(`${serverURL}/api/cats`, (res) => {
      expect(res.statusCode).to.equal(200);
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const cats = JSON.parse(data);
        expect(cats).to.be.an('array');
        done();
      });
    }).on('error', (err) => done(err));
  });

  it('should allow adding a category via POST /api/cat', (done) => {
    const newCat = { name: 'Barry', age: 24, branch: 'Finance' };
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/cat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(newCat)), // Set Content-Length header correctly
      },
    };
  
    const req = http.request(options, (res) => {
      expect(res.statusCode).to.equal(201); // Ensure the status code matches the expected value
      let data = '';
  
      res.on('data', (chunk) => {
        data += chunk;
      });
  
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          // Validate the response contains the correct properties and values
          expect(response).to.have.property('message', 'Cat added successfully');
          expect(response).to.have.property('insertedId');
          done();
        } catch (error) {
          done(error); // Handle JSON parsing or assertion errors
        }
      });
    });
  
    req.on('error', (err) => done(err)); // Handle request errors
    req.write(JSON.stringify(newCat)); // Correctly send the stringified object
    req.end();
  });
  
  

  it('should allow a socket to connect and disconnect', (done) => {
    const serverURL = 'http://localhost:3000'; // Ensure the correct protocol (http or https)
    
    clientSocket = io(serverURL, {
      transports: ['websocket', 'polling'], // Force WebSocket transport
      upgrade: false // Prevent upgrade attempt if WebSocket is preferred
    });
  
    clientSocket.on('connect', () => {
      expect(clientSocket.connected).to.be.true;
  
      // Disconnect after the connection is established
      clientSocket.disconnect();
    });
  
    clientSocket.on('disconnect', () => {
      expect(clientSocket.connected).to.be.false;
      done(); // Ensure done is called only after the disconnect event
    });
  
    // Handle connection errors to avoid test hanging
    clientSocket.on('connect_error', (err) => {
      done(err); // Pass error to done if connection fails
    });
  });
  
  
});
