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
import{a as w}from"./chunk-3SSKC3VN.js";var C={computePositions:function(t,o,a,r,n){let s,e=.5*t,i=-e,c=r+r,u=n?2*c:c,f=new Float64Array(3*u),h=0,l=0,m=n?3*c:0,p=n?3*(c+r):3*r;for(s=0;s<r;s++){let t=s/r*w.TWO_PI,c=Math.cos(t),u=Math.sin(t),C=c*a,M=u*a,P=c*o,S=u*o;f[l+m]=C,f[l+m+1]=M,f[l+m+2]=i,f[l+p]=P,f[l+p+1]=S,f[l+p+2]=e,l+=3,n&&(f[h++]=C,f[h++]=M,f[h++]=i,f[h++]=P,f[h++]=S,f[h++]=e)}return f}},Y=C;export{Y as a};