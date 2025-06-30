"use client";

import React from "react";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import { HeadingNode } from "@lexical/rich-text";
import { CourseBannerNode } from "./nodes/CourseBannerNode";
import ReplacePrintPostPlugin from "./plugins/ReplacePrintPostPlugin/ReplacePrintPostPlugin";

let headingCounter = 0;

function onError(error: any) {
  console.error(error);
}

interface ReadOnlyLexicalEditorProps {
  content: string;
}

class CustomHeadingNode extends HeadingNode {
  static getType() {
    return "custom-heading";
  }

  static clone(node: any) {
    return new CustomHeadingNode(node.__key);
  }

  createDOM(config: any) {
    const dom = super.createDOM(config);
    dom.id = String(headingCounter++);
    return dom;
  }
}

export default function ReadOnlyLexicalEditor({
  content,
}: ReadOnlyLexicalEditorProps) {
  const initialConfig = {
    namespace: "MyEditor",
    onError,
    editable: false,
    nodes: [
      ...PlaygroundNodes,
      CustomHeadingNode,
      CourseBannerNode, // Assuming CourseBannerNode is imported from the correct path
      {
        replace: HeadingNode,
        with: (node: any) => new CustomHeadingNode(node.__key),
      },
    ],
    editorState: content,
    theme: PlaygroundEditorTheme,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Loading content...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ReplacePrintPostPlugin />
    </LexicalComposer>
  );
}
