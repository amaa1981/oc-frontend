/**
 * ECharts 按需引入配置
 * 只引入项目中实际使用的图表和组件，大幅减小打包体积
 */
import * as echarts from 'echarts/core';

// 引入需要的图表类型
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  // 如果还使用了其他图表类型，在这里添加
  // ScatterChart,
  // MapChart,
  // etc.
} from 'echarts/charts';

// 引入需要的组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  // 如果还使用了其他组件，在这里添加
  // PolarComponent,
  // GeoComponent,
  // etc.
} from 'echarts/components';

// 引入渲染器（必须）
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  CanvasRenderer
]);

export default echarts;
