// Function to fetch and display stories
function displayStories() {
  $.ajax({
    url: "https://usmanlive.com/wp-json/api/stories",
    method: "GET",
    dataType: "json",
    success: function (data) {
      var storiesList = $("#storiesList");
      storiesList.empty();

      $.each(data, function (index, story) {
        storiesList.append(
          `<div class="mb-3">
            <h3>${story.title}</h3>
            <div>${story.content}</div>
            <div class="btngrp">
                <button type="button" id="btn-edit" class="btn btn-outline-light" data-id="${story.id}">Edit</button>
                <button type="button" id="btn-dell" class="btn btn-outline-danger" data-id="${story.id}">Delete</button>
                </div>
        </div>
        <hr id="hr1"/>
              `
        );
      });
    },
    error: function (error) {
      console.error("Error fetching stories:", error);
    },
  });
}

// Function to delete a story
function deleteStory() {
  let storyId = $(this).attr("data-id");
  $.ajax({
    url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
    method: "DELETE",
    success: function () {
      displayStories(); // Refresh the list after deleting a story
    },
    error: function (error) {
      console.error("Error deleting story:", error);
    },
  });
}
function handleFormSubmission(event) {
  event.preventDefault();
  let storyId = $("#createBtn").attr("data-id");
  var title = $("#createTitle").val();
  var content = $("#createContent").val();
  if (storyId) {
    $.ajax({
      url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
      method: "PUT",

      data: { title, content },
      success: function () {
        displayStories(); // Refresh the list after creating a new story
      },
      error: function (error) {
        console.error("Error creating story:", error);
      },
    });
  } else {
    $.ajax({
      url: "https://usmanlive.com/wp-json/api/stories",
      method: "POST",
      data: { title, content },
      success: function () {
        displayStories(); // Refresh the list after creating a new story
      },
      error: function (error) {
        console.error("Error creating story:", error);
      },
    });
  }
}

// function showGreenPopup() {
//   const toastHTML = `
//       <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true">
//           <div class="toast-header">
//               <strong class="me-auto">Success</strong>
//               <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
//           </div>
//           <div class="toast-body">
//               Story uploaded successfully.
//           </div>
//       </div>
//   `;
  
//   // Append the toast message to the body
//   $('body').append(toastHTML);
  
//   // Initialize the toast using Bootstrap's toast API
//   var toastEl = document.querySelector('.toast');
//   var toast = new bootstrap.Toast(toastEl);
  
//   // Show the toast
//   toast.show();
// }



function editBtnClicked(event) {
  event.preventDefault();
  let storyId = $(this).attr("data-id");
  $.ajax({
    url: "https://usmanlive.com/wp-json/api/stories/" + storyId,
    method: "GET",
    success: function (data) {
      console.log(data);
      $("#clearBtn").show();
      $("#createTitle").val(data.title);
      $("#createContent").val(data.content);
      $("#createBtn").html("Update");
      $("#createBtn").attr("data-id", data.id);
    },
    error: function (error) {
      console.error("Error deleting story:", error);
    },
  });
}
$(document).ready(function () {
  // Initial display of stories

  displayStories();
  $("#storiesList").on("click", "#btn-dell", deleteStory);
  $("#storiesList").on("click", "#btn-edit", editBtnClicked);
  // Create Form Submission
  $("#createForm").submit(handleFormSubmission);
  $("#clearBtn").on("click", function (e) {
    e.preventDefault();
    $("#clearBtn").hide();
    $("#createBtn").removeAttr("data-id");
    $("#createBtn").html("Create");
    $("#createTitle").val("");
    $("#createContent").val("");
  });
});
