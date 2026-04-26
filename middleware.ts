import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const remoteHost = process.env.REMOTE_HOST; // 在 Vercel 设置此变量

  // 如果没有环境变量，可以设置一个默认值
  const targetBase = remoteHost;

  if (pathname.startsWith('/api/') || pathname.startsWith('/uploads/')) {
    // 拼接完整的转发地址
    const targetUrl = new URL(`${targetBase}${pathname}${search}`);
    return NextResponse.rewrite(targetUrl);
  }

  // 其他请求正常放行（或由 vercel.json 处理 index.html 重写）
  return NextResponse.next();
}

// 限制中间件只在特定路径运行，提高性能
export const config = {
  matcher: ['/api/:path*', '/uploads/:path*'],
};
