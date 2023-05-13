package com.ttpfx.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jdk.nashorn.internal.runtime.logging.Logger;
import lombok.Setter;
import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.impl.async.CloseableHttpAsyncClient;
import org.apache.hc.client5.http.impl.async.HttpAsyncClients;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.routing.DefaultProxyRoutePlanner;
import org.apache.hc.core5.http.HttpHost;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author ttpfx
 * @date 2023/5/12
 */
@Configuration
@ConfigurationProperties(prefix = "gpt.proxy")
@Setter
@Slf4j
public class ChatGptConfig {
    private String host;
    private Integer port;

    @Bean
    public CloseableHttpAsyncClient httpAsyncClient() {
        if (host != null && port != null) {
            log.info("use proxy, proxy host is {}, proxy port is {}", host, port);
            HttpHost proxy = new HttpHost(host, port);
            DefaultProxyRoutePlanner routePlanner = new DefaultProxyRoutePlanner(proxy);
            return HttpAsyncClients.custom().setRoutePlanner(routePlanner).build();
        }
        return HttpAsyncClients.createHttp2Default();
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
