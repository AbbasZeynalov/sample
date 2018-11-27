    /* ----------------------------------------------------------- */
    /*  Mobile Menu
    /* ----------------------------------------------------------- */

    jQuery(".nav.navbar-nav li a").on("click", function () {
        jQuery(this).parent("li").find(".dropdown-menu").slideToggle();
        jQuery(this).find("i").toggleClass("fa-angle-down fa-angle-up");
    });


    /* ----------------------------------------------------------- */
    /*  Contact form
    /* ----------------------------------------------------------- */

    // $('#contact-form').submit(function () {
    //
    //     var $form = $(this),
    //         $error = $form.find('.error-container'),
    //         action = $form.attr('action');
    //
    //     $error.slideUp(750, function () {
    //         $error.hide();
    //
    //         var $name = $form.find('.form-control-name'),
    //             $email = $form.find('.form-control-email'),
    //             $subject = $form.find('.form-control-subject'),
    //             $message = $form.find('.form-control-message');
    //
    //         $.post(action, {
    //                 name: $name.val(),
    //                 email: $email.val(),
    //                 subject: $subject.val(),
    //                 message: $message.val()
    //             },
    //             function (data) {
    //                 $error.html(data);
    //                 $error.slideDown('slow');
    //
    //                 if (data.match('success') != null) {
    //                     $name.val('');
    //                     $email.val('');
    //                     $subject.val('');
    //                     $message.val('');
    //                 }
    //             }
    //         );
    //
    //     });
    //
    //     return false;
    //
    // });


    /* ----------------------------------------------------------- */
    /*  Smooth scrolling
    /* ----------------------------------------------------------- */




    $(document).ready(function () {

        // Sidenav Open and Close

        $('.open-sidenav').click(function () {
            // document.getElementById("sidenav").style.width = "100%";
            $('#sidenav').removeClass('sidenav-closed').addClass('sidenav-opened');
        });
        $('#sidenav .btn-closenav').click(function () {
            // document.getElementById("sidenav").style.width = "0";
            $('#sidenav').addClass('sidenav-closed').removeClass('sidenav-opened');
        });



        // Filter Section Open and Close
        $('.open-filter-section').click(function () {
            $('.filter-section').removeClass('filter-section-closed').addClass('filter-section-opened');
        });
        $('.filter-section .btn-close-filters').click(function () {
            $('.filter-section').addClass('filter-section-closed').removeClass('filter-section-opened');
        });




        // Add to basket

        $(document).on('click','.add-to-basket',function(e){

            var $this = this,
                basket = $('#basket-number'),
                id = $($this).data('id'),
                quantity = 1;
            
            if ($($this).closest('.vegas-product').find('.product-quantity').length > 0){
                quantity = $('#qty_input').val();
            }

            $($this).closest('.product-item, .outlet-item').find('.hovereffect .add-to-basket-text.add-to-basket').removeClass('add-to-basket').addClass('in-basket').text(inBasket);
            $($this).closest('.product-item, .outlet-item').find('.hovereffect .icon-links a.add-to-basket').removeClass('add-to-basket').addClass('in-basket');

            if ($('.add-basket-section').length > 0){
                $('.add-basket-section .add-to-basket').removeClass('add-to-basket').addClass('in-basket').text(inBasket);
                $('#product_view_checkout_modal').modal('show');
            }

            $.ajax({
                url:'/'+ app_lang +'/add-to-basket',
                method:'post',
                data:{
                    id:id,
                    quantity: quantity
                },
                success: function(){

                        var count_basket = basket.text();

                        count_basket++;
                        basket.text(count_basket);


                        if($('.product-quantity').length !== 0){
                            $('.product-quantity').remove();
                        }

                        if ($('.my-basket-in').length !== 0){
                            $.ajax({
                                url:'/'+ app_lang +'/basket',
                                success: function(elem){
                                    if ($('.my-basket').length > 0){
                                        $('.basket-container .my-basket').html(elem);
                                    }
                                }
                            });
                        }

                        if ($('.checkout-section-index').length != 0){
                            if ($('.checkout-no-products').length == 0){
                                $.ajax({
                                    url:'/'+ app_lang +'/checkout-products',
                                    method: 'post',
                                    data: {
                                        render: 'checkout-left'
                                    },
                                    success: function(elem){
                                        // if ($('.checkout-section-index checkout-products-item').length > 0){
                                        $('.checkout-section-index .checkout-left').html(elem);
                                        // }
                                    }
                                });
                            } else {
                                $.ajax({
                                    url:'/'+ app_lang +'/checkout-products',
                                    method: 'post',
                                    data: {
                                        render: 'checkout-box'
                                    },
                                    success: function(elem){
                                        // if ($('.checkout-section-index checkout-products-item').length > 0){
                                        $('.checkout-section-index').html(elem);
                                        // }
                                    }
                                });
                            }
                        }
                    }
            });
        });

        // Delete from basket

        $(document).on('click', '.basket-delete-item', function () {

            var id = $(this).data('id'),
                $this = this;

            $.ajax({
                url:'/'+ app_lang +'/delete-in-basket',
                method:'post',
                data:{
                    id:id
                },
                success: function(){

                    $($this).closest('.table-row').animate({
                        opacity: 0,
                        left: "+=50",
                        height: "toggle"
                    }, 100, function() {

                        var countBasket = $('#basket-number').text();

                        $('#basket-number').text(countBasket - 1);

                        $($this).closest('.table-row').remove();

                        if ($('.checkout-section-index').length != 0){
                            var amountProduct = $($this).closest('.checkout-products-item').find('.checkout-products-item-part .value').text();
                            var totalAmount = $('.checkout-total-section .value').text();
                            var resultAmount = totalAmount - amountProduct;

                            $('.checkout-total-section .value').text(resultAmount);
                        }

                        if ($('.basket-delete-item').length == 0){
                            if ($('.my-basket-in').length != 0){

                                $( "<tr class='row table-row'><td colspan='7'><div class='text-center'><p>" + text_no_products + "</p></div></td></tr>" ).insertAfter( ".my-orders-table .table-headers" );
                                $('.basket-checkout-button').remove();

                            }else if ($('.checkout-section-index').length != 0){
                                $('.checkout-box-body').html('<div class="row checkout-no-products"><p>'+ text_no_products +'</p> </div>');
                            }
                        }
                    });


                }
            })
        });

        // Submit Private info form

        var isVerified = false;

        $(document).on('beforeSubmit', '#changePass', function (e) {

            if (profile.phone != $('#changepass-phone').val() && isVerified == false){
                $.ajax({
                   url:'/'+ app_lang +'/profile/send-sms',
                    method: 'post',
                    data: {
                        phone: $('#changepass-phone').val()
                    },
                    success: function () {

                    }
                });
                $('#sms-modal').modal('show');

            }else {
                return true;
            }

            return false;

        });

        $(document).on('click', '.sms-modal-button', function () {

            $.ajax({
                url:'/'+ app_lang +'/profile/check-sms-code',
                method: 'post',
                data: {
                    codeInput: $('.sms-code-input').val()
                },
                success: function (elem) {
                    if (elem){
                        isVerified = true;
                        $('#changePass').submit();
                        $(document).on('beforeSubmit', '#changePass', function (e) {
                            return true;
                        });
                        $('#sms-modal').modal('hide');
                        $('.sms-modal-button').closest('#sms-modal').find('.invalid-feedback').removeClass('has-error');
                    }else {
                        $('.sms-modal-button').closest('#sms-modal').find('.invalid-feedback').addClass('has-error');
                    }
                }
            });
           // console.log(profile.verificationCode);
           console.log($('.sms-code-input').val());
        });

        $(document).on('click', '#checkout-next1', function () {
            var i = 0,
                j = 0,
                $form = $('#form-checkout-private-info');

            $form.yiiActiveForm('validate', true);

            $form.on("afterValidate", function () {
                for (i=0;i<1;i++) {
                    if (j<1){
                        if($('#form-checkout-private-info .has-error').length == 0){
                            $('#private-info').removeClass('in active');
                            $('#payment-method').addClass('in active');

                            $form.on('beforeSubmit', function () {
                                return false;
                            });
                        }

                        j++;
                    }
                }
            });
        });

        $(document).on('click', '#checkout-submit', function () {
            var $form = $('#form-checkout-private-info');


            if ($('.input-payment-method').val()){

                $form.yiiActiveForm('validate', true);

                $('#form-checkout-private-info').on('beforeSubmit', function () {
                    return true;
                });
            }

        });

        // Add smooth scrolling to all links
        $(".navbar-nav a").on('click', function (event) {

            // Make sure this.hash has a value before overriding default behavior
            if (this.hash !== "") {
                // Prevent default anchor click behavior
                event.preventDefault();

                // Store hash
                var hash = this.hash;

                // Using jQuery's animate() method to add smooth page scroll
                // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function () {

                    // Add hash (#) to URL when done scrolling (default click behavior)
                    window.location.hash = hash;
                });
            } // End if
        });


        // $('.main-banner-slider .main-banner-slider-item .banner-text').css({
        //     'display':'block'
        // });


        $('.main-banner-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 3169,
            fade: true,
            lazyLoad: 'ondemand',
            cssEase: 'linear',
            prevArrow: '<a class="myslider-prev icon icon-left-arrow"></a>',
            nextArrow: '<a class="myslider-next icon icon-right-arrow"></a>'
        });

        $('.main-banner-slider').on('lazyLoaded', function (event, slick, image, imageSource) {
            $('.main-banner-slider .main-banner-slider-item .banner-text').css({
                'display':'block'
            });

            $('.main-banner-slider .main-banner-slider-item').css('visibility', 'visible');
        });

        $('.partners-slider').slick({
            infinite: true,
            slidesToShow: 6,
            slidesToScroll: 1,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 2000,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2
                    }
                }
            ]
        });


        var feed = new Instafeed({
//            get: 'tagged',
//            tagName: 'awesome',
            get: 'user',
            userId: '5572913760',
            limit: 6,
            resolution: 'standard_resolution',
            accessToken: '5572913760.1677ed0.be0b68ce792b464e80d774bae662a2d5',
            clientId: 'efd8eda8bad44027877597bc3346d174',
            template: '<div class="gallery col-sm-6 col-sm-4 col-md-2 instaimg"><i class="icon icon-zoom"></i><a href="{{image}}" title="{{caption}}" target="_blank"><img src="{{image}}" alt="{{caption}}" class="img-fluid our-images"></a></div>'
        });
        feed.run();

        // This will create a single gallery from all elements that have class "gallery-item"
        $('.gallery-box').magnificPopup({
            type: 'image',
            delegate: 'a',
            gallery:{
                enabled:true
            }
        });



        // Checkout ===================

        function changeTotal() {
            var priceTotal = 0;
            $('.checkout-products-item .checkout-price .price .value').map(function () {
                priceTotal += parseInt($(this).text());
            });

            $('.checkout-total-section .checkout-price .price .value').text(priceTotal);

        }

        $('#checkout-next1').click(function () {
            $('.checkout-breadcrumbs-item').toggleClass('active');
        });

        $(".checkout-qty-input").change(function () {

            if(  parseInt( $( this ).val() ) < 1 || isNaN(parseInt( $( this ).val() )) ){
                $( this ).val(1);
            }

            var id = $(this).data('id'),
                $this = this;

            $.ajax({
                url:'/'+ app_lang +'/change-product-count',
                method:'post',
                data:{
                    id:id,
                    value: $( this ).val()
                },
                success: function(){
                }
            });


            var dataPrice = $(this).data('price');
            var dataQuantity = $(this).val();
            $(this).closest( ".product-quantity").siblings(".checkout-price").find('.price .value').text(dataPrice * dataQuantity);

            changeTotal();

        });


        $(document).on('click', '.product-quantity .checkout-qty-button-minus', function() {

            $(this).closest(".input-group").find(".checkout-qty-input").val(parseInt($(this).closest(".input-group").find(".checkout-qty-input").val()) - 1);
            if ($(this).closest(".input-group").find(".checkout-qty-input").val() == 0) {
                $(this).closest(".input-group").find(".checkout-qty-input").val(1);
            }

            var id = $(this).data('id'),
                $this = this;

            $.ajax({
                url: '/'+ app_lang +'/change-product-count',
                method: 'post',
                data: {
                    id: id,
                    value: $(this).closest(".input-group").find(".checkout-qty-input").val()
                },
                success: function () {
                }
            });

            var dataPrice = $(this).closest(".product-quantity").find('.checkout-qty-input').data('price');
            var dataQuantity = $(this).closest(".product-quantity").find('.checkout-qty-input').val();
            $(this).closest(".product-quantity").siblings(".checkout-price").find('.price .value').text(dataPrice * dataQuantity);


            changeTotal();

        });

        $(document).on('click','.product-quantity .checkout-qty-button-plus', function(){
            $(this).closest( ".input-group").find(".checkout-qty-input").val(parseInt($(this).closest( ".input-group").find(".checkout-qty-input").val()) + 1 );

            var id = $(this).data('id'),
                $this = this;

            $.ajax({
                url:'/'+ app_lang +'/change-product-count',
                method:'post',
                data:{
                    id:id,
                    value: $(this).closest( ".input-group").find(".checkout-qty-input").val()
                },
                success: function(){
                }
            });

            var dataPrice = $(this).closest(".product-quantity").find('.checkout-qty-input').data('price');
            var dataQuantity = $(this).closest( ".product-quantity").find('.checkout-qty-input').val();
            $(this).closest( ".product-quantity").siblings(".checkout-price").find('.price .value').text(dataPrice * dataQuantity);


            changeTotal();

        });

        //Modal reset password


        // Payment Method
        $(document).on('click', '#payment-cash', function () {

            $(this).addClass('active');
            $('#payment-online').removeClass('active');

            $('#form-checkout-private-info .input-payment-method').val('payment_cash');

        });
        $(document).on('click', '#payment-online', function () {

            $(this).addClass('active');
            $('#payment-cash').removeClass('active');
            $('#form-checkout-private-info .input-payment-method').val('payment_online');

        });

        // $('#checkout-submit').click(function () {
        //     $('#form-checkout-private-info').submit();
        // });







        $('#reset-password-modal').modal('show');



        // Store images popup

        $('.store-images').magnificPopup({
            delegate: 'a', // child items selector, by clicking on it popup will open
            type: 'image',
            closeOnContentClick: true,
            image: {
                verticalFit: true
            },
            zoom: {
                enabled: true
            },
            tLoading: 'Loading image #%curr%...',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0,1] // Will preload 0 - before current, and 1 after the current image
            }
            // other options
        });

        // Filter

        // $(document).on('click', '.', function () {
        //     console.log('heeeeeee,,,mmm');
        //     filter();
        // });

        $(document).on('click', '.clear-filters', function () {
            var url = window.location.pathname;
            window.location.replace(url);
        });

        $(document).on('change', '.filter-box-item input' ,function() {
            $('.categories-products .product-item ').fadeTo('slow',0.5);
            $('.product-filter-loader').show();

            filter();
        });

        $(document).on('keyup', '.filter-price-input' ,function() {
            $('.categories-products .product-item ').fadeTo('slow',0.5);
            $('.product-filter-loader').show();

            filter();
        });

        function filter(){

            var checkboxes = $('.filter-box-item input[type="checkbox"]'),
                priceFields = $('.filter-price input[type="text"]'),
                redirectUrl = '?',
                //var redirectUrl = window.location.search;
                params = {},
                location = '',
                url = window.location;

            $("html, body").animate({ scrollTop: $('.filter-section').offset().top }, 1000);

            checkboxes.each(function(){
                if(!params[$(this).data('type')]) {
                    params[$(this).data('type')] = []
                }
                if(this.checked == true){
                    if(params[$(this).data('type')] == undefined){
                        params[$(this).data('type')] = [];
                    }else{
                        // console.log($(this).data('type'));
                        params[$(this).data('type')].push($(this).val());
                    }
                }
            });
            priceFields.each(function(){
                if($(this).val().trim() != ''){
                    if(params[$(this).data('type')] == undefined){
                        params[$(this).data('type')] = {};
                    }
                    params[$(this).data('type')] = parseFloat($(this).val());
                }
            });

            $.each(params,function(key,value){
                if(redirectUrl.length > 0){
                    redirectUrl += '&'
                }
                redirectUrl += 'Filter['+key+']='+value.toString()

            });
            // console.log(redirectUrl);
            // console.log(params);
            $.ajax({
                url : redirectUrl,
                method : 'get',
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                dataType: "html",
                success: function(result){

                    // $(".loading-image").css("left",document.body.clientWidth / 2 + $(".all-filters").width() / 2 + 25 + 'px');
                    location =  url.pathname + redirectUrl;
                    history.pushState({}, 'null', location );
                    $('.categories-products').html(result);
                    $('.categories-products').fadeTo('fast',1);

                }
            })
        }

        // Make Search form action and url

        $(document).on('click', '.search-button', function () {
            var url = '/';
            $.each($('.search-input').val().trim().split(" ").slice(), function(index, item) {
                if (item){
                    if (index > 0){
                        url += '_';
                    }
                    url += item;
                } 
            });

            if (url == '/'){
                url = '';
            }

            if (url){
                $('.search-form').attr('action', $('.search-form').attr('action') + url);
            } else {
                $('.search-form').attr('action', url);
            }


        });

        // Hide Login modal and Show Signup modal
        $(document).on('click', '.account-text-signup .has-account-text', function () {
            $('#login-modal').modal('hide');
            setTimeout(function () {
                $('#register-modal').modal('show');
            }, 500);
        });

        $(document).on('click', '.account-text-login .has-account-text', function () {
            $('#reset-modal').modal('hide');
            setTimeout(function () {
                $('#login-modal').modal('show');
            }, 500);
        });


        // Contact -> store map modal
        var map = null;
        var myMarker;
        var myLatlng;

        function initializeGMap(lat, lng) {
            myLatlng = new google.maps.LatLng(lat, lng);

            var mapStyles = [
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "saturation": 36
                        },
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 40
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 16
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 20
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 17
                        },
                        {
                            "weight": 1.2
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 20
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 21
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 17
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 29
                        },
                        {
                            "weight": 0.2
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 18
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 16
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 19
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#000000"
                        },
                        {
                            "lightness": 17
                        }
                    ]
                }
            ];
            var myOptions = {
                zoom: 15,
                zoomControl: true,
                center: myLatlng,
                styles: mapStyles,
                // mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            myMarker = new google.maps.Marker({
                position: myLatlng
            });
            myMarker.setMap(map);
        }

        // Re-init map before show modal
        $('#storeMapModal').on('show.bs.modal', function(event) {
            var button = $(event.relatedTarget);
            initializeGMap(button.data('lat'), button.data('lng'));
            $("#location-map").css("width", "100%");
            $("#map_canvas").css("width", "100%");
        });

        // Trigger map resize event after modal shown
        $('#storeMapModal').on('shown.bs.modal', function() {
            google.maps.event.trigger(map, "resize");
            map.setCenter(myLatlng);
        });




        // For give max height to all banners description
        var banners = $('.main-banner .banner-elements .banner-element .description');
        var maxHeightBanner = 0;
        for (var i = 0; i < banners.length; i++) {
            if(maxHeightBanner < $(banners[i]).height() ){
                maxHeightBanner = $(banners[i]).height();
            }
        }
        banners.height(maxHeightBanner);

        var bLazy = new Blazy({
            selector: '.b-lazy',
            breakpoints: [{
                width: 1600,
                src: 'data-src'
            }],
            success: function(element){
                setTimeout(function(){
                    // We want to remove the loader gif now.
                    // First we find the parent container
                    // then we remove the "loading" class which holds the loader image
                    var parent = element.parentNode;
                    parent.className = parent.className.replace(/\bloading\b/,'');
                }, 200);
            }
        });

    }); // end document ready



    /* ----------------------------------------------------------- */
    /*  Back to top
    /* ----------------------------------------------------------- */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    // scroll body to 0px on click
    $('#back-to-top').on('click', function () {
        $('#back-to-top').tooltip('hide');
        $('body,html').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    $('#back-to-top').tooltip('hide');

    /* ----------------------------------------------------------- */
    /*  Basket
    /* ----------------------------------------------------------- */
