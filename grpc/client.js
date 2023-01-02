//dependencies
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

//path to our proto file
const PROTO_FILE = 'grpc/proto/match.proto';

//options needed for loading Proto file
const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const pkgDefs = protoLoader.loadSync(PROTO_FILE, options);

//load Definition into gRPC
const MatchService = grpc.loadPackageDefinition(pkgDefs).MatchService;

//create the Client
const match_service = new MatchService('localhost:5001', grpc.credentials.createInsecure());

module.exports = match_service;
