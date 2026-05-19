/**
 * AI 报告生成 API — 直接调用 DeepSeek（兼容 OpenAI）接口
 * 使用 fetch + ReadableStream 实现 SSE 流式输出
 */

// ==================== 配置常量 ====================

// AI 服务基础 URL
// 直连 DeepSeek API: https://api.deepseek.com
// 从环境变量 VUE_APP_AI_BASE_URL 读取，默认使用 DeepSeek 官方地址
const AI_BASE_URL = process.env.VUE_APP_AI_BASE_URL || 'https://api.deepseek.com';

// AI API 密钥，用于身份验证
// 从环境变量 VUE_APP_AI_API_KEY 读取
const AI_API_KEY = process.env.VUE_APP_AI_API_KEY || '';

// AI 模型名称
// 从环境变量 VUE_APP_AI_MODEL 读取，默认使用 deepseek-chat
// 示例：qwen3-30b-a3b-instruct-2507-fp8
const AI_MODEL = process.env.VUE_APP_AI_MODEL || 'deepseek-chat';

// ==================== API 函数 ====================

/**
 * 流式调用 AI 生成报告
 * 
 * 工作原理：
 * 1. 发送 HTTP POST 请求到 AI 服务
 * 2. 使用 SSE (Server-Sent Events) 接收流式响应
 * 3. 逐步解析返回的文本片段
 * 4. 通过回调函数实时返回生成的内容
 * 
 * @param {string} prompt - 用户提示词，包含要分析的数据和要求
 * @param {function} onChunk - 接收文本片段的回调函数
 *                              参数: text (string) - 新生成的文本片段
 *                              每次 AI 生成新内容时调用
 * @param {function} onDone - 生成完成的回调函数
 *                            当 AI 完成全部内容生成时调用
 * @param {function} onError - 错误处理回调函数
 *                             参数: err (Error) - 错误对象
 *                             当请求失败或解析错误时调用
 * @param {string} language - 语言代码，控制 AI 回复的语言
 *                            'zh': 中文（默认）
 *                            'en': 英文
 * @returns {function} abort - 取消请求的函数
 *                             调用此函数可以中止正在进行的 AI 生成
 * 
 * @example
 * const abort = streamAiReport(
 *   '请分析以下数据...',
 *   (text) => console.log('收到:', text),
 *   () => console.log('完成'),
 *   (err) => console.error('错误:', err),
 *   'zh'
 * );
 * // 如需取消: abort();
 */
export function streamAiReport(prompt, onChunk, onDone, onError, language) {
  // 默认使用中文
  language = language || 'zh';
  
  // 创建 AbortController 用于取消请求
  const controller = new AbortController();

  // 根据语言设置 system prompt（系统提示词）
  // system prompt 定义了 AI 的角色、行为规则和输出格式
  var systemPrompt = language === 'en'
    ? 'You are a professional security data analyst who excels at generating concise and professional summary reports based on monitoring and alert data. The report should include data overview, trend analysis, key focus areas, and recommendations. Output in Markdown format.'
    : '你是一个专业的安防数据分析师，擅长根据监控预警数据生成简洁、专业的中文总结报告。报告需要包含数据概览、趋势分析、重点关注项和建议。使用 Markdown 格式输出。';

  // 发起 HTTP POST 请求
  // 发起 HTTP POST 请求
  fetch(AI_BASE_URL + '/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Bearer Token 认证方式
      'Authorization': '' + AI_API_KEY,
      'apikey':AI_API_KEY
    },
    body: JSON.stringify({
      // 使用的 AI 模型名称（如 qwen3-30b-a3b-instruct-2507-fp8）
      model: AI_MODEL,
      
      // 启用流式传输，逐步返回生成的内容而不是等待全部完成
      // 优点：用户可以实时看到生成过程，体验更好
      stream: true,
      
      // 对话消息数组
      messages: [
        // system: 定义 AI 的角色和行为规则
        { role: 'system', content: systemPrompt },
        // user: 用户的实际问题或请求
        { role: 'user', content: prompt }
      ],
      
      // temperature: 控制输出的随机性和创造性
      // 范围 0-2，值越高越随机，越低越确定
      // 0.0: 完全确定，每次输出相同
      // 0.7: 平衡值，适合生成专业报告（推荐）
      // 1.0: 较高创造性
      // 2.0: 最高随机性
      // 关闭深度思考模式（Qwen3 特有参数）
      // enable_thinking: false,
      temperature: 0.7,
      
      // max_tokens: 限制生成的最大 token 数量
      // 1 token ≈ 0.75 个英文单词 ≈ 0.5-1 个中文字符
      // 2000 tokens ≈ 1500-2000 个中文字符
      max_tokens: 100000,
    }),
    // 绑定 AbortController，用于取消请求
    signal: controller.signal,
  })
    .then(function (response) {
      // 检查 HTTP 响应状态
      if (!response.ok) {
        throw new Error('AI 接口请求失败: ' + response.status);
      }
      
      // 获取响应体的 ReadableStream 读取器
      var reader = response.body.getReader();
      // 创建 UTF-8 解码器，将字节流转换为文本
      var decoder = new TextDecoder('utf-8');
      // 缓冲区，用于存储未完成的行
      var buffer = '';

      // 递归读取流式数据
      function read() {
        reader.read().then(function (result) {
          // result.done 为 true 表示流结束
          if (result.done) {
            onDone && onDone();
            return;
          }
          
          // 解码新接收的数据并追加到缓冲区
          buffer += decoder.decode(result.value, { stream: true });
          
          // 按行分割数据（SSE 格式是按行传输的）
          var lines = buffer.split('\n');
          // 保留最后一个未完成的行
          buffer = lines.pop();

          // 处理每一行数据
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            // SSE 格式：每行以 "data: " 开头
            if (!line || !line.startsWith('data:')) continue;
            
            // 提取 JSON 数据部分
            var data = line.slice(5).trim();
            
            // "[DONE]" 表示流结束
            if (data === '[DONE]') {
              onDone && onDone();
              return;
            }
            
            try {
              // 解析 JSON 数据
              var json = JSON.parse(data);
              // 提取生成的文本片段
              var delta = json.choices && json.choices[0] && json.choices[0].delta;
              if (delta && delta.content) {
                onChunk(delta.content);
              }
            } catch (e) {
              // 忽略 JSON 解析错误（可能是不完整的数据）
            }
          }
          
          // 继续读取下一批数据
          read();
        }).catch(function (err) {
          // 如果不是用户主动取消，则调用错误回调
          if (err.name !== 'AbortError') {
            onError && onError(err);
          }
        });
      }
      
      // 开始读取
      read();
    })
    .catch(function (err) {
      // 处理 fetch 错误
      if (err.name !== 'AbortError') {
        onError && onError(err);
      }
    });

  // 返回取消函数
  return function abort() {
    controller.abort();
  };
}
