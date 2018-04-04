/**
 * Created by zhushuangfei on 2018/3/22.
 */

import fectMock from 'fetch-mock'

export default {
    start(){
      fectMock.get('/login', {hello: 'world'})
  }
};

