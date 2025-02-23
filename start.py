from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
from webbrowser import open

PORT = 8000
handler = SimpleHTTPRequestHandler

error = None

with TCPServer(("", 8000), handler) as httpd:
    print("Serivdor iniciado en el puerto:", PORT)
    open(f"http://localhost:{PORT}")
    httpd.serve_forever()