const Express = require('express')
const cors = require('cors')
const path = require('path')
const multer  = require('multer')

const app = Express()

app.use(cors({origin: 'http://localhost:3000'}));
app.use('/upload', Express.static('public/upload'))

const apiURL = 'http://localhost:8080'

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../public/upload'),
  filename(req, file, cb) {
    // 文件名：在服务器应该随机生成，和客户端不能一致，可以使用时间戳来弄
    const time = new Date().getTime()
    // 后缀名：和客户端一致
    const originalFileName = file.originalname
    const extendName = path.extname(originalFileName)
    // 设置文件名的全称
    cb(null, `${time}${extendName}`)
  }
})

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.jiff']

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 // 文件大小 最多1M
  },
  fileFilter(request, file, cb) {
    const extension = path.extname(file.originalname)
    if (allowedExtensions.includes(extension)) {
      // 接收这个文件
      cb(null, true)
    } else {
      // 拒绝这个文件
      cb(new Error('文件类型不正确'))
    }
  }
  // 这里指定的key名必须和客户端传进来的formData的key名相对应
}).single('imageFile')

app.post('/upload', (request, response) => {
  upload(request, response, error => {
    if (error) {
      response.send(500)
      response.send({error, url: null})
    } else {
      const url = `${apiURL}/upload/${request.file.filename}`
      response.send({error: null, url})
    }
  })
})
app.listen(8080, () => console.log(apiURL))