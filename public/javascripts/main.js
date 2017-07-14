(function($) {
    'use strict';


    function setCookie(name, value) {
        document.cookie = name +"="+ value +"; path=/";
    }


    function generateID(string) {
        return parseInt(string.substring(string.indexOf('_') + 1 , string.length));
    }



    $('.selectpicker').selectpicker({
        style: 'btn-default',
        size: 2
    });

    $('.questionnaireID').selectpicker({
        style: 'btn-default',
        size: 2
    });

    $('.selectpicker').on('change', function(){
        var selected = $(this).find("option:selected").val(),
            $wrapper = $(".single-question__wrapper"),
            $input = $(".single-question__wrapper input.answer");

        switch(selected) {
            case 'Yes/No':
                $input.remove();
                $wrapper.append("<input id='answer_1' class='answer' placeholder='Option 1' required />");
                $wrapper.append("<input id='answer_2' class='answer' placeholder='Option 2' required />");
                break;

            case 'Multiple Choice':
                $input.remove();
                $wrapper.append("<input id='answer_1' class='answer' placeholder='Option 1' required />");
                $wrapper.append("<input id='answer_2' class='answer' placeholder='Option 2' required />");
                $wrapper.append("<input id='answer_3' class='answer' placeholder='Option 3' required />");
                $wrapper.append("<input id='answer_4' class='answer' placeholder='Option 4' required />");
                break;

            case 'Single Choice':
                $input.remove();
                $wrapper.append("<input id='answer_1' class='answer' placeholder='Option 1' required />");
                $wrapper.append("<input id='answer_2' class='answer' placeholder='Option 2' required />");
                $wrapper.append("<input id='answer_3' class='answer' placeholder='Option 3' required />");
                $wrapper.append("<input id='answer_4' class='answer' placeholder='Option 4' required />");
                break;
        }

    });


    $('#addQuestions').on('submit', function(e) {
        e.preventDefault();

        var selected = $('.selectpicker').find("option:selected").val();
        var questionnaire_id = $('select[name=questionnaireID] option:selected').val();

        var inputs = {
            'text': $('#question').val(),
            'type': selected,
            'questionnaire_id': questionnaire_id,
            'answer_1' : $('#answer_1').val(),
            'answer_2' : $('#answer_2').val(),
            'answer_3' : $('#answer_3').val(),
            'answer_4' : $('#answer_4').val()
        };


        console.log(inputs);

        $.post('http://localhost:3000/api/addQuestions', inputs)
            .done(function(response) {
                if(response.status === 200) {
                    $("#question, .answer").val("");
                }
            })

            .fail(function(response) {
                console.log(response);
            });
    });


    // login form
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();

        var loginData = {
            email: $('#email').val()
        };


        $.post("http://localhost:3000/api/signin", loginData )
            .done(function (response) {
                console.log(response);
                if(response.status === 200) {
                    setCookie('x-auth', response.data.token);
                    setCookie('user-id', response.data.userID);

                    if(response.data.type === 'admin') {
                        window.location.href = '/dashboard'
                    } else {
                        window.location.href = '/welcome'
                    }
                } else {
                    $('.alert.alert-danger').remove();
                    $(".message").append('<div class="alert alert-danger">Your Email does not exist</div>');
                }

            })

            .fail(function(response) {
                console.log(response);
            });
    });


    // registration form
    $('#regForm').on('submit', function(e) {
        e.preventDefault();

        var regData = {
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            email: $('#email').val()
        };

        $.post("http://localhost:3000/api/signup", regData )
            .done(function (response) {
                console.log(response);

                if(response.status === 200) {
                    setCookie('x-auth', response.data.token);
                    setCookie('user-id', response.data.userID);

                    $(".message").append('<div class="alert alert-success">User registered sucessfully</div>');
                    setTimeout(function() {
                        window.location.href = response.data.type === 'admin' ? '/dashboard' : '/welcome';
                    }, 2000);
                }
                if(response.status === 409) {
                    $(".message").append('<div class="alert alert-danger">That email is already taken</div>');
                }
            })

            .fail(function(response) {
                console.log(response);
            });

    });



    // add new questionnaire
    $('#addQuestionnaire').on('submit', function(e) {
       e.preventDefault();

       var questionnaireData = {
           title: $('#title').val()
       };

       $.post("http://localhost:3000/api/addQuestionnaire", questionnaireData)
           .done(function(response) {
               $(".questionnaire-message").append('<div class="alert alert-success">Questionnaire added sucessfully</div>');
               setTimeout(function(){
                   window.location.href = '/addQuestionnaire'
               }, 500);
           })
           .fail(function(response) {
               console.log(response);
           });
    });

    // Submit questionnaire
    $('#questionnaireResult').on('submit', function(e) {
        e.preventDefault();

        var formData = $( this ).serializeArray();
        var questions = $(this).find('ul li');
        var questionIDs = [];
        var dataSubmit = [];

        $.each(questions, function(index, value) {
            var id = $(value).attr('id');
            if(id) {
                id = generateID(id);
                questionIDs.push(id);
            }
        });

        console.log(questionIDs);

        var questionID;

        for(var i = 0; i < formData.length; i++ ) {
            questionID = generateID(formData[i].name);

            if(questionID) {
                for(var j = 0; j < questionIDs.length; j++) {

                    if(questionIDs[j] === questionID) {
                        formData[i].questionID = questionID;

                        dataSubmit.push(formData[i]);
                    }

                }
            }
        }

        $.ajax({
            url: "/api/submitData",
            type: "POST",
            dataType : "json",
            contentType: "application/json; charset=utf-8",
            data : JSON.stringify(formData),
            success: function (result) {
                console.log(result);

                if(result.status === 409) {
                    $(".alert.alert-danger").remove();
                    $(".alert.alert-success").remove();
                    $(".resultsResponse").append('<div class="alert alert-danger">You already submitted this questionnaire</div>');
                } else if(dataSubmit.length === 0) {
                    $(".resultsResponse").append('<div class="alert alert-danger">Fill atleast one field</div>');
                } else {
                    $(".alert.alert-danger").remove();
                    $(".resultsResponse").append('<div class="alert alert-success">Questionnaire added sucessfully</div>');
                    setTimeout(function(){

                    }, 500);
                }
            }
        })

    });



})(jQuery);