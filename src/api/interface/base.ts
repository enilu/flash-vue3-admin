export interface ResBase {
  id: number;
  createTime: string;
  createBy: number;
  modifyTime: string;
  modifyBy: number;
}
// 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}

// 分页响应参数
export interface ResPage<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
}
