<template>
  <view class="resultCanvas">
    <canvas style="width:750rpx;height:520rpx" type="2d" id="myCanvas"></canvas>
    <text class="resultStr" :style="'color:'+titleColor">{{title}}</text>
    <view class="resultStr" v-if="timer" :style="'color:'+titleColor">
      {{"("+time+"）"}}
    </view>
  </view>
</template>

<script>
import { jumpTo } from "@/utils/tool.js";
export default {
  onInit() {
    console.log("111");
  },
  onLoad() {
    console.log("22266");
  },
  onShow() {
    console.log("9898context");
  },
  mounted() {
    uni
      .createSelectorQuery()
      .in(this)
      .select("#myCanvas")
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const canvas = res[0].node;
        const ctx = canvas.getContext("2d");
        const sysInfo = uni.getSystemInfoSync();
        const dpr = sysInfo.pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        this.xCenter = res[0].width / 2;
        this.yCenter = res[0].height / 2;
        this.radius = (res[0].height - (res[0].height / 500) * 32) / 2;

        this.xBegin = Math.round((240 * res[0].width) / 750);
        this.yBegin = Math.round((270 * res[0].height) / 520);
        this.xLeft = Math.round((240 * res[0].width) / 750);
        this.yLeft = Math.round((270 * res[0].height) / 520);
        this.xMiddle = Math.round((360 * res[0].width) / 750);
        this.yMiddle = Math.round((375 * res[0].height) / 520);
        this.xRight = Math.round((360 * res[0].width) / 750);
        this.yRight = Math.round((375 * res[0].height) / 520);
        this.xEnd = Math.round((515 * res[0].width) / 750);
        this.yEnd = Math.round((170 * res[0].height) / 520);
        this.canvasWidth = res[0].width;
        this.canvasHeight = res[0].height;
        ctx.strokeStyle = this.canvasColor;
        ctx.scale(dpr, dpr);
        // this.render(ctx);
        // return;
        const renderAnimation = () => {
          if (
            (this.endCircular < -0.5 || this.endCircular === -0.5) &&
            (this.xRight > this.xEnd || this.xRight === this.xEnd)
          ) {
            return;
          }
          this.render(ctx);
          canvas.requestAnimationFrame(renderAnimation);
        };
        canvas.requestAnimationFrame(renderAnimation);
      });
    if (this.timer) {
      let aa = setInterval(() => {
        if (this.time === 1) {
          clearInterval(aa);
          jumpTo("/pages/chatRoom/index", { orderInfo: this.orderInfo});
        }
        this.time--;
      }, 1000);
    }
  },
  props: {
    title: {
      type: String,
      default: "Success",
    },
    titleColor: {
      type: String,
      default: "#333",
    },
    canvasColor: {
      type: String,
      default: "#68E534",
    },
    timer: {
      type: Boolean,
      default: false,
    },
    orderInfo: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      xCenter: null,
      yCenter: null,
      radius: null,

      xBegin: null,
      yBegin: null,
      xLeft: null,
      yLeft: null,
      xMiddle: null,
      yMiddle: null,
      xRight: null,
      yRight: null,
      xEnd: null,
      yEnd: null,

      canvasWidth: null,
      canvasHeight: null,
      endCircular: 1.5,
      time: 4,
    };
  },
  methods: {
    render(ctx) {
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.drawCircular(ctx);
      if (this.endCircular < -0.5 || this.endCircular === -0.5) {
        this.drawCheck(ctx);
      }
    },
    drawCircular(ctx) {
      this.endCircular = this.endCircular - 0.05;
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineWidth = 16;
      ctx.arc(
        this.xCenter,
        this.yCenter,
        this.radius,
        1.5 * Math.PI,
        this.endCircular * Math.PI,
        true
      );
      ctx.stroke();
    },
    drawCheck(ctx) {
      if (this.xLeft < this.xMiddle) {
        this.xLeft = this.xLeft + 7;
        this.yLeft =
          ((this.yMiddle - this.yBegin) / (this.xMiddle - this.xBegin)) *
            (this.xLeft - this.xBegin) +
          this.yBegin;
      }
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 17;
      ctx.moveTo(this.xBegin, this.yBegin);
      ctx.lineTo(this.xLeft, this.yLeft);
      // ctx.lineTo(this.xMiddle, this.yMiddle);
      if (this.xLeft > this.xMiddle || this.xLeft === this.xMiddle) {
        this.xRight = this.xRight + 7;
        this.yRight =
          this.yMiddle -
          ((this.yMiddle - this.yEnd) / (this.xEnd - this.xMiddle)) *
            (this.xRight - this.xMiddle);
        ctx.lineTo(this.xRight, this.yRight);
      }
      ctx.stroke();
    },
  },
};
</script>

<style lang="scss">
.resultCanvas {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.resultStr {
  font-size: 50rpx;
  margin-top: 40rpx;
  font-weight: bolder;
  text-align: center;
  opacity: 0;
  animation: opacity2 1s linear 1s 1 normal forwards;
  -webkit-animation: opacity2 1s linear 1s 1 normal forwards;
  -moz-animation: opacity2 1s linear 1s 1 normal forwards;
}
@keyframes opacity2 {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
@-webkit-keyframes opacity2 {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
@-moz-keyframes opacity2 {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>