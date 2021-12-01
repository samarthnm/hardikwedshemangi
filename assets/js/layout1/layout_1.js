/* Code to render Sections HTML Dynamically Starts*/
layout='1';
function getBasicSectionContent (section, altText) {
    sectionType = section.type;
    switch (sectionType) {
        case 'our_story':
            content = getOurStorySectionContent(section, 'Our Story');
            break;
        case 'travel':
            content = getTravelSectionContent(section, 'Travel');
            break;
    }
    return content;
}

function getOurStorySectionContent(section, altText) {
    var item, items = section.items, content = '', date;
    var ourStoryAllSectionClass = (items.length < 2) ? 'single-section' : '';
    content +=  '<h5 class="time-line-divider"></h5>'+
                '<div class="row ourstory-all-sections '+ourStoryAllSectionClass+'">';
    var bird_images = `<img class=" bird-img bird1 d-none d-md-block" src="/assets/images/bird1.png" data-src="/assets/images/bird1.png" alt=""><img class=" bird-img bird2  d-none d-md-block" src="/assets/images/bird2.png" data-src="/assets/images/bird2.png" alt="">`;
    if(siteTheme=='theme3'){
        content+=bird_images;
    }
    for (i = 0; i < items.length; i++) {
        var ourStoryWrapperClass = (items.length < 2) ? 'col-md-12' : 'col-md-6';
        item = items[i];
        content +=  '<div class="col-sm-12 '+ourStoryWrapperClass+' ourstory-section-wrapper">'+
        '<div class="ourstory-section">';
        if (item.title) {
            content += '<div class="ourstory-title left-text">' + item.title + '</div>';
        }
        if (item.show_date == 1) {
            date = new Date(item.date);
            date = (item.only_year == 1) ? date.getFullYear() : months[date.getMonth()] + ' ' + date.getFullYear();
            content += '<div class="arrow-cls">'+
                            '<span id="our-success-story-'+[i]+1+'-text1" class="css-shape">'+date+'</span>'+
                        '</div>';
        }
        if (item.title) {
            content += '<div class="ourstory-title right-text">' + item.title + '</div>';
        }
        if(item.image){
            content +=  '<figure id="story-'+[i]+1+'-img" class="ourstory-img">'+
                            '<img src="' + item.image + '" alt="'+altText+' '+[i]+1+'">'+
                        '</figure>';
        }
        if(item.content){
            content +=  '<p id="our-success-story-'+[i]+1+'-text2">'+ nl2br(item.content) +'</p>';
        }
        content +=  '</div>'+
                '</div>';
    }
    content +=  '</div>';
    return content;
}

function getFunctionsContent(section) {
    var date, item, items = section.functions, content = '', contentClass = '', sectionClass = '',count=0;
    for (i = 0; i < items.length; i++) {
        item = items[i];
        contentClass = (item.thumbnail) ? ' col-md-5' : ' offset-md-3 col-md-6';
        sectionClass = (item.thumbnail) ? '' : ' no-function-image';
        content += '<div class="row events-container' + sectionClass + '">';
        if(item.thumbnail){
            content +=  '<div class="col-sm-hidden col-md-7">'+
                            '<div class="image-container-1">';
            content+='<div id="event-'+[i]+1+'-img" class="event-img">'+
                                    '<img src="' + item.thumbnail + '" alt="wedding-website-functions-thumbnail-'+[i]+1+'">'+
                                '</div>'+
                            '</div>'+
                        '</div>';
        }
        content += '<div class="col-sm-12' + contentClass + ' event-description-wrapper">'+
                        '<div class="event-description-container">'+
                            '<div class="event-description">';
                if(item.name){
                    content += '<h3 id="event-'+[i]+1+'-name" class="event-name d-block d-md-none">' + item.name + '</h3>';
                }
                if(item.name){
                    content += '<h3 id="event-'+[i]+1+'-name" class="event-name d-none d-md-block">' + item.name + '</h3>';
                }
                /* if(window.matchMedia("(min-width: 992px)").matches)
                {
                    if((typeof(item.live_streaming)!=undefined) && (typeof(item.guest_party)!=undefined) && (item.live_streaming) && (item.guest_party)){
                    if(item.live_streaming.show=='yes'){
                        jQuery('.nav-item.virtual_services').removeClass('d-none');
                        content += '<div class="d-flex align-items-center justify-content-start mb-20" id="live-streaming-section-'+count+'"><a class="view-live-stream action-link" data-id="'+item.live_streaming.id+'" >Watch Ceremony</a><span id="virtual-countdown-'+item.live_streaming.id+'"></span></div>';
                    }
                    if(item.guest_party.show=='yes'){
                        content += '<div class="d-flex align-items-center justify-content-start mb-20"><a class="view-guest-party action-link" data-id="'+item.guest_party.id+'" >Join Guest Party</a><span id="virtual-countdown-'+item.guest_party.id +'"></span></div>';
                    }
                }
                } */
                if(item.thumbnail){
                    content +=  '<div class="image-container-2">'+
                                    '<div id="event-'+[i]+1+'-img" class="event-img">'+
                                        '<img src="' + item.thumbnail + '" alt="wedding-website-functions-thumbnail-'+[i]+1+'">'+
                                    '</div>'+
                                '</div>';
                }
                if(item.date){
                    content += '<div id="event-'+[i]+1+'-day" class="event-date">' + item.date + '</div><br>';
                }
                if (item.venue) {
                    content += '<address>' +
                      '<span id="event-' + [i] + 1 + '-map" class="event-map">' + nl2br(item.venue);
                    if (item.map_link && item.map_link != null && item.map_link != '') {
                      var map_data = item.map_link.split(":");
                      if (map_data && map_data.length == 4) {
                        content += '<div id="event-' + [i] + 1 + '-maplink" class="event-maplink"><a href="javascript:void(0)" style="text-decoration:none !important;" class="view-map action-link"  id="' + map_data[0] + '" lon="' + map_data[1] + '" lat="' + map_data[2] + '" address="' + map_data[3] + '" data-toggle="modal" data-target="#locationmodal" title="View Map">&nbsp;&nbsp;View Map</a></div>';
                      }
                    }
                    content += '</span>';
                    content += '</address>';
                  }
                  if (item.details) {
                    content += '<br><p id="event-' + [i] + 1 + '-text6" class="event-details" style="padding:5px 0 !important;">' + nl2br(item.details) + '</p>';
                  }
                  if (window.matchMedia("(min-width: 992px)").matches) {
                    if ((typeof (item.live_streaming) != undefined) && (typeof (item.guest_party) != undefined) && (item.live_streaming) && (item.guest_party)) {
                      content += `<div style="margin:10px 0;padding-bottom:30px;">`;
                      if (item.live_streaming.show == 'yes') {
                        jQuery('.nav-item.virtual_services').removeClass('d-none');
                        content += '<div class="d-flex align-items-center justify-content-start " id="live-streaming-section-' + count + '"><a class="view-live-stream action-link" data-id="' + item.live_streaming.id + '" >Watch Ceremony</a><span id="virtual-countdown-' + item.live_streaming.id + '"></span></div>';
                      }
                      if (item.guest_party.show == 'yes') {
                        content += '<div class="d-flex align-items-center justify-content-start "><a class="view-guest-party action-link" data-id="' + item.guest_party.id + '" >Join ' + ((regurl == 'ghanameetsbermuda') ? 'Ceremony' : 'Guest Party') + '</a><span id="virtual-countdown-' + item.guest_party.id + '"></span></div>';
                      }
                      content += `</div>`;
                    }
                  }else{
                    if ((typeof (item.live_streaming) != undefined) && (typeof (item.guest_party) != undefined) && (item.live_streaming) && (item.guest_party)) {
                        content += `<div style="margin:10px 0;padding-bottom:30px;">`;
                        if (item.live_streaming.show == 'yes') {
                          jQuery('.nav-item.virtual_services').removeClass('d-none');
                          content += '<div class="d-flex align-items-center justify-content-center " id="live-streaming-section-' + count + '"><a class="view-live-stream action-link" data-id="' + item.live_streaming.id + '" >Watch Ceremony</a><span id="virtual-countdown-' + item.live_streaming.id + '"></span></div>';
                        }
                        if (item.guest_party.show == 'yes') {
                          content += '<div class="d-flex align-items-center justify-content-center "><a class="view-guest-party action-link" data-id="' + item.guest_party.id + '" >Join ' + ((regurl == 'ghanameetsbermuda') ? 'Ceremony' : 'Guest Party') + '</a><span id="virtual-countdown-' + item.guest_party.id + '"></span></div>';
                        }
                        content += `</div>`;
                      }
                  }
        content += '</div>'+
                '</div>'+
            '</div><div class="virtual-services-iframe w-100 mt-20"></div>'+
        '</div>';
    }
    return content;
}

function getTravelSectionContent(section, altText) {
    var item, items = section.items, content = '';
    for (i = 0; i < items.length; i++) {
        item = items[i];
        content +=  '<div id="travel'+[i]+1+'">';
        if(item.title) {
            content +=  '<h3 id="travel-title-'+[i]+1+'" class="travel-head">' + item.title + '</h3>';
        }
        if(item.thumbnail) {
            content +=  (regurl == 'dhirendra-priya') ? '<div style="width:100%; text-align: center;margin: 20px 0px;"><img style="max-width: 400px; max-height: 300px;" class="our-story-img-section image" id="travel_image_2" data-category-type="travel" src="'+item.thumbnail+'"></img></div>' : '';
        }
        if(item.content) {
            content +=  '<p id="travel-text-'+[i]+1+'" class="travel-desc">' + nl2br(item.content) + '</p>';
        }
        content +=  '</div>';
    }
    return content;
}

function setBasicSectionContent(section, sectionType) {
    if(section.content){
        jQuery('#' + sectionType + ' .content-list .section-content').html(section.content);
    }
}

/* Code to render Sections HTML Dynamically Ends */
var fixed_logo_themes = ['theme16','theme17','theme18','theme19','theme20'];
if(fixed_logo_themes.includes(siteTheme)){
    jQuery(window).scroll(function(){
        if (window.matchMedia("(min-width: 991px)").matches) {
          if(jQuery(window).scrollTop()>50){
              jQuery('#header-logo').attr('style','top:0px !important;width:100px !important;');
          }else{
            jQuery('#header-logo').attr('style','top:10px !important;width:auto !important;');
          }
        }else if (window.matchMedia("(min-width: 768px)").matches) {
            if(jQuery(window).scrollTop()>50){
                jQuery('#header-logo').attr('style','top:0px !important;width:100px !important;');
            }else{
              jQuery('#header-logo').attr('style','top:10px !important;width:150px !important;');
            }
        }else{
            jQuery('#header-logo').attr('style','width:85px !important;');
        }
    });
}