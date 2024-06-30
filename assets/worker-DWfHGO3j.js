var E=Object.defineProperty;var A=(w,d,m)=>d in w?E(w,d,{enumerable:!0,configurable:!0,writable:!0,value:m}):w[d]=m;var h=(w,d,m)=>(A(w,typeof d!="symbol"?d+"":d,m),m);(function(){"use strict";class w{constructor(t,s){this.min=t,this.max=s}surrounds(t){return t>=this.min&&t<=this.max}clamp(t){return t<this.min?this.min:t>this.max?this.max:t}}function d(r,t,s){const{data:e}=r,{x:i,y:n}=t,{x:o,y:l,z:p}=s,c=(n*r.width+i)*4,y=new w(0,.999),u=256*y.clamp(o),z=256*y.clamp(l),B=256*y.clamp(p);e[c]=u,e[c+1]=z,e[c+2]=B,e[c+3]=255}class m{constructor(t,s){this.origin=t,this.direction=s}at(t){return this.origin.add(this.direction.scalarMultiply(t))}}const f=Number.POSITIVE_INFINITY;function b(r,t){return Math.random()*(t-r)+r}const q=r=>new a(r.z,r.y,-r.x);class a{constructor(t,s,e){this.x=t,this.y=s,this.z=e}add(t){return new a(this.x+t.x,this.y+t.y,this.z+t.z)}subtract(t){return new a(this.x-t.x,this.y-t.y,this.z-t.z)}scalarMultiply(t){return new a(this.x*t,this.y*t,this.z*t)}multiply(t){return new a(this.x*t.x,this.y*t.y,this.z*t.z)}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}lengthSquared(){return this.x*this.x+this.y*this.y+this.z*this.z}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}cross(t){return new a(this.y*t.z-this.z*t.y,this.z*t.x-this.x*t.z,this.x*t.y-this.y*t.x)}unit(){return this.scalarMultiply(1/this.length())}randomOnHemisphere(){const t=a.randomInUnitSphere();return t.dot(this)>0?t:t.scalarMultiply(-1)}nearZero(){return Math.abs(this.x)<1e-8&&Math.abs(this.y)<1e-8&&Math.abs(this.z)<1e-8}reflect(t){return this.subtract(t.scalarMultiply(2*this.dot(t)))}static randomInUnitSphere(){for(;;){const t=a.randomBetween(-1,1);if(!(t.lengthSquared()>=1))return t}}static randomUnitVector(){return a.randomInUnitSphere().unit()}static random(){return new a((Math.random()-.5)*f,(Math.random()-.5)*f,(Math.random()-.5)*f)}static randomBetween(t,s){return new a(b(t,s),b(t,s),b(t,s))}}var g=(r=>(r.Lambertian="Lambertian",r.Metal="Metal",r))(g||{});class S{scatter(t,s){return{didScatter:!1}}}class D extends S{constructor(t){super(),this.albedo=t}scatter(t,s){let e=s.normal.add(a.randomUnitVector());e.nearZero()&&(e=s.normal);const i=new m(s.position,e),n=this.albedo;return{didScatter:!0,scattered:i,attentuation:n}}}class I{constructor(){h(this,"position",new a(0,0,0));h(this,"normal",new a(0,0,0));h(this,"t",0);h(this,"material",new D(new a(0,0,0)))}setFaceNormal(t,s){t.direction.dot(s)<0?this.normal=s:this.normal=s.scalarMultiply(-1)}}const x=800,T=16/9,M=x/T;class H{constructor(){h(this,"center");h(this,"pixel00Position");h(this,"pixelDeltaU");h(this,"pixelDeltaV");h(this,"pixelSamplesScale")}render(t,s,e){this.initialize(s);const i=new ImageData(x,M);let n=0;for(let o=0;o<x;o++)for(let l=0;l<M;l++){let p=new a(0,0,0);for(let y=0;y<s.samples;y++){const u=this.getRay(o,l);p=p.add(this.rayColor(u,t,s.bounces))}d(i,{x:o,y:l},p.scalarMultiply(this.pixelSamplesScale));const c=(o*M+l)/(x*M)*100;e&&c-n>1&&(e(c),n=c)}return i}initialize(t){this.center=new a(0,0,0),this.pixelSamplesScale=1/t.samples;const s=1,e=2,i=e*x/M,n=new a(i,0,0),o=new a(0,-e,0);this.pixelDeltaU=n.scalarMultiply(1/x),this.pixelDeltaV=o.scalarMultiply(1/M),this.pixel00Position=this.center.subtract(new a(0,0,s)).subtract(n.scalarMultiply(.5)).subtract(o.scalarMultiply(.5))}rayColor(t,s,e){if(e<=0)return new a(0,0,0);const i=new I;if(s.hit(t,.001,f,i)){const l=i.material.scatter(t,i);return l.didScatter?this.rayColor(l.scattered,s,e-1).multiply(l.attentuation):new a(0,0,0)}const o=.5*(t.direction.unit().y+1);return new a(.5,.7,1).scalarMultiply(o).add(new a(1,1,1).scalarMultiply(1-o))}getRay(t,s){const e=this.sampleSquare(),i=this.pixel00Position.add(this.pixelDeltaU.scalarMultiply(t+e.x)).add(this.pixelDeltaV.scalarMultiply(s+e.y)),n=this.center,o=i.subtract(this.center);return new m(n,o)}sampleSquare(){return new a(Math.random()-.5,Math.random()-.5,0)}}class L{constructor(t){this.objects=t}hit(t,s,e,i){const n=new I;let o=!1,l=e;for(const p of this.objects)p.hit(t,s,l,n)&&(o=!0,l=n.t,i.normal=n.normal,i.position=n.position,i.t=n.t,i.material=n.material);return o}}class P extends S{constructor(t){super(),this.albedo=t}scatter(t,s){const e=t.direction.reflect(s.normal),i=new m(s.position,e),n=this.albedo;return{didScatter:!0,scattered:i,attentuation:n}}}class U{constructor(t,s,e,i){h(this,"material");switch(this.center=t,this.radius=s,this.materialType=e,this.color=i,e){case g.Metal:this.material=new P(i);break;case g.Lambertian:this.material=new D(i);break;default:throw new Error(`Material type ${e} not supported`)}}hit(t,s,e,i){(!t||!t.origin)&&console.log(t);const n=this.center.subtract(t.origin),o=t.direction.lengthSquared(),l=t.direction.dot(n),p=n.lengthSquared()-this.radius*this.radius,c=l*l-o*p;if(c<0)return!1;const y=Math.sqrt(c);let u=(l-y)/o;if((u<=s||u>=e)&&(u=(l+y)/o,u<=s||u>=e))return!1;i.t=u,i.position=t.at(u);const z=i.position.subtract(this.center).scalarMultiply(1/this.radius);return i.setFaceNormal(t,z),i.material=this.material,!0}}class v{constructor(){}render(t,s,e){const i=new L([...t.map(l=>new U(l.position,.5,l.material,l.color)),new U(new a(0,-100.5,-1),100,g.Lambertian,new a(1,1,1))]);return new H().render(i,s,e)}}onmessage=async r=>{const t=r.data,s=t.objects.map(n=>({position:q({x:n.position.x,y:n.position.y,z:n.position.z}),color:n.color,material:n.material})),i=await new v().render(s,t.options,n=>postMessage({status:"progress",data:n}));postMessage({status:"done",data:i})}})();
