// var answers1Array = answers1.split(',');
// var answers2Array = answers2.split(',');
// var answers3Array = answers3.split(',');
// console.log(answers1Array);
// console.log(answers2Array);
// console.log(answers3Array);

var canvas1 = document.getElementById('canvas1');
var ctx1 = canvas1.getContext('2d');

var canvas2 = document.getElementById('canvas2');
var ctx2 = canvas2.getContext('2d');

var canvas3 = document.getElementById('canvas3');
var ctx3 = canvas3.getContext('2d');

function drawBar1(answerNum, avg){
  ctx1.fillStyle = '#ff0000';
  ctx1.fillRect(answerNum*60, 200-avg*2, 40, avg*2);
}
function drawBar2(answerNum, avg){
  ctx2.fillStyle = '#0000ff';
  ctx2.fillRect(answerNum*60, 200-avg*2, 40, avg*2);
}
function drawBar3(answerNum, avg){
  ctx3.fillStyle = '#00ff00';
  ctx3.fillRect(answerNum*60, 200-avg*2, 40, avg*2);
}

drawBar1(0, 18);
drawBar1(1, 24);
drawBar1(2, 15);
drawBar1(3, 12);
drawBar1(4, 31);

drawBar2(0, 18);
drawBar2(4, 24);
drawBar2(1, 15);
drawBar2(2, 12);
drawBar2(3, 31);

drawBar3(2, 18);
drawBar3(0, 24);
drawBar3(3, 15);
drawBar3(4, 12);
drawBar3(1, 31);
