$(function(){

    var model = {
        init: function() {
            // init function defines the local Storage object
            if (!localStorage.notes) {
                // create a sting in the local storage object
                localStorage.notes = JSON.stringify([]);
            }
        },
        add: function(obj) {
            //define a JSON object from the local storage string.
            var data = JSON.parse(localStorage.notes);
            //add the new note to the object
            data.push(obj);
            // Make a string again. Webservers only can accept strings, so I need this in the future.
            localStorage.notes = JSON.stringify(data);
        },
        // get a JSON object back.
        getAllNotes: function() {
            return JSON.parse(localStorage.notes);
        }
    };


    var octopus = {
        addNewNote: function(noteStr) {
            model.add({
                content: noteStr,
                date: Date(Date.now()).toString()
            });
            view.render();
        },

        getNotes: function() {
            return model.getAllNotes();
        },

        init: function() {
            model.init();
            view.init();
        }
    };


    var view = {
        init: function() {
            // get existing entries from notes
            this.noteList = $('#notes');
            // get whats in the form
            var newNoteForm = $('#new-note-form');
            var newNoteContent = $('#new-note-content');
            // once you press submit do the function. Submit without a submit button by pressing "Enter"
            newNoteForm.submit(function(e){
                // execute the addNewNote function which adds the value of the form
                octopus.addNewNote(newNoteContent.val());
                // set var to empty again
                newNoteContent.val('');
                // This prevents the default behavior of the form.
                e.preventDefault();
            });
            // Call the render function
            view.render();
        },
        render: function(){
            var htmlStr = '';
            // get the functions back from the model via the octopus
            octopus.getNotes().forEach(function(note){
                htmlStr += '<li class="note">'+
                        note.content + '  ' + note.date
                    '</li>';
            });
            // assigne the html to the noteList = #notes
            this.noteList.html( htmlStr );
        }
    };

    octopus.init();
});