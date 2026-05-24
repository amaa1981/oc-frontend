<template>
  <div>
  <el-dialog
    :title="$t('dataCenter.aiReport')"
    :visible.sync="dialogVisible"
    width="700px"
    top="5vh"
    :before-close="handleClose"
    custom-class="ai-report-dialog"
    append-to-body
  >
    <div class="ai-report-body">
      <!-- Loading status -->
      <div v-if="loading && !content" class="ai-report-loading">
        <i class="el-icon-loading"></i>
        <span>{{ $t('dataCenter.aiGenerating') }}</span>
      </div>
      <!-- Report content -->
      <div v-if="content" class="ai-report-content" ref="reportContent" v-html="renderedHtml"></div>
      <!-- Streaming cursor -->
      <span v-if="loading && content" class="ai-cursor">▌</span>
      <!-- mistake -->
      <div v-if="errorMsg" class="ai-report-error">
        <i class="el-icon-warning"></i>
        <span>{{ errorMsg }}</span>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!loading && content" type="primary" icon="el-icon-download" @click="handleExportPdf">
        {{ $t('dataCenter.exportPdf') }}
      </el-button>
      <el-button v-if="loading" type="danger" icon="el-icon-close" @click="handleStop">
        {{ $t('dataCenter.stopGenerate') }}
      </el-button>
      <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
    </div>
  </el-dialog>

  <!-- Export success pop-up window -->
  <el-dialog
    :visible.sync="exportSuccessVisible"
    width="480px"
    top="30vh"
    :show-close="false"
    custom-class="export-success-dialog"
    append-to-body
  >
    <div class="export-success-body">
      <div class="success-icon-wrap">
        <div class="success-halo"></div>
        <img src="@/assets/images/ok.png" class="success-ok-img" alt="ok" />
      </div>
      <div class="success-title">Export Successfully</div>
      <div class="success-sub">The data has been successfully exported.</div>
    </div>
    <div slot="footer" class="export-success-footer">
      <el-button class="btn-cancel" @click="exportSuccessVisible = false">Cancel</el-button>
      <el-button class="btn-confirm" @click="exportSuccessVisible = false">Confirm</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import { streamAiReport } from '@/api/system/ai';
import { jsPDF } from 'jspdf';
import { marked } from 'marked';

export default {
  name: 'AiReportDialog',
  props: {
    visible: { type: Boolean, default: false },
    reportData: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      content: '',
      loading: false,
      errorMsg: '',
      abortFn: null,
      exportSuccessVisible: false,
    };
  },
  computed: {
    dialogVisible: {
      get() { return this.visible; },
      set(val) { this.$emit('update:visible', val); },
    },
    renderedHtml() {
      // Convert Markdown to HTML rendering
      const cleaned = this.content.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
      return marked(cleaned)
    },
  },
  watch: {
    visible(val) {
      if (val && this.reportData) {
        this.generate();
      }
    },
  },
  methods: {
    generate() {
      this.content = '';
      this.errorMsg = '';
      this.loading = true;

      var prompt = this.buildPrompt(this.reportData);
      var self = this;
      var currentLang = this.$i18n.locale; // Get current language

      this.abortFn = streamAiReport(
        prompt,
        function onChunk(text) {
          self.content += text;
          // Automatically scroll to bottom
          self.$nextTick(function () {
            var el = self.$refs.reportContent;
            if (el) el.scrollTop = el.scrollHeight;
          });
        },
        function onDone() {
          self.loading = false;
        },
        function onError(err) {
          self.loading = false;
          self.errorMsg = self.$t('dataCenter.aiReportFailed') + ': ' + (err.message || err);
        },
        currentLang // Pass current language
      );
    },
    buildPrompt(data) {
      var isEnglish = this.$i18n.locale === 'en';
      var lines = [];
      
      if (isEnglish) {
        lines.push('Please generate a professional data summary and analysis report based on the following security monitoring dashboard data:');
        lines.push('');
        lines.push('[Time Range] ' + (data.timeLabel || ''));
        lines.push('');
        lines.push('[Overview Statistics]');
        lines.push('- Total Events: ' + (data.totalEvents || 0));
        lines.push('- Processed Events: ' + (data.processedEvents || 0));
        lines.push('- Unprocessed Events: ' + (data.unprocessedEvents || 0));
        lines.push('- People Count: ' + (data.peopleNum || 0));
        lines.push('- Vehicle Count: ' + (data.vehiclesNum || 0));
        lines.push('');
      } else {
        lines.push('Please generate a professional data analysis report based on the following security monitoring data:');
        lines.push('');
        lines.push('[Time Range] ' + (data.timeLabel || ''));
        lines.push('');
        lines.push('[Overview Statistics]');
        lines.push('- Total Events: ' + (data.totalEvents || 0));
        lines.push('- Processed Events: ' + (data.processedEvents || 0));
        lines.push('- Unprocessed Events: ' + (data.unprocessedEvents || 0));
        lines.push('- People Count: ' + (data.peopleNum || 0));
        lines.push('- Vehicle Count: ' + (data.vehiclesNum || 0));
        lines.push('');
      }

      // Event type distribution
      if (data.eventTypes && data.eventTypes.length > 0) {
        lines.push(isEnglish ? '[Event Type Distribution]' : '[Event Type Distribution]');
        var total = 0;
        for (var i = 0; i < data.eventTypes.length; i++) {
          total += data.eventTypes[i].value;
        }
        for (var j = 0; j < data.eventTypes.length; j++) {
          var item = data.eventTypes[j];
          var pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
          lines.push('- ' + item.name + ': ' + item.value + (isEnglish ? ' times (' : ' times (') + pct + '%)');
        }
        lines.push('');
      }

      // event trends
      if (data.trendData && data.trendData.length > 0) {
        lines.push(isEnglish ? '[Event Alert Trends]' : '[Event Alert Trends]');
        for (var k = 0; k < data.trendData.length; k++) {
          var series = data.trendData[k];
          var sumVal = 0;
          for (var m = 0; m < series.count.length; m++) sumVal += series.count[m];
          lines.push('- ' + series.date_type + (isEnglish ? ': Total ' : ': Total ') + sumVal + (isEnglish ? ' times' : ' times'));
        }
        lines.push('');
      }

      // People and cars trend
      if (data.vehiclesTrend && data.vehiclesTrend.length > 0) {
        lines.push(isEnglish ? '[People & Vehicle Alert Trends]' : '[People & Vehicle Trends]');
        for (var n = 0; n < data.vehiclesTrend.length; n++) {
          var vs = data.vehiclesTrend[n];
          var vSum = 0;
          for (var p = 0; p < vs.count.length; p++) vSum += vs.count[p];
          lines.push('- ' + vs.date_type + (isEnglish ? ': Total ' : ': Total ') + vSum);
        }
        lines.push('');
      }

      // EquipmentTop3
      if (data.topDevices && data.topDevices.length > 0) {
        lines.push(isEnglish ? '[Top 3 Device Alerts]' : '[Top 3 Device Alerts]');
        for (var q = 0; q < data.topDevices.length; q++) {
          var dev = data.topDevices[q];
          lines.push('- ' + dev.name + ': ' + dev.total + (isEnglish ? ' times' : ' times'));
        }
        lines.push('');
      }

      if (isEnglish) {
        lines.push('Please analyze from the following aspects:');
        lines.push('1. Data Overview Summary');
        lines.push('2. Event Type Analysis (which types are most common, which need focus)');
        lines.push('3. Trend Analysis (any abnormal fluctuations or patterns)');
        lines.push('4. Security Recommendations and Improvement Measures');
      } else {
        lines.push('Please analyze from the following aspects:');
        lines.push('1. Data overview summary');
        lines.push('2. Event type analysis (which types occur most, what needs attention)');
        lines.push('3. Trend analysis (any abnormal fluctuations or patterns)');
        lines.push('4. Safety recommendations and improvement measures');
      }

      return lines.join('\n');
    },
    handleStop() {
      if (this.abortFn) {
        this.abortFn();
        this.abortFn = null;
      }
      this.loading = false;
    },
    handleClose() {
      this.handleStop();
      this.dialogVisible = false;
    },
    handleExportPdf() {
      try {
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pageW = pdf.internal.pageSize.getWidth()
        const pageH = pdf.internal.pageSize.getHeight()
        const margin = 18
        const contentW = pageW - margin * 2
        let y = margin
        const self = this

        // canvas renders text as Image (supports Chinese)
        function textToImg(text, fontSize, color, bold) {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const scale = 3
          const fw = bold ? 'bold ' : ''
          ctx.font = fw + (fontSize * scale) + 'px "Microsoft YaHei","PingFang SC",sans-serif'
          const mw = ctx.measureText(text).width
          canvas.width = mw + 4
          canvas.height = fontSize * scale * 1.5 + 4
          ctx.font = fw + (fontSize * scale) + 'px "Microsoft YaHei","PingFang SC",sans-serif'
          ctx.fillStyle = color || '#333'
          ctx.textBaseline = 'top'
          ctx.fillText(text, 0, 2)
          return {
            data: canvas.toDataURL('image/png'),
            w: (canvas.width / scale) * 0.264583,
            h: (canvas.height / scale) * 0.264583
          }
        }

        // Automatically wrap text
        function addText(text, fontSize, color, bold, indent) {
          if (!text || !text.trim()) return
          indent = indent || 0
          const maxPx = ((contentW - indent) / 0.264583) * 3
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const fw = bold ? 'bold ' : ''
          ctx.font = fw + (fontSize * 3) + 'px "Microsoft YaHei","PingFang SC",sans-serif'
          const words = text.split('')
          const lines = []
          let cur = ''
          for (const ch of words) {
            const test = cur + ch
            if (ctx.measureText(test).width > maxPx && cur.length > 0) {
              lines.push(cur)
              cur = ch
            } else {
              cur = test
            }
          }
          if (cur) lines.push(cur)

          for (const line of lines) {
            if (y + fontSize * 0.6 > pageH - margin) {
              pdf.addPage()
              y = margin
            }
            const img = textToImg(line, fontSize, color, bold)
            pdf.addImage(img.data, 'PNG', margin + indent, y, img.w, img.h)
            y += img.h + 0.3
          }
        }

        // horizontal divider
        function addHr(color) {
          pdf.setDrawColor(color || '#e4e7ed')
          pdf.setLineWidth(0.3)
          pdf.line(margin, y, pageW - margin, y)
          y += 3
        }

        // cover
        pdf.setFillColor(26, 122, 110)
        pdf.rect(0, 0, pageW, 36, 'F')
        const titleImg = textToImg(self.$t('dataCenter.aiReport'), 18, '#ffffff', true)
        pdf.addImage(titleImg.data, 'PNG', margin, 10, titleImg.w, titleImg.h)
        const now = new Date()
        const dateStr = now.getFullYear() + '-' +
          String(now.getMonth() + 1).padStart(2, '0') + '-' +
          String(now.getDate()).padStart(2, '0') + ' ' +
          String(now.getHours()).padStart(2, '0') + ':' +
          String(now.getMinutes()).padStart(2, '0')
        const subImg = textToImg(dateStr, 9, '#b2dfdb', false)
        pdf.addImage(subImg.data, 'PNG', margin, 26, subImg.w, subImg.h)
        y = 46

        // Parse rendered HTML
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = self.renderedHtml

        function processNode(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            const t = node.textContent.replace(/\s+/g, ' ').trim()
            if (t) addText(t, 9, '#333333', false)
            return
          }
          if (node.nodeType !== Node.ELEMENT_NODE) return
          const tag = node.tagName.toLowerCase()

          if (tag === 'h1') {
            y += 4
            addText(node.textContent, 15, '#1a2a36', true)
            addHr('#26a69a')
          } else if (tag === 'h2') {
            y += 5
            // Green left vertical bar
            pdf.setFillColor(38, 166, 154)
            pdf.rect(margin, y, 3, 5.5, 'F')
            addText(node.textContent, 13, '#1a2a36', true)
            y += 2
          } else if (tag === 'h3') {
            y += 3
            addText(node.textContent, 11, '#2c3e50', true)
            y += 1
          } else if (tag === 'h4') {
            y += 2
            addText(node.textContent, 10, '#303133', true)
          } else if (tag === 'p') {
            y += 1
            // Process strong/em mixed layout within p and simplify it to plain text
            addText(node.textContent, 9, '#333333', false)
            y += 1
          } else if (tag === 'ul' || tag === 'ol') {
            const items = node.querySelectorAll(':scope > li')
            items.forEach((li, idx) => {
              const bullet = tag === 'ol' ? (idx + 1) + '. ' : '• '
              addText(bullet + li.textContent, 9, '#444444', false, 5)
            })
            y += 1
          } else if (tag === 'li') {
            addText('• ' + node.textContent, 9, '#444444', false, 5)
          } else if (tag === 'strong' || tag === 'b') {
            addText(node.textContent, 9, '#1a7a6e', true)
          } else if (tag === 'hr') {
            addHr()
          } else if (tag === 'br') {
            y += 2
          } else if (tag === 'blockquote') {
            pdf.setFillColor(240, 250, 248)
            const bqH = 8
            pdf.rect(margin, y, contentW, bqH, 'F')
            pdf.setFillColor(38, 166, 154)
            pdf.rect(margin, y, 2, bqH, 'F')
            addText(node.textContent, 9, '#555', false, 6)
            y += 2
          } else {
            for (let i = 0; i < node.childNodes.length; i++) {
              processNode(node.childNodes[i])
            }
          }
        }

        for (let i = 0; i < tempDiv.childNodes.length; i++) {
          processNode(tempDiv.childNodes[i])
        }

        // Footer page number
        const totalPages = pdf.internal.getNumberOfPages()
        for (let p = 1; p <= totalPages; p++) {
          pdf.setPage(p)
          const footerImg = textToImg(p + ' / ' + totalPages, 8, '#909399', false)
          pdf.addImage(footerImg.data, 'PNG', pageW / 2 - footerImg.w / 2, pageH - 10, footerImg.w, footerImg.h)
        }

        const fileName = self.$t('dataCenter.aiReport') + '_' +
          now.getFullYear() +
          String(now.getMonth() + 1).padStart(2, '0') +
          String(now.getDate()).padStart(2, '0') + '_' +
          String(now.getHours()).padStart(2, '0') +
          String(now.getMinutes()).padStart(2, '0') + '.pdf'
        pdf.save(fileName)
        self.exportSuccessVisible = true
      } catch (err) {
        console.error('Failed to export PDF', err)
        this.$message.error(this.$t('dataCenter.exportFailed'))
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ai-report-dialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
.ai-report-body {
  min-height: 300px;
  max-height: 65vh;
  overflow-y: auto;
}
.ai-report-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
  font-size: 14px;
  i {
    font-size: 32px;
    margin-bottom: 12px;
  }
}
.ai-report-content {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
  h2 { font-size: 18px; margin: 16px 0 8px; color: #1a1a1a; }
  h3 { font-size: 16px; margin: 12px 0 6px; color: #303133; }
  h4 { font-size: 15px; margin: 10px 0 4px; color: #303133; }
  ul { padding-left: 20px; margin: 4px 0; }
  li { margin: 2px 0; }
  strong { color: #409EFF; }
}
.ai-cursor {
  color: #409EFF;
  animation: blink 0.8s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.ai-report-error {
  display: flex;
  align-items: center;
  color: #F56C6C;
  font-size: 14px;
  padding: 20px;
  i { font-size: 18px; margin-right: 8px; }
}
</style>

<style lang="scss">
.export-success-dialog {
  border-radius: 20px !important;
  overflow: hidden;
  .el-dialog__header { display: none; }
  .el-dialog__body { padding: 48px 40px 24px; }
  .el-dialog__footer { padding: 0 40px 36px; border-top: none; }
}
.export-success-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.success-icon-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.success-halo {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(38,166,154,0.12) 40%, rgba(38,166,154,0) 75%);
}
.success-ok-img {
  width: 68px;
  height: 68px;
  object-fit: contain;
  position: relative;
}
.success-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}
.success-sub {
  font-size: 14px;
  color: #909399;
  line-height: 1.6;
}
.export-success-footer {
  display: flex;
  gap: 16px;
  .btn-cancel {
    flex: 1;
    height: 52px;
    border: 1.5px solid #dcdfe6;
    color: #303133;
    background: #fff;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    &:hover { border-color: #26a69a; color: #26a69a; }
  }
  .btn-confirm {
    flex: 1;
    height: 52px;
    background: #26a69a !important;
    border-color: #26a69a !important;
    color: #fff !important;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    &:hover { background: #1e8e83 !important; border-color: #1e8e83 !important; }
  }
}
</style>
