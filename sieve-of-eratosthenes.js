// Sieve of Eratosthenes (Neo) (Neo)

const SieveOfEratosthenes = class {
    constructor(end, type = Uint16Array) {
        this.type = type;
        this.bpe = this.type.BYTES_PER_ELEMENT * 8; // bits per element
        this.end = end;

        const endBitIndex = (this.end - 3) / 2;
        const endSqrt = endBitIndex ** 0.5;
        const array = new this.type(Math.ceil(endBitIndex / this.bpe)).fill((2 ** this.bpe) - 1);
        
        for (let i = 0; i < endSqrt; i++) {
            
            if (array[Math.trunc(i / this.bpe)] & (1 << i % this.bpe)) {
                const realNumber = i * 2 + 3;
                for (let j = i + realNumber * (i + 1); j < endBitIndex; j += realNumber) {
                    array[Math.trunc(j / this.bpe)] &= ~(1 << j % this.bpe);
                }
            }
        }

        array[array.length - 1] &= (1 << (endBitIndex % this.bpe + 1)) - 1;
        
        this.array = array;
    }

    toPrimesArray() {
        if (this.end < 2)
            return [];
        
        const primesArray = [2];

        for (let i = 0; i * 2 + 3 < this.end; i += 1) {
            if (this.array[Math.trunc(i / this.bpe)] & (1 << i % this.bpe))
                primesArray.push(i * 2 + 3);
        }

        return primesArray;
    }

    countPrimes() {
        if (this.end < 2)
            return 0;

        const bitCount = (n) => {
            n = n - ((n >> 1) & 0x55555555)
            n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
            return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
        }
    
        return this.array.reduce((acc, val) => acc + bitCount(val), 1); // +1 for 2
    }
}

const eratosthenesTest = (end, type) => {
    const startTime = performance.now();
    const primeSieve = new SieveOfEratosthenes(end, type);
    const endTime = performance.now();

    console.log(`attempt: ${end.toString().padStart(10, ' ')}, time: ${(endTime - startTime).toFixed(5).toString().padStart(15, ' ')}ms, primes: ${primeSieve.countPrimes().toString().padStart(12, ' ')}, in: ${primeSieve.type.name}`);
}

for (let i = 0; i <= 32; i++) {
    // eratosthenesTest(2 ** i, Uint32Array);
    eratosthenesTest(2 ** i, Uint16Array); // fastest
    // eratosthenesTest(2 ** i, Uint8Array);
}