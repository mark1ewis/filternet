var getSNI = require('../lib/sniparse').getSNI;
var fs = require('fs');
var assert = require('assert');

var load = function(name, callback) {
	fs.open(name, 'r', function(status, fd) {
		if(status) {
			console.log(status.message);
		}
		else {
			var buffer = new Buffer(1024);
			fs.read(fd, buffer, 0, 1024, 0, function(err, num) {
				callback(buffer.slice(0, num));
			});
		}
	});
}

load('sni-complete.packet', function(buffer) {
	var result = getSNI(buffer);
	assert(result.isHandshake, "is handshake");
	assert(!result.needMoreData, "need more bytes");
	assert.equal(result.host, "apache.org");
});

load('not-handshake.packet', function(buffer) {
	var result = getSNI(buffer);
	assert(!result.isHandshake, "is not handshake");
});

load('no-sni.packet', function(buffer) {
	var result = getSNI(buffer);
	assert(result.isHandshake, "is handshake");
	assert(!result.needMoreData, "need more bytes");
	assert.equal(result.host, null);
});

load('sni-partial.packet', function(buffer) {
	var result = getSNI(buffer);
	assert(result.isHandshake, "is handshake");
	assert(result.needMoreData, "need more bytes");
});
