import { ResPage } from "@/api/interface/base";
import { Cfg } from "@/api/interface/system/cfg";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 参数管理模块
 */
export default {
  save: function (params: any) {
    return http.post(PORT1 + `/cfg`, params);
  },
  remove: function (params: { id: string[] }) {
    return http.delete(PORT1 + `/cfg`, params);
  },
  getList: function (params: Cfg.ReqParams) {
    return http.get<ResPage<Cfg.ResCfgList>>(PORT1 + `/cfg/list`, params);
  }
};
