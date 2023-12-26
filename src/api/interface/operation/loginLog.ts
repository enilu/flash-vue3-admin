// 角色管理模块
import { ReqPage } from "@/api/interface/base";
export namespace LoginLog {
  export interface ResLoginLog {
    id: number;
    userName: string;
    classname: string;
    logname: string;
    ip: string;
    message: string;
    createtime: string;
  }
  export interface ReqLogParam extends ReqPage {
    startTime: string;
    endTime: string;
  }
}
