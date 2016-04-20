(function() {
    'use strict';

    var sideBarTpl_raw = $("#sideBarTpl").html();
    var sideBarTpl = Handlebars.compile(sideBarTpl_raw);
    var sectionTpl_raw = $("#sectionTpl").html();
    var sectionTpl = Handlebars.compile(sectionTpl_raw);

    var audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.onended = function() {
        $('.playingAudio').removeClass('playingAudio');
    };

    $('.modal-trigger').leanModal();

    $.getJSON('data/listLessons.json', function(data) {
        $('#slideNav').html(sideBarTpl(data));

        // Initialize collapse button
        $(".button-collapse").sideNav();
        // Initialize collapsible (uncomment the line below if you use the dropdown variation)
        $('.collapsible').collapsible();

        $('li.section-item').click(function() {
            $('.section-item').removeClass('selected');
            $(this).addClass('selected');
            $('.button-collapse').sideNav('hide'); // Hide sideNav

            var sectionIndex = $(this).index();
            var cateIndex = $(this).parents('.category-item').index();
            $('#mainContent').html(sectionTpl(data.categories[cateIndex].sections[sectionIndex]));
            $('.masonry').masonry({
                // use outer width of grid-sizer for columnWidth
                itemSelector: '.grid-item',
                // do not use .grid-sizer in layout
                columnWidth: '.grid-item',
                percentPosition: true
            });
        });
        // $('li.section-item:nth-child(10)').click()
    });

    $(document).on('click', '.lesson-item', function() {
        $('#modalLesson').openModal({
            complete: function() { // Callback for Modal close
                audioPlayer.pause();
            }
        });
        $('#lessonContent').empty();
        $('#modalLesson .modal-content').scrollTop(0);
        var lessonIndex = $(this).data('lesson');
        $.getJSON('data/lessons/' + lessonIndex + '.json', function(lesson) {
            $('#lessonTitle').text(lesson.title);
            $('#lessonContent').html(lesson.html);
            $('#lessonContent table').addClass('striped');
        });
    });
    $(document).on('click', 'a', function(e) {
        if (e.target.href && e.target.href.indexOf('.mp3') > -1) {
            e.preventDefault();
            $('.playingAudio').removeClass('playingAudio');
            $(this).addClass('playingAudio');
            audioPlayer.src = e.target.href;
            audioPlayer.play();
        }
    });

})();

// load font
function loadFont(fontName) {
    fontName = fontName.replace(/\s+/g, '+');
    var linkFont = document.createElement('link');
    linkFont.rel = 'stylesheet';
    linkFont.type = 'text/css';
    linkFont.href = 'https://fonts.googleapis.com/css?family=' + fontName + ':100,400';
    document.getElementsByTagName('head')[0].appendChild(linkFont);
}
// loadFont('Roboto');

// These functions for Quiz question in Listening category. The code was got from talkenglish.com
function showHide(elementid) {
    if (document.getElementById(elementid).style.display == 'none') { document.getElementById(elementid).style.display = ''; } else { document.getElementById(elementid).style.display = 'none'; }
}

function CheckScore() {
    for (var i = 0; i < 4; i++) {
        if (MyForm.Question1[i].checked) {
            var Ques1UserAnswer = MyForm.Question1[i].value;
        }
        if (MyForm.Question2[i].checked) {
            var Ques2UserAnswer = MyForm.Question2[i].value;
        }
        if (MyForm.Question3[i].checked) {
            var Ques3UserAnswer = MyForm.Question3[i].value;
        }
        if (MyForm.Question4[i].checked) {
            var Ques4UserAnswer = MyForm.Question4[i].value;
        }
    }
    var Score = 0;
    var CorrectAnswers = MyForm.CorrectAnswers.value;
    if (Ques1UserAnswer == CorrectAnswers.substr(0, 1)) Score++;
    if (Ques2UserAnswer == CorrectAnswers.substr(1, 1)) Score++;
    if (Ques3UserAnswer == CorrectAnswers.substr(2, 1)) Score++;
    if (Ques4UserAnswer == CorrectAnswers.substr(3, 1)) Score++;
    ScoreText.innerHTML = "<font size=2>Your Score is: " + Score + " /4 </font><br />";
}
