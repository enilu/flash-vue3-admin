import { ResPage } from "@/api/interface/base";
import { Menu } from "@/api/interface/system/menu";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 参数管理模块
 */
export default {
  save: function (params: any) {
    return http.post(PORT1 + `/menu`, params);
  },
  getList: function (params: Menu.ReqParams) {
    return http.get<ResPage<Menu.ResMenu>>(PORT1 + `/menu/list`, params);
  },
  getTreeData: function () {
    return http.get<ResPage<Menu.ResMenu>>(PORT1 + `/menu/tree`);
  },
  remove: function (params: { id: string[] }) {
    return http.delete(PORT1 + `/menu`, params);
  },
  menuTreeListByRoleId: function (roleId: number) {
    return http.get<Menu.ResMenuTree>(PORT1 + `/menu/menuTreeListByRoleId?roleId=${roleId}`);
  }
};
