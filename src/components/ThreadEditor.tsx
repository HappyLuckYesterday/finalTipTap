import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image';
import { ThreadItem } from './ThreadItem'
import { SplitBehavior } from '../plugins/ThreadPlugin'
import { Fragment } from 'prosemirror-model';
import '../styles//ThreadEditor.css'
import { KeyEventHandler } from '../extensions/KeyEventHandler'

interface ThreadEditorProps {
  avatar: string
  displayName: string
  username: string
}

export const ThreadEditor: React.FC<ThreadEditorProps> = ({
  avatar,
  displayName,
  username,
}) => {

  const [threadItems, setThreadItems] = useState<string[]>([]);
  const [enterCount, setEnterCount] = useState<number>(0);
  const [removeFlag, setRemoveFlag] = useState<boolean>(false);
  const [removeAllFlag, setRemoveAllFlag] = useState<number>(0);
  const [removeAllBack, setRemoveAllBack] = useState<boolean>(false);

  useEffect(() => {
    if (enterCount == 2) {  
      const splitindex = editor?.getHTML().indexOf("<p></p><p></p>");
      const  prevHTML = editor?.getHTML().slice(0, splitindex!+7)!.replaceAll("<p></p><p></p>","<p>&nbsp;</p>")!.replaceAll("<p></p>","<p>&nbsp;</p>")!;
      const lastHTML = editor?.getHTML().slice(splitindex!+14)!.replaceAll("<p></p><p></p>","<p>&nbsp;</p>")!.replaceAll("<p></p>","<p>&nbsp;</p>")!;
      // setThreadItems([...threadItems, editor?.getHTML()!.replaceAll("<p></p><p></p>","<p>&nbsp;</p>")!.replaceAll("<p></p>","<p>&nbsp;</p>")!]);
      setThreadItems([...threadItems, prevHTML!]);
      console.log();
      // editor?.commands.setThreadItem();
      editor?.commands.setContent(lastHTML!)
      setEnterCount(0);
    }
  }, [enterCount])

  useEffect(() => {
    if (removeAllFlag == 2) {
      const elements = document.querySelector('body');
      const selection = window.getSelection();
      selection?.removeAllRanges();
      const range = document.createRange();

      range.selectNodeContents(elements!);
      selection?.addRange(range);
    }
  }, [removeAllFlag])

  const removeItem = () => {
    setRemoveFlag(true);
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      SplitBehavior(() => { setEnterCount(0) }, () => { setRemoveAllFlag(0) }),
      ThreadItem,
      KeyEventHandler(enterCount,
         () => { setEnterCount(prev => prev + 1) }, 
         removeItem, 
         () => { setRemoveAllFlag(prev => prev + 1) }, 
         removeAllFlag,
        () => {setRemoveAllBack(true)}
        )
    ],
    content: {
      type: 'doc',
      content: []
    },
    autofocus: true,
  });

  useEffect(() => {
    if (removeFlag) {
      setThreadItems([...threadItems.slice(0, -1)]);
      setTimeout(() => {editor?.commands.setContent(threadItems.slice(-1)[0])}, 0);
      setRemoveFlag(false);
    }
  }, [removeFlag])

  useEffect(() =>{
    if(removeAllBack && removeAllFlag>=2)
    {
      setThreadItems([]);
      setTimeout(() => {editor?.commands.setContent('')}, 0);
    }
    
    setRemoveAllBack(false)
  },[removeAllBack, removeAllFlag])

  if (!editor) return null;
  return (
    <div className="thread-editor">
      {
        threadItems.map((item, index) => (
          <div className="thread-header" key={"ThreadItem" + index}>
            <div className='avatarPanel'>
              <img src={avatar} alt="avatar" className="avatar" />
              <div className='crossLine'>&nbsp;</div>
            </div>
            <div>
              <div className="user-info">
                <span className="display-name">{displayName}</span>
                <span className="username">@{username}</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: item }} className='contentPanel' />
            </div>
          </div>
        ))
      }
      <div className="thread-header">
        <div>
          <img src={avatar} alt="avatar" className="avatar" />

        </div>
        <div>
          <div className="user-info">
            <span className="display-name">{displayName}</span>
            <span className="username">@{username}</span>
          </div>

          <EditorContent editor={editor} className='cEditor' />
        </div>
      </div>
    </div>
  );
}