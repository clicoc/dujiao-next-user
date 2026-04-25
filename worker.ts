export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 拦截 API 请求
    if (url.pathname.startsWith('/api')) {
      // 目标后端地址
      const targetHost = 'a.teka.eu.org';
      const targetUrl = `https://${targetHost}${url.pathname}${url.search}`;
      
      // 核心修复：克隆并修改 Headers
      const newHeaders = new Headers(request.headers);
      
      // 1. 必须重设 Host 头部，否则目标服务器会因为 Host 不匹配拒绝连接 (530 常见原因)
      newHeaders.set('Host', targetHost);
      
      // 2. 移除可能导致递归或冲突的头部
      newHeaders.delete('cf-connecting-ip');
      newHeaders.delete('x-real-ip');

      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: newHeaders,
        body: request.body,
        redirect: 'manual' // 手动处理跳转，防止 530
      });

      try {
        const response = await fetch(proxyRequest);
        
        // 3. 克隆响应以修改 CORS（防止前端跨域报错）
        const newResponse = new Response(response.body, response);
        newResponse.headers.set('Access-Control-Allow-Origin', '*');
        newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        
        return newResponse;
      } catch (err) {
        // 如果抓取失败，返回具体错误信息而不是模糊的 530
        return new Response(`Proxy Error: ${err.message}`, { status: 502 });
      }
    }

    // 静态资源处理
    const response = await env.ASSETS.fetch(request);

    // 如果找不到文件 (404) 且不是 API 请求，就返回 index.html
    if (response.status === 404 && !url.pathname.startsWith('/api')) {
      const indexRequest = new Request(new URL('/index.html', request.url));
      return env.ASSETS.fetch(indexRequest);
    }

    return response;
  }
};
