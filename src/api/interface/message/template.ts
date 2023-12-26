// 角色管理模块
import { ReqPage, ResBase } from "@/api/interface/base";
export namespace MessageTemplate {
  export interface ResTemplate extends ResBase {
    code: string;
    title: string;
    content: string;
    idMessageSender: number;
    type: number;
    remoteTplCode: string;
  }
  export interface ReqTemplateParam extends ReqPage {
    idMessageSender: string;
    title: string;
  }
}
