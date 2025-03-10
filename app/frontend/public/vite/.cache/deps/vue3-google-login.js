import "./chunk-GLAEJ2ET.js";
import {
  createCommentVNode,
  createElementBlock,
  defineComponent,
  onMounted,
  openBlock,
  reactive,
  ref,
  renderSlot,
  unref,
  useSlots,
  watch
} from "./chunk-ZZSAXYS4.js";
import "./chunk-UP2VWCW5.js";

// node_modules/vue3-google-login/dist/index.esm.js
var u = Object.freeze({ __proto__: null });
var s = { library: "https://accounts.google.com/gsi/client", defaultButtonConfig: { theme: "outline", size: "large" }, scopes: "email profile openid", ssrError: "vue3-google-login cannot be executed on the server side. See here for more info https://devbaji.github.io/vue3-google-login/#no-ssr-support" };
var g = reactive({ clientId: null, popupType: "CODE", prompt: false, autoLogin: false, idConfiguration: null, buttonConfig: s.defaultButtonConfig, callback: () => {
}, error: null });
var f = reactive({ apiLoaded: false, apiLoadIntitited: false });
var b = (e) => {
  try {
    const t = e.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), o = decodeURIComponent(atob(t).split("").map(function(e2) {
      return "%" + ("00" + e2.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
    return JSON.parse(o);
  } catch (e2) {
    throw "JWT provided is invalid";
  }
};
var h = () => new Promise((e, t) => {
  if ("undefined" != typeof window) {
    if (!f.apiLoadIntitited) {
      const o = document.createElement("script");
      f.apiLoadIntitited = true, o.addEventListener("load", () => {
        f.apiLoaded = true, e(window.google);
      }), o.addEventListener("error", () => {
        t("Failed to load the Google 3P Authorization JavaScript Library.");
      }), o.src = s.library, o.async = true, o.defer = true, document.head.appendChild(o);
    }
  } else t(s.ssrError);
});
var w = (e) => {
  f.apiLoadIntitited ? f.apiLoaded ? e(window.google) : watch(() => f.apiLoaded, (t) => {
    t && e(window.google);
  }) : h().then((t) => {
    e(t);
  });
};
var m = (e, t, o, i) => {
  if (!e.client_id) throw new Error("Prop client id required since plugin is not initialized with a client id");
  w(() => {
    ((e2, t2, o2, i2, n) => {
      if (n) {
        const t3 = e2.callback;
        e2.callback = (e3) => {
          e3.credential ? t3 && t3(e3) : n(e3);
        };
      }
      window.google.accounts.id.initialize(e2);
      const l = t2.value;
      l && !i2 && window.google.accounts.id.renderButton(l, o2);
    })(e, t, o.buttonConfig, i, o.error), o.prompt && y({ clientId: o.clientId, callback: o.callback, error: o.error, autoLogin: o.autoLogin });
  });
};
var I = (e) => new Promise((t, o) => {
  w((i) => {
    if (!(e && e.clientId || g.clientId)) throw new Error("clientId is required since the plugin is not initialized with a Client Id");
    i.accounts.oauth2.initCodeClient({ client_id: e && e.clientId || g.clientId || "", scope: s.scopes, ux_mode: "popup", callback: (e2) => {
      e2.code ? t(e2) : o(e2);
    }, error_callback: (e2) => {
      o(e2);
    } }).requestCode();
  });
});
var _ = (e) => new Promise((t, o) => {
  w((i) => {
    if (!(e && e.clientId || g.clientId)) throw new Error("clientId is required since the plugin is not initialized with a Client Id");
    i.accounts.oauth2.initTokenClient({ client_id: e && e.clientId || g.clientId || "", scope: s.scopes, callback: (e2) => {
      e2.access_token ? t(e2) : o(e2);
    }, error_callback: (e2) => {
      o(e2);
    } }).requestAccessToken();
  });
});
var y = (e) => {
  if (!e && (e = {}), !e.clientId && !g.clientId) throw new Error("clientId is required");
  const t = { use_fedcm_for_prompt: true };
  return e.clientId && (t.client_id = e.clientId), !e.clientId && g.clientId && (t.client_id = g.clientId), e.context && (t.context = e.context), null != e.autoLogin && (t.auto_select = e.autoLogin), null != e.cancelOnTapOutside && (t.cancel_on_tap_outside = e.cancelOnTapOutside), new Promise((o, i) => {
    t.callback = (t2) => {
      e && e.callback && e.callback(t2), t2.credential ? o(t2) : i(t2);
    }, w((e2) => {
      e2.accounts.id.initialize(t), e2.accounts.id.prompt();
    });
  });
};
var k = () => {
  w((e) => {
    e.accounts.id.disableAutoSelect();
  });
};
var C = defineComponent({ __name: "GoogleLogin", props: { clientId: { type: String, required: false }, prompt: { type: Boolean, required: false, default: false }, autoLogin: { type: Boolean, required: false, default: false }, popupType: { type: String, required: false }, idConfiguration: { type: Object, required: false }, buttonConfig: { type: Object, required: false }, callback: { type: Function, required: false }, error: { type: Function, required: false } }, setup(e) {
  if (!("undefined" != typeof window)) throw new Error(s.ssrError);
  const t = !!useSlots().default, o = e, u2 = ((e2, t2) => {
    const o2 = { ...e2 };
    for (const e3 in t2) void 0 !== t2[e3] && null !== t2[e3] && (o2[e3] = t2[e3]);
    return o2;
  })(g, o), f2 = { client_id: u2.clientId || null, auto_select: u2.autoLogin || false, callback: u2.callback, ...u2.idConfiguration }, b2 = ref();
  return onMounted(() => {
    m(f2, b2, u2, t), o.popupType && !t && console.warn("Option 'popupType' is ignored since a slot which act as a custom login button was not found!!!");
  }), (e2, o2) => (openBlock(), createElementBlock("div", { class: "g-btn-wrapper", onClick: o2[0] || (o2[0] = (e3) => unref(t) && void ("TOKEN" === unref(u2).popupType ? _({ clientId: u2.clientId }).then((e4) => {
    u2.callback && u2.callback(e4);
  }).catch((e4) => {
    u2.error && u2.error(e4);
  }) : I({ clientId: u2.clientId }).then((e4) => {
    u2.callback && u2.callback(e4);
  }).catch((e4) => {
    u2.error && u2.error(e4);
  }))) }, [unref(t) ? createCommentVNode("v-if", true) : (openBlock(), createElementBlock("span", { key: 0, ref_key: "buttonRef", ref: b2, class: "g-btn" }, null, 512)), renderSlot(e2.$slots, "default")]));
} });
!function(e, t) {
  void 0 === t && (t = {});
  var o = t.insertAt;
  if (e && "undefined" != typeof document) {
    var i = document.head || document.getElementsByTagName("head")[0], n = document.createElement("style");
    n.type = "text/css", "top" === o && i.firstChild ? i.insertBefore(n, i.firstChild) : i.appendChild(n), n.styleSheet ? n.styleSheet.cssText = e : n.appendChild(document.createTextNode(e));
  }
}("\n.g-btn-wrapper[data-v-5e610566] {\n  display: inline-block;\n}\n"), C.__scopeId = "data-v-5e610566", C.__file = "src/plugin/GoogleLogin.vue";
var L = { install: (e, t) => {
  t && ((e2) => {
    e2.clientId && (g.clientId = e2.clientId), e2.popupType && (g.popupType = e2.popupType), null != e2.prompt && (g.prompt = e2.prompt), null != e2.autoLogin && (g.autoLogin = e2.autoLogin), e2.idConfiguration && (g.idConfiguration = e2.idConfiguration), e2.buttonConfig && (g.buttonConfig = e2.buttonConfig), e2.callback && (g.callback = e2.callback);
  })(t), h().then(() => {
    if (t.clientId) {
      const e2 = { client_id: t.clientId, auto_select: true === t.autoLogin, callback: t.callback, use_fedcm_for_prompt: true, ...t.idConfiguration };
      window.google.accounts.id.initialize(e2), t.prompt && window.google.accounts.id.prompt();
    }
  }), e.component("GoogleLogin", C);
} };
export {
  u as CallbackTypes,
  C as GoogleLogin,
  b as decodeCredential,
  L as default,
  I as googleAuthCodeLogin,
  k as googleLogout,
  y as googleOneTap,
  w as googleSdkLoaded,
  _ as googleTokenLogin
};
//# sourceMappingURL=vue3-google-login.js.map
