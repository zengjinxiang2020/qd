<template>
  <div class="divBox">
    <el-row :gutter="24">
      <el-col san="24" class="ivu-mb">
        <el-card :bordered="false" class="dashboard-console-visit">
          <div slot="header">
            <div class="acea-row row-between-wrapper">
              <div class="acea-row row-middle">
                <el-avatar
                  icon="el-icon-s-data"
                  size="small"
                  style="color: #1890ff; background: #e6f7ff; font-size: 13px"
                />
                <span class="ivu-pl-8">订单</span>
              </div>
              <div class="checkTime">
                <!-- <el-radio-group v-model="visitDate" class="ivu-mr-8">
                                    <el-radio label="last30" @change="handleChangeVisitType">30天</el-radio>
                                    <el-radio label="week" @change="handleChangeWeek">周</el-radio>
                                    <el-radio label="month" @change="handleChangeMonth">月</el-radio>
                                    <el-radio label="year" @change="handleChangeYear">年</el-radio>
                                </el-radio-group> -->
              </div>
            </div>
          </div>
          <div :class="className" ref="chart" :style="{ height: height, width: width }" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { getOrderCount } from "@/api/visits";
import { debounce } from "@/utils";

export default {
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
      chart: null,
      column: [],
      orderCountDatas: [],
    };
  },
  mounted() {
    getOrderCount()
      .then((res) => {
        (this.column = res.column),
          (this.orderCountDatas = res.orderCountDatas);
      })
      .then(() => {
        this.initChart();
      });

    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart, "macarons");

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          bottom: "10",
          data: this.column,
        },
        calculable: true,
        series: [
          {
            name: "商品分类销售占总销售的比例",
            type: "pie",
            roseType: "radius",
            radius: [15, 95],
            center: ["50%", "38%"],
            data: this.orderCountDatas,
            animationEasing: "cubicInOut",
            animationDuration: 2600,
          },
        ],
      });
    },
  },
};
</script>


<style lang="scss" scoped>
  .acea-row{
    /deep/.el-avatar--small {
      width: 22px;
      height: 22px;
      line-height: 22px;
    }
  }
  .checkTime{
    /deep/.el-radio__input{
      display: none;
    }
  }
  .ivu-pl-8{
    margin-left: 8px;
    font-size: 14px;
  }
  .divBox {
    // padding: 0 20px !important;
  }
  .dashboard-console-visit {
    /deep/.el-card__header{
      padding: 14px 20px !important;
    }
    ul {
      li {
        list-style-type: none;
        margin-top: 12px;
      }
    }
  }
  .ivu-mb{
    margin-bottom: 10px;
  }
</style>

