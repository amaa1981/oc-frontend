/**
 * AI report Generate API - directly calls the DeepSeek (compatible with OpenAI) interface
 * Use fetch + ReadableStream to implement SSE streaming output
 */

// ==================== Configuration Constants ====================

// AI service basic URL
// Direct connection to DeepSeek API: https://api.deepseek.com
// Read from the environment variable VUE_APP_AI_BASE_URL, using the DeepSeek official address by default
const AI_BASE_URL = process.env.VUE_APP_AI_BASE_URL || 'https://api.deepseek.com';

// AI API key for authentication
// Read from environment variable VUE_APP_AI_API_KEY
const AI_API_KEY = process.env.VUE_APP_AI_API_KEY || '';

// AI model name
// Read from the environment variable VUE_APP_AI_MODEL, using deepseek-chat by default
// Example: qwen3-30b-a3b-instruct-2507-fp8
const AI_MODEL = process.env.VUE_APP_AI_MODEL || 'deepseek-chat';

// ==================== API functions ====================

/**
 * Streaming call AI Generate report
 * 
 * How it works:
 * 1. Send HTTP POST request to AI service
 * 2. Use SSE (Server-Sent Events) to receive streaming responses
 * 3. Step by step parsing the text fragments of Back
 * 4. Real-time BackGenerate content through callback function
 * 
 * @param {string} prompt - user prompt word, containing the data and requirements to be analyzed
 * @param {function} onChunk - callback function to receive the text fragment
 *                              Parameters: text (string) - The text fragment for the new Generate
 *                              Called every time AI Generate new content
 * @param {function} onDone - Generate completion callback function
 *                            Called when AI has finished generating all content
 * @param {function} onError - error handling callback function
 *                             Parameters: err (Error) - error object
 *                             Called when a request fails or a parsing error occurs
 * @param {string} language - the language code that controls the language of the AI ​​reply
 *                            'zh': Chinese (default)
 *                            'en': English
 * @returns {function} abort - function to cancel the request
 *                             Call this function to abort an ongoing AI Generate
 * 
 * @example
 * const abort = streamAiReport(
 *   'Please analyze the following data...',
 *   (text) => console.log('Received:', text),
 *   () => console.log('Complete'),
 *   (err) => console.error('Error:', err),
 *   'zh'
 * );
 * // To cancel: abort();
 */
export function streamAiReport(prompt, onChunk, onDone, onError, language) {
  // Chinese is used by default
  language = language || 'zh';
  
  // Create AbortController for canceling requests
  const controller = new AbortController();

  // Set system prompt according to language
  // system prompt defines the role, behavior rules and output format of AI
  var systemPrompt = language === 'en'
    ? 'You are a professional security data analyst who excels at generating concise and professional summary reports based on monitoring and alert data. The report should include data overview, trend analysis, key focus areas, and recommendations. Output in Markdown format.'
    : "You are a professional security data analyst who is good at generating concise and professional Chinese summary reports based on monitoring and warning data. Reports need to include an overview of the data, trend analysis, key concerns and recommendations. Use Markdown format for output.";

  // Make an HTTP POST request
  // Make an HTTP POST request
  fetch(AI_BASE_URL + '/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Bearer Token authentication method
      'Authorization': '' + AI_API_KEY,
      'apikey':AI_API_KEY
    },
    body: JSON.stringify({
      // The name of the AI ​​model used (e.g. qwen3-30b-a3b-instruct-2507-fp8)
      model: AI_MODEL,
      
      // Enable streaming to gradually BackGenerate content instead of waiting for it all to complete
      // Advantages: Users can see the Generate process in real time, giving them a better experience
      stream: true,
      
      // Conversation message array
      messages: [
        // system: Define the role and behavior rules of the AI
        { role: 'system', content: systemPrompt },
        // user: the user’s actual question or request
        { role: 'user', content: prompt }
      ],
      
      // temperature: Control the randomness and creativity of the output
      // Range 0-2, higher values ​​are more random, lower values ​​are more certain
      // 0.0: Completely sure, the output is the same every time
      // 0.7: Balanced value, suitable for Generate professional reports (recommended)
      // 1.0: High creativity
      // 2.0: Highest randomness
      // Turn off deep thinking mode (Qwen3 specific parameter)
      // enable_thinking: false,
      temperature: 0.7,
      
      // max_tokens: Limit the maximum number of tokens for Generate
      // 1 token ≈ 0.75 English words ≈ 0.5-1 Chinese characters
      // 2000 tokens ≈ 1500-2000 Chinese characters
      max_tokens: 100000,
    }),
    // Bind AbortController for canceling requests
    signal: controller.signal,
  })
    .then(function (response) {
      // Check HTTP response status
      if (!response.ok) {
        throw new Error("AI interface request failed:" + response.status);
      }
      
      // ReadableStream reader that gets the response body
      var reader = response.body.getReader();
      // Create a UTF-8 decoder to convert a byte stream to text
      var decoder = new TextDecoder('utf-8');
      // Buffer to store unfinished lines
      var buffer = '';

      // Recursively read streaming data
      function read() {
        reader.read().then(function (result) {
          // result.done is true to indicate the end of the stream
          if (result.done) {
            onDone && onDone();
            return;
          }
          
          // Decode newly received data and append to buffer
          buffer += decoder.decode(result.value, { stream: true });
          
          // Split data by rows (SSE format is transferred row by row)
          var lines = buffer.split('\n');
          // Keep the last unfinished line
          buffer = lines.pop();

          // Process each row of data
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            // SSE format: Each line starts with "data: "
            if (!line || !line.startsWith('data:')) continue;
            
            // Extract JSON data part
            var data = line.slice(5).trim();
            
            // "[DONE]" indicates the end of the stream
            if (data === '[DONE]') {
              onDone && onDone();
              return;
            }
            
            try {
              // Parse JSON data
              var json = JSON.parse(data);
              // Extract the text fragment of Generate
              var delta = json.choices && json.choices[0] && json.choices[0].delta;
              if (delta && delta.content) {
                onChunk(delta.content);
              }
            } catch (e) {
              // Ignore JSON parsing errors (possibly incomplete data)
            }
          }
          
          // Continue reading the next batch of data
          read();
        }).catch(function (err) {
          // If the user does not actively cancel, the error callback is called.
          if (err.name !== 'AbortError') {
            onError && onError(err);
          }
        });
      }
      
      // Start reading
      read();
    })
    .catch(function (err) {
      // Handling fetch errors
      if (err.name !== 'AbortError') {
        onError && onError(err);
      }
    });

  // Backcancel function
  return function abort() {
    controller.abort();
  };
}
