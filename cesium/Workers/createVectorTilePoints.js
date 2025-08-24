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
import{a as x}from"./chunk-WZDE3RYP.js";import{a as w}from"./chunk-DEPHB2WM.js";import{h as c}from"./chunk-PSPPBZWI.js";import"./chunk-AU7IKHOH.js";import{a as h,b as l,d as p}from"./chunk-64RSHJUE.js";import{a as i}from"./chunk-3SSKC3VN.js";import"./chunk-OSW76XDF.js";import"./chunk-ED5JPB3S.js";import"./chunk-LEYMRMBK.js";import"./chunk-VTAIKJXX.js";var u=32767,F=new l,L=new h,b=new c,y=new p,a={min:void 0,max:void 0};function V(r){r=new Float64Array(r);let n=0;a.min=r[n++],a.max=r[n++],c.unpack(r,n,b),n+=c.packedLength,p.unpack(r,n,y)}function z(r,n){let t=new Uint16Array(r.positions);V(r.packedBuffer);let e=b,o=y,s=a.min,p=a.max,c=t.length/3,m=t.subarray(0,c),f=t.subarray(c,2*c),k=t.subarray(2*c,3*c);w.zigZagDeltaDecode(m,f,k);let j=new Float64Array(t.length);for(let a=0;a<c;++a){let r=m[a],n=f[a],t=k[a],c=i.lerp(e.west,e.east,r/u),w=i.lerp(e.south,e.north,n/u),b=i.lerp(s,p,t/u),y=l.fromRadians(c,w,b,F),d=o.cartographicToCartesian(y,L);h.pack(d,j,3*a)}return n.push(j.buffer),{positions:j.buffer}}var G=x(z);export{G as default};