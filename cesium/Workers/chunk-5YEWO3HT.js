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
import{a as z}from"./chunk-4IW2T6GF.js";import{h as I,i as b}from"./chunk-PSPPBZWI.js";import{a as W,b as O,d as L}from"./chunk-64RSHJUE.js";import{a as m}from"./chunk-3SSKC3VN.js";import{a as v}from"./chunk-LEYMRMBK.js";import{e as k}from"./chunk-VTAIKJXX.js";var Z=Math.cos,B=Math.sin,p=Math.sqrt,N={computePosition:function(t,n,a,r,o,s,e){let i=n.radiiSquared,l=t.nwCorner,h=t.boundingRectangle,u=l.latitude-t.granYCos*r+o*t.granXSin,g=Z(u),c=B(u),m=i.z*c,S=l.longitude+r*t.granYSin+o*t.granXCos,C=g*Z(S),d=g*B(S),w=i.x*C,X=i.y*d,I=p(w*C+X*d+m*c);if(s.x=w/I,s.y=X/I,s.z=m/I,a){let n=t.stNwCorner;k(n)?(u=n.latitude-t.stGranYCos*r+o*t.stGranXSin,S=n.longitude+r*t.stGranYSin+o*t.stGranXCos,e.x=(S-t.stWest)*t.lonScalar,e.y=(u-t.stSouth)*t.latScalar):(e.x=(S-h.west)*t.lonScalar,e.y=(u-h.south)*t.latScalar)}}},A=new b,l=new W,F=new O,j=new W,y=new z;function D(t,n,a,r,o,s,e){let i=Math.cos(n),h=r*i,u=a*i,g=Math.sin(n),c=r*g,m=a*g;y._ellipsoid=L.default,l=y.project(t,l),l=W.subtract(l,j,l);let S=b.fromRotation(n,A);l=b.multiplyByVector(S,l,l),l=W.add(l,j,l),t=y.unproject(l,t),s-=1,e-=1;let C=t.latitude,d=C+s*m,p=C-h*e,w=C-h*e+s*m,X=Math.max(C,d,p,w),I=Math.min(C,d,p,w),O=t.longitude,Y=O+s*u,f=O+e*c,_=O+e*c+s*u,M=Math.max(O,Y,f,_),P=Math.min(O,Y,f,_);return{north:X,south:I,east:M,west:P,granYCos:h,granYSin:c,granXCos:u,granXSin:m,nwCorner:t}}N.computeOptions=function(t,n,a,r,o,s,e){let i=t.east,l=t.west,h=t.north,u=t.south,g=!1,c=!1;h===m.PI_OVER_TWO&&(g=!0),u===-m.PI_OVER_TWO&&(c=!0);let S,C=h-u;S=l>i?m.TWO_PI-l+i:i-l;let d=Math.ceil(S/n)+1,p=Math.ceil(C/n)+1,w=S/(d-1),X=C/(p-1),O=I.northwest(t,s),W=I.center(t,F);(0!==a||0!==r)&&(W.longitude<O.longitude&&(W.longitude+=m.TWO_PI),y._ellipsoid=L.default,j=y.project(W,j));let Y=X,f=w,_=0,M=0,P=I.clone(t,o),R={granYCos:Y,granYSin:_,granXCos:f,granXSin:M,nwCorner:O,boundingRectangle:P,width:d,height:p,northCap:g,southCap:c};if(0!==a){let t=D(O,a,w,X,W,d,p);if(h=t.north,u=t.south,i=t.east,l=t.west,h<-m.PI_OVER_TWO||h>m.PI_OVER_TWO||u<-m.PI_OVER_TWO||u>m.PI_OVER_TWO)throw new v("Rotated rectangle is invalid.  It crosses over either the north or south pole.");R.granYCos=t.granYCos,R.granYSin=t.granYSin,R.granXCos=t.granXCos,R.granXSin=t.granXSin,P.north=h,P.south=u,P.east=i,P.west=l}if(0!==r){a-=r;let t=I.northwest(P,e),n=D(t,a,w,X,W,d,p);R.stGranYCos=n.granYCos,R.stGranXCos=n.granXCos,R.stGranYSin=n.granYSin,R.stGranXSin=n.granXSin,R.stNwCorner=t,R.stWest=n.west,R.stSouth=n.south}return R};var st=N;export{st as a};