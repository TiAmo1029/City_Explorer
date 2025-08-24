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
import{a as K}from"./chunk-WZDE3RYP.js";import{a as G}from"./chunk-DEPHB2WM.js";import{a as S}from"./chunk-OFUUQVMR.js";import{c as B,h as R}from"./chunk-PSPPBZWI.js";import"./chunk-AU7IKHOH.js";import{a as t,b as _,d as L}from"./chunk-64RSHJUE.js";import{a as F}from"./chunk-3SSKC3VN.js";import"./chunk-OSW76XDF.js";import"./chunk-ED5JPB3S.js";import"./chunk-LEYMRMBK.js";import"./chunk-VTAIKJXX.js";var O=32767,ct=new _,rt=new t;function it(e,r,a,n,u){let o=e.length/3,s=e.subarray(0,o),f=e.subarray(o,2*o),i=e.subarray(2*o,3*o);G.zigZagDeltaDecode(s,f,i);let c=new Float64Array(e.length);for(let p=0;p<o;++p){let e=s[p],o=f[p],l=i[p],d=F.lerp(r.west,r.east,e/O),h=F.lerp(r.south,r.north,o/O),k=F.lerp(a,n,l/O),b=_.fromRadians(d,h,k,ct),m=u.cartographicToCartesian(b,rt);t.pack(m,c,3*p)}return c}var Y=it,X=new R,$=new L,j=new t,H={min:void 0,max:void 0};function at(e){e=new Float64Array(e);let r=0;H.min=e[r++],H.max=e[r++],R.unpack(e,r,X),r+=R.packedLength,L.unpack(e,r,$),r+=L.packedLength,t.unpack(e,r,j)}function ft(t){let e=t.length,r=new Uint32Array(e+1),a=0;for(let n=0;n<e;++n)r[n]=a,a+=t[n];return r[e]=a,r}var Z=new t,q=new t,J=new t,dt=new t,Q=new t;function ut(e,r){let a=new Uint16Array(e.positions),n=new Uint16Array(e.widths),u=new Uint32Array(e.counts),o=new Uint16Array(e.batchIds);at(e.packedBuffer);let s,f=X,i=$,c=j,p=H.min,l=H.max,d=Y(a,f,p,l,i),h=d.length/3,k=4*h-4,b=new Float32Array(3*k),m=new Float32Array(3*k),w=new Float32Array(3*k),y=new Float32Array(2*k),A=new Uint16Array(k),P=0,E=0,F=0,U=0,R=u.length;for(s=0;s<R;++s){let e=u[s],r=n[s],a=o[s];for(let n=0;n<e;++n){let u;if(0===n){let e=t.unpack(d,3*U,Z),r=t.unpack(d,3*(U+1),q);u=t.subtract(e,r,J),t.add(e,u,u)}else u=t.unpack(d,3*(U+n-1),J);let o,s=t.unpack(d,3*(U+n),dt);if(n===e-1){let r=t.unpack(d,3*(U+e-1),Z),a=t.unpack(d,3*(U+e-2),q);o=t.subtract(r,a,Q),t.add(r,o,o)}else o=t.unpack(d,3*(U+n+1),Q);t.subtract(u,c,u),t.subtract(s,c,s),t.subtract(o,c,o);let f=0===n?2:0,i=n===e-1?2:4;for(let e=f;e<i;++e){t.pack(s,b,P),t.pack(u,m,P),t.pack(o,w,P),P+=3;let n=e-2<0?-1:1;y[E++]=e%2*2-1,y[E++]=n*r,A[F++]=a}}U+=e}let g=S.createTypedArray(k,6*h-6),D=0,I=0;for(R=h-1,s=0;s<R;++s)g[I++]=D,g[I++]=D+2,g[I++]=D+1,g[I++]=D+1,g[I++]=D+2,g[I++]=D+3,D+=4;r.push(b.buffer,m.buffer,w.buffer),r.push(y.buffer,A.buffer,g.buffer);let O={indexDatatype:2===g.BYTES_PER_ELEMENT?S.UNSIGNED_SHORT:S.UNSIGNED_INT,currentPositions:b.buffer,previousPositions:m.buffer,nextPositions:w.buffer,expandAndWidth:y.buffer,batchIds:A.buffer,indices:g.buffer};if(e.keepDecodedPositions){let t=ft(u);r.push(d.buffer,t.buffer),O=B(O,{decodedPositions:d.buffer,decodedPositionOffsets:t.buffer})}return O}var It=K(ut);export{It as default};