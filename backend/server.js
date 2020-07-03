const http = require('http');
const app = require('./app');

//Renvoie un port valide sous forme d'un numéro ou d'une string
const normalizePort = val => { 
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000'); //Permet de dire à l'appli express sur quel port elle va tourné
app.set('port', port);

const errorHandler = error => { //Recherche les différentes erreurs et les gère, ensuite elle les enregistre dans le serveur
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler); // L'écouteur d'évènements consige le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); //Ecoute les requêtes envoyés avec numéro du port 3000 par défaut ou le serveur de l'environement
