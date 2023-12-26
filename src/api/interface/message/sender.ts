// 角色管理模块
import { ReqPage, ResBase } from "@/api/interface/base";
export namespace Sender {
  export interface ResSender extends ResBase {
    name: string;
    className: string;
  }
  export interface ReqSenderParam extends ReqPage {
    name: string;
    className: string;
  }
}
