/**
 * Created by 70469 on 2017/12/22.
 * 左侧导航配置
 */
const leftNav = [
    {
        name:'注册',
        Icon:"solution",
        child:[
            {
                path:'/home',
                component:'StudentRest',
                name:'学生注册',
                Icon:"usergroup-add"
            },
            {
                path:'/home/list',
                component:'StudentList',
                name:'学生列表',
                Icon:"smile"
            }
        ]
    },
    {
        name:'图片识别',
        Icon:"search",
        child:[
            {
                path:'/home/updateImg',
                component:'updateImg',
                name:'上传图片',
                Icon:"file-jpg"
            }
        ]
    }

];

export default leftNav;