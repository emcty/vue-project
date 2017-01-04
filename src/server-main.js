
import {app, router, store} from './app';

export default function(context) {
  // 设置路由地址
  router.push(context.url);
  const matchedComponents = router.getMatchedComponents();

  // 未找到匹配的路由
  if (!matchedComponents.length) {
    return Promise.reject({ code: 404 });
  }

  return Promise.all(matchedComponents.map(component => {
    if (component.preFetch) {
      return component.preFetch(store);
    }
  })).then(() => {

    context.initialState = store.state;
    return app;
  });
}
