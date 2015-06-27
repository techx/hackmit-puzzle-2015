from PIL import Image
import requests
from StringIO import StringIO
import hashlib

BLACK_PIXEL = (0,0,0)
WHITE_PIXEL = (255,255,255)

def qrToBin(data):
    '''
    Gets the qr code for the data and returns a 2D list representing it
    @param data String representing data to be encoded in the qr code
    '''
    print "getting image..."
    #response = requests.get('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + data) #This one is super slow
    response = requests.get('http://chart.apis.google.com/chart?cht=qr&chs=150x150&chl=' + data)

    print "converting..."
    im = Image.open(StringIO(response.content))

    pix = im.load()

    # im.save('real-qr.png') #image returned from api

    #get base axis and size of squares
    current_position = [0,0] #[x,y]

    while True:
        if pix[current_position[0],current_position[1]] == BLACK_PIXEL:
            axis = current_position;
            #find next white pixel to get size of square
            while True:
                if pix[current_position[0],current_position[1]] == WHITE_PIXEL:
                    width = current_position[0] - axis[0];
                    break
                current_position = [j+1 for j in current_position]
            break
        current_position = [j+1 for j in current_position]


    left_border = axis[0]
    right_border = 0

    #get right border
    current_position = im.size[0] -1
    while True:
        if pix[current_position - right_border, axis[1] + 1] == BLACK_PIXEL:
            break
        right_border += 1

    qrSize = im.size[0] - left_border - right_border - 0

    numSquares = qrSize / width


    binQr = [[0 for x in xrange(numSquares)] for y in xrange(numSquares)] #initialize to blank

    for y,i in enumerate(range(axis[0] , qrSize+axis[0] , width)):
        for x,j in enumerate(range(axis[1],qrSize+axis[1],width)):
            binQr[x][y] = 1 if pix[i,j] == (0,0,0) else 0
            # binQr[x][y] =  pix[i,j]


    print "-----------Done-------------"
    print "QR code starts at: " + str(axis)
    print "Square Width: " + str(width) + "px"
    print "Size: " + str(qrSize) + "px"
    print "Number of squares: " + str(numSquares)
    print "----------------------------"

    result = {
        "binQr" : binQr,
        "width" : width,
        "qrSize" : qrSize,
    }

    return result


def binToQr(bin, width, qrSize, imageName):
    '''
    Generates a qr code image from a binary qr code
    @param bin 2d: list representing a binary qr code
    @param width:  width of each individual square
    @param qrSize: size of the entire qr code in pixels
    @param imageName: name of the generated png image
    '''
    numSquares = len(bin[0])
    im = Image.new("RGB", (qrSize, qrSize))
    pix = im.load();

    def fillSquare(x,y):
        for i in range(y, y+width):
            for j in range(x, x+width):
                pix[i,j] = (255,255,255)

    for y,i in enumerate(range(numSquares)):
        for x,j in enumerate(range(numSquares)):
            if (bin[x][y] == 0): fillSquare(x*width,y*width)

    im.save(imageName+'.png')
    print "QR code saved to: " + imageName + ".png"

def newPuzzle(name):
    '''
    Prepares a new puzzle.
    @param name: Name or id of the person attempting puzzle
    @returns clue: Clue to give to the person
    '''
    SECRET = "d09e4l143"
    hexCode = hashlib.sha256(name + SECRET).hexdigest()[0:10]
    binQr = qrToBin(hexCode)["binQr"]
    prettyPrint(binQr)
    result = [item for sublist in binQr for item in sublist]
    binary = "".join(str(x) for x in result)

    clue = int(binary,2) #This is the given clue
    print clue
    print (hexCode) #This is the answer!

    return clue

def prettyPrint(data):
    '''
    Prints a binary qr nicely to the console
    @param data 2Dlist repesenting a binQr
    '''
    print('\n'.join([''.join(['{:2}'.format(item) for item in row])
          for row in data]))

def test(data, imageName):
    '''
    Generates and prints a binary qr code, then converts it back to an image qr code
    @param data: String repesenting data to be tested
    '''
    result = qrToBin(data)
    binQr = result["binQr"]
    prettyPrint(binQr)
    binToQr(binQr,result["width"],result["qrSize"], imageName )

#test("Testing QR code", "generated-qr")
newPuzzle("Fernando Trujano")
