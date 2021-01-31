<template>
  <div>
    <topMenu v-if="$route.path!='/Login'"/>
    <div id="app" class="main">
      <router-view class="main-view"/>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
<script>
import topMenu from '@/components/topMenu'
import config from "@/config";
import router from "@/router";
import VueNativeSock from 'vue-native-websocket'
import Vue from "vue";

Date.prototype.format = function (fmt) {
  const o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
export default {
  components: {
    topMenu
  },
  created() {
    if (localStorage.getItem("isLogin") === "true") {
      this.$store.commit('setjwt', localStorage.getItem("jwt"))
      this.$store.commit('setStatus', true)
      router.push("/")
      this.$http.get(config.apiAddress + "/web/UserInfo/Token", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        if (res.body.Code === 200) {
          this.token = res.body.Info
          let uri = 'ws://';
          if (window.location.protocol === 'https:') {
            uri = 'wss://';
          }
          let addr;
          addr = config.apiAddress.replace("http://", "").replace("https://", "")
          Vue.use(VueNativeSock, uri + addr + "/api/" + this.token + "/v2");
        } else {
          this.$notify({
            title: 'Server Warning',
            message: res.body.Info,
            type: 'warning'
          })
        }
      }, function () {
        this.$notify({
          title: 'Server Warning',
          message: "登录会话可能已经过期，请尝试重新登录",
          type: 'warning'
        })
      })
    } else {
      router.push("/login")
    }
  }
}
</script>
