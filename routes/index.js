const express = require('express');
const EventEmitter = require('node:events');
const markdownRenderer = require('markdown-it')();
const fs = require('node:fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const eventBusMap = new Map();

router.get('/', function(req, res) {
	console.log(req.ip);
	const markdown = fs.readFileSync('./README.md', 'utf-8');
	const html = markdownRenderer.render(markdown);
	res.send(html);
});

router.get('/ping', function(req, res) {
	res.send('pong');
});

// subscribe events
router.get('/sub', function(req, res) {
	// server sent events
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Connection', 'keep-alive');

	const id = uuidv4();
	const eventBus = new EventEmitter();

	eventBusMap.set(id, eventBus);

	res.write(`data: ${JSON.stringify({
		event: 'Init',
		id: id
	})}\n\n`);

	eventBus.on('pub', (data) => {
		res.write(`data: ${JSON.stringify({
			event: 'Pub',
			data,
			id
		})}\n\n`);
	});

	// 如果客户端关闭连接，停止发送事件
	req.on('close', () => {
		eventBusMap.delete(id);
		console.log(`id: ${id}`, ' closed!');
		res.end();
	});
});


router.post('/pub/:id', function(req, res) {
	const {params: {id}} = req;
	const eventBus = eventBusMap.get(id);
	
	console.log('id: ', id);
	if(!id || !eventBus) {
		return res.status(500).send({
			message: 'Id not Found!',
			success: false
		});
	}

	eventBus.emit('pub', req.body);
	res.send({
		message: 'ok',
		success: true
	});
});

module.exports = router;
