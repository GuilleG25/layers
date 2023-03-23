"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = "#define SHADER_NAME multi-icon-layer-fragment-shader\n\nprecision highp float;\n\nuniform float opacity;\nuniform sampler2D iconsTexture;\nuniform float gamma;\nuniform bool sdf;\nuniform float alphaCutoff;\nuniform float sdfBuffer;\nuniform float outlineBuffer;\nuniform vec4 outlineColor;\n\nvarying vec4 vColor;\nvarying vec2 vTextureCoords;\nvarying vec2 uv;\n\nvoid main(void) {\n  geometry.uv = uv;\n\n  if (!picking_uActive) {\n    float alpha = texture2D(iconsTexture, vTextureCoords).a;\n    vec4 color = vColor;\n    if (sdf) {\n      float distance = alpha;\n      alpha = smoothstep(sdfBuffer - gamma, sdfBuffer + gamma, distance);\n\n      if (outlineBuffer > 0.0) {\n        float inFill = alpha;\n        float inBorder = smoothstep(outlineBuffer - gamma, outlineBuffer + gamma, distance);\n        color = mix(outlineColor, vColor, inFill);\n        alpha = inBorder;\n      }\n    }\n    float a = alpha * color.a;\n    \n    if (a < alphaCutoff) {\n      discard;\n    }\n\n    gl_FragColor = vec4(color.rgb, a * opacity);\n  }\n\n  DECKGL_FILTER_COLOR(gl_FragColor, geometry);\n}\n";
exports.default = _default;
//# sourceMappingURL=multi-icon-layer-fragment.glsl.js.map