url = window.location.href;
customRootBaseUrl = (typeof customDomainBaseURL === 'undefined') ? window.location.origin : customDomainBaseURL;
wwl_base_url = (url.indexOf(regurl) > -1) ? url.split(regurl)[0] : customRootBaseUrl;
customBaseURL = (typeof customDomainBaseURL === 'undefined') ? wwl_base_url : customDomainBaseURL;
isPwa = false;
jQuery.each(window.location.search.substring(1).split('&'), function(key, value) {
    searchTerms = value.split('='); if(searchTerms[0] == 'pwa') {  isPwa = (searchTerms[1] && searchTerms[1] == '1'); }
});
if (isPwa) {
    customBaseURL = customBaseURL.split('/'); customBaseURL.pop();customBaseURL.pop(); customBaseURL = customBaseURL.join('/');
}
var checkbox_checked=0, checkbox_total=0, checkedCount = 0, responseCount = 0, successItems = {};
var cookieFe = readCookie('frontend'), cookieFec = readCookie('frontend_cid');
var bestsellersUrl = '/wedding-gifts';
function loadProducts() {
    var storeId = getStoreId();
    var postdata = { 'regurl': regurl, 'storeId': storeId };
    jQuery.ajax({
        type: "GET", data: postdata, url: customBaseURL+"/index/getWishlistItems/id/" + siteId,
        success: function (data) {
            registrySection = (babyLayouts.indexOf(siteTheme) > -1) ? getBabyRegistrySection() : getRegistrySection();
            if (content_data.visible_sections.indexOf('gift_registry') > -1 && !QueryString.pwa) {
                jQuery('#gift_registry').removeClass('d-none');
                jQuery('.gift_registry.nav-item').removeClass('d-none');
            }
            // Create registry section
            jQuery('#gift_registry .content-list').html(registrySection);
            // Display carousel for mobile
            jQuery('#how-to-buy-carousel').carousel();
            var json = jQuery.parseJSON(data);
            if (json.result == 'success') {
                url = window.location.href;
                var store_url = (typeof(customDomainBaseURL) == 'undefined') ? url.split(regurl)[0] : customDomainBaseURL + '/';
                registryCloseStatus = (json && json.close_status && json.close_status == 1);
                var productsList = '', count = 0, cash_flag = 0, cash_charity_count = 0, productIdLength = (json && json.product_ids) ? json.product_ids.length : 0;
                var productClass = (layoutFour.indexOf(siteTheme) > -1) ? 'col-md-4 col-sm-6 ' : 'col-md-3 col-sm-4 ';
                total_registry_products = (json && json.names) ? json.names.length : 0;
                if (total_registry_products > 0) {
                    if(json.registry_type!=''){
                        jQuery('.how-to-buy').addClass('d-none');
                        jQuery('.contribute-section').removeClass('d-none');
                        if (json.registry_type == 'only charity') {
                            jQuery('.contribute-section .gift-direction-title').html('Make a Donation');
                            jQuery('.contribute-section .contribute-text .browse-buy-contribute').html('The couple will be informed as soon as you donate to one of their chosen causes. Click on the charity you would like to support.');
                            jQuery('#gift_registry .section-content').html('Your blessings and presence at our wedding is all we wish for. If however, you would like to gift us something, we would be deeply humbled if you donate to one of the causes we are passionate about. We look forward to celebrating our big day with you.');
                        } else {
                            jQuery.each(content_data.sections, function (index, section) {
                                if (section.type == 'gift_registry') {
                                    jQuery('#gift_registry .section-content').html(section.content);
                                }
                            });    
                        }
                    } else {
                        jQuery.each(content_data.sections, function (index, section) {
                            if (section.type == 'gift_registry') {
                                jQuery('#gift_registry .section-content').html(section.content);
                            }
                        });
                    }
                    for (var i = 0; i < total_registry_products; i++) {
                        var unique_id = Math.random().toString(32).slice(2).substr(0, 6);
                        var purchaseStatus = (json.pr_info[i] == 1) ? '' : json.pr_info[i];
                        json.prices[i] = (json.prices[i]!=0)?json.prices[i]:'';
                        json.names[i] = (json.names[i]!=null)?json.names[i]:''; 
                        count += 1;
                        productsList += '<div entity-data-id="' + json.wlItems_Ids[i] + '" class="save-index drag-on ' + productClass + 'col-xs-6 item"><div class="product-outer"><div class="registry-product-image" id="' + unique_id + '"><a target="_blank" data-id="' + json.wlItems_Ids[i] + '" store-url="' + store_url + '" href="' + json.product_url[i] + '" class="registry-product-link"><img class="item-image img-responsive" src="' + json.img_url[i] + '" width="330" height="330" alt="' + json.names[i] + '" />';
                        if (json.status_img[i] != '') {
                            productsList += '<img class="item-tag img-responsive" style="max-width: 140px;" src="' + json.status_img[i] + '"/>';
                        }
                        productsList += '</a></div><div class="registry-product-name"><h2 class="desc brand-name"><a target="_blank" href="' + json.product_url[i] + '" class="registry-product-link" store-url="' + store_url + '" data-id="' + json.wlItems_Ids[i] + '" title="' + json.names[i] + '">' + (json.brands[i] && json.brands[i].toLowerCase() != 'false' ? json.brands[i] : '') + '</a></h2><h2><a target="_blank" href="' + json.product_url[i] + '" title=' + json.names[i] + ' class="registry-product-link" store-url="' + store_url + '" data-id="' + json.wlItems_Ids[i] + '">' + json.names[i] + '</a></h2></div><div class="registry-product-price">' + json.prices[i] + '</div><div class="purchase-info">' + purchaseStatus + '<div class="clearer"></div></div></div></div>';
                    }
                    jQuery('#wishlist-items').html(productsList).css({'display': 'flex', 'flex-wrap': 'wrap', 'justify-content': 'center'}).removeClass('d-none');
                } else {
                    var registryMsg = 'The host has not created a Registry. However, if you want to gift them something memorable, browse our selection of hand-picked gifts. We\'re sure they will love these...', registryButtonAction = 'openBestSellers();', registryButtonText = 'Buy a Gift';
                    jQuery('.how-to-buy').addClass('d-none');
                    jQuery('.contribute-section').addClass('d-none');
                    jQuery('#gift_registry .reg-popup-wrapper').addClass('d-none');
                    jQuery('#gift_registry .section-content').html(`<div class="col-sm-12 text-center">${registryMsg}</div><div class="col-sm-12 text-center buy-gift-wrapper">`
                                                        + `<button class="buy-gift" id="buy-gift" onclick="${registryButtonAction}">${registryButtonText}</button></div>`);
                }
            } else {
                alert("Unable to bring wishlist products! Please try again later");
                console.log(json.message);
            }
            if (typeof (window.updateSectionHeightStatus) == 'function') { updateSectionHeightStatus(); }
            productLoaded = true;
            hideInitialLoader();
        }, error: function() {
            alert("Unable to bring wishlist products! Please try again later");
            productLoaded = true;
            hideInitialLoader();
        }
    });
    jQuery.ajax({
        type: "POST", data: postdata, url: customBaseURL+"/index/wishlist",
        success: function (data) {
            var json = jQuery.parseJSON(data);
            wishlist_id = json.reg_id;
            bestsellersUrl = json.bestsellers_url;
            if (json.gb_state == 1) {
                jQuery('.guestbook-note').removeClass('d-none');
            } else {
                jQuery('.guestbook-note').addClass('d-none');
            }
            if (json.show_gb) {
                jQuery(".view-guestbook-wrapper").show();
                jQuery(".view-guestbook").attr("href", json.gb_href);
            } else {
                jQuery(".view-guestbook-wrapper").hide();
            }
        }
    });
}

function loadProductsMultiSelect() {
    var storeId = getStoreId();
    var postdata = { 'regurl': regurl, 'storeId': storeId };
    jQuery.ajax({
        type: "GET", data: postdata, url: customBaseURL+"/index/fetchWishlistItems/id/" + siteId,
        success: function (data) {
            registrySection = (babyLayouts.indexOf(siteTheme) > -1) ? getBabyRegistrySection() : getRegistrySection();
            if (content_data.visible_sections.indexOf('gift_registry') > -1 && !QueryString.pwa) {
                jQuery('#gift_registry').removeClass('d-none');
                jQuery('.gift_registry.nav-item').removeClass('d-none');
            }
            // Create registry section
            jQuery('#gift_registry .content-list').html(registrySection);
            // Display carousel for mobile
            jQuery('#how-to-buy-carousel').carousel();
            var json = jQuery.parseJSON(data);
            if (json.result == 'success') {
                url = window.location.href;
                var store_url = (typeof(customDomainBaseURL) == 'undefined') ? url.split(regurl)[0] : customDomainBaseURL + '/';
                registryCloseStatus = (json && json.close_status && json.close_status == 1);
                var productsList = '', count = 0, cash_flag = 0, cash_charity_count = 0;
                var productClass = (layoutFour.indexOf(siteTheme) > -1) ? 'col-md-4 col-sm-6 ' : 'col-md-3 col-sm-4 ';
                total_registry_products = (json && json.product_data) ? json.product_data.length : 0;
                if (total_registry_products > 0) {
                    if(json.registry_type!=''){
                        jQuery('.how-to-buy').addClass('d-none');
                        jQuery('.contribute-section').removeClass('d-none');
                        if (json.registry_type == 'only charity') {
                            jQuery('.contribute-section .gift-direction-title').html('Make a Donation');
                            jQuery('.contribute-section .contribute-text .browse-buy-contribute').html('The couple will be informed as soon as you donate to one of their chosen causes. Click on the charity you would like to support.');
                            jQuery('#gift_registry .section-content').html('Your blessings and presence at our wedding is all we wish for. If however, you would like to gift us something, we would be deeply humbled if you donate to one of the causes we are passionate about. We look forward to celebrating our big day with you.');
                        } else {
                            jQuery.each(content_data.sections, function (index, section) {
                                if (section.type == 'gift_registry') {
                                    jQuery('#gift_registry .section-content').html(section.content);
                                }
                            });
                        }
                    } else {
                        jQuery.each(content_data.sections, function (index, section) {
                            if (section.type == 'gift_registry') {
                                jQuery('#gift_registry .section-content').html(section.content);
                            }
                        });
                    }
                    if (json.multi_select_count > 1) {
                        productsList += `<div class="links pr-15 col-md-12 col-sm-12 col-xs-12 item" id="select-multiple-products">
                                            <a class="link link-left basic-text-font text-uppercase teal-color text-bold-600 text-decoration-none" href="javascript:void(0)" onclick="selectMultipleProducts()">Choose Multiple Products</a>
                                        </div>
                                        <div class="links pr-15 col-md-12 col-sm-12 col-xs-12 item" id="multi-select-links">
                                            <a class="link link-right basic-text-font text-uppercase teal-color text-bold-600 text-decoration-none" href="javascript:void(0)" id="clear-items">Clear</a>
                                        </div>`;
                    }
                    for (var i = 0; i < total_registry_products; i++) {
                        var unique_id = Math.random().toString(32).slice(2).substr(0, 6);
                        var purchaseStatus = (json.product_data[i].pr_info == 1) ? '' : json.product_data[i].pr_info;
                        var isMultiSelectProduct = (json.product_data[i].enable_multi_select == 1) ? "multi_select_product" : "";
                        json.product_data[i].price = (json.product_data[i].price!=0)?json.product_data[i].price:'';
                        json.product_data[i].name = (json.product_data[i].name!=null)?json.product_data[i].name:'';
                        count += 1;
                        productsList += '<div entity-data-id="' + json.product_data[i].wlItems_Id + '" class="save-index drag-on ' + productClass + 'col-xs-6 item"><div class="product-outer ' + isMultiSelectProduct + '"><div class="registry-product-image" id="' + unique_id + '"><a redirect-product-page="false" store-url="' + store_url + '" data-id="' + json.product_data[i].product_id + '" href="' + json.product_data[i].product_url + '" class="registry-product-link"><img class="item-image img-responsive" src="' + json.product_data[i].img_url + '" width="330" height="330" alt="' + json.product_data[i].name + '" />';
                        if (json.product_data[i].status_img != '') {
                            productsList += '<img class="item-tag img-responsive" style="max-width: 140px;" src="' + json.product_data[i].status_img + '"/>';
                        }
                        productsList += '</a>';
                        if (json.product_data[i].enable_multi_select == 1) {
                            productsList += '<div class="select-checkbox select-collection multi-select-checkbox" id="select-' + json.product_data[i].wlItems_Id + '">'
                                                +'<input type="checkbox" value="None" id="check-' + json.product_data[i].wlItems_Id + '" items_id="' + json.product_data[i].wlItems_Id + '" price="' + json.product_data[i].price_unformated + '">'
                                                +'<label for="check-' + json.product_data[i].wlItems_Id + '"></label>'
                                            +'</div>'
                                            +'<div class="actions quick-view show-links" id="action-links-' + json.product_data[i].wlItems_Id + '">'
                                                +'<div class="text-center links ">'
                                                    +'<div>'
                                                        +'<button id="button-' + json.product_data[i].wlItems_Id + '" type="button" class="button btn-cart red-button add-to-cart-btn" onclick="checkedCount = 1; responseCount = 0; successItems = {}; addToCartFrmRegistry(\''+customBaseURL+'/wishlist/cart/\', ' + json.product_data[i].wlItems_Id + ', ' + json.product_data[i].price_unformated + ', 1, 0); return false;">'
                                                            +'<span><span class="basic-text-font text-uppercase white-text">Add to Cart</span></span>'
                                                        +'</button>'
                                                    +'</div>'
                                                    +'<span id="ajax_loader_ww' + json.product_data[i].wlItems_Id + '" style="display:none" class="list-ajax-loader"><img src="'+customBaseURL+'/skin/frontend/default/theme692/images/ajax-loader.gif" width="20" alt="ajax-loader"><span class="list-ajax-load">Adding...</span></span>'
                                                +'</div>'
                                            +'</div>';
                        }
                        productsList += '</div><div class="registry-product-name"><h2 class="desc brand-name"><a redirect-product-page="false" href="' + json.product_data[i].product_url + '" class="registry-product-link" store-url="' + store_url + '" data-id="' + json.product_data[i].product_id + '" title="' + json.product_data[i].name + '">' + (json.product_data[i].brand && json.product_data[i].brand.toLowerCase() != 'false' ? json.product_data[i].brand : '') + '</a></h2><h2><a redirect-product-page="false" href="' + json.product_data[i].product_url + '" title=' + json.product_data[i].name + ' class="registry-product-link" store-url="' + store_url + '" data-id="' + json.product_data[i].product_id + '">' + json.product_data[i].name + '</a></h2></div><div class="registry-product-price">' + json.product_data[i].price + '</div><div class="purchase-info">' + purchaseStatus + '<div class="clearer"></div></div></div></div>';
                    }
                    jQuery('#wishlist-items').html(productsList).css({'display': 'flex', 'flex-wrap': 'wrap', 'justify-content': 'center'}).removeClass('d-none');
                    jQuery('body').append(`<div class="sticky-btn-add-cart">
                                        <div class="sticky-btn-cart-position">
                                            <button type="button" title="Add selected to Cart" data-label="add_select_link" class="text-uppercase equal-width red-button btn-add-all btn-add-selected button btn-cart" onclick="addMultipleToCart(\''+customBaseURL+'/wishlist/cart/\')">
                                                <span><span>Add Selected To Cart</span></span>
                                            </button>
                                        </div>
                                    </div>`);
                    checkbox_total = jQuery(".multi-select-checkbox").find('input[type=checkbox]').length;
                    checkboxChecked();
                    productLoader();
                } else {
                    var registryMsg = 'The host has not created a Registry. However, if you want to gift them something memorable, browse our selection of hand-picked gifts. We\'re sure they will love these...', registryButtonAction = 'openBestSellers();', registryButtonText = 'Buy a Gift';
                    jQuery('.how-to-buy').addClass('d-none');
                    jQuery('.contribute-section').addClass('d-none');
                    jQuery('#gift_registry .reg-popup-wrapper').addClass('d-none');
                    jQuery('#gift_registry .section-content').html(`<div class="col-sm-12 text-center">${registryMsg}</div><div class="col-sm-12 text-center buy-gift-wrapper">`
                                                        + `<button class="buy-gift" id="buy-gift" onclick="${registryButtonAction}">${registryButtonText}</button></div>`);
                }
            } else {
                alert("Unable to bring wishlist products! Please try again later");
                console.log(json.message);
            }
            if (typeof (window.updateSectionHeightStatus) == 'function') { updateSectionHeightStatus(); }
            productLoaded = true;
            hideInitialLoader();
        }, error: function() {
            alert("Unable to bring wishlist products! Please try again later");
            productLoaded = true;
            hideInitialLoader();
        }
    });
}

function getRegistrySection () {
    var extraClass = (siteTheme == 'theme24') ? [' item', ' left carousel-control', ' right carousel-control'] : ['', '', ''];
    var content  =  '<div class="reg-popup-wrapper text-center"><span class="what-reg-popup">What is a Gift Registry?</span></div>'+
                    '<div class="section-content">Your blessings and presence on our wedding day is all we want. But if you wish to get us a gift, please refer to our Wishlist of things we like; you can buy or contribute towards anything.</div>'+
                    '<div class="how-to-buy">'+
                    '<div class="how-to-buy-text"><span><b>HOW TO BUY A GIFT FOR THE COUPLE</b><span></span></span></div>'+
                    '<div class="row how-to-buy-row d-none d-sm-flex text-center">'+
                        '<div class=" col-sm-4">'+
                        '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/buy-contribute-gift.gif" alt="select a gift you like from the registry">'+
                        '<div class="gift-direction-title">'+
                            'Buy or Contribute'+
                        '</div>'+
                        '<div class="browse-text"><span class="browse-buy-contribute">Pick a gift. Buy it, or contribute any <br>amount of your choice towards it</span></div>'+
                        '</div>'+
                        '<div class="col-sm-4">'+
                        '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/notify-guest-couple.gif" alt="buy or contribute towards any gift">'+
                        '<div class="gift-direction-title">'+
                            'Immediate Notification'+
                        '</div>'+
                        '<div class="buy-text"><span class="browse-buy-contribute">The couple is informed as soon as you buy a gift.<br>Other guests will not know of your purchase.</span></div>'+
                        '</div>'+
                        '<div class=" col-sm-4">'+
                        '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/direct-gift-delivery.gif" alt="have the gifts delivered directly to the couple">'+
                        '<div class="gift-direction-title">'+
                            'Direct Delivery'+
                        '</div>'+
                        '<div class="contribute-text"><span class="browse-buy-contribute">Gift & message is shipped to couple on their requested date unless you choose to have it sent to you</span></div>'+
                        '</div>'+
                    '</div>'+
                    '<div id="how-to-buy-carousel" class="carousel slide d-block d-sm-none" data-ride="carousel">'+
                        '<div class="carousel-inner text-center">'+
                        '<div class="carousel-item' + extraClass[0] + ' active">'+
                            '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/buy-contribute-gift.gif" alt="select a gift you like from the registry">'+
                            '<div class="gift-direction-title">'+
                            'Buy or Contribute'+
                            '</div>'+
                            '<div class="browse-text"><span class="browse-buy-contribute">Pick a gift. Buy it, or contribute any <br>amount of your choice towards it</span></div>'+
                        '</div>'+
                        '<div class="carousel-item' + extraClass[0] + '">'+
                            '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/notify-guest-couple.gif" alt="buy or contribute towards any gift">'+
                            '<div class="gift-direction-title">'+
                            'Immediate Notification'+
                            '</div>'+
                            '<div class="buy-text"><span class="browse-buy-contribute">The couple is informed as soon as you buy a gift.<br>Other guests will not know of your purchase.</span></div>'+
                        '</div>'+
                        '<div class="carousel-item' + extraClass[0] + '">'+
                            '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/direct-gift-delivery.gif" alt="have the gifts delivered directly to the couple">'+
                            '<div class="gift-direction-title">'+
                            'Direct Delivery'+
                            '</div>'+
                            '<div class="contribute-text"><span class="browse-buy-contribute">Gift & message is shipped to couple on their requested date unless you choose to have it sent to you</span></div>'+
                        '</div>'+
                        '</div>'+
                        '<a class="carousel-control-prev' + extraClass[1] + '" href="#how-to-buy-carousel" role="button" data-slide="prev">'+
                        '<i class="fa fa-arrow-circle-left" aria-hidden="true"></i>'+
                        '<span class="sr-only">Previous</span>'+
                        '</a>'+
                        '<a class="carousel-control-next' + extraClass[2] + '" href="#how-to-buy-carousel" role="button" data-slide="next">'+
                        '<i class="fa fa-arrow-circle-right" aria-hidden="true"></i>'+
                        '<span class="sr-only">Next</span>'+
                        '</a>'+
                    '</div>'+
                    '</div>'+
                    '<div class="contribute-section text-center d-none">'+
                    '<div class="gift-direction-title">'+
                        'Make Contribution'+
                    '</div>'+
                    '<div class="contribute-text"><span class="browse-buy-contribute">The couple will be informed as soon as you make a contribution.</span></div>'+
                    '</div>'+
                    '<div id="wishlist-items" class="registry-products-container-guest d-none"></div>';
    if (layoutFour.indexOf(siteTheme) > -1) { content = '<div class="section-content-wrapper">' + content + '</div>'; }
    return content;
}

function getBabyRegistrySection () {
    var extraClass = (siteTheme == 'theme24') ? [' item', ' left carousel-control', ' right carousel-control'] : ['', '', ''];
    var content  =  '<div class="reg-popup-wrapper"><span class="what-reg-popup">What is a Gift Registry?</span></div>'+
                    '<div class="section-content">Your blessings and presence on our wedding day is all we want. But if you wish to get us a gift, please refer to our Wishlist of things we like; you can buy or contribute towards anything.</div>'+
                    '<div class="how-to-buy">'+
                    '<div class="how-to-buy-text"><span><b>HOW TO BUY FROM GIFT REGISTRY</b><span></span></span></div>'+
                    '<div class="row how-to-buy-row d-none d-sm-flex">'+
                        '<div class=" col-sm-4">'+
                        '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/buy-contribute-gift.gif" alt="select a gift you like from the registry">'+
                        '<div class="gift-direction-title">'+
                            'Buy or Contribute'+
                        '</div>'+
                        '<div class="browse-text text-left"><span class="browse-buy-contribute">Pick a gift. Buy it, or contribute any amount of your choice towards it.</span></div>'+
                        '</div>'+
                        '<div class="col-sm-4">'+
                        '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/notify-guest-couple.gif" alt="buy or contribute towards any gift">'+
                        '<div class="gift-direction-title">'+
                            'Immediate Notification'+
                        '</div>'+
                        '<div class="buy-text text-left"><span class="browse-buy-contribute">The host is informed as soon as you purchase a gift.</span></div>'+
                        '</div>'+
                        '<div class=" col-sm-4">'+
                        '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/direct-gift-delivery.gif" alt="have the gifts delivered directly to the couple">'+
                        '<div class="gift-direction-title">'+
                            'Direct Delivery'+
                        '</div>'+
                        '<div class="contribute-text text-left"><span class="browse-buy-contribute">Gift & message is shipped to host on their requested date unless you choose to have it sent to you</span></div>'+
                        '</div>'+
                    '</div>'+
                    '<div id="how-to-buy-carousel" class="carousel slide d-block d-sm-none" data-ride="carousel">'+
                        '<div class="carousel-inner text-center">'+
                        '<div class="carousel-item' + extraClass[0] + ' active">'+
                            '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/buy-contribute-gift.gif" alt="select a gift you like from the registry">'+
                            '<div class="gift-direction-title">'+
                            'Buy or Contribute'+
                            '</div>'+
                            '<div class="browse-text"><span class="browse-buy-contribute">Pick a gift. Buy it, or contribute any <br>amount of your choice towards it.</span></div>'+
                        '</div>'+
                        '<div class="carousel-item' + extraClass[0] + '">'+
                            '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/notify-guest-couple.gif" alt="buy or contribute towards any gift">'+
                            '<div class="gift-direction-title">'+
                            'Immediate Notification'+
                            '</div>'+
                            '<div class="buy-text"><span class="browse-buy-contribute">The host is informed as soon as<br>you purchase a gift.</span></div>'+
                        '</div>'+
                        '<div class="carousel-item' + extraClass[0] + '">'+
                            '<img src="'+customBaseURL+'/skin/frontend/default/theme692/images/websites/registry/direct-gift-delivery.gif" alt="have the gifts delivered directly to the couple">'+
                            '<div class="gift-direction-title">'+
                            'Direct Delivery'+
                            '</div>'+
                            '<div class="contribute-text"><span class="browse-buy-contribute">Gift & message is shipped to host on their requested date unless you choose to have it sent to you</span></div>'+
                        '</div>'+
                        '</div>'+
                        '<a class="carousel-control-prev' + extraClass[1] + '" href="#how-to-buy-carousel" role="button" data-slide="prev">'+
                        '<i class="fa fa-arrow-circle-left" aria-hidden="true"></i>'+
                        '<span class="sr-only">Previous</span>'+
                        '</a>'+
                        '<a class="carousel-control-next' + extraClass[2] + '" href="#how-to-buy-carousel" role="button" data-slide="next">'+
                        '<i class="fa fa-arrow-circle-right" aria-hidden="true"></i>'+
                        '<span class="sr-only">Next</span>'+
                        '</a>'+
                    '</div>'+
                    '</div>'+
                    '<div class="contribute-section d-none">'+
                    '<div class="gift-direction-title">'+
                        'Make Contribution'+
                    '</div>'+
                    '<div class="contribute-text"><span class="browse-buy-contribute">The couple will be informed as soon as you make a contribution.</span></div>'+
                    '</div>'+
                    '<div id="wishlist-items" class="registry-products-container-guest d-none"></div>';
    if (layoutFour.indexOf(siteTheme) > -1) { content = '<div class="section-content-wrapper">' + content + '</div>'; }
    return content;
}

function openBestSellers() {
    // window.open(bestsellersUrl);
    if (jQuery('#best-seller-popup').length <= 0) {
        loadBestSellerPopup();
    }
    jQuery('#best-seller-popup').modal('show');
}

function openCustomCustomerLink () {
    if (regurl == 'rakesh-sharanya-er7o') {
        window.open('https://www.amazon.com/wedding/share/sharanya-rakesh-december-2020-registry');
    } else {
        openBestSellers();
    }
}

function getStoreId () {
    var storeId = 1, basePath = location.pathname.split('/')[1];
    switch (basePath) {
        case 'baby-registry': storeId = 3; break;
        default: storeId = 1; break;
    }
    return storeId;
}

function addToCartFrmRegistry(url, wlItems_Id, price) {
    showOverlay("Adding to Cart");
    var addItemParams = {'item':wlItems_Id,'qty':1,'price':price,'priceflag':0};
    var parentElem = jQuery(`#check-${wlItems_Id}`).parents('.product-outer');
    if (typeof(successItems.items) == 'undefined') {
        successItems = { items: [], total: 0, currency: '' };
    }
    var itemData = {
        'name': jQuery(parentElem).find('.registry-product-name h2:not(.brand-name) a').html(),
        'price': jQuery(parentElem).find('.registry-product-price .price').html(),
        'image': jQuery(parentElem).find('.registry-product-image img').attr('src')
    };
    successItems.items.push(itemData);
    successItems.currency = itemData.price.replace(/[0-9]+/ig, '').replace(/,/ig, '').trim();
    successItems.total += parseFloat(itemData.price.replace(successItems.currency, '').replace(/,/ig, '').trim());
    jQuery.ajax({
        type: 'POST',
        url: url,
        data: addItemParams,
        crossDomain: true,
        dataType : 'json',
        xhrFields: {
            withCredentials: true
        },
        success : function(data) {
            responseCount++;
            if (responseCount == checkedCount) {
                if (checkCookieSession() == true) {
                    removeCookieSession('frontend'); removeCookieSession('frontend_cid'); showOverlay('Please wait...');
                    window.alert('Oops! Something went wrong.\nPlease try again!'); window.location.reload();
                    // removeCookieSession('frontend'); removeCookieSession('frontend_cid');
                    // jQuery('#alert-notification-modal .modal-header').html("");
                    // jQuery('#alert-notification-modal .modal-body').children().html('Oops! Something went wrong.\nPlease try again!');
                    // jQuery('#alert-notification-modal .modal-footer button').click(reloadOnCartFailure);
                    // jQuery('#alert-notification-modal').modal({backdrop: 'static', keyboard: false});
                    // jQuery('#alert-notification-modal').modal('show');
                    successItems = {};
                } else {
                    // window.location.href = customBaseURL + '/checkout/cart';
                    // var message = 'Product added to cart successfully.';
                    loadAddToCartAlert();
                }
            }
        }, error: function() {
            successItems = {};
            alert("Unable to add product to cart! Please try again later");
            hideOverlay();
        }
    });
}

jQuery(document).on('click', '.goToCartPage', function () { location.href = `${wwl_base_url}/checkout/cart/`; })

function reloadOnCartFailure() {
    showOverlay('Please wait...');
    jQuery('#alert-notification-modal .modal-footer button').unbind('click');
    jQuery('#alert-notification-modal .modal-header').html(`<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">Ã—</span><span class="sr-only">Close</span></button>`);
    window.location.reload();
}

function addMultipleToCart (url) {
    successItems = {};
    checkedCount = jQuery('.multi-select-checkbox input:checked').length; responseCount = 0;
    jQuery('.multi-select-checkbox input:checked').each(function() {
        addToCartFrmRegistry(url, jQuery(this).attr('items_id'), jQuery(this).attr('price'));
    });
}

function selectMultipleProducts () {
    jQuery('.multi-select-checkbox, #multi-select-links').show();
    jQuery('#select-multiple-products').hide();
    jQuery('.registry-products-container-guest .product-outer .show-links').hide();
    jQuery("#wishlist-items .multi_select_product a").each(function() {
        href = jQuery(this).attr("href");
        jQuery(this).attr("data-href", href)
        jQuery(this).removeAttr('href');
        jQuery(this).removeAttr('target');
    });
    jQuery("#wishlist-items .multi_select_product").each(function() {
        jQuery(this).addClass("select-multiple-enabled");
    });
}

jQuery(document).on("click","#wishlist-items .multi_select_product.select-multiple-enabled", function(e) {
    e.preventDefault();
    element = jQuery(this).parent().attr("entity-data-id");
    jQuery("#check-"+element)[0].checked = !jQuery("#check-"+element)[0].checked
    multiSelectChanged(jQuery("#check-"+element)[0]);
});

function checkboxChecked() {
    if(checkbox_checked < checkbox_total) {
        if(checkbox_checked==0) {
            jQuery('#clear-items').hide();
            jQuery('.sticky-btn-add-cart').hide();
        } else {
            jQuery('#clear-items').show();
            jQuery('.sticky-btn-add-cart').show();
        }
    } else {
        if(checkbox_total==0) {
            jQuery('#multi-select-links').hide();
            jQuery('#select-multiple-products').show();
        } else {
            jQuery('#clear-items').show();
        }
    }
}

function multiSelectChanged(element) {
    if(jQuery(element).is(':checked')) {
        checkbox_checked++;
    } else {
        checkbox_checked--;
    }
    checkboxChecked();
}

// Resolve empty cart issue starts
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function checkCookieSession() {
    var cookieChanged = false;
    if (typeof(cookieFe) != 'undefined' && cookieFe != null && cookieFe != '' && cookieFe != readCookie('frontend')) { cookieChanged = true; }
    if (typeof(cookieFec) != 'undefined' && cookieFec != null && cookieFec != '' && cookieFec != readCookie('frontend_cid')) { cookieChanged = true; }
    return cookieChanged;
}

function removeCookieSession(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=none; secure; domain=.weddingwishlist.com`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=none; secure; domain=.www.weddingwishlist.com`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; samesite=none; secure;`;
}
// Resolve empty cart issue ends

jQuery(document).on('click', '#clear-items', function() {
    jQuery('.sticky-btn-add-cart').hide();
    jQuery('.multi-select-checkbox input:checked').each(function() {
        jQuery(this).prop('checked',false);
    });
    checkbox_checked = 0;
    checkboxChecked();
});

jQuery(document).on('click', '.product-outer', function (e) {
    if (registryCloseStatus) {
        e.preventDefault();
        if (jQuery('#close-registry').length == 0) {
            var modalContent = '<div class="modal fade registry-close-modal" id="close-registry" role="dialog">'
                    + '<div class="modal-dialog modal-md"><div class="modal-content" style="width:100%"><div class="modal-header">'
                    + '<button type="button" class="close" data-dismiss="modal">Ã—</button><h5 class="modal-title">Registry is closed</h5></div>'
                    + '<div class="close-registry-content">Sorry! This registry is closed now.<br>If you want to purchase a gift, please contact the couple directly.</div>'
                    + '</div></div></div>';
            jQuery('body').append(modalContent);
        }
        jQuery('#close-registry').modal('show');
    }
});

function productLoader () {
    jQuery('body').on('click', 'a.registry-product-link', function (e) {
        if (!jQuery(this).parents('.multi_select_product').hasClass('select-multiple-enabled')) {
            showOverlay("Loading Product..");
        }
    });
}

function loadAddToCartAlert () {
    if (jQuery('#product-popup').length > 0) { jQuery('#product-popup').modal('hide'); }
    jQuery.ajax({ type: "GET", url: customBaseURL+"/index/getAllCartItems",
    success : function(data) { 
        var modalContent = `<div class="modal-dialog modal-lg"><div class="modal-content">` +
        `<div class="pl-15 pr-15"><button type="button" class="close close-cart-modal pt-15" style="padding-right:15px !important;padding-top:15px !important;" data-dismiss="modal">&times;</button><h5 class="ct-modal-header sub-title-font text-left" style="padding-left:15px !important;">Product Added To Cart</h5></div><div class="modal-body map-modal-body"><div id="header-cart" class="block block-cart skip-content">
         <div id="minicart-error-message" class="minicart-message"></div>
         <div id="minicart-success-message" class="minicart-message"></div>
         <div class="minicart-wrapper">
        `+JSON.parse(data.cart_items)+`</div></div></div></div></div>`;
        jQuery('#buy-wl-cart-modal').html(modalContent);
        jQuery('body #buy-wl-cart-modal').modal('show');
        var cart_qty = 0;
        jQuery('#cart-sidebar .item .qty.cart-item-quantity').each(function(){
            cart_qty += Number(jQuery(this).val());
        });
        if(window.matchMedia("(max-width: 991px)").matches){
           if(jQuery('#guest-cart-icon-mobile .cart-count').length>0){
                jQuery('#guest-cart-icon-mobile .cart-count').html(cart_qty);
           }else{
            jQuery('.navbar.ww-nav-max-width').append(`
                <div id="guest-cart-icon-mobile" class="guest-cart-icon"><a href="${customBaseURL}checkout/cart" target="_blank"><i class="fa" style="font-size:24px">ïº</i><span class="cart-count">`+cart_qty+`</span></a></div>
            `);
           }
        }else{
            if(jQuery('.guest-cart-icon .cart-count').length>0){
                jQuery('.guest-cart-icon .cart-count').html(cart_qty);
            }else{
                jQuery('.navbar-nav.desktop-header').append(`
                <li class="guest-cart-icon"><a href="${customBaseURL}checkout/cart" target="_blank"><i class="fa" style="font-size:24px">ïº</i><span class="cart-count">`+cart_qty+`</span></a></li>`);
            }
        }
        hideOverlay(); 
    }
    });
}

function showActionResponse(message) {
    jQuery('.global-notification-wrapper,.global-action-notification').show('fast');
    jQuery('.global-action-notification').html(message);
    setTimeout(function(){
        jQuery('.global-action-notification').html('');
        jQuery('.global-notification-wrapper,.global-action-notification').hide('slow');
    }, 3000);
}

function numberWithCommas(x) {
    var decimal, number, lastThree, firstNumber = '';
    x = x.toString().split('.'); decimal = (x.length > 1) ? x[1] : ''; number = x[0];
    if (number.length > 3) {
        lastThree = number.substr(number.length - 3, 3); number = number.substring(0, number.length - 3);
        if (number.length % 2 > 0) { firstNumber = number.substr(0, 1); number = number.substr(1, number.length - 1); }
        number = (number.length > 1) ? number.match(/[0-9]{2}/g).join(',') + ',' + lastThree : lastThree; number = (firstNumber != '') ? firstNumber + ',' + number : number;
    } number += (decimal != '') ? '.' + decimal : ''; return number;
}

function loadBestSellerPopup() {
    var popup = '<div id="best-seller-popup" class="modal fade" role="dialog"><div class="modal-dialog" style="max-width: 600px"><div class="modal-content">';
    popup += '<div class="modal-header" ' + (siteTheme == 'theme24' ? 'display: inline-block;' : '') + '"><div class="gradient-overlay"></div>';
    popup += '<div class="col-sm-12"><p class="icon-title-font text-center text-uppercase mb-0 topn-banner">Find the perfect match!</p></div><button type="button" class="close" data-dismiss="modal" style="position: absolute; right: 10px; top: 10px; padding: 0;"><img src="/skin/frontend/default/theme692/images/signup/close-white.svg"></button>';
    popup += '</div><div class="modal-body bg-marble"' + (siteTheme == 'theme24' ? ' style="display: inline-block;width: 100%;"' : '') + '><p class="basic-text-font ' + (siteTheme == 'theme24' ? 'modal-body-text' : 'pb-4 pl-3 pr-3 mb-0') + '">Choose your budget, and pick a gift from our curated collection. If you want to gift something as a group, select \'Group Gift\'</p><div class="row ' + (siteTheme == 'theme24' ? 'modal-body-row' : 'pl-3 pr-3') + '"> ';
    popup += '<div class="col-md-4 col-sm-4 col-xs-6"><a target="_blank" href="/best-selling-wedding-gifts?price=0,1&sort=category&order=asc"><img src="/skin/frontend/default/theme692/images/browse-gifts-modal/wedding-gifts-below-5000.jpg" alt="Below â‚¹5000" class="w-100' + (siteTheme == 'theme24' ? '" style="padding: 15px 10px;' : ' pb-4') + '"></a></div>';
    popup += '<div class="col-md-4 col-sm-4 col-xs-6"><a target="_blank" href="/best-selling-wedding-gifts?price=2&sort=category&order=asc"><img src="/skin/frontend/default/theme692/images/browse-gifts-modal/wedding-gifts-5000-to-10000.jpg" alt="â‚¹5000 to â‚¹10000" class="w-100' + (siteTheme == 'theme24' ? '" style="padding: 15px 10px;' : ' pb-4') + '"></a></div>';
    popup += '<div class="col-md-4 col-sm-4 col-xs-6"><a target="_blank" href="/best-selling-wedding-gifts?price=3&sort=category&order=asc"><img src="/skin/frontend/default/theme692/images/browse-gifts-modal/wedding-gifts-10000-to-20000.jpg" alt="â‚¹10000 to â‚¹20000" class="w-100' + (siteTheme == 'theme24' ? '" style="padding: 15px 10px;' : ' pb-4') + '"></a></div>';
    popup += '<div class="col-md-4 col-sm-4 col-xs-6"><a target="_blank" href="/best-selling-wedding-gifts?price=4&sort=category&order=asc"><img src="/skin/frontend/default/theme692/images/browse-gifts-modal/wedding-gifts-above-20000.jpg" alt="Above â‚¹20000" class="w-100' + (siteTheme == 'theme24' ? '" style="padding: 15px 10px;' : ' pb-4') + '"></a></div>';
    popup += '<div class="col-md-4 col-sm-4 col-xs-6"><a target="_blank" href="/best-selling-wedding-gifts?price=5&sort=category&order=asc"><img src="/skin/frontend/default/theme692/images/browse-gifts-modal/wedding-group-gifts.jpg" alt="Group Gifts" class="w-100' + (siteTheme == 'theme24' ? '" style="padding: 15px 10px;' : ' pb-4') + '"></a></div>';
    popup += '<div class="col-md-4 col-sm-4 col-xs-6"><a target="_blank" href="/browse_gifts"><img src="/skin/frontend/default/theme692/images/browse-gifts-modal/browse-all-wedding-gifts.jpg" alt="Browse All Gifts" class="w-100' + (siteTheme == 'theme24' ? '" style="padding: 15px 10px;' : ' pb-4') + '"></a></div>';
    /*popup += '</div><div class="no-thanks"><a data-dismiss="modal" class="basic-text-font hover teal-color text-uppercase text-bold-600 float-right pr-3" href="javascript:void(0);">No</a></div>';*/
    popup += '</div></div></div></div>';
    jQuery('body').append(popup);
}