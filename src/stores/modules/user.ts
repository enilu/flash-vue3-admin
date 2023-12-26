import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
  id: "geeker-user",
  state: (): UserState => ({
    token: "",
    userInfo: {
      account: "",
      status: 1,
      birthday: "",
      dept: "",
      email: "",
      name: "",
      phone: "",
      roles: [],
      sex: 0
    }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      console.log("userInfo2222", userInfo);
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("geeker-user")
});
