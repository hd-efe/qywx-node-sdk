import noticeController from '../controllers/notice';
const routers = [
    {
        path: '/',
        method: 'GET',
        handler: noticeController.index.bind(noticeController)
    },
    {
        path: '/qywx',
        method: 'GET',
        handler: noticeController.index.bind(noticeController)
    },
    {
        path: '/user_info',
        method: 'GET',
        handler: noticeController.user_info.bind(noticeController)
    }

    
]
export default routers;