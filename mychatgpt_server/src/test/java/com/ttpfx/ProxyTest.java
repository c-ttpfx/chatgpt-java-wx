package com.ttpfx;

import org.apache.hc.client5.http.ClientProtocolException;
import org.apache.hc.client5.http.auth.AuthScope;
import org.apache.hc.client5.http.auth.CredentialsProvider;
import org.apache.hc.client5.http.auth.UsernamePasswordCredentials;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.async.CloseableHttpAsyncClient;
import org.apache.hc.client5.http.impl.async.HttpAsyncClients;
import org.apache.hc.client5.http.impl.auth.BasicCredentialsProvider;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.routing.DefaultProxyRoutePlanner;
import org.apache.hc.core5.http.HttpHost;
import org.apache.hc.core5.http.io.HttpClientResponseHandler;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.junit.jupiter.api.Test;

import java.io.IOException;

/**
 * @author ttpfx
 * @date 2023/5/12
 */
public class ProxyTest {
    @Test
    public void t1() throws IOException {
        String url = "https://api.openai.com/v1/chat/completions";
        HttpPost httpPost = new HttpPost(url);
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            client.execute(new HttpHost("api.openai.com"), httpPost, response -> {
                System.out.println(response);
                return null;
            });
        }
    }

    @Test
    public void t2() throws IOException {
        //要访问的网址
        String url = "https://api.openai.com/v1/chat/completions";
        HttpHost proxy = new HttpHost("127.0.0.1", 7890);
        DefaultProxyRoutePlanner routePlanner = new DefaultProxyRoutePlanner(proxy);

        HttpPost httpPost = new HttpPost(url);
        try (CloseableHttpClient client = HttpClients.custom().setRoutePlanner(routePlanner).build()) {
            client.execute(new HttpHost("api.openai.com"), httpPost, response -> {
                System.out.println(response);
                return null;
            });
        }
    }
}
