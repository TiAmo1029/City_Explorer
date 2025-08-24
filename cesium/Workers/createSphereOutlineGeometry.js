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
import{a as t}from"./chunk-D6C66QON.js";import"./chunk-GBYLG25F.js";import"./chunk-OFUUQVMR.js";import"./chunk-A56XVLQR.js";import"./chunk-RCV6KWXS.js";import"./chunk-4IW2T6GF.js";import"./chunk-PSPPBZWI.js";import"./chunk-AU7IKHOH.js";import{a as c}from"./chunk-64RSHJUE.js";import"./chunk-3SSKC3VN.js";import"./chunk-OSW76XDF.js";import"./chunk-ED5JPB3S.js";import{b as u}from"./chunk-LEYMRMBK.js";import{e as a}from"./chunk-VTAIKJXX.js";function s(i){let s=i.radius??1,n={radii:new c(s,s,s),stackPartitions:i.stackPartitions,slicePartitions:i.slicePartitions,subdivisions:i.subdivisions};this._ellipsoidGeometry=new t(n),this._workerName="createSphereOutlineGeometry"}s.packedLength=t.packedLength,s.pack=function(i,s,n){return u.typeOf.object("value",i),t.pack(i._ellipsoidGeometry,s,n)};var l=new t,n={radius:void 0,radii:new c,stackPartitions:void 0,slicePartitions:void 0,subdivisions:void 0};s.unpack=function(i,r,e){let o=t.unpack(i,r,l);return n.stackPartitions=o._stackPartitions,n.slicePartitions=o._slicePartitions,n.subdivisions=o._subdivisions,a(e)?(c.clone(o._radii,n.radii),e._ellipsoidGeometry=new t(n),e):(n.radius=o._radii.x,new s(n))},s.createGeometry=function(i){return t.createGeometry(i._ellipsoidGeometry)};var d=s;function m(i,t){return a(t)&&(i=d.unpack(i,t)),d.createGeometry(i)}var h=m;export{h as default};