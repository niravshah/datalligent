function reInit(target){


	"use strict";

	// Variables
	
	var triggerVid;
	var launchkit_hoverGallery;


    // Disable default click on a with blank href

    $(target+' a').click(function() {
        if ($(this).attr('href') === '#') {
            return false;
        }
    });
    
    // Smooth scroll to inner links
	
    if($(target+' .inner-link').length){
    	$(target+' .inner-link').smoothScroll({
    		offset: -59,
    		speed: 800
    	});
    }
	
	// Close mobile menu once link is clicked
	
	$(target+' .menu li a').click(function(){
		if($(target+' nav').hasClass('nav-open')){
			$(target+' nav').removeClass('nav-open');
		}
	});

    
    // Set bg of nav container if dark skin
    
    if($(target+' nav').hasClass('dark')){
    	$(target+' .nav-container').addClass('dark');
    	$(target+' .main-container').find('section:nth-of-type(1)').css('outline', '40px solid #222');
    }

    $(window).scroll(function() {
        if ($(window).scrollTop() > 0) {
            $(target+' nav').addClass('fixed');
        } else {
            $(target+' nav').removeClass('fixed');
        }

    });

    if(!$(target+' nav').hasClass('fixed') && !$(target+' nav').hasClass('overlay')){
           
        // Compensate the height of parallax element for inline nav
        
        if($(window).width() > 768){
            $(target+' .parallax:first-child .background-image-holder').css('top', -($(target+' nav').outerHeight(true)));
        }
        
        // Adjust fullscreen elements
        if($(window).width() > 768 && ($(target+' section.parallax:first-child, header.parallax:first-child').outerHeight() == $(window).height()) ){
            $(target+' section.parallax:first-child, header.parallax:first-child').css('height', ($(window).height() - $(target+' nav').outerHeight(true)));
        }
    }

    // Mobile nav

    $(target+' .mobile-toggle').click(function() {
        $(this).closest('nav').toggleClass('nav-open');
        if ($(this).closest('nav').hasClass('nav-3')) {
            $(this).toggleClass('active');
        }
    });

    // Initialize sliders

    if($(target+' .hero-slider').length){
        $(target+' .hero-slider').flexslider({
            directionNav: false
        });
    }

    if($(target+' .slider').length){
        $(target+' .slider').flexslider({
            directionNav: false
        });
    }

    // Append .background-image-holder <img>'s as CSS backgrounds

    $(target+' .background-image-holder').each(function() {
        var imgSrc = $(this).children('img').attr('src');
        $(this).css('background', 'url("' + imgSrc + '")');
        $(this).children('img').hide();
        $(this).css('background-position', '50% 50%');
    });
    
    // Fade in background images
	
	setTimeout(function(){
		$(target+' .background-image-holder').each(function() {
			$(this).addClass('fadeIn');
		});
    },200);


    // Hook up video controls on local video

    $(target+' .local-video-container .play-button').click(function() {
        $(this).toggleClass('video-playing');
        $(this).closest('.local-video-container').find('.background-image-holder').toggleClass('fadeout');
        var video = $(this).closest('.local-video-container').find('video');
        if (video.get(0).paused === true) {
            video.get(0).play();
        } else {
            video.get(0).pause();
        }
    });

    $(target+' video').bind("pause", function() {
        var that = this;
        triggerVid = setTimeout(function() {
            $(that).closest('section').find('.play-button').toggleClass('video-playing');
            $(that).closest('.local-video-container').find('.background-image-holder').toggleClass('fadeout');
            $(that).closest('.modal-video-container').find('.modal-video').toggleClass('reveal-modal');
        }, 100);
    });

    $(target+' video').on('play', function() {
        if (typeof triggerVid === 'number') {
            clearTimeout(triggerVid);
        }
    });

    $(target+' video').on('seeking', function() {
        if (typeof triggerVid === 'number') {
            clearTimeout(triggerVid);
        }
    });

    // Video controls for modals

    $(target+' .modal-video-container .play-button').click(function() {
        $(this).toggleClass('video-playing');
        $(this).closest('.modal-video-container').find('.modal-video').toggleClass('reveal-modal');
        $(this).closest('.modal-video-container').find('video').get(0).play();
    });

    $(target+' .modal-video-container .modal-video').click(function(event) {
        var culprit = event.target;
        if ($(culprit).hasClass('modal-video')) {
            $(this).find('video').get(0).pause();
        }
    });

    // Hover gallery
    $(target+' .hover-gallery').each(function(){
    	var that = $(this);
    	var timerId = setInterval(function(){scrollHoverGallery(that);}, $(this).closest('.hover-gallery').attr('speed'));
		$(this).closest('.hover-gallery').attr('timerId', timerId );
		
		$(this).find('li').bind('hover, mouseover, mouseenter, click', function(e){
			e.stopPropagation();
			clearInterval(timerId);
		});
	
	});
	

    $(target+' .hover-gallery li').mouseenter(function() {
        clearInterval($(this).closest('.hover-gallery[timerId]').attr('timerId'));
        $(this).parent().find('li.active').removeClass('active');
        $(this).addClass('active');
    });
    
    // Pricing table remove emphasis on hover

    $(target+' .pricing-option').mouseenter(function() {
        $(this).closest('.pricing').find('.pricing-option').removeClass('active');
        $(this).addClass('active');
    });

    // Map overlay switch

    $(target+' .map-toggle .switch').click(function() {
        $(this).closest('.contact').toggleClass('toggle-active');
        $(this).toggleClass('toggle-active');
    });

    // Twitter Feed
       jQuery('.tweets-feed').each(function(index) {
           jQuery(this).attr('id', 'tweets-' + index);
       }).each(function(index) {
           
           var TweetConfig = {
               "id": jQuery('#tweets-' + index).attr('data-widget-id'),
               "domId": '',
               "maxTweets": jQuery('#tweets-' + index).attr('data-amount'),
               "enableLinks": true,
               "showUser": true,
               "showTime": true,
               "dateFunction": '',
               "showRetweet": false,
               "customCallback": handleTweets
           };
           function handleTweets(tweets) {
               var x = tweets.length;
               var n = 0;
               var element = document.getElementById('tweets-' + index);
               var html = '<ul class="slides">';
               while (n < x) {
                   html += '<li>' + tweets[n] + '</li>';
                   n++;
               }
               html += '</ul>';
               element.innerHTML = html;
               return html;
           }
           twitterFetcher.fetch(TweetConfig);
       });

    // Instagram Feed

    if($(target+' .instafeed').length){
        jQuery.fn.spectragram.accessData = {
            accessToken: '1406933036.fedaafa.feec3d50f5194ce5b705a1f11a107e0b',
            clientID: 'fedaafacf224447e8aef74872d3820a1'
        };
    }

    $(target+' .instafeed').each(function() {
        $(this).children('ul').spectragram('getUserFeed', {
            query: $(this).attr('data-user-name')
        });
    });
    
    // Sort tabs into 2 ul's
    
    $(target+' .tabbed-content').each(function(){
    	$(this).append('<ul class="content"></ul>');
    });
    
    $(target+' .tabs li').each(function(){
    	var originalTab = $(this), activeClass = "";
    	if(originalTab.is('.tabs li:first-child')){
    		activeClass = ' class="active"';
    	}
    	var tabContent = originalTab.find('.tab-content').detach().wrap('<li'+activeClass+'></li>').parent();
    	originalTab.closest('.tabbed-content').find('.content').append(tabContent);
    });
    
    $(target+' .tabs li').click(function(){
    	$(this).closest('.tabs').find('li').removeClass('active');
    	$(this).addClass('active');
    	var liIndex = $(this).index() + 1;
    	$(this).closest('.tabbed-content').find('.content li').removeClass('active');
    	$(this).closest('.tabbed-content').find('.content li:nth-child('+liIndex+')').addClass('active');
    });

    
    // Contact form code

    $(target+' form.form-email').submit(function(e) {
       
        // return false so form submits through jQuery rather than reloading page.
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;

        var thisForm = $(this).closest('form.form-email'),
            error = 0,
            originalError = thisForm.attr('original-error'),
            loadingSpinner, iFrame, userEmail, userFullName, userFirstName, userLastName, successRedirect;

		// Mailchimp/Campaign Monitor Mail List Form Scripts
		iFrame = $(thisForm).find('iframe.mail-list-form');
		
        thisForm.find('.form-error, .form-success').remove();
        thisForm.append('<div class="form-error" style="display: none;">' + thisForm.attr('data-error') + '</div>');
        thisForm.append('<div class="form-success" style="display: none;">' + thisForm.attr('data-success') + '</div>');


		if( (iFrame.length) && (typeof iFrame.attr('srcdoc') !== "undefined") && (iFrame.attr('srcdoc') !== "") ){
				
			console.log('Mail list form signup detected.');
            userEmail = $(thisForm).find('.signup-email-field').val();
            userFullName = $(thisForm).find('.signup-name-field').val();
            if ($(thisForm).find('input.signup-first-name-field').length) {
                userFirstName = $(thisForm).find('input.signup-first-name-field').val();
            } else {
                userFirstName = $(thisForm).find('.signup-name-field').val();
            }
            userLastName = $(thisForm).find('.signup-last-name-field').val();

			// validateFields returns 1 on error;
			if (validateFields(thisForm) !== 1) {
				console.log('Mail list signup form validation passed.');
				console.log(userEmail);
				console.log(userLastName);
				console.log(userFirstName);
				console.log(userFullName);
				
				iFrame.contents().find('#mce-EMAIL, #fieldEmail').val(userEmail);
				iFrame.contents().find('#mce-LNAME, #fieldLastName').val(userLastName);
				iFrame.contents().find('#mce-FNAME, #fieldFirstName').val(userFirstName);
				iFrame.contents().find('#mce-NAME, #fieldName').val(userFullName);
				iFrame.contents().find('form').attr('target', '_blank').submit();
                successRedirect = thisForm.attr('success-redirect');
                // For some browsers, if empty `successRedirect` is undefined; for others,
                // `successRedirect` is false.  Check for both.
                if (typeof successRedirect !== typeof undefined && successRedirect !== false && successRedirect !== "") {
                    window.location = successRedirect;
                }
			}else {
                thisForm.find('.form-error').fadeIn(1000);
                setTimeout(function() {
                    thisForm.find('.form-error').fadeOut(500);
                }, 5000);
            }
		} else {
			console.log('Send email form detected.');
			if (typeof originalError !== typeof undefined && originalError !== false) {
				thisForm.find('.form-error').text(originalError);
			}


			error = validateFields(thisForm);


			if (error === 1) {
				$(this).closest('form').find('.form-error').fadeIn(200);
				setTimeout(function() {
					$(thisForm).find('.form-error').fadeOut(500);
				}, 3000);
			} else {
				// Hide the error if one was shown
				$(this).closest('form').find('.form-error').fadeOut(200);
				// Create a new loading spinner while hiding the submit button.
				loadingSpinner = jQuery('<div />').addClass('form-loading').insertAfter($(thisForm).find('input[type="submit"]'));
				$(thisForm).find('input[type="submit"]').hide();

				jQuery.ajax({
					type: "POST",
					url: "mail/mail.php",
					data: thisForm.serialize(),
					success: function(response) {
						// Swiftmailer always sends back a number representing numner of emails sent.
						// If this is numeric (not Swift Mailer error text) AND greater than 0 then show success message.
						$(thisForm).find('.form-loading').remove();

                        successRedirect = thisForm.attr('success-redirect');
                        // For some browsers, if empty `successRedirect` is undefined; for others,
                        // `successRedirect` is false.  Check for both.
                        if (typeof successRedirect !== typeof undefined && successRedirect !== false && successRedirect !== "") {
                            window.location = successRedirect;
                        }

						$(thisForm).find('input[type="submit"]').show();
						if ($.isNumeric(response)) {
							if (parseInt(response) > 0) {
								thisForm.find('input[type="text"]').val("");
                                thisForm.find('textarea').val("");
                                thisForm.find('.form-success').fadeIn(1000);
								
                                thisForm.find('.form-error').fadeOut(1000);
								setTimeout(function() {
									thisForm.find('.form-success').fadeOut(500);
								}, 5000);
							}
						}
						// If error text was returned, put the text in the .form-error div and show it.
						else {
							// Keep the current error text in a data attribute on the form
							thisForm.find('.form-error').attr('original-error', thisForm.find('.form-error').text());
							// Show the error with the returned error text.
							thisForm.find('.form-error').text(response).fadeIn(1000);
							thisForm.find('.form-success').fadeOut(1000);
						}
					},
					error: function(errorObject, errorText, errorHTTP) {
						// Keep the current error text in a data attribute on the form
						thisForm.find('.form-error').attr('original-error', thisForm.find('.form-error').text());
						// Show the error with the returned error text.
						thisForm.find('.form-error').text(errorHTTP).fadeIn(1000);
						thisForm.find('.form-success').fadeOut(1000);
						$(thisForm).find('.form-loading').remove();
						$(thisForm).find('input[type="submit"]').show();
					}
				});
			}
		}
		return false;
    });

    // End Contact Form Code

    // Get referrer from URL string 
    if (getURLParameter("ref")) {
        $(target+' form.form-email').append('<input type="text" name="referrer" class="hidden" value="' + getURLParameter("ref") + '"/>');
    }

    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
    }

   

    $(target+' .validate-required, .validate-email').on('blur change', function() {
        validateFields($(this).closest('form'));
    });

    $(target+' form').each(function() {
        if ($(this).find('.form-error').length) {
            $(this).attr('original-error', $(this).find('.form-error').text());
        }
    });

    function validateFields(form) {
        var name, error, originalErrorMessage;

        $(form).find('.validate-required[type="checkbox"]').each(function() {
            if (!$(target+' [name="' + $(this).attr('name') + '"]:checked').length) {
                error = 1;
                name = $(this).attr('name').replace('[]', '');
                form.find('.form-error').text('Please tick at least one ' + name + ' box.');
            }
        });

        $(form).find('.validate-required').each(function() {
            if ($(this).val() === '') {
                $(this).addClass('field-error');
                error = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });

        $(form).find('.validate-email').each(function() {
            if (!(/(.+)@(.+){2,}\.(.+){2,}/.test($(this).val()))) {
                $(this).addClass('field-error');
                error = 1;
            } else {
                $(this).removeClass('field-error');
            }
        });

        if (!form.find('.field-error').length) {
            form.find('.form-error').fadeOut(1000);
        }

        return error;
    }
    
    // Remove screen when user clicks on the map, then add it again when they scroll
    
    $(target+' .screen').click(function(){
    	$(this).removeClass('screen');
    });
    
    $(window).scroll(function(){
    	$(target+' .contact-2 .map-holder').addClass('screen');
    });





	"use strict";
	
	// Sticky nav

    if (!$(target+' nav').hasClass('overlay')) {
    	$(target+' .nav-container').css('min-height', $(target+' .navbar').height());
    }

    // Initialize twitter feed

    var setUpTweets = setInterval(function() {
        if ($(target+' .tweets-slider').find('li.flex-active-slide').length) {
            clearInterval(setUpTweets);
            return;
        } else {
            if ($(target+' .tweets-slider').length) {
                $(target+' .tweets-slider').flexslider({
                    directionNav: false,
                    controlNav: false
                });
            }
        }
    }, 500);

    // Append Instagram BGs

    var setUpInstagram = setInterval(function() {
        if ($(target+' .instafeed li').hasClass('bg-added')) {
            clearInterval(setUpInstagram);
            return;
        } else {
            $(target+' .instafeed li').each(function() {

                // Append background-image <img>'s as li item CSS background for better responsive performance
                var imgSrc = $(this).find('img').attr('src');
                $(this).css('background', 'url("' + imgSrc + '")');
                $(this).find('img').css('opacity', 0);
                $(this).css('background-position', '50% 0%');
                // Check if the slider has a color scheme attached, if so, apply it to the slider nav
                $(this).addClass('bg-added');
            });
            $(target+' .instafeed').addClass('fadeIn');
        }
    }, 500);



function scrollHoverGallery(gallery){
	var nextActiveSlide = $(gallery).find('li.active').next();

	if (nextActiveSlide.length === 0) {
		nextActiveSlide = $(gallery).find('li:first-child');
	}

	$(gallery).find('li.active').removeClass('active');
	nextActiveSlide.addClass('active');
}

}