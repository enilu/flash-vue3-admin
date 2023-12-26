import { ResPage } from "@/api/interface/base";
import { Message } from "@/api/interface/message/message";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 历史消息模块
 */

export default {
  clearLog: function () {
    return http.delete(PORT1 + `/message`);
  },
  getLogList: function (params: Message.ReqMessageParam) {
    return http.get<ResPage<Message.ResMessage>>(PORT1 + `/message/list`, params);
  }
};
