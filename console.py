import socket
import sys

if __name__ == "__main__" :
    sock = socket.socket()
    try :
        sock.connect(("localhost", 6666))
        args = sys.argv
        if (len(args) > 1):
            sock.send(args[1])
        else:
            send_str = ''
            while (send_str != 'exit'):
                send_str = raw_input('Send: ')
                sock.send(send_str)
    except :
        pass
    finally :
        if (sock):
            sock.close()
