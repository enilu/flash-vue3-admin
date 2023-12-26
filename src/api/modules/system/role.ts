import { User } from "@/api/interface/system/user";
import { Role } from "@/api/interface/system/role";
import { PORT1 } from "@/api/config/servicePort";
import { ResPage } from "@/api/interface/base";
import http from "@/api";

/**
 * @name 角色管理模块
 */

// 保存角色
export const saveRole = (params: { id: string }) => {
  return http.post(PORT1 + `/role`, params);
};
// 删除角色
export const removeRole = (params: { id: string[] }) => {
  return http.delete(PORT1 + `/role`, params);
};
// 获取角色列表
export const getRoleList = (params: User.ReqUserParams) => {
  return http.get<ResPage<Role.ResRoleList>>(PORT1 + `/role/list`, params);
};
// 获取用户列表
export const roleTreeListByIdUser = (params: { id: number }) => {
  return http.get<User.ResRoleTree>(PORT1 + `/role/roleTreeListByIdUser?idUser=${params.id}`);
};

export const savePermisson = (params: { roleId: number; permissions: string }) => {
  return http.post(PORT1 + `/role/savePermisson`, params);
};
