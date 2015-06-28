// sorry for messy code and mixing c/c++ libs
// compile with something like g++ -O3 -std=c++11 -o brute brute.cpp
// this pretty meh code takes something like 4.5 min to run on a reasonably fast i7

#include <cstdio>
#include <cstdint>
#include <cstring>
#include <vector>

using std::vector;

#define GUESS_LENGTH (12) // must be even
#define UPPER (0xd06e)
#define LOWER (0xf00d)
#define ALTERNATE (0x0000)

void print_bytes(uint8_t *bytes, size_t len) {
    for (int i = 0; i < len; i++) {
        printf("%c", bytes[i]);
    }
}

uint16_t cksum(uint8_t *bytes, size_t len) {
    uint16_t a = 0;
    uint16_t b = 0;
    for (int i = 0; i < len; i++) {
        a = (a + bytes[i]) % 0xff;
        b = (b + a) % 0xff;
    }
    return (b << 8) | a;
}

int incr(uint8_t *bytes, size_t len) {
    for (int i = len - 1; i >= 0; i--) {
        if (bytes[i] < 'Z') {
            bytes[i]++;
            return 0;
        } else if (bytes[i] == 'Z') {
            bytes[i] = 'a';
            return 0;
        } else if (bytes[i] < 'z') {
            bytes[i]++;
            return 0;
        } else {
            bytes[i] = 'A';
        }
    }
    return -1;
}

template<typename T>
T *copy_array(T *arr, size_t len) {
    T *ret = new T[len * sizeof(*ret)];
    memcpy(ret, arr, len);
    return ret;
}

int main() {
    int len = GUESS_LENGTH;
    int half = len / 2;
    uint8_t *guess = new uint8_t[half * sizeof(*guess)];
    for (int i = 0; i < half; i++) {
        guess[i] = 'A';
    }
    vector<uint8_t *> upperMatches, lowerMatches;
    do {
        uint16_t sum = cksum(guess, half);
        switch (sum) {
            case UPPER:
                upperMatches.push_back(copy_array(guess, half));
                break;
            case LOWER:
                lowerMatches.push_back(copy_array(guess, half));
                break;
        }
    } while (incr(guess, half) != -1);
    for (auto upper : upperMatches) {
        for (auto lower : lowerMatches) {
            // check alternate
            for (int i = 0; i < half; i++) {
                if (i * 2 < half) {
                    guess[i] = upper[i * 2];
                } else {
                    guess[i] = lower[i * 2 - half];
                }
                if (cksum(guess, half) == ALTERNATE) {
                    printf("Solution found: ");
                    print_bytes(upper, half);
                    print_bytes(lower, half);
                    printf("\n");
                    goto cleanup;
                }
            }
        }
    }
    printf("No solution found.\n");
cleanup:
    delete[] guess;
    for (auto upper : upperMatches) {
        delete[] upper;
    }
    for (auto lower : lowerMatches) {
        delete[] lower;
    }
    return 0;
}
