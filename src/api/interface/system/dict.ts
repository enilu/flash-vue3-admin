import { ReqPage, ResBase } from "../base";
// 字典管理模块
export namespace Dict {
  export interface ResDict extends ResBase {
    name: string;
    num: string;
    pid: number;
    detail: string;
  }
  export interface ReqParams extends ReqPage {
    name: string;
  }
}
