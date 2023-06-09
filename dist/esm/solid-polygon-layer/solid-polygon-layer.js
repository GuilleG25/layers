import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Layer, project32, gouraudLighting, picking, COORDINATE_SYSTEM } from '@deck.gl/core';
import { Model, Geometry, hasFeatures, FEATURES } from '@luma.gl/core';
import PolygonTesselator from './polygon-tesselator';
import vsTop from './solid-polygon-layer-vertex-top.glsl';
import vsSide from './solid-polygon-layer-vertex-side.glsl';
import fs from './solid-polygon-layer-fragment.glsl';
const DEFAULT_COLOR = [0, 0, 0, 255];
const defaultProps = {
  filled: true,
  extruded: false,
  wireframe: false,
  _normalize: true,
  _windingOrder: 'CW',
  _full3d: false,
  elevationScale: {
    type: 'number',
    min: 0,
    value: 1
  },
  getPolygon: {
    type: 'accessor',
    value: f => f.polygon
  },
  getElevation: {
    type: 'accessor',
    value: 1000
  },
  getFillColor: {
    type: 'accessor',
    value: DEFAULT_COLOR
  },
  getLineColor: {
    type: 'accessor',
    value: DEFAULT_COLOR
  },
  material: true
};
const ATTRIBUTE_TRANSITION = {
  enter: (value, chunk) => {
    return chunk.length ? chunk.subarray(chunk.length - value.length) : value;
  }
};
export default class SolidPolygonLayer extends Layer {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", void 0);
  }

  getShaders(type) {
    return super.getShaders({
      vs: type === 'top' ? vsTop : vsSide,
      fs,
      defines: {
        RING_WINDING_ORDER_CW: !this.props._normalize && this.props._windingOrder === 'CCW' ? 0 : 1
      },
      modules: [project32, gouraudLighting, picking]
    });
  }

  get wrapLongitude() {
    return false;
  }

  initializeState() {
    const {
      gl,
      viewport
    } = this.context;
    let {
      coordinateSystem
    } = this.props;
    const {
      _full3d
    } = this.props;

    if (viewport.isGeospatial && coordinateSystem === COORDINATE_SYSTEM.DEFAULT) {
      coordinateSystem = COORDINATE_SYSTEM.LNGLAT;
    }

    let preproject;

    if (coordinateSystem === COORDINATE_SYSTEM.LNGLAT) {
      if (_full3d) {
        preproject = viewport.projectPosition.bind(viewport);
      } else {
        preproject = viewport.projectFlat.bind(viewport);
      }
    }

    this.setState({
      numInstances: 0,
      polygonTesselator: new PolygonTesselator({
        preproject,
        fp64: this.use64bitPositions(),
        IndexType: !gl || hasFeatures(gl, FEATURES.ELEMENT_INDEX_UINT32) ? Uint32Array : Uint16Array
      })
    });
    const attributeManager = this.getAttributeManager();
    const noAlloc = true;
    attributeManager.remove(['instancePickingColors']);
    attributeManager.add({
      indices: {
        size: 1,
        isIndexed: true,
        update: this.calculateIndices,
        noAlloc
      },
      positions: {
        size: 3,
        type: 5130,
        fp64: this.use64bitPositions(),
        transition: ATTRIBUTE_TRANSITION,
        accessor: 'getPolygon',
        update: this.calculatePositions,
        noAlloc,
        shaderAttributes: {
          positions: {
            vertexOffset: 0,
            divisor: 0
          },
          instancePositions: {
            vertexOffset: 0,
            divisor: 1
          },
          nextPositions: {
            vertexOffset: 1,
            divisor: 1
          }
        }
      },
      vertexValid: {
        size: 1,
        divisor: 1,
        type: 5121,
        update: this.calculateVertexValid,
        noAlloc
      },
      elevations: {
        size: 1,
        transition: ATTRIBUTE_TRANSITION,
        accessor: 'getElevation',
        shaderAttributes: {
          elevations: {
            divisor: 0
          },
          instanceElevations: {
            divisor: 1
          }
        }
      },
      fillColors: {
        size: this.props.colorFormat.length,
        type: 5121,
        normalized: true,
        transition: ATTRIBUTE_TRANSITION,
        accessor: 'getFillColor',
        defaultValue: DEFAULT_COLOR,
        shaderAttributes: {
          fillColors: {
            divisor: 0
          },
          instanceFillColors: {
            divisor: 1
          }
        }
      },
      lineColors: {
        size: this.props.colorFormat.length,
        type: 5121,
        normalized: true,
        transition: ATTRIBUTE_TRANSITION,
        accessor: 'getLineColor',
        defaultValue: DEFAULT_COLOR,
        shaderAttributes: {
          lineColors: {
            divisor: 0
          },
          instanceLineColors: {
            divisor: 1
          }
        }
      },
      pickingColors: {
        size: 3,
        type: 5121,
        accessor: (object, {
          index,
          target: value
        }) => this.encodePickingColor(object && object.__source ? object.__source.index : index, value),
        shaderAttributes: {
          pickingColors: {
            divisor: 0
          },
          instancePickingColors: {
            divisor: 1
          }
        }
      }
    });
  }

  getPickingInfo(params) {
    const info = super.getPickingInfo(params);
    const {
      index
    } = info;
    const {
      data
    } = this.props;

    if (data[0] && data[0].__source) {
      info.object = data.find(d => d.__source.index === index);
    }

    return info;
  }

  disablePickingIndex(objectIndex) {
    const {
      data
    } = this.props;

    if (data[0] && data[0].__source) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].__source.index === objectIndex) {
          this._disablePickingIndex(i);
        }
      }
    } else {
      this._disablePickingIndex(objectIndex);
    }
  }

  draw({
    uniforms
  }) {
    const {
      extruded,
      filled,
      wireframe,
      elevationScale
    } = this.props;
    const {
      topModel,
      sideModel,
      polygonTesselator
    } = this.state;
    const renderUniforms = { ...uniforms,
      extruded: Boolean(extruded),
      elevationScale
    };

    if (sideModel) {
      sideModel.setInstanceCount(polygonTesselator.instanceCount - 1);
      sideModel.setUniforms(renderUniforms);

      if (wireframe) {
        sideModel.setDrawMode(3);
        sideModel.setUniforms({
          isWireframe: true
        }).draw();
      }

      if (filled) {
        sideModel.setDrawMode(6);
        sideModel.setUniforms({
          isWireframe: false
        }).draw();
      }
    }

    if (topModel) {
      topModel.setVertexCount(polygonTesselator.vertexCount);
      topModel.setUniforms(renderUniforms).draw();
    }
  }

  updateState(updateParams) {
    super.updateState(updateParams);
    this.updateGeometry(updateParams);
    const {
      props,
      oldProps,
      changeFlags
    } = updateParams;
    const attributeManager = this.getAttributeManager();
    const regenerateModels = changeFlags.extensionsChanged || props.filled !== oldProps.filled || props.extruded !== oldProps.extruded;

    if (regenerateModels) {
      var _this$state$models;

      (_this$state$models = this.state.models) === null || _this$state$models === void 0 ? void 0 : _this$state$models.forEach(model => model.delete());
      this.setState(this._getModels(this.context.gl));
      attributeManager.invalidateAll();
    }
  }

  updateGeometry({
    props,
    oldProps,
    changeFlags
  }) {
    const geometryConfigChanged = changeFlags.dataChanged || changeFlags.updateTriggersChanged && (changeFlags.updateTriggersChanged.all || changeFlags.updateTriggersChanged.getPolygon);

    if (geometryConfigChanged) {
      const {
        polygonTesselator
      } = this.state;
      const buffers = props.data.attributes || {};
      polygonTesselator.updateGeometry({
        data: props.data,
        normalize: props._normalize,
        geometryBuffer: buffers.getPolygon,
        buffers,
        getGeometry: props.getPolygon,
        positionFormat: props.positionFormat,
        wrapLongitude: props.wrapLongitude,
        resolution: this.context.viewport.resolution,
        fp64: this.use64bitPositions(),
        dataChanged: changeFlags.dataChanged,
        full3d: props._full3d
      });
      this.setState({
        numInstances: polygonTesselator.instanceCount,
        startIndices: polygonTesselator.vertexStarts
      });

      if (!changeFlags.dataChanged) {
        this.getAttributeManager().invalidateAll();
      }
    }
  }

  _getModels(gl) {
    const {
      id,
      filled,
      extruded
    } = this.props;
    let topModel;
    let sideModel;

    if (filled) {
      const shaders = this.getShaders('top');
      shaders.defines.NON_INSTANCED_MODEL = 1;
      topModel = new Model(gl, { ...shaders,
        id: "".concat(id, "-top"),
        drawMode: 4,
        attributes: {
          vertexPositions: new Float32Array([0, 1])
        },
        uniforms: {
          isWireframe: false,
          isSideVertex: false
        },
        vertexCount: 0,
        isIndexed: true
      });
    }

    if (extruded) {
      sideModel = new Model(gl, { ...this.getShaders('side'),
        id: "".concat(id, "-side"),
        geometry: new Geometry({
          drawMode: 1,
          vertexCount: 4,
          attributes: {
            vertexPositions: {
              size: 2,
              value: new Float32Array([1, 0, 0, 0, 0, 1, 1, 1])
            }
          }
        }),
        instanceCount: 0,
        isInstanced: 1
      });
      sideModel.userData.excludeAttributes = {
        indices: true
      };
    }

    return {
      models: [sideModel, topModel].filter(Boolean),
      topModel,
      sideModel
    };
  }

  calculateIndices(attribute) {
    const {
      polygonTesselator
    } = this.state;
    attribute.startIndices = polygonTesselator.indexStarts;
    attribute.value = polygonTesselator.get('indices');
  }

  calculatePositions(attribute) {
    const {
      polygonTesselator
    } = this.state;
    attribute.startIndices = polygonTesselator.vertexStarts;
    attribute.value = polygonTesselator.get('positions');
  }

  calculateVertexValid(attribute) {
    attribute.value = this.state.polygonTesselator.get('vertexValid');
  }

}

_defineProperty(SolidPolygonLayer, "defaultProps", defaultProps);

_defineProperty(SolidPolygonLayer, "layerName", 'SolidPolygonLayer');
//# sourceMappingURL=solid-polygon-layer.js.map