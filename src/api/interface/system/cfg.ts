import { ReqPage, ResBase } from "../base";
// 角色管理模块
export namespace Cfg {
  export interface ResCfgList extends ResBase {
    cfgName: string;
    cfgValue: string;
    cfgDesc: string;
  }
  export interface ReqParams extends ReqPage {
    cfgName: string;
    cfgValue: string;
  }
}
