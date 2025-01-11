// Connect to the socket
let socket = io();

socket.on('number', (msg) => {
  console.log('Random number: ' + msg);

  // Optional: Display the number on the page
  const h1 = document.querySelector('h1');
  h1.textContent = `Random number: ${msg}`;
});
