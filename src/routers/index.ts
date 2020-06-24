import noticeController from '../controllers/notice';
const routers = [
    {
        path: '/',
        method: 'GET',
        handler: noticeController.index
    },
    {
        path: '/qywx',
        method: 'GET',
        handler: noticeController.index
    }
]
export default routers;