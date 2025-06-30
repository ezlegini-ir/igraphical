"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $getRoot, LexicalNode, ParagraphNode, TextNode } from "lexical";
import { $createCourseBannerNode } from "../../nodes/CourseBannerNode";

export default function ReplacePrintPostPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const root = $getRoot();

      root.getChildren().forEach((node: LexicalNode) => {
        // Check if node is a ParagraphNode
        if (node.getType && node.getType() === "paragraph") {
          const paragraphNode = node as ParagraphNode;
          const children = paragraphNode.getChildren();
          for (const child of children) {
            // Check if child is a TextNode
            if (child.getType && child.getType() === "text") {
              const textNode = child as TextNode;
              const match = textNode
                .getTextContent()
                .match(/\[print_post id="(\d+)"\]/);
              if (match) {
                const courseId = match[1];
                const bannerNode = $createCourseBannerNode(courseId);
                paragraphNode.replace(bannerNode);
              }
            }
          }
        }
      });
    });
  }, [editor]);

  return null;
}
