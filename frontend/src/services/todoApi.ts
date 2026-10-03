import type {Todo} from '../types/todo';
const BASE=import.meta.env.VITE_API_URL||'http://localhost:4000/api';
async function call<T>(path:string,options:RequestInit={}):Promise<T>{const r=await fetch(BASE+path,{...options,headers:{'Content-Type':'application/json',...options.headers}});const b=await r.json().catch(()=>({}));if(!r.ok)throw new Error(b.error||'Request failed');return b as T;}
export const api={
 list:async()=>(await call<{data:Todo[]}>('/todos')).data,
 create:async(title:string,description:string)=>(await call<{data:Todo}>('/todos',{method:'POST',body:JSON.stringify({title,description})})).data,
 update:async(id:string,title:string,description:string)=>(await call<{data:Todo}>(`/todos/${id}`,{method:'PUT',body:JSON.stringify({title,description})})).data,
 toggle:async(id:string)=>(await call<{data:Todo}>(`/todos/${id}/complete`,{method:'PATCH'})).data,
 remove:async(id:string)=>call(`/todos/${id}`,{method:'DELETE'})
};
