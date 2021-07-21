<template>
  <div>
    <topMenu v-if="$route.path!='/Login' && $route.path!='/403'"/>
    <div id="app" class="main">
      <router-view v-if="loaded" :key="viewkey" class="main-view"/>
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
  data() {
    return {
      loaded: false
    }
  },
  mounted() {

    let lock = 0;

    function connWS(token, v) {
      if (lock == 1) {
        return
      }
      lock = 1;
      let uri = 'ws://';
      if (window.location.protocol === 'https:') {
        uri = 'wss://';
      }
      let addr;
      addr = config.apiAddress.replace("http://", "").replace("https://", "")
      v.$message.info('Connecting to API interface');
      const connection = new WebSocket(uri + addr + "/api/v2")
      v.$store.state.ws = connection;
      v.$store.state.ws.onopen = () => {
        v.$store.state.ws.send(token);
        v.loaded = true;
        v.$message({
          message: 'Connected~',
          type: 'success'
        });
        lock = 0;
        delete v.$store.state.ws.onopen
      }

      v.$store.state.ws.onclose = function () {
        console.log("close")
        lock = 0;
        delete v.$store.state.ws.onclose;
        setTimeout(connWS(token, v),5000)
      }
    }

    if (localStorage.getItem("isLogin") === "true") {
      this.$store.commit('setjwt', localStorage.getItem("jwt"))
      this.$store.commit('setStatus', true)
      this.$http.get(config.apiAddress + "/web/UserInfo/Token", {
        headers: {
          'Authorization': "Bearer " + this.$store.state.jwt,
          'Accept': 'application/json'
        }
      }).then(function (res) {
        if (res.body.Code === 200) {
          connWS(res.body.Info, this)
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
      this.loaded = true
      router.push("/403")
    }
  }
}
</script>
