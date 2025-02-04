# MLLE WebApp

This was created with Node.js v22.13.0 using the React library and Vite web development server. 
* Node.js a backend javascript runtime environment that executes javascript code out of the webbrowser.
* <a href ="https://nodejs.org/en/download" target="_blank"> Click 
here to download the latest version of Node.js </a>
* <a href ="https://youtu.be/hn80mWvP-9g?si=eyOevVYf7bwV8Aqk" target="_blank"> Click here to view the Brocode Youtube tutorial on setting up React-JS on Visual Studio Code</a>

Running the webapp
<br>
1. Ensure you are in the filepath of mlle-webapp. 
    * Example from Justin's Computer: D:\GitHub\MLLE-mlle-webapp
2. Using VSCode, open the terminal inside VSCode. 
    * You may have to type in "npm install" and click enter before going to step 3.
3. Type in "npm run dev" and click enter. 
4. You should be prompted with an output similar to the following. Click on the webaddress generated or copy and paste it into a webbrowser. You are now done!

```
> mlle-webapp@0.0.0 dev
> vite


  VITE v6.0.11  ready in 224 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
  ```
5. Click ctrl+c to exit from the above output. 

## Compiling C++ to WebAssembly
While installing Node.js, check the box to install Chocolately
   choco install make


## Setting Up Emscripten
Run the following command before building:
  setup_emsdk.bat

To ensure Emscripten is working:
  emcc -v
