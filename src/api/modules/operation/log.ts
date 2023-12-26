import { ResPage } from "@/api/interface/base";
import { Log } from "@/api/interface/operation/log";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 业务日志模块
 */

// 清除所有业务日志色
export const clearLog = (params: { id: string[] }) => {
  return http.delete(PORT1 + `/log`, params);
};
// 获取日志列表
export const getLogList = (params: Log.ReqLogParam) => {
  return http.get<ResPage<Log.ResLogList>>(PORT1 + `/log/list`, params);
};
