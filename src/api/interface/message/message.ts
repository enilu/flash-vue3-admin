// 角色管理模块
import { ReqPage, ResBase } from "@/api/interface/base";
export namespace Message {
  export interface ResMessage extends ResBase {
    tplCode: string;
    content: string;
    receiver: string;
    type: number;
    state: number;
  }
  export interface ReqMessageParam extends ReqPage {
    tplCode: string;
    startTime: string;
    endTime: string;
  }
}
