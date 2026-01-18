class c {
  useLocalStorage = !1;
  STORAGE_KEY = "key";
  container;
  constructor(e, t) {
    t && (this.STORAGE_KEY = t, this.useLocalStorage = !0), typeof window > "u" && (this.useLocalStorage = !1), this.container = e;
  }
  get content() {
    if (this.useLocalStorage) {
      const e = window.localStorage.getItem(this.STORAGE_KEY) ?? null;
      return JSON.parse(e);
    } else
      return this.container;
  }
  set content(e) {
    this.useLocalStorage ? window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(e)) : this.container = e;
  }
  remove() {
    this.useLocalStorage && window.localStorage.removeItem(this.STORAGE_KEY);
  }
}
class d {
  baseUrl;
  refreshPath;
  storage;
  constructor(e, t = {}) {
    this.baseUrl = e, this.refreshPath = t.refreshPath ?? "/auth/refresh";
    const r = t.storageKey ?? "session", s = t.initialSession ?? {};
    this.storage = new c(s, t.useLocalStorage === !1 ? void 0 : r);
  }
  get token() {
    const e = this.storage.content;
    if (e)
      return typeof e == "string" ? e : e.token;
  }
  get authorizationHeader() {
    const e = this.token;
    return e ? { Authorization: `Bearer ${e}` } : {};
  }
  updateSession(e) {
    const t = this.storage.content;
    typeof t == "string" ? this.storage.content = { token: e } : this.storage.content = { ...t, token: e };
  }
  async safeParse(e) {
    try {
      return {
        body: await e.json(),
        parsed: !0
      };
    } catch {
      return { body: null, parsed: !1 };
    }
  }
  async safeErrorMessage(e, t, r = !1) {
    if (t)
      return t.message ?? `HTTP ${t.statusCode ?? e.status} error`;
    if (r)
      return `HTTP ${e.status}`;
    try {
      const s = await e.json();
      return s.message ?? `HTTP ${s.statusCode} error`;
    } catch (s) {
      return console.error(s), `HTTP ${e.status}`;
    }
  }
  async refreshToken() {
    return this._refreshToken();
  }
  pendingRefresh = null;
  async _refreshToken() {
    return this.pendingRefresh || (this.pendingRefresh = (async () => {
      const e = await fetch(`${this.baseUrl}${this.refreshPath}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...this.authorizationHeader
        }
      }), { body: t, parsed: r } = await this.safeParse(e);
      if (!e.ok)
        throw {
          error: await this.safeErrorMessage(e, t ?? void 0, r),
          statusCode: t?.statusCode ?? e.status,
          message: t?.message ?? await this.safeErrorMessage(e, t ?? void 0, r)
        };
      const s = t?.data?.token ?? t?.data?.sessionToken;
      if (s)
        return this.updateSession(s), s;
      throw {
        error: await this.safeErrorMessage(e, t ?? void 0, r),
        statusCode: t?.statusCode ?? e.status,
        message: t?.message ?? await this.safeErrorMessage(e, t ?? void 0, r)
      };
    })(), this.pendingRefresh.finally(() => {
      this.pendingRefresh = null;
    })), this.pendingRefresh;
  }
  async rawRequest(e, t = {}) {
    const r = {
      "Content-Type": "application/json",
      ...this.authorizationHeader,
      ...t.headers ?? {}
    };
    return await fetch(`${this.baseUrl}${e}`, {
      ...t,
      credentials: "include",
      headers: r
    });
  }
  async request(e, t = {}) {
    try {
      const r = await this.rawRequest(e, t);
      if (r.ok) {
        const { body: a } = await this.safeParse(r);
        return a;
      }
      const { body: s, parsed: h } = await this.safeParse(r);
      if (r.status === 401 || s?.statusCode === 401 || s?.error === "Unauthorized") {
        try {
          if (!await this.refreshToken())
            throw {
              error: "Failed to refresh token",
              statusCode: 401,
              message: "Failed to refresh token"
            };
        } catch (i) {
          throw i;
        }
        const a = await this.rawRequest(e, { ...t });
        if (a.ok) {
          const { body: i } = await this.safeParse(a);
          return i;
        }
        const { body: o, parsed: u } = await this.safeParse(a);
        throw {
          error: await this.safeErrorMessage(a, o ?? void 0, u),
          statusCode: o?.statusCode ?? a.status,
          message: o?.message ?? await this.safeErrorMessage(a, o ?? void 0, u)
        };
      }
      throw {
        error: await this.safeErrorMessage(r, s ?? void 0, h),
        statusCode: s?.statusCode ?? r.status,
        message: s?.message ?? await this.safeErrorMessage(r, s ?? void 0, h)
      };
    } catch (r) {
      const s = {
        error: "network_error",
        statusCode: 500,
        message: r.message ?? "Network issue: Failed to make request"
      };
      throw typeof r == "object" && r !== null ? { ...s, ...r } : s;
    }
  }
  get(e) {
    return this.request(e, { method: "GET" });
  }
  post(e, t) {
    return this.request(e, { method: "POST", body: JSON.stringify(t) });
  }
  put(e, t) {
    return this.request(e, { method: "PUT", body: JSON.stringify(t) });
  }
  delete(e) {
    return this.request(e, { method: "DELETE" });
  }
}
const f = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  HttpClient: d
}, Symbol.toStringTag, { value: "Module" })), g = {
  Frontend: f
  // Backend
};
class w {
  static buildQuery(e) {
    const t = [];
    return e.page && t.push(`page=${e.page}`), e.limit && t.push(`limit=${e.limit}`), e.q && t.push(`q=${encodeURIComponent(e.q)}`), e.sort && t.push(`sort=${e.sort}`), e.order && t.push(`order=${e.order}`), e.filter && Object.entries(e.filter).forEach(([r, s]) => {
      s != null && s !== "" && t.push(`filter[${r}]=${encodeURIComponent(String(s))}`);
    }), t.length > 0 ? `?${t.join("&")}` : "";
  }
  static createPaginatedResult(e, t, r, s) {
    return {
      data: e,
      meta: {
        total: t,
        page: r,
        limit: s,
        totalPages: Math.ceil(t / s)
      }
    };
  }
}
export {
  g as SDK,
  w as SearchUtils
};
