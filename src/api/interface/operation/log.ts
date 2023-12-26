// 角色管理模块
import { ReqPage } from "@/api/interface/base";
export namespace Log {
  export interface ResLogList {
    id: number;
    code: string;
    logname: string;
    logtype: string;
    message: string;
    classname: string;
    method: string;
    createBy: number;
    modifyTime: string;
  }
  export interface ReqLogParam extends ReqPage {
    logtype: string;
    logname: string;
    createTime: string[];
  }
}
