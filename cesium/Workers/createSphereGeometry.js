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
import{a as r}from"./chunk-37F5JSTI.js";import"./chunk-GBYLG25F.js";import{a as m}from"./chunk-CYCB63OH.js";import"./chunk-OFUUQVMR.js";import"./chunk-A56XVLQR.js";import"./chunk-RCV6KWXS.js";import"./chunk-4IW2T6GF.js";import"./chunk-PSPPBZWI.js";import"./chunk-AU7IKHOH.js";import{a as s}from"./chunk-64RSHJUE.js";import"./chunk-3SSKC3VN.js";import"./chunk-OSW76XDF.js";import"./chunk-ED5JPB3S.js";import{b as p}from"./chunk-LEYMRMBK.js";import{e as c}from"./chunk-VTAIKJXX.js";function a(t){let i=t.radius??1,e={radii:new s(i,i,i),stackPartitions:t.stackPartitions,slicePartitions:t.slicePartitions,vertexFormat:t.vertexFormat};this._ellipsoidGeometry=new r(e),this._workerName="createSphereGeometry"}a.packedLength=r.packedLength,a.pack=function(t,i,e){return p.typeOf.object("value",t),r.pack(t._ellipsoidGeometry,i,e)};var l=new r,i={radius:void 0,radii:new s,vertexFormat:new m,stackPartitions:void 0,slicePartitions:void 0};a.unpack=function(t,e,o){let n=r.unpack(t,e,l);return i.vertexFormat=m.clone(n._vertexFormat,i.vertexFormat),i.stackPartitions=n._stackPartitions,i.slicePartitions=n._slicePartitions,c(o)?(s.clone(n._radii,i.radii),o._ellipsoidGeometry=new r(i),o):(i.radius=n._radii.x,new a(i))},a.createGeometry=function(t){return r.createGeometry(t._ellipsoidGeometry)};var d=a;function f(r,t){return c(t)&&(r=d.unpack(r,t)),d.createGeometry(r)}var w=f;export{w as default};