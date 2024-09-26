import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(process.cwd(), 'simple.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const simpleProto = grpc.loadPackageDefinition(packageDefinition).SimpleService;

const getDateOnly = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // Devuelve la fecha en formato 'YYYY-MM-DD'
};


function Estadistica(call, callback) {
  const { tareas } = call.request;

  const tarea_decode = JSON.parse(tareas)
  console.log(tarea_decode)

  const cantidad_realizadas = tarea_decode.filter(i => i.realizada == true).length;
  const cantidad = tarea_decode.length;

  const hoy = new Date()
  const cantidad_hoy = tarea_decode.filter(i => {
    const date = new Date(i.createdAt);
    return (date.getDate() == hoy.getDate() && date.getFullYear() == hoy.getFullYear() && date.getMonth() == hoy.getMonth())
  }).length;

  const cantidad_prioridad_alta = tarea_decode.filter(i => i.prioridad == 'ALTA').length;

  callback(null, { cantidad, cantidad_realizadas, cantidad_hoy, cantidad_prioridad_alta });
}


function main() {
  const server = new grpc.Server();
  server.addService(simpleProto.service, { Estadistica });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Servidor gRPC escuchando en el puerto 50051');
  });
}

main();
