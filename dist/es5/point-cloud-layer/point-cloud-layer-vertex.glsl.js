"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "#define SHADER_NAME point-cloud-layer-vertex-shader\n\nattribute vec3 positions;\nattribute vec3 instanceNormals;\nattribute vec4 instanceColors;\nattribute vec3 instancePositions;\nattribute vec3 instancePositions64Low;\nattribute vec3 instancePickingColors;\n\nuniform float opacity;\nuniform float radiusPixels;\nuniform int sizeUnits;\n\nvarying vec4 vColor;\nvarying vec2 unitPosition;\n\nvoid main(void) {\n  geometry.worldPosition = instancePositions;\n  geometry.normal = project_normal(instanceNormals);\n  unitPosition = positions.xy;\n  geometry.uv = unitPosition;\n  geometry.pickingColor = instancePickingColors;\n  vec3 offset = vec3(positions.xy * project_size_to_pixel(radiusPixels, sizeUnits), 0.0);\n  DECKGL_FILTER_SIZE(offset, geometry);\n\n  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.), geometry.position);\n  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);\n  gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);\n  vec3 lightColor = lighting_getLightColor(instanceColors.rgb, project_uCameraPosition, geometry.position.xyz, geometry.normal);\n  vColor = vec4(lightColor, instanceColors.a * opacity);\n  DECKGL_FILTER_COLOR(vColor, geometry);\n}\n";
exports.default = _default;
//# sourceMappingURL=point-cloud-layer-vertex.glsl.js.map