import React, { Component } from "react";
import "./App.css";
import GoogleUtil from "./GoogleUtil";
import AwsUtil from "./AwsUtil";
import APPCONFIG from "./config.json";
import GoogleLogin from "react-google-login";
import RichEditorExample from "./RichEditorExample";
import NotesList from "./NotesList";
import NotesApiFactory from "./NotesApiFactory";
import ConsoleLogger from "./ConsoleLogger";
import ModalAlert from "./ModalAlert";
import guid from "./helper";
import update from "immutability-helper";
import NotesTab from "./NotesTab";
import AlertContainer from "react-alert";

class App extends Component {
  constructor(props) {
    super(props);
    this.resetState = this.resetState.bind(this);
    this.handleResponseGoogle = this.handleResponseGoogle.bind(this);
    this.handleResponseGoogleFailure = this.handleResponseGoogleFailure.bind(this);
    this.handleSignoutFromGoogle = this.handleSignoutFromGoogle.bind(this);
    this.handleTitleChanged = this.handleTitleChanged.bind(this);
    this.handleAddNote = this.handleAddNote.bind(this);

    this.updateNoteInNotes = this.updateNoteInNotes.bind(this);
    this.findNote = this.findNote.bind(this);

    this.createAndInsertNewNote = this.createAndInsertNewNote.bind(this);

    this.postNote = this.postNote.bind(this);

    this.handleNoteClicked = this.handleNoteClicked.bind(this);
    this.handleDeleteNoteClicked = this.handleDeleteNoteClicked.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.notesApi = NotesApiFactory.create(APPCONFIG.PROVIDERS[0]);

    this.setSelectedNote = this.setSelectedNote.bind(this);
  }

  alertOptions = {
    offset: 14,
    position: "bottom right",
    theme: "light",
    time: 3000,
    transition: "fade"
  }

  alertNoteSaved(title) {
    if (!title || title === "") {
      title = "newly created note";
    }
    this.msg.show(`${title} saved`, {
      time: 3000,
      type: "success"
    });
  }

  alertNoteDeleted(title) {
    if (!title || title === "") {
      title = "note without title";
    }
    this.msg.show(`${title} deleted`, {
      time: 3000,
      type: "success"
    });
  }

  componentWillMount() {
    this.resetState();
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalFun);
  }

  // http://blog.sodhanalibrary.com/2016/07/detect-ctrl-c-and-ctrl-v-and-ctrl-s.html
  handleKeyDown(event) {
    const charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey && charCode === "s") || (event.metaKey && charCode === "s")) {
      event.preventDefault();
      this.editorComp.syncContent(true);
    }
  }

  handleTitleChanged(event) {
    const selectedNote = update(this.selectedNote,
      { title: { $set: this.inputTitle.value } }
    );

    this.setState({
      notes: this.updateNoteInNotes(selectedNote)
    });

    this.setSelectedNote(selectedNote);

    this.editorComp.syncContent(true);
  }

  findNote(clientUuid) {
    if (clientUuid === undefined) {
      return null;
    }
    for (const note of this.state.notes) {
      if (note.clientUuid === clientUuid) {
        return note;
      }
    }
    return null;
  }

  updateNoteInNotes(someNote) {
    return this.state.notes.map((note) => {
      if (note.clientUuid === someNote.clientUuid) {
        return someNote;
      } else {
        return note;
      }
    });
  }

  deleteNoteFromNotes(someNote) {
    const notes = this.state.notes.filter((note) => {
      if (note.clientUuid === someNote.clientUuid) {
        return false;
      } else {
        return true;
      }
    });
    // set new selectedNote
    if (this.selectedNote.clientUuid === someNote.clientUuid) {
      if (notes.length > 0) {
        this.selectedNote = notes[0];
        this.editorComp.setContent(this.selectedNote.content);
      } else {
        this.selectedNote = this.createAndInsertNewNote("");
        this.editorComp.setContent("");
        notes.unshift(this.selectedNote);
      }
    }
    this.setState({ notes });
  }

  updateSelectedNote(noteToAdd, noteToRemove) {
    const notes = this.state.notes.filter((note) => {
      if (note.clientUuid === noteToRemove.clientUuid ||
        note.clientUuid === noteToAdd.clientUuid) {
        return false;
      } else {
        return true;
      }
    });
    notes.unshift(noteToAdd);
    this.setState({ notes });
  }

  removeNoteFromNotes(someNote) {
    const notes = this.state.notes.filter((note) => {
      if (note.clientUuid === someNote.clientUuid) {
        return false;
      } else {
        return true;
      }
    });
    this.setState({ notes });
  }

  postNote(content) {

    this.selectedNote = update(this.selectedNote, { content: { $set: content } });

    const selectedNote = this.selectedNote;

    this.notesApi.post(selectedNote).then((response) => {
      if (this.state.loggedIn === false) {
        return;
      }
      this.alertNoteSaved(selectedNote.title);
      const responseNote = response.data.body;
      this.correct(responseNote);
      if (this.selectedNote.clientUuid === responseNote.clientUuid) {
        this.setSelectedNote(responseNote);
      }
      const note = this.findNote(responseNote.clientUuid);
      if (note !== null) {
        const updatedNote = { ...responseNote, content: note.content };
        this.setState({ notes: this.updateNoteInNotes(updatedNote) });
      }
    }).catch((error) => {
      if (error.status === 403) {
        ModalAlert.alert("Please login first");
      }
      ModalAlert.alert("Send failed. Please try again later.");
      ConsoleLogger.error(`${error}`);
    });
  }

  createAndInsertNewNote(content) {
    const newNote = {
      content,
      title: "",
      clientUuid: guid()
    };
    this.inputTitle.value = "";
    this.setState({
      notes: update(this.state.notes, { $unshift: [newNote] })
    });
    return newNote;
  }

  handleAddNote(event) {
    const oldSelectedNote = { ...this.selectedNote, content: this.editorComp.getContent() };
    this.postNote(oldSelectedNote.content);
    this.editorComp.setContent("");
    const newNote = this.createAndInsertNewNote("");
    this.setSelectedNote(newNote);
    this.postNote("");
    this.setState({ notes: [oldSelectedNote, ...this.state.notes] });
    event.stopPropagation();
  }

  handleSignoutFromGoogle() {
    this.editorComp.syncContent();
    GoogleUtil.signout().then(() => {
      this.resetState();
      AwsUtil.resetAWSLogin();
    });
  }

  handleResponseGoogleFailure(error) {
    ConsoleLogger.error(`${error}`);
  }

  correct(note) {
    if (note.title === undefined) {
      note.title = "";
    }
    if (note.content === undefined) {
      note.content = "";
    }
  }

  handleResponseGoogle(authResult) {
    const result = GoogleUtil.handleResponse(authResult);
    if (result === undefined || result === false) {
      this.resetState();
      ModalAlert.alert("Login was not successful");
    } else {
      AwsUtil.bindOpenId(result.idToken).then(() => {
        this.notesApi.getAll().then((notes) => {
          notes.map((note) => {
            return this.correct(note);
          });
          this.setState({ notes, loggedIn: true });
          if (notes.length > 0) {
            this.setSelectedNote(notes[0]);
            this.editorComp.setContent(notes[0].content);
          } else {
            this.selectedNote = this.createAndInsertNewNote("");
            this.editorComp.setContent("");
          }
          this.removeNoteFromNotes(this.selectedNote);
          this.setState({
            intervalFun: setInterval(this.editorComp.syncContent,
              APPCONFIG.NOTELESS.AUTOSAVE_INTERVAL_IN_SECONDS * 1000)
          });
        });
      }).catch((error) => {
        ConsoleLogger.dir(error);
        ModalAlert.alert("Something went wrong while binding open id to aws credentials!");
      });
    }
  }

  resetState() {
    this.setState({
      loggedIn: false,
      notes: []
    });
    if (this.editorComp) {
      this.editorComp.resetContent();
      clearInterval(this.state.intervalFun);
    }
    if (this.state && this.state.intervalFun !== undefined) {
      clearInterval(this.state.intervalFun);
    }
    this.selectedNote = null;
  }

  setSelectedNote(selectedNote) {
    this.selectedNote = selectedNote;
    if (this.inputTitle !== undefined && this.inputTitle !== null) {
      this.inputTitle.value = this.selectedNote.title;
    }
  }

  handleNoteClicked(key) {
    ConsoleLogger.log(`note ${key} was clicked`);
    this.editorComp.syncContent();
    const oldSelectedNote = this.selectedNote;
    const newSelectedNote = this.findNote(key);
    this.editorComp.setContent(newSelectedNote.content);
    this.setSelectedNote(newSelectedNote);
    this.updateSelectedNote(oldSelectedNote, newSelectedNote);
  }

  handleDeleteNoteClicked(key) {
    ConsoleLogger.log(`note ${key} was clicked for deletion`);
    // delete function
    const noteToDelete = this.findNote(key);
    this.notesApi.delete(noteToDelete).then(() => {
      if (this.state.loggedIn === false) {
        return;
      }
      this.alertNoteDeleted(noteToDelete.title);
      this.deleteNoteFromNotes(noteToDelete);
    }).catch((error) => {
      ModalAlert.alert("Delete failed. Please try again later.");
      ConsoleLogger.error(`${error}`);
    });
  }

  render() {
    return (
      <div className="App" onKeyDown={this.handleKeyDown}>

        <div style={{ clear: "both" }}>
          {this.state.loggedIn ?
            <div className="add-note">
              <button className="button" onClick={this.handleAddNote}>
                <span>add</span>
              </button>
            </div>
            : ""
          }
          {this.state.loggedIn ?
            <AlertContainer ref={(ref) => { this.msg = ref; }} {...this.alertOptions} /> : ""
          }
          {this.state.loggedIn ?
            <NotesTab list={this.state.notes} onTabClicked={this.handleNoteClicked}/> : ""
          }
          <div className="login-out">
            {!this.state.loggedIn
              ? <GoogleLogin
                className="login-button"
                clientId={APPCONFIG.OAUTH.GOOGLE.APP_KEY}
                buttonText="Login"
                onSuccess={this.handleResponseGoogle}
                onFailure={this.handleResponseGoogleFailure}
                offline={false}
                autoLoad={false}
                scope="email"
                >
                <span>Login with Google</span>
                </GoogleLogin>
              : <button className="button logout-button" onClick={this.handleSignoutFromGoogle}>
                  <span>Logout</span>
                </button>
            }
          </div>
        </div>
        {this.state.loggedIn
          ? <div style={{ clear: "both" }}>
              <div className="note-title"><input type="text" placeholder="Enter Title..." ref={ (input) => { this.inputTitle = input; } } onBlur={this.handleTitleChanged}/></div>
              <RichEditorExample
                ref={(editorComp) => { this.editorComp = editorComp; }}
                publishContent={this.postNote}
              />
            </div>
          : ""}
        <div style={{ clear: "both" }}>
          <div className="CommentListColumn-1">
            <NotesList list={this.state.notes} onNoteClicked={this.handleNoteClicked} onDeleteNoteClicked={ this.handleDeleteNoteClicked }/>
          </div>
        </div>
    </div>
    );
  }
}

export default App;
