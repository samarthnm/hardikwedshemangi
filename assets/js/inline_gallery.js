var customBaseURL = (typeof customDomainBaseURL === 'undefined') ? "" : customDomainBaseURL;
var imgLength = 0;
$(document).on('click', 'img.gallery-image', function () {
    images = $(this).attr('src');
    var thisItem = $(this).parents('.item');
    $('.grid').children().each(function (key, value) {
        // console.log(value, thisItem);
        if (value === thisItem[0]) {
            openItem = key;
        }
    });
    jQuery('#galleryModal').modal({
        backdrop: 'static'
    });
});

$(document).on('show.bs.modal', '#galleryModal', function () {
    $(".img-modal").attr("src", images);
});

$(document).on('hide.bs.modal', '#galleryModal', function () {
    openItem = 0;
});

//close menu dropdown for mobile
$(".navigation > li > a").click(function () {
    if ($(window).width() < 768) {
        $(".navigation").hide();
    }
});

function loadElementToShow (type) {
    if (type == 'next') {
        openItem = (openItem + 1) % $('.grid').children().length;
    } else {
        openItem = openItem - 1;
        if (openItem < 0) {
            openItem = $('.grid').children().length - 1;
        }
    }
    var src = $('.grid').children().find('img')[openItem].src;
    $(".img-modal").attr("src", src);
}
jQuery(document).keydown(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '39') {
        loadElementToShow('next');
    }
    else if (keycode == '37') {
        loadElementToShow('prev');
    }
});

// Swipe event in mobile
jQuery('.modal-body').on('swipeleft', function (event) {
    loadElementToShow('next');
});

jQuery('.modal-body').on('swiperight', function (event) {
    loadElementToShow('prev');
});

function getGalleryImages (regurl) {
    var postdata = {
        'url': regurl
    };
    jQuery.ajax({
        type: "POST",
        data: postdata,
        url: customBaseURL+"/gallery/index/getGuestViewGallery",
        success: function (respond) {
            var json = jQuery.parseJSON(respond);
            if (json.result == 'success') {
                galleryimages = json.imagearray;
                imgLength = galleryimages.length;
                getPhotoGalleryModal();
                var photoGallerySection = getPhotoGalleryContent();
                // Create photo gallery section
                $('#photo_gallery .content-list').html(photoGallerySection);
                galleryimages = json.imagearray;
                imgLength = galleryimages.length;
                var images, openItem;
                var img = '';
                var index = 0;
                if (galleryimages && galleryimages.length > 0) {
                    $('#photo_gallery').removeClass('d-none');
                    $('.photo_gallery.nav-item').removeClass('d-none');
                    $('.gallery-empty-content').hide();
                    galleryimages.forEach(function (image) {
                        var imageTag = new Image();
                        imageTag.src = image;
                        img += '<div class="item img-block"><img class="gallery-image gallery-img" src="' + image + '"></div>';
                    });
                    jQuery('.grid').html(img);
                }

                var e = document.querySelector('.grid');
                var interval = setInterval(function () {
                    if (e && e.childElementCount > 0) {
                        waterfall(e);
                        if (typeof (window.updateContentSectionHeights) == 'function') { updateContentSectionHeights(); }
                        if (index > 50) {
                            clearInterval(interval);
                        }
                        index++;
                    }
                }, 200);
                if (typeof (window.updateSectionHeightStatus) == 'function') { updateSectionHeightStatus(); }
            } else {
                alert("Unable to save the details. Please try again after sometime");
            }
        },
        error: function () {
            alert("Unable to save the details.Please try again after sometime");
        }
    });
}

function getPhotoGalleryContent () {
    var content = '<div class="section-content">Welcome to our gallery. Here\'s a peek into all the fun, celebrations and special moments from the journey. We hope you enjoy it!</div>' +
        '<div class="grid"></div>';
    jQuery.each(content_data.sections, function (index, section) {
        if (section.type == 'photo_gallery') {
            content = '<div class="section-content">' + nl2br(section.content) + '</div><div class="grid"></div>';
        }
    });
    if (layoutFour.indexOf(siteTheme) > -1) {
        if(imgLength==0){
            content = '';
        }
        content = `<div class="section-content-wrapper">${content}</div>`;
    }
    return content;
}

function getPhotoGalleryModal () {
    var content = '<div id="galleryModal" class="modal fade" role="dialog">' +
                        '<button type="button" class="btn btn-default close-but" data-dismiss="modal"><i class="fa fa-times-circle"></i></i></button>' +
                        '<div class="modal-dialog">' +
                            '<div class="modal-content">' +
                                '<div class="modal-body" style="padding:0px !important;">' +
                                    '<img class="img-modal" src="">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div>' +
                            '<span class="prev-pos" id="prev-but" aria-hidden="true">' +
                                '<i onclick="loadElementToShow(\'prev\')" class="fa fa-chevron-circle-left"></i>' +
                            '</span>' +
                            '<span class="next-pos" id="next-but" aria-hidden="true">' +
                             '<i onclick="loadElementToShow(\'next\')" class="fa fa-chevron-circle-right"></i>' +
                            '</span>' +
                        '</div>' +
                    '</div>';
    $("body").append(content);
}