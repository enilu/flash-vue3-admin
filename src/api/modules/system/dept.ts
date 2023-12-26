import { Dept } from "@/api/interface/system/dept";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 参数管理模块
 */
export default {
  save: function (params: any) {
    return http.post(PORT1 + `/dept`, params);
  },
  getList: function (params?: Dept.ReqParams) {
    return http.get<Dept.ResDeptList[]>(PORT1 + `/dept/list`, params);
  },
  remove: function (params: { id: string[] }) {
    return http.delete(PORT1 + `/dept`, params);
  }
};
