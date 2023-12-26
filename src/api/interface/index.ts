// 请求响应参数（不包含data）
export interface Result {
  code: string;
  msg: string;
}

export interface SelNode {
  label: string;
  value: string;
}

export interface KvNode {
  key: string;
  value: string | number;
}
// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

// 文件上传模块
export namespace Upload {
  export interface ResFileUrl {
    fileUrl: string;
  }
}

// 登录模块
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    token: string;
  }
  export interface ResAuthButtons {
    [key: string]: string[];
  }
  export interface UserProfile {
    account: string;
    status: number;
    birthday: string;
    dept: string;
    email: string;
    name: string;
    phone: string;
    roles: string[];
    sex: number;
  }
  export interface AccountInfo {
    name: string;
    username: string;
    profile: UserProfile;
    permissions: [];
    roles: [];
  }
}
