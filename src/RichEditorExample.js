import InlineStyleControls from "./InlineStyleControls";
import BlockStyleControls from "./BlockStyleControls";
import React from "react";
import Draft from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import "./RichEditorExample.css";

const { Editor, EditorState, RichUtils, ContentState } = Draft;

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    fontFamily: "'Inconsolata', 'Menlo', 'Consolas', monospace",
    fontSize: 12,
    padding: 1
  }
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}

class RichEditorExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => {
      this.dirty = true;
      this.setState({ editorState });
    };

    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.onTab = (e) => this._onTab(e);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.handleSubmit = () => this._handleSubmit();
    this.resetContent = this.resetContent.bind(this);
    this.syncContent = this.syncContent.bind(this);
    this.setContent = this.setContent.bind(this);
    this.getContent = this.getContent.bind(this);
    this.dirty = false;
  }

  _handleKeyCommand(command) {
    const { editorState } = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _onTab(e) {
    const maxDepth = 4;
    this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
  }

  _handleSubmit() {
    if (this.state.editorState.getCurrentContent().hasText()) {
      const htmlContent = stateToHTML(this.state.editorState.getCurrentContent());
      this.props.publishContent(htmlContent);
    }
  }

  syncContent(force) {
    if ((this.dirty && this.state.editorState.getCurrentContent().hasText())
      || force) {
      const htmlContent = stateToHTML(this.state.editorState.getCurrentContent());
      this.props.publishContent(htmlContent);
      this.dirty = false;
    }
  }

  getContent() {
    return stateToHTML(this.state.editorState.getCurrentContent());
  }

  resetContent() {
    const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(""));
    this.setState({ editorState });
  }

  setContent(content) {
    const editorState = EditorState.push(this.state.editorState, stateFromHTML(content));
    this.setState({ editorState });
  }

  render() {
    const { editorState } = this.state;

    let className = "RichEditor-editor";
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== "unstyled") {
        className += " RichEditor-hidePlaceholder";
      }
    }

    return (
      <div className="RichEditor-root">
        <BlockStyleControls editorState={ editorState } onToggle={this.toggleBlockType}/>
        <InlineStyleControls
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            onTab={this.onTab}
            ref="editor"
            spellCheck={true}
          />
        </div>
        {/* <input
          type="button"
          value="Submit"
          onClick={this.handleSubmit}
          disabled={!this.props.submitEnabled}
        /> */}
        {/* <input
          type="button"
          value="Reset"
          onClick={this.resetContent}
          disabled={!contentState.hasText()}
        /> */}
      </div>
    );
  }
}

export default RichEditorExample;
