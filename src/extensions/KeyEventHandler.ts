import { Extension } from '@tiptap/core';

export const KeyEventHandler = (
    enterCount:number,
    increamentCount:() => void, 
    removeLastItem:() => void, 
    increamentRemove:() => void, 
    removeAllFlag:number,
    removeAllBack:() => void
) => {

    return Extension.create({
        name: 'keyEventHandler',

        addKeyboardShortcuts() {
            return {
                // Example: Handle 'Enter' key press to create a new paragraph
                'Enter': () => {
                    // Define behavior when Enter is pressed
                    
                    
                    increamentCount();
                    // Add additional logic if needed, such as modifying document structure
                    return false; // Return true to prevent default behavior
                },
                // Example: Handle 'Backspace' key when content is empty
                'Backspace': ({ editor }) => {
                    const { state } = editor;
                    const { from, empty } = state.selection;
                    removeAllBack();
                    // Implement logic to check if backspace should delete a thread item
                    if (state.doc.textContent === "" || state.doc.textContent === null) {
                        if(state.doc.childCount === 1)
                        {
                            removeLastItem();
                        }
                        // Implement custom behavior if at the start of a block or the block is empty
                        return false; // prevent default backspace behavior
                    }

                    return false; // Allow default backspace behavior otherwise
                },
                // Example: Handle 'Ctrl+A' / 'Cmd+A' to select content
                'Mod-a': ({ editor }) => {
                    // Custom logic for selecting content
                    increamentRemove();
                    return false;  // Prevent default behavior when implemented
                },
            };
        },
    });
}