#include <emscription.h>

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    int increment(int count) {
        return count + 1;
    }
}