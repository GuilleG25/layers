"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPositions = getPositions;
exports.getHoleIndices = getHoleIndices;
exports.normalize = normalize;
exports.getSurfaceIndices = getSurfaceIndices;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _earcut = _interopRequireDefault(require("earcut"));

var _polygon2 = require("@math.gl/polygon");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var OUTER_POLYGON_WINDING = _polygon2.WINDING.CLOCKWISE;
var HOLE_POLYGON_WINDING = _polygon2.WINDING.COUNTER_CLOCKWISE;
var windingOptions = {
  isClosed: true
};

function validate(polygon) {
  polygon = polygon && polygon.positions || polygon;

  if (!Array.isArray(polygon) && !ArrayBuffer.isView(polygon)) {
    throw new Error('invalid polygon');
  }
}

function getPositions(polygon) {
  return 'positions' in polygon ? polygon.positions : polygon;
}

function getHoleIndices(polygon) {
  return 'holeIndices' in polygon ? polygon.holeIndices : null;
}

function isNested(polygon) {
  return Array.isArray(polygon[0]);
}

function isSimple(polygon) {
  return polygon.length >= 1 && polygon[0].length >= 2 && Number.isFinite(polygon[0][0]);
}

function isNestedRingClosed(simplePolygon) {
  var p0 = simplePolygon[0];
  var p1 = simplePolygon[simplePolygon.length - 1];
  return p0[0] === p1[0] && p0[1] === p1[1] && p0[2] === p1[2];
}

function isFlatRingClosed(positions, size, startIndex, endIndex) {
  for (var i = 0; i < size; i++) {
    if (positions[startIndex + i] !== positions[endIndex - size + i]) {
      return false;
    }
  }

  return true;
}

function copyNestedRing(target, targetStartIndex, simplePolygon, size, windingDirection) {
  var targetIndex = targetStartIndex;
  var len = simplePolygon.length;

  for (var i = 0; i < len; i++) {
    for (var j = 0; j < size; j++) {
      target[targetIndex++] = simplePolygon[i][j] || 0;
    }
  }

  if (!isNestedRingClosed(simplePolygon)) {
    for (var _j = 0; _j < size; _j++) {
      target[targetIndex++] = simplePolygon[0][_j] || 0;
    }
  }

  windingOptions.start = targetStartIndex;
  windingOptions.end = targetIndex;
  windingOptions.size = size;
  (0, _polygon2.modifyPolygonWindingDirection)(target, windingDirection, windingOptions);
  return targetIndex;
}

function copyFlatRing(target, targetStartIndex, positions, size) {
  var srcStartIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var srcEndIndex = arguments.length > 5 ? arguments[5] : undefined;
  var windingDirection = arguments.length > 6 ? arguments[6] : undefined;
  srcEndIndex = srcEndIndex || positions.length;
  var srcLength = srcEndIndex - srcStartIndex;

  if (srcLength <= 0) {
    return targetStartIndex;
  }

  var targetIndex = targetStartIndex;

  for (var i = 0; i < srcLength; i++) {
    target[targetIndex++] = positions[srcStartIndex + i];
  }

  if (!isFlatRingClosed(positions, size, srcStartIndex, srcEndIndex)) {
    for (var _i = 0; _i < size; _i++) {
      target[targetIndex++] = positions[srcStartIndex + _i];
    }
  }

  windingOptions.start = targetStartIndex;
  windingOptions.end = targetIndex;
  windingOptions.size = size;
  (0, _polygon2.modifyPolygonWindingDirection)(target, windingDirection, windingOptions);
  return targetIndex;
}

function normalize(polygon, positionSize) {
  validate(polygon);
  var positions = [];
  var holeIndices = [];

  if ('positions' in polygon) {
    var _polygon = polygon,
        srcPositions = _polygon.positions,
        srcHoleIndices = _polygon.holeIndices;

    if (srcHoleIndices) {
      var targetIndex = 0;

      for (var i = 0; i <= srcHoleIndices.length; i++) {
        targetIndex = copyFlatRing(positions, targetIndex, srcPositions, positionSize, srcHoleIndices[i - 1], srcHoleIndices[i], i === 0 ? OUTER_POLYGON_WINDING : HOLE_POLYGON_WINDING);
        holeIndices.push(targetIndex);
      }

      holeIndices.pop();
      return {
        positions: positions,
        holeIndices: holeIndices
      };
    }

    polygon = srcPositions;
  }

  if (!isNested(polygon)) {
    copyFlatRing(positions, 0, polygon, positionSize, 0, positions.length, OUTER_POLYGON_WINDING);
    return positions;
  }

  if (!isSimple(polygon)) {
    var _targetIndex = 0;

    var _iterator = _createForOfIteratorHelper(polygon.entries()),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
            polygonIndex = _step$value[0],
            simplePolygon = _step$value[1];

        _targetIndex = copyNestedRing(positions, _targetIndex, simplePolygon, positionSize, polygonIndex === 0 ? OUTER_POLYGON_WINDING : HOLE_POLYGON_WINDING);
        holeIndices.push(_targetIndex);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    holeIndices.pop();
    return {
      positions: positions,
      holeIndices: holeIndices
    };
  }

  copyNestedRing(positions, 0, polygon, positionSize, OUTER_POLYGON_WINDING);
  return positions;
}

function getPlaneArea(positions, xIndex, yIndex) {
  var numVerts = positions.length / 3;
  var area = 0;

  for (var i = 0; i < numVerts; i++) {
    var j = (i + 1) % numVerts;
    area += positions[i * 3 + xIndex] * positions[j * 3 + yIndex];
    area -= positions[j * 3 + xIndex] * positions[i * 3 + yIndex];
  }

  return Math.abs(area / 2);
}

function permutePositions(positions, xIndex, yIndex, zIndex) {
  var numVerts = positions.length / 3;

  for (var i = 0; i < numVerts; i++) {
    var o = i * 3;
    var x = positions[o + 0];
    var y = positions[o + 1];
    var z = positions[o + 2];
    positions[o + xIndex] = x;
    positions[o + yIndex] = y;
    positions[o + zIndex] = z;
  }
}

function getSurfaceIndices(polygon, positionSize, preproject, full3d) {
  var holeIndices = getHoleIndices(polygon);

  if (holeIndices) {
    holeIndices = holeIndices.map(function (positionIndex) {
      return positionIndex / positionSize;
    });
  }

  var positions = getPositions(polygon);
  var is3d = full3d && positionSize === 3;

  if (preproject) {
    var n = positions.length;
    positions = positions.slice();
    var p = [];

    for (var i = 0; i < n; i += positionSize) {
      p[0] = positions[i];
      p[1] = positions[i + 1];

      if (is3d) {
        p[2] = positions[i + 2];
      }

      var _xy = preproject(p);

      positions[i] = _xy[0];
      positions[i + 1] = _xy[1];

      if (is3d) {
        positions[i + 2] = _xy[2];
      }
    }
  }

  if (is3d) {
    var xyArea = getPlaneArea(positions, 0, 1);
    var xzArea = getPlaneArea(positions, 0, 2);
    var yzArea = getPlaneArea(positions, 1, 2);

    if (!xyArea && !xzArea && !yzArea) {
      return [];
    }

    if (xyArea > xzArea && xyArea > yzArea) {} else if (xzArea > yzArea) {
      if (!preproject) {
        positions = positions.slice();
      }

      permutePositions(positions, 0, 2, 1);
    } else {
      if (!preproject) {
        positions = positions.slice();
      }

      permutePositions(positions, 1, 2, 0);
    }
  }

  return (0, _earcut.default)(positions, holeIndices, positionSize);
}
//# sourceMappingURL=polygon.js.map