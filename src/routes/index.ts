import * as http from 'http';
import * as url from 'url';
import UserController from '../controllers/user.controller';
import { User } from '../models/user.model';

export const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const parsedUrl = url.parse(req.url || '', true);
    try {
        if (parsedUrl.pathname === '/users' && req.method === 'GET') {
            UserController.get((error, users) => {
                if (error) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ "error":error }));
                } else {                                
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({"data" : users}));
                }
            });
        } else if (parsedUrl.pathname && parsedUrl.pathname.startsWith('/users/') && req.method === 'GET') {
            const userId = parseInt(parsedUrl.pathname.split('/')[2]);
            UserController.find(userId, (error, user) => {
                if (error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ "error":error }));
                  } else {                                
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({"data" : user}));
                }
              });
        } else if (parsedUrl.pathname === '/users' && req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                const newUser: User = JSON.parse(body);
                UserController.store(newUser, (error, createdUser) => {
                    if (error) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ "error": error }));
                    } else {                                
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({"status" : "data stored sucessfully", "data" : createdUser}));
                    }
                  });
            });
        } else if (parsedUrl.pathname && parsedUrl.pathname.startsWith('/users/') && req.method === 'PUT') {
            const userId = parseInt(parsedUrl.pathname.split('/')[2]);
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                const updatedUser: User = JSON.parse(body);
                UserController.edit(userId, updatedUser, (error: any) => {
                    if (error) {
                      res.writeHead(400, { 'Content-Type': 'application/json' });
                      res.end(JSON.stringify({ "error": error }));
                    } else {
                        if (updatedUser) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ "status": "data update sucsessfully", "data" : updatedUser}));
                        } else {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ "error": error }));
                        }
                    }
                  });               
            });
        } else if (parsedUrl.pathname && parsedUrl.pathname.startsWith('/users/') && req.method === 'DELETE') {
            const userId = parseInt(parsedUrl.pathname.split('/')[2]);
            UserController.destroy(userId, (error: any) => {
                if (error) {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ "error": error }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ "status" : "User deleted successfully"}));
                }
              });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ "error": 'Route not found'}));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ "error": error }));
    }
  });