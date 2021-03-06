$(document).ready(function() {
	/**************************
	 * Global variables
	 *************************/
	/**
	 * Is there an animation already happening?
	 * @type {Boolean}
	 */
	var scrolling = false;
	var sPActive = false; //skewed pages active?
	var overlayBg = $(".skew-pages_overlay").css("background-color");

	var workPages = $(".skew-page");
	var numberOfWorkPages = workPages.length - 1;
	var currentWorkPage = 0;

	/**
	 * Original color that we want to transition from
	 * @type {tinycolor object}
	 */
	var originalColor = tinycolor($("#target").css("color"));
	/**
	 * New color we want to transition into.
	 * @type {HSV object}
	 */
	var transitionColor = tinycolor("#0c1822").toHsv();

	scrollicious({trigger: "#contact", viewport: 90}, function(step, target) {

		var color = originalColor.toHsv();

		color.v += (transitionColor.v - color.v) * (step/100);
		
		target.css("color", tinycolor(color).toHexString());
	});

	// Did we scroll past 30px? Make navigation sticky
	$(window).scroll(function() {
		if ($(document).scrollTop() > 30) {
			$("body").addClass("sticky");
		} else {
			$("body").removeClass("sticky");
		}
	});

	$('[data-toggle="tooltip"]').tooltip();
  
	/**
	 * Checks if there's another animation that's
	 * happening. If so it'll return undefined.
	 * If not, it'll trigger the move function.
	 * @param  {Object} event Generic event object
	 * @param  {String} hash  ID we're pointing to
	 * @return void
	 */
	function determine(event, hash) {
		event.preventDefault();

		if(scrolling) {
			return;
		}
		
		move(hash);
	}
  
	/**
	 * Scroll the page to the point the navigation
	 * link points to and append the ID to the link.
	 * @param  {String} hash ID we're pointing to
	 * @return void
	 */
	function move(hash) {
		scrolling = true;

		$('html, body').animate({
			scrollTop: $(hash).offset().top
		}, 1500, $.bez([0.25,-0.20,0.25,1.20]), function() {

			window.location.hash = hash;
			scrolling = false;
		});
	}

	/**
	 * If the user scrolls or presses arrow keys, the event is triggered.
	 * 
	 */
	$("#work").on("mousewheel DOMMouseScroll keydown", function(event) {

		if(!sPActive) { //if skewed pages aren't revealed, don't react to this event.
			return;
		}

		if(scrolling) { //if the scrolling animation is active, don't react to this event.
			event.preventDefault();
			return;
		}
		
		//scroll down, arrow down, arrow right
		if(event.originalEvent.wheelDelta < 0 || event.originalEvent.detail > 0 || event.keyCode == 40 || event.keyCode == 39) {
			navigateDown(event);
		}//scroll up, arrow up, arrow left
		else if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0 || event.keyCode == 38 || event.keyCode == 37) {
			navigateUp(event);
		}
	});

	/**
	 * Go one skewed page up/back or down/forward.
	 * 
	 */
	function navigateUp(event) {
		if(currentWorkPage - 1 >= 0) {
			scrolling = true;
			
			event.preventDefault();
			$(workPages[currentWorkPage--]).removeClass("active");
			$(workPages[currentWorkPage]).addClass("active");

			setTimeout(function() {
				scrolling = false;
			}, 500);
		}
	}
	function navigateDown(event) {
		if(currentWorkPage + 1 <= numberOfWorkPages) {
			scrolling = true;
			
			event.preventDefault();
			$(workPages[currentWorkPage++]).removeClass("active");
			$(workPages[currentWorkPage]).addClass("active");

			setTimeout(function() {
				scrolling = false;
			}, 500);
		}
	}
  
	// Gets triggered on navbar links
	$(".navbar-nav a").click(function(event) {
		determine(event, this.hash);
	});
	// And the fancy intro button
	$("#intro button").click(function(event) {
		determine(event, "#about");
	});

	/**
	 * Actions triggered by skip and show work area buttons.
	 * 
	 */
	$("#show-work").click(function(event) {
		determine(event, this.hash);
	    sPActive = true;

	    $(this).css("opacity", 0);
	    $(".skew-pages_overlay").css("background", "transparent");
	    $("#work").focus();

	    setTimeout(function() {
			$(".skew-pages_overlay").css("z-index", "9900");
		}, 500);
	});
	$(".skip-work").click(function(event) {
		determine(event, this.hash);
	    sPActive = false;

	    $("#show-work").css("opacity", 1);
	    $(".skew-pages_overlay").css("background", overlayBg);

	    setTimeout(function() {
			$(".skew-pages_overlay").css("z-index", "9997");
		}, 500);
	});
});