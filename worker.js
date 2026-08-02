const CANONICAL_HOST = "officework-blog.com";

// プレビュー(*-officework-blog.….workers.dev)はリダイレクトしない
const REDIRECT_HOSTS = [
  "officework-blog.m-kondo1237-xk.workers.dev",
  "www.officework-blog.com",
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (CANONICAL_HOST && REDIRECT_HOSTS.includes(url.hostname)) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
