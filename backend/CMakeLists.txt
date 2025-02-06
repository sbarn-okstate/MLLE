cmake_minimum_required(VERSION 3.8)

project(test)

add_definitions(-std=c++17)
set(CMAKE_CXX_STANDARD 17)

if (DEFINED EMSCRIPTEN)
    # Compile to object file (.o)
    add_compile_options(-c)  # Tells CMake to generate object files
    
    add_library(main_obj OBJECT main.cpp)

    # No executable is generated here, just the object file
    # Later, you will manually run emcc to link the object into wasm and js
else()
    add_library(main SHARED main.cpp)
endif()
