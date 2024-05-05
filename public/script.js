data = [
  { id: 1, role: "dr", age: 30 },
  { id: 2, role: "dr", age: 25 },
  { id: 3, role: "nurse", age: 25 },
  { id: 3, role: "nurse", age: 25 },
  { id: 3, role: "nurse", age: 25 },
  { id: 3, role: "nurse", age: 25 },
  { id: 4, role: "nurse", age: 25 },
  { id: 5, role: "staff", age: 25 },
  { id: 6, role: "staff", age: 27 },
  { id: 6, role: "staff", age: 25 },
  { id: 6, role: "staff", age: 25 },
  { id: 6, role: "staff", age: 25 },
];
function populateElements() {
  const docElement = document.querySelector(".right_doc");
  const nurseElement = document.querySelector(".right_nurse");
  const staffElement = document.querySelector(".right_stff");

  // Loop through the data and populate elements
  for (const person of data) {
    // Create a new element for each entry
    const personElement = document.createElement("div");

    // Create span for ID key
    const idKeySpan = document.createElement("span");
    idKeySpan.textContent = "ID: ";
    idKeySpan.style.color = "#fff"; // White color for keys
    personElement.appendChild(idKeySpan);

    // Create span for ID value
    const idValueSpan = document.createElement("span");
    idValueSpan.textContent = person.id;
    idValueSpan.style.color = "rgb(3, 49, 92)"; // Specified color for values
    personElement.appendChild(idValueSpan);

    // Add line break
    personElement.appendChild(document.createElement("br"));

    // Create span for Age key
    const ageKeySpan = document.createElement("span");
    ageKeySpan.textContent = "Age: ";
    ageKeySpan.style.color = "#fff"; // White color for keys
    personElement.appendChild(ageKeySpan);

    // Create span for Age value
    const ageValueSpan = document.createElement("span");
    ageValueSpan.textContent = person.age;
    ageValueSpan.style.color = "rgb(3, 49, 92)"; // Specified color for values
    personElement.appendChild(ageValueSpan);

    // Add line break
    personElement.appendChild(document.createElement("br"));

    // Create span for Role key
    const roleKeySpan = document.createElement("span");
    roleKeySpan.textContent = "Role: ";
    roleKeySpan.style.color = "#fff"; // White color for keys
    personElement.appendChild(roleKeySpan);

    // Create span for Role value
    const roleValueSpan = document.createElement("span");
    roleValueSpan.textContent = person.role;
    roleValueSpan.style.color = "rgb(3, 49, 92)"; // Specified color for values
    personElement.appendChild(roleValueSpan);

    // Apply styles to the element
    personElement.style.backgroundColor = "rgb(104, 196, 227)";
    personElement.style.fontWeight = "bold";
    personElement.style.borderRadius = "10px";
    personElement.style.padding = "10px";
    personElement.style.margin = "10px";
    personElement.style.boxShadow = "2px 3px 2px grey"; // Optional: Add some padding

    // Append the element to the appropriate container based on role
    switch (person.role) {
      case "dr":
        docElement.appendChild(personElement);
        break;
      case "nurse":
        nurseElement.appendChild(personElement);
        break;
      case "staff":
        staffElement.appendChild(personElement);
        break;
      default:
        console.error("Unknown role:", person.role);
    }
  }
}






const data2 = [
  { id: 1, fullName: "John Doe" },
  { id: 2, fullName: "Jane Smith" },
  { id: 3, fullName: "Michael Johnson" },
  { id: 4, fullName: "Emily Williams" },
  { id: 5, fullName: "David Brown" },
  { id: 6, fullName: "Jennifer Martinez" },
  { id: 7, fullName: "William Davis" },
  { id: 8, fullName: "Jessica Rodriguez" },
  { id: 9, fullName: "Christopher Wilson" },
  { id: 10, fullName: "Amanda Taylor" },
];
function findpat() {
  console.log("Function findpat() is executing...");
  const docElement = document.querySelector(".right_patient");

  for (const patient of data2) {
    // Create a new element for each patient
    const personElement = document.createElement("div");

    // Create span for ID key
    const idKeySpan = document.createElement("span");
    idKeySpan.textContent = "ID: ";
    idKeySpan.style.color = "#fff"; // White color for keys
    personElement.appendChild(idKeySpan);

    // Create span for ID value
    const idValueSpan = document.createElement("span");
    idValueSpan.textContent = patient.id;
    idValueSpan.style.color = "rgb(3, 49, 92)"; // Blue color for values
    personElement.appendChild(idValueSpan);

    // Add line break
    personElement.appendChild(document.createElement("br"));

    // Create span for Name key
    const nameKeySpan = document.createElement("span");
    nameKeySpan.textContent = "Name: ";
    nameKeySpan.style.color = "#fff"; // White color for keys
    personElement.appendChild(nameKeySpan);

    // Create span for Name value
    const nameValueSpan = document.createElement("span");
    nameValueSpan.textContent = patient.fullName;
    nameValueSpan.style.color = "rgb(3, 49, 92)"; // Blue color for values
    personElement.appendChild(nameValueSpan);

    // Apply styles to the element
    personElement.style.backgroundColor = "rgb(104, 196, 227)";
    personElement.style.fontWeight = "bold";
    personElement.style.borderRadius = "10px";
    personElement.style.padding = "10px";
    personElement.style.margin = "15px";
    personElement.style.boxShadow = "2px 3px 2px grey";

    // Append the element to the document
    docElement.appendChild(personElement);
  }
}

const data3 = [
  { id: 1, name: "Dr. John Smith", floor: 1 },
  { id: 2, name: "Dr. Emily Johnson", floor: 3 },
  { id: 3, name: "Nurse Sarah Brown", floor: 2 },
  { id: 4, name: "Nurse Michael Wilson", floor: 4 },
  { id: 5, name: "Staff Lisa Jones", floor: 1 },
  { id: 6, name: "Staff David Lee", floor: 3 },
];

function appendPersonsToFloor() {
  const floors = [null, document.querySelector('.floor1'), document.querySelector('.floor2'), document.querySelector('.floor3'), document.querySelector('.floor4')];

  for (const person of data3) {
      const personDiv = document.createElement('div');
      personDiv.classList.add('person');

      // Style keys "ID" and "Name" in white
      const idSpan = document.createElement('span');
      idSpan.textContent = 'ID: ';
      idSpan.style.color = '#fff';
      personDiv.appendChild(idSpan);

      const idValueSpan = document.createElement('span');
      idValueSpan.textContent = person.id;
      idValueSpan.style.color = 'rgb(3, 49, 92)'; // Adjusted color here
      personDiv.appendChild(idValueSpan);

      // Add line break
      personDiv.appendChild(document.createElement('br'));

      const nameSpan = document.createElement('span');
      nameSpan.textContent = 'Name: ';
      nameSpan.style.color = '#fff';
      personDiv.appendChild(nameSpan);

      const nameValueSpan = document.createElement('span');
      nameValueSpan.textContent = person.name;
      nameValueSpan.style.color = 'rgb(3, 49, 92)'; // Keep the same color for the name
      personDiv.appendChild(nameValueSpan);

      // Apply styling to the person div
      personDiv.style.backgroundColor = "rgb(104, 196, 227)";
      personDiv.style.fontWeight = "bold";
      personDiv.style.borderRadius = "10px";
      personDiv.style.padding = "10px";
      personDiv.style.margin = "15px";
      personDiv.style.boxShadow = "2px 3px 2px grey";

      // Determine the floor div to append to based on the person's floor number
      const floorDiv = floors[person.floor];
      if (floorDiv) {
          floorDiv.appendChild(personDiv);
      } else {
          console.error(`Floor ${person.floor} not found.`);
      }
  }
}

function updateForm() {
  // Retrieve selected role
  var selectedRole = document.querySelector('input[name="role"]:checked').value;

  // Retrieve form elements and their corresponding labels
  var nameInput = document.getElementById("name");
  var nameLabel = document.querySelector('label[for="name"]');
  var emailInput = document.getElementById("email");
  var gender = document.getElementById("ggg");
  var emailLabel = document.querySelector('label[for="email"]');
  var phoneNumberInput = document.getElementById("phoneNumber");
  var phoneNumberLabel = document.querySelector('label[for="phoneNumber"]');
  var passwordInput = document.getElementById("password");
  var passwordLabel = document.querySelector('label[for="password"]');
  var birthDateInput = document.getElementById("birthDate");
  var birthDateLabel = document.querySelector('label[for="birthDate"]');
  var spacialityInput = document.getElementById("spaciality");
  var spacialityLabel = document.querySelector('label[for="spaciality"]');
  var maleRadioButton = document.getElementById("male");
  var maleLabel = document.querySelector('label[for="male"]');
  var femaleRadioButton = document.getElementById("female");
  var femaleLabel = document.querySelector('label[for="female"]');
  var rankSelect = document.getElementById("rank");
  var rankLabel = document.querySelector('label[for="rank"]');
  var sectionSelect = document.getElementById("section");
  var sectionLabel = document.querySelector('label[for="section"]');
  var typeSelect = document.getElementById("type");
  var typeSelect = document.getElementById("type");
  var formm = document.getElementById("register_form");

formm.style.display='block'
  var typeLabel = document.querySelector('label[for="type"]');

  // Hide all fields and labels first
  var allFieldsAndLabels = document.querySelectorAll('.add_user_container input, .add_user_container select, .add_user_container label');
  allFieldsAndLabels.forEach(function(element) {
    element.style.display = 'none';
  });

  // Disable required attribute for all fields
  var allFields = document.querySelectorAll('.add_user_container input, .add_user_container select');
  allFields.forEach(function(field) {
    field.removeAttribute('required');
  });

  // Display fields and labels based on selected role and enable required for visible fields
  if (selectedRole === 'b') {
    // Display doctor fields
    nameInput.style.display = 'inline';
    gender.style.display = 'inline';

    nameLabel.style.display = 'inline';
    emailInput.style.display = 'inline';
    emailLabel.style.display = 'inline';
    passwordInput.style.display = 'inline';
    passwordLabel.style.display = 'inline';
    phoneNumberInput.style.display = 'inline';
    phoneNumberLabel.style.display = 'inline';
    birthDateInput.style.display = 'inline';
    birthDateLabel.style.display = 'inline';
    spacialityInput.style.display = 'inline';
    spacialityLabel.style.display = 'inline';
    gender.style.display = 'inline';

    maleRadioButton.style.display = 'inline';
    maleLabel.style.display = 'inline';
    femaleRadioButton.style.display = 'inline';
    femaleLabel.style.display = 'inline';

    // Set required attribute for doctor fields
    nameInput.setAttribute('required', 'required');
    emailInput.setAttribute('required', 'required');
    passwordInput.setAttribute('required', 'required');
    phoneNumberInput.setAttribute('required', 'required');
    birthDateInput.setAttribute('required', 'required');
    spacialityInput.setAttribute('required', 'required');
  }
  else if(selectedRole === 'admition') {
      // Display doctor fields
      nameInput.style.display = 'inline';
      gender.style.display = 'inline';
  
      nameLabel.style.display = 'inline';
      emailInput.style.display = 'inline';
      emailLabel.style.display = 'inline';
      passwordInput.style.display = 'inline';
      passwordLabel.style.display = 'inline';
      phoneNumberInput.style.display = 'inline';
      phoneNumberLabel.style.display = 'inline';
      birthDateInput.style.display = 'inline';
      birthDateLabel.style.display = 'inline';

  
      maleRadioButton.style.display = 'inline';
      maleLabel.style.display = 'inline';
      femaleRadioButton.style.display = 'inline';
      femaleLabel.style.display = 'inline';
  
      // Set required attribute for doctor fields
      nameInput.setAttribute('required', 'required');
      emailInput.setAttribute('required', 'required');
      passwordInput.setAttribute('required', 'required');
      phoneNumberInput.setAttribute('required', 'required');
      birthDateInput.setAttribute('required', 'required');
    

  }
   else if (selectedRole === 'a') {
    // Display nurse fields
    nameInput.style.display = 'inline';
    nameLabel.style.display = 'inline';
    emailInput.style.display = 'inline';
    emailLabel.style.display = 'inline';
    passwordInput.style.display = 'inline';
    passwordLabel.style.display = 'inline';
    phoneNumberInput.style.display = 'inline';
    phoneNumberLabel.style.display = 'inline';
    birthDateInput.style.display = 'inline';
    birthDateLabel.style.display = 'inline';
    rankSelect.style.display = 'inline';
    rankLabel.style.display = 'inline';
    sectionSelect.style.display = 'inline';
    sectionLabel.style.display = 'inline';
    gender.style.display = 'inline';

    maleRadioButton.style.display = 'inline';
    maleLabel.style.display = 'inline';
    femaleRadioButton.style.display = 'inline';
    femaleLabel.style.display = 'inline';

    // Set required attribute for nurse fields
    nameInput.setAttribute('required', 'required');
    emailInput.setAttribute('required', 'required');
    passwordInput.setAttribute('required', 'required');
    phoneNumberInput.setAttribute('required', 'required');
    birthDateInput.setAttribute('required', 'required');
    rankSelect.setAttribute('required', 'required');
    sectionSelect.setAttribute('required', 'required');
  } else if (selectedRole === 's') {
    // Display staff fields
    emailInput.style.display = 'inline';
    emailLabel.style.display = 'inline';
    passwordInput.style.display = 'inline';
    passwordLabel.style.display = 'inline';
    typeSelect.style.display = 'inline';
    typeLabel.style.display = 'inline';
    spacialityInput.style.display = 'inline';
    spacialityLabel.style.display = 'inline';

    // Set required attribute for staff fields
    emailInput.setAttribute('required', 'required');
    passwordInput.setAttribute('required', 'required');
    typeSelect.setAttribute('required', 'required');
    spacialityInput.setAttribute('required', 'required');
  }
}




    function searchFunction() {
        var input, filter, ul, li, span, txtValue;
        input = document.getElementById('searchInput');
        filter = input.value.toUpperCase();
        ul = document.querySelector('.right_container');
        span = ul.getElementsByTagName('span');

        for (var i = 0; i < span.length; i++) {
            txtValue = span[i].textContent || span[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                span[i].parentNode.style.display = ''; // Show the parent div if span matches
            } else {
                span[i].parentNode.style.display = 'none'; // Hide the parent div if span doesn't match
            }
        }
    }
/*
  function hideCheckboxesAndButton() {
    '<% if (isDoctor) { %>'
     console.log('D');

      '<% } else { %>'
      console.log('e');

          '<% } %>'
    if (isDoctor) {
          console.log('hi1');
          var checkboxes = document.querySelectorAll('input[type="checkbox"]');
          var submitButton = document.querySelector('.task_but');

          // Set display to 'none' for each checkbox and the submit button
          checkboxes.forEach(function (checkbox) {
              checkbox.style.display = 'none';
          });
          submitButton.style.display = 'none';
      } else {
          console.log('hi2');

          document.querySelector('.task_form').style.display = 'none';

          // Hide all delete buttons
          document.querySelectorAll('a.delete').forEach(deleteButton => {
              deleteButton.style.display = 'none';
          });
      }
  }
  document.addEventListener("DOMContentLoaded", function() {
    var todayItems = document.getElementById("today-items").querySelectorAll(".today-item");
    todayItems.forEach(function(item) {
        item.style.borderLeftColor = getRandomColor();
    });
});
*/
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function showRooms() {
  var selectedFloor = document.getElementById("choosenFloor").value;
  var rooms = document.getElementsByClassName("floor-room");
  for (var i = 0; i < rooms.length; i++) {
    rooms[i].removeAttribute("required");
    rooms[i].style.display = "none";
  }
  var selectedRoom = document.getElementById("choosenFloor" + selectedFloor + "Room");
  selectedRoom.setAttribute("required", true);
  selectedRoom.style.display = "block";
}



   
