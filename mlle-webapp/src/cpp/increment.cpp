#include <emscripten.h>
#include <stdio.h>

extern "C" {
    void test(){
        printf("hello, world!\n");
    }
    //int increment(int count) {
    //    return count + 1;
    //}
}