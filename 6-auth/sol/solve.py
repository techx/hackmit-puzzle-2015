import z3

DEBUG = False

def debug(s):
    if DEBUG:
        print s

def cksum(bv):
    a = z3.BitVecVal(0, 16)
    b = z3.BitVecVal(0, 16)
    for byte in bv:
        a = (a + z3.ZeroExt(8, byte)) % 0xff
        b = (b + a) % 0xff

    return (b << 8) | a

def alphabetic(bv):
    def capital(byte):
        return z3.And(ord('A') <= byte, byte <= ord('Z'))
    def lower(byte):
        return z3.And(ord('a') <= byte, byte <= ord('z'))
    is_alpha = map(lambda i: z3.Or(capital(i), lower(i)), bv)
    return reduce(lambda a, b: z3.And(a, b), is_alpha)

def add_constraints(s, bv):
    if len(bv) < 10:
        return False

    s.add(alphabetic(bv))

    match = z3.BitVecVal(0xd06ef00d, 32)
    upper = z3.Extract(31, 16, match)
    lower = z3.Extract(15, 0, match)

    left = bv[:len(bv)/2]
    right = bv[len(bv)/2:]

    s.add(cksum(left) == upper)
    s.add(cksum(right) == lower)

    return True

def check(length):
    s = z3.Solver()
    bv = [z3.BitVec('b%d' % i, 8) for i in range(length)]
    if add_constraints(s, bv):
        check = s.check()
        if str(check) == 'sat': # ew string comparison, sorry
            m = s.model()
            return (m, bv)
        elif str(check) == 'unsat':
            return None
        else:
            debug('length %d, %s' % (length, s.check()))

def main():
    try_length = 1
    while True:
        debug('Trying length %d' % try_length)
        solution = check(try_length)
        if solution:
            break
        try_length += 1
    print 'Found solution!'
    model, bv = solution
    characters = [chr(model[i].as_long()) for i in bv]
    print '>> %s <<' % ''.join(characters)

if __name__ == '__main__':
    main()
