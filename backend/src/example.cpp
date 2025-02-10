#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

#include <stdio.h>

extern "C"
{
    EMSCRIPTEN_KEEPALIVE void my_function(){
        printf("hello world!\n");
    }
}
