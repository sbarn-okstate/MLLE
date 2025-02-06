cmake_minimum_required(VERSION 3.10)
project(MyWasmProject)

# Set the C++ standard
set(CMAKE_CXX_STANDARD 17)

# Add C++ source files
add_library(my_wasm_module MODULE main.cpp)

# Emscripten settings for WebAssembly output
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s WASM=1 -s EXPORTED_FUNCTIONS='[\"_my_function\"]'")

# This tells emcc to use a JavaScript file as the main entry point
set_target_properties(my_wasm_module PROPERTIES
    LINK_FLAGS "-s EXPORTED_FUNCTIONS='[\"_my_function\"]'"
)

# Optionally, if you want to include a JS file that initializes the WASM module
# You can also copy a JavaScript file that interacts with the WebAssembly code
#add_custom_command(TARGET my_wasm_module POST_BUILD
#    COMMAND ${CMAKE_COMMAND} -E copy ${CMAKE_SOURCE_DIR}/main.js ${CMAKE_BINARY_DIR}/
#)
