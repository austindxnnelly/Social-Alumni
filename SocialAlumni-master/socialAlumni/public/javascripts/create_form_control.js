/**
 * Function which checks what checkbox is currently ticked in the create user page.
 */
function studentCheck() {
  //Gets the radios from the html page
  var studentRadio = document.getElementById("studentRadio");
  var alumniRadio = document.getElementById("alumniRadio");
    

  // Gets the fields from the html page for both the student and alumni
  var div = document.getElementById("inputMajor");
  var divA = document.getElementById("inputDegree");

  var interestsDiv = document.getElementById("inputInterests");
  var workDiv = document.getElementById("inputWork");

  // If the student checkbox is checked, display the student related fields
  if (studentRadio.checked == true){
    div.style.display = "block";
    interestsDiv.style.display = "block";
    divA.style.display = "none";
    workDiv.style.display = "none";
  } else if(alumniRadio.checked == true) { // else if the student checkbox is checked, display the student related fields
    div.style.display = "none";
    interestsDiv.style.display = "none";
    divA.style.display = "block";
    workDiv.style.display = "block";
  } else { // else display none of them
      div.style.display = "none";
      interestsDiv.style.display = "none";
      divA.style.display = "none";
      workDiv.style.display = "none";
  }
}