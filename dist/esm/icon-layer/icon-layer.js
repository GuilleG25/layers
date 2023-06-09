import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Layer, project32, picking, log, UNIT } from '@deck.gl/core';
import { Model, Geometry } from '@luma.gl/core';
import vs from './icon-layer-vertex.glsl';
import fs from './icon-layer-fragment.glsl';
import IconManager from './icon-manager';
const DEFAULT_COLOR = [0, 0, 0, 255];
const defaultProps = {
  iconAtlas: {
    type: 'image',
    value: null,
    async: true
  },
  iconMapping: {
    type: 'object',
    value: {},
    async: true
  },
  sizeScale: {
    type: 'number',
    value: 1,
    min: 0
  },
  billboard: true,
  sizeUnits: 'pixels',
  sizeMinPixels: {
    type: 'number',
    min: 0,
    value: 0
  },
  sizeMaxPixels: {
    type: 'number',
    min: 0,
    value: Number.MAX_SAFE_INTEGER
  },
  alphaCutoff: {
    type: 'number',
    value: 0.05,
    min: 0,
    max: 1
  },
  getPosition: {
    type: 'accessor',
    value: x => x.position
  },
  getIcon: {
    type: 'accessor',
    value: x => x.icon
  },
  getColor: {
    type: 'accessor',
    value: DEFAULT_COLOR
  },
  getSize: {
    type: 'accessor',
    value: 1
  },
  getAngle: {
    type: 'accessor',
    value: 0
  },
  getPixelOffset: {
    type: 'accessor',
    value: [0, 0]
  },
  onIconError: {
    type: 'function',
    value: null,
    optional: true
  },
  textureParameters: {
    type: 'object',
    ignore: true
  }
};
export default class IconLayer extends Layer {
  constructor(...args) {
    super(...args);
    if (this.hasOwnProperty('state')) {
      this.state = void 0;
    } else {
      _defineProperty(this, "state", void 0);
    }
  }
  getShaders() {
    return super.getShaders({
      vs,
      fs,
      modules: [project32, picking]
    });
  }

  initializeState() {
    this.state = {
      iconManager: new IconManager(this.context.gl, {
        onUpdate: this._onUpdate.bind(this),
        onError: this._onError.bind(this)
      })
    };
    const attributeManager = this.getAttributeManager();
    attributeManager.addInstanced({
      instancePositions: {
        size: 3,
        type: 5130,
        fp64: this.use64bitPositions(),
        transition: true,
        accessor: 'getPosition'
      },
      instanceSizes: {
        size: 1,
        transition: true,
        accessor: 'getSize',
        defaultValue: 1
      },
      instanceOffsets: {
        size: 2,
        accessor: 'getIcon',
        transform: this.getInstanceOffset
      },
      instanceIconFrames: {
        size: 4,
        accessor: 'getIcon',
        transform: this.getInstanceIconFrame
      },
      instanceColorModes: {
        size: 1,
        type: 5121,
        accessor: 'getIcon',
        transform: this.getInstanceColorMode
      },
      instanceColors: {
        size: this.props.colorFormat.length,
        type: 5121,
        normalized: true,
        transition: true,
        accessor: 'getColor',
        defaultValue: DEFAULT_COLOR
      },
      instanceAngles: {
        size: 1,
        transition: true,
        accessor: 'getAngle'
      },
      instancePixelOffset: {
        size: 2,
        transition: true,
        accessor: 'getPixelOffset'
      }
    });
  }

  updateState(params) {
    super.updateState(params);
    const {
      props,
      oldProps,
      changeFlags
    } = params;
    const attributeManager = this.getAttributeManager();
    const {
      iconAtlas,
      iconMapping,
      data,
      getIcon,
      textureParameters
    } = props;
    const {
      iconManager
    } = this.state;
    const prePacked = iconAtlas || this.internalState.isAsyncPropLoading('iconAtlas');
    iconManager.setProps({
      loadOptions: props.loadOptions,
      autoPacking: !prePacked,
      iconAtlas,
      iconMapping: prePacked ? iconMapping : null,
      textureParameters
    });

    if (prePacked) {
      if (oldProps.iconMapping !== props.iconMapping) {
        attributeManager.invalidate('getIcon');
      }
    } else if (changeFlags.dataChanged || changeFlags.updateTriggersChanged && (changeFlags.updateTriggersChanged.all || changeFlags.updateTriggersChanged.getIcon)) {
      iconManager.packIcons(data, getIcon);
    }

    if (changeFlags.extensionsChanged) {
      var _this$state$model;

      const {
        gl
      } = this.context;
      (_this$state$model = this.state.model) === null || _this$state$model === void 0 ? void 0 : _this$state$model.delete();
      this.state.model = this._getModel(gl);
      attributeManager.invalidateAll();
    }
  }

  get isLoaded() {
    return super.isLoaded && this.state.iconManager.isLoaded;
  }

  finalizeState(context) {
    super.finalizeState(context);
    this.state.iconManager.finalize();
  }

  draw({
    uniforms
  }) {
    const {
      sizeScale,
      sizeMinPixels,
      sizeMaxPixels,
      sizeUnits,
      billboard,
      alphaCutoff
    } = this.props;
    const {
      iconManager
    } = this.state;
    const iconsTexture = iconManager.getTexture();

    if (iconsTexture) {
      this.state.model.setUniforms(uniforms).setUniforms({
        iconsTexture,
        iconsTextureDim: [iconsTexture.width, iconsTexture.height],
        sizeUnits: UNIT[sizeUnits],
        sizeScale,
        sizeMinPixels,
        sizeMaxPixels,
        billboard,
        alphaCutoff
      }).draw();
    }
  }

  _getModel(gl) {
    const positions = [-1, -1, -1, 1, 1, 1, 1, -1];
    return new Model(gl, { ...this.getShaders(),
      id: this.props.id,
      geometry: new Geometry({
        drawMode: 6,
        attributes: {
          positions: {
            size: 2,
            value: new Float32Array(positions)
          }
        }
      }),
      isInstanced: true
    });
  }

  _onUpdate() {
    this.setNeedsRedraw();
  }

  _onError(evt) {
    var _this$getCurrentLayer;

    const onIconError = (_this$getCurrentLayer = this.getCurrentLayer()) === null || _this$getCurrentLayer === void 0 ? void 0 : _this$getCurrentLayer.props.onIconError;

    if (onIconError) {
      onIconError(evt);
    } else {
      log.error(evt.error.message)();
    }
  }

  getInstanceOffset(icon) {
    const {
      width,
      height,
      anchorX = width / 2,
      anchorY = height / 2
    } = this.state.iconManager.getIconMapping(icon);
    return [width / 2 - anchorX, height / 2 - anchorY];
  }

  getInstanceColorMode(icon) {
    const mapping = this.state.iconManager.getIconMapping(icon);
    return mapping.mask ? 1 : 0;
  }

  getInstanceIconFrame(icon) {
    const {
      x,
      y,
      width,
      height
    } = this.state.iconManager.getIconMapping(icon);
    return [x, y, width, height];
  }

}

_defineProperty(IconLayer, "defaultProps", defaultProps);

_defineProperty(IconLayer, "layerName", 'IconLayer');
//# sourceMappingURL=icon-layer.js.map