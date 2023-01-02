'use strict';

const logger = require('com/log');
const match_service = require('grpc/client');

module.exports = class GRPC_Client {
  constructor(port) {
    if (!port) {
      throw new Error('포트 값을 지정해주세요.');
    }
  }

  doStart(callback) {
    const self = this;

    // const serverInfo = {
    //   host: 'localhost',
    //   port: 5002,
    //   region: 'kor',
    // };
    // match_service.AddServer(serverInfo, (error, empty) => {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log(empty);
    //   }
    // });

    const createRoomInfo = {
      user: {
        region: 'kor',
      },
      name: 'myRoom',
      mapId: 1,
      minMemberCount: 1,
      maxMemberCount: 5,
    };
    match_service.CreateRoom(createRoomInfo, (error, user) => {
      if (error) {
        console.log(error);
      } else {
        console.log(user);
      }
    });

    callback(null, this.port);
  }

  doClose() {}
};
