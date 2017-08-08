function showform() {
    $('#notesForm').css('display', 'inline-block');
    $("#add").attr("disabled", "disabled");
    $("#add").css('background-color', 'lightgrey');
    $("#makeStickyNote").attr("disabled", "disabled");
    $("#makeStickyNote").css('background-color', 'lightgrey');
    $('#cancel').css('display', 'inline-block');
    clearTextbox();
}

function closeform() {
    $('#notesForm').css('display', 'none');
    $("#add").removeAttr("disabled");
    $("#add").css('background-color', 'cornflowerblue');
    $("#makeStickyNote").removeAttr("disabled");
    $("#makeStickyNote").css('background-color', 'cornflowerblue');
}

function clearTextbox() {
    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
}

function addNote() {
    $('#warning').css('display', 'none');;
    var title = document.getElementById('title').value;
    var description = document.getElementById('description').value;

    if (title === "" || description === "") {
        $('#warning').css('display', 'inline-block');
    } else {
        $('#notesTable').fadeIn(1000);
        $('#notesTable').css('display', 'table');
        var currColor = document.getElementById('colorPicker').value;
        var table = document.getElementById("notesTable");

        //create new table row and update the table data with the title and
        //description from form
        var row = table.insertRow(-1);
        row.style.background = currColor;
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = title;
        cell1.id = "title";
        cell2.innerHTML = description;
        cell2.id = "description";
        cell3.innerHTML = "<input class='deleteButton' type='button' value='X'></input>";
        cell4.innerHTML = "<input class='editButton' type='button' value='Edit'></input>";
        $('#makeStickyNote').css('display', 'inline-block');
        clearTextbox();
        closeform();
    }
}

function createStickyNote() {
    var tableData = $('#notesTable tr');
    $('#notesForm').css('display', 'none');
    $('.stickyNotes li').remove();

    //fetch title and description for each table row and create an
    //unordered list to show them as sticky notes
    $.each(tableData, function(data) {
        if (data > 0) {
            var title = $(this).find('td[id^="title"]')[0].innerHTML;
            var description = $(this).find('td[id^="description"]')[0].innerHTML;
            var currColor = $(this)[0].style.background;
            if (title !== undefined && description !== undefined) {
                createNotes(title, description, currColor);
            }
        }
    })
}

function createNotes(title, description, color) {

    //append the title and description to the list and add the background color
    var header = '<h3 style="word-wrap: break-word;">' + title + '</h3>';
    var footer = '<p style="word-wrap: break-word;">' + description + '</p>';
    $('.stickyNotes').append('<li style = "background: ' + color + '">' + header + footer + '</li>');
}

function convertRGBtoHex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    var hex = (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    return hex;
}

function updateform(row) {
    var noteForm = $("#notesForm").clone();
    showform();
    $('#cancel').css('display', 'none');
    var noteColor = row[0].style.background;

    //find the current value for title and description
    var title = noteForm.find(("#title"));
    var desc = noteForm.find(("#description"));

    var currTitle = $(row.children().get(0)).text(),
        currDesc = $(row.children().get(1)).text();

    //set the form title and description with the current value
    //from the table
    $('#notesForm').find('input[id="title"]')[0].value = currTitle;
    $('#notesForm').find('textarea[id="description"]')[0].value = currDesc;
    $('#notesForm').find('input[id="colorPicker"]')[0].value = convertRGBtoHex(noteColor);
    row.remove();

}

$(document).ready(function() {

    $('#notesTable').css('display', 'none');
    $('#makeStickyNote').css('display', 'none');

    $("#notesTable").on('click', '.deleteButton', function() {
        $(this).parent().parent().remove();

        //delete the notes table and stickynotes if you delete the only
        //row in the table
        var count = $('#notesTable tr td').length;
        if (count === 0) {
            $('#notesTable').css('display', 'none');
            $('.stickyNotes li').remove();
            $('#makeStickyNote').css('display', 'none');
        }
    });

    $("#notesTable").on('click', '.editButton', function() {
        updateform($(this).parents('tr'));
    });
});