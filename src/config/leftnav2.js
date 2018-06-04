/**
 * Created by zhushuangfei on 2018/3/28.
 * 左侧导航配置
 */
const leftconfig2 = [
    {
        name: '个人中心',
        Icon: "form",
        child: [
            {
                path: '/home/UserCenter',
                component: 'UserCenter',
                name: '个人信息',
                Icon: "idcard"
            }, {
                path: '/home/UserRecord',
                component: 'UserRecord',
                name: '考勤记录',
                Icon: "profile"
            }
        ]
    }
];

export default leftconfig2;