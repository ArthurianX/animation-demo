/*var animation = lottie.loadAnimation({
	container: document.getElementById('bm'),
	renderer: 'svg',
	loop: true,
	autoplay: true,
	path: 'data4.json'
})*/

/* Running Settings / Variables */

var introText = 'Where is Starman?';
var introTextCode = [87,104,101,114,101,32,105,115,32,83,116,97,114,109,97,110,63];
var introTextLength = 17;

var introLetterIndex = 0;
var minmaxtimeout = [110, 100];



var anims = [];
var elementsContainer = document.getElementsByClassName('elementsContainer')[0];
/*var updatedColors = {
	0: [0, 2 / 255, 61 / 255, 0],
	1: [243 / 255, 146 / 255, 0, 0],
	2: [76 / 255, 181 / 255, 143 / 255, 0],
	3: [1, 1, 1, 0]
};*/

// Modified from ^
var updatedColors = {
	0: [0.027450980392156862,0.5686274509803921,1,0],
	1: [0.9529411764705882,0.5725490196078431,0,0],
	2: [0.2980392156862745,0.7098039215686275,0.5607843137254902,0],
	3: [1,1,1,0]
};

var currentSource = -1;
var blinker = document.getElementById('blinker');
var caretPosition = 0;

function addLetter(code, fromUserInput) {
	// console.log('code: ',code, fromUserInput);
	var anim;
	if (code === 13 || code === 10) {
		anim = newLineFactory.animation();
	} else {
		anim = factoryAnimation.animation(code, fromUserInput);
	}

	anims.splice(caretPosition, 0, anim);
	//anims.push(anim);
	caretPosition += 1;
}

function keydownHandler(ev) {
	if (currentSource === 1) {
		return;
	}
	if (ev.keyCode === 8 && caretPosition > 0) {
		anims[caretPosition - 1].destroy();
		ev.stopImmediatePropagation();
		ev.preventDefault();
	} else if (ev.keyCode === 37 && caretPosition > 0) {
		caretPosition -= 1;
		elementsContainer.insertBefore(blinker, anims[caretPosition].bmElem);
	} else if (ev.keyCode === 39 && caretPosition < anims.length) {
		caretPosition += 1;
		if (caretPosition === anims.length) {
			elementsContainer.appendChild(blinker);
		} else {
			elementsContainer.insertBefore(blinker, anims[caretPosition].bmElem);
		}
	} else if (ev.keyCode === 36) {
		caretPosition = 0;
		elementsContainer.insertBefore(blinker, anims[caretPosition].bmElem);
	} else if (ev.keyCode === 35) {
		caretPosition = anims.length;
		elementsContainer.appendChild(blinker);
	} else if (ev.keyCode === 46 && caretPosition < anims.length) {
		anims[caretPosition].destroy();
		caretPosition += 1;
	}
}

function keypressHandler(ev) {
	if (currentSource === 1) {
		return;
	}
	//console.log(ev);
	var code = ev.keyCode || ev.charCode;
	addLetter(code, true);
	ev.preventDefault();
	ev.stopImmediatePropagation();
}

function changeColor(pos, hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	var colorComponents = result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : [1, 0, 0, 0];
	updatedColors[pos][0] = colorComponents.r / 255;
	updatedColors[pos][1] = colorComponents.g / 255;
	updatedColors[pos][2] = colorComponents.b / 255;
	animationProvider.updateColors(updatedColors);
}

function colorChange0(val) {
	changeColor(0, val);
}

function colorChange1(val) {
	changeColor(1, val);
}

function colorChange2(val) {
	changeColor(2, val);
}

function colorChange3(val) {
	changeColor(3, val);
}

function resetColors() {
	updatedColors = {
		0: [0, 2 / 255, 61 / 255, 0],
		1: [243 / 255, 146 / 255, 0, 0],
		2: [76 / 255, 181 / 255, 143 / 255, 0],
		3: [1, 1, 1, 0]
	};
	settings.setColor('Color 1', '#00023D');
	settings.setColor('Color 2', '#F39200');
	settings.setColor('Color 3', '#4CB58F');
	settings.setColor('Color 4', '#ffffff');
	try {
		document.getElementById('Color 1').parentNode.getElementsByTagName('label')[0].style.backgroundColor = '#00023D';
		document.getElementById('Color 2').parentNode.getElementsByTagName('label')[0].style.backgroundColor = '#F39200';
		document.getElementById('Color 3').parentNode.getElementsByTagName('label')[0].style.backgroundColor = '#4CB58F';
		document.getElementById('Color 4').parentNode.getElementsByTagName('label')[0].style.backgroundColor = '#ffffff';
	} catch (err) {

	}
	animationProvider.updateColors(updatedColors);
}

function changeFeedSource(src,keepOpen) {
	if (src.index === currentSource) {
		return;
	}
	clear();
	if (src.index === 0) {
		twitter_feed.stop();
		blinker.setAttribute('class', 'bm blinker');
	} else {
		twitter_feed.init();
		blinker.setAttribute('class', 'bm blinker hidden');
	}
	currentSource = src.index;
	if (!settings._collapsed && !keepOpen) {
		settings.collapse();
	}
}

function trackingChange(val){
	var elems = document.getElementsByClassName('bm');
	var i, len = elems.length;
	for(i=0;i<len;i+=1){
		if(elems[i].id !== 'blinker'){
			elems[i].style.marginLeft = -(100-val)+'px';
		}
	}
}

function clear() {
	while (anims.length) {
		anims.pop().destroy();
	}
	caretPosition = 0;
}

function clearAnimation(elem) {
	var i = 0,
		len = anims.length;
	while (i < len) {
		if (anims[i] === elem) {
			anims.splice(i, 1);
			caretPosition -= 1;
			break;
		}
		i += 1;
	}
}

function changeAlignment(val) {
	var align = '';
	switch (val.index) {
		case 0:
			align = 'left';
			break;
		case 1:
			align = 'right';
			break;
		case 2:
			align = 'center';
			break
	}
	elementsContainer.style.textAlign = align;
}

function collapse(){
	settings.collapse();
}

document.addEventListener('keypress', keypressHandler);
document.addEventListener('keydown', keydownHandler);

animationProvider.init();

if (QuickSettings) {

	var settings = QuickSettings.create(window.innerWidth - 200, 10, 'Options Panel (Dbl Click to open)')
		.addButton('Collapse', collapse)
		.addColor('Color 1', '#00023D', colorChange0)
		.addColor('Color 2', '#F39200', colorChange1)
		.addColor('Color 3', '#4CB58F', colorChange2)
		.addColor('Color 4', '#ffffff', colorChange3)
		.addButton('Reset Colors', resetColors)
		.addBoolean('Italic', 0, factoryAnimation.setItalic)
		.addBoolean('Underline', 0, factoryAnimation.setUnderline)
		.addDropDown('Text align', ['Left', 'Right', 'Center'], changeAlignment)
		.addRange('Tracking', 60, 100, 70, 1, trackingChange)
		.addDropDown('Source', ['I want to write', 'Automatic'], changeFeedSource)
		.addButton('Clear', clear)
		.collapse();
}

changeFeedSource({
	index: 0
}, true);

window.onresize = function(){
	if(settings){
		settings._panel.style.left = (window.innerWidth - 200) + 'px';
	}
}

window.focus();

var calculateMargin = function() {
	// 65 * 17
	// 25 * 17
	var width = $('body').width();

	if (width > 800) {
		$('.elementsContainer.introContainer').css('margin-left', (width - (65*17)) / 2 + 'px')
	} else {
		$('.elementsContainer.introContainer').css('margin-left', (width - (25*17)) / 2 + 'px')
	}
};

var stickVerticalImages = function(){
	var w = $('body').width();
	var h = $('body').height();

	$('.para-bg').css({'width': w * 12 + 'px', 'height': h + 'px'});
	$('.para-bg > div').css({'width': w + 'px', 'height': h + 'px'});
};

var startParallax = function(e) {
	$('body').addClass('start-parallax');
	// display certain div after 3 seconds
	var startOffset = $('body').height() * (60/100)
	$('.para-content').on('scroll', function(){
		var offset = $('.para-content p').offset().top - startOffset;
		$('.para-bg').css('left', Math.floor(offset) + 'px');
	});

};


var startLottie = function() {
	setTimeout(function(){

		blinker.setAttribute('class', 'bm blinker hidden');
		colorChange0('#53b7ff');
		trackingChange(60);
		calculateMargin();

		setInterval(function(){
			if (introLetterIndex < introTextLength) {
				// addLetter(introTextCode[introLetterIndex], introText[introLetterIndex]);
				addLetter(introTextCode[introLetterIndex], false);
				introLetterIndex += 1;
			} else {
				clearInterval(this);
			}

			if (introLetterIndex == 17) {

				$('.bm:nth-child(2)').css('cursor', 'pointer');
				$('.bm:nth-child(3)').css('cursor', 'pointer');
				$('.bm:nth-child(4)').css('cursor', 'pointer');
				$('.bm:nth-child(5)').css('cursor', 'pointer');

				$('.bm:nth-child(2)').on('click', startParallax);
				$('.bm:nth-child(3)').on('click', startParallax);
				$('.bm:nth-child(4)').on('click', startParallax);
				$('.bm:nth-child(5)').on('click', startParallax);

				setTimeout(function(){
					$('.bm:nth-child(2)').css('border-bottom', '6px solid #4CB58F');
					$('.bm:nth-child(3)').css('border-bottom', '6px solid #4CB58F');
					$('.bm:nth-child(4)').css('border-bottom', '6px solid #4CB58F');
					$('.bm:nth-child(5)').css('border-bottom', '6px solid #4CB58F');
				}, 7000)

			}

		}, Math.floor(Math.random()*(minmaxtimeout[0]-minmaxtimeout[1]+1)+minmaxtimeout[0]));

	}, 2000);
}

$( document ).ready(function() {




});

$('body').on('startStuff', function() {

	startLottie();
	stickVerticalImages();



});


