// This file runs in Figma's secure environment.

figma.showUI(__html__, { width: 320, height: 280 }); // A little taller for the new input

figma.ui.onmessage = async (msg) => {
  // --- Token Management ---
  if (msg.type === 'SAVE_TOKEN') {
    // Use Figma's secure, persistent storage for the token.
    await figma.clientStorage.setAsync('apiToken', msg.payload);
  } else if (msg.type === 'GET_TOKEN') {
    // Retrieve the token when the UI loads.
    const token = await figma.clientStorage.getAsync('apiToken');
    figma.ui.postMessage({ type: 'TOKEN_LOADED', payload: token });
  }
  
  // --- Frame Export Logic (remains the same) ---
  else if (msg.type === 'EXPORT_FRAME') {
    try {
      const selection = figma.currentPage.selection;
      if (selection.length !== 1 || selection[0].type !== 'FRAME') {
        throw new Error('Please select exactly one frame.');
      }
      const node = selection[0];
      const imageData = await node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 2 } });
      figma.ui.postMessage({ type: 'EXPORT_RESULT', payload: imageData });
    } catch (error: any) {
      figma.ui.postMessage({ type: 'ERROR', payload: { message: error.message } });
    }
  }
};

