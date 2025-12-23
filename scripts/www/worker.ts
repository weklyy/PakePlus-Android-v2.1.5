
export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // 如果是根路径，尝试返回 index.html
    if (url.pathname === "/" || url.pathname === "") {
      return await env.ASSETS.fetch(new Request(new URL("/index.html", url.origin), request));
    }

    // 其他请求直接交给静态资产处理（如 .js, .css, .png 等）
    const response = await env.ASSETS.fetch(request);
    
    // 如果资产未找到（404），对于单页应用（SPA）通常返回 index.html 以支持前端路由
    if (response.status === 404) {
      return await env.ASSETS.fetch(new Request(new URL("/index.html", url.origin), request));
    }

    return response;
  },
};
