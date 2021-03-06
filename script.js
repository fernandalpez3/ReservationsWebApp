// file: script.js
$(document).ready(function(){
    //initialize the firebase app
    
    var config = {
        apiKey: "AIzaSyCZKKTulhgDz_t4p_2QDA_QJ-3jHVJzmHI",
            authDomain: "reservations-2b9f1.firebaseapp.com",
            databaseURL: "https://reservations-2b9f1.firebaseio.com",
            projectId: "reservations-2b9f1",
            storageBucket: "",
            messagingSenderId: "852642616641"
    };
    firebase.initializeApp(config);
  
    //create firebase references
    var Auth = firebase.auth(); 
    var dbRef = firebase.database();
    var rootRef = dbRef.ref();
    var contactsRef = dbRef.ref('contacts')
    var usersRef = dbRef.ref('users')
    var restaurantRef = dbRef.ref('restaurants')
    var tableRef = dbRef.ref('tables')
    var auth = null;
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  
    //Register
    $('#doRegister').on('click', function (e) {
      e.preventDefault();
      $('#registerModal').modal('hide');
      $('#messageModalLabel').html(spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info']));
      $('#messageModal').modal('show');
      var data = {
        email: $('#registerEmail').val(), //get the email from Form
        firstName: $('#registerFirstName').val(), // get firstName
        lastName: $('#registerLastName').val(), // get lastName
      };
      var passwords = {
        password : $('#registerPassword').val(), //get the pass from Form
        cPassword : $('#registerConfirmPassword').val(), //get the confirmPass from Form
      }
      if( data.email != '' && passwords.password != ''  && passwords.cPassword != '' ){
        if( passwords.password == passwords.cPassword ){
          //create the user
          
          firebase.auth()
            .createUserWithEmailAndPassword(data.email, passwords.password)
            .then(function(user){
              //now user is needed to be logged in to save data
              console.log("Authenticated successfully with payload:", user);
              auth = user;
              //now saving the profile data
              usersRef
                .child(user.uid)
                .set(data)
                .then(function(){
                  console.log("User Information Saved:", user.uid);
                })
              $('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
              //hide the modal automatically
              setTimeout(function() {
                $('#messageModal').modal('hide');
                $('.unauthenticated, .userAuth').toggleClass('unauthenticated').toggleClass('authenticated');
                contactsRef.child(auth.uid)
                  .on("child_added", function(snap) {
                    console.log("added", snap.key(), snap.val());
                    $('#contacts').append(contactHtmlFromObject(snap.val()));
                  });
              }, 500);
              console.log("Successfully created user account with uid:", user.uid);
              $('#messageModalLabel').html(spanText('Successfully created user account!', ['success']))
            })
            .catch(function(error){
              console.log("Error creating user:", error);
              $('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
            });
        } else {
          //password and confirm password didn't match
          $('#messageModalLabel').html(spanText("ERROR: Passwords didn't match", ['danger']))
        }
      }  
    });

    //Register of restaurant
    $('#doRegisterRestaurant').on('click', function (e) {
      e.preventDefault();
      $('#registerRestaurant').modal('hide');
      $('#messageModalLabel').html(spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info']));
      $('#messageModal').modal('show');
      var data = {
        email: $('#registerEmail').val(), //get the email from Form
        name: $('#registerName').val(), // get firstName
        address: $('#registerAddress').val(), // get lastName
      };
      var passwords = {
        password : $('#registerPassword').val(), //get the pass from Form
        cPassword : $('#registerConfirmPassword').val(), //get the confirmPass from Form
      }
      if( data.email != '' && passwords.password != ''  && passwords.cPassword != '' ){
        if( passwords.password == passwords.cPassword ){
          //create the user
          
          firebase.auth()
            .createUserWithEmailAndPassword(data.email, passwords.password)
            .then(function(user){
              //now user is needed to be logged in to save data
              console.log("Authenticated successfully with payload:", user);
              auth = user;
              //now saving the profile data
              restaurantRef
                .child(user.uid)
                .set(data)
                .then(function(){
                  console.log("User Information Saved:", user.uid);
                })
              $('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
              //hide the modal automatically
              setTimeout(function() {
                $('#messageModal').modal('hide');
                $('.unauthenticated, .userAuth').toggleClass('unauthenticated').toggleClass('authenticated');
                contactsRef.child(auth.uid)
                  .on("child_added", function(snap) {
                    console.log("added", snap.key(), snap.val());
                    $('#contacts').append(contactHtmlFromObject(snap.val()));
                  });
              }, 500);
              console.log("Successfully created user account with uid:", user.uid);
              $('#messageModalLabel').html(spanText('Successfully created user account!', ['success']))
            })
            .catch(function(error){
              console.log("Error creating user:", error);
              $('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
            });
        } else {
          //password and confirm password didn't match
          $('#messageModalLabel').html(spanText("ERROR: Passwords didn't match", ['danger']))
        }
      }  
    });
  
    //Login
    $('#doLogin').on('click', function (e) {
      e.preventDefault();
      $('#loginModal').modal('hide');
      $('#messageModalLabel').html(spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info']));
      $('#messageModal').modal('show');
  
      if( $('#loginEmail').val() != '' && $('#loginPassword').val() != '' ){
        //login the user
        var data = {
          email: $('#loginEmail').val(),
          password: $('#loginPassword').val()
        };
        firebase.auth().signInWithEmailAndPassword(data.email, data.password)
          .then(function(authData) {
            console.log("Authenticated successfully with payload:", authData);
            auth = authData;
            $('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
            setTimeout(function () {
              $('#messageModal').modal('hide');
              $('.unauthenticated, .userAuth').toggleClass('unauthenticated').toggleClass('authenticated');
              contactsRef.child(auth.uid)
                .on("child_added", function(snap) {
                  //console.log("added", snap.key(), snap.val());
                  $('#contacts').append(contactHtmlFromObject(snap.val()));
                });
            })
          })
          .catch(function(error) {
            console.log("Login Failed!", error);
            $('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
          });
      }
    });
  
    //save contact
    $('.addValue').on("click", function( event ) {  
      event.preventDefault();
      if( auth != null ){
        if( $('#name').val() != '' || $('#email').val() != '' ){
          contactsRef.child(auth.uid)
            .push({
              name: $('#name').val(),
              email: $('#email').val(),
              location: {
                city: $('#city').val(),
                state: $('#state').val(),
                zip: $('#zip').val()
              }
            })
            document.contactForm.reset();
        } else {
          alert('Please fill at-lease name or email!');
        }
      } else {
        //inform user to login
      }
    });

   //add table
    $('.addTable').on("click", function( event ) {  
      event.preventDefault();
        if( auth != null ){
          if( $('#table').val() != '' || $('#numberSeats').val() != '' ){
            tableRef.child(auth.uid)
              .push({
                table: $('#table').val(),
                numberSeats: $('#numberSeats').val(),
              })
              document.contactForm.reset();
          } else {
            alert('Please fill at-lease name or email!');
          }
        } else {
          //inform user to login
        }
      });

      //pull restaurants
      $('#seeRestaurants').on("click", function( event ){
        event.preventDefault();
        rootRef.once("value").then(function(snapshot) {
          snapshot.child("restaurants").forEach(function(val){
            $('#restaurant_list').append('<div id="restaurant_list"><div class="col-lg-3 col-md-3 col-xs-6 card"><a href="#" class="d-block mb-4 h-100"><img class="img-fluid img-thumbnail" src="' + val.child("image").val() + '" alt=""><h4>' + val.child("name").val() + '</h4></a> </div></div>');
          });
    
        });
      });

  })


   
  //prepare contact object's HTML
  function contactHtmlFromObject(contact){
    console.log( contact );
    var html = '';
    html += '<li class="list-group-item contact">';
      html += '<div>';
        html += '<p class="lead">'+contact.name+'</p>';
        html += '<p>'+contact.email+'</p>';
        html += '<p><small title="' + contact.location.zip+'">'
              +contact.location.city + ', '
              +contact.location.state + '</small></p>';
      html += '</div>';
    html += '</li>';
    return html;
  }
  
  function spanText(textStr, textClasses) {
    var classNames = textClasses.map(c => 'text-'+c).join(' ');
    return '<span class="'+classNames+'">'+ textStr + '</span>';

  }