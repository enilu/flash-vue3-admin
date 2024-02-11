<template>
  <div class="app-container">
    <div class="user">
      <div style="font-weight: bold">{{ user.name }}</div>
      <small>{{ user.dept }} &nbsp;&nbsp; {{ user.roles }}</small>
    </div>
    <el-row class="user-content" style="">
      <el-col :span="4" class="profile">
        <img class="user-avatar" src="@/assets/images/avatar.gif" /><br />
        <p>
          <span class="title">
            <el-icon>
              <Cellphone :size="20" />
            </el-icon>
            {{ user.phone }}
          </span>
        </p>
        <p>
          <span class="title">
            <el-icon>
              <Message :size="20" />
            </el-icon>
            {{ user.email }}
          </span>
        </p>
        <p>
          <span class="title">
            <el-icon>
              <Open :size="20" />
            </el-icon>
            {{ user.status == 1 ? "启用" : "禁用" }}
          </span>
        </p>
      </el-col>
      <el-col :span="20" style="padding-left: 10px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="个人资料" name="info">
            <el-form label-width="80px">
              <h4>基本信息</h4>
              <el-form-item label="名称">
                <span>{{ user.name }}</span>
              </el-form-item>
              <el-form-item label="性别">
                <span> {{ user.sex == 1 ? "男" : "女" }}</span>
              </el-form-item>
              <el-form-item label="生日">
                <span> {{ user.birthday }}</span>
              </el-form-item>
              <h4>联系信息</h4>
              <el-form-item label="手机">
                <span>{{ user.phone }}</span>
              </el-form-item>
              <el-form-item label="邮箱">
                <span> {{ user.email }}</span>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="修改密码" name="updatePwd">
            <el-form ref="updatePwdForm" :model="form" :rules="rules" label-position="left" label-width="80px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="原密码" prop="oldPassword">
                    <el-input type="password" v-model="form.oldPassword"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="新密码" prop="password">
                    <el-input type="password" v-model="form.password"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="重复密码" prop="rePassword">
                    <el-input type="password" v-model="form.rePassword"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item>
                <el-button type="primary" @click="updatePwd">提交</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="tsx" name="profile">
import { reactive, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, FormInstance } from "element-plus";
import { LOGIN_URL } from "@/config";
import { useUserStore } from "@/stores/modules/user";
import { updateUserPassword } from "@/api/modules/user";
import { logoutApi } from "@/api/modules/login";
import { encrypt } from "@/utils/aes";
import { Cellphone, Message, Open } from "@element-plus/icons-vue";
const router = useRouter();
const userStore = useUserStore();
const route = useRoute();

const activeName = ref<any>("info");
if (route.query.type) {
  activeName.value = route.query.type;
}
const form = reactive({
  oldPassword: "",
  password: "",
  rePassword: ""
});
const validatePass = (rule: any, value: string, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== form.password) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};
const rules = reactive({
  oldPassword: [{ required: true, message: "请输入旧密码" }],
  password: [
    { required: true, min: 8, max: 30, message: "请输入8 到 30 个字符的新密码" },
    {
      trigger: "blur",
      validator: (rule: any, value: string, callback: any) => {
        const passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}/;
        if (!passwordreg.test(value)) {
          callback(new Error("密码必须由数字、字母、特殊字符组合,请输入8-30位"));
        } else {
          callback();
        }
      }
    }
  ],
  rePassword: [{ required: true, validator: validatePass, trigger: "blur" }]
});

const user = computed(() => userStore.userInfo);
const updatePwdForm = ref<FormInstance>();

const updatePwd = () => {
  updatePwdForm.value!.validate(async valid => {
    if (!valid) return;
    console.log("password:", form.password.trim());
    console.log("加密pass:", encrypt(form.password.trim()));
    const params = {
      oldPassword: encrypt(form.oldPassword),
      password: encrypt(form.password),
      rePassword: encrypt(form.rePassword)
    };
    await updateUserPassword(params);
    ElMessage.success({ message: "密码修改成功" });

    // 1.执行退出登录接口
    await logoutApi();

    // 2.清除 Token
    userStore.setToken("");

    // 3.重定向到登陆页
    router.replace(LOGIN_URL);
  });
};
</script>

<style scoped lang="scss">
.user-content {
  margin-top: 10px;
  .profile {
    height: 500px;
    background-color: #edecec;
    img {
      width: 100%;
    }
  }
}
</style>
