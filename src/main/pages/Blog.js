import React from 'react';
import { EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import { Editor } from 'react-draft-wysiwyg';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Blog = () => {
    const [editorState, setEditorState] = React.useState(() =>
      EditorState.createEmpty()
    );
    const handleImageUpload = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };
  
    const editor = React.useRef(null);
    function focusEditor() {
      editor.current.focus();
    }
  
    return (
        <>

      <div
        style={{ border: "1px solid black", minHeight: "6em", cursor: "text" }}
        // onClick={focusEditor} 
        >
        <Editor
          ref={editor}
          editorState={editorState}
          onEditorStateChange={setEditorState}
          editorClassName="editor-class"
          toolbar={{
            image: {
              uploadCallback: handleImageUpload,
              alt: { present: true, mandatory: true },
            },
          }}
        //   onChange={setEditorState}
          placeholder="Write something!"/>
      </div>


                         {/* <Editor
                            editorState={editorState}
                            onEditorStateChange={setEditorState}
                            editorClassName="editor-class"
                          /> */}


                 {/* <Editor editorState={editorState} onChange={setEditorState} /> */}

            
        </>
    );
};

export default Blog;