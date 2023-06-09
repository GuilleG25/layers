"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "#version 300 es\n#define SHADER_NAME column-layer-fragment-shader\n\nprecision highp float;\n\nuniform vec3 project_uCameraPosition;\nuniform bool extruded;\nuniform bool isStroke;\n\nout vec4 fragColor;\n\nin vec4 vColor;\n#ifdef FLAT_SHADING\nin vec4 position_commonspace;\n#endif\n\nvoid main(void) {\n  fragColor = vColor;\n#ifdef FLAT_SHADING\n  if (extruded && !isStroke && !picking_uActive) {\n    vec3 normal = normalize(cross(dFdx(position_commonspace.xyz), dFdy(position_commonspace.xyz)));\n    fragColor.rgb = lighting_getLightColor(vColor.rgb, project_uCameraPosition, position_commonspace.xyz, normal);\n  }\n#endif\n  DECKGL_FILTER_COLOR(fragColor, geometry);\n}\n";
exports.default = _default;
//# sourceMappingURL=column-layer-fragment.glsl.js.map