#! /Users/MK/Documents/python/test/
# -*- coding: UTF-8 -*- 
#CSVファイル追加書き込み
import re

class writecsv:
	
	def __init__(self, filename):
		self.filename = filename
		print filename+" get!"
        #f = open(csvname, "a+")
        #self.csvname = csvname
	
	def ataituiki(self, atai, hikaku):
	   #try:
	      #File csv = new File("corecore_cpi.csv"); // CSVデータファイル
	      # 追記モード
	      	#csv = atai
	      	print atai
	      	print hikaku
	      	f = open(self.filename, "a+")
	      	f.seek(0)
	      	#print f.read()
	      	search_hikaku = re.search(hikaku, f.read())
	      	#print search_hikaku.group(1)
	      	
	      	if search_hikaku is None:
	      		f.write(atai+"\n")
	      	else:	
				print 'XXXXX search_hikaku hit! XXXXXX'
				print 'XXXXX    can\'t write     XXXXXX'
				print search_hikaku.group(0)	
				
		#except:
			#print "error!"
		
		#finally:
		#	print "end!"
		#	f.close()