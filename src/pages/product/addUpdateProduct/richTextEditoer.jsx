import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from "html-to-draftjs";
import { IMG } from "../../../config/constant";
import { nanoid } from "nanoid";

export default class RichTextEditoer extends Component {
  state = {
    editorState: EditorState.createEmpty(), //创建一个空的文本框对象
    detail: nanoid(),
  };

  getDetail = () => {
    const { editorState } = this.state;
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };

  // 别用了函数时组件就忘了类时组件的生命周期函数 该函数可以在接受props的时候调用 当state依赖传入的prop时可以使用该函数
  // 这里的props 是nextProps 而state是preState 而且16.4后发生改变 就是state发生改变时这个生命周期函数仍然会调用
  // 就是以前只有props发生变化时才会调用 因此需要思考可能出现的bug 就是当修改state 发生改变调用该函数 而这函数修改state会导致的循环问题
  // 如果想只在prop更新的时候执行 可以采用如下方法： 将props的值存入state 调用时prop和state并行比较 如果变化了就证明props发生改变 正常执行
  // 如果没变 直接返回null 无事发生
  static getDerivedStateFromProps(props, state) {
    const { detail } = props;
    if (detail !== state.detail) {
      if (detail) {
        const content = htmlToDraft(detail);
        const contentState = ContentState.createFromBlockArray(
          content.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        return { editorState, detail };
      } else {
        return { editorState: EditorState.createEmpty(), detail };
      }
    } else {
      return null;
    }
  }

  uploadImageCallback = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", IMG + "/upload");
      xhr.setRequestHeader("Authorization", "Client-ID XXXXX");
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const {
          data: { url },
        } = JSON.parse(xhr.responseText);
        resolve({ data: { link: url } });
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorStyle={{
          border: "1px solid black",
          minHeight: 200,
          padding: "5px",
        }}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: {
            uploadCallback: this.uploadImageCallback,
            inputAccept: "image/*",
            previewImage: true,
          },
        }}
      />
    );
  }
}
