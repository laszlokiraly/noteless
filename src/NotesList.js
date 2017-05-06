import React from "react";
import sanitizeHtml from "sanitize-html";

class NotesList extends React.Component {

  handleNoteOnClick(key) {
    this.props.onNoteClicked(key);
  }

  handleDeleteNoteOnClick(key, event) {
    event.stopPropagation();
    this.props.onDeleteNoteClicked(key);
  }

  render() {
    if (this.props.list.length === 0) {
      return (
        <div className="CommentList">
          <div className="ProviderTitle provider"><span>noteless</span></div>
          <div className="empty"><span>&nbsp;</span></div>
        </div>
      );
    } else {
      return (
        <div className="CommentList">
          <ul>
            {/* TODO: use key from item, e.g. client uuid ( + userid or server uuid ? ), also needs a mechanism to deal with duplicate clientIds */}
            {this.props.list.map((item, index) => {
              const updatedTimestampFormatted = item.updatedTimestamp !== undefined ? new Date(item.updatedTimestamp).toLocaleString() : new Date().toLocaleString();
              const createdTimestampFormatted = item.createdTimestamp !== undefined ? new Date(item.createdTimestamp).toLocaleString() : new Date().toLocaleString();
              const sanitizedContent = sanitizeHtml(item.content, {
                allowedTags: [ "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "p", "a", "ul", "ol",
                "nl", "li", "b", "i", "strong", "em", "strike", "code", "hr", "br", "div", "ins", "pre" ]
              });
              return (<li key={item.clientUuid} onClick={this.handleNoteOnClick.bind(this, item.clientUuid)}>
                <span className="key"><b>{item.title}</b> created @{createdTimestampFormatted}, last updated @{updatedTimestampFormatted}</span><br/>
                <span className="value" dangerouslySetInnerHTML={{ __html: sanitizedContent }} /><br/>
                <div style={{ textAlign: "right" }}>
                  <button className="button delete-note" onClick={this.handleDeleteNoteOnClick.bind(this, item.clientUuid)}><span>delete</span></button>
                </div><br/>
                {this.props.list.length > 1 && this.props.list.length - 1 !== index && <hr className="comment-hr"/>}
              </li>);
            })}
          </ul>
        </div>
      );
    }
  }
}

export default NotesList;
