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
*   views<br>
        ejs templates for rendering html files
*   public<br>
        js, css, font, audio and other assets served for frontend
*   routes<br>
        routers for express application
*   socket_io<br>
        a simple socket.io server to correspond with the front end
*   modals<br>
        all entities and logic for the game system
*   utils<br>
        some tools for text and audio operations
*   properties<br>
        some settings of the game system
*   daos<br>
        mongoose persistent objects
*   ai<br>
        game ai
*   test<br>
        test for game system