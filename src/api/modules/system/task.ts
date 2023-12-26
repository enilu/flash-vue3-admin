import { ResPage } from "@/api/interface/base";
import { Task } from "@/api/interface/system/task";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 任务管理模块
 */
export default {
  saveTask: function (params: any) {
    return http.post(PORT1 + `/task`, params);
  },
  getTaskList: function (params: Task.ReqParams) {
    return http.get<ResPage<Task.ResTaskList>>(PORT1 + `/task/list`, params);
  },
  removeTask: function (params: { id: string[] }) {
    return http.delete(PORT1 + `/task`, params);
  },
  enableTask: function (params: { id: number }) {
    return http.post(PORT1 + `/task/enable?taskId=` + params.id);
  },
  disableTask: function (params: { id: number }) {
    return http.post(PORT1 + `/task/disable?taskId=` + params.id);
  }
};
