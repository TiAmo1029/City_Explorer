/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.132
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */
import{a as n}from"./chunk-HWXX4CWK.js";import"./chunk-UP6I5URU.js";import"./chunk-GBYLG25F.js";import"./chunk-OFUUQVMR.js";import"./chunk-A56XVLQR.js";import"./chunk-RCV6KWXS.js";import"./chunk-4IW2T6GF.js";import"./chunk-PSPPBZWI.js";import"./chunk-AU7IKHOH.js";import{a as o,d as s,f as c}from"./chunk-64RSHJUE.js";import"./chunk-3SSKC3VN.js";import"./chunk-OSW76XDF.js";import"./chunk-ED5JPB3S.js";import{b as d}from"./chunk-LEYMRMBK.js";import{e as a}from"./chunk-VTAIKJXX.js";function m(e){e=e??c.EMPTY_OBJECT;let i=e.radius;d.typeOf.number("radius",i);let r={center:e.center,semiMajorAxis:i,semiMinorAxis:i,ellipsoid:e.ellipsoid,height:e.height,extrudedHeight:e.extrudedHeight,granularity:e.granularity,numberOfVerticalLines:e.numberOfVerticalLines};this._ellipseGeometry=new n(r),this._workerName="createCircleOutlineGeometry"}m.packedLength=n.packedLength,m.pack=function(e,i,r){return d.typeOf.object("value",e),n.pack(e._ellipseGeometry,i,r)};var p=new n({center:new o,semiMajorAxis:1,semiMinorAxis:1}),i={center:new o,radius:void 0,ellipsoid:s.clone(s.UNIT_SPHERE),height:void 0,extrudedHeight:void 0,granularity:void 0,numberOfVerticalLines:void 0,semiMajorAxis:void 0,semiMinorAxis:void 0};m.unpack=function(e,r,t){let c=n.unpack(e,r,p);return i.center=o.clone(c._center,i.center),i.ellipsoid=s.clone(c._ellipsoid,i.ellipsoid),i.height=c._height,i.extrudedHeight=c._extrudedHeight,i.granularity=c._granularity,i.numberOfVerticalLines=c._numberOfVerticalLines,a(t)?(i.semiMajorAxis=c._semiMajorAxis,i.semiMinorAxis=c._semiMinorAxis,t._ellipseGeometry=new n(i),t):(i.radius=c._semiMajorAxis,new m(i))},m.createGeometry=function(e){return n.createGeometry(e._ellipseGeometry)};var u=m;function f(e,i){return a(i)&&(e=u.unpack(e,i)),e._ellipseGeometry._center=o.clone(e._ellipseGeometry._center),e._ellipseGeometry._ellipsoid=s.clone(e._ellipseGeometry._ellipsoid),u.createGeometry(e)}var E=f;export{E as default};