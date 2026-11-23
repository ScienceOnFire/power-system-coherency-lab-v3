/** Educational, lossless 10-generator classical swing model.
 * Delta angles (rad), speed deviations (rad/s); normalized M,D,K.
 * Coupling is sinusoidal, and the equilibrium is all angles zero.
 * No AC load flow, AVR, governor or network algebraic constraints.
 */
export const areas = [0,0,0,0,1,1,1,2,2,2];
export const positions = [[45,65],[135,65],[45,175],[135,175],[255,65],[335,105],[255,175],[445,65],[525,120],[445,175]];
export const links = [[0,1],[0,2],[1,3],[2,3],[1,2],[4,5],[4,6],[5,6],[7,8],[7,9],[8,9],[1,4],[3,6],[5,7],[6,9]];
export const masses = [1,1.08,.94,1.12,1.04,.92,1.15,1.1,.97,1.06];
export const initialState = () => Array(20).fill(0);
export function derivative(y,p,disturbance=0){
  const z=Array(20).fill(0);
  for(let i=0;i<10;i++)z[i]=y[10+i];
  const coupling=Array(10).fill(0);
  for(const [i,j] of links){const k=areas[i]===areas[j]?2.5:p.coupling;const power=k*Math.sin(y[j]-y[i]);coupling[i]+=power;coupling[j]-=power;}
  for(let i=0;i<10;i++)z[10+i]=(coupling[i]-p.damping*y[10+i]+(i===0?disturbance:0))/(masses[i]*p.inertia);
  return z;
}
export function rk4(y,dt,p,disturbance){
  const add=(base,k,s)=>base.map((v,i)=>v+s*k[i]);
  const a=derivative(y,p,disturbance),b=derivative(add(y,a,dt/2),p,disturbance),c=derivative(add(y,b,dt/2),p,disturbance),d=derivative(add(y,c,dt),p,disturbance);
  return y.map((v,i)=>v+dt*(a[i]+2*b[i]+2*c[i]+d[i])/6);
}
export function coiDegrees(y){
  const weightedMean=masses.reduce((s,m,i)=>s+m*y[i],0)/masses.reduce((a,b)=>a+b,0);
  return y.slice(0,10).map(v=>(v-weightedMean)*180/Math.PI);
}
export function correlations(history){
  const values=Array.from({length:10},(_,i)=>history.map(row=>row.angles[i]));
  return values.map((a,i)=>values.map((b,j)=>{
    if(i===j)return 1;
    if(a.length<15)return null;
    const ma=a.reduce((s,v)=>s+v,0)/a.length,mb=b.reduce((s,v)=>s+v,0)/b.length;
    let ab=0,aa=0,bb=0;
    for(let k=0;k<a.length;k++){const da=a[k]-ma,db=b[k]-mb;ab+=da*db;aa+=da*da;bb+=db*db;}
    return aa>1e-8&&bb>1e-8?ab/Math.sqrt(aa*bb):null;
  }));
}
