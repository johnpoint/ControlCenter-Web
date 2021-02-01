<template>
  <div>
    <mainLayout :router="pageName"></mainLayout>
    <el-main>
      <el-row>
        <el-col v-for="card in cards" :key="card.index" :lg="6">
          <div @click="goTo(card.title)">
            <el-card class="box-card" shadow="hover">
              <div slot="header" class="clearfix">
                <span>{{ card.title }}</span>
              </div>
              <div class="text item">
                {{ card.num == 0 ? "-" : card.num }}
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
import mainLayout from '../layouts/mainLayout.vue'
import router from "@/router";

export default {
  components: {
    mainLayout
  },
  data() {
    return {
      cards: [
        {title: "Server", num: 0},
        {title: "Certificate", num: 0},
        {title: "Configuration", num: 0}
      ],
      pageName: ["Home"]
    }
  },
  mounted() {
    this.getOverView();
  },
  methods: {
    goTo: function (target) {
      router.push("/" + target)
    },
    getOverView: function () {
      this.$socket.send("overView");
      this.$socket.onmessage = (data) => {
        data = JSON.parse(data.data)
        this.cards[0].num = data["Server"]
        this.cards[1].num = data["Certificate"]
        this.cards[2].num = data["Configuration"]
      }
      delete this.$socket.onmessage;
    },
  }
}
</script>

<style scoped>
.box-card {
  width: 95%;
}

.text.item {
  font-size: 60px;
  text-align: center;
}
</style>
