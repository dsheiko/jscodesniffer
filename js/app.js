requirejs.config({
    baseUrl: "./",
		urlArgs: "rnd=" + ( new Date() ).getTime()
//		,
//    "paths": {
//      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min"
//    }
});

// Load the main app module to start the app
requirejs( [ "js/main" ] );