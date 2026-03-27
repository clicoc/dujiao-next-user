export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 只要路径是以 /api 开头的，就转交给你的后端
    if (url.pathname.startsWith('/api')) {
      // 这里的地址就是你要设置的目标
      const targetUrl = 'https://end.cika.eu.org' + url.pathname + url.search;
      
      const newRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'manual'
      });

      return fetch(newRequest);
    }

    // 其他静态资源（图片、JS、HTML）由 Cloudflare 正常提供
    return env.ASSETS.fetch(request);
  }
};
