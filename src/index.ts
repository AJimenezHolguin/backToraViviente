import http from 'http';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hola, mundo con TypeScript!\n');
});

const PORT = 8080;
server.listen(PORT, () => {
console.log(`Servidor corriendo en http://localhost:${PORT}/`);
});