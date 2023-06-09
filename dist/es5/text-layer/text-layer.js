"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _core = require("@deck.gl/core");

var _multiIconLayer = _interopRequireDefault(require("./multi-icon-layer/multi-icon-layer"));

var _fontAtlasManager = _interopRequireWildcard(require("./font-atlas-manager"));

var _utils = require("./utils");

var _textBackgroundLayer = _interopRequireDefault(require("./text-background-layer/text-background-layer"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var TEXT_ANCHOR = {
  start: 1,
  middle: 0,
  end: -1
};
var ALIGNMENT_BASELINE = {
  top: 1,
  center: 0,
  bottom: -1
};
var DEFAULT_COLOR = [0, 0, 0, 255];
var DEFAULT_LINE_HEIGHT = 1.0;
var defaultProps = {
  billboard: true,
  sizeScale: 1,
  sizeUnits: 'pixels',
  sizeMinPixels: 0,
  sizeMaxPixels: Number.MAX_SAFE_INTEGER,
  background: false,
  getBackgroundColor: {
    type: 'accessor',
    value: [255, 255, 255, 255]
  },
  getBorderColor: {
    type: 'accessor',
    value: DEFAULT_COLOR
  },
  getBorderWidth: {
    type: 'accessor',
    value: 0
  },
  backgroundPadding: {
    type: 'array',
    value: [0, 0, 0, 0]
  },
  characterSet: {
    type: 'object',
    value: _fontAtlasManager.DEFAULT_FONT_SETTINGS.characterSet
  },
  fontFamily: _fontAtlasManager.DEFAULT_FONT_SETTINGS.fontFamily,
  fontWeight: _fontAtlasManager.DEFAULT_FONT_SETTINGS.fontWeight,
  lineHeight: DEFAULT_LINE_HEIGHT,
  outlineWidth: {
    type: 'number',
    value: 0,
    min: 0
  },
  outlineColor: {
    type: 'color',
    value: DEFAULT_COLOR
  },
  fontSettings: {
    type: 'object',
    value: {},
    compare: 1
  },
  wordBreak: 'break-word',
  maxWidth: {
    type: 'number',
    value: -1
  },
  getText: {
    type: 'accessor',
    value: function value(x) {
      return x.text;
    }
  },
  getPosition: {
    type: 'accessor',
    value: function value(x) {
      return x.position;
    }
  },
  getColor: {
    type: 'accessor',
    value: DEFAULT_COLOR
  },
  getSize: {
    type: 'accessor',
    value: 32
  },
  getAngle: {
    type: 'accessor',
    value: 0
  },
  getTextAnchor: {
    type: 'accessor',
    value: 'middle'
  },
  getAlignmentBaseline: {
    type: 'accessor',
    value: 'center'
  },
  getPixelOffset: {
    type: 'accessor',
    value: [0, 0]
  },
  backgroundColor: {
    deprecatedFor: ['background', 'getBackgroundColor']
  }
};

var TextLayer = function (_CompositeLayer) {
  (0, _inherits2.default)(TextLayer, _CompositeLayer);

  var _super = _createSuper(TextLayer);

  function TextLayer() {
    var _this;

    (0, _classCallCheck2.default)(this, TextLayer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", void 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getBoundingRect", function (object, objectInfo) {
      var _this$transformParagr = _this.transformParagraph(object, objectInfo),
          _this$transformParagr2 = (0, _slicedToArray2.default)(_this$transformParagr.size, 2),
          width = _this$transformParagr2[0],
          height = _this$transformParagr2[1];

      var fontSize = _this.state.fontAtlasManager.props.fontSize;
      width /= fontSize;
      height /= fontSize;
      var _this$props = _this.props,
          getTextAnchor = _this$props.getTextAnchor,
          getAlignmentBaseline = _this$props.getAlignmentBaseline;
      var anchorX = TEXT_ANCHOR[typeof getTextAnchor === 'function' ? getTextAnchor(object, objectInfo) : getTextAnchor];
      var anchorY = ALIGNMENT_BASELINE[typeof getAlignmentBaseline === 'function' ? getAlignmentBaseline(object, objectInfo) : getAlignmentBaseline];
      return [(anchorX - 1) * width / 2, (anchorY - 1) * height / 2, width, height];
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getIconOffsets", function (object, objectInfo) {
      var _this$props2 = _this.props,
          getTextAnchor = _this$props2.getTextAnchor,
          getAlignmentBaseline = _this$props2.getAlignmentBaseline;

      var _this$transformParagr3 = _this.transformParagraph(object, objectInfo),
          x = _this$transformParagr3.x,
          y = _this$transformParagr3.y,
          rowWidth = _this$transformParagr3.rowWidth,
          _this$transformParagr4 = (0, _slicedToArray2.default)(_this$transformParagr3.size, 2),
          width = _this$transformParagr4[0],
          height = _this$transformParagr4[1];

      var anchorX = TEXT_ANCHOR[typeof getTextAnchor === 'function' ? getTextAnchor(object, objectInfo) : getTextAnchor];
      var anchorY = ALIGNMENT_BASELINE[typeof getAlignmentBaseline === 'function' ? getAlignmentBaseline(object, objectInfo) : getAlignmentBaseline];
      var numCharacters = x.length;
      var offsets = new Array(numCharacters * 2);
      var index = 0;

      for (var i = 0; i < numCharacters; i++) {
        var rowOffset = (1 - anchorX) * (width - rowWidth[i]) / 2;
        offsets[index++] = (anchorX - 1) * width / 2 + rowOffset + x[i];
        offsets[index++] = (anchorY - 1) * height / 2 + y[i];
      }

      return offsets;
    });
    return _this;
  }

  (0, _createClass2.default)(TextLayer, [{
    key: "initializeState",
    value: function initializeState() {
      this.state = {
        styleVersion: 0,
        fontAtlasManager: new _fontAtlasManager.default()
      };

      if (this.props.maxWidth > 0) {
        _core.log.warn('v8.9 breaking change: TextLayer maxWidth is now relative to text size')();
      }
    }
  }, {
    key: "updateState",
    value: function updateState(params) {
      var props = params.props,
          oldProps = params.oldProps,
          changeFlags = params.changeFlags;
      var textChanged = changeFlags.dataChanged || changeFlags.updateTriggersChanged && (changeFlags.updateTriggersChanged.all || changeFlags.updateTriggersChanged.getText);

      if (textChanged) {
        this._updateText();
      }

      var fontChanged = this._updateFontAtlas();

      var styleChanged = fontChanged || props.lineHeight !== oldProps.lineHeight || props.wordBreak !== oldProps.wordBreak || props.maxWidth !== oldProps.maxWidth;

      if (styleChanged) {
        this.setState({
          styleVersion: this.state.styleVersion + 1
        });
      }
    }
  }, {
    key: "getPickingInfo",
    value: function getPickingInfo(_ref) {
      var info = _ref.info;
      info.object = info.index >= 0 ? this.props.data[info.index] : null;
      return info;
    }
  }, {
    key: "_updateFontAtlas",
    value: function _updateFontAtlas() {
      var _this$props3 = this.props,
          fontSettings = _this$props3.fontSettings,
          fontFamily = _this$props3.fontFamily,
          fontWeight = _this$props3.fontWeight;
      var _this$state = this.state,
          fontAtlasManager = _this$state.fontAtlasManager,
          characterSet = _this$state.characterSet;

      var fontProps = _objectSpread(_objectSpread({}, fontSettings), {}, {
        characterSet: characterSet,
        fontFamily: fontFamily,
        fontWeight: fontWeight
      });

      if (!fontAtlasManager.mapping) {
        fontAtlasManager.setProps(fontProps);
        return true;
      }

      for (var key in fontProps) {
        if (fontProps[key] !== fontAtlasManager.props[key]) {
          fontAtlasManager.setProps(fontProps);
          return true;
        }
      }

      return false;
    }
  }, {
    key: "_updateText",
    value: function _updateText() {
      var _attributes;

      var _this$props4 = this.props,
          data = _this$props4.data,
          characterSet = _this$props4.characterSet;
      var textBuffer = (_attributes = data.attributes) === null || _attributes === void 0 ? void 0 : _attributes.getText;
      var getText = this.props.getText;
      var startIndices = data.startIndices;
      var numInstances;
      var autoCharacterSet = characterSet === 'auto' && new Set();

      if (textBuffer && startIndices) {
        var _getTextFromBuffer = (0, _utils.getTextFromBuffer)(_objectSpread(_objectSpread({}, ArrayBuffer.isView(textBuffer) ? {
          value: textBuffer
        } : textBuffer), {}, {
          length: data.length,
          startIndices: startIndices,
          characterSet: autoCharacterSet
        })),
            texts = _getTextFromBuffer.texts,
            characterCount = _getTextFromBuffer.characterCount;

        numInstances = characterCount;

        getText = function getText(_, _ref2) {
          var index = _ref2.index;
          return texts[index];
        };
      } else {
        var _createIterable = (0, _core.createIterable)(data),
            iterable = _createIterable.iterable,
            objectInfo = _createIterable.objectInfo;

        startIndices = [0];
        numInstances = 0;

        var _iterator = _createForOfIteratorHelper(iterable),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var object = _step.value;
            objectInfo.index++;
            var text = Array.from(getText(object, objectInfo) || '');

            if (autoCharacterSet) {
              text.forEach(autoCharacterSet.add, autoCharacterSet);
            }

            numInstances += text.length;
            startIndices.push(numInstances);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      this.setState({
        getText: getText,
        startIndices: startIndices,
        numInstances: numInstances,
        characterSet: autoCharacterSet || characterSet
      });
    }
  }, {
    key: "transformParagraph",
    value: function transformParagraph(object, objectInfo) {
      var fontAtlasManager = this.state.fontAtlasManager;
      var iconMapping = fontAtlasManager.mapping;
      var getText = this.state.getText;
      var _this$props5 = this.props,
          wordBreak = _this$props5.wordBreak,
          lineHeight = _this$props5.lineHeight,
          maxWidth = _this$props5.maxWidth;
      var paragraph = getText(object, objectInfo) || '';
      return (0, _utils.transformParagraph)(paragraph, lineHeight, wordBreak, maxWidth * fontAtlasManager.props.fontSize, iconMapping);
    }
  }, {
    key: "renderLayers",
    value: function renderLayers() {
      var _this$state2 = this.state,
          startIndices = _this$state2.startIndices,
          numInstances = _this$state2.numInstances,
          getText = _this$state2.getText,
          _this$state2$fontAtla = _this$state2.fontAtlasManager,
          scale = _this$state2$fontAtla.scale,
          texture = _this$state2$fontAtla.texture,
          mapping = _this$state2$fontAtla.mapping,
          styleVersion = _this$state2.styleVersion;
      var _this$props6 = this.props,
          data = _this$props6.data,
          _dataDiff = _this$props6._dataDiff,
          getPosition = _this$props6.getPosition,
          getColor = _this$props6.getColor,
          getSize = _this$props6.getSize,
          getAngle = _this$props6.getAngle,
          getPixelOffset = _this$props6.getPixelOffset,
          getBackgroundColor = _this$props6.getBackgroundColor,
          getBorderColor = _this$props6.getBorderColor,
          getBorderWidth = _this$props6.getBorderWidth,
          backgroundPadding = _this$props6.backgroundPadding,
          background = _this$props6.background,
          billboard = _this$props6.billboard,
          fontSettings = _this$props6.fontSettings,
          outlineWidth = _this$props6.outlineWidth,
          outlineColor = _this$props6.outlineColor,
          sizeScale = _this$props6.sizeScale,
          sizeUnits = _this$props6.sizeUnits,
          sizeMinPixels = _this$props6.sizeMinPixels,
          sizeMaxPixels = _this$props6.sizeMaxPixels,
          transitions = _this$props6.transitions,
          updateTriggers = _this$props6.updateTriggers;
      var CharactersLayerClass = this.getSubLayerClass('characters', _multiIconLayer.default);
      var BackgroundLayerClass = this.getSubLayerClass('background', _textBackgroundLayer.default);
      return [background && new BackgroundLayerClass({
        getFillColor: getBackgroundColor,
        getLineColor: getBorderColor,
        getLineWidth: getBorderWidth,
        padding: backgroundPadding,
        getPosition: getPosition,
        getSize: getSize,
        getAngle: getAngle,
        getPixelOffset: getPixelOffset,
        billboard: billboard,
        sizeScale: sizeScale,
        sizeUnits: sizeUnits,
        sizeMinPixels: sizeMinPixels,
        sizeMaxPixels: sizeMaxPixels,
        transitions: transitions && {
          getPosition: transitions.getPosition,
          getAngle: transitions.getAngle,
          getSize: transitions.getSize,
          getFillColor: transitions.getBackgroundColor,
          getLineColor: transitions.getBorderColor,
          getLineWidth: transitions.getBorderWidth,
          getPixelOffset: transitions.getPixelOffset
        }
      }, this.getSubLayerProps({
        id: 'background',
        updateTriggers: {
          getPosition: updateTriggers.getPosition,
          getAngle: updateTriggers.getAngle,
          getSize: updateTriggers.getSize,
          getFillColor: updateTriggers.getBackgroundColor,
          getLineColor: updateTriggers.getBorderColor,
          getLineWidth: updateTriggers.getBorderWidth,
          getPixelOffset: updateTriggers.getPixelOffset,
          getBoundingRect: {
            getText: updateTriggers.getText,
            getTextAnchor: updateTriggers.getTextAnchor,
            getAlignmentBaseline: updateTriggers.getAlignmentBaseline,
            styleVersion: styleVersion
          }
        }
      }), {
        data: data.attributes && data.attributes.background ? {
          length: data.length,
          attributes: data.attributes.background
        } : data,
        _dataDiff: _dataDiff,
        autoHighlight: false,
        getBoundingRect: this.getBoundingRect
      }), new CharactersLayerClass({
        sdf: fontSettings.sdf,
        smoothing: Number.isFinite(fontSettings.smoothing) ? fontSettings.smoothing : _fontAtlasManager.DEFAULT_FONT_SETTINGS.smoothing,
        outlineWidth: outlineWidth / (fontSettings.radius || _fontAtlasManager.DEFAULT_FONT_SETTINGS.radius),
        outlineColor: outlineColor,
        iconAtlas: texture,
        iconMapping: mapping,
        getPosition: getPosition,
        getColor: getColor,
        getSize: getSize,
        getAngle: getAngle,
        getPixelOffset: getPixelOffset,
        billboard: billboard,
        sizeScale: sizeScale * scale,
        sizeUnits: sizeUnits,
        sizeMinPixels: sizeMinPixels * scale,
        sizeMaxPixels: sizeMaxPixels * scale,
        transitions: transitions && {
          getPosition: transitions.getPosition,
          getAngle: transitions.getAngle,
          getColor: transitions.getColor,
          getSize: transitions.getSize,
          getPixelOffset: transitions.getPixelOffset
        }
      }, this.getSubLayerProps({
        id: 'characters',
        updateTriggers: {
          getIcon: updateTriggers.getText,
          getPosition: updateTriggers.getPosition,
          getAngle: updateTriggers.getAngle,
          getColor: updateTriggers.getColor,
          getSize: updateTriggers.getSize,
          getPixelOffset: updateTriggers.getPixelOffset,
          getIconOffsets: {
            getText: updateTriggers.getText,
            getTextAnchor: updateTriggers.getTextAnchor,
            getAlignmentBaseline: updateTriggers.getAlignmentBaseline,
            styleVersion: styleVersion
          }
        }
      }), {
        data: data,
        _dataDiff: _dataDiff,
        startIndices: startIndices,
        numInstances: numInstances,
        getIconOffsets: this.getIconOffsets,
        getIcon: getText
      })];
    }
  }], [{
    key: "fontAtlasCacheLimit",
    set: function set(limit) {
      (0, _fontAtlasManager.setFontAtlasCacheLimit)(limit);
    }
  }]);
  return TextLayer;
}(_core.CompositeLayer);

exports.default = TextLayer;
(0, _defineProperty2.default)(TextLayer, "defaultProps", defaultProps);
(0, _defineProperty2.default)(TextLayer, "layerName", 'TextLayer');
//# sourceMappingURL=text-layer.js.map