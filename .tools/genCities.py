#!/usr/bin/env python3

import logging, sys, os.path
import argparse
import urllib.request
import json, xmltodict
import pytz
from datetime import datetime
from time import sleep

# Defaults
BASEURL = "https://export.yandex.ru/bar/reginfo.xml?region="
SLEEP = 1
FROM = 1
MAXERATE = 50000

# Read args
parser = argparse.ArgumentParser(description='Generates Yandex cities database')
parser.add_argument('filename', type=str, 
					help='JSON database file name')
parser.add_argument('-v', '--verbose', action='store_const', const=logging.DEBUG,
					help='enable verbose mode')
parser.add_argument('-d', '--skipdef', action='store_const', const=True,
					help='skip already defined IDs')
parser.add_argument('-o', '--onlydef', action='store_const', const=True,
					help='update only already defined IDs')
parser.add_argument('-b', '--baseurl', action='store', type=str,
					help='id prefix (default: {})'.format(BASEURL), default=BASEURL)
parser.add_argument('-s', '--sleeptime', action='store', type=float,
					help='sleep between requests (default: {})'.format(SLEEP), default=SLEEP)
parser.add_argument('-f', '--startfrom', action='store', type=int,
					help='from where to start (default: {})'.format(FROM), default=FROM)
parser.add_argument('-e', '--maxerrors', action='store', type=int,
					help='maximum number of errors before stopping (default: {})'.format(MAXERATE), default=MAXERATE)

args = parser.parse_args()

# Write args
FILENAME = args.filename
BASEURL = args.baseurl
SLEEP = args.sleeptime
FROM = args.startfrom
MAXERATE = args.maxerrors
ONLYDEF = args.onlydef
SKIPDEF = args.skipdef

logging.basicConfig(stream=sys.stderr, level=logging.INFO if not args.verbose else logging.DEBUG)

# Loads city info by id
def get_data(id, s=SLEEP):
	for i in range(3):
		try:
			req = urllib.request.urlopen(BASEURL + str(id), timeout=10)

			if req.status == 204:
				logging.info("{} no content".format(id))

			logging.debug("{} {} {}".format(id, req.status, req.msg))

			return req.read()
		except urllib.error.HTTPError as e:
			logging.error("{} failed: {}".format(id, e.reason))
		except urllib.error.URLError as e:
			logging.error("{}".format(e.reason))
		except:
			logging.error("{} request failed".format(id))
			pass

		sleep(s * (i + 1))

	return False

# Convert data to the way we need
def convert_data(data, num):
	# xml -> dictionary
	try:
		dic = xmltodict.parse(data)['info']
	except:
		logging.error("failed to parse data")
		pass
		return { 'name': None, id: num }

	g = {
		'name': dic['region']['title'] if dic['region'] and dic['region']['title'] else None,
		'lat': dic['region']['@lat'] if dic['region'] and dic['region']['@lat'] else None,
		'lon': dic['region']['@lon'] if dic['region'] and dic['region']['@lon'] else None
	}

	if dic['weather'] and dic['weather']['day'] and dic['weather']['day']['time_zone']:
		tz = dic['weather']['day']['time_zone']
		now = datetime.utcnow()
		try:
			pst = pytz.timezone(tz)
			g['utcoffset'] = pst.utcoffset(now).total_seconds() / 60 / 60
		except UnknownTimeZoneError:
			logging.info('unknown timezone {}'.format(tz))
		except:
			raise

		g['timezone'] = tz

	return g

def inc_erate(erate):
	erate = erate + 1
	logging.info("Error rate: {}".format(erate))
	return erate

# Writes all the data
def get_all_data(db={}, start=FROM, maxErate=MAXERATE, skipdef=SKIPDEF, onlydef=ONLYDEF):
	i = start - 1
	dblen = len(db)
	erate = 0
	total = 0

	# while number of error lower than our constant
	while erate < maxErate:
		logging.debug("-----------------------------")
		i = i + 1

		d = str(i) in db
		if skipdef and d:
			if total >= dblen:
				break

			logging.info('{} skipping already defined ID'.format(i))
			erate = 0
			continue
		if onlydef and not d:
			logging.info('{} skipping not defined ID'.format(i))
			erate = inc_erate(erate)
			continue

		# request data
		data = get_data(i)
		# we don't need to get banned
		sleep(SLEEP)
		if not data:
			erate = inc_erate(erate)
			continue

		# convert data
		data = convert_data(data, i)
		if not data:
			erate = inc_erate(erate)
			continue
		logging.debug("converted: {}".format(data))

		# skip dublicate
		if not onlydef and any(db[d]['name'] == data['name'] for d in db):
			logging.info("{} skipping dublicate for {}".format(i, data['name']))
			erate = inc_erate(erate)
			continue

		logging.info("{} inserting {}".format(i, data['name']))
		# add data
		db[str(i)] = data
		total = total + 1
		# reset error rate
		erate = 0

		# write data
		write_data(db)

	logging.info("Looks like data receiving is done")
	logging.debug(db)

	return total

def write_data(data, filename=FILENAME):
	with open(filename, 'w') as f:
		# Encode
		data = json.dumps(data)
		logging.debug("Writing as {}".format(filename))
		f.write(data)

def main():
	global FILENAME

	db = {}

	# Read existing DB if so
	if os.path.isfile(FILENAME):
		with open(FILENAME, 'r') as f:
			try:
				db = json.loads(f.read())
			except:
				logging.info("Cannot parse data")

	r = get_all_data(db)
	logging.info("DONE: {}".format(r))

if __name__ == '__main__':
	main()
