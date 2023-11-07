const soap = require('soap');

class ConsumeServices {
  constructor() {
    this.url = 'https://www.crcind.com:443/csp/samples/SOAP.Demo.cls?WSDL';
  }

  callAddInteger(Arg_1, Arg_2) {
    return new Promise((resolve, reject) => {
      soap.createClient(this.url, (err, client) => {
        if (err) {
          console.error(err);
          reject(err); // Rechazar la promesa en caso de error
        } else {
          const args = {
            Arg1: Arg_1,  // Valor del primer argumento
            Arg2: Arg_2   // Valor del segundo argumento
          };

          client.AddInteger(args, (err, result) => {
            if (err) {
              console.error(err);
              reject(err); // Rechazar la promesa en caso de error
            } else {
              console.log('Resultado de AddInteger:', result.AddIntegerResult);
              resolve(result.AddIntegerResult); // Resolver la promesa con el resultado
            }
          });
        }
      });
    });
  }
}

module.exports = ConsumeServices;
