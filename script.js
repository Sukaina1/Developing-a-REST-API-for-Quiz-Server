$(document).ready(function() {

  // Toggle dark mode
  $('.toggle-switch').on('change', function() {
    if ($(this).is(':checked')) {
      $('body').addClass('dark-mode');
      $('.toggle-text--on').hide();
      $('.toggle-text--off').show();
    } else {
      $('body').removeClass('dark-mode');
      $('.toggle-text--off').hide();
      $('.toggle-text--on').show();
    }
  });

  // Start quiz
  $('#start-quiz-btn').click(function() {
    var numQuestions = $('#num-questions').val();
    $.ajax({
      url: '/quiz',
      type: 'POST',
      data: {num_questions: numQuestions},
      dataType: 'json',
      success: function(data) {
        $('#quiz-questions-container').empty();
        $.each(data.quiz_data, function(i, question) {
          var questionHTML = '<div class="question">';
          questionHTML += '<h3>' + question.question + '</h3>';
          $.each(question.options, function(j, option) {
            questionHTML += '<div class="option">';
            questionHTML += '<input type="radio" id="q' + i + 'o' + j + '" name="q' + i + '" value="' + option + '">';
            questionHTML += '<label for="q' + i + 'o' + j + '">' + option + '</label>';
            questionHTML += '</div>';
          });
          questionHTML += '</div>';
          $('#quiz-questions-container').append(questionHTML);
        });
        $('.quiz-settings').hide();
        $('.quiz-questions').show();
      },
      error: function(xhr, status, error) {
        console.log(xhr);
        console.log(status);
        console.log(error);
        alert('Error starting quiz: ' + error);
      }
    });
  });

  // Submit quiz
  $('#submit-quiz-btn').click(function() {
    var answers = {};
    var numQuestions = $('#num-questions').val();
    for (var i = 0; i < numQuestions; i++) {
      var question = $('input[name=q' + i + ']:checked');
      if (question.length > 0) {
        answers[i] = question.val();
      } else {
        answers[i] = null;
      }
    }
    $.ajax({
      url: '/quiz',
      type: 'PUT',
      data: JSON.stringify(answers),
      contentType: 'application/json',
      success: function(data) {
        $('.quiz-questions').hide();
        $('.quiz-results #score').text(data.score);
        $('#quiz-results-container').empty();
        $.each(data.quiz_data, function(i, question) {
          var resultHTML = '<div class="result">';
          resultHTML += '<h3>' + question.question + '</h3>';
          resultHTML += '<p>Selected answer: ' + question.selected_answer + '</p>';
          resultHTML += '<p>Correct answer: ' + question.correct_answer + '</p>';
          resultHTML += '</div>';
          $('#quiz-results-container').append(resultHTML);
        });
        $('.quiz-results').show();
      },
      error: function(xhr, status, error) {
        alert('Error submitting quiz: ' + error);
      }
    });
  });

  // Restart quiz
  $('#restart-quiz-btn').click(function() {
    $('.quiz-results').hide();
    $('.quiz-settings').show();
    $('#quiz-questions-container').empty();
    $('#num-questions').val('');
  });

});