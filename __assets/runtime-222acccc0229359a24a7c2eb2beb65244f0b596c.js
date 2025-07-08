"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve2, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // ../utils/src/numbers.ts
  function roundTo(v, factor) {
    return Math.round(v * factor) / factor;
  }

  // ../../node_modules/.pnpm/rgb-hex@4.0.1/node_modules/rgb-hex/index.js
  function rgbHex(red, green, blue, alpha) {
    const isPercent = (red + (alpha || "")).toString().includes("%");
    if (typeof red === "string") {
      [red, green, blue, alpha] = red.match(/(0?\.?\d+)%?\b/g).map((component) => Number(component));
    } else if (alpha !== void 0) {
      alpha = Number.parseFloat(alpha);
    }
    if (typeof red !== "number" || typeof green !== "number" || typeof blue !== "number" || red > 255 || green > 255 || blue > 255) {
      throw new TypeError("Expected three numbers below 256");
    }
    if (typeof alpha === "number") {
      if (!isPercent && alpha >= 0 && alpha <= 1) {
        alpha = Math.round(255 * alpha);
      } else if (isPercent && alpha >= 0 && alpha <= 100) {
        alpha = Math.round(255 * alpha / 100);
      } else {
        throw new TypeError(`Expected alpha value (${alpha}) as a fraction or percentage`);
      }
      alpha = (alpha | 1 << 8).toString(16).slice(1);
    } else {
      alpha = "";
    }
    return (blue | green << 8 | red << 16 | 1 << 24).toString(16).slice(1) + alpha;
  }

  // ../utils/src/array.ts
  function filterEmpty(arr) {
    return arr.filter(notEmpty);
  }
  function notEmpty(value) {
    return value !== null && value !== void 0;
  }

  // ../utils/src/assert.ts
  function shouldNotHappen(txt) {
    console.warn(txt);
    if (true) {
      debugger;
    }
  }

  // ../figma-to-html/src/variables.ts
  function isAlias(v) {
    return typeof v === "object" && v.type === "VARIABLE_ALIAS";
  }

  // ../utils/src/analytics/index.ts
  var _Analytics = class {
    constructor(def) {
      this.def = def;
    }
    addDefault(def) {
      if (this.def) {
        if (this.def.properties) {
          const { properties, ...rest } = def;
          Object.assign(this.def.properties, properties);
          def = rest;
        }
        Object.assign(this.def, def);
      } else {
        this.def = { ...def };
      }
    }
    resetDefault() {
      this.def = void 0;
    }
    transformOptions(options) {
      if (!options)
        return;
      const { country, userAgent } = options;
      const transformed = {};
      if (country)
        transformed.co = country;
      if (userAgent)
        transformed.ua = userAgent;
      return transformed;
    }
    async feature_test(feature, data) {
      if ("feature" in data) {
        console.error(
          "`feature` is a reserved property for feature_test tracking."
        );
        return;
      }
      return this.track("feature-test", {
        properties: {
          feature,
          ...data
        }
      });
    }
    async exception(name, error, details) {
      if (true) {
        console.error(`Analytics.exception(): ${name}`, error, details);
      }
      const properties = {
        name
      };
      if (details)
        properties.details = typeof details === "string" ? details : JSON.stringify(details);
      return this.track("exception", {
        error,
        properties
      });
    }
    catcher(name, details) {
      return (error) => {
        this.exception(name, error, details);
      };
    }
    unhandled(name, cb) {
      try {
        const ret = cb();
        if (ret && typeof ret === "object" && "catch" in ret) {
          return ret.catch(this.catcher(name));
        }
        return ret;
      } catch (error) {
        this.exception(name, error);
      }
    }
    async track(event, payloadPartial = {}, options) {
      const properties = this.def?.properties ? Object.assign(payloadPartial.properties || {}, this.def.properties) : payloadPartial.properties || {};
      if (payloadPartial.error) {
        const error = payloadPartial.error;
        properties.error_message = error.message || String(error);
        properties.error_stack = getStackTrace(error);
        delete payloadPartial.error;
      }
      const payload = {
        event,
        ...{ version: "4a9101ef5dbf22e56e62" },
        ...this.def,
        ...payloadPartial,
        properties,
        options: this.transformOptions(options)
      };
      if (!payload.product) {
        console.error("Analytics.track(): `product` property is missing.");
        return;
      }
      const tryFetch = async (url, logOnError) => {
        try {
          await fetch(`${url}/pa`, {
            method: "POST",
            body: JSON.stringify(payload)
          });
          return true;
        } catch (e) {
          if (logOnError) {
            console.error(
              `Analytics.track(): Unexpected error on event ${event}.`,
              e
            );
          }
        }
        return false;
      };
      if (_Analytics.serviceUrl) {
        await tryFetch(_Analytics.serviceUrl, true);
      } else {
        const urls = [..._Analytics.SHARED_SERVICE_URLS];
        while (urls.length) {
          const url = urls.shift();
          if (await tryFetch(url, !urls.length)) {
            _Analytics.serviceUrl = url;
            return;
          }
        }
        if (!_Analytics.serviceUrl)
          _Analytics.serviceUrl = _Analytics.SHARED_SERVICE_URLS[0];
      }
    }
  };
  var Analytics = _Analytics;
  Analytics.SHARED_SERVICE_URLS = false ? ["https://api.divriots.com", "https://api-eu.divriots.com"] : void 0 ? ["http://localhost:5001/dev-shared-services/us-central1/api"] : [
    "https://api-oddhqn4pmq-uc.a.run.app",
    "https://apieu-oddhqn4pmq-ew.a.run.app"
  ];
  var GlobalAnalytics = class extends Analytics {
    constructor() {
      super({});
      this.isInitialized = false;
    }
    initialize(def) {
      this.addDefault(def);
      this.isInitialized = true;
    }
  };
  var analytics = new GlobalAnalytics();
  var getStackTrace = (err) => {
    if (err.stack) {
      let stack = err.stack;
      if (err.cause) {
        const causeStack = getStackTrace(err.cause);
        stack += `
Caused by ${causeStack}`;
      }
      return stack;
    }
    return "";
  };

  // ../../node_modules/.pnpm/@create-figma-plugin+utilities@2.3.0_patch_hash=n536iktdewgu7v5byxuxdojvfq/node_modules/@create-figma-plugin/utilities/lib/events.js
  var eventHandlers = {};
  var currentId = 0;
  function on(name, handler) {
    const id = `${currentId}`;
    currentId += 1;
    eventHandlers[id] = { handler, name };
    return function() {
      delete eventHandlers[id];
    };
  }
  function once(name, handler) {
    let done = false;
    const dispose = on(name, function(...args) {
      if (done === true) {
        return;
      }
      done = true;
      dispose();
      handler(...args);
    });
    return dispose;
  }
  function invokeEventHandler(name, args) {
    for (const id in eventHandlers) {
      if (eventHandlers[id].name === name) {
        eventHandlers[id].handler.apply(null, args);
      }
    }
  }
  if (typeof window === "undefined") {
    figma.ui.onmessage = function([name, ...args]) {
      invokeEventHandler(name, args);
    };
  } else {
    window.addEventListener("message", function(event) {
      if (typeof event.data.pluginMessage === "undefined") {
        return;
      }
      const [name, ...args] = event.data.pluginMessage;
      invokeEventHandler(name, args);
    });
  }

  // ../figma-plugin-core-v2/src/events.ts
  var pluginId;
  var cfp_emit = typeof window === "undefined" ? function(name, ...args) {
    figma.ui.postMessage([name, ...args]);
  } : function(name, ...args) {
    if (pluginId) {
      window.parent.postMessage(
        {
          pluginMessage: [name, ...args],
          pluginId
        },
        "https://www.figma.com"
      );
    } else {
      window.parent.postMessage(
        {
          pluginMessage: [name, ...args]
        },
        "*"
      );
    }
  };
  function emit2(name, ...args) {
    if (true) {
      console.log(`EMIT`, name, args);
    }
    cfp_emit(name, ...args);
  }
  var requestId = 0;
  function genericEmitRequest(name, ...args) {
    const id = requestId++;
    return new Promise((resolve2, reject) => {
      once(`${String(name)}-response-${id}`, (response) => {
        if ("error" in response) {
          const { message, stack, name: name2 } = response.error;
          const localError = new Error(message);
          if (name2)
            localError.name = name2;
          localError.cause = new CustomError(message, stack);
          reject(localError);
        } else {
          resolve2(response.result);
        }
      });
      emit2(String(name), [id, ...args]);
    });
  }
  function genericEmitRequester() {
    return (name, ...args) => {
      return genericEmitRequest(name, ...args);
    };
  }
  var CustomError = class extends Error {
    constructor(message, stack) {
      super(message);
      this.stack = stack;
    }
  };

  // ../figma-plugin-core-v2/src/code/pluginData.ts
  var requestZstd = genericEmitRequester();

  // ../figma-to-html/src/helpers.ts
  function rgbaToString(rgba) {
    if ("a" in rgba) {
      const a = roundTo(rgba.a, 100);
      if (a !== 1)
        return `rgba(${rgba.r},${rgba.g},${rgba.b},${a})`;
    }
    const hex = rgbHex(rgba.r, rgba.g, rgba.b);
    if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
      return `#${hex[0]}${hex[2]}${hex[4]}`;
    }
    return `#${hex}`;
  }
  function figmaRgbaToCssRgba(color) {
    const { r, g, b, a = 1 } = color;
    return {
      r: roundTo(r * 255, 1),
      g: roundTo(g * 255, 1),
      b: roundTo(b * 255, 1),
      a
    };
  }
  function toPx(v) {
    return `${roundTo(v, 10)}px`;
  }
  function toPercent(v) {
    return `${roundTo(v, 10)}%`;
  }
  function valueToString(v) {
    switch (typeof v) {
      case "object":
        if (isAlias(v)) {
          return `var(${v.id})`;
        }
        if ("r" in v) {
          return rgbaToString(figmaRgbaToCssRgba(v));
        }
      case "string":
      case "number":
      case "boolean":
      default:
        return String(v);
    }
  }
  function templateId(id) {
    return "T" + id;
  }

  // ../figma-to-html/src/mapping/triggers.ts
  var reaction_types = [
    "submit",
    "appear",
    "mousedown",
    "mouseenter",
    "mouseleave",
    "mouseup",
    "timeout",
    "click",
    "press",
    "drag",
    "keydown",
    "hover"
  ];

  // ../utils/src/functions.ts
  function once2(run2) {
    if (!run2)
      return;
    return (...args) => {
      if (!run2)
        return;
      const toRun2 = run2;
      run2 = void 0;
      return toRun2(...args);
    };
  }

  // src/lifecycle.ts
  var isBoundElement = (e) => e instanceof HTMLElement || e instanceof SVGElement;
  function onDisconnected(e, cb) {
    if (!e.parentElement)
      return;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations.filter((m) => m.type === "childList"))
        for (const node of mutation.removedNodes)
          if (node === e) {
            cb == null ? void 0 : cb();
            observer.disconnect();
          }
    });
    observer.observe(e.parentElement, { childList: true });
  }
  function onConnected(selector, cb) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations.filter((m) => m.type === "childList"))
        for (const n of mutation.addedNodes)
          if (isBoundElement(n) && n.matches(selector))
            onDisconnected(n, cb(n));
    });
    observer.observe(document, { childList: true, subtree: true });
    return () => observer.disconnect();
  }

  // ../figma-to-html/src/mapping/utils.ts
  var customVideoElements = /* @__PURE__ */ new Set([
    "youtube-video",
    "vimeo-video",
    "spotify-audio",
    "jwplayer-video",
    "videojs-video",
    "wistia-video",
    "cloudflare-video",
    "hls-video",
    "shaka-video",
    "dash-video"
  ]);

  // src/runtime/videos.ts
  function isVideoElement(elt2) {
    return customVideoElements.has(elt2.tagName.toLowerCase()) || elt2.tagName === "VIDEO";
  }
  function isYoutubeIframe(elt2) {
    if (elt2.tagName !== "IFRAME")
      return false;
    const src = elt2.src;
    return (src.includes("youtube.com") || src.includes("youtube-nocookie.com")) && src.includes("enablejsapi=1");
  }
  var YoutubeController = class {
    constructor(iframe) {
      this.iframe = iframe;
      this.info = {};
      this.messageListener = null;
      this.loaded = new Promise((resolve2) => {
        const loadListener = () => {
          this.iframe.removeEventListener("load", loadListener);
          setTimeout(() => {
            this.requestYoutubeListening();
          });
        };
        this.iframe.addEventListener("load", loadListener);
        this.messageListener = (event) => {
          if (event.source === this.iframe.contentWindow && event.data) {
            let eventData;
            try {
              eventData = JSON.parse(event.data);
            } catch (e) {
              console.error("YoutubeController messageListener", e);
              return;
            }
            if (eventData.event === "onReady") {
              this.iframe.removeEventListener("load", loadListener);
            }
            if (eventData.info) {
              Object.assign(this.info, eventData.info);
              resolve2(true);
            }
          }
        };
        window.addEventListener("message", this.messageListener);
        this.requestYoutubeListening();
      });
    }
    sendYoutubeMessage(_0) {
      return __async(this, arguments, function* (func, args = []) {
        var _a;
        yield this.loaded;
        (_a = this.iframe.contentWindow) == null ? void 0 : _a.postMessage(
          JSON.stringify({ event: "command", func, args }),
          "*"
        );
      });
    }
    requestYoutubeListening() {
      var _a;
      (_a = this.iframe.contentWindow) == null ? void 0 : _a.postMessage(
        JSON.stringify({ event: "listening" }),
        "*"
      );
    }
    get muted() {
      return this.info.muted;
    }
    get volume() {
      return this.info.volume;
    }
    set muted(value) {
      if (value)
        this.sendYoutubeMessage("mute");
      else
        this.sendYoutubeMessage("unMute");
    }
    get currentTime() {
      return this.info.currentTime;
    }
    set currentTime(value) {
      this.sendYoutubeMessage("seekTo", [value, true]);
    }
    get paused() {
      return this.info.playerState === 2;
    }
    play() {
      this.sendYoutubeMessage("playVideo");
    }
    pause() {
      this.sendYoutubeMessage("pauseVideo");
    }
    static from(elt2) {
      return elt2.f2w_yt_controller || (elt2.f2w_yt_controller = new YoutubeController(elt2));
    }
  };
  function getController(elt2) {
    if (isVideoElement(elt2))
      return elt2;
    if (isYoutubeIframe(elt2))
      return YoutubeController.from(elt2);
  }
  function toggleMute(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.muted = !controller.muted;
        return () => {
          controller.muted = !controller.muted;
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function mute(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.muted = true;
        return () => {
          controller.muted = false;
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function unMute(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.muted = false;
        return () => {
          controller.muted = true;
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function play(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.play();
        return () => controller.pause();
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function pause(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.pause();
        return () => controller.play();
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function togglePlay(elt2) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        if (controller.paused)
          controller.play();
        else
          controller.pause();
        return () => {
          if (controller.paused)
            controller.play();
          else
            controller.pause();
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function seekTo(elt2, time) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.currentTime = time;
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function seekForward(elt2, seconds) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.currentTime += seconds;
        return () => {
          controller.currentTime -= seconds;
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }
  function seekBackward(elt2, seconds) {
    const controller = getController(elt2);
    if (controller) {
      return () => {
        controller.currentTime -= seconds;
        return () => {
          controller.currentTime += seconds;
        };
      };
    }
    return () => console.warn("Video element not recognized", elt2);
  }

  // ../utils/src/navigator.ts
  function isSafari() {
    const ua = navigator.userAgent;
    return ua.includes("Safari") && !ua.includes("Chrome");
  }

  // ../utils/src/styles/index.ts
  function isAbsoluteOrFixed(position) {
    return position === "absolute" || position === "fixed";
  }

  // src/runtime/animator.ts
  var safari = isSafari();
  function setAnimatedPropertiesWithAnimate(elt2, props) {
    if (!props.length)
      return;
    const [nProps, bProps, aProps] = splitByPseudo(props).map(toObj);
    setPropertiesWithAnimate(elt2, nProps);
    setPropertiesWithAnimate(elt2, bProps, "::before");
    setPropertiesWithAnimate(elt2, aProps, "::after");
  }
  function splitByPseudo(props) {
    return [
      props.filter((it) => !it.pseudo),
      props.filter((it) => it.pseudo === "::before"),
      props.filter((it) => it.pseudo === "::after")
    ];
  }
  function isAutoToCurrentProp(p) {
    switch (p) {
      case "width":
      case "height":
      case "top":
      case "left":
      case "right":
      case "bottom":
        return true;
      default:
        return false;
    }
  }
  function setPropertiesWithAnimate(elt2, props, pseudo) {
    if (!Object.keys(props).length)
      return;
    elt2.animate(
      __spreadValues({
        easing: "linear"
      }, props),
      {
        pseudoElement: pseudo,
        iterations: 1,
        duration: 0,
        fill: "forwards"
      }
    );
  }
  function withCamelKey(prop) {
    return __spreadProps(__spreadValues({}, prop), {
      camelKey: prop.key.startsWith("--") ? prop.key : prop.key.replace(/-([a-z])/g, (_, l) => l.toUpperCase())
    });
  }
  function toObj(p) {
    return Object.fromEntries(p.map((it) => [it.camelKey, [it.from, it.to]]));
  }
  function applyDomChanges(elt2, beforeAnimationProps, needsFinalState) {
    let hasBgImage = false;
    for (let idx = 0; idx < beforeAnimationProps.length; idx++) {
      const p = beforeAnimationProps[idx];
      switch (p.key) {
        case "--f2w-img-src":
          let i = elt2.f2w_image_lazy_loader;
          const src = String(p.to);
          if (!i) {
            elt2.f2w_image_lazy_loader = i = new Image();
            i.decoding = "sync";
            i.onload = () => {
              elt2.decoding = "sync";
              elt2.setAttribute("src", src);
              delete elt2.f2w_image_lazy_loader;
            };
          }
          i.src = src;
          beforeAnimationProps.splice(idx--, 1);
          break;
        case "$innerHTML":
          elt2.innerHTML = String(p.to);
          beforeAnimationProps.splice(idx--, 1);
          break;
        case "background-image":
          hasBgImage = true;
          break;
        case "overflow":
          if (safari) {
            elt2.style.setProperty(p.key, String(p.to));
            beforeAnimationProps.splice(idx--, 1);
          }
          break;
      }
      if (p.key.startsWith("--f2w-attr-")) {
        elt2.setAttribute(p.key.slice(11), String(p.to));
        beforeAnimationProps.splice(idx--, 1);
      }
    }
    if (hasBgImage) {
      const bgImgObj = Object.fromEntries(
        beforeAnimationProps.map((it, idx) => ({ it, idx })).filter(({ it }) => it.key.startsWith("background-")).map(({ it, idx }) => {
          beforeAnimationProps.splice(idx, 1);
          return [it.camelKey, String(it.to)];
        })
      );
      setPropertiesWithAnimate(elt2, bgImgObj);
    }
    if (needsFinalState) {
      setAnimatedPropertiesWithAnimate(elt2, beforeAnimationProps);
    }
  }
  function animateProps(elt2, props, easing, duration2, containersToReOrder) {
    const parent = elt2.parentElement;
    const computedStyles = getComputedStyle(elt2);
    const parentStyles = getComputedStyle(parent);
    const parentDisplay = parentStyles.display;
    const isFlexOrGrid = parentDisplay.endsWith("flex") || parentDisplay.endsWith("grid");
    const isAbsolute = isAbsoluteOrFixed(computedStyles.position);
    const currentProps = props.map(withCamelKey);
    const [nPropsObj, bPropsObj, aPropsObj] = splitByPseudo(currentProps).map(toObj);
    let displayAfterAnimation = void 0;
    if (nPropsObj.display) {
      if (nPropsObj.display[0] === "none") {
        setPropertiesWithAnimate(elt2, {
          display: String(nPropsObj.display[1])
        });
      } else if (nPropsObj.display[1] === "none") {
        if (isFlexOrGrid && !isAbsolute) {
          setPropertiesWithAnimate(elt2, {
            display: "none"
          });
        }
      }
      displayAfterAnimation = String(nPropsObj.display[1]);
      delete nPropsObj.display;
    }
    let f2wOrder = +getComputedStyle(elt2).getPropertyValue("--f2w-order");
    if (nPropsObj["--f2w-order"]) {
      const to = nPropsObj["--f2w-order"][1];
      f2wOrder = to === void 0 ? NaN : +to;
      if (!isNaN(f2wOrder)) {
        elt2.style.setProperty("--f2w-order", String(f2wOrder));
      }
      delete nPropsObj["--f2w-order"];
    }
    if (!isNaN(f2wOrder)) {
      containersToReOrder.add(parent);
    }
    for (const [pseudo, obj] of [
      ["before", bPropsObj],
      ["after", aPropsObj]
    ]) {
      if (obj.display) {
        if (obj.display[1] === "none") {
          elt2.classList.remove(pseudo + "-visible");
          elt2.classList.add(pseudo + "-hidden");
        } else {
          elt2.classList.remove(pseudo + "-hidden");
          elt2.classList.add(pseudo + "-visible");
        }
      }
    }
    const anim = (toAnimate, pseudo, force = false) => {
      if (!force && !Object.keys(toAnimate).length)
        return;
      return elt2.animate(
        __spreadValues({
          easing
        }, toAnimate),
        {
          pseudoElement: pseudo,
          iterations: 1,
          duration: duration2,
          fill: "both"
        }
      );
    };
    const a = anim(nPropsObj, void 0, !!displayAfterAnimation);
    if (displayAfterAnimation) {
      a.finished.then(() => {
        elt2.style.display = displayAfterAnimation;
      });
    }
    anim(bPropsObj, "::before");
    anim(aPropsObj, "::after");
  }

  // src/runtime/animations.ts
  function getMoveInAnimations(eltId, overlayPositionType2, transition2) {
    if (transition2.direction === "LEFT") {
      if (overlayPositionType2 === "BOTTOM_LEFT" || overlayPositionType2 === "TOP_LEFT") {
        return [
          {
            eltId,
            props: [
              {
                key: "left",
                from: "100%",
                to: "0%"
              }
            ]
          }
        ];
      } else if (overlayPositionType2 === "BOTTOM_RIGHT" || overlayPositionType2 === "TOP_RIGHT") {
        return [
          {
            eltId,
            props: [
              {
                key: "translate",
                from: "100% 0px",
                to: "0px 0px"
              }
            ]
          }
        ];
      } else {
        const ty = overlayPositionType2 === "CENTER" ? "-50%" : "0px";
        return [
          {
            eltId,
            props: [
              {
                key: "left",
                from: "100%",
                to: "50%"
              },
              {
                key: "translate",
                from: `0px ${ty}`,
                to: `-50% ${ty}`
              }
            ]
          }
        ];
      }
    } else if (transition2.direction === "RIGHT") {
      if (overlayPositionType2 === "BOTTOM_LEFT" || overlayPositionType2 === "TOP_LEFT") {
        return [
          {
            eltId,
            props: [
              {
                key: "translate",
                from: "-100% 0px",
                to: "0px 0px"
              }
            ]
          }
        ];
      } else if (overlayPositionType2 === "BOTTOM_RIGHT" || overlayPositionType2 === "TOP_RIGHT") {
        return [
          {
            eltId,
            props: [
              {
                key: "right",
                from: "100%",
                to: "0px"
              }
            ]
          }
        ];
      } else {
        const ty = overlayPositionType2 === "CENTER" ? "-50%" : "0px";
        return [
          {
            eltId,
            props: [
              {
                key: "left",
                from: "0px",
                to: "50%"
              },
              {
                key: "translate",
                from: `-100% ${ty}`,
                to: `-50% ${ty}`
              }
            ]
          }
        ];
      }
    } else if (transition2.direction === "TOP") {
      if (overlayPositionType2 === "BOTTOM_LEFT" || overlayPositionType2 === "BOTTOM_RIGHT" || overlayPositionType2 === "BOTTOM_CENTER") {
        const tx = overlayPositionType2 === "BOTTOM_CENTER" ? "-50%" : "0px";
        return [
          {
            eltId,
            props: [
              {
                key: "translate",
                from: `${tx} 100%`,
                to: `${tx} 0px`
              }
            ]
          }
        ];
      } else if (overlayPositionType2 === "TOP_LEFT" || overlayPositionType2 === "TOP_RIGHT" || overlayPositionType2 === "TOP_CENTER") {
        return [
          {
            eltId,
            props: [
              {
                key: "top",
                from: "100%",
                to: "0px"
              }
            ]
          }
        ];
      } else {
        return [
          {
            eltId,
            props: [
              {
                key: "top",
                from: "100%",
                to: "50%"
              },
              {
                key: "translate",
                from: `-50% 0%`,
                to: `-50% -50%`
              }
            ]
          }
        ];
      }
    } else if (transition2.direction === "BOTTOM") {
      if (overlayPositionType2 === "BOTTOM_LEFT" || overlayPositionType2 === "BOTTOM_RIGHT" || overlayPositionType2 === "BOTTOM_CENTER") {
        return [
          {
            eltId,
            props: [
              {
                key: "bottom",
                from: "100%",
                to: "0px"
              }
            ]
          }
        ];
      } else if (overlayPositionType2 === "TOP_LEFT" || overlayPositionType2 === "TOP_RIGHT" || overlayPositionType2 === "TOP_CENTER") {
        const tx = overlayPositionType2 === "TOP_CENTER" ? "-50%" : "0px";
        return [
          {
            eltId,
            props: [
              {
                key: "translate",
                from: `${tx} -100%`,
                to: `${tx} 0px`
              }
            ]
          }
        ];
      } else {
        return [
          {
            eltId,
            props: [
              {
                key: "top",
                from: "0px",
                to: "50%"
              },
              {
                key: "translate",
                from: `-50% -100%`,
                to: `-50% -50%`
              }
            ]
          }
        ];
      }
    } else {
      console.warn("Unsupported transition:", transition2);
    }
    return [];
  }

  // src/runtime/dragScroll.ts
  var scrolling = null;
  var lastX;
  var lastY;
  onConnected(".dragScroll", (el) => {
    const handler = (e) => {
      if (document.elementFromPoint(e.clientX, e.clientY) !== el)
        return;
      scrolling = el;
      ({ clientX: lastX, clientY: lastY } = e);
      e.preventDefault();
    };
    el.addEventListener("mousedown", handler);
    return () => el.removeEventListener("mousedown", handler);
  });
  window.addEventListener("mousemove", (e) => {
    if (!scrolling)
      return;
    const scroller = scrolling === document.body ? document.documentElement : scrolling;
    const [deltaX, deltaY] = [lastX - e.clientX, lastY - e.clientY];
    scroller.scrollLeft += deltaX;
    scroller.scrollTop += deltaY;
    [lastX, lastY] = [e.clientX, e.clientY];
  });
  window.addEventListener("mouseup", () => scrolling = null);

  // src/runtime_embed.ts
  var allReactions = () => window.F2W_REACTIONS;
  var allVariables = () => window.F2W_VARIABLES;
  var collectionModeBps = () => window.F2W_COLLECTION_MODE_BPS;
  var getColModes = (col) => {
    var _a, _b;
    return (_b = (_a = window.F2W_COLLECTION_VARS) == null ? void 0 : _a[col]) != null ? _b : {};
  };
  var getColVariables = (col, mode) => getColModes(col)[mode];
  function setVariable(id, value) {
    allVariables()[id] = value;
    const str = valueToString(value);
    document.body.style.setProperty(id, str);
    const attr = `data${id.slice(1)}`;
    if (document.body.hasAttribute(attr)) {
      document.body.setAttribute(attr, str);
    }
    document.dispatchEvent(
      new CustomEvent("f2w-set-variable", {
        detail: { id, value, str }
      })
    );
  }
  function setCollectionAttrAndVariables(colName, modeName) {
    var _a;
    document.body.setAttribute(`data-${colName}`, modeName);
    const vars = (_a = getColVariables(colName, modeName)) != null ? _a : {};
    for (const [id, value] of Object.entries(vars)) {
      setVariable(id, value);
    }
  }
  function setVariableMode(name, modeName) {
    setCollectionAttrAndVariables(name, modeName);
    saveMode(name, modeName);
  }
  function saveMode(name, modeName) {
    var _a, _b;
    if ((_a = window.F2W_COLOR_SCHEMES) == null ? void 0 : _a.includes(name)) {
      localStorage == null ? void 0 : localStorage.setItem(COLOR_SCHEME_KEY, modeName);
    } else if ((_b = window.F2W_LANGUAGES) == null ? void 0 : _b.includes(name)) {
      localStorage == null ? void 0 : localStorage.setItem(LANG_KEY, modeName);
      const alternate = Array.from(
        document.head.querySelectorAll('link[rel="alternate"]')
      ).find((it) => it.hreflang === modeName);
      if (alternate) {
        history.replaceState(null, "", new URL(alternate.href).pathname);
      }
    }
  }
  function toFloat(v) {
    if (typeof v === "number")
      return v;
    if (typeof v === "boolean")
      return v ? 1 : 0;
    if (typeof v === "string")
      return parseFloat(v);
    return 0;
  }
  function toString(v) {
    return String(v);
  }
  function toBoolean(v) {
    if (typeof v === "string")
      return v === "true";
    return !!v;
  }
  function resolve(value, rootId) {
    var _a, _b;
    if (value === void 0)
      return false;
    if (isAlias(value)) {
      return resolve(allVariables()[value.id]);
    }
    if (typeof value === "object" && "expressionArguments" in value) {
      const args = value.expressionArguments.map((it) => it.value).filter((it) => it !== void 0).map((it) => resolve(it, rootId));
      const resolvedType = (_b = (_a = value.expressionArguments[0]) == null ? void 0 : _a.resolvedType) != null ? _b : "STRING";
      switch (value.expressionFunction) {
        case "ADDITION":
          return resolvedType === "FLOAT" ? args.map(toFloat).reduce((a, b) => a + b) : args.map(toString).reduce((a, b) => a + b);
        case "SUBTRACTION":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) - toFloat(args[1]);
        case "DIVISION":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) / toFloat(args[1]);
        case "MULTIPLICATION":
          return args.map(toFloat).reduce((a, b) => a * b);
        case "NEGATE":
          if (args.length !== 1)
            throw new Error("Invalid expression");
          return -toFloat(args[0]);
        case "GREATER_THAN":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) > toFloat(args[1]);
        case "GREATER_THAN_OR_EQUAL":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) >= toFloat(args[1]);
        case "LESS_THAN":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) < toFloat(args[1]);
        case "LESS_THAN_OR_EQUAL":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toFloat(args[0]) <= toFloat(args[1]);
        case "EQUALS":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return resolvedType === "FLOAT" ? toFloat(args[0]) === toFloat(args[1]) : resolvedType === "BOOLEAN" ? toBoolean(args[0]) === toBoolean(args[1]) : toString(args[0]) === toString(args[1]);
        case "NOT_EQUAL":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return resolvedType === "FLOAT" ? toFloat(args[0]) !== toFloat(args[1]) : resolvedType === "BOOLEAN" ? toBoolean(args[0]) !== toBoolean(args[1]) : toString(args[0]) !== toString(args[1]);
        case "AND":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toBoolean(args[0]) && toBoolean(args[1]);
        case "OR":
          if (args.length !== 2)
            throw new Error("Invalid expression");
          return toBoolean(args[0]) || toBoolean(args[1]);
        case "NOT":
          if (args.length !== 1)
            throw new Error("Invalid expression");
          return !toBoolean(args[0]);
        case "VAR_MODE_LOOKUP":
        default:
          console.warn(
            `Expression not implemented yet: ${value.expressionFunction}`
          );
          return false;
      }
    } else {
      return value;
    }
  }
  function actionsToRun(actions, bound2, trigger2) {
    const runs = actions.map((it) => toRunWithDragCleanup(it, bound2, trigger2));
    return (e, i) => {
      const reverts = runs.map((it) => it(e, i)).filter((it) => !!it);
      if (reverts.length)
        return (e2, i2) => reverts.forEach((it) => it(e2, i2));
    };
  }
  function toRunWithDragCleanup(action2, bound2, trigger2) {
    while (action2.type === "ALIAS") {
      action2 = allReactions()[action2.alias];
    }
    const run2 = toRun(action2, bound2, trigger2);
    return (e) => {
      if (action2.type !== "ANIMATE" && trigger2 === "drag") {
        const d = e.detail;
        if (!d.handled) {
          d.handled = true;
          return run2(e);
        }
      }
      if (drag_started)
        return;
      if (action2.type === "ANIMATE" && action2.rootId) {
        const root = document.getElementById(action2.rootId);
        if (root == null ? void 0 : root.parentElement) {
          const revert = once2(run2(e));
          if (revert) {
            let el = root == null ? void 0 : root.parentElement;
            while (el) {
              (el.f2w_reset || (el.f2w_reset = [])).push(revert);
              el = el.parentElement;
              if ((el == null ? void 0 : el.tagName) === "BODY")
                break;
            }
          }
          return revert;
        }
      }
      return run2(e);
    };
  }
  function toRun(action, bound, trigger) {
    var _a, _b;
    switch (action.type) {
      case "BACK":
        return () => {
          var _a2;
          return ((_a2 = window.F2W_PREVIEW_BACK) != null ? _a2 : history.back)();
        };
      case "JS":
        return () => eval(action.code);
      case "URL":
        return () => {
          if (action.openInNewTab) {
            window.open(action.url, "_blank");
          } else {
            window.F2W_PREVIEW_NAVIGATE ? window.F2W_PREVIEW_NAVIGATE(action.url) : location.assign(action.url);
          }
        };
      case "SET_VARIABLE":
        const { variableId, variableValue } = action;
        if (variableId && (variableValue == null ? void 0 : variableValue.value) !== void 0)
          return () => setVariable(variableId, resolve(variableValue.value, variableId));
        break;
      case "SET_VARIABLE_MODE":
        const { variableCollectionName, variableModeName } = action;
        if (variableCollectionName && variableModeName)
          return () => setVariableMode(variableCollectionName, variableModeName);
        break;
      case "CONDITIONAL":
        const blocks = action.conditionalBlocks.map((v) => {
          const run2 = actionsToRun(v.actions, bound, trigger);
          const { condition } = v;
          const test = condition ? () => toBoolean(resolve(condition.value)) : () => true;
          return { test, run: run2 };
        });
        return () => {
          const reverts = [];
          for (const block of blocks) {
            if (block.test()) {
              const revert = block.run();
              if (revert)
                reverts.push(revert);
              break;
            }
          }
          if (reverts.length)
            return (e) => reverts.forEach((it) => it(e));
        };
      case "KEY_CONDITION":
        const run = actionsToRun(action.actions, bound, trigger);
        const keyCode = action.keyCodes[0];
        const shiftKey = action.keyCodes.slice(1).includes(16);
        const ctrlKey = action.keyCodes.slice(1).includes(17);
        const altKey = action.keyCodes.slice(1).includes(18);
        const metaKey = action.keyCodes.slice(1).includes(91);
        return (e) => {
          if (e instanceof KeyboardEvent) {
            if (e.keyCode !== keyCode)
              return;
            if (e.ctrlKey !== ctrlKey)
              return;
            if (e.altKey !== altKey)
              return;
            if (e.metaKey !== metaKey)
              return;
            if (e.shiftKey !== shiftKey)
              return;
            e.preventDefault();
            e.stopPropagation();
            run(e);
          }
        };
      case "CLOSE_OVERLAY": {
        if (action.self)
          return (e) => {
            var _a2, _b2;
            return (_b2 = (_a2 = e == null ? void 0 : e.target) == null ? void 0 : _a2.f2w_close) == null ? void 0 : _b2.call(_a2);
          };
        if (action.overlayId) {
          const overlay2 = document.getElementById(action.overlayId);
          if (!overlay2)
            break;
          return () => {
            var _a2;
            return (_a2 = overlay2.f2w_close) == null ? void 0 : _a2.call(overlay2);
          };
        }
        break;
      }
      case "SCROLL_TO":
        if (!action.destinationId)
          break;
        const elt = document.getElementById(action.destinationId);
        if (!elt)
          break;
        return (e) => {
          var _a2;
          if ((e == null ? void 0 : e.currentTarget) instanceof HTMLAnchorElement)
            e == null ? void 0 : e.preventDefault();
          elt.scrollIntoView({
            behavior: ((_a2 = action.transition) == null ? void 0 : _a2.type) ? "smooth" : "instant"
          });
        };
      case "OVERLAY":
        if (!action.destinationId)
          break;
        const overlay = document.getElementById(action.destinationId);
        if (!overlay)
          break;
        const modal = Array(...overlay.children).find(
          (it) => it.tagName !== "TEMPLATE"
        );
        if (!modal)
          break;
        const { transition, overlayPositionType, overlayRelativePosition } = action;
        const duration = Math.round(1e3 * ((_a = transition == null ? void 0 : transition.duration) != null ? _a : 0));
        const animations = [
          {
            eltId: action.destinationId,
            props: [
              { key: "visibility", from: "hidden", to: "visible" },
              { key: "opacity", from: "0", to: "1" }
            ]
          }
        ];
        if (overlayPositionType === "MANUAL") {
          return () => {
            var _a2, _b2, _c;
            if (trigger === "hover") {
              const leave = (_a2 = bound.f2w_mouseleave_remove) == null ? void 0 : _a2.call(bound);
              if (leave) {
                const mousemove = (event) => {
                  if (isOutside(event, bound) && isOutside(event, modal)) {
                    leave();
                    document.removeEventListener("mousemove", mousemove);
                  }
                };
                document.addEventListener("mousemove", mousemove);
              }
            }
            const dynamic_animations = animations.slice(0);
            const manualLeft = toPx(
              bound.getBoundingClientRect().left + ((_b2 = overlayRelativePosition == null ? void 0 : overlayRelativePosition.x) != null ? _b2 : 0)
            );
            const manualTop = toPx(
              bound.getBoundingClientRect().top + ((_c = overlayRelativePosition == null ? void 0 : overlayRelativePosition.y) != null ? _c : 0)
            );
            modal.style.setProperty("left", manualLeft);
            modal.style.setProperty("top", manualTop);
            if ((transition == null ? void 0 : transition.type) === "MOVE_IN") {
              if (transition.direction === "LEFT") {
                dynamic_animations.push({
                  eltId: modal.id,
                  props: [
                    {
                      key: "left",
                      from: "100%",
                      to: manualLeft
                    }
                  ]
                });
              } else if (transition.direction === "RIGHT") {
                dynamic_animations.push({
                  eltId: modal.id,
                  props: [
                    {
                      key: "left",
                      from: "0px",
                      to: manualLeft
                    },
                    {
                      key: "translate",
                      from: "-100% 0px",
                      to: "0px 0px"
                    }
                  ]
                });
              } else if (transition.direction === "TOP") {
                dynamic_animations.push({
                  eltId: modal.id,
                  props: [
                    {
                      key: "top",
                      from: "100%",
                      to: manualTop
                    }
                  ]
                });
              } else if (transition.direction === "BOTTOM") {
                dynamic_animations.push({
                  eltId: modal.id,
                  props: [
                    {
                      key: "top",
                      from: "0px",
                      to: manualTop
                    },
                    {
                      key: "translate",
                      from: "0px -100%",
                      to: "0px 0px"
                    }
                  ]
                });
              }
            }
            return toExecutableAnimations(
              dynamic_animations,
              transition == null ? void 0 : transition.easing,
              duration,
              bound,
              trigger,
              `${trigger}(manual_overlay)`,
              overlay
            )();
          };
        }
        if ((transition == null ? void 0 : transition.type) === "MOVE_IN") {
          animations.push(
            ...getMoveInAnimations(modal.id, overlayPositionType, transition)
          );
        } else if (transition == null ? void 0 : transition.type) {
          console.warn("Unsupported transition:", transition);
        }
        return toExecutableAnimations(
          animations,
          transition == null ? void 0 : transition.easing,
          duration,
          bound,
          trigger,
          `${trigger}(overlay)`,
          overlay
        );
      case "ANIMATE": {
        const { animations: animations2, transition: transition2, rootId, reset } = action;
        const duration2 = Math.round(1e3 * ((_b = transition2 == null ? void 0 : transition2.duration) != null ? _b : 0));
        const run2 = toExecutableAnimations(
          animations2,
          transition2 == null ? void 0 : transition2.easing,
          duration2,
          bound,
          trigger,
          reset ? `${trigger}(+reset)` : trigger
        );
        return reset && rootId ? (e, i) => {
          const root = document.getElementById(rootId);
          if (root) {
            const { f2w_reset } = root;
            if (f2w_reset == null ? void 0 : f2w_reset.length) {
              delete root.f2w_reset;
              f2w_reset.reverse().forEach((it) => it(void 0, true));
            }
          }
          return run2(e, i);
        } : run2;
      }
      case "UPDATE_MEDIA_RUNTIME": {
        if (!action.destinationId)
          break;
        const elt2 = document.getElementById(action.destinationId);
        if (!elt2)
          break;
        switch (action.mediaAction) {
          case "MUTE":
            return mute(elt2);
          case "UNMUTE":
            return unMute(elt2);
          case "TOGGLE_MUTE_UNMUTE":
            return toggleMute(elt2);
          case "PLAY":
            return play(elt2);
          case "PAUSE":
            return pause(elt2);
          case "TOGGLE_PLAY_PAUSE":
            return togglePlay(elt2);
          case "SKIP_BACKWARD":
            return seekBackward(elt2, action.amountToSkip);
          case "SKIP_FORWARD":
            return seekForward(elt2, action.amountToSkip);
          case "SKIP_TO":
            return seekTo(elt2, action.newTimestamp);
        }
      }
      default:
        return () => console.warn("Action not implemented yet: " + action.type);
    }
    return () => {
    };
  }
  var overlayStackZIndex = 9999;
  function toExecutableAnimations(origAnimations, easing = "linear", duration2, bound2, trigger2, debug, modal2) {
    return (e) => {
      let animations2 = origAnimations;
      if (modal2) {
        document.body.parentElement.style.overflow = "hidden";
        animations2 = [
          {
            eltId: modal2.id,
            props: [{ key: "z-index", from: 0, to: overlayStackZIndex++ }]
          },
          ...animations2
        ];
      }
      const reverseAnimations = executeAnimations(
        animations2,
        easing,
        duration2,
        bound2,
        trigger2,
        debug,
        e
      );
      const close = once2((_, i) => {
        if (modal2) {
          overlayStackZIndex--;
          document.body.parentElement.style.overflow = "";
        }
        executeAnimations(
          reverseAnimations,
          easing,
          i ? 0 : duration2,
          bound2,
          trigger2,
          `${debug}(revert)`
        );
      });
      if (modal2)
        modal2.f2w_close = close;
      return close;
    };
  }
  function executeAnimations(animations2, easing, duration2, bound2, trigger2, debug, e) {
    var _a, _b;
    if (true) {
      console.debug(`Executing animations (${debug})`, animations2, bound2);
    }
    const reverse = [];
    const containersToReOrder = /* @__PURE__ */ new Set();
    if (trigger2 === "drag") {
      executeDragStart(
        animations2,
        easing,
        duration2,
        bound2,
        e.detail
      );
      return [];
    }
    const flipDomChanges = [];
    const flipAnimations = [];
    let needsFinalState = false;
    for (const { eltId, altId, props, reactions } of animations2) {
      let elt2 = document.getElementById(eltId);
      if (!elt2) {
        shouldNotHappen(`Can't find element for id: ${eltId}`);
        continue;
      }
      if (elt2.f2w_replaced)
        elt2 = elt2.f2w_replaced;
      if (altId) {
        let alt = document.getElementById(altId);
        if (!alt) {
          const altTpl = document.getElementById(templateId(altId));
          if (!altTpl) {
            shouldNotHappen(`Can't find template for id: ${altId}`);
            continue;
          }
          const altFragment = (_a = altTpl.content) == null ? void 0 : _a.cloneNode(
            true
          );
          alt = altFragment.querySelector("*");
        }
        const { f2w_mouseup } = elt2;
        const mouseleave = (_b = elt2.f2w_mouseleave_remove) == null ? void 0 : _b.call(elt2);
        if (mouseleave) {
          installMouseLeave(alt, mouseleave);
        }
        if (f2w_mouseup)
          alt.addEventListener("mouseup", f2w_mouseup);
        if (mouseleave || f2w_mouseup) {
          removePointerEventsNone(alt);
        }
        hook(alt, true, duration2);
        elt2.insertAdjacentElement("afterend", alt);
        elt2.f2w_replaced = alt;
        delete alt.f2w_replaced;
        const currentDisplay = getComputedStyle(elt2).display;
        flipDomChanges.push(() => {
          setPropertiesWithAnimate(elt2, {
            display: "none"
          });
          setPropertiesWithAnimate(alt, {
            display: currentDisplay
          });
        });
        flipAnimations.push(() => {
          animateProps(
            elt2,
            [
              {
                key: "display",
                from: currentDisplay,
                to: "none"
              }
            ],
            easing,
            duration2,
            containersToReOrder
          );
          animateProps(
            alt,
            [
              {
                key: "opacity",
                from: 0,
                to: "revert-layer"
              },
              {
                key: "display",
                from: "none",
                to: "revert-layer"
              }
            ],
            easing,
            duration2,
            containersToReOrder
          );
        });
        reverse.push({
          eltId: alt.id,
          altId: elt2.id
        });
        if (!isNaN(+getComputedStyle(alt).getPropertyValue("--f2w-order"))) {
          containersToReOrder.add(elt2.parentElement);
        }
      } else {
        const currentProps = (props || []).map((it) => {
          const from = mapCurrent(elt2, it.key, it.from);
          const to = mapCurrent(elt2, it.key, it.to);
          return {
            key: it.key,
            pseudo: it.pseudo,
            from,
            to
          };
        }).filter((it) => it.from !== it.to).map(withCamelKey);
        const beforeAnimationProps = currentProps.map((p) => {
          if (isAutoToCurrentProp(p.key)) {
            if (p.to === "auto") {
              needsFinalState = true;
            } else if (p.from === "auto") {
              return __spreadProps(__spreadValues({}, p), {
                from: getComputedStyle(elt2).getPropertyValue(p.key)
              });
            }
          }
          return p;
        });
        flipDomChanges.push((needsFinalState2) => {
          applyDomChanges(elt2, beforeAnimationProps, needsFinalState2);
        });
        flipAnimations.push(() => {
          var _a2;
          const afterAnimationProps = beforeAnimationProps.map((p) => {
            if (p.to === "auto" && isAutoToCurrentProp(p.key)) {
              return __spreadProps(__spreadValues({}, p), {
                to: getComputedStyle(elt2).getPropertyValue(p.key)
              });
            }
            return p;
          });
          animateProps(
            elt2,
            afterAnimationProps,
            easing,
            duration2,
            containersToReOrder
          );
          if (reactions) {
            if (trigger2 !== "hover") {
              (_a2 = elt2.f2w_mouseleave_remove) == null ? void 0 : _a2.call(elt2);
            }
            reactions.forEach((it) => hookElt(elt2, it.type, it.to, duration2));
          }
        });
        const rev = {
          eltId,
          props: currentProps.map((p) => {
            const ret = {
              key: p.key,
              from: p.to,
              to: p.from
            };
            if (p.pseudo)
              ret.pseudo = p.pseudo;
            return ret;
          })
        };
        if (reactions) {
          rev.reactions = reactions.map((it) => ({
            type: it.type,
            from: it.to,
            to: it.from
          }));
        }
        reverse.push(rev);
      }
    }
    flipDomChanges.forEach((it) => it(needsFinalState));
    flipAnimations.forEach((it) => it());
    for (const container of containersToReOrder) {
      const children = Array.from(container.children).map((it, i) => ({ it, i }));
      let orderHasChanged = false;
      children.sort((a, b) => {
        const aOrder = +(getComputedStyle(a.it).getPropertyValue("--f2w-order") || "99999");
        const bOrder = +(getComputedStyle(b.it).getPropertyValue("--f2w-order") || "99999");
        return aOrder - bOrder;
      }).forEach((child, j) => {
        if (orderHasChanged) {
          container.appendChild(child.it);
        } else {
          orderHasChanged = j !== child.i;
        }
      });
    }
    return reverse;
  }
  function removePointerEventsNone(elt2) {
    let e = elt2;
    while (e) {
      e.classList.remove("pointer-events-none");
      e = e.parentElement;
    }
  }
  function executeDragStart(animations2, easing, duration2, bound2, dragging) {
    if (dragging.handled)
      return;
    const rect1 = bound2.getBoundingClientRect();
    const rev = executeAnimations(
      animations2.filter((it) => it.props).map(({ eltId, props }) => ({ eltId, props })),
      "linear",
      0,
      bound2,
      "click",
      `drag_start(tmp)`
    );
    const rect2 = bound2.getBoundingClientRect();
    const diffX = rect2.left - rect1.left;
    const diffY = rect2.top - rect1.top;
    const length = Math.sqrt(diffX * diffX + diffY * diffY);
    executeAnimations(rev, "linear", 0, bound2, "click", `drag_start(tmp undo)`);
    const { x: distX, y: distY } = getDistance(dragging.start, dragging.end);
    const acceptsDragDirection = distX > 0 && diffX > 0 || distX < 0 && diffX < 0 || diffX === 0 && (distY > 0 && diffY > 0 || distY < 0 && diffY < 0);
    if (acceptsDragDirection) {
      dragging.handled = true;
      const dragAnims = animations2.map((it) => {
        var _a;
        return __spreadProps(__spreadValues({}, it), {
          swapped: false,
          props: (_a = it.props) == null ? void 0 : _a.map((p) => __spreadProps(__spreadValues({}, p), { curr: p.from }))
        });
      });
      const getPercent = (d) => {
        const { x: distX2, y: distY2 } = getDistance(d.start, d.end);
        const dist = (distX2 * diffX + distY2 * diffY) / length;
        return Math.max(0, Math.min(100, 100 * dist / length));
      };
      const move = (d) => {
        d.end.preventDefault();
        d.end.stopPropagation();
        const percent = getPercent(d);
        executeAnimations(
          filterEmpty(
            dragAnims.map((it) => {
              const _a = it, { reactions: _ } = _a, rest = __objRest(_a, ["reactions"]);
              if (it.props) {
                return __spreadProps(__spreadValues({}, rest), {
                  props: it.props.map((p) => {
                    const to = interpolate(p, percent);
                    const from = p.curr;
                    p.curr = to;
                    return __spreadProps(__spreadValues({}, p), {
                      from,
                      to
                    });
                  })
                });
              }
              if (it.altId) {
                if (percent < 50 && it.swapped) {
                  it.swapped = false;
                  return { altId: it.eltId, eltId: it.altId };
                }
                if (percent >= 50 && !it.swapped) {
                  it.swapped = true;
                  return rest;
                }
              }
              return void 0;
            })
          ),
          "linear",
          0,
          bound2,
          "click",
          `dragging`
        );
      };
      move(dragging);
      bound2.f2w_drag_listener = (d) => {
        move(d);
        if (d.finished) {
          const percent = getPercent(d);
          executeAnimations(
            filterEmpty(
              dragAnims.map((it) => {
                if (it.props) {
                  const reactions = percent < 50 ? void 0 : it.reactions;
                  return {
                    eltId: it.eltId,
                    props: it.props.map((p) => __spreadProps(__spreadValues({}, p), {
                      from: p.curr,
                      to: percent < 50 ? p.from : p.to
                    })),
                    reactions
                  };
                }
                if (it.altId) {
                  if (percent < 50 && it.swapped) {
                    it.swapped = false;
                    return { altId: it.eltId, eltId: it.altId };
                  }
                  if (percent >= 50 && !it.swapped) {
                    it.swapped = true;
                    return it;
                  }
                }
                return void 0;
              })
            ),
            easing,
            duration2,
            bound2,
            "click",
            `drag_end`
          );
        }
      };
    }
  }
  function mapCurrent(elt2, key, v) {
    if (v !== "$current")
      return v;
    return getComputedStyle(elt2).getPropertyValue(key);
  }
  function hook(root, withRoot = false, fromAnimationDuration = 0) {
    for (const type of reaction_types) {
      for (const elt2 of querySelectorAllExt(
        root,
        `[data-reaction-${type}]`,
        withRoot
      )) {
        hookElt(
          elt2,
          type,
          elt2.getAttribute(`data-reaction-${type}`),
          fromAnimationDuration
        );
      }
    }
  }
  function querySelectorAllExt(root, sel, includeRoot = false) {
    const ret = [...root.querySelectorAll(sel)];
    if (includeRoot && root.matches(sel)) {
      ret.unshift(root);
    }
    return ret;
  }
  function hookElt(elt2, type, v = "", fromAnimationDuration = 0) {
    var _a;
    if (!v) {
      if (type !== "hover") {
        if (true) {
          console.debug(`Cleanup hooks ${type} on`, elt2);
        }
        cleanupEventListener(elt2, type);
        return;
      }
    }
    let delay = 0;
    if (v[0] === "T") {
      const idx = v.indexOf("ms");
      delay = parseFloat(v.slice(1, idx)) || 0;
      v = v.slice(idx + 3);
    }
    const reactions = allReactions();
    const actions = filterEmpty(v.split(",").map((id) => reactions[id]));
    if (true) {
      console.debug(`Setup hook ${type} on`, elt2, `->`, actions);
    }
    const run2 = actionsToRun(actions, elt2, type);
    if (type === "timeout") {
      setTimeoutWithCleanup(elt2, () => run2(), delay + fromAnimationDuration);
      return;
    }
    removePointerEventsNone(elt2);
    if (type === "press") {
      let revert = void 0;
      const mouseup = () => {
        revert == null ? void 0 : revert();
        revert = void 0;
      };
      elt2.f2w_mouseup = mouseup;
      addEventListenerWithCleanup(
        elt2,
        "mousedown",
        (e) => {
          revert == null ? void 0 : revert();
          revert = run2(e);
        },
        type,
        attachListener(elt2, "mouseup", mouseup)
      );
    } else if (type === "drag") {
      addEventListenerWithCleanup(
        elt2,
        "dragging",
        (e) => {
          run2(e);
        },
        type
      );
    } else if (type === "hover") {
      let revert = void 0;
      const runIfNotAlready = (e) => {
        if (!revert)
          revert = once2(run2(e));
      };
      const prev = (_a = elt2.f2w_mouseleave_remove) == null ? void 0 : _a.call(elt2);
      const mouseleave = () => {
        revert == null ? void 0 : revert();
        revert = void 0;
        prev == null ? void 0 : prev();
      };
      const timerId = setTimeout(() => {
        if (elt2.matches(":hover")) {
          if (!revert) {
            console.log(`Forcing hover on timeout`);
          }
          runIfNotAlready();
        }
      }, fromAnimationDuration);
      const mouseleave_remove = installMouseLeave(elt2, mouseleave, timerId);
      addEventListenerWithCleanup(
        elt2,
        "mouseenter",
        runIfNotAlready,
        type,
        mouseleave_remove
      );
    } else if (type === "submit") {
      const form = elt2.closest("form");
      if (form) {
        addEventListenerWithCleanup(elt2, type, run2, type);
        addEventListenerWithCleanup(
          form,
          type,
          (e) => {
            e.preventDefault();
            elt2.toggleAttribute("disabled", true);
            fetch(form.action, { method: form.method, body: new FormData(form) }).then((r) => r.ok && elt2.dispatchEvent(e)).finally(() => elt2.toggleAttribute("disabled", false));
          },
          type
        );
      }
    } else {
      if (type === "keydown" && !elt2.getAttribute("tabindex")) {
        elt2.setAttribute("tabindex", "-1");
      }
      if (type === "appear") {
        appearObserver.observe(elt2);
      }
      addEventListenerWithCleanup(
        elt2,
        type,
        (e) => {
          if (type !== "keydown") {
            e.stopPropagation();
          }
          if (delay)
            setTimeout(() => run2(e), delay);
          else
            run2(e);
        },
        type
      );
    }
  }
  function installMouseLeave(elt2, mouseleave, timerId = 0) {
    const unsub = attachListener(elt2, "mouseleave", mouseleave);
    const mouseleave_remove = () => {
      unsub();
      clearTimeout(timerId);
      if (elt2.f2w_mouseleave === mouseleave)
        delete elt2.f2w_mouseleave;
      if (elt2.f2w_mouseleave_remove === mouseleave_remove)
        delete elt2.f2w_mouseleave_remove;
      return mouseleave;
    };
    elt2.f2w_mouseleave = mouseleave;
    return elt2.f2w_mouseleave_remove = mouseleave_remove;
  }
  function isOutside({ clientX, clientY }, bound2) {
    const BOUNDS_XTRA_PIXELS = 2;
    const { top, left, right, bottom } = bound2.getBoundingClientRect();
    return clientX > right + BOUNDS_XTRA_PIXELS || clientX < left - BOUNDS_XTRA_PIXELS || clientY > bottom + BOUNDS_XTRA_PIXELS || clientY < top - BOUNDS_XTRA_PIXELS;
  }
  function cleanupFnKeyForType(type) {
    return `f2w_cleanup_${type}`;
  }
  function setTimeoutWithCleanup(elt2, fn, delay) {
    var _a;
    const timerId = setTimeout(fn, delay);
    (_a = elt2.f2w_cleanup_timeout) == null ? void 0 : _a.call(elt2);
    elt2.f2w_cleanup_timeout = () => {
      delete elt2.f2w_cleanup_timeout;
      clearTimeout(timerId);
    };
  }
  function cleanupEventListener(elt2, typeForCleanup) {
    var _a;
    const cleanupKey = cleanupFnKeyForType(typeForCleanup);
    (_a = elt2[cleanupKey]) == null ? void 0 : _a.call(elt2);
  }
  function addEventListenerWithCleanup(elt2, type, listener, typeForCleanup, ...extraCleanupFns) {
    var _a;
    const cleanups = [...extraCleanupFns, attachListener(elt2, type, listener)];
    const cleanupKey = cleanupFnKeyForType(typeForCleanup);
    (_a = elt2[cleanupKey]) == null ? void 0 : _a.call(elt2);
    elt2[cleanupKey] = () => {
      delete elt2[cleanupKey];
      cleanups.forEach((it) => it());
    };
  }
  function attachListener(elt2, type, listener, options) {
    const my_listener = (e) => {
      if (type !== "mousemove") {
        console.debug(
          `${elt2.isConnected ? "Handling" : "Ignoring"} ${type} on`,
          e.target
        );
      }
      if (!elt2.isConnected)
        return;
      listener(e);
    };
    elt2.addEventListener(type, my_listener, options);
    return () => {
      elt2.removeEventListener(type, my_listener, options);
    };
  }
  var COLOR_SCHEME_KEY = "f2w-color-scheme";
  var LANG_KEY = "f2w-lang";
  window.F2W_THEME_SWITCH = (theme) => {
    var _a;
    return (_a = window.F2W_COLOR_SCHEMES) == null ? void 0 : _a.forEach(
      (colName) => setCollectionAttrAndVariables(colName, theme)
    );
  };
  if (window.F2W_COLOR_SCHEMES) {
    const matchMediaQuery = matchMedia("(prefers-color-scheme: dark)").matches;
    const systemPreference = matchMediaQuery ? "dark" : "light";
    const userPreference = localStorage == null ? void 0 : localStorage.getItem(COLOR_SCHEME_KEY);
    onConnected("body", () => {
      var _a, _b;
      const previewPreference = document.body.getAttribute("data-preview-theme");
      const colorScheme = (_a = previewPreference != null ? previewPreference : userPreference) != null ? _a : systemPreference;
      (_b = window.F2W_THEME_SWITCH) == null ? void 0 : _b.call(window, colorScheme);
    });
  }
  if (window.F2W_LANGUAGES) {
    let userPreference = localStorage == null ? void 0 : localStorage.getItem(LANG_KEY);
    onConnected("body", () => {
      var _a, _b, _c;
      const alternates = Array.from(
        document.head.querySelectorAll('link[rel="alternate"]')
      );
      const isDefault = alternates.length === 0 || alternates.some(
        (it) => it.getAttribute("hreflang") === "x-default" && it.getAttribute("href") === window.location.href
      );
      if (!isDefault) {
        userPreference = document.documentElement.lang;
      }
      const is404 = (_b = (_a = document.head.querySelector('link[rel="canonical"]')) == null ? void 0 : _a.href) == null ? void 0 : _b.endsWith("/404/");
      (_c = window.F2W_LANGUAGES) == null ? void 0 : _c.forEach((colName) => {
        var _a2;
        const choices = Object.fromEntries(
          Object.entries(getColModes(colName)).map(([k]) => [k.toLowerCase(), k])
        );
        const langs = [...navigator.languages];
        if (userPreference)
          langs.unshift(userPreference);
        for (let lang of langs) {
          lang = lang.toLowerCase();
          const code = lang.split("-")[0];
          const modeValue = (_a2 = choices[lang]) != null ? _a2 : choices[code];
          if (modeValue) {
            setCollectionAttrAndVariables(colName, modeValue);
            if (!is404)
              saveMode(colName, modeValue);
            break;
          }
        }
      });
    });
  }
  var currentCollectionModes = {};
  var collectionModeBpsSorted = Object.entries(collectionModeBps()).map(
    ([collectionName, v]) => ({
      collectionName,
      breakpoints: Object.entries(v).map(([name, { minWidth }]) => ({ name, minWidth })).sort(({ minWidth: a }, { minWidth: b }) => a - b)
    })
  );
  function updateCollectionModes() {
    var _a;
    const width = ((_a = window.visualViewport) == null ? void 0 : _a.width) || window.innerWidth;
    for (const { collectionName, breakpoints } of collectionModeBpsSorted) {
      const bps = [...breakpoints];
      let newMode = bps.splice(0, 1)[0].name;
      for (const { name, minWidth } of bps) {
        if (width >= minWidth)
          newMode = name;
      }
      if (newMode !== currentCollectionModes[collectionName]) {
        setCollectionAttrAndVariables(collectionName, newMode);
        currentCollectionModes[collectionName] = newMode;
      }
    }
  }
  var drag_started = false;
  onConnected("body", () => {
    let drag_start = void 0;
    let suppress_click = false;
    attachListener(document, "mousedown", (e) => {
      drag_start = e;
      drag_started = false;
    });
    attachListener(document, "mousemove", (e) => {
      var _a, _b, _c;
      if (drag_start && getDistance(drag_start, e).dist > 2) {
        const dragging = {
          start: drag_start,
          end: e
        };
        if (!drag_started) {
          (_a = drag_start.target) == null ? void 0 : _a.dispatchEvent(
            new CustomEvent("dragging", { detail: dragging })
          );
          drag_started = true;
          suppress_click = true;
        } else {
          (_c = (_b = drag_start.target) == null ? void 0 : _b.f2w_drag_listener) == null ? void 0 : _c.call(_b, dragging);
        }
      }
    });
    attachListener(document, "mouseup", (e) => {
      var _a, _b;
      if (drag_start && drag_started) {
        (_b = (_a = drag_start.target) == null ? void 0 : _a.f2w_drag_listener) == null ? void 0 : _b.call(_a, {
          start: drag_start,
          end: e,
          finished: true
        });
      }
      drag_start = void 0;
      drag_started = false;
    });
    attachListener(document, "mouseup", (e) => {
      var _a, _b;
      if (drag_start && drag_started) {
        (_b = (_a = drag_start.target) == null ? void 0 : _a.f2w_drag_listener) == null ? void 0 : _b.call(_a, {
          start: drag_start,
          end: e,
          finished: true
        });
      }
      drag_start = void 0;
      drag_started = false;
    });
    attachListener(
      document,
      "click",
      (e) => {
        if (suppress_click) {
          suppress_click = false;
          e.preventDefault();
          e.stopPropagation();
        }
      },
      { capture: true }
    );
    updateCollectionModes();
    window.addEventListener("resize", updateCollectionModes);
  });
  addEventListener("DOMContentLoaded", () => hook(document));
  addEventListener("DOMContentLoaded", () => {
    if ("mediumZoom" in window) {
      const zoom = mediumZoom("[data-zoomable]");
      zoom.on("open", (event) => {
        const objectFit = getComputedStyle(event.target).objectFit;
        const zoomed = event.detail.zoom.getZoomedImage();
        if (objectFit && zoomed)
          zoomed.style.objectFit = objectFit;
      });
      zoom.on("closed", (event) => {
        const zoomed = event.detail.zoom.getZoomedImage();
        zoomed.style.objectFit = "";
      });
    }
  });
  function isCalcable(value) {
    return value.endsWith("px") || value.endsWith("%") || value.startsWith("calc");
  }
  function unCalc(value) {
    return value.startsWith("calc") ? value.slice(4) : value;
  }
  function interpolate({ from, to }, percent) {
    if (from === to)
      return to;
    if (typeof from === "number" && typeof to === "number") {
      return from + (to - from) * (percent / 100);
    }
    if (typeof from === "string" && typeof to === "string") {
      if (from === "none" || to === "none")
        return percent < 50 ? from : to;
      if (from === "auto" || to === "auto")
        return percent < 50 ? from : to;
      if (from.endsWith("px") && to.endsWith("px")) {
        const fromPx = parseFloat(from);
        const toP = parseFloat(to);
        return toPx(fromPx + (toP - fromPx) * (percent / 100));
      }
      if (from.endsWith("%") && to.endsWith("%")) {
        const fromPx = parseFloat(from);
        const toP = parseFloat(to);
        return toPercent(fromPx + (toP - fromPx) * (percent / 100));
      }
      if (isCalcable(from) && isCalcable(to)) {
        const fromCalc = unCalc(from);
        const toCalc = unCalc(to);
        return `calc(${fromCalc} + (${toCalc} - ${fromCalc}) * ${percent / 100})`;
      }
      if (from.startsWith("rgb") && to.startsWith("rgb")) {
        const fromColor = from.match(/\d+/g).map(Number);
        const toColor = to.match(/\d+/g).map(Number);
        const color = fromColor.map(
          (from2, i) => from2 + (toColor[i] - from2) * (percent / 100)
        );
        return `rgb(${color.join(",")})`;
      }
    }
    return percent < 50 ? from : to;
  }
  function getDistance(start, end) {
    const x = end.clientX - start.clientX;
    const y = end.clientY - start.clientY;
    return { x, y, dist: Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) };
  }
  onConnected("[data-bound-characters]", (e) => {
    const handler = () => {
      const id = e.getAttribute("data-bound-characters");
      const characters = toString(resolve(allVariables()[id]));
      if ("placeholder" in e) {
        if (characters !== e.placeholder)
          e.placeholder = characters;
      } else if (characters !== e.textContent)
        e.textContent = characters;
    };
    handler();
    document.addEventListener("f2w-set-variable", handler);
    return () => document.removeEventListener("f2w-set-variable", handler);
  });
  onConnected("[data-bound-visible]", (e) => {
    const handler = () => {
      const id = e.getAttribute("data-bound-visible");
      const visible = toString(resolve(allVariables()[id]));
      if (visible !== void 0)
        e.setAttribute("data-visible", visible);
    };
    handler();
    document.addEventListener("f2w-set-variable", handler);
    return () => document.removeEventListener("f2w-set-variable", handler);
  });
  var appearObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          entry.target.dispatchEvent(new CustomEvent("appear"));
        }
      });
    },
    { threshold: 0.1 }
  );
  addEventListener("load", () => {
    const hashIdPrefix = window.location.hash.slice(1);
    const hashRE = new RegExp(hashIdPrefix + "(_\\d+)?$");
    for (const e of document.querySelectorAll(`[id^="${hashIdPrefix}"]`))
      if (hashRE.test(e.id) && e.getBoundingClientRect().height > 0)
        return e.scrollIntoView();
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vdXRpbHMvc3JjL251bWJlcnMudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JnYi1oZXhANC4wLjEvbm9kZV9tb2R1bGVzL3JnYi1oZXgvaW5kZXguanMiLCAiLi4vdXRpbHMvc3JjL2FycmF5LnRzIiwgIi4uL3V0aWxzL3NyYy9hc3NlcnQudHMiLCAiLi4vZmlnbWEtdG8taHRtbC9zcmMvdmFyaWFibGVzLnRzIiwgIi4uL3V0aWxzL3NyYy9hbmFseXRpY3MvaW5kZXgudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BjcmVhdGUtZmlnbWEtcGx1Z2luK3V0aWxpdGllc0AyLjMuMF9wYXRjaF9oYXNoPW41MzZpa3RkZXdndTd2NWJ5eHV4ZG9qdmZxL25vZGVfbW9kdWxlcy9AY3JlYXRlLWZpZ21hLXBsdWdpbi91dGlsaXRpZXMvc3JjL2V2ZW50cy50cyIsICIuLi9maWdtYS1wbHVnaW4tY29yZS12Mi9zcmMvZXZlbnRzLnRzIiwgIi4uL2ZpZ21hLXBsdWdpbi1jb3JlLXYyL3NyYy9jb2RlL3BsdWdpbkRhdGEudHMiLCAiLi4vZmlnbWEtdG8taHRtbC9zcmMvaGVscGVycy50cyIsICIuLi9maWdtYS10by1odG1sL3NyYy9tYXBwaW5nL3RyaWdnZXJzLnRzIiwgIi4uL3V0aWxzL3NyYy9mdW5jdGlvbnMudHMiLCAic3JjL2xpZmVjeWNsZS50cyIsICIuLi9maWdtYS10by1odG1sL3NyYy9tYXBwaW5nL3V0aWxzLnRzIiwgInNyYy9ydW50aW1lL3ZpZGVvcy50cyIsICIuLi91dGlscy9zcmMvbmF2aWdhdG9yLnRzIiwgIi4uL3V0aWxzL3NyYy9zdHlsZXMvaW5kZXgudHMiLCAic3JjL3J1bnRpbWUvYW5pbWF0b3IudHMiLCAic3JjL3J1bnRpbWUvYW5pbWF0aW9ucy50cyIsICJzcmMvcnVudGltZS9kcmFnU2Nyb2xsLnRzIiwgInNyYy9ydW50aW1lX2VtYmVkLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgZnVuY3Rpb24gcm91bmRUbyh2OiBudW1iZXIsIGZhY3RvcjogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGgucm91bmQodiAqIGZhY3RvcikgLyBmYWN0b3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlcXVhbHNFcHNpbG9uKGE6IG51bWJlciwgYjogbnVtYmVyLCBlcHM6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpIDwgZXBzO1xufVxuIiwgImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJnYkhleChyZWQsIGdyZWVuLCBibHVlLCBhbHBoYSkge1xuXHRjb25zdCBpc1BlcmNlbnQgPSAocmVkICsgKGFscGhhIHx8ICcnKSkudG9TdHJpbmcoKS5pbmNsdWRlcygnJScpO1xuXG5cdGlmICh0eXBlb2YgcmVkID09PSAnc3RyaW5nJykge1xuXHRcdFtyZWQsIGdyZWVuLCBibHVlLCBhbHBoYV0gPSByZWQubWF0Y2goLygwP1xcLj9cXGQrKSU/XFxiL2cpLm1hcChjb21wb25lbnQgPT4gTnVtYmVyKGNvbXBvbmVudCkpO1xuXHR9IGVsc2UgaWYgKGFscGhhICE9PSB1bmRlZmluZWQpIHtcblx0XHRhbHBoYSA9IE51bWJlci5wYXJzZUZsb2F0KGFscGhhKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgcmVkICE9PSAnbnVtYmVyJyB8fFxuXHRcdHR5cGVvZiBncmVlbiAhPT0gJ251bWJlcicgfHxcblx0XHR0eXBlb2YgYmx1ZSAhPT0gJ251bWJlcicgfHxcblx0XHRyZWQgPiAyNTUgfHxcblx0XHRncmVlbiA+IDI1NSB8fFxuXHRcdGJsdWUgPiAyNTVcblx0KSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgdGhyZWUgbnVtYmVycyBiZWxvdyAyNTYnKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgYWxwaGEgPT09ICdudW1iZXInKSB7XG5cdFx0aWYgKCFpc1BlcmNlbnQgJiYgYWxwaGEgPj0gMCAmJiBhbHBoYSA8PSAxKSB7XG5cdFx0XHRhbHBoYSA9IE1hdGgucm91bmQoMjU1ICogYWxwaGEpO1xuXHRcdH0gZWxzZSBpZiAoaXNQZXJjZW50ICYmIGFscGhhID49IDAgJiYgYWxwaGEgPD0gMTAwKSB7XG5cdFx0XHRhbHBoYSA9IE1hdGgucm91bmQoMjU1ICogYWxwaGEgLyAxMDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBFeHBlY3RlZCBhbHBoYSB2YWx1ZSAoJHthbHBoYX0pIGFzIGEgZnJhY3Rpb24gb3IgcGVyY2VudGFnZWApO1xuXHRcdH1cblxuXHRcdGFscGhhID0gKGFscGhhIHwgMSA8PCA4KS50b1N0cmluZygxNikuc2xpY2UoMSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbWl4ZWQtb3BlcmF0b3JzXG5cdH0gZWxzZSB7XG5cdFx0YWxwaGEgPSAnJztcblx0fVxuXG5cdC8vIFRPRE86IFJlbW92ZSB0aGlzIGlnbm9yZSBjb21tZW50LlxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbWl4ZWQtb3BlcmF0b3JzXG5cdHJldHVybiAoKGJsdWUgfCBncmVlbiA8PCA4IHwgcmVkIDw8IDE2KSB8IDEgPDwgMjQpLnRvU3RyaW5nKDE2KS5zbGljZSgxKSArIGFscGhhO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiB1bmlxdWVPck51bGw8VD4oYXJyOiBUW10pOiBUIHwgdW5kZWZpbmVkIHtcbiAgaWYgKGFyci5sZW5ndGgpIHtcbiAgICBjb25zdCBiYXNlID0gYXJyWzBdO1xuICAgIHJldHVybiBhcnIuc2xpY2UoMSkuZXZlcnkoKGl0KSA9PiBpdCA9PT0gYmFzZSkgPyBiYXNlIDogdW5kZWZpbmVkO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJFbXB0eTxUPihhcnI6IChUIHwgdW5kZWZpbmVkIHwgbnVsbCB8IHZvaWQpW10pOiBUW10ge1xuICByZXR1cm4gYXJyLmZpbHRlcihub3RFbXB0eSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3RFbXB0eTxUVmFsdWU+KFxuICB2YWx1ZTogVFZhbHVlIHwgbnVsbCB8IHVuZGVmaW5lZCB8IHZvaWRcbik6IHZhbHVlIGlzIFRWYWx1ZSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xufVxuXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNDMwNTM4MDMvNjE1OTAzXG5leHBvcnQgZnVuY3Rpb24gY2FydGVzaWFuPFQ+KG9wdGlvbnM6IFRbXVtdKTogVFtdW10ge1xuICByZXR1cm4gKG9wdGlvbnMgYXMgYW55KS5yZWR1Y2UoXG4gICAgKGE6IGFueSwgYjogYW55KSA9PiBhLmZsYXRNYXAoKGQ6IGFueSkgPT4gYi5tYXAoKGU6IGFueSkgPT4gWy4uLmQsIGVdKSksXG4gICAgW1tdXVxuICApIGFzIFRbXVtdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUVudHJpZXNNdWx0aTxUPihsaXN0OiBbc3RyaW5nLCBUXVtdKTogUmVjb3JkPHN0cmluZywgVFtdPiB7XG4gIGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgVFtdPiA9IHt9O1xuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBsaXN0KSB7XG4gICAgaWYgKCEoayBpbiByZXN1bHQpKSByZXN1bHRba10gPSBbXTtcbiAgICByZXN1bHRba10ucHVzaCh2KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW50cmllc1RvTXVsdGlNYXA8SywgVj4obGlzdDogW0ssIFZdW10pOiBNYXA8SywgVltdPiB7XG4gIGNvbnN0IHJlc3VsdCA9IG5ldyBNYXA8SywgVltdPigpO1xuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBsaXN0KSB7XG4gICAgY29uc3QgYXJyID0gcmVzdWx0LmdldChrKTtcbiAgICBpZiAoYXJyKSBhcnIucHVzaCh2KTtcbiAgICBlbHNlIHJlc3VsdC5zZXQoaywgW3ZdKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVkdXBlPFQ+KGFycjogVFtdKTogVFtdIHtcbiAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChhcnIpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlZHVwZUl0ZXJhYmxlPFQ+KGFycjogVFtdKTogSXRlcmFibGU8VD4ge1xuICByZXR1cm4gbmV3IFNldChhcnIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVkdXBlZEtleXMoXG4gIGE6IG9iamVjdCB8IHVuZGVmaW5lZCxcbiAgYjogb2JqZWN0IHwgdW5kZWZpbmVkXG4pOiBJdGVyYWJsZTxzdHJpbmc+IHtcbiAgaWYgKCFhKSB7XG4gICAgaWYgKCFiKSByZXR1cm4gW107XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGIpO1xuICB9XG4gIGlmICghYikgcmV0dXJuIE9iamVjdC5rZXlzKGEpO1xuICByZXR1cm4gZGVkdXBlSXRlcmFibGUoWy4uLk9iamVjdC5rZXlzKGEpLCAuLi5PYmplY3Qua2V5cyhiKV0pO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBzaG91bGROb3RIYXBwZW4odHh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc29sZS53YXJuKHR4dCk7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGRlYnVnZ2VyO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG91bGROb3RIYXBwZW5FcnJvcih0eHQ6IHN0cmluZyk6IEVycm9yIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgY29uc29sZS5lcnJvcih0eHQpO1xuICAgIGRlYnVnZ2VyO1xuICB9XG4gIHJldHVybiBuZXcgRXJyb3IodHh0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFRoYXQoY2hlY2s6ICgpID0+IGJvb2xlYW4sIHR4dDogc3RyaW5nKTogdm9pZCB7XG4gIGlmICghY2hlY2soKSkge1xuICAgIHNob3VsZE5vdEhhcHBlbih0eHQpO1xuICB9XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dCB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgcnVubmluZ0luUGx1Z2luQ29kZSB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS11dGlscy91dGlscyc7XG5pbXBvcnQgeyBLZXllZEVycm9yIH0gZnJvbSAnLi93YXJuaW5ncyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRWYXJpYWJsZUJ5SWRBc3luYyhcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dCB8IHVuZGVmaW5lZCxcbiAgaWQ6IHN0cmluZ1xuKTogUHJvbWlzZTxWYXJpYWJsZSB8IHVuZGVmaW5lZD4ge1xuICBpZiAoIXJ1bm5pbmdJblBsdWdpbkNvZGUpIHJldHVybjtcbiAgY29uc3QgdiA9IGF3YWl0IGZpZ21hLnZhcmlhYmxlcy5nZXRWYXJpYWJsZUJ5SWRBc3luYyhpZCk7XG4gIGlmICghdikgdGhyb3cgbmV3IEtleWVkRXJyb3IoJ1ZBUklBQkxFUycsICdNaXNzaW5nIHZhcmlhYmxlICcgKyBpZCk7XG4gIHRyeSB7XG4gICAgdi5uYW1lO1xuICAgIHJldHVybiB2O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IG5ldyBLZXllZEVycm9yKCdWQVJJQUJMRVMnLCAnTWlzc2luZyB2YXJpYWJsZSAnICsgaWQpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1ZhcmlhYmxlKFxuICB2YXJpYWJsZUlkOiBzdHJpbmcsXG4gIGN0eDogQ29sbGVjdG9yTWFwcGluZ0NvbnRleHQgfCB1bmRlZmluZWRcbik6IHN0cmluZyB7XG4gIHJldHVybiBgdmFyKCR7Y29sbGVjdFZhcmlhYmxlSWQodmFyaWFibGVJZCwgY3R4KX0pYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbGxlY3RWYXJpYWJsZUlkKFxuICB2YXJpYWJsZUlkOiBzdHJpbmcsXG4gIGN0eDogQ29sbGVjdG9yTWFwcGluZ0NvbnRleHQgfCB1bmRlZmluZWRcbik6IHN0cmluZyB7XG4gIGlmIChjdHggJiYgIWN0eC52YXJpYWJsZXMuaGFzKHZhcmlhYmxlSWQpKSBjdHgudmFyaWFibGVzLnNldCh2YXJpYWJsZUlkLCB7fSk7XG4gIHJldHVybiBgLS0ke3ZhcmlhYmxlSWR9YDtcbn1cblxuY29uc3QgU0FOSVRJWkVfUkVHRVhQID0gL1teMC05YS16QS1aXSsvZztcblxuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQ29sbGVjdGlvbk1vZGVOYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUNvbGxlY3Rpb25OYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKCkucmVwbGFjZShTQU5JVElaRV9SRUdFWFAsICctJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZVZhcmlhYmxlTmFtZShuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gbmFtZS5yZXBsYWNlKFNBTklUSVpFX1JFR0VYUCwgJy0nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyaWFibGVOYW1lKHZhcmlhYmxlOiBWYXJpYWJsZSk6IHN0cmluZyB7XG4gIHJldHVybiBgLS0ke3Nhbml0aXplVmFyaWFibGVOYW1lKHZhcmlhYmxlLm5hbWUpfWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0RhdGFBdHRyaWJ1dGUodmFyaWFibGU6IFZhcmlhYmxlKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBkYXRhJHt0b1ZhcmlhYmxlTmFtZSh2YXJpYWJsZSkuc2xpY2UoMSkudG9Mb3dlckNhc2UoKX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBbGlhcyh2OiBWYXJpYWJsZVZhbHVlV2l0aEV4cHJlc3Npb24pOiB2IGlzIFZhcmlhYmxlQWxpYXMge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiB2ID09PSAnb2JqZWN0JyAmJiAodiBhcyBWYXJpYWJsZUFsaWFzKS50eXBlID09PSAnVkFSSUFCTEVfQUxJQVMnXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBWYXJpYWJsZURhdGFUb0YydyhcbiAgZGF0YTogVmFyaWFibGVEYXRhLFxuICBjdHg6IENvbGxlY3Rvck1hcHBpbmdDb250ZXh0XG4pOiBWYXJpYWJsZURhdGEge1xuICBjb25zdCByZXQgPSB7IC4uLmRhdGEgfTtcbiAgY29uc3QgeyB2YWx1ZSB9ID0gcmV0O1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgIGlmIChpc0FsaWFzKHZhbHVlKSkge1xuICAgICAgcmV0LnZhbHVlID0gbWFwVmFyaWFibGVBbGlhc1RvRjJ3KHZhbHVlLCBjdHgpO1xuICAgIH0gZWxzZSBpZiAoJ2V4cHJlc3Npb25Bcmd1bWVudHMnIGluIHZhbHVlKSB7XG4gICAgICByZXQudmFsdWUgPSB7XG4gICAgICAgIGV4cHJlc3Npb25GdW5jdGlvbjogdmFsdWUuZXhwcmVzc2lvbkZ1bmN0aW9uLFxuICAgICAgICBleHByZXNzaW9uQXJndW1lbnRzOiB2YWx1ZS5leHByZXNzaW9uQXJndW1lbnRzLm1hcCgoYSkgPT5cbiAgICAgICAgICBtYXBWYXJpYWJsZURhdGFUb0YydyhhLCBjdHgpXG4gICAgICAgICksXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXQudmFsdWUgPSB7IC4uLnZhbHVlIH07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBWYXJpYWJsZUFsaWFzVG9GMncoXG4gIGRhdGE6IFZhcmlhYmxlQWxpYXMsXG4gIGN0eDogQ29sbGVjdG9yTWFwcGluZ0NvbnRleHRcbik6IFZhcmlhYmxlQWxpYXMge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdWQVJJQUJMRV9BTElBUycsXG4gICAgaWQ6IGNvbGxlY3RWYXJpYWJsZUlkKGRhdGEuaWQsIGN0eCksXG4gIH07XG59XG4iLCAidHlwZSBQcmltaXRpdmVUeXBlcyA9IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbnR5cGUgUHJvcGVydGllcyA9IFJlY29yZDxcbiAgc3RyaW5nLFxuICBQcmltaXRpdmVUeXBlcyB8IFJlY29yZDxzdHJpbmcsIFByaW1pdGl2ZVR5cGVzPiB8IEFycmF5PFByaW1pdGl2ZVR5cGVzPlxuPjtcblxuZXhwb3J0IHR5cGUgVHJhY2tQcm9kdWN0ID1cbiAgfCAnd2NkJ1xuICB8ICdyYidcbiAgfCAndXAnXG4gIHwgJ3JvJ1xuICB8ICdsaSdcbiAgfCAnc3QnXG4gIHwgJ2gyZCdcbiAgfCAnaTJkJ1xuICB8ICdsYXInXG4gIHwgJ3MyZCdcbiAgfCAncDJkJ1xuICB8ICdwc2QyZCdcbiAgfCAnYzJkJ1xuICB8ICdmMncnXG4gIHwgJ3NocidcbiAgfCAnejJkJ1xuICB8ICdpbWcnXG4gIHwgJ2EyZCc7XG5cbnR5cGUgVHJhY2tQbGF0Zm9ybSA9ICdmaWdtYScgfCAnd2ViZmxvdycgfCAnZnJhbWVyJztcblxudHlwZSBUcmFja1BheWxvYWRQYXJ0aWFsID0ge1xuICBwcm9kdWN0PzogVHJhY2tQcm9kdWN0O1xuICBzdWJwcm9kdWN0Pzogc3RyaW5nO1xuICBwbGF0Zm9ybT86IFRyYWNrUGxhdGZvcm07XG4gIHVzZXJpZD86IHN0cmluZztcbiAgdmVyc2lvbj86IHN0cmluZztcbiAgcHJvcGVydGllcz86IFByb3BlcnRpZXM7XG59O1xuXG50eXBlIFRyYWNrUGF5bG9hZFBhcnRpYWxXaXRoRXJyb3IgPSBUcmFja1BheWxvYWRQYXJ0aWFsICYge1xuICBlcnJvcj86IGFueTtcbn07XG5cbnR5cGUgT3B0aW9ucyA9IHtcbiAgY291bnRyeT86IGJvb2xlYW47XG4gIHVzZXJBZ2VudD86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBUcmFuc2Zvcm1lZE9wdGlvbnMgPSB7XG4gIGNvPzogYm9vbGVhbjtcbiAgdWE/OiBib29sZWFuO1xufTtcblxudHlwZSBUcmFja1BheWxvYWQgPSB7IGV2ZW50OiBzdHJpbmcgfSAmIFRyYWNrUGF5bG9hZFBhcnRpYWwgJiB7XG4gICAgb3B0aW9ucz86IFRyYW5zZm9ybWVkT3B0aW9ucztcbiAgfTtcblxuY2xhc3MgQW5hbHl0aWNzIHtcbiAgcHVibGljIGRlZj86IFRyYWNrUGF5bG9hZFBhcnRpYWw7XG5cbiAgc3RhdGljIFNIQVJFRF9TRVJWSUNFX1VSTFMgPVxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbidcbiAgICAgID8gWydodHRwczovL2FwaS5kaXZyaW90cy5jb20nLCAnaHR0cHM6Ly9hcGktZXUuZGl2cmlvdHMuY29tJ11cbiAgICAgIDogcHJvY2Vzcy5lbnYuTE9DQUxfU0hSXG4gICAgICA/IFsnaHR0cDovL2xvY2FsaG9zdDo1MDAxL2Rldi1zaGFyZWQtc2VydmljZXMvdXMtY2VudHJhbDEvYXBpJ11cbiAgICAgIDogW1xuICAgICAgICAgICdodHRwczovL2FwaS1vZGRocW40cG1xLXVjLmEucnVuLmFwcCcsXG4gICAgICAgICAgJ2h0dHBzOi8vYXBpZXUtb2RkaHFuNHBtcS1ldy5hLnJ1bi5hcHAnLFxuICAgICAgICBdO1xuICBzdGF0aWMgc2VydmljZVVybDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKGRlZjogVHJhY2tQYXlsb2FkUGFydGlhbCkge1xuICAgIHRoaXMuZGVmID0gZGVmO1xuICB9XG5cbiAgYWRkRGVmYXVsdChkZWY6IFRyYWNrUGF5bG9hZFBhcnRpYWwpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kZWYpIHtcbiAgICAgIGlmICh0aGlzLmRlZi5wcm9wZXJ0aWVzKSB7XG4gICAgICAgIGNvbnN0IHsgcHJvcGVydGllcywgLi4ucmVzdCB9ID0gZGVmO1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuZGVmLnByb3BlcnRpZXMsIHByb3BlcnRpZXMpO1xuICAgICAgICBkZWYgPSByZXN0O1xuICAgICAgfVxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmRlZiwgZGVmKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWYgPSB7IC4uLmRlZiB9O1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0RGVmYXVsdCgpOiB2b2lkIHtcbiAgICB0aGlzLmRlZiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgdHJhbnNmb3JtT3B0aW9ucyhvcHRpb25zPzogT3B0aW9ucyk6IFRyYW5zZm9ybWVkT3B0aW9ucyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFvcHRpb25zKSByZXR1cm47XG4gICAgY29uc3QgeyBjb3VudHJ5LCB1c2VyQWdlbnQgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgdHJhbnNmb3JtZWQ6IFRyYW5zZm9ybWVkT3B0aW9ucyA9IHt9O1xuICAgIGlmIChjb3VudHJ5KSB0cmFuc2Zvcm1lZC5jbyA9IGNvdW50cnk7XG4gICAgaWYgKHVzZXJBZ2VudCkgdHJhbnNmb3JtZWQudWEgPSB1c2VyQWdlbnQ7XG4gICAgcmV0dXJuIHRyYW5zZm9ybWVkO1xuICB9XG5cbiAgYXN5bmMgZmVhdHVyZV90ZXN0KGZlYXR1cmU6IHN0cmluZywgZGF0YTogUHJvcGVydGllcyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICgnZmVhdHVyZScgaW4gZGF0YSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgJ2BmZWF0dXJlYCBpcyBhIHJlc2VydmVkIHByb3BlcnR5IGZvciBmZWF0dXJlX3Rlc3QgdHJhY2tpbmcuJ1xuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudHJhY2soJ2ZlYXR1cmUtdGVzdCcsIHtcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZmVhdHVyZSxcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBleGNlcHRpb24obmFtZTogc3RyaW5nLCBlcnJvcjogYW55LCBkZXRhaWxzPzogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnIHx8IHByb2Nlc3MuZW52LkZJUkVCQVNFX0NPTkZJRykge1xuICAgICAgY29uc29sZS5lcnJvcihgQW5hbHl0aWNzLmV4Y2VwdGlvbigpOiAke25hbWV9YCwgZXJyb3IsIGRldGFpbHMpO1xuICAgIH1cbiAgICBjb25zdCBwcm9wZXJ0aWVzOiBQcm9wZXJ0aWVzID0ge1xuICAgICAgbmFtZSxcbiAgICB9O1xuICAgIGlmIChkZXRhaWxzKVxuICAgICAgcHJvcGVydGllcy5kZXRhaWxzID1cbiAgICAgICAgdHlwZW9mIGRldGFpbHMgPT09ICdzdHJpbmcnID8gZGV0YWlscyA6IEpTT04uc3RyaW5naWZ5KGRldGFpbHMpO1xuICAgIHJldHVybiB0aGlzLnRyYWNrKCdleGNlcHRpb24nLCB7XG4gICAgICBlcnJvcixcbiAgICAgIHByb3BlcnRpZXMsXG4gICAgfSk7XG4gIH1cblxuICBjYXRjaGVyKG5hbWU6IHN0cmluZywgZGV0YWlscz86IGFueSk6IChlcnJvcjogYW55KSA9PiB2b2lkIHtcbiAgICByZXR1cm4gKGVycm9yOiBhbnkpID0+IHtcbiAgICAgIHRoaXMuZXhjZXB0aW9uKG5hbWUsIGVycm9yLCBkZXRhaWxzKTtcbiAgICB9O1xuICB9XG5cbiAgdW5oYW5kbGVkPFQ+KG5hbWU6IHN0cmluZywgY2I6ICgpID0+IFQpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmV0ID0gY2IoKTtcbiAgICAgIGlmIChyZXQgJiYgdHlwZW9mIHJldCA9PT0gJ29iamVjdCcgJiYgJ2NhdGNoJyBpbiByZXQpIHtcbiAgICAgICAgcmV0dXJuIChyZXQgYXMgYW55KS5jYXRjaCh0aGlzLmNhdGNoZXIobmFtZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhpcy5leGNlcHRpb24obmFtZSwgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHRyYWNrKFxuICAgIGV2ZW50OiBzdHJpbmcsXG4gICAgcGF5bG9hZFBhcnRpYWw6IFRyYWNrUGF5bG9hZFBhcnRpYWxXaXRoRXJyb3IgPSB7fSxcbiAgICBvcHRpb25zPzogT3B0aW9uc1xuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBwcm9wZXJ0aWVzID0gdGhpcy5kZWY/LnByb3BlcnRpZXNcbiAgICAgID8gT2JqZWN0LmFzc2lnbihwYXlsb2FkUGFydGlhbC5wcm9wZXJ0aWVzIHx8IHt9LCB0aGlzLmRlZi5wcm9wZXJ0aWVzKVxuICAgICAgOiBwYXlsb2FkUGFydGlhbC5wcm9wZXJ0aWVzIHx8IHt9O1xuXG4gICAgLy8gVHJhbnNmb3JtIGBlcnJvcmAgdGFnIGludG8gYGVycm9yX21lc3NhZ2VgIGFuZCBgZXJyb3Jfc3RhY2tgIHByb3BlcnRpZXNcbiAgICBpZiAocGF5bG9hZFBhcnRpYWwuZXJyb3IpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gcGF5bG9hZFBhcnRpYWwuZXJyb3I7XG4gICAgICBwcm9wZXJ0aWVzLmVycm9yX21lc3NhZ2UgPSBlcnJvci5tZXNzYWdlIHx8IFN0cmluZyhlcnJvcik7XG4gICAgICBwcm9wZXJ0aWVzLmVycm9yX3N0YWNrID0gZ2V0U3RhY2tUcmFjZShlcnJvcik7XG4gICAgICBkZWxldGUgcGF5bG9hZFBhcnRpYWwuZXJyb3I7XG4gICAgfVxuXG4gICAgY29uc3QgcGF5bG9hZDogVHJhY2tQYXlsb2FkID0ge1xuICAgICAgZXZlbnQsXG4gICAgICAuLi57IHZlcnNpb246IHByb2Nlc3MuZW52Ll9fRklHTUFfUExVR0lOX1ZFUlNJT05fXyB9LFxuICAgICAgLi4udGhpcy5kZWYsXG4gICAgICAuLi5wYXlsb2FkUGFydGlhbCxcbiAgICAgIHByb3BlcnRpZXMsXG4gICAgICBvcHRpb25zOiB0aGlzLnRyYW5zZm9ybU9wdGlvbnMob3B0aW9ucyksXG4gICAgfTtcblxuICAgIC8vIENoZWNrIHBheWxvYWQgdmFsaWRpdHlcbiAgICBpZiAoIXBheWxvYWQucHJvZHVjdCkge1xuICAgICAgY29uc29sZS5lcnJvcignQW5hbHl0aWNzLnRyYWNrKCk6IGBwcm9kdWN0YCBwcm9wZXJ0eSBpcyBtaXNzaW5nLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRyeUZldGNoID0gYXN5bmMgKFxuICAgICAgdXJsOiBzdHJpbmcsXG4gICAgICBsb2dPbkVycm9yOiBib29sZWFuXG4gICAgKTogUHJvbWlzZTxib29sZWFuPiA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBmZXRjaChgJHt1cmx9L3BhYCwge1xuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChsb2dPbkVycm9yKSB7XG4gICAgICAgICAgLy8gQWx3YXlzIGZhaWwgc2lsZW50bHkgdG8gYXZvaWQgc2VydmljZSBkaXN0dXJiYW5jZVxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICBgQW5hbHl0aWNzLnRyYWNrKCk6IFVuZXhwZWN0ZWQgZXJyb3Igb24gZXZlbnQgJHtldmVudH0uYCxcbiAgICAgICAgICAgIGVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGlmIChBbmFseXRpY3Muc2VydmljZVVybCkge1xuICAgICAgYXdhaXQgdHJ5RmV0Y2goQW5hbHl0aWNzLnNlcnZpY2VVcmwsIHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB1cmxzID0gWy4uLkFuYWx5dGljcy5TSEFSRURfU0VSVklDRV9VUkxTXTtcbiAgICAgIHdoaWxlICh1cmxzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCB1cmwgPSB1cmxzLnNoaWZ0KCkhO1xuICAgICAgICBpZiAoYXdhaXQgdHJ5RmV0Y2godXJsLCAhdXJscy5sZW5ndGgpKSB7XG4gICAgICAgICAgQW5hbHl0aWNzLnNlcnZpY2VVcmwgPSB1cmw7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBpZiBub25lIHN1Y2NlZWRlZCBqdXN0IGtlZXAgdGhlIGZpcnN0IG9uZVxuICAgICAgaWYgKCFBbmFseXRpY3Muc2VydmljZVVybClcbiAgICAgICAgQW5hbHl0aWNzLnNlcnZpY2VVcmwgPSBBbmFseXRpY3MuU0hBUkVEX1NFUlZJQ0VfVVJMU1swXTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQW5hbHl0aWNzO1xuZXhwb3J0IHR5cGUgeyBQcm9wZXJ0aWVzLCBUcmFja1BheWxvYWQsIFRyYWNrUGF5bG9hZFBhcnRpYWwgfTtcblxuZXhwb3J0IGNsYXNzIEdsb2JhbEFuYWx5dGljcyBleHRlbmRzIEFuYWx5dGljcyB7XG4gIGlzSW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7fSk7XG4gIH1cblxuICBpbml0aWFsaXplKGRlZjogVHJhY2tQYXlsb2FkUGFydGlhbCk6IHZvaWQge1xuICAgIHRoaXMuYWRkRGVmYXVsdChkZWYpO1xuICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGFuYWx5dGljcyA9IG5ldyBHbG9iYWxBbmFseXRpY3MoKTtcblxuY29uc3QgZ2V0U3RhY2tUcmFjZSA9IChlcnI6IGFueSk6IHN0cmluZyA9PiB7XG4gIGlmIChlcnIuc3RhY2spIHtcbiAgICBsZXQgc3RhY2sgPSBlcnIuc3RhY2s7XG4gICAgaWYgKGVyci5jYXVzZSkge1xuICAgICAgY29uc3QgY2F1c2VTdGFjayA9IGdldFN0YWNrVHJhY2UoZXJyLmNhdXNlKTtcbiAgICAgIHN0YWNrICs9IGBcXG5DYXVzZWQgYnkgJHtjYXVzZVN0YWNrfWA7XG4gICAgfVxuICAgIHJldHVybiBzdGFjaztcbiAgfVxuICByZXR1cm4gJyc7XG59O1xuIiwgbnVsbCwgImltcG9ydCB7XG4gIEV2ZW50SGFuZGxlcixcbiAgb24gYXMgY2ZwX29uLFxuICBvbmNlLFxufSBmcm9tICdAY3JlYXRlLWZpZ21hLXBsdWdpbi91dGlsaXRpZXMnO1xuaW1wb3J0IHsgd3JhcFdpdGhFcnJvckhhbmRsaW5nIH0gZnJvbSAnLi9sb2dnZXInO1xuaW1wb3J0IHsgY2lyY3VsYXJEZWN0b3IgfSBmcm9tICcuL3V0aWxzL2NpcmN1bGFyLWRlY3Rvcic7XG5cbmV4cG9ydCB7IHR5cGUgRXZlbnRIYW5kbGVyLCBvbmNlIH07XG5cbmxldCBwbHVnaW5JZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UGx1Z2luSWQoaWQ6IHN0cmluZyk6IHZvaWQge1xuICBwbHVnaW5JZCA9IGlkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VuZERyb3BFdmVudChwbHVnaW5Ecm9wOiBhbnkpOiB2b2lkIHtcbiAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7IHBsdWdpbkRyb3AsIHBsdWdpbklkIH0sICcqJyk7XG59XG5cbmV4cG9ydCBjb25zdCBjZnBfZW1pdCA9XG4gIHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnXG4gICAgPyBmdW5jdGlvbiA8SGFuZGxlciBleHRlbmRzIEV2ZW50SGFuZGxlcj4oXG4gICAgICAgIG5hbWU6IEhhbmRsZXJbJ25hbWUnXSxcbiAgICAgICAgLi4uYXJnczogUGFyYW1ldGVyczxIYW5kbGVyWydoYW5kbGVyJ10+XG4gICAgICApOiB2b2lkIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZShbbmFtZSwgLi4uYXJnc10pO1xuICAgICAgfVxuICAgIDogZnVuY3Rpb24gPEhhbmRsZXIgZXh0ZW5kcyBFdmVudEhhbmRsZXI+KFxuICAgICAgICBuYW1lOiBIYW5kbGVyWyduYW1lJ10sXG4gICAgICAgIC4uLmFyZ3M6IFBhcmFtZXRlcnM8SGFuZGxlclsnaGFuZGxlciddPlxuICAgICAgKTogdm9pZCB7XG4gICAgICAgIGlmIChwbHVnaW5JZCkge1xuICAgICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHBsdWdpbk1lc3NhZ2U6IFtuYW1lLCAuLi5hcmdzXSxcbiAgICAgICAgICAgICAgcGx1Z2luSWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2h0dHBzOi8vd3d3LmZpZ21hLmNvbSdcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHBsdWdpbk1lc3NhZ2U6IFtuYW1lLCAuLi5hcmdzXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnKidcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9O1xuXG5leHBvcnQgZnVuY3Rpb24gZW1pdFBsdWdpblRvUGx1Z2luPEhhbmRsZXIgZXh0ZW5kcyBFdmVudEhhbmRsZXI+KFxuICBuYW1lOiBIYW5kbGVyWyduYW1lJ10sXG4gIC4uLmFyZ3M6IFBhcmFtZXRlcnM8SGFuZGxlclsnaGFuZGxlciddPlxuKTogdm9pZCB7XG4gIHdpbmRvdy5wb3N0TWVzc2FnZShcbiAgICB7XG4gICAgICBwbHVnaW5NZXNzYWdlOiBbbmFtZSwgLi4uYXJnc10sXG4gICAgfSxcbiAgICAnKidcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVtaXQ8SGFuZGxlciBleHRlbmRzIEV2ZW50SGFuZGxlcj4oXG4gIG5hbWU6IEhhbmRsZXJbJ25hbWUnXSxcbiAgLi4uYXJnczogUGFyYW1ldGVyczxIYW5kbGVyWydoYW5kbGVyJ10+XG4pOiB2b2lkIHtcbiAgaWYgKCFwcm9jZXNzLmVudi5OT19ERUJVR19MT0dTKSB7XG4gICAgY29uc29sZS5sb2coYEVNSVRgLCBuYW1lLCBhcmdzKTtcbiAgfVxuICBjZnBfZW1pdChuYW1lLCAuLi5hcmdzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9uPEhhbmRsZXIgZXh0ZW5kcyBFdmVudEhhbmRsZXI+KFxuICBuYW1lOiBIYW5kbGVyWyduYW1lJ10sXG4gIGhhbmRsZXI6IEhhbmRsZXJbJ2hhbmRsZXInXVxuKTogKCkgPT4gdm9pZCB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGNvbnNvbGUubG9nKGBSRUdJU1RFUmAsIG5hbWUpO1xuICB9XG4gIGNvbnN0IGRpc3AgPSBjZnBfb248SGFuZGxlcj4obmFtZSwgaGFuZGxlcik7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBkaXNwKCk7XG4gICAgICBjb25zb2xlLmxvZyhgVU5SRUdJU1RFUmAsIG5hbWUpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGRpc3A7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvblNhZmU8SGFuZGxlciBleHRlbmRzIEV2ZW50SGFuZGxlcj4oXG4gIG5hbWU6IEhhbmRsZXJbJ25hbWUnXSxcbiAgaGFuZGxlcjogSGFuZGxlclsnaGFuZGxlciddXG4pOiBSZXR1cm5UeXBlPHR5cGVvZiBvbj4ge1xuICByZXR1cm4gb24obmFtZSwgd3JhcFdpdGhFcnJvckhhbmRsaW5nKGBvbjoke25hbWV9YCwgaGFuZGxlcikpO1xufVxuXG5jb25zdCBtYXhDYWxsU3RhY2tSZWdleCA9IC9tYXhpbXVtIGNhbGwgc3RhY2sgc2l6ZSBleGNlZWRlZC9pO1xuXG5leHBvcnQgdHlwZSBQSGFuZGxlcjxUIGV4dGVuZHMgKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk+ID0gKFxuICAuLi5hcmdzOiBQYXJhbWV0ZXJzPFQ+XG4pID0+IFJldHVyblR5cGU8VD4gZXh0ZW5kcyBQcm9taXNlPGFueT5cbiAgPyBSZXR1cm5UeXBlPFQ+XG4gIDogUHJvbWlzZTxSZXR1cm5UeXBlPFQ+PiB8IFJldHVyblR5cGU8VD47XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmljT25SZXF1ZXN0PFxuICBWIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgKC4uLmFyZ3M6IGFueSkgPT4gYW55PixcbiAgVCBleHRlbmRzIGtleW9mIFYgPSBrZXlvZiBWLFxuPihuYW1lOiBULCBoYW5kbGVyOiBQSGFuZGxlcjxWW1RdPik6ICgpID0+IHZvaWQge1xuICByZXR1cm4gb24oU3RyaW5nKG5hbWUpLCBhc3luYyBmdW5jdGlvbiAoYXJnczogUGFyYW1ldGVyczx0eXBlb2YgaGFuZGxlcj4pIHtcbiAgICBjb25zdCBpZCA9IGFyZ3Muc3BsaWNlKDAsIDEpWzBdO1xuICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICB0cnkge1xuICAgICAgLy8gQHRzLWlnbm9yZSBDSSBvbmx5IGVycm9yOiBlcnJvciBUUzI0ODg6IFR5cGUgJ1BhcmFtZXRlcnM8VltUXT4nIG11c3QgaGF2ZSBhICdbU3ltYm9sLml0ZXJhdG9yXSgpJyBtZXRob2QgdGhhdCByZXR1cm5zIGFuIGl0ZXJhdG9yXG4gICAgICByZXN1bHQgPSBhd2FpdCBoYW5kbGVyKC4uLmFyZ3MpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZW1pdChgJHtTdHJpbmcobmFtZSl9LXJlc3BvbnNlLSR7aWR9YCwgeyByZXN1bHQgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgRXJyb3IgJiYgbWF4Q2FsbFN0YWNrUmVnZXgudGVzdChlLm1lc3NhZ2UpKSB7XG4gICAgICAgICAgLy8gV2UgaGF2ZSBlcnJvcnMgaW4gcHJvZHVjdGlvbiBhYm91dCBgTWF4aW11bSBjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRgIGFuZCBiZWxpZXZlIHRoZXkgYXJlIGNhdXNlZFxuICAgICAgICAgIC8vIGJ5IGNpcmN1bGFyIHJlZmVyZW5jZXMsIHNvIHJ1biB0aGlzIGNoZWNrIHdoaWNoIHdpbGwgdGhyb3cgYSBuaWNlciBlcnJvciB3aXRoIGEgcGF0aCB0byBvZmZlbmRpbmcuXG4gICAgICAgICAgLy8gV2UgY291bGQgcmVtb3ZlIHRoaXMgY29kZS9jaGVjayBvbmNlIHdlIHJlc29sdmUgdGhhdCBlcnJvci5cbiAgICAgICAgICBjaXJjdWxhckRlY3RvcihyZXN1bHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgICAgICBjb25zb2xlLmVycm9yKHJlc3VsdCwgZSk7XG4gICAgICB9XG4gICAgICBlbWl0KGAke1N0cmluZyhuYW1lKX0tcmVzcG9uc2UtJHtpZH1gLCB7XG4gICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgbWVzc2FnZTogYFske1N0cmluZyhuYW1lKX1dICR7ZS5tZXNzYWdlID8/IGV9YCxcbiAgICAgICAgICBzdGFjazogZS5zdGFjayxcbiAgICAgICAgICBuYW1lOiBlLm5hbWUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5sZXQgcmVxdWVzdElkID0gMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyaWNFbWl0UmVxdWVzdDxcbiAgViBleHRlbmRzIFJlY29yZDxzdHJpbmcsICguLi5hcmdzOiBhbnkpID0+IGFueT4sXG4gIFQgZXh0ZW5kcyBrZXlvZiBWID0ga2V5b2YgVixcbj4obmFtZTogVCwgLi4uYXJnczogUGFyYW1ldGVyczxWW1RdPik6IFByb21pc2U8QXdhaXRlZDxSZXR1cm5UeXBlPFZbVF0+Pj4ge1xuICBjb25zdCBpZCA9IHJlcXVlc3RJZCsrO1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIG9uY2UoYCR7U3RyaW5nKG5hbWUpfS1yZXNwb25zZS0ke2lkfWAsIChyZXNwb25zZSkgPT4ge1xuICAgICAgaWYgKCdlcnJvcicgaW4gcmVzcG9uc2UpIHtcbiAgICAgICAgY29uc3QgeyBtZXNzYWdlLCBzdGFjaywgbmFtZSB9ID0gcmVzcG9uc2UuZXJyb3I7XG4gICAgICAgIGNvbnN0IGxvY2FsRXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgICAgIGlmIChuYW1lKSBsb2NhbEVycm9yLm5hbWUgPSBuYW1lO1xuICAgICAgICAobG9jYWxFcnJvciBhcyBhbnkpLmNhdXNlID0gbmV3IEN1c3RvbUVycm9yKG1lc3NhZ2UsIHN0YWNrKTtcbiAgICAgICAgcmVqZWN0KGxvY2FsRXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzb2x2ZShyZXNwb25zZS5yZXN1bHQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGVtaXQoU3RyaW5nKG5hbWUpLCBbaWQsIC4uLmFyZ3NdKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmljRW1pdFJlcXVlc3RlcjxcbiAgViBleHRlbmRzIFJlY29yZDxzdHJpbmcsICguLi5hcmdzOiBhbnkpID0+IGFueT4sXG4+KCkge1xuICByZXR1cm4gPFQgZXh0ZW5kcyBrZXlvZiBWICYgc3RyaW5nPihcbiAgICBuYW1lOiBULFxuICAgIC4uLmFyZ3M6IFBhcmFtZXRlcnM8VltUXT5cbiAgKTogUHJvbWlzZTxBd2FpdGVkPFJldHVyblR5cGU8VltUXT4+PiA9PiB7XG4gICAgcmV0dXJuIGdlbmVyaWNFbWl0UmVxdWVzdDxWLCBUPihuYW1lLCAuLi5hcmdzKTtcbiAgfTtcbn1cblxuY2xhc3MgQ3VzdG9tRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgc3RhY2s6IHN0cmluZykge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMuc3RhY2sgPSBzdGFjaztcbiAgfVxufVxuIiwgImltcG9ydCB7IGFuYWx5dGljcyB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9zcmMvYW5hbHl0aWNzJztcbmltcG9ydCB7IGdldEJhc2U2NEJ5dGVMZW5ndGggfSBmcm9tICdAZGl2cmlvdHMvdXRpbHMvc3JjL2Jhc2U2NCc7XG5pbXBvcnQgdHlwZSB7IFJlc3RQbHVnaW5EYXRhTWl4aW4gfSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdXRpbHMvc3JjL2ZpZ21hLnJlc3QudHlwaW5ncyc7XG5pbXBvcnQgeyBkZXNjcmliZU5vZGUgfSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdXRpbHMvc3JjL3BsdWdpbi9sb2dnZXInO1xuaW1wb3J0IHsgZ2VuZXJpY0VtaXRSZXF1ZXN0ZXIgfSBmcm9tICcuLi9ldmVudHMnO1xuaW1wb3J0IHR5cGUgeyBac3RkQ29tcHJlc3MgfSBmcm9tICcuLi90eXBlcyc7XG5cbmNvbnN0IENPTVBSRVNTX1RIUkVTSE9MRF9CWVRFUyA9IDEwXzAwMDtcbmNvbnN0IENPTVBSRVNTRURfVjEgPSAnXFx4REZcXHgxMCc7XG5jb25zdCBCSUdfREFUQV9USFJFU0hPTERfQllURVMgPSA1MF8wMDA7XG5jb25zdCBNQVhfREFUQV9CWVRFUyA9IDk5XzAwMDtcblxuY29uc3QgcmVxdWVzdFpzdGQgPSBnZW5lcmljRW1pdFJlcXVlc3Rlcjxac3RkQ29tcHJlc3M+KCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYXliZUNvbXByZXNzKFxuICBrZXk6IHN0cmluZyxcbiAgdmFsdWU6IHN0cmluZ1xuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgodmFsdWUsICd1dGYtOCcpO1xuICBpZiAobGVuZ3RoIDwgQ09NUFJFU1NfVEhSRVNIT0xEX0JZVEVTKSByZXR1cm4gdmFsdWU7XG5cbiAgY29uc3QgY29tcHJlc3NlZEJhc2U2NCA9IGF3YWl0IHJlcXVlc3Rac3RkKCd6c3RkLWNvbXByZXNzJywgdmFsdWUsIHtcbiAgICBpbnB1dEVuY29kaW5nOiAndXRmLTgnLFxuICAgIGxldmVsOiAzLFxuICB9KTtcbiAgdmFsdWUgPSBDT01QUkVTU0VEX1YxICsgY29tcHJlc3NlZEJhc2U2NDtcbiAgY29uc3QgY29tcHJlc3NlZExlbmd0aCA9IGdldEJhc2U2NEJ5dGVMZW5ndGgoY29tcHJlc3NlZEJhc2U2NCk7XG4gIGlmIChjb21wcmVzc2VkTGVuZ3RoID4gQklHX0RBVEFfVEhSRVNIT0xEX0JZVEVTKSB7XG4gICAgY29uc3QgcHJvcGVydGllcyA9IHsga2V5LCBsZW5ndGgsIGNvbXByZXNzZWRMZW5ndGggfTtcbiAgICBhbmFseXRpY3MudHJhY2soJ2JpZy1wbHVnaW5EYXRhJywgeyBwcm9wZXJ0aWVzIH0pO1xuICAgIGlmIChjb21wcmVzc2VkTGVuZ3RoID4gTUFYX0RBVEFfQllURVMpIHtcbiAgICAgIGFuYWx5dGljcy5leGNlcHRpb24oXG4gICAgICAgICdwbHVnaW5EYXRhOm1heWJlQ29tcHJlc3MnLFxuICAgICAgICBuZXcgRXJyb3IoJ1ZhbHVlIHRvbyBiaWcsIGRhdGEgd2lsbCBub3QgYmUgc2F2ZWQgc29vbicpLFxuICAgICAgICBwcm9wZXJ0aWVzXG4gICAgICApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYXliZURlY29tcHJlc3ModmFsdWU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGlmICh2YWx1ZS5zdGFydHNXaXRoKENPTVBSRVNTRURfVjEpKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNvbXByZXNzZWRCYXNlNjQgPSB2YWx1ZS5zbGljZShDT01QUkVTU0VEX1YxLmxlbmd0aCk7XG4gICAgICByZXR1cm4gYXdhaXQgcmVxdWVzdFpzdGQoJ3pzdGQtZGVjb21wcmVzcycsIGNvbXByZXNzZWRCYXNlNjQsIHtcbiAgICAgICAgb3V0cHV0RW5jb2Rpbmc6ICd1dGY4JyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGFuYWx5dGljcy5leGNlcHRpb24oJ3BsdWdpbkRhdGE6bWF5YmVEZWNvbXByZXNzJywgZSk7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNoYXJlZERhdGEoXG4gIG5vZGU6IFBsdWdpbkRhdGFNaXhpbiB8IFJlc3RQbHVnaW5EYXRhTWl4aW4sXG4gIHBsdWdpbktleTogc3RyaW5nLFxuICBrZXk6IHN0cmluZ1xuKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgcmV0ID1cbiAgICAnZ2V0U2hhcmVkUGx1Z2luRGF0YScgaW4gbm9kZVxuICAgICAgPyBub2RlLmdldFNoYXJlZFBsdWdpbkRhdGEocGx1Z2luS2V5LCBrZXkpXG4gICAgICA6IG5vZGUuc2hhcmVkUGx1Z2luRGF0YT8uW3BsdWdpbktleV0/LltrZXldO1xuICByZXR1cm4gcmV0ID8gbWF5YmVEZWNvbXByZXNzKHJldCkgOiAnJztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNoYXJlZERhdGFPYmo8VD4oXG4gIG5vZGU6IFBsdWdpbkRhdGFNaXhpbiB8IFJlc3RQbHVnaW5EYXRhTWl4aW4sXG4gIHBsdWdpbktleTogc3RyaW5nLFxuICBrZXk6IHN0cmluZyxcbiAgZGVmOiBUXG4pOiBQcm9taXNlPFQ+IHtcbiAgY29uc3QgcmV0ID0gYXdhaXQgZ2V0U2hhcmVkRGF0YShub2RlLCBwbHVnaW5LZXksIGtleSk7XG4gIGlmIChyZXQpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmV0KSBhcyBUO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGBGYWlsZWQgdG8gcGFyc2Ugc2hhcmVkIHBsdWdpbiBkYXRhIFske3BsdWdpbktleX1dWyR7a2V5fV06ICR7cmV0fWAsXG4gICAgICAgIGVycm9yXG4gICAgICApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVmO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzU2hhcmVkUGx1Z2luRGF0YShcbiAgbm9kZTogUGx1Z2luRGF0YU1peGluIHwgUmVzdFBsdWdpbkRhdGFNaXhpbixcbiAgcGx1Z2luS2V5OiBzdHJpbmcsXG4gIGtleTogc3RyaW5nXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuICEhKCdnZXRTaGFyZWRQbHVnaW5EYXRhJyBpbiBub2RlXG4gICAgPyBub2RlLmdldFNoYXJlZFBsdWdpbkRhdGEocGx1Z2luS2V5LCBrZXkpXG4gICAgOiBub2RlLnNoYXJlZFBsdWdpbkRhdGE/LltwbHVnaW5LZXldPy5ba2V5XSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXREYXRhKFxuICBub2RlOiBCYXNlTm9kZSxcbiAga2V5OiBzdHJpbmcsXG4gIHZhbHVlOiBzdHJpbmdcbik6IFByb21pc2U8dm9pZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IHNhdmVkID0gYXdhaXQgbWF5YmVDb21wcmVzcyhrZXksIHZhbHVlKTtcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoa2V5LCBzYXZlZCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhbmFseXRpY3MuZXhjZXB0aW9uKCdzZXREYXRhOnNldFBsdWdpbkRhdGEnLCBlLCB7XG4gICAgICBub2RlOiBkZXNjcmliZU5vZGUobm9kZSksXG4gICAgICBrZXksXG4gICAgICB2YWx1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0RGF0YU9iaihcbiAgbm9kZTogQmFzZU5vZGUsXG4gIGtleTogc3RyaW5nLFxuICB2YWx1ZTogYW55XG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgcmV0dXJuIHNldERhdGEobm9kZSwga2V5LCBzdHJpbmdpZnkodmFsdWUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEobm9kZTogQmFzZU5vZGUsIGtleTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIG1heWJlRGVjb21wcmVzcyhub2RlLmdldFBsdWdpbkRhdGEoa2V5KSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRTaGFyZWREYXRhKFxuICBub2RlOiBCYXNlTm9kZSxcbiAgcGx1Z2luS2V5OiBzdHJpbmcsXG4gIGtleTogc3RyaW5nLFxuICB2YWx1ZTogc3RyaW5nXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzYXZlZCA9IGF3YWl0IG1heWJlQ29tcHJlc3Moa2V5LCB2YWx1ZSk7XG4gICAgbm9kZS5zZXRTaGFyZWRQbHVnaW5EYXRhKHBsdWdpbktleSwga2V5LCBzYXZlZCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBhbmFseXRpY3MuZXhjZXB0aW9uKCdzZXREYXRhOnNldFNoYXJlZFBsdWdpbkRhdGEnLCBlLCB7XG4gICAgICBub2RlOiBkZXNjcmliZU5vZGUobm9kZSksXG4gICAgICBwbHVnaW5LZXksXG4gICAgICBrZXksXG4gICAgICB2YWx1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0U2hhcmVkRGF0YU9iaihcbiAgbm9kZTogQmFzZU5vZGUsXG4gIHBsdWdpbktleTogc3RyaW5nLFxuICBrZXk6IHN0cmluZyxcbiAgdmFsdWU6IGFueVxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBzZXRTaGFyZWREYXRhKG5vZGUsIHBsdWdpbktleSwga2V5LCBzdHJpbmdpZnkodmFsdWUpKTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5KHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUpIHx8ICcnO1xufVxuIiwgImltcG9ydCB0eXBlIHtcbiAgUmVzdEJhc2VOb2RlLFxuICBSZXN0UGFpbnQsXG4gIFJlc3RTY2VuZU5vZGUsXG59IGZyb20gJ0BkaXZyaW90cy9maWdtYS11dGlscy9zcmMvZmlnbWEucmVzdC50eXBpbmdzJztcbmltcG9ydCB7IHJvdW5kVG8gfSBmcm9tICdAZGl2cmlvdHMvdXRpbHMvc3JjL251bWJlcnMnO1xuaW1wb3J0IHJnYkhleCBmcm9tICdyZ2ItaGV4JztcbmltcG9ydCB7XG4gIEYyd05hbWVzcGFjZSxcbiAgRjJ3RGF0YUtleSxcbn0gZnJvbSAnQGRpdnJpb3RzL2h0bWwtdG8tZmlnbWEtYXBpL3NyYy9mMndfY29uc3RhbnRzJztcbmltcG9ydCB0eXBlIHsgRjJ3RGF0YSB9IGZyb20gJ0BkaXZyaW90cy9odG1sLXRvLWZpZ21hLWFwaS9zcmMvdHlwZXMvbm9kZXMnO1xuaW1wb3J0IHR5cGUge1xuICBBZHZGMndEYXRhLFxuICBCYXNlRjJ3QWN0aW9uLFxuICBIdG1sRWxlbWVudCxcbiAgSHRtbE5vZGUsXG4gIE1hcHBpbmdFeGVjQ29udGV4dCxcbiAgV3JpdGFibGVWZWN0b3IsXG4gIEFsbG93ZWRQcm9wZXJ0aWVzLFxuICBUeXBlZFN0eWxlcyxcbiAgTm9kZVByb3BzLFxuICBDc3NWYWx1ZVZhcixcbiAgQ29sbGVjdG9yTWFwcGluZ0NvbnRleHQsXG4gIE1lZGlhQ2FsbHNpdGUsXG4gIERPTUYyd0FjdGlvbixcbn0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBpc0FsaWFzLCB0b1ZhcmlhYmxlIH0gZnJvbSAnLi92YXJpYWJsZXMnO1xuaW1wb3J0IHsgc2hvdWxkTm90SGFwcGVuIH0gZnJvbSAnQGRpdnJpb3RzL3V0aWxzL2Fzc2VydCc7XG5pbXBvcnQgeyBnZXRTaGFyZWREYXRhT2JqIH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXBsdWdpbi1jb3JlLXYyL3NyYy9jb2RlL3BsdWdpbkRhdGEnO1xuaW1wb3J0IHR5cGUgeyBWYWxpZFZhcmlhbnRQcm9wZXJ0aWVzIH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXV0aWxzL3V0aWxzJztcbmltcG9ydCB7IGNzc1ZhbHVlVG9TdHJpbmcgfSBmcm9tICcuL2Nzc1ZhbHVlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTaXplKFxuICBub2RlOiBTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlLFxuICBzY2FsZSA9IDFcbik6IFdyaXRhYmxlVmVjdG9yIHtcbiAgcmV0dXJuICdzaXplJyBpbiBub2RlXG4gICAgPyB7XG4gICAgICAgIHg6IG5vZGUuc2l6ZSEueCAqIHNjYWxlLFxuICAgICAgICB5OiBub2RlLnNpemUhLnkgKiBzY2FsZSxcbiAgICAgIH1cbiAgICA6IHtcbiAgICAgICAgeDogKG5vZGUgYXMgU2NlbmVOb2RlKS53aWR0aCAqIHNjYWxlLFxuICAgICAgICB5OiAobm9kZSBhcyBTY2VuZU5vZGUpLmhlaWdodCAqIHNjYWxlLFxuICAgICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE9mZnNldChcbiAgbm9kZTogU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZSxcbiAgc2NhbGUgPSAxXG4pOiBXcml0YWJsZVZlY3RvciB7XG4gIHJldHVybiAneCcgaW4gbm9kZVxuICAgID8geyB4OiBub2RlLnggKiBzY2FsZSwgeTogbm9kZS55ICogc2NhbGUgfVxuICAgIDoge1xuICAgICAgICB4OiAobm9kZSBhcyBSZXN0U2NlbmVOb2RlKS5yZWxhdGl2ZVRyYW5zZm9ybSFbMF1bMl0gKiBzY2FsZSxcbiAgICAgICAgeTogKG5vZGUgYXMgUmVzdFNjZW5lTm9kZSkucmVsYXRpdmVUcmFuc2Zvcm0hWzFdWzJdICogc2NhbGUsXG4gICAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc29saWRQYWludFRvUmdiYShjb2xvcjogU29saWRQYWludCk6IFJHQkEge1xuICByZXR1cm4gZmlnbWFSZ2JhVG9Dc3NSZ2JhKHsgLi4uY29sb3IuY29sb3IsIGE6IGNvbG9yLm9wYWNpdHkgPz8gMSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpZ21hUmdiYVRvU3RyaW5nKHJnYmE6IFJHQkEpOiBzdHJpbmcge1xuICByZXR1cm4gcmdiYVRvU3RyaW5nKGZpZ21hUmdiYVRvQ3NzUmdiYShyZ2JhKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWdtYVJnYmFPclZhclRvU3RyaW5nKFxuICByZ2JhOiBSR0JBLFxuICB2YXJpYWJsZTogVmFyaWFibGVBbGlhcyB8IHVuZGVmaW5lZCxcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhcmlhYmxlID8gdG9WYXJpYWJsZSh2YXJpYWJsZS5pZCwgY3R4KSA6IGZpZ21hUmdiYVRvU3RyaW5nKHJnYmEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmdiYVRvU3RyaW5nKHJnYmE6IFJHQkEgfCBSR0IpOiBzdHJpbmcge1xuICBpZiAoJ2EnIGluIHJnYmEpIHtcbiAgICBjb25zdCBhID0gcm91bmRUbyhyZ2JhLmEsIDEwMCk7XG4gICAgaWYgKGEgIT09IDEpIHJldHVybiBgcmdiYSgke3JnYmEucn0sJHtyZ2JhLmd9LCR7cmdiYS5ifSwke2F9KWA7XG4gIH1cbiAgY29uc3QgaGV4ID0gcmdiSGV4KHJnYmEuciwgcmdiYS5nLCByZ2JhLmIpO1xuICBpZiAoaGV4WzBdID09PSBoZXhbMV0gJiYgaGV4WzJdID09PSBoZXhbM10gJiYgaGV4WzRdID09PSBoZXhbNV0pIHtcbiAgICByZXR1cm4gYCMke2hleFswXX0ke2hleFsyXX0ke2hleFs0XX1gO1xuICB9XG4gIHJldHVybiBgIyR7aGV4fWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWdtYVJnYmFUb0Nzc1JnYmEoY29sb3I6IFJHQkEgfCBSR0IpOiBSR0JBIHtcbiAgY29uc3QgeyByLCBnLCBiLCBhID0gMSB9ID0gY29sb3IgYXMgUkdCQTtcbiAgcmV0dXJuIHtcbiAgICByOiByb3VuZFRvKHIgKiAyNTUsIDEpLFxuICAgIGc6IHJvdW5kVG8oZyAqIDI1NSwgMSksXG4gICAgYjogcm91bmRUbyhiICogMjU1LCAxKSxcbiAgICBhLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9Dc3NQeChcbiAgdmFsdWU6IG51bWJlcixcbiAgcm91bmQ6IG51bWJlcixcbiAgdmFyaWFibGU6IFZhcmlhYmxlQWxpYXMgfCB1bmRlZmluZWQsXG4gIGN0eDogTWFwcGluZ0V4ZWNDb250ZXh0XG4pOiBzdHJpbmcge1xuICByZXR1cm4gdmFyaWFibGVcbiAgICA/IGBjYWxjKDFweCAqICR7dG9WYXJpYWJsZSh2YXJpYWJsZS5pZCwgY3R4KX0pYFxuICAgIDogdG9QeChyb3VuZFRvKHZhbHVlLCByb3VuZCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9Db2xvck9yVmFyaWFibGUoXG4gIGl0OiBTb2xpZFBhaW50LFxuICBjdHg6IENvbGxlY3Rvck1hcHBpbmdDb250ZXh0XG4pOiBzdHJpbmcge1xuICByZXR1cm4gaXQuYm91bmRWYXJpYWJsZXM/LmNvbG9yXG4gICAgPyB0b1ZhcmlhYmxlKGl0LmJvdW5kVmFyaWFibGVzPy5jb2xvci5pZCwgY3R4KVxuICAgIDogcmdiYVRvU3RyaW5nKHNvbGlkUGFpbnRUb1JnYmEoaXQpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUHgodjogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke3JvdW5kVG8odiwgMTApfXB4YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvUGVyY2VudCh2OiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gYCR7cm91bmRUbyh2LCAxMCl9JWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZVRvU3RyaW5nKHY6IFZhcmlhYmxlVmFsdWUpOiBzdHJpbmcge1xuICBzd2l0Y2ggKHR5cGVvZiB2KSB7XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgIGlmIChpc0FsaWFzKHYpKSB7XG4gICAgICAgIHJldHVybiBgdmFyKCR7di5pZH0pYDtcbiAgICAgIH1cbiAgICAgIGlmICgncicgaW4gdikge1xuICAgICAgICByZXR1cm4gcmdiYVRvU3RyaW5nKGZpZ21hUmdiYVRvQ3NzUmdiYSh2KSk7XG4gICAgICB9XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICBjYXNlICdudW1iZXInOlxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gU3RyaW5nKHYpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZUlkKGlkOiBzdHJpbmcgfCBudW1iZXIpOiBzdHJpbmcge1xuICBpZCA9IFN0cmluZyhpZCk7XG4gIGxldCByZXQgPSBpZC5tYXRjaCgvW14wLTlhLXpBLVpfLV0vKSA/IGlkLnJlcGxhY2UoL1teMC05YS16QS1aXSsvZywgJ18nKSA6IGlkO1xuICBpZiAocmV0Lm1hdGNoKC9eKFswLTldfC0tfC1bMC05XXwtJCkvKSkge1xuICAgIHJldCA9ICdfJyArIHJldDtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5yaWNoPFQgZXh0ZW5kcyBGMndEYXRhPihcbiAgZWw6IFQsXG4gIHsgdGFnLCB1bnNhZmVIdG1sLCBhdHRyLCBjc3MsIHN0eWxlcyB9OiBBZHZGMndEYXRhXG4pOiBUIHtcbiAgaWYgKHRhZykgZWwudGFnID0gdGFnO1xuICBpZiAodW5zYWZlSHRtbCkgZWwudW5zYWZlSHRtbCA9IHVuc2FmZUh0bWw7XG4gIGlmIChzdHlsZXMpIHtcbiAgICBPYmplY3QuYXNzaWduKChlbC5zdHlsZXMgfHw9IHt9KSwgc3R5bGVzKTtcbiAgfVxuICBpZiAoYXR0cikge1xuICAgIE9iamVjdC5hc3NpZ24oKGVsLmF0dHIgfHw9IHt9KSwgYXR0cik7XG4gIH1cbiAgaWYgKGNzcykge1xuICAgIChlbC5jc3MgfHw9IFtdKS5wdXNoKC4uLmNzcyk7XG4gIH1cbiAgcmV0dXJuIGVsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzTm9QYXJlbnRXaXRoVGFnKFxuICBjdHg6IE1hcHBpbmdFeGVjQ29udGV4dCxcbiAgdGFnOiBzdHJpbmdcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gY3R4LnBhcmVudHMuZXZlcnkoKGl0KSA9PiBpdC50YWcgIT09IHRhZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNQYXJlbnRXaXRoVGFnKFxuICBjdHg6IE1hcHBpbmdFeGVjQ29udGV4dCxcbiAgdGFnOiBzdHJpbmdcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gISFjdHgucGFyZW50cy5maW5kKChpdCkgPT4gaXQudGFnID09PSB0YWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzUGFyZW50V2l0aFRhZ1JFKFxuICBjdHg6IE1hcHBpbmdFeGVjQ29udGV4dCxcbiAgdGFnUkU6IFJlZ0V4cFxuKTogYm9vbGVhbiB7XG4gIHJldHVybiAhIWN0eC5wYXJlbnRzLmZpbmQoKGl0KSA9PiB0YWdSRS50ZXN0KGl0LnRhZykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2lkZXNUb1NpbXBsaWZpZWQ8VD4oXG4gIHRvcDogVCxcbiAgcmlnaHQ6IFQsXG4gIGJvdHRvbTogVCxcbiAgbGVmdDogVFxuKTogVFtdIHtcbiAgaWYgKGxlZnQgPT09IHJpZ2h0KSB7XG4gICAgaWYgKHRvcCA9PT0gYm90dG9tKSB7XG4gICAgICBpZiAodG9wID09PSBsZWZ0KSB7XG4gICAgICAgIHJldHVybiBbdG9wXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbdG9wLCBsZWZ0XTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFt0b3AsIGxlZnQsIGJvdHRvbV07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBbdG9wLCByaWdodCwgYm90dG9tLCBsZWZ0XTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29ybmVyc1RvU2ltcGxpZmllZDxUPihcbiAgdG9wbGVmdDogVCxcbiAgdG9wcmlnaHQ6IFQsXG4gIGJvdHRvbXJpZ2h0OiBULFxuICBib3R0b21sZWZ0OiBUXG4pOiBUW10ge1xuICByZXR1cm4gc2lkZXNUb1NpbXBsaWZpZWQodG9wbGVmdCwgdG9wcmlnaHQsIGJvdHRvbXJpZ2h0LCBib3R0b21sZWZ0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFN0eWxlcyhub2RlOiBIdG1sRWxlbWVudCwgdmFsdWVzOiBUeXBlZFN0eWxlcyk6IHZvaWQge1xuICBPYmplY3QuZW50cmllcyh2YWx1ZXMpLmZvckVhY2goKFtrLCB2XSkgPT5cbiAgICBzZXRTdHlsZShub2RlLCBrIGFzIEFsbG93ZWRQcm9wZXJ0aWVzLCB2KVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0U3R5bGUoXG4gIG5vZGU6IEh0bWxFbGVtZW50LFxuICBrZXk6IEFsbG93ZWRQcm9wZXJ0aWVzLFxuICB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkXG4pOiB2b2lkIHtcbiAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBtYXAgPSAobm9kZS5zdHlsZXMgfHw9IHt9KTtcbiAgICBtYXBba2V5XSA9IFN0cmluZyh2YWx1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFN0eWxlKFxuICBub2RlOiBIdG1sRWxlbWVudCxcbiAga2V5OiBzdHJpbmcsXG4gIHZhbHVlczogc3RyaW5nW10sXG4gIHNlcGFyYXRvciA9ICcgJ1xuKTogdm9pZCB7XG4gIGlmICh2YWx1ZXMubGVuZ3RoKSB7XG4gICAgY29uc3Qgc3R5bGVzID0gKG5vZGUuc3R5bGVzID8/PSB7fSk7XG4gICAgY29uc3QgdiA9IHZhbHVlcy5qb2luKHNlcGFyYXRvcik7XG4gICAgaWYgKHN0eWxlc1trZXldKSB7XG4gICAgICBzdHlsZXNba2V5XSArPSBzZXBhcmF0b3IgKyB2O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZXNba2V5XSA9IHY7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRNZWRpYUNhbGxzaXRlKFxuICBub2RlOiBIdG1sRWxlbWVudCxcbiAgLi4uY3M6IE1lZGlhQ2FsbHNpdGVbXVxuKTogdm9pZCB7XG4gIGlmIChub2RlLmNhbGxzaXRlcykge1xuICAgIG5vZGUuY2FsbHNpdGVzLnB1c2goLi4uY3MpO1xuICB9IGVsc2Uge1xuICAgIG5vZGUuY2FsbHNpdGVzID0gWy4uLmNzXTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQ2xhc3MoaHRtbDogSHRtbEVsZW1lbnQsIGNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IGNsYXNzTGlzdCA9IChodG1sLmNsYXNzZXMgPz89IFtdKTtcbiAgaWYgKCFjbGFzc0xpc3QuaW5jbHVkZXMoY2xhc3NOYW1lKSkgY2xhc3NMaXN0LnB1c2goY2xhc3NOYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsb2NraWZ5KG5vZGU6IEh0bWxFbGVtZW50KTogdm9pZCB7XG4gIGlmICghbm9kZS5zdHlsZXM/LlsnZGlzcGxheSddKSBzZXRTdHlsZShub2RlLCAnZGlzcGxheScsICdibG9jaycpO1xuICBlbHNlIHtcbiAgICBjb25zdCBkaXNwbGF5ID0gbm9kZS5zdHlsZXNbJ2Rpc3BsYXknXTtcbiAgICBzZXRTdHlsZShcbiAgICAgIG5vZGUsXG4gICAgICAnZGlzcGxheScsXG4gICAgICBkaXNwbGF5ID09PSAnaW5saW5lJyA/ICdibG9jaycgOiBkaXNwbGF5LnJlcGxhY2UoL2lubGluZS0vLCAnJylcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5NYWtlSW1nKGZpbGxzOiAoUGFpbnQgfCBSZXN0UGFpbnQpW10pOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBmaWxscy5sZW5ndGggPT09IDEgJiZcbiAgICBmaWxsc1swXS50eXBlID09PSAnSU1BR0UnICYmXG4gICAgZmlsbHNbMF0uc2NhbGVNb2RlICE9PSAnVElMRSdcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbk1ha2VWaWRlbyhmaWxscz86IHJlYWRvbmx5IChQYWludCB8IFJlc3RQYWludClbXSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIGZpbGxzPy5sZW5ndGggPT09IDEgJiZcbiAgICBmaWxsc1swXS50eXBlID09PSAnVklERU8nICYmXG4gICAgZmlsbHNbMF0uc2NhbGVNb2RlICE9PSAnVElMRSdcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmlsdGVyZWRQYWludChmaWxsOiBQYWludCB8IFJlc3RQYWludCk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIGZpbGwudHlwZSA9PT0gJ0lNQUdFJyAmJlxuICAgIChoYXNGaWx0ZXIoZmlsbC5maWx0ZXJzKSB8fCAoZmlsbC5vcGFjaXR5ID8/IDEpICE9PSAxKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzRmlsdGVyKGZpbHRlcnM/OiBJbWFnZUZpbHRlcnMpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICAhIWZpbHRlcnMgJiZcbiAgICAhIShcbiAgICAgIGZpbHRlcnMuY29udHJhc3QgfHxcbiAgICAgIGZpbHRlcnMuZXhwb3N1cmUgfHxcbiAgICAgIGZpbHRlcnMuaGlnaGxpZ2h0cyB8fFxuICAgICAgZmlsdGVycy5zYXR1cmF0aW9uIHx8XG4gICAgICBmaWx0ZXJzLnNoYWRvd3MgfHxcbiAgICAgIGZpbHRlcnMudGVtcGVyYXR1cmUgfHxcbiAgICAgIGZpbHRlcnMudGludFxuICAgIClcbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldFBhcmVudCA9IChjdHg6IE1hcHBpbmdFeGVjQ29udGV4dCk6IEh0bWxFbGVtZW50IHwgdW5kZWZpbmVkID0+XG4gIGN0eC5wYXJlbnRzW2N0eC5wYXJlbnRzLmxlbmd0aCAtIDFdO1xuXG5leHBvcnQgZnVuY3Rpb24gc2FtZUZpbHRlcihhPzogSW1hZ2VGaWx0ZXJzLCBiPzogSW1hZ2VGaWx0ZXJzKTogYm9vbGVhbiB7XG4gIGlmIChhID09PSBiKSByZXR1cm4gdHJ1ZTtcbiAgY29uc3QgaGFzQSA9IGhhc0ZpbHRlcihhKTtcbiAgY29uc3QgaGFzQiA9IGhhc0ZpbHRlcihiKTtcbiAgaWYgKGhhc0EgJiYgaGFzQikge1xuICAgIHJldHVybiAoXG4gICAgICBhIS5jb250cmFzdCA9PT0gYiEuY29udHJhc3QgJiZcbiAgICAgIGEhLmV4cG9zdXJlID09PSBiIS5leHBvc3VyZSAmJlxuICAgICAgYSEuaGlnaGxpZ2h0cyA9PT0gYiEuaGlnaGxpZ2h0cyAmJlxuICAgICAgYSEuc2F0dXJhdGlvbiA9PT0gYiEuc2F0dXJhdGlvbiAmJlxuICAgICAgYSEuc2hhZG93cyA9PT0gYiEuc2hhZG93cyAmJlxuICAgICAgYSEudGVtcGVyYXR1cmUgPT09IGIhLnRlbXBlcmF0dXJlICYmXG4gICAgICBhIS50aW50ID09PSBiIS50aW50XG4gICAgKTtcbiAgfVxuICByZXR1cm4gaGFzQSA9PT0gaGFzQjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGxPcGFjaXR5RmlsdGVyKGZpbGw6IFBhaW50IHwgUmVzdFBhaW50IHwgdW5kZWZpbmVkKTogbnVtYmVyIHtcbiAgcmV0dXJuIChmaWxsPy50eXBlID09PSAnSU1BR0UnICYmIGZpbGwub3BhY2l0eSkgfHwgMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5lZWRUb1NwbGl0RmlsbHMoXG4gIG5vZGU6IFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGUsXG4gIGZpbGxzOiAoUGFpbnQgfCBSZXN0UGFpbnQpW11cbik6IGJvb2xlYW4ge1xuICBpZiAoIWZpbGxzLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICBpZiAoZmlsbHMuZXZlcnkoKGl0KSA9PiAhaXNGaWx0ZXJlZFBhaW50KGl0KSkpIHJldHVybiBmYWxzZTtcbiAgLy8gaWYgY2hpbGRyZW4sIG5lZWQgdG8gc3BsaXQgZmlsbHMgdG8gdXNlIENTUyBmaWx0ZXIgKG90aGVyd2lzZSBmaWx0ZXIvb3BhY2l0eSB3b3VsZCBhcHBseSB0byBjaGlsZHJlbiBhcyB3ZWxsKVxuICBpZiAoaGFzQ2hpbGRyZW4obm9kZSkpIHJldHVybiB0cnVlO1xuICAvLyAxIGZpbGwgd2l0aCBmaWx0ZXIsIG5vIGNoaWxkcmVuIC0+IGNhbiB1c2UgQ1NTIGZpbHRlciZvcGFjaXR5XG4gIGlmIChmaWxscy5sZW5ndGggPT09IDEpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNDaGlsZHJlbihub2RlOiBCYXNlTm9kZSB8IFJlc3RCYXNlTm9kZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gJ2NoaWxkcmVuJyBpbiBub2RlICYmIG5vZGUuY2hpbGRyZW4/Lmxlbmd0aCA+IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROb2RlT3BhY2l0eShcbiAgY3R4OiBNYXBwaW5nRXhlY0NvbnRleHQsXG4gIG5vZGU6IFNjZW5lTm9kZVxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCdvcGFjaXR5JyBpbiBub2RlKSB7XG4gICAgaWYgKG5vZGUuYm91bmRWYXJpYWJsZXM/Lm9wYWNpdHkpIHtcbiAgICAgIGNvbnN0IG9wYWNpdHk6IENzc1ZhbHVlVmFyID0ge1xuICAgICAgICB0eXBlOiAnVkFSSUFCTEUnLFxuICAgICAgICB2YXJpYWJsZTogbm9kZS5ib3VuZFZhcmlhYmxlcy5vcGFjaXR5LFxuICAgICAgICB1bml0OiAnJyxcbiAgICAgIH07XG4gICAgICByZXR1cm4gYGNhbGMoJHtjc3NWYWx1ZVRvU3RyaW5nKFtvcGFjaXR5XSwgY3R4KX0gLyAxMDApYDtcbiAgICB9IGVsc2UgaWYgKG5vZGUub3BhY2l0eSAhPT0gMSkgcmV0dXJuIFN0cmluZyhyb3VuZFRvKG5vZGUub3BhY2l0eSwgMTAwKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ3NzRmlsdGVycyhmaWx0ZXJzPzogSW1hZ2VGaWx0ZXJzKTogc3RyaW5nW10ge1xuICBjb25zdCBjc3NGaWx0ZXJzOiBzdHJpbmdbXSA9IFtdO1xuICBpZiAoaGFzRmlsdGVyKGZpbHRlcnMpKSB7XG4gICAgY29uc3QgeyBjb250cmFzdCwgc2F0dXJhdGlvbiwgZXhwb3N1cmUgfSA9IGZpbHRlcnMhO1xuICAgIGlmIChjb250cmFzdCkge1xuICAgICAgLy8gLTEgLT4gMSA9PT4gMC44IC0+IDEuMiAoYXBwcm94ID8pXG4gICAgICBjc3NGaWx0ZXJzLnB1c2goYGNvbnRyYXN0KCR7MC44ICsgKGNvbnRyYXN0ICsgMSkgLyA1fSlgKTtcbiAgICB9XG4gICAgaWYgKHNhdHVyYXRpb24pIHtcbiAgICAgIC8vIC0xIC0+IDEgPT0+IDAgLT4gMiAoYXBwcm94ID8pXG4gICAgICBjc3NGaWx0ZXJzLnB1c2goYHNhdHVyYXRlKCR7c2F0dXJhdGlvbiArIDF9KWApO1xuICAgIH1cbiAgICBpZiAoZXhwb3N1cmUpIHtcbiAgICAgIC8vIC0xIC0+IDEgPT0+IDAuMSAtPiA2IChmaWdtYSBhbGdvcml0aG0gc2VlbXMgZGlmZmVyZW50KVxuICAgICAgY3NzRmlsdGVycy5wdXNoKFxuICAgICAgICBgYnJpZ2h0bmVzcygke1xuICAgICAgICAgIGV4cG9zdXJlIDwgMCA/IDAuMSArICgoZXhwb3N1cmUgKyAxKSAqIDkpIC8gMTAgOiAxICsgZXhwb3N1cmUgKiA1XG4gICAgICAgIH0pYFxuICAgICAgKTtcbiAgICB9XG4gICAgLy8gVE9ETyBzdXBwb3J0IG90aGVyIGZpZ21hIGZpbHRlcnMgc29tZWhvdyA/XG4gICAgLy8gZWl0aGVyIGJ5IGV4cG9ydGluZyBmaWdtYSB0cmFuc2Zvcm1lZCBpbWFnZSwgb3IgdXNpbmcgU1ZHIGltYWdlICYgZmlsdGVycyB3aGljaCBhcmUgbW9yZSBjYXBhYmxlID9cbiAgfVxuICByZXR1cm4gY3NzRmlsdGVycztcbn1cblxuZXhwb3J0IGNvbnN0IEVNQkVEX05BTUUgPSAnPGVtYmVkPic7XG5cbmV4cG9ydCBjb25zdCBpc0VtYmVkID0gKG46IHsgbmFtZTogc3RyaW5nOyBmMndEYXRhPzogRjJ3RGF0YSB9KTogYm9vbGVhbiA9PlxuICBuLm5hbWUgPT09IEVNQkVEX05BTUUgfHwgISFuLmYyd0RhdGE/LnVuc2FmZUh0bWw7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRFbWJlZFJlbGF1Y2hEYXRhKG5vZGU6IFNjZW5lTm9kZSk6IHZvaWQge1xuICAvLyBSZWxhdW5jaEFjdGlvbnMuRURJVCBub3QgYWNjZXNzaWJsZSBmcm9tIGhlcmVcbiAgaWYgKCFub2RlLmdldFJlbGF1bmNoRGF0YSgpLmVkaXQpIHtcbiAgICBub2RlLnNldFJlbGF1bmNoRGF0YSh7IGVkaXQ6ICdFZGl0IGVtYmVkIEhUTUwnIH0pO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRGMndEYXRhKFxuICBub2RlOiBTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlXG4pOiBQcm9taXNlPEYyd0RhdGE+IHtcbiAgY29uc3QgZjJ3RGF0YSA9IGF3YWl0IGdldFNoYXJlZERhdGFPYmo8RjJ3RGF0YSB8IHVuZGVmaW5lZD4oXG4gICAgbm9kZSxcbiAgICBGMndOYW1lc3BhY2UsXG4gICAgRjJ3RGF0YUtleSxcbiAgICB1bmRlZmluZWRcbiAgKTtcbiAgaWYgKGYyd0RhdGEpIHJldHVybiBmMndEYXRhO1xuXG4gIC8vIGh0dHBzOi8vd3d3LmZpZ21hLmNvbS9jb21tdW5pdHkvcGx1Z2luLzEzNTY2OTM4MDg5MzIzOTI3MjkvdGFncy1hdHRyaWJ1dGVzLWF0dGFjaC1zZW1hbnRpYy1kYXRhLXRvLXlvdXItZGVzaWduLWVsZW1lbnRzLWFuZC1lbnN1cmUtYS1zZWFtbGVzcy1kZXYtaGFuZG9mZlxuICBjb25zdCBmaWdtYUF0dHJzID0gYXdhaXQgZ2V0U2hhcmVkRGF0YU9iajxhbnk+KFxuICAgIG5vZGUsXG4gICAgJ2ZpZ21hLmF0dHJpYnV0ZXMnLFxuICAgICdhdHRyaWJ1dGVzJyxcbiAgICB1bmRlZmluZWRcbiAgKTtcbiAgaWYgKGZpZ21hQXR0cnMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdGFnOiBmaWdtYUF0dHJzLnRhZyxcbiAgICAgIGF0dHI6IGZpZ21hQXR0cnMuYXR0cmlidXRlcyxcbiAgICB9O1xuICB9XG4gIHJldHVybiB7fTtcbn1cblxubGV0IGN1cnJlbnRfZ3VpZCA9IDE7XG5jb25zdCBkZWJ1Z19jYWNoZTogUmVjb3JkPHN0cmluZywgSHRtbEVsZW1lbnQ+ID0ge307XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVHdWlkKGVsdDogSHRtbEVsZW1lbnQpOiBzdHJpbmcge1xuICBjb25zdCBndWlkID0gKGVsdC5ndWlkIHx8PSBTdHJpbmcobmV4dEd1aWQoKSkpO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBkZWJ1Z19jYWNoZVtndWlkXSA9IGVsdDtcbiAgfVxuICByZXR1cm4gZ3VpZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeUFuaW1hdGVkRWxlbWVudHNBcmVJbkRvbShcbiAgYm9keTogSHRtbEVsZW1lbnQsXG4gIHJlYWN0aW9uczogUmVjb3JkPHN0cmluZywgRE9NRjJ3QWN0aW9uPlxuKTogdm9pZCB7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIHRyYXZlcnNlRWxlbWVudChib2R5LCAoZWwpID0+IHtcbiAgICAgIChlbCBhcyBhbnkpLiRkb20gPSB0cnVlO1xuICAgICAgaWYgKCd0YWcnIGluIGVsKSB7XG4gICAgICAgIGVsLmNoaWxkcmVuPy5mb3JFYWNoKChjKSA9PiAndGFnJyBpbiBjICYmICgoYyBhcyBhbnkpLiRwYXJlbnQgPSBlbCkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGZvciAoY29uc3QgYSBvZiBjcmF3bEFjdGlvbnMoT2JqZWN0LnZhbHVlcyhyZWFjdGlvbnMpKSkge1xuICAgICAgaWYgKGEudHlwZSA9PT0gJ0FOSU1BVEUnKSB7XG4gICAgICAgIGZvciAoY29uc3QgYiBvZiBhLmFuaW1hdGlvbnMpIHtcbiAgICAgICAgICBjb25zdCBlbHQgPSBkZWJ1Z19jYWNoZVtiLmVsdElkXTtcbiAgICAgICAgICBpZiAoIShlbHQgYXMgYW55KT8uJGRvbSkge1xuICAgICAgICAgICAgc2hvdWxkTm90SGFwcGVuKGBFbGVtZW50ICR7Yi5lbHRJZH0gaXMgbm90IGluIHRoZSBET01gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGIuYWx0SWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGFsdCA9IGRlYnVnX2NhY2hlW2IuYWx0SWRdO1xuICAgICAgICAgICAgaWYgKCEoYWx0IGFzIGFueSk/LiRkb20pIHtcbiAgICAgICAgICAgICAgc2hvdWxkTm90SGFwcGVuKGBFbGVtZW50ICR7Yi5hbHRJZH0gaXMgbm90IGluIHRoZSBET01gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdHJhdmVyc2VFbGVtZW50KGJvZHksIChlbCkgPT4ge1xuICAgICAgZGVsZXRlIChlbCBhcyBhbnkpLiRkb207XG4gICAgICBkZWxldGUgKGVsIGFzIGFueSkuJHBhcmVudDtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV4dEd1aWQoKTogbnVtYmVyIHtcbiAgcmV0dXJuIGN1cnJlbnRfZ3VpZCsrO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0Tm9kZVBhcmFtcyhcbiAgaHRtbDogSHRtbEVsZW1lbnQsXG4gIG5vZGU6IFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGUsXG4gIGN0eDogTWFwcGluZ0V4ZWNDb250ZXh0XG4pOiB2b2lkIHtcbiAgaHRtbC5ub2RlID0gbm9kZVByb3BzKG5vZGUsIGN0eC5zY2FsZSk7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGh0bWwucGF0aCA9IGN0eC5wYXRoO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub2RlUHJvcHMoXG4gIG5vZGU6IFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGUsXG4gIHNjYWxlID0gMVxuKTogTm9kZVByb3BzIHtcbiAgY29uc3QgeyBpZCwgdHlwZSwgbmFtZSB9ID0gbm9kZTtcbiAgY29uc3QgeyB4OiB3aWR0aCwgeTogaGVpZ2h0IH0gPSBnZXRTaXplKG5vZGUsIHNjYWxlKTtcbiAgY29uc3QgeyB4LCB5IH0gPSBnZXRPZmZzZXQobm9kZSwgc2NhbGUpO1xuICBjb25zdCBub2RlUHJvcHM6IE5vZGVQcm9wcyA9IHsgaWQsIHR5cGUsIHdpZHRoLCBoZWlnaHQsIHgsIHkgfTtcbiAgaWYgKChub2RlIGFzIEJsZW5kTWl4aW4pLmlzTWFzaykgbm9kZVByb3BzLmlzTWFzayA9IHRydWU7XG4gIGlmIChub2RlLnR5cGUgIT09ICdURVhUJyB8fCAhKG5vZGUgYXMgVGV4dE5vZGUpLmF1dG9SZW5hbWUpXG4gICAgbm9kZVByb3BzLm5hbWUgPSBuYW1lO1xuICByZXR1cm4gbm9kZVByb3BzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGVJZChpZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuICdUJyArIGlkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24qIGNyYXdsQWN0aW9uczxUPihcbiAgaXQ6IEl0ZXJhYmxlPEJhc2VGMndBY3Rpb248VD4+XG4pOiBHZW5lcmF0b3I8QmFzZUYyd0FjdGlvbjxUPj4ge1xuICBmb3IgKGNvbnN0IGEgb2YgaXQpIHtcbiAgICB5aWVsZCBhO1xuICAgIGlmIChhLnR5cGUgPT09ICdDT05ESVRJT05BTCcpIHtcbiAgICAgIGZvciAoY29uc3QgYiBvZiBhLmNvbmRpdGlvbmFsQmxvY2tzKSB7XG4gICAgICAgIHlpZWxkKiBjcmF3bEFjdGlvbnMoYi5hY3Rpb25zKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGEudHlwZSA9PT0gJ0tFWV9DT05ESVRJT04nKSB7XG4gICAgICB5aWVsZCogY3Jhd2xBY3Rpb25zKGEuYWN0aW9ucyk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogY3Jhd2xBbmltYXRpb25zPFQ+KFxuICBpdDogUmVjb3JkPGFueSwgQmFzZUYyd0FjdGlvbjxUPj4sXG4gIHJldmVyc2UgPSBmYWxzZVxuKTogR2VuZXJhdG9yPFQ+IHtcbiAgY29uc3QgYXJyID0gT2JqZWN0LnZhbHVlcyhpdCk7XG4gIGlmIChyZXZlcnNlKSBhcnIucmV2ZXJzZSgpO1xuICBmb3IgKGNvbnN0IGEgb2YgY3Jhd2xBY3Rpb25zPFQ+KGFycikpIHtcbiAgICBpZiAoYS50eXBlID09PSAnQU5JTUFURScpIHtcbiAgICAgIGZvciAoY29uc3QgYiBvZiBhLmFuaW1hdGlvbnMpIHtcbiAgICAgICAgeWllbGQgYjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgVHJhdmVyc2VDYiA9IChcbiAgbm9kZTogSHRtbEVsZW1lbnQsXG4gIHBhcmVudD86IEh0bWxFbGVtZW50XG4pID0+IHZvaWQgfCBib29sZWFuO1xuXG5leHBvcnQgZnVuY3Rpb24gdHJhdmVyc2VFbGVtZW50cyhcbiAgcm9vdHM6IEh0bWxOb2RlW10sXG4gIC4uLmNiczogVHJhdmVyc2VDYltdXG4pOiB2b2lkIHtcbiAgY2JzLmZvckVhY2goKGNiKSA9PiByb290cy5mb3JFYWNoKChyKSA9PiB0cmF2ZXJzZUVsZW1lbnQociwgY2IpKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmF2ZXJzZUVsZW1lbnQocm9vdDogSHRtbE5vZGUsIGNiOiBUcmF2ZXJzZUNiKTogdm9pZCB7XG4gIGNvbnN0IHN0YWNrID1cbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IG5ldyBTZXQ8SHRtbE5vZGU+KCkgOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHRyYXZlcnNlTm9kZSA9IChub2RlOiBIdG1sTm9kZSwgcGFyZW50PzogSHRtbEVsZW1lbnQpOiB2b2lkID0+IHtcbiAgICBpZiAoc3RhY2s/Lmhhcyhub2RlKSkge1xuICAgICAgc2hvdWxkTm90SGFwcGVuKCdDeWNsaW5nIGVsZW1lbnQgdHJlZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFjaz8uYWRkKG5vZGUpO1xuICAgIH1cbiAgICBpZiAoJ3RhZycgaW4gbm9kZSkge1xuICAgICAgaWYgKGNiKG5vZGUsIHBhcmVudCkpIHJldHVybjtcbiAgICAgIChub2RlLmNoaWxkcmVuIHx8IFtdKS5mb3JFYWNoKChpdCkgPT4gdHJhdmVyc2VOb2RlKGl0LCBub2RlKSk7XG4gICAgfVxuICB9O1xuICB0cmF2ZXJzZU5vZGUocm9vdCwgdW5kZWZpbmVkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ3NzKFxuICB0YXJnZXQ6IHN0cmluZyxcbiAgdmFyczogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkPixcbiAgaW5kZW50Pzogc3RyaW5nXG4pOiBzdHJpbmcge1xuICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXModmFycyk7XG4gIGlmICghZW50cmllcy5sZW5ndGgpIHJldHVybiAnJztcbiAgbGV0IGxpbmVzID0gW1xuICAgIHRhcmdldCArICcgeycsXG4gICAgLi4uZW50cmllc1xuICAgICAgLmZpbHRlcigoWywgdl0pID0+IHYgIT09IHVuZGVmaW5lZCAmJiB2ICE9PSAnJylcbiAgICAgIC5tYXAoKFtrLCB2XSkgPT4gYCAgJHtrfTogJHt2fTtgKSxcbiAgICAnfScsXG4gIF07XG4gIGlmIChpbmRlbnQpIGxpbmVzID0gbGluZXMubWFwKChsKSA9PiBpbmRlbnQgKyBsKTtcbiAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hpbmdOb2RlczxUPihcbiAgdmFyaWFudHNXaXRoUHJvcHM6IHsgbm9kZTogVDsgcHJvcHM6IFZhbGlkVmFyaWFudFByb3BlcnRpZXMgfVtdLFxuICBuZXdQcm9wczogVmFsaWRWYXJpYW50UHJvcGVydGllcyxcbiAgY3VycmVudFByb3BzOiBWYWxpZFZhcmlhbnRQcm9wZXJ0aWVzXG4pOiBUW10ge1xuICBjb25zdCBuZXdFbnRyaWVzID0gT2JqZWN0LmVudHJpZXMobmV3UHJvcHMpO1xuICBjb25zdCBjdXJyZW50RW50cmllcyA9IE9iamVjdC5lbnRyaWVzKGN1cnJlbnRQcm9wcyk7XG4gIGNvbnN0IHNhbWUgPSAoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBib29sZWFuID0+XG4gICAgYS5sb2NhbGVDb21wYXJlKGIsIHVuZGVmaW5lZCwgeyBzZW5zaXRpdml0eTogJ2FjY2VudCcgfSkgPT09IDA7XG4gIHJldHVybiB2YXJpYW50c1dpdGhQcm9wc1xuICAgIC5maWx0ZXIoKHsgcHJvcHMgfSkgPT4gbmV3RW50cmllcy5ldmVyeSgoW2ssIHZdKSA9PiBzYW1lKHYsIHByb3BzW2tdKSkpXG4gICAgLm1hcCgoeyBub2RlLCBwcm9wcyB9KSA9PiAoe1xuICAgICAgc2NvcmU6IGN1cnJlbnRFbnRyaWVzLmZpbHRlcigoW2ssIHZdKSA9PiBzYW1lKHYsIHByb3BzW2tdKSkubGVuZ3RoLFxuICAgICAgbm9kZSxcbiAgICB9KSlcbiAgICAuc29ydCgoYSwgYikgPT4gYi5zY29yZSAtIGEuc2NvcmUpXG4gICAgLm1hcCgodikgPT4gdi5ub2RlKTtcbn1cblxuLy8gUmV0dXJuIG1heCBmaXhlZCBzaXplIGluIHRoZSBmb3JtYXQgXCIxNDBweFwiIGlmIHRoZXJlIGlzIGEgY2xhbXAgaW4gd2lkdGggZm9yIHRoaXMgZWxlbWVudFxuLy8gT3RoZXJ3aXNlIHJldHVybiB1bmRlZmluZWQuXG5leHBvcnQgZnVuY3Rpb24gbWF4Rml4ZWRXaWR0aE9mRWxlbWVudChcbiAgZWw6IEh0bWxFbGVtZW50IHwgdW5kZWZpbmVkLFxuICBwYXJlbnRlbDogSHRtbEVsZW1lbnQgfCB1bmRlZmluZWRcbik6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHcgPSBlbD8uc3R5bGVzPy53aWR0aDtcbiAgY29uc3QgbWF4dyA9IGVsPy5zdHlsZXM/LlsnbWF4LXdpZHRoJ107XG4gIGNvbnN0IHBfdyA9IHBhcmVudGVsPy5zdHlsZXM/LndpZHRoO1xuICBjb25zdCBwX21heHcgPSBwYXJlbnRlbD8uc3R5bGVzPy5bJ21heC13aWR0aCddO1xuXG4gIC8vIENoZWNrIGV2ZXJ5IHZhbHVlIGluIG9yZGVyXG4gIC8vIE5vdGU6IFRoaXMgd29ya3MgYmVjYXVzZSB3aWR0aCBhbmQgbWF4V2lkdGggd2lsbCBhbHdheXMgaGF2ZVxuICAvLyBgLi4ucHhgIG9yIGAuLi4lYCBhcyB2YWx1ZXMuXG4gIGNvbnN0IHZhbHVlcyA9IFt3LCBtYXh3LCBwX3csIHBfbWF4d107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgdiA9IHZhbHVlc1tpXTtcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSBjb250aW51ZTtcbiAgICBpZiAodi5lbmRzV2l0aCgnJScpKSBjb250aW51ZTtcbiAgICBpZiAodi5lbmRzV2l0aCgncHgnKSkgcmV0dXJuIHBhcnNlSW50KHYsIDEwKTtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qXG4gKiBSZXR1cm4gbWF4IGZpeGVkIHNpemUgaW4gdGhlIGZvcm1hdCBcIjE0MHB4XCIgaWYgdGhlcmUgaXMgYSBjbGFtcCBpbiB3aWR0aCBmb3IgdGhpcyBlbGVtZW50XG4gKiBPdGhlcndpc2UgcmV0dXJuIHVuZGVmaW5lZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1heEZpeGVkSGVpZ2h0T2ZFbGVtZW50KFxuICBlbDogSHRtbEVsZW1lbnQgfCB1bmRlZmluZWQsXG4gIHBhcmVudGVsOiBIdG1sRWxlbWVudCB8IHVuZGVmaW5lZFxuKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgaCA9IGVsPy5zdHlsZXM/LmhlaWdodDtcbiAgY29uc3QgbWF4aCA9IGVsPy5zdHlsZXM/LlsnbWF4LWhlaWdodCddO1xuICBjb25zdCBwX2ggPSBwYXJlbnRlbD8uc3R5bGVzPy5oZWlnaHQ7XG4gIGNvbnN0IHBfbWF4aCA9IHBhcmVudGVsPy5zdHlsZXM/LlsnbWF4LWhlaWdodCddO1xuXG4gIC8vIENoZWNrIGV2ZXJ5IHZhbHVlIGluIG9yZGVyXG4gIC8vIE5vdGU6IFRoaXMgd29ya3MgYmVjYXVzZSBoZWlnaHQgYW5kIG1heGhlaWdodCB3aWxsIGFsd2F5cyBoYXZlXG4gIC8vIGAuLi5weGAgb3IgYC4uLiVgIGFzIHZhbHVlcy5cbiAgY29uc3QgdmFsdWVzID0gW2gsIG1heGgsIHBfaCwgcF9tYXhoXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB2ID0gdmFsdWVzW2ldO1xuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgIGlmICh2LmVuZHNXaXRoKCclJykpIGNvbnRpbnVlO1xuICAgIGlmICh2LmVuZHNXaXRoKCdweCcpKSByZXR1cm4gcGFyc2VJbnQodiwgMTApO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiIsICJleHBvcnQgY29uc3QgcmVhY3Rpb25fdHlwZXMgPSBbXG4gICdzdWJtaXQnLFxuICAnYXBwZWFyJyxcbiAgJ21vdXNlZG93bicsXG4gICdtb3VzZWVudGVyJyxcbiAgJ21vdXNlbGVhdmUnLFxuICAnbW91c2V1cCcsXG4gICd0aW1lb3V0JyxcbiAgJ2NsaWNrJyxcbiAgJ3ByZXNzJyxcbiAgJ2RyYWcnLFxuICAna2V5ZG93bicsXG4gICdob3ZlcicsXG5dIGFzIGNvbnN0O1xuXG5leHBvcnQgdHlwZSBUcmlnZ2VyVHlwZSA9ICh0eXBlb2YgcmVhY3Rpb25fdHlwZXMpW251bWJlcl07XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIG9uY2U8VCBleHRlbmRzICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD4oXG4gIHJ1bjogVCB8IG51bGwgfCB1bmRlZmluZWQgfCB2b2lkXG4pOiBUIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFydW4pIHJldHVybjtcbiAgcmV0dXJuICgoLi4uYXJncykgPT4ge1xuICAgIGlmICghcnVuKSByZXR1cm47XG4gICAgY29uc3QgdG9SdW4gPSBydW47XG4gICAgcnVuID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiB0b1J1biguLi5hcmdzKTtcbiAgfSkgYXMgVDtcbn1cbiIsICJleHBvcnQgdHlwZSBDbGVhbnVwRm4gPSAoKSA9PiB2b2lkO1xuZXhwb3J0IHR5cGUgQm91bmRFbGVtZW50ID0gU1ZHRWxlbWVudCB8IEhUTUxFbGVtZW50O1xuY29uc3QgaXNCb3VuZEVsZW1lbnQgPSAoZTogYW55KTogZSBpcyBCb3VuZEVsZW1lbnQgPT5cbiAgZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IGUgaW5zdGFuY2VvZiBTVkdFbGVtZW50O1xuXG5mdW5jdGlvbiBvbkRpc2Nvbm5lY3RlZChlOiBCb3VuZEVsZW1lbnQsIGNiOiBDbGVhbnVwRm4gfCB2b2lkKTogdm9pZCB7XG4gIGlmICghZS5wYXJlbnRFbGVtZW50KSByZXR1cm47IC8vIGFscmVhZHkgcmVtb3ZlZFxuICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucy5maWx0ZXIoKG0pID0+IG0udHlwZSA9PT0gJ2NoaWxkTGlzdCcpKVxuICAgICAgZm9yIChjb25zdCBub2RlIG9mIG11dGF0aW9uLnJlbW92ZWROb2RlcylcbiAgICAgICAgaWYgKG5vZGUgPT09IGUpIHtcbiAgICAgICAgICBjYj8uKCk7XG4gICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG4gIH0pO1xuICBvYnNlcnZlci5vYnNlcnZlKGUucGFyZW50RWxlbWVudCwgeyBjaGlsZExpc3Q6IHRydWUgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkNvbm5lY3RlZChcbiAgc2VsZWN0b3I6IHN0cmluZyxcbiAgY2I6IChlOiBCb3VuZEVsZW1lbnQpID0+IENsZWFudXBGbiB8IHZvaWRcbik6ICgpID0+IHZvaWQge1xuICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICBmb3IgKGNvbnN0IG11dGF0aW9uIG9mIG11dGF0aW9ucy5maWx0ZXIoKG0pID0+IG0udHlwZSA9PT0gJ2NoaWxkTGlzdCcpKVxuICAgICAgZm9yIChjb25zdCBuIG9mIG11dGF0aW9uLmFkZGVkTm9kZXMpXG4gICAgICAgIGlmIChpc0JvdW5kRWxlbWVudChuKSAmJiBuLm1hdGNoZXMoc2VsZWN0b3IpKSBvbkRpc2Nvbm5lY3RlZChuLCBjYihuKSk7XG4gIH0pO1xuICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7IGNoaWxkTGlzdDogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcbiAgcmV0dXJuICgpID0+IG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEZyYW1lTGlrZU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdHlwZSB7XG4gIFJlc3RCYXNlTm9kZSxcbiAgUmVzdFNjZW5lTm9kZSxcbiAgUmVzdFRleHROb2RlLFxufSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdXRpbHMvc3JjL2ZpZ21hLnJlc3QudHlwaW5ncyc7XG5pbXBvcnQgeyBhc3NlcnRUaGF0IH0gZnJvbSAnQGRpdnJpb3RzL3V0aWxzL2Fzc2VydCc7XG5pbXBvcnQgeyBub25lT3JOdWxsIH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXV0aWxzL3V0aWxzJztcbmltcG9ydCB7XG4gIGdldENoaWxkcmVuLFxuICBpc0ZyYW1lTGlrZSxcbn0gZnJvbSAnQGRpdnJpb3RzL3N0b3J5LXRvLWZpZ21hL2hlbHBlcnMvbm9kZXMnO1xuaW1wb3J0IHtcbiAgbGF5b3V0U2l6aW5nQ291bnRlcixcbiAgbGF5b3V0U2l6aW5nSG9yaXpvbnRhbCxcbiAgbGF5b3V0U2l6aW5nUHJpbWFyeSxcbiAgbGF5b3V0U2l6aW5nVmVydGljYWwsXG59IGZyb20gJ0BkaXZyaW90cy9maWdtYS11dGlscy9zcmMvbGF5b3V0U2l6aW5nJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZE1vdmVOZWdhdGl2ZUdhcFRvQ2hpbGRNYXJnaW4oXG4gIG5vZGU6IEZyYW1lTGlrZU5vZGVcbik6IGJvb2xlYW4ge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBhc3NlcnRUaGF0KCgpID0+ICFub25lT3JOdWxsKG5vZGUubGF5b3V0TW9kZSksICdvbmx5IGZvciBhdXRvbGF5b3V0IG5vZGVzJyk7XG4gIH1cbiAgcmV0dXJuIChcbiAgICBub2RlLnByaW1hcnlBeGlzQWxpZ25JdGVtcyAhPT0gJ1NQQUNFX0JFVFdFRU4nICYmXG4gICAgISFub2RlLml0ZW1TcGFjaW5nICYmXG4gICAgbm9kZS5pdGVtU3BhY2luZyA8IDBcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZFVzZUFic29sdXRlUG9zaXRpb25Gb3JBdXRvTGF5b3V0KFxuICBub2RlOiBTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlXG4pOiBib29sZWFuIHtcbiAgLy8gbWFwIHNwYWNlLWJldHdlZW4gd2l0aCBsZXNzIHRoYW4gMiBjaGlsZHJlbiBpbnRvIGFic29sdXRlIHBvc2l0aW9uaW5nXG4gIGlmIChcbiAgICAhbm9uZU9yTnVsbCgobm9kZSBhcyBBdXRvTGF5b3V0TWl4aW4pLmxheW91dE1vZGUpICYmXG4gICAgKG5vZGUgYXMgQXV0b0xheW91dE1peGluKS5wcmltYXJ5QXhpc0FsaWduSXRlbXMgPT09ICdTUEFDRV9CRVRXRUVOJyAmJlxuICAgIChub2RlIGFzIEF1dG9MYXlvdXRNaXhpbikubGF5b3V0V3JhcCAhPT0gJ1dSQVAnICYmXG4gICAgbGF5b3V0U2l6aW5nSG9yaXpvbnRhbChub2RlIGFzIFNjZW5lTm9kZSkgPT09ICdGSVhFRCcgJiZcbiAgICBsYXlvdXRTaXppbmdWZXJ0aWNhbChub2RlIGFzIFNjZW5lTm9kZSkgPT09ICdGSVhFRCdcbiAgKSB7XG4gICAgY29uc3QgYXV0b2xheW91dENoaWxkcmVuID0gZ2V0QXV0b0xheW91dFZpc2libGVDaGlsZHJlbihub2RlKTtcbiAgICByZXR1cm4gKFxuICAgICAgLy8gU2hvdWxkIHdvcmsgZm9yIDEgY2hpbGQgYXMgd2VsbCwgYnV0IG5vdCBzdXJlIGl0IGhhcyBhbnkgYmVuZWZpdCBvdmVyIGZsZXhcbiAgICAgIC8vIENvdWxkIGJlIHVzZWZ1bCBpZiB0aGVyZSdzIGFuIGFuaW1hdGlvbiBzd2FwcGluZyBiZXR3ZWVuIDEgYW5kIDIgY2hpbGRyZW5cbiAgICAgIGF1dG9sYXlvdXRDaGlsZHJlbi5sZW5ndGggPT09IDIgJiZcbiAgICAgIC8vIElmIGEgY2hpbGQgaXMgRklMTCwgZmxleCB3aWxsIHdvcmsganVzdCBmaW5lIChubyBuZWdhdGl2ZSBwYWRkaW5nLCB1bmxlc3Mgc29tZSBtaW4tc2l6ZSBpcyBpbnZvbHZlZClcbiAgICAgIC8vIEFuZCBhbnl3YXkgMTAwJSBzaXplIHdpbGwgTk9UIHdvcmsgaW4gdGhpcyBjYXNlIHdpdGggYWJzb2x1dGUgcG9zaXRpb25pbmdcbiAgICAgICFhdXRvbGF5b3V0Q2hpbGRyZW4uc29tZShcbiAgICAgICAgKGl0KSA9PlxuICAgICAgICAgIGxheW91dFNpemluZ1ByaW1hcnkobm9kZSBhcyBTY2VuZU5vZGUsIGl0IGFzIFNjZW5lTm9kZSkgPT09ICdGSUxMJyB8fFxuICAgICAgICAgIC8vIFRPRE86IFRoaXMgb25lIHdlIGNvdWxkIHN1cHBvcnQsIGJ1dCB3ZSdkIGhhdmUgdG8gcmVtb3ZlIHBhZGRpbmdzIGZyb20gJSBjaGlsZCBkaW1lbnNpb25zXG4gICAgICAgICAgbGF5b3V0U2l6aW5nQ291bnRlcihub2RlIGFzIFNjZW5lTm9kZSwgaXQgYXMgU2NlbmVOb2RlKSA9PT0gJ0ZJTEwnXG4gICAgICApXG4gICAgKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc1RleHROb2RlKFxuICBub2RlOiBCYXNlTm9kZSB8IFJlc3RCYXNlTm9kZVxuKTogVGV4dE5vZGUgfCBSZXN0VGV4dE5vZGUgfCB1bmRlZmluZWQge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnVEVYVCdcbiAgICA/IG5vZGVcbiAgICA6IGlzRnJhbWVMaWtlKG5vZGUpXG4gICAgPyAobm9kZS5jaGlsZHJlblswXSBhcyBUZXh0Tm9kZSlcbiAgICA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGNvbnN0IGN1c3RvbVZpZGVvRWxlbWVudHMgPSBuZXcgU2V0KFtcbiAgJ3lvdXR1YmUtdmlkZW8nLFxuICAndmltZW8tdmlkZW8nLFxuICAnc3BvdGlmeS1hdWRpbycsXG4gICdqd3BsYXllci12aWRlbycsXG4gICd2aWRlb2pzLXZpZGVvJyxcbiAgJ3dpc3RpYS12aWRlbycsXG4gICdjbG91ZGZsYXJlLXZpZGVvJyxcbiAgJ2hscy12aWRlbycsXG4gICdzaGFrYS12aWRlbycsXG4gICdkYXNoLXZpZGVvJyxcbl0pO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXV0b0xheW91dFZpc2libGVDaGlsZHJlbihcbiAgbm9kZTogU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZVxuKTogKChTY2VuZU5vZGUgfCBSZXN0U2NlbmVOb2RlKSAmIEF1dG9MYXlvdXRDaGlsZHJlbk1peGluKVtdIHtcbiAgZ2V0Q2hpbGRyZW4obm9kZSk7XG4gIGlmICgobm9kZSBhcyBBdXRvTGF5b3V0TWl4aW4pLmxheW91dE1vZGUgIT09ICdOT05FJykge1xuICAgIHJldHVybiBnZXRDaGlsZHJlbihub2RlKS5maWx0ZXIoXG4gICAgICAoY2hpbGQpID0+XG4gICAgICAgIChjaGlsZCBhcyBBdXRvTGF5b3V0Q2hpbGRyZW5NaXhpbikubGF5b3V0UG9zaXRpb25pbmcgIT09ICdBQlNPTFVURScgJiZcbiAgICAgICAgY2hpbGQudmlzaWJsZSAhPT0gZmFsc2VcbiAgICApIGFzICgoU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZSkgJiBBdXRvTGF5b3V0Q2hpbGRyZW5NaXhpbilbXTtcbiAgfVxuICByZXR1cm4gW107XG59XG4iLCAiaW1wb3J0IHsgY3VzdG9tVmlkZW9FbGVtZW50cyB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL3NyYy9tYXBwaW5nL3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmlkZW9FbGVtZW50KGVsdDogSFRNTEVsZW1lbnQpOiBlbHQgaXMgSFRNTFZpZGVvRWxlbWVudCB7XG4gIHJldHVybiAoXG4gICAgY3VzdG9tVmlkZW9FbGVtZW50cy5oYXMoZWx0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSkgfHxcbiAgICBlbHQudGFnTmFtZSA9PT0gJ1ZJREVPJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNZb3V0dWJlSWZyYW1lKGVsdDogSFRNTEVsZW1lbnQpOiBlbHQgaXMgSFRNTElGcmFtZUVsZW1lbnQge1xuICBpZiAoZWx0LnRhZ05hbWUgIT09ICdJRlJBTUUnKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHNyYyA9IChlbHQgYXMgSFRNTElGcmFtZUVsZW1lbnQpLnNyYztcbiAgcmV0dXJuIChcbiAgICAoc3JjLmluY2x1ZGVzKCd5b3V0dWJlLmNvbScpIHx8IHNyYy5pbmNsdWRlcygneW91dHViZS1ub2Nvb2tpZS5jb20nKSkgJiZcbiAgICBzcmMuaW5jbHVkZXMoJ2VuYWJsZWpzYXBpPTEnKVxuICApO1xufVxuXG5jbGFzcyBZb3V0dWJlQ29udHJvbGxlciB7XG4gIHByaXZhdGUgaW5mbzogYW55ID0ge307XG4gIHByaXZhdGUgbG9hZGVkOiBQcm9taXNlPGJvb2xlYW4+O1xuICBwcml2YXRlIG1lc3NhZ2VMaXN0ZW5lcjogKChldmVudDogTWVzc2FnZUV2ZW50KSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICB0aGlzLmxvYWRlZCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBjb25zdCBsb2FkTGlzdGVuZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMuaWZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkTGlzdGVuZXIpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVxdWVzdFlvdXR1YmVMaXN0ZW5pbmcoKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmlmcmFtZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZExpc3RlbmVyKTtcblxuICAgICAgdGhpcy5tZXNzYWdlTGlzdGVuZXIgPSAoZXZlbnQ6IE1lc3NhZ2VFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSB0aGlzLmlmcmFtZS5jb250ZW50V2luZG93ICYmIGV2ZW50LmRhdGEpIHtcbiAgICAgICAgICBsZXQgZXZlbnREYXRhOiBhbnk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZXZlbnREYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdZb3V0dWJlQ29udHJvbGxlciBtZXNzYWdlTGlzdGVuZXInLCBlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZXZlbnREYXRhLmV2ZW50ID09PSAnb25SZWFkeScpIHtcbiAgICAgICAgICAgIHRoaXMuaWZyYW1lLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBsb2FkTGlzdGVuZXIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChldmVudERhdGEuaW5mbykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLmluZm8sIGV2ZW50RGF0YS5pbmZvKTtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMubWVzc2FnZUxpc3RlbmVyKTtcbiAgICAgIHRoaXMucmVxdWVzdFlvdXR1YmVMaXN0ZW5pbmcoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgc2VuZFlvdXR1YmVNZXNzYWdlKFxuICAgIGZ1bmM6XG4gICAgICB8ICdtdXRlJ1xuICAgICAgfCAndW5NdXRlJ1xuICAgICAgfCAncGxheVZpZGVvJ1xuICAgICAgfCAncGF1c2VWaWRlbydcbiAgICAgIHwgJ3N0b3BWaWRlbydcbiAgICAgIHwgJ3NlZWtUbycsXG4gICAgYXJnczogYW55W10gPSBbXVxuICApOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmxvYWRlZDtcbiAgICB0aGlzLmlmcmFtZS5jb250ZW50V2luZG93Py5wb3N0TWVzc2FnZShcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgZXZlbnQ6ICdjb21tYW5kJywgZnVuYywgYXJncyB9KSxcbiAgICAgICcqJ1xuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHJlcXVlc3RZb3V0dWJlTGlzdGVuaW5nKCk6IHZvaWQge1xuICAgIHRoaXMuaWZyYW1lLmNvbnRlbnRXaW5kb3c/LnBvc3RNZXNzYWdlKFxuICAgICAgSlNPTi5zdHJpbmdpZnkoeyBldmVudDogJ2xpc3RlbmluZycgfSksXG4gICAgICAnKidcbiAgICApO1xuICB9XG5cbiAgZ2V0IG11dGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmluZm8ubXV0ZWQ7XG4gIH1cblxuICBnZXQgdm9sdW1lKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaW5mby52b2x1bWU7XG4gIH1cblxuICBzZXQgbXV0ZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUpIHRoaXMuc2VuZFlvdXR1YmVNZXNzYWdlKCdtdXRlJyk7XG4gICAgZWxzZSB0aGlzLnNlbmRZb3V0dWJlTWVzc2FnZSgndW5NdXRlJyk7XG4gIH1cblxuICBnZXQgY3VycmVudFRpbWUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pbmZvLmN1cnJlbnRUaW1lO1xuICB9XG5cbiAgc2V0IGN1cnJlbnRUaW1lKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLnNlbmRZb3V0dWJlTWVzc2FnZSgnc2Vla1RvJywgW3ZhbHVlLCB0cnVlXSk7XG4gIH1cblxuICBnZXQgcGF1c2VkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmluZm8ucGxheWVyU3RhdGUgPT09IDI7XG4gIH1cblxuICBwbGF5KCk6IHZvaWQge1xuICAgIHRoaXMuc2VuZFlvdXR1YmVNZXNzYWdlKCdwbGF5VmlkZW8nKTtcbiAgfVxuXG4gIHBhdXNlKCk6IHZvaWQge1xuICAgIHRoaXMuc2VuZFlvdXR1YmVNZXNzYWdlKCdwYXVzZVZpZGVvJyk7XG4gIH1cblxuICBzdGF0aWMgZnJvbShlbHQ6IEhUTUxJRnJhbWVFbGVtZW50KTogWW91dHViZUNvbnRyb2xsZXIge1xuICAgIHJldHVybiAoKGVsdCBhcyBhbnkpLmYyd195dF9jb250cm9sbGVyIHx8PSBuZXcgWW91dHViZUNvbnRyb2xsZXIoZWx0KSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Q29udHJvbGxlcihcbiAgZWx0OiBIVE1MRWxlbWVudFxuKTogSFRNTFZpZGVvRWxlbWVudCB8IFlvdXR1YmVDb250cm9sbGVyIHwgdW5kZWZpbmVkIHtcbiAgaWYgKGlzVmlkZW9FbGVtZW50KGVsdCkpIHJldHVybiBlbHQ7XG4gIGlmIChpc1lvdXR1YmVJZnJhbWUoZWx0KSkgcmV0dXJuIFlvdXR1YmVDb250cm9sbGVyLmZyb20oZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZU11dGUoZWx0OiBIVE1MRWxlbWVudCk6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5tdXRlZCA9ICFjb250cm9sbGVyLm11dGVkO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29udHJvbGxlci5tdXRlZCA9ICFjb250cm9sbGVyLm11dGVkO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbXV0ZShlbHQ6IEhUTUxFbGVtZW50KTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLm11dGVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNvbnRyb2xsZXIubXV0ZWQgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuTXV0ZShlbHQ6IEhUTUxFbGVtZW50KTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLm11dGVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjb250cm9sbGVyLm11dGVkID0gdHJ1ZTtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsYXkoZWx0OiBIVE1MRWxlbWVudCk6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5wbGF5KCk7XG4gICAgICByZXR1cm4gKCkgPT4gY29udHJvbGxlci5wYXVzZSgpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignVmlkZW8gZWxlbWVudCBub3QgcmVjb2duaXplZCcsIGVsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXVzZShlbHQ6IEhUTUxFbGVtZW50KTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLnBhdXNlKCk7XG4gICAgICByZXR1cm4gKCkgPT4gY29udHJvbGxlci5wbGF5KCk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvZ2dsZVBsYXkoZWx0OiBIVE1MRWxlbWVudCk6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKGNvbnRyb2xsZXIucGF1c2VkKSBjb250cm9sbGVyLnBsYXkoKTtcbiAgICAgIGVsc2UgY29udHJvbGxlci5wYXVzZSgpO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKGNvbnRyb2xsZXIucGF1c2VkKSBjb250cm9sbGVyLnBsYXkoKTtcbiAgICAgICAgZWxzZSBjb250cm9sbGVyLnBhdXNlKCk7XG4gICAgICB9O1xuICAgIH07XG4gIH1cbiAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignVmlkZW8gZWxlbWVudCBub3QgcmVjb2duaXplZCcsIGVsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWVrVG8oXG4gIGVsdDogSFRNTEVsZW1lbnQsXG4gIHRpbWU6IG51bWJlclxuKTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBjb250cm9sbGVyID0gZ2V0Q29udHJvbGxlcihlbHQpO1xuICBpZiAoY29udHJvbGxlcikge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb250cm9sbGVyLmN1cnJlbnRUaW1lID0gdGltZTtcbiAgICAgIC8vIG5vIHJldmVydCA/XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlZWtGb3J3YXJkKFxuICBlbHQ6IEhUTUxFbGVtZW50LFxuICBzZWNvbmRzOiBudW1iZXJcbik6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5jdXJyZW50VGltZSArPSBzZWNvbmRzO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29udHJvbGxlci5jdXJyZW50VGltZSAtPSBzZWNvbmRzO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2Vla0JhY2t3YXJkKFxuICBlbHQ6IEhUTUxFbGVtZW50LFxuICBzZWNvbmRzOiBudW1iZXJcbik6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5jdXJyZW50VGltZSAtPSBzZWNvbmRzO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29udHJvbGxlci5jdXJyZW50VGltZSArPSBzZWNvbmRzO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBpc1NhZmFyaSgpOiBib29sZWFuIHtcbiAgY29uc3QgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuICByZXR1cm4gdWEuaW5jbHVkZXMoJ1NhZmFyaScpICYmICF1YS5pbmNsdWRlcygnQ2hyb21lJyk7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGlzQWJzb2x1dGVPckZpeGVkKHBvc2l0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQpOiBib29sZWFuIHtcbiAgcmV0dXJuIHBvc2l0aW9uID09PSAnYWJzb2x1dGUnIHx8IHBvc2l0aW9uID09PSAnZml4ZWQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGbGV4KGRpc3BsYXk/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuICEhZGlzcGxheT8uZW5kc1dpdGgoJ2ZsZXgnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmxleE9yR3JpZChkaXNwbGF5Pzogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBpc0ZsZXgoZGlzcGxheSkgfHwgaXNHcmlkKGRpc3BsYXkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNHcmlkKGRpc3BsYXk/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuICEhZGlzcGxheT8uZW5kc1dpdGgoJ2dyaWQnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNzc0R1cmF0aW9uVG9NcyhkdXJhdGlvbj86IHN0cmluZyk6IG51bWJlciB7XG4gIGlmIChkdXJhdGlvbikge1xuICAgIGNvbnN0IHQgPSBwYXJzZUZsb2F0KGR1cmF0aW9uKTtcbiAgICBpZiAoIU51bWJlci5pc05hTih0KSkge1xuICAgICAgaWYgKGR1cmF0aW9uLmVuZHNXaXRoKCdtcycpKSByZXR1cm4gdDtcbiAgICAgIGlmIChkdXJhdGlvbi5lbmRzV2l0aCgncycpKSByZXR1cm4gdCAqIDFfMDAwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gMDtcbn1cbiIsICJpbXBvcnQgdHlwZSB7IEFuaW1hdGVkUHJvcCB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL3NyYy90eXBlcyc7XG5pbXBvcnQgeyBpc1NhZmFyaSB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9uYXZpZ2F0b3InO1xuaW1wb3J0IHsgaXNBYnNvbHV0ZU9yRml4ZWQgfSBmcm9tICdAZGl2cmlvdHMvdXRpbHMvc3R5bGVzJztcbmltcG9ydCB0eXBlIHsgQm91bmRFbGVtZW50IH0gZnJvbSAnLi4vbGlmZWN5Y2xlJztcblxuY29uc3Qgc2FmYXJpID0gaXNTYWZhcmkoKTtcblxudHlwZSBUb0FuaW1hdGUgPSBSZWNvcmQ8c3RyaW5nLCBbQW5pbWF0ZWRQcm9wWydmcm9tJ10sIEFuaW1hdGVkUHJvcFsndG8nXV0+O1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0QW5pbWF0ZWRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUoXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICBwcm9wczogQW5pbWF0ZWRQcm9wV2l0aENhbWVsS2V5W11cbik6IHZvaWQge1xuICBpZiAoIXByb3BzLmxlbmd0aCkgcmV0dXJuO1xuICBjb25zdCBbblByb3BzLCBiUHJvcHMsIGFQcm9wc10gPSBzcGxpdEJ5UHNldWRvKHByb3BzKS5tYXAodG9PYmopO1xuICBzZXRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUoZWx0LCBuUHJvcHMpO1xuICBzZXRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUoZWx0LCBiUHJvcHMsICc6OmJlZm9yZScpO1xuICBzZXRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUoZWx0LCBhUHJvcHMsICc6OmFmdGVyJyk7XG59XG5cbmZ1bmN0aW9uIHNwbGl0QnlQc2V1ZG8oXG4gIHByb3BzOiBBbmltYXRlZFByb3BXaXRoQ2FtZWxLZXlbXVxuKTogW1xuICBBbmltYXRlZFByb3BXaXRoQ2FtZWxLZXlbXSxcbiAgQW5pbWF0ZWRQcm9wV2l0aENhbWVsS2V5W10sXG4gIEFuaW1hdGVkUHJvcFdpdGhDYW1lbEtleVtdLFxuXSB7XG4gIHJldHVybiBbXG4gICAgcHJvcHMuZmlsdGVyKChpdCkgPT4gIWl0LnBzZXVkbyksXG4gICAgcHJvcHMuZmlsdGVyKChpdCkgPT4gaXQucHNldWRvID09PSAnOjpiZWZvcmUnKSxcbiAgICBwcm9wcy5maWx0ZXIoKGl0KSA9PiBpdC5wc2V1ZG8gPT09ICc6OmFmdGVyJyksXG4gIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0F1dG9Ub0N1cnJlbnRQcm9wKHA6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBzd2l0Y2ggKHApIHtcbiAgICBjYXNlICd3aWR0aCc6XG4gICAgY2FzZSAnaGVpZ2h0JzpcbiAgICBjYXNlICd0b3AnOlxuICAgIGNhc2UgJ2xlZnQnOlxuICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICBjYXNlICdib3R0b20nOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0UHJvcGVydGllc1dpdGhBbmltYXRlKFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgcHJvcHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfCBUb0FuaW1hdGUsXG4gIHBzZXVkbz86IHN0cmluZ1xuKTogdm9pZCB7XG4gIGlmICghT2JqZWN0LmtleXMocHJvcHMpLmxlbmd0aCkgcmV0dXJuO1xuICBlbHQuYW5pbWF0ZShcbiAgICB7XG4gICAgICBlYXNpbmc6ICdsaW5lYXInLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSxcbiAgICB7XG4gICAgICBwc2V1ZG9FbGVtZW50OiBwc2V1ZG8sXG4gICAgICBpdGVyYXRpb25zOiAxLFxuICAgICAgZHVyYXRpb246IDAsXG4gICAgICBmaWxsOiAnZm9yd2FyZHMnLFxuICAgIH1cbiAgKTtcbn1cblxuZXhwb3J0IHR5cGUgQW5pbWF0ZWRQcm9wV2l0aENhbWVsS2V5ID0gQW5pbWF0ZWRQcm9wICYgeyBjYW1lbEtleTogc3RyaW5nIH07XG5cbmV4cG9ydCBmdW5jdGlvbiB3aXRoQ2FtZWxLZXkocHJvcDogQW5pbWF0ZWRQcm9wKTogQW5pbWF0ZWRQcm9wV2l0aENhbWVsS2V5IHtcbiAgcmV0dXJuIHtcbiAgICAuLi5wcm9wLFxuICAgIGNhbWVsS2V5OiBwcm9wLmtleS5zdGFydHNXaXRoKCctLScpXG4gICAgICA/IHByb3Aua2V5XG4gICAgICA6IHByb3Aua2V5LnJlcGxhY2UoLy0oW2Etel0pL2csIChfLCBsKSA9PiBsLnRvVXBwZXJDYXNlKCkpLFxuICB9O1xufVxuXG5mdW5jdGlvbiB0b09iaihwOiBBbmltYXRlZFByb3BXaXRoQ2FtZWxLZXlbXSk6IFRvQW5pbWF0ZSB7XG4gIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMocC5tYXAoKGl0KSA9PiBbaXQuY2FtZWxLZXksIFtpdC5mcm9tLCBpdC50b11dKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseURvbUNoYW5nZXMoXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICBiZWZvcmVBbmltYXRpb25Qcm9wczogQW5pbWF0ZWRQcm9wV2l0aENhbWVsS2V5W10sXG4gIG5lZWRzRmluYWxTdGF0ZTogYm9vbGVhblxuKTogdm9pZCB7XG4gIGxldCBoYXNCZ0ltYWdlID0gZmFsc2U7XG4gIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IGJlZm9yZUFuaW1hdGlvblByb3BzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBjb25zdCBwID0gYmVmb3JlQW5pbWF0aW9uUHJvcHNbaWR4XTtcbiAgICBzd2l0Y2ggKHAua2V5KSB7XG4gICAgICBjYXNlICctLWYydy1pbWctc3JjJzpcbiAgICAgICAgbGV0IGkgPSAoZWx0IGFzIEhUTUxJbWFnZUVsZW1lbnQpLmYyd19pbWFnZV9sYXp5X2xvYWRlcjtcbiAgICAgICAgY29uc3Qgc3JjID0gU3RyaW5nKHAudG8pO1xuICAgICAgICBpZiAoIWkpIHtcbiAgICAgICAgICAoZWx0IGFzIEhUTUxJbWFnZUVsZW1lbnQpLmYyd19pbWFnZV9sYXp5X2xvYWRlciA9IGkgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICBpLmRlY29kaW5nID0gJ3N5bmMnO1xuICAgICAgICAgIGkub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgKGVsdCBhcyBIVE1MSW1hZ2VFbGVtZW50KS5kZWNvZGluZyA9ICdzeW5jJztcbiAgICAgICAgICAgIGVsdC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHNyYyk7XG4gICAgICAgICAgICBkZWxldGUgKGVsdCBhcyBIVE1MSW1hZ2VFbGVtZW50KS5mMndfaW1hZ2VfbGF6eV9sb2FkZXI7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpLnNyYyA9IHNyYztcbiAgICAgICAgYmVmb3JlQW5pbWF0aW9uUHJvcHMuc3BsaWNlKGlkeC0tLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICckaW5uZXJIVE1MJzpcbiAgICAgICAgZWx0LmlubmVySFRNTCA9IFN0cmluZyhwLnRvKTtcbiAgICAgICAgYmVmb3JlQW5pbWF0aW9uUHJvcHMuc3BsaWNlKGlkeC0tLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdiYWNrZ3JvdW5kLWltYWdlJzpcbiAgICAgICAgaGFzQmdJbWFnZSA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnb3ZlcmZsb3cnOlxuICAgICAgICBpZiAoc2FmYXJpKSB7XG4gICAgICAgICAgZWx0LnN0eWxlLnNldFByb3BlcnR5KHAua2V5LCBTdHJpbmcocC50bykpO1xuICAgICAgICAgIGJlZm9yZUFuaW1hdGlvblByb3BzLnNwbGljZShpZHgtLSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChwLmtleS5zdGFydHNXaXRoKCctLWYydy1hdHRyLScpKSB7XG4gICAgICBlbHQuc2V0QXR0cmlidXRlKHAua2V5LnNsaWNlKDExKSwgU3RyaW5nKHAudG8pKTtcbiAgICAgIGJlZm9yZUFuaW1hdGlvblByb3BzLnNwbGljZShpZHgtLSwgMSk7XG4gICAgfVxuICB9XG4gIGlmIChoYXNCZ0ltYWdlKSB7XG4gICAgLy8gSWYgYmctaW1hZ2UgY2hhbmdlcywgYW5pbWF0aW5nIHBvc2l0aW9uLCBzaXplIGV0LmFsIHdpbGwgaGF2ZSBiaXphcnJlIGVmZmVjdHNcbiAgICAvLyBJZGVhbGx5IHdlJ3ZlIHdvcmsgb24gdGhhdCBkdXJpbmcgZGlmZmluZywgYW5kIGF0dGVtcHQgdG8gdW5pZnkgYmctaW1hZ2UgYWNjcm9zcyB2YXJpYW50c1xuICAgIC8vIGFuZCBtYXliZSBhbmltYXRlIGl0IHRob3VnaCB2YXJpYWJsZXMgP1xuICAgIGNvbnN0IGJnSW1nT2JqID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgYmVmb3JlQW5pbWF0aW9uUHJvcHNcbiAgICAgICAgLm1hcCgoaXQsIGlkeCkgPT4gKHsgaXQsIGlkeCB9KSlcbiAgICAgICAgLmZpbHRlcigoeyBpdCB9KSA9PiBpdC5rZXkuc3RhcnRzV2l0aCgnYmFja2dyb3VuZC0nKSlcbiAgICAgICAgLm1hcCgoeyBpdCwgaWR4IH0pID0+IHtcbiAgICAgICAgICBiZWZvcmVBbmltYXRpb25Qcm9wcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICByZXR1cm4gW2l0LmNhbWVsS2V5LCBTdHJpbmcoaXQudG8pXTtcbiAgICAgICAgfSlcbiAgICApO1xuICAgIHNldFByb3BlcnRpZXNXaXRoQW5pbWF0ZShlbHQsIGJnSW1nT2JqKTtcbiAgfVxuICBpZiAobmVlZHNGaW5hbFN0YXRlKSB7XG4gICAgc2V0QW5pbWF0ZWRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUoZWx0LCBiZWZvcmVBbmltYXRpb25Qcm9wcyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFuaW1hdGVQcm9wcyhcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIHByb3BzOiBBbmltYXRlZFByb3BbXSxcbiAgZWFzaW5nOiBzdHJpbmcsXG4gIGR1cmF0aW9uOiBudW1iZXIsXG4gIGNvbnRhaW5lcnNUb1JlT3JkZXI6IFNldDxIVE1MRWxlbWVudD5cbik6IHZvaWQge1xuICBjb25zdCBwYXJlbnQgPSBlbHQucGFyZW50RWxlbWVudCE7XG4gIGNvbnN0IGNvbXB1dGVkU3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShlbHQpO1xuICBjb25zdCBwYXJlbnRTdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKHBhcmVudCk7XG4gIGNvbnN0IHBhcmVudERpc3BsYXkgPSBwYXJlbnRTdHlsZXMuZGlzcGxheTtcbiAgY29uc3QgaXNGbGV4T3JHcmlkID1cbiAgICBwYXJlbnREaXNwbGF5LmVuZHNXaXRoKCdmbGV4JykgfHwgcGFyZW50RGlzcGxheS5lbmRzV2l0aCgnZ3JpZCcpO1xuICBjb25zdCBpc0Fic29sdXRlID0gaXNBYnNvbHV0ZU9yRml4ZWQoY29tcHV0ZWRTdHlsZXMucG9zaXRpb24pO1xuICBjb25zdCBjdXJyZW50UHJvcHMgPSBwcm9wcy5tYXAod2l0aENhbWVsS2V5KTtcblxuICBjb25zdCBbblByb3BzT2JqLCBiUHJvcHNPYmosIGFQcm9wc09ial0gPVxuICAgIHNwbGl0QnlQc2V1ZG8oY3VycmVudFByb3BzKS5tYXAodG9PYmopO1xuXG4gIGxldCBkaXNwbGF5QWZ0ZXJBbmltYXRpb246IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgaWYgKG5Qcm9wc09iai5kaXNwbGF5KSB7XG4gICAgLy8gZXZlbiBvbiBjaHJvbWUgd2hlcmUgZGlzcGxheSBpcyBhbmltYXRhYmxlLCB0aGUgZWxlbWVudCB3b24ndFxuICAgIC8vICByZWNlaXZlIG1vdXNlIGV2ZW50cyBpZiB3ZSBkb24ndCBzZXQgaXQgZXhwbGljaXRlbHlcbiAgICBpZiAoblByb3BzT2JqLmRpc3BsYXlbMF0gPT09ICdub25lJykge1xuICAgICAgLy8gc2hvdyBpdCBpbW1lZGlhdGx5LCBvcGFjaXR5IGFuaW1hdGlvbiB3aWxsIGhhbmRsZSB0aGUgcmVzdFxuICAgICAgc2V0UHJvcGVydGllc1dpdGhBbmltYXRlKGVsdCwge1xuICAgICAgICBkaXNwbGF5OiBTdHJpbmcoblByb3BzT2JqLmRpc3BsYXlbMV0pLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChuUHJvcHNPYmouZGlzcGxheVsxXSA9PT0gJ25vbmUnKSB7XG4gICAgICBpZiAoaXNGbGV4T3JHcmlkICYmICFpc0Fic29sdXRlKSB7XG4gICAgICAgIC8vIHByb2JhYmx5IGEgc3dhcCwgaGlkZSBpdCBpbW1lZGlhdGx5IHRvIG5vdCBoYXZlIGJvdGggZWxlbWVudHMgKGJlZm9yZSZhZnRlcikgdmlzaWJsZSBkdXJpbmcgdGhlIHRyYW5zaXRpb25cbiAgICAgICAgc2V0UHJvcGVydGllc1dpdGhBbmltYXRlKGVsdCwge1xuICAgICAgICAgIGRpc3BsYXk6ICdub25lJyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGZvciBjb25jdXJyZW50L3BhcmFsbGVsIGFuaW1hdGlvbnMsIGVuc3VyZSB0aGUgZmluYWwgc3RhdGUgaXMgY29ycmVjdCBhcyB3ZWxsXG4gICAgZGlzcGxheUFmdGVyQW5pbWF0aW9uID0gU3RyaW5nKG5Qcm9wc09iai5kaXNwbGF5WzFdKTtcbiAgICBkZWxldGUgblByb3BzT2JqLmRpc3BsYXk7XG4gIH1cblxuICBsZXQgZjJ3T3JkZXIgPSArZ2V0Q29tcHV0ZWRTdHlsZShlbHQpLmdldFByb3BlcnR5VmFsdWUoJy0tZjJ3LW9yZGVyJyk7XG4gIGlmIChuUHJvcHNPYmpbJy0tZjJ3LW9yZGVyJ10pIHtcbiAgICBjb25zdCB0byA9IG5Qcm9wc09ialsnLS1mMnctb3JkZXInXVsxXTtcbiAgICBmMndPcmRlciA9IHRvID09PSB1bmRlZmluZWQgPyBOYU4gOiArdG87XG4gICAgLy8gcmUtcG9zaXRpb24gdGhlIGNoaWxkIGF0IHRoZSByaWdodCBwbGFjZSBpbiB0aGUgcGFyZW50XG4gICAgaWYgKCFpc05hTihmMndPcmRlcikpIHtcbiAgICAgIGVsdC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1mMnctb3JkZXInLCBTdHJpbmcoZjJ3T3JkZXIpKTtcbiAgICB9XG4gICAgZGVsZXRlIG5Qcm9wc09ialsnLS1mMnctb3JkZXInXTtcbiAgfVxuICAvLyByZS1wb3NpdGlvbiB0aGUgY2hpbGQgYXQgdGhlIHJpZ2h0IHBsYWNlIGluIHRoZSBwYXJlbnRcbiAgaWYgKCFpc05hTihmMndPcmRlcikpIHtcbiAgICBjb250YWluZXJzVG9SZU9yZGVyLmFkZChwYXJlbnQpO1xuICB9XG5cbiAgZm9yIChjb25zdCBbcHNldWRvLCBvYmpdIG9mIFtcbiAgICBbJ2JlZm9yZScsIGJQcm9wc09ial0sXG4gICAgWydhZnRlcicsIGFQcm9wc09ial0sXG4gIF0gYXMgY29uc3QpIHtcbiAgICBpZiAob2JqLmRpc3BsYXkpIHtcbiAgICAgIC8vIHVzZSBzZXRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUgaW5zdGVhZCBvZiBjbGFzc2VzID9cbiAgICAgIGlmIChvYmouZGlzcGxheVsxXSA9PT0gJ25vbmUnKSB7XG4gICAgICAgIGVsdC5jbGFzc0xpc3QucmVtb3ZlKHBzZXVkbyArICctdmlzaWJsZScpO1xuICAgICAgICBlbHQuY2xhc3NMaXN0LmFkZChwc2V1ZG8gKyAnLWhpZGRlbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWx0LmNsYXNzTGlzdC5yZW1vdmUocHNldWRvICsgJy1oaWRkZW4nKTtcbiAgICAgICAgZWx0LmNsYXNzTGlzdC5hZGQocHNldWRvICsgJy12aXNpYmxlJyk7XG4gICAgICB9XG4gICAgICAvLyBkcm9wIGl0IGZyb20gYW5pbWF0aW9uID9cbiAgICB9XG4gIH1cblxuICBjb25zdCBhbmltID0gKFxuICAgIHRvQW5pbWF0ZTogVG9BbmltYXRlLFxuICAgIHBzZXVkbz86IHN0cmluZyxcbiAgICBmb3JjZSA9IGZhbHNlXG4gICk6IEFuaW1hdGlvbiB8IHVuZGVmaW5lZCA9PiB7XG4gICAgaWYgKCFmb3JjZSAmJiAhT2JqZWN0LmtleXModG9BbmltYXRlKS5sZW5ndGgpIHJldHVybjtcbiAgICByZXR1cm4gZWx0LmFuaW1hdGUoXG4gICAgICB7XG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgLi4udG9BbmltYXRlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcHNldWRvRWxlbWVudDogcHNldWRvLFxuICAgICAgICBpdGVyYXRpb25zOiAxLFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgZmlsbDogJ2JvdGgnLFxuICAgICAgfVxuICAgICk7XG4gIH07XG4gIGNvbnN0IGEgPSBhbmltKG5Qcm9wc09iaiwgdW5kZWZpbmVkLCAhIWRpc3BsYXlBZnRlckFuaW1hdGlvbik7XG4gIGlmIChkaXNwbGF5QWZ0ZXJBbmltYXRpb24pIHtcbiAgICBhIS5maW5pc2hlZC50aGVuKCgpID0+IHtcbiAgICAgIGVsdC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheUFmdGVyQW5pbWF0aW9uITtcbiAgICB9KTtcbiAgfVxuICBhbmltKGJQcm9wc09iaiwgJzo6YmVmb3JlJyk7XG4gIGFuaW0oYVByb3BzT2JqLCAnOjphZnRlcicpO1xufVxuIiwgImltcG9ydCB7XG4gIEFuaW1hdGVkRWx0LFxuICBGMndEaXJlY3Rpb25hbFRyYW5zaXRpb24sXG59IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL3NyYy90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb3ZlSW5BbmltYXRpb25zKFxuICBlbHRJZDogc3RyaW5nLFxuICBvdmVybGF5UG9zaXRpb25UeXBlOiBPdmVybGF5UG9zaXRpb25UeXBlLFxuICB0cmFuc2l0aW9uOiBGMndEaXJlY3Rpb25hbFRyYW5zaXRpb25cbik6IEFuaW1hdGVkRWx0W10ge1xuICBpZiAodHJhbnNpdGlvbi5kaXJlY3Rpb24gPT09ICdMRUZUJykge1xuICAgIGlmIChcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fTEVGVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfTEVGVCdcbiAgICApIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdsZWZ0JyxcbiAgICAgICAgICAgICAgZnJvbTogJzEwMCUnLFxuICAgICAgICAgICAgICB0bzogJzAlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fUklHSFQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX1JJR0hUJ1xuICAgICkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgIGZyb206ICcxMDAlIDBweCcsXG4gICAgICAgICAgICAgIHRvOiAnMHB4IDBweCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjZW50ZXJcbiAgICAgIGNvbnN0IHR5ID0gb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0NFTlRFUicgPyAnLTUwJScgOiAnMHB4JztcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdsZWZ0JyxcbiAgICAgICAgICAgICAgZnJvbTogJzEwMCUnLFxuICAgICAgICAgICAgICB0bzogJzUwJScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICBmcm9tOiBgMHB4ICR7dHl9YCxcbiAgICAgICAgICAgICAgdG86IGAtNTAlICR7dHl9YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICB9IGVsc2UgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnUklHSFQnKSB7XG4gICAgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9MRUZUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9MRUZUJ1xuICAgICkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgIGZyb206ICctMTAwJSAwcHgnLFxuICAgICAgICAgICAgICB0bzogJzBweCAwcHgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9SSUdIVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfUklHSFQnXG4gICAgKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAncmlnaHQnLFxuICAgICAgICAgICAgICBmcm9tOiAnMTAwJScsXG4gICAgICAgICAgICAgIHRvOiAnMHB4JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNlbnRlclxuICAgICAgY29uc3QgdHkgPSBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQ0VOVEVSJyA/ICctNTAlJyA6ICcwcHgnO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ2xlZnQnLFxuICAgICAgICAgICAgICBmcm9tOiAnMHB4JyxcbiAgICAgICAgICAgICAgdG86ICc1MCUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogYC0xMDAlICR7dHl9YCxcbiAgICAgICAgICAgICAgdG86IGAtNTAlICR7dHl9YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICB9IGVsc2UgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnVE9QJykge1xuICAgIGlmIChcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fTEVGVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fUklHSFQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX0NFTlRFUidcbiAgICApIHtcbiAgICAgIGNvbnN0IHR4ID0gb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9DRU5URVInID8gJy01MCUnIDogJzBweCc7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogYCR7dHh9IDEwMCVgLFxuICAgICAgICAgICAgICB0bzogYCR7dHh9IDBweGAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX0xFRlQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX1JJR0hUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9DRU5URVInXG4gICAgKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndG9wJyxcbiAgICAgICAgICAgICAgZnJvbTogJzEwMCUnLFxuICAgICAgICAgICAgICB0bzogJzBweCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjZW50ZXJcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0b3AnLFxuICAgICAgICAgICAgICBmcm9tOiAnMTAwJScsXG4gICAgICAgICAgICAgIHRvOiAnNTAlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgIGZyb206IGAtNTAlIDAlYCxcbiAgICAgICAgICAgICAgdG86IGAtNTAlIC01MCVgLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHJhbnNpdGlvbi5kaXJlY3Rpb24gPT09ICdCT1RUT00nKSB7XG4gICAgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9MRUZUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9SSUdIVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fQ0VOVEVSJ1xuICAgICkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ2JvdHRvbScsXG4gICAgICAgICAgICAgIGZyb206ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG86ICcwcHgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9MRUZUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9SSUdIVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfQ0VOVEVSJ1xuICAgICkge1xuICAgICAgY29uc3QgdHggPSBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX0NFTlRFUicgPyAnLTUwJScgOiAnMHB4JztcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICBmcm9tOiBgJHt0eH0gLTEwMCVgLFxuICAgICAgICAgICAgICB0bzogYCR7dHh9IDBweGAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjZW50ZXJcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0b3AnLFxuICAgICAgICAgICAgICBmcm9tOiAnMHB4JyxcbiAgICAgICAgICAgICAgdG86ICc1MCUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogYC01MCUgLTEwMCVgLFxuICAgICAgICAgICAgICB0bzogYC01MCUgLTUwJWAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLndhcm4oJ1Vuc3VwcG9ydGVkIHRyYW5zaXRpb246JywgdHJhbnNpdGlvbik7XG4gIH1cbiAgcmV0dXJuIFtdO1xufVxuIiwgImltcG9ydCB7IG9uQ29ubmVjdGVkIH0gZnJvbSAnLi4vbGlmZWN5Y2xlJztcblxubGV0IHNjcm9sbGluZzogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbmxldCBsYXN0WDogbnVtYmVyLCBsYXN0WTogbnVtYmVyO1xuXG5vbkNvbm5lY3RlZCgnLmRyYWdTY3JvbGwnLCAoZWwpID0+IHtcbiAgY29uc3QgaGFuZGxlciA9IChlOiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgaWYgKGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoZS5jbGllbnRYLCBlLmNsaWVudFkpICE9PSBlbCkgcmV0dXJuO1xuICAgIHNjcm9sbGluZyA9IGVsIGFzIEhUTUxFbGVtZW50O1xuICAgICh7IGNsaWVudFg6IGxhc3RYLCBjbGllbnRZOiBsYXN0WSB9ID0gZSk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICB9O1xuICBlbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVyIGFzIGFueSk7XG4gIHJldHVybiAoKSA9PiBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBoYW5kbGVyIGFzIGFueSk7XG59KTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChlKSA9PiB7XG4gIGlmICghc2Nyb2xsaW5nKSByZXR1cm47XG4gIGNvbnN0IHNjcm9sbGVyID1cbiAgICBzY3JvbGxpbmcgPT09IGRvY3VtZW50LmJvZHkgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgOiBzY3JvbGxpbmc7XG4gIGNvbnN0IFtkZWx0YVgsIGRlbHRhWV0gPSBbbGFzdFggLSBlLmNsaWVudFgsIGxhc3RZIC0gZS5jbGllbnRZXTtcbiAgc2Nyb2xsZXIuc2Nyb2xsTGVmdCArPSBkZWx0YVg7XG4gIHNjcm9sbGVyLnNjcm9sbFRvcCArPSBkZWx0YVk7XG4gIFtsYXN0WCwgbGFzdFldID0gW2UuY2xpZW50WCwgZS5jbGllbnRZXTtcbn0pO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IChzY3JvbGxpbmcgPSBudWxsKSk7XG4iLCAiaW1wb3J0IHtcbiAgdGVtcGxhdGVJZCxcbiAgdG9QZXJjZW50LFxuICB0b1B4LFxuICB2YWx1ZVRvU3RyaW5nLFxufSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdG8taHRtbC9oZWxwZXJzJztcbmltcG9ydCB7XG4gIHR5cGUgVHJpZ2dlclR5cGUsXG4gIHJlYWN0aW9uX3R5cGVzLFxufSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdG8taHRtbC9tYXBwaW5nL3RyaWdnZXJzJztcbmltcG9ydCB0eXBlIHtcbiAgQW5pbWF0ZWRQcm9wLFxuICBBbmltYXRlZEVsdCBhcyBBbmltYXRpb24sXG4gIERPTUYyd0FjdGlvbiBhcyBGMndBY3Rpb24sXG59IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL3R5cGVzJztcbmltcG9ydCB7IHNob3VsZE5vdEhhcHBlbiB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9hc3NlcnQnO1xuaW1wb3J0IHsgb25jZSB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9mdW5jdGlvbnMnO1xuaW1wb3J0IHsgaXNBbGlhcyB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL3ZhcmlhYmxlcyc7XG5pbXBvcnQgeyBmaWx0ZXJFbXB0eSB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9hcnJheSc7XG5pbXBvcnQgeyBvbkNvbm5lY3RlZCwgQ2xlYW51cEZuLCBCb3VuZEVsZW1lbnQgfSBmcm9tICcuL2xpZmVjeWNsZSc7XG5pbXBvcnQge1xuICBzZWVrQmFja3dhcmQsXG4gIHNlZWtGb3J3YXJkLFxuICBtdXRlLFxuICBwYXVzZSxcbiAgcGxheSxcbiAgc2Vla1RvLFxuICB0b2dnbGVNdXRlLFxuICB0b2dnbGVQbGF5LFxuICB1bk11dGUsXG59IGZyb20gJy4vcnVudGltZS92aWRlb3MnO1xuaW1wb3J0IHtcbiAgQW5pbWF0ZWRQcm9wV2l0aENhbWVsS2V5LFxuICBhbmltYXRlUHJvcHMsXG4gIGFwcGx5RG9tQ2hhbmdlcyxcbiAgaXNBdXRvVG9DdXJyZW50UHJvcCxcbiAgc2V0UHJvcGVydGllc1dpdGhBbmltYXRlLFxuICB3aXRoQ2FtZWxLZXksXG59IGZyb20gJy4vcnVudGltZS9hbmltYXRvcic7XG5pbXBvcnQgeyBnZXRNb3ZlSW5BbmltYXRpb25zIH0gZnJvbSAnLi9ydW50aW1lL2FuaW1hdGlvbnMnO1xuaW1wb3J0ICcuL3J1bnRpbWUvZHJhZ1Njcm9sbCc7XG5cbnR5cGUgVmFyaWFibGVWYWx1ZU5vQWxpYXMgPSBFeGNsdWRlPFZhcmlhYmxlVmFsdWUsIFZhcmlhYmxlQWxpYXM+O1xuXG50eXBlIFNldFZhcmlhYmxlID0geyBpZDogc3RyaW5nOyB2YWx1ZTogVmFyaWFibGVWYWx1ZTsgc3RyOiBzdHJpbmcgfTtcblxuY29uc3QgYWxsUmVhY3Rpb25zID0gKCk6IFJlY29yZDxzdHJpbmcsIEYyd0FjdGlvbj4gPT4gd2luZG93LkYyV19SRUFDVElPTlM7XG5jb25zdCBhbGxWYXJpYWJsZXMgPSAoKTogUmVjb3JkPHN0cmluZywgVmFyaWFibGVWYWx1ZT4gPT4gd2luZG93LkYyV19WQVJJQUJMRVM7XG5jb25zdCBjb2xsZWN0aW9uTW9kZUJwcyA9ICgpOiBSZWNvcmQ8XG4gIHN0cmluZyxcbiAgUmVjb3JkPHN0cmluZywgeyBtaW5XaWR0aDogbnVtYmVyIH0+XG4+ID0+IHdpbmRvdy5GMldfQ09MTEVDVElPTl9NT0RFX0JQUztcbmNvbnN0IGdldENvbE1vZGVzID0gKGNvbDogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgVmFyaWFibGVzPiA9PlxuICB3aW5kb3cuRjJXX0NPTExFQ1RJT05fVkFSUz8uW2NvbF0gPz8ge307XG5jb25zdCBnZXRDb2xWYXJpYWJsZXMgPSAoXG4gIGNvbDogc3RyaW5nLFxuICBtb2RlOiBzdHJpbmdcbik6IFJlY29yZDxzdHJpbmcsIFZhcmlhYmxlVmFsdWU+IHwgdW5kZWZpbmVkID0+IGdldENvbE1vZGVzKGNvbClbbW9kZV07XG5cbmZ1bmN0aW9uIHNldFZhcmlhYmxlKGlkOiBzdHJpbmcsIHZhbHVlOiBWYXJpYWJsZVZhbHVlKTogdm9pZCB7XG4gIGFsbFZhcmlhYmxlcygpW2lkXSA9IHZhbHVlO1xuICBjb25zdCBzdHIgPSB2YWx1ZVRvU3RyaW5nKHZhbHVlKTtcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5zZXRQcm9wZXJ0eShpZCwgc3RyKTtcbiAgY29uc3QgYXR0ciA9IGBkYXRhJHtpZC5zbGljZSgxKX1gO1xuICBpZiAoZG9jdW1lbnQuYm9keS5oYXNBdHRyaWJ1dGUoYXR0cikpIHtcbiAgICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZShhdHRyLCBzdHIpO1xuICB9XG4gIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQoXG4gICAgbmV3IEN1c3RvbUV2ZW50PFNldFZhcmlhYmxlPignZjJ3LXNldC12YXJpYWJsZScsIHtcbiAgICAgIGRldGFpbDogeyBpZCwgdmFsdWUsIHN0ciB9LFxuICAgIH0pXG4gICk7XG59XG5cbmZ1bmN0aW9uIHNldENvbGxlY3Rpb25BdHRyQW5kVmFyaWFibGVzKFxuICBjb2xOYW1lOiBzdHJpbmcsXG4gIG1vZGVOYW1lOiBzdHJpbmdcbik6IHZvaWQge1xuICBkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZShgZGF0YS0ke2NvbE5hbWV9YCwgbW9kZU5hbWUpO1xuICBjb25zdCB2YXJzID0gZ2V0Q29sVmFyaWFibGVzKGNvbE5hbWUsIG1vZGVOYW1lKSA/PyB7fTtcbiAgZm9yIChjb25zdCBbaWQsIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh2YXJzKSkge1xuICAgIHNldFZhcmlhYmxlKGlkLCB2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0VmFyaWFibGVNb2RlKG5hbWU6IHN0cmluZywgbW9kZU5hbWU6IHN0cmluZyk6IHZvaWQge1xuICBzZXRDb2xsZWN0aW9uQXR0ckFuZFZhcmlhYmxlcyhuYW1lLCBtb2RlTmFtZSk7XG4gIHNhdmVNb2RlKG5hbWUsIG1vZGVOYW1lKTtcbn1cblxuZnVuY3Rpb24gc2F2ZU1vZGUobmFtZTogc3RyaW5nLCBtb2RlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGlmICh3aW5kb3cuRjJXX0NPTE9SX1NDSEVNRVM/LmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgbG9jYWxTdG9yYWdlPy5zZXRJdGVtKENPTE9SX1NDSEVNRV9LRVksIG1vZGVOYW1lKTtcbiAgfSBlbHNlIGlmICh3aW5kb3cuRjJXX0xBTkdVQUdFUz8uaW5jbHVkZXMobmFtZSkpIHtcbiAgICBsb2NhbFN0b3JhZ2U/LnNldEl0ZW0oTEFOR19LRVksIG1vZGVOYW1lKTtcbiAgICBjb25zdCBhbHRlcm5hdGUgPSBBcnJheS5mcm9tKFxuICAgICAgZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxMaW5rRWxlbWVudD4oJ2xpbmtbcmVsPVwiYWx0ZXJuYXRlXCJdJylcbiAgICApLmZpbmQoKGl0KSA9PiBpdC5ocmVmbGFuZyA9PT0gbW9kZU5hbWUpO1xuICAgIGlmIChhbHRlcm5hdGUpIHtcbiAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKG51bGwsICcnLCBuZXcgVVJMKGFsdGVybmF0ZS5ocmVmKS5wYXRobmFtZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRvRmxvYXQodjogVmFyaWFibGVWYWx1ZU5vQWxpYXMpOiBudW1iZXIge1xuICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInKSByZXR1cm4gdjtcbiAgaWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHJldHVybiB2ID8gMSA6IDA7XG4gIGlmICh0eXBlb2YgdiA9PT0gJ3N0cmluZycpIHJldHVybiBwYXJzZUZsb2F0KHYpO1xuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gdG9TdHJpbmcodjogVmFyaWFibGVWYWx1ZU5vQWxpYXMpOiBzdHJpbmcge1xuICByZXR1cm4gU3RyaW5nKHYpO1xufVxuXG5mdW5jdGlvbiB0b0Jvb2xlYW4odjogVmFyaWFibGVWYWx1ZU5vQWxpYXMpOiBib29sZWFuIHtcbiAgaWYgKHR5cGVvZiB2ID09PSAnc3RyaW5nJykgcmV0dXJuIHYgPT09ICd0cnVlJztcbiAgcmV0dXJuICEhdjtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZShcbiAgdmFsdWU6IFZhcmlhYmxlVmFsdWVXaXRoRXhwcmVzc2lvbiB8IHVuZGVmaW5lZCxcbiAgcm9vdElkPzogc3RyaW5nXG4pOiBWYXJpYWJsZVZhbHVlTm9BbGlhcyB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gIGlmIChpc0FsaWFzKHZhbHVlKSkge1xuICAgIHJldHVybiByZXNvbHZlKGFsbFZhcmlhYmxlcygpW3ZhbHVlLmlkXSk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgJ2V4cHJlc3Npb25Bcmd1bWVudHMnIGluIHZhbHVlKSB7XG4gICAgY29uc3QgYXJncyA9IHZhbHVlLmV4cHJlc3Npb25Bcmd1bWVudHNcbiAgICAgIC5tYXAoKGl0KSA9PiBpdC52YWx1ZSlcbiAgICAgIC5maWx0ZXIoKGl0KTogaXQgaXMgVmFyaWFibGVWYWx1ZVdpdGhFeHByZXNzaW9uID0+IGl0ICE9PSB1bmRlZmluZWQpXG4gICAgICAubWFwKChpdCkgPT4gcmVzb2x2ZShpdCwgcm9vdElkKSk7XG4gICAgY29uc3QgcmVzb2x2ZWRUeXBlID0gdmFsdWUuZXhwcmVzc2lvbkFyZ3VtZW50c1swXT8ucmVzb2x2ZWRUeXBlID8/ICdTVFJJTkcnO1xuICAgIHN3aXRjaCAodmFsdWUuZXhwcmVzc2lvbkZ1bmN0aW9uKSB7XG4gICAgICBjYXNlICdBRERJVElPTic6XG4gICAgICAgIHJldHVybiByZXNvbHZlZFR5cGUgPT09ICdGTE9BVCdcbiAgICAgICAgICA/IGFyZ3MubWFwKHRvRmxvYXQpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpXG4gICAgICAgICAgOiBhcmdzLm1hcCh0b1N0cmluZykucmVkdWNlKChhLCBiKSA9PiBhICsgYik7XG4gICAgICBjYXNlICdTVUJUUkFDVElPTic6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHRvRmxvYXQoYXJnc1swXSkgLSB0b0Zsb2F0KGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnRElWSVNJT04nOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Zsb2F0KGFyZ3NbMF0pIC8gdG9GbG9hdChhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ01VTFRJUExJQ0FUSU9OJzpcbiAgICAgICAgcmV0dXJuIGFyZ3MubWFwKHRvRmxvYXQpLnJlZHVjZSgoYSwgYikgPT4gYSAqIGIpO1xuICAgICAgY2FzZSAnTkVHQVRFJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gLXRvRmxvYXQoYXJnc1swXSk7XG4gICAgICBjYXNlICdHUkVBVEVSX1RIQU4nOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Zsb2F0KGFyZ3NbMF0pID4gdG9GbG9hdChhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ0dSRUFURVJfVEhBTl9PUl9FUVVBTCc6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHRvRmxvYXQoYXJnc1swXSkgPj0gdG9GbG9hdChhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ0xFU1NfVEhBTic6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHRvRmxvYXQoYXJnc1swXSkgPCB0b0Zsb2F0KGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnTEVTU19USEFOX09SX0VRVUFMJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gdG9GbG9hdChhcmdzWzBdKSA8PSB0b0Zsb2F0KGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnRVFVQUxTJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZWRUeXBlID09PSAnRkxPQVQnXG4gICAgICAgICAgPyB0b0Zsb2F0KGFyZ3NbMF0pID09PSB0b0Zsb2F0KGFyZ3NbMV0pXG4gICAgICAgICAgOiByZXNvbHZlZFR5cGUgPT09ICdCT09MRUFOJ1xuICAgICAgICAgID8gdG9Cb29sZWFuKGFyZ3NbMF0pID09PSB0b0Jvb2xlYW4oYXJnc1sxXSlcbiAgICAgICAgICA6IHRvU3RyaW5nKGFyZ3NbMF0pID09PSB0b1N0cmluZyhhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ05PVF9FUVVBTCc6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkVHlwZSA9PT0gJ0ZMT0FUJ1xuICAgICAgICAgID8gdG9GbG9hdChhcmdzWzBdKSAhPT0gdG9GbG9hdChhcmdzWzFdKVxuICAgICAgICAgIDogcmVzb2x2ZWRUeXBlID09PSAnQk9PTEVBTidcbiAgICAgICAgICA/IHRvQm9vbGVhbihhcmdzWzBdKSAhPT0gdG9Cb29sZWFuKGFyZ3NbMV0pXG4gICAgICAgICAgOiB0b1N0cmluZyhhcmdzWzBdKSAhPT0gdG9TdHJpbmcoYXJnc1sxXSk7XG4gICAgICBjYXNlICdBTkQnOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Jvb2xlYW4oYXJnc1swXSkgJiYgdG9Cb29sZWFuKGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnT1InOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Jvb2xlYW4oYXJnc1swXSkgfHwgdG9Cb29sZWFuKGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnTk9UJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gIXRvQm9vbGVhbihhcmdzWzBdKTtcbiAgICAgIGNhc2UgJ1ZBUl9NT0RFX0xPT0tVUCc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYEV4cHJlc3Npb24gbm90IGltcGxlbWVudGVkIHlldDogJHt2YWx1ZS5leHByZXNzaW9uRnVuY3Rpb259YFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhY3Rpb25zVG9SdW4oXG4gIGFjdGlvbnM6IEYyd0FjdGlvbltdLFxuICBib3VuZDogQm91bmRFbGVtZW50LFxuICB0cmlnZ2VyOiBUcmlnZ2VyVHlwZVxuKTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBjb25zdCBydW5zID0gYWN0aW9ucy5tYXAoKGl0KSA9PiB0b1J1bldpdGhEcmFnQ2xlYW51cChpdCwgYm91bmQsIHRyaWdnZXIpKTtcbiAgcmV0dXJuIChlLCBpKSA9PiB7XG4gICAgY29uc3QgcmV2ZXJ0cyA9IHJ1bnNcbiAgICAgIC5tYXAoKGl0KSA9PiBpdChlLCBpKSlcbiAgICAgIC5maWx0ZXIoKGl0KTogaXQgaXMgRXZlbnRDYWxsYmFjayA9PiAhIWl0KTtcbiAgICBpZiAocmV2ZXJ0cy5sZW5ndGgpIHJldHVybiAoZSwgaSkgPT4gcmV2ZXJ0cy5mb3JFYWNoKChpdCkgPT4gaXQoZSwgaSkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0b1J1bldpdGhEcmFnQ2xlYW51cChcbiAgYWN0aW9uOiBGMndBY3Rpb24sXG4gIGJvdW5kOiBCb3VuZEVsZW1lbnQsXG4gIHRyaWdnZXI6IFRyaWdnZXJUeXBlXG4pOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIHdoaWxlIChhY3Rpb24udHlwZSA9PT0gJ0FMSUFTJykge1xuICAgIGFjdGlvbiA9IGFsbFJlYWN0aW9ucygpW2FjdGlvbi5hbGlhc107XG4gIH1cbiAgY29uc3QgcnVuID0gdG9SdW4oYWN0aW9uLCBib3VuZCwgdHJpZ2dlcik7XG4gIHJldHVybiAoZSkgPT4ge1xuICAgIGlmIChhY3Rpb24udHlwZSAhPT0gJ0FOSU1BVEUnICYmIHRyaWdnZXIgPT09ICdkcmFnJykge1xuICAgICAgY29uc3QgZCA9IChlIGFzIEN1c3RvbUV2ZW50PERyYWdnaW5nPikuZGV0YWlsO1xuICAgICAgaWYgKCFkLmhhbmRsZWQpIHtcbiAgICAgICAgZC5oYW5kbGVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHJ1bihlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gc2tpcCBhbGwgYW5pbWF0aW9ucyB3aGVuIGEgZHJhZyBpcyBpbiBwcm9ncmVzc1xuICAgIGlmIChkcmFnX3N0YXJ0ZWQpIHJldHVybjtcbiAgICBpZiAoYWN0aW9uLnR5cGUgPT09ICdBTklNQVRFJyAmJiBhY3Rpb24ucm9vdElkKSB7XG4gICAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYWN0aW9uLnJvb3RJZCk7XG4gICAgICAvLyBhZGQgcmV2ZXJ0IGZ1bmN0aW9ucyB0byBwYXJlbnQgZWxlbWVudHMsIHNvIHRoZXkgY2FuIHJlc2V0IHRoZWlyIGNoaWxkcmVuIHdoZW4gbmVlZGVkXG4gICAgICBpZiAocm9vdD8ucGFyZW50RWxlbWVudCkge1xuICAgICAgICBjb25zdCByZXZlcnQgPSBvbmNlKHJ1bihlKSk7XG4gICAgICAgIGlmIChyZXZlcnQpIHtcbiAgICAgICAgICBsZXQgZWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IHJvb3Q/LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgd2hpbGUgKGVsKSB7XG4gICAgICAgICAgICAvLyBUT0RPIHRoaXMgd2lsbCBsZWFrIGFzIGl0J3MgdW5saWtlbHkgdGhlc2UgZWxlbWVudHMgd2lsbCBldmVyIG5lZWQgdG8gcmVzZXRcbiAgICAgICAgICAgIC8vIENvdWxkIGJlIGltcHJvdmVkIGJ5IGZsYWdnaW5nICdyZXNldHRhYmxlJyBub2RlcywgYW5kIG9ubHkgYWRkaW5nIHRoZSByZXNldCBmdW5jdGlvbiB0byB0aGVtXG4gICAgICAgICAgICAoZWwuZjJ3X3Jlc2V0IHx8PSBbXSkucHVzaChyZXZlcnQpO1xuICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgaWYgKGVsPy50YWdOYW1lID09PSAnQk9EWScpIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV2ZXJ0O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcnVuKGUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0b1J1bihcbiAgYWN0aW9uOiBGMndBY3Rpb24sXG4gIGJvdW5kOiBCb3VuZEVsZW1lbnQsXG4gIHRyaWdnZXI6IFRyaWdnZXJUeXBlXG4pOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlICdCQUNLJzpcbiAgICAgIHJldHVybiAoKSA9PiAod2luZG93LkYyV19QUkVWSUVXX0JBQ0sgPz8gaGlzdG9yeS5iYWNrKSgpO1xuICAgIGNhc2UgJ0pTJzpcbiAgICAgIHJldHVybiAoKSA9PiBldmFsKGFjdGlvbi5jb2RlKTtcbiAgICBjYXNlICdVUkwnOlxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWYgKGFjdGlvbi5vcGVuSW5OZXdUYWIpIHtcbiAgICAgICAgICB3aW5kb3cub3BlbihhY3Rpb24udXJsLCAnX2JsYW5rJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2luZG93LkYyV19QUkVWSUVXX05BVklHQVRFXG4gICAgICAgICAgICA/IHdpbmRvdy5GMldfUFJFVklFV19OQVZJR0FURShhY3Rpb24udXJsKVxuICAgICAgICAgICAgOiBsb2NhdGlvbi5hc3NpZ24oYWN0aW9uLnVybCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgY2FzZSAnU0VUX1ZBUklBQkxFJzpcbiAgICAgIGNvbnN0IHsgdmFyaWFibGVJZCwgdmFyaWFibGVWYWx1ZSB9ID0gYWN0aW9uO1xuICAgICAgaWYgKHZhcmlhYmxlSWQgJiYgdmFyaWFibGVWYWx1ZT8udmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuICgpID0+XG4gICAgICAgICAgc2V0VmFyaWFibGUodmFyaWFibGVJZCwgcmVzb2x2ZSh2YXJpYWJsZVZhbHVlLnZhbHVlLCB2YXJpYWJsZUlkKSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdTRVRfVkFSSUFCTEVfTU9ERSc6XG4gICAgICBjb25zdCB7IHZhcmlhYmxlQ29sbGVjdGlvbk5hbWUsIHZhcmlhYmxlTW9kZU5hbWUgfSA9IGFjdGlvbjtcbiAgICAgIGlmICh2YXJpYWJsZUNvbGxlY3Rpb25OYW1lICYmIHZhcmlhYmxlTW9kZU5hbWUpXG4gICAgICAgIHJldHVybiAoKSA9PiBzZXRWYXJpYWJsZU1vZGUodmFyaWFibGVDb2xsZWN0aW9uTmFtZSwgdmFyaWFibGVNb2RlTmFtZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdDT05ESVRJT05BTCc6XG4gICAgICBjb25zdCBibG9ja3MgPSBhY3Rpb24uY29uZGl0aW9uYWxCbG9ja3MubWFwKCh2KSA9PiB7XG4gICAgICAgIGNvbnN0IHJ1biA9IGFjdGlvbnNUb1J1bih2LmFjdGlvbnMsIGJvdW5kLCB0cmlnZ2VyKTtcbiAgICAgICAgY29uc3QgeyBjb25kaXRpb24gfSA9IHY7XG4gICAgICAgIGNvbnN0IHRlc3QgPSBjb25kaXRpb25cbiAgICAgICAgICA/ICgpID0+IHRvQm9vbGVhbihyZXNvbHZlKGNvbmRpdGlvbi52YWx1ZSkpXG4gICAgICAgICAgOiAoKSA9PiB0cnVlO1xuICAgICAgICByZXR1cm4geyB0ZXN0LCBydW4gfTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29uc3QgcmV2ZXJ0czogRXZlbnRDYWxsYmFja1tdID0gW107XG4gICAgICAgIGZvciAoY29uc3QgYmxvY2sgb2YgYmxvY2tzKSB7XG4gICAgICAgICAgaWYgKGJsb2NrLnRlc3QoKSkge1xuICAgICAgICAgICAgY29uc3QgcmV2ZXJ0ID0gYmxvY2sucnVuKCk7XG4gICAgICAgICAgICBpZiAocmV2ZXJ0KSByZXZlcnRzLnB1c2gocmV2ZXJ0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmV2ZXJ0cy5sZW5ndGgpIHJldHVybiAoZSkgPT4gcmV2ZXJ0cy5mb3JFYWNoKChpdCkgPT4gaXQoZSkpO1xuICAgICAgfTtcbiAgICBjYXNlICdLRVlfQ09ORElUSU9OJzpcbiAgICAgIGNvbnN0IHJ1biA9IGFjdGlvbnNUb1J1bihhY3Rpb24uYWN0aW9ucywgYm91bmQsIHRyaWdnZXIpO1xuICAgICAgY29uc3Qga2V5Q29kZSA9IGFjdGlvbi5rZXlDb2Rlc1swXTtcbiAgICAgIGNvbnN0IHNoaWZ0S2V5ID0gYWN0aW9uLmtleUNvZGVzLnNsaWNlKDEpLmluY2x1ZGVzKDE2KTtcbiAgICAgIGNvbnN0IGN0cmxLZXkgPSBhY3Rpb24ua2V5Q29kZXMuc2xpY2UoMSkuaW5jbHVkZXMoMTcpO1xuICAgICAgY29uc3QgYWx0S2V5ID0gYWN0aW9uLmtleUNvZGVzLnNsaWNlKDEpLmluY2x1ZGVzKDE4KTtcbiAgICAgIGNvbnN0IG1ldGFLZXkgPSBhY3Rpb24ua2V5Q29kZXMuc2xpY2UoMSkuaW5jbHVkZXMoOTEpO1xuICAgICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICAgIGlmIChlLmtleUNvZGUgIT09IGtleUNvZGUpIHJldHVybjtcbiAgICAgICAgICBpZiAoZS5jdHJsS2V5ICE9PSBjdHJsS2V5KSByZXR1cm47XG4gICAgICAgICAgaWYgKGUuYWx0S2V5ICE9PSBhbHRLZXkpIHJldHVybjtcbiAgICAgICAgICBpZiAoZS5tZXRhS2V5ICE9PSBtZXRhS2V5KSByZXR1cm47XG4gICAgICAgICAgaWYgKGUuc2hpZnRLZXkgIT09IHNoaWZ0S2V5KSByZXR1cm47XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgcnVuKGUpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIGNhc2UgJ0NMT1NFX09WRVJMQVknOiB7XG4gICAgICBpZiAoYWN0aW9uLnNlbGYpIHJldHVybiAoZSkgPT4gKGU/LnRhcmdldCBhcyBCb3VuZEVsZW1lbnQpPy5mMndfY2xvc2U/LigpO1xuICAgICAgaWYgKGFjdGlvbi5vdmVybGF5SWQpIHtcbiAgICAgICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFjdGlvbi5vdmVybGF5SWQpO1xuICAgICAgICBpZiAoIW92ZXJsYXkpIGJyZWFrO1xuICAgICAgICByZXR1cm4gKCkgPT4gb3ZlcmxheS5mMndfY2xvc2U/LigpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgJ1NDUk9MTF9UTyc6XG4gICAgICBpZiAoIWFjdGlvbi5kZXN0aW5hdGlvbklkKSBicmVhaztcbiAgICAgIGNvbnN0IGVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFjdGlvbi5kZXN0aW5hdGlvbklkKTtcbiAgICAgIGlmICghZWx0KSBicmVhaztcbiAgICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgICAvLyBXZSBkb24ndCB3YW50IHRvIHNjcm9sbCBhbmQgbmF2aWdhdGUgYXQgdGhlIHNhbWUgdGltZSBmb3IgYW5jaG9yc1xuICAgICAgICBpZiAoZT8uY3VycmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSBlPy5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlbHQuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgIGJlaGF2aW9yOiBhY3Rpb24udHJhbnNpdGlvbj8udHlwZSA/ICdzbW9vdGgnIDogJ2luc3RhbnQnLFxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgY2FzZSAnT1ZFUkxBWSc6XG4gICAgICBpZiAoIWFjdGlvbi5kZXN0aW5hdGlvbklkKSBicmVhaztcbiAgICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhY3Rpb24uZGVzdGluYXRpb25JZCk7XG4gICAgICBpZiAoIW92ZXJsYXkpIGJyZWFrO1xuICAgICAgY29uc3QgbW9kYWwgPSBBcnJheSguLi5vdmVybGF5LmNoaWxkcmVuKS5maW5kKFxuICAgICAgICAoaXQpID0+IGl0LnRhZ05hbWUgIT09ICdURU1QTEFURSdcbiAgICAgICkgYXMgQm91bmRFbGVtZW50O1xuICAgICAgaWYgKCFtb2RhbCkgYnJlYWs7XG4gICAgICBjb25zdCB7IHRyYW5zaXRpb24sIG92ZXJsYXlQb3NpdGlvblR5cGUsIG92ZXJsYXlSZWxhdGl2ZVBvc2l0aW9uIH0gPVxuICAgICAgICBhY3Rpb247XG4gICAgICBjb25zdCBkdXJhdGlvbiA9IE1hdGgucm91bmQoMTAwMCAqICh0cmFuc2l0aW9uPy5kdXJhdGlvbiA/PyAwKSk7XG4gICAgICBjb25zdCBhbmltYXRpb25zOiBBbmltYXRpb25bXSA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkOiBhY3Rpb24uZGVzdGluYXRpb25JZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAgeyBrZXk6ICd2aXNpYmlsaXR5JywgZnJvbTogJ2hpZGRlbicsIHRvOiAndmlzaWJsZScgfSxcbiAgICAgICAgICAgIHsga2V5OiAnb3BhY2l0eScsIGZyb206ICcwJywgdG86ICcxJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuXG4gICAgICBpZiAob3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ01BTlVBTCcpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICBpZiAodHJpZ2dlciA9PT0gJ2hvdmVyJykge1xuICAgICAgICAgICAgLy8gdGVtcG9yYXJ5IGRpc2FibGUgbW91c2VsZWF2ZSBoYW5kbGVyIG9uIGVsZW1lbnQsIGJlY2F1c2Ugd2Ugd2FudCB0aGUgb3ZlcmxheSB0byByZW1haW4gdmlzaWJsZSB3aGlsZSB0aGUgY3Vyc29yIGhvdmVycyB0aGUgYm91bmQgZWxlbWVudCBPUiB0aGUgb3ZlcmxheSBpdHNlbGZcbiAgICAgICAgICAgIGNvbnN0IGxlYXZlID0gYm91bmQuZjJ3X21vdXNlbGVhdmVfcmVtb3ZlPy4oKTtcbiAgICAgICAgICAgIGlmIChsZWF2ZSkge1xuICAgICAgICAgICAgICBjb25zdCBtb3VzZW1vdmUgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNPdXRzaWRlKGV2ZW50LCBib3VuZCkgJiYgaXNPdXRzaWRlKGV2ZW50LCBtb2RhbCkpIHtcbiAgICAgICAgICAgICAgICAgIGxlYXZlKCk7XG4gICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gVE9ETyBtYWtlIGl0IHN0aWNrIHRvIGVsZW1lbnQgaW4gY2FzZSBvZiByZXNpemUgP1xuICAgICAgICAgIC8vIFRPRE8gY2xvc2UgaXQgaW4gY2FzZSBvZiByZXNwb25zaXZlIGxheW91dCBjaGFuZ2UgP1xuICAgICAgICAgIGNvbnN0IGR5bmFtaWNfYW5pbWF0aW9ucyA9IGFuaW1hdGlvbnMuc2xpY2UoMCk7XG4gICAgICAgICAgY29uc3QgbWFudWFsTGVmdCA9IHRvUHgoXG4gICAgICAgICAgICBib3VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICtcbiAgICAgICAgICAgICAgKG92ZXJsYXlSZWxhdGl2ZVBvc2l0aW9uPy54ID8/IDApXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBtYW51YWxUb3AgPSB0b1B4KFxuICAgICAgICAgICAgYm91bmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICtcbiAgICAgICAgICAgICAgKG92ZXJsYXlSZWxhdGl2ZVBvc2l0aW9uPy55ID8/IDApXG4gICAgICAgICAgKTtcbiAgICAgICAgICBtb2RhbC5zdHlsZS5zZXRQcm9wZXJ0eSgnbGVmdCcsIG1hbnVhbExlZnQpO1xuICAgICAgICAgIG1vZGFsLnN0eWxlLnNldFByb3BlcnR5KCd0b3AnLCBtYW51YWxUb3ApO1xuICAgICAgICAgIGlmICh0cmFuc2l0aW9uPy50eXBlID09PSAnTU9WRV9JTicpIHtcbiAgICAgICAgICAgIGlmICh0cmFuc2l0aW9uLmRpcmVjdGlvbiA9PT0gJ0xFRlQnKSB7XG4gICAgICAgICAgICAgIGR5bmFtaWNfYW5pbWF0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICBlbHRJZDogbW9kYWwuaWQsXG4gICAgICAgICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAnbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgIGZyb206ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgdG86IG1hbnVhbExlZnQsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0cmFuc2l0aW9uLmRpcmVjdGlvbiA9PT0gJ1JJR0hUJykge1xuICAgICAgICAgICAgICBkeW5hbWljX2FuaW1hdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgZWx0SWQ6IG1vZGFsLmlkLFxuICAgICAgICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2xlZnQnLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiAnMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgdG86IG1hbnVhbExlZnQsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiAnLTEwMCUgMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgdG86ICcwcHggMHB4JyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnVE9QJykge1xuICAgICAgICAgICAgICBkeW5hbWljX2FuaW1hdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgZWx0SWQ6IG1vZGFsLmlkLFxuICAgICAgICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3RvcCcsXG4gICAgICAgICAgICAgICAgICAgIGZyb206ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgdG86IG1hbnVhbFRvcCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnQk9UVE9NJykge1xuICAgICAgICAgICAgICBkeW5hbWljX2FuaW1hdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgZWx0SWQ6IG1vZGFsLmlkLFxuICAgICAgICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3RvcCcsXG4gICAgICAgICAgICAgICAgICAgIGZyb206ICcwcHgnLFxuICAgICAgICAgICAgICAgICAgICB0bzogbWFudWFsVG9wLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogJzBweCAtMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIHRvOiAnMHB4IDBweCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdG9FeGVjdXRhYmxlQW5pbWF0aW9ucyhcbiAgICAgICAgICAgIGR5bmFtaWNfYW5pbWF0aW9ucyxcbiAgICAgICAgICAgIHRyYW5zaXRpb24/LmVhc2luZyxcbiAgICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgICAgYm91bmQsXG4gICAgICAgICAgICB0cmlnZ2VyLFxuICAgICAgICAgICAgYCR7dHJpZ2dlcn0obWFudWFsX292ZXJsYXkpYCxcbiAgICAgICAgICAgIG92ZXJsYXlcbiAgICAgICAgICApKCk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmICh0cmFuc2l0aW9uPy50eXBlID09PSAnTU9WRV9JTicpIHtcbiAgICAgICAgYW5pbWF0aW9ucy5wdXNoKFxuICAgICAgICAgIC4uLmdldE1vdmVJbkFuaW1hdGlvbnMobW9kYWwuaWQsIG92ZXJsYXlQb3NpdGlvblR5cGUsIHRyYW5zaXRpb24pXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKHRyYW5zaXRpb24/LnR5cGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdVbnN1cHBvcnRlZCB0cmFuc2l0aW9uOicsIHRyYW5zaXRpb24pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRvRXhlY3V0YWJsZUFuaW1hdGlvbnMoXG4gICAgICAgIGFuaW1hdGlvbnMsXG4gICAgICAgIHRyYW5zaXRpb24/LmVhc2luZyxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGJvdW5kLFxuICAgICAgICB0cmlnZ2VyLFxuICAgICAgICBgJHt0cmlnZ2VyfShvdmVybGF5KWAsXG4gICAgICAgIG92ZXJsYXlcbiAgICAgICk7XG4gICAgY2FzZSAnQU5JTUFURSc6IHtcbiAgICAgIGNvbnN0IHsgYW5pbWF0aW9ucywgdHJhbnNpdGlvbiwgcm9vdElkLCByZXNldCB9ID0gYWN0aW9uO1xuICAgICAgY29uc3QgZHVyYXRpb24gPSBNYXRoLnJvdW5kKDEwMDAgKiAodHJhbnNpdGlvbj8uZHVyYXRpb24gPz8gMCkpO1xuICAgICAgY29uc3QgcnVuID0gdG9FeGVjdXRhYmxlQW5pbWF0aW9ucyhcbiAgICAgICAgYW5pbWF0aW9ucyxcbiAgICAgICAgdHJhbnNpdGlvbj8uZWFzaW5nLFxuICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgYm91bmQsXG4gICAgICAgIHRyaWdnZXIsXG4gICAgICAgIHJlc2V0ID8gYCR7dHJpZ2dlcn0oK3Jlc2V0KWAgOiB0cmlnZ2VyXG4gICAgICApO1xuICAgICAgcmV0dXJuIHJlc2V0ICYmIHJvb3RJZFxuICAgICAgICA/IChlLCBpKSA9PiB7XG4gICAgICAgICAgICAvLyBuZWVkIHRvIHJlc2V0IGFsbCBhbmltYXRpb25zIGRvbmUgb24gZWxlbWVudHMgYmVsb3cgcm9vdFxuICAgICAgICAgICAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJvb3RJZCk7XG4gICAgICAgICAgICBpZiAocm9vdCkge1xuICAgICAgICAgICAgICBjb25zdCB7IGYyd19yZXNldCB9ID0gcm9vdDtcbiAgICAgICAgICAgICAgaWYgKGYyd19yZXNldD8ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJvb3QuZjJ3X3Jlc2V0O1xuICAgICAgICAgICAgICAgIGYyd19yZXNldC5yZXZlcnNlKCkuZm9yRWFjaCgoaXQpID0+IGl0KHVuZGVmaW5lZCwgdHJ1ZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcnVuKGUsIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgOiBydW47XG4gICAgfVxuICAgIGNhc2UgJ1VQREFURV9NRURJQV9SVU5USU1FJzoge1xuICAgICAgaWYgKCFhY3Rpb24uZGVzdGluYXRpb25JZCkgYnJlYWs7XG4gICAgICBjb25zdCBlbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhY3Rpb24uZGVzdGluYXRpb25JZCk7XG4gICAgICBpZiAoIWVsdCkgYnJlYWs7XG4gICAgICBzd2l0Y2ggKGFjdGlvbi5tZWRpYUFjdGlvbikge1xuICAgICAgICBjYXNlICdNVVRFJzpcbiAgICAgICAgICByZXR1cm4gbXV0ZShlbHQpO1xuICAgICAgICBjYXNlICdVTk1VVEUnOlxuICAgICAgICAgIHJldHVybiB1bk11dGUoZWx0KTtcbiAgICAgICAgY2FzZSAnVE9HR0xFX01VVEVfVU5NVVRFJzpcbiAgICAgICAgICByZXR1cm4gdG9nZ2xlTXV0ZShlbHQpO1xuICAgICAgICBjYXNlICdQTEFZJzpcbiAgICAgICAgICByZXR1cm4gcGxheShlbHQpO1xuICAgICAgICBjYXNlICdQQVVTRSc6XG4gICAgICAgICAgcmV0dXJuIHBhdXNlKGVsdCk7XG4gICAgICAgIGNhc2UgJ1RPR0dMRV9QTEFZX1BBVVNFJzpcbiAgICAgICAgICByZXR1cm4gdG9nZ2xlUGxheShlbHQpO1xuICAgICAgICBjYXNlICdTS0lQX0JBQ0tXQVJEJzpcbiAgICAgICAgICByZXR1cm4gc2Vla0JhY2t3YXJkKGVsdCwgYWN0aW9uLmFtb3VudFRvU2tpcCk7XG4gICAgICAgIGNhc2UgJ1NLSVBfRk9SV0FSRCc6XG4gICAgICAgICAgcmV0dXJuIHNlZWtGb3J3YXJkKGVsdCwgYWN0aW9uLmFtb3VudFRvU2tpcCk7XG4gICAgICAgIGNhc2UgJ1NLSVBfVE8nOlxuICAgICAgICAgIHJldHVybiBzZWVrVG8oZWx0LCBhY3Rpb24ubmV3VGltZXN0YW1wKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ0FjdGlvbiBub3QgaW1wbGVtZW50ZWQgeWV0OiAnICsgYWN0aW9uLnR5cGUpO1xuICB9XG4gIHJldHVybiAoKSA9PiB7fTtcbn1cblxubGV0IG92ZXJsYXlTdGFja1pJbmRleCA9IDk5OTk7XG5cbmZ1bmN0aW9uIHRvRXhlY3V0YWJsZUFuaW1hdGlvbnMoXG4gIG9yaWdBbmltYXRpb25zOiBBbmltYXRpb25bXSxcbiAgZWFzaW5nID0gJ2xpbmVhcicsXG4gIGR1cmF0aW9uOiBudW1iZXIsXG4gIGJvdW5kOiBCb3VuZEVsZW1lbnQsXG4gIHRyaWdnZXI6IFRyaWdnZXJUeXBlLFxuICBkZWJ1Zzogc3RyaW5nLFxuICBtb2RhbD86IEhUTUxFbGVtZW50XG4pOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIHJldHVybiAoZSkgPT4ge1xuICAgIC8vIGxvY2FsIGNvcHkgb2YgYW5pbWF0aW9ucywgc28gd2UgY2FuIG1vZGlmeSBpdCAoZS5nLiB6LWluZGV4IGJlbG93KVxuICAgIGxldCBhbmltYXRpb25zID0gb3JpZ0FuaW1hdGlvbnM7XG4gICAgaWYgKG1vZGFsKSB7XG4gICAgICAvLyBzZXQgbWFpbiBzY3JvbGwgbG9jayB3aGVuIG1vZGFsIGlzIG9wZW5lZFxuICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnRFbGVtZW50IS5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuICAgICAgLy8gZW5zdXJlIG92ZXJsYXlzIGFyZSBzdGFja2VkIG9udG8gZWFjaCBvdGhlclxuICAgICAgYW5pbWF0aW9ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkOiBtb2RhbC5pZCxcbiAgICAgICAgICBwcm9wczogW3sga2V5OiAnei1pbmRleCcsIGZyb206IDAsIHRvOiBvdmVybGF5U3RhY2taSW5kZXgrKyB9XSxcbiAgICAgICAgfSxcbiAgICAgICAgLi4uYW5pbWF0aW9ucyxcbiAgICAgIF07XG4gICAgfVxuICAgIGNvbnN0IHJldmVyc2VBbmltYXRpb25zID0gZXhlY3V0ZUFuaW1hdGlvbnMoXG4gICAgICBhbmltYXRpb25zLFxuICAgICAgZWFzaW5nLFxuICAgICAgZHVyYXRpb24sXG4gICAgICBib3VuZCxcbiAgICAgIHRyaWdnZXIsXG4gICAgICBkZWJ1ZyxcbiAgICAgIGVcbiAgICApO1xuICAgIGNvbnN0IGNsb3NlID0gb25jZTxFdmVudENhbGxiYWNrPigoXywgaSk6IHZvaWQgPT4ge1xuICAgICAgaWYgKG1vZGFsKSB7XG4gICAgICAgIG92ZXJsYXlTdGFja1pJbmRleC0tO1xuICAgICAgICAvLyB1bnNldCBtYWluIHNjcm9sbCBsb2NrIHdoZW4gbW9kYWwgaXMgY2xvc2VkXG4gICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50RWxlbWVudCEuc3R5bGUub3ZlcmZsb3cgPSAnJztcbiAgICAgIH1cbiAgICAgIGV4ZWN1dGVBbmltYXRpb25zKFxuICAgICAgICByZXZlcnNlQW5pbWF0aW9ucyxcbiAgICAgICAgZWFzaW5nLFxuICAgICAgICBpID8gMCA6IGR1cmF0aW9uLFxuICAgICAgICBib3VuZCxcbiAgICAgICAgdHJpZ2dlcixcbiAgICAgICAgYCR7ZGVidWd9KHJldmVydClgXG4gICAgICApO1xuICAgIH0pO1xuICAgIGlmIChtb2RhbCkgbW9kYWwuZjJ3X2Nsb3NlID0gY2xvc2U7XG4gICAgcmV0dXJuIGNsb3NlO1xuICB9O1xufVxuXG5mdW5jdGlvbiBleGVjdXRlQW5pbWF0aW9ucyhcbiAgYW5pbWF0aW9uczogQW5pbWF0aW9uW10sXG4gIGVhc2luZzogc3RyaW5nLFxuICBkdXJhdGlvbjogbnVtYmVyLFxuICBib3VuZDogQm91bmRFbGVtZW50LFxuICB0cmlnZ2VyOiBUcmlnZ2VyVHlwZSxcbiAgZGVidWc6IHN0cmluZyxcbiAgZT86IEV2ZW50XG4pOiBBbmltYXRpb25bXSB7XG4gIC8vIFRPRE8gdXNlIHZpZXcgdHJhbnNpdGlvbiBpZiBhdmFpbGFibGVcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgY29uc29sZS5kZWJ1ZyhgRXhlY3V0aW5nIGFuaW1hdGlvbnMgKCR7ZGVidWd9KWAsIGFuaW1hdGlvbnMsIGJvdW5kKTtcbiAgfVxuICBjb25zdCByZXZlcnNlOiBBbmltYXRpb25bXSA9IFtdO1xuICBjb25zdCBjb250YWluZXJzVG9SZU9yZGVyID0gbmV3IFNldDxIVE1MRWxlbWVudD4oKTtcblxuICBpZiAodHJpZ2dlciA9PT0gJ2RyYWcnKSB7XG4gICAgZXhlY3V0ZURyYWdTdGFydChcbiAgICAgIGFuaW1hdGlvbnMsXG4gICAgICBlYXNpbmcsXG4gICAgICBkdXJhdGlvbixcbiAgICAgIGJvdW5kLFxuICAgICAgKGUgYXMgQ3VzdG9tRXZlbnQ8RHJhZ2dpbmc+KS5kZXRhaWxcbiAgICApO1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGZsaXBEb21DaGFuZ2VzOiAoKG5lZWRzRmluYWxTdGF0ZTogYm9vbGVhbikgPT4gdm9pZClbXSA9IFtdO1xuICBjb25zdCBmbGlwQW5pbWF0aW9uczogKCgpID0+IHZvaWQpW10gPSBbXTtcbiAgbGV0IG5lZWRzRmluYWxTdGF0ZSA9IGZhbHNlO1xuXG4gIGZvciAoY29uc3QgeyBlbHRJZCwgYWx0SWQsIHByb3BzLCByZWFjdGlvbnMgfSBvZiBhbmltYXRpb25zKSB7XG4gICAgbGV0IGVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsdElkKSBhcyBCb3VuZEVsZW1lbnQ7XG4gICAgaWYgKCFlbHQpIHtcbiAgICAgIHNob3VsZE5vdEhhcHBlbihgQ2FuJ3QgZmluZCBlbGVtZW50IGZvciBpZDogJHtlbHRJZH1gKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoZWx0LmYyd19yZXBsYWNlZCkgZWx0ID0gZWx0LmYyd19yZXBsYWNlZDtcbiAgICBpZiAoYWx0SWQpIHtcbiAgICAgIGxldCBhbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhbHRJZCkgYXMgQm91bmRFbGVtZW50O1xuICAgICAgaWYgKCFhbHQpIHtcbiAgICAgICAgY29uc3QgYWx0VHBsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGVtcGxhdGVJZChhbHRJZCkpO1xuICAgICAgICBpZiAoIWFsdFRwbCkge1xuICAgICAgICAgIHNob3VsZE5vdEhhcHBlbihgQ2FuJ3QgZmluZCB0ZW1wbGF0ZSBmb3IgaWQ6ICR7YWx0SWR9YCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYWx0RnJhZ21lbnQgPSAoYWx0VHBsIGFzIEhUTUxUZW1wbGF0ZUVsZW1lbnQpLmNvbnRlbnQ/LmNsb25lTm9kZShcbiAgICAgICAgICB0cnVlXG4gICAgICAgICkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIGFsdCA9IGFsdEZyYWdtZW50LnF1ZXJ5U2VsZWN0b3IoJyonKSBhcyBCb3VuZEVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHByZXZpb3VzIGVsZW1lbnQgaGFkIGNsZWFudXAgY2FsbGJhY2tzLCBob29rIHRoZW0gaW50byB0aGUgcmVwbGFjZWQgZWxlbWVudHMgaW5zdGVhZFxuICAgICAgY29uc3QgeyBmMndfbW91c2V1cCB9ID0gZWx0O1xuICAgICAgY29uc3QgbW91c2VsZWF2ZSA9IGVsdC5mMndfbW91c2VsZWF2ZV9yZW1vdmU/LigpO1xuICAgICAgaWYgKG1vdXNlbGVhdmUpIHtcbiAgICAgICAgaW5zdGFsbE1vdXNlTGVhdmUoYWx0LCBtb3VzZWxlYXZlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGYyd19tb3VzZXVwKSBhbHQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGYyd19tb3VzZXVwKTtcbiAgICAgIC8vIEhtbW0gbWF5YmUgbmVlZCB0byB0cmFuc2ZlciB0aGUgdGltZW91dCBjbGVhbnVwIGFzIHdlbGwgPyBub3Qgc3VyZVxuICAgICAgLy8gaWYgKGYyd19jbGVhbnVwX3RpbWVvdXQpIGFsdC5mMndfY2xlYW51cF90aW1lb3V0ID0gZjJ3X2NsZWFudXBfdGltZW91dDtcbiAgICAgIGlmIChtb3VzZWxlYXZlIHx8IGYyd19tb3VzZXVwKSB7XG4gICAgICAgIC8vIGVuc3VyZXMgdGhlIGFsdCBlbGVtZW50IHdpbGwgYWN0dWFsbHkgcmVjZWl2ZWQgbW91c2UgZXZlbnRzXG4gICAgICAgIHJlbW92ZVBvaW50ZXJFdmVudHNOb25lKGFsdCk7XG4gICAgICB9XG4gICAgICAvLyBpbnN0YWxsIGV2ZW50IGhhbmRsZXJzIGZvciBuZXcgZWxlbWVudFxuICAgICAgaG9vayhhbHQsIHRydWUsIGR1cmF0aW9uKTtcbiAgICAgIGVsdC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgYWx0KTtcbiAgICAgIGVsdC5mMndfcmVwbGFjZWQgPSBhbHQ7XG4gICAgICBkZWxldGUgYWx0LmYyd19yZXBsYWNlZDtcbiAgICAgIGNvbnN0IGN1cnJlbnREaXNwbGF5ID0gZ2V0Q29tcHV0ZWRTdHlsZShlbHQpLmRpc3BsYXk7XG4gICAgICBmbGlwRG9tQ2hhbmdlcy5wdXNoKCgpID0+IHtcbiAgICAgICAgc2V0UHJvcGVydGllc1dpdGhBbmltYXRlKGVsdCwge1xuICAgICAgICAgIGRpc3BsYXk6ICdub25lJyxcbiAgICAgICAgfSk7XG4gICAgICAgIHNldFByb3BlcnRpZXNXaXRoQW5pbWF0ZShhbHQsIHtcbiAgICAgICAgICBkaXNwbGF5OiBjdXJyZW50RGlzcGxheSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIGZsaXBBbmltYXRpb25zLnB1c2goKCkgPT4ge1xuICAgICAgICAvLyBGaWdtYSBkaXNzb2x2ZXMgb25seSBkaXNzb2x2ZXMgdGhlIGRlc3RpbmF0aW9uIG9uIHRvcCBvZiB0aGUgc291cmNlIGxheWVyLCBzbyB3ZSBuZWVkIHRvIGRvIHRoZSBzYW1lXG4gICAgICAgIGFuaW1hdGVQcm9wcyhcbiAgICAgICAgICBlbHQsXG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdkaXNwbGF5JyxcbiAgICAgICAgICAgICAgZnJvbTogY3VycmVudERpc3BsYXksXG4gICAgICAgICAgICAgIHRvOiAnbm9uZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZWFzaW5nLFxuICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgIGNvbnRhaW5lcnNUb1JlT3JkZXJcbiAgICAgICAgKTtcbiAgICAgICAgYW5pbWF0ZVByb3BzKFxuICAgICAgICAgIGFsdCxcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ29wYWNpdHknLFxuICAgICAgICAgICAgICBmcm9tOiAwLFxuICAgICAgICAgICAgICB0bzogJ3JldmVydC1sYXllcicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdkaXNwbGF5JyxcbiAgICAgICAgICAgICAgZnJvbTogJ25vbmUnLFxuICAgICAgICAgICAgICB0bzogJ3JldmVydC1sYXllcicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZWFzaW5nLFxuICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgIGNvbnRhaW5lcnNUb1JlT3JkZXJcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXZlcnNlLnB1c2goe1xuICAgICAgICBlbHRJZDogYWx0LmlkLFxuICAgICAgICBhbHRJZDogZWx0LmlkLFxuICAgICAgfSk7XG4gICAgICAvLyByZS1wb3NpdGlvbiB0aGUgY2hpbGQgYXQgdGhlIHJpZ2h0IHBsYWNlIGluIHRoZSBwYXJlbnRcbiAgICAgIGlmICghaXNOYU4oK2dldENvbXB1dGVkU3R5bGUoYWx0KS5nZXRQcm9wZXJ0eVZhbHVlKCctLWYydy1vcmRlcicpKSkge1xuICAgICAgICBjb250YWluZXJzVG9SZU9yZGVyLmFkZChlbHQucGFyZW50RWxlbWVudCEpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjdXJyZW50UHJvcHM6IEFuaW1hdGVkUHJvcFdpdGhDYW1lbEtleVtdID0gKHByb3BzIHx8IFtdKVxuICAgICAgICAubWFwKChpdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZyb20gPSBtYXBDdXJyZW50KGVsdCEsIGl0LmtleSwgaXQuZnJvbSk7XG4gICAgICAgICAgY29uc3QgdG8gPSBtYXBDdXJyZW50KGVsdCEsIGl0LmtleSwgaXQudG8pO1xuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleTogaXQua2V5LFxuICAgICAgICAgICAgcHNldWRvOiBpdC5wc2V1ZG8sXG4gICAgICAgICAgICBmcm9tLFxuICAgICAgICAgICAgdG8sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcigoaXQpID0+IGl0LmZyb20gIT09IGl0LnRvKVxuICAgICAgICAubWFwKHdpdGhDYW1lbEtleSk7XG4gICAgICBjb25zdCBiZWZvcmVBbmltYXRpb25Qcm9wcyA9IGN1cnJlbnRQcm9wcy5tYXAoKHApID0+IHtcbiAgICAgICAgaWYgKGlzQXV0b1RvQ3VycmVudFByb3AocC5rZXkpKSB7XG4gICAgICAgICAgaWYgKHAudG8gPT09ICdhdXRvJykge1xuICAgICAgICAgICAgbmVlZHNGaW5hbFN0YXRlID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHAuZnJvbSA9PT0gJ2F1dG8nKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5wLFxuICAgICAgICAgICAgICBmcm9tOiBnZXRDb21wdXRlZFN0eWxlKGVsdCkuZ2V0UHJvcGVydHlWYWx1ZShwLmtleSksXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcDtcbiAgICAgIH0pO1xuXG4gICAgICBmbGlwRG9tQ2hhbmdlcy5wdXNoKChuZWVkc0ZpbmFsU3RhdGUpID0+IHtcbiAgICAgICAgYXBwbHlEb21DaGFuZ2VzKGVsdCwgYmVmb3JlQW5pbWF0aW9uUHJvcHMsIG5lZWRzRmluYWxTdGF0ZSk7XG4gICAgICB9KTtcblxuICAgICAgZmxpcEFuaW1hdGlvbnMucHVzaCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGFmdGVyQW5pbWF0aW9uUHJvcHMgPSBiZWZvcmVBbmltYXRpb25Qcm9wcy5tYXAoKHApID0+IHtcbiAgICAgICAgICBpZiAocC50byA9PT0gJ2F1dG8nICYmIGlzQXV0b1RvQ3VycmVudFByb3AocC5rZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5wLFxuICAgICAgICAgICAgICB0bzogZ2V0Q29tcHV0ZWRTdHlsZShlbHQpLmdldFByb3BlcnR5VmFsdWUocC5rZXkpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgIH0pO1xuICAgICAgICBhbmltYXRlUHJvcHMoXG4gICAgICAgICAgZWx0LFxuICAgICAgICAgIGFmdGVyQW5pbWF0aW9uUHJvcHMsXG4gICAgICAgICAgZWFzaW5nLFxuICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgIGNvbnRhaW5lcnNUb1JlT3JkZXJcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHJlYWN0aW9ucykge1xuICAgICAgICAgIGlmICh0cmlnZ2VyICE9PSAnaG92ZXInKSB7XG4gICAgICAgICAgICBlbHQuZjJ3X21vdXNlbGVhdmVfcmVtb3ZlPy4oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVhY3Rpb25zLmZvckVhY2goKGl0KSA9PiBob29rRWx0KGVsdCEsIGl0LnR5cGUsIGl0LnRvLCBkdXJhdGlvbikpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJldjogQW5pbWF0aW9uID0ge1xuICAgICAgICBlbHRJZCxcbiAgICAgICAgcHJvcHM6IGN1cnJlbnRQcm9wcy5tYXAoKHApID0+IHtcbiAgICAgICAgICBjb25zdCByZXQ6IEFuaW1hdGVkUHJvcCA9IHtcbiAgICAgICAgICAgIGtleTogcC5rZXksXG4gICAgICAgICAgICBmcm9tOiBwLnRvLFxuICAgICAgICAgICAgdG86IHAuZnJvbSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChwLnBzZXVkbykgcmV0LnBzZXVkbyA9IHAucHNldWRvO1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0pLFxuICAgICAgfTtcbiAgICAgIGlmIChyZWFjdGlvbnMpIHtcbiAgICAgICAgcmV2LnJlYWN0aW9ucyA9IHJlYWN0aW9ucy5tYXAoKGl0KSA9PiAoe1xuICAgICAgICAgIHR5cGU6IGl0LnR5cGUsXG4gICAgICAgICAgZnJvbTogaXQudG8sXG4gICAgICAgICAgdG86IGl0LmZyb20sXG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICAgIHJldmVyc2UucHVzaChyZXYpO1xuICAgIH1cbiAgfVxuICBmbGlwRG9tQ2hhbmdlcy5mb3JFYWNoKChpdCkgPT4gaXQobmVlZHNGaW5hbFN0YXRlKSk7XG4gIGZsaXBBbmltYXRpb25zLmZvckVhY2goKGl0KSA9PiBpdCgpKTtcbiAgZm9yIChjb25zdCBjb250YWluZXIgb2YgY29udGFpbmVyc1RvUmVPcmRlcikge1xuICAgIC8vIFRPRE8gZ2VuZXJhdGUgbWluaW11bSBzZXQgb2YgbW92ZXMgcmVxdWlyZWQ/ICh1c2luZyBpbnNlcnRCZWZvcmUgYW5kIHNvbWUgJ0xvbmdlc3QgSW5jcmVhc2luZyBTdWJzZXF1ZW5jZScgYWxnb3JpdGhtKVxuICAgIGNvbnN0IGNoaWxkcmVuID0gQXJyYXkuZnJvbShjb250YWluZXIuY2hpbGRyZW4pLm1hcCgoaXQsIGkpID0+ICh7IGl0LCBpIH0pKTtcbiAgICBsZXQgb3JkZXJIYXNDaGFuZ2VkID0gZmFsc2U7XG4gICAgY2hpbGRyZW5cbiAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFPcmRlciA9ICsoXG4gICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShhLml0KS5nZXRQcm9wZXJ0eVZhbHVlKCctLWYydy1vcmRlcicpIHx8ICc5OTk5OSdcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYk9yZGVyID0gKyhcbiAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGIuaXQpLmdldFByb3BlcnR5VmFsdWUoJy0tZjJ3LW9yZGVyJykgfHwgJzk5OTk5J1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gYU9yZGVyIC0gYk9yZGVyO1xuICAgICAgfSlcbiAgICAgIC5mb3JFYWNoKChjaGlsZCwgaikgPT4ge1xuICAgICAgICBpZiAob3JkZXJIYXNDaGFuZ2VkKSB7XG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkLml0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBhdm9pZCBtb3ZpbmcgYWxyZWFkeSBvcmRlcmVkIGVsZW1lbnRzLCBzYXZlcyBtb3N0IG9mIHRoZSByZWZsb3cgd2l0aG91dCBtdWNoIGNvbXBsZXhpdHlcbiAgICAgICAgICBvcmRlckhhc0NoYW5nZWQgPSBqICE9PSBjaGlsZC5pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuICByZXR1cm4gcmV2ZXJzZTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUG9pbnRlckV2ZW50c05vbmUoZWx0OiBCb3VuZEVsZW1lbnQpOiB2b2lkIHtcbiAgbGV0IGU6IEJvdW5kRWxlbWVudCB8IG51bGwgPSBlbHQ7XG4gIHdoaWxlIChlKSB7XG4gICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdwb2ludGVyLWV2ZW50cy1ub25lJyk7XG4gICAgZSA9IGUucGFyZW50RWxlbWVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiBleGVjdXRlRHJhZ1N0YXJ0KFxuICBhbmltYXRpb25zOiBBbmltYXRpb25bXSxcbiAgZWFzaW5nOiBzdHJpbmcsXG4gIGR1cmF0aW9uOiBudW1iZXIsXG4gIGJvdW5kOiBCb3VuZEVsZW1lbnQsXG4gIGRyYWdnaW5nOiBEcmFnZ2luZ1xuKTogdm9pZCB7XG4gIGlmIChkcmFnZ2luZy5oYW5kbGVkKSByZXR1cm47XG4gIC8vIHRlbXBvcmFyeSBleGVjdXRlIGFuaW1hdGlvbnMgdG8gZ2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHN0YXJ0IGFuZCBlbmRcbiAgY29uc3QgcmVjdDEgPSBib3VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgcmV2ID0gZXhlY3V0ZUFuaW1hdGlvbnMoXG4gICAgYW5pbWF0aW9uc1xuICAgICAgLmZpbHRlcigoaXQpID0+IGl0LnByb3BzKVxuICAgICAgLm1hcCgoeyBlbHRJZCwgcHJvcHMgfSkgPT4gKHsgZWx0SWQsIHByb3BzIH0pKSxcbiAgICAnbGluZWFyJyxcbiAgICAwLFxuICAgIGJvdW5kLFxuICAgICdjbGljaycsXG4gICAgYGRyYWdfc3RhcnQodG1wKWBcbiAgKTtcbiAgY29uc3QgcmVjdDIgPSBib3VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgZGlmZlggPSByZWN0Mi5sZWZ0IC0gcmVjdDEubGVmdDtcbiAgY29uc3QgZGlmZlkgPSByZWN0Mi50b3AgLSByZWN0MS50b3A7XG4gIGNvbnN0IGxlbmd0aCA9IE1hdGguc3FydChkaWZmWCAqIGRpZmZYICsgZGlmZlkgKiBkaWZmWSk7XG4gIC8vIHJldmVydCB0ZW1wIGNoYW5nZXNcbiAgZXhlY3V0ZUFuaW1hdGlvbnMocmV2LCAnbGluZWFyJywgMCwgYm91bmQsICdjbGljaycsIGBkcmFnX3N0YXJ0KHRtcCB1bmRvKWApO1xuICBjb25zdCB7IHg6IGRpc3RYLCB5OiBkaXN0WSB9ID0gZ2V0RGlzdGFuY2UoZHJhZ2dpbmcuc3RhcnQsIGRyYWdnaW5nLmVuZCk7XG4gIGNvbnN0IGFjY2VwdHNEcmFnRGlyZWN0aW9uID1cbiAgICAoZGlzdFggPiAwICYmIGRpZmZYID4gMCkgfHxcbiAgICAoZGlzdFggPCAwICYmIGRpZmZYIDwgMCkgfHxcbiAgICAoZGlmZlggPT09IDAgJiYgKChkaXN0WSA+IDAgJiYgZGlmZlkgPiAwKSB8fCAoZGlzdFkgPCAwICYmIGRpZmZZIDwgMCkpKTtcbiAgaWYgKGFjY2VwdHNEcmFnRGlyZWN0aW9uKSB7XG4gICAgZHJhZ2dpbmcuaGFuZGxlZCA9IHRydWU7XG4gICAgY29uc3QgZHJhZ0FuaW1zID0gYW5pbWF0aW9ucy5tYXAoKGl0KSA9PiAoe1xuICAgICAgLi4uaXQsXG4gICAgICBzd2FwcGVkOiBmYWxzZSxcbiAgICAgIHByb3BzOiBpdC5wcm9wcz8ubWFwKChwKSA9PiAoeyAuLi5wLCBjdXJyOiBwLmZyb20gfSkpLFxuICAgIH0pKTtcbiAgICBjb25zdCBnZXRQZXJjZW50ID0gKGQ6IERyYWdnaW5nKTogbnVtYmVyID0+IHtcbiAgICAgIGNvbnN0IHsgeDogZGlzdFgsIHk6IGRpc3RZIH0gPSBnZXREaXN0YW5jZShkLnN0YXJ0LCBkLmVuZCk7XG4gICAgICBjb25zdCBkaXN0ID0gKGRpc3RYICogZGlmZlggKyBkaXN0WSAqIGRpZmZZKSAvIGxlbmd0aDtcbiAgICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsICgxMDAgKiBkaXN0KSAvIGxlbmd0aCkpO1xuICAgIH07XG4gICAgY29uc3QgbW92ZSA9IChkOiBEcmFnZ2luZyk6IHZvaWQgPT4ge1xuICAgICAgZC5lbmQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGQuZW5kLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgY29uc3QgcGVyY2VudCA9IGdldFBlcmNlbnQoZCk7XG4gICAgICBleGVjdXRlQW5pbWF0aW9ucyhcbiAgICAgICAgZmlsdGVyRW1wdHkoXG4gICAgICAgICAgZHJhZ0FuaW1zLm1hcCgoaXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcmVhY3Rpb25zOiBfLCAuLi5yZXN0IH0gPSBpdDtcbiAgICAgICAgICAgIGlmIChpdC5wcm9wcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnJlc3QsXG4gICAgICAgICAgICAgICAgcHJvcHM6IGl0LnByb3BzLm1hcCgocCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgdG8gPSBpbnRlcnBvbGF0ZShwLCBwZXJjZW50KTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGZyb20gPSBwLmN1cnI7XG4gICAgICAgICAgICAgICAgICBwLmN1cnIgPSB0bztcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnAsXG4gICAgICAgICAgICAgICAgICAgIGZyb20sXG4gICAgICAgICAgICAgICAgICAgIHRvLFxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdC5hbHRJZCkge1xuICAgICAgICAgICAgICBpZiAocGVyY2VudCA8IDUwICYmIGl0LnN3YXBwZWQpIHtcbiAgICAgICAgICAgICAgICBpdC5zd2FwcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgYWx0SWQ6IGl0LmVsdElkLCBlbHRJZDogaXQuYWx0SWQgfTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAocGVyY2VudCA+PSA1MCAmJiAhaXQuc3dhcHBlZCkge1xuICAgICAgICAgICAgICAgIGl0LnN3YXBwZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH0pXG4gICAgICAgICksXG4gICAgICAgICdsaW5lYXInLFxuICAgICAgICAwLFxuICAgICAgICBib3VuZCxcbiAgICAgICAgJ2NsaWNrJyxcbiAgICAgICAgYGRyYWdnaW5nYFxuICAgICAgKTtcbiAgICB9O1xuICAgIG1vdmUoZHJhZ2dpbmcpO1xuICAgIGJvdW5kLmYyd19kcmFnX2xpc3RlbmVyID0gKGQ6IERyYWdnaW5nKSA9PiB7XG4gICAgICBtb3ZlKGQpO1xuICAgICAgaWYgKGQuZmluaXNoZWQpIHtcbiAgICAgICAgY29uc3QgcGVyY2VudCA9IGdldFBlcmNlbnQoZCk7XG4gICAgICAgIGV4ZWN1dGVBbmltYXRpb25zKFxuICAgICAgICAgIGZpbHRlckVtcHR5KFxuICAgICAgICAgICAgZHJhZ0FuaW1zLm1hcCgoaXQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGl0LnByb3BzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVhY3Rpb25zID0gcGVyY2VudCA8IDUwID8gdW5kZWZpbmVkIDogaXQucmVhY3Rpb25zO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICBlbHRJZDogaXQuZWx0SWQsXG4gICAgICAgICAgICAgICAgICBwcm9wczogaXQucHJvcHMubWFwKChwKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAuLi5wLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiBwLmN1cnIsXG4gICAgICAgICAgICAgICAgICAgIHRvOiBwZXJjZW50IDwgNTAgPyBwLmZyb20gOiBwLnRvLFxuICAgICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgICAgICAgcmVhY3Rpb25zLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGl0LmFsdElkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnQgPCA1MCAmJiBpdC5zd2FwcGVkKSB7XG4gICAgICAgICAgICAgICAgICBpdC5zd2FwcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICByZXR1cm4geyBhbHRJZDogaXQuZWx0SWQsIGVsdElkOiBpdC5hbHRJZCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudCA+PSA1MCAmJiAhaXQuc3dhcHBlZCkge1xuICAgICAgICAgICAgICAgICAgaXQuc3dhcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gaXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICksXG4gICAgICAgICAgZWFzaW5nLFxuICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgIGJvdW5kLFxuICAgICAgICAgICdjbGljaycsXG4gICAgICAgICAgYGRyYWdfZW5kYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwQ3VycmVudChcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIGtleTogc3RyaW5nLFxuICB2OiBBbmltYXRlZFByb3BbJ2Zyb20nXVxuKTogQW5pbWF0ZWRQcm9wWydmcm9tJ10ge1xuICBpZiAodiAhPT0gJyRjdXJyZW50JykgcmV0dXJuIHY7XG4gIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKGVsdCkuZ2V0UHJvcGVydHlWYWx1ZShrZXkpO1xufVxuXG5mdW5jdGlvbiBob29rKFxuICByb290OiBQYXJlbnROb2RlLFxuICB3aXRoUm9vdCA9IGZhbHNlLFxuICBmcm9tQW5pbWF0aW9uRHVyYXRpb24gPSAwXG4pOiB2b2lkIHtcbiAgZm9yIChjb25zdCB0eXBlIG9mIHJlYWN0aW9uX3R5cGVzKSB7XG4gICAgZm9yIChjb25zdCBlbHQgb2YgcXVlcnlTZWxlY3RvckFsbEV4dChcbiAgICAgIHJvb3QgYXMgQm91bmRFbGVtZW50LFxuICAgICAgYFtkYXRhLXJlYWN0aW9uLSR7dHlwZX1dYCxcbiAgICAgIHdpdGhSb290XG4gICAgKSkge1xuICAgICAgaG9va0VsdChcbiAgICAgICAgZWx0IGFzIEJvdW5kRWxlbWVudCxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgZWx0LmdldEF0dHJpYnV0ZShgZGF0YS1yZWFjdGlvbi0ke3R5cGV9YCkhLFxuICAgICAgICBmcm9tQW5pbWF0aW9uRHVyYXRpb25cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHF1ZXJ5U2VsZWN0b3JBbGxFeHQoXG4gIHJvb3Q6IEJvdW5kRWxlbWVudCxcbiAgc2VsOiBzdHJpbmcsXG4gIGluY2x1ZGVSb290ID0gZmFsc2Vcbik6IEJvdW5kRWxlbWVudFtdIHtcbiAgY29uc3QgcmV0ID0gWy4uLnJvb3QucXVlcnlTZWxlY3RvckFsbChzZWwpXSBhcyBCb3VuZEVsZW1lbnRbXTtcbiAgaWYgKGluY2x1ZGVSb290ICYmIHJvb3QubWF0Y2hlcyhzZWwpKSB7XG4gICAgcmV0LnVuc2hpZnQocm9vdCk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxudHlwZSBUcmlnZ2VyRXZlbnQgPSBLZXlib2FyZEV2ZW50IHwgTW91c2VFdmVudCB8IERyYWdFdmVudDtcblxuZnVuY3Rpb24gaG9va0VsdChcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIHR5cGU6IFRyaWdnZXJUeXBlLFxuICB2ID0gJycsXG4gIGZyb21BbmltYXRpb25EdXJhdGlvbiA9IDBcbik6IHZvaWQge1xuICBpZiAoIXYpIHtcbiAgICBpZiAodHlwZSAhPT0gJ2hvdmVyJykge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoYENsZWFudXAgaG9va3MgJHt0eXBlfSBvbmAsIGVsdCk7XG4gICAgICB9XG4gICAgICBjbGVhbnVwRXZlbnRMaXN0ZW5lcihlbHQsIHR5cGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBsZXQgZGVsYXkgPSAwO1xuICBpZiAodlswXSA9PT0gJ1QnKSB7XG4gICAgY29uc3QgaWR4ID0gdi5pbmRleE9mKCdtcycpO1xuICAgIGRlbGF5ID0gcGFyc2VGbG9hdCh2LnNsaWNlKDEsIGlkeCkpIHx8IDA7XG4gICAgdiA9IHYuc2xpY2UoaWR4ICsgMyk7XG4gIH1cbiAgY29uc3QgcmVhY3Rpb25zID0gYWxsUmVhY3Rpb25zKCk7XG4gIGNvbnN0IGFjdGlvbnMgPSBmaWx0ZXJFbXB0eSh2LnNwbGl0KCcsJykubWFwKChpZCkgPT4gcmVhY3Rpb25zW2lkXSkpO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBjb25zb2xlLmRlYnVnKGBTZXR1cCBob29rICR7dHlwZX0gb25gLCBlbHQsIGAtPmAsIGFjdGlvbnMpO1xuICB9XG4gIGNvbnN0IHJ1biA9IGFjdGlvbnNUb1J1bihhY3Rpb25zLCBlbHQsIHR5cGUpO1xuICBpZiAodHlwZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgc2V0VGltZW91dFdpdGhDbGVhbnVwKGVsdCwgKCkgPT4gcnVuKCksIGRlbGF5ICsgZnJvbUFuaW1hdGlvbkR1cmF0aW9uKTtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVtb3ZlUG9pbnRlckV2ZW50c05vbmUoZWx0KTtcbiAgaWYgKHR5cGUgPT09ICdwcmVzcycpIHtcbiAgICAvLyBubyBkZWxheSBmb3IgcHJlc3NcbiAgICBsZXQgcmV2ZXJ0OiBFdmVudENhbGxiYWNrIHwgdW5kZWZpbmVkIHwgdm9pZCA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBtb3VzZXVwID0gKCk6IHZvaWQgPT4ge1xuICAgICAgcmV2ZXJ0Py4oKTtcbiAgICAgIHJldmVydCA9IHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIGVsdC5mMndfbW91c2V1cCA9IG1vdXNldXA7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcldpdGhDbGVhbnVwKFxuICAgICAgZWx0LFxuICAgICAgJ21vdXNlZG93bicsXG4gICAgICAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICByZXZlcnQ/LigpO1xuICAgICAgICByZXZlcnQgPSBydW4oZSk7XG4gICAgICB9LFxuICAgICAgdHlwZSxcbiAgICAgIGF0dGFjaExpc3RlbmVyKGVsdCwgJ21vdXNldXAnLCBtb3VzZXVwKVxuICAgICk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2RyYWcnKSB7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcldpdGhDbGVhbnVwKFxuICAgICAgZWx0LFxuICAgICAgJ2RyYWdnaW5nJyBhcyBhbnksXG4gICAgICAoZTogQ3VzdG9tRXZlbnQ8RHJhZ2dpbmc+KSA9PiB7XG4gICAgICAgIHJ1bihlKTtcbiAgICAgIH0sXG4gICAgICB0eXBlXG4gICAgKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnaG92ZXInKSB7XG4gICAgLy8gbm8gZGVsYXkgZm9yIGhvdmVyXG4gICAgbGV0IHJldmVydDogRXZlbnRDYWxsYmFjayB8IHVuZGVmaW5lZCB8IHZvaWQgPSB1bmRlZmluZWQ7XG4gICAgY29uc3QgcnVuSWZOb3RBbHJlYWR5ID0gKGU/OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXJldmVydCkgcmV2ZXJ0ID0gb25jZShydW4oZSkpO1xuICAgIH07XG4gICAgY29uc3QgcHJldiA9IGVsdC5mMndfbW91c2VsZWF2ZV9yZW1vdmU/LigpO1xuICAgIGNvbnN0IG1vdXNlbGVhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICByZXZlcnQ/LigpO1xuICAgICAgcmV2ZXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgcHJldj8uKCk7XG4gICAgfTtcbiAgICAvLyBpZiB0aGUgbW91c2UgaXMgYWxyZWFkeSBvbiBpdCwgJ2VudGVyJyB3b24ndCBmaXJlIGFnYWluLCBlbnN1cmUgd2UgZ2V0IHRyaWdnZXJlZCBhcyBzb29uIGFzIHRoZSBtb3VzZSBtb3Zlc1xuICAgIGNvbnN0IHRpbWVySWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmIChlbHQubWF0Y2hlcygnOmhvdmVyJykpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnICYmICFyZXZlcnQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgRm9yY2luZyBob3ZlciBvbiB0aW1lb3V0YCk7XG4gICAgICAgIH1cbiAgICAgICAgcnVuSWZOb3RBbHJlYWR5KCk7XG4gICAgICB9XG4gICAgfSwgZnJvbUFuaW1hdGlvbkR1cmF0aW9uKTtcbiAgICBjb25zdCBtb3VzZWxlYXZlX3JlbW92ZSA9IGluc3RhbGxNb3VzZUxlYXZlKGVsdCwgbW91c2VsZWF2ZSwgdGltZXJJZCk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcldpdGhDbGVhbnVwKFxuICAgICAgZWx0LFxuICAgICAgJ21vdXNlZW50ZXInLFxuICAgICAgcnVuSWZOb3RBbHJlYWR5LFxuICAgICAgdHlwZSxcbiAgICAgIG1vdXNlbGVhdmVfcmVtb3ZlXG4gICAgKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3VibWl0Jykge1xuICAgIGNvbnN0IGZvcm0gPSBlbHQuY2xvc2VzdCgnZm9ybScpO1xuICAgIGlmIChmb3JtKSB7XG4gICAgICBhZGRFdmVudExpc3RlbmVyV2l0aENsZWFudXAoZWx0LCB0eXBlLCBydW4sIHR5cGUpO1xuICAgICAgYWRkRXZlbnRMaXN0ZW5lcldpdGhDbGVhbnVwKFxuICAgICAgICBmb3JtLFxuICAgICAgICB0eXBlLFxuICAgICAgICAoZSkgPT4ge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlbHQudG9nZ2xlQXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgIGZldGNoKGZvcm0uYWN0aW9uLCB7IG1ldGhvZDogZm9ybS5tZXRob2QsIGJvZHk6IG5ldyBGb3JtRGF0YShmb3JtKSB9KVxuICAgICAgICAgICAgLnRoZW4oKHIpID0+IHIub2sgJiYgZWx0LmRpc3BhdGNoRXZlbnQoZSkpXG4gICAgICAgICAgICAuZmluYWxseSgoKSA9PiBlbHQudG9nZ2xlQXR0cmlidXRlKCdkaXNhYmxlZCcsIGZhbHNlKSk7XG4gICAgICAgIH0sXG4gICAgICAgIHR5cGVcbiAgICAgICk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlID09PSAna2V5ZG93bicgJiYgIWVsdC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHtcbiAgICAgIC8vIHRhYmluZGV4IHJlcXVpcmVkIHRvIGNhcHR1cmUga2V5ZG93blxuICAgICAgZWx0LnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnLTEnKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdhcHBlYXInKSB7XG4gICAgICBhcHBlYXJPYnNlcnZlci5vYnNlcnZlKGVsdCk7XG4gICAgfVxuICAgIGFkZEV2ZW50TGlzdGVuZXJXaXRoQ2xlYW51cChcbiAgICAgIGVsdCxcbiAgICAgIHR5cGUgYXMgYW55LFxuICAgICAgKGU6IFRyaWdnZXJFdmVudCkgPT4ge1xuICAgICAgICBpZiAodHlwZSAhPT0gJ2tleWRvd24nKSB7XG4gICAgICAgICAgLy8gRG9uJ3QgdXNlIGUucHJldmVudERlZmF1bHQgYmVjYXVzZSB0YXJnZXQgZWxlbWVudHMgY2FuIGNvbnRhaW4gbmVzdGVkIGNoaWxkcmVuLFxuICAgICAgICAgIC8vIGkuZSBhbmNob3IgdGFncyBpbnNpZGUgYW4gb3ZlcmxheSB3aGljaCB3aWxsIGJyZWFrIGlmIHdlIGRvIGUucHJldmVudERlZmF1bHQuXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUT0RPIGNvbmZpcm0gd2hldGhlciBhIGRlbGF5ZWQgZXZlbnQgY2FuIGJlIGNhbmNlbGVkIGJ5IHN3YXBwaW5nIG9yIG5vdCAoaW4gd2hpY2ggY2FzZSBzaG91bGQgY2FuY2VsIHRoZSB0aW1lb3V0KVxuICAgICAgICBpZiAoZGVsYXkpIHNldFRpbWVvdXQoKCkgPT4gcnVuKGUpLCBkZWxheSk7XG4gICAgICAgIGVsc2UgcnVuKGUpO1xuICAgICAgfSxcbiAgICAgIHR5cGVcbiAgICApO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluc3RhbGxNb3VzZUxlYXZlKFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgbW91c2VsZWF2ZTogKCkgPT4gdm9pZCxcbiAgdGltZXJJZCA9IDBcbik6ICgpID0+ICgpID0+IHZvaWQge1xuICBjb25zdCB1bnN1YiA9IGF0dGFjaExpc3RlbmVyKGVsdCwgJ21vdXNlbGVhdmUnLCBtb3VzZWxlYXZlKTtcbiAgY29uc3QgbW91c2VsZWF2ZV9yZW1vdmUgPSAoKTogKCgpID0+IHZvaWQpID0+IHtcbiAgICB1bnN1YigpO1xuICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICBpZiAoZWx0LmYyd19tb3VzZWxlYXZlID09PSBtb3VzZWxlYXZlKSBkZWxldGUgZWx0LmYyd19tb3VzZWxlYXZlO1xuICAgIGlmIChlbHQuZjJ3X21vdXNlbGVhdmVfcmVtb3ZlID09PSBtb3VzZWxlYXZlX3JlbW92ZSlcbiAgICAgIGRlbGV0ZSBlbHQuZjJ3X21vdXNlbGVhdmVfcmVtb3ZlO1xuICAgIHJldHVybiBtb3VzZWxlYXZlO1xuICB9O1xuICBlbHQuZjJ3X21vdXNlbGVhdmUgPSBtb3VzZWxlYXZlO1xuICByZXR1cm4gKGVsdC5mMndfbW91c2VsZWF2ZV9yZW1vdmUgPSBtb3VzZWxlYXZlX3JlbW92ZSk7XG59XG5cbmZ1bmN0aW9uIGlzT3V0c2lkZShcbiAgeyBjbGllbnRYLCBjbGllbnRZIH06IFBpY2s8TW91c2VFdmVudCwgJ2NsaWVudFgnIHwgJ2NsaWVudFknPixcbiAgYm91bmQ6IEJvdW5kRWxlbWVudFxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IEJPVU5EU19YVFJBX1BJWEVMUyA9IDI7XG4gIGNvbnN0IHsgdG9wLCBsZWZ0LCByaWdodCwgYm90dG9tIH0gPSBib3VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgcmV0dXJuIChcbiAgICBjbGllbnRYID4gcmlnaHQgKyBCT1VORFNfWFRSQV9QSVhFTFMgfHxcbiAgICBjbGllbnRYIDwgbGVmdCAtIEJPVU5EU19YVFJBX1BJWEVMUyB8fFxuICAgIGNsaWVudFkgPiBib3R0b20gKyBCT1VORFNfWFRSQV9QSVhFTFMgfHxcbiAgICBjbGllbnRZIDwgdG9wIC0gQk9VTkRTX1hUUkFfUElYRUxTXG4gICk7XG59XG5cbmZ1bmN0aW9uIGNsZWFudXBGbktleUZvclR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBmMndfY2xlYW51cF8ke3R5cGV9YDtcbn1cblxuZnVuY3Rpb24gc2V0VGltZW91dFdpdGhDbGVhbnVwKFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgZm46ICgpID0+IHZvaWQsXG4gIGRlbGF5OiBudW1iZXJcbik6IHZvaWQge1xuICBjb25zdCB0aW1lcklkID0gc2V0VGltZW91dChmbiwgZGVsYXkpO1xuICBlbHQuZjJ3X2NsZWFudXBfdGltZW91dD8uKCk7XG4gIGVsdC5mMndfY2xlYW51cF90aW1lb3V0ID0gKCkgPT4ge1xuICAgIGRlbGV0ZSBlbHQuZjJ3X2NsZWFudXBfdGltZW91dDtcbiAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNsZWFudXBFdmVudExpc3RlbmVyKFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgdHlwZUZvckNsZWFudXA6IFRyaWdnZXJUeXBlXG4pOiB2b2lkIHtcbiAgY29uc3QgY2xlYW51cEtleSA9IGNsZWFudXBGbktleUZvclR5cGUodHlwZUZvckNsZWFudXApO1xuICAoZWx0IGFzIGFueSlbY2xlYW51cEtleV0/LigpO1xufVxuXG5mdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyV2l0aENsZWFudXA8XG4gIEsgZXh0ZW5kcyBrZXlvZiBHbG9iYWxFdmVudEhhbmRsZXJzRXZlbnRNYXAsXG4+KFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgdHlwZTogSyxcbiAgbGlzdGVuZXI6IChldjogR2xvYmFsRXZlbnRIYW5kbGVyc0V2ZW50TWFwW0tdKSA9PiBhbnksXG4gIHR5cGVGb3JDbGVhbnVwOiBUcmlnZ2VyVHlwZSxcbiAgLi4uZXh0cmFDbGVhbnVwRm5zOiBDbGVhbnVwRm5bXVxuKTogdm9pZCB7XG4gIGNvbnN0IGNsZWFudXBzID0gWy4uLmV4dHJhQ2xlYW51cEZucywgYXR0YWNoTGlzdGVuZXIoZWx0LCB0eXBlLCBsaXN0ZW5lcildO1xuICBjb25zdCBjbGVhbnVwS2V5ID0gY2xlYW51cEZuS2V5Rm9yVHlwZSh0eXBlRm9yQ2xlYW51cCk7XG4gIChlbHQgYXMgYW55KVtjbGVhbnVwS2V5XT8uKCk7XG4gIChlbHQgYXMgYW55KVtjbGVhbnVwS2V5XSA9ICgpID0+IHtcbiAgICBkZWxldGUgKGVsdCBhcyBhbnkpW2NsZWFudXBLZXldO1xuICAgIGNsZWFudXBzLmZvckVhY2goKGl0KSA9PiBpdCgpKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gYXR0YWNoTGlzdGVuZXI8SyBleHRlbmRzIGtleW9mIEdsb2JhbEV2ZW50SGFuZGxlcnNFdmVudE1hcD4oXG4gIGVsdDogQm91bmRFbGVtZW50LFxuICB0eXBlOiBLLFxuICBsaXN0ZW5lcjogKGV2OiBHbG9iYWxFdmVudEhhbmRsZXJzRXZlbnRNYXBbS10pID0+IGFueSxcbiAgb3B0aW9ucz86IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9uc1xuKTogQ2xlYW51cEZuIHtcbiAgY29uc3QgbXlfbGlzdGVuZXI6IHR5cGVvZiBsaXN0ZW5lciA9IChlKSA9PiB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnICYmIHR5cGUgIT09ICdtb3VzZW1vdmUnKSB7XG4gICAgICBjb25zb2xlLmRlYnVnKFxuICAgICAgICBgJHtlbHQuaXNDb25uZWN0ZWQgPyAnSGFuZGxpbmcnIDogJ0lnbm9yaW5nJ30gJHt0eXBlfSBvbmAsXG4gICAgICAgIGUudGFyZ2V0XG4gICAgICApO1xuICAgIH1cbiAgICAvLyBNYXliZSBzaG91bGQgcHJldmVudERlZmF1bHQvc3RvcFByb3BhZ2F0aW9uIHRvIGF2b2lkIGdldHRpbmcgZXZlbnRzIG9uIHJlbW92ZWQgZWxlbWVudHM/XG4gICAgaWYgKCFlbHQuaXNDb25uZWN0ZWQpIHJldHVybjtcbiAgICBsaXN0ZW5lcihlKTtcbiAgfTtcbiAgLy8gQHRzLWlnbm9yZVxuICBlbHQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBteV9saXN0ZW5lciwgb3B0aW9ucyk7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGVsdC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIG15X2xpc3RlbmVyLCBvcHRpb25zKTtcbiAgfTtcbn1cblxuLy8gRm9yIGVhY2ggY29sbGVjdGlvbiB3ZSBzZXQgdGhlIGN1cnJlbnQgY29sb3Igc2NoZW1lL21vZGVcbmNvbnN0IENPTE9SX1NDSEVNRV9LRVkgPSAnZjJ3LWNvbG9yLXNjaGVtZSc7XG5jb25zdCBMQU5HX0tFWSA9ICdmMnctbGFuZyc7XG53aW5kb3cuRjJXX1RIRU1FX1NXSVRDSCA9ICh0aGVtZSkgPT5cbiAgd2luZG93LkYyV19DT0xPUl9TQ0hFTUVTPy5mb3JFYWNoKChjb2xOYW1lKSA9PlxuICAgIHNldENvbGxlY3Rpb25BdHRyQW5kVmFyaWFibGVzKGNvbE5hbWUsIHRoZW1lKVxuICApO1xuXG5pZiAod2luZG93LkYyV19DT0xPUl9TQ0hFTUVTKSB7XG4gIGNvbnN0IG1hdGNoTWVkaWFRdWVyeSA9IG1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzO1xuICBjb25zdCBzeXN0ZW1QcmVmZXJlbmNlID0gbWF0Y2hNZWRpYVF1ZXJ5ID8gJ2RhcmsnIDogJ2xpZ2h0JztcbiAgY29uc3QgdXNlclByZWZlcmVuY2UgPSBsb2NhbFN0b3JhZ2U/LmdldEl0ZW0oQ09MT1JfU0NIRU1FX0tFWSk7XG4gIG9uQ29ubmVjdGVkKCdib2R5JywgKCkgPT4ge1xuICAgIGNvbnN0IHByZXZpZXdQcmVmZXJlbmNlID0gZG9jdW1lbnQuYm9keS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcHJldmlldy10aGVtZScpO1xuICAgIGNvbnN0IGNvbG9yU2NoZW1lID0gcHJldmlld1ByZWZlcmVuY2UgPz8gdXNlclByZWZlcmVuY2UgPz8gc3lzdGVtUHJlZmVyZW5jZTtcbiAgICB3aW5kb3cuRjJXX1RIRU1FX1NXSVRDSD8uKGNvbG9yU2NoZW1lKTtcbiAgfSk7XG59XG5pZiAod2luZG93LkYyV19MQU5HVUFHRVMpIHtcbiAgbGV0IHVzZXJQcmVmZXJlbmNlID0gbG9jYWxTdG9yYWdlPy5nZXRJdGVtKExBTkdfS0VZKTtcbiAgb25Db25uZWN0ZWQoJ2JvZHknLCAoKSA9PiB7XG4gICAgY29uc3QgYWx0ZXJuYXRlcyA9IEFycmF5LmZyb20oXG4gICAgICBkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbcmVsPVwiYWx0ZXJuYXRlXCJdJylcbiAgICApO1xuICAgIGNvbnN0IGlzRGVmYXVsdCA9XG4gICAgICBhbHRlcm5hdGVzLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgYWx0ZXJuYXRlcy5zb21lKFxuICAgICAgICAoaXQpID0+XG4gICAgICAgICAgaXQuZ2V0QXR0cmlidXRlKCdocmVmbGFuZycpID09PSAneC1kZWZhdWx0JyAmJlxuICAgICAgICAgIGl0LmdldEF0dHJpYnV0ZSgnaHJlZicpID09PSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgICAgKTtcbiAgICBpZiAoIWlzRGVmYXVsdCkge1xuICAgICAgLy8gcGFnZSB1cmwgaXMgL2ZyL2Zvbywgc2F2ZSB0aGUgbGFuZyBzbyB0aGF0IG5hdmlnYXRpb24gcmV0YWluIHRoZSBzYW1lIGxhbmd1YWdlXG4gICAgICB1c2VyUHJlZmVyZW5jZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nO1xuICAgIH1cbiAgICBjb25zdCBpczQwNCA9IGRvY3VtZW50LmhlYWRcbiAgICAgIC5xdWVyeVNlbGVjdG9yPEhUTUxMaW5rRWxlbWVudD4oJ2xpbmtbcmVsPVwiY2Fub25pY2FsXCJdJylcbiAgICAgID8uaHJlZj8uZW5kc1dpdGgoJy80MDQvJyk7XG4gICAgd2luZG93LkYyV19MQU5HVUFHRVM/LmZvckVhY2goKGNvbE5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGNob2ljZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGdldENvbE1vZGVzKGNvbE5hbWUpKS5tYXAoKFtrXSkgPT4gW2sudG9Mb3dlckNhc2UoKSwga10pXG4gICAgICApO1xuICAgICAgY29uc3QgbGFuZ3MgPSBbLi4ubmF2aWdhdG9yLmxhbmd1YWdlc107XG4gICAgICBpZiAodXNlclByZWZlcmVuY2UpIGxhbmdzLnVuc2hpZnQodXNlclByZWZlcmVuY2UpO1xuICAgICAgZm9yIChsZXQgbGFuZyBvZiBsYW5ncykge1xuICAgICAgICBsYW5nID0gbGFuZy50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBjb2RlID0gbGFuZy5zcGxpdCgnLScpWzBdO1xuICAgICAgICBjb25zdCBtb2RlVmFsdWUgPSBjaG9pY2VzW2xhbmddID8/IGNob2ljZXNbY29kZV07XG4gICAgICAgIGlmIChtb2RlVmFsdWUpIHtcbiAgICAgICAgICBzZXRDb2xsZWN0aW9uQXR0ckFuZFZhcmlhYmxlcyhjb2xOYW1lLCBtb2RlVmFsdWUpO1xuICAgICAgICAgIGlmICghaXM0MDQpIHNhdmVNb2RlKGNvbE5hbWUsIG1vZGVWYWx1ZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmNvbnN0IGN1cnJlbnRDb2xsZWN0aW9uTW9kZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbmNvbnN0IGNvbGxlY3Rpb25Nb2RlQnBzU29ydGVkID0gT2JqZWN0LmVudHJpZXMoY29sbGVjdGlvbk1vZGVCcHMoKSkubWFwKFxuICAoW2NvbGxlY3Rpb25OYW1lLCB2XSkgPT4gKHtcbiAgICBjb2xsZWN0aW9uTmFtZSxcbiAgICBicmVha3BvaW50czogT2JqZWN0LmVudHJpZXModilcbiAgICAgIC5tYXAoKFtuYW1lLCB7IG1pbldpZHRoIH1dKSA9PiAoeyBuYW1lLCBtaW5XaWR0aCB9KSlcbiAgICAgIC5zb3J0KCh7IG1pbldpZHRoOiBhIH0sIHsgbWluV2lkdGg6IGIgfSkgPT4gYSAtIGIpLFxuICB9KVxuKTtcblxuZnVuY3Rpb24gdXBkYXRlQ29sbGVjdGlvbk1vZGVzKCk6IHZvaWQge1xuICBjb25zdCB3aWR0aCA9IHdpbmRvdy52aXN1YWxWaWV3cG9ydD8ud2lkdGggfHwgd2luZG93LmlubmVyV2lkdGg7XG4gIGZvciAoY29uc3QgeyBjb2xsZWN0aW9uTmFtZSwgYnJlYWtwb2ludHMgfSBvZiBjb2xsZWN0aW9uTW9kZUJwc1NvcnRlZCkge1xuICAgIGNvbnN0IGJwcyA9IFsuLi5icmVha3BvaW50c107XG4gICAgbGV0IG5ld01vZGUgPSBicHMuc3BsaWNlKDAsIDEpWzBdLm5hbWU7XG4gICAgZm9yIChjb25zdCB7IG5hbWUsIG1pbldpZHRoIH0gb2YgYnBzKSB7XG4gICAgICBpZiAod2lkdGggPj0gbWluV2lkdGgpIG5ld01vZGUgPSBuYW1lO1xuICAgIH1cbiAgICBpZiAobmV3TW9kZSAhPT0gY3VycmVudENvbGxlY3Rpb25Nb2Rlc1tjb2xsZWN0aW9uTmFtZV0pIHtcbiAgICAgIHNldENvbGxlY3Rpb25BdHRyQW5kVmFyaWFibGVzKGNvbGxlY3Rpb25OYW1lLCBuZXdNb2RlKTtcbiAgICAgIGN1cnJlbnRDb2xsZWN0aW9uTW9kZXNbY29sbGVjdGlvbk5hbWVdID0gbmV3TW9kZTtcbiAgICB9XG4gIH1cbn1cblxubGV0IGRyYWdfc3RhcnRlZCA9IGZhbHNlO1xub25Db25uZWN0ZWQoJ2JvZHknLCAoKSA9PiB7XG4gIGxldCBkcmFnX3N0YXJ0OiBNb3VzZUV2ZW50IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBsZXQgc3VwcHJlc3NfY2xpY2sgPSBmYWxzZTtcbiAgYXR0YWNoTGlzdGVuZXIoZG9jdW1lbnQgYXMgYW55LCAnbW91c2Vkb3duJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBkcmFnX3N0YXJ0ID0gZTtcbiAgICBkcmFnX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgfSk7XG4gIGF0dGFjaExpc3RlbmVyKGRvY3VtZW50IGFzIGFueSwgJ21vdXNlbW92ZScsIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKGRyYWdfc3RhcnQgJiYgZ2V0RGlzdGFuY2UoZHJhZ19zdGFydCwgZSkuZGlzdCA+IDIpIHtcbiAgICAgIGNvbnN0IGRyYWdnaW5nOiBEcmFnZ2luZyA9IHtcbiAgICAgICAgc3RhcnQ6IGRyYWdfc3RhcnQsXG4gICAgICAgIGVuZDogZSxcbiAgICAgIH07XG4gICAgICBpZiAoIWRyYWdfc3RhcnRlZCkge1xuICAgICAgICBkcmFnX3N0YXJ0LnRhcmdldD8uZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICBuZXcgQ3VzdG9tRXZlbnQ8RHJhZ2dpbmc+KCdkcmFnZ2luZycsIHsgZGV0YWlsOiBkcmFnZ2luZyB9KVxuICAgICAgICApO1xuICAgICAgICBkcmFnX3N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICBzdXBwcmVzc19jbGljayA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAoZHJhZ19zdGFydC50YXJnZXQgYXMgQm91bmRFbGVtZW50KT8uZjJ3X2RyYWdfbGlzdGVuZXI/LihkcmFnZ2luZyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgYXR0YWNoTGlzdGVuZXIoZG9jdW1lbnQgYXMgYW55LCAnbW91c2V1cCcsIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKGRyYWdfc3RhcnQgJiYgZHJhZ19zdGFydGVkKSB7XG4gICAgICAoZHJhZ19zdGFydC50YXJnZXQgYXMgQm91bmRFbGVtZW50KT8uZjJ3X2RyYWdfbGlzdGVuZXI/Lih7XG4gICAgICAgIHN0YXJ0OiBkcmFnX3N0YXJ0LFxuICAgICAgICBlbmQ6IGUsXG4gICAgICAgIGZpbmlzaGVkOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGRyYWdfc3RhcnQgPSB1bmRlZmluZWQ7XG4gICAgZHJhZ19zdGFydGVkID0gZmFsc2U7XG4gIH0pO1xuICBhdHRhY2hMaXN0ZW5lcihkb2N1bWVudCBhcyBhbnksICdtb3VzZXVwJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoZHJhZ19zdGFydCAmJiBkcmFnX3N0YXJ0ZWQpIHtcbiAgICAgIChkcmFnX3N0YXJ0LnRhcmdldCBhcyBCb3VuZEVsZW1lbnQpPy5mMndfZHJhZ19saXN0ZW5lcj8uKHtcbiAgICAgICAgc3RhcnQ6IGRyYWdfc3RhcnQsXG4gICAgICAgIGVuZDogZSxcbiAgICAgICAgZmluaXNoZWQ6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG4gICAgZHJhZ19zdGFydCA9IHVuZGVmaW5lZDtcbiAgICBkcmFnX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgfSk7XG4gIGF0dGFjaExpc3RlbmVyKFxuICAgIGRvY3VtZW50IGFzIGFueSxcbiAgICAnY2xpY2snLFxuICAgIChlKSA9PiB7XG4gICAgICBpZiAoc3VwcHJlc3NfY2xpY2spIHtcbiAgICAgICAgc3VwcHJlc3NfY2xpY2sgPSBmYWxzZTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgfVxuICAgIH0sXG4gICAgeyBjYXB0dXJlOiB0cnVlIH1cbiAgKTtcbiAgdXBkYXRlQ29sbGVjdGlvbk1vZGVzKCk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGVDb2xsZWN0aW9uTW9kZXMpO1xufSk7XG5cbmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiBob29rKGRvY3VtZW50KSk7XG5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBpZiAoJ21lZGl1bVpvb20nIGluIHdpbmRvdykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCB6b29tID0gbWVkaXVtWm9vbSgnW2RhdGEtem9vbWFibGVdJyk7XG4gICAgem9vbS5vbignb3BlbicsIChldmVudDogYW55KSA9PiB7XG4gICAgICBjb25zdCBvYmplY3RGaXQgPSBnZXRDb21wdXRlZFN0eWxlKGV2ZW50LnRhcmdldCkub2JqZWN0Rml0O1xuICAgICAgY29uc3Qgem9vbWVkID0gZXZlbnQuZGV0YWlsLnpvb20uZ2V0Wm9vbWVkSW1hZ2UoKTtcbiAgICAgIC8vIG1lZGl1bS16b29tIHdpbGwgaGF2ZSBjb21wdXRlZCB0aGUgaW1hZ2Ugc2l6ZSB3aXRoIGFkZGl0aW9uYWwgYm9yZGVycyxcbiAgICAgIC8vIG5lZWQgaXQgdG8gdXNlIG9iamVjdC1maXQgdG9vIG90aGVyd2lzZSB0aGUgcmF0aW8gd2lsbCBiZSBzY3Jld2VkXG4gICAgICBpZiAob2JqZWN0Rml0ICYmIHpvb21lZCkgem9vbWVkLnN0eWxlLm9iamVjdEZpdCA9IG9iamVjdEZpdDtcbiAgICB9KTtcbiAgICB6b29tLm9uKCdjbG9zZWQnLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgY29uc3Qgem9vbWVkID0gZXZlbnQuZGV0YWlsLnpvb20uZ2V0Wm9vbWVkSW1hZ2UoKTtcbiAgICAgIHpvb21lZC5zdHlsZS5vYmplY3RGaXQgPSAnJztcbiAgICB9KTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIGlzQ2FsY2FibGUodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIHZhbHVlLmVuZHNXaXRoKCdweCcpIHx8IHZhbHVlLmVuZHNXaXRoKCclJykgfHwgdmFsdWUuc3RhcnRzV2l0aCgnY2FsYycpXG4gICk7XG59XG5cbmZ1bmN0aW9uIHVuQ2FsYyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlLnN0YXJ0c1dpdGgoJ2NhbGMnKSA/IHZhbHVlLnNsaWNlKDQpIDogdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGludGVycG9sYXRlKFxuICB7IGZyb20sIHRvIH06IEFuaW1hdGVkUHJvcCxcbiAgcGVyY2VudDogbnVtYmVyXG4pOiBBbmltYXRlZFByb3BbJ3RvJ10ge1xuICBpZiAoZnJvbSA9PT0gdG8pIHJldHVybiB0bztcbiAgaWYgKHR5cGVvZiBmcm9tID09PSAnbnVtYmVyJyAmJiB0eXBlb2YgdG8gPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGZyb20gKyAodG8gLSBmcm9tKSAqIChwZXJjZW50IC8gMTAwKTtcbiAgfVxuICBpZiAodHlwZW9mIGZyb20gPT09ICdzdHJpbmcnICYmIHR5cGVvZiB0byA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAoZnJvbSA9PT0gJ25vbmUnIHx8IHRvID09PSAnbm9uZScpIHJldHVybiBwZXJjZW50IDwgNTAgPyBmcm9tIDogdG87XG4gICAgaWYgKGZyb20gPT09ICdhdXRvJyB8fCB0byA9PT0gJ2F1dG8nKSByZXR1cm4gcGVyY2VudCA8IDUwID8gZnJvbSA6IHRvO1xuXG4gICAgaWYgKGZyb20uZW5kc1dpdGgoJ3B4JykgJiYgdG8uZW5kc1dpdGgoJ3B4JykpIHtcbiAgICAgIGNvbnN0IGZyb21QeCA9IHBhcnNlRmxvYXQoZnJvbSk7XG4gICAgICBjb25zdCB0b1AgPSBwYXJzZUZsb2F0KHRvKTtcbiAgICAgIHJldHVybiB0b1B4KGZyb21QeCArICh0b1AgLSBmcm9tUHgpICogKHBlcmNlbnQgLyAxMDApKTtcbiAgICB9XG4gICAgaWYgKGZyb20uZW5kc1dpdGgoJyUnKSAmJiB0by5lbmRzV2l0aCgnJScpKSB7XG4gICAgICBjb25zdCBmcm9tUHggPSBwYXJzZUZsb2F0KGZyb20pO1xuICAgICAgY29uc3QgdG9QID0gcGFyc2VGbG9hdCh0byk7XG4gICAgICByZXR1cm4gdG9QZXJjZW50KGZyb21QeCArICh0b1AgLSBmcm9tUHgpICogKHBlcmNlbnQgLyAxMDApKTtcbiAgICB9XG4gICAgaWYgKGlzQ2FsY2FibGUoZnJvbSkgJiYgaXNDYWxjYWJsZSh0bykpIHtcbiAgICAgIGNvbnN0IGZyb21DYWxjID0gdW5DYWxjKGZyb20pO1xuICAgICAgY29uc3QgdG9DYWxjID0gdW5DYWxjKHRvKTtcbiAgICAgIHJldHVybiBgY2FsYygke2Zyb21DYWxjfSArICgke3RvQ2FsY30gLSAke2Zyb21DYWxjfSkgKiAke3BlcmNlbnQgLyAxMDB9KWA7XG4gICAgfVxuXG4gICAgLy8gbmVlZGVkID9cbiAgICBpZiAoZnJvbS5zdGFydHNXaXRoKCdyZ2InKSAmJiB0by5zdGFydHNXaXRoKCdyZ2InKSkge1xuICAgICAgY29uc3QgZnJvbUNvbG9yID0gZnJvbS5tYXRjaCgvXFxkKy9nKSEubWFwKE51bWJlcik7XG4gICAgICBjb25zdCB0b0NvbG9yID0gdG8ubWF0Y2goL1xcZCsvZykhLm1hcChOdW1iZXIpO1xuICAgICAgY29uc3QgY29sb3IgPSBmcm9tQ29sb3IubWFwKFxuICAgICAgICAoZnJvbSwgaSkgPT4gZnJvbSArICh0b0NvbG9yW2ldIC0gZnJvbSkgKiAocGVyY2VudCAvIDEwMClcbiAgICAgICk7XG4gICAgICByZXR1cm4gYHJnYigke2NvbG9yLmpvaW4oJywnKX0pYDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBlcmNlbnQgPCA1MCA/IGZyb20gOiB0bztcbn1cblxuZnVuY3Rpb24gZ2V0RGlzdGFuY2UoXG4gIHN0YXJ0OiBNb3VzZUV2ZW50LFxuICBlbmQ6IE1vdXNlRXZlbnRcbik6IHsgeDogbnVtYmVyOyB5OiBudW1iZXI7IGRpc3Q6IG51bWJlciB9IHtcbiAgY29uc3QgeCA9IGVuZC5jbGllbnRYIC0gc3RhcnQuY2xpZW50WDtcbiAgY29uc3QgeSA9IGVuZC5jbGllbnRZIC0gc3RhcnQuY2xpZW50WTtcbiAgcmV0dXJuIHsgeCwgeSwgZGlzdDogTWF0aC5zcXJ0KE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikpIH07XG59XG5cbm9uQ29ubmVjdGVkKCdbZGF0YS1ib3VuZC1jaGFyYWN0ZXJzXScsIChlKSA9PiB7XG4gIGNvbnN0IGhhbmRsZXIgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgaWQgPSBlLmdldEF0dHJpYnV0ZSgnZGF0YS1ib3VuZC1jaGFyYWN0ZXJzJykhO1xuICAgIGNvbnN0IGNoYXJhY3RlcnMgPSB0b1N0cmluZyhyZXNvbHZlKGFsbFZhcmlhYmxlcygpW2lkXSkpO1xuICAgIGlmICgncGxhY2Vob2xkZXInIGluIGUpIHtcbiAgICAgIGlmIChjaGFyYWN0ZXJzICE9PSBlLnBsYWNlaG9sZGVyKSBlLnBsYWNlaG9sZGVyID0gY2hhcmFjdGVycztcbiAgICB9IGVsc2UgaWYgKGNoYXJhY3RlcnMgIT09IGUudGV4dENvbnRlbnQpIGUudGV4dENvbnRlbnQgPSBjaGFyYWN0ZXJzO1xuICB9O1xuICBoYW5kbGVyKCk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Yydy1zZXQtdmFyaWFibGUnLCBoYW5kbGVyKTtcbiAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Yydy1zZXQtdmFyaWFibGUnLCBoYW5kbGVyKTtcbn0pO1xuXG5vbkNvbm5lY3RlZCgnW2RhdGEtYm91bmQtdmlzaWJsZV0nLCAoZSkgPT4ge1xuICBjb25zdCBoYW5kbGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGlkID0gZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYm91bmQtdmlzaWJsZScpITtcbiAgICBjb25zdCB2aXNpYmxlID0gdG9TdHJpbmcocmVzb2x2ZShhbGxWYXJpYWJsZXMoKVtpZF0pKTtcbiAgICBpZiAodmlzaWJsZSAhPT0gdW5kZWZpbmVkKSBlLnNldEF0dHJpYnV0ZSgnZGF0YS12aXNpYmxlJywgdmlzaWJsZSk7XG4gIH07XG4gIGhhbmRsZXIoKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZjJ3LXNldC12YXJpYWJsZScsIGhhbmRsZXIpO1xuICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZjJ3LXNldC12YXJpYWJsZScsIGhhbmRsZXIpO1xufSk7XG5cbmNvbnN0IGFwcGVhck9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKFxuICAoZW50cmllcywgb2JzZXJ2ZXIpID0+IHtcbiAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKGVudHJ5LnRhcmdldCk7XG4gICAgICAgIGVudHJ5LnRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnYXBwZWFyJykpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICAvLyAxMCUgb2YgdGhlIGVsZW1lbnQgbXVzdCBiZSB2aXNpYmxlXG4gIHsgdGhyZXNob2xkOiAwLjEgfVxuKTtcblxuLy8gRml4IHNjcm9sbCB0byBpZCBieSBpbnNwZWN0aW5nIGluamVjdGVkIGZpeGVkIGlkc1xuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgY29uc3QgaGFzaElkUHJlZml4ID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSk7XG4gIC8vIG1hdGNoaW5nICNmb28gb3IgI2Zvb18xXG4gIGNvbnN0IGhhc2hSRSA9IG5ldyBSZWdFeHAoaGFzaElkUHJlZml4ICsgJyhfXFxcXGQrKT8kJyk7XG4gIGZvciAoY29uc3QgZSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbaWRePVwiJHtoYXNoSWRQcmVmaXh9XCJdYCkpXG4gICAgaWYgKGhhc2hSRS50ZXN0KGUuaWQpICYmIGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ID4gMClcbiAgICAgIHJldHVybiBlLnNjcm9sbEludG9WaWV3KCk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTyxXQUFTLFFBQVEsR0FBVyxRQUF3QjtBQUN6RCxXQUFPLEtBQUssTUFBTSxJQUFJLE1BQU0sSUFBSTtBQUFBLEVBQ2xDOzs7QUNGZSxXQUFSLE9BQXdCLEtBQUssT0FBTyxNQUFNLE9BQU87QUFDdkQsVUFBTSxhQUFhLE9BQU8sU0FBUyxLQUFLLFNBQVMsRUFBRSxTQUFTLEdBQUc7QUFFL0QsUUFBSSxPQUFPLFFBQVEsVUFBVTtBQUM1QixPQUFDLEtBQUssT0FBTyxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0s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UUFBUSxhQUFhLEVBQUUsR0FBRyxDQUFDO0FBQ3BELFVBQUksWUFBWTtBQUFXLFVBQUUsYUFBYSxnQkFBZ0IsT0FBTztBQUFBLElBQ25FO0FBQ0EsWUFBUTtBQUNSLGFBQVMsaUJBQWlCLG9CQUFvQixPQUFPO0FBQ3JELFdBQU8sTUFBTSxTQUFTLG9CQUFvQixvQkFBb0IsT0FBTztBQUFBLEVBQ3ZFLENBQUM7QUFFRCxNQUFNLGlCQUFpQixJQUFJO0FBQUEsSUFDekIsQ0FBQyxTQUFTLGFBQWE7QUFDckIsY0FBUSxRQUFRLENBQUMsVUFBVTtBQUN6QixZQUFJLE1BQU0sZ0JBQWdCO0FBQ3hCLG1CQUFTLFVBQVUsTUFBTSxNQUFNO0FBQy9CLGdCQUFNLE9BQU8sY0FBYyxJQUFJLFlBQVksUUFBUSxDQUFDO0FBQUEsUUFDdEQ7QUFBQSxNQUNGLENBQUM7QUFBQSxJQUNIO0FBQUEsSUFFQSxFQUFFLFdBQVcsSUFBSTtBQUFBLEVBQ25CO0FBR0EsbUJBQWlCLFFBQVEsTUFBTTtBQUM3QixVQUFNLGVBQWUsT0FBTyxTQUFTLEtBQUssTUFBTSxDQUFDO0FBRWpELFVBQU0sU0FBUyxJQUFJLE9BQU8sZUFBZSxXQUFXO0FBQ3BELGVBQVcsS0FBSyxTQUFTLGlCQUFpQixTQUFTLGdCQUFnQjtBQUNqRSxVQUFJLE9BQU8sS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLHNCQUFzQixFQUFFLFNBQVM7QUFDMUQsZUFBTyxFQUFFLGVBQWU7QUFBQSxFQUM5QixDQUFDOyIsCiAgIm5hbWVzIjogWyJlbWl0IiwgInJlc29sdmUiLCAibmFtZSIsICJlbWl0IiwgIm9uY2UiLCAicnVuIiwgInRvUnVuIiwgImVsdCIsICJyZXNvbHZlIiwgImVsdCIsICJkdXJhdGlvbiIsICJvdmVybGF5UG9zaXRpb25UeXBlIiwgInRyYW5zaXRpb24iLCAiYm91bmQiLCAidHJpZ2dlciIsICJlIiwgImkiLCAiYWN0aW9uIiwgInJ1biIsICJvbmNlIiwgIl9hIiwgIl9iIiwgIm92ZXJsYXkiLCAiYW5pbWF0aW9ucyIsICJ0cmFuc2l0aW9uIiwgImR1cmF0aW9uIiwgImVsdCIsICJtb2RhbCIsICJuZWVkc0ZpbmFsU3RhdGUiLCAiZGlzdFgiLCAiZGlzdFkiLCAiZnJvbSJdCn0K
