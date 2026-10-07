import {writeFileSync} from 'node:fs';
const headers={accept:'application/json','accept-language':'en-US,en;q=0.9',referer:'https://proclubs.ea.com/'};
const results=await Promise.all(['leagueMatch','friendlyMatch','playoffMatch'].map(async matchType=>{
 const url=new URL('https://proclubs.ea.com/api/fc/clubs/matches');
 for(const [k,v]of Object.entries({platform:'common-gen5',clubIds:'516853',matchType,maxResultCount:'10'}))url.searchParams.set(k,v);
 try{const r=await fetch(url,{headers,signal:AbortSignal.timeout(20000)});const rows=r.ok?await r.json():null;return {matchType,http:r.status,response:r.ok&&Array.isArray(rows)?'data':r.ok?'invalid':'blocked',records:Array.isArray(rows)?rows.length:null};}
 catch{return {matchType,http:null,response:'network_error',records:null};}
}));
const report={environment:process.env.GITHUB_ACTIONS==='true'?'GitHub Actions standard Ubuntu':'local Node',node:process.version,headers,results};
console.log(JSON.stringify(report,null,2));
if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');
