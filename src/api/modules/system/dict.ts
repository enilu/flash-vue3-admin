import { Dict } from "@/api/interface/system/dict";
import { SelNode } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 字典管理模块
 */
export default {
  save: function (params: any) {
    return http.post(PORT1 + `/dict`, params);
  },
  update: function (params: Dict.ResDict) {
    return http.put(PORT1 + `/dict`, params);
  },
  remove: function (params: { id: string[] }) {
    return http.delete(PORT1 + `/dict`, params);
  },
  getList: function (params: Dict.ReqParams) {
    return http.get<Dict.ResDict[]>(PORT1 + `/dict/list`, params);
  },
  getDicts: function (dictName: string) {
    return http.get<SelNode[]>(PORT1 + "/dict/getDicts/V2", { dictName: dictName });
  },
  getMsgTypeDicts: function () {
    return http.get<SelNode[]>(PORT1 + "/dict/getDicts/V2", { dictName: "消息类型" });
  }
};
