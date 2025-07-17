# MongoDB Integration Setup

Dự án TrackDo đã được cấu hình để tích hợp với MongoDB. Dưới đây là hướng dẫn thiết lập:

## 🔧 Cấu hình môi trường

### 1. File `.env`
Đảm bảo file `.env` trong thư mục gốc có các biến sau:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=trackdo

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=development
```

### 2. Cài đặt dependencies
```bash
npm install
```

## 🗄️ Cấu trúc dữ liệu MongoDB

### Collections:
- **projects**: Lưu trữ thông tin dự án
- **tasks**: Lưu trữ thông tin công việc
- **events**: Lưu trữ thông tin sự kiện/lịch

### Schema mẫu:

#### Projects Collection:
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  status: String, // 'Planning', 'Active', 'Completed', 'On Hold'
  priority: String, // 'Low', 'Medium', 'High'
  startDate: Date,
  endDate: Date,
  progress: Number, // 0-100
  teamMembers: [String],
  tags: [String],
  milestones: [{
    id: Number,
    title: String,
    date: Date,
    completed: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### Tasks Collection:
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  completed: Boolean,
  priority: String, // 'Low', 'Medium', 'High'
  dueDate: Date,
  projectId: ObjectId,
  assignee: String,
  tags: [String],
  estimatedHours: Number,
  actualHours: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Events Collection:
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  start: Date,
  end: Date,
  allDay: Boolean,
  type: String, // 'meeting', 'work', 'social', 'milestone'
  priority: String, // 'Low', 'Medium', 'High'
  location: String,
  attendees: [String],
  color: String,
  recurring: {
    enabled: Boolean,
    frequency: String, // 'daily', 'weekly', 'monthly'
    interval: Number,
    endDate: Date
  },
  reminders: [{
    type: String, // 'notification', 'email'
    minutes: Number
  }],
  projectId: ObjectId,
  taskId: ObjectId,
  status: String, // 'confirmed', 'tentative', 'cancelled'
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Backend API Requirements

Ứng dụng cần một backend API với các endpoints sau:

### Projects API:
- `GET /api/projects` - Lấy danh sách dự án
- `POST /api/projects` - Tạo dự án mới
- `PUT /api/projects/:id` - Cập nhật dự án
- `DELETE /api/projects/:id` - Xóa dự án

### Tasks API:
- `GET /api/tasks` - Lấy danh sách công việc
- `POST /api/tasks` - Tạo công việc mới
- `PUT /api/tasks/:id` - Cập nhật công việc
- `DELETE /api/tasks/:id` - Xóa công việc

### Events API:
- `GET /api/events` - Lấy danh sách sự kiện
- `POST /api/events` - Tạo sự kiện mới
- `PUT /api/events/:id` - Cập nhật sự kiện
- `DELETE /api/events/:id` - Xóa sự kiện

### Health Check:
- `GET /api/health` - Kiểm tra trạng thái API

## 🛠️ Development

### Chạy ứng dụng:
```bash
npm run dev
```

### Kiểm tra kết nối MongoDB:
Mở Developer Console trong trình duyệt để xem logs kết nối.

## 📝 Notes

1. **CORS**: Đảm bảo backend API cho phép CORS từ frontend
2. **Authentication**: JWT tokens được lưu trong localStorage
3. **Error Handling**: Tất cả lỗi API đều được xử lý và ghi log
4. **Performance**: Dữ liệu được cache trong Pinia stores

## 🔧 Troubleshooting

### Lỗi kết nối MongoDB:
1. Kiểm tra MongoDB server đang chạy
2. Xác nhận MONGODB_URI trong .env
3. Kiểm tra network connectivity

### Lỗi API:
1. Xác nhận backend server đang chạy trên port 3000
2. Kiểm tra VITE_API_BASE_URL trong .env
3. Xem Network tab trong Developer Tools

### Dữ liệu không hiển thị:
1. Mở Console để xem error logs
2. Kiểm tra stores có được khởi tạo đúng không
3. Verify API responses trong Network tab