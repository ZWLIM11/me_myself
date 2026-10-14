import {onRequest} from './functions/api/photography/[[path]].js';
export default {
  fetch(request,env){
    const path=new URL(request.url).pathname;
    if(path==='/api/photography'||path.startsWith('/api/photography/')){
      return onRequest({request,env,params:{path:path.replace(/^\/api\/photography\/?/,'').split('/')}});
    }
    return env.ASSETS.fetch(request);
  }
};
