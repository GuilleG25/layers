import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { CompositeLayer, createIterable, log } from '@deck.gl/core';
import MultiIconLayer from './multi-icon-layer/multi-icon-layer';
import FontAtlasManager, { DEFAULT_FONT_SETTINGS, setFontAtlasCacheLimit } from './font-atlas-manager';
import { transformParagraph, getTextFromBuffer } from './utils';
import TextBackgroundLayer from './text-background-layer/text-background-layer';
const TEXT_ANCHOR = {
  start: 1,
  middle: 0,
  end: -1
};
const ALIGNMENT_BASELINE = {
  top: 1,
  center: 0,
  bottom: -1
};
const DEFAULT_COLOR = [0, 0, 0, 255];
const DEFAULT_LINE_HEIGHT = 1.0;
const defaultProps = {
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
    value: DEFAULT_FONT_SETTINGS.characterSet
  },
  fontFamily: DEFAULT_FONT_SETTINGS.fontFamily,
  fontWeight: DEFAULT_FONT_SETTINGS.fontWeight,
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
    value: x => x.text
  },
  getPosition: {
    type: 'accessor',
    value: x => x.position
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
export default class TextLayer extends CompositeLayer {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", void 0);

    _defineProperty(this, "getBoundingRect", (object, objectInfo) => {
      let {
        size: [width, height]
      } = this.transformParagraph(object, objectInfo);
      const {
        fontSize
      } = this.state.fontAtlasManager.props;
      width /= fontSize;
      height /= fontSize;
      const {
        getTextAnchor,
        getAlignmentBaseline
      } = this.props;
      const anchorX = TEXT_ANCHOR[typeof getTextAnchor === 'function' ? getTextAnchor(object, objectInfo) : getTextAnchor];
      const anchorY = ALIGNMENT_BASELINE[typeof getAlignmentBaseline === 'function' ? getAlignmentBaseline(object, objectInfo) : getAlignmentBaseline];
      return [(anchorX - 1) * width / 2, (anchorY - 1) * height / 2, width, height];
    });

    _defineProperty(this, "getIconOffsets", (object, objectInfo) => {
      const {
        getTextAnchor,
        getAlignmentBaseline
      } = this.props;
      const {
        x,
        y,
        rowWidth,
        size: [width, height]
      } = this.transformParagraph(object, objectInfo);
      const anchorX = TEXT_ANCHOR[typeof getTextAnchor === 'function' ? getTextAnchor(object, objectInfo) : getTextAnchor];
      const anchorY = ALIGNMENT_BASELINE[typeof getAlignmentBaseline === 'function' ? getAlignmentBaseline(object, objectInfo) : getAlignmentBaseline];
      const numCharacters = x.length;
      const offsets = new Array(numCharacters * 2);
      let index = 0;

      for (let i = 0; i < numCharacters; i++) {
        const rowOffset = (1 - anchorX) * (width - rowWidth[i]) / 2;
        offsets[index++] = (anchorX - 1) * width / 2 + rowOffset + x[i];
        offsets[index++] = (anchorY - 1) * height / 2 + y[i];
      }

      return offsets;
    });
  }

  initializeState() {
    this.state = {
      styleVersion: 0,
      fontAtlasManager: new FontAtlasManager()
    };

    if (this.props.maxWidth > 0) {
      log.warn('v8.9 breaking change: TextLayer maxWidth is now relative to text size')();
    }
  }

  updateState(params) {
    const {
      props,
      oldProps,
      changeFlags
    } = params;
    const textChanged = changeFlags.dataChanged || changeFlags.updateTriggersChanged && (changeFlags.updateTriggersChanged.all || changeFlags.updateTriggersChanged.getText);

    if (textChanged) {
      this._updateText();
    }

    const fontChanged = this._updateFontAtlas();

    const styleChanged = fontChanged || props.lineHeight !== oldProps.lineHeight || props.wordBreak !== oldProps.wordBreak || props.maxWidth !== oldProps.maxWidth;

    if (styleChanged) {
      this.setState({
        styleVersion: this.state.styleVersion + 1
      });
    }
  }

  getPickingInfo({
    info
  }) {
    info.object = info.index >= 0 ? this.props.data[info.index] : null;
    return info;
  }

  _updateFontAtlas() {
    const {
      fontSettings,
      fontFamily,
      fontWeight
    } = this.props;
    const {
      fontAtlasManager,
      characterSet
    } = this.state;
    const fontProps = { ...fontSettings,
      characterSet,
      fontFamily,
      fontWeight
    };

    if (!fontAtlasManager.mapping) {
      fontAtlasManager.setProps(fontProps);
      return true;
    }

    for (const key in fontProps) {
      if (fontProps[key] !== fontAtlasManager.props[key]) {
        fontAtlasManager.setProps(fontProps);
        return true;
      }
    }

    return false;
  }

  _updateText() {
    var _attributes;

    const {
      data,
      characterSet
    } = this.props;
    const textBuffer = (_attributes = data.attributes) === null || _attributes === void 0 ? void 0 : _attributes.getText;
    let {
      getText
    } = this.props;
    let startIndices = data.startIndices;
    let numInstances;
    const autoCharacterSet = characterSet === 'auto' && new Set();

    if (textBuffer && startIndices) {
      const {
        texts,
        characterCount
      } = getTextFromBuffer({ ...(ArrayBuffer.isView(textBuffer) ? {
          value: textBuffer
        } : textBuffer),
        length: data.length,
        startIndices,
        characterSet: autoCharacterSet
      });
      numInstances = characterCount;

      getText = (_, {
        index
      }) => texts[index];
    } else {
      const {
        iterable,
        objectInfo
      } = createIterable(data);
      startIndices = [0];
      numInstances = 0;

      for (const object of iterable) {
        objectInfo.index++;
        const text = Array.from(getText(object, objectInfo) || '');

        if (autoCharacterSet) {
          text.forEach(autoCharacterSet.add, autoCharacterSet);
        }

        numInstances += text.length;
        startIndices.push(numInstances);
      }
    }

    this.setState({
      getText,
      startIndices,
      numInstances,
      characterSet: autoCharacterSet || characterSet
    });
  }

  transformParagraph(object, objectInfo) {
    const {
      fontAtlasManager
    } = this.state;
    const iconMapping = fontAtlasManager.mapping;
    const getText = this.state.getText;
    const {
      wordBreak,
      lineHeight,
      maxWidth
    } = this.props;
    const paragraph = getText(object, objectInfo) || '';
    return transformParagraph(paragraph, lineHeight, wordBreak, maxWidth * fontAtlasManager.props.fontSize, iconMapping);
  }

  renderLayers() {
    const {
      startIndices,
      numInstances,
      getText,
      fontAtlasManager: {
        scale,
        texture,
        mapping
      },
      styleVersion
    } = this.state;
    const {
      data,
      _dataDiff,
      getPosition,
      getColor,
      getSize,
      getAngle,
      getPixelOffset,
      getBackgroundColor,
      getBorderColor,
      getBorderWidth,
      backgroundPadding,
      background,
      billboard,
      fontSettings,
      outlineWidth,
      outlineColor,
      sizeScale,
      sizeUnits,
      sizeMinPixels,
      sizeMaxPixels,
      transitions,
      updateTriggers
    } = this.props;
    const CharactersLayerClass = this.getSubLayerClass('characters', MultiIconLayer);
    const BackgroundLayerClass = this.getSubLayerClass('background', TextBackgroundLayer);
    return [background && new BackgroundLayerClass({
      getFillColor: getBackgroundColor,
      getLineColor: getBorderColor,
      getLineWidth: getBorderWidth,
      padding: backgroundPadding,
      getPosition,
      getSize,
      getAngle,
      getPixelOffset,
      billboard,
      sizeScale,
      sizeUnits,
      sizeMinPixels,
      sizeMaxPixels,
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
          styleVersion
        }
      }
    }), {
      data: data.attributes && data.attributes.background ? {
        length: data.length,
        attributes: data.attributes.background
      } : data,
      _dataDiff,
      autoHighlight: false,
      getBoundingRect: this.getBoundingRect
    }), new CharactersLayerClass({
      sdf: fontSettings.sdf,
      smoothing: Number.isFinite(fontSettings.smoothing) ? fontSettings.smoothing : DEFAULT_FONT_SETTINGS.smoothing,
      outlineWidth: outlineWidth / (fontSettings.radius || DEFAULT_FONT_SETTINGS.radius),
      outlineColor,
      iconAtlas: texture,
      iconMapping: mapping,
      getPosition,
      getColor,
      getSize,
      getAngle,
      getPixelOffset,
      billboard,
      sizeScale: sizeScale * scale,
      sizeUnits,
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
          styleVersion
        }
      }
    }), {
      data,
      _dataDiff,
      startIndices,
      numInstances,
      getIconOffsets: this.getIconOffsets,
      getIcon: getText
    })];
  }

  static set fontAtlasCacheLimit(limit) {
    setFontAtlasCacheLimit(limit);
  }

}

_defineProperty(TextLayer, "defaultProps", defaultProps);

_defineProperty(TextLayer, "layerName", 'TextLayer');
//# sourceMappingURL=text-layer.js.map