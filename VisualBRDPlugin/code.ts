// This is the main logic file that runs in Figma's secure sandbox.

// The first thing we do is show our HTML user interface.
// Figma automatically provides the HTML content in the `__html__` variable.
figma.showUI(__html__, { width: 320, height: 200 });

// This listens for any messages sent from our ui.html file.
figma.ui.onmessage = async (msg) => {

  // We only care about messages with the type 'EXPORT_FRAME'.
  if (msg.type === 'EXPORT_FRAME') {
    try {
      // 1. Get the user's current selection on the Figma page.
      const selection = figma.currentPage.selection;

      // 2. Check if the selection is valid.
      if (selection.length !== 1) {
        throw new Error('Please select exactly one frame.');
      }
      const node = selection[0];
      if (node.type !== 'FRAME') {
        throw new Error('The selected item must be a Frame.');
      }

      // 3. Export the selected frame as a high-quality PNG image.
      const imageData: Uint8Array = await node.exportAsync({
        format: 'PNG',
        constraint: { type: 'SCALE', value: 2 }, // 2x resolution
      });

      // 4. If successful, send the image data back to the ui.html file.
      figma.ui.postMessage({
        type: 'EXPORT_RESULT',
        payload: imageData,
      });

    } catch (error: any) {
      // If anything goes wrong, send an error message back to the UI.
      figma.ui.postMessage({
        type: 'ERROR',
        payload: { message: error.message },
      });
    }
  }
};
