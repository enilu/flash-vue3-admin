import { ReqPage, ResBase } from "../base";
// 任务管理模块
export namespace Task {
  export interface ResTaskList extends ResBase {
    name: string;
    jobClass: string;
    cron: string;
    note: string;
    data: string;
    execAt: string;
    execResult: string;
    disabled: boolean;
  }
  export interface ReqParams extends ReqPage {
    name: string;
    disabled: true;
  }
}
