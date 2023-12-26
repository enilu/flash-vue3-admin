import { ResPage } from "@/api/interface/base";
import { LoginLog } from "@/api/interface/operation/loginLog";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 登录日志模块
 */

export default {
  clearLog: function () {
    return http.delete(PORT1 + `/loginLog`);
  },
  getLogList: function (params: LoginLog.ReqLogParam) {
    return http.get<ResPage<LoginLog.ResLoginLog>>(PORT1 + `/loginLog/list`, params);
  }
};
