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
import{b as E,f as O,g as R,h as G,i as L}from"./chunk-PSPPBZWI.js";import{a as S,b as N,c as s,e as y,f as A}from"./chunk-64RSHJUE.js";import{a as u}from"./chunk-OSW76XDF.js";import{a as I,b as w}from"./chunk-LEYMRMBK.js";import{e as f}from"./chunk-VTAIKJXX.js";var U={NONE:0,TRIANGLES:1,LINES:2,POLYLINES:3},F=Object.freeze(U),r={POINTS:u.POINTS,LINES:u.LINES,LINE_LOOP:u.LINE_LOOP,LINE_STRIP:u.LINE_STRIP,TRIANGLES:u.TRIANGLES,TRIANGLE_STRIP:u.TRIANGLE_STRIP,TRIANGLE_FAN:u.TRIANGLE_FAN,isLines:function(t){return t===r.LINES||t===r.LINE_LOOP||t===r.LINE_STRIP},isTriangles:function(t){return t===r.TRIANGLES||t===r.TRIANGLE_STRIP||t===r.TRIANGLE_FAN},validate:function(t){return t===r.POINTS||t===r.LINES||t===r.LINE_LOOP||t===r.LINE_STRIP||t===r.TRIANGLES||t===r.TRIANGLE_STRIP||t===r.TRIANGLE_FAN}},M=Object.freeze(r);function _(t){t=t??A.EMPTY_OBJECT,w.typeOf.object("options.attributes",t.attributes),this.attributes=t.attributes,this.indices=t.indices,this.primitiveType=t.primitiveType??M.TRIANGLES,this.boundingSphere=t.boundingSphere,this.geometryType=t.geometryType??F.NONE,this.boundingSphereCV=t.boundingSphereCV,this.offsetAttribute=t.offsetAttribute}_.computeNumberOfVertices=function(t){w.typeOf.object("geometry",t);let e=-1;for(let r in t.attributes)if(t.attributes.hasOwnProperty(r)&&f(t.attributes[r])&&f(t.attributes[r].values)){let n=t.attributes[r],i=n.values.length/n.componentsPerAttribute;if(e!==i&&-1!==e)throw new I("All attribute lists must have the same number of attributes.");e=i}return e};var W=new N,H=new S,g=new E,Z=[new N,new N,new N],K=[new s,new s,new s],$=[new s,new s,new s],tt=new S,et=new O,rt=new E,nt=new L;_._textureCoordinateRotationPoints=function(t,e,r,n){let i,o=G.center(n,W),a=N.toCartesian(o,r,H),u=R.eastNorthUpToFixedFrame(a,r,g),I=E.inverse(u,g),m=K,p=Z;p[0].longitude=n.west,p[0].latitude=n.south,p[1].longitude=n.west,p[1].latitude=n.north,p[2].longitude=n.east,p[2].latitude=n.south;let T=tt;for(i=0;i<3;i++)N.toCartesian(p[i],r,T),T=E.multiplyByPointAsVector(I,T,T),m[i].x=T.x,m[i].y=T.y;let f=O.fromAxisAngle(S.UNIT_Z,-e,et),c=y.fromQuaternion(f,rt),b=t.length,l=Number.POSITIVE_INFINITY,A=Number.POSITIVE_INFINITY,h=Number.NEGATIVE_INFINITY,P=Number.NEGATIVE_INFINITY;for(i=0;i<b;i++)T=E.multiplyByPointAsVector(I,t[i],T),T=y.multiplyByVector(c,T,T),l=Math.min(l,T.x),A=Math.min(A,T.y),h=Math.max(h,T.x),P=Math.max(P,T.y);let w=L.fromRotation(e,nt),_=$;_[0].x=l,_[0].y=A,_[1].x=l,_[1].y=P,_[2].x=h,_[2].y=A;let d=m[0],x=m[2].x-d.x,v=m[1].y-d.y;for(i=0;i<3;i++){let t=_[i];L.multiplyByVector(w,t,t),t.x=(t.x-d.x)/x,t.y=(t.y-d.y)/v}let F=_[0],V=_[1],M=_[2],j=new Array(6);return s.pack(F,j),s.pack(V,j,2),s.pack(M,j,4),j};var Lt=_;function ot(t){if(t=t??A.EMPTY_OBJECT,!f(t.componentDatatype))throw new I("options.componentDatatype is required.");if(!f(t.componentsPerAttribute))throw new I("options.componentsPerAttribute is required.");if(t.componentsPerAttribute<1||t.componentsPerAttribute>4)throw new I("options.componentsPerAttribute must be between 1 and 4.");if(!f(t.values))throw new I("options.values is required.");this.componentDatatype=t.componentDatatype,this.componentsPerAttribute=t.componentsPerAttribute,this.normalize=t.normalize??!1,this.values=t.values}var Ot=ot;export{F as a,M as b,Lt as c,Ot as d};