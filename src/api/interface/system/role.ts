import { ResBase } from "../base";

// 角色管理模块
export namespace Role {
  export interface ResRoleList extends ResBase {
    code: string;
    name: string;
    pName: string;
    deptid: number;
    pId: number;
    num: number;
  }
}
