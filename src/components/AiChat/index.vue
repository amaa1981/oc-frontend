<template>
  <div class="ai-chat-wrapper">
    <!-- 悬浮按钮 -->
    <div class="ai-chat-button" @click="toggleChat" v-show="!isOpen">
      <img src="@/assets/images/AI.png" alt="AI" />
    </div>

    <!-- 聊天窗口 -->
    <transition name="slide-up">
      <div class="ai-chat-panel" v-show="isOpen">
        <!-- 头部 -->
        <div class="ai-chat-header">
          <div class="ai-chat-header-left">
            <div class="ai-avatar">
              <img src="@/assets/images/AI.png" alt="AI" />
            </div>
            <span class="ai-title">AI Assistant</span>
          </div>
          <i class="el-icon-arrow-down" @click="toggleChat"></i>
        </div>

        <!-- 快捷操作 -->
        <div class="ai-quick-actions">
          <div
            class="quick-action-chip"
            v-for="(action, index) in quickActions"
            :key="index"
            @click="sendQuickAction(action)"
          >
            <i :class="action.icon"></i>
            <span>{{ action.label }}</span>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="ai-chat-messages" ref="messageList">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['message-item', message.role]"
          >
            <div class="message-avatar" v-if="message.role === 'assistant'">
              <img src="@/assets/images/AI.png" alt="AI" />
            </div>
            <div class="message-content">
              <div class="message-text" v-html="formatMessage(message.content)"></div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>

          <!-- 加载中 -->
          <div class="message-item assistant" v-if="isLoading">
            <div class="message-avatar">
              <img src="@/assets/images/AI.png" alt="AI" />
            </div>
            <div class="message-content">
              <div class="message-loading">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入框 -->
        <div class="ai-chat-input">
          <el-input
            v-model="inputMessage"
            :placeholder="$t('aiChat.placeholder')"
            @keyup.enter.native="sendMessage"
            :disabled="isLoading"
          >
            <i
              v-if="!isLoading"
              slot="suffix"
              class="el-icon-s-promotion send-icon"
              @click="sendMessage"
              :class="{ active: inputMessage.trim() }"
            ></i>
            <i
              v-else
              slot="suffix"
              class="el-icon-video-pause stop-icon"
              @click="stopGeneration"
            ></i>
          </el-input>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { streamAiReport } from '@/api/system/ai'
import { getRecordList } from '@/api/alarm/record'
import { listDevice } from '@/api/system/device'
import { getServer } from '@/api/monitor/server'

export default {
  name: 'AiChat',
  data() {
    return {
      isOpen: false,
      inputMessage: '',
      messages: [],
      isLoading: false,
      abortFn: null,
      currentAssistantMessage: null,
      quickActions: [],
      isFetchingData: false
    }
  },
  mounted() {
    // 初始化快捷操作（使用计算属性避免翻译问题）
    this.quickActions = [
      { label: this.$t('aiChat.alarmSummary'), icon: 'el-icon-warning-outline', prompt: this.$t('aiChat.alarmSummary') },
      { label: this.$t('aiChat.deviceStatus'), icon: 'el-icon-video-camera', prompt: this.$t('aiChat.deviceStatus') },
      { label: this.$t('aiChat.analytics'), icon: 'el-icon-data-analysis', prompt: this.$t('aiChat.analytics') }
    ]
    
    // 添加欢迎消息
    this.addMessage('assistant', this.$t('aiChat.welcome'))
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
      if (this.isOpen) {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    sendQuickAction(action) {
      this.inputMessage = action.prompt
      this.sendMessage()
    },
    async sendMessage() {
      if (!this.inputMessage.trim() || this.isLoading) return

      const userMessage = this.inputMessage.trim()
      this.addMessage('user', userMessage)
      this.inputMessage = ''
      this.isLoading = true

      // 创建一个空的助手消息用于流式更新
      this.currentAssistantMessage = {
        role: 'assistant',
        content: '',
        time: this.getCurrentTime()
      }
      this.messages.push(this.currentAssistantMessage)

      // 第一阶段：让AI判断是否需要数据
      const currentLang = this.$i18n.locale
      const intentPrompt = currentLang === 'en'
        ? `You are an AI assistant for a security monitoring platform. Analyze the user's question and determine if you need real-time data to answer it.

Available data sources:
1. ALARM_DATA - Recent alarm records, alarm statistics, alarm types
2. DEVICE_DATA - Device list, online/offline status, device information
3. SERVER_DATA - Server performance, CPU, memory usage

User question: ${userMessage}

If you need data, respond with ONLY a JSON object like: {"needData": true, "sources": ["ALARM_DATA", "DEVICE_DATA"]}
If you don't need data (for general questions), respond with: {"needData": false}

Response:`
        : `You are an AI assistant for a smart security monitoring platform. Analyze the user's question and determine if real-time data is needed to answer.

Available data sources:
1. ALARM_DATA - Recent alarm records, statistics, and types
2. DEVICE_DATA - Device list, online/offline status, device info
3. SERVER_DATA - Server performance, CPU, memory usage

User question: ${userMessage}

If data is needed, return only JSON: {"needData": true, "sources": ["ALARM_DATA", "DEVICE_DATA"]}
If no data needed (general question), return: {"needData": false}

Reply:`

      const self = this
      let intentResponse = ''
      
      // 第一次调用：判断意图
      this.abortFn = streamAiReport(
        intentPrompt,
        function onChunk(text) {
          intentResponse += text
        },
        async function onDone() {
          // 解析AI的意图判断
          let needData = false
          let dataSources = []
          
          try {
            // 提取JSON
            const jsonMatch = intentResponse.match(/\{[^}]+\}/)
            if (jsonMatch) {
              const intent = JSON.parse(jsonMatch[0])
              needData = intent.needData
              dataSources = intent.sources || []
            }
          } catch (e) {
            console.error('解析意图失败:', e)
            // 如果解析失败，使用关键词匹配作为后备
            needData = self.detectNeedDataByKeywords(userMessage)
            if (needData) {
              dataSources = self.detectDataSourcesByKeywords(userMessage)
            }
          }

          // 第二阶段：根据意图获取数据并回答
          let contextData = null
          if (needData && dataSources.length > 0) {
            // 显示正在获取数据的提示
            self.currentAssistantMessage.content = '<em style="color: #909399;">Fetching data...</em>'
            contextData = await self.fetchSpecificData(dataSources)
            console.log('获取到的数据:', contextData)
          }

          // 构建最终提示词
          const systemPrompt = currentLang === 'en'
            ? 'You are an AI assistant for a security monitoring platform. Answer user questions about alarm data, device status, and monitoring information in a conversational way. Keep responses concise and helpful. Use HTML formatting for better readability: <strong> for emphasis, <br> for line breaks, <ul><li> for lists.'
            : 'You are an AI assistant for a smart security monitoring platform. Answer questions about alarm data, device status, and monitoring info conversationally. Keep answers concise. Use HTML for readability:<strong>表示强调，<br>表示换行，<ul><li>表示列表。'
          
          let finalPrompt = systemPrompt + '\n\nUser question: ' + userMessage
          
          if (contextData) {
            finalPrompt += '\n\n[System Real-time Data]\n' + contextData
            finalPrompt += '\n\nPlease answer the user question based on the above real-time data.'
            console.log('最终提示词:', finalPrompt)
          }

          // 清空之前的内容，准备显示最终回答
          self.currentAssistantMessage.content = ''

          // 第二次调用：生成最终回答
          self.abortFn = streamAiReport(
            finalPrompt,
            function onChunk(text) {
              self.currentAssistantMessage.content += text
              self.$nextTick(() => {
                self.scrollToBottom()
              })
            },
            function onDone() {
              self.isLoading = false
              self.currentAssistantMessage = null
              self.abortFn = null
            },
            function onError(err) {
              self.isLoading = false
              self.currentAssistantMessage.content = self.$t('aiChat.error') + '<br><br>' + (err.message || err)
              self.currentAssistantMessage = null
              self.abortFn = null
            },
            currentLang
          )
        },
        function onError(err) {
          self.isLoading = false
          self.currentAssistantMessage.content = self.$t('aiChat.error') + '<br><br>' + (err.message || err)
          self.currentAssistantMessage = null
          self.abortFn = null
        },
        currentLang
      )
    },
    // 关键词检测（后备方案）
    detectNeedDataByKeywords(message) {
      const msg = message.toLowerCase()
      const dataKeywords = [
        'alarm', 'alert', 'warning',
        'device', 'camera', 'monitor',
        'server', 'system', 'performance', 'cpu', 'memory',
        'how many', 'status', 'count', 'total', 'statistics'
      ]
      return dataKeywords.some(k => msg.includes(k))
    },
    // 关键词检测数据源（后备方案）
    detectDataSourcesByKeywords(message) {
      const msg = message.toLowerCase()
      const sources = []
      
      if (['alarm', 'alert', 'warning', 'event'].some(k => msg.includes(k))) {
        sources.push('ALARM_DATA')
      }
      if (['device', 'camera', 'monitor', 'online', 'offline'].some(k => msg.includes(k))) {
        sources.push('DEVICE_DATA')
      }
      if (['server', 'system', 'performance', 'cpu', 'memory'].some(k => msg.includes(k))) {
        sources.push('SERVER_DATA')
      }
      
      return sources
    },
    // 根据指定的数据源获取数据
    async fetchSpecificData(sources) {
      const dataContext = []
      
      try {
        for (const source of sources) {
          if (source === 'ALARM_DATA') {
            const alarmData = await this.fetchAlarmData()
            if (alarmData) {
              dataContext.push('[Alarm Records]\n' + alarmData)
            }
          } else if (source === 'DEVICE_DATA') {
            const deviceData = await this.fetchDeviceData()
            if (deviceData) {
              dataContext.push('[Device Info]\n' + deviceData)
            }
          } else if (source === 'SERVER_DATA') {
            const serverData = await this.fetchServerData()
            if (serverData) {
              dataContext.push('[Server Status]\n' + serverData)
            }
          }
        }
        
        return dataContext.length > 0 ? dataContext.join('\n\n') : null
      } catch (error) {
        console.error('获取数据失败:', error)
        return null
      }
    },
    // 智能识别用户意图并获取相关数据
    async fetchRelevantData(userMessage) {
      const msg = userMessage.toLowerCase()
      const dataContext = []

      try {
        this.isFetchingData = true

        // 识别关键词并调用相应API
        const keywords = {
          alarm: ['alarm', 'alert', 'warning', 'event'],
          device: ['device', 'camera', 'monitor', 'online', 'offline'],
          server: ['server', 'system', 'performance', 'cpu', 'memory']
        }

        // 检测是否需要告警数据
        if (keywords.alarm.some(k => msg.includes(k))) {
          const alarmData = await this.fetchAlarmData()
          if (alarmData) {
            dataContext.push('[Alarm Records]\n' + alarmData)
          }
        }

        // 检测是否需要设备数据
        if (keywords.device.some(k => msg.includes(k))) {
          const deviceData = await this.fetchDeviceData()
          if (deviceData) {
            dataContext.push('[Device Info]\n' + deviceData)
          }
        }

        // 检测是否需要服务器数据
        if (keywords.server.some(k => msg.includes(k))) {
          const serverData = await this.fetchServerData()
          if (serverData) {
            dataContext.push('[Server Status]\n' + serverData)
          }
        }

        return dataContext.length > 0 ? dataContext.join('\n\n') : null
      } catch (error) {
        console.error('获取数据失败:', error)
        return null
      } finally {
        this.isFetchingData = false
      }
    },
    // 获取告警数据
    async fetchAlarmData() {
      try {
        const response = await getRecordList({
          pageNum: 1,
          pageSize: 10
        })
        
        if (response.data && response.data.records && response.data.records.length > 0) {
          const records = response.data.records
          const totalCount = response.data.totalCount
          
          // 统计处理状态
          const unprocessed = records.filter(r => r.handleStatus === 0).length
          const processed = records.filter(r => r.handleStatus === 1).length
          const misreport = records.filter(r => r.handleStatus === 2).length
          
          // 获取字典翻译
          const getAlarmTypeName = (typeId) => {
            const dict = this.$t('dict.v1_alarm_type')
            return dict[typeId] || typeId
          }
          
          const summary = {
            total: totalCount,
            unprocessed,
            processed,
            misreport,
            recent: records.slice(0, 5).map(item => ({
              type: getAlarmTypeName(item.eventTypeId),
              device: item.equipmentName,
              time: item.sendTime,
              status: item.handleStatus === 0 ? 'Untreated' : item.handleStatus === 1 ? 'Processed' : 'False alarm'
            }))
          }
          
          return `Total alarms: ${summary.total}
未处理: ${summary.unprocessed} | 已处理: ${summary.processed} | 误报: ${summary.misreport}

Recent 5 alarms:
${summary.recent.map((a, i) => 
  `${i + 1}. ${a.device} - ${a.type}
   Time: ${a.time}
   Status: ${a.status}`
).join('\n')}`
        }
        return null
      } catch (error) {
        console.error('获取告警数据失败:', error)
        return null
      }
    },
    // 获取设备数据
    async fetchDeviceData() {
      try {
        const response = await listDevice({
          pageNum: 1,
          pageSize: 100
        })
        
        if (response.rows && response.rows.length > 0) {
          const online = response.rows.filter(d => d.status === 1).length
          const offline = response.rows.filter(d => d.status === 0).length
          const devices = response.rows.slice(0, 10).map(d => ({
            name: d.deviceName,
            status: d.status === 1 ? 'Online' : 'Offline',
            area: d.installationArea,
            ip: d.deviceIp
          }))
          
          return `Total devices: ${response.total}
Online: ${online} (${((online / response.total) * 100).toFixed(1)}%)
Offline: ${offline} (${((offline / response.total) * 100).toFixed(1)}%)

Device list (top 10):
${devices.map((d, i) => 
  `${i + 1}. ${d.name} [${d.status}]
   Area: ${d.area || 'Unassigned'}
   IP: ${d.ip || 'Unknown'}`
).join('\n')}`
        }
        return null
      } catch (error) {
        console.error('获取设备数据失败:', error)
        return null
      }
    },
    // 获取服务器数据
    async fetchServerData() {
      try {
        const response = await getServer()
        
        if (response) {
          const cpu = response.cpu
          const mem = response.mem
          const sys = response.sys
          
          return `CPU Usage: ${cpu ? cpu.used + '%' : 'Unknown'}\nMemory Usage: ${mem ? mem.usage + '%' : 'Unknown'}\n系统: ${sys ? sys.osName : 'Unknown'}\nJava版本: ${response.jvm ? response.jvm.version : 'Unknown'}`
        }
        return null
      } catch (error) {
        console.error('获取服务器数据失败:', error)
        return null
      }
    },
    addMessage(role, content) {
      const message = {
        role,
        content,
        time: this.getCurrentTime()
      }
      
      this.messages.push(message)

      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    getCurrentTime() {
      const now = new Date()
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    },
    scrollToBottom() {
      const messageList = this.$refs.messageList
      if (messageList) {
        messageList.scrollTop = messageList.scrollHeight
      }
    },
    formatMessage(text) {
      // 直接返回HTML内容，不做Markdown转换
      // AI已经输出HTML格式，只需要处理换行符
      return text.replace(/\n/g, '<br>')
    },
    stopGeneration() {
      if (this.abortFn) {
        this.abortFn()
        this.abortFn = null
      }
      this.isLoading = false
    }
  },
  beforeDestroy() {
    // 组件销毁时取消正在进行的请求
    this.stopGeneration()
  }
}
</script>

<style lang="scss" scoped>
.ai-chat-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}

// 悬浮按钮
.ai-chat-button {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  // background: linear-gradient(135deg, #29908d 0%, #01bba9 100%);
  // box-shadow: 0 4px 20px rgba(41, 144, 141, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    // transform: scale(1.1);
    // box-shadow: 0 6px 24px rgba(41, 144, 141, 0.6);
  }

  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
  }
}

// 聊天面板
.ai-chat-panel {
  width: 400px;
  height: 600px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

// 头部
.ai-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #1e3a4c 0%, #2d4a5c 100%);
  color: #fff;

  .ai-chat-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ai-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 24px;
      height: 24px;
    }
  }

  .ai-title {
    font-size: 16px;
    font-weight: 600;
  }

  i {
    font-size: 20px;
    cursor: pointer;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.2);
    }
  }
}

// 快捷操作
.ai-quick-actions {
  padding: 16px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  border-bottom: 1px solid #f0f2f5;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }
}

.quick-action-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  border-radius: 20px;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s;

  i {
    font-size: 14px;
  }

  &:hover {
    background: #ecf5ff;
    border-color: #29908d;
    color: #29908d;
  }
}

// 消息列表
.ai-chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fa;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
  }
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  &.user {
    flex-direction: row-reverse;

    .message-content {
      align-items: flex-end;
    }

    .message-text {
      background: linear-gradient(135deg, #29908d 0%, #01bba9 100%);
      color: #fff;
    }

    .message-time {
      text-align: right;
    }
  }

  &.assistant {
    .message-text {
      background: #fff;
      color: #333;
    }
  }
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(41, 144, 141, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 20px;
    height: 20px;
  }
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 70%;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  color: #999;
  padding: 0 4px;
}

// 加载动画
.message-loading {
  display: flex;
  gap: 6px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 12px;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #29908d;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

// 输入框
.ai-chat-input {
  padding: 16px;
  border-top: 1px solid #f0f2f5;
  background: #fff;

  ::v-deep .el-input__inner {
    border-radius: 20px;
    padding-right: 40px;
  }

  ::v-deep .el-input__suffix {
    display: flex;
    align-items: center;
    height: 100%;
  }

  ::v-deep .el-input__suffix-inner {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .send-icon,
  .stop-icon {
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover {
      transform: scale(1.2);
    }
  }

  .send-icon {
    color: #c0c4cc;

    &.active {
      color: #29908d;
    }
  }

  .stop-icon {
    color: #f56c6c;
    animation: pulse 1.5s ease-in-out infinite;

    &:hover {
      color: #f56c6c;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

// 动画
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
