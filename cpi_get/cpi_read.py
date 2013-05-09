#! /Users/MK/Documents/python/test/
# -*- coding: UTF-8 -*- 

import urllib2
import re
import smtplib
from email.MIMEText import MIMEText
from email.Header import Header
from email.Utils import formatdate

class cpi_read:
	
	def __init__(self):
		print "cpi"
	
	def cpi_read_m(self):
		try:
		    url = "http://www.stat.go.jp/data/cpi/sokuhou/tsuki/index-z.htm"
		    #writecsv 読み込み
		    import writecsv
		    wcsv = writecsv.writecsv('data/cpi_data.csv')
		    htmldata = urllib2.urlopen(url)
		    readdata = unicode(htmldata.read(),"shift-jis")
		    search1 = re.search(u'エネルギーを除く.*前年同月比は(\d+\.\d)％の(下落)', readdata)
		    search2 = re.search(u'全国　平成(\d+)年', readdata)
		    search3 = re.search(u'(\d+)月分（PDF', readdata)
		    hanbetu = "下落"
			
		    if search2 is None:
				print 'Not search2'
		    else:
				reki = int(search2.group(1)) - 12
				srk = str(reki)
				print srk
				if search3 is None:
					print 'Not search3'
				else:
					tuki = search3.group(1)
					print tuki
					
		    if search1 is None:
				print 'Not search1'
		    elif search1.group(2) is None:
				cpi = search1.group(1)
				print cpi
		    else:	
				cpi = str((float(search1.group(1)) * -1))
				hikaku = search1.group(2)
				print cpi
				print hikaku	
		    
		    #print readdata
			
		    htmldata.close()
		    
		    if int(tuki) < 10:
		    	tuki = "0"+str(tuki)
		    
		    wcsv.ataituiki(("20"+srk+"/"+tuki+","+cpi), ("20"+srk+"/"+tuki))
		    print "20"+srk+"/"+tuki+","+cpi
		    
		except:
			print url
			""""
			if srk is None
				print 'srk is None'
			elif tuki is None
				print "tuki is None"
			elif cpi is None
				print "cpi is None"
			else:
			"""
			print srk
			print tuki
			print cpi
			raise
	#メール送信
	"""
		    from_address = "crowdecoy＠mail.goo.ne.jp"
		    to_address   = "frozenhear2@gmail.com"
		
		    charset = "ISO-2022-JP"
		    subject = u"cpiエラー"
		    text    = url+"\n"+srk+"\n"+tuki+"\n"+cpi+"\n"
		    
		    msg = MIMEText(text.encode(charset),"plain",charset)
		    msg["Subject"] = Header(subject,charset)
		    msg["From"]    = from_address
		    msg["To"]      = to_address
		    msg["Date"]    = formatdate(localtime=True)
		
		    smtp = smtplib.SMTP("xxx.xx.jp")
		    smtp.sendmail(from_address,to_address,msg.as_string())
		    smtp.close()
	"""
	#