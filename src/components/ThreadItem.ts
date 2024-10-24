import { Node } from '@tiptap/core'
import { mergeAttributes } from '@tiptap/core'
export interface ThreadItemOptions {
  HTMLAttributes: Record<string, any>
}
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    threadItem: {
      setThreadItem: () => ReturnType
      splitThreadItem: () => ReturnType
      insertThreadItem: () => ReturnType
    }
  }
}
export const ThreadItem = Node.create<ThreadItemOptions>({
  name: 'threadItem',
  content: 'block+',
  group: 'block',
  defining: true,
  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="thread-item"]',
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'thread-item' }), 0]
  },
  addCommands() {
    return {
      setThreadItem:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name)
        },
      splitThreadItem:
        () =>
        ({ commands }) => {
          return commands.splitBlock()
        },
    }
  },
})