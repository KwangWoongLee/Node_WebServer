'use strict';
const fnUser = require('functions/fnUser');
const fnLog = require('functions/fnLog');
const com = require('com');
const { error } = require('com/code');
const ginfo = require('com/ginfo');
const mysql = require('db/mysql');

module.exports = async function (input, callback) {
  const ret = {};
  const val = {};

  com.packet_start(ret, val, input, error.none);

  // main process
  try {
    const comdb = await mysql.comdb_connect(val);

    let login_id = '';
    let name = '';
    if (input.login_type == ginfo.login_type.guest) {
      login_id = 'gst_'.concat(input.login_id);
      name = `(G)${com.get_time_ms()}-${_.random(0, 100000)}`; // 게스트는 이름을 임의로 한다.
    } else if (input.login_type == ginfo.login_type.normal) {
      login_id = input.login_id;
      name = input.name;
    } else throw error.login_type;

    await fnUser.check_user_overlap(comdb, login_id);
    await mysql.comdb_transaction(val);

    const { aidx } = await fnUser.insert_comdb(comdb, login_id, input.password, name, input.nickname);

    // 현재는 userdb를 운용하지 않아 인자로 comdb를 넘겨준다.
    await fnUser.insert_userdb(comdb, aidx);

    // val.log = fnLog.new_log(input.cmd, aidx);
    // val.log.add('regid', [login_id, name]);

    ret.data.name = name;
  } catch (e) {
    val.err = e;
  }

  // packet end
  com.packet_end(ret, val, val.err, callback);
};
