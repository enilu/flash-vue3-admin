import { ResPage } from "@/api/interface/base";
import { Sender } from "@/api/interface/message/sender";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 消息发送者模块
 */

export default {
  save: function (params: Sender.ResSender) {
    return http.post(PORT1 + `/message/sender`, params);
  },
  remove: function (params: { id: string[] }) {
    return http.delete(PORT1 + `/message/sender`, params);
  },
  getList: function (params: Sender.ReqSenderParam) {
    return http.get<ResPage<Sender.ResSender>>(PORT1 + `/message/sender/list`, params);
  },
  queryAll: function () {
    return http.get<Sender.ResSender[]>(PORT1 + `/message/sender/queryAll`);
  }
};
