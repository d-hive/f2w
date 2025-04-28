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
  function once(run2) {
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
  function setPropertiesWithAnimate(elt2, props, pseudo) {
    elt2.animate(
      __spreadValues({}, props),
      {
        pseudoElement: pseudo,
        iterations: 1,
        duration: 0,
        fill: "forwards"
      }
    );
  }
  function toObj(p) {
    return Object.fromEntries(p.map((it) => [it.camelKey, [it.from, it.to]]));
  }
  function animateProps(elt2, props, easing, duration2, containersToReOrder) {
    const parent = elt2.parentElement;
    const computedStyles = getComputedStyle(elt2);
    const parentStyles = getComputedStyle(parent);
    const parentDisplay = parentStyles.display;
    const isFlexOrGrid = parentDisplay.endsWith("flex") || parentDisplay.endsWith("grid");
    const isAbsolute = isAbsoluteOrFixed(computedStyles.position);
    const currentProps = props.map((it) => __spreadProps(__spreadValues({}, it), {
      camelKey: it.key.startsWith("--") ? it.key : it.key.replace(/-([a-z])/g, (_, l) => l.toUpperCase())
    }));
    const attrProps = {};
    const nProps = currentProps.filter((it) => {
      if (it.pseudo)
        return false;
      if (it.key.startsWith("--f2w-attr-")) {
        attrProps[it.key.slice(11)] = it.to;
        return false;
      }
      return true;
    });
    const nPropsObj = toObj(nProps);
    const bPropsObj = toObj(
      currentProps.filter((it) => it.pseudo === "::before")
    );
    const aPropsObj = toObj(currentProps.filter((it) => it.pseudo === "::after"));
    let displayAfterAnimation = void 0;
    if (nPropsObj.display) {
      if (nPropsObj.display[0] === "none") {
        elt2.style.display = String(nPropsObj.display[1]);
      } else if (nPropsObj.display[1] === "none") {
        if (isFlexOrGrid && !isAbsolute) {
          elt2.style.display = "none";
        }
      }
      displayAfterAnimation = String(nPropsObj.display[1]);
      delete nPropsObj.display;
    }
    if (safari) {
      setStyle(elt2, nPropsObj, "overflow");
      setStyle(elt2, nPropsObj, "rowGap", "gridRowGap");
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
    if (nPropsObj["--f2w-img-src"]) {
      let i = elt2.f2w_image_lazy_loader;
      const src = nPropsObj["--f2w-img-src"][1];
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
      delete nPropsObj["--f2w-img-src"];
    }
    if (nPropsObj["$innerHTML"]) {
      elt2.innerHTML = String(nPropsObj["$innerHTML"][1]);
      delete nPropsObj["$innerHTML"];
    }
    for (const [k, v] of Object.entries(attrProps)) {
      elt2.setAttribute(k, String(v));
    }
    if (nPropsObj.left && nPropsObj.right) {
      if (nPropsObj.left[1] === "revert" && nPropsObj.right[0] === "revert") {
        const { right: parentRight } = parent.getBoundingClientRect();
        const { right } = elt2.getBoundingClientRect();
        const rightStr = toPx(parentRight - right);
        setPropertiesWithAnimate(elt2, { left: "revert", right: rightStr });
        delete nPropsObj.left;
        nPropsObj.right[0] = rightStr;
      } else if (nPropsObj.left[0] === "revert" && nPropsObj.right[1] === "revert") {
        const { left: parentLeft } = parent.getBoundingClientRect();
        const { left } = elt2.getBoundingClientRect();
        const leftStr = toPx(left - parentLeft);
        setPropertiesWithAnimate(elt2, { right: "revert", left: leftStr });
        delete nPropsObj.right;
        nPropsObj.left[0] = leftStr;
      }
    }
    if (nPropsObj.top && nPropsObj.bottom) {
      if (nPropsObj.top[1] === "revert" && nPropsObj.bottom[0] === "revert") {
        const { bottom: parentBottom } = parent.getBoundingClientRect();
        const { bottom } = elt2.getBoundingClientRect();
        const bottomStr = toPx(parentBottom - bottom);
        setPropertiesWithAnimate(elt2, { top: "revert", bottom: bottomStr });
        delete nPropsObj.top;
        nPropsObj.bottom[0] = bottomStr;
      } else if (nPropsObj.top[0] === "revert" && nPropsObj.bottom[1] === "revert") {
        const { top: parentTop } = parent.getBoundingClientRect();
        const { top } = elt2.getBoundingClientRect();
        const topStr = toPx(top - parentTop);
        setPropertiesWithAnimate(elt2, { bottom: "revert", top: topStr });
        delete nPropsObj.bottom;
        nPropsObj.top[0] = topStr;
      }
    }
    const hasBgImage = !!nPropsObj["backgroundImage"];
    if (hasBgImage) {
      nProps.filter((it) => it.key.startsWith("background-")).forEach((it) => {
        elt2.style.setProperty(it.key, String(it.to));
        delete nPropsObj[it.camelKey];
      });
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
  var setStyle = (e, o, ...props) => {
    const p = props.find((p2) => p2 in o);
    if (!p)
      return;
    e.style[props[0]] = String(o[p][1]);
    delete o[p];
  };

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
          const revert = once(run2(e));
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
      const close = once((_, i) => {
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
  var eltToAltMappings = /* @__PURE__ */ new Map();
  function executeAnimations(animations2, easing, duration2, bound2, trigger2, debug, e) {
    var _a, _b, _c;
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
    for (const { eltId, altId, props, reactions } of animations2) {
      let elt2 = document.getElementById(eltId);
      if (!elt2) {
        const eltId2 = eltToAltMappings.get(eltId);
        if (eltId2) {
          elt2 = document.getElementById(eltId2);
        }
      }
      if (!elt2) {
        shouldNotHappen(`Can't find element for id: ${eltId}`);
        continue;
      }
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
        if (duration2) {
          elt2.insertAdjacentElement("afterend", alt);
          animateProps(
            elt2,
            [
              {
                key: "display",
                from: getComputedStyle(elt2).display,
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
        } else {
          elt2.parentElement.replaceChild(alt, elt2);
          let eltTpl = document.getElementById(templateId(eltId));
          if (!eltTpl) {
            if (true) {
              console.debug(`Backing up element before swap, id: ${eltId}`);
            }
            eltTpl = document.createElement("template");
            eltTpl.id = templateId(eltId);
            eltTpl.innerHTML = elt2.outerHTML;
            alt.insertAdjacentElement("afterend", eltTpl);
          }
          eltToAltMappings.set(eltId, alt.id);
        }
        reverse.push({
          eltId: alt.id,
          altId: elt2.id
        });
        if (!isNaN(+getComputedStyle(alt).getPropertyValue("--f2w-order"))) {
          containersToReOrder.add(alt.parentElement);
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
        }).filter((it) => it.from !== it.to);
        animateProps(elt2, currentProps, easing, duration2, containersToReOrder);
        if (reactions) {
          if (trigger2 !== "hover") {
            (_c = elt2.f2w_mouseleave_remove) == null ? void 0 : _c.call(elt2);
          }
          reactions.forEach((it) => hookElt(elt2, it.type, it.to, duration2));
        }
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
          revert = once(run2(e));
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
  var collectionModeBpsSorted = Object.fromEntries(
    Object.entries(collectionModeBps()).map(([k, v]) => [
      k,
      Object.entries(v).map(([name, { minWidth }]) => ({ name, minWidth }))
    ])
  );
  function updateCollectionModes() {
    var _a;
    const width = ((_a = window.visualViewport) == null ? void 0 : _a.width) || window.innerWidth;
    for (const [collectionName, breakpoints] of Object.entries(
      collectionModeBpsSorted
    )) {
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
      if (characters !== e.textContent)
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vdXRpbHMvc3JjL251bWJlcnMudHMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JnYi1oZXhANC4wLjEvbm9kZV9tb2R1bGVzL3JnYi1oZXgvaW5kZXguanMiLCAiLi4vdXRpbHMvc3JjL2FycmF5LnRzIiwgIi4uL3V0aWxzL3NyYy9hc3NlcnQudHMiLCAiLi4vZmlnbWEtdG8taHRtbC9zcmMvdmFyaWFibGVzLnRzIiwgIi4uL2ZpZ21hLXRvLWh0bWwvc3JjL2hlbHBlcnMudHMiLCAiLi4vZmlnbWEtdG8taHRtbC9zcmMvbWFwcGluZy90cmlnZ2Vycy50cyIsICIuLi91dGlscy9zcmMvZnVuY3Rpb25zLnRzIiwgInNyYy9saWZlY3ljbGUudHMiLCAiLi4vZmlnbWEtdG8taHRtbC9zcmMvbWFwcGluZy91dGlscy50cyIsICJzcmMvcnVudGltZS92aWRlb3MudHMiLCAiLi4vdXRpbHMvc3JjL25hdmlnYXRvci50cyIsICIuLi91dGlscy9zcmMvc3R5bGVzL2luZGV4LnRzIiwgInNyYy9ydW50aW1lL2FuaW1hdG9yLnRzIiwgInNyYy9ydW50aW1lL2FuaW1hdGlvbnMudHMiLCAic3JjL3J1bnRpbWVfZW1iZWQudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImV4cG9ydCBmdW5jdGlvbiByb3VuZFRvKHY6IG51bWJlciwgZmFjdG9yOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5yb3VuZCh2ICogZmFjdG9yKSAvIGZhY3Rvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsc0Vwc2lsb24oYTogbnVtYmVyLCBiOiBudW1iZXIsIGVwczogbnVtYmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiBNYXRoLmFicyhhIC0gYikgPCBlcHM7XG59XG4iLCAiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmdiSGV4KHJlZCwgZ3JlZW4sIGJsdWUsIGFscGhhKSB7XG5cdGNvbnN0IGlzUGVyY2VudCA9IChyZWQgKyAoYWxwaGEgfHwgJycpKS50b1N0cmluZygpLmluY2x1ZGVzKCclJyk7XG5cblx0aWYgKHR5cGVvZiByZWQgPT09ICdzdHJpbmcnKSB7XG5cdFx0W3JlZCwgZ3JlZW4sIGJsdWUsIGFscGhhXSA9IHJlZC5tYXRjaCgvKDA/XFwuP1xcZCspJT9cXGIvZykubWFwKGNvbXBvbmVudCA9PiBOdW1iZXIoY29tcG9uZW50KSk7XG5cdH0gZWxzZSBpZiAoYWxwaGEgIT09IHVuZGVmaW5lZCkge1xuXHRcdGFscGhhID0gTnVtYmVyLnBhcnNlRmxvYXQoYWxwaGEpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiByZWQgIT09ICdudW1iZXInIHx8XG5cdFx0dHlwZW9mIGdyZWVuICE9PSAnbnVtYmVyJyB8fFxuXHRcdHR5cGVvZiBibHVlICE9PSAnbnVtYmVyJyB8fFxuXHRcdHJlZCA+IDI1NSB8fFxuXHRcdGdyZWVuID4gMjU1IHx8XG5cdFx0Ymx1ZSA+IDI1NVxuXHQpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCB0aHJlZSBudW1iZXJzIGJlbG93IDI1NicpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBhbHBoYSA9PT0gJ251bWJlcicpIHtcblx0XHRpZiAoIWlzUGVyY2VudCAmJiBhbHBoYSA+PSAwICYmIGFscGhhIDw9IDEpIHtcblx0XHRcdGFscGhhID0gTWF0aC5yb3VuZCgyNTUgKiBhbHBoYSk7XG5cdFx0fSBlbHNlIGlmIChpc1BlcmNlbnQgJiYgYWxwaGEgPj0gMCAmJiBhbHBoYSA8PSAxMDApIHtcblx0XHRcdGFscGhhID0gTWF0aC5yb3VuZCgyNTUgKiBhbHBoYSAvIDEwMCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIGFscGhhIHZhbHVlICgke2FscGhhfSkgYXMgYSBmcmFjdGlvbiBvciBwZXJjZW50YWdlYCk7XG5cdFx0fVxuXG5cdFx0YWxwaGEgPSAoYWxwaGEgfCAxIDw8IDgpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1taXhlZC1vcGVyYXRvcnNcblx0fSBlbHNlIHtcblx0XHRhbHBoYSA9ICcnO1xuXHR9XG5cblx0Ly8gVE9ETzogUmVtb3ZlIHRoaXMgaWdub3JlIGNvbW1lbnQuXG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1taXhlZC1vcGVyYXRvcnNcblx0cmV0dXJuICgoYmx1ZSB8IGdyZWVuIDw8IDggfCByZWQgPDwgMTYpIHwgMSA8PCAyNCkudG9TdHJpbmcoMTYpLnNsaWNlKDEpICsgYWxwaGE7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIHVuaXF1ZU9yTnVsbDxUPihhcnI6IFRbXSk6IFQgfCB1bmRlZmluZWQge1xuICBpZiAoYXJyLmxlbmd0aCkge1xuICAgIGNvbnN0IGJhc2UgPSBhcnJbMF07XG4gICAgcmV0dXJuIGFyci5zbGljZSgxKS5ldmVyeSgoaXQpID0+IGl0ID09PSBiYXNlKSA/IGJhc2UgOiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckVtcHR5PFQ+KGFycjogKFQgfCB1bmRlZmluZWQgfCBudWxsIHwgdm9pZClbXSk6IFRbXSB7XG4gIHJldHVybiBhcnIuZmlsdGVyKG5vdEVtcHR5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vdEVtcHR5PFRWYWx1ZT4oXG4gIHZhbHVlOiBUVmFsdWUgfCBudWxsIHwgdW5kZWZpbmVkIHwgdm9pZFxuKTogdmFsdWUgaXMgVFZhbHVlIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQ7XG59XG5cbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vYS80MzA1MzgwMy82MTU5MDNcbmV4cG9ydCBmdW5jdGlvbiBjYXJ0ZXNpYW48VD4ob3B0aW9uczogVFtdW10pOiBUW11bXSB7XG4gIHJldHVybiAob3B0aW9ucyBhcyBhbnkpLnJlZHVjZShcbiAgICAoYTogYW55LCBiOiBhbnkpID0+IGEuZmxhdE1hcCgoZDogYW55KSA9PiBiLm1hcCgoZTogYW55KSA9PiBbLi4uZCwgZV0pKSxcbiAgICBbW11dXG4gICkgYXMgVFtdW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRW50cmllc011bHRpPFQ+KGxpc3Q6IFtzdHJpbmcsIFRdW10pOiBSZWNvcmQ8c3RyaW5nLCBUW10+IHtcbiAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBUW10+ID0ge307XG4gIGZvciAoY29uc3QgW2ssIHZdIG9mIGxpc3QpIHtcbiAgICBpZiAoIShrIGluIHJlc3VsdCkpIHJlc3VsdFtrXSA9IFtdO1xuICAgIHJlc3VsdFtrXS5wdXNoKHYpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnRyaWVzVG9NdWx0aU1hcDxLLCBWPihsaXN0OiBbSywgVl1bXSk6IE1hcDxLLCBWW10+IHtcbiAgY29uc3QgcmVzdWx0ID0gbmV3IE1hcDxLLCBWW10+KCk7XG4gIGZvciAoY29uc3QgW2ssIHZdIG9mIGxpc3QpIHtcbiAgICBjb25zdCBhcnIgPSByZXN1bHQuZ2V0KGspO1xuICAgIGlmIChhcnIpIGFyci5wdXNoKHYpO1xuICAgIGVsc2UgcmVzdWx0LnNldChrLCBbdl0pO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWR1cGU8VD4oYXJyOiBUW10pOiBUW10ge1xuICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFycikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVkdXBlSXRlcmFibGU8VD4oYXJyOiBUW10pOiBJdGVyYWJsZTxUPiB7XG4gIHJldHVybiBuZXcgU2V0KGFycik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWR1cGVkS2V5cyhcbiAgYTogb2JqZWN0IHwgdW5kZWZpbmVkLFxuICBiOiBvYmplY3QgfCB1bmRlZmluZWRcbik6IEl0ZXJhYmxlPHN0cmluZz4ge1xuICBpZiAoIWEpIHtcbiAgICBpZiAoIWIpIHJldHVybiBbXTtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoYik7XG4gIH1cbiAgaWYgKCFiKSByZXR1cm4gT2JqZWN0LmtleXMoYSk7XG4gIHJldHVybiBkZWR1cGVJdGVyYWJsZShbLi4uT2JqZWN0LmtleXMoYSksIC4uLk9iamVjdC5rZXlzKGIpXSk7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIHNob3VsZE5vdEhhcHBlbih0eHQ6IHN0cmluZyk6IHZvaWQge1xuICBjb25zb2xlLndhcm4odHh0KTtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgZGVidWdnZXI7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3VsZE5vdEhhcHBlbkVycm9yKHR4dDogc3RyaW5nKTogRXJyb3Ige1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBjb25zb2xlLmVycm9yKHR4dCk7XG4gICAgZGVidWdnZXI7XG4gIH1cbiAgcmV0dXJuIG5ldyBFcnJvcih0eHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0VGhhdChjaGVjazogKCkgPT4gYm9vbGVhbiwgdHh0OiBzdHJpbmcpOiB2b2lkIHtcbiAgaWYgKCFjaGVjaygpKSB7XG4gICAgc2hvdWxkTm90SGFwcGVuKHR4dCk7XG4gIH1cbn1cbiIsICJpbXBvcnQgdHlwZSB7IENvbGxlY3Rvck1hcHBpbmdDb250ZXh0IH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBydW5uaW5nSW5QbHVnaW5Db2RlIH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXV0aWxzL3V0aWxzJztcbmltcG9ydCB7IEtleWVkRXJyb3IgfSBmcm9tICcuL3dhcm5pbmdzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFZhcmlhYmxlQnlJZEFzeW5jKFxuICBjdHg6IENvbGxlY3Rvck1hcHBpbmdDb250ZXh0IHwgdW5kZWZpbmVkLFxuICBpZDogc3RyaW5nXG4pOiBQcm9taXNlPFZhcmlhYmxlIHwgdW5kZWZpbmVkPiB7XG4gIGlmICghcnVubmluZ0luUGx1Z2luQ29kZSkgcmV0dXJuO1xuICBjb25zdCB2ID0gYXdhaXQgZmlnbWEudmFyaWFibGVzLmdldFZhcmlhYmxlQnlJZEFzeW5jKGlkKTtcbiAgaWYgKCF2KSB0aHJvdyBuZXcgS2V5ZWRFcnJvcignVkFSSUFCTEVTJywgJ01pc3NpbmcgdmFyaWFibGUgJyArIGlkKTtcbiAgdHJ5IHtcbiAgICB2Lm5hbWU7XG4gICAgcmV0dXJuIHY7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEtleWVkRXJyb3IoJ1ZBUklBQkxFUycsICdNaXNzaW5nIHZhcmlhYmxlICcgKyBpZCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvVmFyaWFibGUoXG4gIHZhcmlhYmxlSWQ6IHN0cmluZyxcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dCB8IHVuZGVmaW5lZFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIGB2YXIoJHtjb2xsZWN0VmFyaWFibGVJZCh2YXJpYWJsZUlkLCBjdHgpfSlgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29sbGVjdFZhcmlhYmxlSWQoXG4gIHZhcmlhYmxlSWQ6IHN0cmluZyxcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dCB8IHVuZGVmaW5lZFxuKTogc3RyaW5nIHtcbiAgaWYgKGN0eCAmJiAhY3R4LnZhcmlhYmxlcy5oYXModmFyaWFibGVJZCkpIGN0eC52YXJpYWJsZXMuc2V0KHZhcmlhYmxlSWQsIHt9KTtcbiAgcmV0dXJuIGAtLSR7dmFyaWFibGVJZH1gO1xufVxuXG5jb25zdCBTQU5JVElaRV9SRUdFWFAgPSAvW14wLTlhLXpBLVpdKy9nO1xuXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVDb2xsZWN0aW9uTW9kZU5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplQ29sbGVjdGlvbk5hbWUobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIG5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKFNBTklUSVpFX1JFR0VYUCwgJy0nKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplVmFyaWFibGVOYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBuYW1lLnJlcGxhY2UoU0FOSVRJWkVfUkVHRVhQLCAnLScpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9WYXJpYWJsZU5hbWUodmFyaWFibGU6IFZhcmlhYmxlKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAtLSR7c2FuaXRpemVWYXJpYWJsZU5hbWUodmFyaWFibGUubmFtZSl9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvRGF0YUF0dHJpYnV0ZSh2YXJpYWJsZTogVmFyaWFibGUpOiBzdHJpbmcge1xuICByZXR1cm4gYGRhdGEke3RvVmFyaWFibGVOYW1lKHZhcmlhYmxlKS5zbGljZSgxKS50b0xvd2VyQ2FzZSgpfWA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FsaWFzKHY6IFZhcmlhYmxlVmFsdWVXaXRoRXhwcmVzc2lvbik6IHYgaXMgVmFyaWFibGVBbGlhcyB7XG4gIHJldHVybiAoXG4gICAgdHlwZW9mIHYgPT09ICdvYmplY3QnICYmICh2IGFzIFZhcmlhYmxlQWxpYXMpLnR5cGUgPT09ICdWQVJJQUJMRV9BTElBUydcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFZhcmlhYmxlRGF0YVRvRjJ3KFxuICBkYXRhOiBWYXJpYWJsZURhdGEsXG4gIGN0eDogQ29sbGVjdG9yTWFwcGluZ0NvbnRleHRcbik6IFZhcmlhYmxlRGF0YSB7XG4gIGNvbnN0IHJldCA9IHsgLi4uZGF0YSB9O1xuICBjb25zdCB7IHZhbHVlIH0gPSByZXQ7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgaWYgKGlzQWxpYXModmFsdWUpKSB7XG4gICAgICByZXQudmFsdWUgPSBtYXBWYXJpYWJsZUFsaWFzVG9GMncodmFsdWUsIGN0eCk7XG4gICAgfSBlbHNlIGlmICgnZXhwcmVzc2lvbkFyZ3VtZW50cycgaW4gdmFsdWUpIHtcbiAgICAgIHJldC52YWx1ZSA9IHtcbiAgICAgICAgZXhwcmVzc2lvbkZ1bmN0aW9uOiB2YWx1ZS5leHByZXNzaW9uRnVuY3Rpb24sXG4gICAgICAgIGV4cHJlc3Npb25Bcmd1bWVudHM6IHZhbHVlLmV4cHJlc3Npb25Bcmd1bWVudHMubWFwKChhKSA9PlxuICAgICAgICAgIG1hcFZhcmlhYmxlRGF0YVRvRjJ3KGEsIGN0eClcbiAgICAgICAgKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldC52YWx1ZSA9IHsgLi4udmFsdWUgfTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFZhcmlhYmxlQWxpYXNUb0YydyhcbiAgZGF0YTogVmFyaWFibGVBbGlhcyxcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dFxuKTogVmFyaWFibGVBbGlhcyB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ1ZBUklBQkxFX0FMSUFTJyxcbiAgICBpZDogY29sbGVjdFZhcmlhYmxlSWQoZGF0YS5pZCwgY3R4KSxcbiAgfTtcbn1cbiIsICJpbXBvcnQgdHlwZSB7XG4gIFJlc3RCYXNlTm9kZSxcbiAgUmVzdFBhaW50LFxuICBSZXN0U2NlbmVOb2RlLFxufSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdXRpbHMvc3JjL2ZpZ21hLnJlc3QudHlwaW5ncyc7XG5pbXBvcnQgeyByb3VuZFRvIH0gZnJvbSAnQGRpdnJpb3RzL3V0aWxzL3NyYy9udW1iZXJzJztcbmltcG9ydCByZ2JIZXggZnJvbSAncmdiLWhleCc7XG5pbXBvcnQge1xuICBGMndOYW1lc3BhY2UsXG4gIHR5cGUgRjJ3RGF0YSxcbiAgRjJ3RGF0YUtleSxcbn0gZnJvbSAnQGRpdnJpb3RzL3N0b3J5LXRvLWZpZ21hL3R5cGVzL25vZGVzJztcbmltcG9ydCB0eXBlIHtcbiAgQWR2RjJ3RGF0YSxcbiAgQmFzZUYyd0FjdGlvbixcbiAgSHRtbEVsZW1lbnQsXG4gIEh0bWxOb2RlLFxuICBNYXBwaW5nRXhlY0NvbnRleHQsXG4gIFdyaXRhYmxlVmVjdG9yLFxuICBBbGxvd2VkUHJvcGVydGllcyxcbiAgVHlwZWRTdHlsZXMsXG4gIE5vZGVQcm9wcyxcbiAgQ3NzVmFsdWVWYXIsXG4gIENvbGxlY3Rvck1hcHBpbmdDb250ZXh0LFxuICBNZWRpYUNhbGxzaXRlLFxuICBET01GMndBY3Rpb24sXG59IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgaXNBbGlhcywgdG9WYXJpYWJsZSB9IGZyb20gJy4vdmFyaWFibGVzJztcbmltcG9ydCB7IHNob3VsZE5vdEhhcHBlbiB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9hc3NlcnQnO1xuaW1wb3J0IHsgZ2V0U2hhcmVkUGx1Z2luRGF0YU9iaiB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS11dGlscy9wbHVnaW5EYXRhJztcbmltcG9ydCB0eXBlIHsgVmFsaWRWYXJpYW50UHJvcGVydGllcyB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS11dGlscy91dGlscyc7XG5pbXBvcnQgeyBjc3NWYWx1ZVRvU3RyaW5nIH0gZnJvbSAnLi9jc3NWYWx1ZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2l6ZShcbiAgbm9kZTogU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZSxcbiAgc2NhbGUgPSAxXG4pOiBXcml0YWJsZVZlY3RvciB7XG4gIHJldHVybiAnc2l6ZScgaW4gbm9kZVxuICAgID8ge1xuICAgICAgICB4OiBub2RlLnNpemUhLnggKiBzY2FsZSxcbiAgICAgICAgeTogbm9kZS5zaXplIS55ICogc2NhbGUsXG4gICAgICB9XG4gICAgOiB7XG4gICAgICAgIHg6IChub2RlIGFzIFNjZW5lTm9kZSkud2lkdGggKiBzY2FsZSxcbiAgICAgICAgeTogKG5vZGUgYXMgU2NlbmVOb2RlKS5oZWlnaHQgKiBzY2FsZSxcbiAgICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPZmZzZXQoXG4gIG5vZGU6IFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGUsXG4gIHNjYWxlID0gMVxuKTogV3JpdGFibGVWZWN0b3Ige1xuICByZXR1cm4gJ3gnIGluIG5vZGVcbiAgICA/IHsgeDogbm9kZS54ICogc2NhbGUsIHk6IG5vZGUueSAqIHNjYWxlIH1cbiAgICA6IHtcbiAgICAgICAgeDogKG5vZGUgYXMgUmVzdFNjZW5lTm9kZSkucmVsYXRpdmVUcmFuc2Zvcm0hWzBdWzJdICogc2NhbGUsXG4gICAgICAgIHk6IChub2RlIGFzIFJlc3RTY2VuZU5vZGUpLnJlbGF0aXZlVHJhbnNmb3JtIVsxXVsyXSAqIHNjYWxlLFxuICAgICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNvbGlkUGFpbnRUb1JnYmEoY29sb3I6IFNvbGlkUGFpbnQpOiBSR0JBIHtcbiAgcmV0dXJuIGZpZ21hUmdiYVRvQ3NzUmdiYSh7IC4uLmNvbG9yLmNvbG9yLCBhOiBjb2xvci5vcGFjaXR5ID8/IDEgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWdtYVJnYmFUb1N0cmluZyhyZ2JhOiBSR0JBKTogc3RyaW5nIHtcbiAgcmV0dXJuIHJnYmFUb1N0cmluZyhmaWdtYVJnYmFUb0Nzc1JnYmEocmdiYSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlnbWFSZ2JhT3JWYXJUb1N0cmluZyhcbiAgcmdiYTogUkdCQSxcbiAgdmFyaWFibGU6IFZhcmlhYmxlQWxpYXMgfCB1bmRlZmluZWQsXG4gIGN0eDogQ29sbGVjdG9yTWFwcGluZ0NvbnRleHRcbik6IHN0cmluZyB7XG4gIHJldHVybiB2YXJpYWJsZSA/IHRvVmFyaWFibGUodmFyaWFibGUuaWQsIGN0eCkgOiBmaWdtYVJnYmFUb1N0cmluZyhyZ2JhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJnYmFUb1N0cmluZyhyZ2JhOiBSR0JBIHwgUkdCKTogc3RyaW5nIHtcbiAgaWYgKCdhJyBpbiByZ2JhKSB7XG4gICAgY29uc3QgYSA9IHJvdW5kVG8ocmdiYS5hLCAxMDApO1xuICAgIGlmIChhICE9PSAxKSByZXR1cm4gYHJnYmEoJHtyZ2JhLnJ9LCR7cmdiYS5nfSwke3JnYmEuYn0sJHthfSlgO1xuICB9XG4gIGNvbnN0IGhleCA9IHJnYkhleChyZ2JhLnIsIHJnYmEuZywgcmdiYS5iKTtcbiAgaWYgKGhleFswXSA9PT0gaGV4WzFdICYmIGhleFsyXSA9PT0gaGV4WzNdICYmIGhleFs0XSA9PT0gaGV4WzVdKSB7XG4gICAgcmV0dXJuIGAjJHtoZXhbMF19JHtoZXhbMl19JHtoZXhbNF19YDtcbiAgfVxuICByZXR1cm4gYCMke2hleH1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlnbWFSZ2JhVG9Dc3NSZ2JhKGNvbG9yOiBSR0JBIHwgUkdCKTogUkdCQSB7XG4gIGNvbnN0IHsgciwgZywgYiwgYSA9IDEgfSA9IGNvbG9yIGFzIFJHQkE7XG4gIHJldHVybiB7XG4gICAgcjogcm91bmRUbyhyICogMjU1LCAxKSxcbiAgICBnOiByb3VuZFRvKGcgKiAyNTUsIDEpLFxuICAgIGI6IHJvdW5kVG8oYiAqIDI1NSwgMSksXG4gICAgYSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ3NzUHgoXG4gIHZhbHVlOiBudW1iZXIsXG4gIHJvdW5kOiBudW1iZXIsXG4gIHZhcmlhYmxlOiBWYXJpYWJsZUFsaWFzIHwgdW5kZWZpbmVkLFxuICBjdHg6IE1hcHBpbmdFeGVjQ29udGV4dFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhcmlhYmxlXG4gICAgPyBgY2FsYygxcHggKiAke3RvVmFyaWFibGUodmFyaWFibGUuaWQsIGN0eCl9KWBcbiAgICA6IHRvUHgocm91bmRUbyh2YWx1ZSwgcm91bmQpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQ29sb3JPclZhcmlhYmxlKFxuICBpdDogU29saWRQYWludCxcbiAgY3R4OiBDb2xsZWN0b3JNYXBwaW5nQ29udGV4dFxuKTogc3RyaW5nIHtcbiAgcmV0dXJuIGl0LmJvdW5kVmFyaWFibGVzPy5jb2xvclxuICAgID8gdG9WYXJpYWJsZShpdC5ib3VuZFZhcmlhYmxlcz8uY29sb3IuaWQsIGN0eClcbiAgICA6IHJnYmFUb1N0cmluZyhzb2xpZFBhaW50VG9SZ2JhKGl0KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1B4KHY6IG51bWJlcik6IHN0cmluZyB7XG4gIHJldHVybiBgJHtyb3VuZFRvKHYsIDEwKX1weGA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1BlcmNlbnQodjogbnVtYmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIGAke3JvdW5kVG8odiwgMTApfSVgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVUb1N0cmluZyh2OiBWYXJpYWJsZVZhbHVlKTogc3RyaW5nIHtcbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBpZiAoaXNBbGlhcyh2KSkge1xuICAgICAgICByZXR1cm4gYHZhcigke3YuaWR9KWA7XG4gICAgICB9XG4gICAgICBpZiAoJ3InIGluIHYpIHtcbiAgICAgICAgcmV0dXJuIHJnYmFUb1N0cmluZyhmaWdtYVJnYmFUb0Nzc1JnYmEodikpO1xuICAgICAgfVxuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIFN0cmluZyh2KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVJZChpZDogc3RyaW5nIHwgbnVtYmVyKTogc3RyaW5nIHtcbiAgaWQgPSBTdHJpbmcoaWQpO1xuICBsZXQgcmV0ID0gaWQubWF0Y2goL1teMC05YS16QS1aXy1dLykgPyBpZC5yZXBsYWNlKC9bXjAtOWEtekEtWl0rL2csICdfJykgOiBpZDtcbiAgaWYgKHJldC5tYXRjaCgvXihbMC05XXwtLXwtWzAtOV18LSQpLykpIHtcbiAgICByZXQgPSAnXycgKyByZXQ7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVucmljaDxUIGV4dGVuZHMgRjJ3RGF0YT4oXG4gIGVsOiBULFxuICB7IHRhZywgdW5zYWZlSHRtbCwgYXR0ciwgY3NzLCBzdHlsZXMgfTogQWR2RjJ3RGF0YVxuKTogVCB7XG4gIGlmICh0YWcpIGVsLnRhZyA9IHRhZztcbiAgaWYgKHVuc2FmZUh0bWwpIGVsLnVuc2FmZUh0bWwgPSB1bnNhZmVIdG1sO1xuICBpZiAoc3R5bGVzKSB7XG4gICAgT2JqZWN0LmFzc2lnbigoZWwuc3R5bGVzIHx8PSB7fSksIHN0eWxlcyk7XG4gIH1cbiAgaWYgKGF0dHIpIHtcbiAgICBPYmplY3QuYXNzaWduKChlbC5hdHRyIHx8PSB7fSksIGF0dHIpO1xuICB9XG4gIGlmIChjc3MpIHtcbiAgICAoZWwuY3NzIHx8PSBbXSkucHVzaCguLi5jc3MpO1xuICB9XG4gIHJldHVybiBlbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc05vUGFyZW50V2l0aFRhZyhcbiAgY3R4OiBNYXBwaW5nRXhlY0NvbnRleHQsXG4gIHRhZzogc3RyaW5nXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIGN0eC5wYXJlbnRzLmV2ZXJ5KChpdCkgPT4gaXQudGFnICE9PSB0YWcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzUGFyZW50V2l0aFRhZyhcbiAgY3R4OiBNYXBwaW5nRXhlY0NvbnRleHQsXG4gIHRhZzogc3RyaW5nXG4pOiBib29sZWFuIHtcbiAgcmV0dXJuICEhY3R4LnBhcmVudHMuZmluZCgoaXQpID0+IGl0LnRhZyA9PT0gdGFnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1BhcmVudFdpdGhUYWdSRShcbiAgY3R4OiBNYXBwaW5nRXhlY0NvbnRleHQsXG4gIHRhZ1JFOiBSZWdFeHBcbik6IGJvb2xlYW4ge1xuICByZXR1cm4gISFjdHgucGFyZW50cy5maW5kKChpdCkgPT4gdGFnUkUudGVzdChpdC50YWcpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpZGVzVG9TaW1wbGlmaWVkPFQ+KFxuICB0b3A6IFQsXG4gIHJpZ2h0OiBULFxuICBib3R0b206IFQsXG4gIGxlZnQ6IFRcbik6IFRbXSB7XG4gIGlmIChsZWZ0ID09PSByaWdodCkge1xuICAgIGlmICh0b3AgPT09IGJvdHRvbSkge1xuICAgICAgaWYgKHRvcCA9PT0gbGVmdCkge1xuICAgICAgICByZXR1cm4gW3RvcF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gW3RvcCwgbGVmdF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbdG9wLCBsZWZ0LCBib3R0b21dO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW3RvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdF07XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcm5lcnNUb1NpbXBsaWZpZWQ8VD4oXG4gIHRvcGxlZnQ6IFQsXG4gIHRvcHJpZ2h0OiBULFxuICBib3R0b21yaWdodDogVCxcbiAgYm90dG9tbGVmdDogVFxuKTogVFtdIHtcbiAgcmV0dXJuIHNpZGVzVG9TaW1wbGlmaWVkKHRvcGxlZnQsIHRvcHJpZ2h0LCBib3R0b21yaWdodCwgYm90dG9tbGVmdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTdHlsZXMobm9kZTogSHRtbEVsZW1lbnQsIHZhbHVlczogVHlwZWRTdHlsZXMpOiB2b2lkIHtcbiAgT2JqZWN0LmVudHJpZXModmFsdWVzKS5mb3JFYWNoKChbaywgdl0pID0+XG4gICAgc2V0U3R5bGUobm9kZSwgayBhcyBBbGxvd2VkUHJvcGVydGllcywgdilcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFN0eWxlKFxuICBub2RlOiBIdG1sRWxlbWVudCxcbiAga2V5OiBBbGxvd2VkUHJvcGVydGllcyxcbiAgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZFxuKTogdm9pZCB7XG4gIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgbWFwID0gKG5vZGUuc3R5bGVzIHx8PSB7fSk7XG4gICAgbWFwW2tleV0gPSBTdHJpbmcodmFsdWUpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRTdHlsZShcbiAgbm9kZTogSHRtbEVsZW1lbnQsXG4gIGtleTogc3RyaW5nLFxuICB2YWx1ZXM6IHN0cmluZ1tdLFxuICBzZXBhcmF0b3IgPSAnICdcbik6IHZvaWQge1xuICBpZiAodmFsdWVzLmxlbmd0aCkge1xuICAgIGNvbnN0IHN0eWxlcyA9IChub2RlLnN0eWxlcyA/Pz0ge30pO1xuICAgIGNvbnN0IHYgPSB2YWx1ZXMuam9pbihzZXBhcmF0b3IpO1xuICAgIGlmIChzdHlsZXNba2V5XSkge1xuICAgICAgc3R5bGVzW2tleV0gKz0gc2VwYXJhdG9yICsgdjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVzW2tleV0gPSB2O1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkTWVkaWFDYWxsc2l0ZShcbiAgbm9kZTogSHRtbEVsZW1lbnQsXG4gIC4uLmNzOiBNZWRpYUNhbGxzaXRlW11cbik6IHZvaWQge1xuICBpZiAobm9kZS5jYWxsc2l0ZXMpIHtcbiAgICBub2RlLmNhbGxzaXRlcy5wdXNoKC4uLmNzKTtcbiAgfSBlbHNlIHtcbiAgICBub2RlLmNhbGxzaXRlcyA9IFsuLi5jc107XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZENsYXNzKGh0bWw6IEh0bWxFbGVtZW50LCBjbGFzc05hbWU6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCBjbGFzc0xpc3QgPSAoaHRtbC5jbGFzc2VzID8/PSBbXSk7XG4gIGlmICghY2xhc3NMaXN0LmluY2x1ZGVzKGNsYXNzTmFtZSkpIGNsYXNzTGlzdC5wdXNoKGNsYXNzTmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBibG9ja2lmeShub2RlOiBIdG1sRWxlbWVudCk6IHZvaWQge1xuICBpZiAoIW5vZGUuc3R5bGVzPy5bJ2Rpc3BsYXknXSkgc2V0U3R5bGUobm9kZSwgJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgZWxzZSB7XG4gICAgY29uc3QgZGlzcGxheSA9IG5vZGUuc3R5bGVzWydkaXNwbGF5J107XG4gICAgc2V0U3R5bGUoXG4gICAgICBub2RlLFxuICAgICAgJ2Rpc3BsYXknLFxuICAgICAgZGlzcGxheSA9PT0gJ2lubGluZScgPyAnYmxvY2snIDogZGlzcGxheS5yZXBsYWNlKC9pbmxpbmUtLywgJycpXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FuTWFrZUltZyhmaWxsczogKFBhaW50IHwgUmVzdFBhaW50KVtdKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgZmlsbHMubGVuZ3RoID09PSAxICYmXG4gICAgZmlsbHNbMF0udHlwZSA9PT0gJ0lNQUdFJyAmJlxuICAgIGZpbGxzWzBdLnNjYWxlTW9kZSAhPT0gJ1RJTEUnXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5NYWtlVmlkZW8oZmlsbHM6IChQYWludCB8IFJlc3RQYWludClbXSk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgIGZpbGxzLmxlbmd0aCA9PT0gMSAmJlxuICAgIGZpbGxzWzBdLnR5cGUgPT09ICdWSURFTycgJiZcbiAgICBmaWxsc1swXS5zY2FsZU1vZGUgIT09ICdUSUxFJ1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGaWx0ZXJlZFBhaW50KGZpbGw6IFBhaW50IHwgUmVzdFBhaW50KTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgZmlsbC50eXBlID09PSAnSU1BR0UnICYmXG4gICAgKGhhc0ZpbHRlcihmaWxsLmZpbHRlcnMpIHx8IChmaWxsLm9wYWNpdHkgPz8gMSkgIT09IDEpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNGaWx0ZXIoZmlsdGVycz86IEltYWdlRmlsdGVycyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKFxuICAgICEhZmlsdGVycyAmJlxuICAgICEhKFxuICAgICAgZmlsdGVycy5jb250cmFzdCB8fFxuICAgICAgZmlsdGVycy5leHBvc3VyZSB8fFxuICAgICAgZmlsdGVycy5oaWdobGlnaHRzIHx8XG4gICAgICBmaWx0ZXJzLnNhdHVyYXRpb24gfHxcbiAgICAgIGZpbHRlcnMuc2hhZG93cyB8fFxuICAgICAgZmlsdGVycy50ZW1wZXJhdHVyZSB8fFxuICAgICAgZmlsdGVycy50aW50XG4gICAgKVxuICApO1xufVxuXG5leHBvcnQgY29uc3QgZ2V0UGFyZW50ID0gKGN0eDogTWFwcGluZ0V4ZWNDb250ZXh0KTogSHRtbEVsZW1lbnQgfCB1bmRlZmluZWQgPT5cbiAgY3R4LnBhcmVudHNbY3R4LnBhcmVudHMubGVuZ3RoIC0gMV07XG5cbmV4cG9ydCBmdW5jdGlvbiBzYW1lRmlsdGVyKGE/OiBJbWFnZUZpbHRlcnMsIGI/OiBJbWFnZUZpbHRlcnMpOiBib29sZWFuIHtcbiAgaWYgKGEgPT09IGIpIHJldHVybiB0cnVlO1xuICBjb25zdCBoYXNBID0gaGFzRmlsdGVyKGEpO1xuICBjb25zdCBoYXNCID0gaGFzRmlsdGVyKGIpO1xuICBpZiAoaGFzQSAmJiBoYXNCKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGEhLmNvbnRyYXN0ID09PSBiIS5jb250cmFzdCAmJlxuICAgICAgYSEuZXhwb3N1cmUgPT09IGIhLmV4cG9zdXJlICYmXG4gICAgICBhIS5oaWdobGlnaHRzID09PSBiIS5oaWdobGlnaHRzICYmXG4gICAgICBhIS5zYXR1cmF0aW9uID09PSBiIS5zYXR1cmF0aW9uICYmXG4gICAgICBhIS5zaGFkb3dzID09PSBiIS5zaGFkb3dzICYmXG4gICAgICBhIS50ZW1wZXJhdHVyZSA9PT0gYiEudGVtcGVyYXR1cmUgJiZcbiAgICAgIGEhLnRpbnQgPT09IGIhLnRpbnRcbiAgICApO1xuICB9XG4gIHJldHVybiBoYXNBID09PSBoYXNCO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsbE9wYWNpdHlGaWx0ZXIoZmlsbDogUGFpbnQgfCBSZXN0UGFpbnQgfCB1bmRlZmluZWQpOiBudW1iZXIge1xuICByZXR1cm4gKGZpbGw/LnR5cGUgPT09ICdJTUFHRScgJiYgZmlsbC5vcGFjaXR5KSB8fCAxO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmVlZFRvU3BsaXRGaWxscyhcbiAgbm9kZTogU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZSxcbiAgZmlsbHM6IChQYWludCB8IFJlc3RQYWludClbXVxuKTogYm9vbGVhbiB7XG4gIGlmICghZmlsbHMubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gIGlmIChmaWxscy5ldmVyeSgoaXQpID0+ICFpc0ZpbHRlcmVkUGFpbnQoaXQpKSkgcmV0dXJuIGZhbHNlO1xuICAvLyBpZiBjaGlsZHJlbiwgbmVlZCB0byBzcGxpdCBmaWxscyB0byB1c2UgQ1NTIGZpbHRlciAob3RoZXJ3aXNlIGZpbHRlci9vcGFjaXR5IHdvdWxkIGFwcGx5IHRvIGNoaWxkcmVuIGFzIHdlbGwpXG4gIGlmIChoYXNDaGlsZHJlbihub2RlKSkgcmV0dXJuIHRydWU7XG4gIC8vIDEgZmlsbCB3aXRoIGZpbHRlciwgbm8gY2hpbGRyZW4gLT4gY2FuIHVzZSBDU1MgZmlsdGVyJm9wYWNpdHlcbiAgaWYgKGZpbGxzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc0NoaWxkcmVuKG5vZGU6IEJhc2VOb2RlIHwgUmVzdEJhc2VOb2RlKTogYm9vbGVhbiB7XG4gIHJldHVybiAnY2hpbGRyZW4nIGluIG5vZGUgJiYgbm9kZS5jaGlsZHJlbj8ubGVuZ3RoID4gMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVPcGFjaXR5KFxuICBjdHg6IE1hcHBpbmdFeGVjQ29udGV4dCxcbiAgbm9kZTogU2NlbmVOb2RlXG4pOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBpZiAoJ29wYWNpdHknIGluIG5vZGUpIHtcbiAgICBpZiAobm9kZS5ib3VuZFZhcmlhYmxlcz8ub3BhY2l0eSkge1xuICAgICAgY29uc3Qgb3BhY2l0eTogQ3NzVmFsdWVWYXIgPSB7XG4gICAgICAgIHR5cGU6ICdWQVJJQUJMRScsXG4gICAgICAgIHZhcmlhYmxlOiBub2RlLmJvdW5kVmFyaWFibGVzLm9wYWNpdHksXG4gICAgICAgIHVuaXQ6ICcnLFxuICAgICAgfTtcbiAgICAgIHJldHVybiBgY2FsYygke2Nzc1ZhbHVlVG9TdHJpbmcoW29wYWNpdHldLCBjdHgpfSAvIDEwMClgO1xuICAgIH0gZWxzZSBpZiAobm9kZS5vcGFjaXR5ICE9PSAxKSByZXR1cm4gU3RyaW5nKHJvdW5kVG8obm9kZS5vcGFjaXR5LCAxMDApKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9Dc3NGaWx0ZXJzKGZpbHRlcnM/OiBJbWFnZUZpbHRlcnMpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGNzc0ZpbHRlcnM6IHN0cmluZ1tdID0gW107XG4gIGlmIChoYXNGaWx0ZXIoZmlsdGVycykpIHtcbiAgICBjb25zdCB7IGNvbnRyYXN0LCBzYXR1cmF0aW9uLCBleHBvc3VyZSB9ID0gZmlsdGVycyE7XG4gICAgaWYgKGNvbnRyYXN0KSB7XG4gICAgICAvLyAtMSAtPiAxID09PiAwLjggLT4gMS4yIChhcHByb3ggPylcbiAgICAgIGNzc0ZpbHRlcnMucHVzaChgY29udHJhc3QoJHswLjggKyAoY29udHJhc3QgKyAxKSAvIDV9KWApO1xuICAgIH1cbiAgICBpZiAoc2F0dXJhdGlvbikge1xuICAgICAgLy8gLTEgLT4gMSA9PT4gMCAtPiAyIChhcHByb3ggPylcbiAgICAgIGNzc0ZpbHRlcnMucHVzaChgc2F0dXJhdGUoJHtzYXR1cmF0aW9uICsgMX0pYCk7XG4gICAgfVxuICAgIGlmIChleHBvc3VyZSkge1xuICAgICAgLy8gLTEgLT4gMSA9PT4gMC4xIC0+IDYgKGZpZ21hIGFsZ29yaXRobSBzZWVtcyBkaWZmZXJlbnQpXG4gICAgICBjc3NGaWx0ZXJzLnB1c2goXG4gICAgICAgIGBicmlnaHRuZXNzKCR7XG4gICAgICAgICAgZXhwb3N1cmUgPCAwID8gMC4xICsgKChleHBvc3VyZSArIDEpICogOSkgLyAxMCA6IDEgKyBleHBvc3VyZSAqIDVcbiAgICAgICAgfSlgXG4gICAgICApO1xuICAgIH1cbiAgICAvLyBUT0RPIHN1cHBvcnQgb3RoZXIgZmlnbWEgZmlsdGVycyBzb21laG93ID9cbiAgICAvLyBlaXRoZXIgYnkgZXhwb3J0aW5nIGZpZ21hIHRyYW5zZm9ybWVkIGltYWdlLCBvciB1c2luZyBTVkcgaW1hZ2UgJiBmaWx0ZXJzIHdoaWNoIGFyZSBtb3JlIGNhcGFibGUgP1xuICB9XG4gIHJldHVybiBjc3NGaWx0ZXJzO1xufVxuXG5leHBvcnQgY29uc3QgRU1CRURfTkFNRSA9ICc8ZW1iZWQ+JztcblxuZXhwb3J0IGNvbnN0IGlzRW1iZWQgPSAobjogeyBuYW1lOiBzdHJpbmc7IGYyd0RhdGE/OiBGMndEYXRhIH0pOiBib29sZWFuID0+XG4gIG4ubmFtZSA9PT0gRU1CRURfTkFNRSB8fCAhIW4uZjJ3RGF0YT8udW5zYWZlSHRtbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEVtYmVkUmVsYXVjaERhdGEobm9kZTogU2NlbmVOb2RlKTogdm9pZCB7XG4gIC8vIFJlbGF1bmNoQWN0aW9ucy5FRElUIG5vdCBhY2Nlc3NpYmxlIGZyb20gaGVyZVxuICBpZiAoIW5vZGUuZ2V0UmVsYXVuY2hEYXRhKCkuZWRpdCkge1xuICAgIG5vZGUuc2V0UmVsYXVuY2hEYXRhKHsgZWRpdDogJ0VkaXQgZW1iZWQgSFRNTCcgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEYyd0RhdGEobm9kZTogU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZSk6IEYyd0RhdGEge1xuICBjb25zdCBmMndEYXRhID0gZ2V0U2hhcmVkUGx1Z2luRGF0YU9iajxGMndEYXRhIHwgdW5kZWZpbmVkPihcbiAgICBub2RlLFxuICAgIEYyd05hbWVzcGFjZSxcbiAgICBGMndEYXRhS2V5LFxuICAgIHVuZGVmaW5lZFxuICApO1xuICBpZiAoZjJ3RGF0YSkgcmV0dXJuIGYyd0RhdGE7XG5cbiAgLy8gaHR0cHM6Ly93d3cuZmlnbWEuY29tL2NvbW11bml0eS9wbHVnaW4vMTM1NjY5MzgwODkzMjM5MjcyOS90YWdzLWF0dHJpYnV0ZXMtYXR0YWNoLXNlbWFudGljLWRhdGEtdG8teW91ci1kZXNpZ24tZWxlbWVudHMtYW5kLWVuc3VyZS1hLXNlYW1sZXNzLWRldi1oYW5kb2ZmXG4gIGNvbnN0IGZpZ21hQXR0cnMgPSBnZXRTaGFyZWRQbHVnaW5EYXRhT2JqPGFueT4oXG4gICAgbm9kZSxcbiAgICAnZmlnbWEuYXR0cmlidXRlcycsXG4gICAgJ2F0dHJpYnV0ZXMnLFxuICAgIHVuZGVmaW5lZFxuICApO1xuICBpZiAoZmlnbWFBdHRycykge1xuICAgIHJldHVybiB7XG4gICAgICB0YWc6IGZpZ21hQXR0cnMudGFnLFxuICAgICAgYXR0cjogZmlnbWFBdHRycy5hdHRyaWJ1dGVzLFxuICAgIH07XG4gIH1cbiAgcmV0dXJuIHt9O1xufVxuXG5sZXQgY3VycmVudF9ndWlkID0gMTtcbmNvbnN0IGRlYnVnX2NhY2hlOiBSZWNvcmQ8c3RyaW5nLCBIdG1sRWxlbWVudD4gPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUd1aWQoZWx0OiBIdG1sRWxlbWVudCk6IHN0cmluZyB7XG4gIGNvbnN0IGd1aWQgPSAoZWx0Lmd1aWQgfHw9IFN0cmluZyhuZXh0R3VpZCgpKSk7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIGRlYnVnX2NhY2hlW2d1aWRdID0gZWx0O1xuICB9XG4gIHJldHVybiBndWlkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5QW5pbWF0ZWRFbGVtZW50c0FyZUluRG9tKFxuICBib2R5OiBIdG1sRWxlbWVudCxcbiAgcmVhY3Rpb25zOiBSZWNvcmQ8c3RyaW5nLCBET01GMndBY3Rpb24+XG4pOiB2b2lkIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgdHJhdmVyc2VFbGVtZW50KGJvZHksIChlbCkgPT4ge1xuICAgICAgKGVsIGFzIGFueSkuJGRvbSA9IHRydWU7XG4gICAgICBpZiAoJ3RhZycgaW4gZWwpIHtcbiAgICAgICAgZWwuY2hpbGRyZW4/LmZvckVhY2goKGMpID0+ICd0YWcnIGluIGMgJiYgKChjIGFzIGFueSkuJHBhcmVudCA9IGVsKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZm9yIChjb25zdCBhIG9mIGNyYXdsQWN0aW9ucyhPYmplY3QudmFsdWVzKHJlYWN0aW9ucykpKSB7XG4gICAgICBpZiAoYS50eXBlID09PSAnQU5JTUFURScpIHtcbiAgICAgICAgZm9yIChjb25zdCBiIG9mIGEuYW5pbWF0aW9ucykge1xuICAgICAgICAgIGNvbnN0IGVsdCA9IGRlYnVnX2NhY2hlW2IuZWx0SWRdO1xuICAgICAgICAgIGlmICghKGVsdCBhcyBhbnkpPy4kZG9tKSB7XG4gICAgICAgICAgICBzaG91bGROb3RIYXBwZW4oYEVsZW1lbnQgJHtiLmVsdElkfSBpcyBub3QgaW4gdGhlIERPTWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYi5hbHRJZCkge1xuICAgICAgICAgICAgY29uc3QgYWx0ID0gZGVidWdfY2FjaGVbYi5hbHRJZF07XG4gICAgICAgICAgICBpZiAoIShhbHQgYXMgYW55KT8uJGRvbSkge1xuICAgICAgICAgICAgICBzaG91bGROb3RIYXBwZW4oYEVsZW1lbnQgJHtiLmFsdElkfSBpcyBub3QgaW4gdGhlIERPTWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0cmF2ZXJzZUVsZW1lbnQoYm9keSwgKGVsKSA9PiB7XG4gICAgICBkZWxldGUgKGVsIGFzIGFueSkuJGRvbTtcbiAgICAgIGRlbGV0ZSAoZWwgYXMgYW55KS4kcGFyZW50O1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXh0R3VpZCgpOiBudW1iZXIge1xuICByZXR1cm4gY3VycmVudF9ndWlkKys7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXROb2RlUGFyYW1zKFxuICBodG1sOiBIdG1sRWxlbWVudCxcbiAgbm9kZTogU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZSxcbiAgY3R4OiBNYXBwaW5nRXhlY0NvbnRleHRcbik6IHZvaWQge1xuICBodG1sLm5vZGUgPSBub2RlUHJvcHMobm9kZSwgY3R4LnNjYWxlKTtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgaHRtbC5wYXRoID0gY3R4LnBhdGg7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vZGVQcm9wcyhcbiAgbm9kZTogU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZSxcbiAgc2NhbGUgPSAxXG4pOiBOb2RlUHJvcHMge1xuICBjb25zdCB7IGlkLCB0eXBlLCBuYW1lIH0gPSBub2RlO1xuICBjb25zdCB7IHg6IHdpZHRoLCB5OiBoZWlnaHQgfSA9IGdldFNpemUobm9kZSwgc2NhbGUpO1xuICBjb25zdCB7IHgsIHkgfSA9IGdldE9mZnNldChub2RlLCBzY2FsZSk7XG4gIGNvbnN0IG5vZGVQcm9wczogTm9kZVByb3BzID0geyBpZCwgdHlwZSwgd2lkdGgsIGhlaWdodCwgeCwgeSB9O1xuICBpZiAoKG5vZGUgYXMgQmxlbmRNaXhpbikuaXNNYXNrKSBub2RlUHJvcHMuaXNNYXNrID0gdHJ1ZTtcbiAgaWYgKG5vZGUudHlwZSAhPT0gJ1RFWFQnIHx8ICEobm9kZSBhcyBUZXh0Tm9kZSkuYXV0b1JlbmFtZSlcbiAgICBub2RlUHJvcHMubmFtZSA9IG5hbWU7XG4gIHJldHVybiBub2RlUHJvcHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZW1wbGF0ZUlkKGlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gJ1QnICsgaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiogY3Jhd2xBY3Rpb25zPFQ+KFxuICBpdDogSXRlcmFibGU8QmFzZUYyd0FjdGlvbjxUPj5cbik6IEdlbmVyYXRvcjxCYXNlRjJ3QWN0aW9uPFQ+PiB7XG4gIGZvciAoY29uc3QgYSBvZiBpdCkge1xuICAgIHlpZWxkIGE7XG4gICAgaWYgKGEudHlwZSA9PT0gJ0NPTkRJVElPTkFMJykge1xuICAgICAgZm9yIChjb25zdCBiIG9mIGEuY29uZGl0aW9uYWxCbG9ja3MpIHtcbiAgICAgICAgeWllbGQqIGNyYXdsQWN0aW9ucyhiLmFjdGlvbnMpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYS50eXBlID09PSAnS0VZX0NPTkRJVElPTicpIHtcbiAgICAgIHlpZWxkKiBjcmF3bEFjdGlvbnMoYS5hY3Rpb25zKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uKiBjcmF3bEFuaW1hdGlvbnM8VD4oXG4gIGl0OiBSZWNvcmQ8YW55LCBCYXNlRjJ3QWN0aW9uPFQ+PixcbiAgcmV2ZXJzZSA9IGZhbHNlXG4pOiBHZW5lcmF0b3I8VD4ge1xuICBjb25zdCBhcnIgPSBPYmplY3QudmFsdWVzKGl0KTtcbiAgaWYgKHJldmVyc2UpIGFyci5yZXZlcnNlKCk7XG4gIGZvciAoY29uc3QgYSBvZiBjcmF3bEFjdGlvbnM8VD4oYXJyKSkge1xuICAgIGlmIChhLnR5cGUgPT09ICdBTklNQVRFJykge1xuICAgICAgZm9yIChjb25zdCBiIG9mIGEuYW5pbWF0aW9ucykge1xuICAgICAgICB5aWVsZCBiO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgdHlwZSBUcmF2ZXJzZUNiID0gKFxuICBub2RlOiBIdG1sRWxlbWVudCxcbiAgcGFyZW50PzogSHRtbEVsZW1lbnRcbikgPT4gdm9pZCB8IGJvb2xlYW47XG5cbmV4cG9ydCBmdW5jdGlvbiB0cmF2ZXJzZUVsZW1lbnRzKFxuICByb290czogSHRtbE5vZGVbXSxcbiAgLi4uY2JzOiBUcmF2ZXJzZUNiW11cbik6IHZvaWQge1xuICBjYnMuZm9yRWFjaCgoY2IpID0+IHJvb3RzLmZvckVhY2goKHIpID0+IHRyYXZlcnNlRWxlbWVudChyLCBjYikpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyYXZlcnNlRWxlbWVudChyb290OiBIdG1sTm9kZSwgY2I6IFRyYXZlcnNlQ2IpOiB2b2lkIHtcbiAgY29uc3Qgc3RhY2sgPVxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnID8gbmV3IFNldDxIdG1sTm9kZT4oKSA6IHVuZGVmaW5lZDtcbiAgY29uc3QgdHJhdmVyc2VOb2RlID0gKG5vZGU6IEh0bWxOb2RlLCBwYXJlbnQ/OiBIdG1sRWxlbWVudCk6IHZvaWQgPT4ge1xuICAgIGlmIChzdGFjaz8uaGFzKG5vZGUpKSB7XG4gICAgICBzaG91bGROb3RIYXBwZW4oJ0N5Y2xpbmcgZWxlbWVudCB0cmVlJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YWNrPy5hZGQobm9kZSk7XG4gICAgfVxuICAgIGlmICgndGFnJyBpbiBub2RlKSB7XG4gICAgICBpZiAoY2Iobm9kZSwgcGFyZW50KSkgcmV0dXJuO1xuICAgICAgKG5vZGUuY2hpbGRyZW4gfHwgW10pLmZvckVhY2goKGl0KSA9PiB0cmF2ZXJzZU5vZGUoaXQsIG5vZGUpKTtcbiAgICB9XG4gIH07XG4gIHRyYXZlcnNlTm9kZShyb290LCB1bmRlZmluZWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9Dc3MoXG4gIHRhcmdldDogc3RyaW5nLFxuICB2YXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQ+LFxuICBpbmRlbnQ/OiBzdHJpbmdcbik6IHN0cmluZyB7XG4gIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyh2YXJzKTtcbiAgaWYgKCFlbnRyaWVzLmxlbmd0aCkgcmV0dXJuICcnO1xuICBsZXQgbGluZXMgPSBbXG4gICAgdGFyZ2V0ICsgJyB7JyxcbiAgICAuLi5lbnRyaWVzXG4gICAgICAuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gdW5kZWZpbmVkICYmIHYgIT09ICcnKVxuICAgICAgLm1hcCgoW2ssIHZdKSA9PiBgICAke2t9OiAke3Z9O2ApLFxuICAgICd9JyxcbiAgXTtcbiAgaWYgKGluZGVudCkgbGluZXMgPSBsaW5lcy5tYXAoKGwpID0+IGluZGVudCArIGwpO1xuICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXRjaGluZ05vZGVzPFQ+KFxuICB2YXJpYW50c1dpdGhQcm9wczogeyBub2RlOiBUOyBwcm9wczogVmFsaWRWYXJpYW50UHJvcGVydGllcyB9W10sXG4gIG5ld1Byb3BzOiBWYWxpZFZhcmlhbnRQcm9wZXJ0aWVzLFxuICBjdXJyZW50UHJvcHM6IFZhbGlkVmFyaWFudFByb3BlcnRpZXNcbik6IFRbXSB7XG4gIGNvbnN0IG5ld0VudHJpZXMgPSBPYmplY3QuZW50cmllcyhuZXdQcm9wcyk7XG4gIGNvbnN0IGN1cnJlbnRFbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoY3VycmVudFByb3BzKTtcbiAgY29uc3Qgc2FtZSA9IChhOiBzdHJpbmcsIGI6IHN0cmluZyk6IGJvb2xlYW4gPT5cbiAgICBhLmxvY2FsZUNvbXBhcmUoYiwgdW5kZWZpbmVkLCB7IHNlbnNpdGl2aXR5OiAnYWNjZW50JyB9KSA9PT0gMDtcbiAgcmV0dXJuIHZhcmlhbnRzV2l0aFByb3BzXG4gICAgLmZpbHRlcigoeyBwcm9wcyB9KSA9PiBuZXdFbnRyaWVzLmV2ZXJ5KChbaywgdl0pID0+IHNhbWUodiwgcHJvcHNba10pKSlcbiAgICAubWFwKCh7IG5vZGUsIHByb3BzIH0pID0+ICh7XG4gICAgICBzY29yZTogY3VycmVudEVudHJpZXMuZmlsdGVyKChbaywgdl0pID0+IHNhbWUodiwgcHJvcHNba10pKS5sZW5ndGgsXG4gICAgICBub2RlLFxuICAgIH0pKVxuICAgIC5zb3J0KChhLCBiKSA9PiBiLnNjb3JlIC0gYS5zY29yZSlcbiAgICAubWFwKCh2KSA9PiB2Lm5vZGUpO1xufVxuXG4vLyBSZXR1cm4gbWF4IGZpeGVkIHNpemUgaW4gdGhlIGZvcm1hdCBcIjE0MHB4XCIgaWYgdGhlcmUgaXMgYSBjbGFtcCBpbiB3aWR0aCBmb3IgdGhpcyBlbGVtZW50XG4vLyBPdGhlcndpc2UgcmV0dXJuIHVuZGVmaW5lZC5cbmV4cG9ydCBmdW5jdGlvbiBtYXhGaXhlZFdpZHRoT2ZFbGVtZW50KFxuICBlbDogSHRtbEVsZW1lbnQgfCB1bmRlZmluZWQsXG4gIHBhcmVudGVsOiBIdG1sRWxlbWVudCB8IHVuZGVmaW5lZFxuKTogbnVtYmVyIHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgdyA9IGVsPy5zdHlsZXM/LndpZHRoO1xuICBjb25zdCBtYXh3ID0gZWw/LnN0eWxlcz8uWydtYXgtd2lkdGgnXTtcbiAgY29uc3QgcF93ID0gcGFyZW50ZWw/LnN0eWxlcz8ud2lkdGg7XG4gIGNvbnN0IHBfbWF4dyA9IHBhcmVudGVsPy5zdHlsZXM/LlsnbWF4LXdpZHRoJ107XG5cbiAgLy8gQ2hlY2sgZXZlcnkgdmFsdWUgaW4gb3JkZXJcbiAgLy8gTm90ZTogVGhpcyB3b3JrcyBiZWNhdXNlIHdpZHRoIGFuZCBtYXhXaWR0aCB3aWxsIGFsd2F5cyBoYXZlXG4gIC8vIGAuLi5weGAgb3IgYC4uLiVgIGFzIHZhbHVlcy5cbiAgY29uc3QgdmFsdWVzID0gW3csIG1heHcsIHBfdywgcF9tYXh3XTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB2ID0gdmFsdWVzW2ldO1xuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgIGlmICh2LmVuZHNXaXRoKCclJykpIGNvbnRpbnVlO1xuICAgIGlmICh2LmVuZHNXaXRoKCdweCcpKSByZXR1cm4gcGFyc2VJbnQodiwgMTApO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLypcbiAqIFJldHVybiBtYXggZml4ZWQgc2l6ZSBpbiB0aGUgZm9ybWF0IFwiMTQwcHhcIiBpZiB0aGVyZSBpcyBhIGNsYW1wIGluIHdpZHRoIGZvciB0aGlzIGVsZW1lbnRcbiAqIE90aGVyd2lzZSByZXR1cm4gdW5kZWZpbmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWF4Rml4ZWRIZWlnaHRPZkVsZW1lbnQoXG4gIGVsOiBIdG1sRWxlbWVudCB8IHVuZGVmaW5lZCxcbiAgcGFyZW50ZWw6IEh0bWxFbGVtZW50IHwgdW5kZWZpbmVkXG4pOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICBjb25zdCBoID0gZWw/LnN0eWxlcz8uaGVpZ2h0O1xuICBjb25zdCBtYXhoID0gZWw/LnN0eWxlcz8uWydtYXgtaGVpZ2h0J107XG4gIGNvbnN0IHBfaCA9IHBhcmVudGVsPy5zdHlsZXM/LmhlaWdodDtcbiAgY29uc3QgcF9tYXhoID0gcGFyZW50ZWw/LnN0eWxlcz8uWydtYXgtaGVpZ2h0J107XG5cbiAgLy8gQ2hlY2sgZXZlcnkgdmFsdWUgaW4gb3JkZXJcbiAgLy8gTm90ZTogVGhpcyB3b3JrcyBiZWNhdXNlIGhlaWdodCBhbmQgbWF4aGVpZ2h0IHdpbGwgYWx3YXlzIGhhdmVcbiAgLy8gYC4uLnB4YCBvciBgLi4uJWAgYXMgdmFsdWVzLlxuICBjb25zdCB2YWx1ZXMgPSBbaCwgbWF4aCwgcF9oLCBwX21heGhdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHYgPSB2YWx1ZXNbaV07XG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkgY29udGludWU7XG4gICAgaWYgKHYuZW5kc1dpdGgoJyUnKSkgY29udGludWU7XG4gICAgaWYgKHYuZW5kc1dpdGgoJ3B4JykpIHJldHVybiBwYXJzZUludCh2LCAxMCk7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIiwgImV4cG9ydCBjb25zdCByZWFjdGlvbl90eXBlcyA9IFtcbiAgJ2FwcGVhcicsXG4gICdtb3VzZWRvd24nLFxuICAnbW91c2VlbnRlcicsXG4gICdtb3VzZWxlYXZlJyxcbiAgJ21vdXNldXAnLFxuICAndGltZW91dCcsXG4gICdjbGljaycsXG4gICdwcmVzcycsXG4gICdkcmFnJyxcbiAgJ2tleWRvd24nLFxuICAnaG92ZXInLFxuXSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgVHJpZ2dlclR5cGUgPSAodHlwZW9mIHJlYWN0aW9uX3R5cGVzKVtudW1iZXJdO1xuIiwgImV4cG9ydCBmdW5jdGlvbiBvbmNlPFQgZXh0ZW5kcyAoLi4uYXJnczogYW55W10pID0+IHZvaWQ+KFxuICBydW46IFQgfCBudWxsIHwgdW5kZWZpbmVkIHwgdm9pZFxuKTogVCB8IHVuZGVmaW5lZCB7XG4gIGlmICghcnVuKSByZXR1cm47XG4gIHJldHVybiAoKC4uLmFyZ3MpID0+IHtcbiAgICBpZiAoIXJ1bikgcmV0dXJuO1xuICAgIGNvbnN0IHRvUnVuID0gcnVuO1xuICAgIHJ1biA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gdG9SdW4oLi4uYXJncyk7XG4gIH0pIGFzIFQ7XG59XG4iLCAiZXhwb3J0IHR5cGUgQ2xlYW51cEZuID0gKCkgPT4gdm9pZDtcbmV4cG9ydCB0eXBlIEJvdW5kRWxlbWVudCA9IFNWR0VsZW1lbnQgfCBIVE1MRWxlbWVudDtcbmNvbnN0IGlzQm91bmRFbGVtZW50ID0gKGU6IGFueSk6IGUgaXMgQm91bmRFbGVtZW50ID0+XG4gIGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fCBlIGluc3RhbmNlb2YgU1ZHRWxlbWVudDtcblxuZnVuY3Rpb24gb25EaXNjb25uZWN0ZWQoZTogQm91bmRFbGVtZW50LCBjYjogQ2xlYW51cEZuIHwgdm9pZCk6IHZvaWQge1xuICBpZiAoIWUucGFyZW50RWxlbWVudCkgcmV0dXJuOyAvLyBhbHJlYWR5IHJlbW92ZWRcbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMuZmlsdGVyKChtKSA9PiBtLnR5cGUgPT09ICdjaGlsZExpc3QnKSlcbiAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBtdXRhdGlvbi5yZW1vdmVkTm9kZXMpXG4gICAgICAgIGlmIChub2RlID09PSBlKSB7XG4gICAgICAgICAgY2I/LigpO1xuICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfVxuICB9KTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShlLnBhcmVudEVsZW1lbnQsIHsgY2hpbGRMaXN0OiB0cnVlIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25Db25uZWN0ZWQoXG4gIHNlbGVjdG9yOiBzdHJpbmcsXG4gIGNiOiAoZTogQm91bmRFbGVtZW50KSA9PiBDbGVhbnVwRm4gfCB2b2lkXG4pOiAoKSA9PiB2b2lkIHtcbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbnMuZmlsdGVyKChtKSA9PiBtLnR5cGUgPT09ICdjaGlsZExpc3QnKSlcbiAgICAgIGZvciAoY29uc3QgbiBvZiBtdXRhdGlvbi5hZGRlZE5vZGVzKVxuICAgICAgICBpZiAoaXNCb3VuZEVsZW1lbnQobikgJiYgbi5tYXRjaGVzKHNlbGVjdG9yKSkgb25EaXNjb25uZWN0ZWQobiwgY2IobikpO1xuICB9KTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwgeyBjaGlsZExpc3Q6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XG4gIHJldHVybiAoKSA9PiBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBGcmFtZUxpa2VOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHR5cGUge1xuICBSZXN0QmFzZU5vZGUsXG4gIFJlc3RTY2VuZU5vZGUsXG4gIFJlc3RUZXh0Tm9kZSxcbn0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXV0aWxzL3NyYy9maWdtYS5yZXN0LnR5cGluZ3MnO1xuaW1wb3J0IHsgYXNzZXJ0VGhhdCB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9hc3NlcnQnO1xuaW1wb3J0IHsgbm9uZU9yTnVsbCB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS11dGlscy91dGlscyc7XG5pbXBvcnQge1xuICBnZXRDaGlsZHJlbixcbiAgaXNGcmFtZUxpa2UsXG59IGZyb20gJ0BkaXZyaW90cy9zdG9yeS10by1maWdtYS9oZWxwZXJzL25vZGVzJztcbmltcG9ydCB7XG4gIGxheW91dFNpemluZ0NvdW50ZXIsXG4gIGxheW91dFNpemluZ0hvcml6b250YWwsXG4gIGxheW91dFNpemluZ1ByaW1hcnksXG4gIGxheW91dFNpemluZ1ZlcnRpY2FsLFxufSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdXRpbHMvc3JjL2xheW91dFNpemluZyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRNb3ZlTmVnYXRpdmVHYXBUb0NoaWxkTWFyZ2luKFxuICBub2RlOiBGcmFtZUxpa2VOb2RlXG4pOiBib29sZWFuIHtcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgYXNzZXJ0VGhhdCgoKSA9PiAhbm9uZU9yTnVsbChub2RlLmxheW91dE1vZGUpLCAnb25seSBmb3IgYXV0b2xheW91dCBub2RlcycpO1xuICB9XG4gIHJldHVybiAoXG4gICAgbm9kZS5wcmltYXJ5QXhpc0FsaWduSXRlbXMgIT09ICdTUEFDRV9CRVRXRUVOJyAmJlxuICAgICEhbm9kZS5pdGVtU3BhY2luZyAmJlxuICAgIG5vZGUuaXRlbVNwYWNpbmcgPCAwXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG91bGRVc2VBYnNvbHV0ZVBvc2l0aW9uRm9yQXV0b0xheW91dChcbiAgbm9kZTogU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZVxuKTogYm9vbGVhbiB7XG4gIC8vIG1hcCBzcGFjZS1iZXR3ZWVuIHdpdGggbGVzcyB0aGFuIDIgY2hpbGRyZW4gaW50byBhYnNvbHV0ZSBwb3NpdGlvbmluZ1xuICBpZiAoXG4gICAgIW5vbmVPck51bGwoKG5vZGUgYXMgQXV0b0xheW91dE1peGluKS5sYXlvdXRNb2RlKSAmJlxuICAgIChub2RlIGFzIEF1dG9MYXlvdXRNaXhpbikucHJpbWFyeUF4aXNBbGlnbkl0ZW1zID09PSAnU1BBQ0VfQkVUV0VFTicgJiZcbiAgICAobm9kZSBhcyBBdXRvTGF5b3V0TWl4aW4pLmxheW91dFdyYXAgIT09ICdXUkFQJyAmJlxuICAgIGxheW91dFNpemluZ0hvcml6b250YWwobm9kZSBhcyBTY2VuZU5vZGUpID09PSAnRklYRUQnICYmXG4gICAgbGF5b3V0U2l6aW5nVmVydGljYWwobm9kZSBhcyBTY2VuZU5vZGUpID09PSAnRklYRUQnXG4gICkge1xuICAgIGNvbnN0IGF1dG9sYXlvdXRDaGlsZHJlbiA9IGdldEF1dG9MYXlvdXRWaXNpYmxlQ2hpbGRyZW4obm9kZSk7XG4gICAgcmV0dXJuIChcbiAgICAgIC8vIFNob3VsZCB3b3JrIGZvciAxIGNoaWxkIGFzIHdlbGwsIGJ1dCBub3Qgc3VyZSBpdCBoYXMgYW55IGJlbmVmaXQgb3ZlciBmbGV4XG4gICAgICAvLyBDb3VsZCBiZSB1c2VmdWwgaWYgdGhlcmUncyBhbiBhbmltYXRpb24gc3dhcHBpbmcgYmV0d2VlbiAxIGFuZCAyIGNoaWxkcmVuXG4gICAgICBhdXRvbGF5b3V0Q2hpbGRyZW4ubGVuZ3RoID09PSAyICYmXG4gICAgICAvLyBJZiBhIGNoaWxkIGlzIEZJTEwsIGZsZXggd2lsbCB3b3JrIGp1c3QgZmluZSAobm8gbmVnYXRpdmUgcGFkZGluZywgdW5sZXNzIHNvbWUgbWluLXNpemUgaXMgaW52b2x2ZWQpXG4gICAgICAvLyBBbmQgYW55d2F5IDEwMCUgc2l6ZSB3aWxsIE5PVCB3b3JrIGluIHRoaXMgY2FzZSB3aXRoIGFic29sdXRlIHBvc2l0aW9uaW5nXG4gICAgICAhYXV0b2xheW91dENoaWxkcmVuLnNvbWUoXG4gICAgICAgIChpdCkgPT5cbiAgICAgICAgICBsYXlvdXRTaXppbmdQcmltYXJ5KG5vZGUgYXMgU2NlbmVOb2RlLCBpdCBhcyBTY2VuZU5vZGUpID09PSAnRklMTCcgfHxcbiAgICAgICAgICAvLyBUT0RPOiBUaGlzIG9uZSB3ZSBjb3VsZCBzdXBwb3J0LCBidXQgd2UnZCBoYXZlIHRvIHJlbW92ZSBwYWRkaW5ncyBmcm9tICUgY2hpbGQgZGltZW5zaW9uc1xuICAgICAgICAgIGxheW91dFNpemluZ0NvdW50ZXIobm9kZSBhcyBTY2VuZU5vZGUsIGl0IGFzIFNjZW5lTm9kZSkgPT09ICdGSUxMJ1xuICAgICAgKVxuICAgICk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNUZXh0Tm9kZShcbiAgbm9kZTogQmFzZU5vZGUgfCBSZXN0QmFzZU5vZGVcbik6IFRleHROb2RlIHwgUmVzdFRleHROb2RlIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ1RFWFQnXG4gICAgPyBub2RlXG4gICAgOiBpc0ZyYW1lTGlrZShub2RlKVxuICAgID8gKG5vZGUuY2hpbGRyZW5bMF0gYXMgVGV4dE5vZGUpXG4gICAgOiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBjb25zdCBjdXN0b21WaWRlb0VsZW1lbnRzID0gbmV3IFNldChbXG4gICd5b3V0dWJlLXZpZGVvJyxcbiAgJ3ZpbWVvLXZpZGVvJyxcbiAgJ3Nwb3RpZnktYXVkaW8nLFxuICAnandwbGF5ZXItdmlkZW8nLFxuICAndmlkZW9qcy12aWRlbycsXG4gICd3aXN0aWEtdmlkZW8nLFxuICAnY2xvdWRmbGFyZS12aWRlbycsXG4gICdobHMtdmlkZW8nLFxuICAnc2hha2EtdmlkZW8nLFxuICAnZGFzaC12aWRlbycsXG5dKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF1dG9MYXlvdXRWaXNpYmxlQ2hpbGRyZW4oXG4gIG5vZGU6IFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGVcbik6ICgoU2NlbmVOb2RlIHwgUmVzdFNjZW5lTm9kZSkgJiBBdXRvTGF5b3V0Q2hpbGRyZW5NaXhpbilbXSB7XG4gIGdldENoaWxkcmVuKG5vZGUpO1xuICBpZiAoKG5vZGUgYXMgQXV0b0xheW91dE1peGluKS5sYXlvdXRNb2RlICE9PSAnTk9ORScpIHtcbiAgICByZXR1cm4gZ2V0Q2hpbGRyZW4obm9kZSkuZmlsdGVyKFxuICAgICAgKGNoaWxkKSA9PlxuICAgICAgICAoY2hpbGQgYXMgQXV0b0xheW91dENoaWxkcmVuTWl4aW4pLmxheW91dFBvc2l0aW9uaW5nICE9PSAnQUJTT0xVVEUnICYmXG4gICAgICAgIGNoaWxkLnZpc2libGUgIT09IGZhbHNlXG4gICAgKSBhcyAoKFNjZW5lTm9kZSB8IFJlc3RTY2VuZU5vZGUpICYgQXV0b0xheW91dENoaWxkcmVuTWl4aW4pW107XG4gIH1cbiAgcmV0dXJuIFtdO1xufVxuIiwgImltcG9ydCB7IGN1c3RvbVZpZGVvRWxlbWVudHMgfSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdG8taHRtbC9zcmMvbWFwcGluZy91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZpZGVvRWxlbWVudChlbHQ6IEhUTUxFbGVtZW50KTogZWx0IGlzIEhUTUxWaWRlb0VsZW1lbnQge1xuICByZXR1cm4gKFxuICAgIGN1c3RvbVZpZGVvRWxlbWVudHMuaGFzKGVsdC50YWdOYW1lLnRvTG93ZXJDYXNlKCkpIHx8XG4gICAgZWx0LnRhZ05hbWUgPT09ICdWSURFTydcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzWW91dHViZUlmcmFtZShlbHQ6IEhUTUxFbGVtZW50KTogZWx0IGlzIEhUTUxJRnJhbWVFbGVtZW50IHtcbiAgaWYgKGVsdC50YWdOYW1lICE9PSAnSUZSQU1FJykgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBzcmMgPSAoZWx0IGFzIEhUTUxJRnJhbWVFbGVtZW50KS5zcmM7XG4gIHJldHVybiAoXG4gICAgKHNyYy5pbmNsdWRlcygneW91dHViZS5jb20nKSB8fCBzcmMuaW5jbHVkZXMoJ3lvdXR1YmUtbm9jb29raWUuY29tJykpICYmXG4gICAgc3JjLmluY2x1ZGVzKCdlbmFibGVqc2FwaT0xJylcbiAgKTtcbn1cblxuY2xhc3MgWW91dHViZUNvbnRyb2xsZXIge1xuICBwcml2YXRlIGluZm86IGFueSA9IHt9O1xuICBwcml2YXRlIGxvYWRlZDogUHJvbWlzZTxib29sZWFuPjtcbiAgcHJpdmF0ZSBtZXNzYWdlTGlzdGVuZXI6ICgoZXZlbnQ6IE1lc3NhZ2VFdmVudCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgdGhpcy5sb2FkZWQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgY29uc3QgbG9hZExpc3RlbmVyID0gKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLmlmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZExpc3RlbmVyKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlcXVlc3RZb3V0dWJlTGlzdGVuaW5nKCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgdGhpcy5pZnJhbWUuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGxvYWRMaXN0ZW5lcik7XG5cbiAgICAgIHRoaXMubWVzc2FnZUxpc3RlbmVyID0gKGV2ZW50OiBNZXNzYWdlRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gdGhpcy5pZnJhbWUuY29udGVudFdpbmRvdyAmJiBldmVudC5kYXRhKSB7XG4gICAgICAgICAgbGV0IGV2ZW50RGF0YTogYW55O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGV2ZW50RGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignWW91dHViZUNvbnRyb2xsZXIgbWVzc2FnZUxpc3RlbmVyJywgZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGV2ZW50RGF0YS5ldmVudCA9PT0gJ29uUmVhZHknKSB7XG4gICAgICAgICAgICB0aGlzLmlmcmFtZS5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgbG9hZExpc3RlbmVyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZXZlbnREYXRhLmluZm8pIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5pbmZvLCBldmVudERhdGEuaW5mbyk7XG4gICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCB0aGlzLm1lc3NhZ2VMaXN0ZW5lcik7XG4gICAgICB0aGlzLnJlcXVlc3RZb3V0dWJlTGlzdGVuaW5nKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNlbmRZb3V0dWJlTWVzc2FnZShcbiAgICBmdW5jOlxuICAgICAgfCAnbXV0ZSdcbiAgICAgIHwgJ3VuTXV0ZSdcbiAgICAgIHwgJ3BsYXlWaWRlbydcbiAgICAgIHwgJ3BhdXNlVmlkZW8nXG4gICAgICB8ICdzdG9wVmlkZW8nXG4gICAgICB8ICdzZWVrVG8nLFxuICAgIGFyZ3M6IGFueVtdID0gW11cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkZWQ7XG4gICAgdGhpcy5pZnJhbWUuY29udGVudFdpbmRvdz8ucG9zdE1lc3NhZ2UoXG4gICAgICBKU09OLnN0cmluZ2lmeSh7IGV2ZW50OiAnY29tbWFuZCcsIGZ1bmMsIGFyZ3MgfSksXG4gICAgICAnKidcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSByZXF1ZXN0WW91dHViZUxpc3RlbmluZygpOiB2b2lkIHtcbiAgICB0aGlzLmlmcmFtZS5jb250ZW50V2luZG93Py5wb3N0TWVzc2FnZShcbiAgICAgIEpTT04uc3RyaW5naWZ5KHsgZXZlbnQ6ICdsaXN0ZW5pbmcnIH0pLFxuICAgICAgJyonXG4gICAgKTtcbiAgfVxuXG4gIGdldCBtdXRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbmZvLm11dGVkO1xuICB9XG5cbiAgZ2V0IHZvbHVtZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmluZm8udm9sdW1lO1xuICB9XG5cbiAgc2V0IG11dGVkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHZhbHVlKSB0aGlzLnNlbmRZb3V0dWJlTWVzc2FnZSgnbXV0ZScpO1xuICAgIGVsc2UgdGhpcy5zZW5kWW91dHViZU1lc3NhZ2UoJ3VuTXV0ZScpO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRUaW1lKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaW5mby5jdXJyZW50VGltZTtcbiAgfVxuXG4gIHNldCBjdXJyZW50VGltZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5zZW5kWW91dHViZU1lc3NhZ2UoJ3NlZWtUbycsIFt2YWx1ZSwgdHJ1ZV0pO1xuICB9XG5cbiAgZ2V0IHBhdXNlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbmZvLnBsYXllclN0YXRlID09PSAyO1xuICB9XG5cbiAgcGxheSgpOiB2b2lkIHtcbiAgICB0aGlzLnNlbmRZb3V0dWJlTWVzc2FnZSgncGxheVZpZGVvJyk7XG4gIH1cblxuICBwYXVzZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNlbmRZb3V0dWJlTWVzc2FnZSgncGF1c2VWaWRlbycpO1xuICB9XG5cbiAgc3RhdGljIGZyb20oZWx0OiBIVE1MSUZyYW1lRWxlbWVudCk6IFlvdXR1YmVDb250cm9sbGVyIHtcbiAgICByZXR1cm4gKChlbHQgYXMgYW55KS5mMndfeXRfY29udHJvbGxlciB8fD0gbmV3IFlvdXR1YmVDb250cm9sbGVyKGVsdCkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldENvbnRyb2xsZXIoXG4gIGVsdDogSFRNTEVsZW1lbnRcbik6IEhUTUxWaWRlb0VsZW1lbnQgfCBZb3V0dWJlQ29udHJvbGxlciB8IHVuZGVmaW5lZCB7XG4gIGlmIChpc1ZpZGVvRWxlbWVudChlbHQpKSByZXR1cm4gZWx0O1xuICBpZiAoaXNZb3V0dWJlSWZyYW1lKGVsdCkpIHJldHVybiBZb3V0dWJlQ29udHJvbGxlci5mcm9tKGVsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVNdXRlKGVsdDogSFRNTEVsZW1lbnQpOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBnZXRDb250cm9sbGVyKGVsdCk7XG4gIGlmIChjb250cm9sbGVyKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIubXV0ZWQgPSAhY29udHJvbGxlci5tdXRlZDtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNvbnRyb2xsZXIubXV0ZWQgPSAhY29udHJvbGxlci5tdXRlZDtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG11dGUoZWx0OiBIVE1MRWxlbWVudCk6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5tdXRlZCA9IHRydWU7XG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjb250cm9sbGVyLm11dGVkID0gZmFsc2U7XG4gICAgICB9O1xuICAgIH07XG4gIH1cbiAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignVmlkZW8gZWxlbWVudCBub3QgcmVjb2duaXplZCcsIGVsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bk11dGUoZWx0OiBIVE1MRWxlbWVudCk6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5tdXRlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgY29udHJvbGxlci5tdXRlZCA9IHRydWU7XG4gICAgICB9O1xuICAgIH07XG4gIH1cbiAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignVmlkZW8gZWxlbWVudCBub3QgcmVjb2duaXplZCcsIGVsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwbGF5KGVsdDogSFRNTEVsZW1lbnQpOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBnZXRDb250cm9sbGVyKGVsdCk7XG4gIGlmIChjb250cm9sbGVyKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIucGxheSgpO1xuICAgICAgcmV0dXJuICgpID0+IGNvbnRyb2xsZXIucGF1c2UoKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF1c2UoZWx0OiBIVE1MRWxlbWVudCk6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5wYXVzZSgpO1xuICAgICAgcmV0dXJuICgpID0+IGNvbnRyb2xsZXIucGxheSgpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignVmlkZW8gZWxlbWVudCBub3QgcmVjb2duaXplZCcsIGVsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b2dnbGVQbGF5KGVsdDogSFRNTEVsZW1lbnQpOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBnZXRDb250cm9sbGVyKGVsdCk7XG4gIGlmIChjb250cm9sbGVyKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChjb250cm9sbGVyLnBhdXNlZCkgY29udHJvbGxlci5wbGF5KCk7XG4gICAgICBlbHNlIGNvbnRyb2xsZXIucGF1c2UoKTtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChjb250cm9sbGVyLnBhdXNlZCkgY29udHJvbGxlci5wbGF5KCk7XG4gICAgICAgIGVsc2UgY29udHJvbGxlci5wYXVzZSgpO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG4gIHJldHVybiAoKSA9PiBjb25zb2xlLndhcm4oJ1ZpZGVvIGVsZW1lbnQgbm90IHJlY29nbml6ZWQnLCBlbHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2Vla1RvKFxuICBlbHQ6IEhUTUxFbGVtZW50LFxuICB0aW1lOiBudW1iZXJcbik6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgY29udHJvbGxlciA9IGdldENvbnRyb2xsZXIoZWx0KTtcbiAgaWYgKGNvbnRyb2xsZXIpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29udHJvbGxlci5jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgICAvLyBubyByZXZlcnQgP1xuICAgIH07XG4gIH1cbiAgcmV0dXJuICgpID0+IGNvbnNvbGUud2FybignVmlkZW8gZWxlbWVudCBub3QgcmVjb2duaXplZCcsIGVsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWVrRm9yd2FyZChcbiAgZWx0OiBIVE1MRWxlbWVudCxcbiAgc2Vjb25kczogbnVtYmVyXG4pOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBnZXRDb250cm9sbGVyKGVsdCk7XG4gIGlmIChjb250cm9sbGVyKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIuY3VycmVudFRpbWUgKz0gc2Vjb25kcztcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNvbnRyb2xsZXIuY3VycmVudFRpbWUgLT0gc2Vjb25kcztcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlZWtCYWNrd2FyZChcbiAgZWx0OiBIVE1MRWxlbWVudCxcbiAgc2Vjb25kczogbnVtYmVyXG4pOiBSZXZlcnRhYmxlRXZlbnRDYWxsYmFjayB7XG4gIGNvbnN0IGNvbnRyb2xsZXIgPSBnZXRDb250cm9sbGVyKGVsdCk7XG4gIGlmIChjb250cm9sbGVyKSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnRyb2xsZXIuY3VycmVudFRpbWUgLT0gc2Vjb25kcztcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNvbnRyb2xsZXIuY3VycmVudFRpbWUgKz0gc2Vjb25kcztcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdWaWRlbyBlbGVtZW50IG5vdCByZWNvZ25pemVkJywgZWx0KTtcbn1cbiIsICJleHBvcnQgZnVuY3Rpb24gaXNTYWZhcmkoKTogYm9vbGVhbiB7XG4gIGNvbnN0IHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgcmV0dXJuIHVhLmluY2x1ZGVzKCdTYWZhcmknKSAmJiAhdWEuaW5jbHVkZXMoJ0Nocm9tZScpO1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBpc0Fic29sdXRlT3JGaXhlZChwb3NpdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gIHJldHVybiBwb3NpdGlvbiA9PT0gJ2Fic29sdXRlJyB8fCBwb3NpdGlvbiA9PT0gJ2ZpeGVkJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmxleChkaXNwbGF5Pzogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAhIWRpc3BsYXk/LmVuZHNXaXRoKCdmbGV4Jyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZsZXhPckdyaWQoZGlzcGxheT86IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNGbGV4KGRpc3BsYXkpIHx8IGlzR3JpZChkaXNwbGF5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzR3JpZChkaXNwbGF5Pzogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAhIWRpc3BsYXk/LmVuZHNXaXRoKCdncmlkJyk7XG59XG4iLCAiaW1wb3J0IHsgdG9QeCB9IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL3NyYy9oZWxwZXJzJztcbmltcG9ydCB0eXBlIHsgQW5pbWF0ZWRQcm9wIH0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXRvLWh0bWwvc3JjL3R5cGVzJztcbmltcG9ydCB7IGlzU2FmYXJpIH0gZnJvbSAnQGRpdnJpb3RzL3V0aWxzL25hdmlnYXRvcic7XG5pbXBvcnQgeyBpc0Fic29sdXRlT3JGaXhlZCB9IGZyb20gJ0BkaXZyaW90cy91dGlscy9zdHlsZXMnO1xuaW1wb3J0IHR5cGUgeyBCb3VuZEVsZW1lbnQgfSBmcm9tICcuLi9saWZlY3ljbGUnO1xuXG5jb25zdCBzYWZhcmkgPSBpc1NhZmFyaSgpO1xuXG50eXBlIFRvQW5pbWF0ZSA9IFJlY29yZDxzdHJpbmcsIFtBbmltYXRlZFByb3BbJ2Zyb20nXSwgQW5pbWF0ZWRQcm9wWyd0byddXT47XG5cbmZ1bmN0aW9uIHNldFByb3BlcnRpZXNXaXRoQW5pbWF0ZShcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIHByb3BzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICBwc2V1ZG8/OiBzdHJpbmdcbik6IHZvaWQge1xuICBlbHQuYW5pbWF0ZShcbiAgICB7XG4gICAgICAuLi5wcm9wcyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHBzZXVkb0VsZW1lbnQ6IHBzZXVkbyxcbiAgICAgIGl0ZXJhdGlvbnM6IDEsXG4gICAgICBkdXJhdGlvbjogMCxcbiAgICAgIGZpbGw6ICdmb3J3YXJkcycsXG4gICAgfVxuICApO1xufVxuXG5mdW5jdGlvbiB0b09iaihwOiAoQW5pbWF0ZWRQcm9wICYgeyBjYW1lbEtleTogc3RyaW5nIH0pW10pOiBUb0FuaW1hdGUge1xuICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKHAubWFwKChpdCkgPT4gW2l0LmNhbWVsS2V5LCBbaXQuZnJvbSwgaXQudG9dXSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYW5pbWF0ZVByb3BzKFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgcHJvcHM6IEFuaW1hdGVkUHJvcFtdLFxuICBlYXNpbmc6IHN0cmluZyxcbiAgZHVyYXRpb246IG51bWJlcixcbiAgY29udGFpbmVyc1RvUmVPcmRlcjogU2V0PEhUTUxFbGVtZW50PlxuKTogdm9pZCB7XG4gIGNvbnN0IHBhcmVudCA9IGVsdC5wYXJlbnRFbGVtZW50ITtcbiAgY29uc3QgY29tcHV0ZWRTdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGVsdCk7XG4gIGNvbnN0IHBhcmVudFN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUocGFyZW50KTtcbiAgY29uc3QgcGFyZW50RGlzcGxheSA9IHBhcmVudFN0eWxlcy5kaXNwbGF5O1xuICBjb25zdCBpc0ZsZXhPckdyaWQgPVxuICAgIHBhcmVudERpc3BsYXkuZW5kc1dpdGgoJ2ZsZXgnKSB8fCBwYXJlbnREaXNwbGF5LmVuZHNXaXRoKCdncmlkJyk7XG4gIGNvbnN0IGlzQWJzb2x1dGUgPSBpc0Fic29sdXRlT3JGaXhlZChjb21wdXRlZFN0eWxlcy5wb3NpdGlvbik7XG4gIGNvbnN0IGN1cnJlbnRQcm9wcyA9IHByb3BzLm1hcCgoaXQpID0+ICh7XG4gICAgLi4uaXQsXG4gICAgY2FtZWxLZXk6IGl0LmtleS5zdGFydHNXaXRoKCctLScpXG4gICAgICA/IGl0LmtleVxuICAgICAgOiBpdC5rZXkucmVwbGFjZSgvLShbYS16XSkvZywgKF8sIGwpID0+IGwudG9VcHBlckNhc2UoKSksXG4gIH0pKTtcblxuICBjb25zdCBhdHRyUHJvcHM6IFJlY29yZDxzdHJpbmcsIEFuaW1hdGVkUHJvcFsndG8nXT4gPSB7fTtcbiAgY29uc3QgblByb3BzID0gY3VycmVudFByb3BzLmZpbHRlcigoaXQpID0+IHtcbiAgICBpZiAoaXQucHNldWRvKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGl0LmtleS5zdGFydHNXaXRoKCctLWYydy1hdHRyLScpKSB7XG4gICAgICBhdHRyUHJvcHNbaXQua2V5LnNsaWNlKDExKV0gPSBpdC50bztcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xuICBjb25zdCBuUHJvcHNPYmogPSB0b09iaihuUHJvcHMpO1xuICBjb25zdCBiUHJvcHNPYmogPSB0b09iaihcbiAgICBjdXJyZW50UHJvcHMuZmlsdGVyKChpdCkgPT4gaXQucHNldWRvID09PSAnOjpiZWZvcmUnKVxuICApO1xuICBjb25zdCBhUHJvcHNPYmogPSB0b09iaihjdXJyZW50UHJvcHMuZmlsdGVyKChpdCkgPT4gaXQucHNldWRvID09PSAnOjphZnRlcicpKTtcbiAgbGV0IGRpc3BsYXlBZnRlckFuaW1hdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBpZiAoblByb3BzT2JqLmRpc3BsYXkpIHtcbiAgICAvLyBldmVuIG9uIGNocm9tZSB3aGVyZSBkaXNwbGF5IGlzIGFuaW1hdGFibGUsIHRoZSBlbGVtZW50IHdvbid0XG4gICAgLy8gIHJlY2VpdmUgbW91c2UgZXZlbnRzIGlmIHdlIGRvbid0IHNldCBpdCBleHBsaWNpdGVseVxuICAgIGlmIChuUHJvcHNPYmouZGlzcGxheVswXSA9PT0gJ25vbmUnKSB7XG4gICAgICAvLyBzaG93IGl0IGltbWVkaWF0bHksIG9wYWNpdHkgYW5pbWF0aW9uIHdpbGwgaGFuZGxlIHRoZSByZXN0XG4gICAgICBlbHQuc3R5bGUuZGlzcGxheSA9IFN0cmluZyhuUHJvcHNPYmouZGlzcGxheVsxXSk7XG4gICAgfSBlbHNlIGlmIChuUHJvcHNPYmouZGlzcGxheVsxXSA9PT0gJ25vbmUnKSB7XG4gICAgICBpZiAoaXNGbGV4T3JHcmlkICYmICFpc0Fic29sdXRlKSB7XG4gICAgICAgIC8vIHByb2JhYmx5IGEgc3dhcCwgaGlkZSBpdCBpbW1lZGlhdGx5IHRvIG5vdCBoYXZlIGJvdGggZWxlbWVudHMgKGJlZm9yZSZhZnRlcikgdmlzaWJsZSBkdXJpbmcgdGhlIHRyYW5zaXRpb25cbiAgICAgICAgZWx0LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIGZvciBjb25jdXJyZW50L3BhcmFsbGVsIGFuaW1hdGlvbnMsIGVuc3VyZSB0aGUgZmluYWwgc3RhdGUgaXMgY29ycmVjdCBhcyB3ZWxsXG4gICAgZGlzcGxheUFmdGVyQW5pbWF0aW9uID0gU3RyaW5nKG5Qcm9wc09iai5kaXNwbGF5WzFdKTtcbiAgICBkZWxldGUgblByb3BzT2JqLmRpc3BsYXk7XG4gIH1cbiAgaWYgKHNhZmFyaSkge1xuICAgIHNldFN0eWxlKGVsdCwgblByb3BzT2JqLCAnb3ZlcmZsb3cnKTtcbiAgICBzZXRTdHlsZShlbHQsIG5Qcm9wc09iaiwgJ3Jvd0dhcCcsICdncmlkUm93R2FwJyk7XG4gIH1cbiAgbGV0IGYyd09yZGVyID0gK2dldENvbXB1dGVkU3R5bGUoZWx0KS5nZXRQcm9wZXJ0eVZhbHVlKCctLWYydy1vcmRlcicpO1xuICBpZiAoblByb3BzT2JqWyctLWYydy1vcmRlciddKSB7XG4gICAgY29uc3QgdG8gPSBuUHJvcHNPYmpbJy0tZjJ3LW9yZGVyJ11bMV07XG4gICAgZjJ3T3JkZXIgPSB0byA9PT0gdW5kZWZpbmVkID8gTmFOIDogK3RvO1xuICAgIC8vIHJlLXBvc2l0aW9uIHRoZSBjaGlsZCBhdCB0aGUgcmlnaHQgcGxhY2UgaW4gdGhlIHBhcmVudFxuICAgIGlmICghaXNOYU4oZjJ3T3JkZXIpKSB7XG4gICAgICBlbHQuc3R5bGUuc2V0UHJvcGVydHkoJy0tZjJ3LW9yZGVyJywgU3RyaW5nKGYyd09yZGVyKSk7XG4gICAgfVxuICAgIGRlbGV0ZSBuUHJvcHNPYmpbJy0tZjJ3LW9yZGVyJ107XG4gIH1cbiAgLy8gcmUtcG9zaXRpb24gdGhlIGNoaWxkIGF0IHRoZSByaWdodCBwbGFjZSBpbiB0aGUgcGFyZW50XG4gIGlmICghaXNOYU4oZjJ3T3JkZXIpKSB7XG4gICAgY29udGFpbmVyc1RvUmVPcmRlci5hZGQocGFyZW50KTtcbiAgfVxuICBpZiAoblByb3BzT2JqWyctLWYydy1pbWctc3JjJ10pIHtcbiAgICBsZXQgaSA9IChlbHQgYXMgSFRNTEltYWdlRWxlbWVudCkuZjJ3X2ltYWdlX2xhenlfbG9hZGVyO1xuICAgIGNvbnN0IHNyYyA9IG5Qcm9wc09ialsnLS1mMnctaW1nLXNyYyddWzFdIGFzIHN0cmluZztcbiAgICBpZiAoIWkpIHtcbiAgICAgIChlbHQgYXMgSFRNTEltYWdlRWxlbWVudCkuZjJ3X2ltYWdlX2xhenlfbG9hZGVyID0gaSA9IG5ldyBJbWFnZSgpO1xuICAgICAgaS5kZWNvZGluZyA9ICdzeW5jJztcbiAgICAgIGkub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAoZWx0IGFzIEhUTUxJbWFnZUVsZW1lbnQpLmRlY29kaW5nID0gJ3N5bmMnO1xuICAgICAgICBlbHQuc2V0QXR0cmlidXRlKCdzcmMnLCBzcmMpO1xuICAgICAgICBkZWxldGUgKGVsdCBhcyBIVE1MSW1hZ2VFbGVtZW50KS5mMndfaW1hZ2VfbGF6eV9sb2FkZXI7XG4gICAgICB9O1xuICAgIH1cbiAgICBpLnNyYyA9IHNyYztcbiAgICBkZWxldGUgblByb3BzT2JqWyctLWYydy1pbWctc3JjJ107XG4gIH1cbiAgaWYgKG5Qcm9wc09ialsnJGlubmVySFRNTCddKSB7XG4gICAgZWx0LmlubmVySFRNTCA9IFN0cmluZyhuUHJvcHNPYmpbJyRpbm5lckhUTUwnXVsxXSk7XG4gICAgZGVsZXRlIG5Qcm9wc09ialsnJGlubmVySFRNTCddO1xuICB9XG4gIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJQcm9wcykpIHtcbiAgICBlbHQuc2V0QXR0cmlidXRlKGssIFN0cmluZyh2KSk7XG4gIH1cbiAgaWYgKG5Qcm9wc09iai5sZWZ0ICYmIG5Qcm9wc09iai5yaWdodCkge1xuICAgIGlmIChuUHJvcHNPYmoubGVmdFsxXSA9PT0gJ3JldmVydCcgJiYgblByb3BzT2JqLnJpZ2h0WzBdID09PSAncmV2ZXJ0Jykge1xuICAgICAgLy8gbGVmdCB0byByaWdodFxuICAgICAgY29uc3QgeyByaWdodDogcGFyZW50UmlnaHQgfSA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHsgcmlnaHQgfSA9IGVsdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIC8vIGlzIHRoaXMgdGhlIHJpZ2h0IHdheSB0byBjb21wdXRlIHJpZ2h0IG9mZnNldCA/XG4gICAgICBjb25zdCByaWdodFN0ciA9IHRvUHgocGFyZW50UmlnaHQgLSByaWdodCk7XG4gICAgICBzZXRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUoZWx0LCB7IGxlZnQ6ICdyZXZlcnQnLCByaWdodDogcmlnaHRTdHIgfSk7XG4gICAgICBkZWxldGUgblByb3BzT2JqLmxlZnQ7XG4gICAgICBuUHJvcHNPYmoucmlnaHRbMF0gPSByaWdodFN0cjtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgblByb3BzT2JqLmxlZnRbMF0gPT09ICdyZXZlcnQnICYmXG4gICAgICBuUHJvcHNPYmoucmlnaHRbMV0gPT09ICdyZXZlcnQnXG4gICAgKSB7XG4gICAgICAvLyByaWdodCB0byBsZWZ0XG4gICAgICBjb25zdCB7IGxlZnQ6IHBhcmVudExlZnQgfSA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHsgbGVmdCB9ID0gZWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgLy8gaXMgdGhpcyB0aGUgcmlnaHQgd2F5IHRvIGNvbXB1dGUgbGVmdCBvZmZzZXQgP1xuICAgICAgY29uc3QgbGVmdFN0ciA9IHRvUHgobGVmdCAtIHBhcmVudExlZnQpO1xuICAgICAgc2V0UHJvcGVydGllc1dpdGhBbmltYXRlKGVsdCwgeyByaWdodDogJ3JldmVydCcsIGxlZnQ6IGxlZnRTdHIgfSk7XG4gICAgICBkZWxldGUgblByb3BzT2JqLnJpZ2h0O1xuICAgICAgblByb3BzT2JqLmxlZnRbMF0gPSBsZWZ0U3RyO1xuICAgIH1cbiAgfVxuICBpZiAoblByb3BzT2JqLnRvcCAmJiBuUHJvcHNPYmouYm90dG9tKSB7XG4gICAgaWYgKG5Qcm9wc09iai50b3BbMV0gPT09ICdyZXZlcnQnICYmIG5Qcm9wc09iai5ib3R0b21bMF0gPT09ICdyZXZlcnQnKSB7XG4gICAgICAvLyB0b3AgdG8gYm90dG9tXG4gICAgICBjb25zdCB7IGJvdHRvbTogcGFyZW50Qm90dG9tIH0gPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCB7IGJvdHRvbSB9ID0gZWx0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgLy8gaXMgdGhpcyB0aGUgcmlnaHQgd2F5IHRvIGNvbXB1dGUgYm90dG9tIG9mZnNldCA/XG4gICAgICBjb25zdCBib3R0b21TdHIgPSB0b1B4KHBhcmVudEJvdHRvbSAtIGJvdHRvbSk7XG4gICAgICBzZXRQcm9wZXJ0aWVzV2l0aEFuaW1hdGUoZWx0LCB7IHRvcDogJ3JldmVydCcsIGJvdHRvbTogYm90dG9tU3RyIH0pO1xuICAgICAgZGVsZXRlIG5Qcm9wc09iai50b3A7XG4gICAgICBuUHJvcHNPYmouYm90dG9tWzBdID0gYm90dG9tU3RyO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBuUHJvcHNPYmoudG9wWzBdID09PSAncmV2ZXJ0JyAmJlxuICAgICAgblByb3BzT2JqLmJvdHRvbVsxXSA9PT0gJ3JldmVydCdcbiAgICApIHtcbiAgICAgIC8vIGJvdHRvbSB0byB0b3BcbiAgICAgIGNvbnN0IHsgdG9wOiBwYXJlbnRUb3AgfSA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHsgdG9wIH0gPSBlbHQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAvLyBpcyB0aGlzIHRoZSByaWdodCB3YXkgdG8gY29tcHV0ZSB0b3Agb2Zmc2V0ID9cbiAgICAgIGNvbnN0IHRvcFN0ciA9IHRvUHgodG9wIC0gcGFyZW50VG9wKTtcbiAgICAgIHNldFByb3BlcnRpZXNXaXRoQW5pbWF0ZShlbHQsIHsgYm90dG9tOiAncmV2ZXJ0JywgdG9wOiB0b3BTdHIgfSk7XG4gICAgICBkZWxldGUgblByb3BzT2JqLmJvdHRvbTtcbiAgICAgIG5Qcm9wc09iai50b3BbMF0gPSB0b3BTdHI7XG4gICAgfVxuICB9XG4gIGNvbnN0IGhhc0JnSW1hZ2UgPSAhIW5Qcm9wc09ialsnYmFja2dyb3VuZEltYWdlJ107XG5cbiAgaWYgKGhhc0JnSW1hZ2UpIHtcbiAgICAvLyBJZiBiZy1pbWFnZSBjaGFuZ2VzLCBhbmltYXRpbmcgcG9zaXRpb24sIHNpemUgZXQuYWwgd2lsbCBoYXZlIGJpemFycmUgZWZmZWN0c1xuICAgIC8vIElkZWFsbHkgd2UndmUgd29yayBvbiB0aGF0IGR1cmluZyBkaWZmaW5nLCBhbmQgYXR0ZW1wdCB0byB1bmlmeSBiZy1pbWFnZSBhY2Nyb3NzIHZhcmlhbnRzXG4gICAgLy8gYW5kIG1heWJlIGFuaW1hdGUgaXQgdGhvdWdoIHZhcmlhYmxlcyA/XG4gICAgblByb3BzXG4gICAgICAuZmlsdGVyKChpdCkgPT4gaXQua2V5LnN0YXJ0c1dpdGgoJ2JhY2tncm91bmQtJykpXG4gICAgICAuZm9yRWFjaCgoaXQpID0+IHtcbiAgICAgICAgLy8gVE9ETyB1c2Ugc2V0UHJvcGVydGllc1dpdGhBbmltYXRlIGluc3RlYWQgdG8ga2VlcCBwcm9wcyBhbmltYXRhYmxlXG4gICAgICAgIGVsdC5zdHlsZS5zZXRQcm9wZXJ0eShpdC5rZXksIFN0cmluZyhpdC50bykpO1xuICAgICAgICBkZWxldGUgblByb3BzT2JqW2l0LmNhbWVsS2V5XTtcbiAgICAgIH0pO1xuICB9XG4gIGZvciAoY29uc3QgW3BzZXVkbywgb2JqXSBvZiBbXG4gICAgWydiZWZvcmUnLCBiUHJvcHNPYmpdLFxuICAgIFsnYWZ0ZXInLCBhUHJvcHNPYmpdLFxuICBdIGFzIGNvbnN0KSB7XG4gICAgaWYgKG9iai5kaXNwbGF5KSB7XG4gICAgICAvLyB1c2Ugc2V0UHJvcGVydGllc1dpdGhBbmltYXRlIGluc3RlYWQgb2YgY2xhc3NlcyA/XG4gICAgICBpZiAob2JqLmRpc3BsYXlbMV0gPT09ICdub25lJykge1xuICAgICAgICBlbHQuY2xhc3NMaXN0LnJlbW92ZShwc2V1ZG8gKyAnLXZpc2libGUnKTtcbiAgICAgICAgZWx0LmNsYXNzTGlzdC5hZGQocHNldWRvICsgJy1oaWRkZW4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsdC5jbGFzc0xpc3QucmVtb3ZlKHBzZXVkbyArICctaGlkZGVuJyk7XG4gICAgICAgIGVsdC5jbGFzc0xpc3QuYWRkKHBzZXVkbyArICctdmlzaWJsZScpO1xuICAgICAgfVxuICAgICAgLy8gZHJvcCBpdCBmcm9tIGFuaW1hdGlvbiA/XG4gICAgfVxuICB9XG5cbiAgY29uc3QgYW5pbSA9IChcbiAgICB0b0FuaW1hdGU6IFRvQW5pbWF0ZSxcbiAgICBwc2V1ZG8/OiBzdHJpbmcsXG4gICAgZm9yY2UgPSBmYWxzZVxuICApOiBBbmltYXRpb24gfCB1bmRlZmluZWQgPT4ge1xuICAgIGlmICghZm9yY2UgJiYgIU9iamVjdC5rZXlzKHRvQW5pbWF0ZSkubGVuZ3RoKSByZXR1cm47XG4gICAgcmV0dXJuIGVsdC5hbmltYXRlKFxuICAgICAge1xuICAgICAgICBlYXNpbmcsXG4gICAgICAgIC4uLnRvQW5pbWF0ZSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBzZXVkb0VsZW1lbnQ6IHBzZXVkbyxcbiAgICAgICAgaXRlcmF0aW9uczogMSxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGZpbGw6ICdib3RoJyxcbiAgICAgIH1cbiAgICApO1xuICB9O1xuICBjb25zdCBhID0gYW5pbShuUHJvcHNPYmosIHVuZGVmaW5lZCwgISFkaXNwbGF5QWZ0ZXJBbmltYXRpb24pO1xuICBpZiAoZGlzcGxheUFmdGVyQW5pbWF0aW9uKSB7XG4gICAgYSEuZmluaXNoZWQudGhlbigoKSA9PiB7XG4gICAgICBlbHQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlBZnRlckFuaW1hdGlvbiE7XG4gICAgfSk7XG4gIH1cbiAgYW5pbShiUHJvcHNPYmosICc6OmJlZm9yZScpO1xuICBhbmltKGFQcm9wc09iaiwgJzo6YWZ0ZXInKTtcbn1cblxuY29uc3Qgc2V0U3R5bGUgPSAoZTogQm91bmRFbGVtZW50LCBvOiBUb0FuaW1hdGUsIC4uLnByb3BzOiBzdHJpbmdbXSk6IHZvaWQgPT4ge1xuICBjb25zdCBwID0gcHJvcHMuZmluZCgocCkgPT4gcCBpbiBvKTtcbiAgaWYgKCFwKSByZXR1cm47XG4gIGUuc3R5bGVbcHJvcHNbMF0gYXMgYW55XSA9IFN0cmluZyhvW3BdWzFdKTtcbiAgZGVsZXRlIG9bcF07XG59O1xuIiwgImltcG9ydCB7XG4gIEFuaW1hdGVkRWx0LFxuICBGMndEaXJlY3Rpb25hbFRyYW5zaXRpb24sXG59IGZyb20gJ0BkaXZyaW90cy9maWdtYS10by1odG1sL3NyYy90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNb3ZlSW5BbmltYXRpb25zKFxuICBlbHRJZDogc3RyaW5nLFxuICBvdmVybGF5UG9zaXRpb25UeXBlOiBPdmVybGF5UG9zaXRpb25UeXBlLFxuICB0cmFuc2l0aW9uOiBGMndEaXJlY3Rpb25hbFRyYW5zaXRpb25cbik6IEFuaW1hdGVkRWx0W10ge1xuICBpZiAodHJhbnNpdGlvbi5kaXJlY3Rpb24gPT09ICdMRUZUJykge1xuICAgIGlmIChcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fTEVGVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfTEVGVCdcbiAgICApIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdsZWZ0JyxcbiAgICAgICAgICAgICAgZnJvbTogJzEwMCUnLFxuICAgICAgICAgICAgICB0bzogJzAlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fUklHSFQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX1JJR0hUJ1xuICAgICkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgIGZyb206ICcxMDAlIDBweCcsXG4gICAgICAgICAgICAgIHRvOiAnMHB4IDBweCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjZW50ZXJcbiAgICAgIGNvbnN0IHR5ID0gb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0NFTlRFUicgPyAnLTUwJScgOiAnMHB4JztcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdsZWZ0JyxcbiAgICAgICAgICAgICAgZnJvbTogJzEwMCUnLFxuICAgICAgICAgICAgICB0bzogJzUwJScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICBmcm9tOiBgMHB4ICR7dHl9YCxcbiAgICAgICAgICAgICAgdG86IGAtNTAlICR7dHl9YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICB9IGVsc2UgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnUklHSFQnKSB7XG4gICAgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9MRUZUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9MRUZUJ1xuICAgICkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgIGZyb206ICctMTAwJSAwcHgnLFxuICAgICAgICAgICAgICB0bzogJzBweCAwcHgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9SSUdIVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfUklHSFQnXG4gICAgKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAncmlnaHQnLFxuICAgICAgICAgICAgICBmcm9tOiAnMTAwJScsXG4gICAgICAgICAgICAgIHRvOiAnMHB4JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNlbnRlclxuICAgICAgY29uc3QgdHkgPSBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQ0VOVEVSJyA/ICctNTAlJyA6ICcwcHgnO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ2xlZnQnLFxuICAgICAgICAgICAgICBmcm9tOiAnMHB4JyxcbiAgICAgICAgICAgICAgdG86ICc1MCUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogYC0xMDAlICR7dHl9YCxcbiAgICAgICAgICAgICAgdG86IGAtNTAlICR7dHl9YCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF07XG4gICAgfVxuICB9IGVsc2UgaWYgKHRyYW5zaXRpb24uZGlyZWN0aW9uID09PSAnVE9QJykge1xuICAgIGlmIChcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fTEVGVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fUklHSFQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnQk9UVE9NX0NFTlRFUidcbiAgICApIHtcbiAgICAgIGNvbnN0IHR4ID0gb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9DRU5URVInID8gJy01MCUnIDogJzBweCc7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogYCR7dHh9IDEwMCVgLFxuICAgICAgICAgICAgICB0bzogYCR7dHh9IDBweGAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX0xFRlQnIHx8XG4gICAgICBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX1JJR0hUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9DRU5URVInXG4gICAgKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICB7XG4gICAgICAgICAgZWx0SWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndG9wJyxcbiAgICAgICAgICAgICAgZnJvbTogJzEwMCUnLFxuICAgICAgICAgICAgICB0bzogJzBweCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjZW50ZXJcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0b3AnLFxuICAgICAgICAgICAgICBmcm9tOiAnMTAwJScsXG4gICAgICAgICAgICAgIHRvOiAnNTAlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgIGZyb206IGAtNTAlIDAlYCxcbiAgICAgICAgICAgICAgdG86IGAtNTAlIC01MCVgLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9XG4gIH0gZWxzZSBpZiAodHJhbnNpdGlvbi5kaXJlY3Rpb24gPT09ICdCT1RUT00nKSB7XG4gICAgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9MRUZUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ0JPVFRPTV9SSUdIVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdCT1RUT01fQ0VOVEVSJ1xuICAgICkge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAge1xuICAgICAgICAgIGVsdElkLFxuICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ2JvdHRvbScsXG4gICAgICAgICAgICAgIGZyb206ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG86ICcwcHgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9MRUZUJyB8fFxuICAgICAgb3ZlcmxheVBvc2l0aW9uVHlwZSA9PT0gJ1RPUF9SSUdIVCcgfHxcbiAgICAgIG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdUT1BfQ0VOVEVSJ1xuICAgICkge1xuICAgICAgY29uc3QgdHggPSBvdmVybGF5UG9zaXRpb25UeXBlID09PSAnVE9QX0NFTlRFUicgPyAnLTUwJScgOiAnMHB4JztcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0cmFuc2xhdGUnLFxuICAgICAgICAgICAgICBmcm9tOiBgJHt0eH0gLTEwMCVgLFxuICAgICAgICAgICAgICB0bzogYCR7dHh9IDBweGAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjZW50ZXJcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZCxcbiAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICd0b3AnLFxuICAgICAgICAgICAgICBmcm9tOiAnMHB4JyxcbiAgICAgICAgICAgICAgdG86ICc1MCUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogYC01MCUgLTEwMCVgLFxuICAgICAgICAgICAgICB0bzogYC01MCUgLTUwJWAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLndhcm4oJ1Vuc3VwcG9ydGVkIHRyYW5zaXRpb246JywgdHJhbnNpdGlvbik7XG4gIH1cbiAgcmV0dXJuIFtdO1xufVxuIiwgImltcG9ydCB7XG4gIHRlbXBsYXRlSWQsXG4gIHRvUGVyY2VudCxcbiAgdG9QeCxcbiAgdmFsdWVUb1N0cmluZyxcbn0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXRvLWh0bWwvaGVscGVycyc7XG5pbXBvcnQge1xuICB0eXBlIFRyaWdnZXJUeXBlLFxuICByZWFjdGlvbl90eXBlcyxcbn0gZnJvbSAnQGRpdnJpb3RzL2ZpZ21hLXRvLWh0bWwvbWFwcGluZy90cmlnZ2Vycyc7XG5pbXBvcnQgdHlwZSB7XG4gIEFuaW1hdGVkUHJvcCxcbiAgQW5pbWF0ZWRFbHQgYXMgQW5pbWF0aW9uLFxuICBET01GMndBY3Rpb24gYXMgRjJ3QWN0aW9uLFxufSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdG8taHRtbC90eXBlcyc7XG5pbXBvcnQgeyBzaG91bGROb3RIYXBwZW4gfSBmcm9tICdAZGl2cmlvdHMvdXRpbHMvYXNzZXJ0JztcbmltcG9ydCB7IG9uY2UgfSBmcm9tICdAZGl2cmlvdHMvdXRpbHMvZnVuY3Rpb25zJztcbmltcG9ydCB7IGlzQWxpYXMgfSBmcm9tICdAZGl2cmlvdHMvZmlnbWEtdG8taHRtbC92YXJpYWJsZXMnO1xuaW1wb3J0IHsgZmlsdGVyRW1wdHkgfSBmcm9tICdAZGl2cmlvdHMvdXRpbHMvYXJyYXknO1xuaW1wb3J0IHsgb25Db25uZWN0ZWQsIENsZWFudXBGbiwgQm91bmRFbGVtZW50IH0gZnJvbSAnLi9saWZlY3ljbGUnO1xuaW1wb3J0IHtcbiAgc2Vla0JhY2t3YXJkLFxuICBzZWVrRm9yd2FyZCxcbiAgbXV0ZSxcbiAgcGF1c2UsXG4gIHBsYXksXG4gIHNlZWtUbyxcbiAgdG9nZ2xlTXV0ZSxcbiAgdG9nZ2xlUGxheSxcbiAgdW5NdXRlLFxufSBmcm9tICcuL3J1bnRpbWUvdmlkZW9zJztcbmltcG9ydCB7IGFuaW1hdGVQcm9wcyB9IGZyb20gJy4vcnVudGltZS9hbmltYXRvcic7XG5pbXBvcnQgeyBnZXRNb3ZlSW5BbmltYXRpb25zIH0gZnJvbSAnLi9ydW50aW1lL2FuaW1hdGlvbnMnO1xuXG50eXBlIFZhcmlhYmxlVmFsdWVOb0FsaWFzID0gRXhjbHVkZTxWYXJpYWJsZVZhbHVlLCBWYXJpYWJsZUFsaWFzPjtcblxudHlwZSBTZXRWYXJpYWJsZSA9IHsgaWQ6IHN0cmluZzsgdmFsdWU6IFZhcmlhYmxlVmFsdWU7IHN0cjogc3RyaW5nIH07XG5cbmNvbnN0IGFsbFJlYWN0aW9ucyA9ICgpOiBSZWNvcmQ8c3RyaW5nLCBGMndBY3Rpb24+ID0+IHdpbmRvdy5GMldfUkVBQ1RJT05TO1xuY29uc3QgYWxsVmFyaWFibGVzID0gKCk6IFJlY29yZDxzdHJpbmcsIFZhcmlhYmxlVmFsdWU+ID0+IHdpbmRvdy5GMldfVkFSSUFCTEVTO1xuY29uc3QgY29sbGVjdGlvbk1vZGVCcHMgPSAoKTogUmVjb3JkPFxuICBzdHJpbmcsXG4gIFJlY29yZDxzdHJpbmcsIHsgbWluV2lkdGg6IG51bWJlciB9PlxuPiA9PiB3aW5kb3cuRjJXX0NPTExFQ1RJT05fTU9ERV9CUFM7XG5jb25zdCBnZXRDb2xNb2RlcyA9IChjb2w6IHN0cmluZyk6IFJlY29yZDxzdHJpbmcsIFZhcmlhYmxlcz4gPT5cbiAgd2luZG93LkYyV19DT0xMRUNUSU9OX1ZBUlM/Lltjb2xdID8/IHt9O1xuY29uc3QgZ2V0Q29sVmFyaWFibGVzID0gKFxuICBjb2w6IHN0cmluZyxcbiAgbW9kZTogc3RyaW5nXG4pOiBSZWNvcmQ8c3RyaW5nLCBWYXJpYWJsZVZhbHVlPiB8IHVuZGVmaW5lZCA9PiBnZXRDb2xNb2Rlcyhjb2wpW21vZGVdO1xuXG5mdW5jdGlvbiBzZXRWYXJpYWJsZShpZDogc3RyaW5nLCB2YWx1ZTogVmFyaWFibGVWYWx1ZSk6IHZvaWQge1xuICBhbGxWYXJpYWJsZXMoKVtpZF0gPSB2YWx1ZTtcbiAgY29uc3Qgc3RyID0gdmFsdWVUb1N0cmluZyh2YWx1ZSk7XG4gIGRvY3VtZW50LmJvZHkuc3R5bGUuc2V0UHJvcGVydHkoaWQsIHN0cik7XG4gIGNvbnN0IGF0dHIgPSBgZGF0YSR7aWQuc2xpY2UoMSl9YDtcbiAgaWYgKGRvY3VtZW50LmJvZHkuaGFzQXR0cmlidXRlKGF0dHIpKSB7XG4gICAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoYXR0ciwgc3RyKTtcbiAgfVxuICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KFxuICAgIG5ldyBDdXN0b21FdmVudDxTZXRWYXJpYWJsZT4oJ2Yydy1zZXQtdmFyaWFibGUnLCB7XG4gICAgICBkZXRhaWw6IHsgaWQsIHZhbHVlLCBzdHIgfSxcbiAgICB9KVxuICApO1xufVxuXG5mdW5jdGlvbiBzZXRDb2xsZWN0aW9uQXR0ckFuZFZhcmlhYmxlcyhcbiAgY29sTmFtZTogc3RyaW5nLFxuICBtb2RlTmFtZTogc3RyaW5nXG4pOiB2b2lkIHtcbiAgZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoYGRhdGEtJHtjb2xOYW1lfWAsIG1vZGVOYW1lKTtcbiAgY29uc3QgdmFycyA9IGdldENvbFZhcmlhYmxlcyhjb2xOYW1lLCBtb2RlTmFtZSkgPz8ge307XG4gIGZvciAoY29uc3QgW2lkLCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModmFycykpIHtcbiAgICBzZXRWYXJpYWJsZShpZCwgdmFsdWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldFZhcmlhYmxlTW9kZShuYW1lOiBzdHJpbmcsIG1vZGVOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgc2V0Q29sbGVjdGlvbkF0dHJBbmRWYXJpYWJsZXMobmFtZSwgbW9kZU5hbWUpO1xuICBzYXZlTW9kZShuYW1lLCBtb2RlTmFtZSk7XG59XG5cbmZ1bmN0aW9uIHNhdmVNb2RlKG5hbWU6IHN0cmluZywgbW9kZU5hbWU6IHN0cmluZyk6IHZvaWQge1xuICBpZiAod2luZG93LkYyV19DT0xPUl9TQ0hFTUVTPy5pbmNsdWRlcyhuYW1lKSkge1xuICAgIGxvY2FsU3RvcmFnZT8uc2V0SXRlbShDT0xPUl9TQ0hFTUVfS0VZLCBtb2RlTmFtZSk7XG4gIH0gZWxzZSBpZiAod2luZG93LkYyV19MQU5HVUFHRVM/LmluY2x1ZGVzKG5hbWUpKSB7XG4gICAgbG9jYWxTdG9yYWdlPy5zZXRJdGVtKExBTkdfS0VZLCBtb2RlTmFtZSk7XG4gICAgY29uc3QgYWx0ZXJuYXRlID0gQXJyYXkuZnJvbShcbiAgICAgIGRvY3VtZW50LmhlYWQucXVlcnlTZWxlY3RvckFsbDxIVE1MTGlua0VsZW1lbnQ+KCdsaW5rW3JlbD1cImFsdGVybmF0ZVwiXScpXG4gICAgKS5maW5kKChpdCkgPT4gaXQuaHJlZmxhbmcgPT09IG1vZGVOYW1lKTtcbiAgICBpZiAoYWx0ZXJuYXRlKSB7XG4gICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShudWxsLCAnJywgbmV3IFVSTChhbHRlcm5hdGUuaHJlZikucGF0aG5hbWUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB0b0Zsb2F0KHY6IFZhcmlhYmxlVmFsdWVOb0FsaWFzKTogbnVtYmVyIHtcbiAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykgcmV0dXJuIHY7XG4gIGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSByZXR1cm4gdiA/IDEgOiAwO1xuICBpZiAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSByZXR1cm4gcGFyc2VGbG9hdCh2KTtcbiAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIHRvU3RyaW5nKHY6IFZhcmlhYmxlVmFsdWVOb0FsaWFzKTogc3RyaW5nIHtcbiAgcmV0dXJuIFN0cmluZyh2KTtcbn1cblxuZnVuY3Rpb24gdG9Cb29sZWFuKHY6IFZhcmlhYmxlVmFsdWVOb0FsaWFzKTogYm9vbGVhbiB7XG4gIGlmICh0eXBlb2YgdiA9PT0gJ3N0cmluZycpIHJldHVybiB2ID09PSAndHJ1ZSc7XG4gIHJldHVybiAhIXY7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmUoXG4gIHZhbHVlOiBWYXJpYWJsZVZhbHVlV2l0aEV4cHJlc3Npb24gfCB1bmRlZmluZWQsXG4gIHJvb3RJZD86IHN0cmluZ1xuKTogVmFyaWFibGVWYWx1ZU5vQWxpYXMge1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICBpZiAoaXNBbGlhcyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gcmVzb2x2ZShhbGxWYXJpYWJsZXMoKVt2YWx1ZS5pZF0pO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmICdleHByZXNzaW9uQXJndW1lbnRzJyBpbiB2YWx1ZSkge1xuICAgIGNvbnN0IGFyZ3MgPSB2YWx1ZS5leHByZXNzaW9uQXJndW1lbnRzXG4gICAgICAubWFwKChpdCkgPT4gaXQudmFsdWUpXG4gICAgICAuZmlsdGVyKChpdCk6IGl0IGlzIFZhcmlhYmxlVmFsdWVXaXRoRXhwcmVzc2lvbiA9PiBpdCAhPT0gdW5kZWZpbmVkKVxuICAgICAgLm1hcCgoaXQpID0+IHJlc29sdmUoaXQsIHJvb3RJZCkpO1xuICAgIGNvbnN0IHJlc29sdmVkVHlwZSA9IHZhbHVlLmV4cHJlc3Npb25Bcmd1bWVudHNbMF0/LnJlc29sdmVkVHlwZSA/PyAnU1RSSU5HJztcbiAgICBzd2l0Y2ggKHZhbHVlLmV4cHJlc3Npb25GdW5jdGlvbikge1xuICAgICAgY2FzZSAnQURESVRJT04nOlxuICAgICAgICByZXR1cm4gcmVzb2x2ZWRUeXBlID09PSAnRkxPQVQnXG4gICAgICAgICAgPyBhcmdzLm1hcCh0b0Zsb2F0KS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKVxuICAgICAgICAgIDogYXJncy5tYXAodG9TdHJpbmcpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xuICAgICAgY2FzZSAnU1VCVFJBQ1RJT04nOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Zsb2F0KGFyZ3NbMF0pIC0gdG9GbG9hdChhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ0RJVklTSU9OJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gdG9GbG9hdChhcmdzWzBdKSAvIHRvRmxvYXQoYXJnc1sxXSk7XG4gICAgICBjYXNlICdNVUxUSVBMSUNBVElPTic6XG4gICAgICAgIHJldHVybiBhcmdzLm1hcCh0b0Zsb2F0KS5yZWR1Y2UoKGEsIGIpID0+IGEgKiBiKTtcbiAgICAgIGNhc2UgJ05FR0FURSc6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIC10b0Zsb2F0KGFyZ3NbMF0pO1xuICAgICAgY2FzZSAnR1JFQVRFUl9USEFOJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gdG9GbG9hdChhcmdzWzBdKSA+IHRvRmxvYXQoYXJnc1sxXSk7XG4gICAgICBjYXNlICdHUkVBVEVSX1RIQU5fT1JfRVFVQUwnOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Zsb2F0KGFyZ3NbMF0pID49IHRvRmxvYXQoYXJnc1sxXSk7XG4gICAgICBjYXNlICdMRVNTX1RIQU4nOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0b0Zsb2F0KGFyZ3NbMF0pIDwgdG9GbG9hdChhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ0xFU1NfVEhBTl9PUl9FUVVBTCc6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHRvRmxvYXQoYXJnc1swXSkgPD0gdG9GbG9hdChhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ0VRVUFMUyc6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMikgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkVHlwZSA9PT0gJ0ZMT0FUJ1xuICAgICAgICAgID8gdG9GbG9hdChhcmdzWzBdKSA9PT0gdG9GbG9hdChhcmdzWzFdKVxuICAgICAgICAgIDogcmVzb2x2ZWRUeXBlID09PSAnQk9PTEVBTidcbiAgICAgICAgICA/IHRvQm9vbGVhbihhcmdzWzBdKSA9PT0gdG9Cb29sZWFuKGFyZ3NbMV0pXG4gICAgICAgICAgOiB0b1N0cmluZyhhcmdzWzBdKSA9PT0gdG9TdHJpbmcoYXJnc1sxXSk7XG4gICAgICBjYXNlICdOT1RfRVFVQUwnOlxuICAgICAgICBpZiAoYXJncy5sZW5ndGggIT09IDIpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiByZXNvbHZlZFR5cGUgPT09ICdGTE9BVCdcbiAgICAgICAgICA/IHRvRmxvYXQoYXJnc1swXSkgIT09IHRvRmxvYXQoYXJnc1sxXSlcbiAgICAgICAgICA6IHJlc29sdmVkVHlwZSA9PT0gJ0JPT0xFQU4nXG4gICAgICAgICAgPyB0b0Jvb2xlYW4oYXJnc1swXSkgIT09IHRvQm9vbGVhbihhcmdzWzFdKVxuICAgICAgICAgIDogdG9TdHJpbmcoYXJnc1swXSkgIT09IHRvU3RyaW5nKGFyZ3NbMV0pO1xuICAgICAgY2FzZSAnQU5EJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gdG9Cb29sZWFuKGFyZ3NbMF0pICYmIHRvQm9vbGVhbihhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ09SJzpcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gdG9Cb29sZWFuKGFyZ3NbMF0pIHx8IHRvQm9vbGVhbihhcmdzWzFdKTtcbiAgICAgIGNhc2UgJ05PVCc6XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCAhPT0gMSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGV4cHJlc3Npb24nKTtcbiAgICAgICAgcmV0dXJuICF0b0Jvb2xlYW4oYXJnc1swXSk7XG4gICAgICBjYXNlICdWQVJfTU9ERV9MT09LVVAnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIGBFeHByZXNzaW9uIG5vdCBpbXBsZW1lbnRlZCB5ZXQ6ICR7dmFsdWUuZXhwcmVzc2lvbkZ1bmN0aW9ufWBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWN0aW9uc1RvUnVuKFxuICBhY3Rpb25zOiBGMndBY3Rpb25bXSxcbiAgYm91bmQ6IEJvdW5kRWxlbWVudCxcbiAgdHJpZ2dlcjogVHJpZ2dlclR5cGVcbik6IFJldmVydGFibGVFdmVudENhbGxiYWNrIHtcbiAgY29uc3QgcnVucyA9IGFjdGlvbnMubWFwKChpdCkgPT4gdG9SdW5XaXRoRHJhZ0NsZWFudXAoaXQsIGJvdW5kLCB0cmlnZ2VyKSk7XG4gIHJldHVybiAoZSwgaSkgPT4ge1xuICAgIGNvbnN0IHJldmVydHMgPSBydW5zXG4gICAgICAubWFwKChpdCkgPT4gaXQoZSwgaSkpXG4gICAgICAuZmlsdGVyKChpdCk6IGl0IGlzIEV2ZW50Q2FsbGJhY2sgPT4gISFpdCk7XG4gICAgaWYgKHJldmVydHMubGVuZ3RoKSByZXR1cm4gKGUsIGkpID0+IHJldmVydHMuZm9yRWFjaCgoaXQpID0+IGl0KGUsIGkpKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9SdW5XaXRoRHJhZ0NsZWFudXAoXG4gIGFjdGlvbjogRjJ3QWN0aW9uLFxuICBib3VuZDogQm91bmRFbGVtZW50LFxuICB0cmlnZ2VyOiBUcmlnZ2VyVHlwZVxuKTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICB3aGlsZSAoYWN0aW9uLnR5cGUgPT09ICdBTElBUycpIHtcbiAgICBhY3Rpb24gPSBhbGxSZWFjdGlvbnMoKVthY3Rpb24uYWxpYXNdO1xuICB9XG4gIGNvbnN0IHJ1biA9IHRvUnVuKGFjdGlvbiwgYm91bmQsIHRyaWdnZXIpO1xuICByZXR1cm4gKGUpID0+IHtcbiAgICBpZiAoYWN0aW9uLnR5cGUgIT09ICdBTklNQVRFJyAmJiB0cmlnZ2VyID09PSAnZHJhZycpIHtcbiAgICAgIGNvbnN0IGQgPSAoZSBhcyBDdXN0b21FdmVudDxEcmFnZ2luZz4pLmRldGFpbDtcbiAgICAgIGlmICghZC5oYW5kbGVkKSB7XG4gICAgICAgIGQuaGFuZGxlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiBydW4oZSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIHNraXAgYWxsIGFuaW1hdGlvbnMgd2hlbiBhIGRyYWcgaXMgaW4gcHJvZ3Jlc3NcbiAgICBpZiAoZHJhZ19zdGFydGVkKSByZXR1cm47XG4gICAgaWYgKGFjdGlvbi50eXBlID09PSAnQU5JTUFURScgJiYgYWN0aW9uLnJvb3RJZCkge1xuICAgICAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFjdGlvbi5yb290SWQpO1xuICAgICAgLy8gYWRkIHJldmVydCBmdW5jdGlvbnMgdG8gcGFyZW50IGVsZW1lbnRzLCBzbyB0aGV5IGNhbiByZXNldCB0aGVpciBjaGlsZHJlbiB3aGVuIG5lZWRlZFxuICAgICAgaWYgKHJvb3Q/LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgcmV2ZXJ0ID0gb25jZShydW4oZSkpO1xuICAgICAgICBpZiAocmV2ZXJ0KSB7XG4gICAgICAgICAgbGV0IGVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSByb290Py5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgIHdoaWxlIChlbCkge1xuICAgICAgICAgICAgLy8gVE9ETyB0aGlzIHdpbGwgbGVhayBhcyBpdCdzIHVubGlrZWx5IHRoZXNlIGVsZW1lbnRzIHdpbGwgZXZlciBuZWVkIHRvIHJlc2V0XG4gICAgICAgICAgICAvLyBDb3VsZCBiZSBpbXByb3ZlZCBieSBmbGFnZ2luZyAncmVzZXR0YWJsZScgbm9kZXMsIGFuZCBvbmx5IGFkZGluZyB0aGUgcmVzZXQgZnVuY3Rpb24gdG8gdGhlbVxuICAgICAgICAgICAgKGVsLmYyd19yZXNldCB8fD0gW10pLnB1c2gocmV2ZXJ0KTtcbiAgICAgICAgICAgIGVsID0gZWwucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIGlmIChlbD8udGFnTmFtZSA9PT0gJ0JPRFknKSBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldmVydDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJ1bihlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9SdW4oXG4gIGFjdGlvbjogRjJ3QWN0aW9uLFxuICBib3VuZDogQm91bmRFbGVtZW50LFxuICB0cmlnZ2VyOiBUcmlnZ2VyVHlwZVxuKTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSAnQkFDSyc6XG4gICAgICByZXR1cm4gKCkgPT4gKHdpbmRvdy5GMldfUFJFVklFV19CQUNLID8/IGhpc3RvcnkuYmFjaykoKTtcbiAgICBjYXNlICdKUyc6XG4gICAgICByZXR1cm4gKCkgPT4gZXZhbChhY3Rpb24uY29kZSk7XG4gICAgY2FzZSAnVVJMJzpcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGlmIChhY3Rpb24ub3BlbkluTmV3VGFiKSB7XG4gICAgICAgICAgd2luZG93Lm9wZW4oYWN0aW9uLnVybCwgJ19ibGFuaycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdpbmRvdy5GMldfUFJFVklFV19OQVZJR0FURVxuICAgICAgICAgICAgPyB3aW5kb3cuRjJXX1BSRVZJRVdfTkFWSUdBVEUoYWN0aW9uLnVybClcbiAgICAgICAgICAgIDogbG9jYXRpb24uYXNzaWduKGFjdGlvbi51cmwpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIGNhc2UgJ1NFVF9WQVJJQUJMRSc6XG4gICAgICBjb25zdCB7IHZhcmlhYmxlSWQsIHZhcmlhYmxlVmFsdWUgfSA9IGFjdGlvbjtcbiAgICAgIGlmICh2YXJpYWJsZUlkICYmIHZhcmlhYmxlVmFsdWU/LnZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiAoKSA9PlxuICAgICAgICAgIHNldFZhcmlhYmxlKHZhcmlhYmxlSWQsIHJlc29sdmUodmFyaWFibGVWYWx1ZS52YWx1ZSwgdmFyaWFibGVJZCkpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnU0VUX1ZBUklBQkxFX01PREUnOlxuICAgICAgY29uc3QgeyB2YXJpYWJsZUNvbGxlY3Rpb25OYW1lLCB2YXJpYWJsZU1vZGVOYW1lIH0gPSBhY3Rpb247XG4gICAgICBpZiAodmFyaWFibGVDb2xsZWN0aW9uTmFtZSAmJiB2YXJpYWJsZU1vZGVOYW1lKVxuICAgICAgICByZXR1cm4gKCkgPT4gc2V0VmFyaWFibGVNb2RlKHZhcmlhYmxlQ29sbGVjdGlvbk5hbWUsIHZhcmlhYmxlTW9kZU5hbWUpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnQ09ORElUSU9OQUwnOlxuICAgICAgY29uc3QgYmxvY2tzID0gYWN0aW9uLmNvbmRpdGlvbmFsQmxvY2tzLm1hcCgodikgPT4ge1xuICAgICAgICBjb25zdCBydW4gPSBhY3Rpb25zVG9SdW4odi5hY3Rpb25zLCBib3VuZCwgdHJpZ2dlcik7XG4gICAgICAgIGNvbnN0IHsgY29uZGl0aW9uIH0gPSB2O1xuICAgICAgICBjb25zdCB0ZXN0ID0gY29uZGl0aW9uXG4gICAgICAgICAgPyAoKSA9PiB0b0Jvb2xlYW4ocmVzb2x2ZShjb25kaXRpb24udmFsdWUpKVxuICAgICAgICAgIDogKCkgPT4gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHsgdGVzdCwgcnVuIH07XG4gICAgICB9KTtcbiAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJldmVydHM6IEV2ZW50Q2FsbGJhY2tbXSA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIGJsb2Nrcykge1xuICAgICAgICAgIGlmIChibG9jay50ZXN0KCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldmVydCA9IGJsb2NrLnJ1bigpO1xuICAgICAgICAgICAgaWYgKHJldmVydCkgcmV2ZXJ0cy5wdXNoKHJldmVydCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJldmVydHMubGVuZ3RoKSByZXR1cm4gKGUpID0+IHJldmVydHMuZm9yRWFjaCgoaXQpID0+IGl0KGUpKTtcbiAgICAgIH07XG4gICAgY2FzZSAnS0VZX0NPTkRJVElPTic6XG4gICAgICBjb25zdCBydW4gPSBhY3Rpb25zVG9SdW4oYWN0aW9uLmFjdGlvbnMsIGJvdW5kLCB0cmlnZ2VyKTtcbiAgICAgIGNvbnN0IGtleUNvZGUgPSBhY3Rpb24ua2V5Q29kZXNbMF07XG4gICAgICBjb25zdCBzaGlmdEtleSA9IGFjdGlvbi5rZXlDb2Rlcy5zbGljZSgxKS5pbmNsdWRlcygxNik7XG4gICAgICBjb25zdCBjdHJsS2V5ID0gYWN0aW9uLmtleUNvZGVzLnNsaWNlKDEpLmluY2x1ZGVzKDE3KTtcbiAgICAgIGNvbnN0IGFsdEtleSA9IGFjdGlvbi5rZXlDb2Rlcy5zbGljZSgxKS5pbmNsdWRlcygxOCk7XG4gICAgICBjb25zdCBtZXRhS2V5ID0gYWN0aW9uLmtleUNvZGVzLnNsaWNlKDEpLmluY2x1ZGVzKDkxKTtcbiAgICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpIHtcbiAgICAgICAgICBpZiAoZS5rZXlDb2RlICE9PSBrZXlDb2RlKSByZXR1cm47XG4gICAgICAgICAgaWYgKGUuY3RybEtleSAhPT0gY3RybEtleSkgcmV0dXJuO1xuICAgICAgICAgIGlmIChlLmFsdEtleSAhPT0gYWx0S2V5KSByZXR1cm47XG4gICAgICAgICAgaWYgKGUubWV0YUtleSAhPT0gbWV0YUtleSkgcmV0dXJuO1xuICAgICAgICAgIGlmIChlLnNoaWZ0S2V5ICE9PSBzaGlmdEtleSkgcmV0dXJuO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIHJ1bihlKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICBjYXNlICdDTE9TRV9PVkVSTEFZJzoge1xuICAgICAgaWYgKGFjdGlvbi5zZWxmKSByZXR1cm4gKGUpID0+IChlPy50YXJnZXQgYXMgQm91bmRFbGVtZW50KT8uZjJ3X2Nsb3NlPy4oKTtcbiAgICAgIGlmIChhY3Rpb24ub3ZlcmxheUlkKSB7XG4gICAgICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhY3Rpb24ub3ZlcmxheUlkKTtcbiAgICAgICAgaWYgKCFvdmVybGF5KSBicmVhaztcbiAgICAgICAgcmV0dXJuICgpID0+IG92ZXJsYXkuZjJ3X2Nsb3NlPy4oKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlICdTQ1JPTExfVE8nOlxuICAgICAgaWYgKCFhY3Rpb24uZGVzdGluYXRpb25JZCkgYnJlYWs7XG4gICAgICBjb25zdCBlbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhY3Rpb24uZGVzdGluYXRpb25JZCk7XG4gICAgICBpZiAoIWVsdCkgYnJlYWs7XG4gICAgICByZXR1cm4gKGUpID0+IHtcbiAgICAgICAgLy8gV2UgZG9uJ3Qgd2FudCB0byBzY3JvbGwgYW5kIG5hdmlnYXRlIGF0IHRoZSBzYW1lIHRpbWUgZm9yIGFuY2hvcnNcbiAgICAgICAgaWYgKGU/LmN1cnJlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCkgZT8ucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZWx0LnNjcm9sbEludG9WaWV3KHtcbiAgICAgICAgICBiZWhhdmlvcjogYWN0aW9uLnRyYW5zaXRpb24/LnR5cGUgPyAnc21vb3RoJyA6ICdpbnN0YW50JyxcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIGNhc2UgJ09WRVJMQVknOlxuICAgICAgaWYgKCFhY3Rpb24uZGVzdGluYXRpb25JZCkgYnJlYWs7XG4gICAgICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYWN0aW9uLmRlc3RpbmF0aW9uSWQpO1xuICAgICAgaWYgKCFvdmVybGF5KSBicmVhaztcbiAgICAgIGNvbnN0IG1vZGFsID0gQXJyYXkoLi4ub3ZlcmxheS5jaGlsZHJlbikuZmluZChcbiAgICAgICAgKGl0KSA9PiBpdC50YWdOYW1lICE9PSAnVEVNUExBVEUnXG4gICAgICApIGFzIEJvdW5kRWxlbWVudDtcbiAgICAgIGlmICghbW9kYWwpIGJyZWFrO1xuICAgICAgY29uc3QgeyB0cmFuc2l0aW9uLCBvdmVybGF5UG9zaXRpb25UeXBlLCBvdmVybGF5UmVsYXRpdmVQb3NpdGlvbiB9ID1cbiAgICAgICAgYWN0aW9uO1xuICAgICAgY29uc3QgZHVyYXRpb24gPSBNYXRoLnJvdW5kKDEwMDAgKiAodHJhbnNpdGlvbj8uZHVyYXRpb24gPz8gMCkpO1xuICAgICAgY29uc3QgYW5pbWF0aW9uczogQW5pbWF0aW9uW10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZDogYWN0aW9uLmRlc3RpbmF0aW9uSWQsXG4gICAgICAgICAgcHJvcHM6IFtcbiAgICAgICAgICAgIHsga2V5OiAndmlzaWJpbGl0eScsIGZyb206ICdoaWRkZW4nLCB0bzogJ3Zpc2libGUnIH0sXG4gICAgICAgICAgICB7IGtleTogJ29wYWNpdHknLCBmcm9tOiAnMCcsIHRvOiAnMScgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXTtcblxuICAgICAgaWYgKG92ZXJsYXlQb3NpdGlvblR5cGUgPT09ICdNQU5VQUwnKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRyaWdnZXIgPT09ICdob3ZlcicpIHtcbiAgICAgICAgICAgIC8vIHRlbXBvcmFyeSBkaXNhYmxlIG1vdXNlbGVhdmUgaGFuZGxlciBvbiBlbGVtZW50LCBiZWNhdXNlIHdlIHdhbnQgdGhlIG92ZXJsYXkgdG8gcmVtYWluIHZpc2libGUgd2hpbGUgdGhlIGN1cnNvciBob3ZlcnMgdGhlIGJvdW5kIGVsZW1lbnQgT1IgdGhlIG92ZXJsYXkgaXRzZWxmXG4gICAgICAgICAgICBjb25zdCBsZWF2ZSA9IGJvdW5kLmYyd19tb3VzZWxlYXZlX3JlbW92ZT8uKCk7XG4gICAgICAgICAgICBpZiAobGVhdmUpIHtcbiAgICAgICAgICAgICAgY29uc3QgbW91c2Vtb3ZlID0gKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGlzT3V0c2lkZShldmVudCwgYm91bmQpICYmIGlzT3V0c2lkZShldmVudCwgbW9kYWwpKSB7XG4gICAgICAgICAgICAgICAgICBsZWF2ZSgpO1xuICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFRPRE8gbWFrZSBpdCBzdGljayB0byBlbGVtZW50IGluIGNhc2Ugb2YgcmVzaXplID9cbiAgICAgICAgICAvLyBUT0RPIGNsb3NlIGl0IGluIGNhc2Ugb2YgcmVzcG9uc2l2ZSBsYXlvdXQgY2hhbmdlID9cbiAgICAgICAgICBjb25zdCBkeW5hbWljX2FuaW1hdGlvbnMgPSBhbmltYXRpb25zLnNsaWNlKDApO1xuICAgICAgICAgIGNvbnN0IG1hbnVhbExlZnQgPSB0b1B4KFxuICAgICAgICAgICAgYm91bmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArXG4gICAgICAgICAgICAgIChvdmVybGF5UmVsYXRpdmVQb3NpdGlvbj8ueCA/PyAwKVxuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3QgbWFudWFsVG9wID0gdG9QeChcbiAgICAgICAgICAgIGJvdW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArXG4gICAgICAgICAgICAgIChvdmVybGF5UmVsYXRpdmVQb3NpdGlvbj8ueSA/PyAwKVxuICAgICAgICAgICk7XG4gICAgICAgICAgbW9kYWwuc3R5bGUuc2V0UHJvcGVydHkoJ2xlZnQnLCBtYW51YWxMZWZ0KTtcbiAgICAgICAgICBtb2RhbC5zdHlsZS5zZXRQcm9wZXJ0eSgndG9wJywgbWFudWFsVG9wKTtcbiAgICAgICAgICBpZiAodHJhbnNpdGlvbj8udHlwZSA9PT0gJ01PVkVfSU4nKSB7XG4gICAgICAgICAgICBpZiAodHJhbnNpdGlvbi5kaXJlY3Rpb24gPT09ICdMRUZUJykge1xuICAgICAgICAgICAgICBkeW5hbWljX2FuaW1hdGlvbnMucHVzaCh7XG4gICAgICAgICAgICAgICAgZWx0SWQ6IG1vZGFsLmlkLFxuICAgICAgICAgICAgICAgIHByb3BzOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ2xlZnQnLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIHRvOiBtYW51YWxMZWZ0LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHJhbnNpdGlvbi5kaXJlY3Rpb24gPT09ICdSSUdIVCcpIHtcbiAgICAgICAgICAgICAgZHluYW1pY19hbmltYXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgIGVsdElkOiBtb2RhbC5pZCxcbiAgICAgICAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogJzBweCcsXG4gICAgICAgICAgICAgICAgICAgIHRvOiBtYW51YWxMZWZ0LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiAndHJhbnNsYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogJy0xMDAlIDBweCcsXG4gICAgICAgICAgICAgICAgICAgIHRvOiAnMHB4IDBweCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0cmFuc2l0aW9uLmRpcmVjdGlvbiA9PT0gJ1RPUCcpIHtcbiAgICAgICAgICAgICAgZHluYW1pY19hbmltYXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgIGVsdElkOiBtb2RhbC5pZCxcbiAgICAgICAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICd0b3AnLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIHRvOiBtYW51YWxUb3AsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0cmFuc2l0aW9uLmRpcmVjdGlvbiA9PT0gJ0JPVFRPTScpIHtcbiAgICAgICAgICAgICAgZHluYW1pY19hbmltYXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgIGVsdElkOiBtb2RhbC5pZCxcbiAgICAgICAgICAgICAgICBwcm9wczogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBrZXk6ICd0b3AnLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiAnMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgdG86IG1hbnVhbFRvcCxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGtleTogJ3RyYW5zbGF0ZScsXG4gICAgICAgICAgICAgICAgICAgIGZyb206ICcwcHggLTEwMCUnLFxuICAgICAgICAgICAgICAgICAgICB0bzogJzBweCAwcHgnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRvRXhlY3V0YWJsZUFuaW1hdGlvbnMoXG4gICAgICAgICAgICBkeW5hbWljX2FuaW1hdGlvbnMsXG4gICAgICAgICAgICB0cmFuc2l0aW9uPy5lYXNpbmcsXG4gICAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICAgIGJvdW5kLFxuICAgICAgICAgICAgdHJpZ2dlcixcbiAgICAgICAgICAgIGAke3RyaWdnZXJ9KG1hbnVhbF9vdmVybGF5KWAsXG4gICAgICAgICAgICBvdmVybGF5XG4gICAgICAgICAgKSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBpZiAodHJhbnNpdGlvbj8udHlwZSA9PT0gJ01PVkVfSU4nKSB7XG4gICAgICAgIGFuaW1hdGlvbnMucHVzaChcbiAgICAgICAgICAuLi5nZXRNb3ZlSW5BbmltYXRpb25zKG1vZGFsLmlkLCBvdmVybGF5UG9zaXRpb25UeXBlLCB0cmFuc2l0aW9uKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmICh0cmFuc2l0aW9uPy50eXBlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignVW5zdXBwb3J0ZWQgdHJhbnNpdGlvbjonLCB0cmFuc2l0aW9uKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b0V4ZWN1dGFibGVBbmltYXRpb25zKFxuICAgICAgICBhbmltYXRpb25zLFxuICAgICAgICB0cmFuc2l0aW9uPy5lYXNpbmcsXG4gICAgICAgIGR1cmF0aW9uLFxuICAgICAgICBib3VuZCxcbiAgICAgICAgdHJpZ2dlcixcbiAgICAgICAgYCR7dHJpZ2dlcn0ob3ZlcmxheSlgLFxuICAgICAgICBvdmVybGF5XG4gICAgICApO1xuICAgIGNhc2UgJ0FOSU1BVEUnOiB7XG4gICAgICBjb25zdCB7IGFuaW1hdGlvbnMsIHRyYW5zaXRpb24sIHJvb3RJZCwgcmVzZXQgfSA9IGFjdGlvbjtcbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gTWF0aC5yb3VuZCgxMDAwICogKHRyYW5zaXRpb24/LmR1cmF0aW9uID8/IDApKTtcbiAgICAgIGNvbnN0IHJ1biA9IHRvRXhlY3V0YWJsZUFuaW1hdGlvbnMoXG4gICAgICAgIGFuaW1hdGlvbnMsXG4gICAgICAgIHRyYW5zaXRpb24/LmVhc2luZyxcbiAgICAgICAgZHVyYXRpb24sXG4gICAgICAgIGJvdW5kLFxuICAgICAgICB0cmlnZ2VyLFxuICAgICAgICByZXNldCA/IGAke3RyaWdnZXJ9KCtyZXNldClgIDogdHJpZ2dlclxuICAgICAgKTtcbiAgICAgIHJldHVybiByZXNldCAmJiByb290SWRcbiAgICAgICAgPyAoZSwgaSkgPT4ge1xuICAgICAgICAgICAgLy8gbmVlZCB0byByZXNldCBhbGwgYW5pbWF0aW9ucyBkb25lIG9uIGVsZW1lbnRzIGJlbG93IHJvb3RcbiAgICAgICAgICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChyb290SWQpO1xuICAgICAgICAgICAgaWYgKHJvb3QpIHtcbiAgICAgICAgICAgICAgY29uc3QgeyBmMndfcmVzZXQgfSA9IHJvb3Q7XG4gICAgICAgICAgICAgIGlmIChmMndfcmVzZXQ/Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByb290LmYyd19yZXNldDtcbiAgICAgICAgICAgICAgICBmMndfcmVzZXQucmV2ZXJzZSgpLmZvckVhY2goKGl0KSA9PiBpdCh1bmRlZmluZWQsIHRydWUpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJ1bihlLCBpKTtcbiAgICAgICAgICB9XG4gICAgICAgIDogcnVuO1xuICAgIH1cbiAgICBjYXNlICdVUERBVEVfTUVESUFfUlVOVElNRSc6IHtcbiAgICAgIGlmICghYWN0aW9uLmRlc3RpbmF0aW9uSWQpIGJyZWFrO1xuICAgICAgY29uc3QgZWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYWN0aW9uLmRlc3RpbmF0aW9uSWQpO1xuICAgICAgaWYgKCFlbHQpIGJyZWFrO1xuICAgICAgc3dpdGNoIChhY3Rpb24ubWVkaWFBY3Rpb24pIHtcbiAgICAgICAgY2FzZSAnTVVURSc6XG4gICAgICAgICAgcmV0dXJuIG11dGUoZWx0KTtcbiAgICAgICAgY2FzZSAnVU5NVVRFJzpcbiAgICAgICAgICByZXR1cm4gdW5NdXRlKGVsdCk7XG4gICAgICAgIGNhc2UgJ1RPR0dMRV9NVVRFX1VOTVVURSc6XG4gICAgICAgICAgcmV0dXJuIHRvZ2dsZU11dGUoZWx0KTtcbiAgICAgICAgY2FzZSAnUExBWSc6XG4gICAgICAgICAgcmV0dXJuIHBsYXkoZWx0KTtcbiAgICAgICAgY2FzZSAnUEFVU0UnOlxuICAgICAgICAgIHJldHVybiBwYXVzZShlbHQpO1xuICAgICAgICBjYXNlICdUT0dHTEVfUExBWV9QQVVTRSc6XG4gICAgICAgICAgcmV0dXJuIHRvZ2dsZVBsYXkoZWx0KTtcbiAgICAgICAgY2FzZSAnU0tJUF9CQUNLV0FSRCc6XG4gICAgICAgICAgcmV0dXJuIHNlZWtCYWNrd2FyZChlbHQsIGFjdGlvbi5hbW91bnRUb1NraXApO1xuICAgICAgICBjYXNlICdTS0lQX0ZPUldBUkQnOlxuICAgICAgICAgIHJldHVybiBzZWVrRm9yd2FyZChlbHQsIGFjdGlvbi5hbW91bnRUb1NraXApO1xuICAgICAgICBjYXNlICdTS0lQX1RPJzpcbiAgICAgICAgICByZXR1cm4gc2Vla1RvKGVsdCwgYWN0aW9uLm5ld1RpbWVzdGFtcCk7XG4gICAgICB9XG4gICAgfVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKCkgPT4gY29uc29sZS53YXJuKCdBY3Rpb24gbm90IGltcGxlbWVudGVkIHlldDogJyArIGFjdGlvbi50eXBlKTtcbiAgfVxuICByZXR1cm4gKCkgPT4ge307XG59XG5cbmxldCBvdmVybGF5U3RhY2taSW5kZXggPSA5OTk5O1xuXG5mdW5jdGlvbiB0b0V4ZWN1dGFibGVBbmltYXRpb25zKFxuICBvcmlnQW5pbWF0aW9uczogQW5pbWF0aW9uW10sXG4gIGVhc2luZyA9ICdsaW5lYXInLFxuICBkdXJhdGlvbjogbnVtYmVyLFxuICBib3VuZDogQm91bmRFbGVtZW50LFxuICB0cmlnZ2VyOiBUcmlnZ2VyVHlwZSxcbiAgZGVidWc6IHN0cmluZyxcbiAgbW9kYWw/OiBIVE1MRWxlbWVudFxuKTogUmV2ZXJ0YWJsZUV2ZW50Q2FsbGJhY2sge1xuICByZXR1cm4gKGUpID0+IHtcbiAgICAvLyBsb2NhbCBjb3B5IG9mIGFuaW1hdGlvbnMsIHNvIHdlIGNhbiBtb2RpZnkgaXQgKGUuZy4gei1pbmRleCBiZWxvdylcbiAgICBsZXQgYW5pbWF0aW9ucyA9IG9yaWdBbmltYXRpb25zO1xuICAgIGlmIChtb2RhbCkge1xuICAgICAgLy8gc2V0IG1haW4gc2Nyb2xsIGxvY2sgd2hlbiBtb2RhbCBpcyBvcGVuZWRcbiAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50RWxlbWVudCEuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcbiAgICAgIC8vIGVuc3VyZSBvdmVybGF5cyBhcmUgc3RhY2tlZCBvbnRvIGVhY2ggb3RoZXJcbiAgICAgIGFuaW1hdGlvbnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbHRJZDogbW9kYWwuaWQsXG4gICAgICAgICAgcHJvcHM6IFt7IGtleTogJ3otaW5kZXgnLCBmcm9tOiAwLCB0bzogb3ZlcmxheVN0YWNrWkluZGV4KysgfV0sXG4gICAgICAgIH0sXG4gICAgICAgIC4uLmFuaW1hdGlvbnMsXG4gICAgICBdO1xuICAgIH1cbiAgICBjb25zdCByZXZlcnNlQW5pbWF0aW9ucyA9IGV4ZWN1dGVBbmltYXRpb25zKFxuICAgICAgYW5pbWF0aW9ucyxcbiAgICAgIGVhc2luZyxcbiAgICAgIGR1cmF0aW9uLFxuICAgICAgYm91bmQsXG4gICAgICB0cmlnZ2VyLFxuICAgICAgZGVidWcsXG4gICAgICBlXG4gICAgKTtcbiAgICBjb25zdCBjbG9zZSA9IG9uY2U8RXZlbnRDYWxsYmFjaz4oKF8sIGkpOiB2b2lkID0+IHtcbiAgICAgIGlmIChtb2RhbCkge1xuICAgICAgICBvdmVybGF5U3RhY2taSW5kZXgtLTtcbiAgICAgICAgLy8gdW5zZXQgbWFpbiBzY3JvbGwgbG9jayB3aGVuIG1vZGFsIGlzIGNsb3NlZFxuICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudEVsZW1lbnQhLnN0eWxlLm92ZXJmbG93ID0gJyc7XG4gICAgICB9XG4gICAgICBleGVjdXRlQW5pbWF0aW9ucyhcbiAgICAgICAgcmV2ZXJzZUFuaW1hdGlvbnMsXG4gICAgICAgIGVhc2luZyxcbiAgICAgICAgaSA/IDAgOiBkdXJhdGlvbixcbiAgICAgICAgYm91bmQsXG4gICAgICAgIHRyaWdnZXIsXG4gICAgICAgIGAke2RlYnVnfShyZXZlcnQpYFxuICAgICAgKTtcbiAgICB9KTtcbiAgICBpZiAobW9kYWwpIG1vZGFsLmYyd19jbG9zZSA9IGNsb3NlO1xuICAgIHJldHVybiBjbG9zZTtcbiAgfTtcbn1cblxuLy8gSWYgYSBjaGlsZCBlbHQgaGFzIGEgaG92ZXIgZWZmZWN0LCBhbmQgcGFyZW50IGhhcyBzd2FwIChvbiBjbGljaykgZWZmZWN0LCB3ZSBuZWVkIHRvIHRyYWNrIHRoZSBjaGlsZCdzIGFsdCBlbGVtZW50IHRvIHJlcGxhY2UgaXRcbmNvbnN0IGVsdFRvQWx0TWFwcGluZ3MgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXG5mdW5jdGlvbiBleGVjdXRlQW5pbWF0aW9ucyhcbiAgYW5pbWF0aW9uczogQW5pbWF0aW9uW10sXG4gIGVhc2luZzogc3RyaW5nLFxuICBkdXJhdGlvbjogbnVtYmVyLFxuICBib3VuZDogQm91bmRFbGVtZW50LFxuICB0cmlnZ2VyOiBUcmlnZ2VyVHlwZSxcbiAgZGVidWc6IHN0cmluZyxcbiAgZT86IEV2ZW50XG4pOiBBbmltYXRpb25bXSB7XG4gIC8vIFRPRE8gdXNlIHZpZXcgdHJhbnNpdGlvbiBpZiBhdmFpbGFibGVcbiAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgY29uc29sZS5kZWJ1ZyhgRXhlY3V0aW5nIGFuaW1hdGlvbnMgKCR7ZGVidWd9KWAsIGFuaW1hdGlvbnMsIGJvdW5kKTtcbiAgfVxuICBjb25zdCByZXZlcnNlOiBBbmltYXRpb25bXSA9IFtdO1xuICBjb25zdCBjb250YWluZXJzVG9SZU9yZGVyID0gbmV3IFNldDxIVE1MRWxlbWVudD4oKTtcblxuICBpZiAodHJpZ2dlciA9PT0gJ2RyYWcnKSB7XG4gICAgZXhlY3V0ZURyYWdTdGFydChcbiAgICAgIGFuaW1hdGlvbnMsXG4gICAgICBlYXNpbmcsXG4gICAgICBkdXJhdGlvbixcbiAgICAgIGJvdW5kLFxuICAgICAgKGUgYXMgQ3VzdG9tRXZlbnQ8RHJhZ2dpbmc+KS5kZXRhaWxcbiAgICApO1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGZvciAoY29uc3QgeyBlbHRJZCwgYWx0SWQsIHByb3BzLCByZWFjdGlvbnMgfSBvZiBhbmltYXRpb25zKSB7XG4gICAgbGV0IGVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsdElkKTtcbiAgICBpZiAoIWVsdCkge1xuICAgICAgY29uc3QgZWx0SWQyID0gZWx0VG9BbHRNYXBwaW5ncy5nZXQoZWx0SWQpO1xuICAgICAgaWYgKGVsdElkMikge1xuICAgICAgICBlbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbHRJZDIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWVsdCkge1xuICAgICAgc2hvdWxkTm90SGFwcGVuKGBDYW4ndCBmaW5kIGVsZW1lbnQgZm9yIGlkOiAke2VsdElkfWApO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChhbHRJZCkge1xuICAgICAgbGV0IGFsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFsdElkKSBhcyBCb3VuZEVsZW1lbnQ7XG4gICAgICBpZiAoIWFsdCkge1xuICAgICAgICBjb25zdCBhbHRUcGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZW1wbGF0ZUlkKGFsdElkKSk7XG4gICAgICAgIGlmICghYWx0VHBsKSB7XG4gICAgICAgICAgc2hvdWxkTm90SGFwcGVuKGBDYW4ndCBmaW5kIHRlbXBsYXRlIGZvciBpZDogJHthbHRJZH1gKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbHRGcmFnbWVudCA9IChhbHRUcGwgYXMgSFRNTFRlbXBsYXRlRWxlbWVudCkuY29udGVudD8uY2xvbmVOb2RlKFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgYWx0ID0gYWx0RnJhZ21lbnQucXVlcnlTZWxlY3RvcignKicpIGFzIEJvdW5kRWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgLy8gaWYgcHJldmlvdXMgZWxlbWVudCBoYWQgY2xlYW51cCBjYWxsYmFja3MsIGhvb2sgdGhlbSBpbnRvIHRoZSByZXBsYWNlZCBlbGVtZW50cyBpbnN0ZWFkXG4gICAgICBjb25zdCB7IGYyd19tb3VzZXVwIH0gPSBlbHQ7XG4gICAgICBjb25zdCBtb3VzZWxlYXZlID0gZWx0LmYyd19tb3VzZWxlYXZlX3JlbW92ZT8uKCk7XG4gICAgICBpZiAobW91c2VsZWF2ZSkge1xuICAgICAgICBpbnN0YWxsTW91c2VMZWF2ZShhbHQsIG1vdXNlbGVhdmUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZjJ3X21vdXNldXApIGFsdC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZjJ3X21vdXNldXApO1xuICAgICAgLy8gSG1tbSBtYXliZSBuZWVkIHRvIHRyYW5zZmVyIHRoZSB0aW1lb3V0IGNsZWFudXAgYXMgd2VsbCA/IG5vdCBzdXJlXG4gICAgICAvLyBpZiAoZjJ3X2NsZWFudXBfdGltZW91dCkgYWx0LmYyd19jbGVhbnVwX3RpbWVvdXQgPSBmMndfY2xlYW51cF90aW1lb3V0O1xuICAgICAgaWYgKG1vdXNlbGVhdmUgfHwgZjJ3X21vdXNldXApIHtcbiAgICAgICAgLy8gZW5zdXJlcyB0aGUgYWx0IGVsZW1lbnQgd2lsbCBhY3R1YWxseSByZWNlaXZlZCBtb3VzZSBldmVudHNcbiAgICAgICAgcmVtb3ZlUG9pbnRlckV2ZW50c05vbmUoYWx0KTtcbiAgICAgIH1cbiAgICAgIC8vIGluc3RhbGwgZXZlbnQgaGFuZGxlcnMgZm9yIG5ldyBlbGVtZW50XG4gICAgICBob29rKGFsdCwgdHJ1ZSwgZHVyYXRpb24pO1xuICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgIGVsdC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2FmdGVyZW5kJywgYWx0KTtcbiAgICAgICAgLy8gRmlnbWEgZGlzc29sdmVzIG9ubHkgZGlzc29sdmVzIHRoZSBkZXN0aW5hdGlvbiBvbiB0b3Agb2YgdGhlIHNvdXJjZSBsYXllciwgc28gd2UgbmVlZCB0byBkbyB0aGUgc2FtZVxuICAgICAgICBhbmltYXRlUHJvcHMoXG4gICAgICAgICAgZWx0LFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAnZGlzcGxheScsXG4gICAgICAgICAgICAgIGZyb206IGdldENvbXB1dGVkU3R5bGUoZWx0KS5kaXNwbGF5LFxuICAgICAgICAgICAgICB0bzogJ25vbmUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGVhc2luZyxcbiAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICBjb250YWluZXJzVG9SZU9yZGVyXG4gICAgICAgICk7XG4gICAgICAgIGFuaW1hdGVQcm9wcyhcbiAgICAgICAgICBhbHQsXG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdvcGFjaXR5JyxcbiAgICAgICAgICAgICAgZnJvbTogMCxcbiAgICAgICAgICAgICAgdG86ICdyZXZlcnQtbGF5ZXInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAga2V5OiAnZGlzcGxheScsXG4gICAgICAgICAgICAgIGZyb206ICdub25lJyxcbiAgICAgICAgICAgICAgdG86ICdyZXZlcnQtbGF5ZXInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGVhc2luZyxcbiAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgICBjb250YWluZXJzVG9SZU9yZGVyXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbHQucGFyZW50RWxlbWVudCEucmVwbGFjZUNoaWxkKGFsdCwgZWx0KTtcbiAgICAgICAgbGV0IGVsdFRwbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRlbXBsYXRlSWQoZWx0SWQpKTtcbiAgICAgICAgaWYgKCFlbHRUcGwpIHtcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoYEJhY2tpbmcgdXAgZWxlbWVudCBiZWZvcmUgc3dhcCwgaWQ6ICR7ZWx0SWR9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGJhY2t1cCBlbGVtZW50IGluIGNhc2Ugd2UgbmVlZCB0byByZXZlcnQgYmFjayB0byBpdFxuICAgICAgICAgIGVsdFRwbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICAgICAgZWx0VHBsLmlkID0gdGVtcGxhdGVJZChlbHRJZCk7XG4gICAgICAgICAgZWx0VHBsLmlubmVySFRNTCA9IGVsdC5vdXRlckhUTUw7XG4gICAgICAgICAgYWx0Lmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJlbmQnLCBlbHRUcGwpO1xuICAgICAgICB9XG4gICAgICAgIGVsdFRvQWx0TWFwcGluZ3Muc2V0KGVsdElkLCBhbHQuaWQpO1xuICAgICAgfVxuICAgICAgcmV2ZXJzZS5wdXNoKHtcbiAgICAgICAgZWx0SWQ6IGFsdC5pZCxcbiAgICAgICAgYWx0SWQ6IGVsdC5pZCxcbiAgICAgIH0pO1xuICAgICAgLy8gcmUtcG9zaXRpb24gdGhlIGNoaWxkIGF0IHRoZSByaWdodCBwbGFjZSBpbiB0aGUgcGFyZW50XG4gICAgICBpZiAoIWlzTmFOKCtnZXRDb21wdXRlZFN0eWxlKGFsdCkuZ2V0UHJvcGVydHlWYWx1ZSgnLS1mMnctb3JkZXInKSkpIHtcbiAgICAgICAgY29udGFpbmVyc1RvUmVPcmRlci5hZGQoYWx0LnBhcmVudEVsZW1lbnQhKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3VycmVudFByb3BzID0gKHByb3BzIHx8IFtdKVxuICAgICAgICAubWFwKChpdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZyb20gPSBtYXBDdXJyZW50KGVsdCEsIGl0LmtleSwgaXQuZnJvbSk7XG4gICAgICAgICAgY29uc3QgdG8gPSBtYXBDdXJyZW50KGVsdCEsIGl0LmtleSwgaXQudG8pO1xuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGtleTogaXQua2V5LFxuICAgICAgICAgICAgcHNldWRvOiBpdC5wc2V1ZG8sXG4gICAgICAgICAgICBmcm9tLFxuICAgICAgICAgICAgdG8sXG4gICAgICAgICAgfTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcigoaXQpID0+IGl0LmZyb20gIT09IGl0LnRvKTtcblxuICAgICAgYW5pbWF0ZVByb3BzKGVsdCwgY3VycmVudFByb3BzLCBlYXNpbmcsIGR1cmF0aW9uLCBjb250YWluZXJzVG9SZU9yZGVyKTtcbiAgICAgIGlmIChyZWFjdGlvbnMpIHtcbiAgICAgICAgaWYgKHRyaWdnZXIgIT09ICdob3ZlcicpIHtcbiAgICAgICAgICBlbHQuZjJ3X21vdXNlbGVhdmVfcmVtb3ZlPy4oKTtcbiAgICAgICAgfVxuICAgICAgICByZWFjdGlvbnMuZm9yRWFjaCgoaXQpID0+IGhvb2tFbHQoZWx0ISwgaXQudHlwZSwgaXQudG8sIGR1cmF0aW9uKSk7XG4gICAgICB9XG4gICAgICBjb25zdCByZXY6IEFuaW1hdGlvbiA9IHtcbiAgICAgICAgZWx0SWQsXG4gICAgICAgIHByb3BzOiBjdXJyZW50UHJvcHMubWFwKChwKSA9PiB7XG4gICAgICAgICAgY29uc3QgcmV0OiBBbmltYXRlZFByb3AgPSB7XG4gICAgICAgICAgICBrZXk6IHAua2V5LFxuICAgICAgICAgICAgZnJvbTogcC50byxcbiAgICAgICAgICAgIHRvOiBwLmZyb20sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAocC5wc2V1ZG8pIHJldC5wc2V1ZG8gPSBwLnBzZXVkbztcbiAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9KSxcbiAgICAgIH07XG4gICAgICBpZiAocmVhY3Rpb25zKSB7XG4gICAgICAgIHJldi5yZWFjdGlvbnMgPSByZWFjdGlvbnMubWFwKChpdCkgPT4gKHtcbiAgICAgICAgICB0eXBlOiBpdC50eXBlLFxuICAgICAgICAgIGZyb206IGl0LnRvLFxuICAgICAgICAgIHRvOiBpdC5mcm9tLFxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgICByZXZlcnNlLnB1c2gocmV2KTtcbiAgICB9XG4gIH1cbiAgZm9yIChjb25zdCBjb250YWluZXIgb2YgY29udGFpbmVyc1RvUmVPcmRlcikge1xuICAgIC8vIFRPRE8gZ2VuZXJhdGUgbWluaW11bSBzZXQgb2YgbW92ZXMgcmVxdWlyZWQ/ICh1c2luZyBpbnNlcnRCZWZvcmUgYW5kIHNvbWUgJ0xvbmdlc3QgSW5jcmVhc2luZyBTdWJzZXF1ZW5jZScgYWxnb3JpdGhtKVxuICAgIGNvbnN0IGNoaWxkcmVuID0gQXJyYXkuZnJvbShjb250YWluZXIuY2hpbGRyZW4pLm1hcCgoaXQsIGkpID0+ICh7IGl0LCBpIH0pKTtcbiAgICBsZXQgb3JkZXJIYXNDaGFuZ2VkID0gZmFsc2U7XG4gICAgY2hpbGRyZW5cbiAgICAgIC5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgIGNvbnN0IGFPcmRlciA9ICsoXG4gICAgICAgICAgZ2V0Q29tcHV0ZWRTdHlsZShhLml0KS5nZXRQcm9wZXJ0eVZhbHVlKCctLWYydy1vcmRlcicpIHx8ICc5OTk5OSdcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgYk9yZGVyID0gKyhcbiAgICAgICAgICBnZXRDb21wdXRlZFN0eWxlKGIuaXQpLmdldFByb3BlcnR5VmFsdWUoJy0tZjJ3LW9yZGVyJykgfHwgJzk5OTk5J1xuICAgICAgICApO1xuICAgICAgICByZXR1cm4gYU9yZGVyIC0gYk9yZGVyO1xuICAgICAgfSlcbiAgICAgIC5mb3JFYWNoKChjaGlsZCwgaikgPT4ge1xuICAgICAgICBpZiAob3JkZXJIYXNDaGFuZ2VkKSB7XG4gICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkLml0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBhdm9pZCBtb3ZpbmcgYWxyZWFkeSBvcmRlcmVkIGVsZW1lbnRzLCBzYXZlcyBtb3N0IG9mIHRoZSByZWZsb3cgd2l0aG91dCBtdWNoIGNvbXBsZXhpdHlcbiAgICAgICAgICBvcmRlckhhc0NoYW5nZWQgPSBqICE9PSBjaGlsZC5pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuICByZXR1cm4gcmV2ZXJzZTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlUG9pbnRlckV2ZW50c05vbmUoZWx0OiBCb3VuZEVsZW1lbnQpOiB2b2lkIHtcbiAgbGV0IGU6IEJvdW5kRWxlbWVudCB8IG51bGwgPSBlbHQ7XG4gIHdoaWxlIChlKSB7XG4gICAgZS5jbGFzc0xpc3QucmVtb3ZlKCdwb2ludGVyLWV2ZW50cy1ub25lJyk7XG4gICAgZSA9IGUucGFyZW50RWxlbWVudDtcbiAgfVxufVxuXG5mdW5jdGlvbiBleGVjdXRlRHJhZ1N0YXJ0KFxuICBhbmltYXRpb25zOiBBbmltYXRpb25bXSxcbiAgZWFzaW5nOiBzdHJpbmcsXG4gIGR1cmF0aW9uOiBudW1iZXIsXG4gIGJvdW5kOiBCb3VuZEVsZW1lbnQsXG4gIGRyYWdnaW5nOiBEcmFnZ2luZ1xuKTogdm9pZCB7XG4gIGlmIChkcmFnZ2luZy5oYW5kbGVkKSByZXR1cm47XG4gIC8vIHRlbXBvcmFyeSBleGVjdXRlIGFuaW1hdGlvbnMgdG8gZ2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHN0YXJ0IGFuZCBlbmRcbiAgY29uc3QgcmVjdDEgPSBib3VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgcmV2ID0gZXhlY3V0ZUFuaW1hdGlvbnMoXG4gICAgYW5pbWF0aW9uc1xuICAgICAgLmZpbHRlcigoaXQpID0+IGl0LnByb3BzKVxuICAgICAgLm1hcCgoeyBlbHRJZCwgcHJvcHMgfSkgPT4gKHsgZWx0SWQsIHByb3BzIH0pKSxcbiAgICAnbGluZWFyJyxcbiAgICAwLFxuICAgIGJvdW5kLFxuICAgICdjbGljaycsXG4gICAgYGRyYWdfc3RhcnQodG1wKWBcbiAgKTtcbiAgY29uc3QgcmVjdDIgPSBib3VuZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgZGlmZlggPSByZWN0Mi5sZWZ0IC0gcmVjdDEubGVmdDtcbiAgY29uc3QgZGlmZlkgPSByZWN0Mi50b3AgLSByZWN0MS50b3A7XG4gIGNvbnN0IGxlbmd0aCA9IE1hdGguc3FydChkaWZmWCAqIGRpZmZYICsgZGlmZlkgKiBkaWZmWSk7XG4gIC8vIHJldmVydCB0ZW1wIGNoYW5nZXNcbiAgZXhlY3V0ZUFuaW1hdGlvbnMocmV2LCAnbGluZWFyJywgMCwgYm91bmQsICdjbGljaycsIGBkcmFnX3N0YXJ0KHRtcCB1bmRvKWApO1xuICBjb25zdCB7IHg6IGRpc3RYLCB5OiBkaXN0WSB9ID0gZ2V0RGlzdGFuY2UoZHJhZ2dpbmcuc3RhcnQsIGRyYWdnaW5nLmVuZCk7XG4gIGNvbnN0IGFjY2VwdHNEcmFnRGlyZWN0aW9uID1cbiAgICAoZGlzdFggPiAwICYmIGRpZmZYID4gMCkgfHxcbiAgICAoZGlzdFggPCAwICYmIGRpZmZYIDwgMCkgfHxcbiAgICAoZGlmZlggPT09IDAgJiYgKChkaXN0WSA+IDAgJiYgZGlmZlkgPiAwKSB8fCAoZGlzdFkgPCAwICYmIGRpZmZZIDwgMCkpKTtcbiAgaWYgKGFjY2VwdHNEcmFnRGlyZWN0aW9uKSB7XG4gICAgZHJhZ2dpbmcuaGFuZGxlZCA9IHRydWU7XG4gICAgY29uc3QgZHJhZ0FuaW1zID0gYW5pbWF0aW9ucy5tYXAoKGl0KSA9PiAoe1xuICAgICAgLi4uaXQsXG4gICAgICBzd2FwcGVkOiBmYWxzZSxcbiAgICAgIHByb3BzOiBpdC5wcm9wcz8ubWFwKChwKSA9PiAoeyAuLi5wLCBjdXJyOiBwLmZyb20gfSkpLFxuICAgIH0pKTtcbiAgICBjb25zdCBnZXRQZXJjZW50ID0gKGQ6IERyYWdnaW5nKTogbnVtYmVyID0+IHtcbiAgICAgIGNvbnN0IHsgeDogZGlzdFgsIHk6IGRpc3RZIH0gPSBnZXREaXN0YW5jZShkLnN0YXJ0LCBkLmVuZCk7XG4gICAgICBjb25zdCBkaXN0ID0gKGRpc3RYICogZGlmZlggKyBkaXN0WSAqIGRpZmZZKSAvIGxlbmd0aDtcbiAgICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsICgxMDAgKiBkaXN0KSAvIGxlbmd0aCkpO1xuICAgIH07XG4gICAgY29uc3QgbW92ZSA9IChkOiBEcmFnZ2luZyk6IHZvaWQgPT4ge1xuICAgICAgZC5lbmQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGQuZW5kLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgY29uc3QgcGVyY2VudCA9IGdldFBlcmNlbnQoZCk7XG4gICAgICBleGVjdXRlQW5pbWF0aW9ucyhcbiAgICAgICAgZmlsdGVyRW1wdHkoXG4gICAgICAgICAgZHJhZ0FuaW1zLm1hcCgoaXQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcmVhY3Rpb25zOiBfLCAuLi5yZXN0IH0gPSBpdDtcbiAgICAgICAgICAgIGlmIChpdC5wcm9wcykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIC4uLnJlc3QsXG4gICAgICAgICAgICAgICAgcHJvcHM6IGl0LnByb3BzLm1hcCgocCkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgdG8gPSBpbnRlcnBvbGF0ZShwLCBwZXJjZW50KTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGZyb20gPSBwLmN1cnI7XG4gICAgICAgICAgICAgICAgICBwLmN1cnIgPSB0bztcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnAsXG4gICAgICAgICAgICAgICAgICAgIGZyb20sXG4gICAgICAgICAgICAgICAgICAgIHRvLFxuICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdC5hbHRJZCkge1xuICAgICAgICAgICAgICBpZiAocGVyY2VudCA8IDUwICYmIGl0LnN3YXBwZWQpIHtcbiAgICAgICAgICAgICAgICBpdC5zd2FwcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgYWx0SWQ6IGl0LmVsdElkLCBlbHRJZDogaXQuYWx0SWQgfTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAocGVyY2VudCA+PSA1MCAmJiAhaXQuc3dhcHBlZCkge1xuICAgICAgICAgICAgICAgIGl0LnN3YXBwZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN0O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgIH0pXG4gICAgICAgICksXG4gICAgICAgICdsaW5lYXInLFxuICAgICAgICAwLFxuICAgICAgICBib3VuZCxcbiAgICAgICAgJ2NsaWNrJyxcbiAgICAgICAgYGRyYWdnaW5nYFxuICAgICAgKTtcbiAgICB9O1xuICAgIG1vdmUoZHJhZ2dpbmcpO1xuICAgIGJvdW5kLmYyd19kcmFnX2xpc3RlbmVyID0gKGQ6IERyYWdnaW5nKSA9PiB7XG4gICAgICBtb3ZlKGQpO1xuICAgICAgaWYgKGQuZmluaXNoZWQpIHtcbiAgICAgICAgY29uc3QgcGVyY2VudCA9IGdldFBlcmNlbnQoZCk7XG4gICAgICAgIGV4ZWN1dGVBbmltYXRpb25zKFxuICAgICAgICAgIGZpbHRlckVtcHR5KFxuICAgICAgICAgICAgZHJhZ0FuaW1zLm1hcCgoaXQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGl0LnByb3BzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVhY3Rpb25zID0gcGVyY2VudCA8IDUwID8gdW5kZWZpbmVkIDogaXQucmVhY3Rpb25zO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICBlbHRJZDogaXQuZWx0SWQsXG4gICAgICAgICAgICAgICAgICBwcm9wczogaXQucHJvcHMubWFwKChwKSA9PiAoe1xuICAgICAgICAgICAgICAgICAgICAuLi5wLFxuICAgICAgICAgICAgICAgICAgICBmcm9tOiBwLmN1cnIsXG4gICAgICAgICAgICAgICAgICAgIHRvOiBwZXJjZW50IDwgNTAgPyBwLmZyb20gOiBwLnRvLFxuICAgICAgICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgICAgICAgcmVhY3Rpb25zLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGl0LmFsdElkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnQgPCA1MCAmJiBpdC5zd2FwcGVkKSB7XG4gICAgICAgICAgICAgICAgICBpdC5zd2FwcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICByZXR1cm4geyBhbHRJZDogaXQuZWx0SWQsIGVsdElkOiBpdC5hbHRJZCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudCA+PSA1MCAmJiAhaXQuc3dhcHBlZCkge1xuICAgICAgICAgICAgICAgICAgaXQuc3dhcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gaXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICksXG4gICAgICAgICAgZWFzaW5nLFxuICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgIGJvdW5kLFxuICAgICAgICAgICdjbGljaycsXG4gICAgICAgICAgYGRyYWdfZW5kYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwQ3VycmVudChcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIGtleTogc3RyaW5nLFxuICB2OiBBbmltYXRlZFByb3BbJ2Zyb20nXVxuKTogQW5pbWF0ZWRQcm9wWydmcm9tJ10ge1xuICBpZiAodiAhPT0gJyRjdXJyZW50JykgcmV0dXJuIHY7XG4gIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKGVsdCkuZ2V0UHJvcGVydHlWYWx1ZShrZXkpO1xufVxuXG5mdW5jdGlvbiBob29rKFxuICByb290OiBQYXJlbnROb2RlLFxuICB3aXRoUm9vdCA9IGZhbHNlLFxuICBmcm9tQW5pbWF0aW9uRHVyYXRpb24gPSAwXG4pOiB2b2lkIHtcbiAgZm9yIChjb25zdCB0eXBlIG9mIHJlYWN0aW9uX3R5cGVzKSB7XG4gICAgZm9yIChjb25zdCBlbHQgb2YgcXVlcnlTZWxlY3RvckFsbEV4dChcbiAgICAgIHJvb3QgYXMgQm91bmRFbGVtZW50LFxuICAgICAgYFtkYXRhLXJlYWN0aW9uLSR7dHlwZX1dYCxcbiAgICAgIHdpdGhSb290XG4gICAgKSkge1xuICAgICAgaG9va0VsdChcbiAgICAgICAgZWx0IGFzIEJvdW5kRWxlbWVudCxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgZWx0LmdldEF0dHJpYnV0ZShgZGF0YS1yZWFjdGlvbi0ke3R5cGV9YCkhLFxuICAgICAgICBmcm9tQW5pbWF0aW9uRHVyYXRpb25cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHF1ZXJ5U2VsZWN0b3JBbGxFeHQoXG4gIHJvb3Q6IEJvdW5kRWxlbWVudCxcbiAgc2VsOiBzdHJpbmcsXG4gIGluY2x1ZGVSb290ID0gZmFsc2Vcbik6IEJvdW5kRWxlbWVudFtdIHtcbiAgY29uc3QgcmV0ID0gWy4uLnJvb3QucXVlcnlTZWxlY3RvckFsbChzZWwpXSBhcyBCb3VuZEVsZW1lbnRbXTtcbiAgaWYgKGluY2x1ZGVSb290ICYmIHJvb3QubWF0Y2hlcyhzZWwpKSB7XG4gICAgcmV0LnVuc2hpZnQocm9vdCk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxudHlwZSBUcmlnZ2VyRXZlbnQgPSBLZXlib2FyZEV2ZW50IHwgTW91c2VFdmVudCB8IERyYWdFdmVudDtcblxuZnVuY3Rpb24gaG9va0VsdChcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIHR5cGU6IFRyaWdnZXJUeXBlLFxuICB2ID0gJycsXG4gIGZyb21BbmltYXRpb25EdXJhdGlvbiA9IDBcbik6IHZvaWQge1xuICBpZiAoIXYpIHtcbiAgICBpZiAodHlwZSAhPT0gJ2hvdmVyJykge1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoYENsZWFudXAgaG9va3MgJHt0eXBlfSBvbmAsIGVsdCk7XG4gICAgICB9XG4gICAgICBjbGVhbnVwRXZlbnRMaXN0ZW5lcihlbHQsIHR5cGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICBsZXQgZGVsYXkgPSAwO1xuICBpZiAodlswXSA9PT0gJ1QnKSB7XG4gICAgY29uc3QgaWR4ID0gdi5pbmRleE9mKCdtcycpO1xuICAgIGRlbGF5ID0gcGFyc2VGbG9hdCh2LnNsaWNlKDEsIGlkeCkpIHx8IDA7XG4gICAgdiA9IHYuc2xpY2UoaWR4ICsgMyk7XG4gIH1cbiAgY29uc3QgcmVhY3Rpb25zID0gYWxsUmVhY3Rpb25zKCk7XG4gIGNvbnN0IGFjdGlvbnMgPSBmaWx0ZXJFbXB0eSh2LnNwbGl0KCcsJykubWFwKChpZCkgPT4gcmVhY3Rpb25zW2lkXSkpO1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBjb25zb2xlLmRlYnVnKGBTZXR1cCBob29rICR7dHlwZX0gb25gLCBlbHQsIGAtPmAsIGFjdGlvbnMpO1xuICB9XG4gIGNvbnN0IHJ1biA9IGFjdGlvbnNUb1J1bihhY3Rpb25zLCBlbHQsIHR5cGUpO1xuICBpZiAodHlwZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgc2V0VGltZW91dFdpdGhDbGVhbnVwKGVsdCwgKCkgPT4gcnVuKCksIGRlbGF5ICsgZnJvbUFuaW1hdGlvbkR1cmF0aW9uKTtcbiAgICByZXR1cm47XG4gIH1cbiAgcmVtb3ZlUG9pbnRlckV2ZW50c05vbmUoZWx0KTtcbiAgaWYgKHR5cGUgPT09ICdwcmVzcycpIHtcbiAgICAvLyBubyBkZWxheSBmb3IgcHJlc3NcbiAgICBsZXQgcmV2ZXJ0OiBFdmVudENhbGxiYWNrIHwgdW5kZWZpbmVkIHwgdm9pZCA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBtb3VzZXVwID0gKCk6IHZvaWQgPT4ge1xuICAgICAgcmV2ZXJ0Py4oKTtcbiAgICAgIHJldmVydCA9IHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIGVsdC5mMndfbW91c2V1cCA9IG1vdXNldXA7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcldpdGhDbGVhbnVwKFxuICAgICAgZWx0LFxuICAgICAgJ21vdXNlZG93bicsXG4gICAgICAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICByZXZlcnQ/LigpO1xuICAgICAgICByZXZlcnQgPSBydW4oZSk7XG4gICAgICB9LFxuICAgICAgdHlwZSxcbiAgICAgIGF0dGFjaExpc3RlbmVyKGVsdCwgJ21vdXNldXAnLCBtb3VzZXVwKVxuICAgICk7XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ2RyYWcnKSB7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcldpdGhDbGVhbnVwKFxuICAgICAgZWx0LFxuICAgICAgJ2RyYWdnaW5nJyBhcyBhbnksXG4gICAgICAoZTogQ3VzdG9tRXZlbnQ8RHJhZ2dpbmc+KSA9PiB7XG4gICAgICAgIHJ1bihlKTtcbiAgICAgIH0sXG4gICAgICB0eXBlXG4gICAgKTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnaG92ZXInKSB7XG4gICAgLy8gbm8gZGVsYXkgZm9yIGhvdmVyXG4gICAgbGV0IHJldmVydDogRXZlbnRDYWxsYmFjayB8IHVuZGVmaW5lZCB8IHZvaWQgPSB1bmRlZmluZWQ7XG4gICAgY29uc3QgcnVuSWZOb3RBbHJlYWR5ID0gKGU/OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB7XG4gICAgICBpZiAoIXJldmVydCkgcmV2ZXJ0ID0gb25jZShydW4oZSkpO1xuICAgIH07XG4gICAgY29uc3QgcHJldiA9IGVsdC5mMndfbW91c2VsZWF2ZV9yZW1vdmU/LigpO1xuICAgIGNvbnN0IG1vdXNlbGVhdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgICByZXZlcnQ/LigpO1xuICAgICAgcmV2ZXJ0ID0gdW5kZWZpbmVkO1xuICAgICAgcHJldj8uKCk7XG4gICAgfTtcbiAgICAvLyBpZiB0aGUgbW91c2UgaXMgYWxyZWFkeSBvbiBpdCwgJ2VudGVyJyB3b24ndCBmaXJlIGFnYWluLCBlbnN1cmUgd2UgZ2V0IHRyaWdnZXJlZCBhcyBzb29uIGFzIHRoZSBtb3VzZSBtb3Zlc1xuICAgIGNvbnN0IHRpbWVySWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmIChlbHQubWF0Y2hlcygnOmhvdmVyJykpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnICYmICFyZXZlcnQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgRm9yY2luZyBob3ZlciBvbiB0aW1lb3V0YCk7XG4gICAgICAgIH1cbiAgICAgICAgcnVuSWZOb3RBbHJlYWR5KCk7XG4gICAgICB9XG4gICAgfSwgZnJvbUFuaW1hdGlvbkR1cmF0aW9uKTtcbiAgICBjb25zdCBtb3VzZWxlYXZlX3JlbW92ZSA9IGluc3RhbGxNb3VzZUxlYXZlKGVsdCwgbW91c2VsZWF2ZSwgdGltZXJJZCk7XG4gICAgYWRkRXZlbnRMaXN0ZW5lcldpdGhDbGVhbnVwKFxuICAgICAgZWx0LFxuICAgICAgJ21vdXNlZW50ZXInLFxuICAgICAgcnVuSWZOb3RBbHJlYWR5LFxuICAgICAgdHlwZSxcbiAgICAgIG1vdXNlbGVhdmVfcmVtb3ZlXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZSA9PT0gJ2tleWRvd24nICYmICFlbHQuZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpKSB7XG4gICAgICAvLyB0YWJpbmRleCByZXF1aXJlZCB0byBjYXB0dXJlIGtleWRvd25cbiAgICAgIGVsdC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnYXBwZWFyJykge1xuICAgICAgYXBwZWFyT2JzZXJ2ZXIub2JzZXJ2ZShlbHQpO1xuICAgIH1cbiAgICBhZGRFdmVudExpc3RlbmVyV2l0aENsZWFudXAoXG4gICAgICBlbHQsXG4gICAgICB0eXBlIGFzIGFueSxcbiAgICAgIChlOiBUcmlnZ2VyRXZlbnQpID0+IHtcbiAgICAgICAgaWYgKHR5cGUgIT09ICdrZXlkb3duJykge1xuICAgICAgICAgIC8vIERvbid0IHVzZSBlLnByZXZlbnREZWZhdWx0IGJlY2F1c2UgdGFyZ2V0IGVsZW1lbnRzIGNhbiBjb250YWluIG5lc3RlZCBjaGlsZHJlbixcbiAgICAgICAgICAvLyBpLmUgYW5jaG9yIHRhZ3MgaW5zaWRlIGFuIG92ZXJsYXkgd2hpY2ggd2lsbCBicmVhayBpZiB3ZSBkbyBlLnByZXZlbnREZWZhdWx0LlxuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVE9ETyBjb25maXJtIHdoZXRoZXIgYSBkZWxheWVkIGV2ZW50IGNhbiBiZSBjYW5jZWxlZCBieSBzd2FwcGluZyBvciBub3QgKGluIHdoaWNoIGNhc2Ugc2hvdWxkIGNhbmNlbCB0aGUgdGltZW91dClcbiAgICAgICAgaWYgKGRlbGF5KSBzZXRUaW1lb3V0KCgpID0+IHJ1bihlKSwgZGVsYXkpO1xuICAgICAgICBlbHNlIHJ1bihlKTtcbiAgICAgIH0sXG4gICAgICB0eXBlXG4gICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnN0YWxsTW91c2VMZWF2ZShcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIG1vdXNlbGVhdmU6ICgpID0+IHZvaWQsXG4gIHRpbWVySWQgPSAwXG4pOiAoKSA9PiAoKSA9PiB2b2lkIHtcbiAgY29uc3QgdW5zdWIgPSBhdHRhY2hMaXN0ZW5lcihlbHQsICdtb3VzZWxlYXZlJywgbW91c2VsZWF2ZSk7XG4gIGNvbnN0IG1vdXNlbGVhdmVfcmVtb3ZlID0gKCk6ICgoKSA9PiB2b2lkKSA9PiB7XG4gICAgdW5zdWIoKTtcbiAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgaWYgKGVsdC5mMndfbW91c2VsZWF2ZSA9PT0gbW91c2VsZWF2ZSkgZGVsZXRlIGVsdC5mMndfbW91c2VsZWF2ZTtcbiAgICBpZiAoZWx0LmYyd19tb3VzZWxlYXZlX3JlbW92ZSA9PT0gbW91c2VsZWF2ZV9yZW1vdmUpXG4gICAgICBkZWxldGUgZWx0LmYyd19tb3VzZWxlYXZlX3JlbW92ZTtcbiAgICByZXR1cm4gbW91c2VsZWF2ZTtcbiAgfTtcbiAgZWx0LmYyd19tb3VzZWxlYXZlID0gbW91c2VsZWF2ZTtcbiAgcmV0dXJuIChlbHQuZjJ3X21vdXNlbGVhdmVfcmVtb3ZlID0gbW91c2VsZWF2ZV9yZW1vdmUpO1xufVxuXG5mdW5jdGlvbiBpc091dHNpZGUoXG4gIHsgY2xpZW50WCwgY2xpZW50WSB9OiBQaWNrPE1vdXNlRXZlbnQsICdjbGllbnRYJyB8ICdjbGllbnRZJz4sXG4gIGJvdW5kOiBCb3VuZEVsZW1lbnRcbik6IGJvb2xlYW4ge1xuICBjb25zdCBCT1VORFNfWFRSQV9QSVhFTFMgPSAyO1xuICBjb25zdCB7IHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSB9ID0gYm91bmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHJldHVybiAoXG4gICAgY2xpZW50WCA+IHJpZ2h0ICsgQk9VTkRTX1hUUkFfUElYRUxTIHx8XG4gICAgY2xpZW50WCA8IGxlZnQgLSBCT1VORFNfWFRSQV9QSVhFTFMgfHxcbiAgICBjbGllbnRZID4gYm90dG9tICsgQk9VTkRTX1hUUkFfUElYRUxTIHx8XG4gICAgY2xpZW50WSA8IHRvcCAtIEJPVU5EU19YVFJBX1BJWEVMU1xuICApO1xufVxuXG5mdW5jdGlvbiBjbGVhbnVwRm5LZXlGb3JUeXBlKHR5cGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBgZjJ3X2NsZWFudXBfJHt0eXBlfWA7XG59XG5cbmZ1bmN0aW9uIHNldFRpbWVvdXRXaXRoQ2xlYW51cChcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIGZuOiAoKSA9PiB2b2lkLFxuICBkZWxheTogbnVtYmVyXG4pOiB2b2lkIHtcbiAgY29uc3QgdGltZXJJZCA9IHNldFRpbWVvdXQoZm4sIGRlbGF5KTtcbiAgZWx0LmYyd19jbGVhbnVwX3RpbWVvdXQ/LigpO1xuICBlbHQuZjJ3X2NsZWFudXBfdGltZW91dCA9ICgpID0+IHtcbiAgICBkZWxldGUgZWx0LmYyd19jbGVhbnVwX3RpbWVvdXQ7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBjbGVhbnVwRXZlbnRMaXN0ZW5lcihcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIHR5cGVGb3JDbGVhbnVwOiBUcmlnZ2VyVHlwZVxuKTogdm9pZCB7XG4gIGNvbnN0IGNsZWFudXBLZXkgPSBjbGVhbnVwRm5LZXlGb3JUeXBlKHR5cGVGb3JDbGVhbnVwKTtcbiAgKGVsdCBhcyBhbnkpW2NsZWFudXBLZXldPy4oKTtcbn1cblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcldpdGhDbGVhbnVwPFxuICBLIGV4dGVuZHMga2V5b2YgR2xvYmFsRXZlbnRIYW5kbGVyc0V2ZW50TWFwLFxuPihcbiAgZWx0OiBCb3VuZEVsZW1lbnQsXG4gIHR5cGU6IEssXG4gIGxpc3RlbmVyOiAoZXY6IEdsb2JhbEV2ZW50SGFuZGxlcnNFdmVudE1hcFtLXSkgPT4gYW55LFxuICB0eXBlRm9yQ2xlYW51cDogVHJpZ2dlclR5cGUsXG4gIC4uLmV4dHJhQ2xlYW51cEZuczogQ2xlYW51cEZuW11cbik6IHZvaWQge1xuICBjb25zdCBjbGVhbnVwcyA9IFsuLi5leHRyYUNsZWFudXBGbnMsIGF0dGFjaExpc3RlbmVyKGVsdCwgdHlwZSwgbGlzdGVuZXIpXTtcbiAgY29uc3QgY2xlYW51cEtleSA9IGNsZWFudXBGbktleUZvclR5cGUodHlwZUZvckNsZWFudXApO1xuICAoZWx0IGFzIGFueSlbY2xlYW51cEtleV0/LigpO1xuICAoZWx0IGFzIGFueSlbY2xlYW51cEtleV0gPSAoKSA9PiB7XG4gICAgZGVsZXRlIChlbHQgYXMgYW55KVtjbGVhbnVwS2V5XTtcbiAgICBjbGVhbnVwcy5mb3JFYWNoKChpdCkgPT4gaXQoKSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGF0dGFjaExpc3RlbmVyPEsgZXh0ZW5kcyBrZXlvZiBHbG9iYWxFdmVudEhhbmRsZXJzRXZlbnRNYXA+KFxuICBlbHQ6IEJvdW5kRWxlbWVudCxcbiAgdHlwZTogSyxcbiAgbGlzdGVuZXI6IChldjogR2xvYmFsRXZlbnRIYW5kbGVyc0V2ZW50TWFwW0tdKSA9PiBhbnksXG4gIG9wdGlvbnM/OiBib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnNcbik6IENsZWFudXBGbiB7XG4gIGNvbnN0IG15X2xpc3RlbmVyOiB0eXBlb2YgbGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyAmJiB0eXBlICE9PSAnbW91c2Vtb3ZlJykge1xuICAgICAgY29uc29sZS5kZWJ1ZyhcbiAgICAgICAgYCR7ZWx0LmlzQ29ubmVjdGVkID8gJ0hhbmRsaW5nJyA6ICdJZ25vcmluZyd9ICR7dHlwZX0gb25gLFxuICAgICAgICBlLnRhcmdldFxuICAgICAgKTtcbiAgICB9XG4gICAgLy8gTWF5YmUgc2hvdWxkIHByZXZlbnREZWZhdWx0L3N0b3BQcm9wYWdhdGlvbiB0byBhdm9pZCBnZXR0aW5nIGV2ZW50cyBvbiByZW1vdmVkIGVsZW1lbnRzP1xuICAgIGlmICghZWx0LmlzQ29ubmVjdGVkKSByZXR1cm47XG4gICAgbGlzdGVuZXIoZSk7XG4gIH07XG4gIC8vIEB0cy1pZ25vcmVcbiAgZWx0LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbXlfbGlzdGVuZXIsIG9wdGlvbnMpO1xuICByZXR1cm4gKCkgPT4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBlbHQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBteV9saXN0ZW5lciwgb3B0aW9ucyk7XG4gIH07XG59XG5cbi8vIEZvciBlYWNoIGNvbGxlY3Rpb24gd2Ugc2V0IHRoZSBjdXJyZW50IGNvbG9yIHNjaGVtZS9tb2RlXG5jb25zdCBDT0xPUl9TQ0hFTUVfS0VZID0gJ2Yydy1jb2xvci1zY2hlbWUnO1xuY29uc3QgTEFOR19LRVkgPSAnZjJ3LWxhbmcnO1xud2luZG93LkYyV19USEVNRV9TV0lUQ0ggPSAodGhlbWUpID0+XG4gIHdpbmRvdy5GMldfQ09MT1JfU0NIRU1FUz8uZm9yRWFjaCgoY29sTmFtZSkgPT5cbiAgICBzZXRDb2xsZWN0aW9uQXR0ckFuZFZhcmlhYmxlcyhjb2xOYW1lLCB0aGVtZSlcbiAgKTtcblxuaWYgKHdpbmRvdy5GMldfQ09MT1JfU0NIRU1FUykge1xuICBjb25zdCBtYXRjaE1lZGlhUXVlcnkgPSBtYXRjaE1lZGlhKCcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJykubWF0Y2hlcztcbiAgY29uc3Qgc3lzdGVtUHJlZmVyZW5jZSA9IG1hdGNoTWVkaWFRdWVyeSA/ICdkYXJrJyA6ICdsaWdodCc7XG4gIGNvbnN0IHVzZXJQcmVmZXJlbmNlID0gbG9jYWxTdG9yYWdlPy5nZXRJdGVtKENPTE9SX1NDSEVNRV9LRVkpO1xuICBvbkNvbm5lY3RlZCgnYm9keScsICgpID0+IHtcbiAgICBjb25zdCBwcmV2aWV3UHJlZmVyZW5jZSA9IGRvY3VtZW50LmJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXByZXZpZXctdGhlbWUnKTtcbiAgICBjb25zdCBjb2xvclNjaGVtZSA9IHByZXZpZXdQcmVmZXJlbmNlID8/IHVzZXJQcmVmZXJlbmNlID8/IHN5c3RlbVByZWZlcmVuY2U7XG4gICAgd2luZG93LkYyV19USEVNRV9TV0lUQ0g/Lihjb2xvclNjaGVtZSk7XG4gIH0pO1xufVxuaWYgKHdpbmRvdy5GMldfTEFOR1VBR0VTKSB7XG4gIGxldCB1c2VyUHJlZmVyZW5jZSA9IGxvY2FsU3RvcmFnZT8uZ2V0SXRlbShMQU5HX0tFWSk7XG4gIG9uQ29ubmVjdGVkKCdib2R5JywgKCkgPT4ge1xuICAgIGNvbnN0IGFsdGVybmF0ZXMgPSBBcnJheS5mcm9tKFxuICAgICAgZG9jdW1lbnQuaGVhZC5xdWVyeVNlbGVjdG9yQWxsKCdsaW5rW3JlbD1cImFsdGVybmF0ZVwiXScpXG4gICAgKTtcbiAgICBjb25zdCBpc0RlZmF1bHQgPVxuICAgICAgYWx0ZXJuYXRlcy5sZW5ndGggPT09IDAgfHxcbiAgICAgIGFsdGVybmF0ZXMuc29tZShcbiAgICAgICAgKGl0KSA9PlxuICAgICAgICAgIGl0LmdldEF0dHJpYnV0ZSgnaHJlZmxhbmcnKSA9PT0gJ3gtZGVmYXVsdCcgJiZcbiAgICAgICAgICBpdC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSA9PT0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICAgICk7XG4gICAgaWYgKCFpc0RlZmF1bHQpIHtcbiAgICAgIC8vIHBhZ2UgdXJsIGlzIC9mci9mb28sIHNhdmUgdGhlIGxhbmcgc28gdGhhdCBuYXZpZ2F0aW9uIHJldGFpbiB0aGUgc2FtZSBsYW5ndWFnZVxuICAgICAgdXNlclByZWZlcmVuY2UgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubGFuZztcbiAgICB9XG4gICAgY29uc3QgaXM0MDQgPSBkb2N1bWVudC5oZWFkXG4gICAgICAucXVlcnlTZWxlY3RvcjxIVE1MTGlua0VsZW1lbnQ+KCdsaW5rW3JlbD1cImNhbm9uaWNhbFwiXScpXG4gICAgICA/LmhyZWY/LmVuZHNXaXRoKCcvNDA0LycpO1xuICAgIHdpbmRvdy5GMldfTEFOR1VBR0VTPy5mb3JFYWNoKChjb2xOYW1lKSA9PiB7XG4gICAgICBjb25zdCBjaG9pY2VzID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICBPYmplY3QuZW50cmllcyhnZXRDb2xNb2Rlcyhjb2xOYW1lKSkubWFwKChba10pID0+IFtrLnRvTG93ZXJDYXNlKCksIGtdKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGxhbmdzID0gWy4uLm5hdmlnYXRvci5sYW5ndWFnZXNdO1xuICAgICAgaWYgKHVzZXJQcmVmZXJlbmNlKSBsYW5ncy51bnNoaWZ0KHVzZXJQcmVmZXJlbmNlKTtcbiAgICAgIGZvciAobGV0IGxhbmcgb2YgbGFuZ3MpIHtcbiAgICAgICAgbGFuZyA9IGxhbmcudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgY29uc3QgY29kZSA9IGxhbmcuc3BsaXQoJy0nKVswXTtcbiAgICAgICAgY29uc3QgbW9kZVZhbHVlID0gY2hvaWNlc1tsYW5nXSA/PyBjaG9pY2VzW2NvZGVdO1xuICAgICAgICBpZiAobW9kZVZhbHVlKSB7XG4gICAgICAgICAgc2V0Q29sbGVjdGlvbkF0dHJBbmRWYXJpYWJsZXMoY29sTmFtZSwgbW9kZVZhbHVlKTtcbiAgICAgICAgICBpZiAoIWlzNDA0KSBzYXZlTW9kZShjb2xOYW1lLCBtb2RlVmFsdWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5jb25zdCBjdXJyZW50Q29sbGVjdGlvbk1vZGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG5jb25zdCBjb2xsZWN0aW9uTW9kZUJwc1NvcnRlZCA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgT2JqZWN0LmVudHJpZXMoY29sbGVjdGlvbk1vZGVCcHMoKSkubWFwKChbaywgdl0pID0+IFtcbiAgICBrLFxuICAgIE9iamVjdC5lbnRyaWVzKHYpLm1hcCgoW25hbWUsIHsgbWluV2lkdGggfV0pID0+ICh7IG5hbWUsIG1pbldpZHRoIH0pKSxcbiAgXSlcbik7XG5mdW5jdGlvbiB1cGRhdGVDb2xsZWN0aW9uTW9kZXMoKTogdm9pZCB7XG4gIGNvbnN0IHdpZHRoID0gd2luZG93LnZpc3VhbFZpZXdwb3J0Py53aWR0aCB8fCB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgZm9yIChjb25zdCBbY29sbGVjdGlvbk5hbWUsIGJyZWFrcG9pbnRzXSBvZiBPYmplY3QuZW50cmllcyhcbiAgICBjb2xsZWN0aW9uTW9kZUJwc1NvcnRlZFxuICApKSB7XG4gICAgY29uc3QgYnBzID0gWy4uLmJyZWFrcG9pbnRzXTtcbiAgICBsZXQgbmV3TW9kZSA9IGJwcy5zcGxpY2UoMCwgMSlbMF0ubmFtZTtcbiAgICBmb3IgKGNvbnN0IHsgbmFtZSwgbWluV2lkdGggfSBvZiBicHMpIHtcbiAgICAgIGlmICh3aWR0aCA+PSBtaW5XaWR0aCkgbmV3TW9kZSA9IG5hbWU7XG4gICAgfVxuICAgIGlmIChuZXdNb2RlICE9PSBjdXJyZW50Q29sbGVjdGlvbk1vZGVzW2NvbGxlY3Rpb25OYW1lXSkge1xuICAgICAgc2V0Q29sbGVjdGlvbkF0dHJBbmRWYXJpYWJsZXMoY29sbGVjdGlvbk5hbWUsIG5ld01vZGUpO1xuICAgICAgY3VycmVudENvbGxlY3Rpb25Nb2Rlc1tjb2xsZWN0aW9uTmFtZV0gPSBuZXdNb2RlO1xuICAgIH1cbiAgfVxufVxuXG5sZXQgZHJhZ19zdGFydGVkID0gZmFsc2U7XG5vbkNvbm5lY3RlZCgnYm9keScsICgpID0+IHtcbiAgbGV0IGRyYWdfc3RhcnQ6IE1vdXNlRXZlbnQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIGxldCBzdXBwcmVzc19jbGljayA9IGZhbHNlO1xuICBhdHRhY2hMaXN0ZW5lcihkb2N1bWVudCBhcyBhbnksICdtb3VzZWRvd24nLCAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGRyYWdfc3RhcnQgPSBlO1xuICAgIGRyYWdfc3RhcnRlZCA9IGZhbHNlO1xuICB9KTtcbiAgYXR0YWNoTGlzdGVuZXIoZG9jdW1lbnQgYXMgYW55LCAnbW91c2Vtb3ZlJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoZHJhZ19zdGFydCAmJiBnZXREaXN0YW5jZShkcmFnX3N0YXJ0LCBlKS5kaXN0ID4gMikge1xuICAgICAgY29uc3QgZHJhZ2dpbmc6IERyYWdnaW5nID0ge1xuICAgICAgICBzdGFydDogZHJhZ19zdGFydCxcbiAgICAgICAgZW5kOiBlLFxuICAgICAgfTtcbiAgICAgIGlmICghZHJhZ19zdGFydGVkKSB7XG4gICAgICAgIGRyYWdfc3RhcnQudGFyZ2V0Py5kaXNwYXRjaEV2ZW50KFxuICAgICAgICAgIG5ldyBDdXN0b21FdmVudDxEcmFnZ2luZz4oJ2RyYWdnaW5nJywgeyBkZXRhaWw6IGRyYWdnaW5nIH0pXG4gICAgICAgICk7XG4gICAgICAgIGRyYWdfc3RhcnRlZCA9IHRydWU7XG4gICAgICAgIHN1cHByZXNzX2NsaWNrID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChkcmFnX3N0YXJ0LnRhcmdldCBhcyBCb3VuZEVsZW1lbnQpPy5mMndfZHJhZ19saXN0ZW5lcj8uKGRyYWdnaW5nKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBhdHRhY2hMaXN0ZW5lcihkb2N1bWVudCBhcyBhbnksICdtb3VzZXVwJywgKGU6IE1vdXNlRXZlbnQpID0+IHtcbiAgICBpZiAoZHJhZ19zdGFydCAmJiBkcmFnX3N0YXJ0ZWQpIHtcbiAgICAgIChkcmFnX3N0YXJ0LnRhcmdldCBhcyBCb3VuZEVsZW1lbnQpPy5mMndfZHJhZ19saXN0ZW5lcj8uKHtcbiAgICAgICAgc3RhcnQ6IGRyYWdfc3RhcnQsXG4gICAgICAgIGVuZDogZSxcbiAgICAgICAgZmluaXNoZWQ6IHRydWUsXG4gICAgICB9KTtcbiAgICB9XG4gICAgZHJhZ19zdGFydCA9IHVuZGVmaW5lZDtcbiAgICBkcmFnX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgfSk7XG4gIGF0dGFjaExpc3RlbmVyKGRvY3VtZW50IGFzIGFueSwgJ21vdXNldXAnLCAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGlmIChkcmFnX3N0YXJ0ICYmIGRyYWdfc3RhcnRlZCkge1xuICAgICAgKGRyYWdfc3RhcnQudGFyZ2V0IGFzIEJvdW5kRWxlbWVudCk/LmYyd19kcmFnX2xpc3RlbmVyPy4oe1xuICAgICAgICBzdGFydDogZHJhZ19zdGFydCxcbiAgICAgICAgZW5kOiBlLFxuICAgICAgICBmaW5pc2hlZDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBkcmFnX3N0YXJ0ID0gdW5kZWZpbmVkO1xuICAgIGRyYWdfc3RhcnRlZCA9IGZhbHNlO1xuICB9KTtcbiAgYXR0YWNoTGlzdGVuZXIoXG4gICAgZG9jdW1lbnQgYXMgYW55LFxuICAgICdjbGljaycsXG4gICAgKGUpID0+IHtcbiAgICAgIGlmIChzdXBwcmVzc19jbGljaykge1xuICAgICAgICBzdXBwcmVzc19jbGljayA9IGZhbHNlO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB7IGNhcHR1cmU6IHRydWUgfVxuICApO1xuICB1cGRhdGVDb2xsZWN0aW9uTW9kZXMoKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZUNvbGxlY3Rpb25Nb2Rlcyk7XG59KTtcblxuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IGhvb2soZG9jdW1lbnQpKTtcbmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGlmICgnbWVkaXVtWm9vbScgaW4gd2luZG93KSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHpvb20gPSBtZWRpdW1ab29tKCdbZGF0YS16b29tYWJsZV0nKTtcbiAgICB6b29tLm9uKCdvcGVuJywgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IG9iamVjdEZpdCA9IGdldENvbXB1dGVkU3R5bGUoZXZlbnQudGFyZ2V0KS5vYmplY3RGaXQ7XG4gICAgICBjb25zdCB6b29tZWQgPSBldmVudC5kZXRhaWwuem9vbS5nZXRab29tZWRJbWFnZSgpO1xuICAgICAgLy8gbWVkaXVtLXpvb20gd2lsbCBoYXZlIGNvbXB1dGVkIHRoZSBpbWFnZSBzaXplIHdpdGggYWRkaXRpb25hbCBib3JkZXJzLFxuICAgICAgLy8gbmVlZCBpdCB0byB1c2Ugb2JqZWN0LWZpdCB0b28gb3RoZXJ3aXNlIHRoZSByYXRpbyB3aWxsIGJlIHNjcmV3ZWRcbiAgICAgIGlmIChvYmplY3RGaXQgJiYgem9vbWVkKSB6b29tZWQuc3R5bGUub2JqZWN0Rml0ID0gb2JqZWN0Rml0O1xuICAgIH0pO1xuICAgIHpvb20ub24oJ2Nsb3NlZCcsIChldmVudDogYW55KSA9PiB7XG4gICAgICBjb25zdCB6b29tZWQgPSBldmVudC5kZXRhaWwuem9vbS5nZXRab29tZWRJbWFnZSgpO1xuICAgICAgem9vbWVkLnN0eWxlLm9iamVjdEZpdCA9ICcnO1xuICAgIH0pO1xuICB9XG59KTtcblxuZnVuY3Rpb24gaXNDYWxjYWJsZSh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgdmFsdWUuZW5kc1dpdGgoJ3B4JykgfHwgdmFsdWUuZW5kc1dpdGgoJyUnKSB8fCB2YWx1ZS5zdGFydHNXaXRoKCdjYWxjJylcbiAgKTtcbn1cblxuZnVuY3Rpb24gdW5DYWxjKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWUuc3RhcnRzV2l0aCgnY2FsYycpID8gdmFsdWUuc2xpY2UoNCkgOiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gaW50ZXJwb2xhdGUoXG4gIHsgZnJvbSwgdG8gfTogQW5pbWF0ZWRQcm9wLFxuICBwZXJjZW50OiBudW1iZXJcbik6IEFuaW1hdGVkUHJvcFsndG8nXSB7XG4gIGlmIChmcm9tID09PSB0bykgcmV0dXJuIHRvO1xuICBpZiAodHlwZW9mIGZyb20gPT09ICdudW1iZXInICYmIHR5cGVvZiB0byA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gZnJvbSArICh0byAtIGZyb20pICogKHBlcmNlbnQgLyAxMDApO1xuICB9XG4gIGlmICh0eXBlb2YgZnJvbSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHRvID09PSAnc3RyaW5nJykge1xuICAgIGlmIChmcm9tID09PSAnbm9uZScgfHwgdG8gPT09ICdub25lJykgcmV0dXJuIHBlcmNlbnQgPCA1MCA/IGZyb20gOiB0bztcbiAgICBpZiAoZnJvbSA9PT0gJ2F1dG8nIHx8IHRvID09PSAnYXV0bycpIHJldHVybiBwZXJjZW50IDwgNTAgPyBmcm9tIDogdG87XG5cbiAgICBpZiAoZnJvbS5lbmRzV2l0aCgncHgnKSAmJiB0by5lbmRzV2l0aCgncHgnKSkge1xuICAgICAgY29uc3QgZnJvbVB4ID0gcGFyc2VGbG9hdChmcm9tKTtcbiAgICAgIGNvbnN0IHRvUCA9IHBhcnNlRmxvYXQodG8pO1xuICAgICAgcmV0dXJuIHRvUHgoZnJvbVB4ICsgKHRvUCAtIGZyb21QeCkgKiAocGVyY2VudCAvIDEwMCkpO1xuICAgIH1cbiAgICBpZiAoZnJvbS5lbmRzV2l0aCgnJScpICYmIHRvLmVuZHNXaXRoKCclJykpIHtcbiAgICAgIGNvbnN0IGZyb21QeCA9IHBhcnNlRmxvYXQoZnJvbSk7XG4gICAgICBjb25zdCB0b1AgPSBwYXJzZUZsb2F0KHRvKTtcbiAgICAgIHJldHVybiB0b1BlcmNlbnQoZnJvbVB4ICsgKHRvUCAtIGZyb21QeCkgKiAocGVyY2VudCAvIDEwMCkpO1xuICAgIH1cbiAgICBpZiAoaXNDYWxjYWJsZShmcm9tKSAmJiBpc0NhbGNhYmxlKHRvKSkge1xuICAgICAgY29uc3QgZnJvbUNhbGMgPSB1bkNhbGMoZnJvbSk7XG4gICAgICBjb25zdCB0b0NhbGMgPSB1bkNhbGModG8pO1xuICAgICAgcmV0dXJuIGBjYWxjKCR7ZnJvbUNhbGN9ICsgKCR7dG9DYWxjfSAtICR7ZnJvbUNhbGN9KSAqICR7cGVyY2VudCAvIDEwMH0pYDtcbiAgICB9XG5cbiAgICAvLyBuZWVkZWQgP1xuICAgIGlmIChmcm9tLnN0YXJ0c1dpdGgoJ3JnYicpICYmIHRvLnN0YXJ0c1dpdGgoJ3JnYicpKSB7XG4gICAgICBjb25zdCBmcm9tQ29sb3IgPSBmcm9tLm1hdGNoKC9cXGQrL2cpIS5tYXAoTnVtYmVyKTtcbiAgICAgIGNvbnN0IHRvQ29sb3IgPSB0by5tYXRjaCgvXFxkKy9nKSEubWFwKE51bWJlcik7XG4gICAgICBjb25zdCBjb2xvciA9IGZyb21Db2xvci5tYXAoXG4gICAgICAgIChmcm9tLCBpKSA9PiBmcm9tICsgKHRvQ29sb3JbaV0gLSBmcm9tKSAqIChwZXJjZW50IC8gMTAwKVxuICAgICAgKTtcbiAgICAgIHJldHVybiBgcmdiKCR7Y29sb3Iuam9pbignLCcpfSlgO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGVyY2VudCA8IDUwID8gZnJvbSA6IHRvO1xufVxuXG5mdW5jdGlvbiBnZXREaXN0YW5jZShcbiAgc3RhcnQ6IE1vdXNlRXZlbnQsXG4gIGVuZDogTW91c2VFdmVudFxuKTogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgZGlzdDogbnVtYmVyIH0ge1xuICBjb25zdCB4ID0gZW5kLmNsaWVudFggLSBzdGFydC5jbGllbnRYO1xuICBjb25zdCB5ID0gZW5kLmNsaWVudFkgLSBzdGFydC5jbGllbnRZO1xuICByZXR1cm4geyB4LCB5LCBkaXN0OiBNYXRoLnNxcnQoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSkgfTtcbn1cblxub25Db25uZWN0ZWQoJ1tkYXRhLWJvdW5kLWNoYXJhY3RlcnNdJywgKGUpID0+IHtcbiAgY29uc3QgaGFuZGxlciA9ICgpOiB2b2lkID0+IHtcbiAgICBjb25zdCBpZCA9IGUuZ2V0QXR0cmlidXRlKCdkYXRhLWJvdW5kLWNoYXJhY3RlcnMnKSE7XG4gICAgY29uc3QgY2hhcmFjdGVycyA9IHRvU3RyaW5nKHJlc29sdmUoYWxsVmFyaWFibGVzKClbaWRdKSk7XG4gICAgaWYgKGNoYXJhY3RlcnMgIT09IGUudGV4dENvbnRlbnQpIGUudGV4dENvbnRlbnQgPSBjaGFyYWN0ZXJzO1xuICB9O1xuICBoYW5kbGVyKCk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Yydy1zZXQtdmFyaWFibGUnLCBoYW5kbGVyKTtcbiAgcmV0dXJuICgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Yydy1zZXQtdmFyaWFibGUnLCBoYW5kbGVyKTtcbn0pO1xuXG5vbkNvbm5lY3RlZCgnW2RhdGEtYm91bmQtdmlzaWJsZV0nLCAoZSkgPT4ge1xuICBjb25zdCBoYW5kbGVyID0gKCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IGlkID0gZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtYm91bmQtdmlzaWJsZScpITtcbiAgICBjb25zdCB2aXNpYmxlID0gdG9TdHJpbmcocmVzb2x2ZShhbGxWYXJpYWJsZXMoKVtpZF0pKTtcbiAgICBpZiAodmlzaWJsZSAhPT0gdW5kZWZpbmVkKSBlLnNldEF0dHJpYnV0ZSgnZGF0YS12aXNpYmxlJywgdmlzaWJsZSk7XG4gIH07XG4gIGhhbmRsZXIoKTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZjJ3LXNldC12YXJpYWJsZScsIGhhbmRsZXIpO1xuICByZXR1cm4gKCkgPT4gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignZjJ3LXNldC12YXJpYWJsZScsIGhhbmRsZXIpO1xufSk7XG5cbmNvbnN0IGFwcGVhck9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKFxuICAoZW50cmllcywgb2JzZXJ2ZXIpID0+IHtcbiAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcbiAgICAgICAgb2JzZXJ2ZXIudW5vYnNlcnZlKGVudHJ5LnRhcmdldCk7XG4gICAgICAgIGVudHJ5LnRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnYXBwZWFyJykpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICAvLyAxMCUgb2YgdGhlIGVsZW1lbnQgbXVzdCBiZSB2aXNpYmxlXG4gIHsgdGhyZXNob2xkOiAwLjEgfVxuKTtcblxuLy8gRml4IHNjcm9sbCB0byBpZCBieSBpbnNwZWN0aW5nIGluamVjdGVkIGZpeGVkIGlkc1xuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgY29uc3QgaGFzaElkUHJlZml4ID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSk7XG4gIC8vIG1hdGNoaW5nICNmb28gb3IgI2Zvb18xXG4gIGNvbnN0IGhhc2hSRSA9IG5ldyBSZWdFeHAoaGFzaElkUHJlZml4ICsgJyhfXFxcXGQrKT8kJyk7XG4gIGZvciAoY29uc3QgZSBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbaWRePVwiJHtoYXNoSWRQcmVmaXh9XCJdYCkpXG4gICAgaWYgKGhhc2hSRS50ZXN0KGUuaWQpICYmIGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ID4gMClcbiAgICAgIHJldHVybiBlLnNjcm9sbEludG9WaWV3KCk7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBTyxXQUFTLFFBQVEsR0FBVyxRQUF3QjtBQUN6RCxXQUFPLEtBQUssTUFBTSxJQUFJLE1BQU0sSUFBSTtBQUFBLEVBQ2xDOzs7QUNGZSxXQUFSLE9BQXdCLEtBQUssT0FBTyxNQUFNLE9BQU87QUFDdkQsVUFBTSxhQUFhLE9BQU8sU0FBUyxLQUFLLFNBQVMsRUFBRSxTQUFTLEdBQUc7QUFFL0QsUUFBSSxPQUFPLFFBQVEsVUFBVTtBQUM1QixPQUFDLEtBQUssT0FBTyxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0saUJBQWlCLEVBQUUsSUFBSSxlQUFhLE9BQU8sU0FBUyxDQUFDO0FBQUEsSUFDNUYsV0FBVyxVQUFVLFFBQVc7QUFDL0IsY0FBUSxPQUFPLFdBQVcsS0FBSztBQUFBLElBQ2hDO0FBRUEsUUFBSSxPQUFPLFFBQVEsWUFDbEIsT0FBTyxVQUFVLFlBQ2pCLE9BQU8sU0FBUyxZQUNoQixNQUFNLE9BQ04sUUFBUSxPQUNSLE9BQU8sS0FDTjtBQUNELFlBQU0sSUFBSSxVQUFVLGtDQUFrQztBQUFBLElBQ3ZEO0FBRUEsUUFBSSxPQUFPLFVBQVUsVUFBVTtBQUM5QixVQUFJLENBQUMsYUFBYSxTQUFTLEtBQUssU0FBUyxHQUFHO0FBQzNDLGdCQUFRLEtBQUssTUFBTSxNQUFNLEtBQUs7QUFBQSxNQUMvQixXQUFXLGFBQWEsU0FBUyxLQUFLLFNBQVMsS0FBSztBQUNuRCxnQkFBUSxLQUFLLE1BQU0sTUFBTSxRQUFRLEdBQUc7QUFBQSxNQUNyQyxPQUFPO0FBQ04sY0FBTSxJQUFJLFVBQVUseUJBQXlCLG9DQUFvQztBQUFBLE1BQ2xGO0FBRUEsZUFBUyxRQUFRLEtBQUssR0FBRyxTQUFTLEVBQUUsRUFBRSxNQUFNLENBQUM7QUFBQSxJQUM5QyxPQUFPO0FBQ04sY0FBUTtBQUFBLElBQ1Q7QUFJQSxZQUFTLE9BQU8sU0FBUyxJQUFJLE9BQU8sS0FBTSxLQUFLLElBQUksU0FBUyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUk7QUFBQSxFQUM1RTs7O0FDN0JPLFdBQVMsWUFBZSxLQUEyQztBQUN4RSxXQUFPLElBQUksT0FBTyxRQUFRO0FBQUEsRUFDNUI7QUFFTyxXQUFTLFNBQ2QsT0FDaUI7QUFDakIsV0FBTyxVQUFVLFFBQVEsVUFBVTtBQUFBLEVBQ3JDOzs7QUNmTyxXQUFTLGdCQUFnQixLQUFtQjtBQUNqRCxZQUFRLEtBQUssR0FBRztBQUNoQixRQUFJLE1BQXdDO0FBQzFDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7OztBQ21ETyxXQUFTLFFBQVEsR0FBb0Q7QUFDMUUsV0FDRSxPQUFPLE1BQU0sWUFBYSxFQUFvQixTQUFTO0FBQUEsRUFFM0Q7OztBQ2dCTyxXQUFTLGFBQWEsTUFBMEI7QUFDckQsUUFBSSxPQUFPLE1BQU07QUFDZixZQUFNLElBQUksUUFBUSxLQUFLLEdBQUcsR0FBRztBQUM3QixVQUFJLE1BQU07QUFBRyxlQUFPLFFBQVEsS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7QUFBQSxJQUM1RDtBQUNBLFVBQU0sTUFBTSxPQUFPLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3pDLFFBQUksSUFBSSxPQUFPLElBQUksTUFBTSxJQUFJLE9BQU8sSUFBSSxNQUFNLElBQUksT0FBTyxJQUFJLElBQUk7QUFDL0QsYUFBTyxJQUFJLElBQUksS0FBSyxJQUFJLEtBQUssSUFBSTtBQUFBLElBQ25DO0FBQ0EsV0FBTyxJQUFJO0FBQUEsRUFDYjtBQUVPLFdBQVMsbUJBQW1CLE9BQXlCO0FBQzFELFVBQU0sRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLEVBQUUsSUFBSTtBQUMzQixXQUFPO0FBQUEsTUFDTCxHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUM7QUFBQSxNQUNyQixHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUM7QUFBQSxNQUNyQixHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUM7QUFBQSxNQUNyQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBc0JPLFdBQVMsS0FBSyxHQUFtQjtBQUN0QyxXQUFPLEdBQUcsUUFBUSxHQUFHLEVBQUU7QUFBQSxFQUN6QjtBQUVPLFdBQVMsVUFBVSxHQUFtQjtBQUMzQyxXQUFPLEdBQUcsUUFBUSxHQUFHLEVBQUU7QUFBQSxFQUN6QjtBQUVPLFdBQVMsY0FBYyxHQUEwQjtBQUN0RCxZQUFRLE9BQU87QUFBQSxXQUNSO0FBQ0gsWUFBSSxRQUFRLENBQUMsR0FBRztBQUNkLGlCQUFPLE9BQU8sRUFBRTtBQUFBLFFBQ2xCO0FBQ0EsWUFBSSxPQUFPLEdBQUc7QUFDWixpQkFBTyxhQUFhLG1CQUFtQixDQUFDLENBQUM7QUFBQSxRQUMzQztBQUFBLFdBQ0c7QUFBQSxXQUNBO0FBQUEsV0FDQTtBQUFBO0FBRUgsZUFBTyxPQUFPLENBQUM7QUFBQTtBQUFBLEVBRXJCO0FBdVhPLFdBQVMsV0FBVyxJQUFvQjtBQUM3QyxXQUFPLE1BQU07QUFBQSxFQUNmOzs7QUN0Z0JPLE1BQU0saUJBQWlCO0FBQUEsSUFDNUI7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjs7O0FDWk8sV0FBUyxLQUNkQSxNQUNlO0FBQ2YsUUFBSSxDQUFDQTtBQUFLO0FBQ1YsV0FBUSxJQUFJLFNBQVM7QUFDbkIsVUFBSSxDQUFDQTtBQUFLO0FBQ1YsWUFBTUMsU0FBUUQ7QUFDZCxNQUFBQSxPQUFNO0FBQ04sYUFBT0MsT0FBTSxHQUFHLElBQUk7QUFBQSxJQUN0QjtBQUFBLEVBQ0Y7OztBQ1JBLE1BQU0saUJBQWlCLENBQUMsTUFDdEIsYUFBYSxlQUFlLGFBQWE7QUFFM0MsV0FBUyxlQUFlLEdBQWlCLElBQTRCO0FBQ25FLFFBQUksQ0FBQyxFQUFFO0FBQWU7QUFDdEIsVUFBTSxXQUFXLElBQUksaUJBQWlCLENBQUMsY0FBYztBQUNuRCxpQkFBVyxZQUFZLFVBQVUsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLFdBQVc7QUFDbkUsbUJBQVcsUUFBUSxTQUFTO0FBQzFCLGNBQUksU0FBUyxHQUFHO0FBQ2Q7QUFDQSxxQkFBUyxXQUFXO0FBQUEsVUFDdEI7QUFBQSxJQUNOLENBQUM7QUFDRCxhQUFTLFFBQVEsRUFBRSxlQUFlLEVBQUUsV0FBVyxLQUFLLENBQUM7QUFBQSxFQUN2RDtBQUVPLFdBQVMsWUFDZCxVQUNBLElBQ1k7QUFDWixVQUFNLFdBQVcsSUFBSSxpQkFBaUIsQ0FBQyxjQUFjO0FBQ25ELGlCQUFXLFlBQVksVUFBVSxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsV0FBVztBQUNuRSxtQkFBVyxLQUFLLFNBQVM7QUFDdkIsY0FBSSxlQUFlLENBQUMsS0FBSyxFQUFFLFFBQVEsUUFBUTtBQUFHLDJCQUFlLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFBQSxJQUMzRSxDQUFDO0FBQ0QsYUFBUyxRQUFRLFVBQVUsRUFBRSxXQUFXLE1BQU0sU0FBUyxLQUFLLENBQUM7QUFDN0QsV0FBTyxNQUFNLFNBQVMsV0FBVztBQUFBLEVBQ25DOzs7QUMwQ08sTUFBTSxzQkFBc0Isb0JBQUksSUFBSTtBQUFBLElBQ3pDO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRixDQUFDOzs7QUNoRk0sV0FBUyxlQUFlQyxNQUEyQztBQUN4RSxXQUNFLG9CQUFvQixJQUFJQSxLQUFJLFFBQVEsWUFBWSxDQUFDLEtBQ2pEQSxLQUFJLFlBQVk7QUFBQSxFQUVwQjtBQUVPLFdBQVMsZ0JBQWdCQSxNQUE0QztBQUMxRSxRQUFJQSxLQUFJLFlBQVk7QUFBVSxhQUFPO0FBQ3JDLFVBQU0sTUFBT0EsS0FBMEI7QUFDdkMsWUFDRyxJQUFJLFNBQVMsYUFBYSxLQUFLLElBQUksU0FBUyxzQkFBc0IsTUFDbkUsSUFBSSxTQUFTLGVBQWU7QUFBQSxFQUVoQztBQUVBLE1BQU0sb0JBQU4sTUFBd0I7QUFBQSxJQUl0QixZQUFvQixRQUEyQjtBQUEzQjtBQUhwQixXQUFRLE9BQVksQ0FBQztBQUVyQixXQUFRLGtCQUEwRDtBQUVoRSxXQUFLLFNBQVMsSUFBSSxRQUFRLENBQUNDLGFBQVk7QUFDckMsY0FBTSxlQUFlLE1BQVk7QUFDL0IsZUFBSyxPQUFPLG9CQUFvQixRQUFRLFlBQVk7QUFFcEQscUJBQVcsTUFBTTtBQUNmLGlCQUFLLHdCQUF3QjtBQUFBLFVBQy9CLENBQUM7QUFBQSxRQUNIO0FBRUEsYUFBSyxPQUFPLGlCQUFpQixRQUFRLFlBQVk7QUFFakQsYUFBSyxrQkFBa0IsQ0FBQyxVQUF3QjtBQUM5QyxjQUFJLE1BQU0sV0FBVyxLQUFLLE9BQU8saUJBQWlCLE1BQU0sTUFBTTtBQUM1RCxnQkFBSTtBQUVKLGdCQUFJO0FBQ0YsMEJBQVksS0FBSyxNQUFNLE1BQU0sSUFBSTtBQUFBLFlBQ25DLFNBQVMsR0FBUDtBQUNBLHNCQUFRLE1BQU0scUNBQXFDLENBQUM7QUFDcEQ7QUFBQSxZQUNGO0FBRUEsZ0JBQUksVUFBVSxVQUFVLFdBQVc7QUFDakMsbUJBQUssT0FBTyxvQkFBb0IsUUFBUSxZQUFZO0FBQUEsWUFDdEQ7QUFFQSxnQkFBSSxVQUFVLE1BQU07QUFDbEIscUJBQU8sT0FBTyxLQUFLLE1BQU0sVUFBVSxJQUFJO0FBQ3ZDLGNBQUFBLFNBQVEsSUFBSTtBQUFBLFlBQ2Q7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUVBLGVBQU8saUJBQWlCLFdBQVcsS0FBSyxlQUFlO0FBQ3ZELGFBQUssd0JBQXdCO0FBQUEsTUFDL0IsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUVjLG1CQUNaLElBUWU7QUFBQSxpREFSZixNQU9BLE9BQWMsQ0FBQyxHQUNBO0FBdEVuQjtBQXVFSSxjQUFNLEtBQUs7QUFDWCxtQkFBSyxPQUFPLGtCQUFaLG1CQUEyQjtBQUFBLFVBQ3pCLEtBQUssVUFBVSxFQUFFLE9BQU8sV0FBVyxNQUFNLEtBQUssQ0FBQztBQUFBLFVBQy9DO0FBQUE7QUFBQSxNQUVKO0FBQUE7QUFBQSxJQUVRLDBCQUFnQztBQTlFMUM7QUErRUksaUJBQUssT0FBTyxrQkFBWixtQkFBMkI7QUFBQSxRQUN6QixLQUFLLFVBQVUsRUFBRSxPQUFPLFlBQVksQ0FBQztBQUFBLFFBQ3JDO0FBQUE7QUFBQSxJQUVKO0FBQUEsSUFFQSxJQUFJLFFBQWlCO0FBQ25CLGFBQU8sS0FBSyxLQUFLO0FBQUEsSUFDbkI7QUFBQSxJQUVBLElBQUksU0FBaUI7QUFDbkIsYUFBTyxLQUFLLEtBQUs7QUFBQSxJQUNuQjtBQUFBLElBRUEsSUFBSSxNQUFNLE9BQWdCO0FBQ3hCLFVBQUk7QUFBTyxhQUFLLG1CQUFtQixNQUFNO0FBQUE7QUFDcEMsYUFBSyxtQkFBbUIsUUFBUTtBQUFBLElBQ3ZDO0FBQUEsSUFFQSxJQUFJLGNBQXNCO0FBQ3hCLGFBQU8sS0FBSyxLQUFLO0FBQUEsSUFDbkI7QUFBQSxJQUVBLElBQUksWUFBWSxPQUFlO0FBQzdCLFdBQUssbUJBQW1CLFVBQVUsQ0FBQyxPQUFPLElBQUksQ0FBQztBQUFBLElBQ2pEO0FBQUEsSUFFQSxJQUFJLFNBQWtCO0FBQ3BCLGFBQU8sS0FBSyxLQUFLLGdCQUFnQjtBQUFBLElBQ25DO0FBQUEsSUFFQSxPQUFhO0FBQ1gsV0FBSyxtQkFBbUIsV0FBVztBQUFBLElBQ3JDO0FBQUEsSUFFQSxRQUFjO0FBQ1osV0FBSyxtQkFBbUIsWUFBWTtBQUFBLElBQ3RDO0FBQUEsSUFFQSxPQUFPLEtBQUtELE1BQTJDO0FBQ3JELGFBQVNBLEtBQVksc0JBQVpBLEtBQVksb0JBQXNCLElBQUksa0JBQWtCQSxJQUFHO0FBQUEsSUFDdEU7QUFBQSxFQUNGO0FBRUEsV0FBUyxjQUNQQSxNQUNrRDtBQUNsRCxRQUFJLGVBQWVBLElBQUc7QUFBRyxhQUFPQTtBQUNoQyxRQUFJLGdCQUFnQkEsSUFBRztBQUFHLGFBQU8sa0JBQWtCLEtBQUtBLElBQUc7QUFBQSxFQUM3RDtBQUVPLFdBQVMsV0FBV0EsTUFBMkM7QUFDcEUsVUFBTSxhQUFhLGNBQWNBLElBQUc7QUFDcEMsUUFBSSxZQUFZO0FBQ2QsYUFBTyxNQUFNO0FBQ1gsbUJBQVcsUUFBUSxDQUFDLFdBQVc7QUFDL0IsZUFBTyxNQUFNO0FBQ1gscUJBQVcsUUFBUSxDQUFDLFdBQVc7QUFBQSxRQUNqQztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQ0EsV0FBTyxNQUFNLFFBQVEsS0FBSyxnQ0FBZ0NBLElBQUc7QUFBQSxFQUMvRDtBQUVPLFdBQVMsS0FBS0EsTUFBMkM7QUFDOUQsVUFBTSxhQUFhLGNBQWNBLElBQUc7QUFDcEMsUUFBSSxZQUFZO0FBQ2QsYUFBTyxNQUFNO0FBQ1gsbUJBQVcsUUFBUTtBQUNuQixlQUFPLE1BQU07QUFDWCxxQkFBVyxRQUFRO0FBQUEsUUFDckI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUNBLFdBQU8sTUFBTSxRQUFRLEtBQUssZ0NBQWdDQSxJQUFHO0FBQUEsRUFDL0Q7QUFFTyxXQUFTLE9BQU9BLE1BQTJDO0FBQ2hFLFVBQU0sYUFBYSxjQUFjQSxJQUFHO0FBQ3BDLFFBQUksWUFBWTtBQUNkLGFBQU8sTUFBTTtBQUNYLG1CQUFXLFFBQVE7QUFDbkIsZUFBTyxNQUFNO0FBQ1gscUJBQVcsUUFBUTtBQUFBLFFBQ3JCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFDQSxXQUFPLE1BQU0sUUFBUSxLQUFLLGdDQUFnQ0EsSUFBRztBQUFBLEVBQy9EO0FBRU8sV0FBUyxLQUFLQSxNQUEyQztBQUM5RCxVQUFNLGFBQWEsY0FBY0EsSUFBRztBQUNwQyxRQUFJLFlBQVk7QUFDZCxhQUFPLE1BQU07QUFDWCxtQkFBVyxLQUFLO0FBQ2hCLGVBQU8sTUFBTSxXQUFXLE1BQU07QUFBQSxNQUNoQztBQUFBLElBQ0Y7QUFDQSxXQUFPLE1BQU0sUUFBUSxLQUFLLGdDQUFnQ0EsSUFBRztBQUFBLEVBQy9EO0FBRU8sV0FBUyxNQUFNQSxNQUEyQztBQUMvRCxVQUFNLGFBQWEsY0FBY0EsSUFBRztBQUNwQyxRQUFJLFlBQVk7QUFDZCxhQUFPLE1BQU07QUFDWCxtQkFBVyxNQUFNO0FBQ2pCLGVBQU8sTUFBTSxXQUFXLEtBQUs7QUFBQSxNQUMvQjtBQUFBLElBQ0Y7QUFDQSxXQUFPLE1BQU0sUUFBUSxLQUFLLGdDQUFnQ0EsSUFBRztBQUFBLEVBQy9EO0FBRU8sV0FBUyxXQUFXQSxNQUEyQztBQUNwRSxVQUFNLGFBQWEsY0FBY0EsSUFBRztBQUNwQyxRQUFJLFlBQVk7QUFDZCxhQUFPLE1BQU07QUFDWCxZQUFJLFdBQVc7QUFBUSxxQkFBVyxLQUFLO0FBQUE7QUFDbEMscUJBQVcsTUFBTTtBQUN0QixlQUFPLE1BQU07QUFDWCxjQUFJLFdBQVc7QUFBUSx1QkFBVyxLQUFLO0FBQUE7QUFDbEMsdUJBQVcsTUFBTTtBQUFBLFFBQ3hCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFDQSxXQUFPLE1BQU0sUUFBUSxLQUFLLGdDQUFnQ0EsSUFBRztBQUFBLEVBQy9EO0FBRU8sV0FBUyxPQUNkQSxNQUNBLE1BQ3lCO0FBQ3pCLFVBQU0sYUFBYSxjQUFjQSxJQUFHO0FBQ3BDLFFBQUksWUFBWTtBQUNkLGFBQU8sTUFBTTtBQUNYLG1CQUFXLGNBQWM7QUFBQSxNQUUzQjtBQUFBLElBQ0Y7QUFDQSxXQUFPLE1BQU0sUUFBUSxLQUFLLGdDQUFnQ0EsSUFBRztBQUFBLEVBQy9EO0FBRU8sV0FBUyxZQUNkQSxNQUNBLFNBQ3lCO0FBQ3pCLFVBQU0sYUFBYSxjQUFjQSxJQUFHO0FBQ3BDLFFBQUksWUFBWTtBQUNkLGFBQU8sTUFBTTtBQUNYLG1CQUFXLGVBQWU7QUFDMUIsZUFBTyxNQUFNO0FBQ1gscUJBQVcsZUFBZTtBQUFBLFFBQzVCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFDQSxXQUFPLE1BQU0sUUFBUSxLQUFLLGdDQUFnQ0EsSUFBRztBQUFBLEVBQy9EO0FBRU8sV0FBUyxhQUNkQSxNQUNBLFNBQ3lCO0FBQ3pCLFVBQU0sYUFBYSxjQUFjQSxJQUFHO0FBQ3BDLFFBQUksWUFBWTtBQUNkLGFBQU8sTUFBTTtBQUNYLG1CQUFXLGVBQWU7QUFDMUIsZUFBTyxNQUFNO0FBQ1gscUJBQVcsZUFBZTtBQUFBLFFBQzVCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFDQSxXQUFPLE1BQU0sUUFBUSxLQUFLLGdDQUFnQ0EsSUFBRztBQUFBLEVBQy9EOzs7QUMxUE8sV0FBUyxXQUFvQjtBQUNsQyxVQUFNLEtBQUssVUFBVTtBQUNyQixXQUFPLEdBQUcsU0FBUyxRQUFRLEtBQUssQ0FBQyxHQUFHLFNBQVMsUUFBUTtBQUFBLEVBQ3ZEOzs7QUNITyxXQUFTLGtCQUFrQixVQUF1QztBQUN2RSxXQUFPLGFBQWEsY0FBYyxhQUFhO0FBQUEsRUFDakQ7OztBQ0lBLE1BQU0sU0FBUyxTQUFTO0FBSXhCLFdBQVMseUJBQ1BFLE1BQ0EsT0FDQSxRQUNNO0FBQ04sSUFBQUEsS0FBSTtBQUFBLE1BQ0YsbUJBQ0s7QUFBQSxNQUVMO0FBQUEsUUFDRSxlQUFlO0FBQUEsUUFDZixZQUFZO0FBQUEsUUFDWixVQUFVO0FBQUEsUUFDVixNQUFNO0FBQUEsTUFDUjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUEsV0FBUyxNQUFNLEdBQXVEO0FBQ3BFLFdBQU8sT0FBTyxZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQUEsRUFDMUU7QUFFTyxXQUFTLGFBQ2RBLE1BQ0EsT0FDQSxRQUNBQyxXQUNBLHFCQUNNO0FBQ04sVUFBTSxTQUFTRCxLQUFJO0FBQ25CLFVBQU0saUJBQWlCLGlCQUFpQkEsSUFBRztBQUMzQyxVQUFNLGVBQWUsaUJBQWlCLE1BQU07QUFDNUMsVUFBTSxnQkFBZ0IsYUFBYTtBQUNuQyxVQUFNLGVBQ0osY0FBYyxTQUFTLE1BQU0sS0FBSyxjQUFjLFNBQVMsTUFBTTtBQUNqRSxVQUFNLGFBQWEsa0JBQWtCLGVBQWUsUUFBUTtBQUM1RCxVQUFNLGVBQWUsTUFBTSxJQUFJLENBQUMsT0FBUSxpQ0FDbkMsS0FEbUM7QUFBQSxNQUV0QyxVQUFVLEdBQUcsSUFBSSxXQUFXLElBQUksSUFDNUIsR0FBRyxNQUNILEdBQUcsSUFBSSxRQUFRLGFBQWEsQ0FBQyxHQUFHLE1BQU0sRUFBRSxZQUFZLENBQUM7QUFBQSxJQUMzRCxFQUFFO0FBRUYsVUFBTSxZQUFnRCxDQUFDO0FBQ3ZELFVBQU0sU0FBUyxhQUFhLE9BQU8sQ0FBQyxPQUFPO0FBQ3pDLFVBQUksR0FBRztBQUFRLGVBQU87QUFDdEIsVUFBSSxHQUFHLElBQUksV0FBVyxhQUFhLEdBQUc7QUFDcEMsa0JBQVUsR0FBRyxJQUFJLE1BQU0sRUFBRSxLQUFLLEdBQUc7QUFDakMsZUFBTztBQUFBLE1BQ1Q7QUFDQSxhQUFPO0FBQUEsSUFDVCxDQUFDO0FBQ0QsVUFBTSxZQUFZLE1BQU0sTUFBTTtBQUM5QixVQUFNLFlBQVk7QUFBQSxNQUNoQixhQUFhLE9BQU8sQ0FBQyxPQUFPLEdBQUcsV0FBVyxVQUFVO0FBQUEsSUFDdEQ7QUFDQSxVQUFNLFlBQVksTUFBTSxhQUFhLE9BQU8sQ0FBQyxPQUFPLEdBQUcsV0FBVyxTQUFTLENBQUM7QUFDNUUsUUFBSSx3QkFBNEM7QUFDaEQsUUFBSSxVQUFVLFNBQVM7QUFHckIsVUFBSSxVQUFVLFFBQVEsT0FBTyxRQUFRO0FBRW5DLFFBQUFBLEtBQUksTUFBTSxVQUFVLE9BQU8sVUFBVSxRQUFRLEVBQUU7QUFBQSxNQUNqRCxXQUFXLFVBQVUsUUFBUSxPQUFPLFFBQVE7QUFDMUMsWUFBSSxnQkFBZ0IsQ0FBQyxZQUFZO0FBRS9CLFVBQUFBLEtBQUksTUFBTSxVQUFVO0FBQUEsUUFDdEI7QUFBQSxNQUNGO0FBRUEsOEJBQXdCLE9BQU8sVUFBVSxRQUFRLEVBQUU7QUFDbkQsYUFBTyxVQUFVO0FBQUEsSUFDbkI7QUFDQSxRQUFJLFFBQVE7QUFDVixlQUFTQSxNQUFLLFdBQVcsVUFBVTtBQUNuQyxlQUFTQSxNQUFLLFdBQVcsVUFBVSxZQUFZO0FBQUEsSUFDakQ7QUFDQSxRQUFJLFdBQVcsQ0FBQyxpQkFBaUJBLElBQUcsRUFBRSxpQkFBaUIsYUFBYTtBQUNwRSxRQUFJLFVBQVUsZ0JBQWdCO0FBQzVCLFlBQU0sS0FBSyxVQUFVLGVBQWU7QUFDcEMsaUJBQVcsT0FBTyxTQUFZLE1BQU0sQ0FBQztBQUVyQyxVQUFJLENBQUMsTUFBTSxRQUFRLEdBQUc7QUFDcEIsUUFBQUEsS0FBSSxNQUFNLFlBQVksZUFBZSxPQUFPLFFBQVEsQ0FBQztBQUFBLE1BQ3ZEO0FBQ0EsYUFBTyxVQUFVO0FBQUEsSUFDbkI7QUFFQSxRQUFJLENBQUMsTUFBTSxRQUFRLEdBQUc7QUFDcEIsMEJBQW9CLElBQUksTUFBTTtBQUFBLElBQ2hDO0FBQ0EsUUFBSSxVQUFVLGtCQUFrQjtBQUM5QixVQUFJLElBQUtBLEtBQXlCO0FBQ2xDLFlBQU0sTUFBTSxVQUFVLGlCQUFpQjtBQUN2QyxVQUFJLENBQUMsR0FBRztBQUNOLFFBQUNBLEtBQXlCLHdCQUF3QixJQUFJLElBQUksTUFBTTtBQUNoRSxVQUFFLFdBQVc7QUFDYixVQUFFLFNBQVMsTUFBTTtBQUNmLFVBQUNBLEtBQXlCLFdBQVc7QUFDckMsVUFBQUEsS0FBSSxhQUFhLE9BQU8sR0FBRztBQUMzQixpQkFBUUEsS0FBeUI7QUFBQSxRQUNuQztBQUFBLE1BQ0Y7QUFDQSxRQUFFLE1BQU07QUFDUixhQUFPLFVBQVU7QUFBQSxJQUNuQjtBQUNBLFFBQUksVUFBVSxlQUFlO0FBQzNCLE1BQUFBLEtBQUksWUFBWSxPQUFPLFVBQVUsY0FBYyxFQUFFO0FBQ2pELGFBQU8sVUFBVTtBQUFBLElBQ25CO0FBQ0EsZUFBVyxDQUFDLEdBQUcsQ0FBQyxLQUFLLE9BQU8sUUFBUSxTQUFTLEdBQUc7QUFDOUMsTUFBQUEsS0FBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFBQSxJQUMvQjtBQUNBLFFBQUksVUFBVSxRQUFRLFVBQVUsT0FBTztBQUNyQyxVQUFJLFVBQVUsS0FBSyxPQUFPLFlBQVksVUFBVSxNQUFNLE9BQU8sVUFBVTtBQUVyRSxjQUFNLEVBQUUsT0FBTyxZQUFZLElBQUksT0FBTyxzQkFBc0I7QUFDNUQsY0FBTSxFQUFFLE1BQU0sSUFBSUEsS0FBSSxzQkFBc0I7QUFFNUMsY0FBTSxXQUFXLEtBQUssY0FBYyxLQUFLO0FBQ3pDLGlDQUF5QkEsTUFBSyxFQUFFLE1BQU0sVUFBVSxPQUFPLFNBQVMsQ0FBQztBQUNqRSxlQUFPLFVBQVU7QUFDakIsa0JBQVUsTUFBTSxLQUFLO0FBQUEsTUFDdkIsV0FDRSxVQUFVLEtBQUssT0FBTyxZQUN0QixVQUFVLE1BQU0sT0FBTyxVQUN2QjtBQUVBLGNBQU0sRUFBRSxNQUFNLFdBQVcsSUFBSSxPQUFPLHNCQUFzQjtBQUMxRCxjQUFNLEVBQUUsS0FBSyxJQUFJQSxLQUFJLHNCQUFzQjtBQUUzQyxjQUFNLFVBQVUsS0FBSyxPQUFPLFVBQVU7QUFDdEMsaUNBQXlCQSxNQUFLLEVBQUUsT0FBTyxVQUFVLE1BQU0sUUFBUSxDQUFDO0FBQ2hFLGVBQU8sVUFBVTtBQUNqQixrQkFBVSxLQUFLLEtBQUs7QUFBQSxNQUN0QjtBQUFBLElBQ0Y7QUFDQSxRQUFJLFVBQVUsT0FBTyxVQUFVLFFBQVE7QUFDckMsVUFBSSxVQUFVLElBQUksT0FBTyxZQUFZLFVBQVUsT0FBTyxPQUFPLFVBQVU7QUFFckUsY0FBTSxFQUFFLFFBQVEsYUFBYSxJQUFJLE9BQU8sc0JBQXNCO0FBQzlELGNBQU0sRUFBRSxPQUFPLElBQUlBLEtBQUksc0JBQXNCO0FBRTdDLGNBQU0sWUFBWSxLQUFLLGVBQWUsTUFBTTtBQUM1QyxpQ0FBeUJBLE1BQUssRUFBRSxLQUFLLFVBQVUsUUFBUSxVQUFVLENBQUM7QUFDbEUsZUFBTyxVQUFVO0FBQ2pCLGtCQUFVLE9BQU8sS0FBSztBQUFBLE1BQ3hCLFdBQ0UsVUFBVSxJQUFJLE9BQU8sWUFDckIsVUFBVSxPQUFPLE9BQU8sVUFDeEI7QUFFQSxjQUFNLEVBQUUsS0FBSyxVQUFVLElBQUksT0FBTyxzQkFBc0I7QUFDeEQsY0FBTSxFQUFFLElBQUksSUFBSUEsS0FBSSxzQkFBc0I7QUFFMUMsY0FBTSxTQUFTLEtBQUssTUFBTSxTQUFTO0FBQ25DLGlDQUF5QkEsTUFBSyxFQUFFLFFBQVEsVUFBVSxLQUFLLE9BQU8sQ0FBQztBQUMvRCxlQUFPLFVBQVU7QUFDakIsa0JBQVUsSUFBSSxLQUFLO0FBQUEsTUFDckI7QUFBQSxJQUNGO0FBQ0EsVUFBTSxhQUFhLENBQUMsQ0FBQyxVQUFVO0FBRS9CLFFBQUksWUFBWTtBQUlkLGFBQ0csT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLFdBQVcsYUFBYSxDQUFDLEVBQy9DLFFBQVEsQ0FBQyxPQUFPO0FBRWYsUUFBQUEsS0FBSSxNQUFNLFlBQVksR0FBRyxLQUFLLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDM0MsZUFBTyxVQUFVLEdBQUc7QUFBQSxNQUN0QixDQUFDO0FBQUEsSUFDTDtBQUNBLGVBQVcsQ0FBQyxRQUFRLEdBQUcsS0FBSztBQUFBLE1BQzFCLENBQUMsVUFBVSxTQUFTO0FBQUEsTUFDcEIsQ0FBQyxTQUFTLFNBQVM7QUFBQSxJQUNyQixHQUFZO0FBQ1YsVUFBSSxJQUFJLFNBQVM7QUFFZixZQUFJLElBQUksUUFBUSxPQUFPLFFBQVE7QUFDN0IsVUFBQUEsS0FBSSxVQUFVLE9BQU8sU0FBUyxVQUFVO0FBQ3hDLFVBQUFBLEtBQUksVUFBVSxJQUFJLFNBQVMsU0FBUztBQUFBLFFBQ3RDLE9BQU87QUFDTCxVQUFBQSxLQUFJLFVBQVUsT0FBTyxTQUFTLFNBQVM7QUFDdkMsVUFBQUEsS0FBSSxVQUFVLElBQUksU0FBUyxVQUFVO0FBQUEsUUFDdkM7QUFBQSxNQUVGO0FBQUEsSUFDRjtBQUVBLFVBQU0sT0FBTyxDQUNYLFdBQ0EsUUFDQSxRQUFRLFVBQ2tCO0FBQzFCLFVBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtBQUFRO0FBQzlDLGFBQU9BLEtBQUk7QUFBQSxRQUNUO0FBQUEsVUFDRTtBQUFBLFdBQ0c7QUFBQSxRQUVMO0FBQUEsVUFDRSxlQUFlO0FBQUEsVUFDZixZQUFZO0FBQUEsVUFDWixVQUFBQztBQUFBLFVBQ0EsTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUNBLFVBQU0sSUFBSSxLQUFLLFdBQVcsUUFBVyxDQUFDLENBQUMscUJBQXFCO0FBQzVELFFBQUksdUJBQXVCO0FBQ3pCLFFBQUcsU0FBUyxLQUFLLE1BQU07QUFDckIsUUFBQUQsS0FBSSxNQUFNLFVBQVU7QUFBQSxNQUN0QixDQUFDO0FBQUEsSUFDSDtBQUNBLFNBQUssV0FBVyxVQUFVO0FBQzFCLFNBQUssV0FBVyxTQUFTO0FBQUEsRUFDM0I7QUFFQSxNQUFNLFdBQVcsQ0FBQyxHQUFpQixNQUFpQixVQUEwQjtBQUM1RSxVQUFNLElBQUksTUFBTSxLQUFLLENBQUNFLE9BQU1BLE1BQUssQ0FBQztBQUNsQyxRQUFJLENBQUM7QUFBRztBQUNSLE1BQUUsTUFBTSxNQUFNLE1BQWEsT0FBTyxFQUFFLEdBQUcsRUFBRTtBQUN6QyxXQUFPLEVBQUU7QUFBQSxFQUNYOzs7QUN4T08sV0FBUyxvQkFDZCxPQUNBQyxzQkFDQUMsYUFDZTtBQUNmLFFBQUlBLFlBQVcsY0FBYyxRQUFRO0FBQ25DLFVBQ0VELHlCQUF3QixpQkFDeEJBLHlCQUF3QixZQUN4QjtBQUNBLGVBQU87QUFBQSxVQUNMO0FBQUEsWUFDRTtBQUFBLFlBQ0EsT0FBTztBQUFBLGNBQ0w7QUFBQSxnQkFDRSxLQUFLO0FBQUEsZ0JBQ0wsTUFBTTtBQUFBLGdCQUNOLElBQUk7QUFBQSxjQUNOO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRixXQUNFQSx5QkFBd0Isa0JBQ3hCQSx5QkFBd0IsYUFDeEI7QUFDQSxlQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0U7QUFBQSxZQUNBLE9BQU87QUFBQSxjQUNMO0FBQUEsZ0JBQ0UsS0FBSztBQUFBLGdCQUNMLE1BQU07QUFBQSxnQkFDTixJQUFJO0FBQUEsY0FDTjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0YsT0FBTztBQUVMLGNBQU0sS0FBS0EseUJBQXdCLFdBQVcsU0FBUztBQUN2RCxlQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0U7QUFBQSxZQUNBLE9BQU87QUFBQSxjQUNMO0FBQUEsZ0JBQ0UsS0FBSztBQUFBLGdCQUNMLE1BQU07QUFBQSxnQkFDTixJQUFJO0FBQUEsY0FDTjtBQUFBLGNBQ0E7QUFBQSxnQkFDRSxLQUFLO0FBQUEsZ0JBQ0wsTUFBTSxPQUFPO0FBQUEsZ0JBQ2IsSUFBSSxRQUFRO0FBQUEsY0FDZDtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLFdBQVdDLFlBQVcsY0FBYyxTQUFTO0FBQzNDLFVBQ0VELHlCQUF3QixpQkFDeEJBLHlCQUF3QixZQUN4QjtBQUNBLGVBQU87QUFBQSxVQUNMO0FBQUEsWUFDRTtBQUFBLFlBQ0EsT0FBTztBQUFBLGNBQ0w7QUFBQSxnQkFDRSxLQUFLO0FBQUEsZ0JBQ0wsTUFBTTtBQUFBLGdCQUNOLElBQUk7QUFBQSxjQUNOO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRixXQUNFQSx5QkFBd0Isa0JBQ3hCQSx5QkFBd0IsYUFDeEI7QUFDQSxlQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0U7QUFBQSxZQUNBLE9BQU87QUFBQSxjQUNMO0FBQUEsZ0JBQ0UsS0FBSztBQUFBLGdCQUNMLE1BQU07QUFBQSxnQkFDTixJQUFJO0FBQUEsY0FDTjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0YsT0FBTztBQUVMLGNBQU0sS0FBS0EseUJBQXdCLFdBQVcsU0FBUztBQUN2RCxlQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0U7QUFBQSxZQUNBLE9BQU87QUFBQSxjQUNMO0FBQUEsZ0JBQ0UsS0FBSztBQUFBLGdCQUNMLE1BQU07QUFBQSxnQkFDTixJQUFJO0FBQUEsY0FDTjtBQUFBLGNBQ0E7QUFBQSxnQkFDRSxLQUFLO0FBQUEsZ0JBQ0wsTUFBTSxTQUFTO0FBQUEsZ0JBQ2YsSUFBSSxRQUFRO0FBQUEsY0FDZDtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLFdBQVdDLFlBQVcsY0FBYyxPQUFPO0FBQ3pDLFVBQ0VELHlCQUF3QixpQkFDeEJBLHlCQUF3QixrQkFDeEJBLHlCQUF3QixpQkFDeEI7QUFDQSxjQUFNLEtBQUtBLHlCQUF3QixrQkFBa0IsU0FBUztBQUM5RCxlQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0U7QUFBQSxZQUNBLE9BQU87QUFBQSxjQUNMO0FBQUEsZ0JBQ0UsS0FBSztBQUFBLGdCQUNMLE1BQU0sR0FBRztBQUFBLGdCQUNULElBQUksR0FBRztBQUFBLGNBQ1Q7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGLFdBQ0VBLHlCQUF3QixjQUN4QkEseUJBQXdCLGVBQ3hCQSx5QkFBd0IsY0FDeEI7QUFDQSxlQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0U7QUFBQSxZQUNBLE9BQU87QUFBQSxjQUNMO0FBQUEsZ0JBQ0UsS0FBSztBQUFBLGdCQUNMLE1BQU07QUFBQSxnQkFDTixJQUFJO0FBQUEsY0FDTjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0YsT0FBTztBQUVMLGVBQU87QUFBQSxVQUNMO0FBQUEsWUFDRTtBQUFBLFlBQ0EsT0FBTztBQUFBLGNBQ0w7QUFBQSxnQkFDRSxLQUFLO0FBQUEsZ0JBQ0wsTUFBTTtBQUFBLGdCQUNOLElBQUk7QUFBQSxjQUNOO0FBQUEsY0FDQTtBQUFBLGdCQUNFLEtBQUs7QUFBQSxnQkFDTCxNQUFNO0FBQUEsZ0JBQ04sSUFBSTtBQUFBLGNBQ047QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixXQUFXQyxZQUFXLGNBQWMsVUFBVTtBQUM1QyxVQUNFRCx5QkFBd0IsaUJBQ3hCQSx5QkFBd0Isa0JBQ3hCQSx5QkFBd0IsaUJBQ3hCO0FBQ0EsZUFBTztBQUFBLFVBQ0w7QUFBQSxZQUNFO0FBQUEsWUFDQSxPQUFPO0FBQUEsY0FDTDtBQUFBLGdCQUNFLEtBQUs7QUFBQSxnQkFDTCxNQUFNO0FBQUEsZ0JBQ04sSUFBSTtBQUFBLGNBQ047QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGLFdBQ0VBLHlCQUF3QixjQUN4QkEseUJBQXdCLGVBQ3hCQSx5QkFBd0IsY0FDeEI7QUFDQSxjQUFNLEtBQUtBLHlCQUF3QixlQUFlLFNBQVM7QUFDM0QsZUFBTztBQUFBLFVBQ0w7QUFBQSxZQUNFO0FBQUEsWUFDQSxPQUFPO0FBQUEsY0FDTDtBQUFBLGdCQUNFLEtBQUs7QUFBQSxnQkFDTCxNQUFNLEdBQUc7QUFBQSxnQkFDVCxJQUFJLEdBQUc7QUFBQSxjQUNUO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRixPQUFPO0FBRUwsZUFBTztBQUFBLFVBQ0w7QUFBQSxZQUNFO0FBQUEsWUFDQSxPQUFPO0FBQUEsY0FDTDtBQUFBLGdCQUNFLEtBQUs7QUFBQSxnQkFDTCxNQUFNO0FBQUEsZ0JBQ04sSUFBSTtBQUFBLGNBQ047QUFBQSxjQUNBO0FBQUEsZ0JBQ0UsS0FBSztBQUFBLGdCQUNMLE1BQU07QUFBQSxnQkFDTixJQUFJO0FBQUEsY0FDTjtBQUFBLFlBQ0Y7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLE9BQU87QUFDTCxjQUFRLEtBQUssMkJBQTJCQyxXQUFVO0FBQUEsSUFDcEQ7QUFDQSxXQUFPLENBQUM7QUFBQSxFQUNWOzs7QUNwTUEsTUFBTSxlQUFlLE1BQWlDLE9BQU87QUFDN0QsTUFBTSxlQUFlLE1BQXFDLE9BQU87QUFDakUsTUFBTSxvQkFBb0IsTUFHckIsT0FBTztBQUNaLE1BQU0sY0FBYyxDQUFDLFFBQXdDO0FBNUM3RDtBQTZDRSw4QkFBTyx3QkFBUCxtQkFBNkIsU0FBN0IsWUFBcUMsQ0FBQztBQUFBO0FBQ3hDLE1BQU0sa0JBQWtCLENBQ3RCLEtBQ0EsU0FDOEMsWUFBWSxHQUFHLEVBQUU7QUFFakUsV0FBUyxZQUFZLElBQVksT0FBNEI7QUFDM0QsaUJBQWEsRUFBRSxNQUFNO0FBQ3JCLFVBQU0sTUFBTSxjQUFjLEtBQUs7QUFDL0IsYUFBUyxLQUFLLE1BQU0sWUFBWSxJQUFJLEdBQUc7QUFDdkMsVUFBTSxPQUFPLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDOUIsUUFBSSxTQUFTLEtBQUssYUFBYSxJQUFJLEdBQUc7QUFDcEMsZUFBUyxLQUFLLGFBQWEsTUFBTSxHQUFHO0FBQUEsSUFDdEM7QUFDQSxhQUFTO0FBQUEsTUFDUCxJQUFJLFlBQXlCLG9CQUFvQjtBQUFBLFFBQy9DLFFBQVEsRUFBRSxJQUFJLE9BQU8sSUFBSTtBQUFBLE1BQzNCLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUVBLFdBQVMsOEJBQ1AsU0FDQSxVQUNNO0FBckVSO0FBc0VFLGFBQVMsS0FBSyxhQUFhLFFBQVEsV0FBVyxRQUFRO0FBQ3RELFVBQU0sUUFBTyxxQkFBZ0IsU0FBUyxRQUFRLE1BQWpDLFlBQXNDLENBQUM7QUFDcEQsZUFBVyxDQUFDLElBQUksS0FBSyxLQUFLLE9BQU8sUUFBUSxJQUFJLEdBQUc7QUFDOUMsa0JBQVksSUFBSSxLQUFLO0FBQUEsSUFDdkI7QUFBQSxFQUNGO0FBRUEsV0FBUyxnQkFBZ0IsTUFBYyxVQUF3QjtBQUM3RCxrQ0FBOEIsTUFBTSxRQUFRO0FBQzVDLGFBQVMsTUFBTSxRQUFRO0FBQUEsRUFDekI7QUFFQSxXQUFTLFNBQVMsTUFBYyxVQUF3QjtBQWxGeEQ7QUFtRkUsU0FBSSxZQUFPLHNCQUFQLG1CQUEwQixTQUFTLE9BQU87QUFDNUMsbURBQWMsUUFBUSxrQkFBa0I7QUFBQSxJQUMxQyxZQUFXLFlBQU8sa0JBQVAsbUJBQXNCLFNBQVMsT0FBTztBQUMvQyxtREFBYyxRQUFRLFVBQVU7QUFDaEMsWUFBTSxZQUFZLE1BQU07QUFBQSxRQUN0QixTQUFTLEtBQUssaUJBQWtDLHVCQUF1QjtBQUFBLE1BQ3pFLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxhQUFhLFFBQVE7QUFDdkMsVUFBSSxXQUFXO0FBQ2IsZ0JBQVEsYUFBYSxNQUFNLElBQUksSUFBSSxJQUFJLFVBQVUsSUFBSSxFQUFFLFFBQVE7QUFBQSxNQUNqRTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUEsV0FBUyxRQUFRLEdBQWlDO0FBQ2hELFFBQUksT0FBTyxNQUFNO0FBQVUsYUFBTztBQUNsQyxRQUFJLE9BQU8sTUFBTTtBQUFXLGFBQU8sSUFBSSxJQUFJO0FBQzNDLFFBQUksT0FBTyxNQUFNO0FBQVUsYUFBTyxXQUFXLENBQUM7QUFDOUMsV0FBTztBQUFBLEVBQ1Q7QUFFQSxXQUFTLFNBQVMsR0FBaUM7QUFDakQsV0FBTyxPQUFPLENBQUM7QUFBQSxFQUNqQjtBQUVBLFdBQVMsVUFBVSxHQUFrQztBQUNuRCxRQUFJLE9BQU8sTUFBTTtBQUFVLGFBQU8sTUFBTTtBQUN4QyxXQUFPLENBQUMsQ0FBQztBQUFBLEVBQ1g7QUFFQSxXQUFTLFFBQ1AsT0FDQSxRQUNzQjtBQW5IeEI7QUFvSEUsUUFBSSxVQUFVO0FBQVcsYUFBTztBQUNoQyxRQUFJLFFBQVEsS0FBSyxHQUFHO0FBQ2xCLGFBQU8sUUFBUSxhQUFhLEVBQUUsTUFBTSxHQUFHO0FBQUEsSUFDekM7QUFDQSxRQUFJLE9BQU8sVUFBVSxZQUFZLHlCQUF5QixPQUFPO0FBQy9ELFlBQU0sT0FBTyxNQUFNLG9CQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssRUFDcEIsT0FBTyxDQUFDLE9BQTBDLE9BQU8sTUFBUyxFQUNsRSxJQUFJLENBQUMsT0FBTyxRQUFRLElBQUksTUFBTSxDQUFDO0FBQ2xDLFlBQU0sZ0JBQWUsaUJBQU0sb0JBQW9CLE9BQTFCLG1CQUE4QixpQkFBOUIsWUFBOEM7QUFDbkUsY0FBUSxNQUFNO0FBQUEsYUFDUDtBQUNILGlCQUFPLGlCQUFpQixVQUNwQixLQUFLLElBQUksT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQ3hDLEtBQUssSUFBSSxRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUM7QUFBQSxhQUMxQztBQUNILGNBQUksS0FBSyxXQUFXO0FBQUcsa0JBQU0sSUFBSSxNQUFNLG9CQUFvQjtBQUMzRCxpQkFBTyxRQUFRLEtBQUssRUFBRSxJQUFJLFFBQVEsS0FBSyxFQUFFO0FBQUEsYUFDdEM7QUFDSCxjQUFJLEtBQUssV0FBVztBQUFHLGtCQUFNLElBQUksTUFBTSxvQkFBb0I7QUFDM0QsaUJBQU8sUUFBUSxLQUFLLEVBQUUsSUFBSSxRQUFRLEtBQUssRUFBRTtBQUFBLGFBQ3RDO0FBQ0gsaUJBQU8sS0FBSyxJQUFJLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQztBQUFBLGFBQzVDO0FBQ0gsY0FBSSxLQUFLLFdBQVc7QUFBRyxrQkFBTSxJQUFJLE1BQU0sb0JBQW9CO0FBQzNELGlCQUFPLENBQUMsUUFBUSxLQUFLLEVBQUU7QUFBQSxhQUNwQjtBQUNILGNBQUksS0FBSyxXQUFXO0FBQUcsa0JBQU0sSUFBSSxNQUFNLG9CQUFvQjtBQUMzRCxpQkFBTyxRQUFRLEtBQUssRUFBRSxJQUFJLFFBQVEsS0FBSyxFQUFFO0FBQUEsYUFDdEM7QUFDSCxjQUFJLEtBQUssV0FBVztBQUFHLGtCQUFNLElBQUksTUFBTSxvQkFBb0I7QUFDM0QsaUJBQU8sUUFBUSxLQUFLLEVBQUUsS0FBSyxRQUFRLEtBQUssRUFBRTtBQUFBLGFBQ3ZDO0FBQ0gsY0FBSSxLQUFLLFdBQVc7QUFBRyxrQkFBTSxJQUFJLE1BQU0sb0JBQW9CO0FBQzNELGlCQUFPLFFBQVEsS0FBSyxFQUFFLElBQUksUUFBUSxLQUFLLEVBQUU7QUFBQSxhQUN0QztBQUNILGNBQUksS0FBSyxXQUFXO0FBQUcsa0JBQU0sSUFBSSxNQUFNLG9CQUFvQjtBQUMzRCxpQkFBTyxRQUFRLEtBQUssRUFBRSxLQUFLLFFBQVEsS0FBSyxFQUFFO0FBQUEsYUFDdkM7QUFDSCxjQUFJLEtBQUssV0FBVztBQUFHLGtCQUFNLElBQUksTUFBTSxvQkFBb0I7QUFDM0QsaUJBQU8saUJBQWlCLFVBQ3BCLFFBQVEsS0FBSyxFQUFFLE1BQU0sUUFBUSxLQUFLLEVBQUUsSUFDcEMsaUJBQWlCLFlBQ2pCLFVBQVUsS0FBSyxFQUFFLE1BQU0sVUFBVSxLQUFLLEVBQUUsSUFDeEMsU0FBUyxLQUFLLEVBQUUsTUFBTSxTQUFTLEtBQUssRUFBRTtBQUFBLGFBQ3ZDO0FBQ0gsY0FBSSxLQUFLLFdBQVc7QUFBRyxrQkFBTSxJQUFJLE1BQU0sb0JBQW9CO0FBQzNELGlCQUFPLGlCQUFpQixVQUNwQixRQUFRLEtBQUssRUFBRSxNQUFNLFFBQVEsS0FBSyxFQUFFLElBQ3BDLGlCQUFpQixZQUNqQixVQUFVLEtBQUssRUFBRSxNQUFNLFVBQVUsS0FBSyxFQUFFLElBQ3hDLFNBQVMsS0FBSyxFQUFFLE1BQU0sU0FBUyxLQUFLLEVBQUU7QUFBQSxhQUN2QztBQUNILGNBQUksS0FBSyxXQUFXO0FBQUcsa0JBQU0sSUFBSSxNQUFNLG9CQUFvQjtBQUMzRCxpQkFBTyxVQUFVLEtBQUssRUFBRSxLQUFLLFVBQVUsS0FBSyxFQUFFO0FBQUEsYUFDM0M7QUFDSCxjQUFJLEtBQUssV0FBVztBQUFHLGtCQUFNLElBQUksTUFBTSxvQkFBb0I7QUFDM0QsaUJBQU8sVUFBVSxLQUFLLEVBQUUsS0FBSyxVQUFVLEtBQUssRUFBRTtBQUFBLGFBQzNDO0FBQ0gsY0FBSSxLQUFLLFdBQVc7QUFBRyxrQkFBTSxJQUFJLE1BQU0sb0JBQW9CO0FBQzNELGlCQUFPLENBQUMsVUFBVSxLQUFLLEVBQUU7QUFBQSxhQUN0QjtBQUFBO0FBRUgsa0JBQVE7QUFBQSxZQUNOLG1DQUFtQyxNQUFNO0FBQUEsVUFDM0M7QUFDQSxpQkFBTztBQUFBO0FBQUEsSUFFYixPQUFPO0FBQ0wsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBRUEsV0FBUyxhQUNQLFNBQ0FDLFFBQ0FDLFVBQ3lCO0FBQ3pCLFVBQU0sT0FBTyxRQUFRLElBQUksQ0FBQyxPQUFPLHFCQUFxQixJQUFJRCxRQUFPQyxRQUFPLENBQUM7QUFDekUsV0FBTyxDQUFDLEdBQUcsTUFBTTtBQUNmLFlBQU0sVUFBVSxLQUNiLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFDcEIsT0FBTyxDQUFDLE9BQTRCLENBQUMsQ0FBQyxFQUFFO0FBQzNDLFVBQUksUUFBUTtBQUFRLGVBQU8sQ0FBQ0MsSUFBR0MsT0FBTSxRQUFRLFFBQVEsQ0FBQyxPQUFPLEdBQUdELElBQUdDLEVBQUMsQ0FBQztBQUFBLElBQ3ZFO0FBQUEsRUFDRjtBQUVBLFdBQVMscUJBQ1BDLFNBQ0FKLFFBQ0FDLFVBQ3lCO0FBQ3pCLFdBQU9HLFFBQU8sU0FBUyxTQUFTO0FBQzlCLE1BQUFBLFVBQVMsYUFBYSxFQUFFQSxRQUFPO0FBQUEsSUFDakM7QUFDQSxVQUFNQyxPQUFNLE1BQU1ELFNBQVFKLFFBQU9DLFFBQU87QUFDeEMsV0FBTyxDQUFDLE1BQU07QUFDWixVQUFJRyxRQUFPLFNBQVMsYUFBYUgsYUFBWSxRQUFRO0FBQ25ELGNBQU0sSUFBSyxFQUE0QjtBQUN2QyxZQUFJLENBQUMsRUFBRSxTQUFTO0FBQ2QsWUFBRSxVQUFVO0FBQ1osaUJBQU9JLEtBQUksQ0FBQztBQUFBLFFBQ2Q7QUFBQSxNQUNGO0FBRUEsVUFBSTtBQUFjO0FBQ2xCLFVBQUlELFFBQU8sU0FBUyxhQUFhQSxRQUFPLFFBQVE7QUFDOUMsY0FBTSxPQUFPLFNBQVMsZUFBZUEsUUFBTyxNQUFNO0FBRWxELFlBQUksNkJBQU0sZUFBZTtBQUN2QixnQkFBTSxTQUFTLEtBQUtDLEtBQUksQ0FBQyxDQUFDO0FBQzFCLGNBQUksUUFBUTtBQUNWLGdCQUFJLEtBQXlCLDZCQUFNO0FBQ25DLG1CQUFPLElBQUk7QUFHVCxlQUFDLEdBQUcsY0FBSCxHQUFHLFlBQWMsQ0FBQyxJQUFHLEtBQUssTUFBTTtBQUNqQyxtQkFBSyxHQUFHO0FBQ1IsbUJBQUkseUJBQUksYUFBWTtBQUFRO0FBQUEsWUFDOUI7QUFBQSxVQUNGO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUNBLGFBQU9BLEtBQUksQ0FBQztBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBRUEsV0FBUyxNQUNQLFFBQ0EsT0FDQSxTQUN5QjtBQXhQM0I7QUF5UEUsWUFBUSxPQUFPO0FBQUEsV0FDUjtBQUNILGVBQU8sTUFBRztBQTNQaEIsY0FBQUM7QUEyUG9CLG1CQUFBQSxNQUFBLE9BQU8scUJBQVAsT0FBQUEsTUFBMkIsUUFBUSxNQUFNO0FBQUE7QUFBQSxXQUNwRDtBQUNILGVBQU8sTUFBTSxLQUFLLE9BQU8sSUFBSTtBQUFBLFdBQzFCO0FBQ0gsZUFBTyxNQUFNO0FBQ1gsY0FBSSxPQUFPLGNBQWM7QUFDdkIsbUJBQU8sS0FBSyxPQUFPLEtBQUssUUFBUTtBQUFBLFVBQ2xDLE9BQU87QUFDTCxtQkFBTyx1QkFDSCxPQUFPLHFCQUFxQixPQUFPLEdBQUcsSUFDdEMsU0FBUyxPQUFPLE9BQU8sR0FBRztBQUFBLFVBQ2hDO0FBQUEsUUFDRjtBQUFBLFdBQ0c7QUFDSCxjQUFNLEVBQUUsWUFBWSxjQUFjLElBQUk7QUFDdEMsWUFBSSxlQUFjLCtDQUFlLFdBQVU7QUFDekMsaUJBQU8sTUFDTCxZQUFZLFlBQVksUUFBUSxjQUFjLE9BQU8sVUFBVSxDQUFDO0FBQ3BFO0FBQUEsV0FDRztBQUNILGNBQU0sRUFBRSx3QkFBd0IsaUJBQWlCLElBQUk7QUFDckQsWUFBSSwwQkFBMEI7QUFDNUIsaUJBQU8sTUFBTSxnQkFBZ0Isd0JBQXdCLGdCQUFnQjtBQUN2RTtBQUFBLFdBQ0c7QUFDSCxjQUFNLFNBQVMsT0FBTyxrQkFBa0IsSUFBSSxDQUFDLE1BQU07QUFDakQsZ0JBQU1ELE9BQU0sYUFBYSxFQUFFLFNBQVMsT0FBTyxPQUFPO0FBQ2xELGdCQUFNLEVBQUUsVUFBVSxJQUFJO0FBQ3RCLGdCQUFNLE9BQU8sWUFDVCxNQUFNLFVBQVUsUUFBUSxVQUFVLEtBQUssQ0FBQyxJQUN4QyxNQUFNO0FBQ1YsaUJBQU8sRUFBRSxNQUFNLEtBQUFBLEtBQUk7QUFBQSxRQUNyQixDQUFDO0FBQ0QsZUFBTyxNQUFNO0FBQ1gsZ0JBQU0sVUFBMkIsQ0FBQztBQUNsQyxxQkFBVyxTQUFTLFFBQVE7QUFDMUIsZ0JBQUksTUFBTSxLQUFLLEdBQUc7QUFDaEIsb0JBQU0sU0FBUyxNQUFNLElBQUk7QUFDekIsa0JBQUk7QUFBUSx3QkFBUSxLQUFLLE1BQU07QUFDL0I7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUNBLGNBQUksUUFBUTtBQUFRLG1CQUFPLENBQUMsTUFBTSxRQUFRLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0FBQUEsUUFDakU7QUFBQSxXQUNHO0FBQ0gsY0FBTSxNQUFNLGFBQWEsT0FBTyxTQUFTLE9BQU8sT0FBTztBQUN2RCxjQUFNLFVBQVUsT0FBTyxTQUFTO0FBQ2hDLGNBQU0sV0FBVyxPQUFPLFNBQVMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQ3JELGNBQU0sVUFBVSxPQUFPLFNBQVMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQ3BELGNBQU0sU0FBUyxPQUFPLFNBQVMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQ25ELGNBQU0sVUFBVSxPQUFPLFNBQVMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFO0FBQ3BELGVBQU8sQ0FBQyxNQUFNO0FBQ1osY0FBSSxhQUFhLGVBQWU7QUFDOUIsZ0JBQUksRUFBRSxZQUFZO0FBQVM7QUFDM0IsZ0JBQUksRUFBRSxZQUFZO0FBQVM7QUFDM0IsZ0JBQUksRUFBRSxXQUFXO0FBQVE7QUFDekIsZ0JBQUksRUFBRSxZQUFZO0FBQVM7QUFDM0IsZ0JBQUksRUFBRSxhQUFhO0FBQVU7QUFDN0IsY0FBRSxlQUFlO0FBQ2pCLGNBQUUsZ0JBQWdCO0FBQ2xCLGdCQUFJLENBQUM7QUFBQSxVQUNQO0FBQUEsUUFDRjtBQUFBLFdBQ0csaUJBQWlCO0FBQ3BCLFlBQUksT0FBTztBQUFNLGlCQUFPLENBQUMsTUFBRztBQTNUbEMsZ0JBQUFDLEtBQUFDO0FBMlRzQyxvQkFBQUEsT0FBQUQsTUFBQSx1QkFBRyxXQUFILGdCQUFBQSxJQUE0QixjQUE1QixnQkFBQUMsSUFBQSxLQUFBRDtBQUFBO0FBQ2hDLFlBQUksT0FBTyxXQUFXO0FBQ3BCLGdCQUFNRSxXQUFVLFNBQVMsZUFBZSxPQUFPLFNBQVM7QUFDeEQsY0FBSSxDQUFDQTtBQUFTO0FBQ2QsaUJBQU8sTUFBRztBQS9UbEIsZ0JBQUFGO0FBK1RxQixvQkFBQUEsTUFBQUUsU0FBUSxjQUFSLGdCQUFBRixJQUFBLEtBQUFFO0FBQUE7QUFBQSxRQUNmO0FBQ0E7QUFBQSxNQUNGO0FBQUEsV0FDSztBQUNILFlBQUksQ0FBQyxPQUFPO0FBQWU7QUFDM0IsY0FBTSxNQUFNLFNBQVMsZUFBZSxPQUFPLGFBQWE7QUFDeEQsWUFBSSxDQUFDO0FBQUs7QUFDVixlQUFPLENBQUMsTUFBTTtBQXZVcEIsY0FBQUY7QUF5VVEsZUFBSSx1QkFBRywwQkFBeUI7QUFBbUIsbUNBQUc7QUFDdEQsY0FBSSxlQUFlO0FBQUEsWUFDakIsWUFBVUEsTUFBQSxPQUFPLGVBQVAsZ0JBQUFBLElBQW1CLFFBQU8sV0FBVztBQUFBLFVBQ2pELENBQUM7QUFBQSxRQUNIO0FBQUEsV0FDRztBQUNILFlBQUksQ0FBQyxPQUFPO0FBQWU7QUFDM0IsY0FBTSxVQUFVLFNBQVMsZUFBZSxPQUFPLGFBQWE7QUFDNUQsWUFBSSxDQUFDO0FBQVM7QUFDZCxjQUFNLFFBQVEsTUFBTSxHQUFHLFFBQVEsUUFBUSxFQUFFO0FBQUEsVUFDdkMsQ0FBQyxPQUFPLEdBQUcsWUFBWTtBQUFBLFFBQ3pCO0FBQ0EsWUFBSSxDQUFDO0FBQU87QUFDWixjQUFNLEVBQUUsWUFBWSxxQkFBcUIsd0JBQXdCLElBQy9EO0FBQ0YsY0FBTSxXQUFXLEtBQUssTUFBTSxRQUFRLDhDQUFZLGFBQVosWUFBd0IsRUFBRTtBQUM5RCxjQUFNLGFBQTBCO0FBQUEsVUFDOUI7QUFBQSxZQUNFLE9BQU8sT0FBTztBQUFBLFlBQ2QsT0FBTztBQUFBLGNBQ0wsRUFBRSxLQUFLLGNBQWMsTUFBTSxVQUFVLElBQUksVUFBVTtBQUFBLGNBQ25ELEVBQUUsS0FBSyxXQUFXLE1BQU0sS0FBSyxJQUFJLElBQUk7QUFBQSxZQUN2QztBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBRUEsWUFBSSx3QkFBd0IsVUFBVTtBQUNwQyxpQkFBTyxNQUFNO0FBcFdyQixnQkFBQUEsS0FBQUMsS0FBQTtBQXFXVSxnQkFBSSxZQUFZLFNBQVM7QUFFdkIsb0JBQU0sU0FBUUQsTUFBQSxNQUFNLDBCQUFOLGdCQUFBQSxJQUFBO0FBQ2Qsa0JBQUksT0FBTztBQUNULHNCQUFNLFlBQVksQ0FBQyxVQUE0QjtBQUM3QyxzQkFBSSxVQUFVLE9BQU8sS0FBSyxLQUFLLFVBQVUsT0FBTyxLQUFLLEdBQUc7QUFDdEQsMEJBQU07QUFDTiw2QkFBUyxvQkFBb0IsYUFBYSxTQUFTO0FBQUEsa0JBQ3JEO0FBQUEsZ0JBQ0Y7QUFDQSx5QkFBUyxpQkFBaUIsYUFBYSxTQUFTO0FBQUEsY0FDbEQ7QUFBQSxZQUNGO0FBR0Esa0JBQU0scUJBQXFCLFdBQVcsTUFBTSxDQUFDO0FBQzdDLGtCQUFNLGFBQWE7QUFBQSxjQUNqQixNQUFNLHNCQUFzQixFQUFFLFNBQzNCQyxNQUFBLG1FQUF5QixNQUF6QixPQUFBQSxNQUE4QjtBQUFBLFlBQ25DO0FBQ0Esa0JBQU0sWUFBWTtBQUFBLGNBQ2hCLE1BQU0sc0JBQXNCLEVBQUUsUUFDM0Isd0VBQXlCLE1BQXpCLFlBQThCO0FBQUEsWUFDbkM7QUFDQSxrQkFBTSxNQUFNLFlBQVksUUFBUSxVQUFVO0FBQzFDLGtCQUFNLE1BQU0sWUFBWSxPQUFPLFNBQVM7QUFDeEMsaUJBQUkseUNBQVksVUFBUyxXQUFXO0FBQ2xDLGtCQUFJLFdBQVcsY0FBYyxRQUFRO0FBQ25DLG1DQUFtQixLQUFLO0FBQUEsa0JBQ3RCLE9BQU8sTUFBTTtBQUFBLGtCQUNiLE9BQU87QUFBQSxvQkFDTDtBQUFBLHNCQUNFLEtBQUs7QUFBQSxzQkFDTCxNQUFNO0FBQUEsc0JBQ04sSUFBSTtBQUFBLG9CQUNOO0FBQUEsa0JBQ0Y7QUFBQSxnQkFDRixDQUFDO0FBQUEsY0FDSCxXQUFXLFdBQVcsY0FBYyxTQUFTO0FBQzNDLG1DQUFtQixLQUFLO0FBQUEsa0JBQ3RCLE9BQU8sTUFBTTtBQUFBLGtCQUNiLE9BQU87QUFBQSxvQkFDTDtBQUFBLHNCQUNFLEtBQUs7QUFBQSxzQkFDTCxNQUFNO0FBQUEsc0JBQ04sSUFBSTtBQUFBLG9CQUNOO0FBQUEsb0JBQ0E7QUFBQSxzQkFDRSxLQUFLO0FBQUEsc0JBQ0wsTUFBTTtBQUFBLHNCQUNOLElBQUk7QUFBQSxvQkFDTjtBQUFBLGtCQUNGO0FBQUEsZ0JBQ0YsQ0FBQztBQUFBLGNBQ0gsV0FBVyxXQUFXLGNBQWMsT0FBTztBQUN6QyxtQ0FBbUIsS0FBSztBQUFBLGtCQUN0QixPQUFPLE1BQU07QUFBQSxrQkFDYixPQUFPO0FBQUEsb0JBQ0w7QUFBQSxzQkFDRSxLQUFLO0FBQUEsc0JBQ0wsTUFBTTtBQUFBLHNCQUNOLElBQUk7QUFBQSxvQkFDTjtBQUFBLGtCQUNGO0FBQUEsZ0JBQ0YsQ0FBQztBQUFBLGNBQ0gsV0FBVyxXQUFXLGNBQWMsVUFBVTtBQUM1QyxtQ0FBbUIsS0FBSztBQUFBLGtCQUN0QixPQUFPLE1BQU07QUFBQSxrQkFDYixPQUFPO0FBQUEsb0JBQ0w7QUFBQSxzQkFDRSxLQUFLO0FBQUEsc0JBQ0wsTUFBTTtBQUFBLHNCQUNOLElBQUk7QUFBQSxvQkFDTjtBQUFBLG9CQUNBO0FBQUEsc0JBQ0UsS0FBSztBQUFBLHNCQUNMLE1BQU07QUFBQSxzQkFDTixJQUFJO0FBQUEsb0JBQ047QUFBQSxrQkFDRjtBQUFBLGdCQUNGLENBQUM7QUFBQSxjQUNIO0FBQUEsWUFDRjtBQUNBLG1CQUFPO0FBQUEsY0FDTDtBQUFBLGNBQ0EseUNBQVk7QUFBQSxjQUNaO0FBQUEsY0FDQTtBQUFBLGNBQ0E7QUFBQSxjQUNBLEdBQUc7QUFBQSxjQUNIO0FBQUEsWUFDRixFQUFFO0FBQUEsVUFDSjtBQUFBLFFBQ0Y7QUFFQSxhQUFJLHlDQUFZLFVBQVMsV0FBVztBQUNsQyxxQkFBVztBQUFBLFlBQ1QsR0FBRyxvQkFBb0IsTUFBTSxJQUFJLHFCQUFxQixVQUFVO0FBQUEsVUFDbEU7QUFBQSxRQUNGLFdBQVcseUNBQVksTUFBTTtBQUMzQixrQkFBUSxLQUFLLDJCQUEyQixVQUFVO0FBQUEsUUFDcEQ7QUFDQSxlQUFPO0FBQUEsVUFDTDtBQUFBLFVBQ0EseUNBQVk7QUFBQSxVQUNaO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBLEdBQUc7QUFBQSxVQUNIO0FBQUEsUUFDRjtBQUFBLFdBQ0csV0FBVztBQUNkLGNBQU0sRUFBRSxZQUFBRSxhQUFZLFlBQUFDLGFBQVksUUFBUSxNQUFNLElBQUk7QUFDbEQsY0FBTUMsWUFBVyxLQUFLLE1BQU0sUUFBUSxLQUFBRCxlQUFBLGdCQUFBQSxZQUFZLGFBQVosWUFBd0IsRUFBRTtBQUM5RCxjQUFNTCxPQUFNO0FBQUEsVUFDVkk7QUFBQSxVQUNBQyxlQUFBLGdCQUFBQSxZQUFZO0FBQUEsVUFDWkM7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0EsUUFBUSxHQUFHLG9CQUFvQjtBQUFBLFFBQ2pDO0FBQ0EsZUFBTyxTQUFTLFNBQ1osQ0FBQyxHQUFHLE1BQU07QUFFUixnQkFBTSxPQUFPLFNBQVMsZUFBZSxNQUFNO0FBQzNDLGNBQUksTUFBTTtBQUNSLGtCQUFNLEVBQUUsVUFBVSxJQUFJO0FBQ3RCLGdCQUFJLHVDQUFXLFFBQVE7QUFDckIscUJBQU8sS0FBSztBQUNaLHdCQUFVLFFBQVEsRUFBRSxRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVcsSUFBSSxDQUFDO0FBQUEsWUFDekQ7QUFBQSxVQUNGO0FBQ0EsaUJBQU9OLEtBQUksR0FBRyxDQUFDO0FBQUEsUUFDakIsSUFDQUE7QUFBQSxNQUNOO0FBQUEsV0FDSyx3QkFBd0I7QUFDM0IsWUFBSSxDQUFDLE9BQU87QUFBZTtBQUMzQixjQUFNTyxPQUFNLFNBQVMsZUFBZSxPQUFPLGFBQWE7QUFDeEQsWUFBSSxDQUFDQTtBQUFLO0FBQ1YsZ0JBQVEsT0FBTztBQUFBLGVBQ1I7QUFDSCxtQkFBTyxLQUFLQSxJQUFHO0FBQUEsZUFDWjtBQUNILG1CQUFPLE9BQU9BLElBQUc7QUFBQSxlQUNkO0FBQ0gsbUJBQU8sV0FBV0EsSUFBRztBQUFBLGVBQ2xCO0FBQ0gsbUJBQU8sS0FBS0EsSUFBRztBQUFBLGVBQ1o7QUFDSCxtQkFBTyxNQUFNQSxJQUFHO0FBQUEsZUFDYjtBQUNILG1CQUFPLFdBQVdBLElBQUc7QUFBQSxlQUNsQjtBQUNILG1CQUFPLGFBQWFBLE1BQUssT0FBTyxZQUFZO0FBQUEsZUFDekM7QUFDSCxtQkFBTyxZQUFZQSxNQUFLLE9BQU8sWUFBWTtBQUFBLGVBQ3hDO0FBQ0gsbUJBQU8sT0FBT0EsTUFBSyxPQUFPLFlBQVk7QUFBQTtBQUFBLE1BRTVDO0FBQUE7QUFFRSxlQUFPLE1BQU0sUUFBUSxLQUFLLGlDQUFpQyxPQUFPLElBQUk7QUFBQTtBQUUxRSxXQUFPLE1BQU07QUFBQSxJQUFDO0FBQUEsRUFDaEI7QUFFQSxNQUFJLHFCQUFxQjtBQUV6QixXQUFTLHVCQUNQLGdCQUNBLFNBQVMsVUFDVEQsV0FDQVgsUUFDQUMsVUFDQSxPQUNBWSxRQUN5QjtBQUN6QixXQUFPLENBQUMsTUFBTTtBQUVaLFVBQUlKLGNBQWE7QUFDakIsVUFBSUksUUFBTztBQUVULGlCQUFTLEtBQUssY0FBZSxNQUFNLFdBQVc7QUFFOUMsUUFBQUosY0FBYTtBQUFBLFVBQ1g7QUFBQSxZQUNFLE9BQU9JLE9BQU07QUFBQSxZQUNiLE9BQU8sQ0FBQyxFQUFFLEtBQUssV0FBVyxNQUFNLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQztBQUFBLFVBQy9EO0FBQUEsVUFDQSxHQUFHSjtBQUFBLFFBQ0w7QUFBQSxNQUNGO0FBQ0EsWUFBTSxvQkFBb0I7QUFBQSxRQUN4QkE7QUFBQSxRQUNBO0FBQUEsUUFDQUU7QUFBQSxRQUNBWDtBQUFBLFFBQ0FDO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQ0EsWUFBTSxRQUFRLEtBQW9CLENBQUMsR0FBRyxNQUFZO0FBQ2hELFlBQUlZLFFBQU87QUFDVDtBQUVBLG1CQUFTLEtBQUssY0FBZSxNQUFNLFdBQVc7QUFBQSxRQUNoRDtBQUNBO0FBQUEsVUFDRTtBQUFBLFVBQ0E7QUFBQSxVQUNBLElBQUksSUFBSUY7QUFBQSxVQUNSWDtBQUFBLFVBQ0FDO0FBQUEsVUFDQSxHQUFHO0FBQUEsUUFDTDtBQUFBLE1BQ0YsQ0FBQztBQUNELFVBQUlZO0FBQU8sUUFBQUEsT0FBTSxZQUFZO0FBQzdCLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUdBLE1BQU0sbUJBQW1CLG9CQUFJLElBQW9CO0FBRWpELFdBQVMsa0JBQ1BKLGFBQ0EsUUFDQUUsV0FDQVgsUUFDQUMsVUFDQSxPQUNBLEdBQ2E7QUEva0JmO0FBaWxCRSxRQUFJLE1BQXdDO0FBQzFDLGNBQVEsTUFBTSx5QkFBeUIsVUFBVVEsYUFBWVQsTUFBSztBQUFBLElBQ3BFO0FBQ0EsVUFBTSxVQUF1QixDQUFDO0FBQzlCLFVBQU0sc0JBQXNCLG9CQUFJLElBQWlCO0FBRWpELFFBQUlDLGFBQVksUUFBUTtBQUN0QjtBQUFBLFFBQ0VRO0FBQUEsUUFDQTtBQUFBLFFBQ0FFO0FBQUEsUUFDQVg7QUFBQSxRQUNDLEVBQTRCO0FBQUEsTUFDL0I7QUFDQSxhQUFPLENBQUM7QUFBQSxJQUNWO0FBRUEsZUFBVyxFQUFFLE9BQU8sT0FBTyxPQUFPLFVBQVUsS0FBS1MsYUFBWTtBQUMzRCxVQUFJRyxPQUFNLFNBQVMsZUFBZSxLQUFLO0FBQ3ZDLFVBQUksQ0FBQ0EsTUFBSztBQUNSLGNBQU0sU0FBUyxpQkFBaUIsSUFBSSxLQUFLO0FBQ3pDLFlBQUksUUFBUTtBQUNWLFVBQUFBLE9BQU0sU0FBUyxlQUFlLE1BQU07QUFBQSxRQUN0QztBQUFBLE1BQ0Y7QUFDQSxVQUFJLENBQUNBLE1BQUs7QUFDUix3QkFBZ0IsOEJBQThCLE9BQU87QUFDckQ7QUFBQSxNQUNGO0FBQ0EsVUFBSSxPQUFPO0FBQ1QsWUFBSSxNQUFNLFNBQVMsZUFBZSxLQUFLO0FBQ3ZDLFlBQUksQ0FBQyxLQUFLO0FBQ1IsZ0JBQU0sU0FBUyxTQUFTLGVBQWUsV0FBVyxLQUFLLENBQUM7QUFDeEQsY0FBSSxDQUFDLFFBQVE7QUFDWCw0QkFBZ0IsK0JBQStCLE9BQU87QUFDdEQ7QUFBQSxVQUNGO0FBQ0EsZ0JBQU0sZUFBZSxZQUErQixZQUEvQixtQkFBd0M7QUFBQSxZQUMzRDtBQUFBO0FBRUYsZ0JBQU0sWUFBWSxjQUFjLEdBQUc7QUFBQSxRQUNyQztBQUdBLGNBQU0sRUFBRSxZQUFZLElBQUlBO0FBQ3hCLGNBQU0sY0FBYSxLQUFBQSxLQUFJLDBCQUFKLHdCQUFBQTtBQUNuQixZQUFJLFlBQVk7QUFDZCw0QkFBa0IsS0FBSyxVQUFVO0FBQUEsUUFDbkM7QUFFQSxZQUFJO0FBQWEsY0FBSSxpQkFBaUIsV0FBVyxXQUFXO0FBRzVELFlBQUksY0FBYyxhQUFhO0FBRTdCLGtDQUF3QixHQUFHO0FBQUEsUUFDN0I7QUFFQSxhQUFLLEtBQUssTUFBTUQsU0FBUTtBQUN4QixZQUFJQSxXQUFVO0FBQ1osVUFBQUMsS0FBSSxzQkFBc0IsWUFBWSxHQUFHO0FBRXpDO0FBQUEsWUFDRUE7QUFBQSxZQUNBO0FBQUEsY0FDRTtBQUFBLGdCQUNFLEtBQUs7QUFBQSxnQkFDTCxNQUFNLGlCQUFpQkEsSUFBRyxFQUFFO0FBQUEsZ0JBQzVCLElBQUk7QUFBQSxjQUNOO0FBQUEsWUFDRjtBQUFBLFlBQ0E7QUFBQSxZQUNBRDtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQ0E7QUFBQSxZQUNFO0FBQUEsWUFDQTtBQUFBLGNBQ0U7QUFBQSxnQkFDRSxLQUFLO0FBQUEsZ0JBQ0wsTUFBTTtBQUFBLGdCQUNOLElBQUk7QUFBQSxjQUNOO0FBQUEsY0FDQTtBQUFBLGdCQUNFLEtBQUs7QUFBQSxnQkFDTCxNQUFNO0FBQUEsZ0JBQ04sSUFBSTtBQUFBLGNBQ047QUFBQSxZQUNGO0FBQUEsWUFDQTtBQUFBLFlBQ0FBO0FBQUEsWUFDQTtBQUFBLFVBQ0Y7QUFBQSxRQUNGLE9BQU87QUFDTCxVQUFBQyxLQUFJLGNBQWUsYUFBYSxLQUFLQSxJQUFHO0FBQ3hDLGNBQUksU0FBUyxTQUFTLGVBQWUsV0FBVyxLQUFLLENBQUM7QUFDdEQsY0FBSSxDQUFDLFFBQVE7QUFDWCxnQkFBSSxNQUF3QztBQUMxQyxzQkFBUSxNQUFNLHVDQUF1QyxPQUFPO0FBQUEsWUFDOUQ7QUFFQSxxQkFBUyxTQUFTLGNBQWMsVUFBVTtBQUMxQyxtQkFBTyxLQUFLLFdBQVcsS0FBSztBQUM1QixtQkFBTyxZQUFZQSxLQUFJO0FBQ3ZCLGdCQUFJLHNCQUFzQixZQUFZLE1BQU07QUFBQSxVQUM5QztBQUNBLDJCQUFpQixJQUFJLE9BQU8sSUFBSSxFQUFFO0FBQUEsUUFDcEM7QUFDQSxnQkFBUSxLQUFLO0FBQUEsVUFDWCxPQUFPLElBQUk7QUFBQSxVQUNYLE9BQU9BLEtBQUk7QUFBQSxRQUNiLENBQUM7QUFFRCxZQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsaUJBQWlCLGFBQWEsQ0FBQyxHQUFHO0FBQ2xFLDhCQUFvQixJQUFJLElBQUksYUFBYztBQUFBLFFBQzVDO0FBQUEsTUFDRixPQUFPO0FBQ0wsY0FBTSxnQkFBZ0IsU0FBUyxDQUFDLEdBQzdCLElBQUksQ0FBQyxPQUFPO0FBQ1gsZ0JBQU0sT0FBTyxXQUFXQSxNQUFNLEdBQUcsS0FBSyxHQUFHLElBQUk7QUFDN0MsZ0JBQU0sS0FBSyxXQUFXQSxNQUFNLEdBQUcsS0FBSyxHQUFHLEVBQUU7QUFFekMsaUJBQU87QUFBQSxZQUNMLEtBQUssR0FBRztBQUFBLFlBQ1IsUUFBUSxHQUFHO0FBQUEsWUFDWDtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsUUFDRixDQUFDLEVBQ0EsT0FBTyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsRUFBRTtBQUVuQyxxQkFBYUEsTUFBSyxjQUFjLFFBQVFELFdBQVUsbUJBQW1CO0FBQ3JFLFlBQUksV0FBVztBQUNiLGNBQUlWLGFBQVksU0FBUztBQUN2QixrQkFBQVcsS0FBSSwwQkFBSix3QkFBQUE7QUFBQSxVQUNGO0FBQ0Esb0JBQVUsUUFBUSxDQUFDLE9BQU8sUUFBUUEsTUFBTSxHQUFHLE1BQU0sR0FBRyxJQUFJRCxTQUFRLENBQUM7QUFBQSxRQUNuRTtBQUNBLGNBQU0sTUFBaUI7QUFBQSxVQUNyQjtBQUFBLFVBQ0EsT0FBTyxhQUFhLElBQUksQ0FBQyxNQUFNO0FBQzdCLGtCQUFNLE1BQW9CO0FBQUEsY0FDeEIsS0FBSyxFQUFFO0FBQUEsY0FDUCxNQUFNLEVBQUU7QUFBQSxjQUNSLElBQUksRUFBRTtBQUFBLFlBQ1I7QUFDQSxnQkFBSSxFQUFFO0FBQVEsa0JBQUksU0FBUyxFQUFFO0FBQzdCLG1CQUFPO0FBQUEsVUFDVCxDQUFDO0FBQUEsUUFDSDtBQUNBLFlBQUksV0FBVztBQUNiLGNBQUksWUFBWSxVQUFVLElBQUksQ0FBQyxRQUFRO0FBQUEsWUFDckMsTUFBTSxHQUFHO0FBQUEsWUFDVCxNQUFNLEdBQUc7QUFBQSxZQUNULElBQUksR0FBRztBQUFBLFVBQ1QsRUFBRTtBQUFBLFFBQ0o7QUFDQSxnQkFBUSxLQUFLLEdBQUc7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFDQSxlQUFXLGFBQWEscUJBQXFCO0FBRTNDLFlBQU0sV0FBVyxNQUFNLEtBQUssVUFBVSxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO0FBQzFFLFVBQUksa0JBQWtCO0FBQ3RCLGVBQ0csS0FBSyxDQUFDLEdBQUcsTUFBTTtBQUNkLGNBQU0sU0FBUyxFQUNiLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxpQkFBaUIsYUFBYSxLQUFLO0FBRTVELGNBQU0sU0FBUyxFQUNiLGlCQUFpQixFQUFFLEVBQUUsRUFBRSxpQkFBaUIsYUFBYSxLQUFLO0FBRTVELGVBQU8sU0FBUztBQUFBLE1BQ2xCLENBQUMsRUFDQSxRQUFRLENBQUMsT0FBTyxNQUFNO0FBQ3JCLFlBQUksaUJBQWlCO0FBQ25CLG9CQUFVLFlBQVksTUFBTSxFQUFFO0FBQUEsUUFDaEMsT0FBTztBQUVMLDRCQUFrQixNQUFNLE1BQU07QUFBQSxRQUNoQztBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0w7QUFDQSxXQUFPO0FBQUEsRUFDVDtBQUVBLFdBQVMsd0JBQXdCQyxNQUF5QjtBQUN4RCxRQUFJLElBQXlCQTtBQUM3QixXQUFPLEdBQUc7QUFDUixRQUFFLFVBQVUsT0FBTyxxQkFBcUI7QUFDeEMsVUFBSSxFQUFFO0FBQUEsSUFDUjtBQUFBLEVBQ0Y7QUFFQSxXQUFTLGlCQUNQSCxhQUNBLFFBQ0FFLFdBQ0FYLFFBQ0EsVUFDTTtBQUNOLFFBQUksU0FBUztBQUFTO0FBRXRCLFVBQU0sUUFBUUEsT0FBTSxzQkFBc0I7QUFDMUMsVUFBTSxNQUFNO0FBQUEsTUFDVlMsWUFDRyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFDdkIsSUFBSSxDQUFDLEVBQUUsT0FBTyxNQUFNLE9BQU8sRUFBRSxPQUFPLE1BQU0sRUFBRTtBQUFBLE1BQy9DO0FBQUEsTUFDQTtBQUFBLE1BQ0FUO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQ0EsVUFBTSxRQUFRQSxPQUFNLHNCQUFzQjtBQUMxQyxVQUFNLFFBQVEsTUFBTSxPQUFPLE1BQU07QUFDakMsVUFBTSxRQUFRLE1BQU0sTUFBTSxNQUFNO0FBQ2hDLFVBQU0sU0FBUyxLQUFLLEtBQUssUUFBUSxRQUFRLFFBQVEsS0FBSztBQUV0RCxzQkFBa0IsS0FBSyxVQUFVLEdBQUdBLFFBQU8sU0FBUyxzQkFBc0I7QUFDMUUsVUFBTSxFQUFFLEdBQUcsT0FBTyxHQUFHLE1BQU0sSUFBSSxZQUFZLFNBQVMsT0FBTyxTQUFTLEdBQUc7QUFDdkUsVUFBTSx1QkFDSCxRQUFRLEtBQUssUUFBUSxLQUNyQixRQUFRLEtBQUssUUFBUSxLQUNyQixVQUFVLE1BQU8sUUFBUSxLQUFLLFFBQVEsS0FBTyxRQUFRLEtBQUssUUFBUTtBQUNyRSxRQUFJLHNCQUFzQjtBQUN4QixlQUFTLFVBQVU7QUFDbkIsWUFBTSxZQUFZUyxZQUFXLElBQUksQ0FBQyxPQUFJO0FBcHpCMUM7QUFvekI4QyxnREFDckMsS0FEcUM7QUFBQSxVQUV4QyxTQUFTO0FBQUEsVUFDVCxRQUFPLFFBQUcsVUFBSCxtQkFBVSxJQUFJLENBQUMsTUFBTyxpQ0FBSyxJQUFMLEVBQVEsTUFBTSxFQUFFLEtBQUs7QUFBQSxRQUNwRDtBQUFBLE9BQUU7QUFDRixZQUFNLGFBQWEsQ0FBQyxNQUF3QjtBQUMxQyxjQUFNLEVBQUUsR0FBR0ssUUFBTyxHQUFHQyxPQUFNLElBQUksWUFBWSxFQUFFLE9BQU8sRUFBRSxHQUFHO0FBQ3pELGNBQU0sUUFBUUQsU0FBUSxRQUFRQyxTQUFRLFNBQVM7QUFDL0MsZUFBTyxLQUFLLElBQUksR0FBRyxLQUFLLElBQUksS0FBTSxNQUFNLE9BQVEsTUFBTSxDQUFDO0FBQUEsTUFDekQ7QUFDQSxZQUFNLE9BQU8sQ0FBQyxNQUFzQjtBQUNsQyxVQUFFLElBQUksZUFBZTtBQUNyQixVQUFFLElBQUksZ0JBQWdCO0FBQ3RCLGNBQU0sVUFBVSxXQUFXLENBQUM7QUFDNUI7QUFBQSxVQUNFO0FBQUEsWUFDRSxVQUFVLElBQUksQ0FBQyxPQUFPO0FBQ3BCLG9CQUFrQyxTQUExQixhQUFXLEVBcjBCL0IsSUFxMEI4QyxJQUFULGlCQUFTLElBQVQsQ0FBakI7QUFDUixrQkFBSSxHQUFHLE9BQU87QUFDWix1QkFBTyxpQ0FDRixPQURFO0FBQUEsa0JBRUwsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU07QUFDekIsMEJBQU0sS0FBSyxZQUFZLEdBQUcsT0FBTztBQUNqQywwQkFBTSxPQUFPLEVBQUU7QUFDZixzQkFBRSxPQUFPO0FBQ1QsMkJBQU8saUNBQ0YsSUFERTtBQUFBLHNCQUVMO0FBQUEsc0JBQ0E7QUFBQSxvQkFDRjtBQUFBLGtCQUNGLENBQUM7QUFBQSxnQkFDSDtBQUFBLGNBQ0Y7QUFDQSxrQkFBSSxHQUFHLE9BQU87QUFDWixvQkFBSSxVQUFVLE1BQU0sR0FBRyxTQUFTO0FBQzlCLHFCQUFHLFVBQVU7QUFDYix5QkFBTyxFQUFFLE9BQU8sR0FBRyxPQUFPLE9BQU8sR0FBRyxNQUFNO0FBQUEsZ0JBQzVDO0FBQ0Esb0JBQUksV0FBVyxNQUFNLENBQUMsR0FBRyxTQUFTO0FBQ2hDLHFCQUFHLFVBQVU7QUFDYix5QkFBTztBQUFBLGdCQUNUO0FBQUEsY0FDRjtBQUNBLHFCQUFPO0FBQUEsWUFDVCxDQUFDO0FBQUEsVUFDSDtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQWY7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQ0EsV0FBSyxRQUFRO0FBQ2IsTUFBQUEsT0FBTSxvQkFBb0IsQ0FBQyxNQUFnQjtBQUN6QyxhQUFLLENBQUM7QUFDTixZQUFJLEVBQUUsVUFBVTtBQUNkLGdCQUFNLFVBQVUsV0FBVyxDQUFDO0FBQzVCO0FBQUEsWUFDRTtBQUFBLGNBQ0UsVUFBVSxJQUFJLENBQUMsT0FBTztBQUNwQixvQkFBSSxHQUFHLE9BQU87QUFDWix3QkFBTSxZQUFZLFVBQVUsS0FBSyxTQUFZLEdBQUc7QUFDaEQseUJBQU87QUFBQSxvQkFDTCxPQUFPLEdBQUc7QUFBQSxvQkFDVixPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTyxpQ0FDdkIsSUFEdUI7QUFBQSxzQkFFMUIsTUFBTSxFQUFFO0FBQUEsc0JBQ1IsSUFBSSxVQUFVLEtBQUssRUFBRSxPQUFPLEVBQUU7QUFBQSxvQkFDaEMsRUFBRTtBQUFBLG9CQUNGO0FBQUEsa0JBQ0Y7QUFBQSxnQkFDRjtBQUNBLG9CQUFJLEdBQUcsT0FBTztBQUNaLHNCQUFJLFVBQVUsTUFBTSxHQUFHLFNBQVM7QUFDOUIsdUJBQUcsVUFBVTtBQUNiLDJCQUFPLEVBQUUsT0FBTyxHQUFHLE9BQU8sT0FBTyxHQUFHLE1BQU07QUFBQSxrQkFDNUM7QUFDQSxzQkFBSSxXQUFXLE1BQU0sQ0FBQyxHQUFHLFNBQVM7QUFDaEMsdUJBQUcsVUFBVTtBQUNiLDJCQUFPO0FBQUEsa0JBQ1Q7QUFBQSxnQkFDRjtBQUNBLHVCQUFPO0FBQUEsY0FDVCxDQUFDO0FBQUEsWUFDSDtBQUFBLFlBQ0E7QUFBQSxZQUNBVztBQUFBLFlBQ0FYO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLFdBQVMsV0FDUFksTUFDQSxLQUNBLEdBQ3NCO0FBQ3RCLFFBQUksTUFBTTtBQUFZLGFBQU87QUFDN0IsV0FBTyxpQkFBaUJBLElBQUcsRUFBRSxpQkFBaUIsR0FBRztBQUFBLEVBQ25EO0FBRUEsV0FBUyxLQUNQLE1BQ0EsV0FBVyxPQUNYLHdCQUF3QixHQUNsQjtBQUNOLGVBQVcsUUFBUSxnQkFBZ0I7QUFDakMsaUJBQVdBLFFBQU87QUFBQSxRQUNoQjtBQUFBLFFBQ0Esa0JBQWtCO0FBQUEsUUFDbEI7QUFBQSxNQUNGLEdBQUc7QUFDRDtBQUFBLFVBQ0VBO0FBQUEsVUFDQTtBQUFBLFVBQ0FBLEtBQUksYUFBYSxpQkFBaUIsTUFBTTtBQUFBLFVBQ3hDO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLFdBQVMsb0JBQ1AsTUFDQSxLQUNBLGNBQWMsT0FDRTtBQUNoQixVQUFNLE1BQU0sQ0FBQyxHQUFHLEtBQUssaUJBQWlCLEdBQUcsQ0FBQztBQUMxQyxRQUFJLGVBQWUsS0FBSyxRQUFRLEdBQUcsR0FBRztBQUNwQyxVQUFJLFFBQVEsSUFBSTtBQUFBLElBQ2xCO0FBQ0EsV0FBTztBQUFBLEVBQ1Q7QUFJQSxXQUFTLFFBQ1BBLE1BQ0EsTUFDQSxJQUFJLElBQ0osd0JBQXdCLEdBQ2xCO0FBdDhCUjtBQXU4QkUsUUFBSSxDQUFDLEdBQUc7QUFDTixVQUFJLFNBQVMsU0FBUztBQUNwQixZQUFJLE1BQXdDO0FBQzFDLGtCQUFRLE1BQU0saUJBQWlCLFdBQVdBLElBQUc7QUFBQSxRQUMvQztBQUNBLDZCQUFxQkEsTUFBSyxJQUFJO0FBQzlCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFDQSxRQUFJLFFBQVE7QUFDWixRQUFJLEVBQUUsT0FBTyxLQUFLO0FBQ2hCLFlBQU0sTUFBTSxFQUFFLFFBQVEsSUFBSTtBQUMxQixjQUFRLFdBQVcsRUFBRSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUs7QUFDdkMsVUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQUEsSUFDckI7QUFDQSxVQUFNLFlBQVksYUFBYTtBQUMvQixVQUFNLFVBQVUsWUFBWSxFQUFFLE1BQU0sR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLFVBQVUsR0FBRyxDQUFDO0FBQ25FLFFBQUksTUFBd0M7QUFDMUMsY0FBUSxNQUFNLGNBQWMsV0FBV0EsTUFBSyxNQUFNLE9BQU87QUFBQSxJQUMzRDtBQUNBLFVBQU1QLE9BQU0sYUFBYSxTQUFTTyxNQUFLLElBQUk7QUFDM0MsUUFBSSxTQUFTLFdBQVc7QUFDdEIsNEJBQXNCQSxNQUFLLE1BQU1QLEtBQUksR0FBRyxRQUFRLHFCQUFxQjtBQUNyRTtBQUFBLElBQ0Y7QUFDQSw0QkFBd0JPLElBQUc7QUFDM0IsUUFBSSxTQUFTLFNBQVM7QUFFcEIsVUFBSSxTQUEyQztBQUMvQyxZQUFNLFVBQVUsTUFBWTtBQUMxQjtBQUNBLGlCQUFTO0FBQUEsTUFDWDtBQUNBLE1BQUFBLEtBQUksY0FBYztBQUNsQjtBQUFBLFFBQ0VBO0FBQUEsUUFDQTtBQUFBLFFBQ0EsQ0FBQyxNQUFrQjtBQUNqQjtBQUNBLG1CQUFTUCxLQUFJLENBQUM7QUFBQSxRQUNoQjtBQUFBLFFBQ0E7QUFBQSxRQUNBLGVBQWVPLE1BQUssV0FBVyxPQUFPO0FBQUEsTUFDeEM7QUFBQSxJQUNGLFdBQVcsU0FBUyxRQUFRO0FBQzFCO0FBQUEsUUFDRUE7QUFBQSxRQUNBO0FBQUEsUUFDQSxDQUFDLE1BQTZCO0FBQzVCLFVBQUFQLEtBQUksQ0FBQztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0YsV0FBVyxTQUFTLFNBQVM7QUFFM0IsVUFBSSxTQUEyQztBQUMvQyxZQUFNLGtCQUFrQixDQUFDLE1BQXlCO0FBQ2hELFlBQUksQ0FBQztBQUFRLG1CQUFTLEtBQUtBLEtBQUksQ0FBQyxDQUFDO0FBQUEsTUFDbkM7QUFDQSxZQUFNLFFBQU8sS0FBQU8sS0FBSSwwQkFBSix3QkFBQUE7QUFDYixZQUFNLGFBQWEsTUFBWTtBQUM3QjtBQUNBLGlCQUFTO0FBQ1Q7QUFBQSxNQUNGO0FBRUEsWUFBTSxVQUFVLFdBQVcsTUFBTTtBQUMvQixZQUFJQSxLQUFJLFFBQVEsUUFBUSxHQUFHO0FBQ3pCLGNBQThDLENBQUMsUUFBUTtBQUNyRCxvQkFBUSxJQUFJLDBCQUEwQjtBQUFBLFVBQ3hDO0FBQ0EsMEJBQWdCO0FBQUEsUUFDbEI7QUFBQSxNQUNGLEdBQUcscUJBQXFCO0FBQ3hCLFlBQU0sb0JBQW9CLGtCQUFrQkEsTUFBSyxZQUFZLE9BQU87QUFDcEU7QUFBQSxRQUNFQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRixPQUFPO0FBQ0wsVUFBSSxTQUFTLGFBQWEsQ0FBQ0EsS0FBSSxhQUFhLFVBQVUsR0FBRztBQUV2RCxRQUFBQSxLQUFJLGFBQWEsWUFBWSxJQUFJO0FBQUEsTUFDbkM7QUFDQSxVQUFJLFNBQVMsVUFBVTtBQUNyQix1QkFBZSxRQUFRQSxJQUFHO0FBQUEsTUFDNUI7QUFDQTtBQUFBLFFBQ0VBO0FBQUEsUUFDQTtBQUFBLFFBQ0EsQ0FBQyxNQUFvQjtBQUNuQixjQUFJLFNBQVMsV0FBVztBQUd0QixjQUFFLGdCQUFnQjtBQUFBLFVBQ3BCO0FBRUEsY0FBSTtBQUFPLHVCQUFXLE1BQU1QLEtBQUksQ0FBQyxHQUFHLEtBQUs7QUFBQTtBQUNwQyxZQUFBQSxLQUFJLENBQUM7QUFBQSxRQUNaO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUVBLFdBQVMsa0JBQ1BPLE1BQ0EsWUFDQSxVQUFVLEdBQ1E7QUFDbEIsVUFBTSxRQUFRLGVBQWVBLE1BQUssY0FBYyxVQUFVO0FBQzFELFVBQU0sb0JBQW9CLE1BQW9CO0FBQzVDLFlBQU07QUFDTixtQkFBYSxPQUFPO0FBQ3BCLFVBQUlBLEtBQUksbUJBQW1CO0FBQVksZUFBT0EsS0FBSTtBQUNsRCxVQUFJQSxLQUFJLDBCQUEwQjtBQUNoQyxlQUFPQSxLQUFJO0FBQ2IsYUFBTztBQUFBLElBQ1Q7QUFDQSxJQUFBQSxLQUFJLGlCQUFpQjtBQUNyQixXQUFRQSxLQUFJLHdCQUF3QjtBQUFBLEVBQ3RDO0FBRUEsV0FBUyxVQUNQLEVBQUUsU0FBUyxRQUFRLEdBQ25CWixRQUNTO0FBQ1QsVUFBTSxxQkFBcUI7QUFDM0IsVUFBTSxFQUFFLEtBQUssTUFBTSxPQUFPLE9BQU8sSUFBSUEsT0FBTSxzQkFBc0I7QUFDakUsV0FDRSxVQUFVLFFBQVEsc0JBQ2xCLFVBQVUsT0FBTyxzQkFDakIsVUFBVSxTQUFTLHNCQUNuQixVQUFVLE1BQU07QUFBQSxFQUVwQjtBQUVBLFdBQVMsb0JBQW9CLE1BQXNCO0FBQ2pELFdBQU8sZUFBZTtBQUFBLEVBQ3hCO0FBRUEsV0FBUyxzQkFDUFksTUFDQSxJQUNBLE9BQ007QUEzbENSO0FBNGxDRSxVQUFNLFVBQVUsV0FBVyxJQUFJLEtBQUs7QUFDcEMsVUFBQUEsS0FBSSx3QkFBSix3QkFBQUE7QUFDQSxJQUFBQSxLQUFJLHNCQUFzQixNQUFNO0FBQzlCLGFBQU9BLEtBQUk7QUFDWCxtQkFBYSxPQUFPO0FBQUEsSUFDdEI7QUFBQSxFQUNGO0FBRUEsV0FBUyxxQkFDUEEsTUFDQSxnQkFDTTtBQXZtQ1I7QUF3bUNFLFVBQU0sYUFBYSxvQkFBb0IsY0FBYztBQUNyRCxLQUFDLEtBQUFBLEtBQVksZ0JBQVosd0JBQUFBO0FBQUEsRUFDSDtBQUVBLFdBQVMsNEJBR1BBLE1BQ0EsTUFDQSxVQUNBLG1CQUNHLGlCQUNHO0FBcG5DUjtBQXFuQ0UsVUFBTSxXQUFXLENBQUMsR0FBRyxpQkFBaUIsZUFBZUEsTUFBSyxNQUFNLFFBQVEsQ0FBQztBQUN6RSxVQUFNLGFBQWEsb0JBQW9CLGNBQWM7QUFDckQsS0FBQyxLQUFBQSxLQUFZLGdCQUFaLHdCQUFBQTtBQUNELElBQUNBLEtBQVksY0FBYyxNQUFNO0FBQy9CLGFBQVFBLEtBQVk7QUFDcEIsZUFBUyxRQUFRLENBQUMsT0FBTyxHQUFHLENBQUM7QUFBQSxJQUMvQjtBQUFBLEVBQ0Y7QUFFQSxXQUFTLGVBQ1BBLE1BQ0EsTUFDQSxVQUNBLFNBQ1c7QUFDWCxVQUFNLGNBQStCLENBQUMsTUFBTTtBQUMxQyxVQUE4QyxTQUFTLGFBQWE7QUFDbEUsZ0JBQVE7QUFBQSxVQUNOLEdBQUdBLEtBQUksY0FBYyxhQUFhLGNBQWM7QUFBQSxVQUNoRCxFQUFFO0FBQUEsUUFDSjtBQUFBLE1BQ0Y7QUFFQSxVQUFJLENBQUNBLEtBQUk7QUFBYTtBQUN0QixlQUFTLENBQUM7QUFBQSxJQUNaO0FBRUEsSUFBQUEsS0FBSSxpQkFBaUIsTUFBTSxhQUFhLE9BQU87QUFDL0MsV0FBTyxNQUFNO0FBRVgsTUFBQUEsS0FBSSxvQkFBb0IsTUFBTSxhQUFhLE9BQU87QUFBQSxJQUNwRDtBQUFBLEVBQ0Y7QUFHQSxNQUFNLG1CQUFtQjtBQUN6QixNQUFNLFdBQVc7QUFDakIsU0FBTyxtQkFBbUIsQ0FBQyxVQUFPO0FBMXBDbEM7QUEycENFLHdCQUFPLHNCQUFQLG1CQUEwQjtBQUFBLE1BQVEsQ0FBQyxZQUNqQyw4QkFBOEIsU0FBUyxLQUFLO0FBQUE7QUFBQTtBQUdoRCxNQUFJLE9BQU8sbUJBQW1CO0FBQzVCLFVBQU0sa0JBQWtCLFdBQVcsOEJBQThCLEVBQUU7QUFDbkUsVUFBTSxtQkFBbUIsa0JBQWtCLFNBQVM7QUFDcEQsVUFBTSxpQkFBaUIsNkNBQWMsUUFBUTtBQUM3QyxnQkFBWSxRQUFRLE1BQU07QUFucUM1QjtBQW9xQ0ksWUFBTSxvQkFBb0IsU0FBUyxLQUFLLGFBQWEsb0JBQW9CO0FBQ3pFLFlBQU0sZUFBYyxxREFBcUIsbUJBQXJCLFlBQXVDO0FBQzNELG1CQUFPLHFCQUFQLGdDQUEwQjtBQUFBLElBQzVCLENBQUM7QUFBQSxFQUNIO0FBQ0EsTUFBSSxPQUFPLGVBQWU7QUFDeEIsUUFBSSxpQkFBaUIsNkNBQWMsUUFBUTtBQUMzQyxnQkFBWSxRQUFRLE1BQU07QUEzcUM1QjtBQTRxQ0ksWUFBTSxhQUFhLE1BQU07QUFBQSxRQUN2QixTQUFTLEtBQUssaUJBQWlCLHVCQUF1QjtBQUFBLE1BQ3hEO0FBQ0EsWUFBTSxZQUNKLFdBQVcsV0FBVyxLQUN0QixXQUFXO0FBQUEsUUFDVCxDQUFDLE9BQ0MsR0FBRyxhQUFhLFVBQVUsTUFBTSxlQUNoQyxHQUFHLGFBQWEsTUFBTSxNQUFNLE9BQU8sU0FBUztBQUFBLE1BQ2hEO0FBQ0YsVUFBSSxDQUFDLFdBQVc7QUFFZCx5QkFBaUIsU0FBUyxnQkFBZ0I7QUFBQSxNQUM1QztBQUNBLFlBQU0sU0FBUSxvQkFBUyxLQUNwQixjQUErQix1QkFBdUIsTUFEM0MsbUJBRVYsU0FGVSxtQkFFSixTQUFTO0FBQ25CLG1CQUFPLGtCQUFQLG1CQUFzQixRQUFRLENBQUMsWUFBWTtBQTdyQy9DLFlBQUFOO0FBOHJDTSxjQUFNLFVBQVUsT0FBTztBQUFBLFVBQ3JCLE9BQU8sUUFBUSxZQUFZLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsWUFBWSxHQUFHLENBQUMsQ0FBQztBQUFBLFFBQ3hFO0FBQ0EsY0FBTSxRQUFRLENBQUMsR0FBRyxVQUFVLFNBQVM7QUFDckMsWUFBSTtBQUFnQixnQkFBTSxRQUFRLGNBQWM7QUFDaEQsaUJBQVMsUUFBUSxPQUFPO0FBQ3RCLGlCQUFPLEtBQUssWUFBWTtBQUN4QixnQkFBTSxPQUFPLEtBQUssTUFBTSxHQUFHLEVBQUU7QUFDN0IsZ0JBQU0sYUFBWUEsTUFBQSxRQUFRLFVBQVIsT0FBQUEsTUFBaUIsUUFBUTtBQUMzQyxjQUFJLFdBQVc7QUFDYiwwQ0FBOEIsU0FBUyxTQUFTO0FBQ2hELGdCQUFJLENBQUM7QUFBTyx1QkFBUyxTQUFTLFNBQVM7QUFDdkM7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBRUEsTUFBTSx5QkFBaUQsQ0FBQztBQUN4RCxNQUFNLDBCQUEwQixPQUFPO0FBQUEsSUFDckMsT0FBTyxRQUFRLGtCQUFrQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07QUFBQSxNQUNsRDtBQUFBLE1BQ0EsT0FBTyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLFNBQVMsRUFBRTtBQUFBLElBQ3RFLENBQUM7QUFBQSxFQUNIO0FBQ0EsV0FBUyx3QkFBOEI7QUF4dEN2QztBQXl0Q0UsVUFBTSxVQUFRLFlBQU8sbUJBQVAsbUJBQXVCLFVBQVMsT0FBTztBQUNyRCxlQUFXLENBQUMsZ0JBQWdCLFdBQVcsS0FBSyxPQUFPO0FBQUEsTUFDakQ7QUFBQSxJQUNGLEdBQUc7QUFDRCxZQUFNLE1BQU0sQ0FBQyxHQUFHLFdBQVc7QUFDM0IsVUFBSSxVQUFVLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRSxHQUFHO0FBQ2xDLGlCQUFXLEVBQUUsTUFBTSxTQUFTLEtBQUssS0FBSztBQUNwQyxZQUFJLFNBQVM7QUFBVSxvQkFBVTtBQUFBLE1BQ25DO0FBQ0EsVUFBSSxZQUFZLHVCQUF1QixpQkFBaUI7QUFDdEQsc0NBQThCLGdCQUFnQixPQUFPO0FBQ3JELCtCQUF1QixrQkFBa0I7QUFBQSxNQUMzQztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUEsTUFBSSxlQUFlO0FBQ25CLGNBQVksUUFBUSxNQUFNO0FBQ3hCLFFBQUksYUFBcUM7QUFDekMsUUFBSSxpQkFBaUI7QUFDckIsbUJBQWUsVUFBaUIsYUFBYSxDQUFDLE1BQWtCO0FBQzlELG1CQUFhO0FBQ2IscUJBQWU7QUFBQSxJQUNqQixDQUFDO0FBQ0QsbUJBQWUsVUFBaUIsYUFBYSxDQUFDLE1BQWtCO0FBanZDbEU7QUFrdkNJLFVBQUksY0FBYyxZQUFZLFlBQVksQ0FBQyxFQUFFLE9BQU8sR0FBRztBQUNyRCxjQUFNLFdBQXFCO0FBQUEsVUFDekIsT0FBTztBQUFBLFVBQ1AsS0FBSztBQUFBLFFBQ1A7QUFDQSxZQUFJLENBQUMsY0FBYztBQUNqQiwyQkFBVyxXQUFYLG1CQUFtQjtBQUFBLFlBQ2pCLElBQUksWUFBc0IsWUFBWSxFQUFFLFFBQVEsU0FBUyxDQUFDO0FBQUE7QUFFNUQseUJBQWU7QUFDZiwyQkFBaUI7QUFBQSxRQUNuQixPQUFPO0FBQ0wsV0FBQyxzQkFBVyxXQUFYLG1CQUFvQyxzQkFBcEMsNEJBQXdEO0FBQUEsUUFDM0Q7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQ0QsbUJBQWUsVUFBaUIsV0FBVyxDQUFDLE1BQWtCO0FBbHdDaEU7QUFtd0NJLFVBQUksY0FBYyxjQUFjO0FBQzlCLFNBQUMsc0JBQVcsV0FBWCxtQkFBb0Msc0JBQXBDLDRCQUF3RDtBQUFBLFVBQ3ZELE9BQU87QUFBQSxVQUNQLEtBQUs7QUFBQSxVQUNMLFVBQVU7QUFBQSxRQUNaO0FBQUEsTUFDRjtBQUNBLG1CQUFhO0FBQ2IscUJBQWU7QUFBQSxJQUNqQixDQUFDO0FBQ0QsbUJBQWUsVUFBaUIsV0FBVyxDQUFDLE1BQWtCO0FBN3dDaEU7QUE4d0NJLFVBQUksY0FBYyxjQUFjO0FBQzlCLFNBQUMsc0JBQVcsV0FBWCxtQkFBb0Msc0JBQXBDLDRCQUF3RDtBQUFBLFVBQ3ZELE9BQU87QUFBQSxVQUNQLEtBQUs7QUFBQSxVQUNMLFVBQVU7QUFBQSxRQUNaO0FBQUEsTUFDRjtBQUNBLG1CQUFhO0FBQ2IscUJBQWU7QUFBQSxJQUNqQixDQUFDO0FBQ0Q7QUFBQSxNQUNFO0FBQUEsTUFDQTtBQUFBLE1BQ0EsQ0FBQyxNQUFNO0FBQ0wsWUFBSSxnQkFBZ0I7QUFDbEIsMkJBQWlCO0FBQ2pCLFlBQUUsZUFBZTtBQUNqQixZQUFFLGdCQUFnQjtBQUFBLFFBQ3BCO0FBQUEsTUFDRjtBQUFBLE1BQ0EsRUFBRSxTQUFTLEtBQUs7QUFBQSxJQUNsQjtBQUNBLDBCQUFzQjtBQUN0QixXQUFPLGlCQUFpQixVQUFVLHFCQUFxQjtBQUFBLEVBQ3pELENBQUM7QUFFRCxtQkFBaUIsb0JBQW9CLE1BQU0sS0FBSyxRQUFRLENBQUM7QUFDekQsbUJBQWlCLG9CQUFvQixNQUFNO0FBQ3pDLFFBQUksZ0JBQWdCLFFBQVE7QUFFMUIsWUFBTSxPQUFPLFdBQVcsaUJBQWlCO0FBQ3pDLFdBQUssR0FBRyxRQUFRLENBQUMsVUFBZTtBQUM5QixjQUFNLFlBQVksaUJBQWlCLE1BQU0sTUFBTSxFQUFFO0FBQ2pELGNBQU0sU0FBUyxNQUFNLE9BQU8sS0FBSyxlQUFlO0FBR2hELFlBQUksYUFBYTtBQUFRLGlCQUFPLE1BQU0sWUFBWTtBQUFBLE1BQ3BELENBQUM7QUFDRCxXQUFLLEdBQUcsVUFBVSxDQUFDLFVBQWU7QUFDaEMsY0FBTSxTQUFTLE1BQU0sT0FBTyxLQUFLLGVBQWU7QUFDaEQsZUFBTyxNQUFNLFlBQVk7QUFBQSxNQUMzQixDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0YsQ0FBQztBQUVELFdBQVMsV0FBVyxPQUF3QjtBQUMxQyxXQUNFLE1BQU0sU0FBUyxJQUFJLEtBQUssTUFBTSxTQUFTLEdBQUcsS0FBSyxNQUFNLFdBQVcsTUFBTTtBQUFBLEVBRTFFO0FBRUEsV0FBUyxPQUFPLE9BQXVCO0FBQ3JDLFdBQU8sTUFBTSxXQUFXLE1BQU0sSUFBSSxNQUFNLE1BQU0sQ0FBQyxJQUFJO0FBQUEsRUFDckQ7QUFFQSxXQUFTLFlBQ1AsRUFBRSxNQUFNLEdBQUcsR0FDWCxTQUNvQjtBQUNwQixRQUFJLFNBQVM7QUFBSSxhQUFPO0FBQ3hCLFFBQUksT0FBTyxTQUFTLFlBQVksT0FBTyxPQUFPLFVBQVU7QUFDdEQsYUFBTyxRQUFRLEtBQUssU0FBUyxVQUFVO0FBQUEsSUFDekM7QUFDQSxRQUFJLE9BQU8sU0FBUyxZQUFZLE9BQU8sT0FBTyxVQUFVO0FBQ3RELFVBQUksU0FBUyxVQUFVLE9BQU87QUFBUSxlQUFPLFVBQVUsS0FBSyxPQUFPO0FBQ25FLFVBQUksU0FBUyxVQUFVLE9BQU87QUFBUSxlQUFPLFVBQVUsS0FBSyxPQUFPO0FBRW5FLFVBQUksS0FBSyxTQUFTLElBQUksS0FBSyxHQUFHLFNBQVMsSUFBSSxHQUFHO0FBQzVDLGNBQU0sU0FBUyxXQUFXLElBQUk7QUFDOUIsY0FBTSxNQUFNLFdBQVcsRUFBRTtBQUN6QixlQUFPLEtBQUssVUFBVSxNQUFNLFdBQVcsVUFBVSxJQUFJO0FBQUEsTUFDdkQ7QUFDQSxVQUFJLEtBQUssU0FBUyxHQUFHLEtBQUssR0FBRyxTQUFTLEdBQUcsR0FBRztBQUMxQyxjQUFNLFNBQVMsV0FBVyxJQUFJO0FBQzlCLGNBQU0sTUFBTSxXQUFXLEVBQUU7QUFDekIsZUFBTyxVQUFVLFVBQVUsTUFBTSxXQUFXLFVBQVUsSUFBSTtBQUFBLE1BQzVEO0FBQ0EsVUFBSSxXQUFXLElBQUksS0FBSyxXQUFXLEVBQUUsR0FBRztBQUN0QyxjQUFNLFdBQVcsT0FBTyxJQUFJO0FBQzVCLGNBQU0sU0FBUyxPQUFPLEVBQUU7QUFDeEIsZUFBTyxRQUFRLGVBQWUsWUFBWSxlQUFlLFVBQVU7QUFBQSxNQUNyRTtBQUdBLFVBQUksS0FBSyxXQUFXLEtBQUssS0FBSyxHQUFHLFdBQVcsS0FBSyxHQUFHO0FBQ2xELGNBQU0sWUFBWSxLQUFLLE1BQU0sTUFBTSxFQUFHLElBQUksTUFBTTtBQUNoRCxjQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sRUFBRyxJQUFJLE1BQU07QUFDNUMsY0FBTSxRQUFRLFVBQVU7QUFBQSxVQUN0QixDQUFDVSxPQUFNLE1BQU1BLFNBQVEsUUFBUSxLQUFLQSxVQUFTLFVBQVU7QUFBQSxRQUN2RDtBQUNBLGVBQU8sT0FBTyxNQUFNLEtBQUssR0FBRztBQUFBLE1BQzlCO0FBQUEsSUFDRjtBQUNBLFdBQU8sVUFBVSxLQUFLLE9BQU87QUFBQSxFQUMvQjtBQUVBLFdBQVMsWUFDUCxPQUNBLEtBQ3dDO0FBQ3hDLFVBQU0sSUFBSSxJQUFJLFVBQVUsTUFBTTtBQUM5QixVQUFNLElBQUksSUFBSSxVQUFVLE1BQU07QUFDOUIsV0FBTyxFQUFFLEdBQUcsR0FBRyxNQUFNLEtBQUssS0FBSyxLQUFLLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUU7QUFBQSxFQUNsRTtBQUVBLGNBQVksMkJBQTJCLENBQUMsTUFBTTtBQUM1QyxVQUFNLFVBQVUsTUFBWTtBQUMxQixZQUFNLEtBQUssRUFBRSxhQUFhLHVCQUF1QjtBQUNqRCxZQUFNLGFBQWEsU0FBUyxRQUFRLGFBQWEsRUFBRSxHQUFHLENBQUM7QUFDdkQsVUFBSSxlQUFlLEVBQUU7QUFBYSxVQUFFLGNBQWM7QUFBQSxJQUNwRDtBQUNBLFlBQVE7QUFDUixhQUFTLGlCQUFpQixvQkFBb0IsT0FBTztBQUNyRCxXQUFPLE1BQU0sU0FBUyxvQkFBb0Isb0JBQW9CLE9BQU87QUFBQSxFQUN2RSxDQUFDO0FBRUQsY0FBWSx3QkFBd0IsQ0FBQyxNQUFNO0FBQ3pDLFVBQU0sVUFBVSxNQUFZO0FBQzFCLFlBQU0sS0FBSyxFQUFFLGFBQWEsb0JBQW9CO0FBQzlDLFlBQU0sVUFBVSxTQUFTLFFBQVEsYUFBYSxFQUFFLEdBQUcsQ0FBQztBQUNwRCxVQUFJLFlBQVk7QUFBVyxVQUFFLGFBQWEsZ0JBQWdCLE9BQU87QUFBQSxJQUNuRTtBQUNBLFlBQVE7QUFDUixhQUFTLGlCQUFpQixvQkFBb0IsT0FBTztBQUNyRCxXQUFPLE1BQU0sU0FBUyxvQkFBb0Isb0JBQW9CLE9BQU87QUFBQSxFQUN2RSxDQUFDO0FBRUQsTUFBTSxpQkFBaUIsSUFBSTtBQUFBLElBQ3pCLENBQUMsU0FBUyxhQUFhO0FBQ3JCLGNBQVEsUUFBUSxDQUFDLFVBQVU7QUFDekIsWUFBSSxNQUFNLGdCQUFnQjtBQUN4QixtQkFBUyxVQUFVLE1BQU0sTUFBTTtBQUMvQixnQkFBTSxPQUFPLGNBQWMsSUFBSSxZQUFZLFFBQVEsQ0FBQztBQUFBLFFBQ3REO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBRUEsRUFBRSxXQUFXLElBQUk7QUFBQSxFQUNuQjtBQUdBLG1CQUFpQixRQUFRLE1BQU07QUFDN0IsVUFBTSxlQUFlLE9BQU8sU0FBUyxLQUFLLE1BQU0sQ0FBQztBQUVqRCxVQUFNLFNBQVMsSUFBSSxPQUFPLGVBQWUsV0FBVztBQUNwRCxlQUFXLEtBQUssU0FBUyxpQkFBaUIsU0FBUyxnQkFBZ0I7QUFDakUsVUFBSSxPQUFPLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxzQkFBc0IsRUFBRSxTQUFTO0FBQzFELGVBQU8sRUFBRSxlQUFlO0FBQUEsRUFDOUIsQ0FBQzsiLAogICJuYW1lcyI6IFsicnVuIiwgInRvUnVuIiwgImVsdCIsICJyZXNvbHZlIiwgImVsdCIsICJkdXJhdGlvbiIsICJwIiwgIm92ZXJsYXlQb3NpdGlvblR5cGUiLCAidHJhbnNpdGlvbiIsICJib3VuZCIsICJ0cmlnZ2VyIiwgImUiLCAiaSIsICJhY3Rpb24iLCAicnVuIiwgIl9hIiwgIl9iIiwgIm92ZXJsYXkiLCAiYW5pbWF0aW9ucyIsICJ0cmFuc2l0aW9uIiwgImR1cmF0aW9uIiwgImVsdCIsICJtb2RhbCIsICJkaXN0WCIsICJkaXN0WSIsICJmcm9tIl0KfQo=
