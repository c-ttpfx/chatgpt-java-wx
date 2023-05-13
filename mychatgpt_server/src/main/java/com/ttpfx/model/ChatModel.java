package com.ttpfx.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ttpfx.vo.chat.ChatMessage;
import com.ttpfx.vo.chat.ChatRequestParameter;
import com.ttpfx.vo.chat.ChatResponseParameter;
import com.ttpfx.vo.chat.Choice;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.async.methods.AbstractCharResponseConsumer;
import org.apache.hc.client5.http.impl.async.CloseableHttpAsyncClient;
import org.apache.hc.client5.http.impl.async.HttpAsyncClients;
import org.apache.hc.client5.http.impl.routing.DefaultProxyRoutePlanner;
import org.apache.hc.core5.concurrent.FutureCallback;
import org.apache.hc.core5.http.*;
import org.apache.hc.core5.http.nio.support.AsyncRequestBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.websocket.Session;
import java.io.IOException;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CountDownLatch;
import java.util.function.Consumer;

/**
 * @author ttpfx
 * @date 2023/3/28
 */
@Component
@Slf4j
public class ChatModel {

    @Value("${gpt.model.key}")
    private String apiKey;

    private String url = "https://api.openai.com/v1/chat/completions";
    private final Charset charset = StandardCharsets.UTF_8;


    @Resource(name = "httpAsyncClient")
    private CloseableHttpAsyncClient asyncClient;

    @Resource
    private ObjectMapper objectMapper;

    /**
     * 该方法会异步请求chatGpt的接口，返回答案
     *
     * @param resConsumer                 函数式接口，处理每次返回的结果
     * @param chatGptRequestParameter 请求参数
     * @param question                问题
     * @return 返回chatGpt给出的答案
     */
    public String getAnswer(Consumer<String> resConsumer,ChatRequestParameter chatGptRequestParameter, String question) {
        asyncClient.start();
        // 创建一个post请求
        AsyncRequestBuilder asyncRequest = AsyncRequestBuilder.post(url);

        // 设置请求参数
        chatGptRequestParameter.addMessages(new ChatMessage("user", question));

        // 请求的参数转换为字符串
        String valueAsString = null;
        try {
            valueAsString = objectMapper.writeValueAsString(chatGptRequestParameter);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // 设置编码和请求参数
        ContentType contentType = ContentType.create("text/plain", charset);
        asyncRequest.setEntity(valueAsString, contentType);
        asyncRequest.setCharset(charset);

        // 设置请求头
        asyncRequest.setHeader(HttpHeaders.CONTENT_TYPE, "application/json");
        // 设置登录凭证
        asyncRequest.setHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey);

        // 下面就是生产者消费者模型
        CountDownLatch latch = new CountDownLatch(1);
        // 用于记录返回的答案
        StringBuilder sb = new StringBuilder();
        // 消费者
        AbstractCharResponseConsumer<HttpResponse> consumer = new AbstractCharResponseConsumer<HttpResponse>() {
            HttpResponse response;

            @Override
            protected void start(HttpResponse response, ContentType contentType) throws HttpException, IOException {
                setCharset(charset);
                this.response = response;
            }

            @Override
            protected int capacityIncrement() {
                return Integer.MAX_VALUE;
            }

            @Override
            protected void data(CharBuffer src, boolean endOfStream) throws IOException {
                // 收到一个请求就进行处理
                String ss = src.toString();
                // 通过data:进行分割，如果不进行此步，可能返回的答案会少一些内容
                for (String s : ss.split("data:")) {
                    // 去除掉data:
                    if (s.startsWith("data:")) {
                        s = s.substring(5);
                    }
                    // 返回的数据可能是（DONE）
                    if (s.length() > 8 && !s.contains("[DONE]")) {
                        // 转换为对象
                        ChatResponseParameter responseParameter = null;
                        try {
                            responseParameter = objectMapper.readValue(s, ChatResponseParameter.class);
                            // 处理结果
                            for (Choice choice : responseParameter.getChoices()) {
                                String content = choice.getDelta().getContent();
                                if (content != null && !"".equals(content)) {
                                    // 保存结果
                                    sb.append(content);
                                    // 处理结果
                                    resConsumer.accept(content);
                                }
                            }
                        } catch (JsonProcessingException e) {
                            log.warn("转换异常，{} 不能被转换为json", s.trim());
                        }

                    }
                }
            }

            @Override
            protected HttpResponse buildResult() throws IOException {
                return response;
            }

            @Override
            public void releaseResources() {
            }
        };

        // 执行请求
        asyncClient.execute(asyncRequest.build(), consumer, new FutureCallback<HttpResponse>() {

            @Override
            public void completed(HttpResponse response) {
                latch.countDown();
                chatGptRequestParameter.addMessages(new ChatMessage("assistant", sb.toString()));
                System.out.println("回答结束！！！");
            }

            @Override
            public void failed(Exception ex) {
                latch.countDown();
                System.out.println("failed");
                ex.printStackTrace();
            }

            @Override
            public void cancelled() {
                latch.countDown();
                System.out.println("cancelled");
            }

        });
        try {
            latch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // 返回最终答案，用于保存数据库的
        return sb.toString();
    }


    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
