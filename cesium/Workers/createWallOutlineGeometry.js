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
import{a as z}from"./chunk-NB3ML6JO.js";import"./chunk-XRL4AVS5.js";import"./chunk-U4IEOH5K.js";import"./chunk-3W4GT7KQ.js";import"./chunk-G5AGHVVC.js";import"./chunk-DMEY62ID.js";import"./chunk-HTFSEEMT.js";import{a as W}from"./chunk-OFUUQVMR.js";import{a as N}from"./chunk-A56XVLQR.js";import{b as R,c as S,d as M}from"./chunk-RCV6KWXS.js";import{d as D}from"./chunk-4IW2T6GF.js";import"./chunk-PSPPBZWI.js";import{a as q}from"./chunk-AU7IKHOH.js";import{a as p,d as l,f as O}from"./chunk-64RSHJUE.js";import{a as b}from"./chunk-3SSKC3VN.js";import"./chunk-OSW76XDF.js";import"./chunk-ED5JPB3S.js";import{a as H}from"./chunk-LEYMRMBK.js";import{e as m}from"./chunk-VTAIKJXX.js";var B=new p,U=new p;function _(i){i=i??O.EMPTY_OBJECT;let t=i.positions,e=i.maximumHeights,n=i.minimumHeights;if(!m(t))throw new H("options.positions is required.");if(m(e)&&e.length!==t.length)throw new H("options.positions and options.maximumHeights must have the same length.");if(m(n)&&n.length!==t.length)throw new H("options.positions and options.minimumHeights must have the same length.");let o=i.granularity??b.RADIANS_PER_DEGREE,r=i.ellipsoid??l.default;this._positions=t,this._minimumHeights=n,this._maximumHeights=e,this._granularity=o,this._ellipsoid=l.clone(r),this._workerName="createWallOutlineGeometry";let s=1+t.length*p.packedLength+2;m(n)&&(s+=n.length),m(e)&&(s+=e.length),this.packedLength=s+l.packedLength+1}_.pack=function(i,t,e){if(!m(i))throw new H("value is required");if(!m(t))throw new H("array is required");e=e??0;let n,o=i._positions,r=o.length;for(t[e++]=r,n=0;n<r;++n,e+=p.packedLength)p.pack(o[n],t,e);let s=i._minimumHeights;if(r=m(s)?s.length:0,t[e++]=r,m(s))for(n=0;n<r;++n)t[e++]=s[n];let a=i._maximumHeights;if(r=m(a)?a.length:0,t[e++]=r,m(a))for(n=0;n<r;++n)t[e++]=a[n];return l.pack(i._ellipsoid,t,e),e+=l.packedLength,t[e]=i._granularity,t};var G=l.clone(l.UNIT_SPHERE),L={positions:void 0,minimumHeights:void 0,maximumHeights:void 0,ellipsoid:G,granularity:void 0};_.unpack=function(i,t,e){if(!m(i))throw new H("array is required");t=t??0;let n,o,r,s=i[t++],a=new Array(s);for(n=0;n<s;++n,t+=p.packedLength)a[n]=p.unpack(i,t);if(s=i[t++],s>0)for(o=new Array(s),n=0;n<s;++n)o[n]=i[t++];if(s=i[t++],s>0)for(r=new Array(s),n=0;n<s;++n)r[n]=i[t++];let h=l.unpack(i,t,G);t+=l.packedLength;let u=i[t];return m(e)?(e._positions=a,e._minimumHeights=o,e._maximumHeights=r,e._ellipsoid=l.clone(h,e._ellipsoid),e._granularity=u,e):(L.positions=a,L.minimumHeights=o,L.maximumHeights=r,L.granularity=u,new _(L))},_.fromConstantHeights=function(i){i=i??O.EMPTY_OBJECT;let t=i.positions;if(!m(t))throw new H("options.positions is required.");let e,n,o=i.minimumHeight,r=i.maximumHeight,s=m(o),a=m(r);if(s||a){let i=t.length;e=s?new Array(i):void 0,n=a?new Array(i):void 0;for(let t=0;t<i;++t)s&&(e[t]=o),a&&(n[t]=r)}let l={positions:t,maximumHeights:n,minimumHeights:e,ellipsoid:i.ellipsoid};return new _(l)},_.createGeometry=function(i){let t=i._positions,e=i._minimumHeights,n=i._maximumHeights,o=i._granularity,r=i._ellipsoid,s=z.computePositions(r,t,n,e,o,!1);if(!m(s))return;let a,l=s.bottomPositions,h=s.topPositions,u=h.length,c=2*u,g=new Float64Array(c),f=0;for(u/=3,a=0;a<u;++a){let i=3*a,t=p.fromArray(h,i,B),e=p.fromArray(l,i,U);g[f++]=e.x,g[f++]=e.y,g[f++]=e.z,g[f++]=t.x,g[f++]=t.y,g[f++]=t.z}let d=new N({position:new M({componentDatatype:q.DOUBLE,componentsPerAttribute:3,values:g})}),_=c/3;c=2*_-4+_;let H=W.createTypedArray(_,c),k=0;for(a=0;a<_-2;a+=2){let i=a,t=a+2,e=p.fromArray(g,3*i,B),n=p.fromArray(g,3*t,U);if(p.equalsEpsilon(e,n,b.EPSILON10))continue;let o=a+1,r=a+3;H[k++]=o,H[k++]=i,H[k++]=o,H[k++]=r,H[k++]=i,H[k++]=t}return H[k++]=_-2,H[k++]=_-1,new S({attributes:d,indices:H,primitiveType:R.LINES,boundingSphere:new D.fromVertices(g)})};var C=_;function J(i,t){return m(t)&&(i=C.unpack(i,t)),i._ellipsoid=l.clone(i._ellipsoid),C.createGeometry(i)}var pi=J;export{pi as default};