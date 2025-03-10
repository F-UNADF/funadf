import {
  VAvatar,
  VBtn,
  VDefaultsProvider,
  VDivider,
  VIcon,
  VListItem,
  VSheet,
  makeDensityProps,
  makeVDividerProps,
  makeVListItemProps,
  makeVSheetProps,
  useDensity
} from "./chunk-5RHNTSKI.js";
import {
  IconValue
} from "./chunk-5JU3H4GY.js";
import {
  VOverlay,
  makeDelayProps
} from "./chunk-I5XKEOSM.js";
import {
  filterInputAttrs,
  genericComponent,
  humanReadableFileSize,
  only,
  propsFactory,
  useLocale,
  useProxiedModel,
  useRender,
  wrapInArray
} from "./chunk-CN2TK4TM.js";
import "./chunk-GLAEJ2ET.js";
import {
  Fragment,
  computed,
  createVNode,
  mergeProps,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  watchEffect
} from "./chunk-ZZSAXYS4.js";
import "./chunk-UP2VWCW5.js";

// node_modules/vuetify/lib/labs/VFileUpload/VFileUpload.mjs
import "/app/node_modules/vuetify/lib/labs/VFileUpload/VFileUpload.css";

// node_modules/vuetify/lib/labs/VFileUpload/VFileUploadItem.mjs
var makeVFileUploadItemProps = propsFactory({
  clearable: Boolean,
  file: {
    type: Object,
    default: null
  },
  fileIcon: {
    type: String,
    // TODO: setup up a proper aliased icon
    default: "mdi-file-document"
  },
  showSize: Boolean,
  ...makeVListItemProps({
    border: true,
    rounded: true,
    lines: "two"
  })
}, "VFileUploadItem");
var VFileUploadItem = genericComponent()({
  name: "VFileUploadItem",
  props: makeVFileUploadItemProps(),
  emits: {
    "click:remove": () => true,
    click: (e) => true
  },
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const preview = ref();
    const base = computed(() => typeof props.showSize !== "boolean" ? props.showSize : void 0);
    function onClickRemove() {
      emit("click:remove");
    }
    watchEffect(() => {
      var _a;
      preview.value = ((_a = props.file) == null ? void 0 : _a.type.startsWith("image")) ? URL.createObjectURL(props.file) : void 0;
    });
    useRender(() => {
      var _a, _b, _c;
      const listItemProps = VListItem.filterProps(props);
      return createVNode(VListItem, mergeProps(listItemProps, {
        "title": props.title ?? ((_a = props.file) == null ? void 0 : _a.name),
        "subtitle": props.showSize ? humanReadableFileSize((_b = props.file) == null ? void 0 : _b.size, base.value) : (_c = props.file) == null ? void 0 : _c.type,
        "class": "v-file-upload-item"
      }), {
        ...slots,
        prepend: (slotProps) => createVNode(Fragment, null, [!slots.prepend ? createVNode(VAvatar, {
          "icon": props.fileIcon,
          "image": preview.value,
          "rounded": true
        }, null) : createVNode(VDefaultsProvider, {
          "defaults": {
            VAvatar: {
              image: preview.value,
              icon: !preview.value ? props.fileIcon : void 0,
              rounded: true
            }
          }
        }, {
          default: () => {
            var _a2;
            return [((_a2 = slots.prepend) == null ? void 0 : _a2.call(slots, slotProps)) ?? createVNode(VAvatar, null, null)];
          }
        })]),
        append: (slotProps) => {
          var _a2;
          return createVNode(Fragment, null, [props.clearable && createVNode(Fragment, null, [!slots.clear ? createVNode(VBtn, {
            "icon": "$clear",
            "density": "comfortable",
            "variant": "text",
            "onClick": onClickRemove
          }, null) : createVNode(VDefaultsProvider, {
            "defaults": {
              VBtn: {
                icon: "$clear",
                density: "comfortable",
                variant: "text"
              }
            }
          }, {
            default: () => {
              var _a3;
              return [((_a3 = slots.clear) == null ? void 0 : _a3.call(slots, {
                ...slotProps,
                props: {
                  onClick: onClickRemove
                }
              })) ?? createVNode(VBtn, null, null)];
            }
          })]), (_a2 = slots.append) == null ? void 0 : _a2.call(slots, slotProps)]);
        }
      });
    });
  }
});

// node_modules/vuetify/lib/labs/VFileUpload/VFileUpload.mjs
var makeVFileUploadProps = propsFactory({
  browseText: {
    type: String,
    default: "$vuetify.fileUpload.browse"
  },
  dividerText: {
    type: String,
    default: "$vuetify.fileUpload.divider"
  },
  title: {
    type: String,
    default: "$vuetify.fileUpload.title"
  },
  subtitle: String,
  icon: {
    type: IconValue,
    default: "$upload"
  },
  modelValue: {
    type: [Array, Object],
    default: null,
    validator: (val) => {
      return wrapInArray(val).every((v) => v != null && typeof v === "object");
    }
  },
  clearable: Boolean,
  disabled: Boolean,
  hideBrowse: Boolean,
  multiple: Boolean,
  scrim: {
    type: [Boolean, String],
    default: true
  },
  showSize: Boolean,
  name: String,
  ...makeDelayProps(),
  ...makeDensityProps(),
  ...only(makeVDividerProps({
    length: 150
  }), ["length", "thickness", "opacity"]),
  ...makeVSheetProps()
}, "VFileUpload");
var VFileUpload = genericComponent()({
  name: "VFileUpload",
  inheritAttrs: false,
  props: makeVFileUploadProps(),
  emits: {
    "update:modelValue": (files) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const {
      densityClasses
    } = useDensity(props);
    const model = useProxiedModel(props, "modelValue", props.modelValue, (val) => wrapInArray(val), (val) => props.multiple || Array.isArray(props.modelValue) ? val : val[0]);
    const dragOver = shallowRef(false);
    const vSheetRef = ref(null);
    const inputRef = ref(null);
    onMounted(() => {
      var _a, _b;
      (_a = vSheetRef.value) == null ? void 0 : _a.$el.addEventListener("dragover", onDragOver);
      (_b = vSheetRef.value) == null ? void 0 : _b.$el.addEventListener("drop", onDrop);
    });
    onUnmounted(() => {
      var _a, _b;
      (_a = vSheetRef.value) == null ? void 0 : _a.$el.removeEventListener("dragover", onDragOver);
      (_b = vSheetRef.value) == null ? void 0 : _b.$el.removeEventListener("drop", onDrop);
    });
    function onDragOver(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      dragOver.value = true;
    }
    function onDragLeave(e) {
      e.preventDefault();
      dragOver.value = false;
    }
    function onDrop(e) {
      var _a;
      e.preventDefault();
      e.stopImmediatePropagation();
      dragOver.value = false;
      const files = Array.from(((_a = e.dataTransfer) == null ? void 0 : _a.files) ?? []);
      if (!files.length) return;
      if (!props.multiple) {
        model.value = [files[0]];
        return;
      }
      const array = model.value.slice();
      for (const file of files) {
        if (!array.some((f) => f.name === file.name)) {
          array.push(file);
        }
      }
      model.value = array;
    }
    function onClick() {
      var _a;
      (_a = inputRef.value) == null ? void 0 : _a.click();
    }
    function onClickRemove(index) {
      model.value = model.value.filter((_, i) => i !== index);
      if (model.value.length > 0 || !inputRef.value) return;
      inputRef.value.value = "";
    }
    useRender(() => {
      const hasTitle = !!(slots.title || props.title);
      const hasIcon = !!(slots.icon || props.icon);
      const hasBrowse = !!(!props.hideBrowse && (slots.browse || props.density === "default"));
      const cardProps = VSheet.filterProps(props);
      const dividerProps = VDivider.filterProps(props);
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);
      const inputNode = createVNode("input", mergeProps({
        "ref": inputRef,
        "type": "file",
        "disabled": props.disabled,
        "multiple": props.multiple,
        "name": props.name,
        "onChange": (e) => {
          if (!e.target) return;
          const target = e.target;
          model.value = [...target.files ?? []];
        }
      }, inputAttrs), null);
      return createVNode(Fragment, null, [createVNode(VSheet, mergeProps({
        "ref": vSheetRef
      }, cardProps, {
        "class": ["v-file-upload", {
          "v-file-upload--clickable": !hasBrowse,
          "v-file-upload--disabled": props.disabled,
          "v-file-upload--dragging": dragOver.value
        }, densityClasses.value],
        "onDragleave": onDragLeave,
        "onDragover": onDragOver,
        "onDrop": onDrop,
        "onClick": !hasBrowse ? onClick : void 0
      }, rootAttrs), {
        default: () => {
          var _a, _b, _c;
          return [hasIcon && createVNode("div", {
            "key": "icon",
            "class": "v-file-upload-icon"
          }, [!slots.icon ? createVNode(VIcon, {
            "key": "icon-icon",
            "icon": props.icon
          }, null) : createVNode(VDefaultsProvider, {
            "key": "icon-defaults",
            "defaults": {
              VIcon: {
                icon: props.icon
              }
            }
          }, {
            default: () => [slots.icon()]
          })]), hasTitle && createVNode("div", {
            "key": "title",
            "class": "v-file-upload-title"
          }, [((_a = slots.title) == null ? void 0 : _a.call(slots)) ?? t(props.title)]), props.density === "default" && createVNode(Fragment, null, [createVNode("div", {
            "key": "upload-divider",
            "class": "v-file-upload-divider"
          }, [((_b = slots.divider) == null ? void 0 : _b.call(slots)) ?? createVNode(VDivider, dividerProps, {
            default: () => [t(props.dividerText)]
          })]), hasBrowse && createVNode(Fragment, null, [!slots.browse ? createVNode(VBtn, {
            "readonly": props.disabled,
            "size": "large",
            "text": t(props.browseText),
            "variant": "tonal",
            "onClick": onClick
          }, null) : createVNode(VDefaultsProvider, {
            "defaults": {
              VBtn: {
                readonly: props.disabled,
                size: "large",
                text: t(props.browseText),
                variant: "tonal"
              }
            }
          }, {
            default: () => [slots.browse({
              props: {
                onClick
              }
            })]
          })]), props.subtitle && createVNode("div", {
            "class": "v-file-upload-subtitle"
          }, [props.subtitle])]), createVNode(VOverlay, {
            "model-value": dragOver.value,
            "contained": true,
            "scrim": props.scrim
          }, null), ((_c = slots.input) == null ? void 0 : _c.call(slots, {
            inputNode
          })) ?? inputNode];
        }
      }), model.value.length > 0 && createVNode("div", {
        "class": "v-file-upload-items"
      }, [model.value.map((file, i) => {
        const slotProps = {
          file,
          props: {
            "onClick:remove": () => onClickRemove(i)
          }
        };
        return createVNode(VDefaultsProvider, {
          "key": i,
          "defaults": {
            VFileUploadItem: {
              file,
              clearable: props.clearable,
              disabled: props.disabled,
              showSize: props.showSize
            }
          }
        }, {
          default: () => {
            var _a;
            return [((_a = slots.item) == null ? void 0 : _a.call(slots, slotProps)) ?? createVNode(VFileUploadItem, {
              "key": i,
              "onClick:remove": () => onClickRemove(i)
            }, slots)];
          }
        });
      })])]);
    });
  }
});
export {
  VFileUpload,
  VFileUploadItem
};
//# sourceMappingURL=vuetify_labs_VFileUpload.js.map
