'use strict';

const ref = require('reference');
const com = require('com');
const ginfo = require('com/ginfo');
const { error } = require('com/code');
const mysql = require('db/mysql');
const redis = require('db/redis');
const sprintf = require('sprintf');
const { login } = require('server/validator');
const { result } = require('lodash');

// ------- 계정 생성전 체크 --------- //
exports.check_user_overlap = function (comdb, id) {
  return new Promise(function (resolve, reject) {
    const query = 'select idx from dat_account where id = ?;';
    mysql
      .query(comdb, query, [id])
      .then((results) => {
        return results.length == 0 ? resolve() : reject(error.regid_overlap_id);
      })
      .catch((e) => reject(e));
  });
};

// ------- 계정 생성 --------- //
exports.insert_comdb = async function (comdb, id, password, name, nickname) {
  const aidx = await reg_account();

  return { aidx };

  function reg_account() {
    return new Promise(function (resolve, reject) {
      const query = com.make_query(
        [`insert into dat_account (idx, id, password, name, nickname, reg_date) `, `values (null, ?, ?, ?, ?, now());`],
        [id, password, name, nickname]
      );

      mysql
        .query(comdb, query, [])
        .then((results) => resolve(results.insertId))
        .catch((e) => reject(e.code == 'ER_DUP_ENTRY' ? error.regid_overlap_id : e));
    });
  }
};

exports.insert_userdb = async function (userdb, aidx) {
  await insert_basic_payment(userdb, aidx);

  async function insert_basic_payment(userdb, aidx) {
    const item_values = [];

    const reward = ref.reward.get_reward(ginfo.user_register.reward_code);

    for (let i = 0; i < reward.length; i++) {
      const { item_code: code, item_cnt: cnt } = reward[i];
      const item_obj = ref.item.get(code);
      if (!item_obj) return Promise.reject(error.unknown);

      item_values.push(sprintf('(null,%d,%d,%d)', aidx, code, cnt));
    }

    const item_query = `insert into dat_item(idx, aidx, item_code, item_cnt) values ${_.join(item_values, ',')};`;
    if (item_values.length >= 1) await mysql.query(userdb, item_query, []);
  }
};

exports.get_userinfo = function (comdb, id) {
  return new Promise(function (resolve, reject) {
    const query = 'select idx as aidx, name, id from dat_account where id = ?';

    mysql
      .query(comdb, query, [id])
      .then((results) => (results.length ? resolve(results[0]) : reject(error.not_found_id)))
      .catch((e) => reject(e));
  });
};

exports.get_server_info = function (comdb, version) {
  return new Promise(function (resolve, reject) {
    const query = 'select version, status from _server_info where version = ?;';
    mysql
      .query(comdb, query, [version])
      .then((results) => (results.length ? resolve(results[0]) : reject(error.version)))
      .catch((e) => reject(e));
  });
};
