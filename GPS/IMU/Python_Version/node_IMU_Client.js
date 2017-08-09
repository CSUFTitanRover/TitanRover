var ws = new WebSocket('ws://localhost:9015/');
ws.onmessage = function(e) {alert(e.data);};

