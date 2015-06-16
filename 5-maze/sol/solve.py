import requests
import re
import time

BASE_URL = "http://52.26.103.152"
stack = []
found = {}

def get_response(url):
    return requests.get(url).text[500:-25]

def get_next_urls(text):
    return re.findall("/[UDLR]+", text)

def check_for_image(text):
    m = re.search("/static/[a-z0-9]+\.png", text)
    if m != None:
        image_url = m.group()
        if image_url not in found:
            found[image_url] = None
            print "Found %d images so far." % len(found)

# Ignore paths that include pointless backtracking.
def pointless(url):
    return url[-2:] in ["LR", "RL", "UD", "DU"]

def handle_step(target_url):
    response = get_response(target_url)
    check_for_image(response)
    if len(found) == 9:
        print "Found all images."
        return True
    urls = get_next_urls(response)
    for url in urls:
        if not pointless(url):
            stack.append(url)
    return False

if __name__ == '__main__':
    start = time.time()
    target_url = "%s%s" % (BASE_URL, "/U")
    while True:
        if handle_step(target_url):
            break
        else:
            target_url = "%s%s" % (BASE_URL, stack.pop())
    for key in found.keys():
        print "%s%s" % (BASE_URL, key)
    time_elapsed = time.time() - start
    print "Solved in %f seconds." % time_elapsed
