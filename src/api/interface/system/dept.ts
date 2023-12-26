import { ReqPage, ResBase } from "../base";
// 角色管理模块
export namespace Dept {
  export interface ResDeptList extends ResBase {
    name: string;
    pid: string;
    pids: string;
    num: number;
    simplename: string;
    fullname: string;
    children?: ResDeptList[];
  }
  export interface ReqParams extends ReqPage {
    name: string;
  }
}
