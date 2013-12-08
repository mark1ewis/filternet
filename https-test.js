var proxyModule = require('./lib/proxy');

var proxy = proxyModule.createProxyServer({
	port: 8000,
	transSslPort: 8001,
	via: 'filternet.js/1.0'
});

function checkDomain(domain, src, url, callback) {
	console.log(domain);
	callback(false);
}

proxy.on('shouldReject', function (request, callback) {
	var src = request.connection.remoteAddress;
	checkDomain(request.headers.host, src, request.url, callback);
});

proxy.on('shouldRejectSSL', function (request, callback) {
	var src = request.socket.remoteAddress
	checkDomain(request.hostName, src, '(ssl_protected) ' + request.hostName, callback);
});

proxy.on('error', function(err, type) {
	if(type=='httpsClientSocket' && err.code=='EPIPE') {
		// This is normal after the SSL server disconnects
	}
	else console.log(err, 'Proxy error %s', type);
});

proxy.on('clientError', function(err, type) {
	console.log('Proxy client error %s', type, err);
});
