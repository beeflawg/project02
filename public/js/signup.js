$(document).ready(function() {
  // Getting references to our form and input
  var loginForm = $("form.login");
  var signUpForm = $("form.signup");
  var signupEmailInput = $("input#signup-email-input");
  var signupPasswordInput = $("input#signup-password-input");
  var signupPasswordConfirm = $("input#signup-password-confirm")
  var loginEmailInput = $("input#login-email-input");
  var loginPasswordInput = $("input#login-password-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {

    event.preventDefault();

    if (signupPasswordInput.val().trim() !== signupPasswordConfirm.val().trim()){
      handlePassErr();
      return;
    }

    
    var userData = {
      email: signupEmailInput.val().trim(),
      password: signupPasswordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password);
    signupEmailInput.val("");
    signupPasswordInput.val("");
    signupPasswordConfirm.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password) {
    $.post("/api/signup", {
      email: email,
      password: password
    }).then(function(data) {
      window.location.replace(data);
      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleSignupErr);
  }

  loginForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      email: loginEmailInput.val().trim(),
      password: loginPasswordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    loginEmailInput.val("");
    loginPasswordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    }).then(function(data) {
      window.location.replace(data);
      // If there's an error, log the error
    }).catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text("Incorrect Email or Password.");
    $("#alert").fadeIn(500);
  }

  function handleSignupErr(err) {
    $("#alert .msg").text("This Email is already registered to an account!");
    $("#alert").fadeIn(500);
  }

  function handlePassErr(err) {
    $("#alert .msg").text("Passwords do not match!");
    $("#alert").fadeIn(500);
  }

  $('.form').find('input, textarea').on('keyup blur focus', function (e) {
    var $this = $(this),
        label = $this.prev('label');
      if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
          } else {
            label.addClass('active highlight');
          }
      } else if (e.type === 'blur') {
        if( $this.val() === '' ) {
          label.removeClass('active highlight'); 
        } else {
          label.removeClass('highlight');   
        }   
      } else if (e.type === 'focus') {
        
        if( $this.val() === '' ) {
          label.removeClass('highlight'); 
        } 
        else if( $this.val() !== '' ) {
          label.addClass('highlight');
        }
      }
  
  });
  
  $('.tab a').on('click', function (e) {
    
    e.preventDefault();
    
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
    
    target = $(this).attr('href');
  
    $('.tab-content > div').not(target).hide();
    
    $(target).fadeIn(600);
    
  });

});
