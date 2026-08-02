// 独自ドメイン導入時はCANONICAL_HOSTを設定し、REDIRECT_HOSTSに旧ホストを追加する
const CANONICAL_HOST = null; // 例: "officework-tensyoku.com"

const REDIRECT_HOSTS = [
  // 例: "officework-blog.m-kondo1237-xk.workers.dev",
  // 例: "www.officework-tensyoku.com",
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
