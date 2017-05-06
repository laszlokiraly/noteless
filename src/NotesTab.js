import React from "react";

export default class NotesTab extends React.Component {

  handleNoteOnClick(key, event) {
    event.stopPropagation();
    this.props.onTabClicked(key);
  }

  render() {
    return (
      <div className="notes-tabs">
        {this.props.list.map((item, index) => {
          return (
            <button className="button note-tab" key={item.clientUuid}
              onClick={this.handleNoteOnClick.bind(this, item.clientUuid)}
            >
              { item.title }
            </button>
          );
        })}
      </div>
    );
  }

}
