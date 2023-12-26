import { User } from "@/api/interface/system/user";
import { Dept } from "@/api/interface/system/dept";
import { PORT1 } from "@/api/config/servicePort";
import { ResPage } from "../interface/base";
import http from "@/api";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: User.ReqUserParams) => {
  return http.get<ResPage<User.ResUserList>>(PORT1 + `/user/list`, params);
};

// 获取树形用户列表
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/tree/list`, params);
};

// 新增用户
export const saveUser = (params: { id: string }) => {
  return http.post(PORT1 + `/user`, params);
};

// 删除用户
export const deleteUser = (params: { id: string[] }) => {
  return http.delete(PORT1 + `/user?userId=${params.id}`);
};

// 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.post(PORT1 + `/user/change`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(PORT1 + `/user/resetPassword?userId=${params.id}`);
};
//修改用户密码
export const updateUserPassword = (params: { oldPassword: string; password: string; rePassword: string }) => {
  return http.post(
    PORT1 + `/account/updatePwd?oldPassword=${params.oldPassword}&password=${params.password}&rePassword=${params.rePassword}`
  );
};

// 获取用户状态字典
export const getUserStatus = () => {
  return http.get<User.ResStatus[]>(PORT1 + `/dict/getDicts/V2?dictName=账号状态`);
};

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<User.ResGender[]>(PORT1 + `/dict/getDicts/V2?dictName=性别`);
};

// 获取用户部门列表
export const getUserDepartment = () => {
  return http.get<Dept.ResDeptList[]>(PORT1 + `/user/getAllDepts`);
};

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<User.ResRole[]>(PORT1 + `/user/role`);
};

//设置用户所属角色
export const setUserRole = (params: { userId: number; roleIds: string }) => {
  return http.post(PORT1 + `/user/setRole?userId=${params.userId}&roleIds=${params.roleIds}`);
};
