# Define the path to your Emscripten SDK
EMSDK = ..\\..\\..\\external\\emsdk

# Define the output file names
WASM_FILE = increment.wasm
JS_FILE = increment.js
HTML_FILE = increment.html

# Compiler flags for Emscripten
CXX = $(EMSDK)\\upstream\\emscripten\\system\\include
CXXFLAGS =  -I$(EMSDK)\\upstream\\emscripten\\system\\include \
			-sEXPORTED_FUNCTIONS='["_increment"]' \
			-sEXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
			-sMODULARIZE \
			-sENVIRONMENT=web

# C++ source files
SRC = increment.cpp

# Build target for WebAssembly (WASM) and JavaScript bindings
all: $(JS_FILE) $(WASM_FILE)

# Rule for compiling the C++ code
$(JS_FILE): $(SRC)
	$(CXX) $(SRC) -o $(JS_FILE) $(CXXFLAGS)

# Rule for cleaning build artifacts
clean:
	rm -f $(JS_FILE) $(WASM_FILE) $(HTML_FILE)