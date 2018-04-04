/**
 * Created by zhushuangfei on 2018/3/22.
 */


import asyncComponent from './AsyncComponentFn'


export const AsyncComponent = (component)=>{
    return (
        asyncComponent(() => import('../container/'+component))
)
};
