


document.addEventListener("DOMContentLoaded", function () {

   //aside animation 
   const menuIcon = document.querySelector('header i.bx-menu');
    const aside = document.querySelector('aside');
    const menuItems = document.querySelectorAll('aside ul li:first-child ');

    menuIcon.addEventListener('click', () => {
      aside.classList.toggle('open');
    });

    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        aside.classList.remove('open');
      });
    });


 

 



    // Modal elements
    //labs section

    const addLabModal = document.getElementById("addLabModal");
    const editLabModal = document.getElementById("editLabModal");
    const deleteLabModal = document.getElementById("deleteLabModal");
    //news section

    const addNewsModal = document.getElementById("addNewsModal");
    const editNewsModal = document.getElementById("editNewsModal");
    const deleteNewsModal = document.getElementById("deleteNewsModal");

    //requests section

    // Modal buttons

    // labs section
    const addLabBtn = document.getElementById("addLabBtn");
    const closeAddLabBtn = addLabModal?.querySelector(".close-btn");
    const closeEditLabBtn = editLabModal?.querySelector(".close-btn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteLabBtn");
    //news section 
    const addNewsBtn = document.getElementById("addNewsbtn");
    const closeNewsLabBtn = document.querySelector(".closenews-btn");
    const closeNewsediteLabBtn = document.querySelector("closenewsedit-btn");
    const cancelDeleteNewsBtn = document.getElementById("cancelDeleteNewsBtn");

    //requests section

    // Open the Add Lab modal
    addLabBtn?.addEventListener("click", () => {
        addLabModal.style.display = "block";
    });
    //open the add news modal
    addNewsBtn?.addEventListener("click", (e) => {
        addNewsModal.style.display = " block";
    })
    // Open Add Team Modal
    const addteammodal = document.getElementById("addTeamModal");
    const closeteamModal = document.getElementById("closeteambtn");
    const addteamBtn = document.getElementById("addteamBtn");

    addteamBtn.addEventListener("click", () => {
        addteammodal.style.display = "block";
    });


    // Open the Edit Lab modal and populate the fields with the lab data
    document.querySelectorAll('.editlabs').forEach(button => {
        button.addEventListener('click', function (event) {
            const labsRow = event.target.closest('tr'); // Get the closest row to the edit button
            if (!labsRow) {
                console.error("Error: Could not find the row for the clicked button");
                return;
            }

            const labsIdElement = labsRow.querySelector('td:nth-child(1)');
            const labsNameElement = labsRow.querySelector('td:nth-child(2)');
            const labsImageElement = labsRow.querySelector('td:nth-child(3) img'); // Select <img>
            const labsDateElement = labsRow.querySelector('td:nth-child(4)');
            const labsDescElement = labsRow.querySelector('td:nth-child(5)');

            if (!labsIdElement || !labsNameElement || !labsImageElement || !labsDateElement || !labsDescElement) {
                console.error("One or more elements were not found inside the row");
                return;
            }

            const labsId = labsIdElement.textContent.trim();
            const labsName = labsNameElement.textContent.trim();
            const labsImage = labsImageElement.getAttribute('src'); // Use .getAttribute('src')
            const labsDate = labsDateElement.textContent.trim();
            const labsDesc = labsDescElement.textContent.trim();

            // Populate the Edit Labs modal with the current labs data
            document.getElementById('edit_lab_id').value = labsId;
            document.getElementById('edit_lab_name').value = labsName;
            document.getElementById('edit_lab_create_date').value = labsDate;
            document.getElementById('edit_lab_desc').value = labsDesc;

            // Display the image preview instead of setting the value of file input
            const imagePreview = document.getElementById('edit_lab_img_preview'); // Ensure you have an <img> for preview
            if (imagePreview) {
                imagePreview.src = labsImage;
            }

            // Show the Edit Labs modal
            editLabModal.style.display = "block";
        });
    });

    // open the edit news 
    // Open the Edit News modal and populate the fields with the news data
    document.querySelectorAll('.editnews').forEach(button => {
        button.addEventListener('click', function (event) {
            const newsRow = event.target.closest('tr'); // Get the closest row to the edit button
            if (!newsRow) {
                console.error("Error: Could not find the row for the clicked button");
                return;
            }

            const newsIdElement = newsRow.querySelector('td:nth-child(1)');
            const newsNameElement = newsRow.querySelector('td:nth-child(2)');
            const newsImageElement = newsRow.querySelector('td:nth-child(3) img'); // Select <img>
            const newsDateElement = newsRow.querySelector('td:nth-child(4)');
            const newsDescElement = newsRow.querySelector('td:nth-child(5)');

            if (!newsIdElement || !newsNameElement || !newsImageElement || !newsDateElement || !newsDescElement) {
                console.error("One or more elements were not found inside the row");
                return;
            }

            const newsId = newsIdElement.textContent.trim();
            const newsName = newsNameElement.textContent.trim();
            const newsImage = newsImageElement.getAttribute('src'); // Use .getAttribute('src')
            const newsDate = newsDateElement.textContent.trim();
            const newsDesc = newsDescElement.textContent.trim();

            // Populate the Edit News modal with the current news data
            document.getElementById('edit_news_id').value = newsId || "Not Available";
            document.getElementById('edit_news_title').value = newsName || "Not Available";
            document.getElementById('edit_news_date').value = newsDate || "Not Available";
            document.getElementById('edit_news_desc').value = newsDesc || "Not Available";

            // Display the image preview instead of setting the value of file input
            const imagePreview = document.getElementById('edit_news_img_preview'); // Ensure you have an <img> for preview
            if (imagePreview) {
                imagePreview.src = newsImage;
            }

            // Show the Edit News modal
            editNewsModal.style.display = "block";
        });
    });


    // Close the Add Lab modal
    closeAddLabBtn?.addEventListener("click", () => {
        addLabModal.style.display = "none";
    });
    // close the Add News modal
    closeNewsLabBtn?.addEventListener("click", () => {
        addNewsModal.style.display = "none";
    });
    // Close the Edit Lab modal
    closeEditLabBtn?.addEventListener("click", () => {
        editLabModal.style.display = "none";
    });
    // close the edite news modal
    closeNewsediteLabBtn?.addEventListener("click", () => {
        editNewsModal.style.display = "none";
    });
    // Close the Delete Lab modal
    cancelDeleteBtn?.addEventListener("click", () => {
        deleteLabModal.style.display = "none";
    });
    // Close the delete news modal
    cancelDeleteNewsBtn?.addEventListener("click", (e) => {
        deleteNewsModal.style.display = " none";
    })

    // Close modals when clicking outside
window.addEventListener("click", event => {
    if (event.target === addLabModal) addLabModal.style.display = "none";
    if (event.target === editLabModal) editLabModal.style.display = "none";
    if (event.target === deleteLabModal) deleteLabModal.style.display = "none";

    if (event.target === addNewsModal) addNewsModal.style.display = "none";
    if (event.target === editNewsModal) editNewsModal.style.display = "none";
    if (event.target === deleteNewsModal) deleteNewsModal.style.display = "none";

    const addTeamModal = document.getElementById("addTeamModal");
    const viewTeamdetailsModal = document.getElementById("viewTeamdetailsModal");
    const memberTeamModal = document.getElementById("MemberTeamModal");
    const addMemberModal = document.getElementById("addMemberModal");
    const researchAreasModal = document.getElementById("TeamResearchAreasModal");
    const addResearchAreaModal = document.getElementById("addResearchAreaModal");
    const deleteTeamModal = document.getElementById("deleteTeamModal");
    const deleteRequestsModal = document.getElementById("deleteRequestsModal");
    const deleteUserModal = document.getElementById("deleteUserModal");

    if (event.target === addTeamModal) addTeamModal.style.display = "none";
    if (event.target === viewTeamdetailsModal) viewTeamdetailsModal.style.display = "none";
    if (event.target === memberTeamModal) memberTeamModal.style.display = "none";
    if (event.target === addMemberModal) addMemberModal.style.display = "none";
    if (event.target === researchAreasModal) researchAreasModal.style.display = "none";
    if (event.target === addResearchAreaModal) addResearchAreaModal.style.display = "none";
    if (event.target === deleteTeamModal) deleteTeamModal.style.display = "none";
    if (event.target === deleteRequestsModal) deleteRequestsModal.style.display = "none";
    if (event.target === deleteUserModal) deleteUserModal.style.display = "none";
});


    // Delete lab functionality
    let deleteLabId = null; // Store the ID of the lab to be deleted

    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', function (event) {
            const labRow = event.target.closest('tr'); // Get the closest row to the delete button
            deleteLabId = labRow.querySelector('td:nth-child(1)').textContent.trim(); // Get the lab ID
            deleteLabModal.style.display = "block"; // Show the delete modal
        });
    });

    // Confirm delete action
    document.getElementById("confirmDeleteBtn")?.addEventListener("click", function () {
        if (deleteLabId) {
            fetch(`/admin/labs/delete/${deleteLabId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Reload the page after successful deletion
                        location.reload();
                    } else {
                        // If there's an error, reload the page to reflect the state
                        location.reload();
                    }
                })
                .catch(error => {
                    // If there's an error, just reload the page
                    location.reload();
                    console.error('Error:', error);
                });
        }
        // Close the delete modal
        deleteLabModal.style.display = "none";
    });

    //delete news functionally
    let deleteNewsId = null; // Store the ID of the news to be deleted

    document.querySelectorAll('.deletenews').forEach(button => {
        button.addEventListener('click', function (event) {
            const newsRow = event.target.closest('tr'); // Get the closest row to the delete button
            deleteNewsId = newsRow.querySelector('td:nth-child(1)').textContent.trim(); // Get the news ID
            deleteNewsModal.style.display = "block"; // Show the delete modal
        });
    });

    // Confirm delete action
    document.getElementById("confirmDeleteNewsBtn")?.addEventListener("click", function () {
        if (deleteNewsId) {
            fetch(`/admin/news/delete/${deleteNewsId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Reload the page after successful deletion
                        location.reload();
                    } else {
                        // If there's an error, reload the page to reflect the state
                        location.reload();
                    }
                })
                .catch(error => {
                    // If there's an error, just reload the page
                    location.reload();
                    console.error('Error:', error);
                });
        }
        // Close the delete modal
        deleteNewsModal.style.display = "none";
    });


    //accept request
    document.querySelectorAll("#acceptRequest").forEach(button => {
        button.addEventListener("click", function () {
            const requestId = this.getAttribute("data-request-id");
            if (!requestId) return;

            fetch(`/admin/requests/accept-request/${requestId}`, { method: "POST" })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert("✅ Request accepted!");
                        window.location.reload(); // Force page reload
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("⚠️ Server error. Please try again.");
                });
        });
    });

    //reject request
    document.querySelectorAll("#rejectRequest").forEach(button => {
        button.addEventListener("click", function () {
            const requestId = this.getAttribute("data-request-id");
            if (!requestId) return;

            fetch(`/admin/requests/reject-request/${requestId}`, { method: "POST" })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        alert("✅ Request rejected!");
                        window.location.reload(); // Force page reload
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("⚠️ Server error. Please try again.");
                });
        });
    });

    //delete requests funcionality
    let deleterequestsId = null; // Store the ID of the request to be deleted

    document.querySelectorAll('.deleteRequest').forEach(button => {
        button.addEventListener('click', function (event) {
            const requestRow = event.target.closest('tr'); // Get the closest row
            deleterequestsId = requestRow.querySelector('td:nth-child(1)').textContent.trim(); // Get request ID

            // Show the delete modal
            document.getElementById("deleteRequestsModal").style.display = "block";
        });
    });

    // Confirm delete action
    document.getElementById("confirmDeleterequestsBtn")?.addEventListener("click", function () {
        if (deleterequestsId) {
            fetch(`/admin/requests/delete/${deleterequestsId}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload(); // Reload the page after successful deletion
                    } else {
                        alert("⚠️ Error deleting request.");
                        location.reload();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("⚠️ Server error. Please try again.");
                    location.reload();
                });
        }

        // Close the delete modal
        document.getElementById("deleteRequestsModal").style.display = "none";
    });

    // Cancel delete action
    document.getElementById("cancelDeleteRequestsBtn")?.addEventListener("click", function () {
        document.getElementById("deleteRequestsModal").style.display = "none";
    });

    //delete users
    let deleteUserId = null; // Store the ID of the user to be deleted

    document.querySelectorAll('.deleteuserbtn').forEach(button => {
        button.addEventListener('click', function (event) {
            const userRow = event.target.closest('tr'); // Get the closest row to the delete button
            deleteUserId = userRow.querySelector('td:nth-child(1)').textContent.trim(); // Get the user ID
            deleteUserModal.style.display = "block"; // Show the delete modal
        });
    });

    // Confirm delete action
    document.getElementById("confirmDeleteuserBtn")?.addEventListener("click", function () {
        if (deleteUserId) {
            fetch(`/admin/users/delete/${deleteUserId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload(); // Reload page after successful deletion
                    } else {
                        console.error('Error:', data.error);
                        location.reload();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    location.reload();
                });
        }
        // Close the delete modal
        deleteUserModal.style.display = "none";
    });

    // Cancel delete action
    document.getElementById("cancelDeleteuserBtn")?.addEventListener("click", function () {
        document.getElementById("deleteUserModal").style.display = "none";
    });
});



//add dinamically members and reaserch areas 
document.getElementById('addResearchField').addEventListener('click', function () {
    let div = document.createElement('div');
    div.innerHTML = '<input type="text" name="team_research[]" placeholder="Enter research area" required>';
    document.getElementById('researchFields').appendChild(div);
});

document.getElementById('addMember').addEventListener('click', function () {
    let div = document.createElement('div');
    div.innerHTML = '<input type="text" name="team_members[]" placeholder="Enter member ID" required>';
    document.getElementById('teamMembers').appendChild(div);
});



//view team info
document.addEventListener("DOMContentLoaded", function () {
    const teamDetailsModal = document.getElementById("viewTeamdetailsModal");
  
    // Add event listener to each view button
    document.querySelectorAll(".view-team-btn").forEach(button => {
      button.addEventListener("click", function () {
        const teamId = this.getAttribute("data-team-id");
        const teamTitle = this.getAttribute("data-team-title");
        const teamLeader = this.getAttribute("data-team-leader");
        const teamLocation = this.getAttribute("data-team-location");
        const teamFounded = this.getAttribute("data-team-founded");
        const teamDesc = this.getAttribute("data-team-desc");
        const teamField = this.getAttribute("data-team-field");
        const teamImg = this.getAttribute("data-team-img");
  
        console.log("Team Data:", {
          teamId,
          teamTitle,
          teamLeader,
          teamLocation,
          teamFounded,
          teamDesc,
          teamField,
          teamImg
        });
  
        // Populate modal fields with the team details
        document.getElementById("edit_team_id").value = teamId || "Not Available";
        document.getElementById("edit_team_title").value = teamTitle || "Not Available";
        document.getElementById("edit_team_leader").value = teamLeader || "Not Available";
        document.getElementById("edit_team_location").value = teamLocation || "Not Available";
        document.getElementById("edit_team_founded").value = teamFounded.split("T")[0] || "Not Available";
        document.getElementById("edit_team_desc").value = teamDesc || "Not Available";
        document.getElementById("edit_team_field").value = teamField || "Not Available";
  
        // Handle the image
        if (teamImg) {
          // Assuming `teamImg` is the image filename in the database
          document.getElementById("edit_team_img_preview").src = `/uploads/${teamImg}`;
        } else {
          document.getElementById("edit_team_img_preview").src = "default-image.jpg";
        }
  
        // Show the modal
        teamDetailsModal.style.display = "block";
      });
    });
  
    // Close the modal when the close button is clicked
    const closeModalButton = document.getElementById("closeviewmore");
    if (closeModalButton) {
      closeModalButton.addEventListener("click", function () {
        teamDetailsModal.style.display = "none";
      });
    }
  });
  







// Open Member Modal
// Show Members Modal and Fetch Members
document.querySelectorAll('.show-members-btn').forEach(button => {
    button.addEventListener('click', function () {
        const teamId = this.getAttribute('data-team-id');
        currentTeamId = teamId; // Store for reuse
        const membersModal = document.getElementById('MemberTeamModal');
        membersModal.style.display = 'block';

        // Also store in hidden input
        document.getElementById('team_id_hidden').value = teamId;

        // Fetch members
        fetch(`/admin/teams/${teamId}/members`)
            .then(response => response.json())
            .then(data => {
                const teamMembersTableBody = document.getElementById('members-table-body');
                teamMembersTableBody.innerHTML = '';

                if (data.members && data.members.length > 0) {
                    data.members.forEach(member => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${member.user_id}</td>
                            <td>${member.firstname}</td>
                            <td>${member.lastname}</td>
                            <td>
                              ${member.image ? `<img src="/user/image/${member.user_id}" alt="${member.firstname} ${member.lastname}" style="max-width: 50px; height: auto;">` : 'No Image'}
                            </td>
                            <td>
                              <form action="/admin/teams/${teamId}/members/${member.user_id}/delete" method="POST" style="display:inline;">
                                <button type="submit" class="delete-member-btn">Delete</button>
                              </form>
                            </td>
                        `;
                        teamMembersTableBody.appendChild(row);
                    });
                } else {
                    const noMembersRow = document.createElement('tr');
                    noMembersRow.innerHTML = `<td colspan="5">No members available for this team.</td>`;
                    teamMembersTableBody.appendChild(noMembersRow);
                }
            })
            .catch(err => {
                console.error('Error fetching team members:', err);
                alert('Team does not exist or there was an error fetching the members.');
            });
    });
});

// Open Add Member Modal
document.getElementById('addMemberintoteam').addEventListener('click', function () {
    const addMemberModal = document.getElementById('addMemberModal');
    addMemberModal.style.display = 'block';

    if (currentTeamId) {
        document.getElementById('team_id_hidden').value = currentTeamId;
        document.getElementById('addMemberForm').action = `/admin/teams/${currentTeamId}/members`;
    } else {
        alert("Team ID is missing. Please reopen the members modal.");
    }
});


//research areas secrion

// Open Research Areas Modal and Fetch Research Areas
document.querySelectorAll('.show-research-areas-btn').forEach(button => {
    button.addEventListener('click', function () {
        const teamId = this.getAttribute('data-team-id');
        currentTeamId = teamId; // Store for reuse
        const researchAreasModal = document.getElementById('TeamResearchAreasModal');
        researchAreasModal.style.display = 'block';

        // Also store in hidden input
        document.getElementById('team_id_hidden').value = teamId;

        // Fetch research areas
        fetch(`/admin/teams/${teamId}/research-areas`)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('team-research-areas-table-body');
                tableBody.innerHTML = '';

                if (data.research_areas && data.research_areas.length > 0) {
                    data.research_areas.forEach(area => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${area.id}</td>
                            <td>${area.research_area}</td>
                            <td>${area.team_id}</td>
                            <td>
                               <form action="/admin/teams/${teamId}/research-areas/${area.id}/delete" method="POST" style="display:inline;">
                                    <button type="submit" class="delete-research-area-btn">Delete</button>
                                </form>

                            </td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    const noAreasRow = document.createElement('tr');
                    noAreasRow.innerHTML = `<td colspan="4">No research areas available for this team.</td>`;
                    tableBody.appendChild(noAreasRow);
                }
            })
            .catch(err => {
                console.error('Error fetching research areas:', err);
                alert('Team does not exist or there was an error fetching the research areas.');
            });
    });
});

// Open Add Research Area Modal
document.getElementById('addResearchAreaBtn').addEventListener('click', function () {
    const addResearchAreaModal = document.getElementById('addResearchAreaModal');
    addResearchAreaModal.style.display = 'block';

    if (currentTeamId) {
        document.getElementById('team_id_hidden').value = currentTeamId;
        document.getElementById('addResearchAreaForm').action = `/admin/teams/${currentTeamId}/research-areas`;
    } else {
        alert("Team ID is missing. Please reopen the research areas modal.");
    }
});


//delete team


  let selectedTeamId = null;

  // Show modal when delete button is clicked
  document.querySelectorAll('.deleteTeamBtn').forEach(button => {
    button.addEventListener('click', () => {
      selectedTeamId = button.getAttribute('data-team-id');
      document.getElementById('deleteTeamModal').style.display = 'block';
    });
  });

  // Confirm deletion
  document.getElementById('confirmDeleteTeamBtn').addEventListener('click', () => {
    if (selectedTeamId) {
      fetch(`/admin/teams/${selectedTeamId}/delete`, {
        method: 'POST'
      })
        .then(res => {
          if (res.ok) {
            window.location.reload(); // Reload to update table
          } else {
            alert('Failed to delete team.');
          }
        })
        .catch(err => {
          console.error('Error deleting team:', err);
        });
    }
  });

  // Cancel button hides modal
  document.getElementById('cancelDeleteTeamBtn').addEventListener('click', () => {
    document.getElementById('deleteTeamModal').style.display = 'none';
    selectedTeamId = null;
  });

