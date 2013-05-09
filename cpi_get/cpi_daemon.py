#! /Users/MK/Documents/python/test/
# -*- coding: UTF-8 -*-

import threading
import time
import datetime
import os,signal,sys
child_pid = -1

#シグナルハンドラ。childをkillする。
def catch_sig(sig, frame):
    assert child_pid > 0
    print >> sys.stderr, "Interrupted by the signal (mom)"
    print >> sys.stderr, "Killing %d"%child_pid
    os.kill(child_pid, signal.SIGKILL) # SIGKILLで荒っぽくkillしてしまう
    sys.exit(1)

#シグナルハンドラをセット
def set_sig_handlers():
    signal.signal(signal.SIGINT,  catch_sig)  # Ctrl-c
    signal.signal(signal.SIGTERM,  catch_sig) # killで送られる
    signal.signal(signal.SIGHUP,  catch_sig)  # ログアウト時
    signal.signal(signal.SIGQUIT, catch_sig)  # よく知らないけどついでに

#指標が増えたらファイルへ出す
def take_cpi():
	try:
		print 'take_cpi start'
		import cpi_read
		cr = cpi_read.cpi_read()
		cr.cpi_read_m()
	except:
		print 'err take_cpi'
		raise

#日付チェック
def hiduke_check():
	try:
		today = datetime.date.today()
		print 'hiduke_check start /', today
		#if today.day ==26:
		if today.month == 5:
			cpi = threading.Thread(target=take_cpi)
			#cpi.setDaemon(True)
			cpi.start()
			time.sleep(3)
		
		t=threading.Timer(10,hiduke_check)
		#t=threading.Timer(64800,hiduke_check)
		t.start()
	except:
		print 'err hiduke_check'
		raise

if __name__=='__main__':
	try:
		global child_pid       # グローバル変数
		child_pid = os.fork()  # ここでfork()して、シグナル用とジョブ用の二つに分かれる
		if child_pid == -1:
			raise "Failed to fork"
		if child_pid == 0:
			# こっちはジョブプロセス。本来したいことを書く。
			# barと言い続けるスレッドとbooと言い続けるスレッドを用意
			print 'thread start'
			#e=threading.Event()
			t = threading.Thread(target = hiduke_check)
			#t.setDaemon(True)
			t.start()
			print 'thread end'

		else:
		# こっちはシグナル用プロセス。
			assert child_pid > 0
			set_sig_handlers()
			# 子プロセスの終了を待つ。
			os.wait()

	except:
		print 'thread exit'
		sys.exit(1)