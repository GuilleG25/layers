(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
        else if (typeof exports === 'object') exports['deck'] = factory();
  else root['deck'] = factory();})(globalThis, function () {
"use strict";
var __exports__ = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod2) => function __require() {
    return mod2 || (0, cb[__getOwnPropNames(cb)[0]])((mod2 = { exports: {} }).exports, mod2), mod2.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __reExport = (target, mod2, secondTarget) => (__copyProps(target, mod2, "default"), secondTarget && __copyProps(secondTarget, mod2, "default"));
  var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
    isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
    mod2
  ));
  var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // external-global-plugin:@deck.gl/core
  var require_core = __commonJS({
    "external-global-plugin:@deck.gl/core"(exports, module) {
      module.exports = globalThis.deck;
    }
  });

  // external-global-plugin:@luma.gl/core
  var require_core2 = __commonJS({
    "external-global-plugin:@luma.gl/core"(exports, module) {
      module.exports = globalThis.luma;
    }
  });

  // external-global-plugin:@loaders.gl/core
  var require_core3 = __commonJS({
    "external-global-plugin:@loaders.gl/core"(exports, module) {
      module.exports = globalThis.loaders;
    }
  });

  // node_modules/earcut/src/earcut.js
  var require_earcut = __commonJS({
    "node_modules/earcut/src/earcut.js"(exports, module) {
      "use strict";
      module.exports = earcut3;
      module.exports.default = earcut3;
      function earcut3(data, holeIndices, dim) {
        dim = dim || 2;
        var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
        if (!outerNode || outerNode.next === outerNode.prev)
          return triangles;
        var minX, minY, maxX, maxY, x, y, invSize;
        if (hasHoles)
          outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
        if (data.length > 80 * dim) {
          minX = maxX = data[0];
          minY = maxY = data[1];
          for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX)
              minX = x;
            if (y < minY)
              minY = y;
            if (x > maxX)
              maxX = x;
            if (y > maxY)
              maxY = y;
          }
          invSize = Math.max(maxX - minX, maxY - minY);
          invSize = invSize !== 0 ? 32767 / invSize : 0;
        }
        earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
        return triangles;
      }
      function linkedList(data, start, end, dim, clockwise) {
        var i, last;
        if (clockwise === signedArea(data, start, end, dim) > 0) {
          for (i = start; i < end; i += dim)
            last = insertNode(i, data[i], data[i + 1], last);
        } else {
          for (i = end - dim; i >= start; i -= dim)
            last = insertNode(i, data[i], data[i + 1], last);
        }
        if (last && equals2(last, last.next)) {
          removeNode(last);
          last = last.next;
        }
        return last;
      }
      function filterPoints(start, end) {
        if (!start)
          return start;
        if (!end)
          end = start;
        var p = start, again;
        do {
          again = false;
          if (!p.steiner && (equals2(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next)
              break;
            again = true;
          } else {
            p = p.next;
          }
        } while (again || p !== end);
        return end;
      }
      function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
        if (!ear)
          return;
        if (!pass && invSize)
          indexCurve(ear, minX, minY, invSize);
        var stop = ear, prev, next;
        while (ear.prev !== ear.next) {
          prev = ear.prev;
          next = ear.next;
          if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            triangles.push(prev.i / dim | 0);
            triangles.push(ear.i / dim | 0);
            triangles.push(next.i / dim | 0);
            removeNode(ear);
            ear = next.next;
            stop = next.next;
            continue;
          }
          ear = next;
          if (ear === stop) {
            if (!pass) {
              earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
            } else if (pass === 1) {
              ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
              earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
            } else if (pass === 2) {
              splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }
            break;
          }
        }
      }
      function isEar(ear) {
        var a = ear.prev, b = ear, c = ear.next;
        if (area(a, b, c) >= 0)
          return false;
        var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
        var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
        var p = c.next;
        while (p !== a) {
          if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
            return false;
          p = p.next;
        }
        return true;
      }
      function isEarHashed(ear, minX, minY, invSize) {
        var a = ear.prev, b = ear, c = ear.next;
        if (area(a, b, c) >= 0)
          return false;
        var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
        var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
        var minZ = zOrder(x0, y0, minX, minY, invSize), maxZ = zOrder(x1, y1, minX, minY, invSize);
        var p = ear.prevZ, n = ear.nextZ;
        while (p && p.z >= minZ && n && n.z <= maxZ) {
          if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
            return false;
          p = p.prevZ;
          if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
            return false;
          n = n.nextZ;
        }
        while (p && p.z >= minZ) {
          if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0)
            return false;
          p = p.prevZ;
        }
        while (n && n.z <= maxZ) {
          if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0)
            return false;
          n = n.nextZ;
        }
        return true;
      }
      function cureLocalIntersections(start, triangles, dim) {
        var p = start;
        do {
          var a = p.prev, b = p.next.next;
          if (!equals2(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
            triangles.push(a.i / dim | 0);
            triangles.push(p.i / dim | 0);
            triangles.push(b.i / dim | 0);
            removeNode(p);
            removeNode(p.next);
            p = start = b;
          }
          p = p.next;
        } while (p !== start);
        return filterPoints(p);
      }
      function splitEarcut(start, triangles, dim, minX, minY, invSize) {
        var a = start;
        do {
          var b = a.next.next;
          while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
              var c = splitPolygon(a, b);
              a = filterPoints(a, a.next);
              c = filterPoints(c, c.next);
              earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
              earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
              return;
            }
            b = b.next;
          }
          a = a.next;
        } while (a !== start);
      }
      function eliminateHoles(data, holeIndices, outerNode, dim) {
        var queue = [], i, len, start, end, list;
        for (i = 0, len = holeIndices.length; i < len; i++) {
          start = holeIndices[i] * dim;
          end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
          list = linkedList(data, start, end, dim, false);
          if (list === list.next)
            list.steiner = true;
          queue.push(getLeftmost(list));
        }
        queue.sort(compareX);
        for (i = 0; i < queue.length; i++) {
          outerNode = eliminateHole(queue[i], outerNode);
        }
        return outerNode;
      }
      function compareX(a, b) {
        return a.x - b.x;
      }
      function eliminateHole(hole, outerNode) {
        var bridge = findHoleBridge(hole, outerNode);
        if (!bridge) {
          return outerNode;
        }
        var bridgeReverse = splitPolygon(bridge, hole);
        filterPoints(bridgeReverse, bridgeReverse.next);
        return filterPoints(bridge, bridge.next);
      }
      function findHoleBridge(hole, outerNode) {
        var p = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m;
        do {
          if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
              qx = x;
              m = p.x < p.next.x ? p : p.next;
              if (x === hx)
                return m;
            }
          }
          p = p.next;
        } while (p !== outerNode);
        if (!m)
          return null;
        var stop = m, mx = m.x, my = m.y, tanMin = Infinity, tan2;
        p = m;
        do {
          if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
            tan2 = Math.abs(hy - p.y) / (hx - p.x);
            if (locallyInside(p, hole) && (tan2 < tanMin || tan2 === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
              m = p;
              tanMin = tan2;
            }
          }
          p = p.next;
        } while (p !== stop);
        return m;
      }
      function sectorContainsSector(m, p) {
        return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
      }
      function indexCurve(start, minX, minY, invSize) {
        var p = start;
        do {
          if (p.z === 0)
            p.z = zOrder(p.x, p.y, minX, minY, invSize);
          p.prevZ = p.prev;
          p.nextZ = p.next;
          p = p.next;
        } while (p !== start);
        p.prevZ.nextZ = null;
        p.prevZ = null;
        sortLinked(p);
      }
      function sortLinked(list) {
        var i, p, q, e, tail, numMerges, pSize, qSize, inSize = 1;
        do {
          p = list;
          list = null;
          tail = null;
          numMerges = 0;
          while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
              pSize++;
              q = q.nextZ;
              if (!q)
                break;
            }
            qSize = inSize;
            while (pSize > 0 || qSize > 0 && q) {
              if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                e = p;
                p = p.nextZ;
                pSize--;
              } else {
                e = q;
                q = q.nextZ;
                qSize--;
              }
              if (tail)
                tail.nextZ = e;
              else
                list = e;
              e.prevZ = tail;
              tail = e;
            }
            p = q;
          }
          tail.nextZ = null;
          inSize *= 2;
        } while (numMerges > 1);
        return list;
      }
      function zOrder(x, y, minX, minY, invSize) {
        x = (x - minX) * invSize | 0;
        y = (y - minY) * invSize | 0;
        x = (x | x << 8) & 16711935;
        x = (x | x << 4) & 252645135;
        x = (x | x << 2) & 858993459;
        x = (x | x << 1) & 1431655765;
        y = (y | y << 8) & 16711935;
        y = (y | y << 4) & 252645135;
        y = (y | y << 2) & 858993459;
        y = (y | y << 1) & 1431655765;
        return x | y << 1;
      }
      function getLeftmost(start) {
        var p = start, leftmost = start;
        do {
          if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y)
            leftmost = p;
          p = p.next;
        } while (p !== start);
        return leftmost;
      }
      function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
      }
      function isValidDiagonal(a, b) {
        return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && (area(a.prev, a, b.prev) || area(a, b.prev, b)) || equals2(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0);
      }
      function area(p, q, r) {
        return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
      }
      function equals2(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
      }
      function intersects(p1, q1, p2, q2) {
        var o1 = sign(area(p1, q1, p2));
        var o2 = sign(area(p1, q1, q2));
        var o3 = sign(area(p2, q2, p1));
        var o4 = sign(area(p2, q2, q1));
        if (o1 !== o2 && o3 !== o4)
          return true;
        if (o1 === 0 && onSegment(p1, p2, q1))
          return true;
        if (o2 === 0 && onSegment(p1, q2, q1))
          return true;
        if (o3 === 0 && onSegment(p2, p1, q2))
          return true;
        if (o4 === 0 && onSegment(p2, q1, q2))
          return true;
        return false;
      }
      function onSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
      }
      function sign(num) {
        return num > 0 ? 1 : num < 0 ? -1 : 0;
      }
      function intersectsPolygon(a, b) {
        var p = a;
        do {
          if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b))
            return true;
          p = p.next;
        } while (p !== a);
        return false;
      }
      function locallyInside(a, b) {
        return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
      }
      function middleInside(a, b) {
        var p = a, inside = false, px = (a.x + b.x) / 2, py = (a.y + b.y) / 2;
        do {
          if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)
            inside = !inside;
          p = p.next;
        } while (p !== a);
        return inside;
      }
      function splitPolygon(a, b) {
        var a2 = new Node(a.i, a.x, a.y), b2 = new Node(b.i, b.x, b.y), an = a.next, bp = b.prev;
        a.next = b;
        b.prev = a;
        a2.next = an;
        an.prev = a2;
        b2.next = a2;
        a2.prev = b2;
        bp.next = b2;
        b2.prev = bp;
        return b2;
      }
      function insertNode(i, x, y, last) {
        var p = new Node(i, x, y);
        if (!last) {
          p.prev = p;
          p.next = p;
        } else {
          p.next = last.next;
          p.prev = last;
          last.next.prev = p;
          last.next = p;
        }
        return p;
      }
      function removeNode(p) {
        p.next.prev = p.prev;
        p.prev.next = p.next;
        if (p.prevZ)
          p.prevZ.nextZ = p.nextZ;
        if (p.nextZ)
          p.nextZ.prevZ = p.prevZ;
      }
      function Node(i, x, y) {
        this.i = i;
        this.x = x;
        this.y = y;
        this.prev = null;
        this.next = null;
        this.z = 0;
        this.prevZ = null;
        this.nextZ = null;
        this.steiner = false;
      }
      earcut3.deviation = function(data, holeIndices, dim, triangles) {
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
        var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
          for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
          }
        }
        var trianglesArea = 0;
        for (i = 0; i < triangles.length; i += 3) {
          var a = triangles[i] * dim;
          var b = triangles[i + 1] * dim;
          var c = triangles[i + 2] * dim;
          trianglesArea += Math.abs((data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
        }
        return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
      };
      function signedArea(data, start, end, dim) {
        var sum = 0;
        for (var i = start, j = end - dim; i < end; i += dim) {
          sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
          j = i;
        }
        return sum;
      }
      earcut3.flatten = function(data) {
        var dim = data[0][0].length, result = {
          vertices: [],
          holes: [],
          dimensions: dim
        }, holeIndex = 0;
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++)
              result.vertices.push(data[i][j][d]);
          }
          if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
          }
        }
        return result;
      };
    }
  });

  // bundle/index.ts
  var bundle_exports = {};
  __export(bundle_exports, {
    ArcLayer: () => ArcLayer,
    BitmapLayer: () => BitmapLayer,
    ColumnLayer: () => ColumnLayer,
    GeoJsonLayer: () => GeoJsonLayer,
    GridCellLayer: () => GridCellLayer,
    IconLayer: () => IconLayer,
    LineLayer: () => LineLayer,
    PathLayer: () => PathLayer,
    PointCloudLayer: () => PointCloudLayer,
    PolygonLayer: () => PolygonLayer,
    ScatterplotLayer: () => ScatterplotLayer,
    SolidPolygonLayer: () => SolidPolygonLayer,
    TextLayer: () => TextLayer,
    _MultiIconLayer: () => MultiIconLayer,
    _TextBackgroundLayer: () => TextBackgroundLayer
  });

  // ../core/bundle/peer-dependency.ts
  var peer_dependency_exports = {};
  var import_core = __toESM(require_core());
  __reExport(peer_dependency_exports, __toESM(require_core()));
  if (!import_core.Layer) {
    throw new Error("@deck.gl/core is not found");
  }

  // bundle/index.ts
  __reExport(bundle_exports, peer_dependency_exports);

  // src/arc-layer/arc-layer.ts
  var import_core2 = __toESM(require_core());

  // ../../node_modules/@luma.gl/constants/dist/esm/index.js
  var esm_default = {
    DEPTH_BUFFER_BIT: 256,
    STENCIL_BUFFER_BIT: 1024,
    COLOR_BUFFER_BIT: 16384,
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6,
    ZERO: 0,
    ONE: 1,
    SRC_COLOR: 768,
    ONE_MINUS_SRC_COLOR: 769,
    SRC_ALPHA: 770,
    ONE_MINUS_SRC_ALPHA: 771,
    DST_ALPHA: 772,
    ONE_MINUS_DST_ALPHA: 773,
    DST_COLOR: 774,
    ONE_MINUS_DST_COLOR: 775,
    SRC_ALPHA_SATURATE: 776,
    CONSTANT_COLOR: 32769,
    ONE_MINUS_CONSTANT_COLOR: 32770,
    CONSTANT_ALPHA: 32771,
    ONE_MINUS_CONSTANT_ALPHA: 32772,
    FUNC_ADD: 32774,
    FUNC_SUBTRACT: 32778,
    FUNC_REVERSE_SUBTRACT: 32779,
    BLEND_EQUATION: 32777,
    BLEND_EQUATION_RGB: 32777,
    BLEND_EQUATION_ALPHA: 34877,
    BLEND_DST_RGB: 32968,
    BLEND_SRC_RGB: 32969,
    BLEND_DST_ALPHA: 32970,
    BLEND_SRC_ALPHA: 32971,
    BLEND_COLOR: 32773,
    ARRAY_BUFFER_BINDING: 34964,
    ELEMENT_ARRAY_BUFFER_BINDING: 34965,
    LINE_WIDTH: 2849,
    ALIASED_POINT_SIZE_RANGE: 33901,
    ALIASED_LINE_WIDTH_RANGE: 33902,
    CULL_FACE_MODE: 2885,
    FRONT_FACE: 2886,
    DEPTH_RANGE: 2928,
    DEPTH_WRITEMASK: 2930,
    DEPTH_CLEAR_VALUE: 2931,
    DEPTH_FUNC: 2932,
    STENCIL_CLEAR_VALUE: 2961,
    STENCIL_FUNC: 2962,
    STENCIL_FAIL: 2964,
    STENCIL_PASS_DEPTH_FAIL: 2965,
    STENCIL_PASS_DEPTH_PASS: 2966,
    STENCIL_REF: 2967,
    STENCIL_VALUE_MASK: 2963,
    STENCIL_WRITEMASK: 2968,
    STENCIL_BACK_FUNC: 34816,
    STENCIL_BACK_FAIL: 34817,
    STENCIL_BACK_PASS_DEPTH_FAIL: 34818,
    STENCIL_BACK_PASS_DEPTH_PASS: 34819,
    STENCIL_BACK_REF: 36003,
    STENCIL_BACK_VALUE_MASK: 36004,
    STENCIL_BACK_WRITEMASK: 36005,
    VIEWPORT: 2978,
    SCISSOR_BOX: 3088,
    COLOR_CLEAR_VALUE: 3106,
    COLOR_WRITEMASK: 3107,
    UNPACK_ALIGNMENT: 3317,
    PACK_ALIGNMENT: 3333,
    MAX_TEXTURE_SIZE: 3379,
    MAX_VIEWPORT_DIMS: 3386,
    SUBPIXEL_BITS: 3408,
    RED_BITS: 3410,
    GREEN_BITS: 3411,
    BLUE_BITS: 3412,
    ALPHA_BITS: 3413,
    DEPTH_BITS: 3414,
    STENCIL_BITS: 3415,
    POLYGON_OFFSET_UNITS: 10752,
    POLYGON_OFFSET_FACTOR: 32824,
    TEXTURE_BINDING_2D: 32873,
    SAMPLE_BUFFERS: 32936,
    SAMPLES: 32937,
    SAMPLE_COVERAGE_VALUE: 32938,
    SAMPLE_COVERAGE_INVERT: 32939,
    COMPRESSED_TEXTURE_FORMATS: 34467,
    VENDOR: 7936,
    RENDERER: 7937,
    VERSION: 7938,
    IMPLEMENTATION_COLOR_READ_TYPE: 35738,
    IMPLEMENTATION_COLOR_READ_FORMAT: 35739,
    BROWSER_DEFAULT_WEBGL: 37444,
    STATIC_DRAW: 35044,
    STREAM_DRAW: 35040,
    DYNAMIC_DRAW: 35048,
    ARRAY_BUFFER: 34962,
    ELEMENT_ARRAY_BUFFER: 34963,
    BUFFER_SIZE: 34660,
    BUFFER_USAGE: 34661,
    CURRENT_VERTEX_ATTRIB: 34342,
    VERTEX_ATTRIB_ARRAY_ENABLED: 34338,
    VERTEX_ATTRIB_ARRAY_SIZE: 34339,
    VERTEX_ATTRIB_ARRAY_STRIDE: 34340,
    VERTEX_ATTRIB_ARRAY_TYPE: 34341,
    VERTEX_ATTRIB_ARRAY_NORMALIZED: 34922,
    VERTEX_ATTRIB_ARRAY_POINTER: 34373,
    VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 34975,
    CULL_FACE: 2884,
    FRONT: 1028,
    BACK: 1029,
    FRONT_AND_BACK: 1032,
    BLEND: 3042,
    DEPTH_TEST: 2929,
    DITHER: 3024,
    POLYGON_OFFSET_FILL: 32823,
    SAMPLE_ALPHA_TO_COVERAGE: 32926,
    SAMPLE_COVERAGE: 32928,
    SCISSOR_TEST: 3089,
    STENCIL_TEST: 2960,
    NO_ERROR: 0,
    INVALID_ENUM: 1280,
    INVALID_VALUE: 1281,
    INVALID_OPERATION: 1282,
    OUT_OF_MEMORY: 1285,
    CONTEXT_LOST_WEBGL: 37442,
    CW: 2304,
    CCW: 2305,
    DONT_CARE: 4352,
    FASTEST: 4353,
    NICEST: 4354,
    GENERATE_MIPMAP_HINT: 33170,
    BYTE: 5120,
    UNSIGNED_BYTE: 5121,
    SHORT: 5122,
    UNSIGNED_SHORT: 5123,
    INT: 5124,
    UNSIGNED_INT: 5125,
    FLOAT: 5126,
    DOUBLE: 5130,
    DEPTH_COMPONENT: 6402,
    ALPHA: 6406,
    RGB: 6407,
    RGBA: 6408,
    LUMINANCE: 6409,
    LUMINANCE_ALPHA: 6410,
    UNSIGNED_SHORT_4_4_4_4: 32819,
    UNSIGNED_SHORT_5_5_5_1: 32820,
    UNSIGNED_SHORT_5_6_5: 33635,
    FRAGMENT_SHADER: 35632,
    VERTEX_SHADER: 35633,
    COMPILE_STATUS: 35713,
    DELETE_STATUS: 35712,
    LINK_STATUS: 35714,
    VALIDATE_STATUS: 35715,
    ATTACHED_SHADERS: 35717,
    ACTIVE_ATTRIBUTES: 35721,
    ACTIVE_UNIFORMS: 35718,
    MAX_VERTEX_ATTRIBS: 34921,
    MAX_VERTEX_UNIFORM_VECTORS: 36347,
    MAX_VARYING_VECTORS: 36348,
    MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
    MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
    MAX_TEXTURE_IMAGE_UNITS: 34930,
    MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
    SHADER_TYPE: 35663,
    SHADING_LANGUAGE_VERSION: 35724,
    CURRENT_PROGRAM: 35725,
    NEVER: 512,
    ALWAYS: 519,
    LESS: 513,
    EQUAL: 514,
    LEQUAL: 515,
    GREATER: 516,
    GEQUAL: 518,
    NOTEQUAL: 517,
    KEEP: 7680,
    REPLACE: 7681,
    INCR: 7682,
    DECR: 7683,
    INVERT: 5386,
    INCR_WRAP: 34055,
    DECR_WRAP: 34056,
    NEAREST: 9728,
    LINEAR: 9729,
    NEAREST_MIPMAP_NEAREST: 9984,
    LINEAR_MIPMAP_NEAREST: 9985,
    NEAREST_MIPMAP_LINEAR: 9986,
    LINEAR_MIPMAP_LINEAR: 9987,
    TEXTURE_MAG_FILTER: 10240,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    TEXTURE_2D: 3553,
    TEXTURE: 5890,
    TEXTURE_CUBE_MAP: 34067,
    TEXTURE_BINDING_CUBE_MAP: 34068,
    TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
    TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
    TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
    TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
    TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
    TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074,
    MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
    TEXTURE0: 33984,
    ACTIVE_TEXTURE: 34016,
    REPEAT: 10497,
    CLAMP_TO_EDGE: 33071,
    MIRRORED_REPEAT: 33648,
    TEXTURE_WIDTH: 4096,
    TEXTURE_HEIGHT: 4097,
    FLOAT_VEC2: 35664,
    FLOAT_VEC3: 35665,
    FLOAT_VEC4: 35666,
    INT_VEC2: 35667,
    INT_VEC3: 35668,
    INT_VEC4: 35669,
    BOOL: 35670,
    BOOL_VEC2: 35671,
    BOOL_VEC3: 35672,
    BOOL_VEC4: 35673,
    FLOAT_MAT2: 35674,
    FLOAT_MAT3: 35675,
    FLOAT_MAT4: 35676,
    SAMPLER_2D: 35678,
    SAMPLER_CUBE: 35680,
    LOW_FLOAT: 36336,
    MEDIUM_FLOAT: 36337,
    HIGH_FLOAT: 36338,
    LOW_INT: 36339,
    MEDIUM_INT: 36340,
    HIGH_INT: 36341,
    FRAMEBUFFER: 36160,
    RENDERBUFFER: 36161,
    RGBA4: 32854,
    RGB5_A1: 32855,
    RGB565: 36194,
    DEPTH_COMPONENT16: 33189,
    STENCIL_INDEX: 6401,
    STENCIL_INDEX8: 36168,
    DEPTH_STENCIL: 34041,
    RENDERBUFFER_WIDTH: 36162,
    RENDERBUFFER_HEIGHT: 36163,
    RENDERBUFFER_INTERNAL_FORMAT: 36164,
    RENDERBUFFER_RED_SIZE: 36176,
    RENDERBUFFER_GREEN_SIZE: 36177,
    RENDERBUFFER_BLUE_SIZE: 36178,
    RENDERBUFFER_ALPHA_SIZE: 36179,
    RENDERBUFFER_DEPTH_SIZE: 36180,
    RENDERBUFFER_STENCIL_SIZE: 36181,
    FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 36048,
    FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 36049,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 36050,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 36051,
    COLOR_ATTACHMENT0: 36064,
    DEPTH_ATTACHMENT: 36096,
    STENCIL_ATTACHMENT: 36128,
    DEPTH_STENCIL_ATTACHMENT: 33306,
    NONE: 0,
    FRAMEBUFFER_COMPLETE: 36053,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 36054,
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 36055,
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 36057,
    FRAMEBUFFER_UNSUPPORTED: 36061,
    FRAMEBUFFER_BINDING: 36006,
    RENDERBUFFER_BINDING: 36007,
    READ_FRAMEBUFFER: 36008,
    DRAW_FRAMEBUFFER: 36009,
    MAX_RENDERBUFFER_SIZE: 34024,
    INVALID_FRAMEBUFFER_OPERATION: 1286,
    UNPACK_FLIP_Y_WEBGL: 37440,
    UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
    UNPACK_COLORSPACE_CONVERSION_WEBGL: 37443,
    READ_BUFFER: 3074,
    UNPACK_ROW_LENGTH: 3314,
    UNPACK_SKIP_ROWS: 3315,
    UNPACK_SKIP_PIXELS: 3316,
    PACK_ROW_LENGTH: 3330,
    PACK_SKIP_ROWS: 3331,
    PACK_SKIP_PIXELS: 3332,
    TEXTURE_BINDING_3D: 32874,
    UNPACK_SKIP_IMAGES: 32877,
    UNPACK_IMAGE_HEIGHT: 32878,
    MAX_3D_TEXTURE_SIZE: 32883,
    MAX_ELEMENTS_VERTICES: 33e3,
    MAX_ELEMENTS_INDICES: 33001,
    MAX_TEXTURE_LOD_BIAS: 34045,
    MAX_FRAGMENT_UNIFORM_COMPONENTS: 35657,
    MAX_VERTEX_UNIFORM_COMPONENTS: 35658,
    MAX_ARRAY_TEXTURE_LAYERS: 35071,
    MIN_PROGRAM_TEXEL_OFFSET: 35076,
    MAX_PROGRAM_TEXEL_OFFSET: 35077,
    MAX_VARYING_COMPONENTS: 35659,
    FRAGMENT_SHADER_DERIVATIVE_HINT: 35723,
    RASTERIZER_DISCARD: 35977,
    VERTEX_ARRAY_BINDING: 34229,
    MAX_VERTEX_OUTPUT_COMPONENTS: 37154,
    MAX_FRAGMENT_INPUT_COMPONENTS: 37157,
    MAX_SERVER_WAIT_TIMEOUT: 37137,
    MAX_ELEMENT_INDEX: 36203,
    RED: 6403,
    RGB8: 32849,
    RGBA8: 32856,
    RGB10_A2: 32857,
    TEXTURE_3D: 32879,
    TEXTURE_WRAP_R: 32882,
    TEXTURE_MIN_LOD: 33082,
    TEXTURE_MAX_LOD: 33083,
    TEXTURE_BASE_LEVEL: 33084,
    TEXTURE_MAX_LEVEL: 33085,
    TEXTURE_COMPARE_MODE: 34892,
    TEXTURE_COMPARE_FUNC: 34893,
    SRGB: 35904,
    SRGB8: 35905,
    SRGB8_ALPHA8: 35907,
    COMPARE_REF_TO_TEXTURE: 34894,
    RGBA32F: 34836,
    RGB32F: 34837,
    RGBA16F: 34842,
    RGB16F: 34843,
    TEXTURE_2D_ARRAY: 35866,
    TEXTURE_BINDING_2D_ARRAY: 35869,
    R11F_G11F_B10F: 35898,
    RGB9_E5: 35901,
    RGBA32UI: 36208,
    RGB32UI: 36209,
    RGBA16UI: 36214,
    RGB16UI: 36215,
    RGBA8UI: 36220,
    RGB8UI: 36221,
    RGBA32I: 36226,
    RGB32I: 36227,
    RGBA16I: 36232,
    RGB16I: 36233,
    RGBA8I: 36238,
    RGB8I: 36239,
    RED_INTEGER: 36244,
    RGB_INTEGER: 36248,
    RGBA_INTEGER: 36249,
    R8: 33321,
    RG8: 33323,
    R16F: 33325,
    R32F: 33326,
    RG16F: 33327,
    RG32F: 33328,
    R8I: 33329,
    R8UI: 33330,
    R16I: 33331,
    R16UI: 33332,
    R32I: 33333,
    R32UI: 33334,
    RG8I: 33335,
    RG8UI: 33336,
    RG16I: 33337,
    RG16UI: 33338,
    RG32I: 33339,
    RG32UI: 33340,
    R8_SNORM: 36756,
    RG8_SNORM: 36757,
    RGB8_SNORM: 36758,
    RGBA8_SNORM: 36759,
    RGB10_A2UI: 36975,
    TEXTURE_IMMUTABLE_FORMAT: 37167,
    TEXTURE_IMMUTABLE_LEVELS: 33503,
    UNSIGNED_INT_2_10_10_10_REV: 33640,
    UNSIGNED_INT_10F_11F_11F_REV: 35899,
    UNSIGNED_INT_5_9_9_9_REV: 35902,
    FLOAT_32_UNSIGNED_INT_24_8_REV: 36269,
    UNSIGNED_INT_24_8: 34042,
    HALF_FLOAT: 5131,
    RG: 33319,
    RG_INTEGER: 33320,
    INT_2_10_10_10_REV: 36255,
    CURRENT_QUERY: 34917,
    QUERY_RESULT: 34918,
    QUERY_RESULT_AVAILABLE: 34919,
    ANY_SAMPLES_PASSED: 35887,
    ANY_SAMPLES_PASSED_CONSERVATIVE: 36202,
    MAX_DRAW_BUFFERS: 34852,
    DRAW_BUFFER0: 34853,
    DRAW_BUFFER1: 34854,
    DRAW_BUFFER2: 34855,
    DRAW_BUFFER3: 34856,
    DRAW_BUFFER4: 34857,
    DRAW_BUFFER5: 34858,
    DRAW_BUFFER6: 34859,
    DRAW_BUFFER7: 34860,
    DRAW_BUFFER8: 34861,
    DRAW_BUFFER9: 34862,
    DRAW_BUFFER10: 34863,
    DRAW_BUFFER11: 34864,
    DRAW_BUFFER12: 34865,
    DRAW_BUFFER13: 34866,
    DRAW_BUFFER14: 34867,
    DRAW_BUFFER15: 34868,
    MAX_COLOR_ATTACHMENTS: 36063,
    COLOR_ATTACHMENT1: 36065,
    COLOR_ATTACHMENT2: 36066,
    COLOR_ATTACHMENT3: 36067,
    COLOR_ATTACHMENT4: 36068,
    COLOR_ATTACHMENT5: 36069,
    COLOR_ATTACHMENT6: 36070,
    COLOR_ATTACHMENT7: 36071,
    COLOR_ATTACHMENT8: 36072,
    COLOR_ATTACHMENT9: 36073,
    COLOR_ATTACHMENT10: 36074,
    COLOR_ATTACHMENT11: 36075,
    COLOR_ATTACHMENT12: 36076,
    COLOR_ATTACHMENT13: 36077,
    COLOR_ATTACHMENT14: 36078,
    COLOR_ATTACHMENT15: 36079,
    SAMPLER_3D: 35679,
    SAMPLER_2D_SHADOW: 35682,
    SAMPLER_2D_ARRAY: 36289,
    SAMPLER_2D_ARRAY_SHADOW: 36292,
    SAMPLER_CUBE_SHADOW: 36293,
    INT_SAMPLER_2D: 36298,
    INT_SAMPLER_3D: 36299,
    INT_SAMPLER_CUBE: 36300,
    INT_SAMPLER_2D_ARRAY: 36303,
    UNSIGNED_INT_SAMPLER_2D: 36306,
    UNSIGNED_INT_SAMPLER_3D: 36307,
    UNSIGNED_INT_SAMPLER_CUBE: 36308,
    UNSIGNED_INT_SAMPLER_2D_ARRAY: 36311,
    MAX_SAMPLES: 36183,
    SAMPLER_BINDING: 35097,
    PIXEL_PACK_BUFFER: 35051,
    PIXEL_UNPACK_BUFFER: 35052,
    PIXEL_PACK_BUFFER_BINDING: 35053,
    PIXEL_UNPACK_BUFFER_BINDING: 35055,
    COPY_READ_BUFFER: 36662,
    COPY_WRITE_BUFFER: 36663,
    COPY_READ_BUFFER_BINDING: 36662,
    COPY_WRITE_BUFFER_BINDING: 36663,
    FLOAT_MAT2x3: 35685,
    FLOAT_MAT2x4: 35686,
    FLOAT_MAT3x2: 35687,
    FLOAT_MAT3x4: 35688,
    FLOAT_MAT4x2: 35689,
    FLOAT_MAT4x3: 35690,
    UNSIGNED_INT_VEC2: 36294,
    UNSIGNED_INT_VEC3: 36295,
    UNSIGNED_INT_VEC4: 36296,
    UNSIGNED_NORMALIZED: 35863,
    SIGNED_NORMALIZED: 36764,
    VERTEX_ATTRIB_ARRAY_INTEGER: 35069,
    VERTEX_ATTRIB_ARRAY_DIVISOR: 35070,
    TRANSFORM_FEEDBACK_BUFFER_MODE: 35967,
    MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 35968,
    TRANSFORM_FEEDBACK_VARYINGS: 35971,
    TRANSFORM_FEEDBACK_BUFFER_START: 35972,
    TRANSFORM_FEEDBACK_BUFFER_SIZE: 35973,
    TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 35976,
    MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 35978,
    MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 35979,
    INTERLEAVED_ATTRIBS: 35980,
    SEPARATE_ATTRIBS: 35981,
    TRANSFORM_FEEDBACK_BUFFER: 35982,
    TRANSFORM_FEEDBACK_BUFFER_BINDING: 35983,
    TRANSFORM_FEEDBACK: 36386,
    TRANSFORM_FEEDBACK_PAUSED: 36387,
    TRANSFORM_FEEDBACK_ACTIVE: 36388,
    TRANSFORM_FEEDBACK_BINDING: 36389,
    FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 33296,
    FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 33297,
    FRAMEBUFFER_ATTACHMENT_RED_SIZE: 33298,
    FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 33299,
    FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 33300,
    FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 33301,
    FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 33302,
    FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 33303,
    FRAMEBUFFER_DEFAULT: 33304,
    DEPTH24_STENCIL8: 35056,
    DRAW_FRAMEBUFFER_BINDING: 36006,
    READ_FRAMEBUFFER_BINDING: 36010,
    RENDERBUFFER_SAMPLES: 36011,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 36052,
    FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 36182,
    UNIFORM_BUFFER: 35345,
    UNIFORM_BUFFER_BINDING: 35368,
    UNIFORM_BUFFER_START: 35369,
    UNIFORM_BUFFER_SIZE: 35370,
    MAX_VERTEX_UNIFORM_BLOCKS: 35371,
    MAX_FRAGMENT_UNIFORM_BLOCKS: 35373,
    MAX_COMBINED_UNIFORM_BLOCKS: 35374,
    MAX_UNIFORM_BUFFER_BINDINGS: 35375,
    MAX_UNIFORM_BLOCK_SIZE: 35376,
    MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 35377,
    MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 35379,
    UNIFORM_BUFFER_OFFSET_ALIGNMENT: 35380,
    ACTIVE_UNIFORM_BLOCKS: 35382,
    UNIFORM_TYPE: 35383,
    UNIFORM_SIZE: 35384,
    UNIFORM_BLOCK_INDEX: 35386,
    UNIFORM_OFFSET: 35387,
    UNIFORM_ARRAY_STRIDE: 35388,
    UNIFORM_MATRIX_STRIDE: 35389,
    UNIFORM_IS_ROW_MAJOR: 35390,
    UNIFORM_BLOCK_BINDING: 35391,
    UNIFORM_BLOCK_DATA_SIZE: 35392,
    UNIFORM_BLOCK_ACTIVE_UNIFORMS: 35394,
    UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 35395,
    UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 35396,
    UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 35398,
    OBJECT_TYPE: 37138,
    SYNC_CONDITION: 37139,
    SYNC_STATUS: 37140,
    SYNC_FLAGS: 37141,
    SYNC_FENCE: 37142,
    SYNC_GPU_COMMANDS_COMPLETE: 37143,
    UNSIGNALED: 37144,
    SIGNALED: 37145,
    ALREADY_SIGNALED: 37146,
    TIMEOUT_EXPIRED: 37147,
    CONDITION_SATISFIED: 37148,
    WAIT_FAILED: 37149,
    SYNC_FLUSH_COMMANDS_BIT: 1,
    COLOR: 6144,
    DEPTH: 6145,
    STENCIL: 6146,
    MIN: 32775,
    MAX: 32776,
    DEPTH_COMPONENT24: 33190,
    STREAM_READ: 35041,
    STREAM_COPY: 35042,
    STATIC_READ: 35045,
    STATIC_COPY: 35046,
    DYNAMIC_READ: 35049,
    DYNAMIC_COPY: 35050,
    DEPTH_COMPONENT32F: 36012,
    DEPTH32F_STENCIL8: 36013,
    INVALID_INDEX: 4294967295,
    TIMEOUT_IGNORED: -1,
    MAX_CLIENT_WAIT_TIMEOUT_WEBGL: 37447,
    VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 35070,
    UNMASKED_VENDOR_WEBGL: 37445,
    UNMASKED_RENDERER_WEBGL: 37446,
    MAX_TEXTURE_MAX_ANISOTROPY_EXT: 34047,
    TEXTURE_MAX_ANISOTROPY_EXT: 34046,
    COMPRESSED_RGB_S3TC_DXT1_EXT: 33776,
    COMPRESSED_RGBA_S3TC_DXT1_EXT: 33777,
    COMPRESSED_RGBA_S3TC_DXT3_EXT: 33778,
    COMPRESSED_RGBA_S3TC_DXT5_EXT: 33779,
    COMPRESSED_R11_EAC: 37488,
    COMPRESSED_SIGNED_R11_EAC: 37489,
    COMPRESSED_RG11_EAC: 37490,
    COMPRESSED_SIGNED_RG11_EAC: 37491,
    COMPRESSED_RGB8_ETC2: 37492,
    COMPRESSED_RGBA8_ETC2_EAC: 37493,
    COMPRESSED_SRGB8_ETC2: 37494,
    COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 37495,
    COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37496,
    COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37497,
    COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 35840,
    COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 35842,
    COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 35841,
    COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 35843,
    COMPRESSED_RGB_ETC1_WEBGL: 36196,
    COMPRESSED_RGB_ATC_WEBGL: 35986,
    COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 35986,
    COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 34798,
    UNSIGNED_INT_24_8_WEBGL: 34042,
    HALF_FLOAT_OES: 36193,
    RGBA32F_EXT: 34836,
    RGB32F_EXT: 34837,
    FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 33297,
    UNSIGNED_NORMALIZED_EXT: 35863,
    MIN_EXT: 32775,
    MAX_EXT: 32776,
    SRGB_EXT: 35904,
    SRGB_ALPHA_EXT: 35906,
    SRGB8_ALPHA8_EXT: 35907,
    FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: 33296,
    FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 35723,
    COLOR_ATTACHMENT0_WEBGL: 36064,
    COLOR_ATTACHMENT1_WEBGL: 36065,
    COLOR_ATTACHMENT2_WEBGL: 36066,
    COLOR_ATTACHMENT3_WEBGL: 36067,
    COLOR_ATTACHMENT4_WEBGL: 36068,
    COLOR_ATTACHMENT5_WEBGL: 36069,
    COLOR_ATTACHMENT6_WEBGL: 36070,
    COLOR_ATTACHMENT7_WEBGL: 36071,
    COLOR_ATTACHMENT8_WEBGL: 36072,
    COLOR_ATTACHMENT9_WEBGL: 36073,
    COLOR_ATTACHMENT10_WEBGL: 36074,
    COLOR_ATTACHMENT11_WEBGL: 36075,
    COLOR_ATTACHMENT12_WEBGL: 36076,
    COLOR_ATTACHMENT13_WEBGL: 36077,
    COLOR_ATTACHMENT14_WEBGL: 36078,
    COLOR_ATTACHMENT15_WEBGL: 36079,
    DRAW_BUFFER0_WEBGL: 34853,
    DRAW_BUFFER1_WEBGL: 34854,
    DRAW_BUFFER2_WEBGL: 34855,
    DRAW_BUFFER3_WEBGL: 34856,
    DRAW_BUFFER4_WEBGL: 34857,
    DRAW_BUFFER5_WEBGL: 34858,
    DRAW_BUFFER6_WEBGL: 34859,
    DRAW_BUFFER7_WEBGL: 34860,
    DRAW_BUFFER8_WEBGL: 34861,
    DRAW_BUFFER9_WEBGL: 34862,
    DRAW_BUFFER10_WEBGL: 34863,
    DRAW_BUFFER11_WEBGL: 34864,
    DRAW_BUFFER12_WEBGL: 34865,
    DRAW_BUFFER13_WEBGL: 34866,
    DRAW_BUFFER14_WEBGL: 34867,
    DRAW_BUFFER15_WEBGL: 34868,
    MAX_COLOR_ATTACHMENTS_WEBGL: 36063,
    MAX_DRAW_BUFFERS_WEBGL: 34852,
    VERTEX_ARRAY_BINDING_OES: 34229,
    QUERY_COUNTER_BITS_EXT: 34916,
    CURRENT_QUERY_EXT: 34917,
    QUERY_RESULT_EXT: 34918,
    QUERY_RESULT_AVAILABLE_EXT: 34919,
    TIME_ELAPSED_EXT: 35007,
    TIMESTAMP_EXT: 36392,
    GPU_DISJOINT_EXT: 36795
  };

  // src/arc-layer/arc-layer.ts
  var import_core3 = __toESM(require_core2());

  // src/arc-layer/arc-layer-vertex.glsl.ts
  var arc_layer_vertex_glsl_default = `#define SHADER_NAME arc-layer-vertex-shader

attribute vec3 positions;
attribute vec4 instanceSourceColors;
attribute vec4 instanceTargetColors;
attribute vec3 instanceSourcePositions;
attribute vec3 instanceSourcePositions64Low;
attribute vec3 instanceTargetPositions;
attribute vec3 instanceTargetPositions64Low;
attribute vec3 instancePickingColors;
attribute float instanceWidths;
attribute float instanceHeights;
attribute float instanceTilts;

uniform bool greatCircle;
uniform bool useShortestPath;
uniform float numSegments;
uniform float opacity;
uniform float widthScale;
uniform float widthMinPixels;
uniform float widthMaxPixels;
uniform int widthUnits;

varying vec4 vColor;
varying vec2 uv;
varying float isValid;

float paraboloid(float distance, float sourceZ, float targetZ, float ratio) {
  // d: distance on the xy plane
  // r: ratio of the current point
  // p: ratio of the peak of the arc
  // h: height multiplier
  // z = f(r) = sqrt(r * (p * 2 - r)) * d * h
  // f(0) = 0
  // f(1) = dz

  float deltaZ = targetZ - sourceZ;
  float dh = distance * instanceHeights;
  if (dh == 0.0) {
    return sourceZ + deltaZ * ratio;
  }
  float unitZ = deltaZ / dh;
  float p2 = unitZ * unitZ + 1.0;

  // sqrt does not deal with negative values, manually flip source and target if delta.z < 0
  float dir = step(deltaZ, 0.0);
  float z0 = mix(sourceZ, targetZ, dir);
  float r = mix(ratio, 1.0 - ratio, dir);
  return sqrt(r * (p2 - r)) * dh + z0;
}

// offset vector by strokeWidth pixels
// offset_direction is -1 (left) or 1 (right)
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction, float width) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace * project_uViewportSize);
  // rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);

  return dir_screenspace * offset_direction * width / 2.0;
}

float getSegmentRatio(float index) {
  return smoothstep(0.0, 1.0, index / (numSegments - 1.0));
}

vec3 interpolateFlat(vec3 source, vec3 target, float segmentRatio) {
  float distance = length(source.xy - target.xy);
  float z = paraboloid(distance, source.z, target.z, segmentRatio);

  float tiltAngle = radians(instanceTilts);
  vec2 tiltDirection = normalize(target.xy - source.xy);
  vec2 tilt = vec2(-tiltDirection.y, tiltDirection.x) * z * sin(tiltAngle);

  return vec3(
    mix(source.xy, target.xy, segmentRatio) + tilt,
    z * cos(tiltAngle)
  );
}

/* Great circle interpolation
 * http://www.movable-type.co.uk/scripts/latlong.html
 */
float getAngularDist (vec2 source, vec2 target) {
  vec2 sourceRadians = radians(source);
  vec2 targetRadians = radians(target);
  vec2 sin_half_delta = sin((sourceRadians - targetRadians) / 2.0);
  vec2 shd_sq = sin_half_delta * sin_half_delta;

  float a = shd_sq.y + cos(sourceRadians.y) * cos(targetRadians.y) * shd_sq.x;
  return 2.0 * asin(sqrt(a));
}

vec3 interpolateGreatCircle(vec3 source, vec3 target, vec3 source3D, vec3 target3D, float angularDist, float t) {
  vec2 lngLat;

  // if the angularDist is PI, linear interpolation is applied. otherwise, use spherical interpolation
  if(abs(angularDist - PI) < 0.001) {
    lngLat = (1.0 - t) * source.xy + t * target.xy;
  } else {
    float a = sin((1.0 - t) * angularDist);
    float b = sin(t * angularDist);
    vec3 p = source3D.yxz * a + target3D.yxz * b;
    lngLat = degrees(vec2(atan(p.y, -p.x), atan(p.z, length(p.xy))));
  }

  float z = paraboloid(angularDist * EARTH_RADIUS, source.z, target.z, t);

  return vec3(lngLat, z);
}

/* END GREAT CIRCLE */

void main(void) {
  geometry.worldPosition = instanceSourcePositions;
  geometry.worldPositionAlt = instanceTargetPositions;

  float segmentIndex = positions.x;
  float segmentRatio = getSegmentRatio(segmentIndex);
  float prevSegmentRatio = getSegmentRatio(max(0.0, segmentIndex - 1.0));
  float nextSegmentRatio = getSegmentRatio(min(numSegments - 1.0, segmentIndex + 1.0));

  // if it's the first point, use next - current as direction
  // otherwise use current - prev
  float indexDir = mix(-1.0, 1.0, step(segmentIndex, 0.0));
  isValid = 1.0;

  uv = vec2(segmentRatio, positions.y);
  geometry.uv = uv;
  geometry.pickingColor = instancePickingColors;

  vec4 curr;
  vec4 next;
  vec3 source;
  vec3 target;

  if ((greatCircle || project_uProjectionMode == PROJECTION_MODE_GLOBE) && project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
    source = project_globe_(vec3(instanceSourcePositions.xy, 0.0));
    target = project_globe_(vec3(instanceTargetPositions.xy, 0.0));
    float angularDist = getAngularDist(instanceSourcePositions.xy, instanceTargetPositions.xy);

    vec3 prevPos = interpolateGreatCircle(instanceSourcePositions, instanceTargetPositions, source, target, angularDist, prevSegmentRatio);
    vec3 currPos = interpolateGreatCircle(instanceSourcePositions, instanceTargetPositions, source, target, angularDist, segmentRatio);
    vec3 nextPos = interpolateGreatCircle(instanceSourcePositions, instanceTargetPositions, source, target, angularDist, nextSegmentRatio);

    if (abs(currPos.x - prevPos.x) > 180.0) {
      indexDir = -1.0;
      isValid = 0.0;
    } else if (abs(currPos.x - nextPos.x) > 180.0) {
      indexDir = 1.0;
      isValid = 0.0;
    }
    nextPos = indexDir < 0.0 ? prevPos : nextPos;
    nextSegmentRatio = indexDir < 0.0 ? prevSegmentRatio : nextSegmentRatio;

    if (isValid == 0.0) {
      // split at the 180th meridian
      nextPos.x += nextPos.x > 0.0 ? -360.0 : 360.0;
      float t = ((currPos.x > 0.0 ? 180.0 : -180.0) - currPos.x) / (nextPos.x - currPos.x);
      currPos = mix(currPos, nextPos, t);
      segmentRatio = mix(segmentRatio, nextSegmentRatio, t);
    }

    vec3 currPos64Low = mix(instanceSourcePositions64Low, instanceTargetPositions64Low, segmentRatio);
    vec3 nextPos64Low = mix(instanceSourcePositions64Low, instanceTargetPositions64Low, nextSegmentRatio);
  
    curr = project_position_to_clipspace(currPos, currPos64Low, vec3(0.0), geometry.position);
    next = project_position_to_clipspace(nextPos, nextPos64Low, vec3(0.0));
  
  } else {
    vec3 source_world = instanceSourcePositions;
    vec3 target_world = instanceTargetPositions;
    if (useShortestPath) {
      source_world.x = mod(source_world.x + 180., 360.0) - 180.;
      target_world.x = mod(target_world.x + 180., 360.0) - 180.;

      float deltaLng = target_world.x - source_world.x;
      if (deltaLng > 180.) target_world.x -= 360.;
      if (deltaLng < -180.) source_world.x -= 360.;
    }
    source = project_position(source_world, instanceSourcePositions64Low);
    target = project_position(target_world, instanceTargetPositions64Low);

    // common x at longitude=-180
    float antiMeridianX = 0.0;

    if (useShortestPath) {
      if (project_uProjectionMode == PROJECTION_MODE_WEB_MERCATOR_AUTO_OFFSET) {
        antiMeridianX = -(project_uCoordinateOrigin.x + 180.) / 360. * TILE_SIZE;
      }
      float thresholdRatio = (antiMeridianX - source.x) / (target.x - source.x);

      if (prevSegmentRatio <= thresholdRatio && nextSegmentRatio > thresholdRatio) {
        isValid = 0.0;
        indexDir = sign(segmentRatio - thresholdRatio);
        segmentRatio = thresholdRatio;
      }
    }

    nextSegmentRatio = indexDir < 0.0 ? prevSegmentRatio : nextSegmentRatio;
    vec3 currPos = interpolateFlat(source, target, segmentRatio);
    vec3 nextPos = interpolateFlat(source, target, nextSegmentRatio);

    if (useShortestPath) {
      if (nextPos.x < antiMeridianX) {
        currPos.x += TILE_SIZE;
        nextPos.x += TILE_SIZE;
      }
    }

    curr = project_common_position_to_clipspace(vec4(currPos, 1.0));
    next = project_common_position_to_clipspace(vec4(nextPos, 1.0));
    geometry.position = vec4(currPos, 1.0);
  }

  // Multiply out width and clamp to limits
  // mercator pixels are interpreted as screen pixels
  float widthPixels = clamp(
    project_size_to_pixel(instanceWidths * widthScale, widthUnits),
    widthMinPixels, widthMaxPixels
  );

  // extrude
  vec3 offset = vec3(
    getExtrusionOffset((next.xy - curr.xy) * indexDir, positions.y, widthPixels),
    0.0);
  DECKGL_FILTER_SIZE(offset, geometry);
  DECKGL_FILTER_GL_POSITION(curr, geometry);
  gl_Position = curr + vec4(project_pixel_size_to_clipspace(offset.xy), 0.0, 0.0);

  vec4 color = mix(instanceSourceColors, instanceTargetColors, segmentRatio);
  vColor = vec4(color.rgb, color.a * opacity);
  DECKGL_FILTER_COLOR(vColor, geometry);
}
`;

  // src/arc-layer/arc-layer-fragment.glsl.ts
  var arc_layer_fragment_glsl_default = `#define SHADER_NAME arc-layer-fragment-shader

precision highp float;

varying vec4 vColor;
varying vec2 uv;
varying float isValid;

void main(void) {
  if (isValid == 0.0) {
    discard;
  }

  gl_FragColor = vColor;
  geometry.uv = uv;

  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;

  // src/arc-layer/arc-layer.ts
  var DEFAULT_COLOR = [0, 0, 0, 255];
  var defaultProps = {
    getSourcePosition: {
      type: "accessor",
      value: (x) => x.sourcePosition
    },
    getTargetPosition: {
      type: "accessor",
      value: (x) => x.targetPosition
    },
    getSourceColor: {
      type: "accessor",
      value: DEFAULT_COLOR
    },
    getTargetColor: {
      type: "accessor",
      value: DEFAULT_COLOR
    },
    getWidth: {
      type: "accessor",
      value: 1
    },
    getHeight: {
      type: "accessor",
      value: 1
    },
    getTilt: {
      type: "accessor",
      value: 0
    },
    greatCircle: false,
    widthUnits: "pixels",
    widthScale: {
      type: "number",
      value: 1,
      min: 0
    },
    widthMinPixels: {
      type: "number",
      value: 0,
      min: 0
    },
    widthMaxPixels: {
      type: "number",
      value: Number.MAX_SAFE_INTEGER,
      min: 0
    }
  };
  var ArcLayer = class extends import_core2.Layer {
    getBounds() {
      return this.getAttributeManager()?.getBounds(["instanceSourcePositions", "instanceTargetPositions"]);
    }
    getShaders() {
      return super.getShaders({
        vs: arc_layer_vertex_glsl_default,
        fs: arc_layer_fragment_glsl_default,
        modules: [import_core2.project32, import_core2.picking]
      });
    }
    get wrapLongitude() {
      return false;
    }
    initializeState() {
      const attributeManager = this.getAttributeManager();
      attributeManager.addInstanced({
        instanceSourcePositions: {
          size: 3,
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          transition: true,
          accessor: "getSourcePosition"
        },
        instanceTargetPositions: {
          size: 3,
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          transition: true,
          accessor: "getTargetPosition"
        },
        instanceSourceColors: {
          size: this.props.colorFormat.length,
          type: esm_default.UNSIGNED_BYTE,
          normalized: true,
          transition: true,
          accessor: "getSourceColor",
          defaultValue: DEFAULT_COLOR
        },
        instanceTargetColors: {
          size: this.props.colorFormat.length,
          type: esm_default.UNSIGNED_BYTE,
          normalized: true,
          transition: true,
          accessor: "getTargetColor",
          defaultValue: DEFAULT_COLOR
        },
        instanceWidths: {
          size: 1,
          transition: true,
          accessor: "getWidth",
          defaultValue: 1
        },
        instanceHeights: {
          size: 1,
          transition: true,
          accessor: "getHeight",
          defaultValue: 1
        },
        instanceTilts: {
          size: 1,
          transition: true,
          accessor: "getTilt",
          defaultValue: 0
        }
      });
    }
    updateState(opts) {
      super.updateState(opts);
      if (opts.changeFlags.extensionsChanged) {
        const {
          gl
        } = this.context;
        this.state.model?.delete();
        this.state.model = this._getModel(gl);
        this.getAttributeManager().invalidateAll();
      }
    }
    draw({
      uniforms
    }) {
      const {
        widthUnits,
        widthScale,
        widthMinPixels,
        widthMaxPixels,
        greatCircle,
        wrapLongitude
      } = this.props;
      this.state.model.setUniforms(uniforms).setUniforms({
        greatCircle,
        widthUnits: import_core2.UNIT[widthUnits],
        widthScale,
        widthMinPixels,
        widthMaxPixels,
        useShortestPath: wrapLongitude
      }).draw();
    }
    _getModel(gl) {
      let positions = [];
      const NUM_SEGMENTS = 50;
      for (let i = 0; i < NUM_SEGMENTS; i++) {
        positions = positions.concat([i, 1, 0, i, -1, 0]);
      }
      const model = new import_core3.Model(gl, {
        ...this.getShaders(),
        id: this.props.id,
        geometry: new import_core3.Geometry({
          drawMode: esm_default.TRIANGLE_STRIP,
          attributes: {
            positions: new Float32Array(positions)
          }
        }),
        isInstanced: true
      });
      model.setUniforms({
        numSegments: NUM_SEGMENTS
      });
      return model;
    }
  };
  __publicField(ArcLayer, "layerName", "ArcLayer");
  __publicField(ArcLayer, "defaultProps", defaultProps);

  // src/bitmap-layer/bitmap-layer.ts
  var import_core5 = __toESM(require_core());
  var import_core6 = __toESM(require_core2());

  // ../../node_modules/@math.gl/web-mercator/dist/esm/assert.js
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "@math.gl/web-mercator: assertion failed.");
    }
  }

  // ../../node_modules/@math.gl/web-mercator/dist/esm/web-mercator-utils.js
  var PI = Math.PI;
  var PI_4 = PI / 4;
  var DEGREES_TO_RADIANS = PI / 180;
  var RADIANS_TO_DEGREES = 180 / PI;
  var TILE_SIZE = 512;
  function lngLatToWorld(lngLat) {
    const [lng, lat] = lngLat;
    assert(Number.isFinite(lng));
    assert(Number.isFinite(lat) && lat >= -90 && lat <= 90, "invalid latitude");
    const lambda2 = lng * DEGREES_TO_RADIANS;
    const phi2 = lat * DEGREES_TO_RADIANS;
    const x = TILE_SIZE * (lambda2 + PI) / (2 * PI);
    const y = TILE_SIZE * (PI + Math.log(Math.tan(PI_4 + phi2 * 0.5))) / (2 * PI);
    return [x, y];
  }

  // ../../node_modules/@math.gl/web-mercator/dist/esm/get-bounds.js
  var DEGREES_TO_RADIANS2 = Math.PI / 180;

  // ../../node_modules/@math.gl/core/dist/esm/lib/common.js
  var RADIANS_TO_DEGREES2 = 1 / Math.PI * 180;
  var DEGREES_TO_RADIANS3 = 1 / 180 * Math.PI;
  function isArray(value) {
    return Array.isArray(value) || ArrayBuffer.isView(value) && !(value instanceof DataView);
  }
  function lerp2(a, b, t) {
    if (isArray(a)) {
      return a.map((ai, i) => lerp2(ai, b[i], t));
    }
    return t * b + (1 - t) * a;
  }

  // src/bitmap-layer/create-mesh.ts
  var DEFAULT_INDICES = new Uint16Array([0, 2, 1, 0, 3, 2]);
  var DEFAULT_TEX_COORDS = new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]);
  function createMesh(bounds, resolution) {
    if (!resolution) {
      return createQuad(bounds);
    }
    const maxXSpan = Math.max(Math.abs(bounds[0][0] - bounds[3][0]), Math.abs(bounds[1][0] - bounds[2][0]));
    const maxYSpan = Math.max(Math.abs(bounds[1][1] - bounds[0][1]), Math.abs(bounds[2][1] - bounds[3][1]));
    const uCount = Math.ceil(maxXSpan / resolution) + 1;
    const vCount = Math.ceil(maxYSpan / resolution) + 1;
    const vertexCount = (uCount - 1) * (vCount - 1) * 6;
    const indices = new Uint32Array(vertexCount);
    const texCoords = new Float32Array(uCount * vCount * 2);
    const positions = new Float64Array(uCount * vCount * 3);
    let vertex = 0;
    let index = 0;
    for (let u = 0; u < uCount; u++) {
      const ut = u / (uCount - 1);
      for (let v = 0; v < vCount; v++) {
        const vt = v / (vCount - 1);
        const p = interpolateQuad(bounds, ut, vt);
        positions[vertex * 3 + 0] = p[0];
        positions[vertex * 3 + 1] = p[1];
        positions[vertex * 3 + 2] = p[2] || 0;
        texCoords[vertex * 2 + 0] = ut;
        texCoords[vertex * 2 + 1] = 1 - vt;
        if (u > 0 && v > 0) {
          indices[index++] = vertex - vCount;
          indices[index++] = vertex - vCount - 1;
          indices[index++] = vertex - 1;
          indices[index++] = vertex - vCount;
          indices[index++] = vertex - 1;
          indices[index++] = vertex;
        }
        vertex++;
      }
    }
    return {
      vertexCount,
      positions,
      indices,
      texCoords
    };
  }
  function createQuad(bounds) {
    const positions = new Float64Array(12);
    for (let i = 0; i < bounds.length; i++) {
      positions[i * 3 + 0] = bounds[i][0];
      positions[i * 3 + 1] = bounds[i][1];
      positions[i * 3 + 2] = bounds[i][2] || 0;
    }
    return {
      vertexCount: 6,
      positions,
      indices: DEFAULT_INDICES,
      texCoords: DEFAULT_TEX_COORDS
    };
  }
  function interpolateQuad(quad, ut, vt) {
    return lerp2(lerp2(quad[0], quad[1], vt), lerp2(quad[3], quad[2], vt), ut);
  }

  // src/bitmap-layer/bitmap-layer-vertex.ts
  var bitmap_layer_vertex_default = `
#define SHADER_NAME bitmap-layer-vertex-shader

attribute vec2 texCoords;
attribute vec3 positions;
attribute vec3 positions64Low;

varying vec2 vTexCoord;
varying vec2 vTexPos;

uniform float coordinateConversion;

const vec3 pickingColor = vec3(1.0, 0.0, 0.0);

void main(void) {
  geometry.worldPosition = positions;
  geometry.uv = texCoords;
  geometry.pickingColor = pickingColor;

  gl_Position = project_position_to_clipspace(positions, positions64Low, vec3(0.0), geometry.position);
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);

  vTexCoord = texCoords;

  if (coordinateConversion < -0.5) {
    vTexPos = geometry.position.xy + project_uCommonOrigin.xy;
  } else if (coordinateConversion > 0.5) {
    vTexPos = geometry.worldPosition.xy;
  }

  vec4 color = vec4(0.0);
  DECKGL_FILTER_COLOR(color, geometry);
}
`;

  // src/bitmap-layer/bitmap-layer-fragment.ts
  var packUVsIntoRGB = `
vec3 packUVsIntoRGB(vec2 uv) {
  // Extract the top 8 bits. We want values to be truncated down so we can add a fraction
  vec2 uv8bit = floor(uv * 256.);

  // Calculate the normalized remainders of u and v parts that do not fit into 8 bits
  // Scale and clamp to 0-1 range
  vec2 uvFraction = fract(uv * 256.);
  vec2 uvFraction4bit = floor(uvFraction * 16.);

  // Remainder can be encoded in blue channel, encode as 4 bits for pixel coordinates
  float fractions = uvFraction4bit.x + uvFraction4bit.y * 16.;

  return vec3(uv8bit, fractions) / 255.;
}
`;
  var bitmap_layer_fragment_default = `
#define SHADER_NAME bitmap-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D bitmapTexture;

varying vec2 vTexCoord;
varying vec2 vTexPos;

uniform float desaturate;
uniform vec4 transparentColor;
uniform vec3 tintColor;
uniform float opacity;

uniform float coordinateConversion;
uniform vec4 bounds;

/* projection utils */
const float TILE_SIZE = 512.0;
const float PI = 3.1415926536;
const float WORLD_SCALE = TILE_SIZE / PI / 2.0;

// from degrees to Web Mercator
vec2 lnglat_to_mercator(vec2 lnglat) {
  float x = lnglat.x;
  float y = clamp(lnglat.y, -89.9, 89.9);
  return vec2(
    radians(x) + PI,
    PI + log(tan(PI * 0.25 + radians(y) * 0.5))
  ) * WORLD_SCALE;
}

// from Web Mercator to degrees
vec2 mercator_to_lnglat(vec2 xy) {
  xy /= WORLD_SCALE;
  return degrees(vec2(
    xy.x - PI,
    atan(exp(xy.y - PI)) * 2.0 - PI * 0.5
  ));
}
/* End projection utils */

// apply desaturation
vec3 color_desaturate(vec3 color) {
  float luminance = (color.r + color.g + color.b) * 0.333333333;
  return mix(color, vec3(luminance), desaturate);
}

// apply tint
vec3 color_tint(vec3 color) {
  return color * tintColor;
}

// blend with background color
vec4 apply_opacity(vec3 color, float alpha) {
  if (transparentColor.a == 0.0) {
    return vec4(color, alpha);
  }
  float blendedAlpha = alpha + transparentColor.a * (1.0 - alpha);
  float highLightRatio = alpha / blendedAlpha;
  vec3 blendedRGB = mix(transparentColor.rgb, color, highLightRatio);
  return vec4(blendedRGB, blendedAlpha);
}

vec2 getUV(vec2 pos) {
  return vec2(
    (pos.x - bounds[0]) / (bounds[2] - bounds[0]),
    (pos.y - bounds[3]) / (bounds[1] - bounds[3])
  );
}

${packUVsIntoRGB}

void main(void) {
  vec2 uv = vTexCoord;
  if (coordinateConversion < -0.5) {
    vec2 lnglat = mercator_to_lnglat(vTexPos);
    uv = getUV(lnglat);
  } else if (coordinateConversion > 0.5) {
    vec2 commonPos = lnglat_to_mercator(vTexPos);
    uv = getUV(commonPos);
  }
  vec4 bitmapColor = texture2D(bitmapTexture, uv);

  gl_FragColor = apply_opacity(color_tint(color_desaturate(bitmapColor.rgb)), bitmapColor.a * opacity);

  geometry.uv = uv;
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);

  if (picking_uActive && !picking_uAttribute) {
    // Since instance information is not used, we can use picking color for pixel index
    gl_FragColor.rgb = packUVsIntoRGB(uv);
  }
}
`;

  // src/bitmap-layer/bitmap-layer.ts
  var defaultProps2 = {
    image: {
      type: "image",
      value: null,
      async: true
    },
    bounds: {
      type: "array",
      value: [1, 0, 0, 1],
      compare: true
    },
    _imageCoordinateSystem: import_core5.COORDINATE_SYSTEM.DEFAULT,
    desaturate: {
      type: "number",
      min: 0,
      max: 1,
      value: 0
    },
    transparentColor: {
      type: "color",
      value: [0, 0, 0, 0]
    },
    tintColor: {
      type: "color",
      value: [255, 255, 255]
    },
    textureParameters: {
      type: "object",
      ignore: true
    }
  };
  var BitmapLayer = class extends import_core5.Layer {
    getShaders() {
      return super.getShaders({
        vs: bitmap_layer_vertex_default,
        fs: bitmap_layer_fragment_default,
        modules: [import_core5.project32, import_core5.picking]
      });
    }
    initializeState() {
      const attributeManager = this.getAttributeManager();
      attributeManager.remove(["instancePickingColors"]);
      const noAlloc = true;
      attributeManager.add({
        indices: {
          size: 1,
          isIndexed: true,
          update: (attribute) => attribute.value = this.state.mesh.indices,
          noAlloc
        },
        positions: {
          size: 3,
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          update: (attribute) => attribute.value = this.state.mesh.positions,
          noAlloc
        },
        texCoords: {
          size: 2,
          update: (attribute) => attribute.value = this.state.mesh.texCoords,
          noAlloc
        }
      });
    }
    updateState({
      props,
      oldProps,
      changeFlags
    }) {
      const attributeManager = this.getAttributeManager();
      if (changeFlags.extensionsChanged) {
        const {
          gl
        } = this.context;
        this.state.model?.delete();
        this.state.model = this._getModel(gl);
        attributeManager.invalidateAll();
      }
      if (props.bounds !== oldProps.bounds) {
        const oldMesh = this.state.mesh;
        const mesh = this._createMesh();
        this.state.model.setVertexCount(mesh.vertexCount);
        for (const key in mesh) {
          if (oldMesh && oldMesh[key] !== mesh[key]) {
            attributeManager.invalidate(key);
          }
        }
        this.setState({
          mesh,
          ...this._getCoordinateUniforms()
        });
      } else if (props._imageCoordinateSystem !== oldProps._imageCoordinateSystem) {
        this.setState(this._getCoordinateUniforms());
      }
    }
    getPickingInfo(params) {
      const {
        image
      } = this.props;
      const info = params.info;
      if (!info.color || !image) {
        info.bitmap = null;
        return info;
      }
      const {
        width,
        height
      } = image;
      info.index = 0;
      const uv = unpackUVsFromRGB(info.color);
      const pixel = [Math.floor(uv[0] * width), Math.floor(uv[1] * height)];
      info.bitmap = {
        size: {
          width,
          height
        },
        uv,
        pixel
      };
      return info;
    }
    disablePickingIndex() {
      this.setState({
        disablePicking: true
      });
    }
    restorePickingColors() {
      this.setState({
        disablePicking: false
      });
    }
    _updateAutoHighlight(info) {
      super._updateAutoHighlight({
        ...info,
        color: this.encodePickingColor(0)
      });
    }
    _createMesh() {
      const {
        bounds
      } = this.props;
      let normalizedBounds = bounds;
      if (isRectangularBounds(bounds)) {
        normalizedBounds = [[bounds[0], bounds[1]], [bounds[0], bounds[3]], [bounds[2], bounds[3]], [bounds[2], bounds[1]]];
      }
      return createMesh(normalizedBounds, this.context.viewport.resolution);
    }
    _getModel(gl) {
      if (!gl) {
        return null;
      }
      return new import_core6.Model(gl, {
        ...this.getShaders(),
        id: this.props.id,
        geometry: new import_core6.Geometry({
          drawMode: esm_default.TRIANGLES,
          vertexCount: 6
        }),
        isInstanced: false
      });
    }
    draw(opts) {
      const {
        uniforms,
        moduleParameters
      } = opts;
      const {
        model,
        coordinateConversion,
        bounds,
        disablePicking
      } = this.state;
      const {
        image,
        desaturate,
        transparentColor,
        tintColor
      } = this.props;
      if (moduleParameters.pickingActive && disablePicking) {
        return;
      }
      if (image && model) {
        model.setUniforms(uniforms).setUniforms({
          bitmapTexture: image,
          desaturate,
          transparentColor: transparentColor.map((x) => x / 255),
          tintColor: tintColor.slice(0, 3).map((x) => x / 255),
          coordinateConversion,
          bounds
        }).draw();
      }
    }
    _getCoordinateUniforms() {
      const {
        LNGLAT,
        CARTESIAN,
        DEFAULT
      } = import_core5.COORDINATE_SYSTEM;
      let {
        _imageCoordinateSystem: imageCoordinateSystem
      } = this.props;
      if (imageCoordinateSystem !== DEFAULT) {
        const {
          bounds
        } = this.props;
        if (!isRectangularBounds(bounds)) {
          throw new Error("_imageCoordinateSystem only supports rectangular bounds");
        }
        const defaultImageCoordinateSystem = this.context.viewport.resolution ? LNGLAT : CARTESIAN;
        imageCoordinateSystem = imageCoordinateSystem === LNGLAT ? LNGLAT : CARTESIAN;
        if (imageCoordinateSystem === LNGLAT && defaultImageCoordinateSystem === CARTESIAN) {
          return {
            coordinateConversion: -1,
            bounds
          };
        }
        if (imageCoordinateSystem === CARTESIAN && defaultImageCoordinateSystem === LNGLAT) {
          const bottomLeft = lngLatToWorld([bounds[0], bounds[1]]);
          const topRight = lngLatToWorld([bounds[2], bounds[3]]);
          return {
            coordinateConversion: 1,
            bounds: [bottomLeft[0], bottomLeft[1], topRight[0], topRight[1]]
          };
        }
      }
      return {
        coordinateConversion: 0,
        bounds: [0, 0, 0, 0]
      };
    }
  };
  __publicField(BitmapLayer, "layerName", "BitmapLayer");
  __publicField(BitmapLayer, "defaultProps", defaultProps2);
  function unpackUVsFromRGB(color) {
    const [u, v, fracUV] = color;
    const vFrac = (fracUV & 240) / 256;
    const uFrac = (fracUV & 15) / 16;
    return [(u + uFrac) / 256, (v + vFrac) / 256];
  }
  function isRectangularBounds(bounds) {
    return Number.isFinite(bounds[0]);
  }

  // src/icon-layer/icon-layer.ts
  var import_core10 = __toESM(require_core());
  var import_core11 = __toESM(require_core2());

  // src/icon-layer/icon-layer-vertex.glsl.ts
  var icon_layer_vertex_glsl_default = `#define SHADER_NAME icon-layer-vertex-shader

attribute vec2 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceSizes;
attribute float instanceAngles;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;
attribute vec4 instanceIconFrames;
attribute float instanceColorModes;
attribute vec2 instanceOffsets;
attribute vec2 instancePixelOffset;

uniform float sizeScale;
uniform vec2 iconsTextureDim;
uniform float sizeMinPixels;
uniform float sizeMaxPixels;
uniform bool billboard;
uniform int sizeUnits;

varying float vColorMode;
varying vec4 vColor;
varying vec2 vTextureCoords;
varying vec2 uv;

vec2 rotate_by_angle(vec2 vertex, float angle) {
  float angle_radian = angle * PI / 180.0;
  float cos_angle = cos(angle_radian);
  float sin_angle = sin(angle_radian);
  mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
  return rotationMatrix * vertex;
}

void main(void) {
  geometry.worldPosition = instancePositions;
  geometry.uv = positions;
  geometry.pickingColor = instancePickingColors;
  uv = positions;

  vec2 iconSize = instanceIconFrames.zw;
  // convert size in meters to pixels, then scaled and clamp
 
  // project meters to pixels and clamp to limits 
  float sizePixels = clamp(
    project_size_to_pixel(instanceSizes * sizeScale, sizeUnits), 
    sizeMinPixels, sizeMaxPixels
  );

  // scale icon height to match instanceSize
  float instanceScale = iconSize.y == 0.0 ? 0.0 : sizePixels / iconSize.y;

  // scale and rotate vertex in "pixel" value and convert back to fraction in clipspace
  vec2 pixelOffset = positions / 2.0 * iconSize + instanceOffsets;
  pixelOffset = rotate_by_angle(pixelOffset, instanceAngles) * instanceScale;
  pixelOffset += instancePixelOffset;
  pixelOffset.y *= -1.0;

  if (billboard)  {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
    vec3 offset = vec3(pixelOffset, 0.0);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);

  } else {
    vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);
    DECKGL_FILTER_SIZE(offset_common, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset_common, geometry.position); 
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  }

  vTextureCoords = mix(
    instanceIconFrames.xy,
    instanceIconFrames.xy + iconSize,
    (positions.xy + 1.0) / 2.0
  ) / iconsTextureDim;

  vColor = instanceColors;
  DECKGL_FILTER_COLOR(vColor, geometry);

  vColorMode = instanceColorModes;
}
`;

  // src/icon-layer/icon-layer-fragment.glsl.ts
  var icon_layer_fragment_glsl_default = `#define SHADER_NAME icon-layer-fragment-shader

precision highp float;

uniform float opacity;
uniform sampler2D iconsTexture;
uniform float alphaCutoff;

varying float vColorMode;
varying vec4 vColor;
varying vec2 vTextureCoords;
varying vec2 uv;

void main(void) {
  geometry.uv = uv;

  vec4 texColor = texture2D(iconsTexture, vTextureCoords);

  // if colorMode == 0, use pixel color from the texture
  // if colorMode == 1 or rendering picking buffer, use texture as transparency mask
  vec3 color = mix(texColor.rgb, vColor.rgb, vColorMode);
  // Take the global opacity and the alpha from vColor into account for the alpha component
  float a = texColor.a * opacity * vColor.a;

  if (a < alphaCutoff) {
    discard;
  }

  gl_FragColor = vec4(color, a);
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;

  // src/icon-layer/icon-manager.ts
  var import_core7 = __toESM(require_core2());
  var import_core8 = __toESM(require_core3());
  var import_core9 = __toESM(require_core());
  var DEFAULT_CANVAS_WIDTH = 1024;
  var DEFAULT_BUFFER = 4;
  var noop = () => {
  };
  var DEFAULT_TEXTURE_PARAMETERS = {
    [esm_default.TEXTURE_MIN_FILTER]: esm_default.LINEAR_MIPMAP_LINEAR,
    [esm_default.TEXTURE_MAG_FILTER]: esm_default.LINEAR,
    [esm_default.TEXTURE_WRAP_S]: esm_default.CLAMP_TO_EDGE,
    [esm_default.TEXTURE_WRAP_T]: esm_default.CLAMP_TO_EDGE
  };
  function nextPowOfTwo(number) {
    return Math.pow(2, Math.ceil(Math.log2(number)));
  }
  function resizeImage(ctx, imageData, maxWidth, maxHeight) {
    const resizeRatio = Math.min(maxWidth / imageData.width, maxHeight / imageData.height);
    const width = Math.floor(imageData.width * resizeRatio);
    const height = Math.floor(imageData.height * resizeRatio);
    if (resizeRatio === 1) {
      return {
        data: imageData,
        width,
        height
      };
    }
    ctx.canvas.height = height;
    ctx.canvas.width = width;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(imageData, 0, 0, imageData.width, imageData.height, 0, 0, width, height);
    return {
      data: ctx.canvas,
      width,
      height
    };
  }
  function getIconId(icon) {
    return icon && (icon.id || icon.url);
  }
  function resizeTexture(texture, width, height, parameters) {
    const oldWidth = texture.width;
    const oldHeight = texture.height;
    const newTexture = new import_core7.Texture2D(texture.gl, {
      width,
      height,
      parameters
    });
    (0, import_core7.copyToTexture)(texture, newTexture, {
      targetY: 0,
      width: oldWidth,
      height: oldHeight
    });
    texture.delete();
    return newTexture;
  }
  function buildRowMapping(mapping, columns, yOffset) {
    for (let i = 0; i < columns.length; i++) {
      const {
        icon,
        xOffset
      } = columns[i];
      const id = getIconId(icon);
      mapping[id] = {
        ...icon,
        x: xOffset,
        y: yOffset
      };
    }
  }
  function buildMapping({
    icons,
    buffer,
    mapping = {},
    xOffset = 0,
    yOffset = 0,
    rowHeight = 0,
    canvasWidth
  }) {
    let columns = [];
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i];
      const id = getIconId(icon);
      if (!mapping[id]) {
        const {
          height,
          width
        } = icon;
        if (xOffset + width + buffer > canvasWidth) {
          buildRowMapping(mapping, columns, yOffset);
          xOffset = 0;
          yOffset = rowHeight + yOffset + buffer;
          rowHeight = 0;
          columns = [];
        }
        columns.push({
          icon,
          xOffset
        });
        xOffset = xOffset + width + buffer;
        rowHeight = Math.max(rowHeight, height);
      }
    }
    if (columns.length > 0) {
      buildRowMapping(mapping, columns, yOffset);
    }
    return {
      mapping,
      rowHeight,
      xOffset,
      yOffset,
      canvasWidth,
      canvasHeight: nextPowOfTwo(rowHeight + yOffset + buffer)
    };
  }
  function getDiffIcons(data, getIcon, cachedIcons) {
    if (!data || !getIcon) {
      return null;
    }
    cachedIcons = cachedIcons || {};
    const icons = {};
    const {
      iterable,
      objectInfo
    } = (0, import_core9.createIterable)(data);
    for (const object of iterable) {
      objectInfo.index++;
      const icon = getIcon(object, objectInfo);
      const id = getIconId(icon);
      if (!icon) {
        throw new Error("Icon is missing.");
      }
      if (!icon.url) {
        throw new Error("Icon url is missing.");
      }
      if (!icons[id] && (!cachedIcons[id] || icon.url !== cachedIcons[id].url)) {
        icons[id] = {
          ...icon,
          source: object,
          sourceIndex: objectInfo.index
        };
      }
    }
    return icons;
  }
  var IconManager = class {
    _loadOptions = null;
    _texture = null;
    _externalTexture = null;
    _mapping = {};
    _textureParameters = null;
    _pendingCount = 0;
    _autoPacking = false;
    _xOffset = 0;
    _yOffset = 0;
    _rowHeight = 0;
    _buffer = DEFAULT_BUFFER;
    _canvasWidth = DEFAULT_CANVAS_WIDTH;
    _canvasHeight = 0;
    _canvas = null;
    constructor(gl, {
      onUpdate = noop,
      onError = noop
    }) {
      this.gl = gl;
      this.onUpdate = onUpdate;
      this.onError = onError;
    }
    finalize() {
      this._texture?.delete();
    }
    getTexture() {
      return this._texture || this._externalTexture;
    }
    getIconMapping(icon) {
      const id = this._autoPacking ? getIconId(icon) : icon;
      return this._mapping[id] || {};
    }
    setProps({
      loadOptions,
      autoPacking,
      iconAtlas,
      iconMapping,
      textureParameters
    }) {
      if (loadOptions) {
        this._loadOptions = loadOptions;
      }
      if (autoPacking !== void 0) {
        this._autoPacking = autoPacking;
      }
      if (iconMapping) {
        this._mapping = iconMapping;
      }
      if (iconAtlas) {
        this._texture?.delete();
        this._texture = null;
        this._externalTexture = iconAtlas;
      }
      if (textureParameters) {
        this._textureParameters = textureParameters;
      }
    }
    get isLoaded() {
      return this._pendingCount === 0;
    }
    packIcons(data, getIcon) {
      if (!this._autoPacking || typeof document === "undefined") {
        return;
      }
      const icons = Object.values(getDiffIcons(data, getIcon, this._mapping) || {});
      if (icons.length > 0) {
        const {
          mapping,
          xOffset,
          yOffset,
          rowHeight,
          canvasHeight
        } = buildMapping({
          icons,
          buffer: this._buffer,
          canvasWidth: this._canvasWidth,
          mapping: this._mapping,
          rowHeight: this._rowHeight,
          xOffset: this._xOffset,
          yOffset: this._yOffset
        });
        this._rowHeight = rowHeight;
        this._mapping = mapping;
        this._xOffset = xOffset;
        this._yOffset = yOffset;
        this._canvasHeight = canvasHeight;
        if (!this._texture) {
          this._texture = new import_core7.Texture2D(this.gl, {
            width: this._canvasWidth,
            height: this._canvasHeight,
            parameters: this._textureParameters || DEFAULT_TEXTURE_PARAMETERS
          });
        }
        if (this._texture.height !== this._canvasHeight) {
          this._texture = resizeTexture(this._texture, this._canvasWidth, this._canvasHeight, this._textureParameters || DEFAULT_TEXTURE_PARAMETERS);
        }
        this.onUpdate();
        this._canvas = this._canvas || document.createElement("canvas");
        this._loadIcons(icons);
      }
    }
    _loadIcons(icons) {
      const ctx = this._canvas.getContext("2d", {
        willReadFrequently: true
      });
      for (const icon of icons) {
        this._pendingCount++;
        (0, import_core8.load)(icon.url, this._loadOptions).then((imageData) => {
          const id = getIconId(icon);
          const iconDef = this._mapping[id];
          const {
            x,
            y,
            width: maxWidth,
            height: maxHeight
          } = iconDef;
          const {
            data,
            width,
            height
          } = resizeImage(ctx, imageData, maxWidth, maxHeight);
          this._texture.setSubImageData({
            data,
            x: x + (maxWidth - width) / 2,
            y: y + (maxHeight - height) / 2,
            width,
            height
          });
          iconDef.width = width;
          iconDef.height = height;
          this._texture.generateMipmap();
          this.onUpdate();
        }).catch((error) => {
          this.onError({
            url: icon.url,
            source: icon.source,
            sourceIndex: icon.sourceIndex,
            loadOptions: this._loadOptions,
            error
          });
        }).finally(() => {
          this._pendingCount--;
        });
      }
    }
  };

  // src/icon-layer/icon-layer.ts
  var DEFAULT_COLOR2 = [0, 0, 0, 255];
  var defaultProps3 = {
    iconAtlas: {
      type: "image",
      value: null,
      async: true
    },
    iconMapping: {
      type: "object",
      value: {},
      async: true
    },
    sizeScale: {
      type: "number",
      value: 1,
      min: 0
    },
    billboard: true,
    sizeUnits: "pixels",
    sizeMinPixels: {
      type: "number",
      min: 0,
      value: 0
    },
    sizeMaxPixels: {
      type: "number",
      min: 0,
      value: Number.MAX_SAFE_INTEGER
    },
    alphaCutoff: {
      type: "number",
      value: 0.05,
      min: 0,
      max: 1
    },
    getPosition: {
      type: "accessor",
      value: (x) => x.position
    },
    getIcon: {
      type: "accessor",
      value: (x) => x.icon
    },
    getColor: {
      type: "accessor",
      value: DEFAULT_COLOR2
    },
    getSize: {
      type: "accessor",
      value: 1
    },
    getAngle: {
      type: "accessor",
      value: 0
    },
    getPixelOffset: {
      type: "accessor",
      value: [0, 0]
    },
    onIconError: {
      type: "function",
      value: null,
      optional: true
    },
    textureParameters: {
      type: "object",
      ignore: true
    }
  };
  var IconLayer = class extends import_core10.Layer {
    getShaders() {
      return super.getShaders({
        vs: icon_layer_vertex_glsl_default,
        fs: icon_layer_fragment_glsl_default,
        modules: [import_core10.project32, import_core10.picking]
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
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          transition: true,
          accessor: "getPosition"
        },
        instanceSizes: {
          size: 1,
          transition: true,
          accessor: "getSize",
          defaultValue: 1
        },
        instanceOffsets: {
          size: 2,
          accessor: "getIcon",
          transform: this.getInstanceOffset
        },
        instanceIconFrames: {
          size: 4,
          accessor: "getIcon",
          transform: this.getInstanceIconFrame
        },
        instanceColorModes: {
          size: 1,
          type: esm_default.UNSIGNED_BYTE,
          accessor: "getIcon",
          transform: this.getInstanceColorMode
        },
        instanceColors: {
          size: this.props.colorFormat.length,
          type: esm_default.UNSIGNED_BYTE,
          normalized: true,
          transition: true,
          accessor: "getColor",
          defaultValue: DEFAULT_COLOR2
        },
        instanceAngles: {
          size: 1,
          transition: true,
          accessor: "getAngle"
        },
        instancePixelOffset: {
          size: 2,
          transition: true,
          accessor: "getPixelOffset"
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
      const prePacked = iconAtlas || this.internalState.isAsyncPropLoading("iconAtlas");
      iconManager.setProps({
        loadOptions: props.loadOptions,
        autoPacking: !prePacked,
        iconAtlas,
        iconMapping: prePacked ? iconMapping : null,
        textureParameters
      });
      if (prePacked) {
        if (oldProps.iconMapping !== props.iconMapping) {
          attributeManager.invalidate("getIcon");
        }
      } else if (changeFlags.dataChanged || changeFlags.updateTriggersChanged && (changeFlags.updateTriggersChanged.all || changeFlags.updateTriggersChanged.getIcon)) {
        iconManager.packIcons(data, getIcon);
      }
      if (changeFlags.extensionsChanged) {
        const {
          gl
        } = this.context;
        this.state.model?.delete();
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
          sizeUnits: import_core10.UNIT[sizeUnits],
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
      return new import_core11.Model(gl, {
        ...this.getShaders(),
        id: this.props.id,
        geometry: new import_core11.Geometry({
          drawMode: esm_default.TRIANGLE_FAN,
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
      const onIconError = this.getCurrentLayer()?.props.onIconError;
      if (onIconError) {
        onIconError(evt);
      } else {
        import_core10.log.error(evt.error.message)();
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
  };
  __publicField(IconLayer, "defaultProps", defaultProps3);
  __publicField(IconLayer, "layerName", "IconLayer");

  // src/line-layer/line-layer.ts
  var import_core12 = __toESM(require_core());
  var import_core13 = __toESM(require_core2());

  // src/line-layer/line-layer-vertex.glsl.ts
  var line_layer_vertex_glsl_default = `#define SHADER_NAME line-layer-vertex-shader

attribute vec3 positions;
attribute vec3 instanceSourcePositions;
attribute vec3 instanceTargetPositions;
attribute vec3 instanceSourcePositions64Low;
attribute vec3 instanceTargetPositions64Low;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;
attribute float instanceWidths;

uniform float opacity;
uniform float widthScale;
uniform float widthMinPixels;
uniform float widthMaxPixels;
uniform float useShortestPath;
uniform int widthUnits;

varying vec4 vColor;
varying vec2 uv;

// offset vector by strokeWidth pixels
// offset_direction is -1 (left) or 1 (right)
vec2 getExtrusionOffset(vec2 line_clipspace, float offset_direction, float width) {
  // normalized direction of the line
  vec2 dir_screenspace = normalize(line_clipspace * project_uViewportSize);
  // rotate by 90 degrees
  dir_screenspace = vec2(-dir_screenspace.y, dir_screenspace.x);

  return dir_screenspace * offset_direction * width / 2.0;
}

vec3 splitLine(vec3 a, vec3 b, float x) {
  float t = (x - a.x) / (b.x - a.x);
  return vec3(x, mix(a.yz, b.yz, t));
}

void main(void) {
  geometry.worldPosition = instanceSourcePositions;
  geometry.worldPositionAlt = instanceTargetPositions;

  vec3 source_world = instanceSourcePositions;
  vec3 target_world = instanceTargetPositions;
  vec3 source_world_64low = instanceSourcePositions64Low;
  vec3 target_world_64low = instanceTargetPositions64Low;

  if (useShortestPath > 0.5 || useShortestPath < -0.5) {
    source_world.x = mod(source_world.x + 180., 360.0) - 180.;
    target_world.x = mod(target_world.x + 180., 360.0) - 180.;
    float deltaLng = target_world.x - source_world.x;

    if (deltaLng * useShortestPath > 180.) {
      source_world.x += 360. * useShortestPath;
      source_world = splitLine(source_world, target_world, 180. * useShortestPath);
      source_world_64low = vec3(0.0);
    } else if (deltaLng * useShortestPath < -180.) {
      target_world.x += 360. * useShortestPath;
      target_world = splitLine(source_world, target_world, 180. * useShortestPath);
      target_world_64low = vec3(0.0);
    } else if (useShortestPath < 0.) {
      // Line is not split, abort
      gl_Position = vec4(0.);
      return;
    }
  }

  // Position
  vec4 source_commonspace;
  vec4 target_commonspace;
  vec4 source = project_position_to_clipspace(source_world, source_world_64low, vec3(0.), source_commonspace);
  vec4 target = project_position_to_clipspace(target_world, target_world_64low, vec3(0.), target_commonspace);
  
  // linear interpolation of source & target to pick right coord
  float segmentIndex = positions.x;
  vec4 p = mix(source, target, segmentIndex);
  geometry.position = mix(source_commonspace, target_commonspace, segmentIndex);
  uv = positions.xy;
  geometry.uv = uv;
  geometry.pickingColor = instancePickingColors;

  // Multiply out width and clamp to limits
  float widthPixels = clamp(
    project_size_to_pixel(instanceWidths * widthScale, widthUnits),
    widthMinPixels, widthMaxPixels
  );

  // extrude
  vec3 offset = vec3(
    getExtrusionOffset(target.xy - source.xy, positions.y, widthPixels),
    0.0);
  DECKGL_FILTER_SIZE(offset, geometry);
  DECKGL_FILTER_GL_POSITION(p, geometry);
  gl_Position = p + vec4(project_pixel_size_to_clipspace(offset.xy), 0.0, 0.0);

  // Color
  vColor = vec4(instanceColors.rgb, instanceColors.a * opacity);
  DECKGL_FILTER_COLOR(vColor, geometry);
}
`;

  // src/line-layer/line-layer-fragment.glsl.ts
  var line_layer_fragment_glsl_default = `#define SHADER_NAME line-layer-fragment-shader

precision highp float;

varying vec4 vColor;
varying vec2 uv;

void main(void) {
  geometry.uv = uv;

  gl_FragColor = vColor;

  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;

  // src/line-layer/line-layer.ts
  var DEFAULT_COLOR3 = [0, 0, 0, 255];
  var defaultProps4 = {
    getSourcePosition: {
      type: "accessor",
      value: (x) => x.sourcePosition
    },
    getTargetPosition: {
      type: "accessor",
      value: (x) => x.targetPosition
    },
    getColor: {
      type: "accessor",
      value: DEFAULT_COLOR3
    },
    getWidth: {
      type: "accessor",
      value: 1
    },
    widthUnits: "pixels",
    widthScale: {
      type: "number",
      value: 1,
      min: 0
    },
    widthMinPixels: {
      type: "number",
      value: 0,
      min: 0
    },
    widthMaxPixels: {
      type: "number",
      value: Number.MAX_SAFE_INTEGER,
      min: 0
    }
  };
  var LineLayer = class extends import_core12.Layer {
    getBounds() {
      return this.getAttributeManager()?.getBounds(["instanceSourcePositions", "instanceTargetPositions"]);
    }
    getShaders() {
      return super.getShaders({
        vs: line_layer_vertex_glsl_default,
        fs: line_layer_fragment_glsl_default,
        modules: [import_core12.project32, import_core12.picking]
      });
    }
    get wrapLongitude() {
      return false;
    }
    initializeState() {
      const attributeManager = this.getAttributeManager();
      attributeManager.addInstanced({
        instanceSourcePositions: {
          size: 3,
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          transition: true,
          accessor: "getSourcePosition"
        },
        instanceTargetPositions: {
          size: 3,
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          transition: true,
          accessor: "getTargetPosition"
        },
        instanceColors: {
          size: this.props.colorFormat.length,
          type: esm_default.UNSIGNED_BYTE,
          normalized: true,
          transition: true,
          accessor: "getColor",
          defaultValue: [0, 0, 0, 255]
        },
        instanceWidths: {
          size: 1,
          transition: true,
          accessor: "getWidth",
          defaultValue: 1
        }
      });
    }
    updateState(params) {
      super.updateState(params);
      if (params.changeFlags.extensionsChanged) {
        const {
          gl
        } = this.context;
        this.state.model?.delete();
        this.state.model = this._getModel(gl);
        this.getAttributeManager().invalidateAll();
      }
    }
    draw({
      uniforms
    }) {
      const {
        widthUnits,
        widthScale,
        widthMinPixels,
        widthMaxPixels,
        wrapLongitude
      } = this.props;
      this.state.model.setUniforms(uniforms).setUniforms({
        widthUnits: import_core12.UNIT[widthUnits],
        widthScale,
        widthMinPixels,
        widthMaxPixels,
        useShortestPath: wrapLongitude ? 1 : 0
      }).draw();
      if (wrapLongitude) {
        this.state.model.setUniforms({
          useShortestPath: -1
        }).draw();
      }
    }
    _getModel(gl) {
      const positions = [0, -1, 0, 0, 1, 0, 1, -1, 0, 1, 1, 0];
      return new import_core13.Model(gl, {
        ...this.getShaders(),
        id: this.props.id,
        geometry: new import_core13.Geometry({
          drawMode: esm_default.TRIANGLE_STRIP,
          attributes: {
            positions: new Float32Array(positions)
          }
        }),
        isInstanced: true
      });
    }
  };
  __publicField(LineLayer, "layerName", "LineLayer");
  __publicField(LineLayer, "defaultProps", defaultProps4);

  // src/point-cloud-layer/point-cloud-layer.ts
  var import_core14 = __toESM(require_core());
  var import_core15 = __toESM(require_core2());

  // src/point-cloud-layer/point-cloud-layer-vertex.glsl.ts
  var point_cloud_layer_vertex_glsl_default = `#define SHADER_NAME point-cloud-layer-vertex-shader

attribute vec3 positions;
attribute vec3 instanceNormals;
attribute vec4 instanceColors;
attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute vec3 instancePickingColors;

uniform float opacity;
uniform float radiusPixels;
uniform int sizeUnits;

varying vec4 vColor;
varying vec2 unitPosition;

void main(void) {
  geometry.worldPosition = instancePositions;
  geometry.normal = project_normal(instanceNormals);

  // position on the containing square in [-1, 1] space
  unitPosition = positions.xy;
  geometry.uv = unitPosition;
  geometry.pickingColor = instancePickingColors;

  // Find the center of the point and add the current vertex
  vec3 offset = vec3(positions.xy * project_size_to_pixel(radiusPixels, sizeUnits), 0.0);
  DECKGL_FILTER_SIZE(offset, geometry);

  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.), geometry.position);
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);

  // Apply lighting
  vec3 lightColor = lighting_getLightColor(instanceColors.rgb, project_uCameraPosition, geometry.position.xyz, geometry.normal);

  // Apply opacity to instance color, or return instance picking color
  vColor = vec4(lightColor, instanceColors.a * opacity);
  DECKGL_FILTER_COLOR(vColor, geometry);
}
`;

  // src/point-cloud-layer/point-cloud-layer-fragment.glsl.ts
  var point_cloud_layer_fragment_glsl_default = `#define SHADER_NAME point-cloud-layer-fragment-shader

precision highp float;

varying vec4 vColor;
varying vec2 unitPosition;

void main(void) {
  geometry.uv = unitPosition;

  float distToCenter = length(unitPosition);

  if (distToCenter > 1.0) {
    discard;
  }

  gl_FragColor = vColor;
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;

  // src/point-cloud-layer/point-cloud-layer.ts
  var DEFAULT_COLOR4 = [0, 0, 0, 255];
  var DEFAULT_NORMAL = [0, 0, 1];
  var defaultProps5 = {
    sizeUnits: "pixels",
    pointSize: {
      type: "number",
      min: 0,
      value: 10
    },
    getPosition: {
      type: "accessor",
      value: (x) => x.position
    },
    getNormal: {
      type: "accessor",
      value: DEFAULT_NORMAL
    },
    getColor: {
      type: "accessor",
      value: DEFAULT_COLOR4
    },
    material: true,
    radiusPixels: {
      deprecatedFor: "pointSize"
    }
  };
  function normalizeData(data) {
    const {
      header,
      attributes
    } = data;
    if (!header || !attributes) {
      return;
    }
    data.length = header.vertexCount;
    if (attributes.POSITION) {
      attributes.instancePositions = attributes.POSITION;
    }
    if (attributes.NORMAL) {
      attributes.instanceNormals = attributes.NORMAL;
    }
    if (attributes.COLOR_0) {
      attributes.instanceColors = attributes.COLOR_0;
    }
  }
  var PointCloudLayer = class extends import_core14.Layer {
    getShaders() {
      return super.getShaders({
        vs: point_cloud_layer_vertex_glsl_default,
        fs: point_cloud_layer_fragment_glsl_default,
        modules: [import_core14.project32, import_core14.gouraudLighting, import_core14.picking]
      });
    }
    initializeState() {
      this.getAttributeManager().addInstanced({
        instancePositions: {
          size: 3,
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          transition: true,
          accessor: "getPosition"
        },
        instanceNormals: {
          size: 3,
          transition: true,
          accessor: "getNormal",
          defaultValue: DEFAULT_NORMAL
        },
        instanceColors: {
          size: this.props.colorFormat.length,
          type: esm_default.UNSIGNED_BYTE,
          normalized: true,
          transition: true,
          accessor: "getColor",
          defaultValue: DEFAULT_COLOR4
        }
      });
    }
    updateState(params) {
      const {
        changeFlags,
        props
      } = params;
      super.updateState(params);
      if (changeFlags.extensionsChanged) {
        const {
          gl
        } = this.context;
        this.state.model?.delete();
        this.state.model = this._getModel(gl);
        this.getAttributeManager().invalidateAll();
      }
      if (changeFlags.dataChanged) {
        normalizeData(props.data);
      }
    }
    draw({
      uniforms
    }) {
      const {
        pointSize,
        sizeUnits
      } = this.props;
      this.state.model.setUniforms(uniforms).setUniforms({
        sizeUnits: import_core14.UNIT[sizeUnits],
        radiusPixels: pointSize
      }).draw();
    }
    _getModel(gl) {
      const positions = [];
      for (let i = 0; i < 3; i++) {
        const angle = i / 3 * Math.PI * 2;
        positions.push(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
      }
      return new import_core15.Model(gl, {
        ...this.getShaders(),
        id: this.props.id,
        geometry: new import_core15.Geometry({
          drawMode: esm_default.TRIANGLES,
          attributes: {
            positions: new Float32Array(positions)
          }
        }),
        isInstanced: true
      });
    }
  };
  __publicField(PointCloudLayer, "layerName", "PointCloudLayer");
  __publicField(PointCloudLayer, "defaultProps", defaultProps5);

  // src/scatterplot-layer/scatterplot-layer.ts
  var import_core16 = __toESM(require_core());
  var import_core17 = __toESM(require_core2());

  // src/scatterplot-layer/scatterplot-layer-vertex.glsl.ts
  var scatterplot_layer_vertex_glsl_default = `#define SHADER_NAME scatterplot-layer-vertex-shader

attribute vec3 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceRadius;
attribute float instanceLineWidths;
attribute vec4 instanceFillColors;
attribute vec4 instanceLineColors;
attribute vec3 instancePickingColors;

uniform float opacity;
uniform float radiusScale;
uniform float radiusMinPixels;
uniform float radiusMaxPixels;
uniform float lineWidthScale;
uniform float lineWidthMinPixels;
uniform float lineWidthMaxPixels;
uniform float stroked;
uniform bool filled;
uniform bool antialiasing;
uniform bool billboard;
uniform int radiusUnits;
uniform int lineWidthUnits;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float outerRadiusPixels;


void main(void) {
  geometry.worldPosition = instancePositions;

  // Multiply out radius and clamp to limits
  outerRadiusPixels = clamp(
    project_size_to_pixel(radiusScale * instanceRadius, radiusUnits),
    radiusMinPixels, radiusMaxPixels
  );
  
  // Multiply out line width and clamp to limits
  float lineWidthPixels = clamp(
    project_size_to_pixel(lineWidthScale * instanceLineWidths, lineWidthUnits),
    lineWidthMinPixels, lineWidthMaxPixels
  );

  // outer radius needs to offset by half stroke width
  outerRadiusPixels += stroked * lineWidthPixels / 2.0;

  // Expand geometry to accomodate edge smoothing
  float edgePadding = antialiasing ? (outerRadiusPixels + SMOOTH_EDGE_RADIUS) / outerRadiusPixels : 1.0;

  // position on the containing square in [-1, 1] space
  unitPosition = edgePadding * positions.xy;
  geometry.uv = unitPosition;
  geometry.pickingColor = instancePickingColors;

  innerUnitRadius = 1.0 - stroked * lineWidthPixels / outerRadiusPixels;
  
  if (billboard) {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
    vec3 offset = edgePadding * positions * outerRadiusPixels;
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
  } else {
    vec3 offset = edgePadding * positions * project_pixel_size(outerRadiusPixels);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset, geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  }

  // Apply opacity to instance color, or return instance picking color
  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);
  DECKGL_FILTER_COLOR(vFillColor, geometry);
  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity);
  DECKGL_FILTER_COLOR(vLineColor, geometry);
}
`;

  // src/scatterplot-layer/scatterplot-layer-fragment.glsl.ts
  var scatterplot_layer_fragment_glsl_default = `#define SHADER_NAME scatterplot-layer-fragment-shader

precision highp float;

uniform bool filled;
uniform float stroked;
uniform bool antialiasing;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float outerRadiusPixels;

void main(void) {
  geometry.uv = unitPosition;

  float distToCenter = length(unitPosition) * outerRadiusPixels;
  float inCircle = antialiasing ? 
    smoothedge(distToCenter, outerRadiusPixels) : 
    step(distToCenter, outerRadiusPixels);

  if (inCircle == 0.0) {
    discard;
  }

  if (stroked > 0.5) {
    float isLine = antialiasing ? 
      smoothedge(innerUnitRadius * outerRadiusPixels, distToCenter) :
      step(innerUnitRadius * outerRadiusPixels, distToCenter);

    if (filled) {
      gl_FragColor = mix(vFillColor, vLineColor, isLine);
    } else {
      if (isLine == 0.0) {
        discard;
      }
      gl_FragColor = vec4(vLineColor.rgb, vLineColor.a * isLine);
    }
  } else if (filled) {
    gl_FragColor = vFillColor;
  } else {
    discard;
  }

  gl_FragColor.a *= inCircle;
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;

  // src/scatterplot-layer/scatterplot-layer.ts
  var DEFAULT_COLOR5 = [0, 0, 0, 255];
  var defaultProps6 = {
    radiusUnits: "meters",
    radiusScale: {
      type: "number",
      min: 0,
      value: 1
    },
    radiusMinPixels: {
      type: "number",
      min: 0,
      value: 0
    },
    radiusMaxPixels: {
      type: "number",
      min: 0,
      value: Number.MAX_SAFE_INTEGER
    },
    lineWidthUnits: "meters",
    lineWidthScale: {
      type: "number",
      min: 0,
      value: 1
    },
    lineWidthMinPixels: {
      type: "number",
      min: 0,
      value: 0
    },
    lineWidthMaxPixels: {
      type: "number",
      min: 0,
      value: Number.MAX_SAFE_INTEGER
    },
    stroked: false,
    filled: true,
    billboard: false,
    antialiasing: true,
    getPosition: {
      type: "accessor",
      value: (x) => x.position
    },
    getRadius: {
      type: "accessor",
      value: 1
    },
    getFillColor: {
      type: "accessor",
      value: DEFAULT_COLOR5
    },
    getLineColor: {
      type: "accessor",
      value: DEFAULT_COLOR5
    },
    getLineWidth: {
      type: "accessor",
      value: 1
    },
    strokeWidth: {
      deprecatedFor: "getLineWidth"
    },
    outline: {
      deprecatedFor: "stroked"
    },
    getColor: {
      deprecatedFor: ["getFillColor", "getLineColor"]
    }
  };
  var ScatterplotLayer = class extends import_core16.Layer {
    getShaders() {
      return super.getShaders({
        vs: scatterplot_layer_vertex_glsl_default,
        fs: scatterplot_layer_fragment_glsl_default,
        modules: [import_core16.project32, import_core16.picking]
      });
    }
    initializeState() {
      this.getAttributeManager().addInstanced({
        instancePositions: {
          size: 3,
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          transition: true,
          accessor: "getPosition"
        },
        instanceRadius: {
          size: 1,
          transition: true,
          accessor: "getRadius",
          defaultValue: 1
        },
        instanceFillColors: {
          size: this.props.colorFormat.length,
          transition: true,
          normalized: true,
          type: esm_default.UNSIGNED_BYTE,
          accessor: "getFillColor",
          defaultValue: [0, 0, 0, 255]
        },
        instanceLineColors: {
          size: this.props.colorFormat.length,
          transition: true,
          normalized: true,
          type: esm_default.UNSIGNED_BYTE,
          accessor: "getLineColor",
          defaultValue: [0, 0, 0, 255]
        },
        instanceLineWidths: {
          size: 1,
          transition: true,
          accessor: "getLineWidth",
          defaultValue: 1
        }
      });
    }
    updateState(params) {
      super.updateState(params);
      if (params.changeFlags.extensionsChanged) {
        const {
          gl
        } = this.context;
        this.state.model?.delete();
        this.state.model = this._getModel(gl);
        this.getAttributeManager().invalidateAll();
      }
    }
    draw({
      uniforms
    }) {
      const {
        radiusUnits,
        radiusScale,
        radiusMinPixels,
        radiusMaxPixels,
        stroked,
        filled,
        billboard,
        antialiasing,
        lineWidthUnits,
        lineWidthScale,
        lineWidthMinPixels,
        lineWidthMaxPixels
      } = this.props;
      this.state.model.setUniforms(uniforms).setUniforms({
        stroked: stroked ? 1 : 0,
        filled,
        billboard,
        antialiasing,
        radiusUnits: import_core16.UNIT[radiusUnits],
        radiusScale,
        radiusMinPixels,
        radiusMaxPixels,
        lineWidthUnits: import_core16.UNIT[lineWidthUnits],
        lineWidthScale,
        lineWidthMinPixels,
        lineWidthMaxPixels
      }).draw();
    }
    _getModel(gl) {
      const positions = [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0];
      return new import_core17.Model(gl, {
        ...this.getShaders(),
        id: this.props.id,
        geometry: new import_core17.Geometry({
          drawMode: esm_default.TRIANGLE_FAN,
          vertexCount: 4,
          attributes: {
            positions: {
              size: 3,
              value: new Float32Array(positions)
            }
          }
        }),
        isInstanced: true
      });
    }
  };
  __publicField(ScatterplotLayer, "defaultProps", defaultProps6);
  __publicField(ScatterplotLayer, "layerName", "ScatterplotLayer");

  // src/column-layer/column-layer.ts
  var import_core20 = __toESM(require_core());
  var import_core21 = __toESM(require_core2());

  // src/column-layer/column-geometry.ts
  var import_core18 = __toESM(require_core());
  var import_core19 = __toESM(require_core2());

  // ../../node_modules/@math.gl/polygon/dist/esm/polygon-utils.js
  var WINDING = {
    CLOCKWISE: 1,
    COUNTER_CLOCKWISE: -1
  };
  function modifyPolygonWindingDirection(points, direction, options = {}) {
    const windingDirection = getPolygonWindingDirection(points, options);
    if (windingDirection !== direction) {
      reversePolygon(points, options);
      return true;
    }
    return false;
  }
  function getPolygonWindingDirection(points, options = {}) {
    return Math.sign(getPolygonSignedArea(points, options));
  }
  function getPolygonSignedArea(points, options = {}) {
    const {
      start = 0,
      end = points.length
    } = options;
    const dim = options.size || 2;
    let area = 0;
    for (let i = start, j = end - dim; i < end; i += dim) {
      area += (points[i] - points[j]) * (points[i + 1] + points[j + 1]);
      j = i;
    }
    return area / 2;
  }
  function reversePolygon(points, options) {
    const {
      start = 0,
      end = points.length,
      size = 2
    } = options;
    const numPoints = (end - start) / size;
    const numSwaps = Math.floor(numPoints / 2);
    for (let i = 0; i < numSwaps; ++i) {
      const b1 = start + i * size;
      const b2 = start + (numPoints - 1 - i) * size;
      for (let j = 0; j < size; ++j) {
        const tmp = points[b1 + j];
        points[b1 + j] = points[b2 + j];
        points[b2 + j] = tmp;
      }
    }
  }

  // ../../node_modules/@math.gl/polygon/dist/esm/utils.js
  function push(target, source) {
    const size = source.length;
    const startIndex = target.length;
    if (startIndex > 0) {
      let isDuplicate = true;
      for (let i = 0; i < size; i++) {
        if (target[startIndex - size + i] !== source[i]) {
          isDuplicate = false;
          break;
        }
      }
      if (isDuplicate) {
        return false;
      }
    }
    for (let i = 0; i < size; i++) {
      target[startIndex + i] = source[i];
    }
    return true;
  }
  function copy(target, source) {
    const size = source.length;
    for (let i = 0; i < size; i++) {
      target[i] = source[i];
    }
  }
  function getPointAtIndex(positions, index, size, offset, out = []) {
    const startI = offset + index * size;
    for (let i = 0; i < size; i++) {
      out[i] = positions[startI + i];
    }
    return out;
  }

  // ../../node_modules/@math.gl/polygon/dist/esm/lineclip.js
  function intersect(a, b, edge, bbox, out = []) {
    let t;
    let snap;
    if (edge & 8) {
      t = (bbox[3] - a[1]) / (b[1] - a[1]);
      snap = 3;
    } else if (edge & 4) {
      t = (bbox[1] - a[1]) / (b[1] - a[1]);
      snap = 1;
    } else if (edge & 2) {
      t = (bbox[2] - a[0]) / (b[0] - a[0]);
      snap = 2;
    } else if (edge & 1) {
      t = (bbox[0] - a[0]) / (b[0] - a[0]);
      snap = 0;
    } else {
      return null;
    }
    for (let i = 0; i < a.length; i++) {
      out[i] = (snap & 1) === i ? bbox[snap] : t * (b[i] - a[i]) + a[i];
    }
    return out;
  }
  function bitCode(p, bbox) {
    let code = 0;
    if (p[0] < bbox[0])
      code |= 1;
    else if (p[0] > bbox[2])
      code |= 2;
    if (p[1] < bbox[1])
      code |= 4;
    else if (p[1] > bbox[3])
      code |= 8;
    return code;
  }

  // ../../node_modules/@math.gl/polygon/dist/esm/cut-by-grid.js
  function cutPolylineByGrid(positions, options) {
    const {
      size = 2,
      broken = false,
      gridResolution = 10,
      gridOffset = [0, 0],
      startIndex = 0,
      endIndex = positions.length
    } = options || {};
    const numPoints = (endIndex - startIndex) / size;
    let part = [];
    const result = [part];
    const a = getPointAtIndex(positions, 0, size, startIndex);
    let b;
    let codeB;
    const cell = getGridCell(a, gridResolution, gridOffset, []);
    const scratchPoint = [];
    push(part, a);
    for (let i = 1; i < numPoints; i++) {
      b = getPointAtIndex(positions, i, size, startIndex, b);
      codeB = bitCode(b, cell);
      while (codeB) {
        intersect(a, b, codeB, cell, scratchPoint);
        const codeAlt = bitCode(scratchPoint, cell);
        if (codeAlt) {
          intersect(a, scratchPoint, codeAlt, cell, scratchPoint);
          codeB = codeAlt;
        }
        push(part, scratchPoint);
        copy(a, scratchPoint);
        moveToNeighborCell(cell, gridResolution, codeB);
        if (broken && part.length > size) {
          part = [];
          result.push(part);
          push(part, a);
        }
        codeB = bitCode(b, cell);
      }
      push(part, b);
      copy(a, b);
    }
    return broken ? result : result[0];
  }
  var TYPE_INSIDE = 0;
  var TYPE_BORDER = 1;
  function concatInPlace(arr1, arr2) {
    for (let i = 0; i < arr2.length; i++) {
      arr1.push(arr2[i]);
    }
    return arr1;
  }
  function cutPolygonByGrid(positions, holeIndices = null, options) {
    if (!positions.length) {
      return [];
    }
    const {
      size = 2,
      gridResolution = 10,
      gridOffset = [0, 0],
      edgeTypes = false
    } = options || {};
    const result = [];
    const queue = [{
      pos: positions,
      types: edgeTypes ? new Array(positions.length / size).fill(TYPE_BORDER) : null,
      holes: holeIndices || []
    }];
    const bbox = [[], []];
    let cell = [];
    while (queue.length) {
      const {
        pos,
        types,
        holes
      } = queue.shift();
      getBoundingBox(pos, size, holes[0] || pos.length, bbox);
      cell = getGridCell(bbox[0], gridResolution, gridOffset, cell);
      const code = bitCode(bbox[1], cell);
      if (code) {
        let parts = bisectPolygon(pos, types, size, 0, holes[0] || pos.length, cell, code);
        const polygonLow = {
          pos: parts[0].pos,
          types: parts[0].types,
          holes: []
        };
        const polygonHigh = {
          pos: parts[1].pos,
          types: parts[1].types,
          holes: []
        };
        queue.push(polygonLow, polygonHigh);
        for (let i = 0; i < holes.length; i++) {
          parts = bisectPolygon(pos, types, size, holes[i], holes[i + 1] || pos.length, cell, code);
          if (parts[0]) {
            polygonLow.holes.push(polygonLow.pos.length);
            polygonLow.pos = concatInPlace(polygonLow.pos, parts[0].pos);
            if (edgeTypes) {
              polygonLow.types = concatInPlace(polygonLow.types, parts[0].types);
            }
          }
          if (parts[1]) {
            polygonHigh.holes.push(polygonHigh.pos.length);
            polygonHigh.pos = concatInPlace(polygonHigh.pos, parts[1].pos);
            if (edgeTypes) {
              polygonHigh.types = concatInPlace(polygonHigh.types, parts[1].types);
            }
          }
        }
      } else {
        const polygon = {
          positions: pos
        };
        if (edgeTypes) {
          polygon.edgeTypes = types;
        }
        if (holes.length) {
          polygon.holeIndices = holes;
        }
        result.push(polygon);
      }
    }
    return result;
  }
  function bisectPolygon(positions, edgeTypes, size, startIndex, endIndex, bbox, edge) {
    const numPoints = (endIndex - startIndex) / size;
    const resultLow = [];
    const resultHigh = [];
    const typesLow = [];
    const typesHigh = [];
    const scratchPoint = [];
    let p;
    let side;
    let type;
    const prev = getPointAtIndex(positions, numPoints - 1, size, startIndex);
    let prevSide = Math.sign(edge & 8 ? prev[1] - bbox[3] : prev[0] - bbox[2]);
    let prevType = edgeTypes && edgeTypes[numPoints - 1];
    let lowPointCount = 0;
    let highPointCount = 0;
    for (let i = 0; i < numPoints; i++) {
      p = getPointAtIndex(positions, i, size, startIndex, p);
      side = Math.sign(edge & 8 ? p[1] - bbox[3] : p[0] - bbox[2]);
      type = edgeTypes && edgeTypes[startIndex / size + i];
      if (side && prevSide && prevSide !== side) {
        intersect(prev, p, edge, bbox, scratchPoint);
        push(resultLow, scratchPoint) && typesLow.push(prevType);
        push(resultHigh, scratchPoint) && typesHigh.push(prevType);
      }
      if (side <= 0) {
        push(resultLow, p) && typesLow.push(type);
        lowPointCount -= side;
      } else if (typesLow.length) {
        typesLow[typesLow.length - 1] = TYPE_INSIDE;
      }
      if (side >= 0) {
        push(resultHigh, p) && typesHigh.push(type);
        highPointCount += side;
      } else if (typesHigh.length) {
        typesHigh[typesHigh.length - 1] = TYPE_INSIDE;
      }
      copy(prev, p);
      prevSide = side;
      prevType = type;
    }
    return [lowPointCount ? {
      pos: resultLow,
      types: edgeTypes && typesLow
    } : null, highPointCount ? {
      pos: resultHigh,
      types: edgeTypes && typesHigh
    } : null];
  }
  function getGridCell(p, gridResolution, gridOffset, out) {
    const left = Math.floor((p[0] - gridOffset[0]) / gridResolution) * gridResolution + gridOffset[0];
    const bottom = Math.floor((p[1] - gridOffset[1]) / gridResolution) * gridResolution + gridOffset[1];
    out[0] = left;
    out[1] = bottom;
    out[2] = left + gridResolution;
    out[3] = bottom + gridResolution;
    return out;
  }
  function moveToNeighborCell(cell, gridResolution, edge) {
    if (edge & 8) {
      cell[1] += gridResolution;
      cell[3] += gridResolution;
    } else if (edge & 4) {
      cell[1] -= gridResolution;
      cell[3] -= gridResolution;
    } else if (edge & 2) {
      cell[0] += gridResolution;
      cell[2] += gridResolution;
    } else if (edge & 1) {
      cell[0] -= gridResolution;
      cell[2] -= gridResolution;
    }
  }
  function getBoundingBox(positions, size, endIndex, out) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < endIndex; i += size) {
      const x = positions[i];
      const y = positions[i + 1];
      minX = x < minX ? x : minX;
      maxX = x > maxX ? x : maxX;
      minY = y < minY ? y : minY;
      maxY = y > maxY ? y : maxY;
    }
    out[0][0] = minX;
    out[0][1] = minY;
    out[1][0] = maxX;
    out[1][1] = maxY;
    return out;
  }

  // ../../node_modules/@math.gl/polygon/dist/esm/cut-by-mercator-bounds.js
  var DEFAULT_MAX_LATITUDE = 85.051129;
  function cutPolylineByMercatorBounds(positions, options) {
    const {
      size = 2,
      startIndex = 0,
      endIndex = positions.length,
      normalize: normalize2 = true
    } = options || {};
    const newPositions = positions.slice(startIndex, endIndex);
    wrapLongitudesForShortestPath(newPositions, size, 0, endIndex - startIndex);
    const parts = cutPolylineByGrid(newPositions, {
      size,
      broken: true,
      gridResolution: 360,
      gridOffset: [-180, -180]
    });
    if (normalize2) {
      for (const part of parts) {
        shiftLongitudesIntoRange(part, size);
      }
    }
    return parts;
  }
  function cutPolygonByMercatorBounds(positions, holeIndices = null, options) {
    const {
      size = 2,
      normalize: normalize2 = true,
      edgeTypes = false
    } = options || {};
    holeIndices = holeIndices || [];
    const newPositions = [];
    const newHoleIndices = [];
    let srcStartIndex = 0;
    let targetIndex = 0;
    for (let ringIndex = 0; ringIndex <= holeIndices.length; ringIndex++) {
      const srcEndIndex = holeIndices[ringIndex] || positions.length;
      const targetStartIndex = targetIndex;
      const splitIndex = findSplitIndex(positions, size, srcStartIndex, srcEndIndex);
      for (let i = splitIndex; i < srcEndIndex; i++) {
        newPositions[targetIndex++] = positions[i];
      }
      for (let i = srcStartIndex; i < splitIndex; i++) {
        newPositions[targetIndex++] = positions[i];
      }
      wrapLongitudesForShortestPath(newPositions, size, targetStartIndex, targetIndex);
      insertPoleVertices(newPositions, size, targetStartIndex, targetIndex, options === null || options === void 0 ? void 0 : options.maxLatitude);
      srcStartIndex = srcEndIndex;
      newHoleIndices[ringIndex] = targetIndex;
    }
    newHoleIndices.pop();
    const parts = cutPolygonByGrid(newPositions, newHoleIndices, {
      size,
      gridResolution: 360,
      gridOffset: [-180, -180],
      edgeTypes
    });
    if (normalize2) {
      for (const part of parts) {
        shiftLongitudesIntoRange(part.positions, size);
      }
    }
    return parts;
  }
  function findSplitIndex(positions, size, startIndex, endIndex) {
    let maxLat = -1;
    let pointIndex = -1;
    for (let i = startIndex + 1; i < endIndex; i += size) {
      const lat = Math.abs(positions[i]);
      if (lat > maxLat) {
        maxLat = lat;
        pointIndex = i - 1;
      }
    }
    return pointIndex;
  }
  function insertPoleVertices(positions, size, startIndex, endIndex, maxLatitude = DEFAULT_MAX_LATITUDE) {
    const firstLng = positions[startIndex];
    const lastLng = positions[endIndex - size];
    if (Math.abs(firstLng - lastLng) > 180) {
      const p = getPointAtIndex(positions, 0, size, startIndex);
      p[0] += Math.round((lastLng - firstLng) / 360) * 360;
      push(positions, p);
      p[1] = Math.sign(p[1]) * maxLatitude;
      push(positions, p);
      p[0] = firstLng;
      push(positions, p);
    }
  }
  function wrapLongitudesForShortestPath(positions, size, startIndex, endIndex) {
    let prevLng = positions[0];
    let lng;
    for (let i = startIndex; i < endIndex; i += size) {
      lng = positions[i];
      const delta = lng - prevLng;
      if (delta > 180 || delta < -180) {
        lng -= Math.round(delta / 360) * 360;
      }
      positions[i] = prevLng = lng;
    }
  }
  function shiftLongitudesIntoRange(positions, size) {
    let refLng;
    const pointCount = positions.length / size;
    for (let i = 0; i < pointCount; i++) {
      refLng = positions[i * size];
      if ((refLng + 180) % 360 !== 0) {
        break;
      }
    }
    const delta = -Math.round(refLng / 360) * 360;
    if (delta === 0) {
      return;
    }
    for (let i = 0; i < pointCount; i++) {
      positions[i * size] += delta;
    }
  }

  // src/column-layer/column-geometry.ts
  var ColumnGeometry = class extends import_core19.Geometry {
    constructor(props) {
      const {
        id = (0, import_core19.uid)("column-geometry")
      } = props;
      const {
        indices,
        attributes
      } = tesselateColumn(props);
      super({
        ...props,
        id,
        indices,
        attributes
      });
    }
  };
  function tesselateColumn(props) {
    const {
      radius,
      height = 1,
      nradial = 10
    } = props;
    let {
      vertices
    } = props;
    if (vertices) {
      import_core18.log.assert(vertices.length >= nradial);
      vertices = vertices.flatMap((v) => [v[0], v[1]]);
      modifyPolygonWindingDirection(vertices, WINDING.COUNTER_CLOCKWISE);
    }
    const isExtruded = height > 0;
    const vertsAroundEdge = nradial + 1;
    const numVertices = isExtruded ? vertsAroundEdge * 3 + 1 : nradial;
    const stepAngle = Math.PI * 2 / nradial;
    const indices = new Uint16Array(isExtruded ? nradial * 3 * 2 : 0);
    const positions = new Float32Array(numVertices * 3);
    const normals = new Float32Array(numVertices * 3);
    let i = 0;
    if (isExtruded) {
      for (let j = 0; j < vertsAroundEdge; j++) {
        const a = j * stepAngle;
        const vertexIndex = j % nradial;
        const sin2 = Math.sin(a);
        const cos2 = Math.cos(a);
        for (let k = 0; k < 2; k++) {
          positions[i + 0] = vertices ? vertices[vertexIndex * 2] : cos2 * radius;
          positions[i + 1] = vertices ? vertices[vertexIndex * 2 + 1] : sin2 * radius;
          positions[i + 2] = (1 / 2 - k) * height;
          normals[i + 0] = vertices ? vertices[vertexIndex * 2] : cos2;
          normals[i + 1] = vertices ? vertices[vertexIndex * 2 + 1] : sin2;
          i += 3;
        }
      }
      positions[i + 0] = positions[i - 3];
      positions[i + 1] = positions[i - 2];
      positions[i + 2] = positions[i - 1];
      i += 3;
    }
    for (let j = isExtruded ? 0 : 1; j < vertsAroundEdge; j++) {
      const v = Math.floor(j / 2) * Math.sign(0.5 - j % 2);
      const a = v * stepAngle;
      const vertexIndex = (v + nradial) % nradial;
      const sin2 = Math.sin(a);
      const cos2 = Math.cos(a);
      positions[i + 0] = vertices ? vertices[vertexIndex * 2] : cos2 * radius;
      positions[i + 1] = vertices ? vertices[vertexIndex * 2 + 1] : sin2 * radius;
      positions[i + 2] = height / 2;
      normals[i + 2] = 1;
      i += 3;
    }
    if (isExtruded) {
      let index = 0;
      for (let j = 0; j < nradial; j++) {
        indices[index++] = j * 2 + 0;
        indices[index++] = j * 2 + 2;
        indices[index++] = j * 2 + 0;
        indices[index++] = j * 2 + 1;
        indices[index++] = j * 2 + 1;
        indices[index++] = j * 2 + 3;
      }
    }
    return {
      indices,
      attributes: {
        POSITION: {
          size: 3,
          value: positions
        },
        NORMAL: {
          size: 3,
          value: normals
        }
      }
    };
  }

  // src/column-layer/column-layer-vertex.glsl.ts
  var column_layer_vertex_glsl_default = `#version 300 es

#define SHADER_NAME column-layer-vertex-shader

in vec3 positions;
in vec3 normals;

in vec3 instancePositions;
in float instanceElevations;
in vec3 instancePositions64Low;
in vec4 instanceFillColors;
in vec4 instanceLineColors;
in float instanceStrokeWidths;

in vec3 instancePickingColors;

// Custom uniforms
uniform float opacity;
uniform float radius;
uniform float angle;
uniform vec2 offset;
uniform bool extruded;
uniform bool stroked;
uniform bool isStroke;
uniform float coverage;
uniform float elevationScale;
uniform float edgeDistance;
uniform float widthScale;
uniform float widthMinPixels;
uniform float widthMaxPixels;
uniform int radiusUnits;
uniform int widthUnits;

// Result
out vec4 vColor;
#ifdef FLAT_SHADING
out vec4 position_commonspace;
#endif

void main(void) {
  geometry.worldPosition = instancePositions;

  vec4 color = isStroke ? instanceLineColors : instanceFillColors;
  // rotate primitive position and normal
  mat2 rotationMatrix = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));

  // calculate elevation, if 3d not enabled set to 0
  // cylindar gemoetry height are between -1.0 to 1.0, transform it to between 0, 1
  float elevation = 0.0;
  // calculate stroke offset
  float strokeOffsetRatio = 1.0;

  if (extruded) {
    elevation = instanceElevations * (positions.z + 1.0) / 2.0 * elevationScale;
  } else if (stroked) {
    float widthPixels = clamp(
      project_size_to_pixel(instanceStrokeWidths * widthScale, widthUnits),
      widthMinPixels, widthMaxPixels) / 2.0;
    float halfOffset = project_pixel_size(widthPixels) / project_size(edgeDistance * coverage * radius);
    if (isStroke) {
      strokeOffsetRatio -= sign(positions.z) * halfOffset;
    } else {
      strokeOffsetRatio -= halfOffset;
    }
  }

  // if alpha == 0.0 or z < 0.0, do not render element
  float shouldRender = float(color.a > 0.0 && instanceElevations >= 0.0);
  float dotRadius = radius * coverage * shouldRender;

  geometry.pickingColor = instancePickingColors;

  // project center of column
  vec3 centroidPosition = vec3(instancePositions.xy, instancePositions.z + elevation);
  vec3 centroidPosition64Low = instancePositions64Low;
  vec2 offset = (rotationMatrix * positions.xy * strokeOffsetRatio + offset) * dotRadius;
  if (radiusUnits == UNIT_METERS) {
    offset = project_size(offset);
  }
  vec3 pos = vec3(offset, 0.);
  DECKGL_FILTER_SIZE(pos, geometry);

  gl_Position = project_position_to_clipspace(centroidPosition, centroidPosition64Low, pos, geometry.position);
  geometry.normal = project_normal(vec3(rotationMatrix * normals.xy, normals.z));
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);

  // Light calculations
  if (extruded && !isStroke) {
#ifdef FLAT_SHADING
    position_commonspace = geometry.position;
    vColor = vec4(color.rgb, color.a * opacity);
#else
    vec3 lightColor = lighting_getLightColor(color.rgb, project_uCameraPosition, geometry.position.xyz, geometry.normal);
    vColor = vec4(lightColor, color.a * opacity);
#endif
  } else {
    vColor = vec4(color.rgb, color.a * opacity);
  }
  DECKGL_FILTER_COLOR(vColor, geometry);
}
`;

  // src/column-layer/column-layer-fragment.glsl.ts
  var column_layer_fragment_glsl_default = `#version 300 es
#define SHADER_NAME column-layer-fragment-shader

precision highp float;

uniform vec3 project_uCameraPosition;
uniform bool extruded;
uniform bool isStroke;

out vec4 fragColor;

in vec4 vColor;
#ifdef FLAT_SHADING
in vec4 position_commonspace;
#endif

void main(void) {
  fragColor = vColor;
#ifdef FLAT_SHADING
  if (extruded && !isStroke && !picking_uActive) {
    vec3 normal = normalize(cross(dFdx(position_commonspace.xyz), dFdy(position_commonspace.xyz)));
    fragColor.rgb = lighting_getLightColor(vColor.rgb, project_uCameraPosition, position_commonspace.xyz, normal);
  }
#endif
  DECKGL_FILTER_COLOR(fragColor, geometry);
}
`;

  // src/column-layer/column-layer.ts
  var DEFAULT_COLOR6 = [0, 0, 0, 255];
  var defaultProps7 = {
    diskResolution: {
      type: "number",
      min: 4,
      value: 20
    },
    vertices: null,
    radius: {
      type: "number",
      min: 0,
      value: 1e3
    },
    angle: {
      type: "number",
      value: 0
    },
    offset: {
      type: "array",
      value: [0, 0]
    },
    coverage: {
      type: "number",
      min: 0,
      max: 1,
      value: 1
    },
    elevationScale: {
      type: "number",
      min: 0,
      value: 1
    },
    radiusUnits: "meters",
    lineWidthUnits: "meters",
    lineWidthScale: 1,
    lineWidthMinPixels: 0,
    lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
    extruded: true,
    wireframe: false,
    filled: true,
    stroked: false,
    getPosition: {
      type: "accessor",
      value: (x) => x.position
    },
    getFillColor: {
      type: "accessor",
      value: DEFAULT_COLOR6
    },
    getLineColor: {
      type: "accessor",
      value: DEFAULT_COLOR6
    },
    getLineWidth: {
      type: "accessor",
      value: 1
    },
    getElevation: {
      type: "accessor",
      value: 1e3
    },
    material: true,
    getColor: {
      deprecatedFor: ["getFillColor", "getLineColor"]
    }
  };
  var ColumnLayer = class extends import_core20.Layer {
    getShaders() {
      const {
        gl
      } = this.context;
      const transpileToGLSL100 = !(0, import_core21.isWebGL2)(gl);
      const defines = {};
      const useDerivatives = this.props.flatShading && (0, import_core21.hasFeature)(gl, import_core21.FEATURES.GLSL_DERIVATIVES);
      if (useDerivatives) {
        defines.FLAT_SHADING = 1;
      }
      return super.getShaders({
        vs: column_layer_vertex_glsl_default,
        fs: column_layer_fragment_glsl_default,
        defines,
        transpileToGLSL100,
        modules: [import_core20.project32, useDerivatives ? import_core20.phongLighting : import_core20.gouraudLighting, import_core20.picking]
      });
    }
    initializeState() {
      const attributeManager = this.getAttributeManager();
      attributeManager.addInstanced({
        instancePositions: {
          size: 3,
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          transition: true,
          accessor: "getPosition"
        },
        instanceElevations: {
          size: 1,
          transition: true,
          accessor: "getElevation"
        },
        instanceFillColors: {
          size: this.props.colorFormat.length,
          type: esm_default.UNSIGNED_BYTE,
          normalized: true,
          transition: true,
          accessor: "getFillColor",
          defaultValue: DEFAULT_COLOR6
        },
        instanceLineColors: {
          size: this.props.colorFormat.length,
          type: esm_default.UNSIGNED_BYTE,
          normalized: true,
          transition: true,
          accessor: "getLineColor",
          defaultValue: DEFAULT_COLOR6
        },
        instanceStrokeWidths: {
          size: 1,
          accessor: "getLineWidth",
          transition: true
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
      const regenerateModels = changeFlags.extensionsChanged || props.flatShading !== oldProps.flatShading;
      if (regenerateModels) {
        const {
          gl
        } = this.context;
        this.state.model?.delete();
        this.state.model = this._getModel(gl);
        this.getAttributeManager().invalidateAll();
      }
      if (regenerateModels || props.diskResolution !== oldProps.diskResolution || props.vertices !== oldProps.vertices || (props.extruded || props.stroked) !== (oldProps.extruded || oldProps.stroked)) {
        this._updateGeometry(props);
      }
    }
    getGeometry(diskResolution, vertices, hasThinkness) {
      const geometry = new ColumnGeometry({
        radius: 1,
        height: hasThinkness ? 2 : 0,
        vertices,
        nradial: diskResolution
      });
      let meanVertexDistance = 0;
      if (vertices) {
        for (let i = 0; i < diskResolution; i++) {
          const p = vertices[i];
          const d = Math.sqrt(p[0] * p[0] + p[1] * p[1]);
          meanVertexDistance += d / diskResolution;
        }
      } else {
        meanVertexDistance = 1;
      }
      this.setState({
        edgeDistance: Math.cos(Math.PI / diskResolution) * meanVertexDistance
      });
      return geometry;
    }
    _getModel(gl) {
      return new import_core21.Model(gl, {
        ...this.getShaders(),
        id: this.props.id,
        isInstanced: true
      });
    }
    _updateGeometry({
      diskResolution,
      vertices,
      extruded,
      stroked
    }) {
      const geometry = this.getGeometry(diskResolution, vertices, extruded || stroked);
      this.setState({
        fillVertexCount: geometry.attributes.POSITION.value.length / 3,
        wireframeVertexCount: geometry.indices.value.length
      });
      this.state.model.setProps({
        geometry
      });
    }
    draw({
      uniforms
    }) {
      const {
        lineWidthUnits,
        lineWidthScale,
        lineWidthMinPixels,
        lineWidthMaxPixels,
        radiusUnits,
        elevationScale,
        extruded,
        filled,
        stroked,
        wireframe,
        offset,
        coverage,
        radius,
        angle
      } = this.props;
      const {
        model,
        fillVertexCount,
        wireframeVertexCount,
        edgeDistance
      } = this.state;
      model.setUniforms(uniforms).setUniforms({
        radius,
        angle: angle / 180 * Math.PI,
        offset,
        extruded,
        stroked,
        coverage,
        elevationScale,
        edgeDistance,
        radiusUnits: import_core20.UNIT[radiusUnits],
        widthUnits: import_core20.UNIT[lineWidthUnits],
        widthScale: lineWidthScale,
        widthMinPixels: lineWidthMinPixels,
        widthMaxPixels: lineWidthMaxPixels
      });
      if (extruded && wireframe) {
        model.setProps({
          isIndexed: true
        });
        model.setVertexCount(wireframeVertexCount).setDrawMode(esm_default.LINES).setUniforms({
          isStroke: true
        }).draw();
      }
      if (filled) {
        model.setProps({
          isIndexed: false
        });
        model.setVertexCount(fillVertexCount).setDrawMode(esm_default.TRIANGLE_STRIP).setUniforms({
          isStroke: false
        }).draw();
      }
      if (!extruded && stroked) {
        model.setProps({
          isIndexed: false
        });
        model.setVertexCount(fillVertexCount * 2 / 3).setDrawMode(esm_default.TRIANGLE_STRIP).setUniforms({
          isStroke: true
        }).draw();
      }
    }
  };
  __publicField(ColumnLayer, "layerName", "ColumnLayer");
  __publicField(ColumnLayer, "defaultProps", defaultProps7);

  // src/column-layer/grid-cell-layer.ts
  var import_core22 = __toESM(require_core2());
  var import_core23 = __toESM(require_core());
  var defaultProps8 = {
    cellSize: {
      type: "number",
      min: 0,
      value: 1e3
    },
    offset: {
      type: "array",
      value: [1, 1]
    }
  };
  var GridCellLayer = class extends ColumnLayer {
    getGeometry(diskResolution) {
      return new import_core22.CubeGeometry();
    }
    draw({
      uniforms
    }) {
      const {
        elevationScale,
        extruded,
        offset,
        coverage,
        cellSize,
        angle,
        radiusUnits
      } = this.props;
      this.state.model.setUniforms(uniforms).setUniforms({
        radius: cellSize / 2,
        radiusUnits: import_core23.UNIT[radiusUnits],
        angle,
        offset,
        extruded,
        coverage,
        elevationScale,
        edgeDistance: 1,
        isWireframe: false
      }).draw();
    }
  };
  __publicField(GridCellLayer, "layerName", "GridCellLayer");
  __publicField(GridCellLayer, "defaultProps", defaultProps8);

  // src/path-layer/path-layer.ts
  var import_core25 = __toESM(require_core());
  var import_core26 = __toESM(require_core2());

  // src/path-layer/path-tesselator.ts
  var import_core24 = __toESM(require_core());

  // src/path-layer/path.ts
  function normalizePath(path, size, gridResolution, wrapLongitude) {
    let flatPath;
    if (Array.isArray(path[0])) {
      const length = path.length * size;
      flatPath = new Array(length);
      for (let i = 0; i < path.length; i++) {
        for (let j = 0; j < size; j++) {
          flatPath[i * size + j] = path[i][j] || 0;
        }
      }
    } else {
      flatPath = path;
    }
    if (gridResolution) {
      return cutPolylineByGrid(flatPath, {
        size,
        gridResolution
      });
    }
    if (wrapLongitude) {
      return cutPolylineByMercatorBounds(flatPath, {
        size
      });
    }
    return flatPath;
  }

  // src/path-layer/path-tesselator.ts
  var START_CAP = 1;
  var END_CAP = 2;
  var INVALID = 4;
  var PathTesselator = class extends import_core24.Tesselator {
    constructor(opts) {
      super({
        ...opts,
        attributes: {
          positions: {
            size: 3,
            padding: 18,
            initialize: true,
            type: opts.fp64 ? Float64Array : Float32Array
          },
          segmentTypes: {
            size: 1,
            type: Uint8ClampedArray
          }
        }
      });
    }
    get(attributeName) {
      return this.attributes[attributeName];
    }
    getGeometryFromBuffer(buffer) {
      if (this.normalize) {
        return super.getGeometryFromBuffer(buffer);
      }
      return null;
    }
    normalizeGeometry(path) {
      if (this.normalize) {
        return normalizePath(path, this.positionSize, this.opts.resolution, this.opts.wrapLongitude);
      }
      return path;
    }
    getGeometrySize(path) {
      if (isCut(path)) {
        let size = 0;
        for (const subPath of path) {
          size += this.getGeometrySize(subPath);
        }
        return size;
      }
      const numPoints = this.getPathLength(path);
      if (numPoints < 2) {
        return 0;
      }
      if (this.isClosed(path)) {
        return numPoints < 3 ? 0 : numPoints + 2;
      }
      return numPoints;
    }
    updateGeometryAttributes(path, context) {
      if (context.geometrySize === 0) {
        return;
      }
      if (path && isCut(path)) {
        for (const subPath of path) {
          const geometrySize = this.getGeometrySize(subPath);
          context.geometrySize = geometrySize;
          this.updateGeometryAttributes(subPath, context);
          context.vertexStart += geometrySize;
        }
      } else {
        this._updateSegmentTypes(path, context);
        this._updatePositions(path, context);
      }
    }
    _updateSegmentTypes(path, context) {
      const segmentTypes = this.attributes.segmentTypes;
      const isPathClosed = path ? this.isClosed(path) : false;
      const {
        vertexStart,
        geometrySize
      } = context;
      segmentTypes.fill(0, vertexStart, vertexStart + geometrySize);
      if (isPathClosed) {
        segmentTypes[vertexStart] = INVALID;
        segmentTypes[vertexStart + geometrySize - 2] = INVALID;
      } else {
        segmentTypes[vertexStart] += START_CAP;
        segmentTypes[vertexStart + geometrySize - 2] += END_CAP;
      }
      segmentTypes[vertexStart + geometrySize - 1] = INVALID;
    }
    _updatePositions(path, context) {
      const {
        positions
      } = this.attributes;
      if (!positions || !path) {
        return;
      }
      const {
        vertexStart,
        geometrySize
      } = context;
      const p = new Array(3);
      for (let i = vertexStart, ptIndex = 0; ptIndex < geometrySize; i++, ptIndex++) {
        this.getPointOnPath(path, ptIndex, p);
        positions[i * 3] = p[0];
        positions[i * 3 + 1] = p[1];
        positions[i * 3 + 2] = p[2];
      }
    }
    getPathLength(path) {
      return path.length / this.positionSize;
    }
    getPointOnPath(path, index, target = []) {
      const {
        positionSize
      } = this;
      if (index * positionSize >= path.length) {
        index += 1 - path.length / positionSize;
      }
      const i = index * positionSize;
      target[0] = path[i];
      target[1] = path[i + 1];
      target[2] = positionSize === 3 && path[i + 2] || 0;
      return target;
    }
    isClosed(path) {
      if (!this.normalize) {
        return Boolean(this.opts.loop);
      }
      const {
        positionSize
      } = this;
      const lastPointIndex = path.length - positionSize;
      return path[0] === path[lastPointIndex] && path[1] === path[lastPointIndex + 1] && (positionSize === 2 || path[2] === path[lastPointIndex + 2]);
    }
  };
  function isCut(path) {
    return Array.isArray(path[0]);
  }

  // src/path-layer/path-layer-vertex.glsl.ts
  var path_layer_vertex_glsl_default = `#define SHADER_NAME path-layer-vertex-shader

attribute vec2 positions;

attribute float instanceTypes;
attribute vec3 instanceStartPositions;
attribute vec3 instanceEndPositions;
attribute vec3 instanceLeftPositions;
attribute vec3 instanceRightPositions;
attribute vec3 instanceLeftPositions64Low;
attribute vec3 instanceStartPositions64Low;
attribute vec3 instanceEndPositions64Low;
attribute vec3 instanceRightPositions64Low;
attribute float instanceStrokeWidths;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;

uniform float widthScale;
uniform float widthMinPixels;
uniform float widthMaxPixels;
uniform float jointType;
uniform float capType;
uniform float miterLimit;
uniform bool billboard;
uniform int widthUnits;

uniform float opacity;

varying vec4 vColor;
varying vec2 vCornerOffset;
varying float vMiterLength;
varying vec2 vPathPosition;
varying float vPathLength;
varying float vJointType;

const float EPSILON = 0.001;
const vec3 ZERO_OFFSET = vec3(0.0);

float flipIfTrue(bool flag) {
  return -(float(flag) * 2. - 1.);
}

// calculate line join positions
vec3 getLineJoinOffset(
  vec3 prevPoint, vec3 currPoint, vec3 nextPoint,
  vec2 width
) {
  bool isEnd = positions.x > 0.0;
  // side of the segment - -1: left, 0: center, 1: right
  float sideOfPath = positions.y;
  float isJoint = float(sideOfPath == 0.0);

  vec3 deltaA3 = (currPoint - prevPoint);
  vec3 deltaB3 = (nextPoint - currPoint);

  mat3 rotationMatrix;
  bool needsRotation = !billboard && project_needs_rotation(currPoint, rotationMatrix);
  if (needsRotation) {
    deltaA3 = deltaA3 * rotationMatrix;
    deltaB3 = deltaB3 * rotationMatrix;
  }
  vec2 deltaA = deltaA3.xy / width;
  vec2 deltaB = deltaB3.xy / width;

  float lenA = length(deltaA);
  float lenB = length(deltaB);

  vec2 dirA = lenA > 0. ? normalize(deltaA) : vec2(0.0, 0.0);
  vec2 dirB = lenB > 0. ? normalize(deltaB) : vec2(0.0, 0.0);

  vec2 perpA = vec2(-dirA.y, dirA.x);
  vec2 perpB = vec2(-dirB.y, dirB.x);

  // tangent of the corner
  vec2 tangent = dirA + dirB;
  tangent = length(tangent) > 0. ? normalize(tangent) : perpA;
  // direction of the corner
  vec2 miterVec = vec2(-tangent.y, tangent.x);
  // direction of the segment
  vec2 dir = isEnd ? dirA : dirB;
  // direction of the extrusion
  vec2 perp = isEnd ? perpA : perpB;
  // length of the segment
  float L = isEnd ? lenA : lenB;

  // A = angle of the corner
  float sinHalfA = abs(dot(miterVec, perp));
  float cosHalfA = abs(dot(dirA, miterVec));

  // -1: right, 1: left
  float turnDirection = flipIfTrue(dirA.x * dirB.y >= dirA.y * dirB.x);

  // relative position to the corner:
  // -1: inside (smaller side of the angle)
  // 0: center
  // 1: outside (bigger side of the angle)
  float cornerPosition = sideOfPath * turnDirection;

  float miterSize = 1.0 / max(sinHalfA, EPSILON);
  // trim if inside corner extends further than the line segment
  miterSize = mix(
    min(miterSize, max(lenA, lenB) / max(cosHalfA, EPSILON)),
    miterSize,
    step(0.0, cornerPosition)
  );

  vec2 offsetVec = mix(miterVec * miterSize, perp, step(0.5, cornerPosition))
    * (sideOfPath + isJoint * turnDirection);

  // special treatment for start cap and end cap
  bool isStartCap = lenA == 0.0 || (!isEnd && (instanceTypes == 1.0 || instanceTypes == 3.0));
  bool isEndCap = lenB == 0.0 || (isEnd && (instanceTypes == 2.0 || instanceTypes == 3.0));
  bool isCap = isStartCap || isEndCap;

  // extend out a triangle to envelope the round cap
  if (isCap) {
    offsetVec = mix(perp * sideOfPath, dir * capType * 4.0 * flipIfTrue(isStartCap), isJoint);
    vJointType = capType;
  } else {
    vJointType = jointType;
  }

  // Generate variables for fragment shader
  vPathLength = L;
  vCornerOffset = offsetVec;
  vMiterLength = dot(vCornerOffset, miterVec * turnDirection);
  vMiterLength = isCap ? isJoint : vMiterLength;

  vec2 offsetFromStartOfPath = vCornerOffset + deltaA * float(isEnd);
  vPathPosition = vec2(
    dot(offsetFromStartOfPath, perp),
    dot(offsetFromStartOfPath, dir)
  );
  geometry.uv = vPathPosition;

  float isValid = step(instanceTypes, 3.5);
  vec3 offset = vec3(offsetVec * width * isValid, 0.0);

  if (needsRotation) {
    offset = rotationMatrix * offset;
  }
  return offset;
}

// In clipspace extrusion, if a line extends behind the camera, clip it to avoid visual artifacts
void clipLine(inout vec4 position, vec4 refPosition) {
  if (position.w < EPSILON) {
    float r = (EPSILON - refPosition.w) / (position.w - refPosition.w);
    position = refPosition + (position - refPosition) * r;
  }
}

void main() {
  geometry.pickingColor = instancePickingColors;

  vColor = vec4(instanceColors.rgb, instanceColors.a * opacity);

  float isEnd = positions.x;

  vec3 prevPosition = mix(instanceLeftPositions, instanceStartPositions, isEnd);
  vec3 prevPosition64Low = mix(instanceLeftPositions64Low, instanceStartPositions64Low, isEnd);

  vec3 currPosition = mix(instanceStartPositions, instanceEndPositions, isEnd);
  vec3 currPosition64Low = mix(instanceStartPositions64Low, instanceEndPositions64Low, isEnd);

  vec3 nextPosition = mix(instanceEndPositions, instanceRightPositions, isEnd);
  vec3 nextPosition64Low = mix(instanceEndPositions64Low, instanceRightPositions64Low, isEnd);

  geometry.worldPosition = currPosition;
  vec2 widthPixels = vec2(clamp(
    project_size_to_pixel(instanceStrokeWidths * widthScale, widthUnits),
    widthMinPixels, widthMaxPixels) / 2.0);
  vec3 width;

  if (billboard) {
    // Extrude in clipspace
    vec4 prevPositionScreen = project_position_to_clipspace(prevPosition, prevPosition64Low, ZERO_OFFSET);
    vec4 currPositionScreen = project_position_to_clipspace(currPosition, currPosition64Low, ZERO_OFFSET, geometry.position);
    vec4 nextPositionScreen = project_position_to_clipspace(nextPosition, nextPosition64Low, ZERO_OFFSET);

    clipLine(prevPositionScreen, currPositionScreen);
    clipLine(nextPositionScreen, currPositionScreen);
    clipLine(currPositionScreen, mix(nextPositionScreen, prevPositionScreen, isEnd));

    width = vec3(widthPixels, 0.0);
    DECKGL_FILTER_SIZE(width, geometry);

    vec3 offset = getLineJoinOffset(
      prevPositionScreen.xyz / prevPositionScreen.w,
      currPositionScreen.xyz / currPositionScreen.w,
      nextPositionScreen.xyz / nextPositionScreen.w,
      project_pixel_size_to_clipspace(width.xy)
    );

    DECKGL_FILTER_GL_POSITION(currPositionScreen, geometry);
    gl_Position = vec4(currPositionScreen.xyz + offset * currPositionScreen.w, currPositionScreen.w);
  } else {
    // Extrude in commonspace
    prevPosition = project_position(prevPosition, prevPosition64Low);
    currPosition = project_position(currPosition, currPosition64Low);
    nextPosition = project_position(nextPosition, nextPosition64Low);

    width = vec3(project_pixel_size(widthPixels), 0.0);
    DECKGL_FILTER_SIZE(width, geometry);

    vec3 offset = getLineJoinOffset(prevPosition, currPosition, nextPosition, width.xy);
    geometry.position = vec4(currPosition + offset, 1.0);
    gl_Position = project_common_position_to_clipspace(geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  }
  DECKGL_FILTER_COLOR(vColor, geometry);
}
`;

  // src/path-layer/path-layer-fragment.glsl.ts
  var path_layer_fragment_glsl_default = `#define SHADER_NAME path-layer-fragment-shader

precision highp float;

uniform float miterLimit;

varying vec4 vColor;
varying vec2 vCornerOffset;
varying float vMiterLength;
/*
 * vPathPosition represents the relative coordinates of the current fragment on the path segment.
 * vPathPosition.x - position along the width of the path, between [-1, 1]. 0 is the center line.
 * vPathPosition.y - position along the length of the path, between [0, L / width].
 */
varying vec2 vPathPosition;
varying float vPathLength;
varying float vJointType;

void main(void) {
  geometry.uv = vPathPosition;

  if (vPathPosition.y < 0.0 || vPathPosition.y > vPathLength) {
    // if joint is rounded, test distance from the corner
    if (vJointType > 0.5 && length(vCornerOffset) > 1.0) {
      discard;
    }
    // trim miter
    if (vJointType < 0.5 && vMiterLength > miterLimit + 1.0) {
      discard;
    }
  }
  gl_FragColor = vColor;

  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;

  // src/path-layer/path-layer.ts
  var DEFAULT_COLOR7 = [0, 0, 0, 255];
  var defaultProps9 = {
    widthUnits: "meters",
    widthScale: {
      type: "number",
      min: 0,
      value: 1
    },
    widthMinPixels: {
      type: "number",
      min: 0,
      value: 0
    },
    widthMaxPixels: {
      type: "number",
      min: 0,
      value: Number.MAX_SAFE_INTEGER
    },
    jointRounded: false,
    capRounded: false,
    miterLimit: {
      type: "number",
      min: 0,
      value: 4
    },
    billboard: false,
    _pathType: null,
    getPath: {
      type: "accessor",
      value: (object) => object.path
    },
    getColor: {
      type: "accessor",
      value: DEFAULT_COLOR7
    },
    getWidth: {
      type: "accessor",
      value: 1
    },
    rounded: {
      deprecatedFor: ["jointRounded", "capRounded"]
    }
  };
  var ATTRIBUTE_TRANSITION = {
    enter: (value, chunk) => {
      return chunk.length ? chunk.subarray(chunk.length - value.length) : value;
    }
  };
  var PathLayer = class extends import_core25.Layer {
    getShaders() {
      return super.getShaders({
        vs: path_layer_vertex_glsl_default,
        fs: path_layer_fragment_glsl_default,
        modules: [import_core25.project32, import_core25.picking]
      });
    }
    get wrapLongitude() {
      return false;
    }
    initializeState() {
      const noAlloc = true;
      const attributeManager = this.getAttributeManager();
      attributeManager.addInstanced({
        positions: {
          size: 3,
          vertexOffset: 1,
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          transition: ATTRIBUTE_TRANSITION,
          accessor: "getPath",
          update: this.calculatePositions,
          noAlloc,
          shaderAttributes: {
            instanceLeftPositions: {
              vertexOffset: 0
            },
            instanceStartPositions: {
              vertexOffset: 1
            },
            instanceEndPositions: {
              vertexOffset: 2
            },
            instanceRightPositions: {
              vertexOffset: 3
            }
          }
        },
        instanceTypes: {
          size: 1,
          type: esm_default.UNSIGNED_BYTE,
          update: this.calculateSegmentTypes,
          noAlloc
        },
        instanceStrokeWidths: {
          size: 1,
          accessor: "getWidth",
          transition: ATTRIBUTE_TRANSITION,
          defaultValue: 1
        },
        instanceColors: {
          size: this.props.colorFormat.length,
          type: esm_default.UNSIGNED_BYTE,
          normalized: true,
          accessor: "getColor",
          transition: ATTRIBUTE_TRANSITION,
          defaultValue: DEFAULT_COLOR7
        },
        instancePickingColors: {
          size: 3,
          type: esm_default.UNSIGNED_BYTE,
          accessor: (object, {
            index,
            target: value
          }) => this.encodePickingColor(object && object.__source ? object.__source.index : index, value)
        }
      });
      this.setState({
        pathTesselator: new PathTesselator({
          fp64: this.use64bitPositions()
        })
      });
    }
    updateState(params) {
      super.updateState(params);
      const {
        props,
        changeFlags
      } = params;
      const attributeManager = this.getAttributeManager();
      const geometryChanged = changeFlags.dataChanged || changeFlags.updateTriggersChanged && (changeFlags.updateTriggersChanged.all || changeFlags.updateTriggersChanged.getPath);
      if (geometryChanged) {
        const {
          pathTesselator
        } = this.state;
        const buffers = props.data.attributes || {};
        pathTesselator.updateGeometry({
          data: props.data,
          geometryBuffer: buffers.getPath,
          buffers,
          normalize: !props._pathType,
          loop: props._pathType === "loop",
          getGeometry: props.getPath,
          positionFormat: props.positionFormat,
          wrapLongitude: props.wrapLongitude,
          resolution: this.context.viewport.resolution,
          dataChanged: changeFlags.dataChanged
        });
        this.setState({
          numInstances: pathTesselator.instanceCount,
          startIndices: pathTesselator.vertexStarts
        });
        if (!changeFlags.dataChanged) {
          attributeManager.invalidateAll();
        }
      }
      if (changeFlags.extensionsChanged) {
        const {
          gl
        } = this.context;
        this.state.model?.delete();
        this.state.model = this._getModel(gl);
        attributeManager.invalidateAll();
      }
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
        info.object = data.find((d) => d.__source.index === index);
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
        jointRounded,
        capRounded,
        billboard,
        miterLimit,
        widthUnits,
        widthScale,
        widthMinPixels,
        widthMaxPixels
      } = this.props;
      this.state.model.setUniforms(uniforms).setUniforms({
        jointType: Number(jointRounded),
        capType: Number(capRounded),
        billboard,
        widthUnits: import_core25.UNIT[widthUnits],
        widthScale,
        miterLimit,
        widthMinPixels,
        widthMaxPixels
      }).draw();
    }
    _getModel(gl) {
      const SEGMENT_INDICES = [
        0,
        1,
        2,
        1,
        4,
        2,
        1,
        3,
        4,
        3,
        5,
        4
      ];
      const SEGMENT_POSITIONS = [
        0,
        0,
        0,
        -1,
        0,
        1,
        1,
        -1,
        1,
        1,
        1,
        0
      ];
      return new import_core26.Model(gl, {
        ...this.getShaders(),
        id: this.props.id,
        geometry: new import_core26.Geometry({
          drawMode: esm_default.TRIANGLES,
          attributes: {
            indices: new Uint16Array(SEGMENT_INDICES),
            positions: {
              value: new Float32Array(SEGMENT_POSITIONS),
              size: 2
            }
          }
        }),
        isInstanced: true
      });
    }
    calculatePositions(attribute) {
      const {
        pathTesselator
      } = this.state;
      attribute.startIndices = pathTesselator.vertexStarts;
      attribute.value = pathTesselator.get("positions");
    }
    calculateSegmentTypes(attribute) {
      const {
        pathTesselator
      } = this.state;
      attribute.startIndices = pathTesselator.vertexStarts;
      attribute.value = pathTesselator.get("segmentTypes");
    }
  };
  __publicField(PathLayer, "defaultProps", defaultProps9);
  __publicField(PathLayer, "layerName", "PathLayer");

  // src/polygon-layer/polygon-layer.ts
  var import_core30 = __toESM(require_core());

  // src/solid-polygon-layer/solid-polygon-layer.ts
  var import_core28 = __toESM(require_core());
  var import_core29 = __toESM(require_core2());

  // src/solid-polygon-layer/polygon.ts
  var import_earcut2 = __toESM(require_earcut());
  var OUTER_POLYGON_WINDING = WINDING.CLOCKWISE;
  var HOLE_POLYGON_WINDING = WINDING.COUNTER_CLOCKWISE;
  var windingOptions = {
    isClosed: true
  };
  function validate(polygon) {
    polygon = polygon && polygon.positions || polygon;
    if (!Array.isArray(polygon) && !ArrayBuffer.isView(polygon)) {
      throw new Error("invalid polygon");
    }
  }
  function getPositions(polygon) {
    return "positions" in polygon ? polygon.positions : polygon;
  }
  function getHoleIndices(polygon) {
    return "holeIndices" in polygon ? polygon.holeIndices : null;
  }
  function isNested(polygon) {
    return Array.isArray(polygon[0]);
  }
  function isSimple(polygon) {
    return polygon.length >= 1 && polygon[0].length >= 2 && Number.isFinite(polygon[0][0]);
  }
  function isNestedRingClosed(simplePolygon) {
    const p0 = simplePolygon[0];
    const p1 = simplePolygon[simplePolygon.length - 1];
    return p0[0] === p1[0] && p0[1] === p1[1] && p0[2] === p1[2];
  }
  function isFlatRingClosed(positions, size, startIndex, endIndex) {
    for (let i = 0; i < size; i++) {
      if (positions[startIndex + i] !== positions[endIndex - size + i]) {
        return false;
      }
    }
    return true;
  }
  function copyNestedRing(target, targetStartIndex, simplePolygon, size, windingDirection) {
    let targetIndex = targetStartIndex;
    const len = simplePolygon.length;
    for (let i = 0; i < len; i++) {
      for (let j = 0; j < size; j++) {
        target[targetIndex++] = simplePolygon[i][j] || 0;
      }
    }
    if (!isNestedRingClosed(simplePolygon)) {
      for (let j = 0; j < size; j++) {
        target[targetIndex++] = simplePolygon[0][j] || 0;
      }
    }
    windingOptions.start = targetStartIndex;
    windingOptions.end = targetIndex;
    windingOptions.size = size;
    modifyPolygonWindingDirection(target, windingDirection, windingOptions);
    return targetIndex;
  }
  function copyFlatRing(target, targetStartIndex, positions, size, srcStartIndex = 0, srcEndIndex, windingDirection) {
    srcEndIndex = srcEndIndex || positions.length;
    const srcLength = srcEndIndex - srcStartIndex;
    if (srcLength <= 0) {
      return targetStartIndex;
    }
    let targetIndex = targetStartIndex;
    for (let i = 0; i < srcLength; i++) {
      target[targetIndex++] = positions[srcStartIndex + i];
    }
    if (!isFlatRingClosed(positions, size, srcStartIndex, srcEndIndex)) {
      for (let i = 0; i < size; i++) {
        target[targetIndex++] = positions[srcStartIndex + i];
      }
    }
    windingOptions.start = targetStartIndex;
    windingOptions.end = targetIndex;
    windingOptions.size = size;
    modifyPolygonWindingDirection(target, windingDirection, windingOptions);
    return targetIndex;
  }
  function normalize(polygon, positionSize) {
    validate(polygon);
    const positions = [];
    const holeIndices = [];
    if ("positions" in polygon) {
      const {
        positions: srcPositions,
        holeIndices: srcHoleIndices
      } = polygon;
      if (srcHoleIndices) {
        let targetIndex = 0;
        for (let i = 0; i <= srcHoleIndices.length; i++) {
          targetIndex = copyFlatRing(positions, targetIndex, srcPositions, positionSize, srcHoleIndices[i - 1], srcHoleIndices[i], i === 0 ? OUTER_POLYGON_WINDING : HOLE_POLYGON_WINDING);
          holeIndices.push(targetIndex);
        }
        holeIndices.pop();
        return {
          positions,
          holeIndices
        };
      }
      polygon = srcPositions;
    }
    if (!isNested(polygon)) {
      copyFlatRing(positions, 0, polygon, positionSize, 0, positions.length, OUTER_POLYGON_WINDING);
      return positions;
    }
    if (!isSimple(polygon)) {
      let targetIndex = 0;
      for (const [polygonIndex, simplePolygon] of polygon.entries()) {
        targetIndex = copyNestedRing(positions, targetIndex, simplePolygon, positionSize, polygonIndex === 0 ? OUTER_POLYGON_WINDING : HOLE_POLYGON_WINDING);
        holeIndices.push(targetIndex);
      }
      holeIndices.pop();
      return {
        positions,
        holeIndices
      };
    }
    copyNestedRing(positions, 0, polygon, positionSize, OUTER_POLYGON_WINDING);
    return positions;
  }
  function getPlaneArea(positions, xIndex, yIndex) {
    const numVerts = positions.length / 3;
    let area = 0;
    for (let i = 0; i < numVerts; i++) {
      const j = (i + 1) % numVerts;
      area += positions[i * 3 + xIndex] * positions[j * 3 + yIndex];
      area -= positions[j * 3 + xIndex] * positions[i * 3 + yIndex];
    }
    return Math.abs(area / 2);
  }
  function permutePositions(positions, xIndex, yIndex, zIndex) {
    const numVerts = positions.length / 3;
    for (let i = 0; i < numVerts; i++) {
      const o = i * 3;
      const x = positions[o + 0];
      const y = positions[o + 1];
      const z = positions[o + 2];
      positions[o + xIndex] = x;
      positions[o + yIndex] = y;
      positions[o + zIndex] = z;
    }
  }
  function getSurfaceIndices(polygon, positionSize, preproject, full3d) {
    let holeIndices = getHoleIndices(polygon);
    if (holeIndices) {
      holeIndices = holeIndices.map((positionIndex) => positionIndex / positionSize);
    }
    let positions = getPositions(polygon);
    const is3d = full3d && positionSize === 3;
    if (preproject) {
      const n = positions.length;
      positions = positions.slice();
      const p = [];
      for (let i = 0; i < n; i += positionSize) {
        p[0] = positions[i];
        p[1] = positions[i + 1];
        if (is3d) {
          p[2] = positions[i + 2];
        }
        const xy = preproject(p);
        positions[i] = xy[0];
        positions[i + 1] = xy[1];
        if (is3d) {
          positions[i + 2] = xy[2];
        }
      }
    }
    if (is3d) {
      const xyArea = getPlaneArea(positions, 0, 1);
      const xzArea = getPlaneArea(positions, 0, 2);
      const yzArea = getPlaneArea(positions, 1, 2);
      if (!xyArea && !xzArea && !yzArea) {
        return [];
      }
      if (xyArea > xzArea && xyArea > yzArea) {
      } else if (xzArea > yzArea) {
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
    return (0, import_earcut2.default)(positions, holeIndices, positionSize);
  }

  // src/solid-polygon-layer/polygon-tesselator.ts
  var import_core27 = __toESM(require_core());
  var PolygonTesselator = class extends import_core27.Tesselator {
    constructor(opts) {
      const {
        fp64,
        IndexType = Uint32Array
      } = opts;
      super({
        ...opts,
        attributes: {
          positions: {
            size: 3,
            type: fp64 ? Float64Array : Float32Array
          },
          vertexValid: {
            type: Uint8ClampedArray,
            size: 1
          },
          indices: {
            type: IndexType,
            size: 1
          }
        }
      });
    }
    get(attributeName) {
      const {
        attributes
      } = this;
      if (attributeName === "indices") {
        return attributes.indices && attributes.indices.subarray(0, this.vertexCount);
      }
      return attributes[attributeName];
    }
    updateGeometry(opts) {
      super.updateGeometry(opts);
      const externalIndices = this.buffers.indices;
      if (externalIndices) {
        this.vertexCount = (externalIndices.value || externalIndices).length;
      } else if (this.data && !this.getGeometry) {
        throw new Error("missing indices buffer");
      }
    }
    normalizeGeometry(polygon) {
      if (this.normalize) {
        const normalizedPolygon = normalize(polygon, this.positionSize);
        if (this.opts.resolution) {
          return cutPolygonByGrid(getPositions(normalizedPolygon), getHoleIndices(normalizedPolygon), {
            size: this.positionSize,
            gridResolution: this.opts.resolution,
            edgeTypes: true
          });
        }
        if (this.opts.wrapLongitude) {
          return cutPolygonByMercatorBounds(getPositions(normalizedPolygon), getHoleIndices(normalizedPolygon), {
            size: this.positionSize,
            maxLatitude: 86,
            edgeTypes: true
          });
        }
        return normalizedPolygon;
      }
      return polygon;
    }
    getGeometrySize(polygon) {
      if (isCut2(polygon)) {
        let size = 0;
        for (const subPolygon of polygon) {
          size += this.getGeometrySize(subPolygon);
        }
        return size;
      }
      return getPositions(polygon).length / this.positionSize;
    }
    getGeometryFromBuffer(buffer) {
      if (this.normalize || !this.buffers.indices) {
        return super.getGeometryFromBuffer(buffer);
      }
      return null;
    }
    updateGeometryAttributes(polygon, context) {
      if (polygon && isCut2(polygon)) {
        for (const subPolygon of polygon) {
          const geometrySize = this.getGeometrySize(subPolygon);
          context.geometrySize = geometrySize;
          this.updateGeometryAttributes(subPolygon, context);
          context.vertexStart += geometrySize;
          context.indexStart = this.indexStarts[context.geometryIndex + 1];
        }
      } else {
        this._updateIndices(polygon, context);
        this._updatePositions(polygon, context);
        this._updateVertexValid(polygon, context);
      }
    }
    _updateIndices(polygon, {
      geometryIndex,
      vertexStart: offset,
      indexStart
    }) {
      const {
        attributes,
        indexStarts,
        typedArrayManager
      } = this;
      let target = attributes.indices;
      if (!target || !polygon) {
        return;
      }
      let i = indexStart;
      const indices = getSurfaceIndices(polygon, this.positionSize, this.opts.preproject, this.opts.full3d);
      target = typedArrayManager.allocate(target, indexStart + indices.length, {
        copy: true
      });
      for (let j = 0; j < indices.length; j++) {
        target[i++] = indices[j] + offset;
      }
      indexStarts[geometryIndex + 1] = indexStart + indices.length;
      attributes.indices = target;
    }
    _updatePositions(polygon, {
      vertexStart,
      geometrySize
    }) {
      const {
        attributes: {
          positions
        },
        positionSize
      } = this;
      if (!positions || !polygon) {
        return;
      }
      const polygonPositions = getPositions(polygon);
      for (let i = vertexStart, j = 0; j < geometrySize; i++, j++) {
        const x = polygonPositions[j * positionSize];
        const y = polygonPositions[j * positionSize + 1];
        const z = positionSize > 2 ? polygonPositions[j * positionSize + 2] : 0;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
    }
    _updateVertexValid(polygon, {
      vertexStart,
      geometrySize
    }) {
      const {
        positionSize
      } = this;
      const vertexValid = this.attributes.vertexValid;
      const holeIndices = polygon && getHoleIndices(polygon);
      if (polygon && polygon.edgeTypes) {
        vertexValid.set(polygon.edgeTypes, vertexStart);
      } else {
        vertexValid.fill(1, vertexStart, vertexStart + geometrySize);
      }
      if (holeIndices) {
        for (let j = 0; j < holeIndices.length; j++) {
          vertexValid[vertexStart + holeIndices[j] / positionSize - 1] = 0;
        }
      }
      vertexValid[vertexStart + geometrySize - 1] = 0;
    }
  };
  function isCut2(polygon) {
    return Array.isArray(polygon) && polygon.length > 0 && !Number.isFinite(polygon[0]);
  }

  // src/solid-polygon-layer/solid-polygon-layer-vertex-main.glsl.ts
  var solid_polygon_layer_vertex_main_glsl_default = `
attribute vec2 vertexPositions;
attribute float vertexValid;

uniform bool extruded;
uniform bool isWireframe;
uniform float elevationScale;
uniform float opacity;

varying vec4 vColor;

struct PolygonProps {
  vec4 fillColors;
  vec4 lineColors;
  vec3 positions;
  vec3 nextPositions;
  vec3 pickingColors;
  vec3 positions64Low;
  vec3 nextPositions64Low;
  float elevations;
};

vec3 project_offset_normal(vec3 vector) {
  if (project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
    project_uCoordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSETS) {
    // normals generated by the polygon tesselator are in lnglat offsets instead of meters
    return normalize(vector * project_uCommonUnitsPerWorldUnit);
  }
  return project_normal(vector);
}

void calculatePosition(PolygonProps props) {
#ifdef IS_SIDE_VERTEX
  if(vertexValid < 0.5){
    gl_Position = vec4(0.);
    return;
  }
#endif

  vec3 pos;
  vec3 pos64Low;
  vec3 normal;
  vec4 colors = isWireframe ? props.lineColors : props.fillColors;

  geometry.worldPosition = props.positions;
  geometry.worldPositionAlt = props.nextPositions;
  geometry.pickingColor = props.pickingColors;

#ifdef IS_SIDE_VERTEX
  pos = mix(props.positions, props.nextPositions, vertexPositions.x);
  pos64Low = mix(props.positions64Low, props.nextPositions64Low, vertexPositions.x);
#else
  pos = props.positions;
  pos64Low = props.positions64Low;
#endif

  if (extruded) {
    pos.z += props.elevations * vertexPositions.y * elevationScale;
  }
  gl_Position = project_position_to_clipspace(pos, pos64Low, vec3(0.), geometry.position);

  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);

  if (extruded) {
  #ifdef IS_SIDE_VERTEX
    normal = vec3(
      props.positions.y - props.nextPositions.y + (props.positions64Low.y - props.nextPositions64Low.y),
      props.nextPositions.x - props.positions.x + (props.nextPositions64Low.x - props.positions64Low.x),
      0.0);
    normal = project_offset_normal(normal);
  #else
    normal = project_normal(vec3(0.0, 0.0, 1.0));
  #endif
    geometry.normal = normal;
    vec3 lightColor = lighting_getLightColor(colors.rgb, project_uCameraPosition, geometry.position.xyz, normal);
    vColor = vec4(lightColor, colors.a * opacity);
  } else {
    vColor = vec4(colors.rgb, colors.a * opacity);
  }
  DECKGL_FILTER_COLOR(vColor, geometry);
}
`;

  // src/solid-polygon-layer/solid-polygon-layer-vertex-top.glsl.ts
  var solid_polygon_layer_vertex_top_glsl_default = `#define SHADER_NAME solid-polygon-layer-vertex-shader

attribute vec3 positions;
attribute vec3 positions64Low;
attribute float elevations;
attribute vec4 fillColors;
attribute vec4 lineColors;
attribute vec3 pickingColors;

${solid_polygon_layer_vertex_main_glsl_default}

void main(void) {
  PolygonProps props;

  props.positions = positions;
  props.positions64Low = positions64Low;
  props.elevations = elevations;
  props.fillColors = fillColors;
  props.lineColors = lineColors;
  props.pickingColors = pickingColors;

  calculatePosition(props);
}
`;

  // src/solid-polygon-layer/solid-polygon-layer-vertex-side.glsl.ts
  var solid_polygon_layer_vertex_side_glsl_default = `#define SHADER_NAME solid-polygon-layer-vertex-shader-side
#define IS_SIDE_VERTEX


attribute vec3 instancePositions;
attribute vec3 nextPositions;
attribute vec3 instancePositions64Low;
attribute vec3 nextPositions64Low;
attribute float instanceElevations;
attribute vec4 instanceFillColors;
attribute vec4 instanceLineColors;
attribute vec3 instancePickingColors;

${solid_polygon_layer_vertex_main_glsl_default}

void main(void) {
  PolygonProps props;

  #if RING_WINDING_ORDER_CW == 1
    props.positions = instancePositions;
    props.positions64Low = instancePositions64Low;
    props.nextPositions = nextPositions;
    props.nextPositions64Low = nextPositions64Low;
  #else
    props.positions = nextPositions;
    props.positions64Low = nextPositions64Low;
    props.nextPositions = instancePositions;
    props.nextPositions64Low = instancePositions64Low;
  #endif
  props.elevations = instanceElevations;
  props.fillColors = instanceFillColors;
  props.lineColors = instanceLineColors;
  props.pickingColors = instancePickingColors;

  calculatePosition(props);
}
`;

  // src/solid-polygon-layer/solid-polygon-layer-fragment.glsl.ts
  var solid_polygon_layer_fragment_glsl_default = `#define SHADER_NAME solid-polygon-layer-fragment-shader

precision highp float;

varying vec4 vColor;

void main(void) {
  gl_FragColor = vColor;

  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;

  // src/solid-polygon-layer/solid-polygon-layer.ts
  var DEFAULT_COLOR8 = [0, 0, 0, 255];
  var defaultProps10 = {
    filled: true,
    extruded: false,
    wireframe: false,
    _normalize: true,
    _windingOrder: "CW",
    _full3d: false,
    elevationScale: {
      type: "number",
      min: 0,
      value: 1
    },
    getPolygon: {
      type: "accessor",
      value: (f) => f.polygon
    },
    getElevation: {
      type: "accessor",
      value: 1e3
    },
    getFillColor: {
      type: "accessor",
      value: DEFAULT_COLOR8
    },
    getLineColor: {
      type: "accessor",
      value: DEFAULT_COLOR8
    },
    material: true
  };
  var ATTRIBUTE_TRANSITION2 = {
    enter: (value, chunk) => {
      return chunk.length ? chunk.subarray(chunk.length - value.length) : value;
    }
  };
  var SolidPolygonLayer = class extends import_core28.Layer {
    getShaders(type) {
      return super.getShaders({
        vs: type === "top" ? solid_polygon_layer_vertex_top_glsl_default : solid_polygon_layer_vertex_side_glsl_default,
        fs: solid_polygon_layer_fragment_glsl_default,
        defines: {
          RING_WINDING_ORDER_CW: !this.props._normalize && this.props._windingOrder === "CCW" ? 0 : 1
        },
        modules: [import_core28.project32, import_core28.gouraudLighting, import_core28.picking]
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
      if (viewport.isGeospatial && coordinateSystem === import_core28.COORDINATE_SYSTEM.DEFAULT) {
        coordinateSystem = import_core28.COORDINATE_SYSTEM.LNGLAT;
      }
      let preproject;
      if (coordinateSystem === import_core28.COORDINATE_SYSTEM.LNGLAT) {
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
          IndexType: !gl || (0, import_core29.hasFeatures)(gl, import_core29.FEATURES.ELEMENT_INDEX_UINT32) ? Uint32Array : Uint16Array
        })
      });
      const attributeManager = this.getAttributeManager();
      const noAlloc = true;
      attributeManager.remove(["instancePickingColors"]);
      attributeManager.add({
        indices: {
          size: 1,
          isIndexed: true,
          update: this.calculateIndices,
          noAlloc
        },
        positions: {
          size: 3,
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          transition: ATTRIBUTE_TRANSITION2,
          accessor: "getPolygon",
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
          type: esm_default.UNSIGNED_BYTE,
          update: this.calculateVertexValid,
          noAlloc
        },
        elevations: {
          size: 1,
          transition: ATTRIBUTE_TRANSITION2,
          accessor: "getElevation",
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
          type: esm_default.UNSIGNED_BYTE,
          normalized: true,
          transition: ATTRIBUTE_TRANSITION2,
          accessor: "getFillColor",
          defaultValue: DEFAULT_COLOR8,
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
          type: esm_default.UNSIGNED_BYTE,
          normalized: true,
          transition: ATTRIBUTE_TRANSITION2,
          accessor: "getLineColor",
          defaultValue: DEFAULT_COLOR8,
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
          type: esm_default.UNSIGNED_BYTE,
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
        info.object = data.find((d) => d.__source.index === index);
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
      const renderUniforms = {
        ...uniforms,
        extruded: Boolean(extruded),
        elevationScale
      };
      if (sideModel) {
        sideModel.setInstanceCount(polygonTesselator.instanceCount - 1);
        sideModel.setUniforms(renderUniforms);
        if (wireframe) {
          sideModel.setDrawMode(esm_default.LINE_STRIP);
          sideModel.setUniforms({
            isWireframe: true
          }).draw();
        }
        if (filled) {
          sideModel.setDrawMode(esm_default.TRIANGLE_FAN);
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
        this.state.models?.forEach((model) => model.delete());
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
        const shaders = this.getShaders("top");
        shaders.defines.NON_INSTANCED_MODEL = 1;
        topModel = new import_core29.Model(gl, {
          ...shaders,
          id: `${id}-top`,
          drawMode: esm_default.TRIANGLES,
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
        sideModel = new import_core29.Model(gl, {
          ...this.getShaders("side"),
          id: `${id}-side`,
          geometry: new import_core29.Geometry({
            drawMode: esm_default.LINES,
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
      attribute.value = polygonTesselator.get("indices");
    }
    calculatePositions(attribute) {
      const {
        polygonTesselator
      } = this.state;
      attribute.startIndices = polygonTesselator.vertexStarts;
      attribute.value = polygonTesselator.get("positions");
    }
    calculateVertexValid(attribute) {
      attribute.value = this.state.polygonTesselator.get("vertexValid");
    }
  };
  __publicField(SolidPolygonLayer, "defaultProps", defaultProps10);
  __publicField(SolidPolygonLayer, "layerName", "SolidPolygonLayer");

  // src/utils.ts
  function replaceInRange({
    data,
    getIndex,
    dataRange,
    replace
  }) {
    const {
      startRow = 0,
      endRow = Infinity
    } = dataRange;
    const count = data.length;
    let replaceStart = count;
    let replaceEnd = count;
    for (let i = 0; i < count; i++) {
      const row = getIndex(data[i]);
      if (replaceStart > i && row >= startRow) {
        replaceStart = i;
      }
      if (row >= endRow) {
        replaceEnd = i;
        break;
      }
    }
    let index = replaceStart;
    const dataLengthChanged = replaceEnd - replaceStart !== replace.length;
    const endChunk = dataLengthChanged ? data.slice(replaceEnd) : void 0;
    for (let i = 0; i < replace.length; i++) {
      data[index++] = replace[i];
    }
    if (endChunk) {
      for (let i = 0; i < endChunk.length; i++) {
        data[index++] = endChunk[i];
      }
      data.length = index;
    }
    return {
      startRow: replaceStart,
      endRow: replaceStart + replace.length
    };
  }

  // src/polygon-layer/polygon-layer.ts
  var defaultLineColor = [0, 0, 0, 255];
  var defaultFillColor = [0, 0, 0, 255];
  var defaultProps11 = {
    stroked: true,
    filled: true,
    extruded: false,
    elevationScale: 1,
    wireframe: false,
    _normalize: true,
    _windingOrder: "CW",
    lineWidthUnits: "meters",
    lineWidthScale: 1,
    lineWidthMinPixels: 0,
    lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
    lineJointRounded: false,
    lineMiterLimit: 4,
    getPolygon: {
      type: "accessor",
      value: (f) => f.polygon
    },
    getFillColor: {
      type: "accessor",
      value: defaultFillColor
    },
    getLineColor: {
      type: "accessor",
      value: defaultLineColor
    },
    getLineWidth: {
      type: "accessor",
      value: 1
    },
    getElevation: {
      type: "accessor",
      value: 1e3
    },
    material: true
  };
  var PolygonLayer = class extends import_core30.CompositeLayer {
    initializeState() {
      this.state = {
        paths: []
      };
      if (this.props.getLineDashArray) {
        import_core30.log.removed("getLineDashArray", "PathStyleExtension")();
      }
    }
    updateState({
      changeFlags
    }) {
      const geometryChanged = changeFlags.dataChanged || changeFlags.updateTriggersChanged && (changeFlags.updateTriggersChanged.all || changeFlags.updateTriggersChanged.getPolygon);
      if (geometryChanged && Array.isArray(changeFlags.dataChanged)) {
        const paths = this.state.paths.slice();
        const pathsDiff = changeFlags.dataChanged.map((dataRange) => replaceInRange({
          data: paths,
          getIndex: (p) => p.__source.index,
          dataRange,
          replace: this._getPaths(dataRange)
        }));
        this.setState({
          paths,
          pathsDiff
        });
      } else if (geometryChanged) {
        this.setState({
          paths: this._getPaths(),
          pathsDiff: null
        });
      }
    }
    _getPaths(dataRange = {}) {
      const {
        data,
        getPolygon,
        positionFormat,
        _normalize
      } = this.props;
      const paths = [];
      const positionSize = positionFormat === "XY" ? 2 : 3;
      const {
        startRow,
        endRow
      } = dataRange;
      const {
        iterable,
        objectInfo
      } = (0, import_core30.createIterable)(data, startRow, endRow);
      for (const object of iterable) {
        objectInfo.index++;
        let polygon = getPolygon(object, objectInfo);
        if (_normalize) {
          polygon = normalize(polygon, positionSize);
        }
        const {
          holeIndices
        } = polygon;
        const positions = polygon.positions || polygon;
        if (holeIndices) {
          for (let i = 0; i <= holeIndices.length; i++) {
            const path = positions.slice(holeIndices[i - 1] || 0, holeIndices[i] || positions.length);
            paths.push(this.getSubLayerRow({
              path
            }, object, objectInfo.index));
          }
        } else {
          paths.push(this.getSubLayerRow({
            path: positions
          }, object, objectInfo.index));
        }
      }
      return paths;
    }
    renderLayers() {
      const {
        data,
        _dataDiff,
        stroked,
        filled,
        extruded,
        wireframe,
        _normalize,
        _windingOrder,
        elevationScale,
        transitions,
        positionFormat
      } = this.props;
      const {
        lineWidthUnits,
        lineWidthScale,
        lineWidthMinPixels,
        lineWidthMaxPixels,
        lineJointRounded,
        lineMiterLimit,
        lineDashJustified
      } = this.props;
      const {
        getFillColor,
        getLineColor,
        getLineWidth,
        getLineDashArray,
        getElevation,
        getPolygon,
        updateTriggers,
        material
      } = this.props;
      const {
        paths,
        pathsDiff
      } = this.state;
      const FillLayer = this.getSubLayerClass("fill", SolidPolygonLayer);
      const StrokeLayer = this.getSubLayerClass("stroke", PathLayer);
      const polygonLayer = this.shouldRenderSubLayer("fill", paths) && new FillLayer({
        _dataDiff,
        extruded,
        elevationScale,
        filled,
        wireframe,
        _normalize,
        _windingOrder,
        getElevation,
        getFillColor,
        getLineColor: extruded && wireframe ? getLineColor : defaultLineColor,
        material,
        transitions
      }, this.getSubLayerProps({
        id: "fill",
        updateTriggers: updateTriggers && {
          getPolygon: updateTriggers.getPolygon,
          getElevation: updateTriggers.getElevation,
          getFillColor: updateTriggers.getFillColor,
          lineColors: extruded && wireframe,
          getLineColor: updateTriggers.getLineColor
        }
      }), {
        data,
        positionFormat,
        getPolygon
      });
      const polygonLineLayer = !extruded && stroked && this.shouldRenderSubLayer("stroke", paths) && new StrokeLayer({
        _dataDiff: pathsDiff && (() => pathsDiff),
        widthUnits: lineWidthUnits,
        widthScale: lineWidthScale,
        widthMinPixels: lineWidthMinPixels,
        widthMaxPixels: lineWidthMaxPixels,
        jointRounded: lineJointRounded,
        miterLimit: lineMiterLimit,
        dashJustified: lineDashJustified,
        _pathType: "loop",
        transitions: transitions && {
          getWidth: transitions.getLineWidth,
          getColor: transitions.getLineColor,
          getPath: transitions.getPolygon
        },
        getColor: this.getSubLayerAccessor(getLineColor),
        getWidth: this.getSubLayerAccessor(getLineWidth),
        getDashArray: this.getSubLayerAccessor(getLineDashArray)
      }, this.getSubLayerProps({
        id: "stroke",
        updateTriggers: updateTriggers && {
          getWidth: updateTriggers.getLineWidth,
          getColor: updateTriggers.getLineColor,
          getDashArray: updateTriggers.getLineDashArray
        }
      }), {
        data: paths,
        positionFormat,
        getPath: (x) => x.path
      });
      return [
        !extruded && polygonLayer,
        polygonLineLayer,
        extruded && polygonLayer
      ];
    }
  };
  __publicField(PolygonLayer, "layerName", "PolygonLayer");
  __publicField(PolygonLayer, "defaultProps", defaultProps11);

  // src/geojson-layer/geojson-layer.ts
  var import_core38 = __toESM(require_core());

  // src/geojson-layer/geojson-binary.ts
  function binaryToFeatureForAccesor(data, index) {
    if (!data) {
      return null;
    }
    const featureIndex = "startIndices" in data ? data.startIndices[index] : index;
    const geometryIndex = data.featureIds.value[featureIndex];
    if (featureIndex !== -1) {
      return getPropertiesForIndex(data, geometryIndex, featureIndex);
    }
    return null;
  }
  function getPropertiesForIndex(data, propertiesIndex, numericPropsIndex) {
    const feature = {
      properties: {
        ...data.properties[propertiesIndex]
      }
    };
    for (const prop in data.numericProps) {
      feature.properties[prop] = data.numericProps[prop].value[numericPropsIndex];
    }
    return feature;
  }
  function calculatePickingColors(geojsonBinary, encodePickingColor) {
    const pickingColors = {
      points: null,
      lines: null,
      polygons: null
    };
    for (const key in pickingColors) {
      const featureIds = geojsonBinary[key].globalFeatureIds.value;
      pickingColors[key] = new Uint8ClampedArray(featureIds.length * 3);
      const pickingColor = [];
      for (let i = 0; i < featureIds.length; i++) {
        encodePickingColor(featureIds[i], pickingColor);
        pickingColors[key][i * 3 + 0] = pickingColor[0];
        pickingColors[key][i * 3 + 1] = pickingColor[1];
        pickingColors[key][i * 3 + 2] = pickingColor[2];
      }
    }
    return pickingColors;
  }

  // src/text-layer/text-layer.ts
  var import_core36 = __toESM(require_core());

  // src/text-layer/multi-icon-layer/multi-icon-layer.ts
  var import_core31 = __toESM(require_core());

  // src/text-layer/multi-icon-layer/multi-icon-layer-fragment.glsl.ts
  var multi_icon_layer_fragment_glsl_default = `#define SHADER_NAME multi-icon-layer-fragment-shader

precision highp float;

uniform float opacity;
uniform sampler2D iconsTexture;
uniform float gamma;
uniform bool sdf;
uniform float alphaCutoff;
uniform float sdfBuffer;
uniform float outlineBuffer;
uniform vec4 outlineColor;

varying vec4 vColor;
varying vec2 vTextureCoords;
varying vec2 uv;

void main(void) {
  geometry.uv = uv;

  if (!picking_uActive) {
    float alpha = texture2D(iconsTexture, vTextureCoords).a;
    vec4 color = vColor;

    // if enable sdf (signed distance fields)
    if (sdf) {
      float distance = alpha;
      alpha = smoothstep(sdfBuffer - gamma, sdfBuffer + gamma, distance);

      if (outlineBuffer > 0.0) {
        float inFill = alpha;
        float inBorder = smoothstep(outlineBuffer - gamma, outlineBuffer + gamma, distance);
        color = mix(outlineColor, vColor, inFill);
        alpha = inBorder;
      }
    }

    // Take the global opacity and the alpha from color into account for the alpha component
    float a = alpha * color.a;
    
    if (a < alphaCutoff) {
      discard;
    }

    gl_FragColor = vec4(color.rgb, a * opacity);
  }

  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;

  // src/text-layer/multi-icon-layer/multi-icon-layer.ts
  var DEFAULT_BUFFER2 = 192 / 256;
  var EMPTY_ARRAY = [];
  var defaultProps12 = {
    getIconOffsets: {
      type: "accessor",
      value: (x) => x.offsets
    },
    alphaCutoff: 1e-3,
    smoothing: 0.1,
    outlineWidth: 0,
    outlineColor: {
      type: "color",
      value: [0, 0, 0, 255]
    }
  };
  var MultiIconLayer = class extends IconLayer {
    getShaders() {
      return {
        ...super.getShaders(),
        fs: multi_icon_layer_fragment_glsl_default
      };
    }
    initializeState() {
      super.initializeState();
      const attributeManager = this.getAttributeManager();
      attributeManager.addInstanced({
        instanceOffsets: {
          size: 2,
          accessor: "getIconOffsets"
        },
        instancePickingColors: {
          type: esm_default.UNSIGNED_BYTE,
          size: 3,
          accessor: (object, {
            index,
            target: value
          }) => this.encodePickingColor(index, value)
        }
      });
    }
    updateState(params) {
      super.updateState(params);
      const {
        props,
        oldProps
      } = params;
      let {
        outlineColor
      } = props;
      if (outlineColor !== oldProps.outlineColor) {
        outlineColor = outlineColor.map((x) => x / 255);
        outlineColor[3] = Number.isFinite(outlineColor[3]) ? outlineColor[3] : 1;
        this.setState({
          outlineColor
        });
      }
      if (!props.sdf && props.outlineWidth) {
        import_core31.log.warn(`${this.id}: fontSettings.sdf is required to render outline`)();
      }
    }
    draw(params) {
      const {
        sdf,
        smoothing,
        outlineWidth
      } = this.props;
      const {
        outlineColor
      } = this.state;
      const outlineBuffer = outlineWidth ? Math.max(smoothing, DEFAULT_BUFFER2 * (1 - outlineWidth)) : -1;
      params.uniforms = {
        ...params.uniforms,
        sdfBuffer: DEFAULT_BUFFER2,
        outlineBuffer,
        gamma: smoothing,
        sdf: Boolean(sdf),
        outlineColor
      };
      super.draw(params);
      if (sdf && outlineWidth) {
        const {
          iconManager
        } = this.state;
        const iconsTexture = iconManager.getTexture();
        if (iconsTexture) {
          this.state.model.draw({
            uniforms: {
              outlineBuffer: DEFAULT_BUFFER2
            }
          });
        }
      }
    }
    getInstanceOffset(icons) {
      return icons ? Array.from(icons).flatMap((icon) => super.getInstanceOffset(icon)) : EMPTY_ARRAY;
    }
    getInstanceColorMode(icons) {
      return 1;
    }
    getInstanceIconFrame(icons) {
      return icons ? Array.from(icons).flatMap((icon) => super.getInstanceIconFrame(icon)) : EMPTY_ARRAY;
    }
  };
  __publicField(MultiIconLayer, "defaultProps", defaultProps12);
  __publicField(MultiIconLayer, "layerName", "MultiIconLayer");

  // ../../node_modules/@mapbox/tiny-sdf/index.js
  var INF = 1e20;
  var TinySDF = class {
    constructor({
      fontSize = 24,
      buffer = 3,
      radius = 8,
      cutoff = 0.25,
      fontFamily = "sans-serif",
      fontWeight = "normal",
      fontStyle = "normal"
    } = {}) {
      this.buffer = buffer;
      this.cutoff = cutoff;
      this.radius = radius;
      const size = this.size = fontSize + buffer * 4;
      const canvas = this._createCanvas(size);
      const ctx = this.ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      ctx.fillStyle = "black";
      this.gridOuter = new Float64Array(size * size);
      this.gridInner = new Float64Array(size * size);
      this.f = new Float64Array(size);
      this.z = new Float64Array(size + 1);
      this.v = new Uint16Array(size);
    }
    _createCanvas(size) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      return canvas;
    }
    draw(char) {
      const {
        width: glyphAdvance,
        actualBoundingBoxAscent,
        actualBoundingBoxDescent,
        actualBoundingBoxLeft,
        actualBoundingBoxRight
      } = this.ctx.measureText(char);
      const glyphTop = Math.ceil(actualBoundingBoxAscent);
      const glyphLeft = 0;
      const glyphWidth = Math.min(this.size - this.buffer, Math.ceil(actualBoundingBoxRight - actualBoundingBoxLeft));
      const glyphHeight = Math.min(this.size - this.buffer, glyphTop + Math.ceil(actualBoundingBoxDescent));
      const width = glyphWidth + 2 * this.buffer;
      const height = glyphHeight + 2 * this.buffer;
      const len = Math.max(width * height, 0);
      const data = new Uint8ClampedArray(len);
      const glyph = { data, width, height, glyphWidth, glyphHeight, glyphTop, glyphLeft, glyphAdvance };
      if (glyphWidth === 0 || glyphHeight === 0)
        return glyph;
      const { ctx, buffer, gridInner, gridOuter } = this;
      ctx.clearRect(buffer, buffer, glyphWidth, glyphHeight);
      ctx.fillText(char, buffer, buffer + glyphTop);
      const imgData = ctx.getImageData(buffer, buffer, glyphWidth, glyphHeight);
      gridOuter.fill(INF, 0, len);
      gridInner.fill(0, 0, len);
      for (let y = 0; y < glyphHeight; y++) {
        for (let x = 0; x < glyphWidth; x++) {
          const a = imgData.data[4 * (y * glyphWidth + x) + 3] / 255;
          if (a === 0)
            continue;
          const j = (y + buffer) * width + x + buffer;
          if (a === 1) {
            gridOuter[j] = 0;
            gridInner[j] = INF;
          } else {
            const d = 0.5 - a;
            gridOuter[j] = d > 0 ? d * d : 0;
            gridInner[j] = d < 0 ? d * d : 0;
          }
        }
      }
      edt(gridOuter, 0, 0, width, height, width, this.f, this.v, this.z);
      edt(gridInner, buffer, buffer, glyphWidth, glyphHeight, width, this.f, this.v, this.z);
      for (let i = 0; i < len; i++) {
        const d = Math.sqrt(gridOuter[i]) - Math.sqrt(gridInner[i]);
        data[i] = Math.round(255 - 255 * (d / this.radius + this.cutoff));
      }
      return glyph;
    }
  };
  function edt(data, x0, y0, width, height, gridSize, f, v, z) {
    for (let x = x0; x < x0 + width; x++)
      edt1d(data, y0 * gridSize + x, gridSize, height, f, v, z);
    for (let y = y0; y < y0 + height; y++)
      edt1d(data, y * gridSize + x0, 1, width, f, v, z);
  }
  function edt1d(grid, offset, stride, length, f, v, z) {
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;
    f[0] = grid[offset];
    for (let q = 1, k = 0, s = 0; q < length; q++) {
      f[q] = grid[offset + q * stride];
      const q2 = q * q;
      do {
        const r = v[k];
        s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2;
      } while (s <= z[k] && --k > -1);
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = INF;
    }
    for (let q = 0, k = 0; q < length; q++) {
      while (z[k + 1] < q)
        k++;
      const r = v[k];
      const qr = q - r;
      grid[offset + q * stride] = f[r] + qr * qr;
    }
  }

  // src/text-layer/font-atlas-manager.ts
  var import_core33 = __toESM(require_core());

  // src/text-layer/utils.ts
  var import_core32 = __toESM(require_core());
  var MISSING_CHAR_WIDTH = 32;
  var SINGLE_LINE = [];
  function nextPowOfTwo2(number) {
    return Math.pow(2, Math.ceil(Math.log2(number)));
  }
  function buildMapping2({
    characterSet,
    getFontWidth,
    fontHeight,
    buffer,
    maxCanvasWidth,
    mapping = {},
    xOffset = 0,
    yOffset = 0
  }) {
    let row = 0;
    let x = xOffset;
    const rowHeight = fontHeight + buffer * 2;
    for (const char of characterSet) {
      if (!mapping[char]) {
        const width = getFontWidth(char);
        if (x + width + buffer * 2 > maxCanvasWidth) {
          x = 0;
          row++;
        }
        mapping[char] = {
          x: x + buffer,
          y: yOffset + row * rowHeight + buffer,
          width,
          height: rowHeight,
          layoutWidth: width,
          layoutHeight: fontHeight
        };
        x += width + buffer * 2;
      }
    }
    return {
      mapping,
      xOffset: x,
      yOffset: yOffset + row * rowHeight,
      canvasHeight: nextPowOfTwo2(yOffset + (row + 1) * rowHeight)
    };
  }
  function getTextWidth(text, startIndex, endIndex, mapping) {
    let width = 0;
    for (let i = startIndex; i < endIndex; i++) {
      const character = text[i];
      width += mapping[character]?.layoutWidth || 0;
    }
    return width;
  }
  function breakAll(text, startIndex, endIndex, maxWidth, iconMapping, target) {
    let rowStartCharIndex = startIndex;
    let rowOffsetLeft = 0;
    for (let i = startIndex; i < endIndex; i++) {
      const textWidth = getTextWidth(text, i, i + 1, iconMapping);
      if (rowOffsetLeft + textWidth > maxWidth) {
        if (rowStartCharIndex < i) {
          target.push(i);
        }
        rowStartCharIndex = i;
        rowOffsetLeft = 0;
      }
      rowOffsetLeft += textWidth;
    }
    return rowOffsetLeft;
  }
  function breakWord(text, startIndex, endIndex, maxWidth, iconMapping, target) {
    let rowStartCharIndex = startIndex;
    let groupStartCharIndex = startIndex;
    let groupEndCharIndex = startIndex;
    let rowOffsetLeft = 0;
    for (let i = startIndex; i < endIndex; i++) {
      if (text[i] === " ") {
        groupEndCharIndex = i + 1;
      } else if (text[i + 1] === " " || i + 1 === endIndex) {
        groupEndCharIndex = i + 1;
      }
      if (groupEndCharIndex > groupStartCharIndex) {
        let groupWidth = getTextWidth(text, groupStartCharIndex, groupEndCharIndex, iconMapping);
        if (rowOffsetLeft + groupWidth > maxWidth) {
          if (rowStartCharIndex < groupStartCharIndex) {
            target.push(groupStartCharIndex);
            rowStartCharIndex = groupStartCharIndex;
            rowOffsetLeft = 0;
          }
          if (groupWidth > maxWidth) {
            groupWidth = breakAll(text, groupStartCharIndex, groupEndCharIndex, maxWidth, iconMapping, target);
            rowStartCharIndex = target[target.length - 1];
          }
        }
        groupStartCharIndex = groupEndCharIndex;
        rowOffsetLeft += groupWidth;
      }
    }
    return rowOffsetLeft;
  }
  function autoWrapping(text, wordBreak, maxWidth, iconMapping, startIndex = 0, endIndex) {
    if (endIndex === void 0) {
      endIndex = text.length;
    }
    const result = [];
    if (wordBreak === "break-all") {
      breakAll(text, startIndex, endIndex, maxWidth, iconMapping, result);
    } else {
      breakWord(text, startIndex, endIndex, maxWidth, iconMapping, result);
    }
    return result;
  }
  function transformRow(line, startIndex, endIndex, iconMapping, leftOffsets, rowSize) {
    let x = 0;
    let rowHeight = 0;
    for (let i = startIndex; i < endIndex; i++) {
      const character = line[i];
      const frame = iconMapping[character];
      if (frame) {
        if (!rowHeight) {
          rowHeight = frame.layoutHeight;
        }
        leftOffsets[i] = x + frame.layoutWidth / 2;
        x += frame.layoutWidth;
      } else {
        import_core32.log.warn(`Missing character: ${character} (${character.codePointAt(0)})`)();
        leftOffsets[i] = x;
        x += MISSING_CHAR_WIDTH;
      }
    }
    rowSize[0] = x;
    rowSize[1] = rowHeight;
  }
  function transformParagraph(paragraph, lineHeight, wordBreak, maxWidth, iconMapping) {
    const characters = Array.from(paragraph);
    const numCharacters = characters.length;
    const x = new Array(numCharacters);
    const y = new Array(numCharacters);
    const rowWidth = new Array(numCharacters);
    const autoWrappingEnabled = (wordBreak === "break-word" || wordBreak === "break-all") && isFinite(maxWidth) && maxWidth > 0;
    const size = [0, 0];
    const rowSize = [0, 0];
    let rowOffsetTop = 0;
    let lineStartIndex = 0;
    let lineEndIndex = 0;
    for (let i = 0; i <= numCharacters; i++) {
      const char = characters[i];
      if (char === "\n" || i === numCharacters) {
        lineEndIndex = i;
      }
      if (lineEndIndex > lineStartIndex) {
        const rows = autoWrappingEnabled ? autoWrapping(characters, wordBreak, maxWidth, iconMapping, lineStartIndex, lineEndIndex) : SINGLE_LINE;
        for (let rowIndex = 0; rowIndex <= rows.length; rowIndex++) {
          const rowStart = rowIndex === 0 ? lineStartIndex : rows[rowIndex - 1];
          const rowEnd = rowIndex < rows.length ? rows[rowIndex] : lineEndIndex;
          transformRow(characters, rowStart, rowEnd, iconMapping, x, rowSize);
          for (let j = rowStart; j < rowEnd; j++) {
            const char2 = characters[j];
            const layoutOffsetY = iconMapping[char2]?.layoutOffsetY || 0;
            y[j] = rowOffsetTop + rowSize[1] / 2 + layoutOffsetY;
            rowWidth[j] = rowSize[0];
          }
          rowOffsetTop = rowOffsetTop + rowSize[1] * lineHeight;
          size[0] = Math.max(size[0], rowSize[0]);
        }
        lineStartIndex = lineEndIndex;
      }
      if (char === "\n") {
        x[lineStartIndex] = 0;
        y[lineStartIndex] = 0;
        rowWidth[lineStartIndex] = 0;
        lineStartIndex++;
      }
    }
    size[1] = rowOffsetTop;
    return {
      x,
      y,
      rowWidth,
      size
    };
  }
  function getTextFromBuffer({
    value,
    length,
    stride,
    offset,
    startIndices,
    characterSet
  }) {
    const bytesPerElement = value.BYTES_PER_ELEMENT;
    const elementStride = stride ? stride / bytesPerElement : 1;
    const elementOffset = offset ? offset / bytesPerElement : 0;
    const characterCount = startIndices[length] || Math.ceil((value.length - elementOffset) / elementStride);
    const autoCharacterSet = characterSet && /* @__PURE__ */ new Set();
    const texts = new Array(length);
    let codes = value;
    if (elementStride > 1 || elementOffset > 0) {
      const ArrayType = value.constructor;
      codes = new ArrayType(characterCount);
      for (let i = 0; i < characterCount; i++) {
        codes[i] = value[i * elementStride + elementOffset];
      }
    }
    for (let index = 0; index < length; index++) {
      const startIndex = startIndices[index];
      const endIndex = startIndices[index + 1] || characterCount;
      const codesAtIndex = codes.subarray(startIndex, endIndex);
      texts[index] = String.fromCodePoint.apply(null, codesAtIndex);
      if (autoCharacterSet) {
        codesAtIndex.forEach(autoCharacterSet.add, autoCharacterSet);
      }
    }
    if (autoCharacterSet) {
      for (const charCode of autoCharacterSet) {
        characterSet.add(String.fromCodePoint(charCode));
      }
    }
    return {
      texts,
      characterCount
    };
  }

  // src/text-layer/lru-cache.ts
  var LRUCache = class {
    _cache = {};
    _order = [];
    constructor(limit = 5) {
      this.limit = limit;
    }
    get(key) {
      const value = this._cache[key];
      if (value) {
        this._deleteOrder(key);
        this._appendOrder(key);
      }
      return value;
    }
    set(key, value) {
      if (!this._cache[key]) {
        if (Object.keys(this._cache).length === this.limit) {
          this.delete(this._order[0]);
        }
        this._cache[key] = value;
        this._appendOrder(key);
      } else {
        this.delete(key);
        this._cache[key] = value;
        this._appendOrder(key);
      }
    }
    delete(key) {
      const value = this._cache[key];
      if (value) {
        delete this._cache[key];
        this._deleteOrder(key);
      }
    }
    _deleteOrder(key) {
      const index = this._order.indexOf(key);
      if (index >= 0) {
        this._order.splice(index, 1);
      }
    }
    _appendOrder(key) {
      this._order.push(key);
    }
  };

  // src/text-layer/font-atlas-manager.ts
  function getDefaultCharacterSet() {
    const charSet = [];
    for (let i = 32; i < 128; i++) {
      charSet.push(String.fromCharCode(i));
    }
    return charSet;
  }
  var DEFAULT_FONT_SETTINGS = {
    fontFamily: "Monaco, monospace",
    fontWeight: "normal",
    characterSet: getDefaultCharacterSet(),
    fontSize: 64,
    buffer: 4,
    sdf: false,
    cutoff: 0.25,
    radius: 12,
    smoothing: 0.1
  };
  var MAX_CANVAS_WIDTH = 1024;
  var BASELINE_SCALE = 0.9;
  var HEIGHT_SCALE = 1.2;
  var CACHE_LIMIT = 3;
  var cache = new LRUCache(CACHE_LIMIT);
  function getNewChars(cacheKey, characterSet) {
    let newCharSet;
    if (typeof characterSet === "string") {
      newCharSet = new Set(Array.from(characterSet));
    } else {
      newCharSet = new Set(characterSet);
    }
    const cachedFontAtlas = cache.get(cacheKey);
    if (!cachedFontAtlas) {
      return newCharSet;
    }
    for (const char in cachedFontAtlas.mapping) {
      if (newCharSet.has(char)) {
        newCharSet.delete(char);
      }
    }
    return newCharSet;
  }
  function populateAlphaChannel(alphaChannel, imageData) {
    for (let i = 0; i < alphaChannel.length; i++) {
      imageData.data[4 * i + 3] = alphaChannel[i];
    }
  }
  function setTextStyle(ctx, fontFamily, fontSize, fontWeight) {
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = "#000";
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
  }
  function setFontAtlasCacheLimit(limit) {
    import_core33.log.assert(Number.isFinite(limit) && limit >= CACHE_LIMIT, "Invalid cache limit");
    cache = new LRUCache(limit);
  }
  var FontAtlasManager = class {
    props = {
      ...DEFAULT_FONT_SETTINGS
    };
    get texture() {
      return this._atlas;
    }
    get mapping() {
      return this._atlas && this._atlas.mapping;
    }
    get scale() {
      const {
        fontSize,
        buffer
      } = this.props;
      return (fontSize * HEIGHT_SCALE + buffer * 2) / fontSize;
    }
    setProps(props = {}) {
      Object.assign(this.props, props);
      this._key = this._getKey();
      const charSet = getNewChars(this._key, this.props.characterSet);
      const cachedFontAtlas = cache.get(this._key);
      if (cachedFontAtlas && charSet.size === 0) {
        if (this._atlas !== cachedFontAtlas) {
          this._atlas = cachedFontAtlas;
        }
        return;
      }
      const fontAtlas = this._generateFontAtlas(charSet, cachedFontAtlas);
      this._atlas = fontAtlas;
      cache.set(this._key, fontAtlas);
    }
    _generateFontAtlas(characterSet, cachedFontAtlas) {
      const {
        fontFamily,
        fontWeight,
        fontSize,
        buffer,
        sdf,
        radius,
        cutoff
      } = this.props;
      let canvas = cachedFontAtlas && cachedFontAtlas.data;
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.width = MAX_CANVAS_WIDTH;
      }
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true
      });
      setTextStyle(ctx, fontFamily, fontSize, fontWeight);
      const {
        mapping,
        canvasHeight,
        xOffset,
        yOffset
      } = buildMapping2({
        getFontWidth: (char) => ctx.measureText(char).width,
        fontHeight: fontSize * HEIGHT_SCALE,
        buffer,
        characterSet,
        maxCanvasWidth: MAX_CANVAS_WIDTH,
        ...cachedFontAtlas && {
          mapping: cachedFontAtlas.mapping,
          xOffset: cachedFontAtlas.xOffset,
          yOffset: cachedFontAtlas.yOffset
        }
      });
      if (canvas.height !== canvasHeight) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.height = canvasHeight;
        ctx.putImageData(imageData, 0, 0);
      }
      setTextStyle(ctx, fontFamily, fontSize, fontWeight);
      if (sdf) {
        const tinySDF = new TinySDF({
          fontSize,
          buffer,
          radius,
          cutoff,
          fontFamily,
          fontWeight: `${fontWeight}`
        });
        for (const char of characterSet) {
          const {
            data,
            width,
            height,
            glyphTop
          } = tinySDF.draw(char);
          mapping[char].width = width;
          mapping[char].layoutOffsetY = fontSize * BASELINE_SCALE - glyphTop;
          const imageData = ctx.createImageData(width, height);
          populateAlphaChannel(data, imageData);
          ctx.putImageData(imageData, mapping[char].x, mapping[char].y);
        }
      } else {
        for (const char of characterSet) {
          ctx.fillText(char, mapping[char].x, mapping[char].y + buffer + fontSize * BASELINE_SCALE);
        }
      }
      return {
        xOffset,
        yOffset,
        mapping,
        data: canvas,
        width: canvas.width,
        height: canvas.height
      };
    }
    _getKey() {
      const {
        fontFamily,
        fontWeight,
        fontSize,
        buffer,
        sdf,
        radius,
        cutoff
      } = this.props;
      if (sdf) {
        return `${fontFamily} ${fontWeight} ${fontSize} ${buffer} ${radius} ${cutoff}`;
      }
      return `${fontFamily} ${fontWeight} ${fontSize} ${buffer}`;
    }
  };

  // src/text-layer/text-background-layer/text-background-layer.ts
  var import_core34 = __toESM(require_core());
  var import_core35 = __toESM(require_core2());

  // src/text-layer/text-background-layer/text-background-layer-vertex.glsl.ts
  var text_background_layer_vertex_glsl_default = `#define SHADER_NAME text-background-layer-vertex-shader

attribute vec2 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute vec4 instanceRects;
attribute float instanceSizes;
attribute float instanceAngles;
attribute vec2 instancePixelOffsets;
attribute float instanceLineWidths;
attribute vec4 instanceFillColors;
attribute vec4 instanceLineColors;
attribute vec3 instancePickingColors;

uniform bool billboard;
uniform float opacity;
uniform float sizeScale;
uniform float sizeMinPixels;
uniform float sizeMaxPixels;
uniform vec4 padding;
uniform int sizeUnits;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying float vLineWidth;
varying vec2 uv;
varying vec2 dimensions;

vec2 rotate_by_angle(vec2 vertex, float angle) {
  float angle_radian = radians(angle);
  float cos_angle = cos(angle_radian);
  float sin_angle = sin(angle_radian);
  mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
  return rotationMatrix * vertex;
}

void main(void) {
  geometry.worldPosition = instancePositions;
  geometry.uv = positions;
  geometry.pickingColor = instancePickingColors;
  uv = positions;
  vLineWidth = instanceLineWidths;

  // convert size in meters to pixels, then scaled and clamp

  // project meters to pixels and clamp to limits
  float sizePixels = clamp(
    project_size_to_pixel(instanceSizes * sizeScale, sizeUnits),
    sizeMinPixels, sizeMaxPixels
  );

  dimensions = instanceRects.zw * sizePixels + padding.xy + padding.zw;

  vec2 pixelOffset = (positions * instanceRects.zw + instanceRects.xy) * sizePixels + mix(-padding.xy, padding.zw, positions);
  pixelOffset = rotate_by_angle(pixelOffset, instanceAngles);
  pixelOffset += instancePixelOffsets;
  pixelOffset.y *= -1.0;

  if (billboard)  {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
    vec3 offset = vec3(pixelOffset, 0.0);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
  } else {
    vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);
    DECKGL_FILTER_SIZE(offset_common, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset_common, geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  }

  // Apply opacity to instance color, or return instance picking color
  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);
  DECKGL_FILTER_COLOR(vFillColor, geometry);
  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity);
  DECKGL_FILTER_COLOR(vLineColor, geometry);
}
`;

  // src/text-layer/text-background-layer/text-background-layer-fragment.glsl.ts
  var text_background_layer_fragment_glsl_default = `#define SHADER_NAME text-background-layer-fragment-shader

precision highp float;

uniform bool stroked;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying float vLineWidth;
varying vec2 uv;
varying vec2 dimensions;

void main(void) {
  geometry.uv = uv;

  vec2 pixelPosition = uv * dimensions;
  if (stroked) {
    float distToEdge = min(
      min(pixelPosition.x, dimensions.x - pixelPosition.x),
      min(pixelPosition.y, dimensions.y - pixelPosition.y)
    );
    float isBorder = smoothedge(distToEdge, vLineWidth);
    gl_FragColor = mix(vFillColor, vLineColor, isBorder);
  } else {
    gl_FragColor = vFillColor;
  }

  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;

  // src/text-layer/text-background-layer/text-background-layer.ts
  var defaultProps13 = {
    billboard: true,
    sizeScale: 1,
    sizeUnits: "pixels",
    sizeMinPixels: 0,
    sizeMaxPixels: Number.MAX_SAFE_INTEGER,
    padding: {
      type: "array",
      value: [0, 0, 0, 0]
    },
    getPosition: {
      type: "accessor",
      value: (x) => x.position
    },
    getSize: {
      type: "accessor",
      value: 1
    },
    getAngle: {
      type: "accessor",
      value: 0
    },
    getPixelOffset: {
      type: "accessor",
      value: [0, 0]
    },
    getBoundingRect: {
      type: "accessor",
      value: [0, 0, 0, 0]
    },
    getFillColor: {
      type: "accessor",
      value: [0, 0, 0, 255]
    },
    getLineColor: {
      type: "accessor",
      value: [0, 0, 0, 255]
    },
    getLineWidth: {
      type: "accessor",
      value: 1
    }
  };
  var TextBackgroundLayer = class extends import_core34.Layer {
    getShaders() {
      return super.getShaders({
        vs: text_background_layer_vertex_glsl_default,
        fs: text_background_layer_fragment_glsl_default,
        modules: [import_core34.project32, import_core34.picking]
      });
    }
    initializeState() {
      this.getAttributeManager().addInstanced({
        instancePositions: {
          size: 3,
          type: esm_default.DOUBLE,
          fp64: this.use64bitPositions(),
          transition: true,
          accessor: "getPosition"
        },
        instanceSizes: {
          size: 1,
          transition: true,
          accessor: "getSize",
          defaultValue: 1
        },
        instanceAngles: {
          size: 1,
          transition: true,
          accessor: "getAngle"
        },
        instanceRects: {
          size: 4,
          accessor: "getBoundingRect"
        },
        instancePixelOffsets: {
          size: 2,
          transition: true,
          accessor: "getPixelOffset"
        },
        instanceFillColors: {
          size: 4,
          transition: true,
          normalized: true,
          type: esm_default.UNSIGNED_BYTE,
          accessor: "getFillColor",
          defaultValue: [0, 0, 0, 255]
        },
        instanceLineColors: {
          size: 4,
          transition: true,
          normalized: true,
          type: esm_default.UNSIGNED_BYTE,
          accessor: "getLineColor",
          defaultValue: [0, 0, 0, 255]
        },
        instanceLineWidths: {
          size: 1,
          transition: true,
          accessor: "getLineWidth",
          defaultValue: 1
        }
      });
    }
    updateState(params) {
      super.updateState(params);
      const {
        changeFlags
      } = params;
      if (changeFlags.extensionsChanged) {
        const {
          gl
        } = this.context;
        this.state.model?.delete();
        this.state.model = this._getModel(gl);
        this.getAttributeManager().invalidateAll();
      }
    }
    draw({
      uniforms
    }) {
      const {
        billboard,
        sizeScale,
        sizeUnits,
        sizeMinPixels,
        sizeMaxPixels,
        getLineWidth
      } = this.props;
      let {
        padding
      } = this.props;
      if (padding.length < 4) {
        padding = [padding[0], padding[1], padding[0], padding[1]];
      }
      this.state.model.setUniforms(uniforms).setUniforms({
        billboard,
        stroked: Boolean(getLineWidth),
        padding,
        sizeUnits: import_core34.UNIT[sizeUnits],
        sizeScale,
        sizeMinPixels,
        sizeMaxPixels
      }).draw();
    }
    _getModel(gl) {
      const positions = [0, 0, 1, 0, 1, 1, 0, 1];
      return new import_core35.Model(gl, {
        ...this.getShaders(),
        id: this.props.id,
        geometry: new import_core35.Geometry({
          drawMode: esm_default.TRIANGLE_FAN,
          vertexCount: 4,
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
  };
  __publicField(TextBackgroundLayer, "defaultProps", defaultProps13);
  __publicField(TextBackgroundLayer, "layerName", "TextBackgroundLayer");

  // src/text-layer/text-layer.ts
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
  var DEFAULT_COLOR9 = [0, 0, 0, 255];
  var DEFAULT_LINE_HEIGHT = 1;
  var defaultProps14 = {
    billboard: true,
    sizeScale: 1,
    sizeUnits: "pixels",
    sizeMinPixels: 0,
    sizeMaxPixels: Number.MAX_SAFE_INTEGER,
    background: false,
    getBackgroundColor: {
      type: "accessor",
      value: [255, 255, 255, 255]
    },
    getBorderColor: {
      type: "accessor",
      value: DEFAULT_COLOR9
    },
    getBorderWidth: {
      type: "accessor",
      value: 0
    },
    backgroundPadding: {
      type: "array",
      value: [0, 0, 0, 0]
    },
    characterSet: {
      type: "object",
      value: DEFAULT_FONT_SETTINGS.characterSet
    },
    fontFamily: DEFAULT_FONT_SETTINGS.fontFamily,
    fontWeight: DEFAULT_FONT_SETTINGS.fontWeight,
    lineHeight: DEFAULT_LINE_HEIGHT,
    outlineWidth: {
      type: "number",
      value: 0,
      min: 0
    },
    outlineColor: {
      type: "color",
      value: DEFAULT_COLOR9
    },
    fontSettings: {
      type: "object",
      value: {},
      compare: 1
    },
    wordBreak: "break-word",
    maxWidth: {
      type: "number",
      value: -1
    },
    getText: {
      type: "accessor",
      value: (x) => x.text
    },
    getPosition: {
      type: "accessor",
      value: (x) => x.position
    },
    getColor: {
      type: "accessor",
      value: DEFAULT_COLOR9
    },
    getSize: {
      type: "accessor",
      value: 32
    },
    getAngle: {
      type: "accessor",
      value: 0
    },
    getTextAnchor: {
      type: "accessor",
      value: "middle"
    },
    getAlignmentBaseline: {
      type: "accessor",
      value: "center"
    },
    getPixelOffset: {
      type: "accessor",
      value: [0, 0]
    },
    backgroundColor: {
      deprecatedFor: ["background", "getBackgroundColor"]
    }
  };
  var TextLayer = class extends import_core36.CompositeLayer {
    initializeState() {
      this.state = {
        styleVersion: 0,
        fontAtlasManager: new FontAtlasManager()
      };
      if (this.props.maxWidth > 0) {
        import_core36.log.warn("v8.9 breaking change: TextLayer maxWidth is now relative to text size")();
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
      const fontProps = {
        ...fontSettings,
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
      const {
        data,
        characterSet
      } = this.props;
      const textBuffer = data.attributes?.getText;
      let {
        getText
      } = this.props;
      let startIndices = data.startIndices;
      let numInstances;
      const autoCharacterSet = characterSet === "auto" && /* @__PURE__ */ new Set();
      if (textBuffer && startIndices) {
        const {
          texts,
          characterCount
        } = getTextFromBuffer({
          ...ArrayBuffer.isView(textBuffer) ? {
            value: textBuffer
          } : textBuffer,
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
        } = (0, import_core36.createIterable)(data);
        startIndices = [0];
        numInstances = 0;
        for (const object of iterable) {
          objectInfo.index++;
          const text = Array.from(getText(object, objectInfo) || "");
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
      const paragraph = getText(object, objectInfo) || "";
      return transformParagraph(paragraph, lineHeight, wordBreak, maxWidth * fontAtlasManager.props.fontSize, iconMapping);
    }
    getBoundingRect = (object, objectInfo) => {
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
      const anchorX = TEXT_ANCHOR[typeof getTextAnchor === "function" ? getTextAnchor(object, objectInfo) : getTextAnchor];
      const anchorY = ALIGNMENT_BASELINE[typeof getAlignmentBaseline === "function" ? getAlignmentBaseline(object, objectInfo) : getAlignmentBaseline];
      return [(anchorX - 1) * width / 2, (anchorY - 1) * height / 2, width, height];
    };
    getIconOffsets = (object, objectInfo) => {
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
      const anchorX = TEXT_ANCHOR[typeof getTextAnchor === "function" ? getTextAnchor(object, objectInfo) : getTextAnchor];
      const anchorY = ALIGNMENT_BASELINE[typeof getAlignmentBaseline === "function" ? getAlignmentBaseline(object, objectInfo) : getAlignmentBaseline];
      const numCharacters = x.length;
      const offsets = new Array(numCharacters * 2);
      let index = 0;
      for (let i = 0; i < numCharacters; i++) {
        const rowOffset = (1 - anchorX) * (width - rowWidth[i]) / 2;
        offsets[index++] = (anchorX - 1) * width / 2 + rowOffset + x[i];
        offsets[index++] = (anchorY - 1) * height / 2 + y[i];
      }
      return offsets;
    };
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
      const CharactersLayerClass = this.getSubLayerClass("characters", MultiIconLayer);
      const BackgroundLayerClass = this.getSubLayerClass("background", TextBackgroundLayer);
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
        id: "background",
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
        id: "characters",
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
  };
  __publicField(TextLayer, "defaultProps", defaultProps14);
  __publicField(TextLayer, "layerName", "TextLayer");

  // src/geojson-layer/sub-layer-map.ts
  var POINT_LAYER = {
    circle: {
      type: ScatterplotLayer,
      props: {
        filled: "filled",
        stroked: "stroked",
        lineWidthMaxPixels: "lineWidthMaxPixels",
        lineWidthMinPixels: "lineWidthMinPixels",
        lineWidthScale: "lineWidthScale",
        lineWidthUnits: "lineWidthUnits",
        pointRadiusMaxPixels: "radiusMaxPixels",
        pointRadiusMinPixels: "radiusMinPixels",
        pointRadiusScale: "radiusScale",
        pointRadiusUnits: "radiusUnits",
        pointAntialiasing: "antialiasing",
        pointBillboard: "billboard",
        getFillColor: "getFillColor",
        getLineColor: "getLineColor",
        getLineWidth: "getLineWidth",
        getPointRadius: "getRadius"
      }
    },
    icon: {
      type: IconLayer,
      props: {
        iconAtlas: "iconAtlas",
        iconMapping: "iconMapping",
        iconSizeMaxPixels: "sizeMaxPixels",
        iconSizeMinPixels: "sizeMinPixels",
        iconSizeScale: "sizeScale",
        iconSizeUnits: "sizeUnits",
        iconAlphaCutoff: "alphaCutoff",
        iconBillboard: "billboard",
        getIcon: "getIcon",
        getIconAngle: "getAngle",
        getIconColor: "getColor",
        getIconPixelOffset: "getPixelOffset",
        getIconSize: "getSize"
      }
    },
    text: {
      type: TextLayer,
      props: {
        textSizeMaxPixels: "sizeMaxPixels",
        textSizeMinPixels: "sizeMinPixels",
        textSizeScale: "sizeScale",
        textSizeUnits: "sizeUnits",
        textBackground: "background",
        textBackgroundPadding: "backgroundPadding",
        textFontFamily: "fontFamily",
        textFontWeight: "fontWeight",
        textLineHeight: "lineHeight",
        textMaxWidth: "maxWidth",
        textOutlineColor: "outlineColor",
        textOutlineWidth: "outlineWidth",
        textWordBreak: "wordBreak",
        textCharacterSet: "characterSet",
        textBillboard: "billboard",
        textFontSettings: "fontSettings",
        getText: "getText",
        getTextAngle: "getAngle",
        getTextColor: "getColor",
        getTextPixelOffset: "getPixelOffset",
        getTextSize: "getSize",
        getTextAnchor: "getTextAnchor",
        getTextAlignmentBaseline: "getAlignmentBaseline",
        getTextBackgroundColor: "getBackgroundColor",
        getTextBorderColor: "getBorderColor",
        getTextBorderWidth: "getBorderWidth"
      }
    }
  };
  var LINE_LAYER = {
    type: PathLayer,
    props: {
      lineWidthUnits: "widthUnits",
      lineWidthScale: "widthScale",
      lineWidthMinPixels: "widthMinPixels",
      lineWidthMaxPixels: "widthMaxPixels",
      lineJointRounded: "jointRounded",
      lineCapRounded: "capRounded",
      lineMiterLimit: "miterLimit",
      lineBillboard: "billboard",
      getLineColor: "getColor",
      getLineWidth: "getWidth"
    }
  };
  var POLYGON_LAYER = {
    type: SolidPolygonLayer,
    props: {
      extruded: "extruded",
      filled: "filled",
      wireframe: "wireframe",
      elevationScale: "elevationScale",
      material: "material",
      _full3d: "_full3d",
      getElevation: "getElevation",
      getFillColor: "getFillColor",
      getLineColor: "getLineColor"
    }
  };
  function getDefaultProps({
    type,
    props
  }) {
    const result = {};
    for (const key in props) {
      result[key] = type.defaultProps[props[key]];
    }
    return result;
  }
  function forwardProps(layer, mapping) {
    const {
      transitions,
      updateTriggers
    } = layer.props;
    const result = {
      updateTriggers: {},
      transitions: transitions && {
        getPosition: transitions.geometry
      }
    };
    for (const sourceKey in mapping) {
      const targetKey = mapping[sourceKey];
      let value = layer.props[sourceKey];
      if (sourceKey.startsWith("get")) {
        value = layer.getSubLayerAccessor(value);
        result.updateTriggers[targetKey] = updateTriggers[sourceKey];
        if (transitions) {
          result.transitions[targetKey] = transitions[sourceKey];
        }
      }
      result[targetKey] = value;
    }
    return result;
  }

  // src/geojson-layer/geojson.ts
  var import_core37 = __toESM(require_core());
  function getGeojsonFeatures(geojson) {
    if (Array.isArray(geojson)) {
      return geojson;
    }
    import_core37.log.assert(geojson.type, "GeoJSON does not have type");
    switch (geojson.type) {
      case "Feature":
        return [geojson];
      case "FeatureCollection":
        import_core37.log.assert(Array.isArray(geojson.features), "GeoJSON does not have features array");
        return geojson.features;
      default:
        return [{
          geometry: geojson
        }];
    }
  }
  function separateGeojsonFeatures(features, wrapFeature, dataRange = {}) {
    const separated = {
      pointFeatures: [],
      lineFeatures: [],
      polygonFeatures: [],
      polygonOutlineFeatures: []
    };
    const {
      startRow = 0,
      endRow = features.length
    } = dataRange;
    for (let featureIndex = startRow; featureIndex < endRow; featureIndex++) {
      const feature = features[featureIndex];
      const {
        geometry
      } = feature;
      if (!geometry) {
        continue;
      }
      if (geometry.type === "GeometryCollection") {
        import_core37.log.assert(Array.isArray(geometry.geometries), "GeoJSON does not have geometries array");
        const {
          geometries
        } = geometry;
        for (let i = 0; i < geometries.length; i++) {
          const subGeometry = geometries[i];
          separateGeometry(subGeometry, separated, wrapFeature, feature, featureIndex);
        }
      } else {
        separateGeometry(geometry, separated, wrapFeature, feature, featureIndex);
      }
    }
    return separated;
  }
  function separateGeometry(geometry, separated, wrapFeature, sourceFeature, sourceFeatureIndex) {
    const {
      type,
      coordinates
    } = geometry;
    const {
      pointFeatures,
      lineFeatures,
      polygonFeatures,
      polygonOutlineFeatures
    } = separated;
    if (!validateGeometry(type, coordinates)) {
      import_core37.log.warn(`${type} coordinates are malformed`)();
      return;
    }
    switch (type) {
      case "Point":
        pointFeatures.push(wrapFeature({
          geometry
        }, sourceFeature, sourceFeatureIndex));
        break;
      case "MultiPoint":
        coordinates.forEach((point) => {
          pointFeatures.push(wrapFeature({
            geometry: {
              type: "Point",
              coordinates: point
            }
          }, sourceFeature, sourceFeatureIndex));
        });
        break;
      case "LineString":
        lineFeatures.push(wrapFeature({
          geometry
        }, sourceFeature, sourceFeatureIndex));
        break;
      case "MultiLineString":
        coordinates.forEach((path) => {
          lineFeatures.push(wrapFeature({
            geometry: {
              type: "LineString",
              coordinates: path
            }
          }, sourceFeature, sourceFeatureIndex));
        });
        break;
      case "Polygon":
        polygonFeatures.push(wrapFeature({
          geometry
        }, sourceFeature, sourceFeatureIndex));
        coordinates.forEach((path) => {
          polygonOutlineFeatures.push(wrapFeature({
            geometry: {
              type: "LineString",
              coordinates: path
            }
          }, sourceFeature, sourceFeatureIndex));
        });
        break;
      case "MultiPolygon":
        coordinates.forEach((polygon) => {
          polygonFeatures.push(wrapFeature({
            geometry: {
              type: "Polygon",
              coordinates: polygon
            }
          }, sourceFeature, sourceFeatureIndex));
          polygon.forEach((path) => {
            polygonOutlineFeatures.push(wrapFeature({
              geometry: {
                type: "LineString",
                coordinates: path
              }
            }, sourceFeature, sourceFeatureIndex));
          });
        });
        break;
      default:
    }
  }
  var COORDINATE_NEST_LEVEL = {
    Point: 1,
    MultiPoint: 2,
    LineString: 2,
    MultiLineString: 3,
    Polygon: 3,
    MultiPolygon: 4
  };
  function validateGeometry(type, coordinates) {
    let nestLevel = COORDINATE_NEST_LEVEL[type];
    import_core37.log.assert(nestLevel, `Unknown GeoJSON type ${type}`);
    while (coordinates && --nestLevel > 0) {
      coordinates = coordinates[0];
    }
    return coordinates && Number.isFinite(coordinates[0]);
  }

  // src/geojson-layer/geojson-layer-props.ts
  function createEmptyLayerProps() {
    return {
      points: {},
      lines: {},
      polygons: {},
      polygonsOutline: {}
    };
  }
  function getCoordinates(f) {
    return f.geometry.coordinates;
  }
  function createLayerPropsFromFeatures(features, featuresDiff) {
    const layerProps = createEmptyLayerProps();
    const {
      pointFeatures,
      lineFeatures,
      polygonFeatures,
      polygonOutlineFeatures
    } = features;
    layerProps.points.data = pointFeatures;
    layerProps.points._dataDiff = featuresDiff.pointFeatures && (() => featuresDiff.pointFeatures);
    layerProps.points.getPosition = getCoordinates;
    layerProps.lines.data = lineFeatures;
    layerProps.lines._dataDiff = featuresDiff.lineFeatures && (() => featuresDiff.lineFeatures);
    layerProps.lines.getPath = getCoordinates;
    layerProps.polygons.data = polygonFeatures;
    layerProps.polygons._dataDiff = featuresDiff.polygonFeatures && (() => featuresDiff.polygonFeatures);
    layerProps.polygons.getPolygon = getCoordinates;
    layerProps.polygonsOutline.data = polygonOutlineFeatures;
    layerProps.polygonsOutline._dataDiff = featuresDiff.polygonOutlineFeatures && (() => featuresDiff.polygonOutlineFeatures);
    layerProps.polygonsOutline.getPath = getCoordinates;
    return layerProps;
  }
  function createLayerPropsFromBinary(geojsonBinary, encodePickingColor) {
    const layerProps = createEmptyLayerProps();
    const {
      points,
      lines,
      polygons
    } = geojsonBinary;
    const customPickingColors = calculatePickingColors(geojsonBinary, encodePickingColor);
    layerProps.points.data = {
      length: points.positions.value.length / points.positions.size,
      attributes: {
        ...points.attributes,
        getPosition: points.positions,
        instancePickingColors: {
          size: 3,
          value: customPickingColors.points
        }
      },
      properties: points.properties,
      numericProps: points.numericProps,
      featureIds: points.featureIds
    };
    layerProps.lines.data = {
      length: lines.pathIndices.value.length - 1,
      startIndices: lines.pathIndices.value,
      attributes: {
        ...lines.attributes,
        getPath: lines.positions,
        instancePickingColors: {
          size: 3,
          value: customPickingColors.lines
        }
      },
      properties: lines.properties,
      numericProps: lines.numericProps,
      featureIds: lines.featureIds
    };
    layerProps.lines._pathType = "open";
    layerProps.polygons.data = {
      length: polygons.polygonIndices.value.length - 1,
      startIndices: polygons.polygonIndices.value,
      attributes: {
        ...polygons.attributes,
        getPolygon: polygons.positions,
        pickingColors: {
          size: 3,
          value: customPickingColors.polygons
        }
      },
      properties: polygons.properties,
      numericProps: polygons.numericProps,
      featureIds: polygons.featureIds
    };
    layerProps.polygons._normalize = false;
    if (polygons.triangles) {
      layerProps.polygons.data.attributes.indices = polygons.triangles.value;
    }
    layerProps.polygonsOutline.data = {
      length: polygons.primitivePolygonIndices.value.length - 1,
      startIndices: polygons.primitivePolygonIndices.value,
      attributes: {
        ...polygons.attributes,
        getPath: polygons.positions,
        instancePickingColors: {
          size: 3,
          value: customPickingColors.polygons
        }
      },
      properties: polygons.properties,
      numericProps: polygons.numericProps,
      featureIds: polygons.featureIds
    };
    layerProps.polygonsOutline._pathType = "open";
    return layerProps;
  }

  // src/geojson-layer/geojson-layer.ts
  var FEATURE_TYPES = ["points", "linestrings", "polygons"];
  var defaultProps15 = {
    ...getDefaultProps(POINT_LAYER.circle),
    ...getDefaultProps(POINT_LAYER.icon),
    ...getDefaultProps(POINT_LAYER.text),
    ...getDefaultProps(LINE_LAYER),
    ...getDefaultProps(POLYGON_LAYER),
    stroked: true,
    filled: true,
    extruded: false,
    wireframe: false,
    _full3d: false,
    iconAtlas: {
      type: "object",
      value: null
    },
    iconMapping: {
      type: "object",
      value: {}
    },
    getIcon: {
      type: "accessor",
      value: (f) => f.properties.icon
    },
    getText: {
      type: "accessor",
      value: (f) => f.properties.text
    },
    pointType: "circle",
    getRadius: {
      deprecatedFor: "getPointRadius"
    }
  };
  var GeoJsonLayer = class extends import_core38.CompositeLayer {
    initializeState() {
      this.state = {
        layerProps: {},
        features: {}
      };
    }
    updateState({
      props,
      changeFlags
    }) {
      if (!changeFlags.dataChanged) {
        return;
      }
      const {
        data
      } = this.props;
      const binary = data && "points" in data && "polygons" in data && "lines" in data;
      this.setState({
        binary
      });
      if (binary) {
        this._updateStateBinary({
          props,
          changeFlags
        });
      } else {
        this._updateStateJSON({
          props,
          changeFlags
        });
      }
    }
    _updateStateBinary({
      props,
      changeFlags
    }) {
      const layerProps = createLayerPropsFromBinary(props.data, this.encodePickingColor);
      this.setState({
        layerProps
      });
    }
    _updateStateJSON({
      props,
      changeFlags
    }) {
      const features = getGeojsonFeatures(props.data);
      const wrapFeature = this.getSubLayerRow.bind(this);
      let newFeatures = {};
      const featuresDiff = {};
      if (Array.isArray(changeFlags.dataChanged)) {
        const oldFeatures = this.state.features;
        for (const key in oldFeatures) {
          newFeatures[key] = oldFeatures[key].slice();
          featuresDiff[key] = [];
        }
        for (const dataRange of changeFlags.dataChanged) {
          const partialFeatures = separateGeojsonFeatures(features, wrapFeature, dataRange);
          for (const key in oldFeatures) {
            featuresDiff[key].push(replaceInRange({
              data: newFeatures[key],
              getIndex: (f) => f.__source.index,
              dataRange,
              replace: partialFeatures[key]
            }));
          }
        }
      } else {
        newFeatures = separateGeojsonFeatures(features, wrapFeature);
      }
      const layerProps = createLayerPropsFromFeatures(newFeatures, featuresDiff);
      this.setState({
        features: newFeatures,
        featuresDiff,
        layerProps
      });
    }
    getPickingInfo(params) {
      const info = super.getPickingInfo(params);
      const {
        index,
        sourceLayer
      } = info;
      info.featureType = FEATURE_TYPES.find((ft) => sourceLayer.id.startsWith(`${this.id}-${ft}-`));
      if (index >= 0 && sourceLayer.id.startsWith(`${this.id}-points-text`) && this.state.binary) {
        info.index = this.props.data.points.globalFeatureIds.value[index];
      }
      return info;
    }
    _updateAutoHighlight(info) {
      const pointLayerIdPrefix = `${this.id}-points-`;
      const sourceIsPoints = info.featureType === "points";
      for (const layer of this.getSubLayers()) {
        if (layer.id.startsWith(pointLayerIdPrefix) === sourceIsPoints) {
          layer.updateAutoHighlight(info);
        }
      }
    }
    _renderPolygonLayer() {
      const {
        extruded,
        wireframe
      } = this.props;
      const {
        layerProps
      } = this.state;
      const id = "polygons-fill";
      const PolygonFillLayer = this.shouldRenderSubLayer(id, layerProps.polygons.data) && this.getSubLayerClass(id, POLYGON_LAYER.type);
      if (PolygonFillLayer) {
        const forwardedProps = forwardProps(this, POLYGON_LAYER.props);
        const useLineColor = extruded && wireframe;
        if (!useLineColor) {
          delete forwardedProps.getLineColor;
        }
        forwardedProps.updateTriggers.lineColors = useLineColor;
        return new PolygonFillLayer(forwardedProps, this.getSubLayerProps({
          id,
          updateTriggers: forwardedProps.updateTriggers
        }), layerProps.polygons);
      }
      return null;
    }
    _renderLineLayers() {
      const {
        extruded,
        stroked
      } = this.props;
      const {
        layerProps
      } = this.state;
      const polygonStrokeLayerId = "polygons-stroke";
      const lineStringsLayerId = "linestrings";
      const PolygonStrokeLayer = !extruded && stroked && this.shouldRenderSubLayer(polygonStrokeLayerId, layerProps.polygonsOutline.data) && this.getSubLayerClass(polygonStrokeLayerId, LINE_LAYER.type);
      const LineStringsLayer = this.shouldRenderSubLayer(lineStringsLayerId, layerProps.lines.data) && this.getSubLayerClass(lineStringsLayerId, LINE_LAYER.type);
      if (PolygonStrokeLayer || LineStringsLayer) {
        const forwardedProps = forwardProps(this, LINE_LAYER.props);
        return [PolygonStrokeLayer && new PolygonStrokeLayer(forwardedProps, this.getSubLayerProps({
          id: polygonStrokeLayerId,
          updateTriggers: forwardedProps.updateTriggers
        }), layerProps.polygonsOutline), LineStringsLayer && new LineStringsLayer(forwardedProps, this.getSubLayerProps({
          id: lineStringsLayerId,
          updateTriggers: forwardedProps.updateTriggers
        }), layerProps.lines)];
      }
      return null;
    }
    _renderPointLayers() {
      const {
        pointType
      } = this.props;
      const {
        layerProps,
        binary
      } = this.state;
      let {
        highlightedObjectIndex
      } = this.props;
      if (!binary && Number.isFinite(highlightedObjectIndex)) {
        highlightedObjectIndex = layerProps.points.data.findIndex((d) => d.__source.index === highlightedObjectIndex);
      }
      const types = new Set(pointType.split("+"));
      const pointLayers = [];
      for (const type of types) {
        const id = `points-${type}`;
        const PointLayerMapping = POINT_LAYER[type];
        const PointsLayer = PointLayerMapping && this.shouldRenderSubLayer(id, layerProps.points.data) && this.getSubLayerClass(id, PointLayerMapping.type);
        if (PointsLayer) {
          const forwardedProps = forwardProps(this, PointLayerMapping.props);
          let pointsLayerProps = layerProps.points;
          if (type === "text" && binary) {
            const {
              instancePickingColors,
              ...rest
            } = pointsLayerProps.data.attributes;
            pointsLayerProps = {
              ...pointsLayerProps,
              data: {
                ...pointsLayerProps.data,
                attributes: rest
              }
            };
          }
          pointLayers.push(new PointsLayer(forwardedProps, this.getSubLayerProps({
            id,
            updateTriggers: forwardedProps.updateTriggers,
            highlightedObjectIndex
          }), pointsLayerProps));
        }
      }
      return pointLayers;
    }
    renderLayers() {
      const {
        extruded
      } = this.props;
      const polygonFillLayer = this._renderPolygonLayer();
      const lineLayers = this._renderLineLayers();
      const pointLayers = this._renderPointLayers();
      return [
        !extruded && polygonFillLayer,
        lineLayers,
        pointLayers,
        extruded && polygonFillLayer
      ];
    }
    getSubLayerAccessor(accessor) {
      const {
        binary
      } = this.state;
      if (!binary || typeof accessor !== "function") {
        return super.getSubLayerAccessor(accessor);
      }
      return (object, info) => {
        const {
          data,
          index
        } = info;
        const feature = binaryToFeatureForAccesor(data, index);
        return accessor(feature, info);
      };
    }
  };
  __publicField(GeoJsonLayer, "layerName", "GeoJsonLayer");
  __publicField(GeoJsonLayer, "defaultProps", defaultProps15);
  return __toCommonJS(bundle_exports);
})();
      return __exports__;
      });
