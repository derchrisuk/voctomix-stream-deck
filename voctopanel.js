const path = require('path');
const streamDeck = require('elgato-stream-deck');
var net = require('net');
var sleep = require('sleep');
var client = new net.Socket();
var SRC_A = 'cam1';
var SRC_B = 'cam2';
var a = 0;
var b = 0;


client.connect(9999, '10.73.80.3', function() {
    console.log('Client connected');
    client.write('get_video\n');
    client.write('get_composite_mode\n');
    streamDeck.fillColor(5, 128, 128, 128);
});

client.on('data', function(data) {
    command = String(data);
    command = command.replace(/[\n\r]/g, '');
    switch (String(command)) {
        case 'composite_mode fullscreen':
            console.log('GET: Fullscreen');
            streamDeck.fillColor(4, 255, 0, 0);
            streamDeck.fillColor(3, 0, 255, 0);
            streamDeck.fillColor(2, 0, 255, 0);
            streamDeck.fillColor(1, 0, 255, 0);
            break;
        case 'composite_mode side_by_side_equal':
            console.log('GET: Equal');
            streamDeck.fillColor(2, 255, 0, 0);
            streamDeck.fillColor(4, 0, 255, 0);
            streamDeck.fillColor(3, 0, 255, 0);
            streamDeck.fillColor(1, 0, 255, 0);
            break;
        case 'composite_mode side_by_side_preview':
            console.log('GET: Preview');
            streamDeck.fillColor(1, 255, 0, 0);
            streamDeck.fillColor(4, 0, 255, 0);
            streamDeck.fillColor(3, 0, 255, 0);
            streamDeck.fillColor(2, 0, 255, 0);
            break;
        case 'composite_mode picture_in_picture':
            console.log('GET: PIP');
            streamDeck.fillColor(3, 255, 0, 0);
            streamDeck.fillColor(4, 0, 255, 0);
            streamDeck.fillColor(2, 0, 255, 0);
            streamDeck.fillColor(1, 0, 255, 0);
            break;
        case 'video_status cam1 cam2':
            console.log('GET: A: Cam1 / B: Cam2');
            streamDeck.fillColor(9, 0, 255, 0);
            streamDeck.fillColor(8, 0, 255, 0);
            streamDeck.fillColor(7, 0, 255, 0);
            streamDeck.fillColor(14, 0, 255, 0);
            streamDeck.fillColor(13, 0, 255, 0);
            streamDeck.fillColor(12, 0, 255, 0);
            streamDeck.fillColor(9, 255, 0, 0);
            streamDeck.fillColor(13, 255, 0, 0);
            break;
        case 'video_status cam1 slides':
            console.log('GET: A: Cam1 / B: Slides');
            streamDeck.fillColor(9, 0, 255, 0);
            streamDeck.fillColor(8, 0, 255, 0);
            streamDeck.fillColor(7, 0, 255, 0);
            streamDeck.fillColor(14, 0, 255, 0);
            streamDeck.fillColor(13, 0, 255, 0);
            streamDeck.fillColor(12, 0, 255, 0);
            streamDeck.fillColor(9, 255, 0, 0);
            streamDeck.fillColor(12, 255, 0, 0);
            break;
        case 'video_status cam2 cam1':
            console.log('GET: A: Cam2 / B: Cam1');
            streamDeck.fillColor(9, 0, 255, 0);
            streamDeck.fillColor(8, 0, 255, 0);
            streamDeck.fillColor(7, 0, 255, 0);
            streamDeck.fillColor(14, 0, 255, 0);
            streamDeck.fillColor(13, 0, 255, 0);
            streamDeck.fillColor(12, 0, 255, 0);
            streamDeck.fillColor(8, 255, 0, 0);
            streamDeck.fillColor(14, 255, 0, 0);
            break;
        case 'video_status cam2 slides':
            console.log('GET: A: Cam2 / B: Slides');
            streamDeck.fillColor(9, 0, 255, 0);
            streamDeck.fillColor(8, 0, 255, 0);
            streamDeck.fillColor(7, 0, 255, 0);
            streamDeck.fillColor(14, 0, 255, 0);
            streamDeck.fillColor(13, 0, 255, 0);
            streamDeck.fillColor(12, 0, 255, 0);
            streamDeck.fillColor(8, 255, 0, 0);
            streamDeck.fillColor(12, 255, 0, 0);
            break;
        case 'video_status slides cam1':
            console.log('GET: A: Slides / B: Cam1');
            streamDeck.fillColor(9, 0, 255, 0);
            streamDeck.fillColor(8, 0, 255, 0);
            streamDeck.fillColor(7, 0, 255, 0);
            streamDeck.fillColor(14, 0, 255, 0);
            streamDeck.fillColor(13, 0, 255, 0);
            streamDeck.fillColor(12, 0, 255, 0);
            streamDeck.fillColor(7, 255, 0, 0);
            streamDeck.fillColor(14, 255, 0, 0);
            break;
        case 'video_status slides cam2':
            console.log('GET: A: Slides / B: Cam2');
            streamDeck.fillColor(9, 0, 255, 0);
            streamDeck.fillColor(8, 0, 255, 0);
            streamDeck.fillColor(7, 0, 255, 0);
            streamDeck.fillColor(14, 0, 255, 0);
            streamDeck.fillColor(13, 0, 255, 0);
            streamDeck.fillColor(12, 0, 255, 0);
            streamDeck.fillColor(7, 255, 0, 0);
            streamDeck.fillColor(13, 255, 0, 0);
            break;
    }
});

client.on('close', function() {
    console.log('Client disconnected');
});

client.on('error', error => {
    console.error(error);
});

streamDeck.on('down', keyIndex => {
    switch (keyIndex) {
        case 4:
            console.log('SET: Fullscreen');
            client.write('set_composite_mode fullscreen\n');
            break;
        case 2:
            console.log('SET: Equal');
            client.write('set_composite_mode side_by_side_equal\n');
            break;
        case 1:
            console.log('SET: Preview');
            client.write('set_composite_mode side_by_side_preview\n');
            break;
        case 3:
            console.log('SET: PIP');
            client.write('set_composite_mode picture_in_picture\n');
            break;
        case 0:
            console.log('SET: Stream');
            break;

        case 9:
            console.log('SET: A Cam1');
            a = 1;
            SRC_A = 'cam1';
            streamDeck.fillColor(9, 0, 0, 0);
            streamDeck.fillColor(8, 0, 0, 0);
            streamDeck.fillColor(7, 0, 0, 0);
	    streamDeck.fillColor(9, 0, 0, 255);
            break;
        case 8:
            console.log('SET: A Cam2');
            a = 1;
            SRC_A = 'cam2';
            streamDeck.fillColor(9, 0, 0, 0);
            streamDeck.fillColor(8, 0, 0, 0);
            streamDeck.fillColor(7, 0, 0, 0);
            streamDeck.fillColor(8, 0, 0, 255);
            break;
        case 7:
            console.log('SET: A Slides');
            a = 1;
            SRC_A = 'slides';
            streamDeck.fillColor(9, 0, 0, 0);
            streamDeck.fillColor(8, 0, 0, 0);
            streamDeck.fillColor(7, 0, 0, 0);
            streamDeck.fillColor(7, 0, 0, 255);
            break;
        case 6:
            console.log('Not set');
            break;
        case 5:
            console.log('SET: Take');
            if (a == 0 || b == 0) { 
                break;
            } else if (SRC_A == SRC_B) {
                break;
            } else {
                client.write('set_videos_and_composite ' + SRC_A + ' ' + SRC_B + ' *\n');
            }
            break;

        case 14:
            console.log('SET: B Cam1');
            b = 1;
            SRC_B = 'cam1';
            streamDeck.fillColor(14, 0, 0, 0);
            streamDeck.fillColor(13, 0, 0, 0);
            streamDeck.fillColor(12, 0, 0, 0);
            streamDeck.fillColor(14, 0, 0, 255);
            break;
        case 13:
            console.log('SET: B Cam2');
            b = 1;
            SRC_B = 'cam2';
            streamDeck.fillColor(14, 0, 0, 0);
            streamDeck.fillColor(13, 0, 0, 0);
            streamDeck.fillColor(12, 0, 0, 0);
            streamDeck.fillColor(13, 0, 0, 255);
            break;
        case 12:
            console.log('SET: B Slides');
            b = 1;
            SRC_B = 'slides';
            streamDeck.fillColor(14, 0, 0, 0);
            streamDeck.fillColor(13, 0, 0, 0);
            streamDeck.fillColor(12, 0, 0, 0);
            streamDeck.fillColor(12, 0, 0, 255);
            break;
        case 11:
            console.log('Not set');
            break;
        case 10:
            console.log('SET: Clear');
            for (let i = 0; i < 15; i++) {
                streamDeck.fillColor(i, 0, 0, 0);
            }
            client.write('get_video\n');
            client.write('get_composite_mode\n');
            //streamDeck.fillColor(5, 128, 128, 128);
            break;
    }
});

streamDeck.on('error', error => {
    console.error(error);
});

