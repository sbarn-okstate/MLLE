cmake_minimum_required(VERSION 3.14)

project(backend)

add_definitions(-std=c++17)
set(CMAKE_CXX_STANDARD 17)

# Find all C++ source files
file(GLOB_RECURSE SOURCES src/*.cpp)

# Create an object library (compiles each .cpp file into a .o file)
add_library(backend_objects OBJECT ${SOURCES})
