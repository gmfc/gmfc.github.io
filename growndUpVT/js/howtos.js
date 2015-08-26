var refr = true;
var difCounter = 17;
var g1;
var g1 = new JustGage({
	id: "g1",
	value: 0,
	min: 0,
	max: 102400,
	title: "Velocidade",
	label: "kBps",
	relativeGaugeSize: true,
	formatNumber: true,
	gaugeWidthScale: 0.6,
	donut: true
});
var g2;
var g2 = new JustGage({
	id: "g2",
	value: 0,
	min: 0,
	max: 400,
	title: "Ping",
	label: "ms",
	relativeGaugeSize: true,
	donut: true
});
var g3;
var g3 = new JustGage({
	id: "g3",
	value: 100,
	min: 0,
	max: 100,
	title: "Erro",
	label: "%",
	formatNumber: true,
	relativeGaugeSize: true
});

function customValue(val) {
	if (val < 50) {
		return 'low';
        } else if (val > 50) {
        	return 'high';
        } else if (val === 50) {
        	return 'ideal';
        }
}


$('#results').on("me", function () {
	if(refr){
		difCounter -=5;
		//g1.refresh(difCounter*1024);
		//g2.refresh(difCounter*2.8);
		g3.refresh(difCounter*2);
	}
});

// Since we don't set a beacon_url, we'll just subscribe to the before_beacon function
// and print the results into the browser itself.
BOOMR.subscribe('before_beacon', function(o) {
    //console.log(o);
	var html = "", t_name, t_other, others = [];

	if(!o.t_other) o.t_other = "";

	for(var k in o) {
		if(!k.match(/^(t_done|t_other|bw|lat|bw_err|lat_err|u|r2?)$/)) {
			if(k.match(/^t_/)) {
				o.t_other += "," + k + "|" + o[k];
			}
			else {
				others.push(k + " = " + o[k]);
			}
		}
	}

	if(o.t_done) { html += "<span>A pagina demorou " + o.t_done + " ms para carregar</span>"; }
	if(o.bw) { html += "<span>Sua conexão é de " + parseInt((o.bw*8/1024)/1024) + "Mbps (Erro de &#x00b1;" + parseInt(o.bw_err*100/o.bw) + "%)</span>"; 
		g1.refresh((o.bw*8/1024));
		g3.refresh(o.bw_err*100/o.bw);
		refr = false;
	}
	if(o.lat) { html += "<span>Seu ping: " + parseInt(o.lat) + "ms (Erro de &#x00b1;" + o.lat_err + "ms)</span>"; 
		g2.refresh(parseInt(o.lat));
		refr = false;
		console.log(difCounter);
	}

	var r = document.getElementById('results');
	r.innerHTML = html;

});

