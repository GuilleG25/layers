"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "\n#define SHADER_NAME bitmap-layer-vertex-shader\n\nattribute vec2 texCoords;\nattribute vec3 positions;\nattribute vec3 positions64Low;\n\nvarying vec2 vTexCoord;\nvarying vec2 vTexPos;\n\nuniform float coordinateConversion;\n\nconst vec3 pickingColor = vec3(1.0, 0.0, 0.0);\n\nvoid main(void) {\n  geometry.worldPosition = positions;\n  geometry.uv = texCoords;\n  geometry.pickingColor = pickingColor;\n\n  gl_Position = project_position_to_clipspace(positions, positions64Low, vec3(0.0), geometry.position);\n  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);\n\n  vTexCoord = texCoords;\n\n  if (coordinateConversion < -0.5) {\n    vTexPos = geometry.position.xy + project_uCommonOrigin.xy;\n  } else if (coordinateConversion > 0.5) {\n    vTexPos = geometry.worldPosition.xy;\n  }\n\n  vec4 color = vec4(0.0);\n  DECKGL_FILTER_COLOR(color, geometry);\n}\n";
exports.default = _default;
//# sourceMappingURL=bitmap-layer-vertex.js.map