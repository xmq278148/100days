import os
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

class PhotoHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/get_photos':
            # 获取百天照文件夹中的照片
            photo_dir = Path(r'C:\熊的文件\百天照')
            photos = []
            
            # 获取所有jpg和png文件
            for file in photo_dir.glob('*.[jJ][pP][gG]'):
                photos.append({
                    'url': f'./百天照/{file.name}',
                    'title': f'熊睿霖百天照 - {file.stem}'
                })
            
            # 按文件名排序
            photos.sort(key=lambda x: x['url'])
            
            # 只取前8张
            photos = photos[:8]
            
            # 返回JSON数据
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(photos).encode())
            return
            
        return SimpleHTTPRequestHandler.do_GET(self)

# 启动服务器
httpd = HTTPServer(('localhost', 8000), PhotoHandler)
print("服务器启动在 http://localhost:8000")
httpd.serve_forever() 