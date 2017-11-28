#!/usr/bin/env python3
import gi
import signal
import logging
import sys
import os
import threading
from lib.config import Config
from lib.streamdeck import StreamDeck
import lib.connection as Connection

log = logging.getLogger('Voctopanel')

# check min-version
minPy = (3, 0)

if sys.version_info < minPy:
    raise Exception('Python version', sys.version_info,
                    'is too old, at least', minPy, 'is required')

StreamDeck = StreamDeck()
StreamDeck.set_brightness(1)
StreamDeck.display_clear('all')
StreamDeck.set_brightness(100)

current_mode = 0
current_video_a = 0
current_video_b = 0

# run Gtk main loop in background
gui_ready = threading.Event()

def run_gui_thread():
    from gi.repository import GObject
    GObject.threads_init()
    gi.require_version('Gtk', '3.0')
    from gi.repository import Gtk
    gui_ready.set()
    Gtk.main()

gui_thread = threading.Thread(target=run_gui_thread)
gui_thread.start()    
gui_ready.wait()

def listenStreamDeck():
    while True:
        button = StreamDeck.button_getch()
        try:
            command = Config.get('buttons', str(button))
        except:
            log.info('Button not recognized')
        log.info('Button: %s, Sending: %s', button, command) 
        Connection.send(command)

def buildPanel():
    for btn in range(1, 15): 
        try:
            button = Config.get('icons', str(btn))
        except:
            log.info('Button not recognized')
        log.info('Setting Button: %s to: %s', btn, button.split(',')[2])
      
        StreamDeck.display_icon(int(btn), StreamDeck.Icon.prep(button.split(',')[2], 1))
        #StreamDeck.display_icon(int(btn), StreamDeck.Icon.text('Active', ico=StreamDeck.Icon.solid('00ff00'), col='000000', size=20))

def on_composite_mode(mode):
    global current_mode
    log.info('on_composite_mode callback w/ mode %s', mode)
    try:
        button = Config.get('modes', str(mode))
    except:
        log.info('Mode not found')
    log.info('Set active mode to: %s', button)
    ico = StreamDeck.Icon.solid('00ff00')
    log.info('Current mode: %s', current_mode)
    if int(current_mode) == int(button):
        return
    elif current_mode == 0:
        StreamDeck.display_icon(int(button), StreamDeck.Icon.text('Active', ico=ico, col='000000', size=20, position=(40, 31)))
    else:
        StreamDeck.display_clear(int(current_mode))
        StreamDeck.display_icon(int(button), StreamDeck.Icon.text('Active', ico=ico, col='000000', size=20, position=(40, 31)))
    current_mode = button

def on_video_status(video_a, video_b):
    global current_video_a
    global current_video_b
    log.info('on_video_status callback w/ mode %s %s', video_a, video_b)
    try:
        button_a = Config.get('modes', 'video_a_' + str(video_a))
        button_b = Config.get('modes', 'video_b_' + str(video_b))
    except:
        log.info('Mode not found')
    log.info('Set active mode to: %s %s', button_a, button_b)
    if 'cam' in video_a:
       position_a = (21, 25)
       size_a = 16
       ico_a = StreamDeck.Icon.prep('video_cam', 1)
    else:
       position_a = (32, 25)
       size_a = 12
       ico_a = StreamDeck.Icon.prep('video_grabber', 1)
    
    if 'cam' in video_b:
       position_b = (21, 25)
       size_b = 16
       ico_b = StreamDeck.Icon.prep('video_cam', 1)
    else:
       position_b = (32, 25)
       size_b = 12
       ico_b = StreamDeck.Icon.prep('video_grabber', 1) 
    log.info('Current mode: %s %s', current_video_a, current_video_b)
    if(int(current_video_a) == int(button_a)) and (int(current_video_b) == int(button_b)):
        return
    elif(current_video_a == 0) and (current_video_b == 0):
        StreamDeck.display_icon(int(button_a), StreamDeck.Icon.text(str(video_a), ico=ico_a, col='00ff00', size=size_a, position=position_a))
        StreamDeck.display_icon(int(button_b), StreamDeck.Icon.text(str(video_b), ico=ico_b, col='00ff00', size=size_b, position=position_b))
    else:
        if(int(current_video_a) == int(button_a)):
            pass
        else:
            try:
                button_a_old = Config.get('icons', str(current_video_a))
            except:
                log.info('Button not recognized')
           
            StreamDeck.display_icon(int(current_video_a), StreamDeck.Icon.prep(button_a_old.split(',')[2], 1))
            StreamDeck.display_icon(int(button_a), StreamDeck.Icon.text(str(video_a), ico=ico_a, col='00ff00', size=size_a, position=position_a))   

        if(int(current_video_b) == int(button_b)):
            pass
        else:
            try:
                button_b_old = Config.get('icons', str(current_video_b))
            except:
                log.info('Button not recognized')
        
            StreamDeck.display_icon(int(current_video_b), StreamDeck.Icon.prep(button_b_old.split(',')[2], 1))
            StreamDeck.display_icon(int(button_b), StreamDeck.Icon.text(str(video_b), ico=ico_b, col='00ff00', size=size_b, position=position_b))

    current_video_a = button_a
    current_video_b = button_b

# run mainclass
def main():
    # parse command-line args
    from lib import args
    args.parse()

    from lib.args import Args
    docolor = (Args.color == 'always') or (Args.color == 'auto' and
                                           sys.stderr.isatty())

    from lib.loghandler import LogHandler
    handler = LogHandler(docolor, Args.timestamp)
    logging.root.addHandler(handler)

    if Args.verbose >= 2:
        level = logging.DEBUG
    elif Args.verbose == 1:
        level = logging.INFO
    else:
        level = logging.WARNING

    logging.root.setLevel(level)

    # make killable by ctrl-c
    log.debug('setting SIGINT handler')
    signal.signal(signal.SIGINT, signal.SIG_DFL)

    log.info('Python Version: %s', sys.version_info)

    # establish a synchronus connection to server
    Connection.establish(
        Args.host if Args.host else Config.get('server', 'host')
    )

    # switch connection to nonblocking, event-driven mode
    Connection.enterNonblockingMode()

    try:
        log.info('running Gtk-MainLoop')
        buildPanel()
        Connection.on('composite_mode', on_composite_mode)
        Connection.on('video_status', on_video_status)
        Connection.send('get_composite_mode')
        Connection.send('get_video')
        log.info('running StreamDeck watcher')
        worker = threading.Thread(target=listenStreamDeck)
        worker.start()
        log.info('Gtk-MainLoop ended')
    except KeyboardInterrupt:
        log.info('Terminated via Ctrl-C')

if __name__ == '__main__':
    try:
        main()
    except RuntimeError as e:
        logging.error(str(e))
        sys.exit(1)
