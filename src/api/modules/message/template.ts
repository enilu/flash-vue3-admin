import { ResPage } from "@/api/interface/base";
import { MessageTemplate } from "@/api/interface/message/template";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 消息模板模块
 */

export default {
  save: function (params: MessageTemplate.ResTemplate) {
    return http.post(PORT1 + `/message/template`, params);
  },
  remove: function (params: { id: string[] }) {
    return http.delete(PORT1 + `/message/template`, params);
  },
  getList: function (params: MessageTemplate.ReqTemplateParam) {
    return http.get<ResPage<MessageTemplate.ResTemplate>>(PORT1 + `/message/template/list`, params);
  }
};
