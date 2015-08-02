import os
import socket
import datetime
import subprocess
import psutil

running = False
server = 0;

def kill_proc_tree(pid, including_parent=True):    
    parent = psutil.Process(pid)
    for child in parent.get_children(recursive=True):
        child.kill()
    if including_parent:
        parent.kill()

log_file = './output.log'
def log(s):
    global log_file
    f = open(log_file, 'a')
    now = datetime.datetime.now().strftime('%d.%m.%Y %H:%M:%S')
    f.write(now + ': ' + s + '\n')
    f.close()
	
def buildAll():
    index = open('.\\static\\js\\index.js', 'w')
    for top, dirs, files in os.walk('.\\static\\js\\MathGraph2.0\\'):
        for f in files:
            fname = os.path.join(top, f)
            print(fname)
            lns = open(fname).readlines()
            for i in lns:
                if (i != '\n'):
                    index.write(i)
            index.write('\n')
    index.close()
    return True
	
def stop():
    global running
    if (not running):
        return
    running = False
    log('SERVER STOP')
    global server
    kill_proc_tree(server.pid)
	
def start():
    global running
    if (running):
        return
    running = True
    log('SERVER START')
    if (buildAll()):
        global server
        server = subprocess.Popen(['python', 'server.py']);
		
def Controller():
    controller = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    controller.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    controller.bind(("localhost", 6666))
    controller.listen(1)
    log('============================SESSION OPEN============================\n')
    conn, addr = controller.accept()
    log('-----CONSOLE CONNECTED')
    try:
        while 1:
            data = b""
            tmp = conn.recv(1024)
            if (not tmp):
                log('-----CONSOLE DISCONNECTED')
                conn, addr = controller.accept()
                log('-----CONSOLE CONNECTED')
            else:
                data += tmp
            if (not data):
                continue
            udata = data.decode("utf-8").split("\r\n", 1)[0].strip()
            log('CONSOLE SEND: ' + udata.lower())
            if (udata.lower() == "stop"):
                if (running):
                    stop()
            if (udata.lower() == "start"):
                start()
            if (udata.lower() == "restart"):
                stop()
                start()
            if (udata.lower() == 'exit'):
                stop()
                log('EXIT')
                break
                
    except Exception as inst:
        log(str(type(inst)))
        log(str(inst.args))
    log('============================SESSION CLOSE===========================\n')
    conn.close()
    controller.close()    
	
if __name__ == "__main__":
    Controller()
