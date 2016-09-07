FiveOfHeart_5Players
====================
A simple card game web application written with node.js.
#   Usage
1.  Make sure you have `node.js` & `mongodb` installed on your server
2.  Clone the project onto your server
3.  Cd into the project directory
4.  Execute `node install`
5.  Start mongodb service on your server
6.  Run the `www` executable file in `bin` directory
7.  Visit `http://localhost:3000` through your browser


#   Structure
*   views
>ejs templates for rendering html files
*   public
        js, css, font, audio and other assets served for frontend
*   routes
        routers for express application
*   socket_io
        a simple socket.io server to correspond with the front end
*   modals
        all entities and logic for the game system
*   utils
        some tools for text and audio operations
*   properties
        some settings of the game system
*   daos
        mongoose persistent objects
*   ai
        game ai
*   test
        test for game system