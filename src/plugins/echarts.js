/**
 * ECharts introduces configurations on demand
 * Only the charts and components actually used in the project are introduced, greatly reducing the packaging volume.
 */
import * as echarts from 'echarts/core';

// Introduce required chart types
import {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  // If other chart types are used, add them here
  // ScatterChart,
  // MapChart,
  // etc.
} from 'echarts/charts';

// Introduce required components
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  // If other components are used, add them here
  // PolarComponent,
  // GeoComponent,
  // etc.
} from 'echarts/components';

// Introduce renderer (required)
import { CanvasRenderer } from 'echarts/renderers';

// Register required components
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
