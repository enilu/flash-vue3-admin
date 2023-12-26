import { ReqPage, ResBase } from "../base";
// 菜单管理模块
export namespace Menu {
  export interface ResMenu extends ResBase {
    name: string;
    url: string;
    path: string;
    icon: string;
    code: string;
    component: string;
    parentId: number;
    pcode: string;
    levels: number;
    ismenu: number;
    num: number;
    hidden: boolean;
    children?: ResMenu[];
  }
  export interface ReqParams extends ReqPage {
    name: string;
  }
  export interface MenuTree {
    id: number;
    pid: number;
    name: string;
    checked: boolean;
    children: MenuTree[];
  }
  export interface ResMenuTree {
    treeData: MenuTree[];
    checkedIds: number[];
  }
}
