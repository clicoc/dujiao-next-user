export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  // 从环境变量读取基础地址，如果没有则使用默认值
  const base = process.env.BACKEND_URL;
  
  // 构建新的目标 URL
  const targetUrl = `${base}${url.pathname}${url.search}`;

  return fetch(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.body,
    duplex: 'half',
  });
}
