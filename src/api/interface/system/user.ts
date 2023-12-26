import { ReqPage } from "../base";

// 用户管理模块
export namespace User {
  export interface ReqUserParams extends ReqPage {
    username: string;
    gender: number;
    idCard: string;
    email: string;
    address: string;
    createTime: string[];
    status: number;
  }
  export interface ResUserList {
    id: number;
    name: string;
    account: string;
    deptid: number;
    sex: number;
    email: string;
    createTime: string;
    birthday: string;
    phone: string;
    status: number;
    photo: string;
  }
  export interface ResStatus {
    label: string;
    value: number;
  }
  export interface ResGender {
    label: string;
    value: number;
  }
  export interface ResDepartment {
    id: string;
    simplename: string;
    fullname: string;
    children?: ResDepartment[];
  }
  export interface ResRole {
    id: string;
    name: string;
    children?: ResDepartment[];
  }
  export interface ResRoleTreeItem {
    id: number;
    pid: number;
    name: string;
    checked: boolean;
    children: ResRoleTreeItem[];
  }
  export interface ResRoleTree {
    checkedIds: number[];
    treeData: ResRoleTreeItem[];
  }
}
