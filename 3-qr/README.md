# QR Code Puzzle

The main point of this puzzle is to convert a 2D list of `0`'s and `1`'s into a scannable QR code.

For example, the following binaryQR should scan to `Testing QR code`

```
1 1 1 1 1 1 1 0 1 0 1 0 1 0 1 1 1 1 1 1 1
1 0 0 0 0 0 1 0 0 0 1 1 0 0 1 0 0 0 0 0 1
1 0 1 1 1 0 1 0 1 1 0 1 0 0 1 0 1 1 1 0 1
1 0 1 1 1 0 1 0 1 1 0 1 1 0 1 0 1 1 1 0 1
1 0 1 1 1 0 1 0 1 0 0 1 1 0 1 0 1 1 1 0 1
1 0 0 0 0 0 1 0 0 1 1 1 0 0 1 0 0 0 0 0 1
1 1 1 1 1 1 1 0 1 0 1 0 1 0 1 1 1 1 1 1 1
0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0
1 1 1 1 0 0 1 0 1 1 1 1 0 1 0 0 1 1 1 0 1
1 1 0 0 0 0 0 1 1 1 0 0 0 0 0 1 1 1 1 0 1
0 0 1 1 1 1 1 0 1 0 1 0 0 0 1 0 0 0 0 1 1
0 0 1 1 0 1 0 1 1 0 1 1 1 0 0 1 0 1 0 1 0
0 0 0 0 0 0 1 0 0 0 1 1 0 1 0 0 0 1 0 1 0
0 0 0 0 0 0 0 0 1 0 0 1 1 0 1 0 1 1 0 1 1
1 1 1 1 1 1 1 0 0 1 1 1 0 0 0 1 1 1 1 0 0
1 0 0 0 0 0 1 0 0 1 0 1 0 1 0 1 1 1 1 1 1
1 0 1 1 1 0 1 0 0 0 0 1 0 1 1 1 1 0 1 1 0
1 0 1 1 1 0 1 0 1 1 0 0 1 1 0 0 0 1 0 1 0
1 0 1 1 1 0 1 0 1 0 1 1 1 0 1 0 0 0 1 0 0
1 0 0 0 0 0 1 0 1 1 0 1 0 0 1 1 0 0 0 0 1
1 1 1 1 1 1 1 0 1 1 0 0 0 1 1 0 0 0 1 0 0
```

`qr.py` includes functions to both create a binaryQR code from a string `qrToBin()` and generate a scannable QR code image from a binaryQR code `binToQr`.

The data to encode/decode can be of any reasonable size.


##Puzzle Example

Doge was looking for a square of 0's and 1's but instead found `5640648582322565890496178177435979043940518636792816605844640720443174023400828811006458878761910187737157636056847397646712317137442` apples. What should he do?

###How to solve
0. Download and install the Python Imgaing Library for Python 2 from [here](http://www.pythonware.com/products/pil/).
1. Convert giant number to binary
2. Split (newline) binary evenly to make a square
3. Should look like the binary qr above
4. Transform binary QR into scanable QR using code or drawings or whatever.
5. Scan to get the answer (`very press`), which should be dogeified.

To check answer, use `sha256` to hash their name, then sum the int values of all the characters and use result as an index to `DOGEWORDS` and `NOUNS` modded by their respective lengths.
