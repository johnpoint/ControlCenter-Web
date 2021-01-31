<template>
  <div class="login">
    <div class="login-warp">
      <el-row type="flex" justify="center">
        <el-form ref="ruleForm" :label-position="labelPosition" :model="ruleForm" :rules="rules" label-width="80px"
                 :hide-required-asterisk=true>
          <h3>Login</h3>
          <br>
          <el-form-item label="EMail" prop="email">
            <el-input v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">OK</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import config from "@/config";

export default {
  name: "Login",
  data() {
    return {
      labelPosition: 'right',
      ruleForm: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          {required: true, message: '请输入 Email', trigger: 'blur'},
          {min: 3, message: '长度大于 3 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入 Password', trigger: 'blur'},
        ]
      }
    };
  },
  mounted() {
    clearInterval(this.$store.state.timer);
    this.checkLogin();
  },
  methods: {
    checkLogin: function () {
      if (localStorage.getItem("isLogin") === "true") {
        this.$store.commit('setjwt', localStorage.getItem("jwt"))
        this.$store.commit('setStatus', true)
        window.location.pathname = "/"
      }
    },
    submitForm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let formData = new FormData();
          for (let key in this.ruleForm) {
            formData.append(key, this.ruleForm[key]);
          }
          this.$http.post(config.apiAddress + '/user/auth/login', formData,
              {'Content-Type': 'multipart/form-data;charset=utf-8'}).then(function (res) {
            var data = res.body
            if (data.Code === 200) {
              this.$notify({
                title: 'Success',
                message: 'Successful login',
                type: 'success'
              });
              this.$store.commit('setjwt', data.Info)
              this.$store.commit('setStatus', true)
              localStorage.setItem("isLogin", "true")
              localStorage.setItem("jwt", data.Info)
              window.location.pathname = "/"
            } else {
              this.$notify.error({
                title: 'Error',
                message: data.Info
              });
            }
          }, function (res) {
            this.$notify.error({
              title: 'Error',
              message: res.status
            });
          })
        } else {
          this.$notify.error({
            title: 'Warning',
            type: 'warning'
          });
          this.loading = false;
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>

.login {
  top: 30%;
  position: absolute;
  width: 100%;
  height: 740px;
  background-size: cover;
  overflow: hidden;
}

.login-wrap {
  background-size: cover;
  width: 400px;
  height: 600px;
  margin: 215px auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
}

#password {
  margin-bottom: 5px;
}

h3 {
  color: #0babeab8;
  font-size: 24px;
}

hr {
  background-color: #444;
  margin: 20px auto;
}

a {
  text-decoration: none;
  color: #aaa;
  font-size: 15px;
}

a:hover {
  color: coral;
}

.el-button {
  width: 80%;
  margin-left: -50px;
}

</style>