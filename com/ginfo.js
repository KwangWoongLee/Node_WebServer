const info = {};

// session expired time : 1hour
info.session_time_out_sec = 60 * 60;

info.exchange_maeum_cnt = 20;

info.server_status = {
  off: 0,
  on: 1,
};

// os type define
info.os_type = {
  android: 1,
  ios: 2,
};

info.market_type = {
  android: info.os_type.android,
  ios: info.os_type.ios,
};

info.login_type = {
  guest: 0,
  normal: 1,
  max: 2,
};
// user define
info.user = {};

info.money_code = {
  gold: 1,
};

// user register init data
info.user_register = {
  reward_code: 10001, // 최초지급보상 ref_reward 참조 code
};

// reward type
info.reward_type = {
  all: 1, // 전부 지급
  random: 2, // 랜덤 지급
};

info.exp_code = 0;

module.exports = info;
