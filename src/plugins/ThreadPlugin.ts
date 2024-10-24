import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

export const SplitBehavior = (resetCount:()=>void, resetRemove:()=>void) => {
  return Extension.create({
    name: 'splitBehavior',

    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('splitBehavior'),
          appendTransaction(transactions, oldState, newState) {
            const tr = newState.tr
            let modified = false
            newState.doc.descendants((node, pos) => {
              if (node.type.name === 'threadItem') {
                const paragraphs: any[] = []
                node.forEach(child => {
                  if (child.type.name === 'paragraph') {
                    paragraphs.push(child)
                  }
                })
                if (paragraphs.length > 1) {
                  // Split into new thread item
                  const newThreadItem = newState.schema.nodes.threadItem.create(
                    null,
                    paragraphs.slice(1)
                  )
                  tr.insert(pos + node.nodeSize, newThreadItem)
                  modified = true
                }
              }
            })
            return modified ? tr : null
          },
          props: {
            handleKeyDown(view, event) {
              if (event.key !== 'Enter') {
                resetCount();
              }
              if(!(event.key === 'a' && event.ctrlKey) && !(event.key === 'Backspace') )
                resetRemove();
              return false
            },
          },
        }),
      ];
    },
  });
}
