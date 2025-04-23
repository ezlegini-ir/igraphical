"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export function MySyncValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (value) {
      // Deserialize the stringified value to JSON and get the editor state
      const parsedContent = JSON.parse(value);

      // Only update if the parsed content is different from the current editor state
      editor.update(() => {
        const currentEditorState = editor.getEditorState().toJSON();
        if (
          JSON.stringify(parsedContent) !== JSON.stringify(currentEditorState)
        ) {
          const editorState = editor.parseEditorState(parsedContent);
          editor.setEditorState(editorState);
        }
      });
    }
  }, [value, editor]);

  return null;
}
