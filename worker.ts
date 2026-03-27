export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api')) {
      // 这里的地址建议手动在浏览器访问一下，确保它是通的
      const targetUrl = 'https://end.cika.eu.org' + url.pathname + url.search;
      
      // 创建新 Header，避免直接修改原始 request.headers
      const newHeaders = new Headers(request.headers);
      newHeaders.set('Host', 'end.cika.eu.org'); // 显式设置目标 Host

      const newRequest = new Request(targetUrl, {
        method: request.method,
        headers: newHeaders,
        body: request.body,
        redirect: 'manual'
      });

      try {
        return await fetch(newRequest);
      } catch (e) {
        return new Response('Gateway Error: ' + e.message, { status: 530 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
