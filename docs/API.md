# API 接口文档

Base URL: `http://localhost:3000`

所有请求/响应均为 `application/json`。

---

## 公开接口

### GET /api/categories

获取所有分类及已发布体验数量。

```bash
curl http://localhost:3000/api/categories
```

**响应** `200 OK`
```json
[
  {
    "id": "cmq...",
    "name": "城市探索",
    "slug": "city-explore",
    "description": "穿梭于大街小巷...",
    "icon": "🏙️",
    "createdAt": "2026-06-11T...",
    "updatedAt": "2026-06-11T...",
    "experienceCount": 1
  }
]
```

---

### GET /api/experiences

分页获取已发布体验列表，支持分类筛选、精选筛选、排序。

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `page` | int | 1 | 页码 |
| `limit` | int | 10 | 每页条数（最大 50） |
| `category` | string | - | 分类 slug |
| `featured` | string | - | `true` 仅精选 |
| `sort` | string | `newest` | `price-asc` / `price-desc` / `newest` |

```bash
curl "http://localhost:3000/api/experiences?page=1&limit=3&category=food-tour"
curl "http://localhost:3000/api/experiences?featured=true&sort=price-asc"
```

**响应** `200 OK`
```json
{
  "data": [
    {
      "id": "cmq...",
      "title": "东京深夜拉面巡礼",
      "slug": "tokyo-ramen-tour",
      "description": "深夜的新宿街头...",
      "location": "日本 · 东京",
      "price": 880,
      "duration": "3 小时",
      "images": "[\"https://...\"]",
      "featured": true,
      "published": true,
      "category": { "id": "...", "name": "美食之旅", "slug": "food-tour", "icon": "🍜" },
      "author": { "id": "...", "name": "管理员", "avatar": "https://..." }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 3,
    "total": 8,
    "totalPages": 3,
    "hasMore": true
  }
}
```

---

### GET /api/experiences/[slug]

获取单个体验详情（含作者完整信息和分类）。

```bash
curl http://localhost:3000/api/experiences/tokyo-ramen-tour
```

**响应** `200 OK`
```json
{
  "id": "cmq...",
  "title": "东京深夜拉面巡礼",
  "slug": "tokyo-ramen-tour",
  "description": "深夜的新宿街头...",
  "location": "日本 · 东京",
  "price": 880,
  "duration": "3 小时",
  "images": "[\"https://...\"]",
  "featured": true,
  "published": true,
  "category": { "id": "...", "name": "美食之旅", "slug": "food-tour", "icon": "🍜" },
  "author": {
    "id": "...",
    "name": "管理员",
    "avatar": "https://...",
    "bio": "百途旅行的管理员..."
  }
}
```

**响应** `404 Not Found`
```json
{ "error": "旅行体验不存在" }
```

---

### GET /api/experiences/search

全文搜索体验（标题/描述/地点）。

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `q` | string | - | 搜索关键词 |
| `page` | int | 1 | 页码 |
| `limit` | int | 10 | 每页条数 |

```bash
curl "http://localhost:3000/api/experiences/search?q=冰岛&page=1&limit=5"
curl "http://localhost:3000/api/experiences/search?q=拉面"
```

**响应** `200 OK` — 格式与 GET /api/experiences 相同。空查询返回空数组。

---

### POST /api/register

注册新用户。

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"测试用户","email":"user@example.com","password":"Test1234"}'
```

密码要求：至少 8 位，包含大写字母、小写字母和数字。

**响应** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": "...", "name": "测试用户", "email": "user@example.com", "role": "USER" }
}
```

---

### GET /api/experiences/[slug]/favorite

获取体验收藏状态和总数（可选登录）。

```bash
curl http://localhost:3000/api/experiences/tokyo-ramen-tour/favorite
# 登录用户：
curl http://localhost:3000/api/experiences/tokyo-ramen-tour/favorite \
  -H "Authorization: Bearer $TOKEN"
```

**响应** `200 OK`
```json
{ "favorited": false, "count": 5 }
```

### POST /api/experiences/[slug]/favorite

切换收藏状态（需登录）。已收藏则取消，未收藏则添加。

```bash
curl -X POST http://localhost:3000/api/experiences/tokyo-ramen-tour/favorite \
  -H "Authorization: Bearer $TOKEN"
```

**响应** `200 OK` / `201 Created`
```json
{ "favorited": true }
```

---

### GET /api/experiences/[slug]/comments

获取体验评论列表。

```bash
curl http://localhost:3000/api/experiences/tokyo-ramen-tour/comments
```

**响应** `200 OK`
```json
[
  {
    "id": "...",
    "content": "太棒的体验！",
    "user": { "id": "...", "name": "用户", "avatar": null },
    "createdAt": "2026-06-11T..."
  }
]
```

### POST /api/experiences/[slug]/comments

发表评论（需登录）。内容自动清洗 HTML 标签。

```bash
curl -X POST http://localhost:3000/api/experiences/tokyo-ramen-tour/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content":"这是我梦寐以求的旅行方式！"}'
```

**响应** `201 Created`

---

## 管理端接口

所有管理端接口需在请求头中携带 JWT 令牌：

```
Authorization: Bearer <token>
```

### POST /api/admin/login

管理员登录。

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@100ways.com","password":"admin123"}'
```

**响应** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "cmq...",
    "name": "管理员",
    "email": "admin@100ways.com",
    "role": "ADMIN",
    "avatar": "https://..."
  }
}
```

**错误响应**
- `400` — 输入格式不正确（Zod 校验失败）
- `401` — 邮箱或密码错误 / 非管理员账号

---

### GET /api/admin/experiences

管理员体验列表（含未发布项）。

```bash
curl http://localhost:3000/api/admin/experiences?page=1&limit=20 \
  -H "Authorization: Bearer $TOKEN"
```

响应格式与公开列表相同，但包含 `published: false` 的体验。

---

### POST /api/admin/experiences

创建新体验。

```bash
curl -X POST http://localhost:3000/api/admin/experiences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "测试体验",
    "slug": "test-experience",
    "description": "这是一个测试",
    "location": "测试地点",
    "price": 999,
    "duration": "2天",
    "images": ["https://example.com/img.jpg"],
    "featured": false,
    "published": true,
    "categoryId": "<category_id>"
  }'
```

**响应** `201 Created` — 返回创建的体验对象。

---

### PUT /api/admin/experiences/[id]

更新体验（支持部分更新）。

```bash
curl -X PUT http://localhost:3000/api/admin/experiences/<id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"已更新标题","featured":true}'
```

**响应** `200 OK` — 返回更新后的体验对象。

---

### DELETE /api/admin/experiences/[id]

删除体验。

```bash
curl -X DELETE http://localhost:3000/api/admin/experiences/<id> \
  -H "Authorization: Bearer $TOKEN"
```

**响应** `204 No Content`。

---

### GET /api/admin/categories

管理员分类列表。

```bash
curl http://localhost:3000/api/admin/categories \
  -H "Authorization: Bearer $TOKEN"
```

响应格式与公开列表相同，但计数包含所有体验（含未发布）。

---

### POST /api/admin/categories

创建分类。

```bash
curl -X POST http://localhost:3000/api/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"新分类","slug":"new-category","description":"描述","icon":"🎯"}'
```

**响应** `201 Created`。

---

### PUT /api/admin/categories/[id]

更新分类。

```bash
curl -X PUT http://localhost:3000/api/admin/categories/<id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description":"更新后的描述"}'
```

**响应** `200 OK`。

---

### DELETE /api/admin/categories/[id]

删除分类（有关联体验时拒绝）。

```bash
curl -X DELETE http://localhost:3000/api/admin/categories/<id> \
  -H "Authorization: Bearer $TOKEN"
```

**响应** `204 No Content` 或 `400`（有关联体验）。

---

## 鉴权说明

使用 JWT HS256 算法。令牌签发时包含：
- `sub` — 用户 ID
- `email` — 邮箱
- `role` — 角色（USER / ADMIN）
- `iat` — 签发时间
- `exp` — 过期时间（7 天）

非管理员（role ≠ ADMIN）访问管理端接口返回 `403 Forbidden`。

---

## 错误码

| 状态码 | 说明 |
|---|---|
| 200 | 成功 |
| 201 | 创建成功 |
| 204 | 删除成功（无响应体） |
| 400 | 请求参数错误（Zod 校验失败） |
| 401 | 未登录或令牌无效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
